"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import * as React from "react";
import { Button } from "~/app/_components/ui/button";
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
};

export function DatePicker(props: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
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
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={props.value}
          onSelect={props.setValue}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
