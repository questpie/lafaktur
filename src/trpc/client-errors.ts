import { TRPCClientError } from "@trpc/react-query";
import type { UseFormReturn } from "react-hook-form";
import { type TFunc } from "~/i18n/react";
import { type AppRouter } from "~/server/api/root";

export function isTrpcError(
  error: unknown,
): error is TRPCClientError<AppRouter> {
  return error instanceof TRPCClientError;
}
export function getZodError(error: TRPCClientError<AppRouter>) {
  return error.data?.zodError;
}

export function tryToSetFormError(
  error: TRPCClientError<AppRouter>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>,
  t: TFunc,
) {
  const zodError = getZodError(error);
  if (!zodError) return false;

  for (const field of Object.keys(zodError.fieldErrors)) {
    /** TODO: think about if we should show first error or join all */
    const fieldErrors = zodError.fieldErrors[field];

    !!fieldErrors &&
      form.setError(`root.${field}`, {
        type: "manual",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: t(fieldErrors.join("\n") as any),
      });
  }

  if (zodError.formErrors) {
    form.setError("root", {
      type: "manual",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: t(zodError.formErrors.join("\n") as any),
    });
  }

  return true;
}
