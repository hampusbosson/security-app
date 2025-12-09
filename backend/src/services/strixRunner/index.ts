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
  } catch (err) {
    console.error(`[StrixRunner] ERROR cloning repo:`, err);
    throw err;
  }

  // 3. Run Strix
  let result: StrixScanResult;
  try {
    console.log(`[StrixRunner] Running Strix scan (non-interactive)...`);
    result = await runStrixLocal({ repoLocalPath });
    console.log(`[StrixRunner] Strix scan complete`);
  } catch (err) {
    console.error(`[StrixRunner] ERROR running Strix:`, err);
    throw err;
  }

  // 4. Cleanup
  console.log(`[StrixRunner] Cleaning up temp directory...`);
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log(`[StrixRunner] Temp folder removed: ${tempDir}`);
  } catch (err) {
    console.warn(`[StrixRunner] Failed to remove temp folder (ignored):`, err);
  }

  console.log(`[StrixRunner] Scan ${scanId} finished successfully.`);
  return result;
}