import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  invoiceTemplateAtom,
  invoiceTemplateStateAtom,
  selectedComponentIdAtom,
  useInvoiceTemplateListener,
} from "~/app/[locale]/(main)/[organization]/templates/[id]/_atoms/template-editor-atoms";
import { TEMPLATE_EDITOR_RENDER_MAP } from "~/app/[locale]/(main)/[organization]/templates/[id]/_components/template-editor/template-editor-render-map";
import { TemplateEditorSidebar } from "~/app/[locale]/(main)/[organization]/templates/[id]/_components/template-editor/template-editor-sidebar";
import { Badge } from "~/app/_components/ui/badge";
import { Card, CardContent } from "~/app/_components/ui/card";
import { Spinner } from "~/app/_components/ui/spinner";
import { useDebounce } from "~/app/_hooks/use-debounce";
import { useDimensions } from "~/app/_hooks/use-dimensions";
import { cn } from "~/app/_utils/styles-utils";
import { type InvoiceTemplate } from "~/server/db/db-schema";
import { INVOICE_VARIABLE_LABELS } from "~/shared/invoice-template/invoice-template-constants";
import { parseTemplateTextValue } from "~/shared/invoice-template/invoice-template-helpers";
import { type InvoiceVariable } from "~/shared/invoice-template/invoice-template-schemas";
import { TemplateRenderer } from "~/shared/invoice-template/render/template-renderer";
import { api } from "~/trpc/react";

function editorResolver(text: string): ReactNode {
  // replace each {{variable}} in a text with a chip
  const nodes = parseTemplateTextValue(text);

  return (
    <span
      className={cn(
        "pointer-events-none inline-flex w-full items-center overflow-hidden",
      )}
    >
      {nodes.map((node, i) => {
        const key = `${node.value}-${i}`;
        if (node.type === "text") {
          return <span key={key}>{node.value}</span>;
        }

        const variable = node.value as InvoiceVariable;
        const label = INVOICE_VARIABLE_LABELS[variable];

        return (
          <span
            key={key}
            className={cn(
              "line-clamp-1 text-ellipsis rounded bg-muted-foreground px-[2px] text-background",
            )}
            style={{ fontSize: "Inherit" }}
          >
            {label}
          </span>
        );
      })}
    </span>
  );
}

type TemplateEditorLayoutProps = {
  invoiceTemplate: InvoiceTemplate;
};

export function TemplateEditor(props: TemplateEditorLayoutProps) {
  const [invoiceTemplate, setInvoiceTemplate] = useAtom(invoiceTemplateAtom);
  const setSelectedComponent = useSetAtom(selectedComponentIdAtom);
  const selectedComponentId = useAtomValue(selectedComponentIdAtom);
  const invoiceContainerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(invoiceContainerRef);
  const [invoiceTemplateState, setInvoiceTemplateState] = useAtom(
    invoiceTemplateStateAtom,
  );

  const updateMutation = api.invoiceTemplate.update.useMutation({
    onMutate() {
      setInvoiceTemplateState("saving");
    },
    onSuccess() {
      setInvoiceTemplateState("saved");
    },
  });
  const debouncedMutate = useDebounce(updateMutation.mutate, 500);

  useEffect(() => {
    setInvoiceTemplate(structuredClone(props.invoiceTemplate));
    setSelectedComponent(props.invoiceTemplate.template.content.id);
    return () => {
      setInvoiceTemplate(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInvoiceTemplateListener(
    useCallback(
      (get, set, newVal, prev) => {
        if (!prev || !newVal) return;
        if (updateMutation.isLoading) return;
        debouncedMutate(newVal);
      },
      [debouncedMutate, updateMutation.isLoading],
    ),
  );

  if (!invoiceTemplate) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-end gap-2">
        {invoiceTemplateState === "saving" ? (
          <>
            <Spinner size="sm" />
            <span className="text-xs text-muted-foreground">Saving...</span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">
            {invoiceTemplateState === "saved" ? "Saved" : "Not saved"}
          </span>
        )}
      </div>

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
    </div>
  );
}
