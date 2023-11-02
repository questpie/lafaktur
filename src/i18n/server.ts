import { getRequestConfig, getTranslator } from "next-intl/server";
import { cache } from "react";

export default getRequestConfig(async ({ locale }) => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  messages: (await import(`./locales/${locale}.json`)).default,
}));

const getLocaleState = cache(() => ({ current: null as string | null }));

export const setRequestLocale = (locale: string): void => {
  getLocaleState().current = locale;
};

export const getRequestLocale = (): string => {
  const requestLocale = getLocaleState().current;

  if (!requestLocale) {
    throw new Error(
      "Request locale is not set. Please be sure to call `setRequestLocale` before calling `getRequestLocale`.",
    );
  }

  return requestLocale;
};

export const getTranslations = <NestedKey extends string = never>(
  namespace?: NestedKey,
) => {
  const locale = getRequestLocale();
  return getTranslator(locale, namespace);
};
