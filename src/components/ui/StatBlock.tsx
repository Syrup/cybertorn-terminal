import { cn } from "@/lib/utils";

interface StatBlockProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatBlock({ label, value, className }: StatBlockProps) {
  return (
    <div className={cn("p-2 border border-border bg-card", className)}>
      <div className="text-muted-foreground text-xxs uppercase tracking-wider mb-1">{label}</div>
      <div className="font-mono text-sm font-medium tabular-nums break-words">
        {value}
      </div>
    </div>
  );
}
