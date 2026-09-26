CREATE TABLE `conversations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ad_id` integer NOT NULL,
	`buyer_id` text NOT NULL,
	`seller_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`ad_id`) REFERENCES `ads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_conversation_ad_buyer` ON `conversations` (`ad_id`,`buyer_id`);--> statement-breakpoint
CREATE INDEX `idx_conversations_seller` ON `conversations` (`seller_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`conversation_id` integer NOT NULL,
	`sender_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_messages_conversation` ON `messages` (`conversation_id`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipient_id` text NOT NULL,
	`type` text NOT NULL,
	`actor_id` text NOT NULL,
	`ad_id` integer,
	`conversation_id` integer,
	`created_at` text NOT NULL,
	`read_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_notifications_recipient` ON `notifications` (`recipient_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ad_id` integer NOT NULL,
	`object_key` text NOT NULL,
	FOREIGN KEY (`ad_id`) REFERENCES `ads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_photos_ad` ON `photos` (`ad_id`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`account_type` text DEFAULT 'persona' NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`whatsapp` text DEFAULT '' NOT NULL,
	`show_whatsapp` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reviewer_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`conversation_id` integer NOT NULL,
	`stars` integer NOT NULL,
	`comment` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_review_conversation_reviewer` ON `reviews` (`conversation_id`,`reviewer_id`);--> statement-breakpoint
CREATE INDEX `idx_reviews_subject` ON `reviews` (`subject_id`);--> statement-breakpoint
ALTER TABLE `ads` ADD `latitude` real;--> statement-breakpoint
ALTER TABLE `ads` ADD `longitude` real;--> statement-breakpoint
ALTER TABLE `ads` ADD `photo_count` integer DEFAULT 0 NOT NULL;