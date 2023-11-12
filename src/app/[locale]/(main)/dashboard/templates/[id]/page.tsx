"use client";
import { type CSSProperties } from "react";
import {
  useBreadcrumbSegment,
  useHeader,
} from "~/app/[locale]/(main)/dashboard/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import { InvoiceTemplateEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/invoice-template-editor";
import {
  DEFAULT_TEMPLATE,
  type InvoiceTemplateStyle,
} from "~/shared/invoice-template/invoice-template-types";
import {
  TemplateComponentRenderer,
  type TemplateRenderMap,
} from "~/shared/invoice-template/render/component-renderer";
import { TemplateRenderer } from "~/shared/invoice-template/render/template-renderer";
import { api } from "~/trpc/react";

type InvoiceTemplatePageProps = {
  params: { id: string };
};

export default function InvoiceTemplatePage(props: InvoiceTemplatePageProps) {
  const selectedOrganization = useSelectedOrganization();
  const [invoiceTemplate] = api.invoiceTemplate.getById.useSuspenseQuery({
    id: Number(props.params.id),
    organizationId: selectedOrganization.id,
  });

  useHeader({
    title: invoiceTemplate.name,
  });

  useBreadcrumbSegment({
    href: `/dashboard/templates/${props.params.id}`,
    label: invoiceTemplate.name,
    level: 2,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div></div>
      <div>
        <h2 className="text-2xl font-bold">Preview</h2>
        <InvoiceTemplateEditor invoiceTemplate={invoiceTemplate} />
      </div>
    </div>
  );
}
