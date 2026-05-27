# Quantumult X Rule Validator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一个只读 Quantumult X 仓库校验脚本，用于扫描规则、重写、配置和文档中的格式问题、重复规则和旧链接。

**Architecture:** 使用 Node.js 标准库实现单文件 CLI，并用 `node:test` 增加轻量测试。脚本默认输出文本报告，支持 `--json`、`--strict` 和 `--path` 参数，第一阶段只报告问题，不修改仓库规则。

**Tech Stack:** Node.js、Node.js 标准库 `fs`、`path`、`node:test`、`node:assert`、PowerShell、Git。

---

## 文件结构

- Create: `tools/validate-qx-rules.js`
  - CLI 入口、参数解析、文件扫描、规则校验、报告输出、退出码控制。
- Create: `tools/validate-qx-rules.test.js`
  - 使用 Node.js 内置测试框架覆盖 CLI 行为和核心报告输出。
- Create: `tools/fixtures/qx-validator/valid.list`
  - 正常 `.list` 样例。
- Create: `tools/fixtures/qx-validator/invalid.list`
  - 字段不足、未知规则、重复规则样例。
- Create: `tools/fixtures/qx-validator/legacy.md`
  - 旧链接样例。
- Create: `tools/fixtures/qx-validator/sample.conf`
  - 配置区块样例。
- Modify: `README.md`
  - 增加本地校验命令说明。

---

### Task 1: 添加测试样例

**Files:**
- Create: `tools/fixtures/qx-validator/valid.list`
- Create: `tools/fixtures/qx-validator/invalid.list`
- Create: `tools/fixtures/qx-validator/legacy.md`
- Create: `tools/fixtures/qx-validator/sample.conf`

- [ ] **Step 1: 创建正常分流规则样例**

Create `tools/fixtures/qx-validator/valid.list`:

```ini
# 正常规则
host-suffix,google.com,Google
host-keyword,youtube,Google
ip-cidr,10.0.0.0/8,direct
ip6-cidr,2001:db8::/32,direct
geoip,cn,direct
final,Final
```

- [ ] **Step 2: 创建异常分流规则样例**

Create `tools/fixtures/qx-validator/invalid.list`:

```ini
# 重复规则和字段不足
host-suffix,steamstatic.com,Steam
host-suffix,steamstatic.com,Steam
host-suffix,missing-policy
unknown-rule,example.com,Proxy
```

- [ ] **Step 3: 创建旧链接文档样例**

Create `tools/fixtures/qx-validator/legacy.md`:

```markdown
# 旧链接样例

https://r.sveir.xyz/Rules/Media/ForeignMedia.list
https://t.me/sve1r
```

- [ ] **Step 4: 创建配置样例**

Create `tools/fixtures/qx-validator/sample.conf`:

```ini
[general]
dns_exclusion_list = *.lan, *.local

[dns]
server = 223.5.5.5

[policy]
static = OutSide, Hong Kong, direct

[filter_remote]
https://r.sveir.xyz/Rules/Services/Google.list, tag=Google, force-policy=Google, enabled=true

[rewrite_remote]
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rewrite/AdBlock/Zhihu.adblock, tag=知乎去广告, enabled=true
```

- [ ] **Step 5: 检查样例文件存在**

Run:

```powershell
Get-ChildItem tools\fixtures\qx-validator
```

Expected:

```text
valid.list
invalid.list
legacy.md
sample.conf
```

- [ ] **Step 6: 提交测试样例**

```powershell
git add tools/fixtures/qx-validator
git commit -m "test: add quantumult x validator fixtures"
```

---

### Task 2: 实现校验脚本

**Files:**
- Create: `tools/validate-qx-rules.js`

- [ ] **Step 1: 编写 CLI 脚本**

Create `tools/validate-qx-rules.js`:

