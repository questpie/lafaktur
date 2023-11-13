import { useAtom } from "jotai";
import React, { useId, type SyntheticEvent } from "react";
import { selectedComponentIdAtom } from "~/app/[locale]/(main)/dashboard/templates/[id]/_components/template-editor/template-editor-atoms";
import { cn } from "~/app/_utils/styles-utils";

type RenderProps = {
  id: string;
  className: string;
  onMouseOver: (e: SyntheticEvent<HTMLElement>) => void;
  onMouseOut: (e: SyntheticEvent<HTMLElement>) => void;
  onClick: (e: SyntheticEvent<HTMLElement>) => void;
};

type Props = {
  children: (props: RenderProps) => React.ReactNode;
  id: string;
};

export const TemplateEditorHoverContainer = (props: Props) => {
  const id = useId();
  const [isHovering, setIsHovering] = React.useState(false);

  const [selectedComponent, setSelectedComponent] = useAtom(
    selectedComponentIdAtom,
  );
  const selected = selectedComponent === props.id;

  const renderProps = {
    id,
    className: cn("border p-[2px] border-transparent cursor-pointer", {
      "border border-muted-foreground border-solid": isHovering,
      "border border-primary border-solid": selected,
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
