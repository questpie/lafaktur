import { redirect } from "next/navigation";
import { setRequestLocale } from "~/i18n/server";
import { getServerAuthSession } from "~/server/auth/get-server-session";
import { api } from "~/trpc/server";

export default async function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const session = await getServerAuthSession();

  if (!session?.user) {
    return redirect("/auth/sign-in");
  }

  // TODO: save last selected organization to cookie or session
  const organizations = await api.organization.getByUser.query();

  if (!organizations?.length) {
    redirect("/onboarding/organization");
  }

  // TODO: pick selected org from session
  // session.user.
  // const selectedOrganization = ses

  redirect(`/${organizations[0]!.slug}`);
}
