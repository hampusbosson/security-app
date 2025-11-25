import { Shield, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { GithubAPI } from "@/api";

export const EmptyDashboardState = () => {
  const handleInstallGitHub = () => {
    GithubAPI.installGithubApp();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="glass-strong rounded-2xl p-12 text-center max-w-2xl mx-auto glow-border">
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-2xl bg-primary/10 glow-primary">
            <Shield className="w-16 h-16 text-primary" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gradient mb-3">
          Connect GitHub to Get Started
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
          Install the GitHub App to scan repositories, detect vulnerabilities, and automate security fixes.
        </p>

        <Button 
          size="lg" 
          className="gap-2 glow-primary animate-glow-pulse bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mb-4"
          onClick={handleInstallGitHub}
        >
          <SiGithub className="w-5 h-5" />
          Install GitHub App
        </Button>

        <div className="mt-6">
          <a 
            href="https://docs.sentra.dev/github-integration" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
          >
            Learn how it works
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="mt-10 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">What happens after installation:</p>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-lg bg-secondary/50 glass">
              <p className="font-semibold text-sm text-foreground mb-1">🔍 Auto Scan</p>
              <p className="text-xs text-muted-foreground">Continuous repository analysis</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 glass">
              <p className="font-semibold text-sm text-foreground mb-1">🤖 AI Fixes</p>
              <p className="text-xs text-muted-foreground">Smart vulnerability patches</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 glass">
              <p className="font-semibold text-sm text-foreground mb-1">⚡ CI/CD Ready</p>
              <p className="text-xs text-muted-foreground">Secure before deployment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};