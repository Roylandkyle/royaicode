import { Code2, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Capability {
  id: string;
  name: string;
  description: string;
  category: "core" | "growth" | "utility";
  status: "active" | "idle";
}

const mockCapabilities: Capability[] = [
  {
    id: "1",
    name: "query_llm",
    description: "Query LLM for code generation and analysis",
    category: "core",
    status: "active",
  },
  {
    id: "2",
    name: "execute_command",
    description: "Execute shell commands and capture output",
    category: "core",
    status: "active",
  },
  {
    id: "3",
    name: "fetch_web_content",
    description: "Fetch and retrieve content from URLs",
    category: "growth",
    status: "active",
  },
  {
    id: "4",
    name: "process_files",
    description: "Read and process local files",
    category: "growth",
    status: "idle",
  },
  {
    id: "5",
    name: "call_external_api",
    description: "Call external APIs and handle responses",
    category: "growth",
    status: "idle",
  },
  {
    id: "6",
    name: "_save_memory",
    description: "Persist memory state to JSON",
    category: "utility",
    status: "active",
  },
];

export default function CapabilityMap() {
  const [search, setSearch] = useState("");

  const filtered = mockCapabilities.filter(
    (cap) =>
      cap.name.toLowerCase().includes(search.toLowerCase()) ||
      cap.description.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core":
        return "bg-primary/20 text-[rgb(0,150,255)] border-[rgb(0,150,255)]/30";
      case "growth":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "utility":
        return "bg-accent/20 text-accent border-accent/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">CAPABILITY MAP</h2>
        <span className="text-xs text-muted-foreground">{filtered.length} ACTIVE</span>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search capabilities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[rgb(20,35,60)] border-[rgb(0,150,255)]/20/50 text-[rgb(230,240,255)] placeholder:text-muted-foreground"
        />
      </div>

      {/* Capabilities List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {filtered.map((cap) => (
          <div
            key={cap.id}
            className="p-3 rounded-lg border border-[rgb(0,150,255)]/20/30 bg-[rgb(15,25,45)]/50 hover:bg-[rgb(15,25,45)]/80 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[rgb(0,150,255)] flex-shrink-0" />
                <span className="font-mono font-semibold text-[rgb(230,240,255)]">{cap.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    cap.status === "active" ? "bg-secondary" : "bg-muted"
                  }`}
                />
                <span className="text-xs text-muted-foreground">{cap.status.toUpperCase()}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{cap.description}</p>
            <span className={`inline-block px-2 py-1 text-xs rounded border ${getCategoryColor(cap.category)}`}>
              {cap.category.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-[rgb(0,150,255)]/20/20 grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">TOTAL</p>
          <p className="text-lg font-mono font-bold text-[rgb(0,150,255)]">{mockCapabilities.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">ACTIVE</p>
          <p className="text-lg font-mono font-bold text-secondary">
            {mockCapabilities.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">GROWTH</p>
          <p className="text-lg font-mono font-bold text-accent">
            {mockCapabilities.filter((c) => c.category === "growth").length}
          </p>
        </div>
      </div>
    </div>
  );
}
