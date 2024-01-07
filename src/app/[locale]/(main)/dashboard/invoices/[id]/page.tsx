"use client";
import {
  useBreadcrumbSegment,
  useHeader,
} from "~/app/[locale]/(main)/dashboard/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import { EditInvoiceForm } from "~/app/[locale]/(main)/dashboard/invoices/_components/edit-invoice-form";
import { api } from "~/trpc/react";

export type InvoicePageProps = {
  params: { id: string };
};

export default function InvoicePage(props: InvoicePageProps) {
  const selectedOrganization = useSelectedOrganization();

  const [invoice] = api.invoice.getById.useSuspenseQuery({
    id: Number(props.params.id),
    organizationId: selectedOrganization.id,
  });

  useHeader({
    title: `Invoice #${invoice.number}`,
  });

  useBreadcrumbSegment({
    label: `Invoice #${invoice.number}`,
    href: "/dashboard/invoices/add",
    level: 2,
  });

  return <EditInvoiceForm invoice={invoice} />;
}
