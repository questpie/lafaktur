import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useSelectedComponent } from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { INVOICE_COMPONENT_TYPE_TO_ICON } from "~/app/[locale]/(main)/dashboard/templates/[id]/_constants/template-editor-constants";
import { Label } from "~/app/_components/ui/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/app/_components/ui/toggle-group";
import {
  invoiceTemplateComponentTypeSchema,
  type InvoiceTemplateChild,
  type InvoiceTemplateComponent,
} from "~/shared/invoice-template/invoice-template-schemas";

export function useComponentTypeEditor(
  component: InvoiceTemplateComponent,
  updateComponent: (component: InvoiceTemplateChild) => void,
) {
  const handleTypeChange = useCallback(
    (type: InvoiceTemplateChild["type"]) => {
      if (!component) return;
      if (!invoiceTemplateComponentTypeSchema.safeParse(type).success) return;

      // we should'n never be able and allowed to set page types

      const updatedPayload = {
        ...component,
        type,
      } as InvoiceTemplateChild;
      console.log("updatedPayload", updatedPayload);

      // We won't remove redundant fields yet so we can change it back later, this will be strapped while validating on backend
      // delete component.children;
      if (updatedPayload.type === "list") {
        updatedPayload.item ??= { id: nanoid(), type: "view", children: [] };
        updatedPayload.for ??= "invoice_items";
      }

      if (updatedPayload.type === "view") {
        updatedPayload.children ??= [];
      }

      if (updatedPayload.type === "text") {
        updatedPayload.value ??= "";
      }

      updateComponent(updatedPayload);
    },
    [component, updateComponent],
  );

  return {
    handleTypeChange,
  };
}

export function ComponentTypeEditor() {
  const [selectedComponent, updateComponent] = useSelectedComponent();

  const { handleTypeChange } = useComponentTypeEditor(
    selectedComponent,
    updateComponent,
  );

  if (selectedComponent.type === "root") return null;

  return (
    <div className="flex flex-col items-start gap-1">
      <Label className="text-xs">Type</Label>
      <ComponentTypeToggle
        onChange={handleTypeChange}
        type={selectedComponent.type}
      />
    </div>
  );
}

export type ComponentTypeToggleProps = {
  type: InvoiceTemplateChild["type"];
  onChange: (type: InvoiceTemplateChild["type"]) => void;
};

export function ComponentTypeToggle(props: ComponentTypeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={props.type}
      onValueChange={props.onChange}
    >
      <ToggleGroupItem
        value="view"
        aria-label="Toggle italic"
        className="gap-2"
      >
        {INVOICE_COMPONENT_TYPE_TO_ICON.image}
        View
      </ToggleGroupItem>
      <ToggleGroupItem value="text" aria-label="Toggle bold" className="gap-2">
        {INVOICE_COMPONENT_TYPE_TO_ICON.text}
        Text
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        aria-label="Toggle strikethrough"
        className="gap-2"
      >
        {INVOICE_COMPONENT_TYPE_TO_ICON.list}
        List
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
