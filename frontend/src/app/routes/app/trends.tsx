import { VulnerabilityChart } from "@/components/VulnerabilityChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const severityData = [
  { name: "Critical", value: 8, color: "hsl(var(--destructive))" },
  { name: "High", value: 15, color: "hsl(var(--warning))" },
  { name: "Medium", value: 23, color: "hsl(var(--info))" },
  { name: "Low", value: 12, color: "hsl(var(--muted-foreground))" },
];

const prMergeData = [
  { month: "Jan", merged: 12, pending: 3 },
  { month: "Feb", merged: 18, pending: 2 },
  { month: "Mar", merged: 24, pending: 4 },
  { month: "Apr", merged: 20, pending: 1 },
  { month: "May", merged: 28, pending: 2 },
  { month: "Jun", merged: 32, pending: 3 },
];

const TrendsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security Trends & Analytics</h1>
        <p className="text-muted-foreground mt-1">Track vulnerability patterns and remediation metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VulnerabilityChart />
        
        <Card className="glass">
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>Breakdown by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => entry.name}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    color: 'hsl(var(--foreground))',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Pull Request Activity</CardTitle>
          <CardDescription>Auto-fix PRs created and merged over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prMergeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend />
              <Bar dataKey="merged" fill="hsl(var(--success))" name="Merged" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pending" fill="hsl(var(--warning))" name="Pending" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-2xl">2.4 days</CardTitle>
            <CardDescription>Mean Time to Remediate (MTTR)</CardDescription>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-2xl">94%</CardTitle>
            <CardDescription>Auto-fix Success Rate</CardDescription>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-2xl">156</CardTitle>
            <CardDescription>Total Issues Resolved</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default TrendsPage;
