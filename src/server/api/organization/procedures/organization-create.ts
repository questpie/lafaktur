import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { $t } from "~/i18n/dummy";
import { protectedProcedure } from "~/server/api/trpc";
import {
  insertOrganizationSchema,
  organizationUsersTable,
  organizationsTable,
} from "~/server/db/db-schema";
import { normalizeOrganizationName } from "~/shared/organization/organization-utils";

export const organizationCreate = protectedProcedure
  .input(
    insertOrganizationSchema.extend({
      slug: z.string().min(3).transform(normalizeOrganizationName),
    }),
  )
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
        userId: ctx.session.user.userId,
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
