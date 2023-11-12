import { atom, useAtom } from "jotai";
import React, {
  useId,
  type CSSProperties,
  type SyntheticEvent,
  type ReactNode,
} from "react";
import { cn } from "~/app/_utils/styles-utils";
import { type InvoiceTemplate } from "~/server/db/schema";
import { type InvoiceTemplateStyle } from "~/shared/invoice-template/invoice-template-types";
import {
  TemplateComponentRenderer,
  type TemplateRenderMap,
} from "~/shared/invoice-template/render/component-renderer";
import { TemplateRenderer } from "~/shared/invoice-template/render/template-renderer";

type InvoiceTemplateEditorProps = {
  invoiceTemplate: InvoiceTemplate;
};

export function InvoiceTemplateEditor({
  invoiceTemplate,
}: InvoiceTemplateEditorProps) {
  return (
    <div className="flex flex-col gap-6">
      <TemplateRenderer
        invoiceTemplate={invoiceTemplate}
        renderMap={TEMPLATE_WEB_EDIT_RENDER_MAP}
        resolver={editorResolver}
      />
    </div>
  );
}

const selectedComponentIdAtom = atom<string | null>(null);

// remap properties
const propertyMapper = {
  paddingVertical: "paddingBlock",
  paddingHorizontal: "paddingInline",
  marginVertical: "marginBlock",
  marginHorizontal: "marginInline",
};

const fontScaling = 1.2;

const editorResolver = (text: string): ReactNode => {
  // replace each {{variable}} in a text with a chip
  const match = text.match(/(?<prefix>.*)(?<variable>{{.*}})(?<suffix>.*)/);
  const prefix = match?.groups?.prefix;
  const variable = match?.groups?.variable;
  const suffix = match?.groups?.suffix;

  if (!match) {
    return text;
  }

  return (
    <>
      {prefix ? editorResolver(prefix) : null}
      <span className="inline-flex h-4 items-center gap-2 rounded-[6px] bg-secondary px-1  text-secondary-foreground">
        {variable}
      </span>
      {suffix ? editorResolver(suffix) : null}
    </>
  );
};

const styleToCssProperties = (style?: InvoiceTemplateStyle) => {
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
};

const TEMPLATE_WEB_EDIT_RENDER_MAP: TemplateRenderMap = {
  page: ({ cmp, resolver }) => {
    return (
      <HoverContent id={cmp.id}>
        {(renderProps) => (
          <div
            style={styleToCssProperties(cmp.style)}
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
                renderMap={TEMPLATE_WEB_EDIT_RENDER_MAP}
                resolver={resolver}
              />
            ))}
          </div>
        )}
      </HoverContent>
    );
  },
  image: ({ cmp, resolver }) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        style={styleToCssProperties(cmp.style)}
        src={resolver(cmp.src, "value") as string}
        alt={cmp.id}
      />
    );
  },
  text: ({ cmp, resolver }) => {
    return (
      <HoverContent id={cmp.id}>
        {(renderProps) => (
          <div style={styleToCssProperties(cmp.style)} {...renderProps}>
            {resolver(cmp.value, "node")}
          </div>
        )}
      </HoverContent>
    );
  },

  list: ({ cmp, resolver }) => {
    return (
      <HoverContent id={cmp.id}>
        {(renderProps) => (
          <div style={styleToCssProperties(cmp.style)} {...renderProps}>
            <TemplateComponentRenderer
              component={cmp.item}
              renderMap={TEMPLATE_WEB_EDIT_RENDER_MAP}
              resolver={resolver}
            />
          </div>
        )}
      </HoverContent>
    );
  },

  view: ({ cmp, resolver }) => {
    return (
      <HoverContent id={cmp.id}>
        {(renderProps) => (
          <div style={styleToCssProperties(cmp.style)} {...renderProps}>
            {cmp.children?.map((child) => (
              <TemplateComponentRenderer
                key={child.id}
                component={child}
                renderMap={TEMPLATE_WEB_EDIT_RENDER_MAP}
                resolver={resolver}
              />
            ))}
          </div>
        )}
      </HoverContent>
    );
  },
};

type HoverContentRenderProps = {
  id: string;
  className: string;
  onMouseOver: (e: SyntheticEvent<HTMLElement>) => void;
  onMouseOut: (e: SyntheticEvent<HTMLElement>) => void;
  onClick: (e: SyntheticEvent<HTMLElement>) => void;
};

type HoverContentProps = {
  children: (props: HoverContentRenderProps) => React.ReactNode;
  id: string;
};
export const HoverContent = (props: HoverContentProps) => {
  const id = useId();
  const [isHovering, setIsHovering] = React.useState(false);

  const [selectedComponent, setSelectedComponent] = useAtom(
    selectedComponentIdAtom,
  );
  const selected = selectedComponent === props.id;

  const renderProps = {
    id,
    className: cn("border border-dashed p-[2px] cursor-pointer", {
      "border-muted-foreground border-solid": isHovering,
      "border-primary border-solid": selected,
    }),
    onMouseOver: (e: SyntheticEvent<HTMLElement>) => {
      const activeTarget = e.target as HTMLElement;
      if (activeTarget.id === id) {
        setIsHovering(true);
      }
    },
    onMouseOut: (e: SyntheticEvent<HTMLElement>) => {
      const activeTarget = e.target as HTMLElement;
      if (activeTarget.id === id) {
        setIsHovering(false);
      }
    },
    onClick: (e: SyntheticEvent<HTMLElement>) => {
      const activeTarget = e.target as HTMLElement;
      if (activeTarget.id === id) {
        setSelectedComponent(props.id);
      }
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return props.children(renderProps);
};
