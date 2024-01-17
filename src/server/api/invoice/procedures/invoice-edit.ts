import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { invoicesItemsTable, invoicesTable } from "~/server/db/db-schema";
import { editInvoiceSchema } from "~/shared/invoice/invoice-schema";

export const invoiceEdit = protectedProcedure
  .input(editInvoiceSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [invoice] = await withOrganizationAccess(
        trx
          .select({
            number: invoicesTable.number,
          })
          .from(invoicesTable)
          .$dynamic(),
        {
          column: invoicesTable.organizationId,
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
        },
      ).where(eq(invoicesTable.id, input.id));

      if (!invoice) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: $t("invoice.err.invoiceNotFound"),
        });
      }

      const { invoiceItems, ...invoiceData } = input;
      const [updatedInvoice] = await trx
        .update(invoicesTable)
        .set({ ...invoiceData })
        .where(eq(invoicesTable.id, input.id))
        .returning();

      if (invoiceItems) {
        // remove all previous invoice items
        await trx
          .delete(invoicesItemsTable)
          .where(eq(invoicesItemsTable.invoiceId, input.id));

        // insert new invoice items, with normalized order
        await trx
          .insert(invoicesItemsTable)
          .values(
            invoiceItems
              .toSorted((a, b) => a.order - b.order)
              .map((item, index) => ({
                ...item,
                order: index,
                invoiceId: input.id,
              })),
          )
          .returning();
      }

      return { ...updatedInvoice, invoiceItems };
    });
  });
