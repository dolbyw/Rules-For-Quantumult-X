const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { buildReport, formatText, parseArgs } = require("./validate-qx-rules");

const fixturePath = path.join(__dirname, "fixtures", "qx-validator");
const compatibleFixturePath = path.join(fixturePath, "compatible-format");
const realErrorFixturePath = path.join(fixturePath, "real-error");
const repoRoot = path.join(__dirname, "..");

test("parseArgs 支持 json、strict 和 path 参数", () => {
  const options = parseArgs(["node", "script", "--json", "--strict", "--path", "Rules"]);

  assert.equal(options.json, true);
  assert.equal(options.strict, true);
  assert.equal(options.targetPath, path.resolve(process.cwd(), "Rules"));
});

test("buildReport 汇总分类样例中的错误、警告和信息", () => {
  const report = buildReport(fixturePath);

  assert.equal(report.summary.filesScanned, 4);
  assert.equal(report.summary.errors, 3);
  assert.equal(report.summary.warnings, 4);
  assert.equal(report.summary.infos, 0);
});

test("buildReport 接受兼容格式中的无显式策略规则和双斜杠注释", () => {
  const report = buildReport(compatibleFixturePath);

  assert.equal(report.summary.errors, 0);
  assert.equal(report.summary.warnings, 0);
});

test("buildReport 输出重复规则、真实字段错误和旧链接", () => {
  const report = buildReport(fixturePath);
  const messages = report.issues.map((issue) => issue.message);

  assert(messages.includes("重复规则，首次出现于第 2 行"));
  assert(messages.includes("规则字段不足，需要规则类型和匹配内容"));
  assert(messages.includes("final 规则缺少策略名"));
  assert(messages.includes("发现旧 CDN 域名 r.sveir.xyz"));
  assert(messages.includes("发现旧维护者标识 sve1r"));
  assert(messages.includes("发现旧 Telegram 链接 t.me/sve1r"));
});

test("formatText 输出文本报告", () => {
  const report = buildReport(realErrorFixturePath);
  const text = formatText(report);

  assert(text.includes("Quantumult X 规则校验报告"));
  assert(text.includes("扫描文件: 1"));
  assert(text.includes("[error] invalid.list:2 规则字段不足，需要规则类型和匹配内容"));
});

test("buildReport 扫描仓库时不把测试 fixtures 计入严格模式错误", () => {
  const report = buildReport(repoRoot);

  assert.equal(report.summary.errors, 0);
});
