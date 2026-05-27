#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const LEGACY_LINK_PATTERNS = [
  { pattern: /https?:\/\/r\.sveir\.xyz[^\s)`]*/i, label: "旧 CDN 链接" },
  { pattern: /https?:\/\/t\.me\/sve1r[^\s)`]*/i, label: "旧 Telegram 链接" },
  { pattern: /https?:\/\/[^/\s)`]*rules-for-qx\.sveir[^\s)`]*/i, label: "旧规则域名链接" },
  {
    pattern: /https?:\/\/raw\.githubusercontent\.com\/sve1r\/Rules-For-Quantumult-X[^\s)`]*/i,
    label: "旧 GitHub Raw 仓库链接",
  },
  {
    pattern: /https?:\/\/cdn\.jsdelivr\.net\/gh\/sve1r\/Rules-For-Quantumult-X[^\s)`]*/i,
    label: "旧 jsDelivr 仓库链接",
  },
];
const DEFAULT_LEGACY_EXCLUDE_PREFIXES = ["tools/fixtures/", "docs/superpowers/"];

function toPosix(filePath) {
  return filePath.replaceAll(path.sep, "/");
}

function getTrackedFiles(rootDir) {
  const output = execFileSync("git", ["-c", "core.quotepath=false", "ls-files"], {
    cwd: rootDir,
    encoding: "utf8",
  });
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .sort();
}

function readTrackedTextFiles(rootDir, trackedFiles) {
  const files = new Map();
  for (const file of trackedFiles) {
    const absolutePath = path.join(rootDir, file);
    const content = fs.readFileSync(absolutePath);
    if (content.includes(0)) {
      continue;
    }
    files.set(file, content.toString("utf8"));
  }
  return files;
}

function parseReadmeIndex(readmeText) {
  const files = [];
  const seen = new Set();
  const countMatch = readmeText.match(/覆盖\s+(\d+)\s+个文件/);

  for (const line of readmeText.split(/\r?\n/)) {
    const match = line.match(/^\|\s+`([^`]+)`\s+\|/);
    if (!match || seen.has(match[1])) {
      continue;
    }
    seen.add(match[1]);
    files.push(match[1]);
  }

  return {
    files: new Set(files),
    declaredCount: countMatch ? Number(countMatch[1]) : null,
  };
}

function checkReadmeIndex({ trackedFiles, readmeText }) {
  const indexed = parseReadmeIndex(readmeText);
  const tracked = new Set(trackedFiles);
  const missing = trackedFiles.filter((file) => !indexed.files.has(file));
  const stale = [...indexed.files].filter((file) => !tracked.has(file)).sort();
  const expectedCount = trackedFiles.length;
  const countMatches = indexed.declaredCount === expectedCount;

  return {
    ok: missing.length === 0 && stale.length === 0 && countMatches,
    missing,
    stale,
    expectedCount,
    declaredCount: indexed.declaredCount,
  };
}

function shouldSkipLegacyFile(file) {
  return DEFAULT_LEGACY_EXCLUDE_PREFIXES.some((prefix) => file.startsWith(prefix)) || file.endsWith(".test.js");
}

function isAllowedReadmeLegacyLine(file, line) {
  return file === "README.md" && line.includes("不再推荐旧仓库");
}

function findLegacyLinks(files) {
  const findings = [];

  for (const [file, content] of files.entries()) {
    const relativeFile = toPosix(file);
    if (shouldSkipLegacyFile(relativeFile)) {
      continue;
    }

    content.split(/\r?\n/).forEach((line, index) => {
      if (isAllowedReadmeLegacyLine(relativeFile, line)) {
        return;
      }

      for (const item of LEGACY_LINK_PATTERNS) {
        const match = line.match(item.pattern);
        if (!match) {
          continue;
        }
        findings.push({
          file: relativeFile,
          line: index + 1,
          label: item.label,
          value: match[0],
        });
      }
    });
  }

  return findings;
}

function formatMaintenanceReport(report) {
  const lines = ["仓库维护检查报告", ""];
  lines.push(`旧链接: ${report.legacyLinks.length}`);
  lines.push(`README 索引缺失: ${report.readmeIndex.missing.length}`);
  lines.push(`README 索引陈旧: ${report.readmeIndex.stale.length}`);
  lines.push(`README 索引声明数量: ${report.readmeIndex.declaredCount ?? "未声明"}`);
  lines.push(`版本管理文件数量: ${report.readmeIndex.expectedCount}`);

  if (report.legacyLinks.length > 0) {
    lines.push("", "旧链接明细:");
    for (const item of report.legacyLinks) {
      lines.push(`- ${item.file}:${item.line} ${item.label} ${item.value}`);
    }
  }

  if (report.readmeIndex.missing.length > 0) {
    lines.push("", "README 索引缺失:");
    for (const file of report.readmeIndex.missing) {
      lines.push(`- ${file}`);
    }
  }

  if (report.readmeIndex.stale.length > 0) {
    lines.push("", "README 索引陈旧:");
    for (const file of report.readmeIndex.stale) {
      lines.push(`- ${file}`);
    }
  }

  return lines.join("\n");
}

function buildMaintenanceReport(rootDir) {
  const trackedFiles = getTrackedFiles(rootDir);
  const textFiles = readTrackedTextFiles(rootDir, trackedFiles);
  const readmeText = fs.readFileSync(path.join(rootDir, "README.md"), "utf8");
  const legacyLinks = findLegacyLinks(textFiles);
  const readmeIndex = checkReadmeIndex({ trackedFiles, readmeText });

  return {
    ok: legacyLinks.length === 0 && readmeIndex.ok,
    legacyLinks,
    readmeIndex,
  };
}

function main() {
  const rootDir = process.cwd();
  try {
    const report = buildMaintenanceReport(rootDir);
    console.log(formatMaintenanceReport(report));
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildMaintenanceReport,
  checkReadmeIndex,
  findLegacyLinks,
  formatMaintenanceReport,
  getTrackedFiles,
  parseReadmeIndex,
};
