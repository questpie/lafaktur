"use client";
import {
  useBreadcrumbSegment,
  useHeader,
} from "~/app/[locale]/(main)/dashboard/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import { TemplateEditorLayout } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-layout";
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

  useHeader({
    title: invoiceTemplate.name,
  });

  useBreadcrumbSegment({
    href: `/dashboard/templates/${props.params.id}`,
    label: invoiceTemplate.name,
    level: 2,
  });

  return <TemplateEditorLayout invoiceTemplate={invoiceTemplate} />;
}
