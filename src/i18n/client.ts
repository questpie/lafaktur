"use client";
import { createI18nClient } from "next-international/client";

export const { useI18n, useScopedI18n, I18nProviderClient } = createI18nClient({
  en: () => import("./locales/en.json"),
  sk: () => import("./locales/sk.json"),
});

export type TFunc = ReturnType<typeof useI18n>;
