"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { Clock, Plane } from "lucide-react";
import { TornCooldownsResponse, TornProfile } from "@/types/torn-schema";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CooldownItemProps {
  label: string;
  seconds: number;
  color?: string;
  formatDuration: (seconds: number) => string;
  secondsLeft: (seconds: number) => number;
}

function CooldownItem({ label, seconds, color, formatDuration, secondsLeft }: CooldownItemProps) {
  const remaining = secondsLeft(seconds);

  return (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
      <span className="text-sm font-mono uppercase text-muted-foreground">{label}</span>
      <span className={cn("font-mono font-bold tabular-nums", remaining > 0 ? color || "text-foreground" : "text-muted-foreground/50")}>
        {remaining > 0 ? formatDuration(remaining) : "--"}
      </span>
    </div>
  );
}

export function CooldownsTravel() {
  const { data } = useTorn();
  const result = data?.cooldowns?.data as unknown as TornCooldownsResponse;
  const profile = data?.profile?.data as unknown as TornProfile | undefined;
  const [now, setNow] = useState(() => Date.now() / 1000);
  const [dataTimestamp, setDataTimestamp] = useState<number | null>(null);

  useEffect(() => {
    if (result) {
      setDataTimestamp(Date.now() / 1000);
    }
  }, [result]);

  const secondsLeft = (seconds: number) => {
    const elapsed = dataTimestamp ? Math.floor(now - dataTimestamp) : 0;
    return Math.max(0, seconds - Math.max(0, elapsed));
  };

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!result) {
    return (
      <Card title="Timers" icon={Clock}>
        <div className="p-4 text-muted-foreground text-sm font-mono">
          WAITING FOR DATA...
        </div>
      </Card>
    );
  }

  const { cooldowns, travel } = result;

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return "0m 00s";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const parts = [
      days > 0 ? `${days}d` : null,
      hours > 0 ? `${hours}h` : null,
      minutes > 0 || days > 0 || hours > 0 ? `${minutes}m` : "0m",
      `${String(secs).padStart(2, "0")}s`,
    ].filter(Boolean);
    return parts.join(" ");
  };

  const travelRemaining = secondsLeft(travel.time_left);

  return (
    <Card title="Timers & Travel" icon={Clock} className="h-full">
      <div className="p-4">
        <div className="mb-4">
          <CooldownItem label="Drug" seconds={cooldowns.drug} color="text-red-500" formatDuration={formatDuration} secondsLeft={secondsLeft} />
          <CooldownItem label="Booster" seconds={cooldowns.booster} color="text-blue-500" formatDuration={formatDuration} secondsLeft={secondsLeft} />
          <CooldownItem label="Medical" seconds={cooldowns.medical} color="text-green-500" formatDuration={formatDuration} secondsLeft={secondsLeft} />
        </div>

        {profile && profile.status.state !== "Okay" && profile.status.until > 0 && (() => {
          const remaining = Math.max(0, profile.status.until - Math.floor(now));
          const stateLabel = profile.status.state.toUpperCase();
          const stateColor = profile.status.state === "Hospital" ? "text-orange-500" : profile.status.state === "Jail" ? "text-red-500" : "text-yellow-500";
          return remaining > 0 ? (
            <div className="bg-muted/50 p-3 border border-border mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className={cn("text-xs font-mono uppercase font-bold", stateColor)}>{stateLabel}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{profile.status.description}</span>
              </div>
              <div className={cn("text-xl font-bold font-mono tabular-nums text-center", stateColor)}>
                {formatDuration(remaining)}
              </div>
            </div>
          ) : null;
        })()}

        {travelRemaining > 0 ? (
           <div className="bg-muted/50 p-3 border border-border mt-2">
             <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase text-muted-foreground">
               <Plane className="h-3 w-3" />
               Traveling to {travel.destination}
             </div>
             <div className="text-xl font-bold font-mono tabular-nums text-center">
              {formatDuration(travelRemaining)}
             </div>
           </div>
        ) : (
          <div className="text-xs text-muted-foreground font-mono text-center pt-2">
            NOT TRAVELING
          </div>
        )}
      </div>
    </Card>
  );
}
