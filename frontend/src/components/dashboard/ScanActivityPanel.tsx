import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const scanLogs = [
  "[agent-01] scanning routes/auth.js...",
  "[agent-01] possible IDOR in GET /api/user/:id",
  "[agent-02] validating exploit...",
  "[agent-02] POC generated ✔",
  "[agent-03] preparing fix...",
  "[agent-03] PR draft ready ✔",
  "[agent-01] scanning middleware/cors.js...",
  "[agent-04] checking dependencies...",
  "[agent-04] vulnerable package detected: lodash@4.17.19",
];

export const ScanActivityPanel = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < scanLogs.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, scanLogs[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="glass rounded-xl p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">AI Agents at Work</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
      </div>

      <div className="bg-black/40 rounded-lg p-4 border border-primary/10 font-mono text-sm space-y-2 max-h-64 overflow-y-auto">
        {logs.map((log, index) => {
          const isSuccess = log.includes("✔");
          const isWarning = log.includes("possible") || log.includes("vulnerable");
          
          return (
            <div
              key={index}
              className={cn(
                "animate-fade-in opacity-0",
                isSuccess && "text-success",
                isWarning && "text-warning",
                !isSuccess && !isWarning && "text-primary"
              )}
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              {log}
            </div>
          );
        })}
        {currentIndex < scanLogs.length && (
          <div className="text-primary animate-pulse">▊</div>
        )}
      </div>
    </div>
  );
};