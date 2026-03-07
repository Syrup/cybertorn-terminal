"use client";

import { useFlags } from "@/lib/feature-flags";
import { Construction } from "lucide-react";
import { useState, useEffect } from "react";

export function MaintenanceOverlay() {
  const { maintenanceMode, maintenanceMessage, maintenanceStartTime } = useFlags();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!maintenanceMode) return;

    let startTime = maintenanceStartTime;

    if (!startTime) {
      let startStr = sessionStorage.getItem("maintenance_start");
      if (!startStr) {
        startStr = Date.now().toString();
        sessionStorage.setItem("maintenance_start", startStr);
      }
      startTime = parseInt(startStr, 10);
    }

    const updateTimer = () => {

      let normalizedStartTime = startTime as number;
      if (normalizedStartTime < 10000000000) {
        normalizedStartTime *= 1000;
      }
      
      setElapsed(Math.max(0, Math.floor((Date.now() - normalizedStartTime) / 1000)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [maintenanceMode, maintenanceStartTime]);

  if (!maintenanceMode) {
    return null;
  }

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    
    return parts.join(" ");
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 border border-yellow-500/50 bg-yellow-500/10 flex items-center justify-center">
            <Construction className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold font-mono uppercase tracking-wider text-yellow-500">
            MAINTENANCE MODE
          </h1>
          <div className="h-px w-24 mx-auto bg-yellow-500/50" />
          <p className="text-sm font-mono text-muted-foreground leading-relaxed">
            {maintenanceMessage}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-yellow-500/70">
          <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          {formatTime(elapsed)} SINCE MAINTENANCE
        </div>
      </div>
    </div>
  );
}
