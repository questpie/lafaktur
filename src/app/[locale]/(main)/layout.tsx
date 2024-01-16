import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";
import { getServerAuthSession } from "~/server/auth";

export default async function MainLayout(props: PropsWithChildren) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <>{props.children}</>;
}
