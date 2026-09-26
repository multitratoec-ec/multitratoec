CREATE TABLE `ads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`city` text NOT NULL,
	`price` real NOT NULL,
	`unit` text NOT NULL,
	`description` text NOT NULL,
	`contact` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_ads_created_at` ON `ads` (`created_at`);