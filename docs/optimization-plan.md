# Quantumult X 规则仓库优化计划书

## 审计时间

2026-05-27。

## 项目现状

本仓库用于维护 Quantumult X 的分流规则、重写规则、脚本资源和示例配置。当前工作区共有 308 个文件，类型分布以 JavaScript 脚本、`.list` 分流规则、`.adblock`/`.unlock` 重写资源和示例配置为主。

本轮审计开始时，Git 只跟踪 9 个文件，其余 299 个文件仍处于未跟踪状态。这意味着仓库内容和版本历史尚未完全对齐，后续任何清理、替换或发布动作都应先处理版本管理边界。

## 自动校验结果

运行 `node tools/validate-qx-rules.js` 的摘要如下：

| 指标 | 数量 |
|---|---:|
| 扫描文件 | 165 |
| error | 753 |
| warning | 577 |
| info | 76 |

主要问题类型：

| 问题类型 | 数量 | 说明 |
|---|---:|---|
| 规则字段不足 | 753 | 多数集中在 `Rules/`，需要区分真实格式错误和旧规则格式兼容问题。 |
| 重写规则缺少可识别动作 | 296 | 多数集中在 `Rewrite/`，需要按 Quantumult X 语法逐类校准校验器。 |
| 示例配置缺少常见区块 | 75 | 多个历史示例配置缺少 `[server_local]`、`[server_remote]`、`[mitm]` 等常见区块。 |
| 重复规则 | 多处 | `Rules/Region/Global.list`、`BackCN/BackCN.list` 等存在大量重复项。 |
| 旧链接残留 | 多处 | `r.sveir.xyz`、`sve1r`、旧 jsDelivr/GitHub 路径仍出现在示例配置、重写资源和子 README 中。 |

## 高优先级问题

1. 版本管理未闭合：先决定是否把当前 299 个未跟踪文件全部纳入仓库，或者只保留经验证的子集。未完成前，不建议发布 release 或接入自动化部署。
2. 旧链接会误导用户导入不可控资源：历史示例配置和重写资源中大量引用旧域名、旧维护者路径和旧 CDN。应先替换文档推荐入口，再逐步替换规则内部脚本 URL。
3. 解锁类脚本风险高：`Rewrite/Unlock/` 和 `Scripts/Unlock/` 涉及会员、订阅或功能解锁。应在 README 中保持风险提示，并在后续拆分为默认不推荐导入的高风险资源。
4. 校验器需要适配真实规则格式：当前 753 个 error 不能直接视为全部真实错误。下一步应抽样检查 `Rules/Region/Global.list`、`Rules/Advertising/*.list`、媒体集合规则，确定是否需要支持更多合法语法或注释风格。

## 中优先级问题

1. README 和子目录 README 信息不一致：根 README 已切换到当前维护仓库说明，但 `Rules/Media/Readme.md`、`Scripts/Readme.md`、部分服务 README 仍需同步链接和风险说明。
2. 示例配置版本过多：`Sample_v1.0.9.conf` 到 `Sample_v1.5.3.conf` 均为历史配置。建议新增一个当前维护版示例配置，并把旧版本归档说明用途。
3. minified 脚本和源码脚本缺少对应关系说明：多数 `.min.js` 与未压缩脚本并存，但 README 未说明来源、生成方式或是否需要同时维护。
4. 缺少自动化发布/校验流程：可以增加 GitHub Actions，在 PR 中运行规则校验、旧链接检查、README 文件索引一致性检查。

## 低优先级整理项

1. 统一命名大小写，例如 `NiceGram`/`Nicegram`、`GoodBility`/`Goodbility`。
2. 给高风险脚本增加来源、最后验证时间和适用 App 版本。
3. 为集合规则和细分规则建立生成关系，避免手工重复。
4. 增加变更日志，记录每次大规模规则更新的来源和验证范围。

## 分阶段执行路线

### 第一阶段：仓库边界和文档收敛

- 决定未跟踪文件是否全部纳入版本管理。
- 保持根 README 的当前维护入口。
- 为每个文件补充 README 索引说明。
- 保留高风险资源提示，不默认推荐解锁类导入。

### 第二阶段：校验器校准

- 抽样检查 `Rules/` 中被报 error 的文件。
- 扩展或修正校验器支持的合法 Quantumult X 语法。
- 将测试 fixture 分为真实错误、兼容格式、旧链接和重复规则四类。
- 把误报降到可接受范围后再启用 `--strict`。

### 第三阶段：旧链接替换

- 先替换 README 和子 README 中的推荐入口。
- 再替换示例配置中的远程规则 URL。
- 最后处理重写资源内部脚本 URL，并逐项验证脚本可访问性。

### 第四阶段：规则去重和拆分

- 优先处理 `Rules/Region/Global.list`、`BackCN/BackCN.list`、`Rules/Services/Microsoft.list` 等重复较多文件。
- 保留集合规则与细分规则的正常重叠，不做跨文件自动删除。
- 对广告、媒体、服务、地区规则分别建立维护策略。

### 第五阶段：自动化

- 增加 GitHub Actions：运行 `node --test tools/validate-qx-rules.test.js`。
- 增加旧链接检查。
- 增加 README 文件索引一致性检查。
- 后续可生成订阅索引，减少手写链接。

## 风险控制

- 不批量自动删除规则。
- 不批量替换脚本 URL，除非已确认目标文件存在且可被 Quantumult X 访问。
- 不把解锁类脚本作为默认推荐资源。
- 每个阶段都先跑校验器和 README 链接搜索，再提交。

## 建议验证命令

```powershell
node --test tools/validate-qx-rules.test.js
node tools/validate-qx-rules.js
node tools/validate-qx-rules.js --json
rg -n "r\.sveir\.xyz|sve1r|rules-for-qx\.sveir|t\.me/sve1r" .
git status --short
```

## 下一步建议

先处理版本管理边界和文档索引，然后选择一个高价值目录做试点，例如 `Rules/Services/OpenAI.list`、`Rules/Services/Google.list`、`Rewrite/AdBlock/Zhihu.adblock`。试点跑通后，再扩展到媒体、广告和解锁资源。
