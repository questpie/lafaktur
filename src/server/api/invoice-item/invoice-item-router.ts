import { invoiceItemCreate } from "~/server/api/invoice-item/procedures/invoice-item-create";
import { invoiceItemDeleteById } from "~/server/api/invoice-item/procedures/invoice-item-delete-by-id";
import { invoiceItemEdit } from "~/server/api/invoice-item/procedures/invoice-item-edit";
import { invoiceItemsGetAll } from "~/server/api/invoice-item/procedures/invoice-item-get-all";
import { createTRPCRouter } from "~/server/api/trpc";

export const invoiceItemRouter = createTRPCRouter({
  create: invoiceItemCreate,
  edit: invoiceItemEdit,
  deleteById: invoiceItemDeleteById,
  getAll: invoiceItemsGetAll,
});
