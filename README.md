# Rules For Quantumult X

本仓库维护 Quantumult X 使用的分流规则、重写规则、脚本片段和示例配置，目标是让 iOS 用户可以按需导入远程资源，并通过一键订阅链接完成常见的国内直连、海外代理、流媒体分流、广告拦截和功能增强配置。

本项目由 [dolbyw/Rules-For-Quantumult-X](https://github.com/dolbyw/Rules-For-Quantumult-X) 继续维护。该仓库基于较早的公开规则项目整理而来，原始规则来源较多，部分内容来自公开项目或网络整理；如发现来源缺失、规则失效、侵权或误杀，请提交 issue。

## 重要说明

- 本仓库仅适用于 Quantumult X，不能直接用于 Clash、Mihomo、Surge 或 Loon。
- 规则不是越多越好。优先使用集合规则，只有明确需求时再添加细分规则。
- 去广告和脚本重写依赖 HTTPS 解密（MITM），存在隐私、安全和兼容性风险。
- 解锁类脚本可能违反应用服务条款，也可能随应用更新失效。请自行评估风险。
- 本仓库不保证任何流媒体解锁、会员功能、广告拦截或地区访问一定可用。

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
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Services/Google.list, tag=Google, force-policy=Google, enabled=true
```

常用参数：

- `tag`：Quantumult X 中显示的资源名称。
- `force-policy`：强制覆盖远程规则文件内的策略名。
- `enabled`：是否启用。
- `update-interval`：自动更新时间，单位为秒。
- `inserted-resource`：使用 Quantumult X 内置资源时会出现，如 `FILTER_REGION`、`FILTER_LAN`。

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

推荐优先使用 GitHub Raw 链接。示例：

```text
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Media/ForeignMedia.list
```

也可以使用 jsDelivr：

```text
https://cdn.jsdelivr.net/gh/dolbyw/Rules-For-Quantumult-X@main/Rules/Media/ForeignMedia.list
```

如果以后配置自有 CDN，可以保持路径不变，仅替换域名部分。例如：

```text
https://你的域名/Rules/Media/ForeignMedia.list
```

当前 README 不再推荐旧仓库的 `r.sveir.xyz` 域名，避免用户导入到不可控的旧资源。

## 推荐导入顺序

建议在 Quantumult X 的分流资源中按以下顺序导入：

```ini
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Advertising/Hijacking.list, tag=Hijacking, force-policy=reject, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Advertising/AdReject.list, tag=Advertising, force-policy=reject, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Services/OpenAI.list, tag=OpenAI, force-policy=OutSide, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Services/Google.list, tag=Google, force-policy=OutSide, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Services/Github.list, tag=GitHub, force-policy=OutSide, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Services/SNS/Telegram.list, tag=Telegram, force-policy=OutSide, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Media/ForeignMedia.list, tag=ForeignMedia, force-policy=OutSide, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Media/DomesticMedia.list, tag=DomesticMedia, force-policy=direct, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Services/Apple.list, tag=Apple, force-policy=direct, enabled=true
https://raw.githubusercontent.com/dolbyw/Rules-For-Quantumult-X/main/Rules/Region/China.list, tag=Domestic, force-policy=direct, enabled=true
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
├── BackCN/                 # 回国/国内服务规则
├── Rewrite/                # 重写、去广告、解锁、功能增强
│   ├── AdBlock/
│   ├── Functional/
│   ├── Services/
│   └── Unlock/
├── Rules/                  # 分流规则
│   ├── Advertising/
│   ├── App/
│   ├── Functional/
│   ├── Games/
│   ├── Media/
│   ├── Region/
│   └── Services/
├── Scripts/                # Quantumult X 脚本
│   ├── AdBlock/
│   ├── Other/
│   └── Unlock/
├── Sample_v*.conf          # 历史示例配置
├── README.md
└── LICENSE
```

## 当前仓库审查结论

截至 2026-05-27，本地仓库初步审查结果：

- 已初始化 Git 仓库。
- 核心文件约 292 个，包括 `.list`、`.adblock`、`.unlock`、`.conf`、`.js`、`.md`。
- 根 README 已更新为当前维护仓库的说明，不再默认推荐旧仓库私有 CDN。
- 仓库没有自动生成订阅索引或校验规则的 GitHub Actions。
- 多数规则仍来自旧维护时期，建议后续按服务逐步校验，而不是一次性大规模替换。
- `.list` 文件中存在重复规则和部分待确认规则类型，例如 `host-wildcard`。需要后续建立校验脚本，明确哪些类型是 Quantumult X 当前版本支持的语法，哪些需要转换。
- `Scripts/Readme.md`、`Rules/Media/Readme.md` 和部分示例配置仍含旧仓库链接，建议下一步继续更新。

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

## 后续维护计划

建议按以下优先级继续维护：

1. 建立规则校验脚本  
   校验 `.list` 的规则类型、字段数量、重复项、空策略名、引用策略名是否符合示例配置。

2. 建立链接生成脚本  
   根据仓库文件自动生成 Raw/jsDelivr 一键订阅链接，减少 README 手写链接错误。

3. 更新示例配置  
   以 `Sample_v1.5.3.conf` 为基础，新增一个当前维护版示例，例如 `Sample_2026.conf`。

4. 清理旧链接  
   将 README、子目录 README、示例配置中仍指向旧仓库或旧 CDN 的链接逐步替换。

5. 拆分风险资源  
   将广告、功能增强、解锁脚本分开说明，默认只推荐低风险分流规则。

6. 增加 GitHub Actions  
   至少包含规则格式检查、重复规则统计、README 链接检查。

7. 持续更新重点服务  
   优先维护 OpenAI、Google/YouTube、GitHub、Telegram、Netflix、Disney、Spotify、TikTok、Apple、Microsoft、国内主流应用。

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
