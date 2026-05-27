# Rules For Quantumult X

面向 Quantumult X 的配置仓库，核心目标是：

- 提供可直接导入的轻量配置与订阅入口；
- 复用上游规则源，不在本仓库自建 `.list` 分流规则；
- 通过 GitHub Actions 自动校验与自动更新，降低维护成本。

## 快速使用

1. 复制下方“一键订阅链接”中的配置链接或 QuanX 导入链接。  
2. 在 Quantumult X 中导入后，先替换 `[server_remote]` 中的节点订阅示例。  
3. 默认配置仅启用分流，不启用 MITM、重写、解锁脚本或定时任务。  
4. 若导入 Surge/Clash 规则，确保已设置 `resource_parser_url`。  

推荐解析器（直接复用上游，不自建轮子）：

```ini
[general]
resource_parser_url = https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/resource-parser.js
```

## 上游依赖

- 分流规则：`blackmatrix7/ios_rule_script`（QuantumultX 目录）
- 通用规则：`Loyalsoldier/surge-rules`（通过 `opt-parser=true` 转换后使用）
- 解析器：`KOP-XIAO/QuantumultX` 的 `resource-parser.js`

## 一键订阅链接

<!-- AUTO_SUBSCRIPTION_LINKS:START -->
> 自动生成：请勿手改本区块，运行 `node tools/generate-subscription-links.js` 更新。
> 基准配置：`QuantumultX-Lite-20260528.conf`，内容哈希：`10a60bfd3bde`。

### 配置订阅（建议）

```text
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/QuantumultX-Lite-20260528.conf
```

备用 CDN：

```text
https://cdn.jsdelivr.net/gh/dolbyw/Rules-For-Quantumult-X@main/QuantumultX-Lite-20260528.conf
```

### QuanX 一键导入（通用链接）

追加导入（保留现有资源）：

```text
https://quantumult.app/x/open-app/add-resource?remote-resource=%7B%22filter_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FHijacking%2FHijacking.list%2C%20tag%3DHijacking%2C%20force-policy%3Dreject%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FAdvertising.list%2C%20tag%3DAdvertising%2C%20force-policy%3Dreject%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FOpenAI%2FOpenAI.list%2C%20tag%3DOpenAI%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FClaude%2FClaude.list%2C%20tag%3DClaude%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGemini%2FGemini.list%2C%20tag%3DGemini%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGoogle%2FGoogle.list%2C%20tag%3DGoogle%2C%20force-policy%3DGoogle%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGitHub%2FGitHub.list%2C%20tag%3DGitHub%2C%20force-policy%3DGitHub%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FTelegram%2FTelegram.list%2C%20tag%3DTelegram%2C%20force-policy%3DTelegram%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FMicrosoft%2FMicrosoft.list%2C%20tag%3DMicrosoft%2C%20force-policy%3DMicrosoft%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FYouTube%2FYouTube.list%2C%20tag%3DYouTube%2C%20force-policy%3DForeignMedia%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobalMedia%2FGlobalMedia.list%2C%20tag%3DForeignMedia%2C%20force-policy%3DForeignMedia%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMedia%2FChinaMedia.list%2C%20tag%3DDomesticMedia%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FApple%2FApple.list%2C%20tag%3DApple%2C%20force-policy%3DApple%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMax%2FChinaMax.list%2C%20tag%3DDomestic%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%5D%7D
```

覆盖导入（替换现有资源）：

```text
https://quantumult.app/x/open-app/update-configuration?remote-resource=%7B%22filter_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FHijacking%2FHijacking.list%2C%20tag%3DHijacking%2C%20force-policy%3Dreject%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FAdvertising.list%2C%20tag%3DAdvertising%2C%20force-policy%3Dreject%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FOpenAI%2FOpenAI.list%2C%20tag%3DOpenAI%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FClaude%2FClaude.list%2C%20tag%3DClaude%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGemini%2FGemini.list%2C%20tag%3DGemini%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGoogle%2FGoogle.list%2C%20tag%3DGoogle%2C%20force-policy%3DGoogle%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGitHub%2FGitHub.list%2C%20tag%3DGitHub%2C%20force-policy%3DGitHub%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FTelegram%2FTelegram.list%2C%20tag%3DTelegram%2C%20force-policy%3DTelegram%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FMicrosoft%2FMicrosoft.list%2C%20tag%3DMicrosoft%2C%20force-policy%3DMicrosoft%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FYouTube%2FYouTube.list%2C%20tag%3DYouTube%2C%20force-policy%3DForeignMedia%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobalMedia%2FGlobalMedia.list%2C%20tag%3DForeignMedia%2C%20force-policy%3DForeignMedia%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMedia%2FChinaMedia.list%2C%20tag%3DDomesticMedia%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FApple%2FApple.list%2C%20tag%3DApple%2C%20force-policy%3DApple%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMax%2FChinaMax.list%2C%20tag%3DDomestic%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%5D%7D
```

