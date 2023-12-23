import { defineConfig } from "drizzle-kit";

import { env } from "~/env.mjs";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  strict: true,
  verbose: env.DATABASE_VERBOSE,
  breakpoints: true,
});
