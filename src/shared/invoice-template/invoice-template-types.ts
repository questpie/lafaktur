import type ReactPDF from "@react-pdf/renderer";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  type FromUnion,
  type StringWithAutocomplete,
  type UnionWithout,
} from "~/types/misc-types";

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

export type InvoiceValue = StringWithAutocomplete<
  z.infer<typeof invoiceVariableSchema>
>;

export type InvoiceTemplateStyle = ReactPDF.Styles[keyof ReactPDF.Styles];
export type InvoiceTemplateComponent =
  | {
      id: string;
      type: "text";
      value: InvoiceValue;
      style?: InvoiceTemplateStyle;
      if?: InvoiceVariable;
    }
  | {
      id: string;
      type: "view";
      style?: InvoiceTemplateStyle;
      children?: UnionWithout<InvoiceTemplateComponent, "type", "page">[];
      if?: InvoiceVariable;
    }
  | {
      id: string;
      type: "image";
      src: string;
      style?: InvoiceTemplateStyle;
      if?: InvoiceVariable;
    }
  | {
      id: string;
      type: "list";
      for: "invoice_items";
      style?: InvoiceTemplateStyle;
      item: UnionWithout<InvoiceTemplateComponent, "type", "page">;
      if?: InvoiceVariable;
    }
  | {
      id: string;
      type: "page";
      style: InvoiceTemplateStyle;
      children: UnionWithout<InvoiceTemplateComponent, "type", "page">[];
    };

export const invoiceTemplateDataSchema = z.object({
  content: z.custom<FromUnion<InvoiceTemplateComponent, "type", "page">>(),

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
  content: {
    id: nanoid(),
    type: "page",
    style: {
      display: "flex",
      fontFamily: "Helvetica",
      position: "relative",
      flexDirection: "column",
      fontSize: "11px",
      gap: "32px",
    },
    children: [
      {
        id: nanoid(),
        type: "view",
        style: {
          display: "flex",
          marginTop: "1cm",
          flexDirection: "row",
          gap: "16px",
          marginHorizontal: "1.5cm",
        },
        children: [
          {
            id: nanoid(),
            type: "view",
            style: { display: "flex", flex: 1 },
            children: [{ id: nanoid(), type: "text", value: "logo" }],
          },
          {
            id: nanoid(),
            type: "view",
            style: {
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: "2px",
            },
            children: [
              {
                id: nanoid(),
                type: "text",
                value: "Invoice #{{invoice_number}}",
                style: { display: "flex", fontFamily: "Helvetica-Bold" },
              },
              {
                id: nanoid(),
                type: "text",
                value: "Reference: {{invoice_reference}}",
                style: {
                  display: "flex",
                  marginBottom: "8px",
                  fontFamily: "Helvetica-Bold",
                },
              },
              {
                id: nanoid(),
                type: "view",
                style: {
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "8px",
                  gap: "4px",
                },
                children: [
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Date of issue",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_issue_date}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                      marginBottom: "8px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Due date",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_due_date}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Date of issue",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_payment_type}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Variable symbol",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_variable_symbol}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Constant symbol",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_constant_symbol}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Bank account",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_seller_bank_account}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Bank Code",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_seller_bank_code}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: nanoid(),
        type: "view",
        style: {
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          marginHorizontal: "1.5cm",
        },
        children: [
          {
            id: nanoid(),
            type: "view",
            style: {
              display: "flex",
              flex: 1,
              flexDirection: "column",
              fontSize: "8px",
              gap: "4px",
            },
            children: [
              {
                id: nanoid(),
                type: "view",
                style: { display: "flex", flexDirection: "column", gap: "2px" },
                children: [
                  {
                    id: nanoid(),
                    type: "text",
                    value: "Bill To",
                    style: { display: "flex", fontFamily: "Helvetica-Bold" },
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: "{{invoice_customer_name}}",
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: "{{invoice_customer_address}}",
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: `{{invoice_customer_zip}}, {{invoice_customer_city}}`,
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: `{{invoice_customer_country}}`,
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Business ID",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_customer_business_id}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Tax ID",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_customer_tax_id}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    if: "{{invoice_customer_vat_id}}",
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "VAT ID",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_customer_vat_id}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: nanoid(),
            type: "view",
            style: {
              display: "flex",
              flex: 1,
              flexDirection: "column",
              fontSize: "8px",
              gap: "4px",
            },
            children: [
              {
                id: nanoid(),
                type: "view",
                style: { display: "flex", flexDirection: "column", gap: "2px" },
                children: [
                  {
                    id: nanoid(),
                    type: "text",
                    value: "Seller",
                    style: { display: "flex", fontFamily: "Helvetica-Bold" },
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: "{{invoice_seller_name}}",
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: "{{invoice_seller_address}}",
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: `{{invoice_seller_zip}}, {{invoice_seller_city}}`,
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: `{{invoice_seller_country}}`,
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Business ID",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_seller_business_id}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "Tax ID",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_seller_tax_id}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    type: "view",
                    style: {
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px",
                    },
                    if: "{{invoice_seller_vat_id}}",
                    children: [
                      {
                        id: nanoid(),
                        type: "text",
                        value: "VAT ID",
                        style: { display: "flex", flex: 1 },
                      },
                      {
                        id: nanoid(),
                        type: "text",
                        value: "{{invoice_seller_vat_id}}",
                        style: { display: "flex", flex: 1 },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  vatIncluded: false,
};
