"use client";
import { PDFViewer } from "@react-pdf/renderer";
import {
  useBreadcrumbSegment,
  useHeader,
} from "~/app/[locale]/(main)/dashboard/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import { TemplateRenderer } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/invoice-template-renderer";
import { DEFAULT_TEMPLATE } from "~/shared/invoice-template/invoice-template-types";
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
    <div className="grid grid-cols-2">
      <div></div>
      <div>
        <h2 className="text-2xl font-bold">Preview</h2>
        <PDFViewer className="h-full min-h-[500px] w-full">
          <TemplateRenderer
            invoiceTemplate={{
              id: 1,
              name: "test",
              organizationId: 6,
              template: DEFAULT_TEMPLATE,
            }}
          />
        </PDFViewer>
      </div>
    </div>
  );
}
