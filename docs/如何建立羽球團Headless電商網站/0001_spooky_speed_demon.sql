CREATE TABLE `coaches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`specialty` varchar(255) NOT NULL,
	`experience` text NOT NULL,
	`bio` text NOT NULL,
	`photoUrl` text NOT NULL,
	`photoKey` varchar(255),
	`sortOrder` int NOT NULL DEFAULT 0,
	`featured` boolean NOT NULL DEFAULT false,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coaches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(180) NOT NULL,
	`courseType` varchar(120) NOT NULL,
	`targetAudience` varchar(180) NOT NULL,
	`summary` text NOT NULL,
	`description` text NOT NULL,
	`highlight` varchar(180) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`featured` boolean NOT NULL DEFAULT false,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(64) NOT NULL,
	`customerUserId` int,
	`customerName` varchar(160) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(40) NOT NULL,
	`note` text,
	`orderStatus` enum('pending_payment','processing','completed','cancelled') NOT NULL DEFAULT 'pending_payment',
	`subtotalCents` int NOT NULL,
	`itemsSnapshot` text NOT NULL,
	`stripePaymentIntentId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`category` varchar(120) NOT NULL,
	`shortDescription` text NOT NULL,
	`description` text NOT NULL,
	`specs` text NOT NULL,
	`priceCents` int NOT NULL,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(255),
	`featured` boolean NOT NULL DEFAULT false,
	`active` boolean NOT NULL DEFAULT true,
	`inventory` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
