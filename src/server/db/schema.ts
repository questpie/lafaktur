import { addDays } from "date-fns";
import { relations, sql } from "drizzle-orm";
import {
  bigint as bigintOi,
  bigserial as bigserialOI,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp as timestampOI,
  uniqueIndex,
  varchar,
  type PgTimestampConfig,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { type AdapterAccount } from "next-auth/adapters";
import { typedJson } from "~/server/db/types/typed-json";
import { DEFAULT_TEMPLATE } from "~/shared/invoice-template/invoice-template-constants";
import {
  invoiceTemplateDataSchema,
  type InvoiceTemplateData,
} from "~/shared/invoice-template/invoice-template-schemas";

/**
 * Creator for bigint columns. So we have always the number format as bigint.
 */
export const bigserial = (name: string) =>
  bigserialOI(name, { mode: "number" });
export const bigint = (name: string) => bigintOi(name, { mode: "number" });

export const timestamp = <TMode extends "string" | "date" = "date">(
  name: string,
  options?: PgTimestampConfig<TMode>,
) => timestampOI(name, { mode: "date", precision: 3, ...options });

export const invoicesItemsTable = pgTable(
  "invoice_items",
  {
    id: bigserial("id").primaryKey().notNull(),
    invoiceId: bigint("invoice_id")
      .notNull()
      .references(() => invoicesTable.id),
    name: varchar("name", { length: 255 }).notNull(),
    quantity: integer("quantity").notNull(),

    unit: varchar("unit", { length: 255 }).notNull(),

    vatRate: integer("vat_rate").notNull().default(0),

    unitPrice: integer("unit_price").notNull(),
    unitPriceWithoutVat: integer("unit_price_without_vat").notNull(),

    total: integer("total").notNull(),
    totalWithoutVat: integer("total_without_vat").notNull(),
  },
  (it) => ({
    invoiceIdIdx: index().on(it.invoiceId),
  }),
);

export type InvoiceItem = typeof invoicesItemsTable.$inferSelect;
export type InvoiceItemInsert = typeof invoicesItemsTable.$inferInsert;

export const insertInvoiceItemSchema = createInsertSchema(invoicesItemsTable);

export const invoicesItemsRelations = relations(
  invoicesItemsTable,
  ({ one }) => ({
    invoice: one(invoicesTable, {
      fields: [invoicesItemsTable.invoiceId],
      references: [invoicesTable.id],
    }),
  }),
);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "sent",
  "paid",
  "cancelled",
]);

export const invoicesTable = pgTable(
  "invoices",
  {
    id: bigserial("id").notNull().primaryKey(),

    customerId: bigint("customer_id").references(() => customersTable.id),
    organizationId: bigint("organization_id")
      .notNull()
      .references(() => organizationsTable.id),

    // we need to keep the supplier data in the invoice because the supplier can change
    supplierName: varchar("supplier_name", { length: 255 }).notNull(),
    supplierStreet: varchar("supplier_street", { length: 255 }),
    supplierCity: varchar("supplier_city", { length: 255 }),
    supplierZip: varchar("supplier_zip", { length: 255 }),
    supplierCountry: varchar("supplier_country", { length: 255 }),
    supplierBusinessId: varchar("supplier_business_id", { length: 255 }),
    supplierTaxId: varchar("supplier_tax_id", { length: 255 }),
    supplierVatId: varchar("supplier_vat_id", { length: 255 }),
    supplierBankAccount: varchar("supplier_bank_account", { length: 255 }),
    supplierBankCode: varchar("supplier_bank_code", { length: 255 }),

    // we need to keep the customer data in the invoice because the customer can change
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    customerStreet: varchar("customer_street", { length: 255 }),
    customerCity: varchar("customer_city", { length: 255 }),
    customerZip: varchar("customer_zip", { length: 255 }),
    customerCountry: varchar("customer_country", { length: 255 }),
    customerBusinessId: varchar("customer_business_id", { length: 255 }),
    customerTaxId: varchar("customer_tax_id", { length: 255 }),
    customerVatId: varchar("customer_vat_id", { length: 255 }),
    customerBankAccount: varchar("customer_bank_account", { length: 255 }),
    customerBankCode: varchar("customer_bank_code", { length: 255 }),

    paymentMethod: varchar("payment_method", { length: 255 }),

    number: varchar("number", { length: 255 }).notNull(),
    reference: varchar("reference", { length: 255 }),

    variableSymbol: varchar("variable_symbol", { length: 255 }),
    constantSymbol: varchar("constant_symbol", { length: 255 }),
    specificSymbol: varchar("specific_symbol", { length: 255 }),

    status: invoiceStatusEnum("status").notNull(),

    issueDate: timestamp("issue_date").notNull().defaultNow(),
    dueDate: timestamp("due_date")
      .notNull()
      .$defaultFn(() => addDays(new Date(), 14)),
    supplyDate: timestamp("supply_date"),

    /** we are storing template reference,
     * but also a copy of the template so we can prevent unwanted invoice mutation in case the template was mutated */
    templateId: bigint("template_id"),
    templateData: typedJson<InvoiceTemplateData>("template_data"),

    total: integer("total").notNull().default(0),
    totalWithoutVat: integer("total_without_vat").notNull().default(0),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    paidAt: timestamp("paid_at"),
  },
  (it) => ({
    compoundKey: uniqueIndex().on(it.organizationId, it.number),
    organizationIdIdx: index().on(it.organizationId),
  }),
);

