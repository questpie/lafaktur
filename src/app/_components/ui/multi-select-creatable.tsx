import { cva, type VariantProps } from "class-variance-authority";
import AsyncCreatableSelect from "react-select/async-creatable";
import { cn } from "~/app/_utils/styles-utils";

const multiSelectVariants = cva(
  "flex min-h-[2.25rem] w-full rounded-md text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        outlined: "border border-input bg-transparent",
        filled: "bg-input",
      },
    },
    defaultVariants: {
      variant: "outlined",
    },
  },
);

export type MultiSelectCreatableProps<T> = Omit<
  React.ComponentPropsWithoutRef<typeof AsyncCreatableSelect<T>>,
  "classNames" | "unstyled"
> &
  VariantProps<typeof multiSelectVariants> & {
    className?: {
      wrapper?: string;
      main?: string;
      before?: string;
      after?: string;
    };
    before?: React.ReactNode;
    after?: React.ReactNode;

    beforeOuter?: React.ReactNode;
    afterOuter?: React.ReactNode;
  };

export function MultiSelectCreatable<T>({
  before,
  after,
  className,
  beforeOuter,
  afterOuter,
  variant,
  ...props
}: MultiSelectCreatableProps<T>) {
  return (
    <>
      {beforeOuter}
      <div
        className={cn(
          multiSelectVariants({
            variant: variant,
            className: cn(
              "relative",
              props["aria-invalid"] && "border-destructive text-destructive",
              className?.wrapper,
            ),
          }),
        )}
      >
        <span
          className={cn(
            "absolute inset-y-0 left-0 flex items-center pl-3",
            className?.before,
          )}
        >
          {before}
        </span>
        <AsyncCreatableSelect
          unstyled
          classNames={{
            container: ({}) =>
              cn(
                "h-full w-full flex flex-nowrap px-3",
                !!before && "pl-9 ",
                !!after && "pr-9",
                className?.main,
              ),
            placeholder: ({}) => cn("text-muted-foreground/80"),
            control: ({}) => cn("w-full h-full flex flex-nowrap items-start"),
            valueContainer: ({}) =>
              cn(
                "min-h-[2.25rem] cursor-text py-1 flex-1 flex flex-row gap-1 justify-start items-center flex-wrap",
              ),
            indicatorsContainer: ({}) => cn("text-muted-foreground"),
            clearIndicator: ({}) =>
              cn("cursor-pointer hover:text-muted-foreground/80"),
            dropdownIndicator: ({}) =>
              cn("cursor-pointer hover:text-muted-foreground/80"),
            input: ({}) => cn("h-full w-auto flex-1 flex cursor-text"),
            menu: ({}) =>
              cn(
                "left-0 bg-popover border p-1 rounded-sm my-1 shadow-md transition-all duration-200",
              ),
            noOptionsMessage: ({}) =>
              cn("text-sm text-muted-foreground py-2 px-2"),
            menuList: ({}) => cn("gap-1 flex flex-col"),
            option: ({ isFocused, isDisabled, isSelected }) =>
              cn(
                "text-sm px-2 py-2 rounded hover:cursor-pointer active:bg-secondary",
                isFocused && "bg-secondary/50",
                isDisabled && "bg-muted text-muted-foreground",
                isSelected && "bg-secondary",
              ),

            multiValue: ({}) => cn("bg-secondary rounded px-2 py-1 rounded-md"),
            loadingMessage: ({}) =>
              cn("text-sm text-muted-foreground py-2 px-2"),
          }}
          styles={{
            control: () => ({ minHeight: "0" }),
          }}
          {...props}
        />
        <span
          className={cn(
            "absolute inset-y-0 right-0 flex items-center pr-3",
            className?.after,
          )}
        >
          {after}
        </span>
      </div>
      {afterOuter}
    </>
  );
}
