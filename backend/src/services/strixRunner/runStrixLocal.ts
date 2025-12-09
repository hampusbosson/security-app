import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { getLatestStrixRunDir } from "./fsUtils";
import { parseStrixOutput } from "./parseStrixOutput";
import type { StrixScanResult } from "./types";

const execAsync = promisify(exec);

type RunStrixParams = {
  repoLocalPath: string;
};

export async function runStrixLocal({
  repoLocalPath,
}: RunStrixParams): Promise<StrixScanResult> {
  console.log(`[StrixLocal] Running Strix in: ${repoLocalPath}`);

  try {
    const { stdout, stderr } = await execAsync(
      `strix -n --target ${repoLocalPath}`,
      {
        cwd: repoLocalPath,
        env: {
          ...process.env,
          STRIX_LLM: process.env.STRIX_LLM,
          LLM_API_KEY: process.env.LLM_API_KEY,
          LLM_API_BASE: process.env.LLM_API_BASE,
        },
      }
    );

    console.log(`[StrixLocal] Strix CLI stdout:\n${stdout}`);
    if (stderr?.trim()) {
      console.warn(`[StrixLocal] Strix CLI stderr:\n${stderr}`);
    }
  } catch (err) {
    console.error(`[StrixLocal] ERROR executing Strix command:`, err);
    throw err;
  }

  console.log(`[StrixLocal] Searching for latest Strix run directory...`);

  const runDir = getLatestStrixRunDir(repoLocalPath);
  if (!runDir) {
    console.error(`[StrixLocal] No Strix run directory found!`);
    throw new Error("No Strix run directory found");
  }

  console.log(`[StrixLocal] Found run directory: ${runDir}`);
  console.log(`[StrixLocal] Parsing Strix results...`);

  const parsed = parseStrixOutput(runDir);

  console.log(
    `[StrixLocal] Parsed ${parsed.vulnerabilities.length} vulnerabilities.`
  );
  return parsed;
}
