"use client";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LuSearch } from "react-icons/lu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";

export default function Navbar() {
  const session = useSession();
  const t = useTranslations();

  const user = session.data?.user;

  return (
    <nav className="flex w-full items-center justify-between border-b px-4 py-3 md:px-8">
      <div className="flex w-full max-w-xl flex-row gap-0">
        <Input
          variant="filled"
          className={{ wrapper: "w-full rounded-e-none  " }}
          before={<LuSearch />}
          placeholder={"Search"}
        />
        <Button variant="default" className="rounded-s-none">
          Search
        </Button>
      </div>
      <Avatar>
        <AvatarImage src={"/test"} />
        <AvatarFallback>
          {(user?.name ?? user?.email)?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </nav>
  );
}
