import { eq, getTableColumns } from "drizzle-orm";
import { protectedProcedure } from "~/server/api/trpc";
import {
  organizationUsersTable,
  organizationsTable,
} from "~/server/db/db-schema";

export const organizationGetByUser = protectedProcedure.query(
  async ({ ctx }) => {
    return ctx.db
      .select({
        ...getTableColumns(organizationsTable),
        role: organizationUsersTable.role,
      })
      .from(organizationsTable)
      .innerJoin(
        organizationUsersTable,
        eq(organizationsTable.id, organizationUsersTable.organizationId),
      )
      .where(eq(organizationUsersTable.userId, ctx.session.user.id));
  },
);
