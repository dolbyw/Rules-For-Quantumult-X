#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SUPPORTED_EXTENSIONS = new Set([".list", ".adblock", ".unlock", ".conf", ".md"]);
const EXCLUDED_DIRS = new Set([".git", "node_modules", ".github", "fixtures"]);
const RULE_TYPES = new Set([
  "host",
  "host-suffix",
  "host-keyword",
  "host-wildcard",
  "ip-cidr",
  "ip6-cidr",
  "ip-asn",
  "geoip",
  "user-agent",
  "final",
]);
const CONFIG_SECTIONS = [
  "[general]",
  "[dns]",
  "[policy]",
  "[server_local]",
  "[server_remote]",
  "[filter_remote]",
  "[rewrite_remote]",
  "[mitm]",
];
const LEGACY_PATTERNS = [
  { pattern: /r\.sveir\.xyz/i, label: "旧 CDN 域名 r.sveir.xyz" },
  { pattern: /sve1r/i, label: "旧维护者标识 sve1r" },
  { pattern: /t\.me\/sve1r/i, label: "旧 Telegram 链接 t.me/sve1r" },
  { pattern: /rules-for-qx\.sveir/i, label: "旧规则域名 rules-for-qx.sveir" },
];

function parseArgs(argv) {
  const options = {
    json: false,
    strict: false,
    targetPath: process.cwd(),
  };

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      options.json = true;
    } else if (arg === "--strict") {
      options.strict = true;
    } else if (arg === "--path") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--path 需要提供目录或文件");
      }
      options.targetPath = path.resolve(process.cwd(), value);
      index += 1;
    } else {
      throw new Error(`未知参数: ${arg}`);
    }
  }

  return options;
}

function normalizePath(filePath, rootDir) {
  return path.relative(rootDir, filePath).replaceAll(path.sep, "/");
}

function walkFiles(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return SUPPORTED_EXTENSIONS.has(path.extname(targetPath).toLowerCase()) ? [targetPath] : [];
  }

  const files = [];
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) {
      continue;
    }

    const nextPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(nextPath));
    } else if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(nextPath);
    }
  }
  return files;
}

function addIssue(issues, severity, file, line, message) {
  issues.push({ severity, file, line, message });
}

function isIgnorableLine(line) {
  const trimmed = line.trim();
  return trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith(";") || trimmed.startsWith("//");
}

function stripListComment(line) {
  return line.replace(/\s+\/\/.*$/, "").trim();
}

function checkLegacyLinks(lines, relativeFile, issues, seenLegacyLabels) {
  lines.forEach((line, index) => {
    for (const item of LEGACY_PATTERNS) {
      if (!item.pattern.test(line)) {
        continue;
      }

      const severity = relativeFile === "README.md" && line.includes("不再推荐") ? "info" : "warning";
      const seenKey = `${severity}:${item.label}`;
      if (seenLegacyLabels.has(seenKey)) {
        continue;
      }
      seenLegacyLabels.add(seenKey);
      addIssue(issues, severity, relativeFile, index + 1, `发现${item.label}`);
    }
  });
}

function checkListFile(lines, relativeFile, issues) {
  const seen = new Map();

  lines.forEach((line, index) => {
    if (isIgnorableLine(line)) {
      return;
    }

    const ruleLine = stripListComment(line);
    if (ruleLine === "") {
      return;
    }

    const normalized = ruleLine.replace(/\s+/g, " ").toLowerCase();
    if (seen.has(normalized)) {
      addIssue(issues, "warning", relativeFile, index + 1, `重复规则，首次出现于第 ${seen.get(normalized)} 行`);
    } else {
      seen.set(normalized, index + 1);
    }

    const parts = ruleLine.split(",").map((part) => part.trim());
    const type = parts[0].toLowerCase();
    if (!RULE_TYPES.has(type)) {
      addIssue(issues, "warning", relativeFile, index + 1, `未知规则类型 ${parts[0]}`);
      return;
    }

    if (type === "final") {
      if (parts.length < 2 || parts[1] === "") {
        addIssue(issues, "error", relativeFile, index + 1, "final 规则缺少策略名");
      }
      return;
    }

    if (parts.length < 2 || parts[1] === "") {
      addIssue(issues, "error", relativeFile, index + 1, "规则字段不足，需要规则类型和匹配内容");
      return;
    }

    if (parts.length >= 3 && parts[2] === "") {
      addIssue(issues, "error", relativeFile, index + 1, "规则策略名为空；省略策略时请不要保留空字段");
    }
  });
}

function checkRewriteFile(lines, relativeFile, issues) {
  const rewriteActions = [
    " url reject",
    " url 302",
    " url request-header",
    " url response-header",
    " url request-body",
    " url response-body",
    " url script-request-header",
    " url script-request-body",
    " url script-response-header",
    " url script-response-body",
    " url script-analyze-echo-response",
  ];

  lines.forEach((line, index) => {
    if (isIgnorableLine(line)) {
      return;
    }
    const trimmed = line.trim();
    if (/^hostname\s*=/i.test(trimmed)) {
      return;
    }
    const lower = ` ${trimmed.toLowerCase()}`;
    if (!rewriteActions.some((action) => lower.includes(action))) {
      addIssue(issues, "warning", relativeFile, index + 1, "重写规则缺少可识别动作");
    }
  });
}

function checkConfFile(lines, relativeFile, issues) {
  const sectionSet = new Set(
    lines.map((line) => line.trim().toLowerCase()).filter((line) => line.startsWith("[") && line.endsWith("]")),
  );
  for (const section of CONFIG_SECTIONS) {
    if (!sectionSet.has(section)) {
      addIssue(issues, "info", relativeFile, 1, `示例配置缺少常见区块 ${section}`);
    }
  }
}

function scanFile(filePath, rootDir, issues, seenLegacyLabels) {
  const relativeFile = normalizePath(filePath, rootDir);
  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  checkLegacyLinks(lines, relativeFile, issues, seenLegacyLabels);

  if (ext === ".list") {
    checkListFile(lines, relativeFile, issues);
  } else if (ext === ".adblock" || ext === ".unlock") {
    checkRewriteFile(lines, relativeFile, issues);
  } else if (ext === ".conf") {
    checkConfFile(lines, relativeFile, issues);
  }
}

function buildReport(targetPath) {
  const rootDir = fs.statSync(targetPath).isFile() ? path.dirname(targetPath) : targetPath;
  const files = walkFiles(targetPath).sort();
  const issues = [];
  const seenLegacyLabels = new Set();

  for (const file of files) {
    scanFile(file, rootDir, issues, seenLegacyLabels);
  }

  const summary = {
    filesScanned: files.length,
    errors: issues.filter((issue) => issue.severity === "error").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    infos: issues.filter((issue) => issue.severity === "info").length,
  };

  return { summary, issues };
}

function formatText(report) {
  const lines = [
    "Quantumult X 规则校验报告",
    "",
    `扫描文件: ${report.summary.filesScanned}`,
    `错误: ${report.summary.errors}`,
    `警告: ${report.summary.warnings}`,
    `信息: ${report.summary.infos}`,
    "",
  ];

  for (const issue of report.issues) {
    lines.push(`[${issue.severity}] ${issue.file}:${issue.line} ${issue.message}`);
  }

  return lines.join("\n");
}

function main() {
  try {
    const options = parseArgs(process.argv);
    const report = buildReport(options.targetPath);
    const output = options.json ? JSON.stringify(report, null, 2) : formatText(report);
    console.log(output);
    process.exitCode = options.strict && report.summary.errors > 0 ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildReport,
  formatText,
  parseArgs,
};
