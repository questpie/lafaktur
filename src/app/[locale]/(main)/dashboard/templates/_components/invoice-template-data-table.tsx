"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { LuTrash } from "react-icons/lu";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import { Button } from "~/app/_components/ui/button";
import { DataTable } from "~/app/_components/ui/data-table";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

type InvoiceTemplate =
  RouterOutputs["invoiceTemplate"]["getAll"]["data"][number];
const columns: ColumnDef<InvoiceTemplate>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      <Button size="iconSm">
        <LuTrash />
      </Button>;
    },
  },
];

export default function InvoiceTemplateDataTable() {
  const searchParams = useSearchParams();
  let page = searchParams.get("page") ?? 0;
  page = Number(page);
  const selectedOrganization = useSelectedOrganization();
  const [invoiceTemplates] =
    api.invoiceTemplate.getAll.useSuspenseInfiniteQuery(
      { organizationId: selectedOrganization.id },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );
  const router = useRouter();

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
