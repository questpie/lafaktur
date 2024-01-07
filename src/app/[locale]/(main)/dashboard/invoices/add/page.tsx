"use client";
import {
  useBreadcrumbSegment,
  useHeader,
} from "~/app/[locale]/(main)/dashboard/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import { CreateInvoiceForm } from "~/app/[locale]/(main)/dashboard/invoices/_components/create-invoice-form";
import { api } from "~/trpc/react";

export type InvoicePageProps = {
  params: { id: string };
};

export default function AddInvoicePage(props: InvoicePageProps) {
  const selectedOrganization = useSelectedOrganization();

  const [nextInvoice] = api.invoice.getNextNumber.useSuspenseQuery({
    organizationId: selectedOrganization.id,
  });

  useHeader({
    title: `Create invoice`,
  });

  useBreadcrumbSegment({
    label: `Create invoice`,
    href: "/dashboard/invoices/add",
    level: 2,
  });

  return <CreateInvoiceForm invoiceNumber={nextInvoice.number} />;
}
