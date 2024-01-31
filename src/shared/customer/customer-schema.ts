import { z } from "zod";

export const createCustomerSchema = z.object({
  organizationId: z.number(),
  name: z.string(),
  street: z.string().nullish(),
  city: z.string().nullish(),
  zip: z.string().nullish(),
  country: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().email().nullish(),
  businessId: z.string().nullish(),
  taxId: z.string().nullish(),
  vatId: z.string().nullish(),
  bankAccount: z.string().nullish(),
  bankCode: z.string().nullish(),
});

export const editCustomerSchema = createCustomerSchema.extend({
  id: z.number(),
});
