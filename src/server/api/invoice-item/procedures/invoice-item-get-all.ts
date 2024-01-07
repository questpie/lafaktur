import { eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { withPagination } from "~/server/db/helper-queries";
import { invoicesItemsTable, invoicesTable } from "~/server/db/schema";

export const invoiceItemsGetAll = protectedProcedure
  .input(
    z.object({
      organizationId: z.number(),
      invoiceId: z.number().optional(),
      cursor: z.number().default(0),
      limit: z.number().min(1).max(100).default(10),
    }),
  )
  .query(async ({ ctx, input }) => {
    // search for invoiceTemplate by id that has relation to organization
    let query = withOrganizationAccess(
      ctx.db
        .select({
          ...getTableColumns(invoicesItemsTable),
        })
        .from(invoicesItemsTable)
        .innerJoin(
          invoicesTable,
          eq(invoicesTable.id, invoicesItemsTable.invoiceId),
        )
        .$dynamic(),
      {
        column: invoicesTable.organizationId,
        userId: ctx.session.user.id,
        organizationId: input.organizationId,
      },
    );

    if (input.invoiceId) {
      query = query.where(eq(invoicesItemsTable.invoiceId, input.invoiceId));
    }

    const data = await withPagination(query, input);

    return {
      data,
      nextCursor:
        data.length >= input.limit ? input.cursor + input.limit : undefined,
    };
  });