### QuanX URL Scheme（App 直开）

追加导入：

```text
quantumult-x:///add-resource?remote-resource=%7B%22filter_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FHijacking%2FHijacking.list%2C%20tag%3DHijacking%2C%20force-policy%3Dreject%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FAdvertising.list%2C%20tag%3DAdvertising%2C%20force-policy%3Dreject%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FOpenAI%2FOpenAI.list%2C%20tag%3DOpenAI%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FClaude%2FClaude.list%2C%20tag%3DClaude%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGemini%2FGemini.list%2C%20tag%3DGemini%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGoogle%2FGoogle.list%2C%20tag%3DGoogle%2C%20force-policy%3DGoogle%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGitHub%2FGitHub.list%2C%20tag%3DGitHub%2C%20force-policy%3DGitHub%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FTelegram%2FTelegram.list%2C%20tag%3DTelegram%2C%20force-policy%3DTelegram%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FMicrosoft%2FMicrosoft.list%2C%20tag%3DMicrosoft%2C%20force-policy%3DMicrosoft%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FYouTube%2FYouTube.list%2C%20tag%3DYouTube%2C%20force-policy%3DForeignMedia%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobalMedia%2FGlobalMedia.list%2C%20tag%3DForeignMedia%2C%20force-policy%3DForeignMedia%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMedia%2FChinaMedia.list%2C%20tag%3DDomesticMedia%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FApple%2FApple.list%2C%20tag%3DApple%2C%20force-policy%3DApple%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMax%2FChinaMax.list%2C%20tag%3DDomestic%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%5D%7D
```

覆盖导入：

```text
quantumult-x:///update-configuration?remote-resource=%7B%22filter_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FHijacking%2FHijacking.list%2C%20tag%3DHijacking%2C%20force-policy%3Dreject%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FAdvertising.list%2C%20tag%3DAdvertising%2C%20force-policy%3Dreject%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FOpenAI%2FOpenAI.list%2C%20tag%3DOpenAI%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FClaude%2FClaude.list%2C%20tag%3DClaude%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGemini%2FGemini.list%2C%20tag%3DGemini%2C%20force-policy%3DAI%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGoogle%2FGoogle.list%2C%20tag%3DGoogle%2C%20force-policy%3DGoogle%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGitHub%2FGitHub.list%2C%20tag%3DGitHub%2C%20force-policy%3DGitHub%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FTelegram%2FTelegram.list%2C%20tag%3DTelegram%2C%20force-policy%3DTelegram%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FMicrosoft%2FMicrosoft.list%2C%20tag%3DMicrosoft%2C%20force-policy%3DMicrosoft%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FYouTube%2FYouTube.list%2C%20tag%3DYouTube%2C%20force-policy%3DForeignMedia%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobalMedia%2FGlobalMedia.list%2C%20tag%3DForeignMedia%2C%20force-policy%3DForeignMedia%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMedia%2FChinaMedia.list%2C%20tag%3DDomesticMedia%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FApple%2FApple.list%2C%20tag%3DApple%2C%20force-policy%3DApple%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMax%2FChinaMax.list%2C%20tag%3DDomestic%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%5D%7D
```

<!-- AUTO_SUBSCRIPTION_LINKS:END -->
## 推荐导入顺序

推荐直接使用 `QuantumultX-Lite-20260528.conf`。下面是该配置内置的远程分流顺序：

```ini
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Advertising/Hijacking/Hijacking.list, tag=Hijacking, force-policy=reject, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Advertising/Advertising.list, tag=Advertising, force-policy=reject, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/OpenAI/OpenAI.list, tag=OpenAI, force-policy=AI, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Claude/Claude.list, tag=Claude, force-policy=AI, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Gemini/Gemini.list, tag=Gemini, force-policy=AI, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Google/Google.list, tag=Google, force-policy=Google, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GitHub/GitHub.list, tag=GitHub, force-policy=GitHub, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Telegram/Telegram.list, tag=Telegram, force-policy=Telegram, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Microsoft/Microsoft.list, tag=Microsoft, force-policy=Microsoft, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/YouTube/YouTube.list, tag=YouTube, force-policy=ForeignMedia, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GlobalMedia/GlobalMedia.list, tag=ForeignMedia, force-policy=ForeignMedia, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ChinaMedia/ChinaMedia.list, tag=DomesticMedia, force-policy=direct, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Apple/Apple.list, tag=Apple, force-policy=Apple, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ChinaMax/ChinaMax.list, tag=Domestic, force-policy=direct, enabled=true
```

可选 Loyalsoldier（默认关闭）：

