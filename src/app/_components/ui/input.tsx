import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/app/_utils/styles-utils";

const inputVariants = cva(
  "flex h-9 w-full relative rounded-md overflow-hidden text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        outlined: "border border-input bg-transparent",
        filled: "bg-input",
      },
      size: {
        default: "h-9",
        sm: "h-8 text-xs",
        lg: "h-10",
      },
    },
    defaultVariants: {
      variant: "outlined",
    },
  },
);
export interface InputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "className" | "size"
    >,
    VariantProps<typeof inputVariants> {
  before?: React.ReactNode;
  after?: React.ReactNode;

  beforeOuter?: React.ReactNode;
  afterOuter?: React.ReactNode;

  className?: {
    wrapper?: string;
    main?: string;
  };
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      before,
      after,
      afterOuter,
      beforeOuter,
      size,
      variant,
      ...props
    },
    ref,
  ) => {
    return (
      <>
        {beforeOuter}
        <div
          className={cn(
            inputVariants({
              variant,
              size,
              className: cn(
                props["aria-invalid"] && "border-destructive text-destructive",
                className?.wrapper,
              ),
            }),
          )}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            {before}
          </span>
          <input
            type={type}
            className={cn(
              "h-full w-full flex-1 bg-transparent px-3 py-1 hover:outline-none focus:outline-none",
              "file:h-full file:cursor-pointer file:rounded-md file:border-none file:border-input file:bg-secondary file:outline-none file:hover:bg-secondary/90",
              {
                ["px-3 py-1"]: size === "default",
                ["px-2 py-1"]: size === "sm",
                ["px-4 py-2"]: size === "lg",
              },
              !!before && "pl-9",
              !!after && "pr-9",
              className?.main,
            )}
            ref={ref}
            {...props}
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {after}
          </span>
        </div>
        {afterOuter}
      </>
    );
  },
);
Input.displayName = "Input";

export { Input };
