import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { invoiceTemplatesTable } from "~/server/db/db-schema";

export const invoiceTemplateDeleteById = protectedProcedure
  .input(z.object({ id: z.number(), organizationId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      /**
       * We are making a proper select to be sure we have access to this resource
       */
      const [foundInvoiceTemplate] = await withOrganizationAccess(
        trx
          .select({
            id: invoiceTemplatesTable.id,
          })
          .from(invoiceTemplatesTable)
          .$dynamic(),
        {
          userId: ctx.session.user.id,
          column: invoiceTemplatesTable.organizationId,
        },
      )
        .where(and(eq(invoiceTemplatesTable.id, input.id)))
        .limit(1);

      if (!foundInvoiceTemplate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: $t("invoiceTemplate.err.notFound"),
        });
      }

      await trx
        .delete(invoiceTemplatesTable)
        .where(eq(invoiceTemplatesTable.id, foundInvoiceTemplate.id));

      return { id: foundInvoiceTemplate.id };
    });
  });
