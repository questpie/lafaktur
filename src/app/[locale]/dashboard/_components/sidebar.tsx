"use client";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import Link from "next/link";
import { useState } from "react";
import {
  LuCat,
  LuChevronDown,
  LuChevronUp,
  LuLayoutDashboard,
  LuList,
  LuNewspaper,
  LuPlus,
  LuUser2,
} from "react-icons/lu";
import { Button } from "~/app/_components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/app/_components/ui/collapsible";
import { cn } from "~/app/_utils/styles-utils";
import { $t } from "~/i18n/dummy";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

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
    href: "/dashboard",
  },
  {
    name: $t("dashboard.sidebar.invoices"),
    icon: <LuNewspaper />,
    children: [
      {
        icon: <LuList />,
        name: $t("dashboard.sidebar.invoicesAll"),
        href: "/dashboard/invoice",
      },
      {
        icon: <LuPlus />,
        name: $t("dashboard.sidebar.invoicesAdd"),
        href: "/dashboard/invoice/add",
      },
    ],
  },
  {
    name: $t("dashboard.sidebar.customers"),
    icon: <LuUser2 />,
    children: [
      {
        icon: <LuList />,
        name: $t("dashboard.sidebar.customersAll"),
        href: "/dashboard/customers",
      },
      {
        icon: <LuPlus />,
        name: $t("dashboard.sidebar.customersAdd"),
        href: "/dashboard/customers/add",
      },
    ],
  },
  {
    name: $t("dashboard.sidebar.invoiceTemplates"),
    icon: <LuCat />,
    children: [
      {
        name: $t("dashboard.sidebar.invoiceTemplatesAll"),
        icon: <LuList />,
        href: "/dashboard/templates",
      },
      {
        name: $t("dashboard.sidebar.invoiceTemplatesAdd"),
        icon: <LuPlus />,
        href: "/dashboard/templates/add",
      },
    ],
  },
];

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen w-[300px] flex-col gap-6 border-e px-2 py-6",
        className,
      )}
      {...props}
    >
      <h2 className="flex flex-col gap-2 px-4 text-xl font-bold tracking-tight">
        Pet Guide
      </h2>
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
  const isActive = !!item.href && pathname.startsWith(item.href);

  const [isOpen, setIsOpen] = useState<boolean>(isChildActive || isActive);

  const t = useTranslations();
  if (item.href && !item.children) {
    return (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start gap-4"
        asChild
      >
        <Link href={item.href}>
          {item.icon} {t(item.name as any)}
        </Link>
      </Button>
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
          return (
            <Button
              key={i}
              variant={isActive ? "secondary" : "ghost"}
              className="justify-start gap-4"
            >
              {child.icon} {t(child.name as any)}
            </Button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
