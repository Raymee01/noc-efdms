CREATE TABLE `correspondence` (
	`id` text PRIMARY KEY NOT NULL,
	`direction` text NOT NULL,
	`subject` text NOT NULL,
	`party` text NOT NULL,
	`priority` text NOT NULL,
	`deadline` text,
	`status` text NOT NULL,
	`document` text,
	`owner` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`ref` text NOT NULL,
	`title` text NOT NULL,
	`folder` text NOT NULL,
	`owner` text NOT NULL,
	`classification` text DEFAULT 'INTERNAL' NOT NULL,
	`status` text DEFAULT 'Draft' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`archived` integer DEFAULT 0 NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL,
	`hold` integer DEFAULT 0 NOT NULL,
	`retain_until` text,
	`reviewer` text,
	`due` text,
	`locked_by` text,
	`metadata` text DEFAULT '{}' NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `documents_ref_unique` ON `documents` (`ref`);--> statement-breakpoint
CREATE INDEX `document_folder` ON `documents` (`folder`);--> statement-breakpoint
CREATE INDEX `document_owner` ON `documents` (`owner`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`detail` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `folders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`parent` text,
	`description` text DEFAULT '' NOT NULL,
	`archived` integer DEFAULT 0 NOT NULL,
	`protected` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `folder_parent` ON `folders` (`parent`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`message` text NOT NULL,
	`document` text,
	`read` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stars` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`document` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `versions` (
	`id` text PRIMARY KEY NOT NULL,
	`document` text NOT NULL,
	`number` integer NOT NULL,
	`key` text NOT NULL,
	`filename` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`actor` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `version_document` ON `versions` (`document`);