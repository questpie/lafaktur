"use client";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { type PropsWithChildren } from "react";
import {
  Header,
  useBreadcrumbSegment,
} from "~/app/[locale]/(main)/dashboard/_components/header";
import Navbar from "~/app/[locale]/(main)/dashboard/_components/navbar";
import { OrganizationGuard } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import { Sidebar } from "~/app/[locale]/(main)/dashboard/_components/sidebar";

export default function DashboardLayout(props: PropsWithChildren) {
  const session = useSession();
  const router = useRouter();
  const t = useTranslations();

  useBreadcrumbSegment({
    label: t("dashboard.breadcrumbs.dashboard"),
    href: "/dashboard",
    level: 0,
  });

  if (session.status === "loading") return null;

  if (session.status === "unauthenticated") {
    router.replace("/auth/sign-in");
    return null;
  }

  return (
    <OrganizationGuard>
      <div className="mx-auto flex h-full min-h-screen w-full max-w-screen-2xl flex-row border-e border-s">
        <Sidebar />
        <div className="flex w-full flex-col">
          <Navbar />
          <div className="flex w-full flex-col gap-6 px-4 py-2 md:px-8 md:py-3">
            <Header />
            {props.children}
          </div>
        </div>
      </div>
    </OrganizationGuard>
  );
}
