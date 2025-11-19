import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitPullRequest, ExternalLink, Check, X, Clock } from "lucide-react";

interface PR {
  id: string;
  title: string;
  repo: string;
  status: "pending" | "open" | "merged" | "failing";
  createdAt: string;
  description: string;
}

const pullRequests: PR[] = [
  {
    id: "1",
    title: "Fix: SQL Injection in user query",
    repo: "api-backend",
    status: "open",
    createdAt: "2 hours ago",
    description: "Prevents SQL injection by using parameterized queries in user authentication endpoint."
  },
  {
    id: "2",
    title: "Fix: XSS vulnerability in comment rendering",
    repo: "web-app",
    status: "merged",
    createdAt: "1 day ago",
    description: "Sanitizes user input before rendering HTML in comment component."
  },
  {
    id: "3",
    title: "Fix: IDOR in authorization middleware",
    repo: "api-backend",
    status: "pending",
    createdAt: "3 hours ago",
    description: "Adds proper authorization checks to prevent unauthorized access to user resources."
  },
  {
    id: "4",
    title: "Security: Update vulnerable dependencies",
    repo: "webhook-service",
    status: "failing",
    createdAt: "5 hours ago",
    description: "Updates lodash and other packages with known security vulnerabilities."
  },
];

const statusConfig = {
  pending: { icon: Clock, color: "bg-muted text-muted-foreground", label: "Pending" },
  open: { icon: GitPullRequest, color: "bg-info/10 text-info border-info/30", label: "Open" },
  merged: { icon: Check, color: "bg-success/10 text-success border-success/30", label: "Merged" },
  failing: { icon: X, color: "bg-destructive/10 text-destructive border-destructive/30", label: "Failing Checks" },
};

const PullRequestsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Auto-Generated Pull Requests</h1>
        <p className="text-muted-foreground mt-1">Security fixes automatically created by Sentra AI agents</p>
      </div>

      <div className="flex items-center gap-3">
        <Badge className="bg-info/10 text-info border-info/30">
          2 Open
        </Badge>
        <Badge className="bg-success/10 text-success border-success/30">
          24 Merged
        </Badge>
        <Badge className="bg-muted text-muted-foreground">
          1 Pending Review
        </Badge>
      </div>

      <div className="space-y-4">
        {pullRequests.map((pr) => {
          const StatusIcon = statusConfig[pr.status].icon;
          
          return (
            <Card key={pr.id} className="glass hover:bg-card/60 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <GitPullRequest className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{pr.title}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <span className="font-mono text-xs">{pr.repo}</span>
                      <span>•</span>
                      <span>{pr.createdAt}</span>
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={statusConfig[pr.status].color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig[pr.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{pr.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View on GitHub
                  </Button>
                  {pr.status === "pending" && (
                    <Button size="sm" className="gap-2 glow-primary">
                      <Check className="w-4 h-4" />
                      Approve & Merge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PullRequestsPage;