export type ScanJobPayload = {
  scanId: number;
  repositoryId: number;
  repoFullName: string; // "owner/name"
  githubCloneUrl: string;
  userId: number;
};