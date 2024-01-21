import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { customersTable, invoicesTable } from "~/server/db/db-schema";
import { withPagination } from "~/server/db/helper-queries";

export const invoiceGetAllByCustomerId = protectedProcedure
  .input(
    z.object({
      id: z.number(),
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
          .select({ ...getTableColumns(invoicesTable) })
          .from(invoicesTable)
          .leftJoin(
            customersTable,
            eq(customersTable.id, invoicesTable.customerId),
          )
          .$dynamic(),
        {
          column: invoicesTable.organizationId,
          userId: ctx.session.user.userId,
          organizationId: input.organizationId,
        },
      ).where(and(eq(customersTable.id, input.id))),
      input,
    );

    return {
      data,
      nextCursor:
        data.length >= input.limit ? input.cursor + input.limit : undefined,
    };
  });
