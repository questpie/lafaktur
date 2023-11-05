"use client";
import React from "react";
import {
  useBreadcrumbSegment,
  useHeader,
} from "~/app/[locale]/dashboard/_components/header";

export default function AddCustomersPage() {
  useHeader({
    title: "Add customer",
  });
  useBreadcrumbSegment({
    label: "Add customer",
    href: "/dashboard/customers/add",
    level: 2,
  });

  return <div>AddInvoicePage</div>;
}
