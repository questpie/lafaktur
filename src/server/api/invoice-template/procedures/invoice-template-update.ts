import { eq } from "drizzle-orm";
import { protectedProcedure } from "~/server/api/trpc";
import {
  insertInvoiceTemplate,
  invoiceTemplatesTable,
} from "~/server/db/schema";

export const invoiceTemplateUpdate = protectedProcedure
  .input(insertInvoiceTemplate.required())
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      await trx
        .update(invoiceTemplatesTable)
        .set(input)
        .where(eq(invoiceTemplatesTable.id, input.id));

      const [updatedInvoiceTemplate] = await trx
        .select()
        .from(invoiceTemplatesTable)
        .where(eq(invoiceTemplatesTable.id, input.id))
        .limit(1);

      return updatedInvoiceTemplate;
    });
  });
