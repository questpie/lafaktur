import { forgotPassword } from "~/server/api/auth/procedures/forgot-password.mutation";
import { getMe } from "~/server/api/auth/procedures/get-me.query";
import { resetPassword } from "~/server/api/auth/procedures/reset-password.mutation";
import { signUp } from "~/server/api/auth/procedures/sign-up.mutation";
import { createTRPCRouter } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  signUp,
  getMe,
  forgotPassword,
  resetPassword,
});
