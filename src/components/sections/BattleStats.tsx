"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Swords, BarChart2 } from "lucide-react";
import { TornBattleStats } from "@/types/torn-schema";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
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

// Combat Data Types
interface PersonalStatsAttackingExtended {
  attacks: {
    won: number;
    lost: number;
    stalemate: number;
    assist: number;
    stealth: number;
  };
  defends: {
    won: number;
    lost: number;
    stalemate: number;
    total: number;
  };
}

interface PersonalStatsV2Data {
  personalstats: {
    attacking: PersonalStatsAttackingExtended;
  };
}

interface CombatChartData {
  name: string;
  value: number;
  fill: string;
}

const COMBAT_COLORS = {
  win: "var(--chart-2)",
  loss: "var(--destructive)",
  other: "var(--border)",
};

const CombatTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: CombatChartData }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border px-3 py-2 font-mono text-xs shadow-md">
        <p className="text-muted-foreground uppercase">{data.name}</p>
        <p className="text-sm font-bold tabular-nums" style={{ color: data.fill }}>
          {data.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function BattleStats() {
  const { data, apiKey, fetchSection } = useTorn();
  const [activeTab, setActiveTab] = useState<"stats" | "ratio">("stats");
  const [combatData, setCombatData] = useState<PersonalStatsV2Data | null>(null);
  
  const stats = data?.battlestats?.data as unknown as TornBattleStats;

  // Fetch combat data for the Ratio tab
  useEffect(() => {
    if (!apiKey || activeTab !== "ratio") return;
    let active = true;

    fetchSection((client) => client.getUserPersonalStatsV2()).then((res) => {
      if (active && res?.data) {
        setCombatData(res.data as unknown as PersonalStatsV2Data);
      }
    });

    return () => {
      active = false;
    };
  }, [apiKey, fetchSection, activeTab]);

  if (!stats) {
    return (
      <Card title="Combat Data" icon={Swords}>
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
    <Card 
      title="Combat Readiness" 
      icon={activeTab === "stats" ? Swords : BarChart2}
      className="h-full flex flex-col"
    >
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("stats")}
          className={cn(
            "flex-1 px-4 py-2 text-xs font-mono uppercase font-bold transition-colors hover:bg-muted/50",
            activeTab === "stats" ? "bg-muted text-foreground border-b-2 border-primary" : "text-muted-foreground"
          )}
        >
          Stats
        </button>
        <button
          onClick={() => setActiveTab("ratio")}
          className={cn(
            "flex-1 px-4 py-2 text-xs font-mono uppercase font-bold transition-colors hover:bg-muted/50",
            activeTab === "ratio" ? "bg-muted text-foreground border-b-2 border-primary" : "text-muted-foreground"
          )}
        >
          Ratio
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {activeTab === "stats" ? (
          <>
            <div className="flex justify-between items-end mb-4 border-b border-border pb-2">
               <span className="text-xs sm:text-sm font-mono text-muted-foreground uppercase">Total Stats</span>
               <span className="text-lg sm:text-xl font-bold tabular-nums">{stats.total.toLocaleString()}</span>
            </div>

            {/* Radar Chart */}
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="var(--border)" strokeOpacity={0.6} />
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
              <ProgressBar label="Strength" value={stats.strength} max={maxStat} showValues={true} showMax={false} color="default" />
              <ProgressBar label="Defense" value={stats.defense} max={maxStat} showValues={true} showMax={false} color="default" />
              <ProgressBar label="Speed" value={stats.speed} max={maxStat} showValues={true} showMax={false} color="default" />
              <ProgressBar label="Dexterity" value={stats.dexterity} max={maxStat} showValues={true} showMax={false} color="default" />
            </div>
            
            {stats.strength_modifier !== 0 && (
               <div className="text-[10px] text-muted-foreground font-mono mt-2 pt-2 border-t border-border uppercase">
                 Modifiers active from perks/equipment
               </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            {!combatData ? (
              <div className="h-52 flex items-center justify-center text-xs font-mono text-muted-foreground animate-pulse uppercase">
                Retrieving combat history...
              </div>
            ) : (
              <div className="flex flex-col gap-6 pt-2">
                {/* Attacks Donut */}
                {(() => {
                  const att = combatData.personalstats.attacking.attacks;
                  const total = att.won + att.lost + att.stalemate;
                  const winRate = total > 0 ? (att.won / total) * 100 : 0;
                  const dataPie = [
                    { name: "Won", value: att.won, fill: COMBAT_COLORS.win },
                    { name: "Lost", value: att.lost, fill: COMBAT_COLORS.loss },
                    { name: "Stalemate", value: att.stalemate, fill: COMBAT_COLORS.other },
                  ];

                  return (
                    <div className="flex items-center gap-4 border-b border-border/50 pb-4">
                      <div className="h-32 w-32 relative flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={dataPie} cx="50%" cy="50%" innerRadius={35} outerRadius={50} stroke="none" dataKey="value" isAnimationActive={false}>
                              {dataPie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip content={<CombatTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                          <span className="text-sm font-bold">{winRate.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">Attacks</div>
                        <div className="text-lg font-bold">WIN RATIO</div>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">
                          W: {att.won.toLocaleString()} / L: {att.lost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Defends Donut */}
                {(() => {
                  const def = combatData.personalstats.attacking.defends;
                  const total = def.won + def.lost + def.stalemate;
                  const winRate = total > 0 ? (def.won / total) * 100 : 0;
                  const dataPie = [
                    { name: "Won", value: def.won, fill: COMBAT_COLORS.win },
                    { name: "Lost", value: def.lost, fill: COMBAT_COLORS.loss },
                    { name: "Stalemate", value: def.stalemate, fill: COMBAT_COLORS.other },
                  ];

                  return (
                    <div className="flex items-center gap-4">
                      <div className="h-32 w-32 relative flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={dataPie} cx="50%" cy="50%" innerRadius={35} outerRadius={50} stroke="none" dataKey="value" isAnimationActive={false}>
                              {dataPie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip content={<CombatTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                          <span className="text-sm font-bold">{winRate.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">Defends</div>
                        <div className="text-lg font-bold">SURVIVAL</div>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">
                          W: {def.won.toLocaleString()} / L: {def.lost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
