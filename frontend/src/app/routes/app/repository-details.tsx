import { useParams } from "react-router-dom";
import { useRepository } from "@/hooks/useRepository";
import { RepoHeader } from "@/components/repository/RepoHeader";
import { SecurityScorePanel } from "@/components/repository/SecurityScorePanel";
import { MetadataCard } from "@/components/repository/MetadataCard";
import { FindingsTable } from "@/components/repository/FindingsTable";
//import { ScanHistoryChart } from "@/components/repository/ScanHistoryChart";
import { PullRequestsPanel } from "@/components/repository/PullRequestsPanel";
import { ScanProgress } from "@/components/repository/ScanProgress";
import { ScanResultPanel } from "@/components/repository/ScanResultPanel";
import type { Finding, PullRequest /*ScanHistory */ } from "@/types/github";
//import { ScanAPI } from "@/api/scan";
import { useState } from "react";

const mockFindings: Finding[] = [
  {
    id: "1",
    severity: "Critical",
    title: "SQL Injection in user query",
    filePath: "src/controllers/user.ts",
    lineNumber: 45,
    status: "Open",
  },
  {
    id: "2",
    severity: "High",
    title: "Insecure JWT validation",
    filePath: "src/auth/jwt.ts",
    lineNumber: 23,
    status: "Open",
  },
  {
    id: "3",
    severity: "Medium",
    title: "Missing rate limiting",
    filePath: "src/middleware/api.ts",
    lineNumber: 12,
    status: "Resolved",
  },
  {
    id: "4",
    severity: "Low",
    title: "Outdated dependency",
    filePath: "package.json",
    lineNumber: 18,
    status: "Resolved",
  },
];

/*
const mockScanHistory: ScanHistory[] = [
  { date: "Jan 20", score: 72 },
  { date: "Jan 21", score: 75 },
  { date: "Jan 22", score: 78 },
  { date: "Jan 23", score: 82 },
  { date: "Jan 24", score: 85 },
];

*/

const mockPullRequests: PullRequest[] = [
  {
    id: 1,
    number: 234,
    title: "Fix: Secure SQL query parameterization",
    status: "Open",
    createdAt: "2024-01-24T14:30:00Z",
    url: "https://github.com/myorg/api-backend/pull/234",
  },
  {
    id: 2,
    number: 233,
    title: "Security: Update JWT validation logic",
    status: "Merged",
    createdAt: "2024-01-23T10:15:00Z",
    url: "https://github.com/myorg/api-backend/pull/233",
  },
  {
    id: 3,
    number: 232,
    title: "Fix: Add rate limiting middleware",
    status: "Merged",
    createdAt: "2024-01-22T16:45:00Z",
    url: "https://github.com/myorg/api-backend/pull/232",
  },
];

const RepositoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { repository } = useRepository(id || "");
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleTriggerScan = () => {
    setIsScanning(true);
    setShowResults(false);
    //ScanAPI.runScan(repository!.id);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    setShowResults(true);
  };

  const handleRetry = () => {
    setIsScanning(true);
    setShowResults(false);
  };

  return (
    <div className="space-y-8">
      <RepoHeader repository={repository} onTriggerScan={handleTriggerScan} />

      {isScanning && (
        <ScanProgress
          isScanning={isScanning}
          onScanComplete={handleScanComplete}
          onRetry={handleRetry}
          onViewReport={() => setShowResults(true)}
        />
      )}

      {showResults && !isScanning && (
        <ScanResultPanel
          repositoryName={repository?.name}
          onRunNewScan={handleTriggerScan}
        />
      )}

      <SecurityScorePanel
        score={repository?.securityScore || 0}
        lastScan={repository?.lastScan || "Never"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetadataCard repository={repository} />
        <PullRequestsPanel pullRequests={mockPullRequests} />
      </div>

      <FindingsTable findings={mockFindings} />
    </div>
  );
};

export default RepositoryDetailPage;
