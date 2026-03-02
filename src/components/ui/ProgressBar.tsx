import { cn } from "@/lib/utils";

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: "default" | "green" | "red" | "blue" | "orange";
  showValues?: boolean;
  showMax?: boolean;
  eta?: string | null;
}

export function ProgressBar({
  label,
  value,
  max,
  color = "default",
  showValues = true,
  showMax = true,
  eta,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  
  const colorMap = {
    default: "bg-primary",
    green: "bg-emerald-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-start mb-1 text-xs">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-muted-foreground uppercase">{label}</span>
          {eta && (
            <span className="text-[10px] font-mono text-muted-foreground">
              FULL {eta}
            </span>
          )}
        </div>
        {showValues && (
          <span className="font-mono tabular-nums">
            {value.toLocaleString()}
            {showMax && <span className="text-muted-foreground">/ {max.toLocaleString()}</span>}
          </span>
        )}
      </div>
      <div className="h-1.5 w-full bg-muted overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500", colorMap[color])} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
