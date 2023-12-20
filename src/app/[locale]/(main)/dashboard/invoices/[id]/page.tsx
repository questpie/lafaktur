"use client";
import {
  useBreadcrumbSegment,
  useHeader,
} from "~/app/[locale]/(main)/dashboard/_components/header";

export default function InvoicePage() {
  useHeader({
    title: "Invoice",
  });
  useBreadcrumbSegment({
    label: "Invoice",
    href: "/dashboard/invoices/add",
    level: 2,
  });

  return <div></div>;
}
