CREATE TABLE `favorites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`city` text NOT NULL,
	`country` text DEFAULT '中国' NOT NULL,
	`label` text DEFAULT '已收藏' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `favorites_user_city_unique` ON `favorites` (`user_id`,`city`);