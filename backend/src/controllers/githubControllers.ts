import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getInstallationToken } from "../utils/githubApp";
import axios from "axios";

const handleInstallation = async (req: Request, res: Response) => {
  const installationId = Number(req.query.installation_id);

  if (!installationId) {
    return res.status(400).send("Missing installation_id");
  }

  if (!req.authUser?.userId) {
    return res.status(401).send("User not authenticated");
  }

  try {
    const installation = await prisma.installation.upsert({
      where: { installationId },
      update: {},
      create: {
        installationId,
        userId: req.authUser?.userId,
      },
    });

    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?installed=true`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save installation");
  }
};

const syncUserRepositories = async (req: Request, res: Response) => {
  const installation = await prisma.installation.findFirst({
    where: { userId: req.authUser?.userId },
  });

  if (!installation) {
    res.status(404).send("Installation not found");
    return;
  }

  const token = await getInstallationToken(installation.installationId);

  const repoRes = await axios.get(
    `https://api.github.com/installation/repositories`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  const repos = repoRes.data.repositories;

  for (const r of repos) {
    await prisma.repository.upsert({
      where: { githubRepoId: r.id },
      update: {},
      create: {
        githubRepoId: r.id,
        name: r.name,
        fullName: r.full_name,
        private: r.private,
        defaultBranch: r.default_branch,
        installationId: installation.id,
      },
    });
  }

  return res.json({ success: true, repositoriesSynced: repos.length, repositories: repos });
};

export { handleInstallation, syncUserRepositories };
