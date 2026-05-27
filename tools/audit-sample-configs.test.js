const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const {
  buildAuditReport,
  isAuditedConfigName,
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

test("isAuditedConfigName 接受历史 sample、stable lite 和 dated lite 配置", () => {
  assert.equal(isAuditedConfigName("Sample_v1.5.3.conf"), true);
  assert.equal(isAuditedConfigName("QuantumultX-Lite-20260528.conf"), true);
  assert.equal(isAuditedConfigName("QuantumultX-Lite.conf"), true);
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

test("buildAuditReport 探测时将本仓库 raw 链接解析为本地文件", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "qx-audit-local-"));
  const localRule = path.join(tempDir, "Rules", "Generated", "Loyalsoldier", "GFW.list");
  fs.mkdirSync(path.dirname(localRule), { recursive: true });
  fs.writeFileSync(localRule, "host-suffix, example.com\n");
  fs.writeFileSync(
    path.join(tempDir, "QuantumultX-Lite.conf"),
    [
      "[general]",
      "resource_parser_url = https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/resource-parser.js",
      "excluded_routes = 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
      "[dns]",
      "server = 119.29.29.29",
      "server = 223.5.5.5",
      "[policy]",
      "static = OutSide, direct",
      "[filter_local]",
      "final, OutSide",
      "[filter_remote]",
      "https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Generated/Loyalsoldier/GFW.list, tag=Loyal-GFW, force-policy=OutSide, enabled=true",
      "[rewrite_remote]",
      "[mitm]",
    ].join("\n"),
  );

  const report = await buildAuditReport({
    targetPath: path.join(tempDir, "QuantumultX-Lite.conf"),
    probeRemote: true,
    timeoutMs: 10,
  });

  assert.equal(report.summary.errors, 0);
  assert.equal(report.summary.warnings, 0);
  assert.equal(report.summary.probeCount, 1);
});
