import { invoiceCreate } from "~/server/api/invoice/procedures/invoice-create";
import { invoiceDeleteById } from "~/server/api/invoice/procedures/invoice-delete-by-id";
import { invoiceEdit } from "~/server/api/invoice/procedures/invoice-edit";
import { invoiceGetAll } from "~/server/api/invoice/procedures/invoice-get-all";
import { invoiceGetAllByCustomerId } from "~/server/api/invoice/procedures/invoice-get-all-by-customer-id";
import { invoiceGetById } from "~/server/api/invoice/procedures/invoice-get-by-id";
import { createTRPCRouter } from "~/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  create: invoiceCreate,
  edit: invoiceEdit,
  deleteById: invoiceDeleteById,
  getAll: invoiceGetAll,
  getById: invoiceGetById,
  getAllByCustomerId: invoiceGetAllByCustomerId,
});
