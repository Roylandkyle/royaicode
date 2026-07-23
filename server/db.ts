import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  growthHistory,
  protocols,
  memorySnapshots,
  systemMetrics,
  capabilities,
  growthEvents,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Growth History queries
export async function getGrowthHistory(limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(growthHistory)
    .orderBy(desc(growthHistory.createdAt))
    .limit(limit);
}

export async function addGrowthEntry(entry: typeof growthHistory.$inferInsert) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(growthHistory).values(entry);
  return result;
}

export async function updateGrowthEntry(
  id: number,
  updates: Partial<typeof growthHistory.$inferInsert>
) {
  const db = await getDb();
  if (!db) return null;

  return db.update(growthHistory).set(updates).where(eq(growthHistory.id, id));
}

// Protocol queries
export async function getProtocols(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(protocols)
    .where(eq(protocols.userId, userId))
    .orderBy(desc(protocols.createdAt));
}

export async function createProtocol(protocol: typeof protocols.$inferInsert) {
  const db = await getDb();
  if (!db) return null;

  return db.insert(protocols).values(protocol);
}

export async function updateProtocol(
  id: number,
  updates: Partial<typeof protocols.$inferInsert>
) {
  const db = await getDb();
  if (!db) return null;

  return db.update(protocols).set(updates).where(eq(protocols.id, id));
}

export async function deleteProtocol(id: number) {
  const db = await getDb();
  if (!db) return null;

  return db.delete(protocols).where(eq(protocols.id, id));
}

// Memory queries
export async function getMemory(key?: string) {
  const db = await getDb();
  if (!db) return [];

  if (key) {
    return db
      .select()
      .from(memorySnapshots)
      .where(eq(memorySnapshots.key, key));
  }

  return db.select().from(memorySnapshots);
}

export async function setMemory(key: string, value: string, dataType = "string") {
  const db = await getDb();
  if (!db) return null;

  const existing = await db
    .select()
    .from(memorySnapshots)
    .where(eq(memorySnapshots.key, key));

  if (existing.length > 0) {
    return db
      .update(memorySnapshots)
      .set({ value, dataType })
      .where(eq(memorySnapshots.key, key));
  }

  return db.insert(memorySnapshots).values({ key, value, dataType });
}

export async function deleteMemory(key: string) {
  const db = await getDb();
  if (!db) return null;

  return db.delete(memorySnapshots).where(eq(memorySnapshots.key, key));
}

// Capability queries
export async function getCapabilities() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(capabilities).orderBy(capabilities.name);
}

export async function addCapability(capability: typeof capabilities.$inferInsert) {
  const db = await getDb();
  if (!db) return null;

  return db.insert(capabilities).values(capability);
}

export async function updateCapabilityStatus(name: string, status: string) {
  const db = await getDb();
  if (!db) return null;

  return db
    .update(capabilities)
    .set({ status: status as any, lastUsed: new Date() })
    .where(eq(capabilities.name, name));
}

// Growth Events queries
export async function addGrowthEvent(event: typeof growthEvents.$inferInsert) {
  const db = await getDb();
  if (!db) return null;

  return db.insert(growthEvents).values(event);
}

export async function getGrowthEvents(growthId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(growthEvents)
    .where(eq(growthEvents.growthId, growthId))
    .orderBy(growthEvents.timestamp);
}

// System Metrics queries
export async function getSystemMetrics() {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(systemMetrics).orderBy(desc(systemMetrics.lastUpdate)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateSystemMetrics(metrics: typeof systemMetrics.$inferInsert) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getSystemMetrics();
  if (existing) {
    return db.update(systemMetrics).set(metrics).where(eq(systemMetrics.id, existing.id));
  }

  return db.insert(systemMetrics).values(metrics);
}
