import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { syncInstallationRepos } from "../services/githubSync";

export const githubWebhook = async (req: Request, res: Response) => {
  const event = req.headers["x-github-event"];
  const action = req.body.action;

  console.log("webhook event: ", event, "Action: ", action);

  try {
    switch (event) {
      case "installation":
        await handleInstallationEvent(action, req);
        break;

      case "installation_repositories":
        await handleInstallationReposEvent(action, req);
        break;

      case "push":
        await handlePushEvent(req);
        break;

      case "pull_request":
        await handlePullRequestEvent(action, req);
        break;

      case "repository":
        await handleRepositoryEvent(action, req);
        break;

      default:
        console.log(`Unhandled event type: ${event}`);
    }
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("Error handling webhook");
  }

  res.status(200).send("Event ignored");
};

async function handleInstallationEvent(action: string, req: Request) {
  const ghInstallationId = req.body.installation?.id; // GitHub's ID

  if (!ghInstallationId) return;

  // Look up our internal row
  const installation = await prisma.installation.findUnique({
    where: { installationId: ghInstallationId }, // external GH ID
  });

  if (!installation) {
    console.warn(
      "Installation event for unknown installation:",
      ghInstallationId
    );
    return;
  }

  const dbInstallationId = installation.id; // internal PK

  if (action === "deleted") {
    console.log("Installation removed:", ghInstallationId);

    // 1) Delete repositories first
    await prisma.repository.deleteMany({
      where: { installationId: dbInstallationId },
    });

    // 2) Then delete the installation row
    await prisma.installation.delete({
      where: { id: dbInstallationId },
    });

    return;
  }

  if (action === "created") {
    console.log("Installation created:", ghInstallationId);
    await syncInstallationRepos(ghInstallationId);
  }
}

async function handleInstallationReposEvent(action: string, req: Request) {
  const ghInstallationId = req.body.installation.id;

  //internal installation row
  const installation = await prisma.installation.findUnique({
    where: { installationId: ghInstallationId },
  });

  if (!installation) {
    console.warn("Webhook for unknown installation:", ghInstallationId);
    return;
  }

  const dbInstallationId = installation.id;

  if (action === "added") {
    const repos = req.body.repositories_added;

    for (const repo of repos) {
      await prisma.repository.upsert({
        where: { githubRepoId: repo.id },
        update: {},
        create: {
          githubRepoId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
          installationId: dbInstallationId, // IMPORTANT
        },
      });
    }

    console.log("Repos added to installation:", ghInstallationId);
  }

  if (action === "removed") {
    const repos = req.body.repositories_removed;

    for (const repo of repos) {
      await prisma.repository.deleteMany({
        where: { githubRepoId: repo.id },
      });
    }

    console.log("Repos removed from installation:", ghInstallationId);
  }
}

async function handlePushEvent(req: Request) {
  const repo = req.body.repository;
  console.log("Push event on:", repo.full_name);

  // Later you'll trigger scans here
}

async function handlePullRequestEvent(action: string, req: Request) {
  const pr = req.body.pull_request;
  console.log("Pull request:", action, pr.number);
}

async function handleRepositoryEvent(action: string, req: Request) {
  const repo = req.body.repository;

  if (action === "deleted") {
    await prisma.repository.deleteMany({
      where: { githubRepoId: repo.id },
    });
  }

  if (action === "renamed") {
    await prisma.repository.updateMany({
      where: { githubRepoId: repo.id },
      data: { fullName: repo.full_name, name: repo.name },
    });
  }
}
