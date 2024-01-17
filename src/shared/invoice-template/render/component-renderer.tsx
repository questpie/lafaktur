import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-schemas";
import { type FromUnion } from "~/types/misc-types";

export type InvoiceRenderFn<T extends InvoiceTemplateComponent["type"]> =
  (props: {
    cmp: FromUnion<InvoiceTemplateComponent, "type", T>;
    resolver: TemplateVariableResolver;
    context?: Record<string, unknown>;
  }) => React.ReactNode;

export type TemplateRenderMap = {
  [T in InvoiceTemplateComponent["type"]]: InvoiceRenderFn<T>;
};

export type TemplateVariableResolver = <TResolveAs extends "value" | "node">(
  textWithVariable: string,
  resolveAs: TResolveAs,
  context?: Record<string, unknown>,
) => TResolveAs extends "value" ? unknown : React.ReactNode;

type TemplateComponentRendererProps = {
  component: InvoiceTemplateComponent;
  /**
   * pass here the logic to resolve variables from the template
   */
  resolver: TemplateVariableResolver;
  context?: Record<string, unknown>;
  renderMap: TemplateRenderMap;
};

export function TemplateComponentRenderer({
  component,
  resolver,
  renderMap,
  context,
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
    context,
  });
}
