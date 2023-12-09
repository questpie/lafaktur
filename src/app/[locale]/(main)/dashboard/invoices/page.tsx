"use client";

import { useTranslations } from "next-intl";
import { LuPlus } from "react-icons/lu";
import { useHeader } from "~/app/[locale]/(main)/dashboard/_components/header";
import InvoiceDataTable from "~/app/[locale]/(main)/dashboard/invoices/_components/invoice-data-table";

export default function InvoicePage() {
  const t = useTranslations();

  useHeader({
    title: t("invoice.invoicePage.title"),
    mainAction: {
      label: t("invoice.invoicePage.mainAction"),
      href: "/dashboard/invoices/add",
      icon: <LuPlus />,
    },
  });

  return <InvoiceDataTable />;
}
