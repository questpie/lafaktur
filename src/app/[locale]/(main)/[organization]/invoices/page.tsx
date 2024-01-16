"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { LuPlus } from "react-icons/lu";
import { HeaderSegment } from "~/app/[locale]/(main)/[organization]/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import InvoiceDataTable from "~/app/[locale]/(main)/[organization]/invoices/_components/invoice-data-table";
import { type OrganizationParams } from "~/app/[locale]/(main)/[organization]/layout";
import { api } from "~/trpc/react";

export default function InvoicesPage(props: { params: OrganizationParams }) {
  const t = useTranslations();
  const router = useRouter();

  const selectedOrganization = useSelectedOrganization();
  const createMutation = api.invoice.create.useMutation({
    onSuccess(data) {
      router.push(`/${selectedOrganization.slug}/invoices/${data.id}`);
    },
  });

  return (
    <>
      <HeaderSegment
        title={t("invoice.invoicesPage.title")}
        mainAction={{
          label: t("invoice.invoicesPage.mainAction"),
          onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            e.preventDefault();
            createMutation.mutate({ organizationId: selectedOrganization.id });
          },
          icon: <LuPlus />,
          isLoading: createMutation.isLoading,
        }}
      />
      <InvoiceDataTable />
    </>
  );
}
