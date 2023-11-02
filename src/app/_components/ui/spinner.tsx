import { cva, type VariantProps } from "class-variance-authority";
import { LuLoader2 } from "react-icons/lu";
import { cn } from "~/app/_utils/styles-utils";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      md: "h-4 w-4",
      sm: "h-3 w-3",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

const Spinner = ({ className, size, ...props }: SpinnerProps) => {
  return (
    <LuLoader2
      className={cn(spinnerVariants({ size, className }))}
      {...props}
    />
  );
};

export { Spinner, spinnerVariants };