```javascript
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SUPPORTED_EXTENSIONS = new Set([".list", ".adblock", ".unlock", ".conf", ".md"]);
const EXCLUDED_DIRS = new Set([".git", "node_modules", ".github"]);
const RULE_TYPES = new Set([
  "host",
  "host-suffix",
  "host-keyword",
  "host-wildcard",
  "ip-cidr",
  "ip6-cidr",
  "ip-asn",
  "geoip",
  "user-agent",
  "final",
]);
const CONFIG_SECTIONS = [
  "[general]",
  "[dns]",
  "[policy]",
  "[server_remote]",
  "[filter_remote]",
  "[rewrite_remote]",
  "[mitm]",
];
const LEGACY_PATTERNS = [
  { pattern: /r\.sveir\.xyz/i, label: "旧 CDN 域名 r.sveir.xyz" },
  { pattern: /sve1r/i, label: "旧维护者标识 sve1r" },
  { pattern: /t\.me\/sve1r/i, label: "旧 Telegram 链接 t.me/sve1r" },
  { pattern: /rules-for-qx\.sveir/i, label: "旧规则域名 rules-for-qx.sveir" },
];

function parseArgs(argv) {
  const options = {
    json: false,
    strict: false,
    targetPath: process.cwd(),
  };

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      options.json = true;
    } else if (arg === "--strict") {
      options.strict = true;
    } else if (arg === "--path") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--path 需要提供目录或文件");
      }
      options.targetPath = path.resolve(process.cwd(), value);
      index += 1;
    } else {
      throw new Error(`未知参数: ${arg}`);
    }
  }

  return options;
}

function normalizePath(filePath, rootDir) {
  return path.relative(rootDir, filePath).replaceAll(path.sep, "/");
}

function walkFiles(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return SUPPORTED_EXTENSIONS.has(path.extname(targetPath).toLowerCase()) ? [targetPath] : [];
  }

  const files = [];
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) {
      continue;
    }

    const nextPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(nextPath));
    } else if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(nextPath);
    }
  }
  return files;
}

function addIssue(issues, severity, file, line, message) {
  issues.push({ severity, file, line, message });
}

function isIgnorableLine(line) {
  const trimmed = line.trim();
  return trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith(";");
}

function checkLegacyLinks(lines, relativeFile, issues) {
  lines.forEach((line, index) => {
    for (const item of LEGACY_PATTERNS) {
      if (!item.pattern.test(line)) {
        continue;
      }

      const severity = relativeFile === "README.md" && line.includes("不再推荐") ? "info" : "warning";
      addIssue(issues, severity, relativeFile, index + 1, `发现${item.label}`);
    }
  });
}

function checkListFile(lines, relativeFile, issues) {
  const seen = new Map();

  lines.forEach((line, index) => {
    if (isIgnorableLine(line)) {
      return;
    }

    const normalized = line.trim().replace(/\s+/g, " ").toLowerCase();
    if (seen.has(normalized)) {
      addIssue(issues, "warning", relativeFile, index + 1, `重复规则，首次出现于第 ${seen.get(normalized)} 行`);
    } else {
      seen.set(normalized, index + 1);
    }

    const parts = line.split(",").map((part) => part.trim());
    const type = parts[0].toLowerCase();
    if (!RULE_TYPES.has(type)) {
      addIssue(issues, "warning", relativeFile, index + 1, `未知规则类型 ${parts[0]}`);
      return;
    }

    if (type === "final") {
      if (parts.length < 2 || parts[1] === "") {
        addIssue(issues, "error", relativeFile, index + 1, "final 规则缺少策略名");
      }
      return;
    }

    if (parts.length < 3 || parts[1] === "" || parts[2] === "") {
      addIssue(issues, "error", relativeFile, index + 1, "规则字段不足，需要规则类型、匹配内容和策略名");
    }
  });
}

function checkRewriteFile(lines, relativeFile, issues) {
  const rewriteActions = [
    " url reject",
    " url 302",
    " url request-header",
    " url response-header",
    " url request-body",
    " url response-body",
    " url script-request-header",
    " url script-request-body",
    " url script-response-header",
    " url script-response-body",
    " url script-analyze-echo-response",
  ];

  lines.forEach((line, index) => {
    if (isIgnorableLine(line)) {
      return;
    }
    const trimmed = line.trim();
    if (/^hostname\s*=/i.test(trimmed)) {
      return;
    }
    const lower = ` ${trimmed.toLowerCase()}`;
    if (!rewriteActions.some((action) => lower.includes(action))) {
      addIssue(issues, "warning", relativeFile, index + 1, "重写规则缺少可识别动作");
    }
  });
}

function checkConfFile(lines, relativeFile, issues) {
  const sectionSet = new Set(lines.map((line) => line.trim().toLowerCase()).filter((line) => line.startsWith("[") && line.endsWith("]")));
  for (const section of CONFIG_SECTIONS) {
    if (!sectionSet.has(section)) {
      addIssue(issues, "info", relativeFile, 1, `示例配置缺少常见区块 ${section}`);
    }
  }
}

function scanFile(filePath, rootDir, issues) {
  const relativeFile = normalizePath(filePath, rootDir);
  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  checkLegacyLinks(lines, relativeFile, issues);

  if (ext === ".list") {
    checkListFile(lines, relativeFile, issues);
  } else if (ext === ".adblock" || ext === ".unlock") {
    checkRewriteFile(lines, relativeFile, issues);
  } else if (ext === ".conf") {
    checkConfFile(lines, relativeFile, issues);
  }
}

function buildReport(targetPath) {
  const rootDir = fs.statSync(targetPath).isFile() ? path.dirname(targetPath) : targetPath;
  const files = walkFiles(targetPath).sort();
  const issues = [];

  for (const file of files) {
    scanFile(file, rootDir, issues);
  }

  const summary = {
    filesScanned: files.length,
    errors: issues.filter((issue) => issue.severity === "error").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    infos: issues.filter((issue) => issue.severity === "info").length,
  };

  return { summary, issues };
}

function formatText(report) {
  const lines = [
    "Quantumult X 规则校验报告",
    "",
    `扫描文件: ${report.summary.filesScanned}`,
    `错误: ${report.summary.errors}`,
    `警告: ${report.summary.warnings}`,
    `信息: ${report.summary.infos}`,
    "",
  ];

  for (const issue of report.issues) {
    lines.push(`[${issue.severity}] ${issue.file}:${issue.line} ${issue.message}`);
  }

  return lines.join("\n");
}

function main() {
  try {
    const options = parseArgs(process.argv);
    const report = buildReport(options.targetPath);
    const output = options.json ? JSON.stringify(report, null, 2) : formatText(report);
    console.log(output);
    process.exitCode = options.strict && report.summary.errors > 0 ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildReport,
  formatText,
  parseArgs,
};
```

