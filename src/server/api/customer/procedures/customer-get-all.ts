import { getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { withPagination } from "~/server/db/helper-queries";
import { customersTable } from "~/server/db/schema";

export const customerGetAll = protectedProcedure
  .input(
    z.object({
      search: z.string().optional(),
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
            ...getTableColumns(customersTable),
          })
          .from(customersTable)
          .$dynamic(),
        {
          column: customersTable.organizationId,
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
