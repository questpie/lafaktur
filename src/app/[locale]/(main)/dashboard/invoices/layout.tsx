"use client";
import { useTranslations } from "next-intl";
import { useBreadcrumbSegment } from "~/app/[locale]/(main)/dashboard/_components/header";

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  useBreadcrumbSegment({
    label: t("invoice.breadcrumbs.invoices"),
    href: "/dashboard/invoices",
    level: 1,
  });

  return <>{children}</>;
}
