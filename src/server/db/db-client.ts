import { type DrizzleConfig } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env.mjs";
import * as schema from "./db-schema";
// for migrations

// for query purposes

// Fix for "sorry, too many clients already"

let db: PostgresJsDatabase<typeof schema>;
const options: DrizzleConfig<typeof schema> = {
  schema,
  logger: env.DATABASE_VERBOSE,
};

if (env.NODE_ENV === "production") {
  db = drizzle(postgres(env.DATABASE_URL), options);
} else {
  // @ts-expect-error we don't want to declare global db type, because it is not consistent per environment
  if (!global.db) global.db = drizzle(postgres(env.DATABASE_URL), options);

  // @ts-expect-error we don't want to declare global db type, because it is not through per environment
  db = global.db as PostgresJsDatabase<typeof schema>;
}

export { db };
