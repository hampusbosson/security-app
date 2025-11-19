import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LandingNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 glow-primary">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-gradient-mint">Sentra</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Docs
            </a>
            <a href="#demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Demo
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-sm">
              Sign In
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
              Start Free
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};