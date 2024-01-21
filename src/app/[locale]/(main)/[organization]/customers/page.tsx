"use client";

import { useTranslations } from "next-intl";
import { LuPlus } from "react-icons/lu";
import { HeaderSegment } from "~/app/[locale]/(main)/[organization]/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import CustomerDataTable from "~/app/[locale]/(main)/[organization]/customers/_components/customer-data-table";

export default function CustomersPage() {
  const t = useTranslations();
  const selectedOrganization = useSelectedOrganization();

  return (
    <>
      <HeaderSegment
        title={t("customer.customersPage.title")}
        mainAction={{
          label: t("customer.customersPage.mainAction.label"),
          href: `/${selectedOrganization.slug}/customers/add`,
          icon: <LuPlus />,
        }}
      />
      <CustomerDataTable />
    </>
  );
}
