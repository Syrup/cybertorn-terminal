"use client";

import { useTorn } from "@/lib/torn-context";
import { useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ProfileOverview } from "@/components/sections/ProfileOverview";
import { BattleStats } from "@/components/sections/BattleStats";
import { MoneyNetworth } from "@/components/sections/MoneyNetworth";
import { CooldownsTravel } from "@/components/sections/CooldownsTravel";
import { Equipment } from "@/components/sections/Equipment";
import { FactionInfo } from "@/components/sections/FactionInfo";
import { AttacksCrimes } from "@/components/sections/AttacksCrimes";
import { MarketSection } from "@/components/sections/MarketSection";
import { StocksProperties } from "@/components/sections/StocksProperties";
import { SkillsEducation } from "@/components/sections/SkillsEducation";
import { EventsNotifications } from "@/components/sections/EventsNotifications";
import { PersonalStats } from "@/components/sections/PersonalStats";
import { TornGlobal } from "@/components/sections/TornGlobal";
import { RefreshCw } from "lucide-react";

export default function Home() {
  const { data, isLoading, error, loadDashboard, lastUpdated, apiKey } = useTorn();
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!data || !apiKey) return;

    refreshInterval.current = setInterval(() => {
      loadDashboard();
    }, 15000);

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [data, apiKey, loadDashboard]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 p-3 md:p-4 lg:p-6 space-y-4 overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-border">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold tracking-tighter uppercase font-mono">COMMAND CENTER</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
              <span>TORN CITY API INTERFACE</span>
              {lastUpdated && (
                <span className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              {isLoading && <span className="animate-pulse text-yellow-500">UPDATING...</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ApiKeyInput />
            <ThemeToggle />
          </div>
        </header>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-3 font-mono text-xs">
            ERROR: {error}
          </div>
        )}

        {/* Main dashboard grid */}
        <div className="space-y-4">
          {/* Row 1: Profile + Battle Stats + Finance */}
          <section id="profile" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <ProfileOverview />
            <div id="battle-stats">
              <BattleStats />
            </div>
            <div id="money">
              <MoneyNetworth />
            </div>
          </section>

          {/* Row 2: Cooldowns + Faction + Events */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div id="cooldowns">
              <CooldownsTravel />
            </div>
            <div id="faction">
              <FactionInfo />
            </div>
            <div id="events">
              <EventsNotifications />
            </div>
          </section>

          {/* Row 3: Attacks/Crimes + Market + Assets */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div id="crimes">
              <AttacksCrimes />
            </div>
            <div id="market">
              <MarketSection />
            </div>
            <div id="properties">
              <StocksProperties />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div id="equipment">
              <Equipment />
            </div>
            <div id="education">
              <SkillsEducation />
            </div>
            <TornGlobal />
          </section>

          {/* Row 5: Personal Stats (full width) */}
          <section id="personal-stats">
            <PersonalStats />
          </section>
        </div>
      </main>
    </div>
  );
}
