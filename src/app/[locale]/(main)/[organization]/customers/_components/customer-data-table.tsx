"use client";
import { useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { getQueryKey } from "@trpc/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { type SyntheticEvent } from "react";
import { LuTrash, LuUser } from "react-icons/lu";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { useConfirmDialog } from "~/app/_components/ui/alert-dialog";
import { Button } from "~/app/_components/ui/button";
import { DataTable } from "~/app/_components/ui/data-table";
import { Translate } from "~/app/_components/ui/translate";
import { $t } from "~/i18n/dummy";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

type Customer = RouterOutputs["customer"]["getAll"]["data"][number];

export default function CustomerDataTable() {
  const router = useRouter();
  const t = useTranslations();

  const selectedOrganization = useSelectedOrganization();

  const [customers, { fetchNextPage, hasNextPage }] =
    api.customer.getAll.useSuspenseInfiniteQuery(
      { organizationId: selectedOrganization.id },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={customers.pages.flatMap((page) => page.data)}
        onRowClick={(row) =>
          router.push(
            `/${selectedOrganization.slug}/customers/${row.original.id}`,
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

const DeleteAction: ColumnDef<Customer>["cell"] = (props) => {
  const queryClient = useQueryClient();
  const organization = useSelectedOrganization();
  const t = useTranslations();

  const { open } = useConfirmDialog();

  const deleteMutation = api.customer.deleteById.useMutation({
    onSettled: async () => {
      const key = getQueryKey(
        api.customer.getAll,
        { organizationId: organization.id },
        "infinite",
      );

      await queryClient.invalidateQueries(key);
    },
  });

  const handleDelete = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    open({
      title: t("customer.dataTable.deleteAction.title"),
      description: t("customer.dataTable.deleteAction.description"),
      confirmLabel: t("customer.dataTable.deleteAction.confirm"),
      cancelLabel: t("customer.dataTable.deleteAction.cancel"),
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

const columns: ColumnDef<Customer>[] = [
  {
    id: "icon",
    cell: () => {
      return (
        <div className="flex flex-row justify-center">
          <LuUser />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <Translate name={$t("customer.dataTable.name")} />,
    cell: ({ getValue }) => (
      <span className="line-clamp-1 text-ellipsis">{String(getValue())}</span>
    ),
  },
  // {
  //   accessorKey: "email",
  //   header: () => <Translate name={$t("customer.dataTable.email")} />,
  //   cell: ({ getValue }) => (
  //     <span className="line-clamp-1 text-ellipsis">{String(getValue())}</span>
  //   ),
  // },
  {
    id: "actions",
    cell: DeleteAction,
  },
];
