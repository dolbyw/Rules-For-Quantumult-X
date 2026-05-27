const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { buildReport, formatText, parseArgs } = require("./validate-qx-rules");

const fixturePath = path.join(__dirname, "fixtures", "qx-validator");

test("parseArgs 支持 json、strict 和 path 参数", () => {
  const options = parseArgs(["node", "script", "--json", "--strict", "--path", "Rules"]);

  assert.equal(options.json, true);
  assert.equal(options.strict, true);
  assert.equal(options.targetPath, path.resolve(process.cwd(), "Rules"));
});

test("buildReport 汇总样例目录中的错误、警告和信息", () => {
  const report = buildReport(fixturePath);

  assert.equal(report.summary.filesScanned, 4);
  assert.equal(report.summary.errors, 1);
  assert.equal(report.summary.warnings, 5);
  assert.equal(report.summary.infos, 3);
});

test("buildReport 输出重复规则、字段不足、未知规则和旧链接", () => {
  const report = buildReport(fixturePath);
  const messages = report.issues.map((issue) => issue.message);

  assert(messages.includes("重复规则，首次出现于第 2 行"));
  assert(messages.includes("规则字段不足，需要规则类型、匹配内容和策略名"));
  assert(messages.includes("未知规则类型 unknown-rule"));
  assert(messages.includes("发现旧 CDN 域名 r.sveir.xyz"));
  assert(messages.includes("发现旧维护者标识 sve1r"));
  assert(messages.includes("发现旧 Telegram 链接 t.me/sve1r"));
});

test("formatText 输出文本报告", () => {
  const report = buildReport(fixturePath);
  const text = formatText(report);

  assert(text.includes("Quantumult X 规则校验报告"));
  assert(text.includes("扫描文件: 4"));
  assert(text.includes("[error] invalid.list:4 规则字段不足，需要规则类型、匹配内容和策略名"));
});
