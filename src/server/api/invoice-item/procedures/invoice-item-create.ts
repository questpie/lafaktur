import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import {
  insertInvoiceItemSchema,
  invoicesItemsTable,
  invoicesTable,
} from "~/server/db/schema";

export const invoiceItemCreate = protectedProcedure
  .input(
    insertInvoiceItemSchema.extend({
      organizationId: z.number(),
    }),
  )
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
      )
        .where(eq(invoicesTable.id, input.invoiceId))
        .orderBy(desc(invoicesTable.issueDate))
        .limit(1);

      if (!invoice) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: $t("invoice.err.invoiceNotFound"),
        });
      }

      const [newInvoiceItem] = await trx
        .insert(invoicesItemsTable)
        .values({
          ...input,
        })
        .returning({ id: invoicesTable.id });

      if (!newInvoiceItem) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: $t("invoiceItem.err.createFailed"),
        });
      }

      return {
        id: newInvoiceItem.id,
      };
    });
  });
