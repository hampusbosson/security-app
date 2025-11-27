import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, GitPullRequest } from "lucide-react";
import type { PullRequest } from "@/types/github";
import { cn } from "@/lib/utils";

interface PullRequestsPanelProps {
  pullRequests: PullRequest[];
}

const statusColors = {
  Merged: "bg-success/10 text-success border-success/20",
  Open: "bg-primary/10 text-primary border-primary/20",
  Closed: "bg-muted text-muted-foreground border-border",
};

export const PullRequestsPanel = ({ pullRequests }: PullRequestsPanelProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-foreground mb-4">Auto-Fix Pull Requests</h2>

      <div className="space-y-3">
        {pullRequests.map((pr) => (
          <div
            key={pr.id}
            className="glass rounded-lg p-4 hover:bg-card/60 transition-all duration-300 border border-border/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm text-muted-foreground">#{pr.number}</span>
                  <Badge className={cn("text-xs", statusColors[pr.status])}>
                    {pr.status}
                  </Badge>
                </div>
                <p className="font-medium text-foreground">{pr.title}</p>
                <p className="text-xs text-muted-foreground">{formatDate(pr.createdAt)}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(pr.url, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};