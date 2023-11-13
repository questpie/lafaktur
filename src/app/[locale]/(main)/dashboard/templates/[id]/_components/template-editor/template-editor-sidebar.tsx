import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { LuBox, LuImage, LuList, LuText, LuView } from "react-icons/lu";
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
  ToggleGroup,
  ToggleGroupItem,
} from "~/app/_components/ui/toggle-group";
import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-types";

export function TemplateEditorSidebar() {
  const [invoiceTemplate, setInvoiceTemplate] = useAtom(invoiceTemplateAtom);
  const setSelectedComponent = useSetAtom(selectedComponentIdAtom);
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const updateComponent = useSetAtom(updateComponentAtom);

  return (
    <div className="flex flex-col gap-4">
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
        <>
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
                      {child.type === "text" ? (
                        <LuText />
                      ) : child.type === "view" ? (
                        <LuBox />
                      ) : child.type === "image" ? (
                        <LuImage />
                      ) : (
                        <LuList />
                      )}
                      {child.id}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <Separator />
          <h3 className="text-xs font-semibold text-muted-foreground">Style</h3>
          <div className="flex flex-col gap-2">
            <Label>Font size</Label>
            <Input
              placeholder={"Inherit"}
              value={selectedComponent.style?.fontSize}
              onChange={(e) =>
                updateComponent({
                  id: selectedComponent.id,
                  component: {
                    ...selectedComponent,
                    style: {
                      ...selectedComponent.style,
                      fontSize: e.target.value,
                    },
                  } as InvoiceTemplateComponent,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Margin</Label>
            <div className="flex gap-2">
              <Input
                placeholder={"0px"}
                value={selectedComponent.style?.marginTop}
                onChange={(e) =>
                  updateComponent({
                    id: selectedComponent.id,
                    component: {
                      ...selectedComponent,
                      style: {
                        ...selectedComponent.style,
                        marginTop: e.target.value,
                      },
                    } as InvoiceTemplateComponent,
                  })
                }
              />

              <Input
                placeholder={"0px"}
                value={selectedComponent.style?.marginRight}
                onChange={(e) =>
                  updateComponent({
                    id: selectedComponent.id,
                    component: {
                      ...selectedComponent,
                      style: {
                        ...selectedComponent.style,
                        marginRight: e.target.value,
                      },
                    } as InvoiceTemplateComponent,
                  })
                }
              />

              <Input
                placeholder={"0px"}
                value={selectedComponent.style?.marginBottom}
                onChange={(e) =>
                  updateComponent({
                    id: selectedComponent.id,
                    component: {
                      ...selectedComponent,
                      style: {
                        ...selectedComponent.style,
                        marginBottom: e.target.value,
                      },
                    } as InvoiceTemplateComponent,
                  })
                }
              />

              <Input
                placeholder={"0px"}
                value={selectedComponent.style?.marginLeft}
                onChange={(e) =>
                  updateComponent({
                    id: selectedComponent.id,
                    component: {
                      ...selectedComponent,
                      style: {
                        ...selectedComponent.style,
                        marginLeft: e.target.value,
                      },
                    } as InvoiceTemplateComponent,
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Padding</Label>
            <div className="flex gap-2">
              <Input
                placeholder={"0px"}
                value={selectedComponent.style?.paddingTop}
                onChange={(e) =>
                  updateComponent({
                    id: selectedComponent.id,
                    component: {
                      ...selectedComponent,
                      style: {
                        ...selectedComponent.style,
                        paddingTop: e.target.value,
                      },
                    } as InvoiceTemplateComponent,
                  })
                }
              />

              <Input
                placeholder={"0px"}
                value={selectedComponent.style?.paddingRight}
                onChange={(e) =>
                  updateComponent({
                    id: selectedComponent.id,
                    component: {
                      ...selectedComponent,
                      style: {
                        ...selectedComponent.style,
                        paddingRight: e.target.value,
                      },
                    } as InvoiceTemplateComponent,
                  })
                }
              />

              <Input
                placeholder={"0px"}
                value={selectedComponent.style?.paddingBottom}
                onChange={(e) =>
                  updateComponent({
                    id: selectedComponent.id,
                    component: {
                      ...selectedComponent,
                      style: {
                        ...selectedComponent.style,
                        paddingBottom: e.target.value,
                      },
                    } as InvoiceTemplateComponent,
                  })
                }
              />

              <Input
                placeholder={"0px"}
                value={selectedComponent.style?.paddingLeft}
                onChange={(e) =>
                  updateComponent({
                    id: selectedComponent.id,
                    component: {
                      ...selectedComponent,
                      style: {
                        ...selectedComponent.style,
                        paddingLeft: e.target.value,
                      },
                    } as InvoiceTemplateComponent,
                  })
                }
              />
            </div>
          </div>
        </>
      )}
      {/* <Button disabled={!form.formState.isDirty} onClick={save}>
        Save
      </Button> */}
    </div>
  );
}
