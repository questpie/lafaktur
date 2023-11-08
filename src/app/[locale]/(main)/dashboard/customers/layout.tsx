"use client";
import { useBreadcrumbSegment } from "~/app/[locale]/(main)/dashboard/_components/header";

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useBreadcrumbSegment({
    label: "Customers",
    href: "/dashboard/customers",
    level: 1,
  });

  return <>{children}</>;
}
