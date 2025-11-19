import { Shield, LayoutDashboard, FolderGit2, AlertTriangle, GitPullRequest, TrendingUp, Settings, ChevronLeft } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const navItems = [
  { title: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Repositories", icon: FolderGit2, path: "/dashboard/repositories" },
  { title: "Findings", icon: AlertTriangle, path: "/dashboard/findings" },
  { title: "Pull Requests", icon: GitPullRequest, path: "/dashboard/pull-requests" },
  { title: "Trends", icon: TrendingUp, path: "/dashboard/trends" },
  { title: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export const Sidebar = ({ collapsed = false, onToggle }: SidebarProps) => {
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen glass-strong border-r border-border/50 transition-all duration-300 z-40 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 glow-primary">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gradient">Sentra</h1>
              <p className="text-xs text-muted-foreground">AI Copilot</p>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="hover:bg-secondary"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-secondary/50",
              collapsed && "justify-center"
            )}
            activeClassName="bg-primary/10 text-primary border border-primary/20 glow-primary"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border/50">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <Avatar className="w-8 h-8 border-2 border-primary/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Security Team</p>
              <p className="text-xs text-muted-foreground truncate">Workspace</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};