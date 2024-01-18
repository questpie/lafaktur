"use client";
import { atom, type WritableAtom } from "jotai";
import { useHydrateAtoms } from "jotai/react/utils";
import { type INTERNAL_InferAtomTuples } from "jotai/react/utils/useHydrateAtoms";
import { type PropsWithChildren } from "react";

export function HydrateAtoms<
  T extends (readonly [WritableAtom<any, any, any>, unknown])[],
>(
  props: PropsWithChildren<{
    // TODO: fix this type
    initialValues: INTERNAL_InferAtomTuples<T>;
  }>,
) {
  useHydrateAtoms(props.initialValues);
  return props.children;
}

const testAtom = atom(0);
<HydrateAtoms initialValues={[[testAtom, 0]]} />;
