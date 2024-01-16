import { notFound } from "next/navigation";
import { type PropsWithChildren } from "react";
import { Header } from "~/app/[locale]/(main)/[organization]/_components/header";
import Navbar from "~/app/[locale]/(main)/[organization]/_components/navbar";
import { OrganizationProvider } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { Sidebar } from "~/app/[locale]/(main)/[organization]/_components/sidebar";
import { DialogProvider } from "~/app/_components/ui/dialog";
import { api } from "~/trpc/server";

export type OrganizationParams = {
  organization: string;
};

export default async function OrganizationLayout(
  props: PropsWithChildren<{ params: OrganizationParams }>,
) {
  const org = await api.organization.getBySlug.query(props.params.organization);

  if (!org) {
    notFound();
  }

  return (
    <OrganizationProvider organization={org}>
      {/* this is bullshit, get rid of dialog provider or context */}
      <DialogProvider>
        <div className="mx-auto flex h-screen w-full max-w-screen-2xl flex-row overflow-hidden border-e border-s">
          <Sidebar />
          <div className="flex min-h-screen w-full flex-col overflow-auto">
            <Navbar />
            <div className="flex w-full flex-col gap-6 px-4 py-2 md:px-8 md:py-3">
              <Header />
              {props.children}
            </div>
          </div>
        </div>
      </DialogProvider>
    </OrganizationProvider>
  );
}
