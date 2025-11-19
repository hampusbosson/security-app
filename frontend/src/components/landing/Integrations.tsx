import { GitBranch, MessageSquare, Cloud, Sparkles, Package } from "lucide-react";
import { SiGithub } from "react-icons/si";

const integrations = [
  { name: "GitHub", icon: SiGithub },
  { name: "GitLab", icon: GitBranch },
  { name: "Slack", icon: MessageSquare },
  { name: "AWS", icon: Cloud },
  { name: "OpenAI", icon: Sparkles },
  { name: "Docker", icon: Package },
];

export const Integrations = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Connect your stack — Sentra fits where you work
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {integrations.map((integration, index) => (
            <div 
              key={index}
              className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:glow-border transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <integration.icon className="w-10 h-10 text-primary group-hover:text-accent transition-colors" />
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {integration.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};