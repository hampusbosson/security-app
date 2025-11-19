import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "danger" | "success" | "warning";
  className?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = "default",
  className 
}: StatCardProps) => {
  const variantStyles = {
    default: "border-border",
    danger: "border-destructive/30 bg-destructive/5",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
  };

  return (
    <div className={cn(
      "glass rounded-xl p-6 border-2 hover:scale-105 transition-all duration-300 animate-fade-in",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && (
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-mono">
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};