# Quantumult X 规则校验脚本设计

## 目标

为当前仓库新增一个只读校验脚本，用于检查 Quantumult X 规则、重写、解锁、示例配置和文档中的常见维护问题。脚本第一阶段只输出报告，不自动修改文件，避免误删规则或改变订阅行为。

## 范围

本阶段校验以下文件类型：

- `.list`：分流规则。
- `.adblock`：重写/去广告资源。
- `.unlock`：解锁类重写资源。
- `.conf`：Quantumult X 示例配置。
- `.md`：文档中的旧链接和订阅示例。

本阶段不处理以下内容：

- 不自动重排规则。
- 不自动删除重复规则。
- 不联网验证域名是否可访问。
- 不判断某个媒体服务是否真实解锁。
- 不修改脚本 `.js` 的业务逻辑。

## 脚本位置

新增：

```text
tools/validate-qx-rules.js
```

该脚本使用 Node.js 标准库实现，不引入第三方依赖，便于在本地和 GitHub Actions 中直接运行。

## 命令接口

基础命令：

```powershell
node tools/validate-qx-rules.js
```

支持参数：

```powershell
node tools/validate-qx-rules.js --json
node tools/validate-qx-rules.js --strict
node tools/validate-qx-rules.js --path Rules
```

参数含义：

- `--json`：输出 JSON 报告，方便后续接入自动化。
- `--strict`：发现错误时使用非零退出码；默认只报告，不阻断。
- `--path <目录或文件>`：只扫描指定路径；未指定时扫描仓库根目录。

## 校验规则

### 文件发现

脚本递归扫描目标路径，排除以下目录：

- `.git`
- `node_modules`
- `.github`

扫描以下后缀：

- `.list`
- `.adblock`
- `.unlock`
- `.conf`
- `.md`

### 分流规则校验

针对 `.list` 文件：

- 忽略空行和以 `#`、`;` 开头的注释行。
- 支持常见 Quantumult X 规则类型：
  - `host`
  - `host-suffix`
  - `host-keyword`
  - `ip-cidr`
  - `ip6-cidr`
  - `ip-asn`
  - `geoip`
  - `user-agent`
  - `final`
  - `host-wildcard`
- 对 `final` 要求至少包含策略名。
- 对其他规则要求至少包含规则类型、匹配内容、策略名三段。
- 对未知规则类型标记为 `warning`，不直接判定为错误，因为仓库中可能存在 Quantumult X 版本差异或兼容写法。
- 对字段数量明显不足标记为 `error`。

### 重写资源校验

针对 `.adblock` 和 `.unlock` 文件：

- 忽略空行和注释行。
- 识别常见动作：
  - `url reject`
  - `url 302`
  - `url request-header`
  - `url response-header`
  - `url request-body`
  - `url response-body`
  - `url script-request-header`
  - `url script-request-body`
  - `url script-response-header`
  - `url script-response-body`
  - `url script-analyze-echo-response`
- 对明显缺少匹配表达式或动作的行标记为 `warning`。
- 对包含 `hostname =` 的行不按重写动作校验。

### 示例配置校验

针对 `.conf` 文件：

- 检查是否存在常见区块：
  - `[general]`
  - `[dns]`
  - `[policy]`
  - `[server_remote]`
  - `[filter_remote]`
  - `[rewrite_remote]`
  - `[mitm]`
- 只报告缺失区块，不作为错误。
- 检查旧域名、旧仓库链接和不可推荐 CDN。

### 文档链接校验

针对 `.md` 和 `.conf` 文件：

- 检查 `r.sveir.xyz`、`sve1r`、旧 Telegram 链接等历史维护痕迹。
- 旧链接标记为 `warning`。
- 如果旧链接出现在根 README 的“历史说明”上下文中，仅标记为 `info`。

### 重复规则检测

针对 `.list` 文件：

- 对同一文件内完全相同的有效规则行检测重复。
- 忽略大小写差异前后的空白差异。
- 输出首次出现位置和重复位置。
- 跨文件重复第一阶段只统计，不作为问题输出，避免误伤集合规则和细分规则之间的正常重叠。

## 报告格式

默认文本输出：

```text
Quantumult X 规则校验报告

扫描文件: 292
错误: 0
警告: 12
信息: 3

[warning] Rules/Games/Steam.list:10 重复规则，首次出现于第 5 行
[warning] Sample_v1.5.3.conf:82 发现旧链接 r.sveir.xyz
```

JSON 输出：

```json
{
  "summary": {
    "filesScanned": 292,
    "errors": 0,
    "warnings": 12,
    "infos": 3
  },
  "issues": [
    {
      "severity": "warning",
      "file": "Rules/Games/Steam.list",
      "line": 10,
      "message": "重复规则，首次出现于第 5 行"
    }
  ]
}
```

## 退出码

- 默认模式：无论发现多少问题，退出码都是 `0`。
- `--strict` 模式：
  - 存在 `error` 时退出码为 `1`。
  - 只有 `warning` 或 `info` 时退出码为 `0`。

## 测试策略

新增轻量测试样例目录：

```text
tools/fixtures/qx-validator/
```

测试脚本通过临时指定 `--path tools/fixtures/qx-validator` 验证：

- 正常 `.list` 不报错。
- 重复规则输出 warning。
- 字段不足输出 error。
- 旧链接输出 warning。
- `--json` 输出可被 `JSON.parse` 解析。
- `--strict` 遇到 error 返回非零退出码。

不引入测试框架，使用 Node.js 内置 `node:test` 和 `node:assert`。

## 后续扩展

后续可以在本设计基础上增加：

- GitHub Actions 自动运行。
- 自动生成订阅索引。
- 跨文件重复统计报告。
- 规则类型白名单按 Quantumult X 版本配置。
- 将校验报告写入 Markdown，供维护者审查。
