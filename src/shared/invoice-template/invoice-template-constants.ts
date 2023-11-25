import { nanoid } from "nanoid";
import {
  type InvoiceTemplateData,
  type InvoiceVariable,
} from "~/shared/invoice-template/invoice-template-schemas";

export const DEFAULT_TEMPLATE: InvoiceTemplateData = {
  currency: "EUR",
  dateFormat: "DD.MM.YYYY",
  content: {
    id: nanoid(),
    type: "root",
    style: {
      display: "flex",
      fontFamily: "Helvetica",
      position: "relative",
      flexDirection: "column",
      fontSize: "11px",
      gap: "32px",
      color: "#000",
      backgroundColor: "#fff",
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
          paddingHorizontal: "1.5cm",
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
          paddingLeft: "1.5cm",
          paddingRight: "1.5cm",
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
                    if: "invoice_customer_vat_id",
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
                    if: "invoice_seller_vat_id",
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

// TODO: translate
export const INVOICE_VARIABLE_LABELS: Record<InvoiceVariable, string> = {
  invoice_issue_date: "Invoice issue date",
  invoice_supply_date: "Invoice supply date",
  invoice_date_of_payment: "Invoice date of payment",
  invoice_due_date: "Invoice due date",
  invoice_status: "Invoice status",
  invoice_payment_type: "Invoice payment type",
  invoice_number: "Invoice number",
  invoice_reference: "Invoice reference",
  invoice_variable_symbol: "Invoice variable symbol",
  invoice_constant_symbol: "Invoice constant symbol",
  invoice_specific_symbol: "Invoice specific symbol",
  invoice_item_name: "Invoice item name",
  invoice_item_quantity: "Invoice item quantity",
  invoice_item_unit: "Invoice item unit",
  invoice_item_unit_price: "Invoice item unit price",
  invoice_item_unit_price_without_vat: "Invoice item unit price without VAT",
  invoice_item_total: "Invoice item total",
  invoice_item_total_without_vat: "Invoice item total without VAT",
  invoice_total: "Invoice total",
  invoice_total_without_vat: "Invoice total without VAT",
  invoice_vat: "Invoice VAT",
  invoice_vat_rate: "Invoice VAT rate",
  invoice_currency: "Invoice currency",
  invoice_customer_name: "Invoice customer name",
  invoice_customer_address: "Invoice customer address",
  invoice_customer_city: "Invoice customer city",
  invoice_customer_zip: "Invoice customer ZIP",
  invoice_customer_country: "Invoice customer country",
  invoice_customer_phone: "Invoice customer phone",
  invoice_customer_email: "Invoice customer email",
  invoice_customer_business_id: "Invoice customer business ID",
  invoice_customer_tax_id: "Invoice customer tax ID",
  invoice_customer_vat_id: "Invoice customer VAT ID",
  invoice_customer_bank_account: "Invoice customer bank account",
  invoice_customer_bank_code: "Invoice customer bank code",
  invoice_seller_name: "Invoice seller name",
  invoice_seller_address: "Invoice seller address",
  invoice_seller_city: "Invoice seller city",
  invoice_seller_zip: "Invoice seller ZIP",
  invoice_seller_country: "Invoice seller country",
  invoice_seller_phone: "Invoice seller phone",
  invoice_seller_email: "Invoice seller email",
  invoice_seller_business_id: "Invoice seller business ID",
  invoice_seller_tax_id: "Invoice seller tax ID",
  invoice_seller_vat_id: "Invoice seller VAT ID",
  invoice_seller_bank_account: "Invoice seller bank account",
  invoice_seller_bank_code: "Invoice seller bank code",
};
