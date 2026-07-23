import { useState } from "react";
import { Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MemoryEntry {
  key: string;
  value: string;
  timestamp: Date;
}

const mockMemory: MemoryEntry[] = [
  {
    key: "last_run",
    value: "2026-07-23T21:36:16.510Z",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    key: "growth_iterations",
    value: "3",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    key: "last_fetched_url",
    value: "https://example.com",
    timestamp: new Date(Date.now() - 10800000),
  },
  {
    key: "features_added",
    value: '["fetch_web_content", "process_files", "call_external_api"]',
    timestamp: new Date(Date.now() - 14400000),
  },
];

interface MemoryInspectorProps {
  fullView?: boolean;
}

export default function MemoryInspector({ fullView = false }: MemoryInspectorProps) {
  const [search, setSearch] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filtered = mockMemory.filter(
    (entry) =>
      entry.key.toLowerCase().includes(search.toLowerCase()) ||
      entry.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className={`panel ${fullView ? "" : ""}`}>
      <div className="panel-header">
        <h2 className="panel-title">MEMORY INSPECTOR</h2>
        <span className="text-xs text-muted-foreground">{filtered.length} ENTRIES</span>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search memory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[rgb(20,35,60)] border-[rgb(0,150,255)]/20/50 text-[rgb(230,240,255)] placeholder:text-muted-foreground"
        />
      </div>

      {/* Memory Entries */}
      <div className={`space-y-2 ${fullView ? "max-h-96" : "max-h-48"} overflow-y-auto pr-2`}>
        {filtered.length > 0 ? (
          filtered.map((entry) => (
            <div
              key={entry.key}
              className="p-3 rounded-lg border border-[rgb(0,150,255)]/20/30 bg-[rgb(15,25,45)]/50 hover:bg-[rgb(15,25,45)]/80 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-sm font-semibold text-[rgb(0,150,255)] break-all">
                  {entry.key}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => handleCopy(entry.value, entry.key)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground break-all mb-1 font-mono">
                {entry.value.length > 100 ? entry.value.substring(0, 100) + "..." : entry.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.timestamp.toLocaleString()}
              </p>
              {copiedKey === entry.key && (
                <p className="text-xs text-secondary mt-1">✓ Copied</p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No memory entries found</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-[rgb(0,150,255)]/20/20">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">TOTAL SIZE</p>
            <p className="text-lg font-mono font-bold text-[rgb(0,150,255)]">12 KB</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">ENTRIES</p>
            <p className="text-lg font-mono font-bold text-secondary">{mockMemory.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
