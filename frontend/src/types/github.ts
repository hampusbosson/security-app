export interface Installation {
  id: number;
  installationId: number;
  accountLogin: string | null;
  accountType: string | null;
  createdAt: string;
  repositories?: Repository[]; // optional because not always loaded
}

export interface Repository {
  id: number;
  githubRepoId: number;
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch?: string | null;
  createdAt: string;
  securityScore?: number; // e.g. 87
  lastScan?: string; // e.g. "5 min ago" or ISO timestamp
  criticalFindings?: number;
  highFindings?: number;
  mediumFindings?: number;
  lowFindings?: number;
  lastCommit?: string | null;
  openPrCount?: number | null;
  openIssueCount?: number | null;
  branchProtectionEnabled?: boolean;
  dependabotAlertCount?: number | null;
  secretScanningEnabled?: boolean;
  primaryLanguage?: string | null;
}

export interface Finding {
  id: number;
  code?: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  filePath?: string | null;
  line?: number | null;
  description: string;
  remediation?: string | null;
  createdAt: string;
}

export interface ScanReport {
  id: number;
  content: string;
  createdAt: string;
}

export interface Scan {
  id: number;
  repositoryId: number;
  userId: number;
  status:
    | "PENDING"
    | "RUNNING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "CANCELLED_REQUESTED";
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  bullJobId?: string | null;
  cancelRequested?: boolean;
  report?: ScanReport | null;
  vulnerabilities: Finding[];
  repository?: Pick<
    Repository,
    "id" | "name" | "fullName" | "private" | "defaultBranch"
  >;
}
