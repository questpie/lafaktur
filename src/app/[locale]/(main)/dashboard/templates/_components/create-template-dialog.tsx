import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import { Button } from "~/app/_components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useDialogControl,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { generateInvoiceHash } from "~/shared/invoice-template/invoice-template-utils";
import { api } from "~/trpc/react";

export function CreateTemplateDialog() {
  const t = useTranslations("invoiceTemplate");
  const [name, setName] = useState<string>(
    `${t("newTemplate")} #${generateInvoiceHash()}`,
  );
  const router = useRouter();
  const createTemplateMutation = api.invoiceTemplate.create.useMutation({
    onSuccess(data) {
      router.push(`/dashboard/templates/${data.id}`);
      close(CreateTemplateDialog.id);
    },
  });
  const { close } = useDialogControl();
  const org = useSelectedOrganization();

  const createTemplate = () => {
    createTemplateMutation.mutate({
      name,
      organizationId: org.id,
    });
  };

  return (
    <DialogContent className="flex max-w-md flex-col gap-6">
      <DialogHeader>
        <DialogTitle>Add new template</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.currentTarget.value)} />
      </div>
      <DialogFooter>
        <Button
          isLoading={createTemplateMutation.isLoading}
          disabled={!name}
          onClick={createTemplate}
        >
          Add template
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

CreateTemplateDialog.id = "create-template-dialog";
