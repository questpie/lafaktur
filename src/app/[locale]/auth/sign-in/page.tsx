"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { LuAlertTriangle } from "react-icons/lu";
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
import { signInSchema } from "~/shared/auth/auth-schemas";

export default function SignInPage() {
  const t = useTranslations();

  const form = useForm<z.infer<typeof signInSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();

  const handleSubmit = form.handleSubmit(async (data) => {
    const signInResp = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (signInResp?.ok) {
      return router.replace("/dashboard");
    }

    // This error is for CredentialsSignin, TODO: handle other errors
    form.setError("root", {
      type: "manual",
      message: t("auth.err.pleaseCheckYourCredentials"),
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{t("auth.signIn.title")}</CardTitle>
            <CardDescription>{t("auth.signIn.description")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <LuAlertTriangle className="h-4 w-4" />
                <AlertTitle>{t("auth.err.signInFailed")}</AlertTitle>
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.signIn.email.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={t("auth.signIn.email.placeholder")}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.signIn.password.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="********"
                      />
                    </FormControl>
                    <FormDescription className="text-right text-xs text-primary">
                      <Link href="/auth/forgot-password">
                        {t("auth.signIn.forgotPassword")}
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t("auth.orContinueWith")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline">
                <FaGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline">
                <FaGithub className="mr-2 h-4 w-4" />
                Github
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              isLoading={form.formState.isSubmitting}
            >
              {t("auth.signIn.submit")}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t.rich("auth.signIn.orCreateAnAccountHere", {
                link: (c) => (
                  <Link href="/auth/sign-up" className="text-primary">
                    {c}
                  </Link>
                ),
              })}
            </span>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