export const invoicesRelations = relations(invoicesTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [invoicesTable.organizationId],
    references: [organizationsTable.id],
  }),
  customer: one(customersTable, {
    fields: [invoicesTable.customerId],
    references: [customersTable.id],
  }),
  template: one(invoiceTemplatesTable, {
    fields: [invoicesTable.templateId],
    references: [invoiceTemplatesTable.id],
  }),
}));

export type Invoice = typeof invoicesTable.$inferSelect;
export type InvoiceInsert = typeof invoicesTable.$inferInsert;

export const insertInvoiceSchema = createInsertSchema(invoicesTable);

export const invoiceTemplatesTable = pgTable(
  "invoice_templates",
  {
    id: bigserial("id").notNull().primaryKey(),
    organizationId: bigint("organization_id")
      .notNull()
      .references(() => organizationsTable.id),
    name: varchar("name", { length: 255 }).notNull(),
    template: typedJson<InvoiceTemplateData>("template")
      .notNull()
      .$default(() => DEFAULT_TEMPLATE),
  },
  (it) => ({
    compoundKey: uniqueIndex().on(it.organizationId, it.name),
    organizationIdIdx: index().on(it.organizationId),
  }),
);

export const invoiceTemplatesRelations = relations(
  invoiceTemplatesTable,
  ({ one }) => ({
    organization: one(organizationsTable, {
      fields: [invoiceTemplatesTable.organizationId],
      references: [organizationsTable.id],
    }),
  }),
);

export type InvoiceTemplate = typeof invoiceTemplatesTable.$inferSelect;
export type InvoiceTemplateInsert = typeof invoiceTemplatesTable.$inferInsert;

export const insertInvoiceTemplateSchema = createInsertSchema(
  invoiceTemplatesTable,
  {
    template: invoiceTemplateDataSchema,
  },
);

export const customersTable = pgTable(
  "customers",
  {
    id: bigserial("id").notNull().primaryKey(),
    organizationId: bigint("organization_id")
      .notNull()
      .references(() => organizationsTable.id),
    name: varchar("name", { length: 255 }).notNull(),
    street: varchar("address", { length: 255 }),
    city: varchar("city", { length: 255 }),
    zip: varchar("zip", { length: 255 }),
    country: varchar("country", { length: 255 }),
    phone: varchar("phone", { length: 255 }),
    email: varchar("email", { length: 255 }),
    businessId: varchar("business_id", { length: 255 }),
    taxId: varchar("tax_id", { length: 255 }),
    vatId: varchar("vat_id", { length: 255 }),
    bankAccount: varchar("bank_account", { length: 255 }),
    bankCode: varchar("bank_code", { length: 255 }),
  },
  (c) => ({
    compoundKey: uniqueIndex().on(c.organizationId, c.name),
    nameIdx: index().on(c.name),
    organizationIdIdx: index().on(c.organizationId),
  }),
);

export const customersRelations = relations(
  customersTable,
  ({ one, many }) => ({
    organization: one(organizationsTable, {
      fields: [customersTable.organizationId],
      references: [organizationsTable.id],
    }),
    invoices: many(invoicesTable),
  }),
);

