ALTER TABLE `orders` ADD `notificationStatus` enum('pending','sent','failed') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `notificationError` text;