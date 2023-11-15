import { useAtomValue, useSetAtom } from "jotai";
import {
  selectedComponentAtom,
  updateSelectedComponentAtom,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Label } from "~/app/_components/ui/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/app/_components/ui/toggle-group";
import { invariant } from "~/app/_utils/misc-utils";
import {
  invoiceTemplateComponentTypeSchema,
  type InvoiceTemplateComponent,
} from "~/shared/invoice-template/invoice-template-types";

export function ComponentTypeEditor() {
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const updateSelectedCompoent = useSetAtom(updateSelectedComponentAtom);

  invariant(
    selectedComponent,
    "selectedComponent is required",
    "component-type-editor",
  );

  return (
    <div className="flex flex-col items-start gap-1">
      <Label className="text-xs">Type</Label>
      <ToggleGroup
        type="single"
        disabled={selectedComponent.type === "page"}
        value={selectedComponent.type}
        onValueChange={(type) => {
          if (!invoiceTemplateComponentTypeSchema.safeParse(type).success)
            return;

          updateSelectedCompoent({
            ...selectedComponent,
            type,
          } as InvoiceTemplateComponent);
        }}
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
