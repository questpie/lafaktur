"use client";
import React from "react";
import {
  useBreadcrumbSegment,
  useHeader,
} from "~/app/[locale]/dashboard/_components/header";

export default function AddInvoicePage() {
  useHeader({
    title: "Add invoice",
  });
  useBreadcrumbSegment({
    label: "Add invoice",
    href: "/dashboard/invoices/add",
    level: 2,
  });

  return <div>AddInvoicePage</div>;
}
