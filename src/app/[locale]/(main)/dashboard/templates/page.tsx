"use client";

import { useTranslations } from "next-intl";
import { LuPlus } from "react-icons/lu";
import { useHeader } from "~/app/[locale]/(main)/dashboard/_components/header";
import { CreateTemplateDialog } from "~/app/[locale]/(main)/dashboard/templates/_components/create-template-dialog";
import InvoiceTemplateDataTable from "~/app/[locale]/(main)/dashboard/templates/_components/invoice-template-data-table";
import { useDialogControl } from "~/app/_components/ui/dialog";

export default function InvoiceTemplatePage() {
  const { open } = useDialogControl();
  const t = useTranslations();

  useHeader({
    title: t("invoiceTemplate.invoiceTemplatePage.title"),
    mainAction: {
      label: t("invoiceTemplate.invoiceTemplatePage.mainAction"),
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
