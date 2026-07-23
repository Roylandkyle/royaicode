import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Growth Engine procedures
  growth: router({
    // Get all growth history
    getHistory: publicProcedure
      .input(z.object({ limit: z.number().default(50) }).optional())
      .query(async ({ input }) => {
        return db.getGrowthHistory(input?.limit);
      }),

    // Add a new growth entry
    addEntry: protectedProcedure
      .input(
        z.object({
          iteration: z.number(),
          featureName: z.string(),
          description: z.string().optional(),
          status: z.enum(["proposed", "implemented", "tested", "failed"]),
          methodCode: z.string().optional(),
          dependencies: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.addGrowthEntry({
          iteration: input.iteration,
          featureName: input.featureName,
          description: input.description,
          status: input.status,
          methodCode: input.methodCode,
          dependencies: input.dependencies,
        });
      }),

    // Update growth entry status
    updateEntry: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["proposed", "implemented", "tested", "failed"]),
          testResults: z.object({ passed: z.boolean(), output: z.string() }).optional(),
          completedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.updateGrowthEntry(input.id, {
          status: input.status,
          testResults: input.testResults,
          completedAt: input.completedAt,
        });
      }),

    // Get growth events for real-time streaming
    getEvents: publicProcedure
      .input(z.object({ growthId: z.number() }))
      .query(async ({ input }) => {
        return db.getGrowthEvents(input.growthId);
      }),

    // Add growth event (for streaming)
    addEvent: protectedProcedure
      .input(
        z.object({
          growthId: z.number(),
          eventType: z.string(),
          stepName: z.string().optional(),
          progress: z.number().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.addGrowthEvent({
          growthId: input.growthId,
          eventType: input.eventType,
          stepName: input.stepName,
          progress: input.progress,
          message: input.message,
        });
      }),
  }),

  // Protocol procedures
  protocols: router({
    // Get all protocols for user
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getProtocols(ctx.user.id);
    }),

    // Create a new protocol
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          goals: z.array(z.string()),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return db.createProtocol({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          goals: input.goals,
          status: "idle",
        });
      }),

    // Execute a protocol
    execute: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateProtocol(input.id, {
          status: "running",
          executedAt: new Date(),
        });
        return { success: true };
      }),

    // Update protocol status
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["idle", "running", "completed", "failed"]),
        })
      )
      .mutation(async ({ input }) => {
        const updates: any = { status: input.status };
        if (input.status === "completed") {
          updates.completedAt = new Date();
        }
        return db.updateProtocol(input.id, updates);
      }),

    // Delete a protocol
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteProtocol(input.id);
      }),
  }),

  // Memory procedures
  memory: router({
    // Get all memory or specific key
    get: publicProcedure
      .input(z.object({ key: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return db.getMemory(input?.key);
      }),

    // Set memory value
    set: protectedProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
          dataType: z.string().default("string"),
        })
      )
      .mutation(async ({ input }) => {
        return db.setMemory(input.key, input.value, input.dataType);
      }),

    // Delete memory entry
    delete: protectedProcedure
      .input(z.object({ key: z.string() }))
      .mutation(async ({ input }) => {
        return db.deleteMemory(input.key);
      }),

    // Clear all memory
    clear: protectedProcedure.mutation(async () => {
      const allMemory = await db.getMemory();
      for (const entry of allMemory) {
        await db.deleteMemory(entry.key);
      }
      return { success: true };
    }),
  }),

  // Capability procedures
  capabilities: router({
    // Get all capabilities
    list: publicProcedure.query(async () => {
      return db.getCapabilities();
    }),

    // Add a new capability
    add: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          category: z.enum(["core", "growth", "utility"]),
          signature: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.addCapability({
          name: input.name,
          description: input.description,
          category: input.category,
          signature: input.signature,
          status: "active",
        });
      }),

    // Update capability status
    updateStatus: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          status: z.enum(["active", "idle", "deprecated"]),
        })
      )
      .mutation(async ({ input }) => {
        return db.updateCapabilityStatus(input.name, input.status);
      }),
  }),

  // System metrics procedures
  metrics: router({
    // Get current system metrics
    getCurrent: publicProcedure.query(async () => {
      return db.getSystemMetrics();
    }),

    // Update system metrics
    update: protectedProcedure
      .input(
        z.object({
          methodCount: z.number(),
          growthCycles: z.number(),
          memorySize: z.string(),
          uptime: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return db.updateSystemMetrics({
          methodCount: input.methodCount,
          growthCycles: input.growthCycles,
          memorySize: input.memorySize,
          uptime: input.uptime,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
