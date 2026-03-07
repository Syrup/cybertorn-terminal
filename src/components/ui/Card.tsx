import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function Card({ title, icon: Icon, children, className, action }: CardProps) {
  return (
    <div className={cn("bg-card border border-border flex flex-col h-full", className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
        </div>
        {action && <div className="text-xs">{action}</div>}
      </div>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
