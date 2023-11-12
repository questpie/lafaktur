import { type View } from "@react-pdf/renderer";
import { type ComponentProps } from "react";
import { z } from "zod";

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
  "{{invoice_issue_date}}",
  "{{invoice_supply_date}}",
  "{{invoice_date_of_payment}}",
  "{{invoice_due_date}}",
  "{{invoice_status}}",
  "{{invoice_payment_type}}",
  "{{invoice_number}}",
  "{{invoice_reference}}",
  "{{invoice_variable_symbol}}",
  "{{invoice_constant_symbol}}",
  "{{invoice_specific_symbol}}",
  "{{invoice_item_name}}",
  "{{invoice_item_quantity}}",
  "{{invoice_item_unit}}",
  "{{invoice_item_unit_price}}",
  "{{invoice_item_unit_price_without_vat}}",
  "{{invoice_item_total}}",
  "{{invoice_item_total_without_vat}}",
  "{{invoice_total}}",
  "{{invoice_total_without_vat}}",
  "{{invoice_vat}}",
  "{{invoice_vat_rate}}",
  "{{invoice_currency}}",
  "{{invoice_customer_name}}",
  "{{invoice_customer_address}}",
  "{{invoice_customer_city}}",
  "{{invoice_customer_zip}}",
  "{{invoice_customer_country}}",
  "{{invoice_customer_phone}}",
  "{{invoice_customer_email}}",
  "{{invoice_customer_business_id}}",
  "{{invoice_customer_tax_id}}",
  "{{invoice_customer_vat_id}}",
  "{{invoice_customer_bank_account}}",
  "{{invoice_customer_bank_code}}",
  "{{invoice_seller_name}}",
  "{{invoice_seller_address}}",
  "{{invoice_seller_city}}",
  "{{invoice_seller_zip}}",
  "{{invoice_seller_country}}",
  "{{invoice_seller_phone}}",
  "{{invoice_seller_email}}",
  "{{invoice_seller_business_id}}",
  "{{invoice_seller_tax_id}}",
  "{{invoice_seller_vat_id}}",
  "{{invoice_seller_bank_account}}",
  "{{invoice_seller_bank_code}}",
] as const);

export type InvoiceVariable = z.infer<typeof invoiceVariableSchema>;

export const invoiceValueSchema = z
  .string()
  .or(invoiceVariableSchema)
  .or(z.number())
  .or(z.date());

export type InvoiceValue = z.infer<typeof invoiceValueSchema>;

export const invoiceTemplateSectionItemSchema = z.object({
  id: z.string(),
  label: invoiceValueSchema.optional(),
  value: invoiceValueSchema.or(z.array(invoiceValueSchema)),
  labelStyle: z.custom<ComponentProps<typeof View>["style"]>(),
  valueStyle: z.custom<ComponentProps<typeof View>["style"]>(),
  wrapperStyle: z.custom<ComponentProps<typeof View>["style"]>(),
});
export type InvoiceTemplateSectionItem = z.infer<
  typeof invoiceTemplateSectionItemSchema
>;

export const invoiceTemplateSectionSchema = z.object({
  id: z.string(),
  style: z.custom<ComponentProps<typeof View>["style"]>(),
  items: z.array(invoiceTemplateSectionItemSchema),
});

export type InvoiceTemplateSection = z.infer<
  typeof invoiceTemplateSectionSchema
>;