- [ ] **Step 2: 运行脚本扫描样例目录**

Run:

```powershell
node tools/validate-qx-rules.js --path tools/fixtures/qx-validator
```

Expected:

```text
Quantumult X 规则校验报告

扫描文件: 4
错误: 1
警告: 5
信息: 3
```

输出的具体问题应包含：

```text
重复规则，首次出现于第 2 行
规则字段不足，需要规则类型、匹配内容和策略名
未知规则类型 unknown-rule
发现旧 CDN 域名 r.sveir.xyz
发现旧维护者标识 sve1r
发现旧 Telegram 链接 t.me/sve1r
示例配置缺少常见区块 [server_remote]
示例配置缺少常见区块 [mitm]
```

- [ ] **Step 3: 运行 JSON 输出**

Run:

```powershell
node tools/validate-qx-rules.js --path tools/fixtures/qx-validator --json
```

Expected:

```text
{
  "summary": {
    "filesScanned": 4
  }
}
```

完整输出必须是合法 JSON。

- [ ] **Step 4: 运行严格模式**

Run:

```powershell
node tools/validate-qx-rules.js --path tools/fixtures/qx-validator --strict
```

Expected:

```text
退出码为 1，因为 invalid.list 存在 error。
```

- [ ] **Step 5: 提交脚本**

```powershell
git add tools/validate-qx-rules.js
git commit -m "feat: add quantumult x rule validator"
```

---

### Task 3: 添加自动化测试

**Files:**
- Create: `tools/validate-qx-rules.test.js`

- [ ] **Step 1: 编写测试文件**

