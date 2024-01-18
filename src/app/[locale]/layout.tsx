import "~/styles/globals.css";

import { headers } from "next/headers";

import { GeistSans } from "geist/font/sans";
import { type Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppProvider } from "~/app/[locale]/app-provider";
import { AuthProvider } from "~/app/[locale]/auth/_components/auth-provider";
import { ThemeProvider } from "~/app/_components/theme/theme-provider";
import { cn } from "~/app/_utils/styles-utils";
import { setRequestLocale } from "~/i18n/server";
import { ALL_LOCALES } from "~/i18n/shared";
import { getServerAuthSession } from "~/server/auth/get-server-session";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata = {
  title: "lafaktur",
  description: "The next-gen invoicing platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  height: "device-height",
  width: "device-width",
  maximumScale: 1,
  minimumScale: 1,
  initialScale: 1,
  userScalable: false,
};

export function generateStaticParams() {
  return ALL_LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const isValidLocale = ALL_LOCALES.some((cur) => cur === locale);
  if (!isValidLocale) notFound();
  setRequestLocale(locale);

  const messages = await getMessages({ locale });
  const session = await getServerAuthSession();

  return (
    <html lang={locale}>
      <body
        className={cn(
          `min-h-screen bg-background font-sans antialiased`,
          GeistSans.variable,
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <TRPCReactProvider headers={headers()}>
              <AppProvider>
                <AuthProvider session={session}>{children}</AuthProvider>
              </AppProvider>
            </TRPCReactProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
