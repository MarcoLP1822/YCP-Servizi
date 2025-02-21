CREATE TABLE "AIOutputs" (
	"output_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"blurb" text,
	"description" text,
	"keywords" text,
	"categories" jsonb,
	"foreword" text,
	"analysis" text,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Catalog" (
	"catalog_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_data" jsonb NOT NULL,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Files" (
	"file_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_size" integer NOT NULL,
	"storage_path" varchar(255) NOT NULL,
	"upload_date" timestamp DEFAULT now(),
	"processing_status" "processing_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Logs" (
	"log_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action_type" varchar(100) NOT NULL,
	"description" text,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "SessionHistory" (
	"session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"actions" jsonb,
	"session_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"hashed_password" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
