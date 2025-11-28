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
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  title: string;
  filePath: string;
  lineNumber: number;
  status: "Open" | "Resolved";
}

export interface ScanHistory {
  date: string;
  score: number;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  status: "Merged" | "Open" | "Closed";
  createdAt: string;
  url: string;
}
