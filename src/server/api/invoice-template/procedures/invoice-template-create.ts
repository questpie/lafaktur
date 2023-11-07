import { nanoid } from "nanoid";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { invoiceTemplatesTable } from "~/server/db/schema";

export const invoiceTemplateCreate = protectedProcedure
  .input(z.object({}))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const newInvoiceTemplate = await trx
        .insert(invoiceTemplatesTable)
        .values({
          name: `New invoice template #${nanoid(6)}`,
          organizationId: 1,
        });

      return { ok: true };
    });
  });
