import { invoiceCreate } from "~/server/api/invoice/procedures/invoice-create";
import { invoiceDeleteById } from "~/server/api/invoice/procedures/invoice-delete-by-id";
import { invoiceEdit } from "~/server/api/invoice/procedures/invoice-edit";
import { invoiceGetAll } from "~/server/api/invoice/procedures/invoice-get-all";
import { invoiceGetById } from "~/server/api/invoice/procedures/invoice-get-by-id";
import { invoiceGetNextNumber } from "~/server/api/invoice/procedures/invoice-get-next-number";
import { createTRPCRouter } from "~/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  create: invoiceCreate,
  edit: invoiceEdit,
  deleteById: invoiceDeleteById,
  getAll: invoiceGetAll,
  getById: invoiceGetById,
  getNextNumber: invoiceGetNextNumber,
});
