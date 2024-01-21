"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { LuBookTemplate } from "react-icons/lu";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { Button } from "~/app/_components/ui/button";
import { DataTable } from "~/app/_components/ui/data-table";
import { Translate } from "~/app/_components/ui/translate";
import { $t } from "~/i18n/dummy";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

type Invoice = RouterOutputs["invoice"]["getAll"]["data"][number];

type CustomerInvoicesDataTableProps = {
  customer: RouterOutputs["customer"]["getById"];
};

export default function CustomerInvoicesDataTable(
  props: CustomerInvoicesDataTableProps,
) {
  const router = useRouter();
  const t = useTranslations();

  const selectedOrganization = useSelectedOrganization();

  const [invoices, { fetchNextPage, hasNextPage }] =
    api.invoice.getAllByCustomerId.useSuspenseInfiniteQuery(
      { organizationId: selectedOrganization.id, id: props.customer.id },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={invoices.pages.flatMap((page) => page.data)}
        onRowClick={(row) =>
          router.push(
            `/${selectedOrganization.slug}/invoices/${row.original.id}`,
          )
        }
      />
      {hasNextPage && (
        <div className="flex flex-row justify-center">
          <Button variant="outline" onClick={() => fetchNextPage()}>
            {t("invoice.dataTable.loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}

const columns: ColumnDef<Invoice>[] = [
  {
    id: "icon",
    cell: () => {
      return (
        <div className="flex flex-row justify-center">
          <LuBookTemplate />
        </div>
      );
    },
  },
  {
    accessorKey: "number",
    header: () => <Translate name={$t("invoice.dataTable.number")} />,
    cell: ({ getValue }) => (
      <span className="line-clamp-1 text-ellipsis">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <Translate name={$t("invoice.dataTable.status")} />,
    cell: ({ getValue }) => (
      <span className="line-clamp-1 text-ellipsis">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: () => <Translate name={$t("invoice.dataTable.dueDate")} />,
    cell: ({ getValue }) => {
      const date = getValue() as Date;

      return date.toLocaleDateString();
    },
  },
];
