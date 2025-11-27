import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Finding } from "@/types/github";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FindingsTableProps {
  findings: Finding[];
}

const severityColors = {
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  High: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-primary/10 text-primary border-primary/20",
};

const statusColors = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  Resolved: "bg-success/10 text-success border-success/20",
};

export const FindingsTable = ({ findings }: FindingsTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-foreground mb-4">Security Findings</h2>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-muted-foreground">Severity</TableHead>
              <TableHead className="text-muted-foreground">Issue</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {findings.map((finding) => (
              <TableRow key={finding.id} className="border-border/50">
                <TableCell>
                  <Badge className={cn("text-xs", severityColors[finding.severity])}>
                    {finding.severity}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground">{finding.title}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {finding.filePath}:{finding.lineNumber}
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs", statusColors[finding.status])}>
                    {finding.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/dashboard/findings/${finding.id}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
