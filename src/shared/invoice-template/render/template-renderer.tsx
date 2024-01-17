import { type InvoiceTemplate } from "~/server/db/db-schema";
import {
  type TemplateRenderMap,
  type TemplateVariableResolver,
} from "~/shared/invoice-template/render/component-renderer";

type InvoiceTemplateRenderer = {
  invoiceTemplate: InvoiceTemplate;
  renderMap: TemplateRenderMap;
  resolver: TemplateVariableResolver;
};

export function TemplateRenderer(props: InvoiceTemplateRenderer) {
  return props.renderMap.root({
    cmp: props.invoiceTemplate.template.content,
    resolver: props.resolver,
    // context: props.invoiceTemplate,
  });
}
