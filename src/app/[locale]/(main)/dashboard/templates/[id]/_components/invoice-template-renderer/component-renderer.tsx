import { type TemplateRenderMap } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/invoice-template-renderer/render-maps";
import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-types";

type TemplateComponentRendererProps = {
  component: InvoiceTemplateComponent;
  /**
   * pass here logic to resolve text content of the component (fe. variables)
   */
  resolver: TemplateVariableResolver;
  context?: any;
  renderMap: TemplateRenderMap;
};

export type TemplateVariableResolver = (
  textWithVariable: string,
  context?: any,
) => string | React.ReactNode;

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
