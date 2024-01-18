"use client";

import { atom, useAtomValue, useSetAtom } from "jotai";
import { type Session } from "lucia";
import { useEffect } from "react";
import { api } from "~/trpc/react";

type Props = {
  children?: React.ReactNode;
  session: { user: Session["user"] } | null;
};

const sessionAtom = atom<{ user: Session["user"] } | null>(null);

export function AuthProvider({ children }: Props) {
  const getMeQuery = api.auth.getMe.useQuery();
  const setSession = useSetAtom(sessionAtom);

  useEffect(() => {
    if (getMeQuery.error) {
      setSession(null);
      return;
    }
    setSession(getMeQuery.data ? { user: getMeQuery.data } : null);
  }, [getMeQuery.data, getMeQuery.error, setSession]);

  return <>{children}</>;
}

export const useSession = () => {
  const session = useAtomValue(sessionAtom);
  return session;
};
