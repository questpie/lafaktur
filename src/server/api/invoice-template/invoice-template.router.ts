import { invoiceTemplateCreate } from "~/server/api/invoice-template/procedures/invoice-template-create";
import { createTRPCRouter } from "~/server/api/trpc";

export const invoiceTemplateRouter = createTRPCRouter({
  create: invoiceTemplateCreate,
});
