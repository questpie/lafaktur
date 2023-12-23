import { LuPlus } from "react-icons/lu";
import { useSelectedComponent } from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "~/app/_components/ui/popover";
import { useDisclosure } from "~/app/_hooks/use-disclosure";
import { cn } from "~/app/_utils/styles-utils";
import { INVOICE_VARIABLE_LABELS } from "~/shared/invoice-template/invoice-template-constants";

// TODO: autocomplete
export function TextContentEditor() {
  const [selectedComponent, updateComponent] = useSelectedComponent();
  const {
    isOpen: isVariablePickerOpen,
    setIsOpen: setIsVariablePickerOpen,
    toggle: toggleVariablePicker,
  } = useDisclosure(false);

  if (selectedComponent.type !== "text") return null;

  return (
    <Popover open={isVariablePickerOpen} onOpenChange={setIsVariablePickerOpen}>
      <PopoverAnchor asChild>
        <div className={cn("flex flex-col gap-1")}>
          <Label className="text-xs">Text</Label>
          <Input
            value={selectedComponent.value}
            onChange={(e) =>
              updateComponent({
                ...selectedComponent,
                value: e.target.value,
              })
            }
            after={
              <Button
                size="iconSm"
                aria-label="Show variable picker"
                variant="ghost"
                className="mr-0.5"
                onClick={toggleVariablePicker}
              >
                <LuPlus />
              </Button>
            }
          />
        </div>
      </PopoverAnchor>
      <PopoverContent className="max-h-[300px] overflow-y-auto">
        <div className="flex flex-col gap-1">
          {Object.keys(INVOICE_VARIABLE_LABELS).map((key) => (
            <Button
              key={key}
              size="sm"
              variant="ghost"
              className="justify-start text-left"
              onClick={() => {
                updateComponent({
                  ...selectedComponent,
                  value: `${selectedComponent.value} {{${key}}}`,
                });
                setIsVariablePickerOpen(false);
              }}
            >
              {
                INVOICE_VARIABLE_LABELS[
                  key as keyof typeof INVOICE_VARIABLE_LABELS
                ]
              }
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
