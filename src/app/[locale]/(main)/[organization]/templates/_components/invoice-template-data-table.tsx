"use client";
import { useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { getQueryKey } from "@trpc/react-query";
import { useRouter } from "next-nprogress-bar";
import { type SyntheticEvent } from "react";
import { LuBookTemplate, LuTrash } from "react-icons/lu";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { useConfirmDialog } from "~/app/_components/ui/alert-dialog";
import { Button } from "~/app/_components/ui/button";
import { DataTable } from "~/app/_components/ui/data-table";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

type InvoiceTemplate =
  RouterOutputs["invoiceTemplate"]["getAll"]["data"][number];

export default function InvoiceTemplateDataTable() {
  const router = useRouter();

  const selectedOrganization = useSelectedOrganization();

  const [invoiceTemplates, { fetchNextPage, hasNextPage }] =
    api.invoiceTemplate.getAll.useSuspenseInfiniteQuery(
      { organizationId: selectedOrganization.id },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={invoiceTemplates.pages.flatMap((page) => page.data)}
        onRowClick={(row) =>
          router.push(
            `/${selectedOrganization.slug}/templates/${row.original.id}`,
          )
        }
      />
      {hasNextPage && (
        <div className="flex flex-row justify-center">
          <Button variant="outline" onClick={() => fetchNextPage()}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

const DeleteAction: ColumnDef<InvoiceTemplate>["cell"] = (props) => {
  const queryClient = useQueryClient();
  const organization = useSelectedOrganization();

  const { open } = useConfirmDialog();

  const deleteMutation = api.invoiceTemplate.deleteById.useMutation({
    onSettled: async () => {
      const key = getQueryKey(
        api.invoiceTemplate.getAll,
        { organizationId: organization.id },
        "infinite",
      );

      await queryClient.invalidateQueries(key);
    },
  });

  const handleDelete = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    open({
      title: "Delete invoice template",
      description: "Are you sure you want to delete this invoice template?",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
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

const columns: ColumnDef<InvoiceTemplate>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => (
      <span className="line-clamp-1 text-ellipsis">{String(getValue())}</span>
    ),
  },
  // {
  //   accessorFn: (og) => {
  //     // const vatRate = og.template.
  //     const vatIncludedLabel = og.template.vatIncluded
  //       ? "Included"
  //       : "Not included";
  //     if (!vatRate) {
  //       return "Not set";
  //     }
  //     return `${vatRate} (${vatIncludedLabel})`;
  //   },
  //   header: "VAT",
  // },
  {
    accessorFn: (og) => og.template.currency ?? "EUR",
    header: "Currency",
  },
  {
    id: "actions",
    cell: DeleteAction,
  },
];
