import { Button } from "@/components/ui/button";
import { AuthAPI } from "@/api";
import { Shield, Search, FileWarning } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              GitHub security scanning
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight">
                Run security scans on GitHub repositories and review findings in one place.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Connect your GitHub account, choose a repository, run a scan,
                and inspect the validated findings and final report in a
                focused security workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => AuthAPI.loginUser("/demo")}>
                Get started
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">Sign in with GitHub</Link>
              </Button>
            </div>
          </section>

          <section className="grid gap-4 rounded-3xl border border-border/60 bg-card/60 p-6 shadow-xl backdrop-blur">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
              <Search className="mb-3 h-5 w-5 text-primary" />
              <h2 className="mb-1 text-lg font-medium">Run scan</h2>
              <p className="text-sm text-muted-foreground">
                Start a repository scan and monitor progress from a dedicated workspace.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
              <FileWarning className="mb-3 h-5 w-5 text-primary" />
              <h2 className="mb-1 text-lg font-medium">Review findings</h2>
              <p className="text-sm text-muted-foreground">
                Inspect severity, remediation guidance, and the final security report.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
