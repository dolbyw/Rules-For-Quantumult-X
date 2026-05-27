const assert = require("node:assert/strict");
const test = require("node:test");
const {
  buildGeneratedBlock,
  createReadmeWithSubscriptionLinks,
  parseSections,
} = require("./generate-subscription-links");

test("parseSections 按区块提取内容", () => {
  const sections = parseSections("[general]\na=1\n[filter_remote]\nhttps://a.com/x.list");
  assert.equal(sections.has("general"), true);
  assert.equal(sections.has("filter_remote"), true);
});

test("buildGeneratedBlock 生成 QuanX 一键导入链接", () => {
  const sample = `
[general]
[server_remote]
https://example.com/subscribe.snippet, tag=Sample
[filter_remote]
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Google/Google.list, tag=Google
[rewrite_remote]
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rewrite/AdBlock/WebAdBlock.adblock, tag=Web
`;
  const block = buildGeneratedBlock(sample, { repo: "demo/repo", branch: "main" });
  assert(block.includes("quantumult-x:///add-resource"));
  assert(block.includes("https://quantumult.app/x/open-app/add-resource"));
  assert(block.includes("https://raw.githubusercontent.com/demo/repo/main/Sample_v1.5.3.conf"));
});

test("createReadmeWithSubscriptionLinks 替换目标区块", () => {
  const readme = "A\n## 一键订阅链接\nold\n## 推荐导入顺序\nB";
  const sample = "[filter_remote]\nhttps://a.com/r.list";
  const next = createReadmeWithSubscriptionLinks(readme, sample, { repo: "demo/repo", branch: "main" });
  assert(next.includes("AUTO_SUBSCRIPTION_LINKS:START"));
  assert(next.includes("## 推荐导入顺序"));
  assert(!next.includes("\nold\n"));
});
