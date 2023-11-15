import { useAtomValue, useSetAtom } from "jotai";
import { HexAlphaColorPicker } from "react-colorful";
import {
  selectedComponentAtom,
  updateSelectedComponentAtom,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-atoms";
import { invariant } from "~/app/_utils/misc-utils";

type ColorEditorProps = {
  type: "color" | "backgroundColor";
};

export function ColorEditor(props: ColorEditorProps) {
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const updateSelectedComponent = useSetAtom(updateSelectedComponentAtom);
  invariant(selectedComponent, "selectedComponent is required", "color-editor");

  const label = props.type === "color" ? "Color" : "Background color";

  return (
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
  );
}
