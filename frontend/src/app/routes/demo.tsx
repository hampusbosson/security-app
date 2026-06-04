import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Finding, Repository, Scan } from "@/types/github";
import { SAMPLE_SCENARIOS } from "@/lib/sampleScanData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  FolderGit2,
  Github,
  LoaderCircle,
  Play,
  RefreshCw,
  TerminalSquare,
} from "lucide-react";

const statusMeta: Record<
  Scan["status"],
  { label: string; className: string; icon: typeof Clock3 }
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
    icon: AlertCircle,
  },
};

const severityClasses: Record<Finding["severity"], string> = {
  CRITICAL: "border-red-500/30 bg-red-500/10 text-red-700",
  HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-700",
  MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  LOW: "border-sky-500/30 bg-sky-500/10 text-sky-700",
};

const SIMULATION_STEPS = [
  {
    delayMs: 0,
    progress: 12,
    status: "PENDING" as const,
    message: "Queued scan job and reserved isolated runtime.",
    logLine: "queued scan job for selected repository",
    visibleFindings: 0,
  },
  {
    delayMs: 1200,
    progress: 34,
    status: "RUNNING" as const,
    message: "Cloning repository and mapping routes, dependencies, and auth paths.",
    logLine: "cloned repository and mapped project layout",
    visibleFindings: 0,
  },
  {
    delayMs: 2800,
    progress: 61,
    status: "RUNNING" as const,
    message: "Executing attack paths and validating candidate findings.",
    logLine: "running validation flow against auth and data access paths",
    visibleFindings: 1,
  },
  {
    delayMs: 4700,
    progress: 84,
    status: "RUNNING" as const,
    message: "Finalizing severity scoring and remediation guidance.",
    logLine: "finalized report sections and remediation notes",
    visibleFindings: 2,
  },
] as const;

const FINALIZE_DELAY_MS = 1300;

const formatTimestamp = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : "Not available";

const formatLogTimestamp = (value: Date) =>
  value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

const formatElapsed = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0
    ? `${minutes}m ${String(remainingSeconds).padStart(2, "0")}s`
    : `${remainingSeconds}s`;
};

const createScenarioFromRepository = (
  repository: Repository,
  templateIndex: number
) => {
  const template = SAMPLE_SCENARIOS[templateIndex % SAMPLE_SCENARIOS.length];

  return {
    ...template,
    id: repository.fullName,
    repository,
    scan: {
      ...template.scan,
      repositoryId: repository.id,
      repository: {
        id: repository.id,
        name: repository.name,
        fullName: repository.fullName,
        private: repository.private,
        defaultBranch: repository.defaultBranch,
      },
      report: template.scan.report
        ? {
            ...template.scan.report,
            content: template.scan.report.content.replaceAll(
              template.repository.fullName,
              repository.fullName
            ),
          }
        : null,
    },
  };
};

