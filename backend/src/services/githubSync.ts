// src/services/githubSync.ts
import axios from "axios";
import { prisma } from "../lib/prisma";
import { getInstallationToken } from "../utils/githubApp";

export async function syncInstallationRepos(ghInstallationId: number) {
  const installation = await prisma.installation.findUnique({
    where: { installationId: ghInstallationId },
  });

  if (!installation) {
    console.warn("syncInstallationRepos: no installation row for", ghInstallationId);
    return;
  }

  const dbInstallationId = installation.id;
  const token = await getInstallationToken(ghInstallationId);

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

  // Remove all old repos
  await prisma.repository.deleteMany({
    where: { installationId: dbInstallationId },
  });

  for (const r of repos) {

    // ---------------------------
    // Fetch extended metadata
    // ---------------------------

    let fullRepoInfo = null;
    let lastCommit = null;
    let openPrCount = 0;
    let openIssueCount = 0;
    let primaryLanguage = null;
    let branchProtectionEnabled = false;
    let dependabotAlertCount = 0;
    let secretScanningEnabled = false;

    try {
      // 1. Base repo info
      const infoRes = await axios.get(
        `https://api.github.com/repos/${r.full_name}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fullRepoInfo = infoRes.data;

      primaryLanguage = fullRepoInfo.language;
      openIssueCount = fullRepoInfo.open_issues_count;

      // 2. Open PR count
      const prRes = await axios.get(
        `https://api.github.com/repos/${r.full_name}/pulls?state=open`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      openPrCount = prRes.data.length;

      // 3. Last commit
      const commitRes = await axios.get(
        `https://api.github.com/repos/${r.full_name}/commits?per_page=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      lastCommit = commitRes.data[0]?.commit?.message || null;

      // 4. Branch protection
      try {
        const bpRes = await axios.get(
          `https://api.github.com/repos/${r.full_name}/branches/${r.default_branch}/protection`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        branchProtectionEnabled = bpRes.status === 200;
      } catch {
        branchProtectionEnabled = false;
      }

      // 5. Dependabot alerts
      try {
        const depRes = await axios.get(
          `https://api.github.com/repos/${r.full_name}/dependabot/alerts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dependabotAlertCount = depRes.data.length;
      } catch {}

      // 6. Secret scanning
      try {
        const secRes = await axios.get(
          `https://api.github.com/repos/${r.full_name}/secret-scanning/alerts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        secretScanningEnabled = secRes.data.length > 0;
      } catch {}

    } catch (err) {
      console.error(`Failed to fetch extended metadata for ${r.full_name}`, err);
    }

    // ------------------------------------
    // Store repository in DB with new fields
    // ------------------------------------
    await prisma.repository.create({
      data: {
        githubRepoId: r.id,
        name: r.name,
        fullName: r.full_name,
        private: r.private,
        defaultBranch: r.default_branch,
        installationId: dbInstallationId,
        lastScan: null,
        securityScore: null,
        lastCommit,
        openPrCount,
        openIssueCount,
        primaryLanguage,
        branchProtectionEnabled,
        dependabotAlertCount,
        secretScanningEnabled,
      },
    });
  }

  console.log(
    `syncInstallationRepos: synced ${repos.length} repos for installation ${ghInstallationId}`
  );
}