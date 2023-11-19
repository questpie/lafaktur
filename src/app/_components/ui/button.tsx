import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";

import { Spinner } from "~/app/_components/ui/spinner";
import { cn } from "~/app/_utils/styles-utils";

const buttonVariants = cva(
  "inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        iconXs: "h-6 w-6",
        iconSm: "h-8 w-8",
        iconLg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      disabled,
      isLoading,
      loadingText,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    if (disabled || isLoading) {
      variant = "outline";
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner /> {loadingText}
          </>
        ) : (
          props.children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

const LinkButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "asChild"> & { href?: string }
>(({ href, ...props }, ref) => {
  if (!href) {
    return <Button ref={ref} {...props} />;
  }

  return (
    <Button asChild ref={ref} {...props}>
      <Link href={href}>{props.children}</Link>
    </Button>
  );
});

LinkButton.displayName = "LinkButton";
export { Button, buttonVariants, LinkButton };
