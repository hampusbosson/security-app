import fs from "node:fs";
import path from "node:path";

export function getLatestStrixRunDir(baseDir: string): string | null {
  const runsDir = path.join(baseDir, "strix_runs");
  if (!fs.existsSync(runsDir)) return null;

  const entries = fs.readdirSync(runsDir)
    .filter((name) => name.startsWith("repo_")) // or different pattern
    .map((name) => ({
      name,
      fullPath: path.join(runsDir, name),
      stat: fs.statSync(path.join(runsDir, name)),
    }))
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);

  return entries[0]?.fullPath ?? null;
}