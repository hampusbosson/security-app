import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong glow-border mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-muted-foreground">
              Autonomous AI Security for Developers
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Secure your code before 
            attackers do.
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Sentra uses autonomous AI agents to find real vulnerabilities,
            validate them with PoCs, and open pull requests with secure fixes.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              size="lg"
              className="gap-2 px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary animate-glow-pulse"
            >
              <Sparkles className="w-5 h-5" />
              Start Free Scan
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 py-6 text-lg font-semibold glass-strong hover:glow-border"
            >
              <Play className="w-5 h-5" />
              View Demo
            </Button>
          </div>

          {/* Terminal Animation Preview */}
          <div
            className="mt-16 glass-strong rounded-2xl p-8 max-w-3xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>
            <div className="font-mono text-left space-y-2 text-sm">
              <div className="text-muted-foreground">
                <span className="text-primary">Agent:</span> scanning
                acme-corp/web-app...
              </div>
              <div className="text-muted-foreground">
                <span className="text-warning">Alert:</span> SQL injection
                vulnerability detected in auth.js:42
              </div>
              <div className="text-muted-foreground">
                <span className="text-accent">PoC:</span> validated with test
                exploit
              </div>
              <div className="text-muted-foreground">
                <span className="text-success">Fix:</span> PR #847 created with
                security patch
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
