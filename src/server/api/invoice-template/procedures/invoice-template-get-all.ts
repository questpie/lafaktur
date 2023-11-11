import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import {
  invoiceTemplatesTable,
  organizationUsersTable,
  organizationsTable,
} from "~/server/db/schema";

export const invoiceTemplateGetAll = protectedProcedure
  .input(
    z.object({
      organizationId: z.number(),
      cursor: z.number().default(0),
      limit: z.number().min(1).max(100).default(10),
    }),
  )
  .query(async ({ ctx, input }) => {
    // search for invoiceTemplate by id that has relation to organization
    const data = await ctx.db
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
          eq(organizationsTable.id, input.organizationId),
          eq(organizationUsersTable.userId, ctx.session.user.id),
        ),
      )
      .offset(input.cursor)
      .limit(input.limit);

    return {
      data,
      nextCursor:
        data.length >= input.limit ? input.cursor + input.limit : undefined,
    };
  });
