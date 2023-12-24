import { randomUUID } from "crypto";
import NextAuth from "next-auth";
import { decode, encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { type NextRequest, type NextResponse } from "next/server";

import { authOptions } from "~/server/auth";

function generateSessionToken() {
  return randomUUID();
}

function fromDate(time: number, date = Date.now()) {
  return new Date(date + time * 1000);
}

const modifiedAuthOptions = (opts: {
  method: string;
  nextauth: string[];
  cookies: string[];
}): typeof authOptions => {
  const isCredentialsCallback =
    opts.method === "POST" &&
    opts.nextauth.includes("callback") &&
    opts.nextauth.includes("credentials");

  const cookiePrefix = authOptions.useSecureCookies ? "__Secure-" : "";
  const sessionTokenCookieName = `${cookiePrefix}next-auth.session-token`;

  return {
    ...authOptions,
    jwt: {
      ...authOptions.jwt,
      encode: async (params) => {
        if (isCredentialsCallback) {
          const cookie = cookies().get(sessionTokenCookieName);
          if (cookie?.value) return cookie.value;
          else return "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode(params);
      },
      decode: async (params) => {
        if (isCredentialsCallback) {
          return null;
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode(params);
      },
    },
    callbacks: {
      ...authOptions.callbacks,
      signIn: async ({ user }) => {
        if (isCredentialsCallback) {
          if (user) {
            const sessionToken = generateSessionToken();
            const sessionExpiry = fromDate(
              authOptions.session?.maxAge ?? 2592000 /* 30 days */,
            );

            await authOptions.adapter!.createSession!({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            });

            opts.cookies.push(
              `${sessionTokenCookieName}=${sessionToken}; Path=/; Expires=${sessionExpiry.toUTCString()}; HttpOnly; SameSite=Lax; ${
                authOptions.useSecureCookies ? "Secure;" : ""
              }`,
            );
          }
        }
        return true;
      },
    },
  };
};

async function handler(
  req: NextRequest,
  props: { params: { nextauth: string[] } },
) {
  const opts = {
    method: req.method,
    nextauth: props.params.nextauth,
    cookies: [],
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const nextAuthHandler = await NextAuth(modifiedAuthOptions(opts));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const res: NextResponse = await nextAuthHandler(req, props);
  for (const value of opts.cookies) {
    res.headers.set("Set-Cookie", value);
  }

  return res;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export { handler as GET, handler as POST };
