"use client";

import { useTranslations } from "next-intl";
import { LuPlus } from "react-icons/lu";
import { HeaderSegment } from "~/app/[locale]/(main)/[organization]/_components/header";
import InvoiceDataTable from "~/app/[locale]/(main)/[organization]/invoices/_components/invoice-data-table";
import { type OrganizationParams } from "~/app/[locale]/(main)/[organization]/layout";

export default function InvoicesPage(props: { params: OrganizationParams }) {
  const t = useTranslations();

  return (
    <>
      <HeaderSegment
        title={t("invoice.invoicesPage.title")}
        mainAction={{
          label: t("invoice.invoicesPage.mainAction"),
          href: `/${props.params.organization}/invoices/add`,
          // onClick: () => {
          //   addMutation.mutate({
          //     organizationId: selectedOrg.id,
          //   });
          // },
          icon: <LuPlus />,
        }}
      />
      <InvoiceDataTable />
    </>
  );
}
