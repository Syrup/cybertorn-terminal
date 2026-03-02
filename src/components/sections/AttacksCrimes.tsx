"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { Target } from "lucide-react";
import { StatBlock } from "@/components/ui/StatBlock";

interface TornAttack {
  code: string;
  timestamp_started: number;
  timestamp_ended: number;
  attacker_id: number;
  attacker_name: string;
  defender_id: number;
  defender_name: string;
  result: string;
  respect_gain: number;
}

interface CriminalRecord {
  total: number;
  [key: string]: number;
}

export function AttacksCrimes() {
  const { data } = useTorn();
  const attacksData = data?.attacks?.data as unknown as { attacks: Record<string, TornAttack> } | null;
  const crimesData = data?.crimes?.data as unknown as { criminalrecord: CriminalRecord } | null;
  const attacks = attacksData?.attacks;
  const crimes = crimesData?.criminalrecord;

  if (!attacks && !crimes) {
    return (
      <Card title="Combat & Crimes" icon={Target}>
        <div className="p-4 text-muted-foreground text-sm font-mono">
          WAITING FOR DATA...
        </div>
      </Card>
    );
  }

  // Attacks is object: { [id]: { ... } }
  const recentAttacks: TornAttack[] = attacks ? Object.values(attacks).sort((a, b) => b.timestamp_ended - a.timestamp_ended).slice(0, 5) : [];

  // Crimes (criminalrecord) is object: { total: number, selling_illegal_products: number, ... }
  const totalCrimes = crimes?.total || 0;
  
  const resultColor = (result: string) => {
    switch(result) {
      case "Attacked": return "text-green-500";
      case "Hospitalized": return "text-green-500";
      case "Mugged": return "text-green-500";
      case "Lost": return "text-red-500";
      case "Escape": return "text-yellow-500";
      case "Stalemate": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

  return (
    <Card title="Activity Log" icon={Target} className="h-full">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h3 className="text-xs font-mono uppercase text-muted-foreground mb-2">Criminal Record</h3>
          <div className="grid grid-cols-2 gap-2">
            <StatBlock label="Total Crimes" value={totalCrimes.toLocaleString()} />
            {/* Can add success rate if available, but usually it's just raw counts */}
            <StatBlock label="Offenses" value={Object.keys(crimes || {}).length - 1} /> 
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[200px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-muted/30 sticky top-0 backdrop-blur-sm">
              <tr>
                <th className="p-2 font-normal text-muted-foreground">OPPONENT</th>
                <th className="p-2 font-normal text-muted-foreground text-center">RESULT</th>
                <th className="p-2 font-normal text-muted-foreground text-right">RESPECT</th>
              </tr>
            </thead>
            <tbody>
              {recentAttacks.map((attack) => (
                <tr key={attack.code} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                  <td className="p-2">
                    <div className="font-medium truncate max-w-[100px]">{attack.defender_name || attack.attacker_name}</div>
                    <div className="text-[10px] text-muted-foreground">{new Date(attack.timestamp_ended * 1000).toLocaleDateString()}</div>
                  </td>
                  <td className={`p-2 text-center font-bold uppercase ${resultColor(attack.result)}`}>
                    {attack.result}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {attack.respect_gain?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              ))}
              {recentAttacks.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">NO RECENT ATTACKS</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
