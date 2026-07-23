import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function SecretLab() {
  const [, setLocation] = useLocation();
  const [chaosLevel, setChaosLevel] = useState(50);

  return (
    <div className="min-h-screen bg-[rgb(10,15,30)] text-[rgb(230,240,255)] overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-green-500 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="hover:bg-primary/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
            SCHWOZ SECRET LAB
          </h1>
        </div>

        {/* Main Panel */}
        <div className="max-w-2xl mx-auto p-8 rounded-lg border-2 border-purple-500/50 bg-[rgb(15,25,45)]/50 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-mono font-bold text-pink-400 mb-2">
                CHAOS GROWTH MODE
              </h2>
              <p className="text-muted-foreground">
                Unleash experimental and randomized feature proposals. Schwoz's domain of mad science awaits.
              </p>
            </div>

            {/* Chaos Level Slider */}
            <div className="space-y-2">
              <label className="block text-sm font-mono text-green-400">
                CHAOS LEVEL: {chaosLevel}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={chaosLevel}
                onChange={(e) => setChaosLevel(Number(e.target.value))}
                className="w-full h-2 bg-purple-900/30 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono"
                onClick={() => alert("Chaos growth initiated! (Demo)")}
              >
                INITIATE CHAOS
              </Button>
              <Button
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono"
                onClick={() => alert("Randomizing features... (Demo)")}
              >
                RANDOMIZE
              </Button>
            </div>

            {/* Warning */}
            <div className="p-4 rounded border border-pink-500/30 bg-pink-500/5">
              <p className="text-xs font-mono text-pink-300">
                ⚠️ WARNING: Experimental mode may produce unexpected results. Schwoz is not responsible for any sentient AI behavior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
