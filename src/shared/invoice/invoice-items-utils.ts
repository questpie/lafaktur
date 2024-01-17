export type InvoiceItemBase = {
  quantity: number;
  unitPriceWithoutVat: number;
  vatRate: number;
};

/**
 * user always inputs price without vat
 */
export function computeInvoiceTotals(invoiceItems: InvoiceItemBase[]) {
  return invoiceItems.reduce(
    (acc, item) => {
      const amounts = computeInvoiceItemAmounts(item);
      acc.total += amounts.total;
      acc.totalWithoutVat += amounts.totalWithoutVat;
      return acc;
    },
    {
      total: 0,
      totalWithoutVat: 0,
    },
  );
}

/**
 * user always inputs price without vat
 */
export function computeInvoiceItemAmounts(item: InvoiceItemBase) {
  return {
    quantity: item.quantity,
    unitPriceWithoutVat: item.unitPriceWithoutVat,
    totalWithoutVat: item.unitPriceWithoutVat * item.quantity,
    unitPrice: item.unitPriceWithoutVat * (1 + item.vatRate / 100),
    total: item.unitPriceWithoutVat * item.quantity * (1 + item.vatRate / 100),
    vatRate: item.vatRate,
  };
}
