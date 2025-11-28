import { cn } from "@/lib/utils";
import type { Repository } from "@/types/github";
import { getGrade } from "@/lib/securityGrading";

interface SecurityScoreCardProps {
  score?: number;
  repository: Repository | undefined;
  lastScan?: string;
  className?: string;
}

export const SecurityScoreCard = ({
  score,
  repository,
  lastScan,
  className,
}: SecurityScoreCardProps) => {
  // Normalize undefined score
  const hasScore = typeof score === "number";
  const safeScore = hasScore ? score : 0;

  const displayScore = hasScore ? safeScore : "--";
  const displayLastScan = lastScan ?? "Not yet scanned";

  // If no score, show "--"
  const { grade, color } = hasScore
    ? getGrade(safeScore)
    : { grade: "--", color: "text-muted-foreground" };

    console.log(hasScore);

  return (
    <div
      className={cn(
        "glass rounded-xl p-6 hover:bg-card/60 transition-all duration-300 animate-fade-in",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1 font-mono">
            {repository?.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            Last scan: <strong>{displayLastScan}</strong>
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className={cn("text-4xl font-bold", color)}>{grade}</div>
          <div className="text-xs text-muted-foreground">{displayScore}/100</div>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500",
            hasScore
              ? safeScore >= 80
                ? "bg-success"
                : safeScore >= 60
                ? "bg-warning"
                : "bg-destructive"
              : "bg-muted-foreground/40"
          )}
          style={{
            width: hasScore ? `${safeScore}%` : "0%",
          }}
        />
      </div>
    </div>
  );
};