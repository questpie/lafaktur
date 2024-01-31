"use client";
import { useTranslations } from "next-intl";
import { BreadcrumbSegment } from "~/app/[locale]/(main)/[organization]/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { api } from "~/trpc/react";

export default function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string; organization: string };
}) {
  const t = useTranslations();
  const selectedOrg = useSelectedOrganization();

  const [customer] = api.customer.getById.useSuspenseQuery({
    id: Number(params.id),
    organizationId: selectedOrg.id,
  });

  return (
    <>
      <BreadcrumbSegment
        label={customer.name}
        href={`/${selectedOrg.slug}/customers/${params.id}`}
        level={2}
      />
      {children}
    </>
  );
}
