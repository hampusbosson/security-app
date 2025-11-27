import { useParams } from "react-router-dom";
import { useRepository } from "@/hooks/useRepository";
import { RepoHeader } from "@/components/repository/RepoHeader";
import { SecurityScorePanel } from "@/components/repository/SecurityScorePanel";
import { MetadataCard } from "@/components/repository/MetadataCard";
import { FindingsTable } from "@/components/repository/FindingsTable";
import { ScanHistoryChart } from "@/components/repository/ScanHistoryChart";
import { PullRequestsPanel } from "@/components/repository/PullRequestsPanel";

const RepositoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { repository, findings, scanHistory, pullRequests } = useRepository(id || "1");

  return (
    <div className="space-y-6">
      <RepoHeader repository={repository} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SecurityScorePanel
            score={repository.securityScore || 0}
            lastScan={repository.lastScan || "Never"}
          />
        </div>
        <div className="lg:col-span-2">
          <MetadataCard repository={repository} />
        </div>
      </div>

      <FindingsTable findings={findings} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScanHistoryChart data={scanHistory} />
        <PullRequestsPanel pullRequests={pullRequests} />
      </div>
    </div>
  );
};

export default RepositoryDetailPage;