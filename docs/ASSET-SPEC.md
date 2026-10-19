# 增强资产规格书（ASSET-SPEC）—— Round 3 施工图纸

> 写给：dev｜设计：architect｜日期：2026-10-19｜依据：docs/ARCHITECTURE.md（架构）、RESEARCH §3 差距清单
> 规则：`description` 触发词**逐字照抄**进 SKILL.md；snippets 配置逐字照抄；所有 [假设] 处先实测再定稿。

## §1 技能包规格（skills/<name>/SKILL.md）

frontmatter 必填 `name` + `description` 两项（依据：INVENTORY §1 实证），`name` 必须等于目录名（RESEARCH §2 同构约定）。工作流写入 SKILL.md 正文。

### 1.1 wb-env-doctor —— 本机环境一键体检
- description（逐字抄）：「WorkBuddy 本机环境一键体检：检查 node/python/WSL 版本与可用性、MCP 配置（三处分发）合法性与启用态、用户级技能加载态，输出三级健康报告（通过/警告/失败）与修复建议。当用户要求环境体检、环境检查、环境诊断、WorkBuddy 体检、工具为什么用不了、wb-env-doctor 时使用。」
- 工作流：① 跑 `node --version`/`python --version`/`wsl -l -v` 记录版本与状态（期望值参照 INVENTORY §3：node 22.x、python 3.13.x、WSL Stopped 属正常）② 定位三处 MCP 配置（`~/.workbuddy/mcp.json`、项目级、`~/.mcporter/mcporter.json`）并 JSON.parse ③ 枚举 `~/.workbuddy/skills/*/SKILL.md` ④ 生成报告：每项 ✅/⚠️/❌ + 修复建议，存 `wb-env-report.md` ⑤ 命令/路径缺失记 ⚠️ 不中断。
- 验收：本机实跑，覆盖 ≥1 ❌（用户级 mcp.json 缺失即现状）+ ≥2 ✅（node/python）；报告含具体修复命令；零明文凭据。

### 1.2 wb-skill-auditor —— 已装技能审计
- description（逐字抄）：「扫描本机已装技能（用户级 ~/.workbuddy/skills/ 与内置插件缓存），审计每个 SKILL.md 的 frontmatter 规范性（name/description 必填、name 与目录名一致、description 含触发词与使用场景）与工作流可执行性，输出审计报告（问题清单 + 修复建议）。当用户要求技能审计、skill 审计、检查我的技能、技能质量检查、wb-skill-auditor 时使用。」
- 工作流：① 枚举用户级技能目录（预期 ≥4，INVENTORY §1）与内置缓存目录计数 ② 逐技能读 frontmatter 校验三项 ③ 检查正文是否含占位 TODO/不可执行步骤 ④ 输出 `skill-audit-report.md` 表格（技能/name 合规/触发词质量/问题/建议）⑤ 全程只读，不写用户级目录。
- 验收：报告覆盖本机全部用户级技能；dev 自建「缺 description」「name≠目录名」两个坏样例各被检出；只读性用目录 mtime 对比验证。

### 1.3 wb-mcp-doctor —— MCP 配置医生
- description（逐字抄）：「检查 MCP 配置健康度：三处分发的 mcp.json JSON 合法性、服务器条目格式对照官方 schema（stdio 需 command；http/sse 需 url；env/headers 支持 ${VAR} 展开）、凭据检查（拒绝明文 token，必须 ${VAR} 形式）、逐台启动验证（stdio 拉起不崩、http 返回状态码），输出健康报告与修复建议。当用户要求 MCP 体检、MCP 检查、mcp 配置检查、MCP 连不上、wb-mcp-doctor 时使用。」
- 工作流：① 定位三处配置并逐台 JSON.parse ② 格式对照：stdio 缺 command ❌；http/sse 缺 url ❌；`Bearer `/`sk-`/`ghp_` 后跟非 `${...}` 长串判明文 ❌ ③ 启动验证：stdio 用 `timeout 15 <command> ...` 记录是否拉起；http 用 `curl -s -o /dev/null -w "%{http_code}"` ④ 输出 `mcp-health-report.md` ⑤ 只读不改配置；凭据只报「已配置/未配置」（对齐 INVENTORY 隐私红线）。
- 验收：三份样例（合法 / JSON 语法错 / 明文 token）分别得 ✅/❌/❌；本机实测报告；修复建议写到「合并进哪个文件、加哪几行」级。

