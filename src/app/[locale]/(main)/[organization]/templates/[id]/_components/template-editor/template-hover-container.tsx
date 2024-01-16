import { useAtom } from "jotai";
import type React from "react";
import { useId, type SyntheticEvent } from "react";
import {
  highlightedComponentIdAtom,
  selectedComponentIdAtom,
} from "~/app/[locale]/(main)/[organization]/templates/[id]/_atoms/template-editor-atoms";
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
  const [highlightedComponentId, setHighlightedComponentId] = useAtom(
    highlightedComponentIdAtom,
  );

  const [selectedComponent, setSelectedComponent] = useAtom(
    selectedComponentIdAtom,
  );
  const selected = selectedComponent === props.id;

  const renderProps = {
    id,
    className: cn("border border-transparent cursor-pointer", {
      "border border-muted-foreground border-solid":
        highlightedComponentId === props.id && !selected,
      "border border-primary border-solid": selected,
    }),
    onMouseOver: (e: SyntheticEvent<HTMLElement>) => {
      const activeTarget = e.target as HTMLElement;
      if (activeTarget.id === id) {
        setHighlightedComponentId(props.id);
      }
    },
    onMouseOut: (e: SyntheticEvent<HTMLElement>) => {
      const activeTarget = e.target as HTMLElement;
      if (activeTarget.id === id) {
        setHighlightedComponentId(props.id);
      }
      setHighlightedComponentId;
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
