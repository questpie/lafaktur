import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/app/_utils/styles-utils";

export const textareaVariants = cva(
  "flex min-h-9 w-full rounded-md px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        outline: "border border-input bg-transparent",
        filled: "bg-secondary",
      },
    },
    defaultVariants: {
      variant: "filled",
    },
  },
);

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          textareaVariants({
            variant,
            className: cn(
              props["aria-invalid"] && "border-destructive text-destructive",
              className,
            ),
          }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
