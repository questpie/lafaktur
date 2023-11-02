import createMiddleware from "next-intl/middleware";
import { ALL_LOCALES, DEFAULT_LOCALE } from "~/i18n/shared";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ALL_LOCALES,
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: DEFAULT_LOCALE,
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
