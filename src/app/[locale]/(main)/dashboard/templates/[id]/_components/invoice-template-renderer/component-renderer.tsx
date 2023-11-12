import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-types";
import { type FromUnion } from "~/types/misc-types";

type TemplateComponentRendererProps = {
  component: InvoiceTemplateComponent;
  /**
   * pass here logic to resolve text content of the component (fe. variables)
   */
  resolver: TemplateVariableResolver;
  context?: any;
  renderMap: TemplateRenderMap;
};

export type InvoiceRenderFn<T extends InvoiceTemplateComponent["type"]> =
  (props: {
    cmp: FromUnion<InvoiceTemplateComponent, "type", T>;
    resolver: TemplateVariableResolver;
    context?: any;
  }) => React.ReactNode;

export type TemplateRenderMap = {
  [T in InvoiceTemplateComponent["type"]]: InvoiceRenderFn<T>;
};

export type TemplateVariableResolver = <TReturnAs extends "value" | "node">(
  textWithVariable: string,
  returnAs: TReturnAs,
  context?: any,
) => TReturnAs extends "value" ? unknown : React.ReactNode;

export function TemplateComponentRenderer({
  component,
  resolver,
  renderMap,
}: TemplateComponentRendererProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const renderer = renderMap[component.type] as any;

  if (!renderer) {
    throw new Error(`Invalid component type: ${component.type}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return renderer({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    cmp: component as unknown as any,
    resolver,
  });
}
