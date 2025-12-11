// src/services/strixRunner/runStrixLocal.ts
import { spawn } from "node:child_process";
import path, { parse } from "node:path";
import { getLatestStrixRunDir } from "./fsUtils";
import { parseStrixOutput } from "./parseStrixOutput";
import type { StrixScanResult } from "./types";

type RunStrixParams = {
  repoLocalPath: string; // e.g. /tmp/devguard/repo-123
};

export async function runStrixLocal({
  repoLocalPath,
}: RunStrixParams): Promise<StrixScanResult> {
  console.log("[StrixLocal] Running Strix in:", repoLocalPath);

  // 1) Start Strix in non-interactive mode
  const child = spawn("strix", ["-n", "--target", repoLocalPath], {
    cwd: repoLocalPath,
    stdio: ["pipe", "pipe", "pipe"], // ensures pipes so we can read data
    env: {
      ...process.env,
      PYTHONUNBUFFERED: "1",
      PYTHONIOENCODING: "utf-8",
    },
  });

  // 2) Stream stdout / stderr
  child.stdout.on("data", (data) => {
    const line = data.toString();
    console.log("[Strix][stdout]", line.trim());
    // later: you can push this line into DB / Redis to show in UI
  });

  child.stderr.on("data", (data) => {
    const line = data.toString();
    console.error("[Strix][stderr]", line.trim());
    // same thing: could be stored as logs
  });

  // 3) Wait for process to finish
  const exitCode: number = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 0));
  });

  if (exitCode !== 0) {
    // Strix docs: non-zero can mean “vulnerabilities found” *or* “hard error”
    // You can decide how to treat this – for now just log it and continue parsing
    console.warn("[StrixLocal] Strix exited with code:", exitCode);
  }

  // 4) Find latest run dir and parse report
  const runDir = getLatestStrixRunDir(repoLocalPath);
  if (!runDir) {
    throw new Error("No Strix run directory found");
  }

  console.log("[StrixLocal] Using run directory:", runDir);

  const parsed = parseStrixOutput(runDir);

  console.log("[StrixLocal] Parsed strix content:", parsed);

  return parsed;
}
