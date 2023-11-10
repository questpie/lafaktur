"use client";

import { LuPlus } from "react-icons/lu";
import { useHeader } from "~/app/[locale]/(main)/dashboard/_components/header";
import { CreateTemplateDialog } from "~/app/[locale]/(main)/dashboard/templates/_components/create-template-dialog";
import InvoiceTemplateDataTable from "~/app/[locale]/(main)/dashboard/templates/_components/invoice-template-data-table";
import { useDialogControl } from "~/app/_components/ui/dialog";

export default function InvoiceTemplatePage() {
  const { open } = useDialogControl();

  useHeader({
    title: "Invoice templates",
    mainAction: {
      label: "Add invoice template",
      icon: <LuPlus />,
      onClick: () => {
        open({
          content: <CreateTemplateDialog />,
          id: CreateTemplateDialog.id,
        });
      },
    },
  });
  return (
    <div>
      <InvoiceTemplateDataTable />
    </div>
  );
}
