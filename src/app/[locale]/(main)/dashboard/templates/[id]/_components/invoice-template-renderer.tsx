"use client";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { type InvoiceTemplate } from "~/server/db/schema";
import {
  type InvoiceTemplateSectionItem,
  type InvoiceValue,
} from "~/shared/invoice-template/invoice-template-types";

type InvoiceTemplateRenderer = {
  invoiceTemplate: InvoiceTemplate;
};

// Register font
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    position: "relative",
    flexDirection: "column",
    backgroundColor: "#fff",
    fontSize: "11px",
    gap: "16px",
  },
  section: {
    marginHorizontal: "1.5cm",
  },
});

export const renderInvoiceValue = (
  value: InvoiceValue,
  template: InvoiceTemplate,
) => {
  if (value instanceof Date) {
    return value.toLocaleString(undefined, { dateStyle: "short" });
  }

  return String(value);
};

export function TemplateRenderer(props: InvoiceTemplateRenderer) {
  console.log(props.invoiceTemplate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* top */}
        <View
          style={[
            styles.section,
            { marginTop: "1cm", flexDirection: "row", gap: "16px" },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text>Logo</Text>
          </View>
          <View style={{ flex: 1, flexDirection: "column", gap: "16px" }}>
            {props.invoiceTemplate.template.heading && (
              <Text style={{ fontSize: "12px" }}>
                {renderInvoiceValue(
                  props.invoiceTemplate.template.heading,
                  props.invoiceTemplate,
                )}
              </Text>
            )}
            {props.invoiceTemplate.template.subheading && (
              <Text style={{ fontSize: "12px" }}>
                {renderInvoiceValue(
                  props.invoiceTemplate.template.subheading,
                  props.invoiceTemplate,
                )}
              </Text>
            )}
            <View style={props.invoiceTemplate.template.header?.style}>
              {props.invoiceTemplate.template.header?.items.map((section) => (
                <InvoiceTemplateSection
                  section={section}
                  invoiceTemplate={props.invoiceTemplate}
                  key={section.id}
                />
              ))}
            </View>
          </View>
        </View>
        <View style={[styles.section, { flexDirection: "row", gap: "16px" }]}>
          <View style={props.invoiceTemplate.template.customer?.style}>
            {props.invoiceTemplate.template.customer?.items.map((section) => (
              <InvoiceTemplateSection
                section={section}
                invoiceTemplate={props.invoiceTemplate}
                key={section.id}
              />
            ))}
          </View>
          <View style={props.invoiceTemplate.template.seller?.style}>
            {props.invoiceTemplate.template.seller?.items.map((section) => (
              <InvoiceTemplateSection
                section={section}
                invoiceTemplate={props.invoiceTemplate}
                key={section.id}
              />
            ))}
          </View>
        </View>
        {/* center */}
        <View style={[styles.section, { flex: 1 }]}>
          <Text>Section #1</Text>
        </View>
        {/* footer */}
        <View
          style={[
            styles.section,
            { marginBottom: "1cm", borderBottom: "1px solid black" },
          ]}
        >
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}

type InvoiceTemplateSectionProps = {
  section: InvoiceTemplateSectionItem;
  invoiceTemplate: InvoiceTemplate;
};

function InvoiceTemplateSection(props: InvoiceTemplateSectionProps) {
  const values = Array.isArray(props.section.value)
    ? props.section.value
    : [props.section.value];
  return (
    <View style={props.section.wrapperStyle}>
      {props.section.label && (
        <Text style={props.section.labelStyle}>
          {renderInvoiceValue(props.section.label, props.invoiceTemplate)}
        </Text>
      )}
      <View style={props.section.valueStyle}>
        {values.map((v, i) => {
          return (
            <Text key={i}>{renderInvoiceValue(v, props.invoiceTemplate)}</Text>
          );
        })}
      </View>
    </View>
  );
}
