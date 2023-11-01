import { type StringWithAutocomplete } from "~/types/misc-types";

export const INVOICE_CURRENCIES = [
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
] as const;

export const INVOICE_DATE_FORMATS = [
  "DD.MM.YYYY",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "MM-DD-YYYY",
  "YYYY-MM-DD",
  "YYYY/MM/DD",
  "YYYY.MM.DD",
] as const;

export type InvoiceCurrency = (typeof INVOICE_CURRENCIES)[number];
export type InvoiceDateFormat = (typeof INVOICE_DATE_FORMATS)[number];

export type InvoiceTemplateData = {
  heading?: StringWithAutocomplete<InvoiceValue>;
  subheading?: StringWithAutocomplete<InvoiceValue>;
  logo?: string;

  header: SectionDataItem[];
  customer: SectionDataItem[];
  seller: SectionDataItem[];
  legal: SectionDataItem[];
  items: SectionDataItem[];
  totals: SectionDataItem[];

  currency: InvoiceCurrency;
  dateFormat: InvoiceDateFormat;
  unitLabels?: Record<UnitType, string>;
  paymentTypeLabels?: Record<InvoicePaymentType, string>;

  /**
   * integer value in range 0 - 100
   */
  vatRate?: number;
  /**
   * If true, we will calculate VAT from price
   * so total = price_with_vat + price_with_vat * vatRate
   * If false, we will calculate VAT from price
   * so total = price_without_vat
   * If vatRate is not set, we will not calculate VAT
   * so total = price
   * @default false
   */
  vatIncluded?: boolean;
};

export type UnitType = StringWithAutocomplete<
  "hour" | "day" | "month" | "year" | "item"
>;

export const INVOICE_STATUS = ["draft", "sent", "paid", "overdue"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUS)[number];
export type InvoicePaymentType =
  | "bank_transfer"
  | "cash"
  | "credit_card"
  | "paypal"
  | "stripe"
  | "other";

export const INVOICE_VARIABLES = [
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
] as const;

export type InvoiceVariable = (typeof INVOICE_VARIABLES)[number];
export type FormatType = "text" | "number" | "date" | "price";
export type InvoiceValue =
  | StringWithAutocomplete<`{{${InvoiceVariable}}}`>
  | number
  | Date;

export type SectionDataItem = {
  id: string;
  format?: FormatType;
  label?: string;
  value?: InvoiceValue | InvoiceValue[];
};

export const DEFAULT_TEMPLATE: InvoiceTemplateData = {
  currency: "EUR",
  dateFormat: "DD.MM.YYYY",
  heading: "Invoice #{{invoice_number}}",
  subheading: "Reference: {{invoice_reference}}",
  header: [
    {
      id: "invoice_issue_date",
      label: "Date of issue",
      format: "date",
      value: "{{invoice_issue_date}}",
    },
    {
      id: "invoice_due_date",
      label: "Due date",
      format: "date",
      value: "{{invoice_due_date}}",
    },
    {
      id: "header_space",
      label: "",
      value: "",
    },
    {
      id: "invoice_payment_type",
      label: "Payment type",
      value: "{{invoice_payment_type}}",
    },
    {
      id: "invoice_variable_symbol",
      label: "Variable symbol",
      value: "{{invoice_variable_symbol}}",
    },
    {
      id: "invoice_constant_symbol",
      label: "Constant symbol",
      value: "{{invoice_constant_symbol}}",
    },
    {
      id: "invoice_seller_bank_account",
      label: "Bank account",
      value: "{{invoice_seller_bank_account}}",
    },
    {
      id: "invoice_seller_bank_code",
      label: "Bank code",
      value: "{{invoice_seller_bank_code}}",
    },
  ],
  customer: [
    {
      id: "bill_to",
      label: "Bill to",
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
    },
    {
      id: "bill_to_tax_id",
      label: "Tax ID",
      value: "{{invoice_customer_tax_id}}",
    },
    {
      id: "bill_to_vat_id",
      label: "VAT ID",
      value: "{{invoice_customer_vat_id}}",
    },
  ],
  seller: [
    {
      id: "seller",
      label: "Seller",
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
    },
    {
      id: "seller_tax_id",
      label: "Tax ID",
      value: "{{invoice_seller_tax_id}}",
    },
    {
      id: "seller_vat_id",
      label: "VAT ID",
      value: "{{invoice_seller_vat_id}}",
    },
  ],
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
    },
  ],
  totals: [
    {
      id: "invoice_total",
      label: "Total amount to pay",
      value: "{{invoice_total}}",
    },
  ],
  legal: [
    {
      id: "legal",
      value: "Legal",
    },
  ],
};
