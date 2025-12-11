import type { ChildProcess } from "node:child_process";

const activeStrixProcesses = new Map<number, ChildProcess>(); // maps a scanId to its ChildProcess

export function registerStrixProcess(scanId: number, child: ChildProcess): void {
    activeStrixProcesses.set(scanId, child);
}

export function unregisterStrixProcess(scanId: number): void {
    activeStrixProcesses.delete(scanId);
}

export function stopStrixProcess(scanId: number): boolean {
    const child = activeStrixProcesses.get(scanId);
    if (!child) {
        return false; // no such process
    }

    // try to terminate the process
    child.kill("SIGTERM");

    setTimeout(() => {
        if (!child.killed) {
            child.kill("SIGKILL");
        }
    }, 10_000); // force kill after 10 seconds

    activeStrixProcesses.delete(scanId);
    return true;
}

