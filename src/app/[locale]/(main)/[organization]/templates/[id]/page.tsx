"use client";
import {
  BreadcrumbSegment,
  HeaderSegment,
} from "~/app/[locale]/(main)/[organization]/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { TemplateEditor } from "~/app/[locale]/(main)/[organization]/templates/[id]/_components/template-editor/template-editor";
import { api } from "~/trpc/react";

type InvoiceTemplatePageProps = {
  params: { id: string };
};

export default function InvoiceTemplatePage(props: InvoiceTemplatePageProps) {
  const selectedOrganization = useSelectedOrganization();
  const [invoiceTemplate] = api.invoiceTemplate.getById.useSuspenseQuery(
    {
      id: Number(props.params.id),
      organizationId: selectedOrganization.id,
    },
    {
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <>
      <HeaderSegment title={invoiceTemplate.name} />
      <BreadcrumbSegment
        label={invoiceTemplate.name}
        href={`/${selectedOrganization.slug}/templates/${props.params.id}`}
        level={2}
      />
      <TemplateEditor invoiceTemplate={invoiceTemplate} />
    </>
  );
}
