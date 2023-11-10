"use client";
import {
  useBreadcrumbSegment,
  useHeader,
} from "~/app/[locale]/(main)/dashboard/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import InvoiceTemplateDataTable from "~/app/[locale]/(main)/dashboard/templates/_components/invoice-template-data-table";
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

  return <div className="flex flex-col gap-6"></div>;
}
