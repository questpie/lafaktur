import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { invoiceTemplatesTable } from "~/server/db/schema";

export const invoiceTemplateGetById = protectedProcedure
  .input(z.object({ id: z.number(), organizationId: z.number() }))
  .query(async ({ ctx, input }) => {
    // search for invoiceTemplate by id that has relation to organization
    const [foundInvoiceTemplate] = await withOrganizationAccess(
      ctx.db
        .select({
          ...getTableColumns(invoiceTemplatesTable),
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

    return foundInvoiceTemplate;
  });
