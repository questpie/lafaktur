"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { PopoverPortal } from "@radix-ui/react-popover";
import * as React from "react";
import { Button, type ButtonProps } from "~/app/_components/ui/button";
import { Calendar } from "~/app/_components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import { cn } from "~/app/_utils/styles-utils";

export type DatePickerProps = {
  value: Date | undefined;
  setValue: (date: Date | undefined) => void;
  calendarProps?: React.ComponentProps<typeof Calendar>;
  triggerProps?: React.ComponentProps<typeof Button>;
  variant?: ButtonProps["variant"];
};

export function DatePicker(props: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={props.variant ?? "secondary"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !props.value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.value ? (
            props.value.toLocaleDateString(undefined)
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={props.value}
            onSelect={props.setValue}
            initialFocus
          />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
