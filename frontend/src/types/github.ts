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
  score?: number; // e.g. 87
  lastScan?: string; // e.g. "5 min ago" or ISO timestamp
  criticalFindings?: number;
  highFindings?: number;
  mediumFindings?: number;
  lowFindings?: number;
}
