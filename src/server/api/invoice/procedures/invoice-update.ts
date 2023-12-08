import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { insertInvoiceSchema, invoicesTable } from "~/server/db/schema";

// TODO: check for organization
export const invoiceUpdate = protectedProcedure
  .input(
    insertInvoiceSchema.required().extend({
      organizationId: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      await trx
        .update(invoicesTable)
        .set(input)
        .where(eq(invoicesTable.id, input.id));

      const [updatedInvoiceTemplate] = await trx
        .select()
        .from(invoicesTable)
        .where(eq(invoicesTable.id, input.id))
        .limit(1);

      return updatedInvoiceTemplate;
    });
  });
