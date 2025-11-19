import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Sentra caught vulnerabilities our team missed. The AI agents are like having a security expert on every PR.",
    author: "Alex Chen",
    role: "CTO, TechCorp",
    avatar: "AC"
  },
  {
    quote: "Auto-fix PRs saved us countless hours. Security is no longer a bottleneck in our deployment pipeline.",
    author: "Sarah Martinez",
    role: "Lead Developer, StartupXYZ",
    avatar: "SM"
  },
  {
    quote: "The PoC validation is a game-changer. No more false positives wasting our time.",
    author: "David Kim",
    role: "Security Engineer, Enterprise Co",
    avatar: "DK"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2">TRUSTED BY DEVELOPERS</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Securing 1,000+ repositories worldwide
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="glass rounded-2xl p-6 hover:glow-border transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};