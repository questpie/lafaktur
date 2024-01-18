import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import {
  getOrganization,
  withOrganizationAccess,
} from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { invoicesTable, organizationsTable } from "~/server/db/db-schema";
import { getNextInvoiceNumber } from "~/shared/invoice/invoice-numbering";

export const invoiceCreate = protectedProcedure
  .input(z.object({ organizationId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [organization] = await getOrganization(
        trx
          .select({
            invoiceNumbering: organizationsTable.invoiceNumbering,
            name: organizationsTable.name,
          })
          .from(organizationsTable)
          .$dynamic(),
        {
          userId: ctx.session.user.userId,
          organizationId: input.organizationId,
        },
      );

      if (!organization) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: $t("common.err.invalidOrganization"),
        });
      }

      const [lastInvoice] = await withOrganizationAccess(
        trx
          .select({
            number: invoicesTable.number,
          })
          .from(invoicesTable)
          .orderBy(desc(invoicesTable.issueDate))
          .$dynamic(),
        {
          column: invoicesTable.organizationId,
          userId: ctx.session.user.userId,
          organizationId: input.organizationId,
        },
      ).limit(1);

      const number = getNextInvoiceNumber(
        organization.invoiceNumbering,
        lastInvoice?.number ?? null,
      );

      const [newInvoice] = await trx
        .insert(invoicesTable)
        .values({
          organizationId: input.organizationId,
          number,
          reference: number,
          status: "draft",
          customerName: "",
          supplierName: organization.name,
        })
        .returning({ id: invoicesTable.id });

      if (!newInvoice) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: $t("invoice.err.createFailed"),
        });
      }

      return {
        id: newInvoice.id,
      };
    });
  });
