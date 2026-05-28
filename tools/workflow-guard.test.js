const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT_DIR = path.join(__dirname, "..");

test("auto-update workflow 不再暂存已删除的历史 Sample 配置", () => {
  const workflow = fs.readFileSync(path.join(ROOT_DIR, ".github", "workflows", "auto-update.yml"), "utf8");

  assert(!workflow.includes("git add Sample_v*.conf"));
});
