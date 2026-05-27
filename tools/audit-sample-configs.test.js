const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const {
  buildAuditReport,
  parseArgs,
  parseRemoteEntry,
} = require("./audit-sample-configs");

const fixtureRoot = path.join(__dirname, "fixtures", "qx-audit");

test("parseArgs 支持 strict 和 probe 参数", () => {
  const options = parseArgs(["node", "script", "--strict", "--probe-remote", "--timeout-ms", "3000", "--path", "."]);
  assert.equal(options.strict, true);
  assert.equal(options.probeRemote, true);
  assert.equal(options.timeoutMs, 3000);
});

test("parseRemoteEntry 解析 URL 与参数", () => {
  const entry = parseRemoteEntry(
    "https://a.com/r.list, tag=Google, force-policy=OutSide, enabled=true",
  );
  assert.equal(entry.url, "https://a.com/r.list");
  assert.equal(entry.params.get("tag"), "Google");
  assert.equal(entry.params.get("force-policy"), "OutSide");
});

test("buildAuditReport 对健康样例返回零错误", async () => {
  const report = await buildAuditReport({
    targetPath: path.join(fixtureRoot, "good"),
    probeRemote: false,
    timeoutMs: 1000,
  });
  assert.equal(report.summary.filesScanned, 1);
  assert.equal(report.summary.errors, 0);
});

test("buildAuditReport 识别失效 rewrite 入口和 final 缺失", async () => {
  const report = await buildAuditReport({
    targetPath: path.join(fixtureRoot, "bad"),
    probeRemote: false,
    timeoutMs: 1000,
  });
  const messages = report.issues.map((issue) => issue.message);
  assert(messages.includes("[filter_local] 缺少 final 兜底规则"));
  assert(messages.includes("Rewrite/Rewrite.conf 已废弃，请替换为现有重写资源"));
  assert(report.summary.errors >= 2);
});
