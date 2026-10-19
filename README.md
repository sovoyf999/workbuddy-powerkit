# workbuddy-powerkit

> WorkBuddy 补强计划：技能 · 工具 · 自动化 · 编排，四层增强开源工具包。

让 WorkBuddy 功能更强大、工具更多、技能更多、处理能力更强——本仓库系统性给出可落地的增强资产：4 个自检技能包、3 台即抄即用的 MCP 服务器配置、4 个定时自动化配方、一套仓库级 CI。

设计依据：[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)（四层模型）｜[docs/ROADMAP.md](docs/ROADMAP.md)（版本路线）｜[docs/TEAM-PROCESS.md](docs/TEAM-PROCESS.md)（协作过程）｜[docs/FIELD-NOTES.md](docs/FIELD-NOTES.md)（**实装踩坑勘误**）

## ⚠️ 先读：MCP 安装方式因客户端而异（v0.2 修订）

**v0.1 指引「写 `~/.workbuddy/mcp.json`」在 WorkBuddy 桌面版上无效** —— 桌面版启动时会主动删除该文件（`cleanupStaleUserMcpJson`，日志标记 `stale-user-mcp-json`）。这不是操作错误，是路径本身不适用。

| 客户端 | 自定义 MCP 怎么装 |
|---|---|
| **WorkBuddy 桌面版** | 连接器管理 → 右上角「自定义连接器」→ 粘 JSON → 信任。**界面是唯一可靠入口**（手工造插件会被 marketplace 校验拦截，报 `plugin not found in marketplace`） |
| **CodeBuddy Code（CLI）** | 写 `~/.workbuddy/mcp.json`，或用 `codebuddy mcp add` |

完整证据与排障方法见 [docs/FIELD-NOTES.md](docs/FIELD-NOTES.md) 与 [mcp/README.md](mcp/README.md)。

**L1 技能层与 L3 自动化层不受影响**——约定式目录 + rrule，与客户端版本无关，照常安装即可。

## 四层增强模型 / Four-Layer Enhancement Model

每层回答三问：扩展机制是什么 / 接入点在哪 / 本仓库对应资产是什么。

| 层 | 机制 | 接入点 | 本仓库资产 |
|---|---|---|---|
| L1 技能层 `skills/` | 目录约定式：`SKILL.md` + frontmatter（name/description），运行时按 description 匹配触发 | 拷入 `~/.workbuddy/skills/` 即生效；无注册表，删目录即卸载 | `skills/wb-env-doctor`、`wb-skill-auditor`、`wb-mcp-doctor`、`wb-automation-chef` |
| L2 工具层 `mcp/` | MCP 服务器定义（stdio/http/sse；env/headers 支持 `${VAR}` 凭据展开） | **桌面版**：连接器管理 → 自定义连接器 → 粘 JSON → 信任<br>**CLI**：写 `~/.workbuddy/mcp.json` | `mcp/mcp.snippets.json`（3 台即抄配置）+ `mcp/README.md`（客户端分流 + 排障 + 中文社区索引） |
| L3 自动化层 `automations/` | 定时自动化 = rrule + 自包含 prompt（目标/输入/输出/约束/失败处理五要素，无人在场也能跑） | 用 automation 工具按配方创建定时任务 | `automations/` 4 个配方：工作日站会 / 每周技能审计 / 每月环境体检 / 每月 MCP 巡检 |
| L4 专家与编排层 | 专家包 = `plugin.json + agents/*.md`；云服务走官方脚手架；发布流水线四步 | 参考 SOP 沉淀自己的专家包 | 专家包 SOP（EXPERT-SOP.md）排 v0.2；CI 即 `.github/workflows/ci.yml` |

层间关系：L1 调用 L2，L3 定时触发 L1，L4 沉淀规范反哺 L1。完整推导见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

## 快速开始 / Quick Start

前置条件：node ≥ 18（WorkBuddy 托管 node 22 开箱即用）。

**① 安装技能**——拷入用户技能目录即生效，无需注册：

```bash
cp -r skills/wb-* ~/.workbuddy/skills/
```

**② 添加 MCP**——**先看上面的客户端对照表**：桌面版走界面，CLI 走文件。3 台服务器均免凭据，snippets 内路径为示范值需自行替换。详见 [mcp/README.md](mcp/README.md)。

