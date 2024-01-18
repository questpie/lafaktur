import { protectedProcedure } from "~/server/api/trpc";

export const getMe = protectedProcedure.query(({ ctx }) => {
  return ctx.session.user;
});
