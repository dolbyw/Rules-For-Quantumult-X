#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const sources = require("../config/loyalsoldier-sources");

const OUTPUT_DIR = path.join("Rules", "Generated", "Loyalsoldier");
const TYPE_MAP = new Map([
  ["DOMAIN", "host"],
  ["DOMAIN-SUFFIX", "host-suffix"],
  ["DOMAIN-KEYWORD", "host-keyword"],
  ["IP-CIDR", "ip-cidr"],
  ["IP-CIDR6", "ip6-cidr"],
  ["GEOIP", "geoip"],
  ["IP-ASN", "ip-asn"],
  ["USER-AGENT", "user-agent"],
]);

function isCommentOrEmpty(line) {
  const trimmed = line.trim();
  return trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith(";") || trimmed.startsWith("//");
}

function stripInlineComment(line) {
  return line.replace(/\s+\/\/.*$/, "").trim();
}

function convertSurgeRules(content) {
  const rules = [];
  const seen = new Set();
  const unsupported = [];
  let duplicates = 0;

  content.split(/\r?\n/).forEach((rawLine, index) => {
    if (isCommentOrEmpty(rawLine)) {
      return;
    }

    const line = stripInlineComment(rawLine);
    if (line === "") {
      return;
    }

    const parts = line.split(",").map((part) => part.trim()).filter((part) => part !== "");
    const surgeType = (parts[0] || "").toUpperCase();
    const quanxType = TYPE_MAP.get(surgeType);

    if (!quanxType || parts.length < 2) {
      unsupported.push({ line: index + 1, type: surgeType || "(empty)", raw: rawLine.trim() });
      return;
    }

    const value = parts[1];
    const options = parts.slice(2);
    const next = [quanxType, value, ...options].join(", ");
    const normalized = next.toLowerCase();
    if (seen.has(normalized)) {
      duplicates += 1;
      return;
    }

    seen.add(normalized);
    rules.push(next);
  });

  return { rules, unsupported, duplicates };
}

function buildGeneratedRuleFile({ name, sourceUrl, rules }) {
  return [
    "# Quantumult X generated rule list",
    "# 请勿手动修改。本文件由 tools/generate-loyalsoldier-rules.js 生成。",
    `# Source: ${sourceUrl}`,
    `# Name: ${name}`,
    `# Rules: ${rules.length}`,
    "",
    ...rules,
    "",
  ].join("\n");
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function writeIfChanged(filePath, content) {
  const previous = readIfExists(filePath);
  if (previous === content) {
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  return true;
}

async function defaultFetchText(source) {
  const response = await fetch(source.sourceUrl, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`获取上游规则失败: ${source.name} ${response.status} ${source.sourceUrl}`);
  }
  return response.text();
}

async function generateRuleFiles({
  rootDir = path.join(__dirname, ".."),
  ruleSources = sources,
  sources: sourceAlias,
  fetchText = defaultFetchText,
  check = false,
} = {}) {
  const files = [];
  let changed = false;
  const activeSources = sourceAlias || ruleSources;

  for (const source of activeSources) {
    const sourceContent = source.content ?? (await fetchText(source));
    const converted = convertSurgeRules(sourceContent);
    if (converted.unsupported.length > 0) {
      const first = converted.unsupported[0];
      throw new Error(`不支持的 Surge 规则类型: ${source.name}:${first.line} ${first.raw}`);
    }
    if (converted.rules.length === 0) {
      throw new Error(`上游规则为空: ${source.name}`);
    }

    const output = buildGeneratedRuleFile({
      name: source.name,
      sourceUrl: source.sourceUrl,
      rules: converted.rules,
    });
    const relativePath = path.join(OUTPUT_DIR, source.fileName);
    const outputPath = path.join(rootDir, relativePath);
    const previous = readIfExists(outputPath);
    const fileChanged = previous !== output;
    if (!check && fileChanged) {
      writeIfChanged(outputPath, output);
    }
    changed = changed || fileChanged;
    files.push({
      name: source.name,
      path: relativePath.replaceAll(path.sep, "/"),
      rules: converted.rules.length,
      duplicates: converted.duplicates,
      changed: fileChanged,
    });
  }

  return { changed, files };
}

function parseArgs(argv) {
  return {
    check: argv.includes("--check"),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const report = await generateRuleFiles({ check: options.check });

  if (options.check && report.changed) {
    console.error("Loyalsoldier 生成规则未同步，请运行: node tools/generate-loyalsoldier-rules.js");
    console.error(JSON.stringify(report, null, 2));
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  buildGeneratedRuleFile,
  convertSurgeRules,
  generateRuleFiles,
  OUTPUT_DIR,
  TYPE_MAP,
};
