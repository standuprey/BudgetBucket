CREATE TABLE `budget_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`monthly_budget` real NOT NULL,
	`icon` text DEFAULT 'DollarSign' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budget_categories_name_unique` ON `budget_categories` (`name`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`category_id` text NOT NULL,
	`date` text NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `monthly_budgets` (
	`id` text PRIMARY KEY NOT NULL,
	`month` text NOT NULL,
	`total_income` real NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `monthly_budgets_month_unique` ON `monthly_budgets` (`month`);