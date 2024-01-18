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
              context={context}
              resolver={resolver}
            />
          ))}
        </Page>
      </Document>
    );
  },
  view: ({ cmp, resolver, context }) => {
    if (cmp.if) {
      const ifValue = resolver(cmp.if, "value", context);
      if (!ifValue) {
        return null;
      }
    }

    return (
      <View style={cmp.style}>
        {cmp.children?.map((child) => (
          <TemplateComponentRenderer
            component={child}
            key={child.id}
            resolver={resolver}
            context={context}
            renderMap={PDF_RENDER_MAP}
          />
        ))}
      </View>
    );
  },

  image: ({ cmp, resolver, context }) => {
    if (cmp.if) {
      const ifValue = resolver(cmp.if, "value", context);
      if (!ifValue) {
        return null;
      }
    }
    return (
      <View style={{ ...cmp.style }}>
        <Text>TODO IMAGE RESOLUTION</Text>
      </View>
    );
  },
  text: ({ cmp, resolver, context }) => {
    if (cmp.if) {
      const ifValue = resolver(cmp.if, "value", context);
      if (!ifValue) {
        return null;
      }
    }
    const resolvedText = resolver(cmp.value ?? "", "node", context);

    return <Text style={cmp.style}>{resolvedText}</Text>;
  },
  list: ({ cmp, resolver, context }) => {
    if (cmp.if) {
      const ifValue = resolver(cmp.if, "value", context);
      if (!ifValue) {
        return null;
      }
    }

    const list = resolver(cmp.mapBy, "value", context);

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
            context={{
              ...(item as Record<string, unknown>),
              __scope: `${cmp.mapBy}_`,
            }}
            renderMap={PDF_RENDER_MAP}
          />
        ))}
      </View>
    );
  },
};
