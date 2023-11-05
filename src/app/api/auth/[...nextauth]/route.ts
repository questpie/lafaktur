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

const modifiedAuthOptions = (
  req: NextRequest,
  cookieStore: string[],
): typeof authOptions => {
  console.log(
    req.nextUrl?.pathname,
    req.nextUrl.pathname === "/api/auth/callback/credentials",
    req.method === "POST",
  );
  return {
    ...authOptions,
    jwt: {
      ...authOptions.jwt,
      encode: async (params) => {
        if (
          req.nextUrl?.pathname === "/api/auth/callback/credentials" &&
          req.method === "POST"
        ) {
          const cookie = cookies().get("next-auth.session-token");
          console.log(cookie?.name);

          if (cookie?.value) return cookie.value;
          else return "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode(params);
      },
      decode: async (params) => {
        if (
          req.nextUrl?.pathname === "/api/auth/callback/credentials" &&
          req.method === "POST"
        ) {
          return null;
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode(params);
      },
    },
    callbacks: {
      ...authOptions.callbacks,
      signIn: async ({ user }) => {
        if (
          req.nextUrl?.pathname === "/api/auth/callback/credentials" &&
          req.method === "POST"
        ) {
          console.log("sign in", user);
          if (user) {
            const sessionToken = generateSessionToken();
            const sessionExpiry = fromDate(
              authOptions.session?.maxAge ?? 2592000 /* 30 days */,
            );

            const createdSession = await authOptions.adapter!.createSession!({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            });

            console.log("session", createdSession);
            console.log("sessionToken", sessionToken);

            cookieStore.push(
              `next-auth.session-token=${sessionToken}; Path=/; Expires=${sessionExpiry.toUTCString()}; HttpOnly; SameSite=Lax`,
            );
          }
        }
        return true;
      },
    },
  };
};

async function handler(req: NextRequest, tmpRes: any) {
  const cookieStore: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const nextAuthHandler = await NextAuth(modifiedAuthOptions(req, cookieStore));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const res: NextResponse = await nextAuthHandler(req, tmpRes);
  for (const [name, value] of Object.entries(cookieStore)) {
    res.headers.set("Set-Cookie", value);
  }

  return res;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export { handler as GET, handler as POST };
