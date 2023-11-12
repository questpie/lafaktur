import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { type InvoiceTemplate } from "~/server/db/schema";

// TODO: test if we really need use client

type InvoiceTemplateRenderer = {
  invoiceTemplate: InvoiceTemplate;
};

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export function TemplateRenderer(props: InvoiceTemplateRenderer) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}
