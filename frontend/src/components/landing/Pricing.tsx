import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out Sentra",
    features: [
      "1 repository",
      "Weekly scans",
      "Basic vulnerability detection",
      "Community support"
    ],
    cta: "Start Free",
    highlighted: false
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For individual developers",
    features: [
      "Unlimited scans",
      "PR comments & reviews",
      "Slack alerts",
      "Priority support",
      "Advanced AI detection"
    ],
    cta: "Get Pro",
    highlighted: true
  },
  {
    name: "Team",
    price: "$99",
    period: "/mo",
    description: "For growing teams",
    features: [
      "Everything in Pro",
      "Auto-fix pull requests",
      "CI/CD integration",
      "Analytics dashboard",
      "Team collaboration"
    ],
    cta: "Get Team",
    highlighted: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Custom runners",
      "Compliance reports",
      "Dedicated support",
      "SLA guarantees",
      "Custom integrations"
    ],
    cta: "Contact Sales",
    highlighted: false
  }
];

export const Pricing = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground">Choose the plan that fits your needs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-2xl p-8 transition-all duration-300 animate-fade-in ${
                plan.highlighted 
                  ? 'glass-strong glow-border scale-105' 
                  : 'glass hover:glow-border'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </div>

              <Button 
                className={`w-full mb-6 ${
                  plan.highlighted 
                    ? 'bg-primary hover:bg-primary/90 glow-primary' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};