import { type ReactNode } from "react";
import {
  LuBookTemplate,
  LuBoxSelect,
  LuImage,
  LuList,
  LuType,
} from "react-icons/lu";
import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-schemas";
export const INVOICE_COMPONENT_TYPE_TO_ICON: Record<
  InvoiceTemplateComponent["type"],
  ReactNode
> = {
  image: <LuImage />,
  list: <LuList />,
  text: <LuType />,
  view: <LuBoxSelect />,
  root: <LuBookTemplate />,
};
