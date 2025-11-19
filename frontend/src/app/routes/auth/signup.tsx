import type React from "react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const SignupPage: React.FC = () => {
  const handleGithubSignup = () => {
    // TODO: Redirect to your backend GitHub OAuth endpoint
    // e.g. window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 section-grid">
      <div className="max-w-md w-full glass-strong rounded-2xl p-8 glow-border">
        {/* Logo / Product name */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
             <Shield className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">
            <span className="text-gradient-mint">Sign up</span> to Sentra
          </h1>
          <p className="text-sm text-muted-foreground">
            Connect your GitHub to start scanning your repositories with AI security agents.
          </p>
        </div>

        {/* GitHub CTA */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
            onClick={handleGithubSignup}
          >
            <SiGithub className="w-5 h-5" />
            Continue with GitHub
          </Button>
        </div>

        {/* Footnote */}
        <div className="mt-6 text-xs text-muted-foreground text-center space-y-2">
          <p>No passwords. No credit card required.</p>
          <p>
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-primary underline-offset-2 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary underline-offset-2 hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;