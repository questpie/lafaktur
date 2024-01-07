import { authRouter } from "~/server/api/auth/auth-router";
import { customerRouter } from "~/server/api/customer/customer-router";
import { invoiceTemplateRouter } from "~/server/api/invoice-template/invoice-template-router";
import { invoiceRouter } from "~/server/api/invoice/invoice-router";
import { organizationRouter } from "~/server/api/organization/organization-router";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  customer: customerRouter,
  invoice: invoiceRouter,
  invoiceTemplate: invoiceTemplateRouter,
  organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
