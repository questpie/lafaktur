import { z } from "zod";
import {
  type InvoiceInsert,
  type InvoiceItemInsert,
} from "~/server/db/db-schema";
import { invoiceCurrencySchema } from "~/shared/invoice-template/invoice-template-schemas";

export const invoiceItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  unit: z.string(),

  quantity: z.number().min(0),
  unitPrice: z.number().min(0),

  total: z.number().min(0),

  /** recomputed before insert */
  unitPriceWithoutVat: z.number().min(0),
  /** recomputed before insert */
  totalWithoutVat: z.number().min(0),
  /** recomputed before insert */
  vatRate: z.number().min(0),

  order: z.number().min(0),

  invoiceId: z.number(),
}) satisfies z.ZodType<Omit<InvoiceItemInsert, "unitPrice" | "total">>;

export const invoiceSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  customerName: z.string(),
  customerStreet: z.string().nullable(),
  customerCity: z.string().nullable(),
  customerZip: z.string().nullable(),
  customerCountry: z.string().nullable(),
  customerBankAccount: z.string().nullable(),
  customerBankCode: z.string().nullable(),
  customerBusinessId: z.string().nullish(),
  customerTaxId: z.string().nullish(),
  customerVatId: z.string().nullish(),

  issueDate: z.date(),
  dueDate: z.date(),
  supplyDate: z.date().nullish(),

  number: z.string(),
  reference: z.string(),
  specificSymbol: z.string().nullish(),
  variableSymbol: z.string().nullish(),
  constantSymbol: z.string().nullish(),
  paymentMethod: z.string(),

  currency: invoiceCurrencySchema.default("EUR"),

  organizationId: z.number(),
  supplierName: z.string(),
  supplierStreet: z.string().nullish(),
  supplierCity: z.string().nullish(),
  supplierZip: z.string().nullish(),
  supplierCountry: z.string().nullish(),
  supplierVatId: z.string().nullish(),
  supplierBankAccount: z.string().nullish(),
  supplierBankCode: z.string().nullish(),
  supplierBusinessId: z.string().nullish(),
  supplierTaxId: z.string().nullish(),

  templateId: z.number(),

  /** recomputed before insert */
  total: z.number().min(0),
  /** recomputed before insert */
  totalWithoutVat: z.number().min(0),

  invoiceItems: z.array(invoiceItemSchema.omit({ invoiceId: true, id: true })),
}) satisfies z.ZodType<
  Omit<InvoiceInsert, "status" | "total" | "totalWithoutVat">
>;

export const editInvoiceSchema = invoiceSchema
  .partial()
  .required({ organizationId: true, id: true });