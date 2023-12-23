"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Input } from "~/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/app/_components/ui/select";
import { roundTo } from "~/app/_utils/misc-utils";
import { cn } from "~/app/_utils/styles-utils";

const SIZE_UNITS = ["px", "rem", "cm", "in"] as const;
export type SizeUnit = (typeof SIZE_UNITS)[number];

const CONVERSION_AGAINST_PX = {
  px: 1,
  rem: 16,
  cm: 37.795275591,
  in: 96,
};

export function convertSize(value: number, from: SizeUnit, to: SizeUnit) {
  if (from === to) return value;
  const pxValue = value * CONVERSION_AGAINST_PX[from];
  const result = roundTo(pxValue / CONVERSION_AGAINST_PX[to], 2);
  return result;
}

export function stringToSizeValue(
  value: string | number | undefined,
): SizeValue {
  if (!value) return { number: 0, unit: "px" };
  const match = String(value).match(/(?<number>-?\d+(?:\.\d+)?)(?<unit>\w+)/);
  const number = match?.groups?.number ?? 0;
  const unit = match?.groups?.unit ?? "px";
  if (!SIZE_UNITS.includes(unit as SizeUnit))
    return { number: Number(number), unit: "px" };

  return { number: Number(number), unit: unit as SizeUnit };
}

export function sizeValueToString(value: SizeValue) {
  return `${value.number}${value.unit}`;
}

export type SizeValue = {
  number: number;
  unit: SizeUnit;
};

type SizeInputProps = {
  value?: SizeValue;
  onValueChange: (newValue: SizeValue | undefined) => void;
  placeholder?: string;
  before?: ReactNode;
  disabled?: boolean;
};

export function SizeInput({
  value,
  onValueChange,
  placeholder,
  before,
  disabled,
}: SizeInputProps) {
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!value) return;
    if (startX === null) {
      return;
    }

    // set cursor to sw-resize
    document.body.style.cursor = "ew-resize";

    const onMouseMove = (e: MouseEvent) => {
      if (!value) return;
      if (startX === null) {
        return;
      }
      const diff = e.clientX - startX;
      if (diff === 0) {
        return;
      }

      const realDiff = convertSize(diff, "px", value.unit);

      const newValue = {
        number: value.number + realDiff,
        unit: value.unit,
      };
      onValueChange(newValue);
      setStartX(e.clientX);
    };
    const onMouseUp = () => {
      setStartX(null);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startX]);

  return (
    <Input
      placeholder={placeholder}
      value={value ? value.number : ""}
      type="number"
      disabled={disabled}
      onChange={(e) => {
        if (e.target.value === "") {
          onValueChange(undefined);
          return;
        }

        const parsedValue = Number(e.target.value);
        if (isNaN(parsedValue)) {
          return;
        }

        onValueChange({
          number: parsedValue,
          unit: value?.unit ?? "px",
        });
      }}
      onMouseDown={(e) => setStartX(e.clientX)}
      className={{
        main: cn(startX && "cursor-ew-resize"),
        wrapper: cn(startX && "cursor-ew-resize"),
      }}
      before={
        before && (
          <span className="text-xs text-muted-foreground">{before}</span>
        )
      }
      after={
        !!value && (
          <Select
            value={value.unit}
            onValueChange={(newValue: SizeUnit) => {
              onValueChange({
                // number: convertSize(value.number, value.unit, newValue),
                number: value.number,
                unit: newValue,
              });
            }}
          >
            <SelectTrigger
              hideCaret
              className="h-5 border-none text-xs text-muted-foreground outline-none focus:ring-0"
            >
              {value.unit}
            </SelectTrigger>
            <SelectContent>
              {SIZE_UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
    />
  );
}
