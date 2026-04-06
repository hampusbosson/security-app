import { prisma } from "../lib/prisma";

export async function recoverInterruptedScans() {
  const [cancelledRequested, running] = await Promise.all([
    prisma.scan.updateMany({
      where: { status: "CANCELLED_REQUESTED" },
      data: {
        status: "CANCELLED",
        completedAt: new Date(),
      },
    }),
    prisma.scan.updateMany({
      where: { status: "RUNNING" },
      data: {
        status: "FAILED",
        completedAt: new Date(),
      },
    }),
  ]);

  if (cancelledRequested.count || running.count) {
    console.log(
      `[ScanRecovery] Recovered ${cancelledRequested.count} cancelled and ${running.count} interrupted scans`
    );
  }
}
