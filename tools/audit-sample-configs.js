#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const REQUIRED_SECTIONS = ["general", "dns", "policy", "filter_local", "filter_remote", "rewrite_remote", "mitm"];
const BUILTIN_POLICIES = new Set(["direct", "reject", "proxy"]);
const EXCLUDED_ROUTE_BASELINES = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"];
const LEGACY_URL_PATTERNS = [
  /https?:\/\/r\.sveir\.xyz/i,
  /https?:\/\/[^/\s]*rules-for-qx\.sveir/i,
  /https?:\/\/raw\.githubusercontent\.com\/sve1r\/Rules-For-Quantumult-X/i,
  /https?:\/\/cdn\.jsdelivr\.net\/gh\/sve1r\/Rules-For-Quantumult-X/i,
];
const SELF_GENERATED_RAW_PATTERN =
  /^https:\/\/raw\.githubusercontent\.com\/dolbyw\/Rules-For-Quantumult-X\/main\/(Rules\/Generated\/.+)$/i;

function parseArgs(argv) {
  const options = {
    json: false,
    strict: false,
    probeRemote: false,
    timeoutMs: 10000,
    targetPath: process.cwd(),
  };

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      options.json = true;
    } else if (arg === "--strict") {
      options.strict = true;
    } else if (arg === "--probe-remote") {
      options.probeRemote = true;
    } else if (arg === "--timeout-ms") {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error("--timeout-ms 需要正整数");
      }
      options.timeoutMs = value;
      index += 1;
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

function isCommentOrEmpty(line) {
  const trimmed = line.trim();
  return trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith(";") || trimmed.startsWith("//");
}

function normalizePath(filePath) {
  return filePath.replaceAll(path.sep, "/");
}

function collectSampleConfigs(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return isAuditedConfigName(path.basename(targetPath)) ? [targetPath] : [];
  }

  return fs
    .readdirSync(targetPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isAuditedConfigName(entry.name))
    .map((entry) => path.join(targetPath, entry.name))
    .sort();
}

function isAuditedConfigName(fileName) {
  return /^Sample_.*\.conf$/i.test(fileName) || /^QuantumultX-Lite(?:-\d{8})?\.conf$/i.test(fileName);
}

function splitSections(content) {
  const sections = new Map();
  let current = null;

  content.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    const match = line.match(/^\[([^\]]+)]$/);
    if (match) {
      current = match[1].toLowerCase();
      if (!sections.has(current)) {
        sections.set(current, []);
      }
      return;
    }
    if (!current) {
      return;
    }
    sections.get(current).push({ line: rawLine, number: index + 1 });
  });

  return sections;
}

function parsePolicyNames(policySectionLines) {
  const policies = new Set(BUILTIN_POLICIES);
  for (const item of policySectionLines || []) {
    if (isCommentOrEmpty(item.line)) {
      continue;
    }
    const match = item.line.match(/^\s*[\w-]+\s*=\s*([^,]+)\s*,/i);
    if (!match) {
      continue;
    }
    policies.add(match[1].trim().toLowerCase());
  }
  return policies;
}

function parseRemoteEntry(rawLine) {
  const trimmed = rawLine.trim();
  const commaIndex = trimmed.indexOf(",");
  if (commaIndex < 0) {
    return { url: trimmed, params: new Map() };
  }

  const url = trimmed.slice(0, commaIndex).trim();
  const paramText = trimmed.slice(commaIndex + 1);
  const params = new Map();
  for (const part of paramText.split(",")) {
    const kv = part.split("=");
    if (kv.length < 2) {
      continue;
    }
    params.set(kv[0].trim().toLowerCase(), kv.slice(1).join("=").trim());
  }
  return { url, params };
}

function addIssue(issues, severity, file, line, message) {
  issues.push({ severity, file, line, message });
}

function ensureSections(sections, issues, relativeFile) {
  for (const section of REQUIRED_SECTIONS) {
    if (!sections.has(section)) {
      addIssue(issues, "error", relativeFile, 1, `缺少必需区块 [${section}]`);
    }
  }
}

function checkGeneralLines(sections, issues, relativeFile) {
  const generalLines = sections.get("general") || [];
  const excludedRoutesLine = generalLines.find((item) => item.line.trim().toLowerCase().startsWith("excluded_routes"));
  if (!excludedRoutesLine) {
    addIssue(issues, "warning", relativeFile, 1, "未设置 excluded_routes，局域网流量可能被代理");
  } else {
    const lowerLine = excludedRoutesLine.line.toLowerCase();
    for (const route of EXCLUDED_ROUTE_BASELINES) {
      if (!lowerLine.includes(route)) {
        addIssue(issues, "warning", relativeFile, excludedRoutesLine.number, `excluded_routes 建议包含 ${route}`);
      }
    }
  }

  const hasParser = generalLines.some((item) => item.line.trim().toLowerCase().startsWith("resource_parser_url"));
  if (!hasParser) {
    addIssue(issues, "warning", relativeFile, 1, "未设置 resource_parser_url，Surge/Clash 兼容规则无法转换");
  }
}

