"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface TornEvent {
  timestamp: number;
  event: string;
  seen: number;
}

interface EventsResponse {
  events: Record<string, TornEvent>;
  notifications: Record<string, TornEvent>;
}

export function EventsNotifications() {
  const { data } = useTorn();
  const eventsData = data?.events?.data as unknown as EventsResponse | null;

  if (!eventsData) {
    return (
      <Card title="Recent Events" icon={Bell}>
        <div className="p-4 text-muted-foreground text-sm font-mono">
          WAITING FOR DATA...
        </div>
      </Card>
    );
  }

  const events = eventsData.events ? Object.values(eventsData.events) as TornEvent[] : [];
  // Sort by timestamp desc
  const recentEvents = events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  const formatEventText = (value: string) =>
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .trim();

  return (
    <Card title="Recent Events" icon={Bell} className="h-full">
      <div className="max-h-[340px] overflow-y-auto p-0">
        <ul className="divide-y divide-border">
          {recentEvents.length === 0 ? (
            <li className="p-4 text-center text-xs text-muted-foreground font-mono">NO RECENT EVENTS</li>
          ) : (
            recentEvents.map((event) => (
              <li
                key={`${event.timestamp}-${event.event}`}
                className={cn("p-3 text-xs font-mono", event.seen === 0 ? "bg-muted/30" : "")}
              >
                <div className="flex justify-between items-start mb-1">
                   <span className="text-muted-foreground text-[10px] uppercase">
                     {new Date(event.timestamp * 1000).toLocaleString()}
                   </span>
                   {event.seen === 0 && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                </div>
                <div className="leading-snug break-words whitespace-pre-line">
                  {formatEventText(event.event)}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </Card>
  );
}
