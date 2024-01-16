import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { LuBookTemplate, LuUser, LuX } from "react-icons/lu";
import { useSelectedOrganization } from "~/app/[locale]/(main)/[organization]/_components/organization-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import { Button } from "~/app/_components/ui/button";
import { Card, CardContent } from "~/app/_components/ui/card";
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
import { MultiSelectCreatable } from "~/app/_components/ui/multi-select-creatable";
import { NumberInput } from "~/app/_components/ui/number-input";
import { Separator } from "~/app/_components/ui/separator";
import { Textarea } from "~/app/_components/ui/textarea";
import { useDebouncedValue } from "~/app/_hooks/use-debounce";
import { roundTo } from "~/app/_utils/misc-utils";
import { editInvoiceSchema } from "~/shared/invoice/invoice-schema";
import { api } from "~/trpc/react";
import { type RouterInputs, type RouterOutputs } from "~/trpc/shared";

export type EditInvoiceFormValues = RouterInputs["invoice"]["edit"];
export type EditInvoiceFormProps = {
  invoice: RouterOutputs["invoice"]["getById"];
};

export function EditInvoiceForm(props: EditInvoiceFormProps) {
  const selectedOrganization = useSelectedOrganization();

  const form = useForm<EditInvoiceFormValues>({
    resolver: zodResolver(editInvoiceSchema),
    defaultValues: {
      ...(props.invoice as EditInvoiceFormValues),
      organizationId: selectedOrganization.id,
    },
  });

  const editMutation = api.invoice.edit.useMutation();

  const t = useTranslations();

  const handleSubmit = form.handleSubmit((values) => {
    editMutation.mutate(values);
  });

  const invoiceItems = form.watch("invoiceItems");
  const total = useMemo(() => {
    return roundTo(
      invoiceItems?.reduce((acc, item) => {
        return acc + item.total;
      }, 0) ?? 0,
      2,
    );
  }, [invoiceItems]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-6">
        <Accordion
          type="multiple"
          className="max-w-4xl"
          defaultValue={["general", "items"]}
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

              <InvoiceTemplatePicker />

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
          <AccordionItem value="items">
            <AccordionTrigger className="text-muted-foreground">
              Items
            </AccordionTrigger>
            <AccordionContent className="grid w-full grid-cols-12 gap-4">
              <InvoiceItems />
              <Card className="col-span-12 max-w-4xl">
                <CardContent className="flex flex-row justify-end p-4">
                  <h4 className="text-2xl font-bold text-foreground">
                    Total: {total} €
                  </h4>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="sticky bottom-0 bg-background py-4">
          <div className="flex max-w-4xl flex-row items-center justify-end">
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
    { enabled: !!customerId },
  );

  const [didCustomerChange, setDidCustomerChange] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const customersQuery = api.customer.getAll.useQuery({
    organizationId: selectedOrganization.id,
    search: debouncedSearchQuery,
    limit: 10,
  });

  const customerOptions = useMemo(() => {
    return (
      customersQuery.data?.data.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? []
    );
  }, [customersQuery.data]);

  const handleCreateCustomer = useCallback(
    async (name: string) => {
      // TODO: open dialog to create the customer
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
    form.setValue(
      "customerBusinessId",
      selectedCustomerQuery.data.businessId ?? undefined,
    );
    form.setValue(
      "customerTaxId",
      selectedCustomerQuery.data.taxId ?? undefined,
    );
    form.setValue(
      "customerVatId",
      selectedCustomerQuery.data.vatId ?? undefined,
    );
    form.setValue(
      "customerStreet",
      selectedCustomerQuery.data.street ?? undefined,
    );
    form.setValue("customerCity", selectedCustomerQuery.data.city ?? undefined);
    form.setValue("customerZip", selectedCustomerQuery.data.zip ?? undefined);
    form.setValue(
      "customerCountry",
      selectedCustomerQuery.data.country ?? undefined,
    );
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
              <MultiSelectCreatable
                value={selectedValue}
                inputValue={searchQuery}
                options={customerOptions}
                onInputChange={setSearchQuery}
                onChange={(option) => {
                  if (!option) return;
                  if (option.value === selectedValue?.value) return;
                  field.onChange(option?.value);
                  setDidCustomerChange(true);
                }}
                placeholder="Select a customer"
                before={<LuUser />}
                createOptionPosition="last"
                onCreateOption={handleCreateCustomer}
                isDisabled={selectedCustomerQuery.isInitialLoading}
                allowCreateWhileLoading={false}
                isLoading={
                  createCustomerMutation.isLoading ||
                  selectedCustomerQuery.isInitialLoading ||
                  customersQuery.isInitialLoading
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
            <FormLabel>Supplier name</FormLabel>
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

function InvoiceItems() {
  const form = useFormContext<EditInvoiceFormValues>();
  const invoiceItems = useFieldArray({
    name: "invoiceItems",
    control: form.control,
  });

  function handleCreateItem() {
    invoiceItems.append({
      total: 0,
      totalWithoutVat: 0,
      unitPrice: 0,
      unitPriceWithoutVat: 0,
      vatRate: 0,
      quantity: 1,
      order: invoiceItems.fields.length,
      unit: "ks",
      name: "",
    });
  }

  return (
    <div className="col-span-12 flex flex-col gap-6">
      {invoiceItems.fields.map((item, i) => {
        return (
          <React.Fragment key={item.id}>
            {i > 0 && <Separator />}
            <InvoiceItem
              i={i}
              onRemoveClick={() => {
                invoiceItems.remove(i);
              }}
            />
          </React.Fragment>
        );
      })}

      <div className="flex flex-row items-center justify-end">
        <Button type="button" variant={"outline"} onClick={handleCreateItem}>
          Add item
        </Button>
      </div>
    </div>
  );
}

type InvoiceItemProps = {
  i: number;
  onRemoveClick?: () => void;
};

function InvoiceItem({ i, onRemoveClick }: InvoiceItemProps) {
  const form = useFormContext<EditInvoiceFormValues>();
  const unitPrice = form.watch(`invoiceItems.${i}.unitPrice`);
  const quantity = form.watch(`invoiceItems.${i}.quantity`);

  useEffect(() => {
    if (unitPrice === undefined || quantity === undefined) return;

    form.setValue(
      `invoiceItems.${i}.total`,
      roundTo(Number(unitPrice) * Number(quantity), 2),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitPrice, quantity, i]);

  return (
    <div className="grid grid-cols-12 gap-2">
      <FormField
        control={form.control}
        name={`invoiceItems.${i}.quantity`}
        render={({ field: { ref: _, ...field } }) => (
          <FormItem className="col-span-6 flex flex-col md:col-span-3 lg:col-span-2">
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <NumberInput {...field} min={0} onValueChange={field.onChange} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`invoiceItems.${i}.unit`}
        render={({ field }) => (
          <FormItem className="col-span-6 flex flex-col md:col-span-3 lg:col-span-1">
            <FormLabel>Unit</FormLabel>
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
        name={`invoiceItems.${i}.name`}
        render={({ field }) => (
          <FormItem className="col-span-12 flex flex-col md:col-span-6 lg:col-span-5">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Textarea {...field} rows={1} value={field.value ?? ""} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`invoiceItems.${i}.unitPrice`}
        render={({ field: { ref: _, ...field } }) => (
          <FormItem className="col-span-6 flex flex-col lg:col-span-2">
            <FormLabel>Price</FormLabel>
            <FormControl>
              <NumberInput
                {...field}
                min={0}
                onValueChange={(num) => {
                  field.onChange(num);
                }}
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`invoiceItems.${i}.total`}
        render={({ field }) => (
          <FormItem className="col-span-6 flex flex-col lg:col-span-2">
            <FormLabel>Total</FormLabel>
            <div className="flex flex-row items-center  gap-2">
              <FormControl>
                <Input readOnly value={field.value ?? ""} />
              </FormControl>
              <Button
                variant="ghost"
                size="iconXs"
                type="button"
                className="min-w-6"
                onClick={() => {
                  onRemoveClick?.();
                }}
              >
                <LuX />
              </Button>
            </div>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function InvoiceTemplatePicker() {
  const form = useFormContext<EditInvoiceFormValues>();
  const selectedOrganization = useSelectedOrganization();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const invoiceTemplateQuery = api.invoiceTemplate.getAll.useQuery({
    organizationId: selectedOrganization.id,
    filter: {
      name: debouncedSearchQuery,
    },
  });

  const templateId = form.watch("templateId");
  const selectedTemplateQuery = api.invoiceTemplate.getById.useQuery(
    {
      id: templateId!,
      organizationId: selectedOrganization.id,
    },
    { enabled: !!templateId },
  );

  const selectedValue = selectedTemplateQuery.data && {
    value: selectedTemplateQuery.data.id,
    label: selectedTemplateQuery.data.name,
  };

  const templateOptions = useMemo(() => {
    return (
      invoiceTemplateQuery.data?.data.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? []
    );
  }, [invoiceTemplateQuery.data]);

  return (
    <FormField
      control={form.control}
      name="templateId"
      render={({ field }) => (
        <FormItem className="col-span-12 flex flex-col md:col-span-6">
          <FormLabel>Invoice template</FormLabel>
          <FormControl>
            <MultiSelectCreatable
              value={selectedValue}
              inputValue={searchQuery}
              options={templateOptions}
              onInputChange={setSearchQuery}
              onChange={(option) => {
                if (!option) return;
                if (option.value === selectedValue?.value) return;
                field.onChange(option?.value);
              }}
              placeholder="Select invoice template"
              before={<LuBookTemplate />}
              createOptionPosition="last"
              isDisabled={selectedTemplateQuery.isInitialLoading}
              allowCreateWhileLoading={false}
              isLoading={
                selectedTemplateQuery.isInitialLoading ||
                invoiceTemplateQuery.isInitialLoading
              }
            />
          </FormControl>
          <FormDescription>
            Pick one of your predefined invoice templates.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
