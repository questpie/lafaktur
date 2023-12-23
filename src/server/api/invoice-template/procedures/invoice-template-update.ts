import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import {
  insertInvoiceTemplateSchema,
  invoiceTemplatesTable,
} from "~/server/db/schema";

// check for organization
export const invoiceTemplateUpdate = protectedProcedure
  .input(
    insertInvoiceTemplateSchema.required().extend({
      organizationId: z.number(),
    }),
  )
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
