import { useSelectedComponent } from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Label } from "~/app/_components/ui/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/app/_components/ui/toggle-group";
import {
  invoiceTemplateComponentTypeSchema,
  type InvoiceTemplateComponent,
} from "~/shared/invoice-template/invoice-template-types";

export function ComponentTypeEditor() {
  const [selectedComponent, updateSelectedComponent] = useSelectedComponent();

  function handleTypeChange(type: InvoiceTemplateComponent["type"]) {
    if (!selectedComponent) return;
    if (!invoiceTemplateComponentTypeSchema.safeParse(type).success) return;

    const component = { ...selectedComponent };

    if (component.type === "page") {
    }

    updateSelectedComponent({
      ...selectedComponent,
      type,
    } as InvoiceTemplateComponent);
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Label className="text-xs">Type</Label>
      <ToggleGroup
        type="single"
        disabled={selectedComponent.type === "page"}
        value={selectedComponent.type}
        onValueChange={handleTypeChange}
      >
        {selectedComponent.type === "page" ? (
          <ToggleGroupItem value="page" aria-label="Toggle page">
            Page
          </ToggleGroupItem>
        ) : (
          <>
            <ToggleGroupItem value="text" aria-label="Toggle bold">
              Text
            </ToggleGroupItem>
            <ToggleGroupItem value="view" aria-label="Toggle italic">
              View
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Toggle strikethrough">
              List
            </ToggleGroupItem>
          </>
        )}
      </ToggleGroup>
    </div>
  );
}
