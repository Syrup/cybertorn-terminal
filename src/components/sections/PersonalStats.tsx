"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { ChevronDown, Globe } from "lucide-react";


import { useState } from "react";

interface PersonalStatsResponse {
  personalstats: Record<string, number | string>;
}

export function PersonalStats() {
  const { data } = useTorn();
  const stats = data?.personalstats?.data as unknown as PersonalStatsResponse | null;
  const [filter, setFilter] = useState("");

  if (!stats || !stats.personalstats) {
    return (
      <Card title="Personal Stats" icon={Globe}>
        <div className="p-4 text-muted-foreground text-sm font-mono">
          WAITING FOR DATA...
        </div>
      </Card>
    );
  }

  const allStats = stats.personalstats;
  const categories = {
    Combat: ["attack", "kill", "damage", "hit", "miss", "critical", "round", "stealth", "fight", "defend", "escape"],
    Crime: ["crime", "jail", "bust", "theft", "virus", "hack", "murder", "fraud", "arson", "drug"],
    Travel: ["travel", "flight", "abroad", "hunting", "racing"],
    Economy: ["money", "market", "trade", "bazaar", "item", "points", "stock", "company", "networth"],
    Social: ["friend", "enemy", "mail", "message", "chat", "forum", "married", "faction"],
    Misc: [] as string[]
  };

  const getCategory = (key: string) => {
    const lowerKey = key.toLowerCase();
    for (const [cat, keywords] of Object.entries(categories)) {
      if (cat === "Misc") continue;
      if (keywords.some(k => lowerKey.includes(k))) return cat;
    }
    return "Misc";
  };

  const groupedStats: Record<string, { key: string, value: string | number }[]> = {};
  
  Object.entries(allStats).forEach(([key, value]) => {
    if (filter && !key.toLowerCase().includes(filter.toLowerCase())) return;
    const cat = getCategory(key);
    if (!groupedStats[cat]) groupedStats[cat] = [];
    groupedStats[cat].push({ key, value });
  });

  return (
    <Card title="Personal Stats" icon={Globe} className="h-full min-h-[400px]">
      <div className="p-4 h-full flex flex-col">
        <input 
          type="text" 
          placeholder="FILTER STATS..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full mb-4 px-3 py-1 bg-muted border border-border text-xs font-mono uppercase focus:outline-none"
        />
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {Object.entries(groupedStats).sort().map(([category, items], index) => (
            items.length > 0 && (
              <details
                key={category}
                open={Boolean(filter) || index === 0}
                className="group border border-border/60 bg-muted/5"
              >
                <summary className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-bold uppercase text-muted-foreground cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60">
                  <span className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                    <span>{category}</span>
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">{items.length}</span>
                </summary>
                <div className="px-3 pb-3 pt-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {items.map(({ key, value }) => (
                      <div key={key} className="p-2 border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors">
                        <div className="text-[10px] text-muted-foreground uppercase break-words leading-tight mb-1 truncate" title={key}>
                          {key.replace(/_/g, " ")}
                        </div>
                        <div className="font-mono text-xs font-medium tabular-nums truncate">
                          {typeof value === "number" ? value.toLocaleString() : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            )
          ))}
          {Object.keys(groupedStats).length === 0 && (
            <div className="text-center text-muted-foreground text-xs font-mono">NO MATCHING STATS</div>
          )}
        </div>
      </div>
    </Card>
  );
}
