import { Bell, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export const TopBar = () => {
  const { user } = useAuth();

  const githubAvatarUrl = user?.avatarUrl || undefined;

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border/50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Security Workspace</h2>
            <p className="text-xs text-muted-foreground">3 repositories monitored</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button className="glow-primary gap-2" size="sm">
            <Play className="w-4 h-4" />
            Run Scan
          </Button>
          
          <Button variant="ghost" size="icon" className="relative hover:bg-secondary">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
              3
            </Badge>
          </Button>

          <Avatar className="w-8 h-8 border-2 border-primary/20 cursor-pointer hover:border-primary/50 transition-colors">
            <AvatarImage src={githubAvatarUrl} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};