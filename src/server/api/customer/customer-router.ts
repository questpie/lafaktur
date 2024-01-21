import { customerCreate } from "~/server/api/customer/procedures/customer-create";
import { customerDeleteById } from "~/server/api/customer/procedures/customer-delete-by-id";
import { customerGetAll } from "~/server/api/customer/procedures/customer-get-all";
import { customerGetById } from "~/server/api/customer/procedures/customer-get-by-id";
import { createTRPCRouter } from "~/server/api/trpc";

export const customerRouter = createTRPCRouter({
  create: customerCreate,
  getAll: customerGetAll,
  getById: customerGetById,
  deleteById: customerDeleteById,
});
