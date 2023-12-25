import { z } from "zod";
import { $t } from "~/i18n/dummy";

export const passwordSchema = z.object({
  password: z.string().min(8, $t("auth.err.passwordTooShort")),
  passwordConfirm: z
    .string()
    .min(8)
    .refine((v) => v === v, {
      message: $t("auth.err.passwordsDontMatch"),
    }),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1, $t("auth.err.nameIsRequired")),
    email: z.string().email($t("auth.err.invalidEmail")),
  })
  .merge(passwordSchema);

export const signInSchema = z.object({
  email: z.string().email($t("auth.err.invalidEmail")),
  password: z.string().min(8, $t("auth.err.passwordTooShort")),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email($t("auth.err.invalidEmail")),
});

export const resetPasswordSchema = z
  .object({
    token: z.string(),
  })
  .merge(passwordSchema);
