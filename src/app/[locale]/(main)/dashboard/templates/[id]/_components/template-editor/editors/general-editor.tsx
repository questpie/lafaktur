import { useSelectedComponent } from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";

export function GeneralEditor() {
  const [selectedComponent] = useSelectedComponent();

  return (
    <div className="flex flex-col items-start gap-1">
      <Label className="text-xs">ID</Label>
      <Input
        placeholder={"ID"}
        readOnly
        value={selectedComponent.id}
        className={{ wrapper: "opacity-80" }}
      />
    </div>
  );
}
