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
        .values(input);

      return { id: newInvoiceTemplate.insertId };
    });
  });
