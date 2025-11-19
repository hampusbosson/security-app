import { Brain, CheckCircle, GitPullRequest, Lock, Bell, FileText } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Scanning",
    description: "Detects vulnerabilities dynamically, not just static analysis."
  },
  {
    icon: CheckCircle,
    title: "Proof-of-Concept Validation",
    description: "Every finding verified with real exploit."
  },
  {
    icon: GitPullRequest,
    title: "Auto-Fix PRs",
    description: "Generate secure patches instantly."
  },
  {
    icon: Lock,
    title: "CI/CD Integration",
    description: "Block unsafe merges automatically."
  },
  {
    icon: Bell,
    title: "Slack & GitHub Alerts",
    description: "Get notified before risk hits prod."
  },
  {
    icon: FileText,
    title: "Compliance Reports",
    description: "OWASP / SOC2 / ISO-ready exports."
  }
];

export const Features = () => {
  return (
    <section className="py-24 relative section-glow-center">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Modern security for  <span className="text-gradient-mint">modern teams</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass rounded-2xl p-6 hover:glow-border transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:glow-primary transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};