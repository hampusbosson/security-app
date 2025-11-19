import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Finding {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  repo: string;
  file: string;
  status: "found" | "validated" | "fix-ready";
}

const findings: Finding[] = [
  { id: "1", severity: "critical", type: "SQL Injection", repo: "api-backend", file: "routes/users.js", status: "fix-ready" },
  { id: "2", severity: "high", type: "XSS", repo: "web-app", file: "components/Comment.tsx", status: "validated" },
  { id: "3", severity: "high", type: "IDOR", repo: "api-backend", file: "controllers/auth.js", status: "fix-ready" },
  { id: "4", severity: "medium", type: "SSRF", repo: "webhook-service", file: "handlers/fetch.js", status: "found" },
  { id: "5", severity: "low", type: "Info Disclosure", repo: "web-app", file: "config/env.js", status: "validated" },
];

const severityColors = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-warning/10 text-warning border-warning/30",
  medium: "bg-info/10 text-info border-info/30",
  low: "bg-muted text-muted-foreground border-border",
};

const statusColors = {
  found: "bg-muted text-muted-foreground",
  validated: "bg-info/10 text-info border-info/30",
  "fix-ready": "bg-success/10 text-success border-success/30",
};

export const FindingsTable = () => {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Severity
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Repository
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                File
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {findings.map((finding) => (
              <tr key={finding.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4">
                  <Badge className={cn("uppercase font-mono text-xs", severityColors[finding.severity])}>
                    {finding.severity}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">{finding.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground font-mono">{finding.repo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-muted-foreground font-mono">{finding.file}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={cn("text-xs capitalize", statusColors[finding.status])}>
                    {finding.status.replace("-", " ")}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                    View <ArrowRight className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};