import { TRPCError } from "@trpc/server";
import { $t } from "~/i18n/dummy";
import { protectedProcedure } from "~/server/api/trpc";
import {
  insertInvoiceTemplateSchema,
  invoiceTemplatesTable,
} from "~/server/db/schema";

export const invoiceTemplateCreate = protectedProcedure
  .input(insertInvoiceTemplateSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [newInvoiceTemplate] = await trx
        .insert(invoiceTemplatesTable)
        .values(input)
        .returning({ id: invoiceTemplatesTable.id });

      if (!newInvoiceTemplate) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: $t("invoiceTemplate.err.createFailed"),
        });
      }

      return { id: newInvoiceTemplate.id };
    });
  });
