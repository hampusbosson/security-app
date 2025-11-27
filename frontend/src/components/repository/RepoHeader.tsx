import { ArrowLeft, Github, Play, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { Repository } from "@/types/github";

interface RepoHeaderProps {
  repository: Repository | undefined;
}

export const RepoHeader = ({ repository }: RepoHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard/repositories")}
        className="w-fit gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Repositories
      </Button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground font-mono">
            {repository?.fullName}
          </h1>
          <Badge variant={repository?.private ? "secondary" : "outline"} className="gap-1">
            {repository?.private ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            {repository?.private ? "Private" : "Public"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(`https://github.com/${repository?.fullName}`, "_blank")}
          >
            <Github className="w-4 h-4" />
          </Button>
          <Button className="glow-primary gap-2">
            <Play className="w-4 h-4" />
            Trigger Scan
          </Button>
        </div>
      </div>
    </div>
  );
};