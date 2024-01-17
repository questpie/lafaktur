import { TRPCError } from "@trpc/server";
import { $t } from "~/i18n/dummy";
import { getOrganization } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import {
  customersTable,
  insertCustomerSchema,
  organizationsTable,
} from "~/server/db/db-schema";

export const customerCreate = protectedProcedure
  .input(insertCustomerSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [organization] = await getOrganization(
        trx
          .select({
            id: organizationsTable.id,
          })
          .from(organizationsTable)
          .$dynamic(),
        { userId: ctx.session.user.id, organizationId: input.organizationId },
      );

      if (!organization) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: $t("common.err.invalidOrganization"),
        });
      }

      const [newCustomer] = await trx
        .insert(customersTable)
        .values({
          ...input,
        })
        .returning({ id: customersTable.id });

      if (!newCustomer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: $t("customer.err.createFailed"),
        });
      }

      return {
        id: newCustomer.id,
      };
    });
  });
