#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const README_PATH = path.join(__dirname, "..", "README.md");
const CONFIG_FILE_NAME = "QuantumultX-Lite.conf";
const CONFIG_PATH = path.join(__dirname, "..", CONFIG_FILE_NAME);
const START_HEADING = "## 一键订阅链接";
const END_HEADING = "## 推荐导入顺序";
const DEFAULT_REPO = "dolbyw/Rules-For-Quantumult-X";
const DEFAULT_BRANCH = "main";

function parseSections(content) {
  const sections = new Map();
  let current = null;
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    const match = line.match(/^\[([^\]]+)]$/);
    if (match) {
      current = match[1].toLowerCase();
      if (!sections.has(current)) {
        sections.set(current, []);
      }
      continue;
    }
    if (current) {
      sections.get(current).push(rawLine);
    }
  }
  return sections;
}

function isCommentOrEmpty(line) {
  const trimmed = line.trim();
  return (
    trimmed === "" ||
    trimmed.startsWith("#") ||
    trimmed.startsWith(";") ||
    trimmed.startsWith("//")
  );
}

function getResourceLines(sectionLines) {
  const lines = [];
  for (const rawLine of sectionLines || []) {
    if (isCommentOrEmpty(rawLine)) {
      continue;
    }
    lines.push(rawLine.trim());
  }
  return lines;
}

function resolveRepo() {
  if (process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY.includes("/")) {
    return process.env.GITHUB_REPOSITORY;
  }
  return DEFAULT_REPO;
}

function buildGeneratedBlock(sampleContent, { repo = resolveRepo(), branch = DEFAULT_BRANCH, configFileName = CONFIG_FILE_NAME } = {}) {
  const sampleSha = crypto.createHash("sha256").update(sampleContent).digest("hex").slice(0, 12);

  const sections = parseSections(sampleContent);
  const filterRemote = getResourceLines(sections.get("filter_remote"));
  const rewriteRemote = getResourceLines(sections.get("rewrite_remote"));
  const serverRemote = getResourceLines(sections.get("server_remote")).filter(
    (line) => !line.includes("example.com"),
  );

  const resourcePayload = {};
  if (serverRemote.length > 0) {
    resourcePayload.server_remote = serverRemote;
  }
  if (filterRemote.length > 0) {
    resourcePayload.filter_remote = filterRemote;
  }
  if (rewriteRemote.length > 0) {
    resourcePayload.rewrite_remote = rewriteRemote;
  }

  const encodedPayload = encodeURIComponent(JSON.stringify(resourcePayload));
  const rawConfigUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${configFileName}`;
  const jsdelivrConfigUrl = `https://cdn.jsdelivr.net/gh/${repo}@${branch}/${configFileName}`;

  const schemeAdd = `quantumult-x:///add-resource?remote-resource=${encodedPayload}`;
  const schemeUpdate = `quantumult-x:///update-configuration?remote-resource=${encodedPayload}`;
  const universalAdd = `https://quantumult.app/x/open-app/add-resource?remote-resource=${encodedPayload}`;
  const universalUpdate = `https://quantumult.app/x/open-app/update-configuration?remote-resource=${encodedPayload}`;

  return [
    "## 一键订阅链接",
    "",
    "<!-- AUTO_SUBSCRIPTION_LINKS:START -->",
    "> 自动生成：请勿手改本区块，运行 `node tools/generate-subscription-links.js` 更新。",
    `> 基准配置：\`${configFileName}\`，内容哈希：\`${sampleSha}\`。`,
    "",
    "### 配置订阅（建议）",
    "",
    "```text",
    rawConfigUrl,
    "```",
    "",
    "备用 CDN：",
    "",
    "```text",
    jsdelivrConfigUrl,
    "```",
    "",
    "### QuanX 一键导入（通用链接）",
    "",
    "追加导入（保留现有资源）：",
    "",
    "```text",
    universalAdd,
    "```",
    "",
    "覆盖导入（替换现有资源）：",
    "",
    "```text",
    universalUpdate,
    "```",
    "",
    "### QuanX URL Scheme（App 直开）",
    "",
    "追加导入：",
    "",
    "```text",
    schemeAdd,
    "```",
    "",
    "覆盖导入：",
    "",
    "```text",
    schemeUpdate,
    "```",
    "",
    "<!-- AUTO_SUBSCRIPTION_LINKS:END -->",
    "",
  ].join("\n");
}

function updateReadme(readmeContent, block) {
  const start = readmeContent.indexOf(START_HEADING);
  const end = readmeContent.indexOf(END_HEADING);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`README 缺少区块边界：${START_HEADING} -> ${END_HEADING}`);
  }
  return readmeContent.slice(0, start) + block + readmeContent.slice(end);
}

function createReadmeWithSubscriptionLinks(readmeContent, sampleContent, options = {}) {
  return updateReadme(readmeContent, buildGeneratedBlock(sampleContent, options));
}

function main() {
  const checkMode = process.argv.includes("--check");
  const readmeContent = fs.readFileSync(README_PATH, "utf8");
  const sampleContent = fs.readFileSync(CONFIG_PATH, "utf8");
  const nextReadme = createReadmeWithSubscriptionLinks(readmeContent, sampleContent);

  if (checkMode) {
    if (nextReadme !== readmeContent) {
      console.error("README 订阅链接区块未同步，请运行: node tools/generate-subscription-links.js");
      process.exitCode = 1;
      return;
    }
    console.log("README 订阅链接区块已同步。");
    return;
  }

  fs.writeFileSync(README_PATH, nextReadme, "utf8");
  console.log("已更新 README 一键订阅链接区块。");
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  buildGeneratedBlock,
  CONFIG_FILE_NAME,
  CONFIG_PATH,
  createReadmeWithSubscriptionLinks,
  getResourceLines,
  parseSections,
  updateReadme,
};
