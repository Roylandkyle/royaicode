import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResearchPanel() {
  const [query, setQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const searchMutation = trpc.research.search.useMutation();
  const historyQuery = trpc.research.getHistory.useQuery();

  const handleSearch = () => {
    if (query.trim()) {
      searchMutation.mutate({ query });
    }
  };

  const latestSearch = searchMutation.data;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Research Query</label>
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for information..."
            className="flex-1"
            disabled={searchMutation.isPending}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || searchMutation.isPending}
            className="bg-[rgb(0,255,200)] hover:bg-[rgb(0,200,180)] text-black"
          >
            {searchMutation.isPending ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {latestSearch && (
        <div className="p-4 rounded-lg border border-[rgb(0,255,200)]/20 bg-[rgb(15,25,45)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[rgb(0,255,200)]">Results for: {latestSearch.query}</h3>
              <span className="text-xs text-gray-400">
                {latestSearch.results.length} results
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {latestSearch.results.map((result, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded border border-[rgb(0,255,200)]/10 bg-[rgb(20,35,60)] hover:bg-[rgb(25,40,60)] cursor-pointer transition-colors"
                  onClick={() => setSelectedResult(result.url)}
                >
                  <p className="font-mono text-[rgb(0,255,200)] text-sm">{result.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{result.snippet}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{result.source}</span>
                    <span className="text-xs bg-[rgb(0,255,200)]/10 px-2 py-1 rounded">
                      {Math.round(result.relevance * 100)}% relevant
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Research History */}
      {historyQuery.data && historyQuery.data.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-mono text-[rgb(0,255,200)] text-sm">Research History</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {historyQuery.data.slice(0, 5).map((research) => (
              <div
                key={research.id}
                className="p-2 rounded text-xs bg-[rgb(20,35,60)] border border-[rgb(0,255,200)]/10 hover:border-[rgb(0,255,200)]/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono">{research.query.substring(0, 35)}...</span>
                  <span className={`px-2 py-1 rounded ${
                    research.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    research.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {research.status}
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
