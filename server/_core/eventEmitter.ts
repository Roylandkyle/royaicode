import { EventEmitter } from "events";

export interface GrowthEvent {
  type: "growth_started" | "step_progress" | "step_completed" | "growth_completed" | "error";
  growthId: number;
  stepName?: string;
  progress?: number;
  message?: string;
  timestamp: Date;
}

export interface MemoryEvent {
  type: "memory_updated" | "memory_cleared";
  key?: string;
  value?: string;
  timestamp: Date;
}

export interface CapabilityEvent {
  type: "capability_added" | "capability_updated";
  name: string;
  status?: string;
  timestamp: Date;
}

export type JarvicEvent = GrowthEvent | MemoryEvent | CapabilityEvent;

class JarvicEventEmitter extends EventEmitter {
  private static instance: JarvicEventEmitter;

  private constructor() {
    super();
    this.setMaxListeners(100);
  }

  static getInstance(): JarvicEventEmitter {
    if (!JarvicEventEmitter.instance) {
      JarvicEventEmitter.instance = new JarvicEventEmitter();
    }
    return JarvicEventEmitter.instance;
  }

  emitGrowthEvent(event: GrowthEvent) {
    this.emit("growth", event);
    this.emit(`growth:${event.growthId}`, event);
  }

  emitMemoryEvent(event: MemoryEvent) {
    this.emit("memory", event);
  }

  emitCapabilityEvent(event: CapabilityEvent) {
    this.emit("capability", event);
  }

  onGrowth(callback: (event: GrowthEvent) => void) {
    this.on("growth", callback);
  }

  onGrowthById(growthId: number, callback: (event: GrowthEvent) => void) {
    this.on(`growth:${growthId}`, callback);
  }

  onMemory(callback: (event: MemoryEvent) => void) {
    this.on("memory", callback);
  }

  onCapability(callback: (event: CapabilityEvent) => void) {
    this.on("capability", callback);
  }

  offGrowth(callback: (event: GrowthEvent) => void) {
    this.off("growth", callback);
  }

  offGrowthById(growthId: number, callback: (event: GrowthEvent) => void) {
    this.off(`growth:${growthId}`, callback);
  }

  offMemory(callback: (event: MemoryEvent) => void) {
    this.off("memory", callback);
  }

  offCapability(callback: (event: CapabilityEvent) => void) {
    this.off("capability", callback);
  }
}

export const jarvicEventEmitter = JarvicEventEmitter.getInstance();
