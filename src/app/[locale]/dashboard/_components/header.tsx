"use client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";
import { LuMoreVertical } from "react-icons/lu";
import { Button, LinkButton } from "~/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/app/_components/ui/dropdown-menu";

export type HeaderActionItem<TForceIcon extends boolean = false> = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
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

const headerAtom = atom<HeaderState>({
  title: "",
  description: "",
  mainAction: undefined,
  secondaryAction: undefined,
  otherActions: [],
});

const setHeaderData = atom(
  null, // it's a convention to pass `null` for the first argument
  (get, set, update: HeaderState) => {
    set(headerAtom, update);
  },
);

export const useHeader = (state: HeaderState) => {
  const isMounted = useRef(false);
  const setHeader = useSetAtom(setHeaderData);
  if (!isMounted.current) {
    isMounted.current = true;
    setHeader(state);
  }

  useEffect(() => {
    setHeader(state);
  }, [state, setHeader]);
};

export function Header() {
  const headerData = useAtomValue(headerAtom);
  const t = useTranslations("dashboard.header");

  useEffect(() => {
    document.title = `${headerData.title} | lafaktur`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", headerData.description ?? "");
  }, [headerData.title, headerData.description]);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full justify-between">
        <h1 className="flex-1 text-3xl font-bold">{headerData.title}</h1>
        <div className="flex gap-2">
          {!!headerData.otherActions?.length && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex flex-row items-center gap-2"
                >
                  {t("options")}
                  <LuMoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {headerData.otherActions?.map((action, i) => {
                  return (
                    <DropdownMenuItem
                      key={i}
                      className="flex flex-row items-center gap-2"
                      onSelect={action.onClick}
                    >
                      {action.icon}
                      {action.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!!headerData.secondaryAction && (
            <LinkButton
              variant="secondary"
              onClick={headerData.secondaryAction.onClick}
              className="flex flex-row items-center gap-2"
              href={headerData.secondaryAction.href}
            >
              {headerData.secondaryAction.icon}
              {headerData.secondaryAction.label}
            </LinkButton>
          )}
          {!!headerData.mainAction && (
            <LinkButton
              variant="default"
              onClick={headerData.mainAction.onClick}
              className="flex flex-row items-center gap-2"
              href={headerData.mainAction.href}
            >
              {headerData.mainAction.icon}
              {headerData.mainAction.label}
            </LinkButton>
          )}
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">
          {headerData.description}
        </p>
      </div>
    </div>
  );
}
