"use client";

import { useFlags } from "@/lib/feature-flags";
import { Construction } from "lucide-react";

export function MaintenanceOverlay() {
  const { maintenanceMode, maintenanceMessage } = useFlags();

  if (!maintenanceMode) {
    return null;
  }

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
          SYSTEM OFFLINE
        </div>
      </div>
    </div>
  );
}
