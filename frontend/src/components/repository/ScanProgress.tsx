import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

type ScanState = "scanning" | "completed" | "failed";

interface LogEntry {
  agent: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: Date;
}

const mockLogMessages = [
  { agent: "agent-01", message: "initializing security scan...", type: "info" as const },
  { agent: "agent-01", message: "scanning src/routes/auth.js...", type: "info" as const },
  { agent: "agent-01", message: "possible IDOR in GET /api/user/:id", type: "warning" as const },
  { agent: "agent-02", message: "validating exploit...", type: "info" as const },
  { agent: "agent-02", message: "proof of concept generated ✓", type: "success" as const },
  { agent: "agent-03", message: "reviewing dependency tree...", type: "info" as const },
  { agent: "agent-03", message: "found vulnerable package: lodash@4.17.19", type: "warning" as const },
  { agent: "agent-04", message: "checking input sanitization patterns...", type: "info" as const },
  { agent: "agent-01", message: "scanning src/controllers/payment.ts...", type: "info" as const },
  { agent: "agent-04", message: "XSS vulnerability detected in user input field", type: "error" as const },
  { agent: "agent-02", message: "analyzing authentication flow...", type: "info" as const },
  { agent: "agent-02", message: "JWT token validation secure ✓", type: "success" as const },
  { agent: "agent-03", message: "checking for SQL injection patterns...", type: "info" as const },
  { agent: "agent-01", message: "scanning src/middleware/cors.js...", type: "info" as const },
  { agent: "agent-03", message: "parameterized queries verified ✓", type: "success" as const },
  { agent: "agent-04", message: "finalizing vulnerability report...", type: "info" as const },
];

interface ScanProgressProps {
  isScanning: boolean;
  onScanComplete?: () => void;
  onRetry?: () => void;
  onViewReport?: () => void;
}

export const ScanProgress = ({ 
  isScanning, 
  onScanComplete, 
  onRetry,
  onViewReport 
}: ScanProgressProps) => {
  const [state, setState] = useState<ScanState>("scanning");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLogExpanded, setIsLogExpanded] = useState(true);
  const [vulnerabilityCount, setVulnerabilityCount] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScanning) {
      setLogs([]);
      setProgress(0);
      setState("scanning");
      return;
    }

    let logIndex = 0;
    let vulnCount = 0;

    const logInterval = setInterval(() => {
      if (logIndex < mockLogMessages.length) {
        const mockLog = mockLogMessages[logIndex];
        const newLog: LogEntry = {
          ...mockLog,
          timestamp: new Date(),
        };
        setLogs(prev => [...prev, newLog]);
        
        if (mockLog.type === "warning" || mockLog.type === "error") {
          vulnCount++;
          setVulnerabilityCount(vulnCount);
        }
        
        setProgress(Math.min(((logIndex + 1) / mockLogMessages.length) * 100, 95));
        logIndex++;
      }
    }, 800);

    const completionTimeout = setTimeout(() => {
      clearInterval(logInterval);
      setProgress(100);
      
      // 90% success, 10% failure
      const success = Math.random() > 0.1;
      setState(success ? "completed" : "failed");
      onScanComplete?.();
    }, mockLogMessages.length * 800 + 1000);

    return () => {
      clearInterval(logInterval);
      clearTimeout(completionTimeout);
    };
  }, [isScanning, onScanComplete]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success": return "text-success";
      case "warning": return "text-warning";
      case "error": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getAgentColor = (agent: string) => {
    const colors = [
      "text-primary",
      "text-accent",
      "text-info",
      "text-success",
    ];
    const index = parseInt(agent.replace("agent-0", "")) - 1;
    return colors[index % colors.length];
  };

  if (!isScanning && logs.length === 0) return null;

  return (
    <Card className="glass-strong rounded-2xl border-border/50 animate-fade-in overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {state === "scanning" && (
              <>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Security Scan in Progress…
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">
                    Sentra is analyzing your code. This may take a few minutes.
                  </p>
                </div>
              </>
            )}
            
            {state === "completed" && (
              <>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-success">
                    Scan Completed
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">
                    Sentra identified {vulnerabilityCount} potential vulnerabilities.
                  </p>
                </div>
              </>
            )}
            
            {state === "failed" && (
              <>
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-destructive">
                    Scan Failed
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">
                    Sentra could not complete the scan. Please try again.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {state === "completed" && (
              <Button 
                onClick={onViewReport}
                className="glow-border hover:glow-primary transition-all"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Report
              </Button>
            )}
            
            {state === "failed" && (
              <Button 
                onClick={onRetry}
                variant="destructive"
                className="hover:shadow-lg hover:shadow-destructive/20 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Scan
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {state === "scanning" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-linear-to-r from-primary to-accent rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute inset-y-0 left-0 bg-linear-to-r from-primary/50 to-accent/50 rounded-full animate-pulse"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Log Panel Toggle */}
        <button
          onClick={() => setIsLogExpanded(!isLogExpanded)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          {isLogExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span className="font-mono">Agent Logs</span>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full ml-auto">
            {logs.length} entries
          </span>
        </button>

        {/* Terminal Log Panel */}
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          isLogExpanded ? "max-h-80" : "max-h-0"
        )}>
          <div 
            ref={logContainerRef}
            className="bg-background/80 rounded-xl border border-border/50 p-4 font-mono text-sm max-h-72 overflow-y-auto"
          >
            {logs.length === 0 ? (
              <div className="text-muted-foreground flex items-center gap-2">
                <span className="animate-pulse">▊</span>
                <span>Waiting for scan to start...</span>
              </div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <span className={cn("shrink-0", getAgentColor(log.agent))}>
                      [{log.agent}]
                    </span>
                    <span className={getLogColor(log.type)}>
                      {log.message}
                    </span>
                  </div>
                ))}
                {state === "scanning" && (
                  <div className="flex gap-2 items-center text-muted-foreground">
                    <span className="animate-pulse">▊</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
