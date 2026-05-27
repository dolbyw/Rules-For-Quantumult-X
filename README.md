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

## 文件说明索引

本节按当前工作区文件树生成，覆盖 308 个文件。说明基于文件路径、命名和已知 Quantumult X 资源类型整理；标注“待验证”的条目需要在后续维护中结合真实接口和 Quantumult X 运行结果确认。

### 根目录文件

| 文件 | 说明 |
|---|---|
| `.gitignore` | Git 忽略规则，控制本地生成物和临时文件是否进入版本库。 |
| `CODE_OF_CONDUCT.md` | 贡献者行为准则。 |
| `LICENSE` | 项目开源许可证文本。 |
| `README.md` | 仓库主说明文档，包含使用方式、目录说明、文件索引和维护建议。 |
| `Sample_v1.0.9.conf` | Sample_v1.0.9 历史 Quantumult X 示例配置，保留用于兼容和迁移参考。 |
| `Sample_v1.1.0.conf` | Sample_v1.1.0 历史 Quantumult X 示例配置，保留用于兼容和迁移参考。 |
| `Sample_v1.4.0.conf` | Sample_v1.4.0 历史 Quantumult X 示例配置，保留用于兼容和迁移参考。 |
| `Sample_v1.4.2.conf` | Sample_v1.4.2 历史 Quantumult X 示例配置，保留用于兼容和迁移参考。 |
| `Sample_v1.5.3.conf` | Sample_v1.5.3 历史 Quantumult X 示例配置，保留用于兼容和迁移参考。 |

### .github GitHub 配置

| 文件 | 说明 |
|---|---|
| `.github/ISSUE_TEMPLATE/bug.md` | bug Markdown 文档。 |
| `.github/ISSUE_TEMPLATE/需求请求.md` | 需求请求 Markdown 文档。 |

### BackCN 回国规则

| 文件 | 说明 |
|---|---|
| `BackCN/BackCN.list` | 回国或国内服务相关分流规则集合。 |

### Rules 分流规则

