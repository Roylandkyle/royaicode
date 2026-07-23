import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Plus, Trash2 } from "lucide-react";

interface Protocol {
  id: string;
  name: string;
  goals: string[];
  status: "idle" | "running" | "completed";
  createdAt: Date;
}

const mockProtocols: Protocol[] = [
  {
    id: "1",
    name: "House Party Protocol",
    goals: ["fetch news", "analyze sentiment", "generate summary"],
    status: "completed",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "2",
    name: "Data Extraction Protocol",
    goals: ["fetch web content", "process files", "call external api"],
    status: "idle",
    createdAt: new Date(Date.now() - 172800000),
  },
];

export default function ProtocolPanel() {
  const [protocols, setProtocols] = useState<Protocol[]>(mockProtocols);
  const [newProtocolName, setNewProtocolName] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  const handleAddProtocol = () => {
    if (!newProtocolName.trim()) return;
    const newProtocol: Protocol = {
      id: Date.now().toString(),
      name: newProtocolName,
      goals: newGoal ? [newGoal] : [],
      status: "idle",
      createdAt: new Date(),
    };
    setProtocols([...protocols, newProtocol]);
    setNewProtocolName("");
    setNewGoal("");
  };

  const handleDeleteProtocol = (id: string) => {
    setProtocols(protocols.filter((p) => p.id !== id));
  };

  const handleExecuteProtocol = (id: string) => {
    setProtocols(
      protocols.map((p) =>
        p.id === id ? { ...p, status: "running" as const } : p
      )
    );
    setTimeout(() => {
      setProtocols((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "completed" as const } : p
        )
      );
    }, 3000);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">PROTOCOL SYSTEM</h2>
        <span className="text-xs text-muted-foreground">{protocols.length} PROTOCOLS</span>
      </div>

      {/* Create New Protocol */}
      <div className="mb-6 p-4 rounded-lg border border-[rgb(0,150,255)]/20 bg-primary/5">
        <h3 className="text-sm font-mono font-bold text-[rgb(0,150,255)] mb-3">CREATE PROTOCOL</h3>
        <div className="space-y-2">
          <Input
            placeholder="Protocol name (e.g., House Party Protocol)"
            value={newProtocolName}
            onChange={(e) => setNewProtocolName(e.target.value)}
            className="bg-[rgb(20,35,60)] border-[rgb(0,150,255)]/20/50 text-[rgb(230,240,255)] placeholder:text-muted-foreground"
          />
          <Input
            placeholder="First goal (optional)"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="bg-[rgb(20,35,60)] border-[rgb(0,150,255)]/20/50 text-[rgb(230,240,255)] placeholder:text-muted-foreground"
          />
          <Button
            onClick={handleAddProtocol}
            disabled={!newProtocolName.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-[rgb(0,150,255)]-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Protocol
          </Button>
        </div>
      </div>

      {/* Protocols List */}
      <div className="space-y-3">
        {protocols.map((protocol) => (
          <div
            key={protocol.id}
            className="p-4 rounded-lg border border-[rgb(0,150,255)]/20/30 bg-[rgb(15,25,45)]/50 hover:bg-[rgb(15,25,45)]/80 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-mono font-bold text-[rgb(230,240,255)]">{protocol.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Created: {protocol.createdAt.toLocaleString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded font-mono ${
                  protocol.status === "running"
                    ? "bg-primary/20 text-[rgb(0,150,255)]"
                    : protocol.status === "completed"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-muted/20 text-muted-foreground"
                }`}
              >
                {protocol.status.toUpperCase()}
              </span>
            </div>

            {/* Goals */}
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">GOALS:</p>
              <div className="flex flex-wrap gap-2">
                {protocol.goals.length > 0 ? (
                  protocol.goals.map((goal, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded border border-secondary/30"
                    >
                      {goal}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">No goals defined</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleExecuteProtocol(protocol.id)}
                disabled={protocol.status === "running"}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground flex-1"
              >
                <Play className="w-3 h-3 mr-1" />
                Execute
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteProtocol(protocol.id)}
                className="hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
