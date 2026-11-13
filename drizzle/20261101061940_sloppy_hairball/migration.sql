CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY,
	"user_id" integer,
	"display_name" varchar(100),
	"avatar" bytea,
	"bio" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"username" varchar(50) NOT NULL UNIQUE,
	"email" varchar(225) NOT NULL UNIQUE,
	"password_hash" varchar(225) NOT NULL,
	"unique_id" varchar(64) NOT NULL,
	"public_key" text NOT NULL,
	"private_key_encrypted" text,
	"last_seen" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;