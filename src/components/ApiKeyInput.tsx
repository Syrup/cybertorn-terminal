"use client";

import { useState } from "react";
import { useTorn } from "@/lib/torn-context";
import { Key, Play } from "lucide-react";

export function ApiKeyInput() {
  const { apiKey, setApiKey, loadDashboard, isLoading } = useTorn();
  const [inputKey, setInputKey] = useState<string | null>(null);

  const handleSave = () => {
    const nextKey = (inputKey ?? apiKey).trim();
    if (!nextKey) return;
    localStorage.setItem("torn_api_key", nextKey);
    setApiKey(nextKey);
    loadDashboard();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="password"
          value={inputKey ?? apiKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="ENTER API KEY"
          className="h-9 w-48 bg-muted border border-border pl-9 pr-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50 uppercase"
        />
      </div>
      <button
        type="button"
        onClick={handleSave}
        disabled={isLoading || !(inputKey ?? apiKey)}
        className="h-9 px-3 bg-primary text-primary-foreground text-xs font-bold uppercase hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
      >
        {isLoading ? (
          <span className="animate-pulse">LOADING...</span>
        ) : (
          <>
            <Play className="h-3 w-3" />
            LOAD
          </>
        )}
      </button>
      <span className="text-[10px] text-muted-foreground font-mono uppercase w-full sm:w-auto sm:ml-1">
        Key is stored locally on this device only.
      </span>
    </div>
  );
}
