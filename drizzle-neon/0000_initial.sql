CREATE TABLE "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "email_verified" boolean DEFAULT false NOT NULL,
  "image" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
  "id" text PRIMARY KEY NOT NULL,
  "expires_at" timestamp NOT NULL,
  "token" text NOT NULL UNIQUE,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE "account" (
  "id" text PRIMARY KEY NOT NULL,
  "account_id" text NOT NULL,
  "provider_id" text NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "access_token" text,
  "refresh_token" text,
  "id_token" text,
  "access_token_expires_at" timestamp,
  "refresh_token_expires_at" timestamp,
  "scope" text,
  "password" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ads" (
  "id" serial PRIMARY KEY NOT NULL,
  "owner" text NOT NULL,
  "kind" text NOT NULL,
  "title" text NOT NULL,
  "category" text NOT NULL,
  "city" text NOT NULL,
  "price" real NOT NULL,
  "unit" text NOT NULL,
  "description" text NOT NULL,
  "contact" text NOT NULL,
  "created_at" text NOT NULL,
  "latitude" real,
  "longitude" real,
  "photo_count" integer DEFAULT 0 NOT NULL,
  "reach_km" integer DEFAULT 30 NOT NULL,
  "condition" text DEFAULT 'no_aplica' NOT NULL,
  "hidden_at" text
);
--> statement-breakpoint
CREATE TABLE "profiles" (
  "user_id" text PRIMARY KEY NOT NULL,
  "display_name" text NOT NULL,
  "account_type" text DEFAULT 'persona' NOT NULL,
  "bio" text DEFAULT '' NOT NULL,
  "city" text DEFAULT '' NOT NULL,
  "whatsapp" text DEFAULT '' NOT NULL,
  "show_whatsapp" integer DEFAULT 0 NOT NULL,
  "updated_at" text NOT NULL,
  "joined_at" text,
  "avatar_key" text,
  "verified_at" text,
  "verification_requested_at" text
);
--> statement-breakpoint
CREATE TABLE "photos" (
  "id" serial PRIMARY KEY NOT NULL,
  "ad_id" integer NOT NULL REFERENCES "ads"("id"),
  "object_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
  "id" serial PRIMARY KEY NOT NULL,
  "ad_id" integer NOT NULL REFERENCES "ads"("id"),
  "buyer_id" text NOT NULL,
  "seller_id" text NOT NULL,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "conversation_id" integer NOT NULL REFERENCES "conversations"("id"),
  "sender_id" text NOT NULL,
  "body" text NOT NULL,
  "created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
  "id" serial PRIMARY KEY NOT NULL,
  "reviewer_id" text NOT NULL,
  "subject_id" text NOT NULL,
  "conversation_id" integer NOT NULL REFERENCES "conversations"("id"),
  "stars" integer NOT NULL,
  "comment" text DEFAULT '' NOT NULL,
  "created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
  "id" serial PRIMARY KEY NOT NULL,
  "recipient_id" text NOT NULL,
  "type" text NOT NULL,
  "actor_id" text NOT NULL,
  "ad_id" integer,
  "conversation_id" integer,
  "created_at" text NOT NULL,
  "read_at" text
);
--> statement-breakpoint
CREATE TABLE "favorites" (
  "user_id" text NOT NULL,
  "ad_id" integer NOT NULL REFERENCES "ads"("id"),
  "created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_searches" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "name" text NOT NULL,
  "query" text DEFAULT '' NOT NULL,
  "kind" text DEFAULT 'Todos' NOT NULL,
  "category" text DEFAULT 'Todas' NOT NULL,
  "city" text DEFAULT 'Todas las ciudades' NOT NULL,
  "min_price" real,
  "max_price" real,
  "condition" text DEFAULT 'todos' NOT NULL,
  "min_rating" integer,
  "latitude" real,
  "longitude" real,
  "radius_km" integer,
  "created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
  "id" serial PRIMARY KEY NOT NULL,
  "reporter_id" text NOT NULL,
  "target_type" text NOT NULL,
  "target_id" integer NOT NULL,
  "reason" text NOT NULL,
  "detail" text DEFAULT '' NOT NULL,
  "status" text DEFAULT 'pendiente' NOT NULL,
  "created_at" text NOT NULL,
  "resolved_at" text
);
--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");
--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");
--> statement-breakpoint
CREATE INDEX "idx_ads_created_at" ON "ads" ("created_at");
--> statement-breakpoint
CREATE INDEX "idx_photos_ad" ON "photos" ("ad_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_conversation_ad_buyer" ON "conversations" ("ad_id", "buyer_id");
--> statement-breakpoint
CREATE INDEX "idx_conversations_seller" ON "conversations" ("seller_id");
--> statement-breakpoint
CREATE INDEX "idx_messages_conversation" ON "messages" ("conversation_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_review_conversation_reviewer" ON "reviews" ("conversation_id", "reviewer_id");
--> statement-breakpoint
CREATE INDEX "idx_reviews_subject" ON "reviews" ("subject_id");
--> statement-breakpoint
CREATE INDEX "idx_notifications_recipient" ON "notifications" ("recipient_id", "created_at");
--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_favorite_user_ad" ON "favorites" ("user_id", "ad_id");
--> statement-breakpoint
CREATE INDEX "idx_favorite_user" ON "favorites" ("user_id");
--> statement-breakpoint
CREATE INDEX "idx_saved_search_user" ON "saved_searches" ("user_id");
--> statement-breakpoint
CREATE INDEX "idx_reports_status" ON "reports" ("status", "created_at");
