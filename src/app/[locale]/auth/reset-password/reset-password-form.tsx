"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import { LuAlertTriangle } from "react-icons/lu";
import { toast } from "sonner";
import { type z } from "zod";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/app/_components/ui/alert";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { resetPasswordSchema } from "~/shared/auth/auth-schemas";
import { isTrpcError, tryToSetFormError } from "~/trpc/client-errors";
import { api } from "~/trpc/react";

export type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    defaultValues: { password: "", passwordConfirm: "", token },
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPasswordMutation = api.auth.resetPassword.useMutation();

  const router = useRouter();

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const resp = await resetPasswordMutation.mutateAsync(data);
      if (resp.success) {
        toast.success(t("auth.toast.resetPassword.success.message"), {
          description: t("auth.toast.resetPassword.success.description"),
        });
        return router.replace("/auth/sign-in");
      }

      form.setError("root", {
        type: "manual",
        message: t("auth.err.resetPasswordFailed"),
      });
    } catch (err) {
      if (!isTrpcError(err)) throw err;
      tryToSetFormError(err, form, t);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">
              {t("auth.resetPassword.title")}
            </CardTitle>
            <CardDescription>
              {t("auth.resetPassword.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <LuAlertTriangle className="h-4 w-4" />
                <AlertTitle>{t("auth.err.resetPasswordFailed")}</AlertTitle>
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.signUp.password.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        variant="outlined"
                        type="password"
                        placeholder={"*******"}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("auth.signUp.confirmPassword.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        variant="outlined"
                        type="password"
                        placeholder={"*******"}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              isLoading={form.formState.isSubmitting}
            >
              {t("auth.resetPassword.submit")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
