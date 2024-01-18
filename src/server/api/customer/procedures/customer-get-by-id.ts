import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { customersTable } from "~/server/db/db-schema";

export const customerGetById = protectedProcedure
  .input(z.object({ id: z.number(), organizationId: z.number() }))
  .query(async ({ ctx, input }) => {
    const [foundCustomer] = await withOrganizationAccess(
      ctx.db
        .select({
          ...getTableColumns(customersTable),
        })
        .from(customersTable)
        .limit(1)
        .$dynamic(),
      {
        column: customersTable.organizationId,
        userId: ctx.session.user.userId,
      },
    ).where(and(eq(customersTable.id, input.id)));

    if (!foundCustomer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: $t("customer.err.notFound"),
      });
    }

    return foundCustomer;
  });
