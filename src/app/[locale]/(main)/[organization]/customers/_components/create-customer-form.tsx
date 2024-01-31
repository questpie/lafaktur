"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import { Button } from "~/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import { createCustomerSchema } from "~/shared/customer/customer-schema";
import { api } from "~/trpc/react";
import type { RouterInputs } from "~/trpc/shared";

export type CreateCustomerFormValues = RouterInputs["customer"]["create"];

export function CreateCustomerForm() {
  const createMutation = api.customer.create.useMutation();

  const t = useTranslations();

  const router = useRouter();

  const selectedOrganization = useSelectedOrganization();

  const form = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      organizationId: selectedOrganization.id,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const res = await createMutation.mutateAsync(values);
      if (res.id) {
        toast.success(t("customer.success.createSuccessful"));
        router.replace(`/${selectedOrganization.slug}/customers/${res.id}`);
      }
    } catch (err) {
      toast.error(t("customer.err.createFailed"));
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="relative flex max-w-xl flex-col gap-6"
      >
        <Accordion type="multiple" defaultValue={["personal", "business"]}>
          <AccordionItem value="personal" className="">
            <AccordionTrigger className="text-muted-foreground">
              {t("customer.addCustomerPage.personalDetails.title")}
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>
                      {t("customer.addCustomerPage.personalDetails.name")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>
                      {t("customer.addCustomerPage.personalDetails.email")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>
                      {t("customer.addCustomerPage.personalDetails.phone")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="location" className="">
            <AccordionTrigger className="text-muted-foreground">
              {t("customer.addCustomerPage.location.title")}
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>
                      {t("customer.addCustomerPage.location.street")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>
                      {t("customer.addCustomerPage.location.city")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>
                      {t("customer.addCustomerPage.location.zip")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>
                      {t("customer.addCustomerPage.location.country")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* TODO: transtale these 3 to slovak - which is which :) */}
          <AccordionItem value="business" className="">
            <AccordionTrigger className="text-muted-foreground">
              {t("customer.addCustomerPage.businessDetails.title")}
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="businessId"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>
                      {t("customer.addCustomerPage.businessDetails.businessId")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>
                      {t("customer.addCustomerPage.businessDetails.taxId")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vatId"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>
                      {t("customer.addCustomerPage.businessDetails.vatId")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="sticky bottom-0 bg-background py-4">
          <div className="flex  flex-row items-center justify-end">
            <Button type="submit">{t("common.save")}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}