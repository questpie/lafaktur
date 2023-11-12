"use client";
import {
  type TemplateRenderMap,
  type TemplateVariableResolver,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/invoice-template-renderer/component-renderer";
import { type InvoiceTemplate } from "~/server/db/schema";

type InvoiceTemplateRenderer = {
  invoiceTemplate: InvoiceTemplate;
  renderMap: TemplateRenderMap;
  resolver: TemplateVariableResolver;
};

export function TemplateRenderer(props: InvoiceTemplateRenderer) {
  return props.renderMap.page({
    cmp: props.invoiceTemplate.template.content,
    resolver: props.resolver,
    // context: props.invoiceTemplate,
  });
}
