"use client";
import { useBreadcrumbSegment } from "~/app/[locale]/dashboard/_components/header";

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useBreadcrumbSegment({
    label: "Invoices",
    href: "/dashboard/invoices",
    level: 1,
  });

  return <>{children}</>;
}
