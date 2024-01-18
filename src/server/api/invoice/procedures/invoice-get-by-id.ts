import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { invoicesItemsTable, invoicesTable } from "~/server/db/db-schema";

export const invoiceGetById = protectedProcedure
  .input(z.object({ id: z.number(), organizationId: z.number() }))
  .query(async ({ ctx, input }) => {
    // search for invoiceTemplate by id that has relation to organization
    const result = await withOrganizationAccess(
      ctx.db
        .select()
        .from(invoicesTable)
        .leftJoin(
          invoicesItemsTable,
          eq(invoicesTable.id, invoicesItemsTable.invoiceId),
        )
        .$dynamic(),
      {
        column: invoicesTable.organizationId,
        userId: ctx.session.user.userId,
      },
    )
      .where(and(eq(invoicesTable.id, input.id)))
      .orderBy(asc(invoicesItemsTable.order));

    if (!result[0]?.invoices) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: $t("invoice.err.notFound"),
      });
    }

    const invoice = result[0]?.invoices;

    return {
      ...invoice,
      invoiceItems: result.map((item) => item.invoice_items).filter(Boolean),
    };
  });
