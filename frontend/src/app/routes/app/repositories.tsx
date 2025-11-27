import { SecurityScoreCard } from "@/components/SecurityScoreCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const RepositoriesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const repos = user?.installations.flatMap((inst) => inst.repositories) ?? [];

  const handleRepositoryClick = (repoId: number | undefined) => {
    if (!repoId) return;
    navigate(`/dashboard/repositories/${repoId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Repositories</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and secure your GitHub repositories
          </p>
        </div>
        <Button className="glow-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Repository
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input placeholder="Search repositories..." className="pl-10 glass" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((repo) => (
          <div
            key={repo?.name}
            onClick={() => handleRepositoryClick(repo?.id)}
            className="cursor-pointer"
          >
            <SecurityScoreCard
              key={repo?.name}
              repository={repo}
              score={repo?.securityScore ?? undefined}
              lastScan={repo?.lastScan ?? "Not yet scanned"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoriesPage;
