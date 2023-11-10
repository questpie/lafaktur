import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { protectedProcedure } from "~/server/api/trpc";
import {
  invoiceTemplatesTable,
  organizationUsersTable,
  organizationsTable,
} from "~/server/db/schema";

export const invoiceTemplateGetById = protectedProcedure
  .input(z.object({ id: z.number(), organizationId: z.number() }))
  .query(async ({ ctx, input }) => {
    // search for invoiceTemplate by id that has relation to organization
    const [foundInvoiceTemplate] = await ctx.db
      .select({
        ...getTableColumns(invoiceTemplatesTable),
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

    return foundInvoiceTemplate;
  });
