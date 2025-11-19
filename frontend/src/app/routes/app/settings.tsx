import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {  Check } from "lucide-react";
import { SiGithub } from "react-icons/si";


const DashboardSettingsPage = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your security workspace and integrations</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
          <CardDescription>Connect your GitHub account to monitor repositories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-success/30 bg-success/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <SiGithub className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Connected</p>
                <p className="text-sm text-muted-foreground">@security-team</p>
              </div>
            </div>
            <Check className="w-5 h-5 text-success" />
          </div>
          <Button variant="outline">Reconnect GitHub</Button>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your Sentra API keys for programmatic access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2 mt-2">
              <Input 
                id="api-key"
                type="password" 
                value="sk_live_••••••••••••••••••••••••" 
                readOnly
                className="font-mono"
              />
              <Button variant="outline">Copy</Button>
            </div>
          </div>
          <Button variant="outline">Generate New Key</Button>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive security alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Slack Integration</p>
              <p className="text-sm text-muted-foreground">Post alerts to Slack channel</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Discord Webhooks</p>
              <p className="text-sm text-muted-foreground">Send alerts to Discord server</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Critical Alerts Only</p>
              <p className="text-sm text-muted-foreground">Only notify for high-risk findings</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Scan Settings</CardTitle>
          <CardDescription>Configure automated security scans</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Automatic Scans</p>
              <p className="text-sm text-muted-foreground">Scan on every commit</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Auto-Fix PRs</p>
              <p className="text-sm text-muted-foreground">Automatically create fix pull requests</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Block Vulnerable Merges</p>
              <p className="text-sm text-muted-foreground">Prevent merging code with critical issues</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default DashboardSettingsPage;
