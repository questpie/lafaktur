import { authRouter } from "~/server/api/auth/auth-router";
import { invoiceTemplateRouter } from "~/server/api/invoice-template/invoice-template.router";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  invoiceTemplate: invoiceTemplateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
