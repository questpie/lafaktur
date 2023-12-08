import { type MySqlSelect } from "drizzle-orm/mysql-core";

export type WithPaginationOptions = {
  cursor: number;
  limit: number;
};
export function withPagination<T extends MySqlSelect>(
  qb: T,
  options: WithPaginationOptions,
) {
  return qb.offset(options.cursor).limit(options.limit);
}
