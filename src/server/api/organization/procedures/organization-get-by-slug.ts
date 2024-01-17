import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { protectedProcedure } from "~/server/api/trpc";
import {
  organizationUsersTable,
  organizationsTable,
} from "~/server/db/db-schema";

export const organizationGetBySlug = protectedProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    const [org] = await ctx.db
      .select({
        ...getTableColumns(organizationsTable),
        role: organizationUsersTable.role,
      })
      .from(organizationsTable)
      .innerJoin(
        organizationUsersTable,
        eq(organizationsTable.id, organizationUsersTable.organizationId),
      )
      .where(
        and(
          eq(organizationUsersTable.userId, ctx.session.user.id),
          eq(organizationsTable.slug, input),
        ),
      )
      .limit(1);

    if (!org) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: $t("organization.err.notFound"),
      });
    }
    return org;
  });
