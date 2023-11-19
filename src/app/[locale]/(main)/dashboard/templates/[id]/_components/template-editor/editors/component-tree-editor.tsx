import { atom, useAtomValue, useSetAtom } from "jotai";
import { useMemo, type ReactNode } from "react";
import {
  LuBookTemplate,
  LuBoxSelect,
  LuImage,
  LuList,
  LuType,
} from "react-icons/lu";
import {
  highlightedComponentIdAtom,
  invoiceTemplateAtom,
  selectedComponentIdAtom,
  useSelectedComponent,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Badge } from "~/app/_components/ui/badge";
import { cn } from "~/app/_utils/styles-utils";
import { getTemplateComponentParentById } from "~/shared/invoice-template/invoice-template-helpers";
import { type InvoiceTemplateChild } from "~/shared/invoice-template/invoice-template-schemas";

const TYPE_TO_ICON: Record<InvoiceTemplateChild["type"] | "root", ReactNode> = {
  image: <LuImage />,
  list: <LuList />,
  text: <LuType />,
  view: <LuBoxSelect />,
  root: <LuBookTemplate />,
};

const templateRootAtom = atom(
  (get) => get(invoiceTemplateAtom)?.template.content,
);

export function ComponentTreeEditor() {
  const [selectedComponent] = useSelectedComponent();
  const setSelectedComponent = useSetAtom(selectedComponentIdAtom);
  const setHighlightedComponent = useSetAtom(highlightedComponentIdAtom);
  const templateRoot = useAtomValue(templateRootAtom)!;

  const children =
    "children" in selectedComponent ? selectedComponent.children : [];

  const parent = useMemo(
    () => getTemplateComponentParentById(selectedComponent.id, templateRoot),
    [selectedComponent.id, templateRoot],
  );

  const siblings = useMemo(
    () =>
      parent && "children" in parent
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
          {TYPE_TO_ICON[parent.type]}
          {parent.id}
        </Badge>
      )}

      {siblings?.map((sibling) => {
        return (
          <>
            <Badge
              key={sibling.id}
              onClick={() => setSelectedComponent(sibling.id)}
              variant="secondary"
              className={cn("cursor-pointer gap-2", {
                "pointer-events-none gap-2 border-primary opacity-70":
                  sibling.id === selectedComponent.id,
                "ml-4": parent,
              })}
              onMouseOver={() => setHighlightedComponent(sibling.id)}
              onMouseOut={() => setHighlightedComponent(null)}
            >
              {TYPE_TO_ICON[sibling.type]}
              {sibling.id}
            </Badge>
            {selectedComponent.id === sibling.id &&
              children?.map((child) => {
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
                    {TYPE_TO_ICON[child.type]}
                    {child.id}
                  </Badge>
                );
              })}
          </>
        );
      })}
    </div>
  );
}
