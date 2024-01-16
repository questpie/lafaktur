"use client";
import { createContext, useContext, type PropsWithChildren } from "react";
import { type RouterOutputs } from "~/trpc/shared";

type Organization = RouterOutputs["organization"]["getBySlug"];
export const OrganizationContext = createContext<Organization>(
  {} as Organization,
);

export function OrganizationProvider(
  props: PropsWithChildren<{ organization: Organization }>,
) {
  return (
    <OrganizationContext.Provider value={props.organization}>
      {props.children}
    </OrganizationContext.Provider>
  );
}

export function useSelectedOrganization() {
  return useContext(OrganizationContext);
}
