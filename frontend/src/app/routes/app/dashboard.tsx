import { useEffect, useMemo, useRef, useState } from "react";
import { AuthAPI, GithubAPI, ScanAPI } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import type { Finding, Scan } from "@/types/github";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Github,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Shield,
  Square,
} from "lucide-react";

const ACTIVE_SCAN_STATUSES = new Set(["PENDING", "RUNNING", "CANCELLED_REQUESTED"]);

const statusMeta: Record<
  Scan["status"],
  { label: string; className: string; icon: typeof LoaderCircle }
> = {
  PENDING: {
    label: "Queued",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700",
    icon: Clock3,
  },
  RUNNING: {
    label: "Running",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-700",
    icon: LoaderCircle,
  },
  CANCELLED_REQUESTED: {
    label: "Stopping",
    className: "border-orange-500/30 bg-orange-500/10 text-orange-700",
    icon: LoaderCircle,
  },
  COMPLETED: {
    label: "Completed",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Failed",
    className: "border-red-500/30 bg-red-500/10 text-red-700",
    icon: AlertCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-700",
    icon: Square,
  },
};

const severityClasses: Record<Finding["severity"], string> = {
  CRITICAL: "border-red-500/30 bg-red-500/10 text-red-700",
  HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-700",
  MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  LOW: "border-sky-500/30 bg-sky-500/10 text-sky-700",
};

const formatTimestamp = (value?: string | null) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
};

const countBySeverity = (scan: Scan | null) => ({
  CRITICAL: scan?.vulnerabilities.filter((item) => item.severity === "CRITICAL").length ?? 0,
  HIGH: scan?.vulnerabilities.filter((item) => item.severity === "HIGH").length ?? 0,
  MEDIUM: scan?.vulnerabilities.filter((item) => item.severity === "MEDIUM").length ?? 0,
  LOW: scan?.vulnerabilities.filter((item) => item.severity === "LOW").length ?? 0,
});