const DemoPage = () => {
  const { user } = useAuth();
  const liveRepositories = useMemo(
    () =>
      (user?.installations ?? [])
        .flatMap((installation) => installation.repositories ?? [])
        .sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [user]
  );
  const scenarios = useMemo(
    () =>
      liveRepositories.length
        ? liveRepositories.map((repository, index) =>
            createScenarioFromRepository(repository, index)
          )
        : SAMPLE_SCENARIOS,
    [liveRepositories]
  );

  const [selectedScenarioId, setSelectedScenarioId] = useState(() => scenarios[0].id);
  const [simulatedScan, setSimulatedScan] = useState<Scan | null>(null);
  const [simulationMessage, setSimulationMessage] = useState("");
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [visibleFindings, setVisibleFindings] = useState(0);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timeoutRefs = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  const activeScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0],
    [scenarios, selectedScenarioId]
  );

  const scan = simulatedScan ?? activeScenario.scan;
  const findingsToRender = isSimulating
    ? activeScenario.scan.vulnerabilities.slice(0, visibleFindings)
    : scan.vulnerabilities;
  const status = statusMeta[scan.status];
  const StatusIcon = status.icon;

  const clearTimers = () => {
    timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutRefs.current = [];
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const appendLogLine = (message: string) => {
    const timestamp = formatLogTimestamp(new Date());
    setEventLog((current) => [...current, `${timestamp}  ${message}`]);
  };

  useEffect(() => clearTimers, []);

  useEffect(() => {
    clearTimers();
    setSimulatedScan(null);
    setSimulationMessage("");
    setSimulationProgress(0);
    setVisibleFindings(0);
    setEventLog([]);
    setIsSimulating(false);
    setElapsedSeconds(0);
  }, [selectedScenarioId]);

  useEffect(() => {
    if (!scenarios.some((scenario) => scenario.id === selectedScenarioId)) {
      setSelectedScenarioId(scenarios[0].id);
    }
  }, [scenarios, selectedScenarioId]);

  const startSimulation = () => {
    clearTimers();

    const queuedAt = new Date().toISOString();
    const baseScan: Scan = {
      ...activeScenario.scan,
      status: "PENDING",
      createdAt: queuedAt,
      startedAt: null,
      completedAt: null,
      vulnerabilities: [],
      report: {
        id: activeScenario.scan.report?.id ?? activeScenario.scan.id,
        createdAt: queuedAt,
        content:
          "Generating security assessment output. Findings and report sections will appear as the scan completes.",
      },
    };

    setIsSimulating(true);
    setSimulationProgress(0);
    setVisibleFindings(0);
    setElapsedSeconds(0);
    setEventLog([`${formatLogTimestamp(new Date())}  idle`]);
    setSimulationMessage(SIMULATION_STEPS[0].message);
    setSimulatedScan(baseScan);
    appendLogLine("initializing repository scan");

    intervalRef.current = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    SIMULATION_STEPS.forEach((step, index) => {
      const timeoutId = window.setTimeout(() => {
        setSimulationProgress(step.progress);
        setSimulationMessage(step.message);
        setVisibleFindings(step.visibleFindings);
        appendLogLine(step.logLine);
        setSimulatedScan((current) =>
          current
            ? {
                ...current,
                status: step.status,
                startedAt:
                  step.status === "RUNNING"
                    ? current.startedAt ?? new Date().toISOString()
                    : current.startedAt,
              }
            : current
        );

        if (index === SIMULATION_STEPS.length - 1) {
          const finishId = window.setTimeout(() => {
            const completedAt = new Date().toISOString();
            setSimulationProgress(100);
            setSimulationMessage("Scan complete. Findings and report ready.");
            setVisibleFindings(activeScenario.scan.vulnerabilities.length);
            appendLogLine("persisted validated findings and completed report");
            setSimulatedScan((current) => ({
              ...activeScenario.scan,
              createdAt: queuedAt,
              startedAt: current?.startedAt ?? queuedAt,
              completedAt,
            }));
            setIsSimulating(false);
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }, FINALIZE_DELAY_MS);
          timeoutRefs.current.push(finishId);
        }
      }, step.delayMs);

      timeoutRefs.current.push(timeoutId);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-5 px-6 py-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/60 p-6 shadow-xl backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Security scan and findings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Select a repository, start a scan, and review the report and validated findings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
              <Avatar className="h-9 w-9 border border-primary/20">
                <AvatarImage src={user?.avatarUrl || undefined} />
                <AvatarFallback>
                  {(user?.username || "GH").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{user?.username || "GitHub user"}</div>
                <div className="text-muted-foreground">
                  {liveRepositories.length || scenarios.length} repositories available
                </div>
              </div>
            </div>
            <Button variant="ghost" asChild>
              <a
                href={`https://github.com/${user?.username || "hampusbosson"}`}
                target="_blank"
                rel="noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <Card className="rounded-3xl border-border/60 bg-card/60 shadow-xl">
            <CardHeader>
              <CardTitle>Run scan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Repository</label>
                <div className="relative">
                  <FolderGit2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={selectedScenarioId}
                    onChange={(event) => setSelectedScenarioId(event.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm"
                  >
                    {scenarios.map((scenario) => (
                      <option key={scenario.id} value={scenario.id}>
                        {scenario.repository.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <LabeledValue
                    label="Visibility"
                    value={activeScenario.repository.private ? "Private" : "Public"}
                  />
                  <LabeledValue
                    label="Default branch"
                    value={activeScenario.repository.defaultBranch || "main"}
                  />
                  <LabeledValue
                    label="Primary language"
                    value={activeScenario.repository.primaryLanguage || "Unknown"}
                  />
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {activeScenario.repository.lastCommit
                    ? `Latest commit: ${activeScenario.repository.lastCommit}`
                    : activeScenario.description}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={startSimulation} disabled={isSimulating} className="min-w-44">
                  {isSimulating ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : simulatedScan ? (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {isSimulating ? "Running scan" : simulatedScan ? "Run new scan" : "Run scan"}
                </Button>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span className="text-muted-foreground">{simulationProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-primary via-primary to-accent transition-all duration-500"
                    style={{ width: `${simulationProgress}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {isSimulating
                      ? simulationMessage
                      : "Ready to start a repository security scan."}
                  </span>
                  <span>{formatElapsed(elapsedSeconds)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <TerminalSquare className="h-4 w-4 text-primary" />
                  Execution log
                </div>
                <div className="rounded-xl border border-border/50 bg-black/30 p-3 font-mono text-xs text-emerald-300">
                  <div className="mb-2 text-[11px] uppercase tracking-wide text-emerald-500/80">
                    scan.log
                  </div>
                  <div className="space-y-2">
                    {eventLog.length ? (
                      eventLog.map((entry, index) => <div key={`${entry}-${index}`}>{entry}</div>)
                    ) : (
                      <div>09:41:11  idle</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 bg-card/60 shadow-xl">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle>{activeScenario.repository.fullName}</CardTitle>
              </div>
              <Badge variant="outline" className={status.className}>
                <StatusIcon
                  className={`mr-2 h-4 w-4 ${
                    isSimulating && (scan.status === "PENDING" || scan.status === "RUNNING")
                      ? "animate-spin"
                      : ""
                  }`}
                />
                {status.label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Stat label="Created" value={formatTimestamp(scan.createdAt)} />
                <Stat label="Started" value={formatTimestamp(scan.startedAt)} />
                <Stat label="Completed" value={formatTimestamp(scan.completedAt)} />
                <Stat label="Findings" value={String(findingsToRender.length)} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <SeverityStat
                  label="Critical"
                  value={findingsToRender.filter((item) => item.severity === "CRITICAL").length}
                  severity="CRITICAL"
                />
                <SeverityStat
                  label="High"
                  value={findingsToRender.filter((item) => item.severity === "HIGH").length}
                  severity="HIGH"
                />
                <SeverityStat
                  label="Medium"
                  value={findingsToRender.filter((item) => item.severity === "MEDIUM").length}
                  severity="MEDIUM"
                />
                <SeverityStat
                  label="Low"
                  value={findingsToRender.filter((item) => item.severity === "LOW").length}
                  severity="LOW"
                />
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-primary" />
                  Report
                </div>
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                  {scan.report?.content || "No report content available."}
                </pre>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="rounded-3xl border-border/60 bg-card/60 shadow-xl">
            <CardHeader>
              <CardTitle>Findings</CardTitle>
            </CardHeader>
            <CardContent>
              {findingsToRender.length ? (
                <div className="space-y-4">
                  {findingsToRender.map((finding) => (
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
                            {finding.code && <Badge variant="outline">{finding.code}</Badge>}
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
                  {isSimulating
                    ? "Validated findings will appear here as the scan progresses."
                    : "Run a scan to populate findings for the selected repository."}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
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

const LabeledValue = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-border/50 bg-card/40 p-3">
    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="mt-2 text-sm font-medium">{value}</div>
  </div>
);

export default DemoPage;
