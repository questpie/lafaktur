"use client";
import { useTranslations } from "next-intl";
import { type PropsWithChildren } from "react";
import { BreadcrumbSegment } from "~/app/[locale]/(main)/[organization]/_components/header";
import { type OrganizationParams } from "~/app/[locale]/(main)/[organization]/layout";

export default function InvoiceLayout(
  props: PropsWithChildren<{
    params: OrganizationParams;
  }>,
) {
  const t = useTranslations();

  return (
    <>
      <BreadcrumbSegment
        label={t("invoice.breadcrumbs.invoices")}
        href={`/${props.params.organization}/invoices`}
        level={1}
      />
      {props.children}
    </>
  );
}
