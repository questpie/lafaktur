/* eslint-disable react-hooks/rules-of-hooks */
import { TemplateEditorHoverContainer } from "~/app/[locale]/(main)/[organization]/templates/[id]/_components/template-editor/template-hover-container";
import { cn } from "~/app/_utils/styles-utils";
import { pdfStyleToCssProperties } from "~/shared/invoice-template/invoice-template-helpers";
import {
  TemplateComponentRenderer,
  type TemplateRenderMap,
} from "~/shared/invoice-template/render/component-renderer";

export const TEMPLATE_EDITOR_RENDER_MAP: TemplateRenderMap = {
  root: ({ cmp, resolver }) => {
    // const selectedComponentId = useAtomValue(selectedComponentIdAtom);
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
            {/* {selectedComponentId === cmp.id && <ComponentControlArea />} */}
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
            {resolver(cmp.value ?? "", "node")}
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
    // const selectedComponentId = useAtomValue(selectedComponentIdAtom);
    return (
      <TemplateEditorHoverContainer id={cmp.id}>
        {(renderProps) => (
          <div
            style={pdfStyleToCssProperties(cmp.style)}
            {...renderProps}
            className={cn("relative", renderProps.className)}
          >
            {cmp.children?.map((child) => (
              <TemplateComponentRenderer
                key={child.id}
                component={child}
                renderMap={TEMPLATE_EDITOR_RENDER_MAP}
                resolver={resolver}
              />
            ))}
            {/* {selectedComponentId === cmp.id && <ComponentControlArea />} */}
          </div>
        )}
      </TemplateEditorHoverContainer>
    );
  },
};
