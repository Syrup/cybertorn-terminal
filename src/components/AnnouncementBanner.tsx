"use client";

import { useFlags } from "@/lib/feature-flags";
import { Megaphone, X } from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export function AnnouncementBanner() {
  const { showAnnouncement, announcementMessage } = useFlags();
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {

    const checkDismissed = () => {
      const dismissedKey = `dismissed_announcement_${encodeURIComponent(announcementMessage)}`;
      const dismissed = sessionStorage.getItem(dismissedKey);
      setIsDismissed(!!dismissed);
    };
    checkDismissed();
  }, [announcementMessage]);

  const isVisible = showAnnouncement && !!announcementMessage && !isDismissed;

  if (!isVisible) return null;

  const handleDismiss = () => {
    const dismissedKey = `dismissed_announcement_${encodeURIComponent(announcementMessage)}`;
    sessionStorage.setItem(dismissedKey, "true");
    setIsDismissed(true);
  };

  return (
    <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-500">
      <div className="flex items-start sm:items-center gap-3 flex-1">
        <Megaphone className="h-4 w-4 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1 text-xs font-mono text-primary uppercase tracking-tight break-words flex flex-wrap items-center gap-x-2">
          <span className="font-bold">BROADCAST:</span>
          <span className="inline-flex flex-wrap items-center gap-x-1 [&>p]:inline [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80 transition-colors [&_strong]:font-bold [&_em]:italic [&_code]:bg-primary/20 [&_code]:px-1 [&_code]:rounded-sm">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                a: (props) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { node, ...rest } = props;
                  return <a target="_blank" rel="noopener noreferrer" {...rest} />;
                },
              }}
            >
              {announcementMessage}
            </ReactMarkdown>
          </span>
        </div>
      </div>
      <button 
        onClick={handleDismiss}
        className="text-primary/50 hover:text-primary transition-colors p-1 flex-shrink-0 -mt-1 sm:mt-0"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
