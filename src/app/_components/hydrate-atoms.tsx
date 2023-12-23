import { useHydrateAtoms } from "jotai/react/utils";
import { type PropsWithChildren } from "react";

export function HydrateAtoms(
  props: PropsWithChildren<{
    // TODO: fix this type
    initialValues: Parameters<typeof useHydrateAtoms<any>>[0];
  }>,
) {
  useHydrateAtoms(props.initialValues);
  return props.children;
}
