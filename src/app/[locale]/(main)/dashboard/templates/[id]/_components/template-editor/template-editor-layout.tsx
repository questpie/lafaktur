import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, type ReactNode } from "react";
import {
  invoiceTemplateAtom,
  selectedComponentIdAtom,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { TEMPLATE_EDITOR_RENDER_MAP } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-render-map";
import { TemplateEditorSidebar } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-sidebar";
import { Badge } from "~/app/_components/ui/badge";
import { Card, CardContent } from "~/app/_components/ui/card";
import { useDimensions } from "~/app/_hooks/use-dimensions";
import { cn } from "~/app/_utils/styles-utils";
import { type InvoiceTemplate } from "~/server/db/schema";
import { INVOICE_VARIABLE_LABELS } from "~/shared/invoice-template/invoice-template-constants";
import { parseTemplateTextValue } from "~/shared/invoice-template/invoice-template-helpers";
import { type InvoiceVariable } from "~/shared/invoice-template/invoice-template-schemas";
import { TemplateRenderer } from "~/shared/invoice-template/render/template-renderer";

function editorResolver(text: string): ReactNode {
  // replace each {{variable}} in a text with a chip
  const nodes = parseTemplateTextValue(text);

  return (
    <span className={cn("inline-flex items-center")}>
      {nodes.map((node, i) => {
        const key = `${node.value}-${i}`;
        if (node.type === "text") {
          return <span key={key}>{node.value}</span>;
        }

        const variable = node.value as InvoiceVariable;
        const label = INVOICE_VARIABLE_LABELS[variable];

        return (
          <Badge
            key={key}
            variant={"secondary"}
            className={cn(
              "mx-[1px] line-clamp-1 max-w-full text-ellipsis whitespace-nowrap px-1 py-0",
            )}
            style={{ fontSize: "Inherit" }}
          >
            {label}
          </Badge>
        );
      })}
    </span>
  );
}

type TemplateEditorLayoutProps = {
  invoiceTemplate: InvoiceTemplate;
};

export function TemplateEditorLayout(props: TemplateEditorLayoutProps) {
  const [invoiceTemplate, setInvoiceTemplate] = useAtom(invoiceTemplateAtom);
  const setSelectedComponent = useSetAtom(selectedComponentIdAtom);
  const selectedComponentId = useAtomValue(selectedComponentIdAtom);

  const invoiceContainerRef = useRef<HTMLDivElement>(null);

  const dimensions = useDimensions(invoiceContainerRef);

  useEffect(() => {
    setInvoiceTemplate(structuredClone(props.invoiceTemplate));
    setSelectedComponent(props.invoiceTemplate.template.content.id);
    return () => {
      setInvoiceTemplate(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!invoiceTemplate) {
    return null;
  }

  return (
    <div className="grid w-full grid-cols-12 @container">
      <div
        className="col-span-12 h-min overflow-hidden rounded-lg rounded-e-none border @lg:col-span-8"
        ref={invoiceContainerRef}
      >
        <TemplateRenderer
          invoiceTemplate={invoiceTemplate}
          renderMap={TEMPLATE_EDITOR_RENDER_MAP}
          resolver={editorResolver}
        />
      </div>
      <Card
        className={cn(
          "col-span-12 w-full overflow-y-auto rounded-s-none border-s-0 @lg:col-span-4",
        )}
        style={{ height: dimensions?.height }}
      >
        <CardContent className=" p-4">
          <TemplateEditorSidebar key={selectedComponentId} />
        </CardContent>
      </Card>
    </div>
  );
}
