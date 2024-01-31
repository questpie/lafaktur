"use client";
import { useTranslations } from "next-intl";
import {
  BreadcrumbSegment,
  HeaderSegment,
} from "~/app/[locale]/(main)/[organization]/_components/header";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import { EditCustomerForm } from "~/app/[locale]/(main)/[organization]/customers/_components/edit-customer-form";
import { api } from "~/trpc/react";

export type CustomerPageEditProps = {
  params: { id: string; organization: string };
};

export default function CustomerPageEdit(props: CustomerPageEditProps) {
  const selectedOrganization = useSelectedOrganization();

  const [customer] = api.customer.getById.useSuspenseQuery({
    id: Number(props.params.id),
    organizationId: selectedOrganization.id,
  });

  const t = useTranslations();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return (
    <>
      <HeaderSegment title={customer.name} />
      <BreadcrumbSegment
        label={t("customer.editCustomerPage.title")}
        href={`/${props.params.organization}/customers/${props.params.id}/edit`}
        level={3}
      />
      <EditCustomerForm customer={customer} />
    </>
  );
}
