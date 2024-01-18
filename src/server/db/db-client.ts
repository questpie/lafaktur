import { type DrizzleConfig } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env.mjs";
import * as schema from "./db-schema";
// for migrations

let db: PostgresJsDatabase<typeof schema>;
let queryClient: postgres.Sql;

const options: DrizzleConfig<typeof schema> = {
  schema,
  logger: env.DATABASE_VERBOSE,
};

if (env.NODE_ENV === "production") {
  queryClient = postgres(env.DATABASE_URL);
  db = drizzle(queryClient, options);
} else {
  // @ts-expect-error don't expose global
  if (!global.queryClient) global.queryClient = postgres(env.DATABASE_URL);
  // @ts-expect-error don't expose global
  if (!global.db)
    // @ts-expect-error don't expose global
    global.db = drizzle(global.queryClient as postgres.Sql, options);

  // @ts-expect-error don't expose global
  db = global.db as PostgresJsDatabase<typeof schema>;
  // @ts-expect-error don't expose global
  queryClient = global.queryClient as postgres.Sql;
}

export { db, queryClient };
