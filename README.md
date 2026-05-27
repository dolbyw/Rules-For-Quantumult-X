# Rules For Quantumult X

本仓库维护 Quantumult X 使用的分流规则、重写规则、脚本片段和示例配置，目标是让 iOS 用户可以按需导入远程资源，并通过一键订阅链接完成常见的国内直连、海外代理、流媒体分流、广告拦截和功能增强配置。

本项目由 [dolbyw/Rules-For-Quantumult-X](https://github.com/dolbyw/Rules-For-Quantumult-X) 继续维护。该仓库基于较早的公开规则项目整理而来，原始规则来源较多，部分内容来自公开项目或网络整理；如发现来源缺失、规则失效、侵权或误杀，请提交 issue。

## 重要说明

- 本仓库仅适用于 Quantumult X，不能直接用于 Clash、Mihomo、Surge 或 Loon。
- 分流规则默认引用 `blackmatrix7/ios_rule_script` 的 `rule/QuantumultX` 目录，不再在本仓库维护自建 `.list` 分流规则。
- `Loyalsoldier/surge-rules` 为 Surge 规则源，语法与 Quantumult X 不完全一致，不作为默认导入源。
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
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Google/Google.list, tag=Google, force-policy=Google, enabled=true
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
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/GlobalMedia/GlobalMedia.list
```

也可以使用 jsDelivr：

```text
https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX/GlobalMedia/GlobalMedia.list
```

如果以后配置自有 CDN，可以保持路径不变，仅替换域名部分。例如：

```text
https://你的镜像域名/rule/QuantumultX/GlobalMedia/GlobalMedia.list
```

当前 README 不再推荐旧仓库的 `r.sveir.xyz` 域名，避免用户导入到不可控的旧资源。

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

本节按当前工作区文件树生成，覆盖 216 个文件。

| 文件 | 说明 |
|---|---|
| `.github/ISSUE_TEMPLATE/bug.md` | 项目文件。 |
| `.github/ISSUE_TEMPLATE/需求请求.md` | 项目文件。 |
| `.github/workflows/validate.yml` | 项目文件。 |
| `.gitignore` | 项目文件。 |
| `CODE_OF_CONDUCT.md` | 项目文件。 |
| `LICENSE` | 项目文件。 |
| `README.md` | 项目文件。 |
| `Rewrite/4limbo.adblock` | 项目文件。 |
| `Rewrite/AdBlock/Amap.adblock` | 项目文件。 |
| `Rewrite/AdBlock/BdMap.adblock` | 项目文件。 |
| `Rewrite/AdBlock/BiliBili.adblock` | 项目文件。 |
| `Rewrite/AdBlock/Cainiao.adblock` | 项目文件。 |
| `Rewrite/AdBlock/ChinaUnicom.adblock` | 项目文件。 |
| `Rewrite/AdBlock/Colorful.adblock` | 项目文件。 |
| `Rewrite/AdBlock/CoolApk.adblock` | 项目文件。 |
| `Rewrite/AdBlock/Didi.adblock` | 项目文件。 |
| `Rewrite/AdBlock/Keep.adblock` | 项目文件。 |
| `Rewrite/AdBlock/NeteaseMusic.adblock` | 项目文件。 |
| `Rewrite/AdBlock/RedNote.adblock` | 项目文件。 |
| `Rewrite/AdBlock/Smzdm.adblock` | 项目文件。 |
| `Rewrite/AdBlock/StartUp.adblock` | 项目文件。 |
| `Rewrite/AdBlock/TieBa.adblock` | 项目文件。 |
| `Rewrite/AdBlock/TomatoNovel.adblock` | 项目文件。 |
| `Rewrite/AdBlock/WebAdBlock.adblock` | 项目文件。 |
| `Rewrite/AdBlock/Weibo.adblock` | 项目文件。 |
| `Rewrite/AdBlock/Weibo_New.adblock` | 项目文件。 |
| `Rewrite/AdBlock/Youtube.adblock` | 项目文件。 |
| `Rewrite/AdBlock/Zhihu.adblock` | 项目文件。 |
| `Rewrite/Advertising.adblock` | 项目文件。 |
| `Rewrite/Functional/BlockAppUpgrade.conf` | 项目文件。 |
| `Rewrite/Functional/BlockHttpDNS.conf` | 项目文件。 |
| `Rewrite/Functional/FakeSiteRedirect.conf` | 项目文件。 |
| `Rewrite/Functional/RedirectToHttps.conf` | 项目文件。 |
| `Rewrite/Rewrite_CornersHua.conf` | 项目文件。 |
| `Rewrite/Rewrite_General.conf` | 项目文件。 |
| `Rewrite/Rewrite_NodyDa.conf` | 项目文件。 |
| `Rewrite/Rewrite_lhie1.conf` | 项目文件。 |
| `Rewrite/Services/Apple/Location/Readme.md` | 项目文件。 |
| `Rewrite/Services/Apple/TestFlight/README.md` | 项目文件。 |
| `Rewrite/Services/Apple/TestFlight/TestFlightAccount.js` | 项目文件。 |
| `Rewrite/Services/Apple/TestFlight/TestFlightDownload.conf` | 项目文件。 |
| `Rewrite/Services/Apple/TestFlight/TestFlightDownload.js` | 项目文件。 |
| `Rewrite/Services/Google/GoogleRecaptcha.js` | 项目文件。 |
| `Rewrite/Services/Google/GoogleRecaptcha.min.js` | 项目文件。 |
| `Rewrite/Services/Google/GoogleRecaptcha.rewrite` | 项目文件。 |
| `Rewrite/Unlock/AliyunDrive.unlock` | 项目文件。 |
| `Rewrite/Unlock/All.unlock` | 项目文件。 |
| `Rewrite/Unlock/Boohee.unlock` | 项目文件。 |
| `Rewrite/Unlock/ByButter.unlock` | 项目文件。 |
| `Rewrite/Unlock/ClarityPro.unlock` | 项目文件。 |
| `Rewrite/Unlock/Emby.unlock` | 项目文件。 |
| `Rewrite/Unlock/FlightRadar24.unlock` | 项目文件。 |
| `Rewrite/Unlock/Foodie.unlock` | 项目文件。 |
| `Rewrite/Unlock/GoodBility.unlock` | 项目文件。 |
| `Rewrite/Unlock/Grow.unlock` | 项目文件。 |
| `Rewrite/Unlock/MoneyThings.unlock` | 项目文件。 |
| `Rewrite/Unlock/NewBing.unlock` | 项目文件。 |
| `Rewrite/Unlock/NiceGram.unlock` | 项目文件。 |
| `Rewrite/Unlock/Notability.unlock` | 项目文件。 |
| `Rewrite/Unlock/PicsArt.unlock` | 项目文件。 |
| `Rewrite/Unlock/Pillow.unlock` | 项目文件。 |
| `Rewrite/Unlock/RevenueCat.unlock` | 项目文件。 |
| `Rewrite/Unlock/Spotify.unlock` | 项目文件。 |
| `Rewrite/Unlock/ToToWallet.unlock` | 项目文件。 |
| `Rewrite/Unlock/WPS.unlock` | 项目文件。 |
| `Rewrite/Unlock/iTunes.unlock` | 项目文件。 |
| `Rules/Media/Readme.md` | 项目文件。 |
| `Sample_v1.0.9.conf` | 项目文件。 |
| `Sample_v1.1.0.conf` | 项目文件。 |
| `Sample_v1.4.0.conf` | 项目文件。 |
| `Sample_v1.4.2.conf` | 项目文件。 |
| `Sample_v1.5.3.conf` | 项目文件。 |
| `Scripts/AdBlock/BiliBili/BiliBili.AdBlock.response.js` | 项目文件。 |
| `Scripts/AdBlock/BiliBili/BiliBili.AdBlock.response.min.js` | 项目文件。 |
| `Scripts/AdBlock/BiliBili/BiliBili.js` | 项目文件。 |
| `Scripts/AdBlock/BiliBili/BiliBili.min.js` | 项目文件。 |
| `Scripts/AdBlock/BiliBili/BiliBili.protobuf.js` | 项目文件。 |
| `Scripts/AdBlock/BiliBili/BiliBili.protobuf.min.js` | 项目文件。 |
| `Scripts/AdBlock/JD/jd_search_json.js` | 项目文件。 |
| `Scripts/AdBlock/JD/jx_startup.js` | 项目文件。 |
| `Scripts/AdBlock/Other/12306.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Ahfs.js` | 项目文件。 |
| `Scripts/AdBlock/Other/AliyunDrive.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Amap.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Amap.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Amdc.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Amdc.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/BahamutAnimeAds.js` | 项目文件。 |
| `Scripts/AdBlock/Other/BahamutAnimeAds.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/BaiduMap.js` | 项目文件。 |
| `Scripts/AdBlock/Other/BaiduMap.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Cainiao.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Cainiao.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Colorful.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Colorful.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/CoolApk.js` | 项目文件。 |
| `Scripts/AdBlock/Other/CoolApk.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Didi.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Didi.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Dongqiudi.js` | 项目文件。 |
| `Scripts/AdBlock/Other/FlyPiggy.js` | 项目文件。 |
| `Scripts/AdBlock/Other/ITHome.js` | 项目文件。 |
| `Scripts/AdBlock/Other/ITHome.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Keep.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Keep.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Netease.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Netease.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/PupuMarket.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Quark.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Quark.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/SfExpress.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Stay.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Tieba.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Tieba.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/UmeTrip.js` | 项目文件。 |
| `Scripts/AdBlock/Other/UmeTrip.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Youtube.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Youtube.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Zhihu.js` | 项目文件。 |
| `Scripts/AdBlock/Other/Zhihu.min.js` | 项目文件。 |
| `Scripts/AdBlock/Other/iQiyi.js` | 项目文件。 |
| `Scripts/AdBlock/Other/smzdm.js` | 项目文件。 |
| `Scripts/AdBlock/Other/smzdm.min.js` | 项目文件。 |
| `Scripts/AdBlock/RedNote/RedNote.js` | 项目文件。 |
| `Scripts/AdBlock/RedNote/RedNote.min.js` | 项目文件。 |
| `Scripts/AdBlock/Wechat/UnlockLink.js` | 项目文件。 |
| `Scripts/AdBlock/Wechat/UnlockLink.min.js` | 项目文件。 |
| `Scripts/AdBlock/Wechat/Wechat.js` | 项目文件。 |
| `Scripts/AdBlock/Weibo/weibo.js` | 项目文件。 |
| `Scripts/AdBlock/Weibo/weibo.min.js` | 项目文件。 |
| `Scripts/AdBlock/Weibo/weibo_new.js` | 项目文件。 |
| `Scripts/AdBlock/Weibo/weibo_new.min.js` | 项目文件。 |
| `Scripts/AdBlock/Weibo/weibo_search_info.json` | 项目文件。 |
| `Scripts/AdBlock/Weibo/weibo_search_topic.json` | 项目文件。 |
| `Scripts/AdBlock/Zhihu/Answer.js` | 项目文件。 |
| `Scripts/AdBlock/Zhihu/Feed.js` | 项目文件。 |
| `Scripts/AdBlock/Zhihu/Link.js` | 项目文件。 |
| `Scripts/AdBlock/Zhihu/People.js` | 项目文件。 |
| `Scripts/AdBlock/Zhihu/Recommend.js` | 项目文件。 |
| `Scripts/AdBlock/Zhihu/ScreenAdvs.js` | 项目文件。 |
| `Scripts/AdBlock/Zhihu/Zhihu.js` | 项目文件。 |
| `Scripts/AdBlock/Zhihu/Zhihu.min.js` | 项目文件。 |
| `Scripts/AdBlock/Zhihu/Zhihu_dep.js` | 项目文件。 |
| `Scripts/Other/ColorWeather.js` | 项目文件。 |
| `Scripts/Other/Dqsj.js` | 项目文件。 |
| `Scripts/Readme.md` | 项目文件。 |
| `Scripts/Unlock/BdCloud.js` | 项目文件。 |
| `Scripts/Unlock/BiliBili.proto.js` | 项目文件。 |
| `Scripts/Unlock/BiliBili.proto.min.js` | 项目文件。 |
| `Scripts/Unlock/Boohee.js` | 项目文件。 |
| `Scripts/Unlock/Boohee.min.js` | 项目文件。 |
| `Scripts/Unlock/ByButter.js` | 项目文件。 |
| `Scripts/Unlock/ByButter.min.js` | 项目文件。 |
| `Scripts/Unlock/CamScanner.js` | 项目文件。 |
| `Scripts/Unlock/ClarityPro.js` | 项目文件。 |
| `Scripts/Unlock/ClarityPro.min.js` | 项目文件。 |
| `Scripts/Unlock/Emby.js` | 项目文件。 |
| `Scripts/Unlock/FlightRadar24.js` | 项目文件。 |
| `Scripts/Unlock/FlightRadar24.min.js` | 项目文件。 |
| `Scripts/Unlock/Foodie.js` | 项目文件。 |
| `Scripts/Unlock/Foodie.min.js` | 项目文件。 |
| `Scripts/Unlock/Goodbility.js` | 项目文件。 |
| `Scripts/Unlock/Goodbility.min.js` | 项目文件。 |
| `Scripts/Unlock/Grow.js` | 项目文件。 |
| `Scripts/Unlock/Grow.min.js` | 项目文件。 |
| `Scripts/Unlock/Keep.js` | 项目文件。 |
| `Scripts/Unlock/Keep.min.js` | 项目文件。 |
| `Scripts/Unlock/Kuwo.js` | 项目文件。 |
| `Scripts/Unlock/MIX.js` | 项目文件。 |
| `Scripts/Unlock/MoneyThings.js` | 项目文件。 |
| `Scripts/Unlock/MoneyThings.min.js` | 项目文件。 |
| `Scripts/Unlock/MoveRevenueCat.js` | 项目文件。 |
| `Scripts/Unlock/MoveRevenueCat.min.js` | 项目文件。 |
| `Scripts/Unlock/NiceGram.json` | 项目文件。 |
| `Scripts/Unlock/Nicegram.js` | 项目文件。 |
| `Scripts/Unlock/Nicegram.min.js` | 项目文件。 |
| `Scripts/Unlock/Notability.js` | 项目文件。 |
| `Scripts/Unlock/Notability.min.js` | 项目文件。 |
| `Scripts/Unlock/Notability.old.js` | 项目文件。 |
| `Scripts/Unlock/PicsArt.js` | 项目文件。 |
| `Scripts/Unlock/PicsArt.min.js` | 项目文件。 |
| `Scripts/Unlock/Pillow.js` | 项目文件。 |
| `Scripts/Unlock/Pillow.min.js` | 项目文件。 |
| `Scripts/Unlock/Polarr.js` | 项目文件。 |
| `Scripts/Unlock/RevenueCat.RmHeaders.js` | 项目文件。 |
| `Scripts/Unlock/RevenueCat.js` | 项目文件。 |
| `Scripts/Unlock/RevenueCat.min.js` | 项目文件。 |
| `Scripts/Unlock/Spotify.js` | 项目文件。 |
| `Scripts/Unlock/Spotify.min.js` | 项目文件。 |
| `Scripts/Unlock/ToToWallet.js` | 项目文件。 |
| `Scripts/Unlock/ToToWallet.min.js` | 项目文件。 |
| `Scripts/Unlock/VSCO.js` | 项目文件。 |
| `Scripts/Unlock/VivaVideo.js` | 项目文件。 |
| `Scripts/Unlock/WPS.docer-power.js` | 项目文件。 |
| `Scripts/Unlock/WPS.docer.js` | 项目文件。 |
| `Scripts/Unlock/WPS.js` | 项目文件。 |
| `Scripts/Unlock/WPS.local.js` | 项目文件。 |
| `Scripts/Unlock/WPS.min.js` | 项目文件。 |
| `Scripts/Unlock/WechatUrlUnlock.js` | 项目文件。 |
| `Scripts/Unlock/Wnyd.js` | 项目文件。 |
| `Scripts/Unlock/Xjsp.js` | 项目文件。 |
| `Scripts/Unlock/Zymh.js` | 项目文件。 |
| `Scripts/Unlock/iTunes.js` | 项目文件。 |
| `Scripts/Unlock/iTunes.min.js` | 项目文件。 |
| `docs/optimization-plan.md` | 项目文件。 |
| `docs/superpowers/plans/2026-05-27-qx-rule-validator.md` | 项目文件。 |
| `docs/superpowers/specs/2026-05-27-qx-rule-validator-design.md` | 项目文件。 |
| `images/logo.png` | 项目文件。 |
| `tools/check-maintenance.js` | 项目文件。 |
| `tools/check-maintenance.test.js` | 项目文件。 |
| `tools/fixtures/qx-validator/compatible-format/policyless-asn.list` | 项目文件。 |
| `tools/fixtures/qx-validator/duplicate/duplicate.list` | 项目文件。 |
| `tools/fixtures/qx-validator/legacy-link/legacy.md` | 项目文件。 |
| `tools/fixtures/qx-validator/real-error/invalid.list` | 项目文件。 |
| `tools/validate-qx-rules.js` | 项目文件。 |
| `tools/validate-qx-rules.test.js` | 项目文件。 |

## 当前仓库审查结论

截至 2026-05-27，本地仓库初步审查结果：

- 已初始化 Git 仓库。
- 当前版本管理文件 216 个，包括 `.adblock`、`.unlock`、`.conf`、`.js`、`.md`、工作流和维护脚本。
- 根 README 已更新为当前维护仓库的说明，不再默认推荐旧仓库私有 CDN。
- 仓库已增加 GitHub Actions，用于运行规则测试、strict 校验、旧链接检查和 README 文件索引一致性检查。
- 分流规则已切换为上游规则源引用：默认使用 `blackmatrix7/ios_rule_script` 的 Quantumult X 规则目录。
- 本仓库不再维护自建 `.list` 分流规则；`Loyalsoldier/surge-rules` 仅作为 Surge 场景参考，不作为 QuanX 默认入口。
- `Scripts/Readme.md`、`Rules/Media/Readme.md` 和历史维护文档中仍保留部分旧仓库说明，应避免作为推荐入口。

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

该检查会在生产资源中发现旧维护链接时返回非零退出码，并确认 README 文件说明索引覆盖所有已纳入版本管理的文件。测试和 CI 使用：

```powershell
node --test tools/validate-qx-rules.test.js tools/check-maintenance.test.js
node tools/validate-qx-rules.js --strict
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
