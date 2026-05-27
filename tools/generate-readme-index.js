#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const README_PATH = path.join(__dirname, "..", "README.md");
const START_HEADING = "## 文件说明索引";
const END_HEADING = "## 当前仓库审查结论";

function getTrackedFiles(rootDir) {
  const output = execFileSync(
    "git",
    ["-c", "core.quotepath=false", "ls-files", "--cached", "--others", "--exclude-standard"],
    {
    cwd: rootDir,
    encoding: "utf8",
    },
  );
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .sort();
}

function describeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (filePath.startsWith(".github/workflows/")) {
    return "GitHub Actions 工作流。";
  }
  if (filePath.startsWith(".github/ISSUE_TEMPLATE/")) {
    return "Issue 模板。";
  }
  if (filePath.startsWith("tools/fixtures/")) {
    return "校验器测试样例。";
  }
  if (filePath.startsWith("tools/")) {
    return "维护脚本。";
  }
  if (filePath.startsWith("config/")) {
    return "配置生成清单。";
  }
  if (filePath.startsWith("docs/")) {
    return "维护文档。";
  }
  if (filePath.startsWith("images/")) {
    return "静态资源。";
  }
  if (filePath.startsWith("Rewrite/")) {
    return "重写规则资源。";
  }
  if (filePath.startsWith("Scripts/")) {
    return "脚本资源。";
  }
  if (filePath.startsWith("Rules/")) {
    return "规则说明文档。";
  }
  if (filePath.startsWith("Sample_") && ext === ".conf") {
    return "示例配置。";
  }
  if (/^QuantumultX-Lite(?:-\d{8})?\.conf$/.test(filePath)) {
    return "Quantumult X 轻量分流配置。";
  }
  if (filePath === "README.md") {
    return "项目主说明。";
  }
  if (filePath === "LICENSE") {
    return "开源许可证。";
  }
  if (ext === ".md") {
    return "文档。";
  }
  return "项目文件。";
}

function buildReadmeIndexBlock(trackedFiles) {
  const rows = trackedFiles.map((file) => `| \`${file}\` | ${describeFile(file)} |`);
  return [
    "## 文件说明索引",
    "",
    `本节按当前工作区文件树生成，覆盖 ${trackedFiles.length} 个文件。`,
    "",
    "| 文件 | 说明 |",
    "|---|---|",
    ...rows,
    "",
  ].join("\n");
}

function replaceBetweenHeadings(readmeText, replacement) {
  const start = readmeText.indexOf(START_HEADING);
  const end = readmeText.indexOf(END_HEADING);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`README 缺少区块边界：${START_HEADING} -> ${END_HEADING}`);
  }
  return readmeText.slice(0, start) + replacement + readmeText.slice(end);
}

function createReadmeWithIndex(readmeText, trackedFiles) {
  return replaceBetweenHeadings(readmeText, buildReadmeIndexBlock(trackedFiles));
}

function main() {
  const checkMode = process.argv.includes("--check");
  const rootDir = path.join(__dirname, "..");
  const trackedFiles = getTrackedFiles(rootDir);
  const readmeText = fs.readFileSync(README_PATH, "utf8");
  const nextReadme = createReadmeWithIndex(readmeText, trackedFiles);

  if (checkMode) {
    if (nextReadme !== readmeText) {
      console.error("README 文件说明索引未同步，请运行: node tools/generate-readme-index.js");
      process.exitCode = 1;
      return;
    }
    console.log("README 文件说明索引已同步。");
    return;
  }

  fs.writeFileSync(README_PATH, nextReadme, "utf8");
  console.log("已更新 README 文件说明索引。");
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
  buildReadmeIndexBlock,
  createReadmeWithIndex,
  describeFile,
  getTrackedFiles,
  replaceBetweenHeadings,
};
