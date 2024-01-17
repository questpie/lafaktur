import type ReactPDF from "@react-pdf/renderer";
import { z } from "zod";
import { type StringWithAutocomplete } from "~/types/misc-types";

export const invoiceCurrencySchema = z.enum([
  "EUR",
  "USD",
  "GBP",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "JPY",
  "NZD",
  "SEK",
  "KRW",
  "SGD",
  "NOK",
  "MXN",
  "INR",
  "RUB",
  "ZAR",
  "TRY",
  "BRL",
  "TWD",
  "DKK",
  "PLN",
  "CZK",
  "HKD",
  "HUF",
  "ILS",
  "THB",
  "CLP",
  "PHP",
  "AED",
  "COP",
  "SAR",
  "MYR",
  "RON",
] as const);
export const invoiceDateFormatSchema = z.enum([
  "DD.MM.YYYY",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "MM-DD-YYYY",
  "YYYY-MM-DD",
  "YYYY/MM/DD",
  "YYYY.MM.DD",
] as const);

export type InvoiceCurrency = z.infer<typeof invoiceCurrencySchema>;
export type InvoiceDateFormat = z.infer<typeof invoiceDateFormatSchema>;

export const unitTypeSchema = z.enum(["hour", "day", "month", "year", "item"]);
export type UnitType = z.infer<typeof unitTypeSchema>;

export const invoiceStatusSchema = z.enum([
  "draft",
  "sent",
  "paid",
  "overdue",
] as const);
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

export const invoicePaymentTypeSchema = z.enum([
  "bank_transfer",
  "cash",
  "credit_card",
  "paypal",
  "stripe",
  "other",
] as const);
export type InvoicePaymentType = z.infer<typeof invoicePaymentTypeSchema>;

export const invoiceVariableSchema = z.enum([
  "issue_date",
  "supply_date",
  "date_of_payment",
  "due_date",
  "status",
  "payment_method",
  "number",
  "reference",
  "variable_symbol",
  "constant_symbol",
  "specific_symbol",
  "invoice_items_name",
  "invoice_items_quantity",
  "invoice_items_unit",
  "invoice_items_unit_price",
  "invoice_items_unit_price_without_vat",
  "invoice_items_total",
  "invoice_items_total_without_vat",
  "total",
  "total_without_vat",
  "vat",
  "vat_rate",
  "currency",
  "customer_name",
  "customer_address",
  "customer_city",
  "customer_zip",
  "customer_country",
  "customer_phone",
  "customer_email",
  "customer_business_id",
  "customer_tax_id",
  "customer_vat_id",
  "customer_bank_account",
  "customer_bank_code",
  "supplier_name",
  "supplier_address",
  "supplier_city",
  "supplier_zip",
  "supplier_country",
  "supplier_phone",
  "supplier_email",
  "supplier_business_id",
  "supplier_tax_id",
  "supplier_vat_id",
  "supplier_bank_account",
  "supplier_bank_code",
] as const);

export type InvoiceVariable = z.infer<typeof invoiceVariableSchema>;

export type InvoiceValue = StringWithAutocomplete<`{{${z.infer<
  typeof invoiceVariableSchema
>}}}`>;

export type InvoiceTemplateStyle = ReactPDF.Styles[keyof ReactPDF.Styles];

export const invoiceTemplateComponentTypeSchema = z.enum([
  "text",
  "view",
  "image",
  "list",
]);

export type InvoiceTemplateTextComponent = {
  id: string;
  type: "text";
  if?: InvoiceVariable;

  value?: InvoiceValue;
  style?: InvoiceTemplateStyle;
};
export type InvoiceTemplateViewComponent = {
  id: string;
  type: "view";
  style?: InvoiceTemplateStyle;
  if?: InvoiceVariable;

  children?: InvoiceTemplateChild[];
};

export type InvoiceTemplateImageComponent = {
  id: string;
  type: "image";
  style?: InvoiceTemplateStyle;
  if?: InvoiceVariable;

  src: string;
};

export type InvoiceTemplateListComponent = {
  id: string;
  type: "list";
  style?: InvoiceTemplateStyle;
  if?: InvoiceVariable;

  mapBy: "invoice_items";
  item: InvoiceTemplateChild;
};

export const invoiceTemplateStyle = z.custom<InvoiceTemplateStyle>();

export const invoiceTemplateTextComponentSchema: z.ZodType<InvoiceTemplateTextComponent> =
  z.object({
    id: z.string(),
    type: z.literal("text"),
    style: invoiceTemplateStyle.optional(),
    if: invoiceVariableSchema.optional(),

    value: z.union([invoiceVariableSchema, z.string()]).default(""),
  });

export const invoiceTemplateViewComponentSchema: z.ZodType<InvoiceTemplateViewComponent> =
  z.object({
    id: z.string(),
    type: z.literal("view"),
    style: invoiceTemplateStyle.optional(),
    if: invoiceVariableSchema.optional(),

    children: z.array(z.lazy(() => invoiceTemplateChildSchema)).optional(),
  });

export const invoiceTemplateImageComponentSchema: z.ZodType<InvoiceTemplateImageComponent> =
  z.object({
    id: z.string(),
    type: z.literal("image"),
    style: invoiceTemplateStyle.optional(),
    if: invoiceVariableSchema.optional(),

    src: z.string(),
  });

export const invoiceTemplateListComponentSchema: z.ZodType<InvoiceTemplateListComponent> =
  z.object({
    id: z.string(),
    type: z.literal("list"),
    style: invoiceTemplateStyle.optional(),
    if: invoiceVariableSchema.optional(),

    mapBy: z.literal("invoice_items"),
    item: z.lazy(() => invoiceTemplateChildSchema),
  });

export const invoiceTemplateChildSchema = z.union([
  invoiceTemplateTextComponentSchema,
  invoiceTemplateViewComponentSchema,
  invoiceTemplateImageComponentSchema,
  invoiceTemplateListComponentSchema,
]);

export type InvoiceTemplateChild = z.infer<typeof invoiceTemplateChildSchema>;

export const invoiceTemplateContentRoot = z.object({
  id: z.string(),
  type: z.literal("root"),
  style: invoiceTemplateStyle.optional(),
  children: z.array(invoiceTemplateChildSchema),
});

export type InvoiceTemplateContentRoot = z.infer<
  typeof invoiceTemplateContentRoot
>;

export const invoiceTemplateComponentSchema = z.union([
  invoiceTemplateChildSchema,
  invoiceTemplateContentRoot,
]);

export type InvoiceTemplateComponent = z.infer<
  typeof invoiceTemplateComponentSchema
>;

export const invoiceTemplateDataSchema = z.object({
  content: invoiceTemplateContentRoot,

  currency: invoiceCurrencySchema.default("EUR"),
  dateFormat: invoiceDateFormatSchema.default("DD.MM.YYYY"),
  // unitLabels?: { [key in UnitType]: string };
  // paymentTypeLabels?: { [key in InvoicePaymentType]: string };
  unitLabels: z.record(unitTypeSchema, z.string()).optional(),
  paymentTypeLabels: z.record(invoicePaymentTypeSchema, z.string()).optional(),

  /**
   * If true, we will calculate VAT from price
   * so total = price_with_vat + price_with_vat * vatRate
   * If false, we will calculate VAT from price
   * so total = price_without_vat
   * If vatRate is not set, we will not calculate VAT
   * so total = price
   * @default false
   */
  vatIncluded: z.boolean().default(false),
});

export type InvoiceTemplateData = z.infer<typeof invoiceTemplateDataSchema>;
