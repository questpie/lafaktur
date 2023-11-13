import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { type InvoiceTemplate } from "~/server/db/schema";
import {
  getTemplateComponentById,
  getTemplateComponentParentById,
} from "~/shared/invoice-template/invoice-template-helpers";
import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-types";

export const invoiceTemplateAtom = atomWithImmer<InvoiceTemplate | null>(null);
export const selectedComponentIdAtom = atom<string | null>(null);

export const selectedComponentAtom = atom((get) => {
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

export const updateComponentAtom = atom(
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
      if (!draft) return draft;
      const parent = getTemplateComponentParentById(id, draft.template.content);
      // if we don't have any parent check whether the id is the same as the root
      if (!parent && draft.template.content.id !== id) {
        return draft;
      }

      // if we don't have parent make sure we only update the root if the component is a page
      if (!parent) {
        if (!draft.template.content) return draft;
        if (component.type !== "page") return draft;
        draft.template.content = component;
        return draft;
      }

      // if the component is page but we are not updating the root return
      if (component.type === "page") return draft;

      //handle view and list

      if (parent.type === "view") {
        parent.children = parent.children?.map((child) => {
          if (child.id === id) {
            return component;
          }
          return child;
        });
      }

      if (parent.type === "list") {
        parent.item = component;
      }
    });
  },
);
