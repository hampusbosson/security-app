import { Shield, Github, FileText, Lock, MessageSquare } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "Changelog"],
  Resources: ["Documentation", "API Reference", "Blog", "Security"],
  Company: ["About", "Careers", "Contact", "Partners"],
  Legal: ["Privacy", "Terms", "Security Policy", "Compliance"]
};

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-gradient-mint">Sentra</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Autonomous AI Security for Developers
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <Github className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Sentra. Built on the open-source Strix engine.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Docs
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Lock className="w-4 h-4" />
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};