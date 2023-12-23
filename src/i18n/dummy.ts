import { type NestedKeyOf } from "next-intl";
import { type StringWithAutocomplete } from "~/types/misc-types";

/**
 * Just a dummy $t function to provide autocomplete on server side
 */
export const $t = (key: StringWithAutocomplete<NestedKeyOf<IntlMessages>>) =>
  key;
