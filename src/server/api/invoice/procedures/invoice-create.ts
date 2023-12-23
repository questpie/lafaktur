import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";
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
import { getNextInvoiceNumber } from "~/shared/invoice/invoice-numbering";

export const invoiceCreate = protectedProcedure
  .input(
    insertInvoiceSchema.pick({
      organizationId: true,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [organization] = await getOrganization(
        trx
          .select({ invoiceNumbering: organizationsTable.invoiceNumbering })
          .from(organizationsTable)
          .$dynamic(),
        { userId: ctx.session.user.id, organizationId: input.organizationId },
      );

      if (!organization) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: $t("invoiceTemplate.err.invalidOrganization"),
        });
      }

      const [lastInvoice] = await withOrganizationAccess(
        trx
          .select({
            number: invoicesTable.number,
          })
          .from(invoicesTable)
          .orderBy(desc(invoicesTable.issueDate))
          .limit(1)
          .$dynamic(),
        {
          column: invoicesTable.organizationId,
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
        },
      );

      const number = getNextInvoiceNumber(
        organization.invoiceNumbering,
        lastInvoice?.number ?? null,
      );

      const [newInvoice] = await trx.insert(invoicesTable).values({
        organizationId: input.organizationId,
        number,
        reference: number,
        status: "draft",
      });

      return {
        id: newInvoice.insertId,
      };
    });
  });
