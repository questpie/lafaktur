import { redirect } from "next/navigation";
import { setRequestLocale } from "~/i18n/server";
import { getServerAuthSession } from "~/server/auth";

export default async function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/auth/sign-in");
  }

  redirect("/dashboard");
}
