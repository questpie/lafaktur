import { type PropsWithChildren } from "react";
import { useSelectedComponent } from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { ColorEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/color-editor";
import { ComponentTreeEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/component-tree-editor";
import { ComponentTypeEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/component-type-editor";
import { FontEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/font-editor";
import { GeneralEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/general-editor";
import { SpacingEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/spacing-editor";
import { TextContentEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/text-content-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";

export function TemplateEditorSidebar() {
  const [selectedComponent] = useSelectedComponent();

  if (!selectedComponent) return null;

  return (
    <Accordion
      className="flex h-auto flex-col gap-4"
      type="multiple"
      defaultValue={["general", "component-tree"]}
    >
      {/* general */}
      <AccordionItem value="general">
        <AccordionTrigger>
          <SidebarSectionLabel>General</SidebarSectionLabel>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <GeneralEditor />
          <ComponentTypeEditor />
          <TextContentEditor />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="component-tree">
        <AccordionTrigger>
          <SidebarSectionLabel>Component tree</SidebarSectionLabel>
        </AccordionTrigger>
        <AccordionContent>
          <ComponentTreeEditor />
        </AccordionContent>
      </AccordionItem>

      {/* spacing */}
      <AccordionItem value="spacing">
        <AccordionTrigger>
          <SidebarSectionLabel>Spacing</SidebarSectionLabel>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <SpacingEditor type="margin" />
          <SpacingEditor type="padding" />
        </AccordionContent>
      </AccordionItem>

      {/* font */}
      <AccordionItem value="font">
        <AccordionTrigger>
          <SidebarSectionLabel>Font</SidebarSectionLabel>
        </AccordionTrigger>
        <AccordionContent>
          <FontEditor />
        </AccordionContent>
      </AccordionItem>

      {/* fill */}
      <AccordionItem value="fill">
        <AccordionTrigger>
          <SidebarSectionLabel>Fill</SidebarSectionLabel>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <ColorEditor type="backgroundColor" />
          <ColorEditor type="color" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function SidebarSectionLabel(props: PropsWithChildren) {
  return (
    <div className="text-xs font-semibold text-muted-foreground">
      {props.children}
    </div>
  );
}
