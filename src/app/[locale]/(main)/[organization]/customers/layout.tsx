"use client";
import { useTranslations } from "next-intl";
import { BreadcrumbSegment } from "~/app/[locale]/(main)/[organization]/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const selectedOrg = useSelectedOrganization();

  return (
    <>
      <BreadcrumbSegment
        label={t("customer.customersPage.title")}
        href={`/${selectedOrg.slug}/customers`}
        level={1}
      />
      {children}
    </>
  );
}
