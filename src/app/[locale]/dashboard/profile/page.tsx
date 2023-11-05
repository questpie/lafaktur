import { getServerSession } from "next-auth";
import SignOutButton from "~/app/[locale]/auth/_components/sign-out-button";

export default async function ProfilePage() {
  const session = await getServerSession();

  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <SignOutButton />
      </div>
      <p className="text-xl font-semibold">{session?.user?.email}</p>
    </div>
  );
}
