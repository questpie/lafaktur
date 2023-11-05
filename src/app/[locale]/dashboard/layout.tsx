"use client";
import { type PropsWithChildren } from "react";
import { Header } from "~/app/[locale]/dashboard/_components/header";
import Navbar from "~/app/[locale]/dashboard/_components/navbar";
import { Sidebar } from "~/app/[locale]/dashboard/_components/sidebar";

export default function DashboardLayout(props: PropsWithChildren) {
  return (
    <div className="mx-auto flex h-full min-h-screen w-full max-w-screen-2xl flex-row border-e border-s">
      <Sidebar />
      <div className="flex w-full flex-col">
        <Navbar />
        <div className="flex w-full flex-col gap-6 px-4 py-3 md:px-8">
          <Header />
          {props.children}
        </div>
      </div>
    </div>
  );
}
