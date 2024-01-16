"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { type z } from "zod";
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
import { signUpSchema } from "~/shared/auth/auth-schemas";
import { isTrpcError, tryToSetFormError } from "~/trpc/client-errors";
import { api } from "~/trpc/react";

export default function SignUpPage() {
  const t = useTranslations();

  const form = useForm<z.infer<typeof signUpSchema>>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter();
  const signUpMutation = api.auth.signUp.useMutation({});

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await signUpMutation.mutateAsync(data);
      const signInResp = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (signInResp?.ok) {
        return router.replace(`/onboarding/organization`);
      }
      /**
       * Something failed while signing in, we should redirect to sign in page
       */
      router.replace("/auth/sign-in");
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
            <CardTitle className="text-2xl">{t("auth.signUp.title")}</CardTitle>
            <CardDescription>{t("auth.signUp.description")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.signUp.name.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t("auth.signUp.name.placeholder")}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.signUp.email.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={t("auth.signUp.email.placeholder")}
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
                    <FormLabel>{t("auth.signUp.password.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="********"
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
                        type="password"
                        placeholder="********"
                      />
                    </FormControl>
                    <FormDescription />
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
              <Button variant="outline" type="button">
                <FaGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" type="button">
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
              disabled={form.formState.isSubmitting}
            >
              {t("auth.signUp.submit")}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t.rich("auth.signUp.haveAnAccountLogIn", {
                link: (c) => (
                  <Link href="/auth/sign-in" className="text-primary">
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
