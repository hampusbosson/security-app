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
}