import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { NextAuthProvider } from "~/app/[locale]/auth/_components/next-auth-provider";
import { ThemeProvider } from "~/app/_components/theme/theme-provider";
import { cn } from "~/app/_utils/styles-utils";
import { setRequestLocale } from "~/i18n/server";
import { ALL_LOCALES } from "~/i18n/shared";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "lafaktur",
  description: "The next-gen invoicing platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export function generateStaticParams() {
  return ALL_LOCALES.map((locale) => ({ params: { locale } }));
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

  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body
        className={cn(
          `min-h-screen bg-background font-sans antialiased`,
          inter.variable,
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextAuthProvider>
              <TRPCReactProvider headers={headers()}>
                {children}
              </TRPCReactProvider>
            </NextAuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
