import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2, Package } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GrowthStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "error";
  progress: number;
}

export default function GrowthVisualizer() {
  const [steps, setSteps] = useState<GrowthStep[]>([
    { id: "1", name: "Analyzing Capabilities", status: "completed", progress: 100 },
    { id: "2", name: "Proposing Features", status: "running", progress: 65 },
    { id: "3", name: "Installing Dependencies", status: "pending", progress: 0 },
    { id: "4", name: "Implementing Code", status: "pending", progress: 0 },
    { id: "5", name: "Self-Testing", status: "pending", progress: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteps((prev) =>
        prev.map((step) => {
          if (step.status === "running") {
            const newProgress = Math.min(step.progress + Math.random() * 15, 100);
            return {
              ...step,
              progress: newProgress,
              status: newProgress >= 100 ? "completed" : "running",
            };
          }
          if (step.status === "completed") {
            const nextStep = prev.find((s) => s.status === "pending");
            if (nextStep && step.id === prev.find((s) => s.status === "running" || s.status === "completed")?.id) {
              return step;
            }
          }
          return step;
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">GROWTH ENGINE</h2>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs text-muted-foreground">RUNNING</span>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {step.status === "completed" && (
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                )}
                {step.status === "running" && (
                  <Loader2 className="w-4 h-4 text-[rgb(0,150,255)] animate-spin" />
                )}
                {step.status === "pending" && (
                  <div className="w-4 h-4 rounded-full border border-muted" />
                )}
                {step.status === "error" && (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
                <span className="text-sm font-mono text-[rgb(230,240,255)]">{step.name}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{step.progress}%</span>
            </div>
            <Progress value={step.progress} className="h-1" />
          </div>
        ))}
      </div>

      {/* Current Details */}
      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-[rgb(0,150,255)]/20">
        <p className="text-xs font-mono text-muted-foreground mb-2">CURRENT PROPOSAL</p>
        <p className="text-sm text-[rgb(230,240,255)] mb-2">
          <span className="text-[rgb(0,150,255)]">fetch_web_content</span> - Fetch and retrieve content from URLs
        </p>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded border border-secondary/30">
            <Package className="w-3 h-3 inline mr-1" />
            requests
          </span>
          <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded border border-secondary/30">
            <Package className="w-3 h-3 inline mr-1" />
            beautifulsoup4
          </span>
        </div>
      </div>
    </div>
  );
}
