"use client";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { type InvoiceTemplate } from "~/server/db/schema";
import { type InvoiceTemplateComponent } from "~/shared/invoice-template/invoice-template-types";
import { type FromUnion } from "~/types/misc-types";

type InvoiceTemplateRenderer = {
  invoiceTemplate: InvoiceTemplate;
};

export function TemplateRenderer(props: InvoiceTemplateRenderer) {
  console.log(props.invoiceTemplate);

  return (
    <Document>
      <Page size="A4" style={props.invoiceTemplate.template.style}>
        {props.invoiceTemplate.template.children?.map((child) => (
          <TemplateComponentRenderer component={child} key={child.id} />
        ))}
      </Page>
    </Document>
  );
}

type TemplateComponentRendererProps = {
  component: InvoiceTemplateComponent;
  /**
   * pass here logic to resolve text content of the component (fe. variables)
   */
  resolver?: TemplateVariableResolver;
  context?: any;
};

const defaultResolver: TemplateVariableResolver = (variable: string) =>
  variable;

type TemplateVariableResolver = (
  textWithVariable: string,
  context?: any,
) => string;
export type InvoiceRenderFn<T extends InvoiceTemplateComponent["type"]> =
  (props: {
    cmp: FromUnion<InvoiceTemplateComponent, "type", T>;
    resolver: TemplateVariableResolver;
    context?: any;
  }) => React.ReactNode;
export type RenderMap = {
  [T in InvoiceTemplateComponent["type"]]: InvoiceRenderFn<T>;
};

const rendererMap: RenderMap = {
  view: ({ cmp, resolver, context }) => {
    return (
      <View style={cmp.style}>
        {cmp.children?.map((child) => (
          <TemplateComponentRenderer
            component={child}
            key={child.id}
            resolver={resolver}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            context={context}
          />
        ))}
      </View>
    );
  },

  image: ({ cmp }) => {
    return (
      <View style={cmp.style}>
        <Text>TODO IMAGE RESOLUTION</Text>
      </View>
    );
  },
  text: ({ cmp, resolver }) => {
    const resolvedText = resolver(cmp.value ?? "");

    return <Text style={cmp.style}>{resolvedText ?? ""}</Text>;
  },
  list: ({ cmp, resolver }) => {
    const list = resolver(cmp.for) ?? [];
    if (!Array.isArray(list)) {
      throw new Error("Invalid value for list component");
    }

    return (
      <View style={cmp.style}>
        {list.map((item, i) => (
          <TemplateComponentRenderer
            component={cmp.item}
            key={`${cmp.id}-${i}`}
            resolver={resolver}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            context={item}
          />
        ))}
      </View>
    );
  },
};

function TemplateComponentRenderer({
  component,
  resolver: variableResolver = defaultResolver,
}: TemplateComponentRendererProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const renderer = rendererMap[component.type] as any;

  if (!renderer) {
    throw new Error(`Invalid component type: ${component.type}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return renderer({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    cmp: component as unknown as any,
    resolver: variableResolver,
  });
}
