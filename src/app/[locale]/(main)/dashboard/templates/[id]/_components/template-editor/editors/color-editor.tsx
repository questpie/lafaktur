import { useAtomValue, useSetAtom } from "jotai";
import { HexAlphaColorPicker } from "react-colorful";
import {
  selectedComponentAtom,
  updateSelectedComponentAtom,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-atoms";
import { Label } from "~/app/_components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import { invariant } from "~/app/_utils/misc-utils";

type ColorEditorProps = {
  type: "color" | "backgroundColor" | "borderColor";
};

export function ColorEditor(props: ColorEditorProps) {
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const updateSelectedComponent = useSetAtom(updateSelectedComponentAtom);
  invariant(selectedComponent, "selectedComponent is required", "color-editor");

  const label = props.type === "color" ? "Text" : "Background";

  return (
    <div className="grid grid-cols-2 gap-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <div
              className="h-6 w-6  cursor-pointer rounded border"
              style={{
                backgroundColor:
                  selectedComponent.style?.[props.type] ?? "#00000000",
              }}
            ></div>
          </PopoverTrigger>
          <PopoverContent asChild className="border p-0">
            <HexAlphaColorPicker
              color={selectedComponent.style?.[props.type] ?? "#00000000"}
              onChange={(color) => {
                updateSelectedComponent({
                  ...selectedComponent,
                  style: {
                    ...selectedComponent.style,
                    [props.type]: color,
                  },
                });
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
