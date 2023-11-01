import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { publicProcedure } from "~/server/api/trpc";
import { usersTable, type UserInsert } from "~/server/db/schema";

export const signUpMutation = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(1),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const [existingUser] = await ctx.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, input.email));

    if (existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: $t("auth.err.user-already-exists"),
      });
    }

    const hashedPassword = await hash(input.password, 12);
    const payload: UserInsert = {
      email: input.email,
      id: randomUUID(),
      name: input.name,
      password: hashedPassword,
    };

    await ctx.db.insert(usersTable).values(payload);

    return {
      id: payload.id,
    };
  });
