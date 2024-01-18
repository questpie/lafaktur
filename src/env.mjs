import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const zBoolean = () =>
  z
    .string()
    // only allow "true" or "false"
    .refine((s) => s === "true" || s === "false")
    // transform to boolean
    .transform((s) => s === "true");

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_PG_URL_HERE"),
        "You forgot to change the default URL",
      ),
    DATABASE_VERBOSE: zBoolean().default("false"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // Add ` on ID and SECRET if you want to make sure they're not empty
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    S3_ENDPOINT_HOST: z.string().min(1),
    S3_ENDPOINT_PORT: z
      .string()
      .default("9000")
      .transform((v) => parseInt(v, 10)),
    S3_ACCESS_KEY: z.string().min(1),
    S3_SECRET_KEY: z.string().min(1),
    S3_REGION: z.string().min(1).optional(),
    S3_USE_PATH_STYLE: zBoolean().default("true"),
    S3_USE_SSL: zBoolean().default(
      process.env.NODE_ENV === "production" ? "true" : "false",
    ),

    MAIL_FROM: z.string().default("noreply@example.com <Lafaktur>"),
    RESEND_KEY:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),

    /**
     * Config values overridable by env variables
     */

    /**
     * How long should the reset password token be valid for in milliseconds.
     * @default 1hour
     */
    RESET_PASSWORD_EXPIRES_IN_MS: z.number().default(1000 * 60 * 60),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_VERBOSE: process.env.DATABASE_VERBOSE,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    S3_ENDPOINT_HOST: process.env.S3_ENDPOINT_HOST,
    S3_ENDPOINT_PORT: process.env.S3_ENDPOINT_PORT,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_USE_PATH_STYLE: process.env.S3_USE_PATH_STYLE,
    S3_USE_SSL: process.env.S3_USE_SSL,

    MAIL_FROM: process.env.MAIL_FROM,
    RESEND_KEY: process.env.RESEND_KEY,

    RESET_PASSWORD_EXPIRES_IN_MS: process.env.RESET_PASSWORD_EXPIRES_IN_MS,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
