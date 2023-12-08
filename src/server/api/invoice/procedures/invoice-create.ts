import { protectedProcedure } from "~/server/api/trpc";
import { insertInvoiceSchema, invoicesTable } from "~/server/db/schema";

export const invoiceCreate = protectedProcedure
  .input(insertInvoiceSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [newInvoice] = await trx.insert(invoicesTable).values(input);

      return {
        id: newInvoice.insertId,
      };
    });
  });
