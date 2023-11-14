import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Fragment, type ReactNode } from "react";
import { LuBoxSelect, LuImage, LuList, LuType } from "react-icons/lu";
import { SpacingEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/spacing-editor";
import {
  invoiceTemplateAtom,
  selectedComponentAtom,
  selectedComponentIdAtom,
  updateComponentAtom,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-atoms";
import { Badge } from "~/app/_components/ui/badge";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { Separator } from "~/app/_components/ui/separator";
import {
  SizeInput,
  sizeValueToString,
  stringToSizeValue,
} from "~/app/_components/ui/size-input";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/app/_components/ui/toggle-group";
import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-types";

const TYPE_TO_ICON: Record<InvoiceTemplateComponent["type"], ReactNode> = {
  image: <LuImage />,
  list: <LuList />,
  page: <LuBoxSelect />,
  text: <LuType />,
  view: <LuBoxSelect />,
};

export function TemplateEditorSidebar() {
  const [invoiceTemplate, setInvoiceTemplate] = useAtom(invoiceTemplateAtom);
  const setSelectedComponent = useSetAtom(selectedComponentIdAtom);
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const updateComponent = useSetAtom(updateComponentAtom);

  return (
    <div className="flex flex-col gap-4 overflow-y-scroll">
      <h3 className="text-xs font-semibold text-muted-foreground">Template</h3>
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <Input
          placeholder={"Template name"}
          value={invoiceTemplate!.name}
          onChange={(e) =>
            setInvoiceTemplate((prev) => {
              prev!.name = e.target.value;
            })
          }
        />
      </div>
      <Separator />
      {selectedComponent && (
        <Fragment key={selectedComponent.id}>
          <h3 className="text-xs font-semibold text-muted-foreground">
            Component
          </h3>
          <div className="flex flex-col items-start gap-2">
            <Label>ID</Label>
            <Input
              placeholder={"ID"}
              readOnly
              value={selectedComponent.id}
              className={{ wrapper: "opacity-80" }}
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label>Type</Label>
            <ToggleGroup
              type="single"
              value={selectedComponent.type}
              onValueChange={(type) =>
                updateComponent({
                  id: selectedComponent.id,
                  component: {
                    ...selectedComponent,
                    type,
                  } as InvoiceTemplateComponent,
                })
              }
            >
              <ToggleGroupItem value="text" aria-label="Toggle bold">
                Text
              </ToggleGroupItem>
              <ToggleGroupItem value="view" aria-label="Toggle italic">
                View
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="Toggle strikethrough">
                List
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {selectedComponent.type === "text" && (
            <div className="flex flex-col gap-2">
              <Label>Text</Label>
              <Input
                placeholder={"Text"}
                value={selectedComponent.value}
                onChange={(e) =>
                  updateComponent({
                    id: selectedComponent.id,
                    component: {
                      ...selectedComponent,
                      value: e.target.value,
                    } as InvoiceTemplateComponent,
                  })
                }
              />
            </div>
          )}
          {"children" in selectedComponent && (
            <div className="flex flex-col gap-2">
              <Label>Children</Label>
              <div className="flex flex-row flex-wrap gap-2">
                {selectedComponent.children?.map((child) => {
                  return (
                    <Badge
                      key={child.id}
                      onClick={() => setSelectedComponent(child.id)}
                      variant="secondary"
                      className="cursor-pointer gap-2"
                    >
                      {TYPE_TO_ICON[child.type]}
                      {child.id}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <Separator />
          <h3 className="text-xs font-semibold text-muted-foreground">Font</h3>
          <div className="flex flex-col gap-2">
            <Label>Font size</Label>
            <SizeInput
              placeholder={"Inherit"}
              value={
                selectedComponent.style?.fontSize
                  ? stringToSizeValue(selectedComponent.style?.fontSize)
                  : undefined
              }
              onValueChange={(val) =>
                updateComponent({
                  id: selectedComponent.id,
                  component: {
                    ...selectedComponent,
                    style: {
                      ...selectedComponent.style,
                      fontSize: val ? sizeValueToString(val) : undefined,
                    },
                  } as InvoiceTemplateComponent,
                })
              }
            />
          </div>
          <Separator />
          <h3 className="text-xs font-semibold text-muted-foreground">Style</h3>

          <SpacingEditor type="margin" />
          <SpacingEditor type="padding" />
        </Fragment>
      )}
      {/* <Button disabled={!form.formState.isDirty} onClick={save}>
        Save
      </Button> */}
    </div>
  );
}