### 1.4 wb-automation-chef —— 自动化配方生成器
- description（逐字抄）：「自然语言日程需求 → WorkBuddy 定时自动化配方生成器：把每天/工作日/每周/每月/一次性的需求翻译成合法 rrule（FREQ 显式；DAILY/HOURLY/WEEKLY/MONTHLY/YEARLY + BYDAY/BYHOUR/BYMINUTE/BYMONTHDAY/INTERVAL；一次性用 scheduledAt ISO 8601）与自包含 prompt（目标/输入绝对路径/输出位置/约束/失败处理五要素，不依赖对话上下文）。当用户要求定时任务、自动化配方、每天自动执行、每周提醒、排个日程、wb-automation-chef 时使用。」
- 工作流：① 解析需求抽频率/时间/动作；模糊时间（如「月末」）必须追问确认，不猜 ② 生成 rrule ③ 生成五要素自包含 prompt ④ 输出配方文件（rrule 代码块 + prompt 全文 + automation 工具创建参数 name/prompt/rrule）⑤ 自检 FREQ 显式与 rrule 合法。
- 验收：5 条测试需求（含「每个月末」→ 追问）全部产出合法 rrule；prompt 五要素逐项可勾；配方可直接用于创建真实定时任务。

## §2 MCP snippets 选型清单（mcp/mcp.snippets.json）

schema：`type=stdio`（command/args/env）｜`type=http`（url/headers）；env/headers 支持 `${VAR}`、`${VAR:-default}` 展开（来源：同厂 CodeBuddy 官方《MCP 集成》文档，[假设] 适配 WorkBuddy，验收=本机启动实测）。Windows 下 npx 条目须 `cmd /c` 包装（官方 README 明示）。node ≥18 前提（INVENTORY §3：托管 node 22.22.2 开箱即用）。exa 不收录（mcporter 已配，INVENTORY §2）。

> **勘误（2026-10-19，队长实测回填）**：本表原列的 `@modelcontextprotocol/server-fetch` 与 `@modelcontextprotocol/server-time` 经 npm 实测**均不存在**（404，生态漂移：官方参考实现已调整）。最终 snippets 采用实测存在的包：`@modelcontextprotocol/server-filesystem`（1.0.0）、`@modelcontextprotocol/server-memory`（1.0.0）、`time-mcp`（1.0.6，社区）三台 stdio + github 远程 http。教训：规格书里的包名必须实测后才能进模板——这正是 [假设] 回填机制的价值。

| 服务器 | 选型理由（证据） | 配置（逐字抄，键名即 mcp.json 顶层键） |
|---|---|---|
| filesystem | 官方参考实现，带权限的文件读写（RESEARCH §2 高质量服务器列表）；`/tmp` 为示范路径，合并时换成你要开放的绝对目录 | `"filesystem": {"type": "stdio", "command": "cmd", "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-filesystem", "/tmp"]}` |
| time | 社区实现 `time-mcp`（1.0.6，原官方 `server-time` 已 404），时区/时间转换，automation 配方与日程任务底座 | `"time": {"type": "stdio", "command": "cmd", "args": ["/c", "npx", "-y", "time-mcp"]}` |
| github | 仓库 issue/PR/release 生命周期全靠 GitHub（INVENTORY §4 发布行）；远程托管免 Docker | `"github": {"type": "http", "url": "https://api.githubcopilot.com/mcp/", "headers": {"Authorization": "Bearer ${GITHUB_MCP_PAT}"}}`（URL 逐字取自 github-mcp-server 官方 README；本地备选 docker `ghcr.io/github/github-mcp-server` + env `GITHUB_PERSONAL_ACCESS_TOKEN`，写入 README 备选段） |
| memory | 官方参考实现，知识图谱跨会话记忆（官方 README 配置示例） | `"memory": {"type": "stdio", "command": "cmd", "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-memory"]}` |

