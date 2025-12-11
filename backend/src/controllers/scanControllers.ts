import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ScanQueue } from "../queue";
import { stopStrixProcess } from "../services/strixRunner/processRegistry";

const runScan = async (req: Request, res: Response) => {
  const { repositoryId } = req.params;
  const repoIdNum = Number(repositoryId);
  const userId = (req as any).authUser.userId;

  if (!repositoryId) {
    res.status(400).json({ error: "invalid repositoryID" });
    return;
  }

  try {
    const repo = await prisma.repository.findFirst({
      where: { id: repoIdNum, installation: { userId } },
    });

    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    const scan = await prisma.scan.create({
      data: {
        repositoryId: repoIdNum,
        userId,
        status: "PENDING",
      },
    });

    const jobId = await ScanQueue.addScanJob({
      scanId: scan.id,
      repositoryId: repoIdNum,
      repoFullName: repo.fullName,
      githubCloneUrl: `https://github.com/${repo.fullName}.git`,
      userId,
    });

    const updatedScan = await prisma.scan.update({
      where: { id: scan.id },
      data: { bullJobId: jobId },
    });

    res.status(201).json({ scan: updatedScan });
    return;
  } catch (error) {
    console.error("Error creating scan:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

const stopScan = async (req: Request, res: Response) => {
  console.log("Received request to stop scan");
  const { scanId } = req.params;
  const userId = (req as any).authUser.userId;
  const idNum = Number(scanId);

  if (!scanId) {
    res.status(400).json({ error: "invalid scanID" });
    return;
  }

  try {
    const scan = await prisma.scan.findFirst({
      where: { id: idNum, userId },
    });

    console.log("Found scan:", scan);

    console.log("scan status:", scan?.status);

    if (!scan) {
      res.status(404).json({ error: "Scan not found" });
      return;
    }

    // if scan already completed/failed/cancelled, cannot stop
    if (
      scan.status === "COMPLETED" ||
      scan.status === "FAILED" ||
      scan.status === "CANCELLED"
    ) {
      res
        .status(400)
        .json({ error: `Scan is already ${scan.status.toLowerCase()}` });
      return;
    }

    // if still waiting in queue, remove job from queue
    if (scan.status === "PENDING" && scan.bullJobId) {
      await ScanQueue.removeScanJob(idNum);

      await prisma.scan.update({
        where: { id: scan.id },
        data: { status: "CANCELLED", completedAt: new Date() },
      });

      res.json({ success: true, status: "CANCELLED" });
      return;
    }

    // if scan is running, attempt to stop the process
    if (scan.status === "RUNNING") {
      const stopped = stopStrixProcess(scan.id);

      // if failed to stop process
      if (!stopped) {
        res
          .status(500)
          .json({ error: "Failed to stop the running scan process" });
        return;
      }

      // mark scan as cancelled in db
      await prisma.scan.update({
        where: { id: scan.id },
        data: { status: "CANCELLED", completedAt: new Date() },
      });

      return res.json({ success: true, status: "CANCELLED" });
    };

  } catch (error) {
    console.error("Error stopping scan:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

export { runScan, stopScan };
