import { Label } from "@radix-ui/react-dropdown-menu";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import {
  invoiceTemplateAtom,
  useSelectedComponent,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import {
  SizeInput,
  sizeValueToString,
  stringToSizeValue,
} from "~/app/_components/ui/size-input";
import { getTemplateComponentParentById } from "~/shared/invoice-template/invoice-template-helpers";
import {
  type InvoiceTemplateComponent,
  type InvoiceTemplateStyle,
} from "~/shared/invoice-template/invoice-template-schemas";

type SizeEditorValueType = "wrap" | "fixed" | "fill";

const SIZE_TYPES = ["width", "height"] as const;
type SizeType = (typeof SIZE_TYPES)[number];

export function getDimensionType(
  sizeType: SizeType,
  component: InvoiceTemplateComponent,
  parent: InvoiceTemplateComponent | null,
) {
  if (sizeType === "width") {
    if (
      (component.style?.flex === "1" &&
        !parent?.style?.flexDirection?.includes("column")) ||
      (component.style?.width === "100%" &&
        parent?.style?.flexDirection?.includes("column"))
    ) {
      return "fill";
    }

    if (component.style?.width === "min-content") {
      return "wrap";
    }

    return "fixed";
  }

  if (
    (component.style?.flex === "1" &&
      parent?.style?.flexDirection?.includes("column")) ||
    (component.style?.height === "100%" &&
      !parent?.style?.flexDirection?.includes("column"))
  ) {
    return "fill";
  }

  if (component.style?.height === "min-content") {
    return "wrap";
  }

  return "fixed";
}

export function getNewDimensionStyle(
  sizeType: SizeType,
  style: InvoiceTemplateStyle,
  parent: InvoiceTemplateComponent | null,
  valueType: SizeEditorValueType,
  value = "0px",
) {
  const isParentColumn = parent?.style?.flexDirection?.includes("column");
  if (sizeType === "width") {
    if (valueType === "wrap") {
      return {
        ...style,
        width: "min-content",
        flex: isParentColumn ? style.flex : undefined,
      };
    }

    if (valueType === "fixed") {
      return {
        ...style,
        width: value,
        flex: isParentColumn ? style.flex : undefined,
      };
    }

    return {
      ...style,
      width: "100%",
      flex: isParentColumn ? style.flex : "1",
    };
  }

  if (valueType === "wrap") {
    return {
      ...style,
      height: "min-content",
      flex: isParentColumn ? undefined : style.flex,
    };
  }

  if (valueType === "fixed") {
    return {
      ...style,
      height: value,
      flex: isParentColumn ? undefined : style.flex,
    };
  }

  return {
    ...style,
    height: "100%",
    flex: isParentColumn ? "1" : style.flex,
  };
}

type SizeEditorProps = {
  type: SizeType;
};

const SIZE_TYPE_TO_LABEL = {
  width: "Width",
  height: "Height",
};

export function SizeEditor(props: SizeEditorProps) {
  const [selectedComponent, updateSelectedComponent] = useSelectedComponent();
  const invoiceTemplate = useAtomValue(invoiceTemplateAtom);
  const parent = useMemo(() => {
    return getTemplateComponentParentById(
      selectedComponent.id,
      invoiceTemplate!.template.content,
    );
  }, [invoiceTemplate, selectedComponent.id]);

  const dimensionType = useMemo(() => {
    return getDimensionType(props.type, selectedComponent, parent);
  }, [parent, props.type, selectedComponent]);

  if (selectedComponent.type === "root") return null;

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs">{SIZE_TYPE_TO_LABEL[props.type]}</Label>
      <div className="flex flex-row gap-2">
        <Select
          value={dimensionType}
          onValueChange={(newValue) => {
            updateSelectedComponent({
              ...selectedComponent,
              style: getNewDimensionStyle(
                props.type,
                selectedComponent.style ?? {},
                parent,
                newValue as SizeEditorValueType,
                sizeValueToString(
                  stringToSizeValue(selectedComponent.style?.[props.type]),
                ),
              ),
            });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wrap">Wrap</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
          </SelectContent>
        </Select>
        {dimensionType === "fixed" && (
          <SizeInput
            disabled={dimensionType !== "fixed"}
            onValueChange={(val) => {
              updateSelectedComponent({
                ...selectedComponent,
                style: getNewDimensionStyle(
                  props.type,
                  selectedComponent.style ?? {},
                  parent,
                  dimensionType,
                  sizeValueToString(val ?? { number: 0, unit: "px" }),
                ),
              });
            }}
            value={stringToSizeValue(selectedComponent.style?.[props.type])}
          />
        )}
      </div>
    </div>
  );
}
