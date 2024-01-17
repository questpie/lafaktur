import { TRPCError } from "@trpc/server";
import { addMilliseconds } from "date-fns";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import { env } from "~/env.mjs";
import { $t } from "~/i18n/dummy";
import { publicProcedure } from "~/server/api/trpc";
import { usersTable, verificationTokensTable } from "~/server/db/db-schema";
import { getMailClient } from "~/server/mail/mail-client";
import { forgotPasswordSchema } from "~/shared/auth/auth-schemas";
import ResetPasswordEmail from "~emails/reset-password-email";

/**
 * TODO: setup a job that cleans expired token
 */
export const forgotPassword = publicProcedure
  .input(forgotPasswordSchema)
  .mutation(async ({ input, ctx }) => {
    return ctx.db.transaction(async (trx) => {
      /**
       * Look for user we are claiming to be
       */
      const [existingUser] = await trx
        .select({ id: usersTable.id, name: usersTable.name })
        .from(usersTable)
        .where(eq(usersTable.email, input.email));

      if (!existingUser) {
        throw new ZodError([
          {
            code: "custom",
            path: ["email"],
            message: $t("auth.err.emailNotFound"),
          },
        ]);
      }

      const [verificationToken] = await trx
        .insert(verificationTokensTable)
        .values({
          expires: addMilliseconds(
            new Date(),
            env.RESET_PASSWORD_EXPIRES_IN_MS,
          ),
          identifier: input.email.toLowerCase(),
          token: nanoid(32),
          type: "reset-password",
        })
        .returning();

      if (!verificationToken) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create verification token",
        });
      }

      const resetPasswordLink = `${env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${verificationToken.token}`;

      const mailClient = await getMailClient();
      const res = await mailClient.sendEmail({
        component: ResetPasswordEmail,
        props: {
          resetPasswordLink,
          userFirstname: (existingUser.name ?? "").split(" ")[0],
        },
        subject: "Lafaktur - Password Reset",
        to: input.email,
      });

      if (res.error) {
        return { success: false };
      }

      return { success: true };
    });
  });
