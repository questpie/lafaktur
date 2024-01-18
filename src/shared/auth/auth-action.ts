"use server";

import { LuciaError } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type z } from "zod";
import { $t } from "~/i18n/dummy";
import { getAuthRequest } from "~/server/auth/get-server-session";
import { LuciaProvider, auth } from "~/server/auth/lucia";
import { type signInSchema } from "~/shared/auth/auth-schemas";

export async function signIn(
  input: z.infer<typeof signInSchema>,
  callbackUrl?: string,
) {
  try {
    const key = await auth.useKey(
      LuciaProvider.EMAIL,
      input.email,
      input.password,
    );

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {}, // expects `Lucia.DatabaseSessionAttributes`
    });

    const sessionCookie = auth.createSessionCookie(session);
    cookies().set(sessionCookie.name, sessionCookie.value);

    if (callbackUrl === undefined)
      return {
        success: true,
        id: key.userId,
      };
  } catch (e) {
    if (e instanceof LuciaError) {
      if (e.message === "AUTH_INVALID_KEY_ID") {
        return {
          success: false,
          error: {
            email: $t("auth.err.invalidEmail"),
          },
        };
      }
      if (e.message === "AUTH_INVALID_PASSWORD") {
        return {
          success: false,
          error: {
            password: $t("auth.err.pleaseCheckYourCredentials"),
          },
        };
      }
    }

    return {
      success: false,
      error: $t("common.err.somethingWentWrong"),
    };
  }

  redirect(callbackUrl);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function signOut(callbackUrl?: string) {
  const authRequest = getAuthRequest("POST");
  authRequest.setSession(null);
  if (callbackUrl) {
    redirect(callbackUrl);
  }

  return {
    success: true,
  };
}
