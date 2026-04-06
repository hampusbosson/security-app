import fs from "node:fs";
import path from "node:path";
import type { StrixScanResult, StrixVulnerability } from "./types";

export function parseStrixOutput(runDir: string): StrixScanResult {
  const reportPath = path.join(runDir, "penetration_test_report.md");
  const vulnDir = path.join(runDir, "vulnerabilities");

  const summary = fs.existsSync(reportPath)
    ? fs.readFileSync(reportPath, "utf8")
    : "";

  const vulnerabilities: StrixVulnerability[] = [];

  if (fs.existsSync(vulnDir)) {
    const files = fs.readdirSync(vulnDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const content = fs.readFileSync(path.join(vulnDir, file), "utf8");
      vulnerabilities.push(parseSingleVulnMarkdown(file, content));
    }
  }

  return { summary, vulnerabilities };
}

function parseMarkdownSections(markdown: string): {
  description?: string;
  remediation?: string;
} {
  const sections: Record<string, string> = {};

  const regex =
    /\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*.+?\*\*|\Z)/g;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(markdown))) {
    const heading = match[1].trim().toLowerCase();
    const body = match[2].trim();

    sections[heading] = body;
  }

  return {
    description:
      sections["description"] ??
      sections["details"] ??
      sections["overview"],
    remediation:
      sections["remediation"] ??
      sections["mitigation"] ??
      sections["fix"],
  };
}

function parseSingleVulnMarkdown(
  fileName: string,
  content: string
): StrixVulnerability {
  const idMatch = content.match(/\*\*ID:\*\*\s*(.+)/);
  const severityMatch = content.match(/\*\*Severity:\*\*\s*(.+)/);
  const titleMatch = content.match(/^#\s+(.+)/m);

  const sections = parseMarkdownSections(content);

  return {
    id: idMatch?.[1]?.trim() ?? fileName.replace(".md", ""),
    severity: (severityMatch?.[1]?.trim().toUpperCase() ??
      "MEDIUM") as StrixVulnerability["severity"],
    title: titleMatch?.[1]?.trim() ?? fileName,
    description: sections.description ?? content,
    remediation: sections.remediation ?? "",
  };
}
