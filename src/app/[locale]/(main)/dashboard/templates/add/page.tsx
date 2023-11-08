"use client";
import React from "react";
import {
  useBreadcrumbSegment,
  useHeader,
} from "~/app/[locale]/(main)/dashboard/_components/header";

export default function AddInvoiceTemplatePage() {
  useHeader({
    title: "Add invoice template",
  });
  useBreadcrumbSegment({
    label: "Add invoice template",
    href: "/dashboard/templates/add",
    level: 2,
  });

  return <div>AddInvoicePage</div>;
}
