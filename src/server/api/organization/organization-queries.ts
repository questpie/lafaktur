import { and, eq } from "drizzle-orm";
import { type MySqlColumn, type MySqlSelect } from "drizzle-orm/mysql-core";
import {
  organizationUsersTable,
  organizationsTable,
  type OrganizationUser,
} from "~/server/db/schema";

export type WithOrganizationAccessOptions = {
  userId: string;
  column: MySqlColumn;
  organizationId?: number;
  role?: OrganizationUser["role"];
};
/**
 *
 * makes sure user has access to given org
 */
export function withOrganizationAccess<T extends MySqlSelect>(
  qb: T,
  options: WithOrganizationAccessOptions,
) {
  return qb
    .innerJoin(organizationsTable, eq(organizationsTable.id, options.column))
    .innerJoin(
      organizationUsersTable,
      eq(organizationUsersTable.organizationId, organizationsTable.id),
    )
    .where(
      and(
        eq(organizationUsersTable.userId, options.userId),
        options.role && eq(organizationUsersTable.role, options.role),
        typeof options.organizationId !== "undefined"
          ? eq(organizationsTable.id, options.organizationId)
          : undefined,
      ),
    );
}
