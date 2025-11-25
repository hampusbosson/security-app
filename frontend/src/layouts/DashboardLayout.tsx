import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { EmptyDashboardState } from "@/components/dashboard/EmptyState";
import { useEffect } from "react";

export const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading, refreshUser } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("installed") === "true") {
      refreshUser();
      // Remove param from URL
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [refreshUser]);

  if (loading) {
    return (
      <div className="p-10 text-center text-muted-foreground">Loading...</div>
    );
  }

  const githubInstalled = user?.installations && user.installations.length > 0;

  console.log("user object:", user);
  console.log("User installations:", user?.installations);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <TopBar />

        <main className="container mx-auto px-6 py-8">
          {githubInstalled ? <Outlet /> : <EmptyDashboardState />}
        </main>
      </div>
    </div>
  );
};
