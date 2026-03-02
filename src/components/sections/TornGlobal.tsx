"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { StatBlock } from "@/components/ui/StatBlock";

export function TornGlobal() {
  const { apiKey, fetchSection } = useTorn();
  const [tornStats, setTornStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiKey) return;
    let active = true;

    const loadTornStats = async () => {
      setLoading(true);
      try {
        const res = await fetchSection((client) => client.getTornStats());
        if (res?.data && active) setTornStats(res.data as Record<string, unknown>);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadTornStats();
    return () => {
      active = false;
    };
  }, [apiKey, fetchSection]);

  if (loading && !tornStats) {
    return (
      <Card title="Torn Global Stats" icon={Globe}>
        <div className="p-4 text-muted-foreground text-sm font-mono animate-pulse">
          LOADING GLOBAL DATA...
        </div>
      </Card>
    );
  }

  if (!tornStats) {
    return (
      <Card title="Torn Global Stats" icon={Globe}>
        <div className="p-4 text-muted-foreground text-sm font-mono">
          NO DATA LOADED
        </div>
      </Card>
    );
  }

  // tornStats might have a "stats" key or be flat depending on API response
  const statsObj = (tornStats as Record<string, unknown>).stats || tornStats;
  const entries = Object.entries(statsObj as Record<string, unknown>);

  return (
    <Card title="Torn Global Stats" icon={Globe} className="h-full">
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
          {entries.slice(0, 18).map(([key, value]) => (
            <StatBlock
              key={key}
              label={key.replace(/_/g, " ")}
              value={typeof value === "number" ? value.toLocaleString() : String(value ?? "-")}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
