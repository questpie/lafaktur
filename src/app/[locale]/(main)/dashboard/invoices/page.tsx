"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { LuPlus } from "react-icons/lu";
import { useHeader } from "~/app/[locale]/(main)/dashboard/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import InvoiceDataTable from "~/app/[locale]/(main)/dashboard/invoices/_components/invoice-data-table";
import { api } from "~/trpc/react";

export default function InvoicePage() {
  const t = useTranslations();
  const router = useRouter();

  const selectedOrg = useSelectedOrganization();
  const addMutation = api.invoice.create.useMutation({
    onSuccess: (data) => {
      router.push(`/dashboard/invoices/${data.id}`);
    },
  });

  useHeader({
    title: t("invoice.invoicePage.title"),
    mainAction: {
      label: t("invoice.invoicePage.mainAction"),
      href: "/dashboard/invoices/add",
      onClick: () => {
        addMutation.mutate({
          organizationId: selectedOrg.id,
        });
      },
      isLoading: addMutation.isLoading,
      icon: <LuPlus />,
    },
  });

  return <InvoiceDataTable />;
}
