import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";
import { runStrixLocal } from "./runStrixLocal";
import type { StrixScanResult } from "./types";

const exec = promisify(execCb);

type RunStrixForRepoParams = {
  scanId: number;
  repositoryId: number;
  repoFullName: string;
};

export async function runStrixForRepo(
  params: RunStrixForRepoParams
): Promise<StrixScanResult> {
  const { scanId, repoFullName } = params;

  console.log(`[StrixRunner] Starting scan ${scanId} for repo ${repoFullName}`);

  // 1. Temp folder creation
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "devguard-"));
  const repoLocalPath = path.join(tempDir, "repo");

  console.log(`[StrixRunner] Temp directory created: ${tempDir}`);

  // 2. Clone repo
  const cloneUrl = `https://github.com/${repoFullName}.git`;
  console.log(`[StrixRunner] Cloning repo: ${cloneUrl}`);

  try {
    await exec(`git clone ${cloneUrl} ${repoLocalPath}`);
    console.log(`[StrixRunner] Repo successfully cloned to: ${repoLocalPath}`);

    console.log(`[StrixRunner] Running Strix scan (non-interactive)...`);
    return await runStrixLocal({ repoLocalPath, scanId });
  } finally {
    console.log(`[StrixRunner] Cleaning up temp directory: ${tempDir}`);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
