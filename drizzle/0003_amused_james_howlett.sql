CREATE TABLE `favorites` (
	`user_id` text NOT NULL,
	`ad_id` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`ad_id`) REFERENCES `ads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_favorite_user_ad` ON `favorites` (`user_id`,`ad_id`);--> statement-breakpoint
CREATE INDEX `idx_favorite_user` ON `favorites` (`user_id`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporter_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` integer NOT NULL,
	`reason` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pendiente' NOT NULL,
	`created_at` text NOT NULL,
	`resolved_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_reports_status` ON `reports` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `saved_searches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`query` text DEFAULT '' NOT NULL,
	`kind` text DEFAULT 'Todos' NOT NULL,
	`category` text DEFAULT 'Todas' NOT NULL,
	`city` text DEFAULT 'Todas las ciudades' NOT NULL,
	`min_price` real,
	`max_price` real,
	`condition` text DEFAULT 'todos' NOT NULL,
	`min_rating` integer,
	`latitude` real,
	`longitude` real,
	`radius_km` integer,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_saved_search_user` ON `saved_searches` (`user_id`);--> statement-breakpoint
ALTER TABLE `ads` ADD `condition` text DEFAULT 'no_aplica' NOT NULL;--> statement-breakpoint
ALTER TABLE `ads` ADD `hidden_at` text;--> statement-breakpoint
ALTER TABLE `profiles` ADD `verified_at` text;--> statement-breakpoint
ALTER TABLE `profiles` ADD `verification_requested_at` text;