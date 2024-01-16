import { organizationCreate } from "~/server/api/organization/procedures/organization-create";
import { organizationGetBySlug } from "~/server/api/organization/procedures/organization-get-by-slug";
import { organizationGetByUser } from "~/server/api/organization/procedures/organization-get-by-user";
import { createTRPCRouter } from "~/server/api/trpc";

export const organizationRouter = createTRPCRouter({
  create: organizationCreate,
  getByUser: organizationGetByUser,
  getBySlug: organizationGetBySlug,
});
