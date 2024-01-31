import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { $t } from "~/i18n/dummy";
import {
  getOrganization,
  withOrganizationAccess,
} from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { customersTable, organizationsTable } from "~/server/db/db-schema";
import { editCustomerSchema } from "~/shared/customer/customer-schema";

export const customerEdit = protectedProcedure
  .input(editCustomerSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [organization] = await getOrganization(
        trx
          .select({
            id: organizationsTable.id,
          })
          .from(organizationsTable)
          .$dynamic(),
        {
          userId: ctx.session.user.userId,
          organizationId: input.organizationId,
        },
      );

      if (!organization) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: $t("common.err.invalidOrganization"),
        });
      }

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
          organizationId: input.organizationId,
        },
      ).where(and(eq(customersTable.id, input.id)));

      if (!foundCustomer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: $t("customer.err.notFound"),
        });
      }

      const [updatedUser] = await trx
        .update(customersTable)
        .set({
          ...input,
        })
        .where(eq(customersTable.id, input.id))
        .returning();

      return updatedUser;
    });
  });
