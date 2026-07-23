import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Growth history - tracks all evolution iterations
 */
export const growthHistory = mysqlTable("growthHistory", {
  id: int("id").autoincrement().primaryKey(),
  iteration: int("iteration").notNull(),
  featureName: varchar("featureName", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["proposed", "implemented", "tested", "failed"]).notNull(),
  methodCode: text("methodCode"),
  dependencies: json("dependencies").$type<string[]>(),
  testResults: json("testResults").$type<{ passed: boolean; output: string }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type GrowthHistory = typeof growthHistory.$inferSelect;
export type InsertGrowthHistory = typeof growthHistory.$inferInsert;

/**
 * Protocols - named sequences of goals
 */
export const protocols = mysqlTable("protocols", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  goals: json("goals").$type<string[]>().notNull(),
  status: mysqlEnum("status", ["idle", "running", "completed", "failed"]).default("idle").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  executedAt: timestamp("executedAt"),
  completedAt: timestamp("completedAt"),
});

export type Protocol = typeof protocols.$inferSelect;
export type InsertProtocol = typeof protocols.$inferInsert;

/**
 * Memory snapshots - persistent state of Jarvic's memory
 */
export const memorySnapshots = mysqlTable("memorySnapshots", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull(),
  value: text("value").notNull(),
  dataType: varchar("dataType", { length: 50 }).notNull(), // "string", "number", "json", etc
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MemorySnapshot = typeof memorySnapshots.$inferSelect;
export type InsertMemorySnapshot = typeof memorySnapshots.$inferInsert;

/**
 * System metrics - performance and status tracking
 */
export const systemMetrics = mysqlTable("systemMetrics", {
  id: int("id").autoincrement().primaryKey(),
  methodCount: int("methodCount").notNull(),
  growthCycles: int("growthCycles").notNull(),
  memorySize: decimal("memorySize", { precision: 10, scale: 2 }).notNull(),
  uptime: int("uptime").notNull(), // in seconds
  lastUpdate: timestamp("lastUpdate").defaultNow().notNull(),
});

export type SystemMetrics = typeof systemMetrics.$inferSelect;
export type InsertSystemMetrics = typeof systemMetrics.$inferInsert;

/**
 * Capabilities - current methods and skills
 */
export const capabilities = mysqlTable("capabilities", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  category: mysqlEnum("category", ["core", "growth", "utility"]).notNull(),
  signature: text("signature"), // method signature
  status: mysqlEnum("status", ["active", "idle", "deprecated"]).default("active").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  lastUsed: timestamp("lastUsed"),
});

export type Capability = typeof capabilities.$inferSelect;
export type InsertCapability = typeof capabilities.$inferInsert;

/**
 * Growth events - real-time events during growth cycles
 */
export const growthEvents = mysqlTable("growthEvents", {
  id: int("id").autoincrement().primaryKey(),
  growthId: int("growthId").notNull(),
  eventType: varchar("eventType", { length: 50 }).notNull(), // "started", "step_completed", "error", etc
  stepName: varchar("stepName", { length: 255 }),
  progress: int("progress"), // 0-100
  message: text("message"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type GrowthEvent = typeof growthEvents.$inferSelect;
export type InsertGrowthEvent = typeof growthEvents.$inferInsert;
