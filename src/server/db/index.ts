import { type DrizzleConfig } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env.mjs";
import * as schema from "./schema";
// for migrations

// for query purposes

// Fix for "sorry, too many clients already"
declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;
const options: DrizzleConfig<typeof schema> = {
  schema,
  logger: env.DATABASE_VERBOSE,
};

if (env.NODE_ENV === "production") {
  db = drizzle(postgres(env.DATABASE_URL), options);
} else {
  if (!global.db) global.db = drizzle(postgres(env.DATABASE_URL), options);

  db = global.db;
}

export { db };
