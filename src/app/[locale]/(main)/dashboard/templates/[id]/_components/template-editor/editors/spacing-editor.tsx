import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithReset } from "jotai/vanilla/utils";
import { type ReactNode } from "react";
import {
  LuAlignHorizontalSpaceAround,
  LuAlignVerticalSpaceAround,
  LuPanelBottom,
  LuPanelLeft,
  LuPanelRight,
  LuPanelTop,
  LuSquare,
} from "react-icons/lu";
import { useSelectedComponent } from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Button } from "~/app/_components/ui/button";
import { Label } from "~/app/_components/ui/label";
import {
  SizeInput,
  sizeValueToString,
  stringToSizeValue,
} from "~/app/_components/ui/size-input";
import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-schemas";

export type SpacingEditorProps = {
  type: "margin" | "padding";
};

const SPACING_KEYS = [
  "Left",
  "Right",
  "Top",
  "Bottom",
  "Vertical",
  "Horizontal",
] as const;

export type SpacingKey = (typeof SPACING_KEYS)[number];

const SPACING_KEYS_TO_ICON: Record<SpacingKey, ReactNode> = {
  Left: <LuPanelLeft />,
  Right: <LuPanelRight />,
  Top: <LuPanelTop />,
  Bottom: <LuPanelBottom />,
  Vertical: <LuAlignVerticalSpaceAround />,
  Horizontal: <LuAlignHorizontalSpaceAround />,
};

type SpacingEditorSettings = {
  editType: "VH" | "LTRB";
};

/**
 * Contains info for each 'SpacingEditorType' and component id whether the allSides toggle is enabled
 */
const spacingEditorSettingsAtom = atomWithReset<
  Record<string, SpacingEditorSettings>
>({});

const setSpacingEditorSettingsAtom = atom(
  null,
  (
    get,
    set,
    arg: {
      componentId: string;
      type: SpacingEditorProps["type"];
      settings: SpacingEditorSettings;
    },
  ) => {
    const { componentId, type, settings } = arg;
    const key = `${componentId}${type}`;

    set(spacingEditorSettingsAtom, (prev) => {
      return {
        ...prev,
        [key]: settings,
      };
    });
  },
);

const useSpacingEditorSettings = (
  component: InvoiceTemplateComponent,
  type: SpacingEditorProps["type"],
) => {
  const key = `${component.id}${type}`;
  const settings = useAtomValue(spacingEditorSettingsAtom);
  const updateSettings = useSetAtom(setSpacingEditorSettingsAtom);

  const getKey = (key: SpacingKey) => `${type}${key}` as const;

  const defaultEditType =
    component.style?.[getKey("Left")] ||
    component.style?.[getKey("Right")] ||
    component.style?.[getKey("Top")] ||
    component.style?.[getKey("Bottom")]
      ? "LTRB"
      : "VH";

  return [
    settings[key] ?? { editType: defaultEditType },
    (newSettings: SpacingEditorSettings) =>
      updateSettings({
        componentId: component.id,
        type,
        settings: newSettings,
      }),
  ] as const;
};

export function SpacingEditor(props: SpacingEditorProps) {
  const [selectedComponent, updateComponent] = useSelectedComponent();

  const [settings, setSettings] = useSpacingEditorSettings(
    selectedComponent,
    props.type,
  );

  const getKey = (key: SpacingKey) => {
    return `${props.type}${key}` as const;
  };

  const toggleSettingsEditType = () => {
    if (settings.editType === "VH") {
      setSettings({
        ...settings,
        editType: "LTRB",
      });
      // update all sides to the same value
      const newStyle = {
        ...selectedComponent.style,
        [getKey("Left")]: selectedComponent.style?.[getKey("Horizontal")],
        [getKey("Right")]: selectedComponent.style?.[getKey("Horizontal")],
        [getKey("Top")]: selectedComponent.style?.[getKey("Vertical")],
        [getKey("Bottom")]: selectedComponent.style?.[getKey("Vertical")],
      };
      delete newStyle[getKey("Horizontal")];
      delete newStyle[getKey("Vertical")];
      return updateComponent({
        ...selectedComponent,
        style: newStyle,
      });
    }

    if (settings.editType === "LTRB") {
      setSettings({
        ...settings,
        editType: "VH",
      });
      // update type according to LT
      const newStyle = {
        ...selectedComponent.style,
        [getKey("Horizontal")]: selectedComponent.style?.[getKey("Left")],
        [getKey("Vertical")]: selectedComponent.style?.[getKey("Top")],
      };
      delete newStyle[getKey("Left")];
      delete newStyle[getKey("Right")];
      delete newStyle[getKey("Top")];
      delete newStyle[getKey("Bottom")];
      return updateComponent({
        ...selectedComponent,
        style: newStyle,
      });
    }
  };

  const currentSizeKeys: SpacingKey[] =
    settings.editType === "VH"
      ? ["Horizontal", "Vertical"]
      : ["Left", "Right", "Top", "Bottom"];

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full items-center justify-between gap-2">
        <Label className="text-xs">
          {props.type === "margin" ? "Margin" : "Padding"}
        </Label>
        <Button
          size="iconSm"
          variant={settings.editType === "VH" ? "ghost" : "secondary"}
          onClick={toggleSettingsEditType}
        >
          <LuSquare />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {currentSizeKeys?.map((key) => (
          <SizeInput
            key={key}
            placeholder={"0px"}
            value={
              selectedComponent.style?.[getKey(key)]
                ? stringToSizeValue(selectedComponent.style?.[getKey(key)])
                : undefined
            }
            before={<div className="pl-3">{SPACING_KEYS_TO_ICON[key]}</div>}
            onValueChange={(val) =>
              updateComponent({
                ...selectedComponent,
                style: {
                  ...selectedComponent.style,
                  [getKey(key)]: val ? sizeValueToString(val) : undefined,
                },
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
