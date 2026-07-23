CREATE TABLE `capabilities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('core','growth','utility') NOT NULL,
	`signature` text,
	`status` enum('active','idle','deprecated') NOT NULL DEFAULT 'active',
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`lastUsed` timestamp,
	CONSTRAINT `capabilities_id` PRIMARY KEY(`id`),
	CONSTRAINT `capabilities_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `growthEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`growthId` int NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`stepName` varchar(255),
	`progress` int,
	`message` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `growthEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `growthHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`iteration` int NOT NULL,
	`featureName` varchar(255) NOT NULL,
	`description` text,
	`status` enum('proposed','implemented','tested','failed') NOT NULL,
	`methodCode` text,
	`dependencies` json,
	`testResults` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `growthHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memorySnapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`dataType` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memorySnapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `protocols` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`goals` json NOT NULL,
	`status` enum('idle','running','completed','failed') NOT NULL DEFAULT 'idle',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`executedAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `protocols_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `systemMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`methodCount` int NOT NULL,
	`growthCycles` int NOT NULL,
	`memorySize` decimal(10,2) NOT NULL,
	`uptime` int NOT NULL,
	`lastUpdate` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `systemMetrics_id` PRIMARY KEY(`id`)
);
