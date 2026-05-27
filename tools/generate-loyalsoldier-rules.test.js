const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  buildGeneratedRuleFile,
  convertSurgeRules,
  generateRuleFiles,
} = require("./generate-loyalsoldier-rules");

test("convertSurgeRules 将支持的 Surge 类型转换为 Quantumult X 类型", () => {
  const result = convertSurgeRules(
    [
      "# comment",
      "DOMAIN,example.com",
      "DOMAIN-SUFFIX,example.org",
      "DOMAIN-KEYWORD,google",
      "IP-CIDR,1.1.1.0/24,no-resolve",
      "IP-CIDR6,2001:db8::/32,no-resolve",
      "GEOIP,CN",
      "IP-ASN,15169",
      "USER-AGENT,MicroMessenger*",
      "",
    ].join("\n"),
  );

  assert.deepEqual(result.rules, [
    "host, example.com",
    "host-suffix, example.org",
    "host-keyword, google",
    "ip-cidr, 1.1.1.0/24, no-resolve",
    "ip6-cidr, 2001:db8::/32, no-resolve",
    "geoip, CN",
    "ip-asn, 15169",
    "user-agent, MicroMessenger*",
  ]);
  assert.deepEqual(result.unsupported, []);
});

test("convertSurgeRules 去重并记录不支持的规则类型", () => {
  const result = convertSurgeRules("DOMAIN,example.com\nDOMAIN,example.com\nPROCESS-NAME,Telegram");

  assert.deepEqual(result.rules, ["host, example.com"]);
  assert.equal(result.duplicates, 1);
  assert.deepEqual(result.unsupported, [{ line: 3, type: "PROCESS-NAME", raw: "PROCESS-NAME,Telegram" }]);
});

test("buildGeneratedRuleFile 写入来源和生成说明", () => {
  const content = buildGeneratedRuleFile({
    name: "GFW",
    sourceUrl: "https://example.com/gfw.txt",
    rules: ["host-suffix, example.com"],
  });

  assert(content.includes("# Source: https://example.com/gfw.txt"));
  assert(content.includes("host-suffix, example.com"));
  assert(content.endsWith("\n"));
});

test("generateRuleFiles 根据清单写入生成规则文件", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "loyal-rules-"));
  const sources = [
    {
      name: "GFW",
      fileName: "GFW.list",
      sourceUrl: "https://example.com/gfw.txt",
      content: "DOMAIN-SUFFIX,example.com",
    },
  ];

  const report = await generateRuleFiles({
    rootDir: tempDir,
    sources,
    fetchText: async (source) => source.content,
  });

  assert.equal(report.changed, true);
  assert.equal(report.files.length, 1);
  assert.equal(fs.existsSync(path.join(tempDir, "Rules", "Generated", "Loyalsoldier", "GFW.list")), true);
});
