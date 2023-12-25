DO $$ BEGIN
 CREATE TYPE "verification_token_type" AS ENUM('reset-password', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "verificationToken" ADD COLUMN "type" "verification_token_type" DEFAULT 'other';