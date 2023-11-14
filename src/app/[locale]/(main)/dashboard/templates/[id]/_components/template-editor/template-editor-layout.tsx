import { useAtom, useSetAtom } from "jotai";
import { useEffect, type ReactNode } from "react";
import {
  invoiceTemplateAtom,
  selectedComponentIdAtom,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-atoms";
import { TEMPLATE_EDITOR_RENDER_MAP } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-render-map";
import { TemplateEditorSidebar } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-sidebar";
import { Card, CardContent } from "~/app/_components/ui/card";
import { type InvoiceTemplate } from "~/server/db/schema";
import { TemplateRenderer } from "~/shared/invoice-template/render/template-renderer";

function editorResolver(text: string): ReactNode {
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
      {prefix ? <span>{editorResolver(prefix)}</span> : null}
      <span className="inline-flex h-4 items-center gap-2 rounded-[6px] bg-secondary px-1  text-secondary-foreground">
        {variable}
      </span>
      {suffix ? <span>{editorResolver(suffix)}</span> : null}
    </>
  );
}

type TemplateEditorLayoutProps = {
  invoiceTemplate: InvoiceTemplate;
};

export function TemplateEditorLayout(props: TemplateEditorLayoutProps) {
  const [invoiceTemplate, setInvoiceTemplate] = useAtom(invoiceTemplateAtom);
  const setSelectedComponent = useSetAtom(selectedComponentIdAtom);

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
    <div className="grid w-full max-w-[1000px] grid-cols-12 @container">
      <div className="order-2 col-span-12 h-auto rounded-md rounded-e-none border @lg:order-1  @lg:col-span-8">
        <TemplateRenderer
          invoiceTemplate={invoiceTemplate}
          renderMap={TEMPLATE_EDITOR_RENDER_MAP}
          resolver={editorResolver}
        />
      </div>
      <Card className="order-1 col-span-1 max-h-full overflow-y-hidden rounded-s-none border-s-0 @lg:order-2 @lg:col-span-4">
        <CardContent className="p-4">
          <TemplateEditorSidebar />
        </CardContent>
      </Card>
    </div>
  );
}
