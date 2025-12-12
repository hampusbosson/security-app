import { prisma } from "../lib/prisma";
import { runStrixForRepo } from "../services/strixRunner";
import type { ScanJobPayload } from "../queue";

export async function handleScanJob(job: ScanJobPayload) {
  const { scanId, repositoryId, repoFullName } = job;

  try {
    // mark as running
    await prisma.scan.update({
      where: { id: scanId },
      data: { status: "RUNNING", startedAt: new Date() },
    });

    const result = await runStrixForRepo({
      scanId,
      repositoryId,
      repoFullName,
    });

    // save summary + mark as completed
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // store vulnerabilities
    if (result.vulnerabilities.length > 0) {
      await prisma.vulnerability.createMany({
        data: result.vulnerabilities.map((v) => ({
          scanId,
          severity: v.severity,
          title: v.title,
          code: v.id,
          filePath: v.filePath,
          description: v.description,
          remediation: v.remediation,
        })),
      });
    }

    console.log(`Scan ${scanId} completed`);
  } catch (err) {
    console.error("Error in scan worker:", err);

    const message =
      err instanceof Error ? err.message : String(err ?? "Unknown error");

    console.log("----- Error message -------: ", message);

    if (message === "SCAN_CANCELLED") {
      await prisma.scan.update({
        where: { id: scanId },
        data: {
          status: "CANCELLED",
          completedAt: new Date(),
        },
      });

      console.log(`Scan ${scanId} cancelled`);
      return; // IMPORTANT: do NOT throw error further, as this is not a failure
    }

    // real failure
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "FAILED",
        completedAt: new Date(),
      },
    });

    throw err; // let BullMQ mark job as failed
  }
}
