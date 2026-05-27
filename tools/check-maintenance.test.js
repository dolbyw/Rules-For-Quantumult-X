const assert = require("node:assert/strict");
const test = require("node:test");
const {
  checkReadmeIndex,
  findLegacyLinks,
  parseReadmeIndex,
} = require("./check-maintenance");

test("parseReadmeIndex extracts indexed file paths from README tables", () => {
  const indexed = parseReadmeIndex(`
## 文件说明索引

本节按当前工作区文件树生成，覆盖 2 个文件。

| 文件 | 说明 |
|---|---|
| \`README.md\` | 主说明。 |
| \`Rules/Services/OpenAI.list\` | OpenAI 规则。 |
`);

  assert.deepEqual([...indexed.files], ["README.md", "Rules/Services/OpenAI.list"]);
  assert.equal(indexed.declaredCount, 2);
});

test("checkReadmeIndex reports missing, stale and declared-count drift", () => {
  const report = checkReadmeIndex({
    trackedFiles: ["README.md", "tools/check-maintenance.js"],
    readmeText: `
本节按当前工作区文件树生成，覆盖 2 个文件。

| 文件 | 说明 |
|---|---|
| \`README.md\` | 主说明。 |
| \`old-file.txt\` | 已删除文件。 |
`,
  });

  assert.deepEqual(report.missing, ["tools/check-maintenance.js"]);
  assert.deepEqual(report.stale, ["old-file.txt"]);
  assert.equal(report.expectedCount, 2);
  assert.equal(report.declaredCount, 2);
  assert.equal(report.ok, false);
});

test("findLegacyLinks blocks production legacy URLs but ignores fixtures and archival docs", () => {
  const files = new Map([
    ["Scripts/AdBlock/Wechat/Wechat.js", "https://cdn.jsdelivr.net/gh/sve1r/Rules-For-Quantumult-X@develop/a.js"],
    ["tools/fixtures/qx-validator/legacy-link/legacy.md", "https://r.sveir.xyz/Rules/Media/ForeignMedia.list"],
    ["docs/superpowers/plans/archive.md", "https://t.me/sve1r"],
    ["README.md", "当前 README 不再推荐旧仓库的 `r.sveir.xyz` 域名。"],
  ]);

  const links = findLegacyLinks(files);

  assert.equal(links.length, 1);
  assert.equal(links[0].file, "Scripts/AdBlock/Wechat/Wechat.js");
  assert.equal(links[0].label, "旧 jsDelivr 仓库链接");
});
