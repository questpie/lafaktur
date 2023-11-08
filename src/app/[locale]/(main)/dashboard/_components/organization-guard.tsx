import { isServer } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { type PropsWithChildren } from "react";
import { api } from "~/trpc/react";

const selectedOrganizationKey = "selectedOrganization";

const selectedOrganizationIdAtom = atom<string | null>(
  isServer ? null : localStorage.getItem(selectedOrganizationKey) ?? null,
);

const selectedOrganizationAtom = atom(
  (get) => {
    return Number(get(selectedOrganizationIdAtom));
  },
  (_, set, update: number | null) => {
    if (update === null) {
      set(selectedOrganizationIdAtom, null);
      localStorage.removeItem(selectedOrganizationKey);
      return;
    }
    set(selectedOrganizationIdAtom, String(update));
    localStorage.setItem(selectedOrganizationKey, String(update));
  },
);

export function useSelectedOrganization() {
  const [selectedOrganizationId, setSelectedOrganizationId] = useAtom(
    selectedOrganizationAtom,
  );
  const [organizations] = api.organization.getByUser.useSuspenseQuery();

  if (!organizations.length) return null;

  if (selectedOrganizationId === null) {
    setSelectedOrganizationId(organizations[0]!.id);
    return organizations[0];
  }

  const selectedOrganizationIndex = organizations.findIndex(
    (org) => org.id === selectedOrganizationId,
  );

  if (selectedOrganizationIndex === -1) {
    setSelectedOrganizationId(organizations[0]!.id);
    return organizations[0];
  }

  return organizations[selectedOrganizationIndex];
}

export function OrganizationGuard({ children }: PropsWithChildren) {
  const organization = useSelectedOrganization();
  const router = useRouter();

  if (!organization) {
    router.replace("/onboarding/organization");
    return null;
  }

  return <>{children}</>;
}
