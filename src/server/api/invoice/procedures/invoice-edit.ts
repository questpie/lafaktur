import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { $t } from "~/i18n/dummy";
import {
  getOrganization,
  withOrganizationAccess,
} from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import {
  insertInvoiceSchema,
  invoicesTable,
  organizationsTable,
} from "~/server/db/schema";

export const invoiceEdit = protectedProcedure
  .input(
    insertInvoiceSchema.partial().required({ organizationId: true, id: true }),
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
      ).where(eq(invoicesTable.id, input.id));

      if (!invoice) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: $t("invoice.err.invoiceNotFound"),
        });
      }

      const [updatedInvoice] = await trx
        .update(invoicesTable)
        .set({
          ...input,
        })
        .where(eq(invoicesTable.id, input.id))
        .returning();

      return updatedInvoice;
    });
  });