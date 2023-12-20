import { getTableColumns, sql } from "drizzle-orm";
import { z } from "zod";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { withPagination } from "~/server/db/helper-queries";
import { invoiceTemplatesTable } from "~/server/db/schema";

export const invoiceTemplateGetAll = protectedProcedure
  .input(
    z.object({
      organizationId: z.number(),
      cursor: z.number().default(0),
      limit: z.number().min(1).max(100).default(10),
      filter: z
        .object({
          name: z.string().optional(),
        })
        .default({}),
    }),
  )
  .query(async ({ ctx, input }) => {
    // search for invoiceTemplate by id that has relation to organization
    const qb = ctx.db
      .select({
        ...getTableColumns(invoiceTemplatesTable),
      })
      .from(invoiceTemplatesTable)
      .where(
        input.filter.name
          ? sql`replace(lower(${
              invoiceTemplatesTable.name
            }), ' ', '') like ${`%${input.filter.name
              .toLowerCase()
              .replace(" ", "")}%`}`
          : undefined,
      )
      .$dynamic();

    const data = await withPagination(
      withOrganizationAccess(qb, {
        column: invoiceTemplatesTable.organizationId,
        userId: ctx.session.user.id,
        organizationId: input.organizationId,
      }),
      input,
    );

    return {
      data,
      nextCursor:
        data.length >= input.limit ? input.cursor + input.limit : undefined,
    };
  });
