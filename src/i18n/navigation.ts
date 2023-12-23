import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { ALL_LOCALES } from "~/i18n/shared";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({
    locales: ALL_LOCALES,
  });
