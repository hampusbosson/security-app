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

    // store vulnerabilities if you added a Vulnerability model
    if (result.vulnerabilities.length > 0) {
      await prisma.vulnerability.createMany({
        data: result.vulnerabilities.map((v) => ({
          scanId,
          repositoryId,
          severity: v.severity,
          title: v.title,
          strixId: v.id,
          filePath: v.filePath,
          description: v.description,
          remediation: v.remediation,
        })),
      });
    }

    console.log(`Scan ${scanId} completed`);
  } catch (err) {
    console.error("Error in scan worker:", err);
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "FAILED",
        completedAt: new Date(),
      },
    });
  }
}