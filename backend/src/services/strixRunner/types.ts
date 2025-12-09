export type StrixVulnerability = {
  id: string; // vuln-0001
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  remediation: string;
  filePath?: string;
};

export type StrixScanResult = {
  summary: string; // from penetration_test_report.md
  vulnerabilities: StrixVulnerability[];
};