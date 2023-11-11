import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { protectedProcedure } from "~/server/api/trpc";
import {
  invoiceTemplatesTable,
  organizationUsersTable,
  organizationsTable,
} from "~/server/db/schema";

export const invoiceTemplateDeleteById = protectedProcedure
  .input(z.object({ id: z.number(), organizationId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      /**
       * We are making a proper select to be sure we have access to this resource
       */
      const [foundInvoiceTemplate] = await trx
        .select({
          id: invoiceTemplatesTable.id,
        })
        .from(invoiceTemplatesTable)
        .innerJoin(
          organizationsTable,
          eq(organizationsTable.id, invoiceTemplatesTable.organizationId),
        )
        .innerJoin(
          organizationUsersTable,
          eq(organizationUsersTable.organizationId, organizationsTable.id),
        )
        .where(
          and(
            eq(invoiceTemplatesTable.id, input.id),
            eq(organizationUsersTable.userId, ctx.session.user.id),
            eq(organizationsTable.id, input.organizationId),
          ),
        )
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
