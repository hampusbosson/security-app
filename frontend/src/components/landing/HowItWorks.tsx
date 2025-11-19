import { Cpu, GitPullRequest } from "lucide-react";
import { SiGithub } from "react-icons/si";

const steps = [
  {
    icon: SiGithub,
    title: "Connect GitHub",
    description: "OAuth + GitHub App. Select which repos to protect.",
    step: "01"
  },
  {
    icon: Cpu,
    title: "AI Security Agents Run",
    description: "Each agent is sandboxed, dynamically testing your repo's code and endpoints for vulnerabilities.",
    step: "02"
  },
  {
    icon: GitPullRequest,
    title: "Fixes Generated Automatically",
    description: "Sentra summarizes issues, explains the risks, and creates pull requests with patch code.",
    step: "03"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Security automation in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="glass-strong rounded-2xl p-8 hover:glow-border transition-all duration-300 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-4 rounded-xl bg-primary/10 glow-primary">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-5xl font-bold text-primary/20 font-mono">{step.step}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};