# 官方能力与生态调研（RESEARCH）

> 调研人：team-lead（代行 scout 职责——scout 的 spawn 因模型提供方 500 故障中断，关键路径不等待）｜日期：2026-10-19｜时效：截至 2026-10-19

## 1. WorkBuddy 能力地图（官方文档口径）

来源：https://www.workbuddy.cn/docs/workbuddy/Overview（2026-10-19 访问）

WorkBuddy 为腾讯出品的全场景 AI 工作台，官方文档口径的能力分四层：

| 层 | 官方能力 | 边界（文档明示或可推断） |
|---|---|---|
| 核心执行 | 自然语言交互、自主规划与执行、多模态任务（文档/表格/PPT/数据分析）、本地文件操作、多任务并行、结果交付与验收 | 单助手上下文，无跨助手协作原语 |
| 技能 | skills 机制（用户级 `~/.workbuddy/skills/` + 内置插件缓存），skill-creator / marketplace 安装器 | 无官方技能质量审计与依赖管理 |
| 连接器与 MCP | MCP 服务器（`~/.workbuddy/mcp.json`）、连接器（GitHub 等）、资料库 | 用户级配置无统一入口（实证见 INVENTORY.md） |
| 专家与编排 | experts（专家包生命周期，expert-manager）、定时自动化（automation，rrule）、云服务、站点发布 | 专家包无社区化流转机制；自动化无配方库 |

技能形态实证：本机已装技能均为 `SKILL.md + frontmatter（name/description）`，与 Claude Agent Skills 生态同构（来源：本机会话技能列表，2026-10-19）。

## 2. 外部生态亮点（对标）

| 生态 | 亮点 | WorkBuddy 现状 |
|---|---|---|
| MCP 官方 | `registry.modelcontextprotocol.io` 成为规范目录（2026-04 起取代 GitHub README 表）；`modelcontextprotocol/servers` 保留参考实现 | 用户级无统一配置模板 |
| 社区精选 | `punkpeye/awesome-mcp-servers`（高星，持续聚合） | 无对应中文社区索引 |
| 高质量服务器 | github-mcp-server、playwright-mcp、Postgres/SQLite、memory、fetch、brave-search、exa、context7 | 部分以内置插件形态存在（如 browser），无推荐清单 |
| 自建服务器框架 | FastMCP（Python/TS）、fastapi_mcp | 无 WorkBuddy 侧脚手架 |
| Claude Code Skills | SKILL.md + frontmatter + 渐进式披露的生态 | 机制同构，但无跨平台迁移指南 |
| 工作流自动化 | n8n / GitHub Actions / pre-commit | 仓库级 CI 模板缺失（INVENTORY 矩阵已指出） |

## 3. 差距清单（按 价值×可行性 排序，标注本仓库是否补）

| # | 差距 | 价值 | 可行性 | 本仓库补不补 | 归属 |
|---|---|---|---|---|---|
| 1 | 用户级 MCP 统一配置模板 + 三处分发机制说明 | 高 | 高 | ✅ 补 | dev（mcp/） |
| 2 | 开发辅助/自检类技能（环境体检、技能审计、MCP 医生、自动化厨师） | 高 | 高 | ✅ 补 | dev（skills/） |
| 3 | 仓库级 CI（JSON 校验/链接检查）+ pre-commit | 高 | 高 | ✅ 补 | dev（.github/） |
| 4 | 自动化配方库（rrule + 自包含 prompt） | 高 | 高 | ✅ 补 | dev（automations/） |
| 5 | 四层增强架构文档 + 路线图 | 高 | 高 | ✅ 补 | architect（docs/） |
| 6 | 专家包创建/审查 SOP | 中 | 中 | ✅ 补（文档形态） | architect |
| 7 | 云服务一键脚手架 | 中 | 中 | ⚠️ 仅出文档建议，代码脚手架走官方 | architect |
| 8 | 中文 MCP 社区索引 | 中 | 中 | ✅ 补（mcp/README 内嵌） | dev |
| 9 | 跨平台技能迁移指南（Claude Skills ↔ WorkBuddy） | 中 | 中 | ✅ 补（文档） | docs |
| 10 | 官方能力增强建议（技能审计、hooks 等） | 高 | 低 | ❌ 不走仓库，建议走官方反馈渠道 | — |

