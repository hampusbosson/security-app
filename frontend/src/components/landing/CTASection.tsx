import { Button } from "@/components/ui/button";
import { Sparkles, Calendar } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center glass-strong rounded-3xl p-12 glow-border">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Shift security left.
          </h2>
          <p className="text-2xl md:text-3xl text-gradient-mint font-bold mb-8">
            Automate your protection with Sentra.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="gap-2 px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
            >
              <Sparkles className="w-5 h-5" />
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 px-8 py-6 text-lg font-semibold glass hover:glow-border"
            >
              <Calendar className="w-5 h-5" />
              Book Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};