import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  FileCode,
  ChevronDown,
  ChevronRight,
  FileText,
  RefreshCw,
  Shield,
  Bug,
} from "lucide-react";

interface MockSummary {
  totalVulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  scanDuration: string;
}

interface MockVuln {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  filePath: string;
  lineNumber: number;
  description: string;
  remediation: string;
}

interface ScanResultPanelProps {
  repositoryName?: string;
  summary?: MockSummary;
  vulnerabilities?: MockVuln[];
  completedAt?: string;
  onRunNewScan?: () => void;
}

const defaultSummary: MockSummary = {
  totalVulnerabilities: 5,
  critical: 1,
  high: 2,
  medium: 1,
  low: 1,
  scanDuration: "1m 32s",
};

const defaultVulnerabilities: MockVuln[] = [
  {
    id: "vuln-1",
    severity: "CRITICAL",
    title: "Remote Code Execution via Deserialization",
    filePath: "src/utils/serializer.js",
    lineNumber: 45,
    description:
      "Untrusted data is passed to JSON.parse without validation, allowing arbitrary code execution.",
    remediation:
      "Validate and sanitize all input before deserialization. Use a safe JSON parser or implement strict schema validation with libraries like Zod or Joi.",
  },
  {
    id: "vuln-2",
    severity: "HIGH",
    title: "SQL Injection – user lookup",
    filePath: "src/routes/auth/login.js",
    lineNumber: 22,
    description:
      "User input is concatenated directly into SQL query without sanitization.",
    remediation:
      "Use parameterized queries or prepared statements. Never concatenate user input directly into SQL strings. Consider using an ORM like Prisma or Sequelize.",
  },
  {
    id: "vuln-3",
    severity: "HIGH",
    title: "Cross-Site Scripting (XSS) in Comments",
    filePath: "src/components/CommentBox.tsx",
    lineNumber: 67,
    description:
      "User-generated content is rendered without proper escaping, allowing script injection.",
    remediation:
      "Sanitize all user input before rendering. Use DOMPurify or similar library. Avoid dangerouslySetInnerHTML unless absolutely necessary.",
  },
  {
    id: "vuln-4",
    severity: "MEDIUM",
    title: "Sensitive Data Exposure in Logs",
    filePath: "src/middleware/logger.js",
    lineNumber: 15,
    description:
      "User passwords and tokens are being logged in plain text to console output.",
    remediation:
      "Implement log sanitization to mask sensitive fields. Use structured logging with field redaction. Never log credentials or tokens.",
  },
  {
    id: "vuln-5",
    severity: "LOW",
    title: "Missing Rate Limiting on API",
    filePath: "src/routes/api/index.js",
    lineNumber: 8,
    description:
      "API endpoints lack rate limiting, making them vulnerable to brute force attacks.",
    remediation:
      "Implement rate limiting middleware using express-rate-limit or similar. Consider different limits for authenticated vs unauthenticated requests.",
  },
];

const severityConfig = {
  CRITICAL: {
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: AlertCircle,
    glow: "shadow-red-500/20",
  },
  HIGH: {
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    icon: AlertTriangle,
    glow: "shadow-orange-500/20",
  },
  MEDIUM: {
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: AlertTriangle,
    glow: "shadow-yellow-500/20",
  },
  LOW: {
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Info,
    glow: "shadow-blue-500/20",
  },
};

export const ScanResultPanel = ({
  repositoryName = "acme-corp/frontend-app",
  summary = defaultSummary,
  vulnerabilities = defaultVulnerabilities,
  completedAt = "2025-12-10 14:32",
  onRunNewScan,
}: ScanResultPanelProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <Card className="glass-strong border-border/50 rounded-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <CardHeader className="border-b border-border/30 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {repositoryName}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Completed at: {completedAt}</span>
              </div>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 self-start sm:self-auto">
            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
            Scan Completed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Summary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="glass rounded-xl p-4 border border-border/30 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Bug className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {summary.totalVulnerabilities}
            </p>
          </div>

          <div className="glass rounded-xl p-4 border border-red-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Critical
              </span>
            </div>
            <p className="text-2xl font-bold text-red-400">{summary.critical}</p>
          </div>

          <div className="glass rounded-xl p-4 border border-orange-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                High
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-400">{summary.high}</p>
          </div>

          <div className="glass rounded-xl p-4 border border-yellow-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Medium
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{summary.medium}</p>
          </div>

          <div className="glass rounded-xl p-4 border border-blue-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Info className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Low
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{summary.low}</p>
          </div>

          <div className="glass rounded-xl p-4 border border-border/30 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Duration
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {summary.scanDuration}
            </p>
          </div>
        </div>

        {/* Vulnerability List */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Vulnerabilities Detected
          </h3>

          <div className="space-y-2">
            {vulnerabilities.map((vuln) => {
              const config = severityConfig[vuln.severity];
              const SeverityIcon = config.icon;
              const isExpanded = expandedItems.has(vuln.id);

              return (
                <Collapsible
                  key={vuln.id}
                  open={isExpanded}
                  onOpenChange={() => toggleExpanded(vuln.id)}
                >
                  <div
                    className={`glass rounded-xl border border-border/30 overflow-hidden transition-all duration-200 hover:border-border/50 ${
                      isExpanded ? "shadow-lg " + config.glow : ""
                    }`}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="p-4 flex items-start gap-4 cursor-pointer">
                        <div
                          className={`p-2 rounded-lg ${config.color} border shrink-0`}
                        >
                          <SeverityIcon className="h-4 w-4" />
                        </div>

                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={`${config.color} border text-xs font-mono`}
                            >
                              {vuln.severity}
                            </Badge>
                            <h4 className="font-medium text-foreground truncate">
                              {vuln.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileCode className="h-3.5 w-3.5 shrink-0" />
                            <code className="font-mono text-xs truncate">
                              {vuln.filePath}:{vuln.lineNumber}
                            </code>
                          </div>
                        </div>

                        <div className="shrink-0 text-muted-foreground">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 pt-0 border-t border-border/20 mt-0">
                        <div className="pt-4 space-y-4">
                          <div>
                            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                              Description
                            </h5>
                            <p className="text-sm text-foreground/80">
                              {vuln.description}
                            </p>
                          </div>
                          <div className="glass rounded-lg p-4 border border-primary/20 bg-primary/5">
                            <h5 className="text-xs font-medium text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <CheckCircle className="h-3.5 w-3.5" />
                              Remediation
                            </h5>
                            <p className="text-sm text-foreground/80">
                              {vuln.remediation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/30">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none border-border/50 hover:bg-secondary/50"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Raw Report
          </Button>
          <Button
            onClick={onRunNewScan}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Run New Scan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResultPanel;