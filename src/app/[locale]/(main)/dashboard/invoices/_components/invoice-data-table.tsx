"use client";
import { useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { getQueryKey } from "@trpc/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { type SyntheticEvent } from "react";
import { LuBookTemplate, LuTrash } from "react-icons/lu";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import { useConfirmDialog } from "~/app/_components/ui/alert-dialog";
import { Button } from "~/app/_components/ui/button";
import { DataTable } from "~/app/_components/ui/data-table";
import { Translate } from "~/app/_components/ui/translate";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

type Invoice = RouterOutputs["invoice"]["getAll"]["data"][number];

export default function InvoiceDataTable() {
  const router = useRouter();
  const t = useTranslations();

  const selectedOrganization = useSelectedOrganization();

  const [invoices, { fetchNextPage, hasNextPage }] =
    api.invoice.getAll.useSuspenseInfiniteQuery(
      { organizationId: selectedOrganization.id },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={invoices.pages.flatMap((page) => page.data)}
        onRowClick={(row) =>
          router.push(`/dashboard/invoices/${row.original.id}`)
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

const DeleteAction: ColumnDef<Invoice>["cell"] = (props) => {
  const queryClient = useQueryClient();
  const organization = useSelectedOrganization();
  const t = useTranslations();

  const { open } = useConfirmDialog();

  const deleteMutation = api.invoice.deleteById.useMutation({
    onSettled: async () => {
      const key = getQueryKey(
        api.invoice.getAll,
        { organizationId: organization.id },
        "infinite",
      );

      await queryClient.invalidateQueries(key);
    },
  });

  const handleDelete = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    open({
      title: t("invoice.dataTable.deleteAction.title"),
      description: t("invoice.dataTable.deleteAction.description"),
      confirmLabel: t("invoice.dataTable.deleteAction.confirm"),
      cancelLabel: t("invoice.dataTable.deleteAction.cancel"),
      onConfirm: () => {
        deleteMutation.mutate({
          id: props.row.original.id,
          organizationId: organization.id,
        });
      },
    });
  };

  return (
    <Button
      size="iconSm"
      variant="ghost"
      onClick={handleDelete}
      isLoading={deleteMutation.isLoading}
    >
      <LuTrash />
    </Button>
  );
};

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
    header: "Number",
    cell: ({ getValue }) => (
      <span className="line-clamp-1 text-ellipsis">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: () => <Translate name={"invoice.dataTable.dueDate"} />,
    cell: ({ getValue }) => {
      const date = getValue() as Date;

      return date.toLocaleDateString();
    },
  },
  // {
  //   accessorKey: "currency",
  //   header: () => <Translate name={"invoice.dataTable.currency"} />,
  // },
  {
    id: "actions",
    cell: DeleteAction,
  },
];
