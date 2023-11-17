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
  "invoice_issue_date",
  "invoice_supply_date",
  "invoice_date_of_payment",
  "invoice_due_date",
  "invoice_status",
  "invoice_payment_type",
  "invoice_number",
  "invoice_reference",
  "invoice_variable_symbol",
  "invoice_constant_symbol",
  "invoice_specific_symbol",
  "invoice_item_name",
  "invoice_item_quantity",
  "invoice_item_unit",
  "invoice_item_unit_price",
  "invoice_item_unit_price_without_vat",
  "invoice_item_total",
  "invoice_item_total_without_vat",
  "invoice_total",
  "invoice_total_without_vat",
  "invoice_vat",
  "invoice_vat_rate",
  "invoice_currency",
  "invoice_customer_name",
  "invoice_customer_address",
  "invoice_customer_city",
  "invoice_customer_zip",
  "invoice_customer_country",
  "invoice_customer_phone",
  "invoice_customer_email",
  "invoice_customer_business_id",
  "invoice_customer_tax_id",
  "invoice_customer_vat_id",
  "invoice_customer_bank_account",
  "invoice_customer_bank_code",
  "invoice_seller_name",
  "invoice_seller_address",
  "invoice_seller_city",
  "invoice_seller_zip",
  "invoice_seller_country",
  "invoice_seller_phone",
  "invoice_seller_email",
  "invoice_seller_business_id",
  "invoice_seller_tax_id",
  "invoice_seller_vat_id",
  "invoice_seller_bank_account",
  "invoice_seller_bank_code",
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
  value: InvoiceValue;
  style?: InvoiceTemplateStyle;
  if?: InvoiceVariable;
};
export type InvoiceTemplateViewComponent = {
  id: string;
  type: "view";
  style?: InvoiceTemplateStyle;
  children?: InvoiceTemplateChild[];
  if?: InvoiceVariable;
};

export type InvoiceTemplateImageComponent = {
  id: string;
  type: "image";
  src: string;
  style?: InvoiceTemplateStyle;
  if?: InvoiceVariable;
};

export type InvoiceTemplateListComponent = {
  id: string;
  type: "list";
  for: "invoice_items";
  style?: InvoiceTemplateStyle;
  item: InvoiceTemplateChild;
  if?: InvoiceVariable;
};

export const invoiceTemplateStyle = z.custom<InvoiceTemplateStyle>();

export const invoiceTemplateTextComponentSchema: z.ZodType<InvoiceTemplateTextComponent> =
  z.object({
    id: z.string(),
    type: z.literal("text"),
    value: invoiceVariableSchema,
    style: invoiceTemplateStyle.optional(),
    if: invoiceVariableSchema.optional(),
  });

export const invoiceTemplateViewComponentSchema: z.ZodType<InvoiceTemplateViewComponent> =
  z.object({
    id: z.string(),
    type: z.literal("view"),
    style: invoiceTemplateStyle.optional(),
    children: z.array(z.lazy(() => invoiceTemplateChildSchema)).optional(),
    if: invoiceVariableSchema.optional(),
  });

export const invoiceTemplateImageComponentSchema: z.ZodType<InvoiceTemplateImageComponent> =
  z.object({
    id: z.string(),
    type: z.literal("image"),
    src: z.string(),
    style: invoiceTemplateStyle.optional(),
    if: invoiceVariableSchema.optional(),
  });

export const invoiceTemplateListComponentSchema: z.ZodType<InvoiceTemplateListComponent> =
  z.object({
    id: z.string(),
    type: z.literal("list"),
    for: z.literal("invoice_items"),
    style: invoiceTemplateStyle.optional(),
    item: z.lazy(() => invoiceTemplateChildSchema),
    if: invoiceVariableSchema.optional(),
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
   * integer value in range 0 - 100
   */
  vatRate: z.number().int().min(0).max(100).optional(),
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
