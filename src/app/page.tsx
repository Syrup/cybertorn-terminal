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
import { ItemMarketSection } from "@/components/sections/ItemMarketSection";
import { StocksProperties } from "@/components/sections/StocksProperties";
import { SkillsEducation } from "@/components/sections/SkillsEducation";
import { EventsNotifications } from "@/components/sections/EventsNotifications";
import { PersonalStats } from "@/components/sections/PersonalStats";
import { TornGlobal } from "@/components/sections/TornGlobal";
import { RefreshCw, Github } from "lucide-react";
import { MaintenanceOverlay } from "@/components/MaintenanceOverlay";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { UpdateChecker } from "@/components/UpdateChecker";
import { useFlags } from "@/lib/feature-flags";

export default function Home() {
  const { data, isLoading, error, loadDashboard, lastUpdated, apiKey } = useTorn();
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const { showGithubButton, showThemeToggle, maintenanceMode } = useFlags();

  useEffect(() => {
    if (!data || !apiKey || maintenanceMode) return;

    refreshInterval.current = setInterval(() => {
      loadDashboard();
    }, 30000);

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [data, apiKey, loadDashboard, maintenanceMode]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AnnouncementBanner />
      <UpdateChecker />
      
      {maintenanceMode ? (
        <MaintenanceOverlay />
      ) : (
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 min-w-0 p-2 sm:p-4 lg:p-6 space-y-4 overflow-x-hidden">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pb-3 border-b border-border">
              <div className="flex-1 min-w-0 w-full">
                <h1 className="text-lg sm:text-xl font-bold tracking-tighter uppercase font-mono truncate">CYBERTORN TERMINAL</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs text-muted-foreground font-mono">
                  <span className="whitespace-nowrap">COMMAND CENTER // ACCESS GRANTED</span>
                  {lastUpdated && (
                    <span className="inline-flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                  {isLoading && <span className="animate-pulse text-yellow-500 whitespace-nowrap">UPDATING...</span>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto">
                <ApiKeyInput />
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {showThemeToggle && <ThemeToggle />}
                  {showGithubButton && (
                    <a
                      href="https://github.com/Syrup/torn-dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 sm:h-9 sm:w-9 inline-flex items-center justify-center border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </header>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-3 font-mono text-xs">
                ERROR: {error}
              </div>
            )}

            {/* Main dashboard grid */}
            <div className="space-y-4">
              {/* Row 1: Essential Real-time Data (The "Right Now" section) */}
              <section id="essential" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <ProfileOverview />
                <div id="cooldowns">
                  <CooldownsTravel />
                </div>
                <div id="events">
                  <EventsNotifications />
                </div>
              </section>

              {/* Row 2: Finance, Faction & Combat Readiness */}
              <section id="status" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div id="money">
                  <MoneyNetworth />
                </div>
                <div id="faction">
                  <FactionInfo />
                </div>
                <div id="battle-stats">
                  <BattleStats />
                </div>
              </section>

              {/* Row 3: Progression & Performance */}
              <section id="progression" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div id="crimes">
                  <AttacksCrimes />
                </div>
                <div id="education">
                  <SkillsEducation />
                </div>
                <div id="market">
                  <ItemMarketSection />
                </div>
              </section>

              {/* Row 4: Assets & Economy */}
              <section id="assets" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div id="equipment">
                  <Equipment />
                </div>
                <div id="properties">
                  <StocksProperties />
                </div>
                <div id="market">
                  <MarketSection />
                </div>
              </section>

              {/* Bottom: Global & Long-term Reference */}
              <section id="global" className="grid grid-cols-1 gap-4">
                <TornGlobal />
              </section>

              <section id="personal-stats">
                <PersonalStats />
              </section>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
