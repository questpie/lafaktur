import { type NestedKeyOf } from "next-intl";

/**
 * Just a dummy $t function to provide autocomplete on server side
 */
export const $t = (key: NestedKeyOf<IntlMessages>) => key;
