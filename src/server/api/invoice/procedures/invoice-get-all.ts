import { getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { withPagination } from "~/server/db/helper-queries";
import { invoicesTable } from "~/server/db/schema";

export const invoiceGetAll = protectedProcedure
  .input(
    z.object({
      organizationId: z.number(),
      cursor: z.number().default(0),
      limit: z.number().min(1).max(100).default(10),
    }),
  )
  .query(async ({ ctx, input }) => {
    // search for invoiceTemplate by id that has relation to organization
    const data = await withPagination(
      withOrganizationAccess(
        ctx.db
          .select({
            ...getTableColumns(invoicesTable),
          })
          .from(invoicesTable)
          .$dynamic(),
        {
          column: invoicesTable.organizationId,
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
        },
      ),
      input,
    );

    return {
      data,
      nextCursor:
        data.length >= input.limit ? input.cursor + input.limit : undefined,
    };
  });
