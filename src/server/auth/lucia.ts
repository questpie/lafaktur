// auth/lucia.ts
import { postgres } from "@lucia-auth/adapter-postgresql";
import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { env } from "~/env.mjs";
import { queryClient } from "~/server/db/db-client";

// expect error (see next section)
export const auth = lucia({
  env: env.NODE_ENV === "production" ? "PROD" : "DEV", // "PROD" if deployed to HTTPS
  middleware: nextjs_future(), // NOT nextjs()
  sessionCookie: {
    expires: false,
  },
  adapter: postgres(queryClient, {
    user: "user",
    session: "session",
    key: "user_key",
  }),
  getUserAttributes: (data) => {
    return {
      name: data.name,
      email: data.email,
      image: data.image,
    };
  },
});

export enum LuciaProvider {
  EMAIL = "email",
}

export type Auth = typeof auth;
