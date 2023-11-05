"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { forwardRef, type ComponentProps } from "react";
import { cn } from "~/app/_utils/styles-utils";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>
>(function CollapsibleContent({ ...props }, forwardedRef) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      {...props}
      ref={forwardedRef}
      className={cn(
        "ml-4 overflow-hidden",
        "data-[state=open]:animate-collapsible-down",
        props.className,
      )}
    />
  );
});

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
