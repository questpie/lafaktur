import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { invoicesItemsTable, invoicesTable } from "~/server/db/db-schema";

export const invoiceDeleteById = protectedProcedure
  .input(z.object({ id: z.number(), organizationId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [foundInvoice] = await withOrganizationAccess(
        trx
          .select({
            id: invoicesTable.id,
          })
          .from(invoicesTable)
          .$dynamic(),
        {
          column: invoicesTable.organizationId,
          userId: ctx.session.user.userId,
          organizationId: input.organizationId,
          role: "editor",
        },
      )
        .where(and(eq(invoicesTable.id, input.id)))
        .limit(1);

      if (!foundInvoice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: $t("invoice.err.notFound"),
        });
      }

      /** delete invoice */
      await trx
        .delete(invoicesTable)
        .where(eq(invoicesTable.id, foundInvoice.id));

      /** delete invoice items */
      await trx
        .delete(invoicesItemsTable)
        .where(eq(invoicesItemsTable.invoiceId, foundInvoice.id));

      return { id: foundInvoice.id };
    });
  });
