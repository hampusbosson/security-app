import { cn } from "@/lib/utils";

interface SecurityScorePanelProps {
  score: number;
  lastScan: string;
}

export const SecurityScorePanel = ({ score, lastScan }: SecurityScorePanelProps) => {
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A", color: "text-success" };
    if (score >= 80) return { grade: "B", color: "text-primary" };
    if (score >= 70) return { grade: "C", color: "text-warning" };
    if (score >= 60) return { grade: "D", color: "text-warning" };
    return { grade: "F", color: "text-destructive" };
  };

  const { grade, color } = getGrade(score);

  return (
    <div className="glass rounded-2xl p-8 animate-fade-in hover:bg-card/60 transition-all duration-300">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Security Score</p>
          <div className={cn("text-8xl font-bold mb-2", color)}>{grade}</div>
          <div className="text-2xl text-muted-foreground">{score}/100</div>
        </div>

        <div className="w-full max-w-md">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive"
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">Last scanned</p>
          <p className="text-sm font-medium text-foreground">{lastScan}</p>
        </div>
      </div>
    </div>
  );
};