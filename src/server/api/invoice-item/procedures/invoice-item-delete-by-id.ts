import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { withOrganizationAccess } from "~/server/api/organization/organization-queries";
import { protectedProcedure } from "~/server/api/trpc";
import { invoicesItemsTable, invoicesTable } from "~/server/db/schema";

export const invoiceItemDeleteById = protectedProcedure
  .input(
    z.object({
      id: z.number(),
      organizationId: z.number(),
      invoiceId: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [foundInvoice] = await withOrganizationAccess(
        trx
          .select({
            id: invoicesItemsTable.id,
          })
          .from(invoicesItemsTable)
          .innerJoin(
            invoicesTable,
            eq(invoicesTable.id, invoicesItemsTable.invoiceId),
          )
          .limit(1)
          .$dynamic(),
        {
          column: invoicesTable.organizationId,
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
        },
      ).where(
        and(
          eq(invoicesItemsTable.id, input.id),
          eq(invoicesTable.id, input.invoiceId),
        ),
      );

      if (!foundInvoice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: $t("invoiceItem.err.notFound"),
        });
      }

      await trx
        .delete(invoicesItemsTable)
        .where(eq(invoicesItemsTable.id, foundInvoice.id));

      return { id: foundInvoice.id };
    });
  });
