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
                value: "Invoice #{{number}}",
                style: { display: "flex", fontFamily: "Helvetica-Bold" },
              },
              {
                id: nanoid(),
                type: "text",
                value: "Reference: {{reference}}",
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
                        value: "{{issue_date}}",
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
                        value: "{{due_date}}",
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
                        value: "{{payment_method}}",
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
                        value: "{{variable_symbol}}",
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
                        value: "{{constant_symbol}}",
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
                        value: "{{supplier_bank_account}}",
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
                        value: "{{supplier_bank_code}}",
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
                    value: "{{customer_name}}",
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: "{{customer_address}}",
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: `{{customer_zip}}, {{customer_city}}`,
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: `{{customer_country}}`,
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
                        value: "{{customer_business_id}}",
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
                        value: "{{customer_tax_id}}",
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
                    if: "customer_vat_id",
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
                        value: "{{customer_vat_id}}",
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
                    value: "supplier",
                    style: { display: "flex", fontFamily: "Helvetica-Bold" },
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: "{{supplier_name}}",
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: "{{supplier_address}}",
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: `{{supplier_zip}}, {{supplier_city}}`,
                  },
                  {
                    id: nanoid(),
                    type: "text",
                    value: `{{supplier_country}}`,
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
                        value: "{{supplier_business_id}}",
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
                        value: "{{supplier_tax_id}}",
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
                    if: "supplier_vat_id",
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
                        value: "{{supplier_vat_id}}",
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
        type: "list",
        mapBy: "invoice_items",
        item: {
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
              type: "text",
              value: "{{invoice_items_unit}}",
            },
            {
              id: nanoid(),
              type: "text",
              value: "{{invoice_items_quantity}}",
            },
            {
              id: nanoid(),
              type: "text",
              value: "{{invoice_items_name}}",
              style: { flex: 1 },
            },
            {
              id: nanoid(),
              type: "text",
              value: "{{invoice_items_unit_price}}",
            },
            {
              id: nanoid(),
              type: "text",
              value: "{{invoice_items_total}}",
            },
          ],
        },
      },
      {
        id: nanoid(),
        type: "view",
        style: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingRight: "1.5cm",
        },
        children: [
          {
            id: nanoid(),
            type: "view",
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            },
            children: [
              {
                id: nanoid(),
                type: "text",
                value: "Total {{total}}",
                style: {
                  fontFamily: "Helvetica-Bold",
                  fontSize: "14px",
                },
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
  issue_date: "Invoice issue date",
  supply_date: "Invoice supply date",
  date_of_payment: "Invoice date of payment",
  due_date: "Invoice due date",
  status: "Invoice status",
  payment_method: "Invoice payment type",
  number: "Invoice number",
  reference: "Invoice reference",
  variable_symbol: "Invoice variable symbol",
  constant_symbol: "Invoice constant symbol",
  specific_symbol: "Invoice specific symbol",
  invoice_items_name: "Invoice item name",
  invoice_items_quantity: "Invoice item quantity",
  invoice_items_unit: "Invoice item unit",
  invoice_items_unit_price: "Invoice item unit price",
  invoice_items_unit_price_without_vat: "Invoice item unit price without VAT",
  invoice_items_total: "Invoice item total",
  invoice_items_total_without_vat: "Invoice item total without VAT",
  total: "Invoice total",
  total_without_vat: "Invoice total without VAT",
  vat: "Invoice VAT",
  vat_rate: "Invoice VAT rate",
  currency: "Invoice currency",
  customer_name: "Invoice customer name",
  customer_address: "Invoice customer address",
  customer_city: "Invoice customer city",
  customer_zip: "Invoice customer ZIP",
  customer_country: "Invoice customer country",
  customer_phone: "Invoice customer phone",
  customer_email: "Invoice customer email",
  customer_business_id: "Invoice customer business ID",
  customer_tax_id: "Invoice customer tax ID",
  customer_vat_id: "Invoice customer VAT ID",
  customer_bank_account: "Invoice customer bank account",
  customer_bank_code: "Invoice customer bank code",
  supplier_name: "Invoice supplier name",
  supplier_address: "Invoice supplier address",
  supplier_city: "Invoice supplier city",
  supplier_zip: "Invoice supplier ZIP",
  supplier_country: "Invoice supplier country",
  supplier_phone: "Invoice supplier phone",
  supplier_email: "Invoice supplier email",
  supplier_business_id: "Invoice supplier business ID",
  supplier_tax_id: "Invoice supplier tax ID",
  supplier_vat_id: "Invoice supplier VAT ID",
  supplier_bank_account: "Invoice supplier bank account",
  supplier_bank_code: "Invoice supplier bank code",
};
