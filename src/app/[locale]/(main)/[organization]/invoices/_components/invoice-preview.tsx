import { PDFViewer, Text } from "@react-pdf/renderer";
import { type EditInvoiceFormValues } from "~/app/[locale]/(main)/[organization]/invoices/_components/edit-invoice-form";
import { roundTo } from "~/app/_utils/misc-utils";
import { parseTemplateTextValue } from "~/shared/invoice-template/invoice-template-helpers";
import { type TemplateVariableResolver } from "~/shared/invoice-template/render/component-renderer";
import { PDF_RENDER_MAP } from "~/shared/invoice-template/render/pdf-render-map";
import { TemplateRenderer } from "~/shared/invoice-template/render/template-renderer";
import { type RouterOutputs } from "~/trpc/shared";

export type InvoicePreviewProps = {
  invoice: Partial<RouterOutputs["invoice"]["getById"]> | EditInvoiceFormValues;
  invoiceTemplate: RouterOutputs["invoiceTemplate"]["getById"];
};

export const invoiceResolver: TemplateVariableResolver = (
  value,
  resolveAs,
  context,
): any => {
  if (!context) {
    throw new Error("Context is required");
  }

  if (resolveAs === "value") {
    if (value === "invoice_items") {
      return context.invoiceItems ?? [];
    }
    return null;
  }

  const nodes = parseTemplateTextValue(value);

  return (
    <>
      {nodes.map((node, i) => {
        const key = `${node.value}-${i}`;
        if (node.type === "text") {
          return <Text key={key}>{node.value}</Text>;
        }

        let variable = node.value;

        if (typeof context.__scope === "string") {
          if (!variable.startsWith(context.__scope)) {
            return <Text key={key}>not resolved</Text>;
          }

          variable = variable.replace(context.__scope, "");
        }

        variable = variable.replace(
          /_([a-z])/g,
          (g) => g[1]?.toUpperCase() ?? "",
        );

        let realValue = context[variable] ?? "not resolved";

        if (typeof realValue === "number") {
          realValue = roundTo(realValue, 2);
        } else if (realValue instanceof Date) {
          realValue = realValue.toLocaleDateString();
        } else {
          realValue = String(realValue);
        }

        return <Text key={key}>{realValue as string}</Text>;
      })}
    </>
  );
};

export function InvoicePreview(props: InvoicePreviewProps) {
  return (
    <PDFViewer className="h-full w-full">
      <TemplateRenderer
        invoiceTemplate={props.invoiceTemplate}
        renderMap={PDF_RENDER_MAP}
        context={props.invoice}
        resolver={invoiceResolver}
      />
    </PDFViewer>
  );
}