凭据处理：仅 github 需凭据——`${GITHUB_MCP_PAT}` 占位 + mcp/README.md 写明「本地 export 后再合并配置」；snippets 内禁止出现任何真实 token。

## §3 automations 配方清单（automations/<name>.md）

每个配方 = rrule 代码块 + 自包含 prompt 全文 + 创建参数说明。prompt 五要素：目标/输入绝对路径/输出位置/约束/失败处理。

| 配方文件 | 用途 | rrule（逐字抄） | prompt 要点 |
|---|---|---|---|
| daily-standup.md | 工作日站会摘要 | `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9;BYMINUTE=0` | 读指定 TODO/任务表 → 昨日完成/今日计划/阻塞三段 → 写 `standup-YYYY-MM-DD.md`；无输入则输出「无更新」不报错 |
| weekly-skill-audit.md | 每周技能审计 | `FREQ=WEEKLY;BYDAY=MO;BYHOUR=10;BYMINUTE=0` | 按 wb-skill-auditor 工作流执行 → `skill-audit-YYYY-Www.md`；只读用户级 skills 目录 |
| monthly-env-check.md | 每月环境体检 | `FREQ=MONTHLY;BYMONTHDAY=1;BYHOUR=9;BYMINUTE=0` | 按 wb-env-doctor 工作流执行 → `wb-env-report-YYYY-MM.md`；出现 ❌ 时报告首行置顶告警 |
| monthly-mcp-check.md | 每月 MCP 巡检 | `FREQ=MONTHLY;BYMONTHDAY=15;BYHOUR=9;BYMINUTE=0` | 按 wb-mcp-doctor 工作流执行 → `mcp-health-YYYY-MM.md`；只报已配置/未配置 |

## §4 CI 规格（.github/workflows/ci.yml）

- 触发：`push: branches: [main]`、`pull_request`、`workflow_dispatch`；runner `ubuntu-latest`；`actions/checkout@v4`。
- Job `validate`：`actions/setup-node@v4`（`node-version: 22`，对齐 INVENTORY §3 托管运行时），两步：
  1. JSON 校验：`node .github/scripts/check-json.mjs`（dev 新建；递归仓库全部 `*.json`，JSON.parse 失败即非零退出；排除 node_modules）
  2. frontmatter 校验：`node .github/scripts/check-skills.mjs`（dev 新建；断言每个 `skills/*/SKILL.md` frontmatter 含 `name` 与 `description` 且 name==目录名，含 `automations/*.md` 的 rrule 含显式 `FREQ=`）
- Job `links`：`lycheeverse/lychee-action@v2`（args：`--no-progress README.md CONTRIBUTING.md docs/**/*.md skills/**/*.md mcp/**/*.md`），外链失效即失败（对标 RESEARCH §2「仓库级 CI 模板缺失」差距 #3）。
- 通过标准：两 job 全绿才允许合并；main 设 branch protection 必检项。
- dev 交活附：workflow 在本仓库一次 push 的实测绿跑记录。

## §5 通用硬性要求

1. 全部资产零明文凭据（token 只走 `${VAR}` 或「已配置/未配置」表述）。
2. SKILL.md 的 description 含中文触发词（对齐本机现有技能风格，INVENTORY §1）。
3. [假设] 项清单（须 dev 实测后回填结论）：WorkBuddy mcp.json 采用 §2 schema；npx stdio 服务器在 Windows 下 `cmd /c` 包装可用。
4. 完工后 dev 回填：本机启动日志/报告样例链接到 mcp/README.md 与各 SKILL.md 头部「已验证」行。