| 文件 | 说明 |
|---|---|
| `Rules/Advertising/AdReject.list` | AdReject 广告、劫持或反广告相关分流规则。 |
| `Rules/Advertising/AdRule.list` | AdRule 广告、劫持或反广告相关分流规则。 |
| `Rules/Advertising/antiAD-V4.list` | antiAD V4 广告、劫持或反广告相关分流规则。 |
| `Rules/Advertising/Hijacking.list` | Hijacking 广告、劫持或反广告相关分流规则。 |
| `Rules/Advertising/NormalApp/AppAdBlock.list` | AppAdBlock 普通应用广告拦截分流规则。 |
| `Rules/Advertising/VideoApp/Bilibili.list` | Bilibili 视频应用广告拦截分流规则。 |
| `Rules/Advertising/VideoApp/iQiyi.list` | iQiyi 视频应用广告拦截分流规则。 |
| `Rules/Advertising/VideoApp/LeTV.list` | LeTV 视频应用广告拦截分流规则。 |
| `Rules/Advertising/VideoApp/MgTV.list` | MgTV 视频应用广告拦截分流规则。 |
| `Rules/Advertising/VideoApp/PPTV.list` | PPTV 视频应用广告拦截分流规则。 |
| `Rules/Advertising/VideoApp/Sohu.list` | Sohu 视频应用广告拦截分流规则。 |
| `Rules/Advertising/VideoApp/Youku.list` | Youku 视频应用广告拦截分流规则。 |
| `Rules/Advertising/VideoApp/Youtube.list` | Youtube 视频应用广告拦截分流规则。 |
| `Rules/Advertising/VideoApp/YYeTs.list` | YYeTs 视频应用广告拦截分流规则。 |
| `Rules/App/TomatoNovel.list` | TomatoNovel 应用专项分流规则。 |
| `Rules/Functional/BlockHttpDNS.list` | BlockHttpDNS 功能性分流规则。 |
| `Rules/Functional/SpeedTest.list` | SpeedTest 功能性分流规则。 |
| `Rules/Games/Blizzzard.list` | Blizzzard 游戏平台或游戏服务分流规则。 |
| `Rules/Games/Epic.list` | Epic 游戏平台或游戏服务分流规则。 |
| `Rules/Games/GamesAll.list` | GamesAll 游戏平台或游戏服务分流规则。 |
| `Rules/Games/Sony.list` | Sony 游戏平台或游戏服务分流规则。 |
| `Rules/Games/Steam.list` | Steam 游戏平台或游戏服务分流规则。 |
| `Rules/Games/WildRift.list` | WildRift 游戏平台或游戏服务分流规则。 |
| `Rules/Media/Domestic/BiliBili.list` | BiliBili 国内流媒体服务分流规则。 |
| `Rules/Media/Domestic/Douyin.list` | Douyin 国内流媒体服务分流规则。 |
| `Rules/Media/Domestic/iQiyi.list` | iQiyi 国内流媒体服务分流规则。 |
| `Rules/Media/Domestic/LeTV.list` | LeTV 国内流媒体服务分流规则。 |
| `Rules/Media/Domestic/MgTV.list` | MgTV 国内流媒体服务分流规则。 |
| `Rules/Media/Domestic/Migu.list` | Migu 国内流媒体服务分流规则。 |
| `Rules/Media/Domestic/NeteaseMusic.list` | NeteaseMusic 国内流媒体服务分流规则。 |
| `Rules/Media/Domestic/TencentVideo.list` | TencentVideo 国内流媒体服务分流规则。 |
| `Rules/Media/Domestic/Youku.list` | Youku 国内流媒体服务分流规则。 |
| `Rules/Media/DomesticMedia.list` | 国内流媒体集合分流规则。 |
| `Rules/Media/Foreign/AbemaTV.list` | AbemaTV 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/All4.list` | All4 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/AmazonPrime.list` | AmazonPrime 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/AppleMusic.list` | AppleMusic 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/AppleTV.list` | AppleTV 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Bahamut.list` | Bahamut 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/BBC.list` | BBC 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/CBS.list` | CBS 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/DAZN.list` | DAZN 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Deezer.list` | Deezer 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/DisneyPlus.list` | DisneyPlus 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Fox.list` | Fox 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/HBO.list` | HBO 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Hulu-Japan.list` | Hulu Japan 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Hulu.list` | Hulu 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/iQiyi-Intl.list` | iQiyi Intl 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/ITV.list` | ITV 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Japonx.list` | Japonx 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/JOOX.list` | JOOX 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/KKBOX.list` | KKBOX 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/KKTV.list` | KKTV 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/LineTV.list` | LineTV 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/LiTV.list` | LiTV 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Netflix.list` | Netflix 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Pandora.list` | Pandora 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/PBS.list` | PBS 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Pornhub.list` | Pornhub 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Qobuz.list` | Qobuz 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/SoundCloud.list` | SoundCloud 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Spotify.list` | Spotify 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/TIDAL.list` | TIDAL 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Tiktok.list` | Tiktok 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/TVB.list` | TVB 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/Twitch.list` | Twitch 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/ViuTV.list` | ViuTV 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/WeTV.list` | WeTV 海外流媒体服务分流规则。 |
| `Rules/Media/Foreign/YouTube.list` | YouTube 海外流媒体服务分流规则。 |
| `Rules/Media/ForeignMedia.list` | 海外流媒体集合分流规则。 |
| `Rules/Media/Readme.md` | 媒体规则子目录说明文档，当前仍需清理旧链接。 |
| `Rules/Region/China.list` | China 地区、ASN 或 IP 段分流规则。 |
| `Rules/Region/ChinaASN.list` | ChinaASN 地区、ASN 或 IP 段分流规则。 |
| `Rules/Region/ChinaIP.list` | ChinaIP 地区、ASN 或 IP 段分流规则。 |
| `Rules/Region/Global.list` | Global 地区、ASN 或 IP 段分流规则。 |
| `Rules/Services/Amazon.list` | Amazon 网络服务分流规则。 |
| `Rules/Services/Apple.list` | Apple 网络服务分流规则。 |
| `Rules/Services/Cloudflare.list` | Cloudflare 网络服务分流规则。 |
| `Rules/Services/Github.list` | Github 网络服务分流规则。 |
| `Rules/Services/Google.list` | Google 网络服务分流规则。 |
| `Rules/Services/Microsoft.list` | Microsoft 网络服务分流规则。 |
| `Rules/Services/OpenAI.list` | OpenAI 网络服务分流规则。 |
| `Rules/Services/Paypal.list` | Paypal 网络服务分流规则。 |
| `Rules/Services/SNS/ClubHouse.list` | ClubHouse 社交或即时通信服务分流规则。 |
| `Rules/Services/SNS/Discord.list` | Discord 社交或即时通信服务分流规则。 |
| `Rules/Services/SNS/Facebook.list` | Facebook 社交或即时通信服务分流规则。 |
| `Rules/Services/SNS/KakaoTalk.list` | KakaoTalk 社交或即时通信服务分流规则。 |
| `Rules/Services/SNS/Line.list` | Line 社交或即时通信服务分流规则。 |
| `Rules/Services/SNS/PotatoChat.list` | PotatoChat 社交或即时通信服务分流规则。 |
| `Rules/Services/SNS/Telegram.list` | Telegram 社交或即时通信服务分流规则。 |
| `Rules/Services/SNS/Tieba.list` | Tieba 社交或即时通信服务分流规则。 |
| `Rules/Services/SNS/Twitter.list` | Twitter 社交或即时通信服务分流规则。 |
| `Rules/Services/SNS/WeChat.list` | WeChat 社交或即时通信服务分流规则。 |
| `Rules/Services/SNS/Weibo.list` | Weibo 社交或即时通信服务分流规则。 |

### Rewrite 重写资源

| 文件 | 说明 |
|---|---|
| `Rewrite/4limbo.adblock` | 4limbo 来源的去广告重写规则集合，待验证语法兼容性。 |
| `Rewrite/AdBlock/Amap.adblock` | Amap 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/BdMap.adblock` | BdMap 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/BiliBili.adblock` | BiliBili 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/Cainiao.adblock` | Cainiao 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/ChinaUnicom.adblock` | ChinaUnicom 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/Colorful.adblock` | Colorful 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/CoolApk.adblock` | CoolApk 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/Didi.adblock` | Didi 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/Keep.adblock` | Keep 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/NeteaseMusic.adblock` | NeteaseMusic 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/RedNote.adblock` | RedNote 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/Smzdm.adblock` | Smzdm 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/StartUp.adblock` | StartUp 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/TieBa.adblock` | TieBa 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/TomatoNovel.adblock` | TomatoNovel 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/WebAdBlock.adblock` | WebAdBlock 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/Weibo_New.adblock` | Weibo New 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/Weibo.adblock` | Weibo 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/Youtube.adblock` | Youtube 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/AdBlock/Zhihu.adblock` | Zhihu 去广告重写规则，通常需要配合脚本和 MITM 验证。 |
| `Rewrite/Advertising.adblock` | 通用广告拦截重写规则集合。 |
| `Rewrite/Functional/BlockAppUpgrade.conf` | BlockAppUpgrade 功能增强或拦截类重写配置。 |
| `Rewrite/Functional/BlockHttpDNS.conf` | BlockHttpDNS 功能增强或拦截类重写配置。 |
| `Rewrite/Functional/FakeSiteRedirect.conf` | FakeSiteRedirect 功能增强或拦截类重写配置。 |
| `Rewrite/Functional/RedirectToHttps.conf` | RedirectToHttps 功能增强或拦截类重写配置。 |
| `Rewrite/Rewrite_CornersHua.conf` | Rewrite CornersHua 上游重写规则集合，保留用于兼容参考。 |
| `Rewrite/Rewrite_General.conf` | Rewrite General 上游重写规则集合，保留用于兼容参考。 |
| `Rewrite/Rewrite_lhie1.conf` | Rewrite lhie1 上游重写规则集合，保留用于兼容参考。 |
| `Rewrite/Rewrite_NodyDa.conf` | Rewrite NodyDa 上游重写规则集合，保留用于兼容参考。 |
| `Rewrite/Services/Apple/Location/Readme.md` | Apple 位置服务相关重写说明文档。 |
| `Rewrite/Services/Apple/TestFlight/README.md` | Apple TestFlight 重写资源说明文档。 |
| `Rewrite/Services/Apple/TestFlight/TestFlightAccount.js` | Apple TestFlight 相关重写脚本，待验证当前接口兼容性。 |
| `Rewrite/Services/Apple/TestFlight/TestFlightDownload.conf` | Apple TestFlight 下载或账号相关重写配置。 |
| `Rewrite/Services/Apple/TestFlight/TestFlightDownload.js` | Apple TestFlight 相关重写脚本，待验证当前接口兼容性。 |
| `Rewrite/Services/Google/GoogleRecaptcha.js` | GoogleRecaptcha Google 服务相关重写资源，待验证当前可用性。 |
| `Rewrite/Services/Google/GoogleRecaptcha.min.js` | GoogleRecaptcha 压缩版 Google 服务相关重写资源，待验证当前可用性。 |
| `Rewrite/Services/Google/GoogleRecaptcha.rewrite` | GoogleRecaptcha Google 服务相关重写资源，待验证当前可用性。 |
| `Rewrite/Unlock/AliyunDrive.unlock` | AliyunDrive 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/All.unlock` | All 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/Boohee.unlock` | Boohee 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/ByButter.unlock` | ByButter 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/ClarityPro.unlock` | ClarityPro 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/Emby.unlock` | Emby 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/FlightRadar24.unlock` | FlightRadar24 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/Foodie.unlock` | Foodie 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/GoodBility.unlock` | GoodBility 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/Grow.unlock` | Grow 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/iTunes.unlock` | iTunes 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/MoneyThings.unlock` | MoneyThings 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/NewBing.unlock` | NewBing 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/NiceGram.unlock` | NiceGram 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/Notability.unlock` | Notability 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/PicsArt.unlock` | PicsArt 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/Pillow.unlock` | Pillow 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/RevenueCat.unlock` | RevenueCat 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/Spotify.unlock` | Spotify 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/ToToWallet.unlock` | ToToWallet 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |
| `Rewrite/Unlock/WPS.unlock` | WPS 解锁类重写规则，高风险资源，使用前需自行确认合规性和可用性。 |

### Scripts 脚本资源

| 文件 | 说明 |
|---|---|
| `Scripts/AdBlock/BiliBili/BiliBili.AdBlock.response.js` | BiliBili.AdBlock.response BiliBili 去广告或 protobuf 处理脚本。 |
| `Scripts/AdBlock/BiliBili/BiliBili.AdBlock.response.min.js` | BiliBili.AdBlock.response 压缩版 BiliBili 去广告或 protobuf 处理脚本。 |
| `Scripts/AdBlock/BiliBili/BiliBili.js` | BiliBili BiliBili 去广告或 protobuf 处理脚本。 |
| `Scripts/AdBlock/BiliBili/BiliBili.min.js` | BiliBili 压缩版 BiliBili 去广告或 protobuf 处理脚本。 |
| `Scripts/AdBlock/BiliBili/BiliBili.protobuf.js` | BiliBili.protobuf BiliBili 去广告或 protobuf 处理脚本。 |
| `Scripts/AdBlock/BiliBili/BiliBili.protobuf.min.js` | BiliBili.protobuf 压缩版 BiliBili 去广告或 protobuf 处理脚本。 |
| `Scripts/AdBlock/JD/jd_search_json.js` | jd search json 京东广告或启动页处理脚本，待验证用途。 |
| `Scripts/AdBlock/JD/jx_startup.js` | jx startup 京东广告或启动页处理脚本，待验证用途。 |
| `Scripts/AdBlock/Other/12306.js` | 12306 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Ahfs.js` | Ahfs 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/AliyunDrive.js` | AliyunDrive 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Amap.js` | Amap 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Amap.min.js` | Amap 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Amdc.js` | Amdc 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Amdc.min.js` | Amdc 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/BahamutAnimeAds.js` | BahamutAnimeAds 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/BahamutAnimeAds.min.js` | BahamutAnimeAds 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/BaiduMap.js` | BaiduMap 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/BaiduMap.min.js` | BaiduMap 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Cainiao.js` | Cainiao 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Cainiao.min.js` | Cainiao 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Colorful.js` | Colorful 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Colorful.min.js` | Colorful 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/CoolApk.js` | CoolApk 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/CoolApk.min.js` | CoolApk 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Didi.js` | Didi 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Didi.min.js` | Didi 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Dongqiudi.js` | Dongqiudi 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/FlyPiggy.js` | FlyPiggy 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/iQiyi.js` | iQiyi 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/ITHome.js` | ITHome 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/ITHome.min.js` | ITHome 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Keep.js` | Keep 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Keep.min.js` | Keep 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Netease.js` | Netease 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Netease.min.js` | Netease 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/PupuMarket.js` | PupuMarket 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Quark.js` | Quark 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Quark.min.js` | Quark 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/SfExpress.js` | SfExpress 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/smzdm.js` | smzdm 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/smzdm.min.js` | smzdm 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Stay.js` | Stay 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Tieba.js` | Tieba 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Tieba.min.js` | Tieba 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/UmeTrip.js` | UmeTrip 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/UmeTrip.min.js` | UmeTrip 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Youtube.js` | Youtube 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Youtube.min.js` | Youtube 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Zhihu.js` | Zhihu 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/Other/Zhihu.min.js` | Zhihu 压缩版 其他应用去广告脚本，待验证当前接口兼容性。 |
| `Scripts/AdBlock/RedNote/RedNote.js` | RedNote 小红书/RedNote 去广告脚本。 |
| `Scripts/AdBlock/RedNote/RedNote.min.js` | RedNote 压缩版 小红书/RedNote 去广告脚本。 |
| `Scripts/AdBlock/Wechat/UnlockLink.js` | UnlockLink 微信相关去广告或链接解锁脚本。 |
| `Scripts/AdBlock/Wechat/UnlockLink.min.js` | UnlockLink 压缩版 微信相关去广告或链接解锁脚本。 |
| `Scripts/AdBlock/Wechat/Wechat.js` | Wechat 微信相关去广告或链接解锁脚本。 |
| `Scripts/AdBlock/Weibo/weibo_new.js` | weibo new 微博去广告脚本或配置数据。 |
| `Scripts/AdBlock/Weibo/weibo_new.min.js` | weibo new 压缩版 微博去广告脚本或配置数据。 |
| `Scripts/AdBlock/Weibo/weibo_search_info.json` | weibo search info 微博去广告脚本或配置数据。 |
| `Scripts/AdBlock/Weibo/weibo_search_topic.json` | weibo search topic 微博去广告脚本或配置数据。 |
| `Scripts/AdBlock/Weibo/weibo.js` | weibo 微博去广告脚本或配置数据。 |
| `Scripts/AdBlock/Weibo/weibo.min.js` | weibo 压缩版 微博去广告脚本或配置数据。 |
| `Scripts/AdBlock/Zhihu/Answer.js` | Answer 知乎去广告脚本模块。 |
| `Scripts/AdBlock/Zhihu/Feed.js` | Feed 知乎去广告脚本模块。 |
| `Scripts/AdBlock/Zhihu/Link.js` | Link 知乎去广告脚本模块。 |
| `Scripts/AdBlock/Zhihu/People.js` | People 知乎去广告脚本模块。 |
| `Scripts/AdBlock/Zhihu/Recommend.js` | Recommend 知乎去广告脚本模块。 |
| `Scripts/AdBlock/Zhihu/ScreenAdvs.js` | ScreenAdvs 知乎去广告脚本模块。 |
| `Scripts/AdBlock/Zhihu/Zhihu_dep.js` | Zhihu dep 知乎去广告脚本模块。 |
| `Scripts/AdBlock/Zhihu/Zhihu.js` | Zhihu 知乎去广告脚本模块。 |
| `Scripts/AdBlock/Zhihu/Zhihu.min.js` | Zhihu 压缩版 知乎去广告脚本模块。 |
| `Scripts/Other/ColorWeather.js` | ColorWeather 其他功能脚本，待验证用途。 |
| `Scripts/Other/Dqsj.js` | Dqsj 其他功能脚本，待验证用途。 |
| `Scripts/Readme.md` | 脚本目录说明文档，当前需补充脚本用途和风险说明。 |
| `Scripts/Unlock/BdCloud.js` | BdCloud 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/BiliBili.proto.js` | BiliBili.proto 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/BiliBili.proto.min.js` | BiliBili.proto 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Boohee.js` | Boohee 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Boohee.min.js` | Boohee 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/ByButter.js` | ByButter 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/ByButter.min.js` | ByButter 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/CamScanner.js` | CamScanner 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/ClarityPro.js` | ClarityPro 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/ClarityPro.min.js` | ClarityPro 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Emby.js` | Emby 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/FlightRadar24.js` | FlightRadar24 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/FlightRadar24.min.js` | FlightRadar24 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Foodie.js` | Foodie 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Foodie.min.js` | Foodie 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Goodbility.js` | Goodbility 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Goodbility.min.js` | Goodbility 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Grow.js` | Grow 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Grow.min.js` | Grow 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/iTunes.js` | iTunes 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/iTunes.min.js` | iTunes 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Keep.js` | Keep 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Keep.min.js` | Keep 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Kuwo.js` | Kuwo 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/MIX.js` | MIX 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/MoneyThings.js` | MoneyThings 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/MoneyThings.min.js` | MoneyThings 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/MoveRevenueCat.js` | MoveRevenueCat 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/MoveRevenueCat.min.js` | MoveRevenueCat 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Nicegram.js` | Nicegram 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/NiceGram.json` | NiceGram 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Nicegram.min.js` | Nicegram 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Notability.js` | Notability 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Notability.min.js` | Notability 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Notability.old.js` | Notability 旧版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/PicsArt.js` | PicsArt 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/PicsArt.min.js` | PicsArt 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Pillow.js` | Pillow 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Pillow.min.js` | Pillow 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Polarr.js` | Polarr 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/RevenueCat.js` | RevenueCat 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/RevenueCat.min.js` | RevenueCat 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/RevenueCat.RmHeaders.js` | RevenueCat.RmHeaders 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Spotify.js` | Spotify 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Spotify.min.js` | Spotify 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/ToToWallet.js` | ToToWallet 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/ToToWallet.min.js` | ToToWallet 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/VivaVideo.js` | VivaVideo 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/VSCO.js` | VSCO 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/WechatUrlUnlock.js` | WechatUrlUnlock 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Wnyd.js` | Wnyd 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/WPS.docer-power.js` | WPS.docer power 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/WPS.docer.js` | WPS.docer 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/WPS.js` | WPS 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/WPS.local.js` | WPS.local 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/WPS.min.js` | WPS 压缩版 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Xjsp.js` | Xjsp 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |
| `Scripts/Unlock/Zymh.js` | Zymh 解锁类脚本，高风险资源，待验证当前可用性与合规性。 |

### tools 校验工具

| 文件 | 说明 |
|---|---|
| `tools/fixtures/qx-validator/compatible-format/policyless-asn.list` | 兼容格式样例，覆盖无显式策略规则、ASN 规则和双斜杠注释。 |
| `tools/fixtures/qx-validator/duplicate/duplicate.list` | 重复规则样例，用于验证重复检测。 |
| `tools/fixtures/qx-validator/legacy-link/legacy.md` | 旧链接样例，用于验证历史域名和维护者标识检查。 |
| `tools/fixtures/qx-validator/real-error/invalid.list` | 真实格式错误样例，用于验证 strict 模式仍能拦截错误。 |
| `tools/validate-qx-rules.js` | 只读 Quantumult X 规则校验 CLI，用于扫描格式问题、重复规则和旧链接。 |
| `tools/validate-qx-rules.test.js` | 校验 CLI 的 Node.js 内置测试用例。 |

### docs 维护文档

| 文件 | 说明 |
|---|---|
| `docs/optimization-plan.md` | 项目全面审计后的优化计划书。 |
| `docs/superpowers/plans/2026-05-27-qx-rule-validator.md` | Superpowers 工作流生成的实施计划文档，用于记录校验器开发步骤。 |
| `docs/superpowers/specs/2026-05-27-qx-rule-validator-design.md` | Superpowers 工作流生成的设计规格文档，用于记录校验器方案。 |

### images 图片资源

| 文件 | 说明 |
|---|---|
| `images/logo.png` | 仓库 README 使用的项目标识图片。 |

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
