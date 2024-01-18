import { eq } from "drizzle-orm";
import { LuciaError } from "lucia";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import { $t } from "~/i18n/dummy";
import { publicProcedure } from "~/server/api/trpc";
import { LuciaProvider, auth } from "~/server/auth/lucia";
import { usersTable } from "~/server/db/db-schema";
import { signUpSchema } from "~/shared/auth/auth-schemas";

export const signUp = publicProcedure
  .input(signUpSchema)
  .mutation(async ({ input, ctx }) => {
    return ctx.db.transaction(async (trx) => {
      const [existingUser] = await trx
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, input.email));

      if (existingUser) {
        throw new ZodError([
          {
            code: "custom",
            path: ["email"],
            message: $t("auth.err.userAlreadyExists"),
          },
        ]);
      }

      try {
        const user = await auth.createUser({
          userId: nanoid(),
          key: {
            providerId: LuciaProvider.EMAIL,
            providerUserId: input.email,
            password: input.password,
          },
          attributes: {
            email: input.email,
            name: input.name,
          },
        });

        return {
          id: user.userId,
        };
      } catch (e) {
        if (e instanceof LuciaError && e.message === `AUTH_DUPLICATE_KEY_ID`) {
          throw new ZodError([
            {
              code: "custom",
              path: ["email"],
              message: $t("auth.err.userAlreadyExists"),
            },
          ]);
        }
        // TODO: check and handle other error
        // provided user attributes violates database rules (e.g. unique constraint)
        // or unexpected database errors
      }
    });
  });
