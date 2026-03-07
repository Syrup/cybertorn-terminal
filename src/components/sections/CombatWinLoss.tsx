"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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

interface ChartPayload {
  name: string;
  value: number;
  fill: string;
}

const COLORS = {
  win: "var(--chart-2)",
  loss: "var(--destructive)",
  other: "var(--border)",
};

interface TooltipEntry {
  payload: ChartPayload;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipEntry[] }) => {
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

export function CombatWinLoss() {
  const { apiKey, fetchSection } = useTorn();
  const [data, setData] = useState<PersonalStatsV2Data | null>(null);

  useEffect(() => {
    if (!apiKey) return;
    let active = true;

    fetchSection((client) => client.getUserPersonalStatsV2()).then((res) => {
      if (active && res?.data) {
        setData(res.data as unknown as PersonalStatsV2Data);
      }
    });

    return () => {
      active = false;
    };
  }, [apiKey, fetchSection]);

  if (!data) {
    return (
      <Card title="Combat Win / Loss" icon={ShieldAlert}>
        <div className="p-4 text-muted-foreground text-sm font-mono">
          WAITING FOR DATA...
        </div>
      </Card>
    );
  }

  const attacking = data.personalstats?.attacking;

  if (!attacking || !attacking.attacks || !attacking.defends) {
    return (
      <Card title="Combat Win / Loss" icon={ShieldAlert}>
        <div className="p-4 text-muted-foreground text-sm font-mono text-center">
          NO COMBAT DATA AVAILABLE
        </div>
      </Card>
    );
  }

  const { attacks, defends } = attacking;

  const attacksWon = attacks.won ?? 0;
  const attacksLost = attacks.lost ?? 0;
  const attacksStalemate = attacks.stalemate ?? 0;
  
  const defendsWon = defends.won ?? 0;
  const defendsLost = defends.lost ?? 0;
  const defendsStalemate = defends.stalemate ?? 0;

  const totalAttacks = attacksWon + attacksLost + attacksStalemate;
  const attackWinRate = totalAttacks > 0 ? (attacksWon / totalAttacks) * 100 : 0;

  const totalDefends = defendsWon + defendsLost + defendsStalemate;
  const defendWinRate = totalDefends > 0 ? (defendsWon / totalDefends) * 100 : 0;

  const attackData = [
    { name: "Won", value: attacksWon, fill: COLORS.win },
    { name: "Lost", value: attacksLost, fill: COLORS.loss },
    { name: "Stalemate", value: attacksStalemate, fill: COLORS.other },
  ];

  const defendData = [
    { name: "Won", value: defendsWon, fill: COLORS.win },
    { name: "Lost", value: defendsLost, fill: COLORS.loss },
    { name: "Stalemate", value: defendsStalemate, fill: COLORS.other },
  ];

  return (
    <Card title="Combat Win / Loss" icon={ShieldAlert}>
      <div className="p-4 flex flex-col sm:flex-row items-center justify-around gap-6 h-full">
        
        {/* Attacks Donut */}
        <div className="flex flex-col items-center flex-1 w-full relative">
          <div className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-border w-full text-center pb-1">Attacks</div>
          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attackData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  stroke="none"
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {attackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-5">
              <span className="text-lg font-bold tabular-nums">{attackWinRate.toFixed(1)}%</span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase">Win</span>
            </div>
          </div>
          
          <div className="text-xs font-mono tabular-nums text-muted-foreground mt-2">
            W: {attacksWon.toLocaleString()} / L: {attacksLost.toLocaleString()}
          </div>
        </div>

        {/* Defends Donut */}
        <div className="flex flex-col items-center flex-1 w-full relative">
          <div className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-border w-full text-center pb-1">Defends</div>
          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defendData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  stroke="none"
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {defendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-5">
              <span className="text-lg font-bold tabular-nums">{defendWinRate.toFixed(1)}%</span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase">Win</span>
            </div>
          </div>

          <div className="text-xs font-mono tabular-nums text-muted-foreground mt-2">
            W: {defendsWon.toLocaleString()} / L: {defendsLost.toLocaleString()}
          </div>
        </div>

      </div>
    </Card>
  );
}
