import { SecurityScoreCard } from "@/components/SecurityScoreCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const repositories = [
  { name: "api-backend", score: 85, lastScan: "5 min ago" },
  { name: "web-app", score: 92, lastScan: "12 min ago" },
  { name: "mobile-app", score: 78, lastScan: "1 hour ago" },
  { name: "webhook-service", score: 88, lastScan: "2 hours ago" },
  { name: "admin-panel", score: 95, lastScan: "3 hours ago" },
  { name: "payment-gateway", score: 72, lastScan: "5 hours ago" },
];

const RepositoriesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Repositories</h1>
          <p className="text-muted-foreground mt-1">Monitor and secure your GitHub repositories</p>
        </div>
        <Button className="glow-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Repository
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Search repositories..." 
          className="pl-10 glass"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repositories.map((repo) => (
          <SecurityScoreCard
            key={repo.name}
            repository={repo.name}
            score={repo.score}
            lastScan={repo.lastScan}
          />
        ))}
      </div>
    </div>
  );
};

export default RepositoriesPage;