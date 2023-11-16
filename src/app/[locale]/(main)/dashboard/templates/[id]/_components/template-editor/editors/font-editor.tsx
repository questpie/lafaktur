import { useSelectedComponent } from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Label } from "~/app/_components/ui/label";
import {
  SizeInput,
  sizeValueToString,
  stringToSizeValue,
} from "~/app/_components/ui/size-input";

export function FontEditor() {
  const [selectedComponent, updateComponent] = useSelectedComponent();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Font size</Label>
        <SizeInput
          placeholder={"Inherit"}
          value={
            selectedComponent.style?.fontSize
              ? stringToSizeValue(selectedComponent.style?.fontSize)
              : undefined
          }
          onValueChange={(val) =>
            updateComponent({
              ...selectedComponent,
              style: {
                ...selectedComponent.style,
                fontSize: val ? sizeValueToString(val) : undefined,
              },
            })
          }
        />
      </div>
    </div>
  );
}
