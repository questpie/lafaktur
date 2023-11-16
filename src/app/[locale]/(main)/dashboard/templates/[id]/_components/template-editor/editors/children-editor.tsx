import { useSetAtom } from "jotai";
import { type ReactNode } from "react";
import { LuBoxSelect, LuImage, LuList, LuType } from "react-icons/lu";
import {
  selectedComponentIdAtom,
  useSelectedComponent,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { Badge } from "~/app/_components/ui/badge";
import { Label } from "~/app/_components/ui/label";
import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-types";

const TYPE_TO_ICON: Record<InvoiceTemplateComponent["type"], ReactNode> = {
  image: <LuImage />,
  list: <LuList />,
  page: <LuBoxSelect />,
  text: <LuType />,
  view: <LuBoxSelect />,
};

export function ChildrenEditor() {
  const [selectedComponent] = useSelectedComponent();
  const setSelectedComponent = useSetAtom(selectedComponentIdAtom);
  if (!("children" in selectedComponent)) return null;

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs">Children</Label>
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
  );
}
