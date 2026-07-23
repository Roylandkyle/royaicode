import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import SystemHeader from "@/components/CommandCenter/SystemHeader";
import ChatPanel from "@/components/CommandCenter/ChatPanel";
import GrowthVisualizer from "@/components/CommandCenter/GrowthVisualizer";
import GrowthTimeline from "@/components/CommandCenter/GrowthTimeline";
import CapabilityMap from "@/components/CommandCenter/CapabilityMap";
import MemoryInspector from "@/components/CommandCenter/MemoryInspector";
import ProtocolPanel from "@/components/CommandCenter/ProtocolPanel";
import { useLocation } from "wouter";

export default function CommandCenter() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "growth" | "protocols" | "memory">("overview");

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(10,15,30)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-glow text-2xl font-mono text-[rgb(0,150,255)] mb-4">
            JARVIC INITIALIZING...
          </div>
          <div className="h-1 w-32 bg-primary/30 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(10,15,30)] text-[rgb(230,240,255)]">
      {/* System Header */}
      <SystemHeader onSandboxMode={() => setLocation("/secret-lab")} />

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Top Row - Chat and Growth Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Panel - Takes 1 column */}
          <div className="lg:col-span-1">
            <ChatPanel />
          </div>

          {/* Growth Visualizer - Takes 2 columns */}
          <div className="lg:col-span-2">
            <GrowthVisualizer />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[rgb(0,150,255)]/20/30 pb-4">
          {[
            { id: "overview" as const, label: "OVERVIEW" },
            { id: "growth" as const, label: "GROWTH LOG" },
            { id: "protocols" as const, label: "PROTOCOLS" },
            { id: "memory" as const, label: "MEMORY" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-mono text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-[rgb(0,150,255)] border-b-2 border-[rgb(0,150,255)]"
                  : "text-muted-foreground hover:text-[rgb(230,240,255)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CapabilityMap />
              <MemoryInspector />
            </div>
          )}

          {activeTab === "growth" && <GrowthTimeline />}

          {activeTab === "protocols" && <ProtocolPanel />}

          {activeTab === "memory" && <MemoryInspector fullView />}
        </div>
      </div>
    </div>
  );
}
