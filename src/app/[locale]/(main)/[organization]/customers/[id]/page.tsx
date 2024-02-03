"use client";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { LuPenSquare } from "react-icons/lu";
import { HeaderSegment } from "~/app/[locale]/(main)/[organization]/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { CustomerDetails } from "~/app/[locale]/(main)/[organization]/customers/_components/customer-details";
import CustomerInvoicesDataTable from "~/app/[locale]/(main)/[organization]/customers/_components/customer-invoices-data-table";
import { api } from "~/trpc/react";

export type CustomerPageProps = {
  params: { id: string; organization: string };
};

// const ChartsTest = dynamic(
//   () =>
//     import(
//       "~/app/[locale]/(main)/[organization]/customers/_components/charts-test"
//     ).then((mod) => mod.ChartsTest),
//   {
//     ssr: false,
//     loading: () => <p>Loading...</p>,
//   },
// );

const LineChart = dynamic(
  () =>
    import(
      "~/app/[locale]/(main)/[organization]/customers/_components/line"
    ).then((mod) => mod.LineChart),
  {
    ssr: false,
  },
);

export default function CustomerPage(props: CustomerPageProps) {
  const selectedOrganization = useSelectedOrganization();

  const [customer] = api.customer.getById.useSuspenseQuery({
    id: Number(props.params.id),
    organizationId: selectedOrganization.id,
  });

  const t = useTranslations();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return (
    <>
      <HeaderSegment
        title={customer.name}
        mainAction={{
          label: t("customer.customerPage.mainAction.label"),
          href: `/${selectedOrganization.slug}/customers/${customer.id}/edit`,
          icon: <LuPenSquare />,
        }}
      />
      <CustomerDetails customer={customer} />
      {/* <ChartsTest /> */}
      <LineChart />
      <CustomerInvoicesDataTable customer={customer} />
    </>
  );
}
