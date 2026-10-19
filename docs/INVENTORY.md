# 本机安装现状清点（INVENTORY）

> 清点人：reverser｜日期：2026-10-19｜用途：为 workbuddy-powerkit 补强计划提供现状基线
> 隐私红线：全文不含任何 token/密钥/密码明文，MCP 仅记录「已配置/未配置」

## 1. 已装技能清单

**用户级技能**（`C:\Users\juice\.workbuddy\skills\`，4 个）：

| 技能 | 用途 |
|---|---|
| agent-reach | 全网调研/搜索/URL 抓取（16 平台多后端路由，互联网内容获取） |
| qqmusic | QQ 音乐搜索、榜单、日推、听歌报告 |
| task-comms | 任务/子代理间通信信箱（并行协作中间结论传递） |
| wsl-ubuntu | 本机 WSL Linux 命令/工具链执行入口 |

**内置技能/插件**（`plugins\cache\workbuddy-builtin\`，46 项，按官方分类归纳）：

| 分类 | 代表内容 |
|---|---|
| 交互模式 | interactionmode-ask/craft/expert/plan/quick、welcomemode-code/design/work |
| 文档办公 | tencent-docx、workbuddy-docx/pptx/sheetagent、tencent-docs-plugin、office-routing 系 |
| 设计创意 | ardot 及 skill-ardot-*（design-core/poster/slides/ui-design 等）、skill-design-router |
| 多媒体生成 | skill-buddy-image-processing、skill-miora-*（图像/视频/品牌/创意） |
| 金融 | skill-workbuddy-finance-skill、skill-wb-finance-skill |
| 企微与支付 | weixinpay（3 子技能）、wecom-media-upload/forwarded-chat-resources/a2a-auth |
| 生态管理 | skill-recommend-connectors/experts、skill-expert-manager、skill-creator、marketplace 安装器 |
| 其他 | skill-cloud-service、skill-sites、skill-library、skill-geo-map-compliance-guard、skill-livestream-poster |

## 2. MCP 与连接器

- 用户级 `~/.workbuddy/mcp.json`：**不存在**（实际为项目级 + 内置插件分发）
- 项目级 MCP（`project-resources/.../mcp.json`）：wb-issues（http，任务/事项管理）——已配置
- mcporter（`~/.mcporter/mcporter.json`）：exa（http，搜索类 MCP）——已配置
- 内置 MCP 插件：mcp-ardot-mcp-app、mcp-miora——已配置
- 会话在用的 MCP server（据会话上下文）：agent-mail、browser、genie-baas、github、sheetagent、space-library、weixinpay
- 连接器状态（据会话上下文）：GitHub ✅ 已连接；Agent Mail ✅ 已连接
- 扫描过程中未发现需上报的明文凭据；上述配置文件均只读取了服务器名/类型/URL，未复制任何凭据值

## 3. 运行时与磁盘

> 来源：`team/环境清单.md`（dev，2026-10-19），reverser 于同日复核一致

| 项 | 现状 |
|---|---|
| 托管 node | 22.22.2-6（PATH 直指托管运行时，开箱即用） |
| 托管 python | 3.13.12（目录名；实际小版本 3.13.14） |
| WSL | Ubuntu（WSL 2，当前 Stopped，用时需先启动） |
| 磁盘 | C: 剩余 81G/217G（63%）；E: 剩余 461G/932G（51%），仓库优先放 E 盘 |

## 4. 现有 vs 建议补强矩阵（初稿，供 architect 参考）

| 能力域 | 现状 | 补强建议 |
|---|---|---|
| 技能 | 用户级 4 个 + 内置 46 项，覆盖文档/设计/金融/企微，缺开发辅助与测试类 | 收敛 powerkit 技能层，新增面向本仓库的构建/校验/打包技能 |
| MCP | 以官方内置 + 项目级为主，用户级无统一配置入口 | 提供 mcp.json 模板与一键配置脚本，聚合搜索/数据库/CI 类 MCP |
| 自动化 | 仅有定时/循环任务能力，无仓库级自动化规范 | 内置 GitHub Actions 模板（lint/test/release）与 pre-commit 钩子 |
| 专家 | experts 缓存存在少量专家（chatlaw-team 等），无自建专家流程 | 沉淀 powerkit 专家包创建/导入/审查 SOP（可复用 skill-expert-manager） |
| 云服务 | genie-baas 云服务可用，未形成托管方案模板 | 提供数据库/存储/认证的一键脚手架（cloud-service 技能打包） |
| 发布 | GitHub 连接器已连接，仓库骨架已起步 | 固化「提交规范 + 版本发布 + 站点部署」流水线文档 |