export const invoiceTemplateDataSchema = z.object({
  heading: invoiceValueSchema.optional(),
  subheading: invoiceValueSchema.optional(),
  logo: z.string().optional(),
  header: invoiceTemplateSectionSchema,
  customer: invoiceTemplateSectionSchema,
  seller: invoiceTemplateSectionSchema,
  legal: invoiceTemplateSectionSchema,
  items: invoiceTemplateSectionSchema,
  totals: invoiceTemplateSectionSchema,
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

export const DEFAULT_TEMPLATE: InvoiceTemplateData = {
  currency: "EUR",
  dateFormat: "DD.MM.YYYY",
  heading: "Invoice #{{invoice_number}}",
  subheading: "Reference: {{invoice_reference}}",
  header: {
    id: "header",
    style: {
      flexDirection: "column",
      fontSize: "8px",
      gap: "4px",
    },
    items: [
      {
        id: "invoice_issue_date",
        label: "Date of issue",
        value: "{{invoice_issue_date}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
      {
        id: "invoice_due_date",
        label: "Due date",
        value: "{{invoice_due_date}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
      {
        id: "header_space",
        label: "",
        value: "",
        wrapperStyle: { marginTop: "8px" },
      },
      {
        id: "invoice_payment_type",
        label: "Payment type",
        value: "{{invoice_payment_type}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
      {
        id: "invoice_variable_symbol",
        label: "Variable symbol",
        value: "{{invoice_variable_symbol}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
      {
        id: "invoice_constant_symbol",
        label: "Constant symbol",
        value: "{{invoice_constant_symbol}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
      {
        id: "invoice_seller_bank_account",
        label: "Bank account",
        value: "{{invoice_seller_bank_account}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
      {
        id: "invoice_seller_bank_code",
        label: "Bank code",
        value: "{{invoice_seller_bank_code}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
    ],
  },
  customer: {
    id: "customer",
    style: {
      flex: 1,
      flexDirection: "column",
      fontSize: "8px",
      gap: "4px",
    },
    items: [
      {
        id: "bill_to",
        label: "Bill to",
        wrapperStyle: {
          flexDirection: "column",
        },
        labelStyle: {
          fontFamily: "Helvetica-Bold",
        },
        value: [
          "{{invoice_customer_name}}",
          "{{invoice_customer_address}}",
          `{{invoice_customer_zip}}, {{invoice_customer_city}}`,
          "{{invoice_customer_country}}",
        ],
      },
      {
        id: "bill_to_business_id",
        label: "Business ID",
        value: "{{invoice_customer_business_id}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
      {
        id: "bill_to_tax_id",
        label: "Tax ID",
        value: "{{invoice_customer_tax_id}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
      {
        id: "bill_to_vat_id",
        label: "VAT ID",
        value: "{{invoice_customer_vat_id}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
    ],
  },
  seller: {
    id: "seller",
    style: {
      flex: 1,
      flexDirection: "column",
      fontSize: "8px",
      gap: "4px",
    },
    items: [
      {
        id: "seller",
        label: "Seller",
        wrapperStyle: {
          flex: 1,
          flexDirection: "column",
          gap: "2px",
        },
        labelStyle: {
          fontFamily: "Helvetica-Bold",
        },
        value: [
          "{{invoice_seller_name}}",
          "{{invoice_seller_address}}",
          `{{invoice_seller_zip}}, {{invoice_seller_city}}`,
          "{{invoice_seller_country}}",
        ],
      },
      {
        id: "seller_business_id",
        label: "Business ID",
        value: "{{invoice_seller_business_id}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
      {
        id: "seller_tax_id",
        label: "Tax ID",
        value: "{{invoice_seller_tax_id}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
      {
        id: "seller_vat_id",
        label: "VAT ID",
        value: "{{invoice_seller_vat_id}}",
        wrapperStyle: { flexDirection: "row", gap: "4px" },
        labelStyle: { flex: 1 },
        valueStyle: { flex: 1 },
      },
    ],
  },
  items: {
    id: "items",
    items: [
      {
        id: "invoice_item_quantity",
        label: "Quantity",
        value: "{{invoice_item_quantity}} {{invoice_item_unit}}",
      },
      {
        id: "invoice_item_name",
        label: "Item",
        value: "{{invoice_item_name}}",
      },
      {
        id: "invoice_item_unit_price",
        label: "Unit price",
        value: "{{invoice_item_unit_price}}",
      },
      {
        id: "invoice_item_total",
        label: "Total",
        value: "",
      },
    ],
  },
  totals: {
    id: "totals",
    items: [
      {
        id: "invoice_total",
        label: "Total amount to pay",
        value: "{{invoice_total}}",
      },
    ],
  },
  legal: {
    id: "legal",
    items: [
      {
        id: "legal",
        value: "Legal",
      },
    ],
  },
  vatIncluded: false,
};
