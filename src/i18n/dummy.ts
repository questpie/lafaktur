import { type TFunc } from "~/i18n/client";

export const $t: TFunc = (...params) => {
  return params[0];
};
