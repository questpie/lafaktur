// Use type safe message keys with `next-intl`
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type Translations = typeof import("./i18n/locales/en.json");
// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare interface IntlMessages extends Translations {}
