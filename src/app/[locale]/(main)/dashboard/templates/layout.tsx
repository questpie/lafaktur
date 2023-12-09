"use client";
import { useTranslations } from "next-intl";
import { useBreadcrumbSegment } from "~/app/[locale]/(main)/dashboard/_components/header";

export default function InvoiceTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  useBreadcrumbSegment({
    label: t("invoiceTemplate.breadcrumbs.invoiceTemplates"),
    href: "/dashboard/templates",
    level: 1,
  });

  return <>{children}</>;
}
