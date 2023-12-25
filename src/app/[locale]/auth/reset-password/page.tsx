import { redirect } from "next/navigation";
import ResetPasswordForm from "~/app/[locale]/auth/reset-password/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: { token?: string };
};

export default function ResetPasswordPage(props: ResetPasswordPageProps) {
  const token = props.searchParams.token;

  if (!token) redirect("/auth/sign-in");
  // TODO: fetch token and check it's validity

  return <ResetPasswordForm token={token} />;
}
