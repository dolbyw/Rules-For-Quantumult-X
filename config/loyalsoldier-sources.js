const LOYALSOLDIER_SOURCES = [
  {
    name: "GFW",
    fileName: "GFW.list",
    sourceUrl: "https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/gfw.txt",
    description: "Loyalsoldier GFW 通用代理补充规则。",
  },
  {
    name: "Direct",
    fileName: "Direct.list",
    sourceUrl: "https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/direct.txt",
    description: "Loyalsoldier Direct 通用直连补充规则，默认不在轻量配置启用。",
  },
  {
    name: "Private",
    fileName: "Private.list",
    sourceUrl: "https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/private.txt",
    description: "Loyalsoldier Private 私有域名直连补充规则。",
  },
];

module.exports = LOYALSOLDIER_SOURCES;
