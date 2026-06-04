import type { Repository, Scan } from "@/types/github";

type SampleScenario = {
  id: string;
  label: string;
  description: string;
  repository: Repository;
  scan: Scan;
};

const now = "2026-04-06T12:15:00.000Z";

const repoOne: Repository = {
  id: 1001,
  githubRepoId: 1001,
  name: "lucid-view-app",
  fullName: "hampusbosson/lucid-view-app",
  private: false,
  defaultBranch: "main",
  createdAt: "2026-02-01T09:00:00.000Z",
  primaryLanguage: "TypeScript",
  lastCommit: "feat: add booking workflow step validation",
};

const repoTwo: Repository = {
  id: 1002,
  githubRepoId: 1002,
  name: "secure-api",
  fullName: "portfolio/secure-api",
  private: true,
  defaultBranch: "main",
  createdAt: "2025-12-12T14:20:00.000Z",
  primaryLanguage: "Go",
  lastCommit: "refactor: simplify auth middleware chain",
};

const repoThree: Repository = {
  id: 1003,
  githubRepoId: 1003,
  name: "checkout-service",
  fullName: "portfolio/checkout-service",
  private: true,
  defaultBranch: "trunk",
  createdAt: "2026-01-18T11:45:00.000Z",
  primaryLanguage: "Python",
  lastCommit: "feat: connect payment retry worker",
};

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: "critical-findings",
    label: "Critical findings",
    description: "High-severity auth and injection issues were validated during this run.",
    repository: repoOne,
    scan: {
      id: 5001,
      repositoryId: repoOne.id,
      userId: 0,
      status: "COMPLETED",
      createdAt: "2026-04-06T11:57:00.000Z",
      startedAt: "2026-04-06T11:57:10.000Z",
      completedAt: "2026-04-06T12:04:43.000Z",
      report: {
        id: 9001,
        createdAt: "2026-04-06T12:04:43.000Z",
        content: `# Strix Security Assessment\n\nTarget: hampusbosson/lucid-view-app\n\n## Executive Summary\nThe scan identified one critical access control vulnerability and two additional weaknesses with reliable reproduction paths. The most severe issue allows privilege escalation through direct object reference on the workspace membership endpoint. Strix also validated a SQL injection primitive in reporting filters and a low-severity information disclosure in error responses.\n\n## Recommendations\n1. Enforce server-side authorization checks on workspace-scoped resources.\n2. Replace dynamic SQL fragments with parameterized query builders.\n3. Normalize error handling to avoid leaking stack traces and internal identifiers.`,
      },
      vulnerabilities: [
        {
          id: 7001,
          code: "vuln-0001",
          severity: "CRITICAL",
          title: "Privilege escalation via workspace member update endpoint",
          filePath: "src/routes/workspace-members.ts",
          line: 118,
          description:
            "The endpoint validates authentication but not whether the caller belongs to the target workspace. Strix was able to replay a request with another workspace ID and promote a low-privilege user to admin.",
          remediation:
            "Require workspace-scoped authorization before applying membership changes. The authorization decision should use the authenticated user identity and the target workspace ID on the server.",
          createdAt: now,
        },
        {
          id: 7002,
          code: "vuln-0002",
          severity: "HIGH",
          title: "SQL injection in analytics filter builder",
          filePath: "src/server/reporting/filterBuilder.ts",
          line: 42,
          description:
            "A sort field is concatenated into a raw SQL fragment after only client-side validation. Strix generated a crafted value that altered the query structure and exposed unrelated rows.",
          remediation:
            "Replace raw string interpolation with a server-side allowlist of sortable fields and build the final query with parameterized APIs only.",
          createdAt: now,
        },
        {
          id: 7003,
          code: "vuln-0003",
          severity: "LOW",
          title: "Verbose error response leaks internal implementation details",
          filePath: "src/middleware/error-handler.ts",
          line: 27,
          description:
            "Production responses include stack traces and ORM metadata when an exception reaches the shared error handler.",
          remediation:
            "Return a generic error payload in production and log detailed traces only on the server.",
          createdAt: now,
        },
      ],
      repository: repoOne,
    },
  },
  {
    id: "clean-run",
    label: "Clean run",
    description: "This run completed without validated findings and produced a clean summary report.",
    repository: repoTwo,
    scan: {
      id: 5002,
      repositoryId: repoTwo.id,
      userId: 0,
      status: "COMPLETED",
      createdAt: "2026-04-05T16:20:00.000Z",
      startedAt: "2026-04-05T16:20:08.000Z",
      completedAt: "2026-04-05T16:24:32.000Z",
      report: {
        id: 9002,
        createdAt: "2026-04-05T16:24:32.000Z",
        content: `# Strix Security Assessment\n\nTarget: portfolio/secure-api\n\n## Executive Summary\nNo validated vulnerabilities were identified during this run. Authentication, authorization, and request validation paths behaved as expected under the exercised scenarios.\n\n## Notes\nThis result should still be treated as point-in-time coverage, not a guarantee of absence.`,
      },
      vulnerabilities: [],
      repository: repoTwo,
    },
  },
  {
    id: "timeout-state",
    label: "Timeout / failed run",
    description: "This run ended before completion and retained an inconclusive final report.",
    repository: repoThree,
    scan: {
      id: 5003,
      repositoryId: repoThree.id,
      userId: 0,
      status: "FAILED",
      createdAt: "2026-04-04T09:10:00.000Z",
      startedAt: "2026-04-04T09:10:11.000Z",
      completedAt: "2026-04-04T09:20:12.000Z",
      report: {
        id: 9003,
        createdAt: "2026-04-04T09:20:12.000Z",
        content: `# Strix Security Assessment\n\nTarget: portfolio/checkout-service\n\n## Scan Outcome\nThe scan did not complete successfully within the allotted runtime window. Partial recon completed, but no validated findings were stored for this run.\n\n## Recommended Follow-up\nRetry on a smaller scope or increase the allowed scan budget in a controlled internal environment.`,
      },
      vulnerabilities: [],
      repository: repoThree,
    },
  },
];

export const SAMPLE_SCENARIO_MAP = Object.fromEntries(
  SAMPLE_SCENARIOS.map((scenario) => [scenario.id, scenario])
);
