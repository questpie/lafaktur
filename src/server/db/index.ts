import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env.mjs";
import * as schema from "./schema";
// for migrations

// for query purposes
const client = postgres(env.DATABASE_URL);
const db = drizzle(client, { schema, logger: env.DATABASE_VERBOSE });

export { db };
