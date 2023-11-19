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
const highlightedComponentIdAtom = atom<string | null>(null);

const invoiceTemplateStateAtom = atom<"dirty" | "saving" | "saved">("saved");

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

      // if we don't have parent make sure we only update the root if the component is a root
      if (!parent) {
        if (!draft.template.content) return draft;
        if (component.type !== "root") return draft;
        draft.template.content = component;
        return draft;
      }

      if (component.type === "root") {
        return draft;
      }

      /** if parent is view or root, we have to remap it's children */
      if (parent.type === "view" || parent.type === "root") {
        console.log("parent", { ...parent });
        parent.children = parent.children?.map((child) => {
          if (child.id === id) {
            console.log("child", { ...child }, { component });
            return component;
          }

          return child;
        });
      }

      /** If parent is list just update it's item */
      if (parent.type === "list") {
        parent.item = component;
      }

      // TODO: add actual dirty checking logic
      /** Update invoicee state */
      set(invoiceTemplateStateAtom, "dirty");
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

    /** retrieve new payload */
    const newComponent =
      typeof component === "function"
        ? component(selectedComponent)
        : component;

    /** update component */
    set(updateComponentAtom, {
      id: selectedComponent.id,
      component: newComponent,
    });

    if (selectedComponent.id === newComponent.id) return;
    set(selectedComponentIdAtom, newComponent.id);
  },
);

const deleteSelectedComponentAtom = atom(null, (get, set) => {
  const invoiceTemplate = get(invoiceTemplateAtom);
  const selectedComponent = get(selectedComponentAtom);

  /** If no template or selected component is present stop, (should never happen while executing this) */
  if (!invoiceTemplate || !selectedComponent) return;

  /** Don't delete root */
  if (selectedComponent.type === "root") return;

  /** Find parent of component we are trying to delete */
  const parent = getTemplateComponentParentById(
    selectedComponent.id,
    invoiceTemplate.template.content,
  );
  /** Id there is no parent or no children are present in parent stop (should never happen) */
  if (!parent || !("children" in parent)) return;

  /** Update parent component by remapping selected component */
  const updatedParent = {
    ...parent,
    children: parent.children?.filter((c) => c.id !== selectedComponent.id),
  };

  /** Select parent component and remove the selected one */
  set(selectedComponentIdAtom, parent.id);
  set(updateComponentAtom, {
    id: parent.id,
    component: updatedParent as InvoiceTemplateComponent,
  });
});

const addSelectedComponentChildAtom = atom(
  null,
  (get, set, newComponent: InvoiceTemplateComponent) => {
    const selectedComponent = get(selectedComponentAtom);

    /** If no selected component is present stop, (should never happen while executing this) */
    if (!selectedComponent) return;
    if (!("children" in selectedComponent)) return;

    /** Update selected component by adding new child */
    set(updateSelectedComponentAtom, {
      ...selectedComponent,
      // @ts-expect-error TODO: fix this union type issue
      children: [...(selectedComponent.children ?? []), newComponent],
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
  addSelectedComponentChildAtom,
  deleteSelectedComponentAtom,
  highlightedComponentIdAtom,
  invoiceComponentsIdsAtom,
  invoiceTemplateAtom,
  invoiceTemplateStateAtom,
  selectedComponentIdAtom,
  updateComponentAtom,
  useInvoiceTemplateListener,
  useSelectedComponent,
};
