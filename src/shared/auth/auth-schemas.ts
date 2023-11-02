import { z } from "zod";
import { $t } from "~/i18n/dummy";

export const signUpSchema = z.object({
  name: z.string().min(1, $t("auth.err.name-is-required")),
  email: z.string().email($t("auth.err.invalid-email")),
  password: z.string().min(8, $t("auth.err.password-too-short")),
  passwordConfirm: z
    .string()
    .min(8)
    .refine((v) => v === v, {
      message: $t("auth.err.passwords-dont-match"),
    }),
});

export const signInSchema = z.object({
  email: z.string().email($t("auth.err.invalid-email")),
  password: z.string().min(8, $t("auth.err.password-too-short")),
});
