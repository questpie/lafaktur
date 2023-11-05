"use client";

import { LuPlus } from "react-icons/lu";
import { useHeader } from "~/app/[locale]/dashboard/_components/header";

export default function InvoiceTemplatePage() {
  useHeader({
    title: "Invoice templates",
    mainAction: {
      label: "Add invoice template",
      href: "/dashboard/templates/add",
      icon: <LuPlus />,
    },
  });
  return <div>InvoiceTemplatePage</div>;
}
