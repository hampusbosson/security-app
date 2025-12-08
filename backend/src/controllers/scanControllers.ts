import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const runScan = async (req: Request, res: Response) => {
  const { repositoryId } = req.params;
  const userId = (req as any).authUser.userId;

  if (!repositoryId) {
    res.status(400).json({ error: "invalid repositoryID" });
    return;
  }

  try {
    const repo = await prisma.repository.findFirst({
      where: { id: Number(repositoryId), installation: { userId } },
    });

    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }
    
    const scan = await prisma.scan.create({
      data: {
        repositoryId: Number(repositoryId),
        userId,
        status: "PENDING",
      },
    });

    res.status(201).json(scan);
    return;
  } catch (error) {
    console.error("Error creating scan:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

export { runScan };
