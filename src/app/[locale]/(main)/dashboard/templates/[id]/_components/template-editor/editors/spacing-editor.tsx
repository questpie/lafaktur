import { useAtomValue, useSetAtom } from "jotai";
import { useState, type ReactNode } from "react";
import {
  MdOutlineBorderBottom,
  MdOutlineBorderClear,
  MdOutlineBorderHorizontal,
  MdOutlineBorderLeft,
  MdOutlineBorderOuter,
  MdOutlineBorderRight,
  MdOutlineBorderTop,
  MdOutlineBorderVertical,
} from "react-icons/md";
import {
  selectedComponentAtom,
  updateComponentAtom,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-atoms";
import { Button } from "~/app/_components/ui/button";
import { Label } from "~/app/_components/ui/label";
import {
  SizeInput,
  sizeValueToString,
  stringToSizeValue,
} from "~/app/_components/ui/size-input";
import { invariant } from "~/app/_utils/misc-utils";
import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-types";

export type SpacingEditorProps = {
  type: "margin" | "padding";
};

const SPACING_KEYS_ALL = ["Left", "Right", "Top", "Bottom"] as const;

const SPACING_KEYS_TWO_WAY = ["Horizontal", "Vertical"] as const;

export type SpacingKey =
  | (typeof SPACING_KEYS_ALL)[number]
  | (typeof SPACING_KEYS_TWO_WAY)[number];

const SPACING_KEYS_TO_ICON: Record<SpacingKey, ReactNode> = {
  Left: <MdOutlineBorderLeft />,
  Right: <MdOutlineBorderRight />,
  Top: <MdOutlineBorderTop />,
  Bottom: <MdOutlineBorderBottom />,
  Horizontal: <MdOutlineBorderHorizontal />,
  Vertical: <MdOutlineBorderVertical />,
};

export function SpacingEditor(props: SpacingEditorProps) {
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const updateComponent = useSetAtom(updateComponentAtom);
  const [isTwoWayEnabled, setIsTwoWayEnabled] = useState(true);

  invariant(
    selectedComponent,
    "selectedComponent is required",
    "spacing-editor",
  );

  const getKey = (key: SpacingKey) => {
    return `${props.type}${key}` as const;
  };

  const keys = isTwoWayEnabled ? SPACING_KEYS_TWO_WAY : SPACING_KEYS_ALL;
  const label = props.type === "margin" ? "Margin" : "Padding";

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between gap-2">
        <Label className="text-xs">{label}</Label>
        <Button
          size="iconSm"
          variant="ghost"
          onClick={() => setIsTwoWayEnabled((prev) => !prev)}
        >
          {isTwoWayEnabled ? (
            <MdOutlineBorderClear />
          ) : (
            <MdOutlineBorderOuter />
          )}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {keys.map((key) => (
          <SizeInput
            key={key}
            placeholder={"0px"}
            value={stringToSizeValue(selectedComponent.style?.[getKey(key)])}
            before={SPACING_KEYS_TO_ICON[key]}
            onValueChange={(val) =>
              val &&
              updateComponent({
                id: selectedComponent.id,
                component: {
                  ...selectedComponent,
                  style: {
                    ...selectedComponent.style,
                    [getKey(key)]: sizeValueToString(val),
                  },
                } as InvoiceTemplateComponent,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
