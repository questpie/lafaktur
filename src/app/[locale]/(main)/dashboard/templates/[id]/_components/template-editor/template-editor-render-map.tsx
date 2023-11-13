import { TemplateEditorHoverContainer } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-hover-container";
import { cn } from "~/app/_utils/styles-utils";
import { pdfStyleToCssProperties } from "~/shared/invoice-template/invoice-template-helpers";
import {
  type TemplateRenderMap,
  TemplateComponentRenderer,
} from "~/shared/invoice-template/render/component-renderer";

export const TEMPLATE_EDITOR_RENDER_MAP: TemplateRenderMap = {
  page: ({ cmp, resolver }) => {
    return (
      <TemplateEditorHoverContainer id={cmp.id}>
        {(renderProps) => (
          <div
            style={pdfStyleToCssProperties(cmp.style)}
            {...renderProps}
            className={cn(
              "relative aspect-[1/1.414] bg-background text-foreground",
              renderProps.className,
            )}
          >
            {cmp.children.map((child) => (
              <TemplateComponentRenderer
                key={child.id}
                component={child}
                renderMap={TEMPLATE_EDITOR_RENDER_MAP}
                resolver={resolver}
              />
            ))}
          </div>
        )}
      </TemplateEditorHoverContainer>
    );
  },
  image: ({ cmp, resolver }) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        style={pdfStyleToCssProperties(cmp.style)}
        src={resolver(cmp.src, "value") as string}
        alt={cmp.id}
      />
    );
  },
  text: ({ cmp, resolver }) => {
    return (
      <TemplateEditorHoverContainer id={cmp.id}>
        {(renderProps) => (
          <div style={pdfStyleToCssProperties(cmp.style)} {...renderProps}>
            {resolver(cmp.value, "node")}
          </div>
        )}
      </TemplateEditorHoverContainer>
    );
  },

  list: ({ cmp, resolver }) => {
    return (
      <TemplateEditorHoverContainer id={cmp.id}>
        {(renderProps) => (
          <div style={pdfStyleToCssProperties(cmp.style)} {...renderProps}>
            <TemplateComponentRenderer
              component={cmp.item}
              renderMap={TEMPLATE_EDITOR_RENDER_MAP}
              resolver={resolver}
            />
          </div>
        )}
      </TemplateEditorHoverContainer>
    );
  },

  view: ({ cmp, resolver }) => {
    return (
      <TemplateEditorHoverContainer id={cmp.id}>
        {(renderProps) => (
          <div style={pdfStyleToCssProperties(cmp.style)} {...renderProps}>
            {cmp.children?.map((child) => (
              <TemplateComponentRenderer
                key={child.id}
                component={child}
                renderMap={TEMPLATE_EDITOR_RENDER_MAP}
                resolver={resolver}
              />
            ))}
          </div>
        )}
      </TemplateEditorHoverContainer>
    );
  },
};
