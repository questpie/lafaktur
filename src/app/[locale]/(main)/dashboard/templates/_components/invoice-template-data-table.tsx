"use client";
import { useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { getQueryKey } from "@trpc/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { LuBookTemplate, LuTrash } from "react-icons/lu";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import { Button } from "~/app/_components/ui/button";
import { DataTable } from "~/app/_components/ui/data-table";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

type InvoiceTemplate =
  RouterOutputs["invoiceTemplate"]["getAll"]["data"][number];

export default function InvoiceTemplateDataTable() {
  const searchParams = useSearchParams();
  const router = useRouter();

  let page = searchParams.get("page") ?? 0;
  page = Number(page);

  const selectedOrganization = useSelectedOrganization();

  const [invoiceTemplates] =
    api.invoiceTemplate.getAll.useSuspenseInfiniteQuery(
      { organizationId: selectedOrganization.id },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={invoiceTemplates.pages[page]!.data}
        onRowClick={(row) =>
          router.push(`/dashboard/templates/${row.original.id}`)
        }
      />
    </div>
  );
}

const DeleteAction: ColumnDef<InvoiceTemplate>["cell"] = (props) => {
  const queryClient = useQueryClient();
  const organization = useSelectedOrganization();

  const deleteMutation = api.invoiceTemplate.deleteById.useMutation({
    onSettled: async () => {
      const key = getQueryKey(
        api.invoiceTemplate.getAll,
        { organizationId: organization.id },
        "infinite",
      );
      // TODO: optimistic update

      await queryClient.invalidateQueries(key);
    },
  });

  return (
    <Button
      size="iconSm"
      variant="ghost"
      // TODO: display alert dialog
      onClick={(e) => {
        e.stopPropagation();
        deleteMutation.mutate({
          id: props.row.original.id,
          organizationId: organization.id,
        });
      }}
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
  {
    accessorFn: (og) => {
      const vatRate = og.template.vatRate;
      const vatIncludedLabel = og.template.vatIncluded
        ? "Included"
        : "Not included";
      if (!vatRate) {
        return "Not set";
      }
      return `${vatRate} (${vatIncludedLabel})`;
    },
    header: "VAT",
  },
  {
    accessorFn: (og) => og.template.currency ?? "EUR",
    header: "Currency",
  },
  {
    id: "actions",
    cell: DeleteAction,
  },
];
