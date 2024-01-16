import { atom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useTranslations } from "next-intl";
import { Fragment, useMemo, useState, type SyntheticEvent } from "react";
import { LuPlus, LuX } from "react-icons/lu";
import { match } from "ts-pattern";
import {
  highlightedComponentIdAtom,
  invoiceTemplateAtom,
  selectedComponentIdAtom,
  useSelectedComponent,
  useTemplateTreeControls,
} from "~/app/[locale]/(main)/[organization]/templates/[id]/_atoms/template-editor-atoms";
import {
  ComponentTypeToggle,
  useComponentTypeEditor,
} from "~/app/[locale]/(main)/[organization]/templates/[id]/_components/template-editor/editors/component-type-editor";
import { INVOICE_COMPONENT_TYPE_TO_ICON } from "~/app/[locale]/(main)/[organization]/templates/[id]/_constants/template-editor-constants";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";
import { useDisclosure } from "~/app/_hooks/use-disclosure";
import { cn } from "~/app/_utils/styles-utils";
import { getTemplateComponentParentById } from "~/shared/invoice-template/invoice-template-helpers";
import {
  type InvoiceTemplateChild,
  type InvoiceTemplateComponent,
} from "~/shared/invoice-template/invoice-template-schemas";
import { type FromUnion } from "~/types/misc-types";

const templateRootAtom = atom(
  (get) => get(invoiceTemplateAtom)?.template.content,
);

const getChildren = (component: InvoiceTemplateComponent) => {
  if (component.type === "view" || component.type === "root") {
    return component.children ?? [];
  }
  if (component.type === "list") {
    return component.item ? [component.item] : [];
  }
  return [];
};

export function ComponentTreeEditor() {
  const [selectedComponent] = useSelectedComponent();
  const setSelectedComponent = useSetAtom(selectedComponentIdAtom);
  const setHighlightedComponent = useSetAtom(highlightedComponentIdAtom);
  const templateRoot = useAtomValue(templateRootAtom)!;

  const { deleteComponent } = useTemplateTreeControls();

  const parent = useMemo(
    () => getTemplateComponentParentById(selectedComponent.id, templateRoot),
    [selectedComponent.id, templateRoot],
  );

  const siblings = useMemo(
    () =>
      parent?.type === "view" || parent?.type === "root"
        ? parent.children ?? []
        : [selectedComponent],
    [parent, selectedComponent],
  );

  return (
    <div className="flex flex-col gap-2">
      {parent && (
        <Badge
          onClick={() => setSelectedComponent(parent.id)}
          variant="secondary"
          className="cursor-pointer gap-2"
          onMouseOver={() => setHighlightedComponent(parent.id)}
          onMouseOut={() => setHighlightedComponent(null)}
        >
          {INVOICE_COMPONENT_TYPE_TO_ICON[parent.type]}
          {parent.id}
          {parent.type !== "root" && (
            <span className="flex flex-1 justify-end">
              <LuX
                className="cursor-pointer hover:text-destructive"
                onClick={() => deleteComponent(parent.id)}
              />
            </span>
          )}
        </Badge>
      )}

      {siblings?.map((sibling) => {
        return (
          <Fragment key={sibling.id}>
            <Badge
              variant="secondary"
              className={cn("cursor-pointer gap-2", {
                "border-primary": sibling.id === selectedComponent.id,
                "ml-4": parent,
              })}
              onMouseOver={() => setHighlightedComponent(sibling.id)}
              onMouseOut={() => setHighlightedComponent(null)}
              onClick={() => setSelectedComponent(sibling.id)}
            >
              {INVOICE_COMPONENT_TYPE_TO_ICON[sibling.type]}
              {sibling.id}
              {sibling.type !== "root" && (
                <span className="flex flex-1 justify-end">
                  <LuX
                    className="cursor-pointer hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteComponent(sibling.id);
                    }}
                  />
                </span>
              )}
            </Badge>
            {selectedComponent.id === sibling.id && (
              <>
                {getChildren(sibling).map((child) => {
                  return (
                    <Badge
                      key={child.id}
                      onClick={() => setSelectedComponent(child.id)}
                      variant="secondary"
                      className={cn("ml-4 cursor-pointer gap-2", {
                        "ml-8": parent,
                      })}
                      onMouseOver={() => setHighlightedComponent(child.id)}
                      onMouseOut={() => setHighlightedComponent(null)}
                    >
                      {INVOICE_COMPONENT_TYPE_TO_ICON[child.type]}
                      {child.id}
                      <span className="flex flex-1 justify-end hover:text-destructive">
                        <LuX
                          className="cursor-pointer self-end"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteComponent(child.id);
                          }}
                        />
                      </span>
                    </Badge>
                  );
                })}
                {match(sibling)
                  .with(
                    {
                      type: "list",
                    },
                    (val) => !val.item,

                    (val) => <AddComponentButton parent={val} />,
                  )
                  .with({ type: "root" }, { type: "view" }, (val) => (
                    <AddComponentButton parent={val} />
                  ))
                  .otherwise(() => null)}
              </>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

type AddComponentButtonProps = {
  parent?: FromUnion<
    InvoiceTemplateComponent,
    "type",
    "view" | "root" | "list"
  >;
};

// TODO: use react hook form
function AddComponentButton(props: AddComponentButtonProps) {
  const { isOpen, setIsOpen } = useDisclosure();

  const t = useTranslations();
  const { addComponent } = useTemplateTreeControls();
  const setSelectedComponent = useSetAtom(selectedComponentIdAtom);

  const [newChildPayload, setNewChildPayload] = useState<InvoiceTemplateChild>({
    type: "view",
    id: nanoid(),
    children: [],
  });

  const { handleTypeChange } = useComponentTypeEditor(
    newChildPayload,
    setNewChildPayload,
  );

  const handleSave = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!props.parent) return;
    addComponent({
      parentId: props.parent.id,
      component: newChildPayload,
    });
    setSelectedComponent(newChildPayload.id);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={cn("ml-4 cursor-pointer gap-2", {
            "ml-8": parent,
          })}
        >
          {<LuPlus />}
          <span className="text-xs">
            {props.parent?.type === "list"
              ? t("invoiceTemplate.editor.addListItem")
              : t("invoiceTemplate.editor.addComponent")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 ">
            <Label htmlFor="new-component-id">ID</Label>
            <Input
              id="new-component-id"
              placeholder="Id"
              onChange={(e) =>
                setNewChildPayload({
                  ...newChildPayload,
                  id: e.target.value,
                })
              }
              value={newChildPayload.id}
              required
            />
          </div>

          <div className="flex flex-col gap-2 ">
            <Label htmlFor="type">Type</Label>
            <ComponentTypeToggle
              type={newChildPayload.type}
              onChange={handleTypeChange}
            />
          </div>

          <div className="flex flex-row justify-end">
            <Button type="submit" variant="default">
              {t("common.add")}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
