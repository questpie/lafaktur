import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { customersTable } from "~/server/db/db-schema";

export const customerDeleteById = protectedProcedure
  .input(z.object({ id: z.number(), organizationId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [foundCustomer] = await withOrganizationAccess(
        trx
          .select({
            id: customersTable.id,
          })
          .from(customersTable)
          .$dynamic(),
        {
          column: customersTable.organizationId,
          userId: ctx.session.user.userId,
          organizationId: input.organizationId,
          role: "editor",
        },
      )
        .where(and(eq(customersTable.id, input.id)))
        .limit(1);

      if (!foundCustomer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: $t("customer.err.notFound"),
        });
      }

      /** delete customer */
      await trx
        .delete(customersTable)
        .where(eq(customersTable.id, foundCustomer.id));

      return { id: foundCustomer.id };
    });
  });
