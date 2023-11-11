import { invoiceTemplateCreate } from "~/server/api/invoice-template/procedures/invoice-template-create";
import { invoiceTemplateDeleteById } from "~/server/api/invoice-template/procedures/invoice-template-delete-by-id";
import { invoiceTemplateGetAll } from "~/server/api/invoice-template/procedures/invoice-template-get-all";
import { invoiceTemplateGetById } from "~/server/api/invoice-template/procedures/invoice-template-get-by-id";
import { createTRPCRouter } from "~/server/api/trpc";

export const invoiceTemplateRouter = createTRPCRouter({
  create: invoiceTemplateCreate,
  getById: invoiceTemplateGetById,
  getAll: invoiceTemplateGetAll,
  deleteById: invoiceTemplateDeleteById,
});
