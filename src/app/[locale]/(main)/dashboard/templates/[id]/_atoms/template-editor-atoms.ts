import { atom, useAtomValue, useSetAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { atomWithListeners } from "~/app/_atoms/atom-with-listener";
import { invariant } from "~/app/_utils/misc-utils";
import { type InvoiceTemplate } from "~/server/db/schema";
import {
  getAllTemplateIds,
  getTemplateComponentById,
  getTemplateComponentParentById,
} from "~/shared/invoice-template/invoice-template-helpers";
import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-schemas";

const [invoiceTemplateAtomPrimitive, useInvoiceTemplateListener] =
  atomWithListeners<InvoiceTemplate | null>(null);

const invoiceTemplateAtom = withImmer(invoiceTemplateAtomPrimitive);
const selectedComponentIdAtom = atom<string | null>(null);

const updateComponentAtom = atom(
  null,
  (
    get,
    set,
    {
      id,
      component,
    }: {
      id: string;
      component: InvoiceTemplateComponent;
    },
  ) => {
    const template = get(invoiceTemplateAtom);
    if (!template) {
      return;
    }

    set(invoiceTemplateAtom, (draft) => {
      if (!draft) return draft;
      const parent = getTemplateComponentParentById(id, draft.template.content);
      // if we don't have any parent check whether the id is the same as the root
      if (!parent && draft.template.content.id !== id) {
        return draft;
      }

      // if we don't have parent make sure we only update the root if the component is a page
      if (!parent) {
        if (!draft.template.content) return draft;
        if (component.type !== "root") return draft;
        draft.template.content = component;
        return draft;
      }

      //handle view and list
      if (parent.type === "view" && component.type !== "root") {
        parent.children = parent.children?.map((child) => {
          if (child.id === id) {
            return component;
          }

          return child;
        });
      }

      if (parent.type === "list" && component.type !== "root") {
        parent.item = component;
      }
    });
  },
);

const invoiceComponentsIdsAtom = atom((get) => {
  const template = get(invoiceTemplateAtom);
  if (!template) return [];
  return getAllTemplateIds(template.template.content);
});

const selectedComponentAtom = atom((get) => {
  const template = get(invoiceTemplateAtom);
  const selectedComponentId = get(selectedComponentIdAtom);
  if (!template || !selectedComponentId) {
    return null;
  }
  return getTemplateComponentById(
    selectedComponentId,
    template.template.content,
  );
});

const updateSelectedComponentAtom = atom(
  null,
  (
    get,
    set,
    component:
      | InvoiceTemplateComponent
      | ((c: InvoiceTemplateComponent) => InvoiceTemplateComponent),
  ) => {
    const selectedComponent = get(selectedComponentAtom);
    if (!selectedComponent) return;
    typeof component === "function"
      ? set(updateComponentAtom, {
          id: selectedComponent.id,
          component: component(selectedComponent),
        })
      : set(updateComponentAtom, {
          id: selectedComponent.id,
          component,
        });
  },
);

/**
 * Returns the selected component and a function to update it.
 * This components throws an error if there is no selected component.
 */
function useSelectedComponent() {
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const updateSelectedComponent = useSetAtom(updateSelectedComponentAtom);

  invariant(
    selectedComponent,
    "No selected component",
    useSelectedComponent.name,
  );

  return [selectedComponent, updateSelectedComponent] as const;
}

export {
  invoiceComponentsIdsAtom,
  invoiceTemplateAtom,
  selectedComponentIdAtom,
  updateComponentAtom,
  useInvoiceTemplateListener,
  useSelectedComponent,
};
