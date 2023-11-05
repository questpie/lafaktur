"use client";

import { LuPlus } from "react-icons/lu";
import { useHeader } from "~/app/[locale]/dashboard/_components/header";

export default function CustomersPage() {
  useHeader({
    title: "Customers",
    mainAction: {
      label: "Add customer",
      href: "/dashboard/customers/add",
      icon: <LuPlus />,
    },
  });

  return <div>CustomersPage</div>;
}
