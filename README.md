# Rules For Quantumult X

本仓库维护 Quantumult X 的示例配置、重写资源与维护脚本，目标是让 iOS 用户直接通过订阅链接完成可用配置导入，并持续跟随上游规则自动更新。

本项目由 [dolbyw/Rules-For-Quantumult-X](https://github.com/dolbyw/Rules-For-Quantumult-X) 继续维护。当前策略是尽量复用成熟上游资源（`blackmatrix7/ios_rule_script`、`Loyalsoldier/surge-rules` + 解析器转换），避免在本仓库自建分流规则轮子。

## 重要说明

- 本仓库仅适用于 Quantumult X，不能直接用于 Clash、Mihomo、Surge 或 Loon。
- 分流规则默认引用 `blackmatrix7/ios_rule_script` 的 `rule/QuantumultX` 目录，不再在本仓库维护自建 `.list` 分流规则。
- `Loyalsoldier/surge-rules` 为 Surge 规则源，语法与 Quantumult X 不完全一致，不作为默认导入源。
- 规则不是越多越好。优先使用集合规则，只有明确需求时再添加细分规则。
- 去广告和脚本重写依赖 HTTPS 解密（MITM），存在隐私、安全和兼容性风险。
- 解锁类脚本可能违反应用服务条款，也可能随应用更新失效。请自行评估风险。
- 本仓库不保证任何流媒体解锁、会员功能、广告拦截或地区访问一定可用。

## 自动化维护

- `validate.yml`：PR / Push 触发，执行测试、规则 strict 校验、配置审计、旧链接检查和 README 索引一致性检查。
- `auto-update.yml`：定时任务触发，自动刷新 README 一键订阅区块和文件索引，执行全量校验并在有变更时自动提交。
- 订阅链接与文件索引均由脚本生成，请不要手改自动生成区块。

## Quantumult X 配置基础

Quantumult X 配置文件由多个区块组成，常见区块如下：

```ini
[general]
[dns]
[policy]
[server_local]
[server_remote]
[filter_local]
[filter_remote]
[rewrite_local]
[rewrite_remote]
[task_local]
[mitm]
```

### 分流规则

分流规则通常写在 `[filter_local]` 或远程 `.list` 文件中，格式为：

```ini
规则类型,匹配内容,策略名
```

常见规则类型：

```ini
host,example.com,Proxy
host-suffix,example.com,Proxy
host-keyword,google,Proxy
ip-cidr,192.168.0.0/16,direct
ip6-cidr,2001:db8::/32,direct
ip-asn,13335,Proxy
geoip,cn,direct
user-agent,Telegram*,Proxy
final,Final
```

常见内置策略：

```ini
direct
reject
```

其他策略名需要在 `[policy]` 中提前定义，例如 `OutSide`、`Hong Kong`、`Advertising`、`Google`。

### 远程分流资源

远程规则写在 `[filter_remote]` 中：

```ini
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Google/Google.list, tag=Google, force-policy=Google, enabled=true
```

常用参数：

- `tag`：Quantumult X 中显示的资源名称。
- `force-policy`：强制覆盖远程规则文件内的策略名。
- `enabled`：是否启用。
- `update-interval`：自动更新时间，单位为秒。
- `opt-parser`：启用资源解析器转换，导入 Surge/Clash 等非原生 Quantumult X 规则时需要开启。
- `inserted-resource`：使用 Quantumult X 内置资源时会出现，如 `FILTER_REGION`、`FILTER_LAN`。

推荐统一使用上游解析器（不要自建解析脚本）：

```ini
[general]
resource_parser_url = https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/resource-parser.js
```

### 远程重写资源

远程重写写在 `[rewrite_remote]` 中：

```ini
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rewrite/AdBlock/Zhihu.adblock, tag=知乎去广告, enabled=true
```

重写规则可能使用：

```ini
url reject
url 302
url script-request-header
url script-request-body
url script-response-header
url script-response-body
url script-analyze-echo-response
```

需要脚本处理 HTTPS 响应体时，一般必须在 `[mitm]` 中添加对应域名，并在系统中安装并信任 Quantumult X 证书。

## 一键订阅链接

<!-- AUTO_SUBSCRIPTION_LINKS:START -->
> 自动生成：请勿手改本区块，运行 `node tools/generate-subscription-links.js` 更新。
> 基准配置：`Sample_v1.5.3.conf`，内容哈希：`fb8c15192512`。

### 配置订阅（建议）

```text
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Sample_v1.5.3.conf
```

备用 CDN：

```text
https://cdn.jsdelivr.net/gh/dolbyw/Rules-For-Quantumult-X@main/Sample_v1.5.3.conf
```

### QuanX 一键导入（通用链接）

追加导入（保留现有资源）：

```text
https://quantumult.app/x/open-app/add-resource?remote-resource=%7B%22filter_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FHijacking%2FHijacking.list%2C%20tag%3DHijacking%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FAdvertising.list%2C%20tag%3DAdvertising%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGoogle%2FGoogle.list%2C%20tag%3DGoogle%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FMicrosoft%2FMicrosoft.list%2C%20tag%3DMicrosoft%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMedia%2FChinaMedia.list%2C%20tag%3DDomesticMedia%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobalMedia%2FGlobalMedia.list%2C%20tag%3DForeignMedia%2C%20force-policy%3DOutSide%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobal%2FGlobal.list%2C%20tag%3DGlobal%2C%20force-policy%3DOutSide%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FApple%2FApple.list%2C%20tag%3DApple%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMax%2FChinaMax.list%2C%20tag%3DDomestic%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%5D%2C%22rewrite_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FWebAdBlock.adblock%2C%20tag%3D%E5%B8%B8%E7%94%A8%E7%BD%91%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FZhihu.adblock%2C%20tag%3D%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FWeibo.adblock%2C%20tag%3D%E5%BE%AE%E5%8D%9A%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FYoutube.adblock%2C%20tag%3DYoutube%20%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdvertising.adblock%2C%20tag%3D%E9%80%9A%E7%94%A8%E5%8E%BB%E5%B9%BF%E5%91%8A%22%5D%7D
```

覆盖导入（替换现有资源）：

```text
https://quantumult.app/x/open-app/update-configuration?remote-resource=%7B%22filter_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FHijacking%2FHijacking.list%2C%20tag%3DHijacking%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FAdvertising.list%2C%20tag%3DAdvertising%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGoogle%2FGoogle.list%2C%20tag%3DGoogle%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FMicrosoft%2FMicrosoft.list%2C%20tag%3DMicrosoft%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMedia%2FChinaMedia.list%2C%20tag%3DDomesticMedia%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobalMedia%2FGlobalMedia.list%2C%20tag%3DForeignMedia%2C%20force-policy%3DOutSide%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobal%2FGlobal.list%2C%20tag%3DGlobal%2C%20force-policy%3DOutSide%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FApple%2FApple.list%2C%20tag%3DApple%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMax%2FChinaMax.list%2C%20tag%3DDomestic%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%5D%2C%22rewrite_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FWebAdBlock.adblock%2C%20tag%3D%E5%B8%B8%E7%94%A8%E7%BD%91%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FZhihu.adblock%2C%20tag%3D%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FWeibo.adblock%2C%20tag%3D%E5%BE%AE%E5%8D%9A%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FYoutube.adblock%2C%20tag%3DYoutube%20%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdvertising.adblock%2C%20tag%3D%E9%80%9A%E7%94%A8%E5%8E%BB%E5%B9%BF%E5%91%8A%22%5D%7D
```

### QuanX URL Scheme（App 直开）

追加导入：

```text
quantumult-x:///add-resource?remote-resource=%7B%22filter_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FHijacking%2FHijacking.list%2C%20tag%3DHijacking%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FAdvertising.list%2C%20tag%3DAdvertising%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGoogle%2FGoogle.list%2C%20tag%3DGoogle%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FMicrosoft%2FMicrosoft.list%2C%20tag%3DMicrosoft%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMedia%2FChinaMedia.list%2C%20tag%3DDomesticMedia%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobalMedia%2FGlobalMedia.list%2C%20tag%3DForeignMedia%2C%20force-policy%3DOutSide%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobal%2FGlobal.list%2C%20tag%3DGlobal%2C%20force-policy%3DOutSide%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FApple%2FApple.list%2C%20tag%3DApple%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMax%2FChinaMax.list%2C%20tag%3DDomestic%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%5D%2C%22rewrite_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FWebAdBlock.adblock%2C%20tag%3D%E5%B8%B8%E7%94%A8%E7%BD%91%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FZhihu.adblock%2C%20tag%3D%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FWeibo.adblock%2C%20tag%3D%E5%BE%AE%E5%8D%9A%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FYoutube.adblock%2C%20tag%3DYoutube%20%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdvertising.adblock%2C%20tag%3D%E9%80%9A%E7%94%A8%E5%8E%BB%E5%B9%BF%E5%91%8A%22%5D%7D
```

覆盖导入：

```text
quantumult-x:///update-configuration?remote-resource=%7B%22filter_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FHijacking%2FHijacking.list%2C%20tag%3DHijacking%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FAdvertising%2FAdvertising.list%2C%20tag%3DAdvertising%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGoogle%2FGoogle.list%2C%20tag%3DGoogle%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FMicrosoft%2FMicrosoft.list%2C%20tag%3DMicrosoft%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMedia%2FChinaMedia.list%2C%20tag%3DDomesticMedia%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobalMedia%2FGlobalMedia.list%2C%20tag%3DForeignMedia%2C%20force-policy%3DOutSide%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FGlobal%2FGlobal.list%2C%20tag%3DGlobal%2C%20force-policy%3DOutSide%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FApple%2FApple.list%2C%20tag%3DApple%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fblackmatrix7%2Fios_rule_script%2Fmaster%2Frule%2FQuantumultX%2FChinaMax%2FChinaMax.list%2C%20tag%3DDomestic%2C%20force-policy%3Ddirect%2C%20enabled%3Dtrue%22%5D%2C%22rewrite_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FWebAdBlock.adblock%2C%20tag%3D%E5%B8%B8%E7%94%A8%E7%BD%91%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FZhihu.adblock%2C%20tag%3D%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FWeibo.adblock%2C%20tag%3D%E5%BE%AE%E5%8D%9A%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdBlock%2FYoutube.adblock%2C%20tag%3DYoutube%20%E5%8E%BB%E5%B9%BF%E5%91%8A%22%2C%22https%3A%2F%2Fraw.githubusercontent.com%2Fdolbyw%2FRules-For-Quantumult-X%2Fmain%2FRewrite%2FAdvertising.adblock%2C%20tag%3D%E9%80%9A%E7%94%A8%E5%8E%BB%E5%B9%BF%E5%91%8A%22%5D%7D
```

<!-- AUTO_SUBSCRIPTION_LINKS:END -->
## 推荐导入顺序

建议在 Quantumult X 的分流资源中按以下顺序导入：

```ini
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Advertising/Hijacking/Hijacking.list, tag=Hijacking, force-policy=reject, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Advertising/Advertising.list, tag=Advertising, force-policy=reject, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/OpenAI/OpenAI.list, tag=OpenAI, force-policy=OutSide, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Google/Google.list, tag=Google, force-policy=OutSide, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GitHub/GitHub.list, tag=GitHub, force-policy=OutSide, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Telegram/Telegram.list, tag=Telegram, force-policy=OutSide, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GlobalMedia/GlobalMedia.list, tag=ForeignMedia, force-policy=OutSide, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ChinaMedia/ChinaMedia.list, tag=DomesticMedia, force-policy=direct, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Apple/Apple.list, tag=Apple, force-policy=direct, enabled=true
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/ChinaMax/ChinaMax.list, tag=Domestic, force-policy=direct, enabled=true
```

如果需要复用 `Loyalsoldier/surge-rules`，请通过解析器转换导入（默认不启用）：

```ini
; 需要 [general] 中已设置 resource_parser_url
;https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/gfw.txt, tag=Loyal-GFW, force-policy=OutSide, opt-parser=true, enabled=false
;https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/direct.txt, tag=Loyal-Direct, force-policy=direct, opt-parser=true, enabled=false
```

最后在 `[filter_local]` 中保留局域网和最终兜底：

```ini
ip-cidr,10.0.0.0/8,direct
ip-cidr,127.0.0.0/8,direct
ip-cidr,172.16.0.0/12,direct
ip-cidr,192.168.0.0/16,direct
final,Final
```

推荐排序原则：

1. 拦截和劫持规则放最前，优先处理明显恶意或广告域名。
2. 细分服务规则放集合规则前，例如 OpenAI、Google、Telegram、GitHub。
3. 海外媒体规则放国内规则前，避免流媒体域名被宽泛国内规则截走。
4. 国内媒体、Apple、China 放后面直连。
5. `final` 放最后，通常指向 `Final` 策略组。

## 推荐策略组

示例策略组：

```ini
[policy]
static = OutSide, Hong Kong, Singapore, Taiwan, United States, Japan, Korea, Other, direct, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Airport.png
static = Final, OutSide, direct, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png
static = Google, OutSide, Hong Kong, Japan, United States, direct, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google.png
static = OpenAI, Hong Kong, United States, Japan, OutSide, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ChatGPT.png
static = GitHub, OutSide, Hong Kong, Japan, United States, direct, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/GitHub.png
static = Telegram, OutSide, Hong Kong, Singapore, Japan, United States, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png
static = ForeignMedia, OutSide, Hong Kong, Singapore, Taiwan, Japan, United States, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ForeignMedia.png
static = DomesticMedia, direct, OutSide, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Domestic.png
static = Domestic, direct, OutSide, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Back.png
static = Apple, direct, OutSide, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png
static = Advertising, reject, direct, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Advertising.png
static = Hijacking, reject, direct, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hijacking.png

static = Hong Kong, resource-tag-regex=你的订阅, server-tag-regex=香港|Hong Kong|HK|hk, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png
static = Singapore, resource-tag-regex=你的订阅, server-tag-regex=新加坡|Singapore|SG|sg, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png
static = Taiwan, resource-tag-regex=你的订阅, server-tag-regex=台湾|Taiwan|TW|tw, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png
static = United States, resource-tag-regex=你的订阅, server-tag-regex=美国|United States|US|us, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png
static = Japan, resource-tag-regex=你的订阅, server-tag-regex=日本|Japan|JP|jp, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png
static = Korea, resource-tag-regex=你的订阅, server-tag-regex=韩国|Korea|KR|kr, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Korea.png
static = Other, resource-tag-regex=你的订阅, server-tag-regex=英国|德国|法国|荷兰|印度|巴西|阿根廷|菲律宾|越南|泰国|印度尼西亚, img-url=https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AIA.png
```

这里吸收了之前维护 Clash/Mihomo 脚本时的经验：

- 主策略、自动策略、地区策略要分层，避免把地区组提前到服务组前面造成界面混乱。
- OpenAI、Google、GitHub、Telegram、海外媒体等服务应有独立策略组，便于手动切换。
- 国内应用、局域网、国内 CDN 要尽量直连，避免影响微信、QQ、淘宝、B 站、网易云等常用应用。
- YouTube 播放异常常与 UDP/QUIC、节点质量、MITM 或广告脚本有关，不应只靠域名规则判断。

## DNS 与局域网建议

Quantumult X 中建议保留国内 DNS 和局域网排除，减少国内 CDN 错误解析和局域网设备访问异常：

```ini
[general]
dns_exclusion_list = *.lan, *.local, *.msftconnecttest.com, *.msftncsi.com, stun.*, *.qq.com, localhost.*.qq.com, *.weixin.qq.com, pool.ntp.org, *.pool.ntp.org, time.*.com, time.*.apple.com
excluded_routes = 192.168.0.0/16, 172.16.0.0/12, 100.64.0.0/10, 10.0.0.0/8, 127.0.0.0/8, 239.255.255.250/32

[dns]
server = 119.29.29.29
server = 223.5.5.5
server = 223.6.6.6
```

不建议随意给微信、QQ 等即时通信应用指定特殊 DNS；这可能导致推送延迟或连接异常。

## 重写与 MITM

导入重写资源示例：

```ini
[rewrite_remote]
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rewrite/AdBlock/Zhihu.adblock, tag=知乎去广告, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rewrite/AdBlock/Weibo.adblock, tag=微博去广告, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rewrite/AdBlock/Youtube.adblock, tag=Youtube 去广告, enabled=false
```

MITM 注意事项：

1. 在 Quantumult X 中开启 HTTPS 解密。
2. 安装描述文件。
3. 在 iOS 设置中信任证书。
4. 仅添加必要域名，不要盲目添加 `*` 或大范围域名。
5. 银行、支付、企业办公、健康医疗等敏感应用不建议启用 MITM。

YouTube 去广告默认建议关闭。它可能导致黑屏、无法播放、Premium 账号异常或接口变更后失效。

## 目录结构

```text
Rules-For-Quantumult-X
├── Rewrite/                # 重写、去广告、解锁、功能增强
│   ├── AdBlock/
│   ├── Functional/
│   ├── Services/
│   └── Unlock/
├── Rules/                  # 历史目录，仅保留说明文档
├── Scripts/                # Quantumult X 脚本
│   ├── AdBlock/
│   ├── Other/
│   └── Unlock/
├── Sample_v*.conf          # 历史示例配置
├── README.md
└── LICENSE
```

## 文件说明索引

本节按当前工作区文件树生成，覆盖 225 个文件。

| 文件 | 说明 |
|---|---|
| `.github/ISSUE_TEMPLATE/bug.md` | Issue 模板。 |
| `.github/ISSUE_TEMPLATE/需求请求.md` | Issue 模板。 |
| `.github/workflows/auto-update.yml` | GitHub Actions 工作流。 |
| `.github/workflows/validate.yml` | GitHub Actions 工作流。 |
| `.gitignore` | 项目文件。 |
| `CODE_OF_CONDUCT.md` | 文档。 |
| `LICENSE` | 开源许可证。 |
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
| `Rewrite/Unlock/AliyunDrive.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/All.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/Boohee.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/ByButter.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/ClarityPro.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/Emby.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/FlightRadar24.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/Foodie.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/GoodBility.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/Grow.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/MoneyThings.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/NewBing.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/NiceGram.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/Notability.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/PicsArt.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/Pillow.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/RevenueCat.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/Spotify.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/ToToWallet.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/WPS.unlock` | 重写规则资源。 |
| `Rewrite/Unlock/iTunes.unlock` | 重写规则资源。 |
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
| `Scripts/Other/ColorWeather.js` | 脚本资源。 |
| `Scripts/Other/Dqsj.js` | 脚本资源。 |
| `Scripts/Readme.md` | 脚本资源。 |
| `Scripts/Unlock/BdCloud.js` | 脚本资源。 |
| `Scripts/Unlock/BiliBili.proto.js` | 脚本资源。 |
| `Scripts/Unlock/BiliBili.proto.min.js` | 脚本资源。 |
| `Scripts/Unlock/Boohee.js` | 脚本资源。 |
| `Scripts/Unlock/Boohee.min.js` | 脚本资源。 |
| `Scripts/Unlock/ByButter.js` | 脚本资源。 |
| `Scripts/Unlock/ByButter.min.js` | 脚本资源。 |
| `Scripts/Unlock/CamScanner.js` | 脚本资源。 |
| `Scripts/Unlock/ClarityPro.js` | 脚本资源。 |
| `Scripts/Unlock/ClarityPro.min.js` | 脚本资源。 |
| `Scripts/Unlock/Emby.js` | 脚本资源。 |
| `Scripts/Unlock/FlightRadar24.js` | 脚本资源。 |
| `Scripts/Unlock/FlightRadar24.min.js` | 脚本资源。 |
| `Scripts/Unlock/Foodie.js` | 脚本资源。 |
| `Scripts/Unlock/Foodie.min.js` | 脚本资源。 |
| `Scripts/Unlock/Goodbility.js` | 脚本资源。 |
| `Scripts/Unlock/Goodbility.min.js` | 脚本资源。 |
| `Scripts/Unlock/Grow.js` | 脚本资源。 |
| `Scripts/Unlock/Grow.min.js` | 脚本资源。 |
| `Scripts/Unlock/Keep.js` | 脚本资源。 |
| `Scripts/Unlock/Keep.min.js` | 脚本资源。 |
| `Scripts/Unlock/Kuwo.js` | 脚本资源。 |
| `Scripts/Unlock/MIX.js` | 脚本资源。 |
| `Scripts/Unlock/MoneyThings.js` | 脚本资源。 |
| `Scripts/Unlock/MoneyThings.min.js` | 脚本资源。 |
| `Scripts/Unlock/MoveRevenueCat.js` | 脚本资源。 |
| `Scripts/Unlock/MoveRevenueCat.min.js` | 脚本资源。 |
| `Scripts/Unlock/NiceGram.json` | 脚本资源。 |
| `Scripts/Unlock/Nicegram.js` | 脚本资源。 |
| `Scripts/Unlock/Nicegram.min.js` | 脚本资源。 |
| `Scripts/Unlock/Notability.js` | 脚本资源。 |
| `Scripts/Unlock/Notability.min.js` | 脚本资源。 |
| `Scripts/Unlock/Notability.old.js` | 脚本资源。 |
| `Scripts/Unlock/PicsArt.js` | 脚本资源。 |
| `Scripts/Unlock/PicsArt.min.js` | 脚本资源。 |
| `Scripts/Unlock/Pillow.js` | 脚本资源。 |
| `Scripts/Unlock/Pillow.min.js` | 脚本资源。 |
| `Scripts/Unlock/Polarr.js` | 脚本资源。 |
| `Scripts/Unlock/RevenueCat.RmHeaders.js` | 脚本资源。 |
| `Scripts/Unlock/RevenueCat.js` | 脚本资源。 |
| `Scripts/Unlock/RevenueCat.min.js` | 脚本资源。 |
| `Scripts/Unlock/Spotify.js` | 脚本资源。 |
| `Scripts/Unlock/Spotify.min.js` | 脚本资源。 |
| `Scripts/Unlock/ToToWallet.js` | 脚本资源。 |
| `Scripts/Unlock/ToToWallet.min.js` | 脚本资源。 |
| `Scripts/Unlock/VSCO.js` | 脚本资源。 |
| `Scripts/Unlock/VivaVideo.js` | 脚本资源。 |
| `Scripts/Unlock/WPS.docer-power.js` | 脚本资源。 |
| `Scripts/Unlock/WPS.docer.js` | 脚本资源。 |
| `Scripts/Unlock/WPS.js` | 脚本资源。 |
| `Scripts/Unlock/WPS.local.js` | 脚本资源。 |
| `Scripts/Unlock/WPS.min.js` | 脚本资源。 |
| `Scripts/Unlock/WechatUrlUnlock.js` | 脚本资源。 |
| `Scripts/Unlock/Wnyd.js` | 脚本资源。 |
| `Scripts/Unlock/Xjsp.js` | 脚本资源。 |
| `Scripts/Unlock/Zymh.js` | 脚本资源。 |
| `Scripts/Unlock/iTunes.js` | 脚本资源。 |
| `Scripts/Unlock/iTunes.min.js` | 脚本资源。 |
| `docs/optimization-plan.md` | 维护文档。 |
| `docs/superpowers/plans/2026-05-27-qx-rule-validator.md` | 维护文档。 |
| `docs/superpowers/specs/2026-05-27-qx-rule-validator-design.md` | 维护文档。 |
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

截至 2026-05-28，本地仓库审查结果：

- 已初始化 Git 仓库。
- README 文件索引覆盖当前工作区 225 个文件（已跟踪 + 未忽略未跟踪文件）。
- 分流规则入口已切换为上游规则源：默认 `blackmatrix7`，`Loyalsoldier` 通过 `resource_parser_url + opt-parser=true` 兼容 QuanX 使用。
- 示例配置中的失效远程重写入口已替换，统一指向当前可用资源。
- 已接入自动生成脚本：`tools/generate-subscription-links.js`、`tools/generate-readme-index.js`。
- 已接入配置审计脚本：`tools/audit-sample-configs.js`，用于性能/鲁棒性/可用性检查。

## 本地规则校验

仓库提供只读校验脚本，用于检查规则格式、重复规则、旧链接和示例配置常见问题。

```powershell
node tools/validate-qx-rules.js
```

只扫描指定目录（例如示例配置）：

```powershell
node tools/validate-qx-rules.js --path Sample_v1.5.3.conf
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

维护检查：

```powershell
node tools/check-maintenance.js
```

该检查会在生产资源中发现旧维护链接时返回非零退出码，并确认 README 文件说明索引覆盖当前工作区文件（已跟踪与未跟踪，忽略规则文件除外）。测试和 CI 使用：

```powershell
node --test tools/*.test.js
node tools/generate-subscription-links.js --check
node tools/generate-readme-index.js --check
node tools/validate-qx-rules.js --strict
node tools/audit-sample-configs.js --strict
node tools/check-maintenance.js
```

## 后续维护计划

建议按以下优先级继续维护：

1. 扩展上游规则源健康检查
   对 `blackmatrix7/ios_rule_script` 关键入口做可访问性和内容格式抽样检查。

2. 建立链接生成脚本  
   根据仓库文件自动生成 Raw/jsDelivr 一键订阅链接，减少 README 手写链接错误。

3. 更新示例配置  
   以 `Sample_v1.5.3.conf` 为基础，新增一个当前维护版示例，例如 `Sample_2026.conf`。

4. 清理旧链接  
   将 README、子目录 README、示例配置中仍指向旧仓库或旧 CDN 的链接逐步替换。

5. 拆分风险资源  
   将广告、功能增强、解锁脚本分开说明，默认只推荐低风险分流规则。

6. 增加 GitHub Actions  
   已完成基础校验流程；后续可增加订阅索引生成和链接可访问性抽样检查。

7. 持续更新重点服务映射
   优先维护 OpenAI、Google/YouTube、GitHub、Telegram、Netflix、Disney、Spotify、TikTok、Apple、Microsoft、国内主流应用的上游规则路径。

## 参与贡献

提交规则时请尽量包含：

- 应用或网站名称。
- 规则文件路径。
- 新增或修改的域名/IP。
- Quantumult X 网络活动截图。
- 期望策略，例如 `direct`、`OutSide`、`Google`、`Advertising`。
- 是否需要 MITM。
- 测试环境，包括 Quantumult X 版本、iOS 版本和网络环境。

建议提交前本地检查：

```powershell
git status --short
rg -n "旧域名|失效链接|待确认" .
```

## 来源与鸣谢

本仓库内容来自原项目及多个公开规则/脚本项目。感谢以下项目和维护者的长期贡献：

- [crossutility/Quantumult-X](https://github.com/crossutility/Quantumult-X)
- [NobyDa/Script](https://github.com/NobyDa/Script)
- [privacy-protection-tools/anti-AD](https://github.com/privacy-protection-tools/anti-AD)
- [ConnersHua](https://github.com/ConnersHua)
- [lhie1](https://github.com/lhie1)
- [Koolson/Qure](https://github.com/Koolson/Qure)
- [KOP-XIAO/QuantumultX](https://github.com/KOP-XIAO/QuantumultX)
- [ddgksf2013](https://github.com/ddgksf2013)
- 以及原仓库和上游规则中列出的所有贡献者。

如某条规则或脚本缺少来源，请提交 issue 或 pull request 补充。

## 许可与免责声明

本仓库遵循 [MIT License](LICENSE)。

请在遵守所在地法律法规、应用服务条款和网络服务协议的前提下使用。本仓库不对规则、脚本、重写、MITM 或解锁功能造成的账号异常、服务不可用、隐私风险、数据损失或其他后果负责。