function checkDnsLines(sections, issues, relativeFile) {
  const dnsLines = (sections.get("dns") || []).filter(
    (item) => !isCommentOrEmpty(item.line) && item.line.trim().toLowerCase().startsWith("server ="),
  );
  if (dnsLines.length < 2) {
    addIssue(issues, "warning", relativeFile, 1, "DNS server 数量少于 2，容灾能力较弱");
  }
}

function checkFilterLocalLines(sections, issues, relativeFile) {
  const filterLocal = sections.get("filter_local") || [];
  const hasFinal = filterLocal.some((item) => {
    if (isCommentOrEmpty(item.line)) {
      return false;
    }
    return item.line.trim().toLowerCase().startsWith("final,");
  });
  if (!hasFinal) {
    addIssue(issues, "error", relativeFile, 1, "[filter_local] 缺少 final 兜底规则");
  }
}

function checkRemoteSection(sectionName, sectionLines, policies, hasParser, issues, relativeFile, counters) {
  for (const item of sectionLines || []) {
    if (isCommentOrEmpty(item.line)) {
      continue;
    }
    const entry = parseRemoteEntry(item.line);
    const lowerUrl = entry.url.toLowerCase();

    if (!/^https:\/\//i.test(entry.url)) {
      addIssue(issues, "warning", relativeFile, item.number, `${sectionName} 使用了非 HTTPS 资源`);
    }
    if (entry.url.includes("example.com")) {
      addIssue(issues, "warning", relativeFile, item.number, `${sectionName} 仍包含示例占位资源`);
    }
    if (LEGACY_URL_PATTERNS.some((pattern) => pattern.test(entry.url))) {
      addIssue(issues, "error", relativeFile, item.number, `${sectionName} 包含旧维护链接`);
    }
    if (lowerUrl.includes("/rewrite/rewrite.conf")) {
      addIssue(issues, "error", relativeFile, item.number, "Rewrite/Rewrite.conf 已废弃，请替换为现有重写资源");
    }

    const enabled = (entry.params.get("enabled") || "true").toLowerCase() !== "false";
    if (enabled) {
      counters.enabledBySection[sectionName] = (counters.enabledBySection[sectionName] || 0) + 1;
    }

    if (sectionName === "filter_remote") {
      const forcePolicy = entry.params.get("force-policy");
      if (forcePolicy && !policies.has(forcePolicy.toLowerCase())) {
        addIssue(issues, "warning", relativeFile, item.number, `force-policy 指向未定义策略 ${forcePolicy}`);
      }

      if (entry.url.includes("Loyalsoldier/surge-rules")) {
        if (!item.line.includes("opt-parser=true")) {
          addIssue(issues, "warning", relativeFile, item.number, "Loyalsoldier 规则建议启用 opt-parser=true");
        }
        if (!entry.url.includes("/release/ruleset/")) {
          addIssue(issues, "warning", relativeFile, item.number, "Loyalsoldier 建议使用 /release/ruleset/ 路径");
        }
        if (enabled && !hasParser) {
          addIssue(issues, "error", relativeFile, item.number, "启用 Loyalsoldier 规则前需要 resource_parser_url");
        }
      }
    }
  }
}

function extractScriptUrlsFromRewriteFile(content) {
  const urls = [];
  content.split(/\r?\n/).forEach((line) => {
    if (isCommentOrEmpty(line)) {
      return;
    }
    const match = line.match(/\burl\s+script-[a-z-]+\s+(https?:\/\/[^\s]+)/i);
    if (match) {
      urls.push(match[1]);
    }
  });
  return urls;
}

function checkInternalScriptReferences(rootDir, issues) {
  const rewriteDir = path.join(rootDir, "Rewrite");
  if (!fs.existsSync(rewriteDir)) {
    return [];
  }

  const scriptUrls = new Set();
  const stack = [rewriteDir];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const nextPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(nextPath);
        continue;
      }
      if (!/\.(adblock|unlock|conf|rewrite)$/i.test(entry.name)) {
        continue;
      }
      const content = fs.readFileSync(nextPath, "utf8");
      for (const scriptUrl of extractScriptUrlsFromRewriteFile(content)) {
        scriptUrls.add(scriptUrl);
        const internalMatch = scriptUrl.match(
          /^https?:\/\/raw\.githubusercontent\.com\/dolbyw\/Rules-For-Quantumult-X\/main\/(.+)$/i,
        );
        if (!internalMatch) {
          continue;
        }
        const localTarget = path.join(rootDir, internalMatch[1].replaceAll("/", path.sep));
        if (!fs.existsSync(localTarget)) {
          addIssue(
            issues,
            "error",
            normalizePath(nextPath),
            1,
            `重写脚本链接对应文件不存在: ${internalMatch[1]}`,
          );
        }
      }
    }
  }

  return [...scriptUrls];
}

