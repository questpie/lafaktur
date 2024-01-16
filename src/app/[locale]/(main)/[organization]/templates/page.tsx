"use client";

import { useTranslations } from "next-intl";
import { LuPlus } from "react-icons/lu";
import { HeaderSegment } from "~/app/[locale]/(main)/[organization]/_components/header";
import { CreateTemplateDialog } from "~/app/[locale]/(main)/[organization]/templates/_components/create-template-dialog";
import InvoiceTemplateDataTable from "~/app/[locale]/(main)/[organization]/templates/_components/invoice-template-data-table";
import { useDialogControl } from "~/app/_components/ui/dialog";

export default function InvoiceTemplatePage() {
  const { open } = useDialogControl();
  const t = useTranslations();

  return (
    <div>
      <HeaderSegment
        title={t("invoiceTemplate.invoiceTemplatePage.title")}
        mainAction={{
          label: t("invoiceTemplate.invoiceTemplatePage.mainAction"),
          icon: <LuPlus />,
          onClick: () => {
            open({
              content: <CreateTemplateDialog />,
              id: CreateTemplateDialog.id,
            });
          },
        }}
      />
      <InvoiceTemplateDataTable />
    </div>
  );
}
