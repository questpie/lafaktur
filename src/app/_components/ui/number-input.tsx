"use client";

import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { floorTo, roundTo } from "~/app/_utils/misc-utils";

type NumberInputProps = {
  value?: number;
  onValueChange: (newValue: number | undefined) => void;
  step?: number;
  min?: number;
  max?: number;
  maxDecimalPlaces?: number;
} & Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type" | "step" | "min" | "max"
>;

export function NumberInput({
  value,
  onValueChange,
  ...props
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState<string>(String(value ?? ""));

  const add = (n = 1) => {
    if (value === undefined) {
      if (props.min !== undefined && n < props.min) {
        return;
      }

      if (props.max !== undefined && n > props.max) {
        return;
      }

      onValueChange(n);
      setInputValue(String(n));
      return;
    }

    const newValue = value + n;

    if (props.min !== undefined && newValue < props.min) {
      return;
    }

    if (props.max !== undefined && newValue > props.max) {
      return;
    }

    onValueChange(newValue);
    setInputValue(String(newValue));
  };

  return (
    <Input
      {...props}
      value={inputValue}
      type="number"
      onChange={(e) => {
        setInputValue(e.target.value);

        if (e.target.value === "") {
          onValueChange(undefined);
          return;
        }

        const parsedValue = Number(e.target.value);
        if (isNaN(parsedValue)) {
          return;
        }

        if (props.maxDecimalPlaces !== undefined) {
          const rounded = floorTo(parsedValue, props.maxDecimalPlaces);
          onValueChange(rounded);
          setInputValue(String(rounded));
          return;
        }

        onValueChange(parsedValue);
      }}
      onBlur={() => {
        if (inputValue === "") {
          onValueChange(undefined);
          setInputValue("");
          return;
        }

        const parsedValue = Number(inputValue);
        if (isNaN(parsedValue)) {
          setInputValue(String(value ?? ""));
          return;
        }

        if (props.maxDecimalPlaces !== undefined) {
          const rounded = floorTo(parsedValue, props.maxDecimalPlaces);
          onValueChange(rounded);
          setInputValue(String(rounded));
          return;
        }

        onValueChange(parsedValue);
      }}
      after={
        <div className="flex h-full w-8 flex-col">
          <Button
            variant={"outline"}
            size="iconSm"
            type="button"
            className="h-1/2 min-w-0 rounded-b-none"
            onClick={() => add(props.step)}
          >
            <LuChevronUp />
          </Button>
          <Button
            variant={"outline"}
            size="iconSm"
            type="button"
            className="h-1/2 min-w-0 rounded-t-none"
            onClick={() => add(-(props.step ?? 1))}
          >
            <LuChevronDown />
          </Button>
        </div>
      }
    />
  );
}
