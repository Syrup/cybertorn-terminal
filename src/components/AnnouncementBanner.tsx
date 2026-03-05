"use client";

import { useFlags } from "@/lib/feature-flags";
import { Megaphone, X } from "lucide-react";
import { useState, useEffect } from "react";

export function AnnouncementBanner() {
  const { showAnnouncement, announcementMessage } = useFlags();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // We use a local session storage to let users dismiss the announcement
    // but it will reappear if the message content changes or in a new session
    const dismissedKey = `dismissed_announcement_${encodeURIComponent(announcementMessage)}`;
    const isDismissed = sessionStorage.getItem(dismissedKey);
    
    setIsVisible(showAnnouncement && !!announcementMessage && !isDismissed);
  }, [showAnnouncement, announcementMessage]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    const dismissedKey = `dismissed_announcement_${encodeURIComponent(announcementMessage)}`;
    sessionStorage.setItem(dismissedKey, "true");
    setIsVisible(false);
  };

  return (
    <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-500">
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <Megaphone className="h-4 w-4 text-primary flex-shrink-0" />
        <div className="flex-1 overflow-hidden relative">
          <p className="text-xs font-mono text-primary uppercase tracking-tight sm:truncate whitespace-nowrap md:whitespace-normal block sm:inline-block animate-marquee sm:animate-none">
            <span className="font-bold mr-2">BROADCAST:</span>
            {announcementMessage}
          </p>
        </div>
      </div>
      <button 
        onClick={handleDismiss}
        className="text-primary/50 hover:text-primary transition-colors p-1 flex-shrink-0"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
