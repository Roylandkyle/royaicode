import { CheckCircle2, Zap } from "lucide-react";

interface TimelineEntry {
  id: string;
  iteration: number;
  feature: string;
  timestamp: Date;
  status: "success" | "pending";
}

const mockTimeline: TimelineEntry[] = [
  {
    id: "1",
    iteration: 1,
    feature: "fetch_web_content",
    timestamp: new Date(Date.now() - 3600000),
    status: "success",
  },
  {
    id: "2",
    iteration: 2,
    feature: "process_files",
    timestamp: new Date(Date.now() - 7200000),
    status: "success",
  },
  {
    id: "3",
    iteration: 3,
    feature: "call_external_api",
    timestamp: new Date(Date.now() - 10800000),
    status: "success",
  },
];

export default function GrowthTimeline() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">EVOLUTION TIMELINE</h2>
        <span className="text-xs text-muted-foreground">{mockTimeline.length} ITERATIONS</span>
      </div>

      <div className="space-y-6">
        {mockTimeline.map((entry, index) => (
          <div key={entry.id} className="relative">
            {/* Timeline line */}
            {index !== mockTimeline.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-12 bg-gradient-to-b from-primary to-transparent" />
            )}

            {/* Timeline item */}
            <div className="flex gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-[rgb(0,150,255)]/50 flex items-center justify-center">
                  {entry.status === "success" ? (
                    <CheckCircle2 className="w-6 h-6 text-secondary" />
                  ) : (
                    <Zap className="w-6 h-6 text-[rgb(0,150,255)] animate-pulse" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-mono font-bold text-[rgb(0,150,255)]">
                    ITERATION {entry.iteration}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {entry.timestamp.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-[rgb(230,240,255)] mb-2">{entry.feature}</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded border border-secondary/30">
                    ✓ Completed
                  </span>
                  <span className="px-2 py-1 text-xs bg-primary/10 text-[rgb(0,150,255)] rounded border border-[rgb(0,150,255)]/30">
                    Self-tested
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