const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const repos = useMemo(
    () =>
      (user?.installations ?? [])
        .flatMap((installation) => installation.repositories ?? [])
        .sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [user]
  );
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);
  const [loadingScan, setLoadingScan] = useState(false);
  const [scanError, setScanError] = useState<string>("");
  const [syncingRepos, setSyncingRepos] = useState(false);
  const [actionPending, setActionPending] = useState(false);
  const pollRef = useRef<number | null>(null);

  const selectedRepo = repos.find((repo) => repo.id === Number(selectedRepoId));
  const severities = countBySeverity(currentScan);

  useEffect(() => {
    if (repos.length === 0) {
      setSelectedRepoId("");
      return;
    }

    setSelectedRepoId((current) =>
      current && repos.some((repo) => repo.id === Number(current))
        ? current
        : String(repos[0].id)
    );
  }, [repos]);

  useEffect(() => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }

    if (!currentScan || !ACTIVE_SCAN_STATUSES.has(currentScan.status)) {
      return;
    }

    pollRef.current = window.setInterval(async () => {
      try {
        const nextScan = await ScanAPI.getScanById(currentScan.id);
        setCurrentScan(nextScan);

        if (!ACTIVE_SCAN_STATUSES.has(nextScan.status) && pollRef.current) {
          window.clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } catch (error) {
        console.error("Failed to refresh scan", error);
      }
    }, 3000);

    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [currentScan]);

  useEffect(() => {
    const loadLatestScan = async () => {
      if (!selectedRepoId) {
        setCurrentScan(null);
        return;
      }

      setLoadingScan(true);
      setScanError("");

      try {
        const scan = await ScanAPI.getLatestRepositoryScan(Number(selectedRepoId));
        setCurrentScan(scan);
      } catch (error) {
        console.error("Failed to load latest scan", error);
        setCurrentScan(null);
        setScanError("Failed to load scan data for this repository.");
      } finally {
        setLoadingScan(false);
      }
    };

    loadLatestScan();
  }, [selectedRepoId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("installed") !== "true") {
      return;
    }

    const syncAfterInstall = async () => {
      try {
        await refreshUser();
        await GithubAPI.syncRepositories();
        await refreshUser();
      } catch (error) {
        console.error("Failed to sync repositories after install", error);
      } finally {
        window.history.replaceState({}, "", "/dashboard");
      }
    };

    syncAfterInstall();
  }, [refreshUser]);

  const handleSyncRepositories = async () => {
    setSyncingRepos(true);
    setScanError("");

    try {
      await GithubAPI.syncRepositories();
      await refreshUser();
    } catch (error) {
      console.error("Failed to sync repositories", error);
      setScanError("Repository sync failed. Check the backend logs and GitHub App installation.");
    } finally {
      setSyncingRepos(false);
    }
  };

  const handleRunScan = async () => {
    if (!selectedRepo) return;

    setActionPending(true);
    setScanError("");

    try {
      const scan = await ScanAPI.runScan(selectedRepo.id);
      setCurrentScan({
        ...scan,
        vulnerabilities: [],
        report: null,
      });
    } catch (error) {
      console.error("Failed to start scan", error);
      setScanError("Failed to start scan.");
    } finally {
      setActionPending(false);
    }
  };

  const handleStopScan = async () => {
    if (!currentScan) return;

    setActionPending(true);
    setScanError("");

    try {
      await ScanAPI.stopScan(currentScan.id);
      const refreshed = await ScanAPI.getScanById(currentScan.id);
      setCurrentScan(refreshed);
    } catch (error) {
      console.error("Failed to stop scan", error);
      setScanError("Failed to stop scan.");
    } finally {
      setActionPending(false);
    }
  };

  const githubInstalled = (user?.installations?.length ?? 0) > 0;
  const status = currentScan ? statusMeta[currentScan.status] : null;
  const StatusIcon = status?.icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-card/60 p-6 shadow-xl backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Strix security scan demo
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Scan a repository and inspect the findings.
              </h1>
              <p className="max-w-3xl text-muted-foreground">
                The demo flow is intentionally narrow: sync repositories, run
                Strix, watch scan status, and read the persisted report and
                vulnerabilities.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm">
              Signed in as <span className="font-medium">{user?.username}</span>
            </div>
            <Button variant="outline" onClick={() => AuthAPI.logoutUser()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </header>

        {!githubInstalled ? (
          <Card className="rounded-3xl border-border/60 bg-card/60 shadow-xl">
            <CardHeader>
              <CardTitle>Connect GitHub to start the demo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Install the GitHub App, then return here to sync repositories
                and run a Strix scan.
              </p>
              <Button onClick={() => GithubAPI.installGithubApp()}>
                <Github className="mr-2 h-4 w-4" />
                Install GitHub App
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-3xl border-border/60 bg-card/60 shadow-xl">
                <CardHeader>
                  <CardTitle>Repository</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Choose repository</label>
                    <select
                      value={selectedRepoId}
                      onChange={(event) => setSelectedRepoId(event.target.value)}
                      disabled={repos.length === 0 || syncingRepos}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="" disabled>
                        Select a repository
                      </option>
                        {repos.map((repo) => (
                          <option key={repo.id} value={String(repo.id)}>
                            {repo.fullName}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSyncRepositories}
                      disabled={syncingRepos}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${syncingRepos ? "animate-spin" : ""}`} />
                      {syncingRepos ? "Syncing..." : "Sync repositories"}
                    </Button>
                    {selectedRepo && (
                      <Button
                        onClick={handleRunScan}
                        disabled={actionPending || ACTIVE_SCAN_STATUSES.has(currentScan?.status ?? "")}
                      >
                        {actionPending ? (
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Shield className="mr-2 h-4 w-4" />
                        )}
                        Run Strix scan
                      </Button>
                    )}
                    {currentScan && ACTIVE_SCAN_STATUSES.has(currentScan.status) && (
                      <Button variant="outline" onClick={handleStopScan} disabled={actionPending}>
                        <Square className="mr-2 h-4 w-4" />
                        Stop scan
                      </Button>
                    )}
                  </div>

                  {selectedRepo ? (
                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4 text-sm">
                      <div className="font-medium">{selectedRepo.fullName}</div>
                      <div className="mt-1 text-muted-foreground">
                        Branch: {selectedRepo.defaultBranch || "main"} · Language:{" "}
                        {selectedRepo.primaryLanguage || "Unknown"}
                      </div>
                      {selectedRepo.lastCommit && (
                        <div className="mt-3 text-muted-foreground">
                          Last commit: {selectedRepo.lastCommit}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                      Sync repositories to choose a target for the demo.
                    </div>
                  )}

                  {scanError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                      {scanError}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/60 bg-card/60 shadow-xl">
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                  <div>
                    <CardTitle>Latest scan</CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Backend-backed status, findings, and raw report for the selected repository.
                    </p>
                  </div>
                  {status && StatusIcon && (
                    <Badge variant="outline" className={status.className}>
                      <StatusIcon
                        className={`mr-2 h-4 w-4 ${
                          currentScan?.status === "RUNNING" || currentScan?.status === "CANCELLED_REQUESTED"
                            ? "animate-spin"
                            : ""
                        }`}
                      />
                      {status.label}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-5">
                  {loadingScan ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Loading scan data...
                    </div>
                  ) : currentScan ? (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <Stat label="Created" value={formatTimestamp(currentScan.createdAt)} />
                        <Stat label="Started" value={formatTimestamp(currentScan.startedAt)} />
                        <Stat label="Completed" value={formatTimestamp(currentScan.completedAt)} />
                        <Stat label="Findings" value={String(currentScan.vulnerabilities.length)} />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <SeverityStat label="Critical" value={severities.CRITICAL} severity="CRITICAL" />
                        <SeverityStat label="High" value={severities.HIGH} severity="HIGH" />
                        <SeverityStat label="Medium" value={severities.MEDIUM} severity="MEDIUM" />
                        <SeverityStat label="Low" value={severities.LOW} severity="LOW" />
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                        <div className="mb-2 text-sm font-medium">Raw report</div>
                        <pre className="max-h-80 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                          {currentScan.report?.content?.trim() || "No report content stored for this scan yet."}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                      No scan has been recorded for this repository yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="rounded-3xl border-border/60 bg-card/60 shadow-xl">
                <CardHeader>
                  <CardTitle>Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentScan?.vulnerabilities.length ? (
                    <div className="space-y-4">
                      {currentScan.vulnerabilities.map((finding) => (
                        <article
                          key={finding.id}
                          className="rounded-2xl border border-border/60 bg-background/80 p-5"
                        >
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className={severityClasses[finding.severity]}>
                                  {finding.severity}
                                </Badge>
                                {finding.code && (
                                  <Badge variant="outline">{finding.code}</Badge>
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-medium">{finding.title}</h3>
                                {(finding.filePath || finding.line) && (
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {finding.filePath || "Unknown file"}
                                    {finding.line ? `:${finding.line}` : ""}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatTimestamp(finding.createdAt)}
                            </div>
                          </div>
                          <div className="mt-5 grid gap-4 xl:grid-cols-2">
                            <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
                              <div className="mb-2 text-sm font-medium">Description</div>
                              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {finding.description}
                              </p>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
                              <div className="mb-2 text-sm font-medium">Remediation</div>
                              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {finding.remediation || "No remediation was extracted for this finding."}
                              </p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                      Findings will appear here after a completed or partially completed scan.
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="mt-2 text-sm font-medium">{value}</div>
  </div>
);

const SeverityStat = ({
  label,
  value,
  severity,
}: {
  label: string;
  value: number;
  severity: Finding["severity"];
}) => (
  <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <Badge variant="outline" className={`mt-3 ${severityClasses[severity]}`}>
      {value}
    </Badge>
  </div>
);

export default DashboardPage;
