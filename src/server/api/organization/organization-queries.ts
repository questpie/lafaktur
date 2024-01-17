import { and, eq, inArray } from "drizzle-orm";
import { type PgColumn, type PgSelect } from "drizzle-orm/pg-core";
import {
  organizationUsersTable,
  organizationsTable,
  type OrganizationUser,
} from "~/server/db/db-schema";

export type WithOrganizationAccessOptions = {
  /**
   * Id of a user that has to be a member of organization related to given resource
   */
  userId: string;
  /**
   * FK column pointing at organization
   */
  column: PgColumn;
  /**
   * This is needed if you want to check access to specific organization,
   * by default we are just checking whether user has access to any organization related to given resource
   */
  organizationId?: number;
  /**
   * Minimal role user has to have to be able to access the resource
   */
  role?: OrganizationUser["role"];
};

/**
 * This kind of mapping could probably be done more efficiently through array slicing,
 * but this variant I find to be more declarative and flexible
 */
const ROLE_MAPPER: Record<
  OrganizationUser["role"],
  OrganizationUser["role"][]
> = {
  reader: ["reader", "editor", "owner"],
  editor: ["editor", "owner"],
  owner: ["owner"],
};

/**
 * Adds constraints to given dynamic query that makes sure user has access to given resource (e.g is a member of related organization)
 */
export function withOrganizationAccess<T extends PgSelect>(
  qb: T,
  options: WithOrganizationAccessOptions,
) {
  const allowedRoles = ROLE_MAPPER[options.role ?? "reader"];

  return qb
    .innerJoin(organizationsTable, eq(organizationsTable.id, options.column))
    .innerJoin(
      organizationUsersTable,
      eq(organizationUsersTable.organizationId, organizationsTable.id),
    )
    .where(
      and(
        eq(organizationUsersTable.userId, options.userId),
        inArray(organizationUsersTable.role, allowedRoles),
        typeof options.organizationId !== "undefined"
          ? eq(organizationsTable.id, options.organizationId)
          : undefined,
      ),
    );
}

export type GetOrganizationOptions = {
  userId: string;
  organizationId: number;
};

export function getOrganization<T extends PgSelect>(
  qb: T,
  opts: GetOrganizationOptions,
) {
  return qb
    .innerJoin(
      organizationUsersTable,
      eq(organizationsTable.id, organizationUsersTable.organizationId),
    )
    .where(
      and(
        eq(organizationsTable.id, opts.organizationId),
        eq(organizationUsersTable.userId, opts.userId),
      ),
    );
}
