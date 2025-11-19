import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DashboardPreview = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Command Center Dashboard</h2>
          <p className="text-xl text-muted-foreground">Security insights at a glance</p>
        </div>

        <div className="max-w-6xl mx-auto glass-strong rounded-3xl p-2 glow-border animate-fade-in">
          {/* Dashboard Mockup */}
          <div className="bg-background rounded-2xl overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="text-xs text-muted-foreground font-mono">sentra.dev/dashboard</div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 px-6 pt-4 border-b border-border/50">
              <button className="text-sm font-semibold text-primary border-b-2 border-primary pb-3">Overview</button>
              <button className="text-sm text-muted-foreground hover:text-foreground pb-3">Findings</button>
              <button className="text-sm text-muted-foreground hover:text-foreground pb-3">PRs</button>
              <button className="text-sm text-muted-foreground hover:text-foreground pb-3">Trends</button>
            </div>

            {/* Content */}
            <div className="p-6 grid md:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground font-semibold mb-2">REPOSITORIES</div>
                {["web-app", "api-service", "mobile-app"].map((repo) => (
                  <div key={repo} className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary text-sm font-mono">
                    {repo}
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="md:col-span-3 space-y-4">
                {/* Risk Score */}
                <div className="glass rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Security Score</div>
                    <div className="text-3xl font-bold text-success">A+</div>
                  </div>
                  <Button className="gap-2 bg-primary hover:bg-primary/90 glow-primary">
                    <Sparkles className="w-4 h-4" />
                    Generate Fix
                  </Button>
                </div>

                {/* Vulnerabilities Table */}
                <div className="glass rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50 text-left">
                      <tr>
                        <th className="p-3 font-semibold">Type</th>
                        <th className="p-3 font-semibold">Severity</th>
                        <th className="p-3 font-semibold">File</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-xs">
                      <tr className="border-t border-border/50">
                        <td className="p-3">SQL Injection</td>
                        <td className="p-3"><span className="px-2 py-1 rounded-full bg-destructive/20 text-destructive">High</span></td>
                        <td className="p-3 text-muted-foreground">auth.js:42</td>
                        <td className="p-3"><span className="px-2 py-1 rounded-full bg-success/20 text-success">PR Created</span></td>
                      </tr>
                      <tr className="border-t border-border/50">
                        <td className="p-3">XSS</td>
                        <td className="p-3"><span className="px-2 py-1 rounded-full bg-warning/20 text-warning">Medium</span></td>
                        <td className="p-3 text-muted-foreground">profile.tsx:128</td>
                        <td className="p-3"><span className="px-2 py-1 rounded-full bg-primary/20 text-primary">In Progress</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};