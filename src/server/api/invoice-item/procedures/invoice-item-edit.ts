import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import {
  insertInvoiceItemSchema,
  invoicesItemsTable,
  invoicesTable,
} from "~/server/db/schema";

export const invoiceItemEdit = protectedProcedure
  .input(
    insertInvoiceItemSchema
      .partial()
      .required({ invoiceId: true, id: true })
      .extend({
        organizationId: z.number(),
      }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [invoiceItem] = await withOrganizationAccess(
        trx
          .select({
            id: invoicesItemsTable.id,
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
      )
        .where(eq(invoicesItemsTable.id, input.id))
        .where(eq(invoicesTable.id, input.invoiceId));

      if (!invoiceItem) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: $t("invoiceItem.err.notFound"),
        });
      }

      const [updatedInvoiceItem] = await trx
        .update(invoicesItemsTable)
        .set({
          ...input,
        })
        .where(eq(invoicesItemsTable.id, input.id))
        .returning();

      return updatedInvoiceItem;
    });
  });
