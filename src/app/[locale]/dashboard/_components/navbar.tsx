"use client";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LuLogOut, LuSearch } from "react-icons/lu";
import { ThemeToggle } from "~/app/_components/theme/theme-toggle";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import { Button } from "~/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { Input } from "~/app/_components/ui/input";

export default function Navbar() {
  const session = useSession();
  const t = useTranslations();

  const user = session.data?.user;

  const router = useRouter();

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
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={"/test"} />
              <AvatarFallback>
                {(user?.name ?? user?.email)?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="gap-2"
              onClick={async () => {
                await signOut({ callbackUrl: "/" });
              }}
            >
              <LuLogOut /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
