import React, { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AutonomousGrowthPanel() {
  const [goal, setGoal] = useState('');
  const [activeCycle, setActiveCycle] = useState<string | null>(null);

  const startCycleMutation = trpc.autonomousGrowth.startCycle.useMutation({
    onSuccess: (data) => {
      setActiveCycle(data.id);
      setGoal('');
    },
  });

  const cycleStatusQuery = trpc.autonomousGrowth.getCycleStatus.useQuery(
    { id: activeCycle || '' },
    { enabled: !!activeCycle, refetchInterval: 1000 }
  );

  const allCyclesQuery = trpc.autonomousGrowth.getAllCycles.useQuery();

  const handleStartCycle = () => {
    if (goal.trim()) {
      startCycleMutation.mutate({ goal });
    }
  };

  const cycle = cycleStatusQuery.data;

  return (
    <div className="space-y-4">
      {/* Goal Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Enter Growth Goal</label>
        <div className="flex gap-2">
          <Input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Learn to fetch and analyze web data..."
            className="flex-1"
            disabled={startCycleMutation.isPending}
          />
          <Button
            onClick={handleStartCycle}
            disabled={!goal.trim() || startCycleMutation.isPending}
            className="bg-[rgb(0,150,255)] hover:bg-[rgb(0,180,255)]"
          >
            {startCycleMutation.isPending ? 'Starting...' : 'Start'}
          </Button>
        </div>
      </div>

      {/* Active Cycle Status */}
      {cycle && (
        <div className="p-4 rounded-lg border border-[rgb(0,150,255)]/20 bg-[rgb(15,25,45)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[rgb(0,150,255)]">Active Cycle: {cycle.id}</h3>
              <span className="text-sm font-mono text-[rgb(0,255,200)]">{cycle.phase}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-mono">{cycle.progress}%</span>
              </div>
              <div className="w-full bg-[rgb(20,35,60)] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-[rgb(0,150,255)] transition-all duration-300"
                  style={{ width: `${cycle.progress}%` }}
                />
              </div>
            </div>

            <div className="text-sm space-y-1">
              <p><strong>Goal:</strong> {cycle.goal}</p>
              <p><strong>Status:</strong> {cycle.status}</p>
              {cycle.error && <p className="text-red-400"><strong>Error:</strong> {cycle.error}</p>}
            </div>

            {cycle.codeProposal && (
              <div className="mt-3 p-3 bg-[rgb(20,35,60)] rounded border border-[rgb(0,255,200)]/20">
                <p className="font-mono text-[rgb(0,255,200)] text-sm">
                  Generated Feature: {cycle.codeProposal.featureName}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Complexity: {cycle.codeProposal.estimatedComplexity}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Growth History */}
      {allCyclesQuery.data && allCyclesQuery.data.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-mono text-[rgb(0,150,255)]">Recent Cycles</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allCyclesQuery.data.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="p-2 rounded text-sm bg-[rgb(20,35,60)] border border-[rgb(0,150,255)]/10 hover:border-[rgb(0,150,255)]/30 cursor-pointer transition-colors"
                onClick={() => setActiveCycle(c.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono">{c.goal.substring(0, 40)}...</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    c.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    c.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
