#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const profile = require("../config/lite-profile");

const STABLE_CONFIG_FILE_NAME = "QuantumultX-Lite.conf";
const SNAPSHOT_PATTERN = /^QuantumultX-Lite-(\d{8})\.conf$/;

function buildConfig(profileData = profile) {
  const lines = [...profileData.header, ""];
  for (const section of profileData.sections) {
    lines.push(`[${section.name}]`);
    lines.push(...section.lines);
    lines.push("");
  }
  return lines.join("\n").replace(/\n+$/, "\n");
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function writeIfChanged(filePath, content) {
  const previous = readIfExists(filePath);
  if (previous === content) {
    return false;
  }
  fs.writeFileSync(filePath, content, "utf8");
  return true;
}

function findLatestSnapshot(rootDir) {
  const snapshots = fs
    .readdirSync(rootDir)
    .filter((name) => SNAPSHOT_PATTERN.test(name))
    .sort();
  return snapshots.at(-1) || null;
}

function formatDate(date = new Date()) {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function generateLiteConfig({ rootDir = path.join(__dirname, ".."), today = formatDate(), check = false } = {}) {
  const content = buildConfig();
  const stablePath = path.join(rootDir, STABLE_CONFIG_FILE_NAME);
  const stablePrevious = readIfExists(stablePath);
  const latestSnapshot = findLatestSnapshot(rootDir);
  const latestSnapshotPath = latestSnapshot ? path.join(rootDir, latestSnapshot) : null;
  const latestSnapshotContent = latestSnapshotPath ? readIfExists(latestSnapshotPath) : null;

  const needsStableWrite = stablePrevious !== content;
  const needsSnapshotWrite = latestSnapshotContent !== content;
  const snapshotFileName = needsSnapshotWrite ? `QuantumultX-Lite-${today}.conf` : latestSnapshot;
  const snapshotPath = snapshotFileName ? path.join(rootDir, snapshotFileName) : null;

  if (check) {
    return {
      stableChanged: needsStableWrite,
      snapshotChanged: needsSnapshotWrite,
      snapshotFileName,
      checked: true,
    };
  }

  const stableChanged = writeIfChanged(stablePath, content);
  const snapshotChanged = needsSnapshotWrite ? writeIfChanged(snapshotPath, content) : false;

  return {
    stableChanged,
    snapshotChanged,
    snapshotFileName,
    checked: false,
  };
}

function parseArgs(argv) {
  return {
    check: argv.includes("--check"),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const result = generateLiteConfig(options);

  if (options.check && (result.stableChanged || result.snapshotChanged)) {
    console.error("Quantumult X 轻量配置未同步，请运行: node tools/generate-lite-config.js");
    console.error(JSON.stringify(result, null, 2));
    process.exitCode = 1;
    return;
  }

  if (options.check) {
    console.log("Quantumult X 轻量配置已同步。");
    return;
  }

  console.log(
    [
      "已生成 Quantumult X 轻量配置。",
      `stableChanged=${result.stableChanged}`,
      `snapshotChanged=${result.snapshotChanged}`,
      `snapshotFileName=${result.snapshotFileName || ""}`,
    ].join(" "),
  );
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
  buildConfig,
  findLatestSnapshot,
  formatDate,
  generateLiteConfig,
  STABLE_CONFIG_FILE_NAME,
};
