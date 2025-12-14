import { ChildProcess, spawn } from "node:child_process";
import path, { parse } from "node:path";
import { getLatestStrixRunDir } from "./fsUtils";
import { parseStrixOutput } from "./parseStrixOutput";
import type { StrixScanResult } from "./types";
import { prisma } from "../../lib/prisma";

function killProcessTree(child: import("node:child_process").ChildProcess) {
  console.log("[StrixLocal] Killing Strix process tree");
  if (!child.pid) return;

  // 1) polite (many CLIs treat SIGINT like Ctrl+C)
  try {
    process.kill(-child.pid, "SIGINT");
  } catch {}

  // 2) escalate
  setTimeout(() => {
    try {
      process.kill(-child.pid!, "SIGTERM");
    } catch {}
  }, 3_000);

  // 3) hard kill
  setTimeout(() => {
    try {
      process.kill(-child.pid!, "SIGKILL");
    } catch {}
  }, 10_000);
}

type RunStrixParams = {
  repoLocalPath: string; // e.g. /tmp/devguard/repo-123
  scanId: number;
};

export async function runStrixLocal({
  repoLocalPath,
  scanId,
}: RunStrixParams): Promise<StrixScanResult> {
  let isCancelled = false;
  let parsedResult: StrixScanResult | null = null;

  console.log("[StrixLocal] Running Strix in:", repoLocalPath);

  const child = spawn("strix", ["-n", "--target", repoLocalPath], {
    cwd: repoLocalPath,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      PYTHONUNBUFFERED: "1",
      PYTHONIOENCODING: "utf-8",
    },
  });

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
        killProcessTree(child);
      }
    } catch (err) {
      console.error("Error checking scan status for cancellation:", err);
    }
  }, 1000);

  child.stdout.on("data", (data) => {
    console.log("[Strix][stdout]", data.toString().trim());
  });

  child.stderr.on("data", (data) => {
    console.error("[Strix][stderr]", data.toString().trim());
  });

  await new Promise<void>((resolve, reject) => {
    child.once("error", reject);

    child.once("close", () => {
      clearInterval(cancelInterval);

      // Always attempt to parse what exists
      const runDir = getLatestStrixRunDir(repoLocalPath);
      if (runDir) {
        parsedResult = parseStrixOutput(runDir);
      }

      if (isCancelled) {
        return reject(
          Object.assign(new Error("SCAN_CANCELLED"), {
            result: parsedResult,
          })
        );
      }

      resolve();
    });
  });

  if (!parsedResult) {
    throw new Error("No Strix output found");
  }

  return parsedResult;
}
