import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "~/i18n/server";

export default async function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const session = await getServerSession();

  if (!session) {
    return redirect("/auth/sign-in");
  }

  redirect("/dashboard");
}
