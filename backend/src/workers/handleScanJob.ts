import { prisma } from "../lib/prisma";
import { runStrixForRepo } from "../services/strixRunner";
import type { ScanJobPayload } from "../queue";
import type { StrixScanResult } from "../services/strixRunner/types";

export async function handleScanJob(job: ScanJobPayload) {
  const { scanId, repositoryId, repoFullName } = job;

  let result: StrixScanResult | null = null;
  let finalStatus: "COMPLETED" | "FAILED" | "CANCELLED" = "FAILED";

  try {
    // mark as running
    await prisma.scan.update({
      where: { id: scanId },
      data: { status: "RUNNING", startedAt: new Date() },
    });

    result = await runStrixForRepo({
      scanId,
      repositoryId,
      repoFullName,
    });

    finalStatus = "COMPLETED";
  } catch (err) {
    const message =
      err instanceof Error ? err.message : String(err ?? "Unknown error");

    // extract partial results if present
    if (err && typeof err === "object" && "result" in err) {
      result = (err as any).result as StrixScanResult;
    }

    if (message === "SCAN_CANCELLED") {
      finalStatus = "CANCELLED";
    } else {
      finalStatus = "FAILED";
      throw err; // let BullMQ mark job as failed
    }
  } finally {
    console.log("results object: ", result);
    // persist partial or full results
    if (result?.vulnerabilities?.length) {
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
        skipDuplicates: true, // critical for retries / partial saves
      });
    }

    if (finalStatus === "COMPLETED" && result?.summary) {
      await prisma.scanReport.upsert({
        where: { scanId },
        create: {
          scanId,
          content: result.summary,
        },
        update: {
          content: result.summary,
        },
      });
    }

    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: finalStatus,
        completedAt: new Date(),
      },
    });
  }
}
