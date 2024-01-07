import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { invoicesTable } from "~/server/db/schema";

export const invoiceGetById = protectedProcedure
  .input(z.object({ id: z.number(), organizationId: z.number() }))
  .query(async ({ ctx, input }) => {
    // search for invoiceTemplate by id that has relation to organization
    const [foundInvoice] = await withOrganizationAccess(
      ctx.db
        .select({
          ...getTableColumns(invoicesTable),
        })
        .from(invoicesTable)
        .$dynamic(),
      {
        column: invoicesTable.organizationId,
        userId: ctx.session.user.id,
      },
    )
      .where(and(eq(invoicesTable.id, input.id)))
      .limit(1);

    if (!foundInvoice) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: $t("invoice.err.notFound"),
      });
    }

    return foundInvoice;
  });
