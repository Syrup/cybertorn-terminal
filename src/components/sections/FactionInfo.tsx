"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { Users } from "lucide-react";
import { StatBlock } from "@/components/ui/StatBlock";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface FactionData {
  ID: number;
  name: string;
  tag: string;
  tag_image: string;
  leader: number;
  co_leader: number;
  respect: number;
  age: number;
  capacity: number;
  members: number | Record<string, unknown>;
  best_chain: number;
  territory: Record<string, unknown>;
  chain: {
    current: number;
    maximum: number;
    timeout: number;
    modifier: number;
    cooldown: number;
  };
}

interface ProfileFaction {
  faction_id?: number;
  faction_name?: string;
}

export function FactionInfo() {
  const { data } = useTorn();
  const faction = data?.faction?.data as unknown as FactionData | null;
  const profileFaction = (data?.profile?.data as Record<string, unknown> | null)?.faction as ProfileFaction | undefined;

  const hasFaction = profileFaction ? (profileFaction.faction_id ?? 0) > 0 : undefined;

  if (hasFaction === false) {
    return (
      <Card title="Faction" icon={Users}>
        <div className="p-4 text-muted-foreground text-sm font-mono text-center">
          NOT IN A FACTION
        </div>
      </Card>
    );
  }

  if (!faction) {
    return (
      <Card title="Faction" icon={Users}>
        <div className="p-4 text-muted-foreground text-sm font-mono">
          WAITING FOR DATA...
        </div>
      </Card>
    );
  }

  if (faction.ID === 0 || !faction.name) {
    return (
      <Card title="Faction" icon={Users}>
        <div className="p-4 text-muted-foreground text-sm font-mono text-center">
          NOT IN A FACTION
        </div>
      </Card>
    );
  }

  const chain = faction.chain;

  return (
    <Card title="Faction Status" icon={Users}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold font-mono uppercase">{faction.name}</h3>
          <span className="text-xs text-muted-foreground font-mono">ID: {faction.ID}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <StatBlock label="Respect" value={faction.respect.toLocaleString()} />
           <StatBlock label="Members" value={(faction.members && typeof faction.members === "object") ? Object.keys(faction.members).length : (faction.members || 0)} />
           <StatBlock label="Territory" value={Object.keys(faction.territory || {}).length} />
           <StatBlock label="Chain" value={chain?.current || 0} />
        </div>

        {chain && chain.current > 0 && (
           <div className="pt-2 border-t border-border">
             <div className="flex justify-between text-xs font-mono uppercase text-muted-foreground mb-1">
               <span>Chain Status</span>
               <span>{chain.current} / {chain.maximum}</span>
             </div>
             <ProgressBar
               label="Timeout"
               value={chain.timeout}
               max={chain.cooldown}
               color="orange"
               showValues={true}
             />
             <div className="text-xs text-right mt-1 font-mono text-muted-foreground">
               Cooldown: {chain.cooldown}s | Multiplier: x{chain.modifier}
             </div>
           </div>
        )}
      </div>
    </Card>
  );
}
