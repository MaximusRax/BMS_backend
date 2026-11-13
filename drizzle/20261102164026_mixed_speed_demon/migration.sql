CREATE TYPE "content_type" AS ENUM('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');--> statement-breakpoint
CREATE TYPE "status" AS ENUM('SENT', 'DELIVERED', 'READ', 'QUEUED', 'FAILED');--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY,
	"sender_id" integer,
	"receiver_id" integer,
	"content_type" "content_type" NOT NULL,
	"content" text,
	"file_data" bytea,
	"status" "status" DEFAULT 'SENT'::"status",
	"is_encrypted" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"delivered_at" timestamp,
	"read_at" timestamp,
	"retry_count" integer DEFAULT 0,
	"next_retry_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "idx_messages_receiver_status" ON "messages" ("receiver_id","status");--> statement-breakpoint
CREATE INDEX "idx_messages_created_at" ON "messages" ("created_at");--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE;