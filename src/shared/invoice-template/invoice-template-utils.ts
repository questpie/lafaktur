import { customAlphabet } from "nanoid";

export const generateInvoiceHash = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  5,
);
