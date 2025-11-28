import { cn } from "@/lib/utils";
import { getGrade } from "@/lib/securityGrading";

interface SecurityScorePanelProps {
  score: number;
  lastScan: string;
}

export const SecurityScorePanel = ({ score, lastScan }: SecurityScorePanelProps) => {
  const { grade, color } = getGrade(score);

  return (
    <div className="glass rounded-xl p-5 flex flex-col gap-4 animate-fade-in">

      {/* ROW */}
      <div className="flex items-center justify-between gap-8">

        {/* LEFT — Grade */}
        <div className="flex items-center gap-4 min-w-[120px]">
          <div className={cn("text-5xl font-bold", color)}>{grade}</div>
          <div className="text-muted-foreground text-sm">{score}/100</div>
        </div>

        {/* MIDDLE — Progress Bar */}
        <div className="flex-1">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                score >= 80
                  ? "bg-success"
                  : score >= 60
                  ? "bg-warning"
                  : "bg-destructive"
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* RIGHT — Last Scanned */}
        <div className="text-right min-w-[140px]">
          <p className="text-xs text-muted-foreground">Last scanned</p>
          <p className="text-sm font-medium text-foreground">{lastScan}</p>
        </div>
      </div>
    </div>
  );
};