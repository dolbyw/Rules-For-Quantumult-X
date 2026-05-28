const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  buildConfig,
  findLatestSnapshot,
  generateLiteConfig,
  STABLE_CONFIG_FILE_NAME,
} = require("./generate-lite-config");

test("buildConfig 生成包含核心区块和稳定入口注释的 Quantumult X 配置", () => {
  const content = buildConfig();

  assert(content.startsWith("# Quantumult X 轻量分流配置"));
  assert(content.includes("[general]"));
  assert(content.includes("[policy]"));
  assert(content.includes("[filter_remote]"));
  assert(content.includes("static = 出境代理"));
  assert(content.includes("force-policy=直接连接"));
  assert(content.includes("img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Airport.png"));
  assert(content.endsWith("\n"));
});

test("buildConfig 生成不依赖固定订阅名称的地区策略组", () => {
  const content = buildConfig();

  assert(!content.includes("resource-tag-regex=我的节点订阅"));
  assert(content.includes("static = 出境代理, proxy, 香港节点"));
  assert(content.includes("resource-tag-regex=.*"));
  assert(content.includes("server-tag-regex=🇯🇵|日本"));
  assert(content.includes("server-tag-regex=🇺🇸|美国"));
});

test("buildConfig 默认关闭 AAAA 解析以减少移动网络 IPv6 干扰", () => {
  const content = buildConfig();

  assert.match(content, /\[dns]\n[\s\S]*\nno-ipv6\n/);
});

test("buildConfig 使用 KOP-XIAO 在客户端解析 Loyalsoldier 规则", () => {
  const content = buildConfig();

  assert(!content.includes("Rules/Generated/Loyalsoldier"));
  assert(!content.includes("ChinaMax/ChinaMax.list"));
  assert(content.includes("Loyalsoldier/surge-rules/release/ruleset/gfw.txt"));
  assert(content.includes("Loyalsoldier/surge-rules/release/ruleset/direct.txt"));
  assert(content.includes("Loyalsoldier/surge-rules/release/ruleset/private.txt"));
  assert(content.includes("tag=通用直连补充, force-policy=直接连接, update-interval=86400, opt-parser=true, enabled=true"));
});

test("generateLiteConfig 写入稳定配置，内容未变化时不创建新的日期快照", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "qx-lite-"));
  const today = "20260528";
  const current = buildConfig();

  fs.writeFileSync(path.join(tempDir, STABLE_CONFIG_FILE_NAME), current);
  fs.writeFileSync(path.join(tempDir, `QuantumultX-Lite-${today}.conf`), current);

  const result = generateLiteConfig({ rootDir: tempDir, today });

  assert.equal(result.stableChanged, false);
  assert.equal(result.snapshotChanged, false);
  assert.equal(result.snapshotFileName, `QuantumultX-Lite-${today}.conf`);
  assert.equal(findLatestSnapshot(tempDir), `QuantumultX-Lite-${today}.conf`);
});

test("generateLiteConfig 在内容变化时创建当天日期快照", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "qx-lite-"));
  const today = "20260529";

  fs.writeFileSync(path.join(tempDir, "QuantumultX-Lite-20260528.conf"), "# old\n");

  const result = generateLiteConfig({ rootDir: tempDir, today });

  assert.equal(result.stableChanged, true);
  assert.equal(result.snapshotChanged, true);
  assert.equal(result.snapshotFileName, `QuantumultX-Lite-${today}.conf`);
  assert.equal(fs.existsSync(path.join(tempDir, `QuantumultX-Lite-${today}.conf`)), true);
});
