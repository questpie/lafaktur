import { invoiceCreate } from "~/server/api/invoice/procedures/invoice-create";
import { invoiceDeleteById } from "~/server/api/invoice/procedures/invoice-delete-by-id";
import { invoiceGetAll } from "~/server/api/invoice/procedures/invoice-get-all";
import { invoiceGetById } from "~/server/api/invoice/procedures/invoice-get-by-id";
import { createTRPCRouter } from "~/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  create: invoiceCreate,
  deleteById: invoiceDeleteById,
  getAll: invoiceGetAll,
  getById: invoiceGetById,
});
