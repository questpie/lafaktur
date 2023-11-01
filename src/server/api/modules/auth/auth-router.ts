import { signUpMutation } from "~/server/api/modules/auth/procedures/sign-up.mutation";
import { createTRPCRouter } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  signUp: signUpMutation,
});
