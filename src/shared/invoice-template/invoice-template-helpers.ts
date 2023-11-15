import { customAlphabet } from "nanoid";
import { type CSSProperties } from "react";
import {
  type InvoiceTemplateComponent,
  type InvoiceTemplateStyle,
} from "~/shared/invoice-template/invoice-template-types";

export const generateInvoiceHash = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  5,
);

export function getTemplateComponentById(
  id: string,
  page: InvoiceTemplateComponent,
): InvoiceTemplateComponent | null {
  if (page.id === id) {
    return page;
  }

  if ("children" in page && Array.isArray(page.children)) {
    for (const child of page.children) {
      const result = getTemplateComponentById(id, child);
      if (result) {
        return result;
      }
    }
  }

  if ("item" in page && page.item) {
    const result = getTemplateComponentById(id, page.item);
    if (result) {
      return result;
    }
  }

  return null;
}

export function getTemplateComponentParentById(
  id: string,
  page: InvoiceTemplateComponent,
): InvoiceTemplateComponent | null {
  if ("children" in page && Array.isArray(page.children)) {
    for (const child of page.children) {
      if (child.id === id) {
        return page;
      }

      const result = getTemplateComponentParentById(id, child);
      if (result) {
        return result;
      }
    }
  }

  if ("item" in page && page.item) {
    const result = getTemplateComponentParentById(id, page.item);
    if (result) {
      return result;
    }
  }

  return null;
}

const propertyMapper = {
  paddingVertical: "paddingBlock",
  paddingHorizontal: "paddingInline",
  marginVertical: "marginBlock",
  marginHorizontal: "marginInline",
};

export function pdfStyleToCssProperties(
  style?: InvoiceTemplateStyle,
  fontScaling = 1,
) {
  if (!style) return undefined;

  const result = {
    ...style,
  };

  // remap properties
  for (const [key, value] of Object.entries(propertyMapper)) {
    const typedKey = key as keyof typeof propertyMapper;
    const typedValue = value as keyof typeof propertyMapper;

    if (result[typedKey]) {
      result[typedValue] = result[typedKey];
      delete result[typedKey];
    }
  }

  // rescale font to better fit the screen while editing
  if (result.fontSize) {
    const match = String(result.fontSize).match(/(?<number>\d+)(?<unit>.*)/);
    const number = match?.groups?.number;
    const unit = match?.groups?.unit ?? "";

    if (number) {
      const scaledNumber = Number(number) * fontScaling;
      result.fontSize = `${scaledNumber}${unit}`;
    }
  }

  return result as CSSProperties;
}

export function getAllTemplateIds(
  page: InvoiceTemplateComponent,
  acc: Set<string> = new Set<string>(),
): Set<string> {
  acc.add(page.id);

  if ("children" in page && Array.isArray(page.children)) {
    for (const child of page.children) {
      getAllTemplateIds(child, acc);
    }
  }

  if ("item" in page && page.item) {
    getAllTemplateIds(page.item, acc);
  }

  return acc;
}