Create `tools/validate-qx-rules.test.js`:

```javascript
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
```

- [ ] **Step 2: 运行测试**

Run:

```powershell
node --test tools/validate-qx-rules.test.js
```

Expected:

```text
# pass 4
# fail 0
```

- [ ] **Step 3: 若测试失败，修正脚本或测试**

只允许修正以下文件：

```text
tools/validate-qx-rules.js
tools/validate-qx-rules.test.js
tools/fixtures/qx-validator/*
```

修正后重新运行：

```powershell
node --test tools/validate-qx-rules.test.js
```

Expected:

```text
# fail 0
```

- [ ] **Step 4: 提交测试**

```powershell
git add tools/validate-qx-rules.test.js
git commit -m "test: cover quantumult x rule validator"
```

---

### Task 4: 更新 README 使用说明

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 在 README 的后续维护计划前添加本地校验章节**

Insert before `## 后续维护计划`:

```markdown
## 本地规则校验

仓库提供只读校验脚本，用于检查规则格式、重复规则、旧链接和示例配置常见问题。

```powershell
node tools/validate-qx-rules.js
```

只扫描指定目录：

```powershell
node tools/validate-qx-rules.js --path Rules
```

输出 JSON：

```powershell
node tools/validate-qx-rules.js --json
```

严格模式：

```powershell
node tools/validate-qx-rules.js --strict
```

默认模式只输出报告，不会修改任何文件，也不会因为 warning 阻断流程。`--strict` 模式仅在发现 error 时返回非零退出码，适合后续接入 GitHub Actions。
```

- [ ] **Step 2: 运行 README 旧链接检查**

Run:

```powershell
rg -n "r\.sveir\.xyz|sve1r|rules-for-qx\.sveir|t\.me/sve1r" README.md
```

Expected:

```text
只允许出现“旧链接说明”语境中的 r.sveir.xyz，不应出现推荐导入旧域名。
```

- [ ] **Step 3: 运行全仓校验脚本**

Run:

```powershell
node tools/validate-qx-rules.js
```

Expected:

```text
脚本成功输出报告，退出码为 0。
```

说明：当前仓库历史问题较多，允许输出 warning 和 info；如果存在 error，需要记录数量，不要求本任务内清完。

- [ ] **Step 4: 提交 README 更新**

```powershell
git add README.md
git commit -m "docs: document quantumult x validator usage"
```

---

### Task 5: 最终验证

**Files:**
- Read: `tools/validate-qx-rules.js`
- Read: `tools/validate-qx-rules.test.js`
- Read: `README.md`

- [ ] **Step 1: 运行测试**

Run:

```powershell
node --test tools/validate-qx-rules.test.js
```

Expected:

```text
# fail 0
```

- [ ] **Step 2: 运行 JSON 校验并解析**

Run:

```powershell
node tools/validate-qx-rules.js --path tools/fixtures/qx-validator --json
```

Expected:

```text
输出完整 JSON，包含 summary 和 issues。
```

- [ ] **Step 3: 运行全仓校验**

Run:

```powershell
node tools/validate-qx-rules.js
```

Expected:

```text
输出 Quantumult X 规则校验报告，命令退出码为 0。
```

- [ ] **Step 4: 检查 Git 状态**

Run:

```powershell
git status --short
```

Expected:

```text
允许存在仓库初始化导致的历史未跟踪文件；本计划新增或修改的文件应已提交。
```

- [ ] **Step 5: 提交最终状态说明**

无需额外提交。如果前面任务已分别提交，本步骤只在最终回复中列出：

- 新增脚本路径。
- 测试命令和结果。
- 全仓校验报告的错误、警告、信息数量。
- 未处理的历史问题类型。

---

## 自检结果

- 设计文档中的 CLI 参数均有对应实现任务。
- `.list`、`.adblock`、`.unlock`、`.conf`、`.md` 的扫描范围均有对应实现任务。
- 文本输出、JSON 输出、严格模式、路径过滤均有测试或验证步骤。
- 本计划不包含自动修改规则文件的步骤，符合只读校验目标。
