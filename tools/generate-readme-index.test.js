const assert = require("node:assert/strict");
const test = require("node:test");
const {
  buildReadmeIndexBlock,
  createReadmeWithIndex,
  describeFile,
} = require("./generate-readme-index");

test("describeFile 按路径生成分类说明", () => {
  assert.equal(describeFile(".github/workflows/validate.yml"), "GitHub Actions 工作流。");
  assert.equal(describeFile("tools/check-maintenance.js"), "维护脚本。");
  assert.equal(describeFile("Rewrite/AdBlock/Weibo.adblock"), "重写规则资源。");
});

test("buildReadmeIndexBlock 生成包含数量和表格的区块", () => {
  const block = buildReadmeIndexBlock(["README.md", "tools/check-maintenance.js"]);
  assert(block.includes("覆盖 2 个文件"));
  assert(block.includes("| `README.md` | 项目主说明。 |"));
});

test("createReadmeWithIndex 替换 README 索引区块", () => {
  const readme = "X\n## 文件说明索引\nold\n## 当前仓库审查结论\nY";
  const next = createReadmeWithIndex(readme, ["README.md"]);
  assert(next.includes("| `README.md` | 项目主说明。 |"));
  assert(!next.includes("\nold\n"));
});
