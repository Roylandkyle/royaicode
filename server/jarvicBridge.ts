import axios, { AxiosInstance } from "axios";
import { jarvicEventEmitter } from "./_core/eventEmitter";
import * as db from "./db";

/**
 * Jarvic Backend Bridge
 * Communicates with the Python Jarvic backend and bridges growth events to the frontend
 */
export class JarvicBridge {
  private apiClient: AxiosInstance;
  private baseUrl: string;
  private isConnected: boolean = false;

  constructor(baseUrl: string = "http://localhost:5000") {
    this.baseUrl = baseUrl;
    this.apiClient = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
    });
  }

  /**
   * Initialize connection to Jarvic backend
   */
  async initialize(): Promise<boolean> {
    try {
      const response = await this.apiClient.get("/health");
      this.isConnected = response.status === 200;
      console.log("[JarvicBridge] Connected to Jarvic backend");
      return true;
    } catch (error) {
      console.warn("[JarvicBridge] Failed to connect to Jarvic backend:", error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Submit a goal to Jarvic for processing
   */
  async submitGoal(goal: string): Promise<{ id: number; status: string }> {
    try {
      const response = await this.apiClient.post("/api/goals", { goal });
      const growthId = response.data.id;

      // Store in database
      const iteration = (await db.getGrowthHistory(1))[0]?.iteration || 0;
      await db.addGrowthEntry({
        iteration: iteration + 1,
        featureName: goal,
        status: "proposed",
      });

      // Emit event
      jarvicEventEmitter.emitGrowthEvent({
        type: "growth_started",
        growthId,
        message: `Starting growth cycle for: ${goal}`,
        timestamp: new Date(),
      });

      return { id: growthId, status: "started" };
    } catch (error) {
      console.error("[JarvicBridge] Failed to submit goal:", error);
      throw error;
    }
  }

  /**
   * Get growth cycle status
   */
  async getGrowthStatus(growthId: number): Promise<any> {
    try {
      const response = await this.apiClient.get(`/api/growth/${growthId}`);
      return response.data;
    } catch (error) {
      console.error("[JarvicBridge] Failed to get growth status:", error);
      throw error;
    }
  }

  /**
   * Stream growth events from backend
   */
  async streamGrowthEvents(growthId: number): Promise<void> {
    try {
      const response = await this.apiClient.get(`/api/growth/${growthId}/stream`, {
        responseType: "stream",
      });

      response.data.on("data", (chunk: Buffer) => {
        try {
          const lines = chunk.toString().split("\n");
          for (const line of lines) {
            if (line.trim()) {
              const event = JSON.parse(line);
              this.handleStreamEvent(growthId, event);
            }
          }
        } catch (e) {
          console.error("[JarvicBridge] Failed to parse stream event:", e);
        }
      });

      response.data.on("end", () => {
        jarvicEventEmitter.emitGrowthEvent({
          type: "growth_completed",
          growthId,
          message: "Growth cycle completed",
          timestamp: new Date(),
        });
      });

      response.data.on("error", (error: any) => {
        jarvicEventEmitter.emitGrowthEvent({
          type: "error",
          growthId,
          message: `Stream error: ${error.message}`,
          timestamp: new Date(),
        });
      });
    } catch (error) {
      console.error("[JarvicBridge] Failed to stream growth events:", error);
      throw error;
    }
  }

  /**
   * Handle incoming stream events
   */
  private handleStreamEvent(growthId: number, event: any): void {
    if (event.type === "step_progress") {
      jarvicEventEmitter.emitGrowthEvent({
        type: "step_progress",
        growthId,
        stepName: event.step,
        progress: event.progress,
        message: event.message,
        timestamp: new Date(),
      });
    } else if (event.type === "step_completed") {
      jarvicEventEmitter.emitGrowthEvent({
        type: "step_completed",
        growthId,
        stepName: event.step,
        message: event.message,
        timestamp: new Date(),
      });

      // Update database
      if (event.feature_added) {
        db.addCapability({
          name: event.feature_name,
          description: event.description,
          category: "growth",
          signature: event.signature,
        }).catch(console.error);
      }
    } else if (event.type === "error") {
      jarvicEventEmitter.emitGrowthEvent({
        type: "error",
        growthId,
        message: event.error,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Get Jarvic memory
   */
  async getMemory(): Promise<Record<string, any>> {
    try {
      const response = await this.apiClient.get("/api/memory");
      return response.data;
    } catch (error) {
      console.error("[JarvicBridge] Failed to get memory:", error);
      throw error;
    }
  }

  /**
   * Update Jarvic memory
   */
  async setMemory(key: string, value: any): Promise<void> {
    try {
      await this.apiClient.post("/api/memory", { key, value });

      // Emit event
      jarvicEventEmitter.emitMemoryEvent({
        type: "memory_updated",
        key,
        value: JSON.stringify(value),
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("[JarvicBridge] Failed to set memory:", error);
      throw error;
    }
  }

  /**
   * Get Jarvic capabilities
   */
  async getCapabilities(): Promise<string[]> {
    try {
      const response = await this.apiClient.get("/api/capabilities");
      return response.data.methods;
    } catch (error) {
      console.error("[JarvicBridge] Failed to get capabilities:", error);
      throw error;
    }
  }

  /**
   * Execute a protocol
   */
  async executeProtocol(goals: string[]): Promise<{ id: number }> {
    try {
      const response = await this.apiClient.post("/api/protocol/execute", { goals });
      return response.data;
    } catch (error) {
      console.error("[JarvicBridge] Failed to execute protocol:", error);
      throw error;
    }
  }

  /**
   * Check if connected to backend
   */
  isBackendConnected(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
let bridgeInstance: JarvicBridge | null = null;

export function getJarvicBridge(): JarvicBridge {
  if (!bridgeInstance) {
    const url = process.env.JARVIC_BACKEND_URL || "http://localhost:5000";
    bridgeInstance = new JarvicBridge(url);
  }
  return bridgeInstance;
}

// Initialize on module load
export async function initializeJarvicBridge(): Promise<void> {
  const bridge = getJarvicBridge();
  await bridge.initialize();
}
