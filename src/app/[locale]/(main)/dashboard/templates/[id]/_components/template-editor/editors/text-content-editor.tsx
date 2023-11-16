import { useSelectedComponent } from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";

export function TextContentEditor() {
  const [selectedComponent, updateComponent] = useSelectedComponent();

  if (selectedComponent.type !== "text") return null;

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs">Text</Label>
      <Input
        placeholder={"Text"}
        value={selectedComponent.value}
        onChange={(e) =>
          updateComponent({
            ...selectedComponent,
            value: e.target.value,
          })
        }
      />
    </div>
  );
}
