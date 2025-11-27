import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getInstallationToken } from "../utils/githubApp";
import axios from "axios";
import jwt from "jsonwebtoken";
import { syncInstallationRepos } from "../services/githubSync";

const getInstallUrl = (req: Request, res: Response) => {
  const jwtToken = jwt.sign(
    { userId: req.authUser!.userId },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" }
  );

  const installUrl = `https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new?state=${jwtToken}`;

  res.json({ url: installUrl });
};

const handleInstallation = async (req: Request, res: Response) => {
  const installationId = Number(req.query.installation_id);
  const stateToken = req.query.state as string;

  if (!installationId) {
    return res.status(400).send("Missing installation_id");
  }

  if (!stateToken) {
    return res.status(400).send("Missing state token");
  }

  let decoded: any;
  try {
    decoded = jwt.verify(stateToken, process.env.JWT_SECRET!);
  } catch {
    return res.status(401).send("Invalid state token");
  }

  const userId = decoded.userId;
  const accountLogin = req.query.account_login as string | null;
  const accountType = req.query.account_type as string | null;

  try {
    await prisma.installation.upsert({
      where: { installationId },
      update: {
        accountLogin,
        accountType,
      },
      create: {
        installationId,
        accountLogin,
        accountType,
        userId,
      },
    });

    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?installed=true`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to save installation");
  }
};

const syncUserRepositories = async (req: Request, res: Response) => {
  const installation = await prisma.installation.findFirst({
    where: { userId: req.authUser?.userId },
  });

  if (!installation) {
    return res.status(404).send("Installation not found");
  }

  await syncInstallationRepos(installation.installationId);

  return res.json({ success: true });
};

export { handleInstallation, syncUserRepositories, getInstallUrl };
