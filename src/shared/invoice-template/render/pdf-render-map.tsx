import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  TemplateComponentRenderer,
  type TemplateRenderMap,
} from "~/shared/invoice-template/render/component-renderer";

export const PDF_RENDER_MAP: TemplateRenderMap = {
  root: ({ cmp, resolver, context }) => {
    return (
      <Document>
        <Page size="A4" style={cmp.style}>
          {cmp.children?.map((child) => (
            <TemplateComponentRenderer
              component={child}
              key={child.id}
              renderMap={PDF_RENDER_MAP}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              context={context}
              resolver={resolver}
            />
          ))}
        </Page>
      </Document>
    );
  },
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
            renderMap={PDF_RENDER_MAP}
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
    const resolvedText = resolver(cmp.value ?? "", "node");

    return <Text style={cmp.style}>{resolvedText}</Text>;
  },
  list: ({ cmp, resolver }) => {
    const list = resolver(cmp.for, "value");

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
            renderMap={PDF_RENDER_MAP}
          />
        ))}
      </View>
    );
  },
};
