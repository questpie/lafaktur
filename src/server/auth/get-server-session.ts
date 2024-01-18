import * as context from "next/headers";
import { auth } from "~/server/auth/lucia";

export function getAuthRequest(method = "GET") {
  return auth.handleRequest(method, context);
}

export function getServerAuthSession(method = "GET") {
  const authRequest = getAuthRequest(method);
  return authRequest.validate();
}
