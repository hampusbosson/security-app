import {
  Shield,
  AlertTriangle,
  GitPullRequest,
  CheckCircle,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { FindingsTable } from "@/components/dashboard/FindingsTable";
import { ScanActivityPanel } from "@/components/dashboard/ScanActivityPanel";
import { VulnerabilityChart } from "@/components/VulnerabilityChart";

const DashboardPage = () => {

  return (
    <div className="space-y-6">
      {/* Security Score Hero Card */}
      <div className="glass-strong rounded-2xl p-8 border-2 border-primary/20 glow-primary animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-primary/10">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Overall Security Score
                </h2>
                <p className="text-sm text-muted-foreground">
                  Last scan: 5 minutes ago
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold text-gradient mb-2">87</div>
            <div className="px-4 py-1.5 rounded-full bg-success/10 border border-success/30 text-success text-sm font-semibold">
              Good
            </div>
          </div>
        </div>

        <div className="mt-6 w-full bg-muted/30 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-success via-primary to-primary transition-all duration-500 glow-primary"
            style={{ width: "87%" }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Repositories"
          value="12"
          icon={Shield}
          trend="+2 this week"
        />
        <StatCard
          title="New Findings"
          value="8"
          icon={AlertTriangle}
          trend="3 critical"
          variant="warning"
        />
        <StatCard
          title="Auto-Fixed PRs"
          value="24"
          icon={GitPullRequest}
          trend="18 merged"
          variant="success"
        />
        <StatCard
          title="Issues Resolved"
          value="156"
          icon={CheckCircle}
          trend="95% fix rate"
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VulnerabilityChart />
        <ScanActivityPanel />
      </div>

      {/* Recent Findings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">Recent Findings</h3>
          <span className="text-sm text-muted-foreground">Last 24 hours</span>
        </div>
        <FindingsTable />
      </div>
    </div>
  );
};

export default DashboardPage;
