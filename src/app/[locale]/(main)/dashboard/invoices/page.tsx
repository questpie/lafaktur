"use client";

import { LuPlus } from "react-icons/lu";
import { useHeader } from "~/app/[locale]/(main)/dashboard/_components/header";

export default function InvoicePage() {
  useHeader({
    title: "Invoices",
    mainAction: {
      label: "Add invoice",
      href: "/dashboard/invoices/add",
      icon: <LuPlus />,
    },
  });
  return <div>InvoicePage</div>;
}
