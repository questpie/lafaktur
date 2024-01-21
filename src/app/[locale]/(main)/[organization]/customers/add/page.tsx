"use client";
import { useTranslations } from "next-intl";
import {
  BreadcrumbSegment,
  HeaderSegment,
} from "~/app/[locale]/(main)/[organization]/_components/header";
import { CreateCustomerForm } from "~/app/[locale]/(main)/[organization]/customers/_components/create-customer-form";
import { type OrganizationParams } from "~/app/[locale]/(main)/[organization]/layout";

export default function AddCustomersPage(props: {
  params: OrganizationParams;
}) {
  const t = useTranslations();

  return (
    <>
      <HeaderSegment title={t("customer.addCustomerPage.title")} />
      <BreadcrumbSegment
        label={t("customer.addCustomerPage.title")}
        href={`/${props.params.organization}/customers/add`}
        level={2}
      />
      <CreateCustomerForm />
    </>
  );
}
