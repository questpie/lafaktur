"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { LuCheck, LuMoon, LuSun } from "react-icons/lu";
import { Button, type ButtonProps } from "~/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { cn } from "~/app/_utils/styles-utils";
import { $t } from "~/i18n/dummy";

export type ThemeToggleProps = {
  buttonVariant?: ButtonProps["variant"];
};

const THEMES = ["light", "dark", "system"] as const;
const THEME_TO_LABEL = {
  light: $t("themeToggle.light"),
  dark: $t("themeToggle.dark"),
  system: $t("themeToggle.system"),
};

export function ThemeToggle({ buttonVariant = "ghost" }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();

  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} size="icon">
          <LuSun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <LuMoon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        {THEMES.map((item) => {
          const isSelected = theme === item;

          return (
            <DropdownMenuItem
              key={item}
              onClick={() => setTheme(item)}
              disabled={isSelected}
              className={cn(
                "flex cursor-pointer flex-row justify-between gap-2",
              )}
            >
              {t(THEME_TO_LABEL[item] as any)} {isSelected && <LuCheck />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