export type Customer = typeof customersTable.$inferSelect;
export type CustomerInsert = typeof customersTable.$inferInsert;

export const insertCustomerSchema = createInsertSchema(customersTable);

export const organizationUserRoleEnum = pgEnum("organization_user_role", [
  "owner",
  "editor",
  "reader",
]);

export const organizationUsersTable = pgTable(
  "organization_users",
  {
    organizationId: bigint("organization_id")
      .notNull()
      .references(() => organizationsTable.id),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => usersTable.id),

    role: organizationUserRoleEnum("role").notNull(),
  },

  (ou) => ({
    compoundKey: primaryKey({
      columns: [ou.organizationId, ou.userId],
    }),
    organizationIdIdx: index().on(ou.organizationId),
    userIdIdx: index().on(ou.userId),
  }),
);

export const organizationUsersRelations = relations(
  organizationUsersTable,
  ({ one }) => ({
    organization: one(organizationsTable, {
      fields: [organizationUsersTable.organizationId],
      references: [organizationsTable.id],
    }),
    user: one(usersTable, {
      fields: [organizationUsersTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export type OrganizationUser = typeof organizationUsersTable.$inferSelect;
export type OrganizationUserInsert = typeof organizationUsersTable.$inferInsert;

export const insertOrganizationUserSchema = createInsertSchema(
  organizationUsersTable,
);

export const invoiceNumberingEnum = pgEnum("invoice_numbering", [
  "sequential",
  "yearly",
  "monthly",
]);

export const organizationsTable = pgTable(
  "organizations",
  {
    id: bigserial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    invoiceNumbering: invoiceNumberingEnum("invoice_numbering")
      .notNull()
      .default("sequential"),

    street: varchar("address", { length: 255 }),
    city: varchar("city", { length: 255 }),
    zip: varchar("zip", { length: 255 }),
    country: varchar("country", { length: 255 }),
    phone: varchar("phone", { length: 255 }),
    email: varchar("email", { length: 255 }),
    bankAccount: varchar("bank_account", { length: 255 }),
    bankCode: varchar("bank_code", { length: 255 }),
    businessId: varchar("business_id", { length: 255 }),
    taxId: varchar("tax_id", { length: 255 }),
    vatId: varchar("vat_id", { length: 255 }),
  },
  (org) => ({
    slugIdx: index().on(org.slug),
  }),
);

export const organizationsRelations = relations(
  organizationsTable,
  ({ many }) => ({
    memberships: many(organizationUsersTable),
    templates: many(invoiceTemplatesTable),
  }),
);

export type Organization = typeof organizationsTable.$inferSelect;
export type OrganizationInsert = typeof organizationsTable.$inferInsert;

export const insertOrganizationSchema = createInsertSchema(organizationsTable);

/**
 * Personal access tokens are used for API authentication. They are created by the user and can be
 * revoked by the user at any time.
 */
export const personalAccessTokensTable = pgTable("personal_access_tokens", {
  id: bigserial("id").notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => usersTable.id),
});

export const personalAccessTokensRelations = relations(
  personalAccessTokensTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [personalAccessTokensTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export type PersonalAccessToken = typeof personalAccessTokensTable.$inferSelect;
export type PersonalAccessTokenInsert =
  typeof personalAccessTokensTable.$inferInsert;

export const insertPersonalAccessTokenSchema = createInsertSchema(
  personalAccessTokensTable,
);

export const usersTable = pgTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  /**
   * password can be nullable because we can have users that are not local users
   */
  password: varchar("password", { length: 255 }),
  emailVerified: timestamp("emailVerified").default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;

export const usersRelations = relations(usersTable, ({ many }) => ({
  accounts: many(accountsTable),
  personalAccessTokens: many(personalAccessTokensTable),
}));

export const accountsTable = pgTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"] | "credentials">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index().on(account.userId),
  }),
);

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const sessionsTable = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (session) => ({
    userIdIdx: index().on(session.userId),
  }),
);

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const verificationTokenTypeEnum = pgEnum("verification_token_type", [
  "reset-password",
  "other",
]);

export const verificationTokensTable = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
    /** our custom enum we are using to determine the origin of the token */
    type: verificationTokenTypeEnum("type").default("other"),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
