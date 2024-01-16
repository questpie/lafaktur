"use client";
import { useTranslations } from "next-intl";
import {
  BreadcrumbSegment,
  HeaderSegment,
} from "~/app/[locale]/(main)/[organization]/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { EditInvoiceForm } from "~/app/[locale]/(main)/[organization]/invoices/_components/edit-invoice-form";
import { api } from "~/trpc/react";

export type InvoicePageProps = {
  params: { id: string; organization: string };
};

export default function InvoicePage(props: InvoicePageProps) {
  const selectedOrganization = useSelectedOrganization();

  const [invoice] = api.invoice.getById.useSuspenseQuery({
    id: Number(props.params.id),
    organizationId: selectedOrganization.id,
  });

  const t = useTranslations();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return (
    <>
      <HeaderSegment
        title={t("invoice.invoicePage.title", { number: invoice.number })}
      />
      <BreadcrumbSegment
        label={t("invoice.invoicePage.title", { number: invoice.number })}
        href={`/${props.params.organization}/invoices/${props.params.id}`}
        level={2}
      />
      <EditInvoiceForm invoice={invoice} />
    </>
  );
}
