DO $$ BEGIN
 CREATE TYPE "invoice_numbering" AS ENUM('sequential', 'yearly', 'monthly');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_status" AS ENUM('draft', 'sent', 'paid', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "organization_user_role" AS ENUM('owner', 'editor', 'reader');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"organization_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" varchar(255),
	"city" varchar(255),
	"zip" varchar(255),
	"country" varchar(255),
	"phone" varchar(255),
	"email" varchar(255),
	"business_id" varchar(255),
	"tax_id" varchar(255),
	"vat_id" varchar(255),
	"bank_account" varchar(255),
	"bank_code" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_templates" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"organization_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"template" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_items" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"invoice_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"unit" varchar(255) NOT NULL,
	"unit_price" integer NOT NULL,
	"unit_price_without_vat" integer NOT NULL,
	"total" integer NOT NULL,
	"total_without_vat" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"customer_id" bigint,
	"organization_id" bigint NOT NULL,
	"number" varchar(255) NOT NULL,
	"reference" varchar(255),
	"variable_symbol" varchar(255),
	"constant_symbol" varchar(255),
	"specific_symbol" varchar(255),
	"status" "invoice_status" NOT NULL,
	"issue_date" timestamp (3) DEFAULT now() NOT NULL,
	"due_date" timestamp (3) NOT NULL,
	"supply_date" timestamp (3),
	"template_id" bigint,
	"template_data" jsonb,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"paid_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_users" (
	"organization_id" bigint NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role" "organization_user_role" NOT NULL,
	CONSTRAINT "organization_users_organization_id_user_id_pk" PRIMARY KEY("organization_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"invoice_numbering" "invoice_numbering" DEFAULT 'sequential' NOT NULL,
	"address" varchar(255),
	"city" varchar(255),
	"zip" varchar(255),
	"country" varchar(255),
	"phone" varchar(255),
	"email" varchar(255),
	"bank_account" varchar(255),
	"bank_code" varchar(255),
	"business_id" varchar(255),
	"tax_id" varchar(255),
	"vat_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personal_access_tokens" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp (3) NOT NULL,
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"emailVerified" timestamp (3) DEFAULT CURRENT_TIMESTAMP(3),
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp (3) NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_index" ON "account" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "customers_organization_id_name_index" ON "customers" ("organization_id","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customers_name_index" ON "customers" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customers_organization_id_index" ON "customers" ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invoice_templates_organization_id_name_index" ON "invoice_templates" ("organization_id","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoice_templates_organization_id_index" ON "invoice_templates" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoice_items_invoice_id_index" ON "invoice_items" ("invoice_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invoices_organization_id_number_index" ON "invoices" ("organization_id","number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoices_organization_id_index" ON "invoices" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_users_organization_id_index" ON "organization_users" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_users_user_id_index" ON "organization_users" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_slug_index" ON "organizations" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_index" ON "session" ("userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_templates" ADD CONSTRAINT "invoice_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personal_access_tokens" ADD CONSTRAINT "personal_access_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
