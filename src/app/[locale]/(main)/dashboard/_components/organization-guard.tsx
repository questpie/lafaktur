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

/**
 * This functions suspends if organizations are not fetched yet.
 * @returns user-selected active organization
 */
export function useSelectedOrganization() {
  /**
   * Get stored organization id
   */
  const [selectedOrganizationId, setSelectedOrganizationId] = useAtom(
    selectedOrganizationAtom,
  );
  /**
   * Fetch all-of users organizations
   */
  const [organizations] = api.organization.getByUser.useSuspenseQuery(
    undefined,
    { refetchInterval: false, refetchOnMount: false },
  );

  /** If there are no organizations to choose from just return null */
  if (!organizations.length) return null;

  /** If we have organizations but there is no stored selected organization id we will just choose the first org */
  if (selectedOrganizationId === null) {
    setSelectedOrganizationId(organizations[0]!.id);
    return organizations[0];
  }

  /**
   * If we have an organization id selected we will lookup for given org
   */
  const selectedOrganizationIndex = organizations.findIndex(
    (org) => org.id === selectedOrganizationId,
  );

  /**
   * if we haven't found any organization just correct the selection by selecting the first one
   */
  if (selectedOrganizationIndex === -1) {
    setSelectedOrganizationId(organizations[0]!.id);
    return organizations[0];
  }

  /**
   * return found organization
   */
  return organizations[selectedOrganizationIndex];
}

/**
 * If there is no selected organization, this component will redirect user to /onboarding/organization
 */
export function OrganizationGuard({ children }: PropsWithChildren) {
  const organization = useSelectedOrganization();
  const router = useRouter();

  if (!organization) {
    router.replace("/onboarding/organization");
    return null;
  }

  return <>{children}</>;
}
