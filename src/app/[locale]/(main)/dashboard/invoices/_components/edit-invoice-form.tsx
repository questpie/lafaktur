import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { LuUser } from "react-icons/lu";
import { useSelectedOrganization } from "~/app/[locale]/(main)/dashboard/_components/organization-guard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import { Button } from "~/app/_components/ui/button";
import { DatePicker } from "~/app/_components/ui/date-picker";
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
import { MultiSelectAsyncCreatable } from "~/app/_components/ui/multi-select-async-creatable";
import { debounce, useDebounce } from "~/app/_hooks/use-debounce";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

export type EditInvoiceFormValues = RouterOutputs["invoice"]["getById"];
export type EditInvoiceFormProps = {
  invoice: RouterOutputs["invoice"]["getById"];
};

export function EditInvoiceForm(props: EditInvoiceFormProps) {
  const form = useForm<EditInvoiceFormValues>({
    defaultValues: {
      ...props.invoice,
    },
  });

  const editMutation = api.invoice.edit.useMutation();

  const t = useTranslations();

  const handleSubmit = form.handleSubmit((values) => {
    editMutation.mutate(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-6">
        <Accordion
          type="multiple"
          className="max-w-3xl"
          defaultValue={["general"]}
        >
          <AccordionItem value="general" className="">
            <AccordionTrigger className="text-muted-foreground">
              General
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Invoice number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Reference number</FormLabel>
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
                name="variableSymbol"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Variable symbol</FormLabel>
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
                name="constantSymbol"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Constant symbol</FormLabel>
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
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Issue date</FormLabel>
                    <DatePicker value={field.value} setValue={field.onChange} />
                    <FormDescription>
                      The date when the invoice was issued.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Due date</FormLabel>
                    <DatePicker value={field.value} setValue={field.onChange} />
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplyDate"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Delivery date</FormLabel>
                    <DatePicker
                      value={field.value ?? undefined}
                      setValue={field.onChange}
                    />
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="payment">
            <AccordionTrigger className="text-muted-foreground">
              Payment details
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Payment method </FormLabel>
                    <FormControl>
                      {/* TODO: select */}
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierBankAccount"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Bank account</FormLabel>
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
                name="supplierBankCode"
                render={({ field }) => (
                  <FormItem className="col-span-12 flex flex-col md:col-span-6">
                    <FormLabel>Bank code</FormLabel>
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

          <AccordionItem value="customer">
            <AccordionTrigger className="text-muted-foreground">
              Customer details
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <CustomerFields />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="supplier">
            <AccordionTrigger className="text-muted-foreground">
              Supplier details
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <SupplierFields />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="sticky bottom-0 bg-background py-4">
          <div className="flex max-w-3xl flex-row items-center justify-end">
            <Button type="submit" isLoading={editMutation.isLoading}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

function CustomerFields() {
  const selectedOrganization = useSelectedOrganization();

  const form = useFormContext<EditInvoiceFormValues>();

  const customerId = form.watch("customerId");
  const createCustomerMutation = api.customer.create.useMutation();
  const selectedCustomerQuery = api.customer.getById.useQuery(
    {
      id: customerId!,
      organizationId: selectedOrganization.id,
    },
    {
      enabled: !!customerId,
    },
  );

  const [didCustomerChange, setDidCustomerChange] = useState(false);

  const queryUtils = api.useUtils();

  const loadCustomers = useCallback(
    async (inputValue: string) => {
      const customers = await queryUtils.customer.getAll.fetch({
        organizationId: selectedOrganization.id,
        search: inputValue,
      });

      return customers.data.map((customer) => ({
        label: customer.name,
        value: customer.id,
      }));
    },
    [queryUtils.customer.getAll, selectedOrganization.id],
  );

  const handleCreateCustomer = useCallback(
    async (name: string) => {
      const customer = await createCustomerMutation.mutateAsync({
        name,
        organizationId: selectedOrganization.id,
      });

      form.setValue("customerId", customer.id);
    },
    [createCustomerMutation, form, selectedOrganization.id],
  );

  const selectedValue = selectedCustomerQuery.data && {
    value: selectedCustomerQuery.data.id,
    label: selectedCustomerQuery.data.name,
  };

  useEffect(() => {
    if (!selectedCustomerQuery.data || !didCustomerChange) return;

    form.setValue("customerName", selectedCustomerQuery.data.name);
    form.setValue("customerBusinessId", selectedCustomerQuery.data.businessId);
    form.setValue("customerTaxId", selectedCustomerQuery.data.taxId);
    form.setValue("customerVatId", selectedCustomerQuery.data.vatId);
    form.setValue("customerStreet", selectedCustomerQuery.data.street);
    form.setValue("customerCity", selectedCustomerQuery.data.city);
    form.setValue("customerZip", selectedCustomerQuery.data.zip);
    form.setValue("customerCountry", selectedCustomerQuery.data.country);
    setDidCustomerChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomerQuery.data?.id, didCustomerChange]);

  return (
    <>
      <FormField
        control={form.control}
        name="customerId"
        render={({ field }) => (
          <FormItem className="col-span-12 flex flex-col ">
            <FormLabel>Customer</FormLabel>
            <FormControl>
              <MultiSelectAsyncCreatable
                value={selectedValue}
                cacheOptions
                defaultOptions
                onChange={(option) => {
                  if (!option) return;
                  if (option.value === selectedValue?.value) return;
                  field.onChange(option?.value);
                  setDidCustomerChange(true);
                }}
                placeholder="Select a customer"
                before={<LuUser />}
                loadOptions={loadCustomers}
                onCreateOption={handleCreateCustomer}
                isDisabled={selectedCustomerQuery.isInitialLoading}
                isLoading={
                  createCustomerMutation.isLoading ??
                  selectedCustomerQuery.isFetching
                }
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customerName"
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
        name="customerBusinessId"
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
        name="customerTaxId"
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
        name="customerVatId"
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

      <FormField
        control={form.control}
        name="customerStreet"
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
        name="customerCity"
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
        name="customerZip"
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
        name="customerCountry"
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
    </>
  );
}

function SupplierFields() {
  const form = useFormContext<EditInvoiceFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="supplierName"
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
        name="supplierBusinessId"
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
        name="supplierTaxId"
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
        name="supplierVatId"
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

      <FormField
        control={form.control}
        name="supplierStreet"
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
        name="supplierCity"
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
        name="supplierZip"
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
        name="supplierCountry"
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
    </>
  );
}