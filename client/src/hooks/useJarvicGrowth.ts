import { useEffect, useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";

export interface GrowthStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "error";
  progress: number;
  message?: string;
}

export function useJarvicGrowth() {
  const [growthId, setGrowthId] = useState<number | null>(null);
  const [steps, setSteps] = useState<GrowthStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Query growth history
  const { data: history } = trpc.growth.getHistory.useQuery({ limit: 10 });

  // Query growth events
  const { data: events } = trpc.growth.getEvents.useQuery(
    { growthId: growthId || 0 },
    { enabled: growthId !== null }
  );

  // Mutation to add growth entry
  const addEntryMutation = trpc.growth.addEntry.useMutation();

  // Mutation to add growth event
  const addEventMutation = trpc.growth.addEvent.useMutation();

  // Submit a goal to Jarvic
  const submitGoal = useCallback(
    async (goal: string) => {
      try {
        setIsRunning(true);
        const iteration = (history?.length || 0) + 1;

        // Add growth entry
        await addEntryMutation.mutateAsync({
          iteration,
          featureName: goal,
          description: `Goal: ${goal}`,
          status: "proposed",
        });

        // Simulate growth steps
        const growthSteps: GrowthStep[] = [
          { id: "1", name: "Analyzing Capabilities", status: "running", progress: 0 },
          { id: "2", name: "Proposing Features", status: "pending", progress: 0 },
          { id: "3", name: "Installing Dependencies", status: "pending", progress: 0 },
          { id: "4", name: "Implementing Code", status: "pending", progress: 0 },
          { id: "5", name: "Self-Testing", status: "pending", progress: 0 },
        ];

        setSteps(growthSteps);

        // Simulate progress
        for (let i = 0; i < growthSteps.length; i++) {
          const step = growthSteps[i];
          setSteps((prev) =>
            prev.map((s) => (s.id === step.id ? { ...s, status: "running" } : s))
          );

          for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            setSteps((prev) =>
              prev.map((s) =>
                s.id === step.id ? { ...s, progress: Math.min(progress, 100) } : s
              )
            );
          }

          setSteps((prev) =>
            prev.map((s) =>
              s.id === step.id
                ? { ...s, status: "completed", progress: 100 }
                : i + 1 < growthSteps.length
                  ? s
                  : { ...s, status: "running" }
            )
          );
        }

        setIsRunning(false);
      } catch (error) {
        console.error("Failed to submit goal:", error);
        setIsRunning(false);
      }
    },
    [history, addEntryMutation]
  );

  // Update growth entry status
  const updateGrowthStatus = useCallback(
    async (id: number, status: "proposed" | "implemented" | "tested" | "failed") => {
      try {
        await addEntryMutation.mutateAsync({
          iteration: 1,
          featureName: "temp",
          status,
        });
      } catch (error) {
        console.error("Failed to update growth status:", error);
      }
    },
    [addEntryMutation]
  );

  return {
    growthId,
    steps,
    isRunning,
    history,
    events,
    submitGoal,
    updateGrowthStatus,
  };
}
