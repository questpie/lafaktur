import { organizationCreate } from "~/server/api/organization/procedures/organization-create";
import { createTRPCRouter } from "~/server/api/trpc";

export const organizationRouter = createTRPCRouter({
  create: organizationCreate,
  getByUser: organizationCreate,
});