async function probeUrls(urls, timeoutMs) {
  const results = [];
  for (const url of urls) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      let response = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
      if (response.status === 405 || response.status === 403) {
        response = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
      }
      results.push({ url, ok: response.ok, status: response.status });
    } catch (error) {
      results.push({ url, ok: false, error: error.message });
    } finally {
      clearTimeout(timer);
    }
  }
  return results;
}

async function buildAuditReport(options) {
  const files = collectSampleConfigs(options.targetPath);
  const targetStat = fs.statSync(options.targetPath);
  const localRoot = targetStat.isFile() ? path.dirname(options.targetPath) : options.targetPath;
  const issues = [];
  const urlCandidates = new Set();
  const localProbes = [];

  for (const file of files) {
    const relativeFile = normalizePath(path.relative(process.cwd(), file) || path.basename(file));
    const content = fs.readFileSync(file, "utf8");
    const sections = splitSections(content);
    ensureSections(sections, issues, relativeFile);
    checkGeneralLines(sections, issues, relativeFile);
    checkDnsLines(sections, issues, relativeFile);
    checkFilterLocalLines(sections, issues, relativeFile);

    const hasParser = (sections.get("general") || []).some((item) =>
      item.line.trim().toLowerCase().startsWith("resource_parser_url"),
    );
    const policies = parsePolicyNames(sections.get("policy"));
    const counters = { enabledBySection: {} };

    checkRemoteSection("server_remote", sections.get("server_remote"), policies, hasParser, issues, relativeFile, counters);
    checkRemoteSection("filter_remote", sections.get("filter_remote"), policies, hasParser, issues, relativeFile, counters);
    checkRemoteSection(
      "rewrite_remote",
      sections.get("rewrite_remote"),
      policies,
      hasParser,
      issues,
      relativeFile,
      counters,
    );

    for (const sectionName of ["server_remote", "filter_remote", "rewrite_remote"]) {
      for (const item of sections.get(sectionName) || []) {
        if (isCommentOrEmpty(item.line)) {
          continue;
        }
        const entry = parseRemoteEntry(item.line);
        if (/^https:\/\//i.test(entry.url)) {
          const selfMatch = entry.url.match(SELF_GENERATED_RAW_PATTERN);
          if (selfMatch) {
            const localTarget = path.join(localRoot, selfMatch[1].replaceAll("/", path.sep));
            if (fs.existsSync(localTarget)) {
              localProbes.push({ url: entry.url, ok: true, local: true });
            } else {
              addIssue(issues, "error", relativeFile, item.number, `本仓库 raw 链接对应文件不存在: ${selfMatch[1]}`);
            }
            continue;
          }
          urlCandidates.add(entry.url);
        }
      }
    }

    if ((counters.enabledBySection.rewrite_remote || 0) > 8) {
      addIssue(issues, "warning", relativeFile, 1, "启用的 rewrite_remote 超过 8 条，可能影响性能和稳定性");
    }
    if ((counters.enabledBySection.filter_remote || 0) > 20) {
      addIssue(issues, "warning", relativeFile, 1, "启用的 filter_remote 超过 20 条，建议按需裁剪");
    }
  }

  if (targetStat.isDirectory()) {
    const internalScriptUrls = checkInternalScriptReferences(process.cwd(), issues);
    internalScriptUrls.forEach((url) => urlCandidates.add(url));
  }

  const probes = [...localProbes];
  if (options.probeRemote) {
    probes.push(...(await probeUrls([...urlCandidates], options.timeoutMs)));
    for (const result of probes) {
      if (!result.ok) {
        addIssue(
          issues,
          "warning",
          "remote",
          1,
          `远程资源不可达或状态异常: ${result.url} (${result.status || result.error})`,
        );
      }
    }
  }

  const summary = {
    filesScanned: files.length,
    errors: issues.filter((item) => item.severity === "error").length,
    warnings: issues.filter((item) => item.severity === "warning").length,
    infos: issues.filter((item) => item.severity === "info").length,
    probeCount: probes.length,
  };

  return { summary, issues, probes };
}

function formatText(report) {
  const lines = [
    "Quantumult X 示例配置审计报告",
    "",
    `扫描文件: ${report.summary.filesScanned}`,
    `错误: ${report.summary.errors}`,
    `警告: ${report.summary.warnings}`,
    `信息: ${report.summary.infos}`,
    `远程探测: ${report.summary.probeCount}`,
    "",
  ];

  for (const issue of report.issues) {
    lines.push(`[${issue.severity}] ${issue.file}:${issue.line} ${issue.message}`);
  }
  return lines.join("\n");
}

async function main() {
  try {
    const options = parseArgs(process.argv);
    const report = await buildAuditReport(options);
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
  buildAuditReport,
  collectSampleConfigs,
  formatText,
  isAuditedConfigName,
  parseArgs,
  parseRemoteEntry,
  splitSections,
};
