import { useMemo } from "react";
import type { Repository, Finding, ScanHistory, PullRequest } from "@/types/github";


export const useRepository = (id: string) => {
  const repository = useMemo<Repository>(() => ({
    id: parseInt(id),
    githubRepoId: 123456789,
    name: "api-backend",
    fullName: "myorg/api-backend",
    private: true,
    defaultBranch: "main",
    createdAt: "2024-01-15T10:30:00Z",
    securityScore: 85,
    lastScan: "5 min ago",
    installationId: 42,
  }), [id]);

  const findings = useMemo<Finding[]>(() => [
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
  ], []);

  const scanHistory = useMemo<ScanHistory[]>(() => [
    { date: "Jan 20", score: 72 },
    { date: "Jan 21", score: 75 },
    { date: "Jan 22", score: 78 },
    { date: "Jan 23", score: 82 },
    { date: "Jan 24", score: 85 },
  ], []);

  const pullRequests = useMemo<PullRequest[]>(() => [
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
  ], []);

  return {
    repository,
    findings,
    scanHistory,
    pullRequests,
  };
};
