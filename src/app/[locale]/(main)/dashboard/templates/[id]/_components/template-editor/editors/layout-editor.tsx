import React from "react";
import {
  LuAlignCenterHorizontal,
  LuAlignCenterVertical,
  LuAlignEndHorizontal,
  LuAlignEndVertical,
  LuAlignHorizontalDistributeStart,
  LuAlignHorizontalSpaceAround,
  LuAlignHorizontalSpaceBetween,
  LuAlignStartHorizontal,
  LuAlignStartVertical,
  LuAlignVerticalDistributeStart,
  LuAlignVerticalSpaceAround,
  LuAlignVerticalSpaceBetween,
  LuArrowDown,
  LuArrowRight,
  LuCornerDownLeft,
  LuStretchHorizontal,
  LuStretchVertical,
} from "react-icons/lu";
import { useSelectedComponent } from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Label } from "~/app/_components/ui/label";
import {
  SizeInput,
  sizeValueToString,
  stringToSizeValue,
} from "~/app/_components/ui/size-input";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/app/_components/ui/toggle-group";
import { type InvoiceTemplateStyle } from "~/shared/invoice-template/invoice-template-schemas";

const FLEX_DIRECTION_VALUES = ["flex-row", "flex-col", "flex-wrap"] as const;
const FLEX_ALIGN_VALUES = [
  "flex-start",
  "center",
  "flex-end",
  "stretch",
] as const;
const FLEX_JUSTIFY_VALUES = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
] as const;

type FlexDirectionValue = (typeof FLEX_DIRECTION_VALUES)[number];
type FlexAlignValue = (typeof FLEX_ALIGN_VALUES)[number];
type FlexJustifyValue = (typeof FLEX_JUSTIFY_VALUES)[number];

const FLEX_DIRECTION_VALUES_TO_ICON: Record<
  FlexDirectionValue,
  React.ComponentType<{ className: string }>
> = {
  "flex-row": LuArrowRight,
  "flex-col": LuArrowDown,
  "flex-wrap": LuCornerDownLeft,
};

const FLEX_ALIGN_VALUES_TO_ICON = (
  direction: FlexDirectionValue,
): Record<FlexAlignValue, React.ComponentType<{ className: string }>> => ({
  "flex-start":
    direction === "flex-col" ? LuAlignStartVertical : LuAlignStartHorizontal,
  center:
    direction === "flex-col" ? LuAlignCenterVertical : LuAlignCenterHorizontal,
  "flex-end":
    direction === "flex-col" ? LuAlignEndVertical : LuAlignEndHorizontal,
  stretch: direction === "flex-col" ? LuStretchVertical : LuStretchHorizontal,
});

const FLEX_JUSTIFY_VALUES_TO_ICON = (
  direction: FlexDirectionValue,
): Record<FlexJustifyValue, React.ComponentType<{ className: string }>> => ({
  "flex-start":
    direction === "flex-col" ? LuAlignStartHorizontal : LuAlignStartVertical,
  center:
    direction === "flex-col" ? LuAlignCenterHorizontal : LuAlignCenterVertical,
  "flex-end":
    direction === "flex-col" ? LuAlignEndHorizontal : LuAlignEndVertical,
  "space-between":
    direction === "flex-col"
      ? LuAlignHorizontalSpaceBetween
      : LuAlignVerticalSpaceBetween,
});

function getDirectionValue(
  style: InvoiceTemplateStyle = {},
): FlexDirectionValue {
  if (style?.flexDirection?.includes("column")) {
    return "flex-col";
  } else if (style?.flexWrap === "wrap") {
    return "flex-wrap";
  }

  return "flex-row";
}

function getAlignValue(style: InvoiceTemplateStyle = {}): FlexAlignValue {
  const alignValue = style?.alignItems ?? "flex-start";

  if (FLEX_ALIGN_VALUES.includes(alignValue)) {
    return alignValue as FlexAlignValue;
  }

  return "flex-start";
}

function getJustifyValue(style: InvoiceTemplateStyle = {}): FlexJustifyValue {
  const justifyValue = style?.justifyContent ?? "flex-start";

  if (FLEX_JUSTIFY_VALUES.includes(justifyValue)) {
    return justifyValue as FlexJustifyValue;
  }

  return "flex-start";
}

export function LayoutEditor() {
  const [selectedComponent, updateComponent] = useSelectedComponent();

  const directionValue = getDirectionValue(selectedComponent.style);
  const alignValue = getAlignValue(selectedComponent.style);
  const justifyValue = getJustifyValue(selectedComponent.style);

  const handleDirectionChange = (value: FlexDirectionValue) => {
    const newStyle: InvoiceTemplateStyle = {
      flexDirection: undefined,
      flexWrap: undefined,
      flex: undefined,
    };

    if (value === "flex-row") {
      newStyle.flexDirection = "row";
    }

    if (value === "flex-col") {
      newStyle.flexDirection = "column";
    }

    if (value === "flex-wrap") {
      newStyle.flexDirection = "row";
      newStyle.flexWrap = "wrap";
    }

    updateComponent({
      ...selectedComponent,
      style: {
        ...selectedComponent.style,
        ...newStyle,
      },
    });
  };

  function handleAlignChange(value: FlexAlignValue) {
    updateComponent({
      ...selectedComponent,
      style: {
        ...selectedComponent.style,
        alignItems: value,
      },
    });
  }

  function handleJustifyChange(value: FlexJustifyValue) {
    updateComponent({
      ...selectedComponent,
      style: {
        ...selectedComponent.style,
        justifyContent: value,
      },
    });
  }

  return (
    <div className="flex w-full flex-col items-start gap-2 @container">
      <Label className="text-xs">Layout</Label>
      <div className="flex flex-row gap-2">
        <ToggleGroup
          type="single"
          value={directionValue}
          onValueChange={handleDirectionChange}
        >
          {FLEX_DIRECTION_VALUES.map((value) => {
            const Icon = FLEX_DIRECTION_VALUES_TO_ICON[value];
            return (
              <ToggleGroupItem key={value} value={value}>
                <Icon className=" h-4 w-4" />
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        <SizeInput
          before={
            directionValue === "flex-col" ? (
              <LuStretchHorizontal className="ml-3 h-4 w-4" />
            ) : (
              <LuStretchVertical className="ml-3 h-4 w-4" />
            )
          }
          placeholder="0px"
          value={
            selectedComponent.style?.gap
              ? stringToSizeValue(selectedComponent.style?.gap)
              : undefined
          }
          onValueChange={(val) =>
            updateComponent({
              ...selectedComponent,
              style: {
                ...selectedComponent.style,
                gap: val ? sizeValueToString(val) : undefined,
              },
            })
          }
        />
      </div>

      <div className="flex flex-col items-start gap-2">
        <ToggleGroup
          type="single"
          value={justifyValue}
          onValueChange={handleJustifyChange}
        >
          {FLEX_JUSTIFY_VALUES.map((value) => {
            const Icon = FLEX_JUSTIFY_VALUES_TO_ICON(directionValue)[value];
            return (
              <ToggleGroupItem key={value} value={value}>
                <Icon className=" h-4 w-4" />
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        <ToggleGroup
          type="single"
          value={alignValue}
          onValueChange={handleAlignChange}
        >
          {FLEX_ALIGN_VALUES.map((value) => {
            const Icon = FLEX_ALIGN_VALUES_TO_ICON(directionValue)[value];
            return (
              <ToggleGroupItem key={value} value={value}>
                <Icon className=" h-4 w-4" />
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
    </div>
  );
}
