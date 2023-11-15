import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithReset } from "jotai/vanilla/utils";
import { type ReactNode } from "react";
import {
  LuBoxSelect,
  LuPanelBottom,
  LuPanelLeft,
  LuPanelRight,
  LuPanelTop,
} from "react-icons/lu";
import { MdOutlineBorderClear, MdOutlineBorderOuter } from "react-icons/md";
import {
  selectedComponentAtom,
  updateSelectedComponentAtom,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-atoms";
import { Button } from "~/app/_components/ui/button";
import { Label } from "~/app/_components/ui/label";
import {
  SizeInput,
  sizeValueToString,
  stringToSizeValue,
} from "~/app/_components/ui/size-input";
import { invariant } from "~/app/_utils/misc-utils";

export type SpacingEditorProps = {
  type: "margin" | "padding";
};

const SPACING_KEYS = ["Left", "Right", "Top", "Bottom"] as const;

export type SpacingKey = (typeof SPACING_KEYS)[number];

const SPACING_KEYS_TO_ICON: Record<SpacingKey, ReactNode> = {
  Left: <LuPanelLeft />,
  Right: <LuPanelRight />,
  Top: <LuPanelTop />,
  Bottom: <LuPanelBottom />,
};

type SpacingEditorSettings = {
  editType: "each" | "all";
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

const defaultSpacingEditorSettings: SpacingEditorSettings = {
  editType: "all",
};

const useSpacingEditorSettings = (
  componentId: string,
  type: SpacingEditorProps["type"],
) => {
  const key = `${componentId}${type}`;
  const settings = useAtomValue(spacingEditorSettingsAtom);
  const updateSettings = useSetAtom(setSpacingEditorSettingsAtom);

  return [
    settings[key] ?? defaultSpacingEditorSettings,
    (newSettings: SpacingEditorSettings) =>
      updateSettings({ componentId, type, settings: newSettings }),
  ] as const;
};

export function SpacingEditor(props: SpacingEditorProps) {
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const updateComponent = useSetAtom(updateSelectedComponentAtom);

  invariant(
    selectedComponent,
    "selectedComponent is required",
    "spacing-editor",
  );

  const [settings, setSettings] = useSpacingEditorSettings(
    selectedComponent?.id ?? "fallback-component-id",
    props.type,
  );

  const getKey = (key: SpacingKey) => {
    return `${props.type}${key}` as const;
  };

  const toggleSettingsEditType = () => {
    if (settings.editType === "all") {
      setSettings({
        ...settings,
        editType: "each",
      });
      // update all sides to the same value
      return updateComponent({
        ...selectedComponent,
        style: {
          ...selectedComponent.style,
          [getKey("Left")]: selectedComponent.style?.[props.type],
          [getKey("Right")]: selectedComponent.style?.[props.type],
          [getKey("Top")]: selectedComponent.style?.[props.type],
          [getKey("Bottom")]: selectedComponent.style?.[props.type],
        },
      });
    }

    if (settings.editType === "each") {
      setSettings({
        ...settings,
        editType: "all",
      });
      // update type according to left side
      return updateComponent({
        ...selectedComponent,
        style: {
          ...selectedComponent.style,
          [props.type]: selectedComponent.style?.[getKey("Left")],
        },
      });
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between gap-2">
        <Label className="text-xs">
          {props.type === "margin" ? "Margin" : "Padding"}
        </Label>
        <Button size="iconSm" variant="ghost" onClick={toggleSettingsEditType}>
          {settings.editType === "each" ? (
            <MdOutlineBorderClear />
          ) : (
            <MdOutlineBorderOuter />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {settings.editType === "each" &&
          SPACING_KEYS?.map((key) => (
            <SizeInput
              key={key}
              placeholder={"0px"}
              value={stringToSizeValue(selectedComponent.style?.[getKey(key)])}
              before={SPACING_KEYS_TO_ICON[key]}
              onValueChange={(val) =>
                val &&
                updateComponent({
                  ...selectedComponent,
                  style: {
                    ...selectedComponent.style,
                    [getKey(key)]: sizeValueToString(val),
                  },
                })
              }
            />
          ))}
        {settings.editType === "all" && (
          <SizeInput
            placeholder={"0px"}
            value={stringToSizeValue(selectedComponent.style?.[props.type])}
            before={<LuBoxSelect />}
            onValueChange={(val) =>
              val &&
              updateComponent({
                ...selectedComponent,
                style: {
                  ...selectedComponent.style,
                  [props.type]: sizeValueToString(val),
                },
              })
            }
          />
        )}
      </div>
    </div>
  );
}
