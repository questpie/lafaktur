import { relations, sql } from "drizzle-orm";
import {
  bigint as bigintOI,
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp as timestampOI,
  uniqueIndex,
  varchar,
  type MySqlTimestampConfig,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { type AdapterAccount } from "next-auth/adapters";
import { typedJson } from "~/server/db/types/typed-json";
import {
  DEFAULT_TEMPLATE,
  invoiceStatusSchema,
  invoiceTemplateDataSchema,
  type InvoiceTemplateData,
} from "~/shared/invoice-template/invoice-template-types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `lafaktur_${name}`);
/**
 * Creator for bigint columns. So we have always the number format as bigint.
 */
export const bigint = (name: string) => bigintOI(name, { mode: "number" });
export const timestamp = <TMode extends "string" | "date" = "date">(
  name: string,
  options?: MySqlTimestampConfig<TMode>,
) => timestampOI(name, { mode: "date", fsp: 3, ...options });

export const invoicesItemsTable = mysqlTable(
  "invoiceItem",
  {
    id: bigint("id").notNull().primaryKey().autoincrement(),
    invoiceId: bigint("invoiceId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    quantity: int("quantity").notNull(),
    unit: varchar("unit", { length: 255 }).notNull(),
    unitPrice: int("unitPrice").notNull(),
    unitPriceWithoutVat: int("unitPriceWithoutVat").notNull(),
    total: int("total").notNull(),
    totalWithoutVat: int("totalWithoutVat").notNull(),
  },
  (it) => ({
    invoiceIdIdx: index("invoiceIdIdx").on(it.invoiceId),
  }),
);

export type InvoiceItem = typeof invoicesItemsTable.$inferSelect;
export type InvoiceItemInsert = typeof invoicesItemsTable.$inferInsert;

export const insertInvoiceItem = createInsertSchema(invoicesItemsTable);

export const invoicesItemsRelations = relations(
  invoicesItemsTable,
  ({ one }) => ({
    invoice: one(invoicesTable, {
      fields: [invoicesItemsTable.invoiceId],
      references: [invoicesTable.id],
    }),
  }),
);

export const invoicesTable = mysqlTable(
  "invoice",
  {
    id: bigint("id").notNull().primaryKey().autoincrement(),
    customerId: bigint("customerId").notNull(),

    organizationId: bigint("organizationId").notNull(),

    number: varchar("number", { length: 255 }).notNull(),
    reference: varchar("reference", { length: 255 }),

    variableSymbol: varchar("variableSymbol", { length: 255 }),
    constantSymbol: varchar("constantSymbol", { length: 255 }),
    specificSymbol: varchar("specificSymbol", { length: 255 }),

    status: mysqlEnum("status", invoiceStatusSchema._def.values)
      .notNull()
      .default("draft"),

    issueDate: timestamp("issueDate").notNull(),
    dueDate: timestamp("dueDate").notNull(),
    supplyDate: timestamp("supplyDate"),
    dateOfPayment: timestamp("dateOfPayment"),

    currency: varchar("currency", { length: 16 }).notNull(),

    templateId: bigint("templateId").notNull(),
    templateData: typedJson<InvoiceTemplateData>("templateData").notNull(),

    createdAt: timestamp("createdAt").notNull(),
  },
  (it) => ({
    compoundKey: uniqueIndex("organizationIdNumberIdx").on(
      it.organizationId,
      it.number,
    ),
    organizationIdIdx: index("organizationIdIdx").on(it.organizationId),
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

export const insertInvoice = createInsertSchema(invoicesTable);

export const invoiceTemplatesTable = mysqlTable(
  "invoiceTemplate",
  {
    id: bigint("id").notNull().primaryKey().autoincrement(),
    organizationId: bigint("organizationId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    template: typedJson<InvoiceTemplateData>("template")
      .notNull()
      .default(DEFAULT_TEMPLATE),
  },
  (it) => ({
    compoundKey: uniqueIndex("organizationIdNameIdx").on(
      it.organizationId,
      it.name,
    ),
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

export const insertInvoiceTemplate = createInsertSchema(invoiceTemplatesTable, {
  template: invoiceTemplateDataSchema,
});

export const customersTable = mysqlTable(
  "customer",
  {
    id: bigint("id").notNull().primaryKey().autoincrement(),
    organizationId: bigint("organizationId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    street: varchar("address", { length: 255 }),
    city: varchar("city", { length: 255 }),
    zip: varchar("zip", { length: 255 }),
    country: varchar("country", { length: 255 }),
    phone: varchar("phone", { length: 255 }),
    email: varchar("email", { length: 255 }),
    businessId: varchar("businessId", { length: 255 }),
    taxId: varchar("taxId", { length: 255 }),
    vatId: varchar("vatId", { length: 255 }),
    bankAccount: varchar("bankAccount", { length: 255 }),
    bankCode: varchar("bankCode", { length: 255 }),
  },
  (c) => ({
    compoundKey: uniqueIndex("organizationIdNameIdx").on(
      c.organizationId,
      c.name,
    ),
    nameIdx: index("nameIdx").on(c.name),
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

export const insertCustomer = createInsertSchema(customersTable);

export const organizationUsersTable = mysqlTable(
  "organizationUser",
  {
    organizationId: bigint("organizationId").notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["owner", "editor", "reader"]).notNull(),
  },
  (ou) => ({
    compoundKey: primaryKey(ou.organizationId, ou.userId),
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

export const insertOrganizationUser = createInsertSchema(
  organizationUsersTable,
);

export const organizationsTable = mysqlTable(
  "organization",
  {
    id: bigint("id").notNull().primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    invoiceNumbering: mysqlEnum("invoiceNumbering", [
      "sequential",
      "yearly",
      "monthly",
    ])
      .notNull()
      .default("sequential"),

    street: varchar("address", { length: 255 }),
    city: varchar("city", { length: 255 }),
    zip: varchar("zip", { length: 255 }),
    country: varchar("country", { length: 255 }),
    phone: varchar("phone", { length: 255 }),
    email: varchar("email", { length: 255 }),
    bankAccount: varchar("bankAccount", { length: 255 }),
    bankCode: varchar("bankCode", { length: 255 }),
    businessId: varchar("businessId", { length: 255 }),
    taxId: varchar("taxId", { length: 255 }),
    vatId: varchar("vatId", { length: 255 }),
  },
  (org) => ({
    slugIdx: index("slugIdx").on(org.slug),
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

export const insertOrganization = createInsertSchema(organizationsTable);

/**
 * Personal access tokens are used for API authentication. They are created by the user and can be
 * revoked by the user at any time.
 */
export const personalAccessTokensTable = mysqlTable(
  "personalAccessToken",
  {
    id: bigint("id").notNull().primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
  },
  (pat) => ({
    userIdIdx: index("userIdIdx").on(pat.userId),
  }),
);

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

export const insertPersonalAccessToken = createInsertSchema(
  personalAccessTokensTable,
);

export const usersTable = mysqlTable("user", {
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

export const accountsTable = mysqlTable(
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
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userIdIdx").on(account.userId),
  }),
);

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const sessionsTable = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (session) => ({
    userIdIdx: index("userIdIdx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const verificationTokensTable = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
