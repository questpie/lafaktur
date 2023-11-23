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
import {
  type InvoiceTemplateChild,
  type InvoiceTemplateComponent,
} from "~/shared/invoice-template/invoice-template-schemas";

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
    { id, component }: { id: string; component: InvoiceTemplateComponent },
  ) => {
    const template = get(invoiceTemplateAtom);
    if (!template) {
      return;
    }

    set(invoiceTemplateAtom, (draft) => {
      if (!draft) return;
      const parent = getTemplateComponentParentById(id, draft.template.content);
      // if we don't have any parent check whether the id is the same as the root
      if (!parent && draft.template.content.id !== id) {
        return;
      }

      // if we don't have parent make sure we only update the root if the component is a root
      if (!parent || component.type === "root") {
        if (!draft.template.content) return;
        if (component.type !== "root") return;
        draft.template.content = component;
        return;
      }

      /** if parent is view or root, we have to remap it's children */
      if (parent.type === "view" || parent.type === "root") {
        parent.children = parent.children?.map((child) => {
          if (child.id === id) {
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

const deleteComponentAtom = atom(null, (get, set, idToDelete: string) => {
  const invoiceTemplate = get(invoiceTemplateAtom);
  const selectedComponent = get(selectedComponentAtom);
  /** If we have invoice template stop  */
  if (!invoiceTemplate) return;

  /** Find component we want to delete */
  const componentToDelete = getTemplateComponentById(
    idToDelete,
    invoiceTemplate.template.content,
  );

  /** If we provided id that is not present in template stop */
  if (!componentToDelete) return;

  /** We don't want to delete root */
  if (componentToDelete.type === "root") return;

  /** Find parent of component we are trying to delete */
  const parent = getTemplateComponentParentById(
    componentToDelete.id,
    invoiceTemplate.template.content,
  );
  /** Id there is no parent or no children are present in parent stop (should never happen) */
  if (!parent || !("children" in parent)) return;

  /** Update parent component by remapping selected component */
  const updatedParent = {
    ...parent,
    children: parent.children?.filter((c) => c.id !== componentToDelete.id),
  };

  /** If our component is selected, reselect and update parent */
  if (selectedComponent?.id === componentToDelete.id) {
    set(selectedComponentIdAtom, parent.id);
  }

  set(updateComponentAtom, {
    id: parent.id,
    component: updatedParent as InvoiceTemplateComponent,
  });
});

const addComponentAtom = atom(
  null,
  (
    get,
    set,
    payload: {
      parentId: string;
      component: InvoiceTemplateChild;
    },
  ) => {
    const invoiceTemplate = get(invoiceTemplateAtom);

    /** If we have invoice template stop  */
    if (!invoiceTemplate) return;

    /** Find parent component we are trying to add child to */
    const parent = getTemplateComponentById(
      payload.parentId,
      invoiceTemplate.template.content,
    );

    /** If parent is not present stop (we should always provide valid id) */
    if (!parent) return;

    /** If parent's type disallows children stop */
    if (parent.type !== "root" && parent.type !== "view") return;

    /** Update parent component by adding new child */
    set(updateComponentAtom, {
      id: parent.id,
      component: {
        ...parent,
        children: [...(parent.children ?? []), payload.component],
      },
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

/**
 * Helper hook that exposes functions to add and delete components.
 */
function useTemplateTreeControls() {
  const addComponent = useSetAtom(addComponentAtom);
  const deleteComponent = useSetAtom(deleteComponentAtom);

  return { addComponent, deleteComponent };
}

export {
  highlightedComponentIdAtom,
  invoiceComponentsIdsAtom,
  invoiceTemplateAtom,
  invoiceTemplateStateAtom,
  selectedComponentIdAtom,
  updateComponentAtom,
  useInvoiceTemplateListener,
  useSelectedComponent,
  useTemplateTreeControls,
};
