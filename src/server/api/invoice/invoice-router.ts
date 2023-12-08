import { invoiceCreate } from "~/server/api/invoice/procedures/invoice-create";
import { createTRPCRouter } from "~/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  create: invoiceCreate,
});
