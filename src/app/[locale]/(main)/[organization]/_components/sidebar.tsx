"use client";
import { atom, useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import {
  LuBookTemplate,
  LuChevronDown,
  LuChevronLeft,
  LuChevronUp,
  LuLayoutDashboard,
  LuNewspaper,
  LuUser2,
} from "react-icons/lu";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { SearchBar } from "~/app/[locale]/(main)/[organization]/_components/searchbar";
import { Button, LinkButton } from "~/app/_components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/app/_components/ui/collapsible";
import { cn } from "~/app/_utils/styles-utils";
import { $t } from "~/i18n/dummy";
import { usePathname } from "~/i18n/navigation";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

const sidebarAtom = atom<boolean>(false);

export function useSidebarControl() {
  const [isOpen, setIsOpen] = useAtom(sidebarAtom);
  return {
    isOpen,
    setIsOpen,
    toggle: useCallback(() => setIsOpen((prev) => !prev), [setIsOpen]),
  };
}

export type SidebarItem = {
  name: string;
  href?: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
} & (
  | {
      href: string;
      children?: never;
    }
  | {
      href?: never;
      children: SidebarItem[];
    }
);

const sidebarItems: SidebarItem[] = [
  {
    icon: <LuLayoutDashboard />,
    name: $t("dashboard.sidebar.overview"),
    href: "/[organization]",
  },
  {
    name: $t("dashboard.sidebar.invoices"),
    icon: <LuNewspaper />,
    href: "/[organization]/invoices",
  },
  {
    name: $t("dashboard.sidebar.customers"),
    icon: <LuUser2 />,
    href: "/[organization]/customers",
  },
  {
    name: $t("dashboard.sidebar.invoiceTemplates"),
    icon: <LuBookTemplate />,
    href: "/[organization]/templates",
  },
];

export function Sidebar({ className, ...props }: SidebarProps) {
  const { isOpen, setIsOpen } = useSidebarControl();

  return (
    <div
      className={cn(
        "fixed z-50 flex min-h-screen w-screen translate-x-0 flex-col gap-6 overflow-hidden border-e bg-background px-2 py-6 transition-transform md:relative md:w-[300px]",
        { ["-translate-x-[100%] md:translate-x-0"]: !isOpen },
        className,
      )}
      {...props}
    >
      <div className="flex flex-row justify-between gap-2">
        <h2 className="px-4 text-xl font-bold tracking-tight">
          <span className="text-primary">la</span>
          <span>faktur</span>
        </h2>
        <Button
          variant="outline"
          size="iconSm"
          className="md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <LuChevronLeft />
        </Button>
      </div>

      <div className="block md:hidden">
        <SearchBar />
      </div>

      <div className="flex flex-col gap-3">
        {sidebarItems.map((item, i) => {
          return <SidebarListItem key={i} item={item} />;
        })}
      </div>
    </div>
  );
}

type SidebarListItemProps = {
  item: SidebarItem;
};

export function SidebarListItem({ item }: SidebarListItemProps) {
  const pathname = usePathname();
  const isChildActive = !!item.children?.some((child) =>
    pathname.startsWith(child.href!),
  );
  const [isOpen, setIsOpen] = useState<boolean>(isChildActive);
  const selectedOrg = useSelectedOrganization();
  const { setIsOpen: setSidebarOpen } = useSidebarControl();
  item.href = item.href
    ? item.href.replace("[organization]", selectedOrg.slug)
    : item.href;

  const t = useTranslations();

  if (item.href && !item.children) {
    const isActive = item.href === pathname;
    return (
      <LinkButton
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-4",
          isActive && "pointer-events-none cursor-default",
        )}
        href={!isActive ? item.href : undefined}
        onClick={() => setSidebarOpen(false)}
      >
        {item.icon} {t(item.name as any)}
      </LinkButton>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between gap-4">
          <div className="flex flex-row items-center gap-4">
            {item.icon} {t(item.name as any)}
          </div>
          {isOpen ? <LuChevronUp /> : <LuChevronDown />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-4 flex flex-col gap-2">
        {item.children?.map((child, i) => {
          const isActive = child.href === pathname;
          return (
            <LinkButton
              key={i}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "justify-start gap-4",
                i == 0 && "mt-2",
                isActive && "pointer-events-none cursor-default",
              )}
              href={!isActive ? child.href : undefined}
              disabled={isActive}
              onClick={() => setSidebarOpen(false)}
            >
              {child.icon} {t(child.name as any)}
            </LinkButton>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
