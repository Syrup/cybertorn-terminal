"use client";

import { useEffect, useState } from "react";
import { ArrowUpCircle, X } from "lucide-react";
import packageJson from "../../package.json";

const REPO_OWNER = "Syrup";
const REPO_NAME = "cybertorn-terminal";
const CURRENT_VERSION = packageJson.version;

function isNewerVersion(current: string, latest: string) {
  const c = current.split(".").map(Number);
  const l = latest.split(".").map(Number);
  
  for (let i = 0; i < 3; i++) {
    if ((l[i] || 0) > (c[i] || 0)) return true;
    if ((l[i] || 0) < (c[i] || 0)) return false;
  }
  return false;
}

export function UpdateChecker() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    async function checkUpdate() {
      try {

        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`);
        if (!response.ok) return;
        
        const data = await response.json();
        const latest = data.tag_name?.replace(/^v/, "");
        
        if (latest && isNewerVersion(CURRENT_VERSION, latest)) {
          setLatestVersion(latest);
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      }
    }

    checkUpdate();
  }, []);

  if (!latestVersion || isDismissed) return null;

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <ArrowUpCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
        <div className="flex-1 overflow-hidden relative">
          <p className="text-xs font-mono text-yellow-500 uppercase tracking-tight sm:truncate whitespace-nowrap sm:animate-none animate-marquee block sm:inline-block">
            <span className="font-bold mr-2">UPDATE AVAILABLE:</span>
            A new version (v{latestVersion}) is available. Current: v{CURRENT_VERSION}.
            <a 
              href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/latest`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline hover:text-yellow-400 transition-colors"
            >
              VIEW RELEASES
            </a>
          </p>
        </div>
      </div>
      <button 
        onClick={() => setIsDismissed(true)}
        className="text-yellow-500/50 hover:text-yellow-500 transition-colors p-1 flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
