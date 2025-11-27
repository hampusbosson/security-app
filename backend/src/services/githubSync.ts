// src/services/githubSync.ts
import axios from "axios";
import { prisma } from "../lib/prisma";
import { getInstallationToken } from "../utils/githubApp";

export async function syncInstallationRepos(ghInstallationId: number) {
  // 1) Find internal installation row
  const installation = await prisma.installation.findUnique({
    where: { installationId: ghInstallationId }, // external GH ID
  });

  if (!installation) {
    console.warn("syncInstallationRepos: no installation row for", ghInstallationId);
    return;
  }

  const dbInstallationId = installation.id; // internal PK

  // 2) Get installation access token
  const token = await getInstallationToken(ghInstallationId);

  // 3) Fetch repos from GitHub
  const repoRes = await axios.get(
    "https://api.github.com/installation/repositories?per_page=100",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  const repos = repoRes.data.repositories;

  // 4) Clear old repos for this installation
  await prisma.repository.deleteMany({
    where: { installationId: dbInstallationId },
  });

  // 5) Insert fresh repos
  for (const r of repos) {
    await prisma.repository.create({
      data: {
        githubRepoId: r.id,
        name: r.name,
        fullName: r.full_name,
        private: r.private,
        defaultBranch: r.default_branch,
        installationId: dbInstallationId, // internal FK
      },
    });
  }

  console.log(
    `syncInstallationRepos: synced ${repos.length} repos for installation ${ghInstallationId}`
  );
}