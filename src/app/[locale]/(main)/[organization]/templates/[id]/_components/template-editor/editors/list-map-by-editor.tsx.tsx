import { useSelectedComponent } from "~/app/[locale]/(main)/[organization]/templates/[id]/_atoms/template-editor-atoms";
import { Label } from "~/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { cn } from "~/app/_utils/styles-utils";
import { type InvoiceTemplateListComponent } from "~/shared/invoice-template/invoice-template-schemas";

// TODO: translations
const MAP_BY_LABELS: Record<InvoiceTemplateListComponent["mapBy"], string> = {
  invoice_items: "Invoice items",
};
export function ListMapByEditor() {
  const [selectedComponent, updateComponent] = useSelectedComponent();

  if (selectedComponent.type !== "list") return null;
  return (
    <div className={cn("flex flex-col gap-1")}>
      <Label className="text-xs">Iterate over</Label>
      <Select
        value={selectedComponent.mapBy}
        onValueChange={(value) =>
          updateComponent({
            ...selectedComponent,
            mapBy: value as InvoiceTemplateListComponent["mapBy"],
          })
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(MAP_BY_LABELS).map((key) => (
            <SelectItem key={key} value={key}>
              {MAP_BY_LABELS[key as keyof typeof MAP_BY_LABELS]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