```ini
;https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/gfw.txt, tag=Loyal-GFW, force-policy=OutSide, opt-parser=true, enabled=false
;https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/direct.txt, tag=Loyal-Direct, force-policy=direct, opt-parser=true, enabled=false
```

## 仓库结构

| 路径 | 作用 |
|---|---|
| .github/workflows/ | 自动化工作流（测试、校验、自动更新）。 |
| QuantumultX-Lite-*.conf | 当前推荐订阅配置，仅启用分流。 |
| Rewrite/ | 可选重写规则（默认配置不启用）。 |
| Rules/ | 规则说明占位目录（历史结构保留）。 |
| Scripts/ | 可选脚本资源（默认配置不启用）。 |
| Sample_v*.conf | 历史示例配置（不作为推荐订阅）。 |
| tools/ | 维护工具（生成 README、校验规则、审计配置）。 |
| README.md | 远程仓库主说明（本文件）。 |
| README.local.md | 本地开发文档（已忽略，不提交远程）。 |

## 文件说明索引

本节按当前工作区文件树生成，覆盖 142 个文件。

| 文件 | 说明 |
|---|---|
| `.github/ISSUE_TEMPLATE/bug.md` | Issue 模板。 |
| `.github/ISSUE_TEMPLATE/需求请求.md` | Issue 模板。 |
| `.github/workflows/auto-update.yml` | GitHub Actions 工作流。 |
| `.github/workflows/validate.yml` | GitHub Actions 工作流。 |
| `.gitignore` | 项目文件。 |
| `CODE_OF_CONDUCT.md` | 文档。 |
| `LICENSE` | 开源许可证。 |
| `QuantumultX-Lite-20260528.conf` | 项目文件。 |
| `README.md` | 项目主说明。 |
| `Rewrite/4limbo.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/Amap.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/BdMap.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/BiliBili.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/Cainiao.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/ChinaUnicom.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/Colorful.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/CoolApk.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/Didi.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/Keep.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/NeteaseMusic.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/RedNote.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/Smzdm.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/StartUp.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/TieBa.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/TomatoNovel.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/WebAdBlock.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/Weibo.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/Weibo_New.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/Youtube.adblock` | 重写规则资源。 |
| `Rewrite/AdBlock/Zhihu.adblock` | 重写规则资源。 |
| `Rewrite/Advertising.adblock` | 重写规则资源。 |
| `Rewrite/Functional/BlockAppUpgrade.conf` | 重写规则资源。 |
| `Rewrite/Functional/BlockHttpDNS.conf` | 重写规则资源。 |
| `Rewrite/Functional/FakeSiteRedirect.conf` | 重写规则资源。 |
| `Rewrite/Functional/RedirectToHttps.conf` | 重写规则资源。 |
| `Rewrite/Rewrite_CornersHua.conf` | 重写规则资源。 |
| `Rewrite/Rewrite_General.conf` | 重写规则资源。 |
| `Rewrite/Rewrite_NodyDa.conf` | 重写规则资源。 |
| `Rewrite/Rewrite_lhie1.conf` | 重写规则资源。 |
| `Rewrite/Services/Apple/Location/Readme.md` | 重写规则资源。 |
| `Rewrite/Services/Apple/TestFlight/README.md` | 重写规则资源。 |
| `Rewrite/Services/Apple/TestFlight/TestFlightAccount.js` | 重写规则资源。 |
| `Rewrite/Services/Apple/TestFlight/TestFlightDownload.conf` | 重写规则资源。 |
| `Rewrite/Services/Apple/TestFlight/TestFlightDownload.js` | 重写规则资源。 |
| `Rewrite/Services/Google/GoogleRecaptcha.js` | 重写规则资源。 |
| `Rewrite/Services/Google/GoogleRecaptcha.min.js` | 重写规则资源。 |
| `Rewrite/Services/Google/GoogleRecaptcha.rewrite` | 重写规则资源。 |
| `Rules/Media/Readme.md` | 规则说明文档。 |
| `Sample_v1.0.9.conf` | 示例配置。 |
| `Sample_v1.1.0.conf` | 示例配置。 |
| `Sample_v1.4.0.conf` | 示例配置。 |
| `Sample_v1.4.2.conf` | 示例配置。 |
| `Sample_v1.5.3.conf` | 示例配置。 |
| `Scripts/AdBlock/BiliBili/BiliBili.AdBlock.response.js` | 脚本资源。 |
| `Scripts/AdBlock/BiliBili/BiliBili.AdBlock.response.min.js` | 脚本资源。 |
| `Scripts/AdBlock/BiliBili/BiliBili.js` | 脚本资源。 |
| `Scripts/AdBlock/BiliBili/BiliBili.min.js` | 脚本资源。 |
| `Scripts/AdBlock/BiliBili/BiliBili.protobuf.js` | 脚本资源。 |
| `Scripts/AdBlock/BiliBili/BiliBili.protobuf.min.js` | 脚本资源。 |
| `Scripts/AdBlock/JD/jd_search_json.js` | 脚本资源。 |
| `Scripts/AdBlock/JD/jx_startup.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/12306.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Ahfs.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/AliyunDrive.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Amap.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Amap.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Amdc.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Amdc.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/BahamutAnimeAds.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/BahamutAnimeAds.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/BaiduMap.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/BaiduMap.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Cainiao.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Cainiao.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Colorful.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Colorful.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/CoolApk.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/CoolApk.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Didi.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Didi.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Dongqiudi.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/FlyPiggy.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/ITHome.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/ITHome.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Keep.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Keep.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Netease.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Netease.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/PupuMarket.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Quark.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Quark.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/SfExpress.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Stay.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Tieba.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Tieba.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/UmeTrip.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/UmeTrip.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Youtube.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Youtube.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Zhihu.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/Zhihu.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/iQiyi.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/smzdm.js` | 脚本资源。 |
| `Scripts/AdBlock/Other/smzdm.min.js` | 脚本资源。 |
| `Scripts/AdBlock/RedNote/RedNote.js` | 脚本资源。 |
| `Scripts/AdBlock/RedNote/RedNote.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Wechat/UnlockLink.js` | 脚本资源。 |
| `Scripts/AdBlock/Wechat/UnlockLink.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Wechat/Wechat.js` | 脚本资源。 |
| `Scripts/AdBlock/Weibo/weibo.js` | 脚本资源。 |
| `Scripts/AdBlock/Weibo/weibo.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Weibo/weibo_new.js` | 脚本资源。 |
| `Scripts/AdBlock/Weibo/weibo_new.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Weibo/weibo_search_info.json` | 脚本资源。 |
| `Scripts/AdBlock/Weibo/weibo_search_topic.json` | 脚本资源。 |
| `Scripts/AdBlock/Zhihu/Answer.js` | 脚本资源。 |
| `Scripts/AdBlock/Zhihu/Feed.js` | 脚本资源。 |
| `Scripts/AdBlock/Zhihu/Link.js` | 脚本资源。 |
| `Scripts/AdBlock/Zhihu/People.js` | 脚本资源。 |
| `Scripts/AdBlock/Zhihu/Recommend.js` | 脚本资源。 |
| `Scripts/AdBlock/Zhihu/ScreenAdvs.js` | 脚本资源。 |
| `Scripts/AdBlock/Zhihu/Zhihu.js` | 脚本资源。 |
| `Scripts/AdBlock/Zhihu/Zhihu.min.js` | 脚本资源。 |
| `Scripts/AdBlock/Zhihu/Zhihu_dep.js` | 脚本资源。 |
| `Scripts/Readme.md` | 脚本资源。 |
| `images/logo.png` | 静态资源。 |
| `tools/audit-sample-configs.js` | 维护脚本。 |
| `tools/audit-sample-configs.test.js` | 维护脚本。 |
| `tools/check-maintenance.js` | 维护脚本。 |
| `tools/check-maintenance.test.js` | 维护脚本。 |
| `tools/fixtures/qx-audit/bad/Sample_bad.conf` | 校验器测试样例。 |
| `tools/fixtures/qx-audit/good/Sample_ok.conf` | 校验器测试样例。 |
| `tools/fixtures/qx-validator/compatible-format/policyless-asn.list` | 校验器测试样例。 |
| `tools/fixtures/qx-validator/duplicate/duplicate.list` | 校验器测试样例。 |
| `tools/fixtures/qx-validator/legacy-link/legacy.md` | 校验器测试样例。 |
| `tools/fixtures/qx-validator/real-error/invalid.list` | 校验器测试样例。 |
| `tools/generate-readme-index.js` | 维护脚本。 |
| `tools/generate-readme-index.test.js` | 维护脚本。 |
| `tools/generate-subscription-links.js` | 维护脚本。 |
| `tools/generate-subscription-links.test.js` | 维护脚本。 |
| `tools/validate-qx-rules.js` | 维护脚本。 |
| `tools/validate-qx-rules.test.js` | 维护脚本。 |
## 当前仓库审查结论

- 已切换到上游规则源维护模式（不再自建 `.list` 分流规则）。
- 已接入自动化：测试、strict 校验、维护检查、定时更新。
- 配置兼容策略：通过 `resource_parser_url + opt-parser=true` 兼容非原生格式规则。

## 校验命令

```powershell
node --test tools/*.test.js
node tools/generate-subscription-links.js --check
node tools/generate-readme-index.js --check
node tools/validate-qx-rules.js --strict
node tools/audit-sample-configs.js --strict
node tools/check-maintenance.js
```

## 许可与免责声明

本仓库遵循 [MIT License](LICENSE)。规则与脚本仅供学习和自用，使用前请确认合规与风险。
