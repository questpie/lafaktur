import { useTranslations, type NestedKeyOf } from "next-intl";
import { type StringWithAutocomplete } from "~/types/misc-types";

export type TranslateProps = {
  name: StringWithAutocomplete<NestedKeyOf<IntlMessages>>;
};

export function Translate(props: TranslateProps) {
  const t = useTranslations();
  return <>{t(props.name as any)}</>;
}
