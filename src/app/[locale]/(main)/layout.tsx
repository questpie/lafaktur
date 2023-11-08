"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type PropsWithChildren } from "react";

export default function MainLayout(props: PropsWithChildren) {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") return null;

  if (session.status === "unauthenticated") {
    router.replace("/auth/sign-in");
    return null;
  }

  return <>{props.children}</>;
}
