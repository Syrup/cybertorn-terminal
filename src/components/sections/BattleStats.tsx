"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Swords } from "lucide-react";
import { TornBattleStats } from "@/types/torn-schema";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
const STAT_LABELS: Record<string, string> = {
  STR: "Strength",
  DEF: "Defense",
  SPD: "Speed",
  DEX: "Dexterity",
};

interface RadarPayloadEntry {
  stat: string;
  value: number;
  fullMark: number;
}

function BattleStatsTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: RadarPayloadEntry }>;
}) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0]?.payload;
  if (!entry) return null;

  return (
    <div className="bg-card border border-border px-3 py-2 font-mono text-xs shadow-md">
      <p className="text-muted-foreground uppercase">{STAT_LABELS[entry.stat] ?? entry.stat}</p>
      <p className="text-sm font-bold tabular-nums">{entry.value.toLocaleString()}</p>
    </div>
  );
}

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

  const maxStat = Math.max(stats.strength, stats.speed, stats.defense, stats.dexterity);

  const radarData = [
    { stat: "STR", value: stats.strength, fullMark: maxStat },
    { stat: "DEF", value: stats.defense, fullMark: maxStat },
    { stat: "SPD", value: stats.speed, fullMark: maxStat },
    { stat: "DEX", value: stats.dexterity, fullMark: maxStat },
  ];

  return (
    <Card title="Battle Stats" icon={Swords}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-end mb-4 border-b border-border pb-2">
           <span className="text-sm font-mono text-muted-foreground uppercase">Total Stats</span>
           <span className="text-xl font-bold tabular-nums">{stats.total.toLocaleString()}</span>
        </div>

        {/* Radar Chart */}
        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid
                stroke="var(--border)"
                strokeOpacity={0.6}
              />
              <PolarAngleAxis
                dataKey="stat"
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              />
              <Tooltip content={<BattleStatsTooltip />} />
              <Radar
                name="Battle Stats"
                dataKey="value"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
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
