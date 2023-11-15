import { useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { HexColorPicker } from "react-colorful";
import tinycolor from "tinycolor2";
import {
  selectedComponentAtom,
  updateSelectedComponentAtom,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Input } from "~/app/_components/ui/input";
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
  const backupValue = React.useRef<string | undefined>();

  const [isOpen, setOpen] = React.useState(false);
  const label = props.type === "color" ? "Text" : "Background";

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <div
              className="h-9 w-9 cursor-pointer rounded-md border shadow-sm"
              style={{
                backgroundColor:
                  selectedComponent.style?.[props.type] ?? "#00000000",
              }}
            />
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2  border p-0">
            <HexColorPicker
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
        <Input
          placeholder="Inherit"
          value={selectedComponent.style?.[props.type]}
          onChange={(e) => {
            const value = e.target.value;

            updateSelectedComponent({
              ...selectedComponent,
              style: {
                ...selectedComponent.style,
                [props.type]: value,
              },
            });
          }}
          onFocus={() => {
            console.log("focus");
            backupValue.current = selectedComponent.style?.[props.type];
          }}
          onBlur={(e) => {
            const value = e.target.value;
            if (tinycolor(value).isValid() || value === "") return;

            if (backupValue.current) {
              updateSelectedComponent({
                ...selectedComponent,
                style: {
                  ...selectedComponent.style,
                  [props.type]: backupValue.current,
                },
              });
            }
          }}
        />
      </div>
    </div>
  );
}