## 4. 来源清单

| 来源 | URL | 访问日期 | 采信说明 |
|---|---|---|---|
| WorkBuddy 官方文档 Overview | https://www.workbuddy.cn/docs/workbuddy/Overview | 2026-10-19 | 官方一手 |
| MCP 官方仓库 | https://github.com/modelcontextprotocol/servers | 2026-10-19 | 官方一手（星数等快照数据以仓库实际为准，本文不采信具体数字） |
| 社区精选列表 | https://github.com/punkpeye/awesome-mcp-servers | 2026-10-19 | 社区高星，作线索 |
| MCP Registry | https://registry.modelcontextprotocol.io | 2026-10-19 | 「2026-04 起为规范目录」经多来源一致转述后采信 |
| MCP 分类聚合站 | https://mcp-awesome.com/ | 2026-10-19 | 仅作线索，关键结论已多源交叉 |
| WorkBuddy 开放平台·专家 | https://open.workbuddy.cn/docs/expert | 2026-10-19 | 官方一手（专家结构核验来源） |
| WorkBuddy 开放平台·技能 | https://open.workbuddy.cn/docs/skill | 2026-10-19 | 官方一手（技能结构核验来源） |
| punkpeye/awesome-mcp-servers | https://github.com/punkpeye/awesome-mcp-servers | 2026-10-19 | GitHub 页面实测 96.6k stars |

> 反抄袭声明：本文所有结论均可追溯至上述来源或本机实证；SEO 内容农场结果（如各中文教程站）仅用于发现线索，未作为结论依据。

## 5. Scout 补充调研存档（2026-10-19 10:05 留言板）

> 说明：scout 的 agent 进程中断，其 RESEARCH.md 文件写入实际未落盘（队长复核时该文件不存在），以下发现从其留言板发言原文存档。

- **官方五大扩展机制**（scout 结论）：技能 / 连接器 / 专家 / 定时任务 / 开放平台，均有开发规范；技能=SKILL.md 目录包；连接器=MCP+Skill 或 CLI+Skill；专家=plugin.json + agents/*.md
- **生态差距判断**（scout）：Agent Skills 已成跨 40+ 客户端的开放标准，WorkBuddy 未声明互操作；MCP 社区生态（awesome 列表约 9.6 万 star）远超官方连接器市场
- **scout 建议本仓库优先做**：#1 技能安全扫描器、#2 技能模板库、#3 海外 MCP 配置集（与 dev 的统一 MCP 模板合并）、#4 定时任务模板库；#6 连接器上架走官方渠道

**核验记录（2026-10-19，team-lead 复核）**：

| scout 原结论 | 核验结果 | 依据 |
|---|---|---|
| 专家=plugin.json+agents/*.md | ✅ 转正 | 官方开放平台文档明示专家目录结构 `.codebuddy-plugin/plugin.json + agents/*.md`（open.workbuddy.cn/docs/expert） |
| 技能=SKILL.md 目录包 | ✅ 转正 | 官方技能文档明示 `{skill-name}/SKILL.md` + YAML frontmatter（open.workbuddy.cn/docs/skill）；官方市场版 frontmatter 字段更丰富（description_zh/en、version、author），本仓库技能面向本地 `~/.workbuddy/skills/` 机制（INVENTORY 实证），两者并存不冲突 |
| awesome-mcp-servers 约 9.6 万 star | ✅ 转正 | GitHub 页面实测 96.6k stars（2026-10-19） |
| Agent Skills 跨 40+ 客户端开放标准 | ⚠️ 部分核验 | SKILL.md 机制在本平台确认存在且与 Claude 生态同构；「40+ 客户端」未找到一手来源，降级为「跨客户端生态存在，具体数量未核验」 |