**③ 创建定时任务**——按 [automations/](automations/) 下配方的创建参数说明逐条创建；也可直接让 wb-automation-chef 把你的日程需求翻译成配方。

> ⚠️ 配方中的 `<OUTPUT_DIR>` / `<INPUT_DIR>` / `<SKILLS_DIR>` 是占位符，**创建前必须替换成你自己的绝对路径**，否则会写到不存在的目录。

装完即可试用：对 WorkBuddy 说「环境体检」「技能审计」「MCP 检查」即触发对应自检工作流。

## 目录结构 / Repository Layout

```
workbuddy-powerkit/
├── docs/                         # 调研·清点·架构·规格·路线·协作文档
│   ├── RESEARCH.md               #   官方能力与生态调研（R1）
│   ├── INVENTORY.md              #   本机现状清点（R1）
│   ├── ARCHITECTURE.md           #   四层增强模型（R2）
│   ├── ASSET-SPEC.md             #   资产施工图纸（R2）
│   ├── ROADMAP.md                #   版本路线（R2）
│   ├── FIELD-NOTES.md            #   实装踩坑勘误（v0.2 桌面版实测）
│   └── TEAM-PROCESS.md           #   六 Agent 协作方法论
├── skills/                       # L1 技能层：4 个 wb- 自检技能包
│   ├── wb-env-doctor/SKILL.md    #   本机环境一键体检
│   ├── wb-skill-auditor/SKILL.md #   已装技能审计
│   ├── wb-mcp-doctor/SKILL.md    #   MCP 配置医生
│   └── wb-automation-chef/SKILL.md # 自动化配方生成器
├── mcp/                          # L2 工具层：3 台服务器即抄配置 + 客户端分流说明
│   ├── mcp.snippets.json
│   └── README.md
├── automations/                  # L3 自动化层：4 个自包含配方（路径为占位符）
│   ├── daily-standup.md          #   工作日站会摘要（需自备输入源）
│   ├── weekly-skill-audit.md     #   每周技能审计
│   ├── monthly-env-check.md      #   每月环境体检
│   └── monthly-mcp-check.md      #   每月 MCP 巡检
├── .github/                      # 仓库级 CI（push/PR 触发）
│   ├── workflows/ci.yml          #   JSON 校验 + frontmatter 校验 + 链接检查
│   └── scripts/                  #   提交前本地校验脚本
│       ├── check-json.mjs        #     递归校验仓库全部 *.json 合法性
│       └── check-skills.mjs      #     校验 SKILL.md frontmatter 与配方 rrule
├── CONTRIBUTING.md               # 贡献指南
├── LICENSE                       # MIT
└── README.md
```

## 状态与 CI / Status

![CI](https://github.com/sovoyf999/workbuddy-powerkit/actions/workflows/ci.yml/badge.svg)

v0.1 目标「四层资产齐备」已完成（Round 4 验收结论见 [docs/VALIDATION.md](docs/VALIDATION.md)）。

**v0.2 修订**：在另一台机器实装时发现 v0.1 的 MCP 资产有多处不成立，已按实测修正 —— 移除失效的 `~/.workbuddy/mcp.json` 路径指引、删除重复的 github 远程条目、修正 `/tmp` 路径、消除自动化配方硬编码、补充客户端分流表与排障规则。详见 [docs/FIELD-NOTES.md](docs/FIELD-NOTES.md)。

本地提交前请先跑 [CONTRIBUTING.md](CONTRIBUTING.md) 中的两个校验脚本。

## 团队协作过程 / Team Process

本仓库由 6 Agent 团队以「任务卡 + 留言板 + 三段式汇报」协作模式产出：R1 调研清点 → R2 架构设计 → R3 资产构建 → R4 验收推送。编成、协作回路、三次事故教训与复现指南，完整记录见 [docs/TEAM-PROCESS.md](docs/TEAM-PROCESS.md)。

## 贡献 / Contributing

欢迎三类贡献：新技能包、MCP 服务器配置、自动化配方。动笔前读 [CONTRIBUTING.md](CONTRIBUTING.md)，提交前跑 CI 校验脚本。

## 许可 / License

[MIT](LICENSE)
