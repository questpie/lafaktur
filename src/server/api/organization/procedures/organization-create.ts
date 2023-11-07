import { protectedProcedure } from "~/server/api/trpc";
import {
  insertOrganization,
  organizationUsersTable,
  organizationsTable,
} from "~/server/db/schema";

export const organizationCreate = protectedProcedure
  .input(insertOrganization)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const newOrganization = await trx
        .insert(organizationsTable)
        .values(input);

      await trx.insert(organizationUsersTable).values({
        organizationId: Number(newOrganization.insertId),
        userId: ctx.session!.user.id,
        role: "owner",
      });

      return { id: newOrganization.insertId };
    });
  });
