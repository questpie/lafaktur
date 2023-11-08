"use client";
import { useBreadcrumbSegment } from "~/app/[locale]/(main)/dashboard/_components/header";

export default function InvoiceTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useBreadcrumbSegment({
    label: "Invoice Templates",
    href: "/dashboard/templates",
    level: 1,
  });

  return <>{children}</>;
}
