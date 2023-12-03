"use client";
import { signOut, useSession } from "next-auth/react";
import { LuArrowLeft, LuLogOut, LuMenu } from "react-icons/lu";
import {
  HeaderAction,
  useBreadcrumbsData,
  useHeaderData,
} from "~/app/[locale]/(main)/dashboard/_components/header";
import { SearchBar } from "~/app/[locale]/(main)/dashboard/_components/searchbar";
import { useSidebarControl } from "~/app/[locale]/(main)/dashboard/_components/sidebar";
import { ThemeToggle } from "~/app/_components/theme/theme-toggle";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";
import { Button, LinkButton } from "~/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";

export default function Navbar() {
  const session = useSession();
  const user = session.data?.user;

  const { setIsOpen: setSidebarOpen } = useSidebarControl();
  const headerData = useHeaderData();

  const breadcrumbsData = useBreadcrumbsData();

  const goBackBreadcrumb = breadcrumbsData[breadcrumbsData.length - 2] ?? null;

  return (
    <div className="flex w-full flex-col border-b py-3">
      <nav className="flex w-full items-center justify-between px-4  md:px-8">
        {/* desktop */}
        <div className="hidden w-full max-w-xl flex-row gap-0 md:flex">
          <SearchBar />
        </div>
        <div className="hidden items-center gap-4 md:flex">
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

        {/* mobile */}
        <div className="flex flex-1 flex-row items-center gap-1 md:hidden">
          {goBackBreadcrumb && (
            <LinkButton
              variant="ghost"
              href={goBackBreadcrumb.href}
              size="iconSm"
            >
              <LuArrowLeft />
            </LinkButton>
          )}
          <h1 className="text-lg font-bold">{headerData.title}</h1>
        </div>
        <div className="flex flex-row items-center gap-4 md:hidden">
          <HeaderAction type="other" />
          <Button
            aria-label="Open sidebar"
            variant="outline"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
            size="iconSm"
          >
            <LuMenu />
          </Button>
        </div>
      </nav>
    </div>
  );
}
