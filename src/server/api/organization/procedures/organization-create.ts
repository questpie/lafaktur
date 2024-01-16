import { TRPCError } from "@trpc/server";
import { $t } from "~/i18n/dummy";
import { protectedProcedure } from "~/server/api/trpc";
import {
  insertOrganizationSchema,
  organizationUsersTable,
  organizationsTable,
} from "~/server/db/schema";

export const organizationCreate = protectedProcedure
  .input(insertOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.transaction(async (trx) => {
      const [newOrganization] = await trx
        .insert(organizationsTable)
        .values(input)
        .returning({
          id: organizationsTable.id,
          slug: organizationsTable.slug,
        });

      if (!newOrganization) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: $t("organization.err.createFailed"),
        });
      }

      await trx.insert(organizationUsersTable).values({
        organizationId: Number(newOrganization?.id),
        userId: ctx.session!.user.id,
        role: "owner",
      });

      if (!newOrganization) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: $t("organization.err.createFailed"),
        });
      }

      return { id: newOrganization.id, slug: newOrganization.slug };
    });
  });
