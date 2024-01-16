/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import React, { useEffect, useEffect as useLayoutEffect } from "react";
import { LuMoreVertical } from "react-icons/lu";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { Button, LinkButton } from "~/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/app/_components/ui/dropdown-menu";
import { Spinner } from "~/app/_components/ui/spinner";
import { cn } from "~/app/_utils/styles-utils";
import { usePathname } from "~/i18n/navigation";

export type HeaderActionItem<TForceIcon extends boolean = false> = {
  label: string;
  icon?: React.ReactNode;
  onClick?: (event: any) => void;
  href?: string;
  isLoading?: boolean;
  Wrapper?: React.ComponentType;
} & (TForceIcon extends true
  ? {
      icon: React.ReactNode;
    }
  : {
      icon?: React.ReactNode;
    });

export type HeaderState = {
  title: string;
  description?: string;
  mainAction?: HeaderActionItem;
  secondaryAction?: HeaderActionItem;
  otherActions?: HeaderActionItem[];
};

export type Breadcrumb = {
  label: string;
  href: string;
  level: number;
};

const headerAtom = atom<HeaderState>({
  title: "",
  description: "",
  mainAction: undefined,
  secondaryAction: undefined,
  otherActions: [],
});

const breadcrumbsAtom = atom<Breadcrumb[]>([]);

const setHeaderData = atom(
  null, // it's a convention to pass `null` for the first argument
  (get, set, update: HeaderState) => {
    set(headerAtom, update);
  },
);

// TODO: get rid of this logic
const useHeaderSegment = (state: HeaderState) => {
  const setHeader = useSetAtom(setHeaderData);

  useEffect(() => {
    setHeader(state);

    return () => {
      setHeader({
        title: "",
        description: "",
        mainAction: undefined,
        secondaryAction: undefined,
        otherActions: [],
      });
    };
  }, [state, setHeader]);
};
export const useHeaderData = () => {
  return useAtomValue(headerAtom);
};

export const useBreadcrumbsData = () => {
  const breadcrumbsData = useAtomValue(breadcrumbsAtom);

  const sortedBreadcrumbs = breadcrumbsData.sort((a, b) => {
    return a.level - b.level;
  });

  return sortedBreadcrumbs;
};

const useBreadcrumbSegment = (segment: Breadcrumb) => {
  const setBreadCrumbs = useSetAtom(breadcrumbsAtom);

  useLayoutEffect(() => {
    setBreadCrumbs((prev) => [...prev, segment]);
    return () => {
      setBreadCrumbs((prev) => {
        const newBreadCrumb = [...prev];
        newBreadCrumb.pop();
        return newBreadCrumb;
      });
    };
  }, [segment.href, segment.label, segment.level]);
};

/**
 * Sets the header data
 */
export function HeaderSegment(props: HeaderState) {
  useHeaderSegment(props);
  return <> </>;
}

/**
 * Sets the breadcrumb segment data
 */
export function BreadcrumbSegment(props: Breadcrumb) {
  useBreadcrumbSegment(props);
  return <></>;
}

export function Header() {
  const headerData = useHeaderData();
  const breadcrumbs = useBreadcrumbsData();
  const pathname = usePathname();

  const t = useTranslations();

  useLayoutEffect(() => {
    document.title = `${headerData.title} | lafaktur`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", headerData.description ?? "");
  }, [headerData.title, headerData.description]);

  const selectedOrg = useSelectedOrganization();

  const fullBreadcrumbs = [
    {
      label: t("dashboard.breadcrumbs.dashboard"),
      href: `/${selectedOrg.slug}`,
      level: 0,
    },
    ...breadcrumbs,
  ];

  return (
    <>
      {/* desktop */}
      <div className="hidden w-full flex-col gap-2 md:flex">
        <div className="flex h-6 gap-2">
          {fullBreadcrumbs.map((breadcrumb, i) => {
            const isActive = pathname === breadcrumb.href;

            return (
              <div
                key={i}
                className="flex flex-row items-center gap-2 text-sm text-muted-foreground"
              >
                <LinkButton
                  variant="link"
                  href={breadcrumb.href}
                  className={cn(
                    "px-0 py-0 text-muted-foreground",
                    isActive && "pointer-events-none cursor-default font-bold",
                  )}
                >
                  {breadcrumb.label}
                </LinkButton>
                {i !== fullBreadcrumbs.length - 1 && <span>/</span>}
              </div>
            );
          })}
        </div>
        <div className="flex w-full flex-row justify-between">
          <h1 className="flex-1 text-3xl font-bold">{headerData.title}</h1>
          <div className="flex flex-row gap-2">
            <HeaderAction type="other" />
            <HeaderAction type="secondary" />
            <HeaderAction type="main" />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {headerData.description}
          </p>
        </div>
      </div>

      {/* mobile */}
      <div className="flex flex-col gap-2 md:hidden">
        <p className="text-sm text-muted-foreground">
          {headerData.description}
        </p>
        <div className="flex flex-row items-center justify-between gap-2 ">
          <HeaderAction type="secondary" />
          <HeaderAction type="main" />
        </div>
      </div>
    </>
  );
}

export const HeaderAction = ({
  type,
}: {
  type: "main" | "secondary" | "other";
  className?: string;
}) => {
  const headerData = useHeaderData();
  const t = useTranslations("dashboard.header");

  if (type === "other" && headerData.otherActions?.length === 1)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex flex-row items-center gap-2 md:h-9 md:w-auto md:border md:px-4 md:py-2"
            size="iconSm"
          >
            <span className="hidden md:inline">{t("options")}</span>
            <LuMoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {headerData.otherActions?.map((action, i) => {
            const Wrapper = action.Wrapper ?? React.Fragment;
            return (
              <Wrapper key={i}>
                <DropdownMenuItem
                  className="flex flex-row items-center gap-2"
                  onSelect={action.onClick}
                  disabled={action.isLoading}
                >
                  {action.isLoading ? <Spinner /> : action.icon}

                  {action.label}
                </DropdownMenuItem>
              </Wrapper>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );

  if (type === "secondary" && headerData.secondaryAction) {
    const Wrapper = headerData.secondaryAction.Wrapper ?? React.Fragment;
    return (
      <Wrapper>
        <LinkButton
          variant="secondary"
          onClick={headerData.secondaryAction.onClick}
          className="flex-1 flex-row items-center gap-2 md:flex-none"
          href={headerData.secondaryAction.href}
          isLoading={headerData.secondaryAction.isLoading}
        >
          {headerData.secondaryAction.icon}
          {headerData.secondaryAction.label}
        </LinkButton>
      </Wrapper>
    );
  }

  if (type === "main" && headerData.mainAction) {
    const Wrapper = headerData.mainAction.Wrapper ?? React.Fragment;
    return (
      <Wrapper>
        <LinkButton
          variant="default"
          onClick={headerData.mainAction.onClick}
          className="flex-1 flex-row items-center gap-2 md:flex-none"
          href={headerData.mainAction.href}
          isLoading={headerData.mainAction.isLoading}
        >
          {headerData.mainAction.icon}
          {headerData.mainAction.label}
        </LinkButton>
      </Wrapper>
    );
  }
};
