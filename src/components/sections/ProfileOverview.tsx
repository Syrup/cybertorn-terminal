"use client";

import { useEffect, useState } from "react";
import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatBlock } from "@/components/ui/StatBlock";
import { User } from "lucide-react";

import { TornProfile, TornBars, TornBar } from "@/types/torn-schema";

export function ProfileOverview() {
  const { data } = useTorn();
  const profile = data?.profile?.data as unknown as TornProfile;
  const bars = data?.bars?.data as unknown as TornBars;
  const [now, setNow] = useState(() => Date.now() / 1000);
  const barsTimestamp = bars?.server_time ?? null;

  useEffect(() => {
    if (!bars) return;
    const interval = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(interval);
  }, [bars]);

  if (!profile) {
    return (
      <Card title="Profile" icon={User} className="h-full min-h-[200px]">
        <div className="p-4 text-muted-foreground text-sm font-mono">
          WAITING FOR DATA...
        </div>
      </Card>
    );
  }

  const statusColor = profile.status.state === "Okay" ? "text-green-500" : "text-yellow-500";

  const formatEta = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "0m 00s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${secs.toString().padStart(2, "0")}s`;
  };

  const getEta = (bar: TornBar) => {
    if (bar.current >= bar.maximum) return null;
    const elapsed = barsTimestamp ? Math.max(0, now - barsTimestamp) : 0;
    let remainingSec: number | null = null;
    if (bar.fulltime) {
      remainingSec = Math.max(0, bar.fulltime - elapsed);
    } else if (bar.increment && bar.interval) {
      const remaining = Math.max(0, bar.maximum - bar.current);
      const ticks = Math.ceil(remaining / bar.increment);
      remainingSec = Math.max(0, ticks * bar.interval - elapsed);
    }
    if (remainingSec === null || remainingSec <= 0) return null;
    const fullAt = new Date(Date.now() + remainingSec * 1000);
    const clock = fullAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${formatEta(remainingSec)} (${clock})`;
  };

  const renderStatusDetails = (value: string) => {
    const parts: Array<string | React.ReactElement> = [];
    const regex = /<a\s+href\s*=\s*"([^"]+)"\s*>(.*?)<\/a>/gi;
    let lastIndex = 0;
    let match: RegExpExecArray | null = regex.exec(value);

    while (match) {
      const [full, href, text] = match;
      const start = match.index;

      if (start > lastIndex) {
        parts.push(value.slice(lastIndex, start));
      }

      parts.push(
        <a
          key={`${href}-${start}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          {text}
        </a>
      );

      lastIndex = start + full.length;
      match = regex.exec(value);
    }

    if (lastIndex < value.length) {
      parts.push(value.slice(lastIndex));
    }

    if (parts.length === 0) return value;
    return parts.map((part) =>
      typeof part === "string"
        ? part.replace(/<[^>]*>/g, "")
        : <span key={part.key}>{part}</span>
    );
  };

  return (
    <Card title="Profile Overview" icon={User} className="h-full">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{profile.name} <span className="text-muted-foreground text-sm font-mono">[{profile.player_id}]</span></h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-mono uppercase font-bold ${statusColor}`}>
                {profile.status.state}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                 • {renderStatusDetails(profile.status.details)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-muted-foreground">LEVEL</div>
            <div className="text-2xl font-bold leading-none">{profile.level}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <StatBlock label="Age" value={`${profile.age} days`} />
           <StatBlock label="Rank" value={profile.rank} />
           <StatBlock label="Job" value={profile.job.job} />
           <StatBlock label="Faction" value={profile.faction.faction_name} />
        </div>

        {bars && (
          <div className="space-y-3 pt-2 border-t border-border">
            <ProgressBar 
              label="Life" 
              value={bars.life.current} 
              max={bars.life.maximum} 
              color="red" 
              eta={getEta(bars.life)}
            />
            <ProgressBar 
              label="Energy" 
              value={bars.energy.current} 
              max={bars.energy.maximum} 
              color="green" 
              eta={getEta(bars.energy)}
            />
            <ProgressBar 
              label="Nerve" 
              value={bars.nerve.current} 
              max={bars.nerve.maximum} 
              color="orange" 
              eta={getEta(bars.nerve)}
            />
            <ProgressBar 
              label="Happy" 
              value={bars.happy.current} 
              max={bars.happy.maximum} 
              color="blue" 
              eta={getEta(bars.happy)}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
