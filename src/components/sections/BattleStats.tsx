"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Swords } from "lucide-react";
import { TornBattleStats } from "@/types/torn-schema";

export function BattleStats() {
  const { data } = useTorn();
  const stats = data?.battlestats?.data as unknown as TornBattleStats;

  if (!stats) {
    return (
      <Card title="Battle Stats" icon={Swords}>
        <div className="p-4 text-muted-foreground text-sm font-mono">
          WAITING FOR DATA...
        </div>
      </Card>
    );
  }

  // Calculate percentages for bars relative to total (or max of stats for visualization)
  const maxStat = Math.max(stats.strength, stats.speed, stats.defense, stats.dexterity);

  return (
    <Card title="Battle Stats" icon={Swords}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-end mb-4 border-b border-border pb-2">
           <span className="text-sm font-mono text-muted-foreground uppercase">Total Stats</span>
           <span className="text-xl font-bold tabular-nums">{stats.total.toLocaleString()}</span>
        </div>

        <div className="space-y-3">
          <ProgressBar 
            label="Strength" 
            value={stats.strength} 
            max={maxStat} 
            showValues={true}
            showMax={false}
            color="default"
          />
          <ProgressBar 
            label="Defense" 
            value={stats.defense} 
            max={maxStat}
            showValues={true}
            showMax={false}
            color="default"
          />
          <ProgressBar 
            label="Speed" 
            value={stats.speed} 
            max={maxStat}
            showValues={true}
            showMax={false}
            color="default"
          />
          <ProgressBar 
            label="Dexterity" 
            value={stats.dexterity} 
            max={maxStat}
            showValues={true}
            showMax={false}
            color="default"
          />
        </div>
        
        {stats.strength_modifier !== 0 && (
           <div className="text-xs text-muted-foreground font-mono mt-2 pt-2 border-t border-border">
             Modifiers active. Check detailed view.
           </div>
        )}
      </div>
    </Card>
  );
}
