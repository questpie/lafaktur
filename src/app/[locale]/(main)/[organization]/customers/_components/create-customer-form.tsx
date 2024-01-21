"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { invariant } from "~/app/_utils/misc-utils";
import { insertCustomerSchema } from "~/server/db/db-schema";
import { api } from "~/trpc/react";
import type { RouterInputs } from "~/trpc/shared";

export type CreateCustomerFormValues = RouterInputs["customer"]["create"];

export function CreateCustomerForm() {
  const createMutation = api.customer.create.useMutation();

  const selectedOrganization = useSelectedOrganization();

  invariant(selectedOrganization, "selectedOrganization is required");

  const form = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      organizationId: selectedOrganization.id,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    createMutation.mutate(values);
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
              Personal
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Customer name</FormLabel>
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
                    <FormLabel>Email</FormLabel>
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
                    <FormLabel>Phone</FormLabel>
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
              Location
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Street</FormLabel>
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
                    <FormLabel>City</FormLabel>
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
                    <FormLabel>Zip code</FormLabel>
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
                    <FormLabel>Country</FormLabel>
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

          <AccordionItem value="business" className="">
            <AccordionTrigger className="text-muted-foreground">
              Business
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="businessId"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Business ID</FormLabel>
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
                    <FormLabel>Tax ID</FormLabel>
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
                    <FormLabel>VAT ID</FormLabel>
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
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
