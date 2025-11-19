import { cn } from "@/lib/utils";

interface SecurityScoreCardProps {
  score: number;
  repository: string;
  lastScan: string;
  className?: string;
}

export const SecurityScoreCard = ({ score, repository, lastScan, className }: SecurityScoreCardProps) => {
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A", color: "text-success" };
    if (score >= 80) return { grade: "B", color: "text-primary" };
    if (score >= 70) return { grade: "C", color: "text-warning" };
    if (score >= 60) return { grade: "D", color: "text-warning" };
    return { grade: "F", color: "text-destructive" };
  };

  const { grade, color } = getGrade(score);

  return (
    <div className={cn("glass rounded-xl p-6 hover:bg-card/60 transition-all duration-300 animate-fade-in", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1 font-mono">{repository}</h3>
          <p className="text-xs text-muted-foreground">Last scan: {lastScan}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className={cn("text-4xl font-bold", color)}>{grade}</div>
          <div className="text-xs text-muted-foreground">{score}/100</div>
        </div>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500", 
            score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};