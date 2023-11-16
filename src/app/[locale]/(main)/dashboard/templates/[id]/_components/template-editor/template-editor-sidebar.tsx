import { useSetAtom } from "jotai";
import { type PropsWithChildren } from "react";
import {
  selectedComponentIdAtom,
  useSelectedComponent,
} from "~/app/[locale]/(main)/dashboard/templates/[id]/_atoms/template-editor-atoms";
import { ChildrenEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/children-editor";
import { ColorEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/color-editor";
import { ComponentTypeEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/component-type-editor";
import { FontEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/font-editor";
import { GeneralEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/general-editor";
import { SpacingEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/spacing-editor";
import { TextContentEditor } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/editors/text-content-editor";
import { Separator } from "~/app/_components/ui/separator";

export function TemplateEditorSidebar() {
  const setSelectedComponent = useSetAtom(selectedComponentIdAtom);
  const [selectedComponent, updateComponent] = useSelectedComponent();

  if (!selectedComponent) return null;

  return (
    <div className="flex h-auto flex-col gap-4">
      {/* general */}
      <SidebarSectionLabel>General</SidebarSectionLabel>
      <div className="flex flex-col gap-2">
        <GeneralEditor />
        <ComponentTypeEditor />
        <TextContentEditor />
        <ChildrenEditor />
      </div>

      <Separator />

      {/* spacing */}
      <SidebarSectionLabel>Spacing</SidebarSectionLabel>
      <div className="flex flex-col gap-2">
        <SpacingEditor type="margin" />
        <SpacingEditor type="padding" />
      </div>
      <Separator />

      {/* font */}
      <SidebarSectionLabel>Font</SidebarSectionLabel>
      <FontEditor />
      <Separator />

      {/* fill */}
      <SidebarSectionLabel>Fill</SidebarSectionLabel>
      <div className="flex flex-col gap-2">
        <ColorEditor type="backgroundColor" />
        <ColorEditor type="color" />
      </div>
    </div>
  );
}

function SidebarSectionLabel(props: PropsWithChildren) {
  return (
    <div className="text-xs font-semibold text-muted-foreground">
      {props.children}
    </div>
  );
}
