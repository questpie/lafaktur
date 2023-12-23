import { type PgSelect } from "drizzle-orm/pg-core";

export type WithPaginationOptions = {
  cursor: number;
  limit: number;
};
export function withPagination<T extends PgSelect>(
  qb: T,
  options: WithPaginationOptions,
) {
  return qb.offset(options.cursor).limit(options.limit);
}
