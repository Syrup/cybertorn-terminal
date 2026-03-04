"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatBlock } from "@/components/ui/StatBlock";
import dayjs from "dayjs";

interface WorkStats {
  manual_labor: number;
  intelligence: number;
  endurance: number;
}

interface WeaponExp {
  rank: number;
  name: string;
}

interface EducationData {
  education_current: number;
  education_timeleft: number;
  workstats: WorkStats | null;
  weaponexp: Record<string, WeaponExp> | null;
}

export function SkillsEducation() {
  const { apiKey, fetchSection } = useTorn();
  const [eduData, setEduData] = useState<EducationData | null>(null);
  const [now, setNow] = useState(() => Date.now() / 1000);
  const [dataTimestamp, setDataTimestamp] = useState<number | null>(null);

  useEffect(() => {
    if (!apiKey) return;
    fetchSection((client) => client.getUserEducation()).then((res) => {
      if (res?.data) {
        setEduData(res.data as unknown as EducationData);
        setDataTimestamp(Date.now() / 1000);
      }
    });
  }, [apiKey, fetchSection]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!eduData) {
    return (
      <Card title="Skills & Education" icon={GraduationCap}>
        <div className="p-4 text-muted-foreground text-sm font-mono">
          WAITING FOR DATA...
        </div>
      </Card>
    );
  }

  const { education_current, education_timeleft, workstats, weaponexp } = eduData;

  const secondsLeft = (seconds: number) => {
    const elapsed = dataTimestamp ? Math.floor(now - dataTimestamp) : 0;
    return Math.max(0, seconds - Math.max(0, elapsed));
  };

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return "0m 0s";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const parts = [
      days > 0 ? `${days}d` : null,
      hours > 0 ? `${hours}h` : null,
      minutes > 0 || days > 0 || hours > 0 ? `${minutes}m` : "0m",
      `${secs}s`,
    ].filter(Boolean);
    return parts.join(" ");
  };

  /** Estimated completion time with day name in European format */
  const formatEstimate = (remainingSeconds: number) => {
    return dayjs().add(remainingSeconds, "second").format("ddd, DD.MM.YYYY HH:mm");
  };

  const timeLeft = secondsLeft(education_timeleft);
  // education_current might be 0 if none.
  
  return (
    <Card title="Education & Work" icon={GraduationCap} className="h-full">
      <div className="p-4 space-y-4">
        {education_current !== 0 ? (
           <div className="bg-muted/30 p-3 border border-border">
             <div className="text-xs text-muted-foreground font-mono uppercase mb-1">Current Course</div>
             <div className="font-bold text-sm mb-2">{education_current}</div> {/* Usually returns ID or Name? Usually ID, need lookup or it returns name if resolved. Actually returns ID usually. Let's assume ID for now. */}
            <div className="text-xs font-mono tabular-nums text-muted-foreground flex items-center gap-2 flex-wrap">
              <span>Time Left: {formatDuration(timeLeft)}</span>
              {timeLeft > 0 && (
                <span className="text-[10px] opacity-70">
                  (est. {formatEstimate(timeLeft)})
                </span>
              )}
            </div>
           </div>
        ) : (
           <div className="text-xs text-muted-foreground font-mono uppercase text-center p-2 border border-border bg-muted/10">
             No Active Course
           </div>
        )}

        {workstats && (
          <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 border-b border-border pb-1">Work Stats</h4>
            <div className="grid grid-cols-3 gap-2">
              <StatBlock label="MAN" value={workstats.manual_labor.toLocaleString()} />
              <StatBlock label="INT" value={workstats.intelligence.toLocaleString()} />
              <StatBlock label="END" value={workstats.endurance.toLocaleString()} />
            </div>
          </div>
        )}

        {weaponexp && (
           <div>
             <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 border-b border-border pb-1">Weapon Experience</h4>
             <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
               {Object.entries(weaponexp).map(([weapon, exp]) => (
                 <div key={weapon}>
                   <ProgressBar 
                     label={weapon.replace(/_/g, " ")} 
                     value={exp.rank}
                     max={100} 
                     showValues={true}
                     color="blue"
                   />
                 </div>
               ))}
             </div>
           </div>
        )}
      </div>
    </Card>
  );
}
