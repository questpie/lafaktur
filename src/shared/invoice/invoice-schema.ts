import { z } from "zod";
import { type InvoiceInsert, type InvoiceItemInsert } from "~/server/db/schema";
import { invoiceCurrencySchema } from "~/shared/invoice-template/invoice-template-schemas";

export const createInvoiceItemSchema = z.object({
  name: z.string(),
  quantity: z.number().min(0),
  unit: z.string(),

  unitPrice: z.number().min(0),
  unitPriceWithoutVat: z.number().min(0),

  total: z.number().min(0),
  totalWithoutVat: z.number().min(0),

  vatRate: z.number().min(0),

  invoiceId: z.number(),
  // TODO: probably rework vat system and make it per item not per invoice
}) satisfies z.ZodType<InvoiceItemInsert>;

export const createInvoiceSchema = z.object({
  customerId: z.number(),
  customerName: z.string(),
  customerStreet: z.string().nullable(),
  customerCity: z.string().nullable(),
  customerZip: z.string().nullable(),
  customerCountry: z.string().nullable(),
  customerBankAccount: z.string().nullable(),
  customerBankCode: z.string().nullable(),
  customerBusinessId: z.string().nullable(),
  customerTaxId: z.string().nullable(),
  customerVatId: z.string().nullable(),

  issueDate: z.date(),
  dueDate: z.date(),
  supplyDate: z.date().nullable(),

  number: z.string(),
  reference: z.string(),
  specificSymbol: z.string().nullable(),
  variableSymbol: z.string().nullable(),
  constantSymbol: z.string().nullable(),
  paymentMethod: z.string(),

  currency: invoiceCurrencySchema.default("EUR"),

  organizationId: z.number(),
  supplierName: z.string(),
  supplierStreet: z.string().nullable(),
  supplierCity: z.string().nullable(),
  supplierZip: z.string().nullable(),
  supplierCountry: z.string().nullable(),
  supplierVatId: z.string().nullable(),
  supplierBankAccount: z.string().nullable(),
  supplierBankCode: z.string().nullable(),
  supplierBusinessId: z.string().nullable(),
  supplierTaxId: z.string().nullable(),

  templateId: z.number().nullable(),

  total: z.number().min(0),
  totalWithoutVat: z.number().min(0),

  invoiceItems: z.array(createInvoiceItemSchema.omit({ invoiceId: true })),
}) satisfies z.ZodType<Omit<InvoiceInsert, "status">>;
