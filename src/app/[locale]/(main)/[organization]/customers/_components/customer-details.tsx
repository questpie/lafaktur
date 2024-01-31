import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import type { RouterOutputs } from "~/trpc/shared";

type CustomerDetailsProps = {
  customer: RouterOutputs["customer"]["getById"];
};

export function CustomerDetails(props: CustomerDetailsProps) {
  const t = useTranslations();

  return (
    <Accordion
      type="multiple"
      defaultValue={["personal", ""]}
      className="max-w-xl"
    >
      <AccordionItem value="personal" className="">
        <AccordionTrigger className="text-muted-foreground">
          {t("customer.addCustomerPage.personalDetails.title")}
        </AccordionTrigger>
        <AccordionContent className="grid w-full grid-cols-12 gap-4 text-sm font-medium">
          <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
            <span className="text-xs text-muted-foreground">
              {t("customer.addCustomerPage.personalDetails.name")}
            </span>
            <span>{props.customer.name}</span>
          </div>
          <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
            <span className="text-xs text-muted-foreground">
              {t("customer.addCustomerPage.personalDetails.email")}
            </span>
            <span>{props.customer.email ?? "-"}</span>
          </div>
          <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
            <span className="text-xs text-muted-foreground">
              {t("customer.addCustomerPage.personalDetails.phone")}
            </span>
            <span>{props.customer.phone ?? "-"}</span>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="location" className="">
        <AccordionTrigger className="text-muted-foreground">
          {t("customer.addCustomerPage.location.title")}
        </AccordionTrigger>
        <AccordionContent className="grid w-full grid-cols-12 gap-4 text-sm font-medium">
          <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
            <span className="text-xs text-muted-foreground">
              {t("customer.addCustomerPage.location.street")}
            </span>
            <span>{props.customer.street ?? "-"}</span>
          </div>
          <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
            <span className="text-xs text-muted-foreground">
              {t("customer.addCustomerPage.location.city")}
            </span>
            <span>{props.customer.city ?? "-"}</span>
          </div>
          <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
            <span className="text-xs text-muted-foreground">
              {t("customer.addCustomerPage.location.zip")}
            </span>
            <span>{props.customer.zip ?? "-"}</span>
          </div>
          <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
            <span className="text-xs text-muted-foreground">
              {t("customer.addCustomerPage.location.country")}
            </span>
            <span>{props.customer.country ?? "-"}</span>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="business" className="">
        <AccordionTrigger className="text-muted-foreground">
          {t("customer.addCustomerPage.businessDetails.title")}
        </AccordionTrigger>
        <AccordionContent className="grid w-full grid-cols-12 gap-4 text-sm font-medium">
          <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
            <span className="text-xs text-muted-foreground">
              {t("customer.addCustomerPage.businessDetails.businessId")}
            </span>
            <span>{props.customer.businessId ?? "-"}</span>
          </div>
          <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
            <span className="text-xs text-muted-foreground">
              {t("customer.addCustomerPage.businessDetails.taxId")}
            </span>
            <span>{props.customer.taxId ?? "-"}</span>
          </div>
          <div className="col-span-12 flex flex-col gap-1 md:col-span-6">
            <span className="text-xs text-muted-foreground">
              {t("customer.addCustomerPage.businessDetails.vatId")}
            </span>
            <span>{props.customer.vatId ?? "-"}</span>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
