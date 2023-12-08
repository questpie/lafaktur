import { organizationCreate } from "~/server/api/organization/procedures/organization-create";
import { organizationGetByUser } from "~/server/api/organization/procedures/organization-get-by-user";
import { createTRPCRouter } from "~/server/api/trpc";

export const organizationRouter = createTRPCRouter({
  create: organizationCreate,
  getByUser: organizationGetByUser,
});
