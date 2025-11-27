import { GitBranch, Hash, Clock, Link as LinkIcon } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import type { Repository } from "@/types/github";

interface MetadataCardProps {
  repository: Repository | undefined;
}

export const MetadataCard = ({ repository }: MetadataCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const metadata = [
    { icon: Hash, label: "Repository ID", value: repository?.id },
    { icon: Hash, label: "GitHub Repo ID", value: repository?.githubRepoId },
    { icon: GitBranch, label: "Default Branch", value: repository?.defaultBranch || "main" },
    { icon: Clock, label: "Created", value: formatDate(repository?.createdAt || "") },
    { icon: LinkIcon, label: "Installation ID", value: repository?.id || "N/A" },  //// LOOK THIS UP LATER
  ];

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-4">Repository Details</h2>

      <div className="space-y-3">
        {metadata.map((item, index) => (
          <div key={index} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
            <item.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground min-w-[140px]">{item.label}</span>
            <span className="text-sm font-mono text-foreground">{item.value}</span>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full gap-2 mt-4"
        onClick={() => window.open(`https://github.com/${repository?.fullName}`, "_blank")}
      >
        <SiGithub className="w-4 h-4" />
        Open on GitHub
      </Button>
    </div>
  );
};