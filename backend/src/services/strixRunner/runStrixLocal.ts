// src/services/strixRunner/runStrixLocal.ts
import { spawn } from "node:child_process";
import path, { parse } from "node:path";
import { getLatestStrixRunDir } from "./fsUtils";
import { parseStrixOutput } from "./parseStrixOutput";
import type { StrixScanResult } from "./types";
import { prisma } from "../../lib/prisma";
import { clear } from "node:console";

type RunStrixParams = {
  repoLocalPath: string; // e.g. /tmp/devguard/repo-123
  scanId: number;
};

export async function runStrixLocal({
  repoLocalPath,
  scanId,
}: RunStrixParams): Promise<StrixScanResult> {
  let isCancelled = false;
  console.log("[StrixLocal] Running Strix in:", repoLocalPath);

  //Start Strix in non-interactive mode
  const child = spawn("strix", ["-n", "--target", repoLocalPath], {
    cwd: repoLocalPath,
    stdio: ["pipe", "pipe", "pipe"], // ensures pipes so we can read data
    env: {
      ...process.env,
      PYTHONUNBUFFERED: "1",
      PYTHONIOENCODING: "utf-8",
    },
  });

  // Periodically check if scan has been requested to cancel
  const cancelInterval = setInterval(async () => {
    try {
      const scan = await prisma.scan.findUnique({
        where: { id: scanId },
        select: { status: true },
      });

      if (scan?.status === "CANCELLED_REQUESTED" && !isCancelled) {
        isCancelled = true;
        clearInterval(cancelInterval);
        console.log(`[StrixLocal] Cancelling scan ${scanId} as requested`);
        child.kill("SIGTERM");
      }
    } catch (err) {
      console.error("Error checking scan status for cancellation:", err);
    }
  }, 1000);

  //Stream stdout / stderr
  child.stdout.on("data", (data) => {
    const line = data.toString();
    console.log("[Strix][stdout]", line.trim());
  });

  child.stderr.on("data", (data) => {
    const line = data.toString();
    console.error("[Strix][stderr]", line.trim());
  });

  // Wait for process to finish
  const exitCode: number = await new Promise((resolve, reject) => {
    child.once("error", reject);

    child.once("close", (code) => {
      clearInterval(cancelInterval);

      if (isCancelled) {
        console.log("[StrixLocal] Scan was cancelled");
        return reject(new Error("SCAN_CANCELLED")); // propagate scan cancelled error message upwards
      }

      resolve(code ?? 0);
    });
  });

  if (exitCode !== 0) {
    // Strix docs: non-zero can mean “vulnerabilities found” *or* “hard error”
    // You can decide how to treat this – for now just log it and continue parsing
    console.warn("[StrixLocal] Strix exited with code:", exitCode);
  }

  // Find latest run dir and parse report
  const runDir = getLatestStrixRunDir(repoLocalPath);
  if (!runDir) {
    throw new Error("No Strix run directory found");
  }

  console.log("[StrixLocal] Using run directory:", runDir);

  const parsed = parseStrixOutput(runDir);

  console.log("[StrixLocal] Parsed strix content:", parsed);

  return parsed;
}
