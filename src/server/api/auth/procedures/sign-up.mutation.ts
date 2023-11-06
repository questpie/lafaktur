import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { ZodError } from "zod";
import { $t } from "~/i18n/dummy";
import { publicProcedure } from "~/server/api/trpc";
import { accountsTable, usersTable, type UserInsert } from "~/server/db/schema";
import { signUpSchema } from "~/shared/auth/auth-schemas";

export const signUpMutation = publicProcedure
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

      const hashedPassword = await hash(input.password, 12);
      const payload: UserInsert = {
        email: input.email,
        id: randomUUID(),
        name: input.name,
        password: hashedPassword,
      };

      await trx.insert(usersTable).values(payload);
      const createdUser = await trx.query.usersTable.findFirst({
        where: () => eq(usersTable.id, payload.id),
      });

      if (!createdUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create user",
        });
      }

      await trx.insert(accountsTable).values({
        userId: createdUser.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: createdUser.id,
      });

      const createdAccount = await trx.query.accountsTable.findFirst({
        where: () =>
          and(
            eq(accountsTable.userId, createdUser.id),
            eq(accountsTable.provider, "credentials"),
          ),
      });

      if (!createdAccount) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create account",
        });
      }

      return {
        id: payload.id,
      };
    });
  });
