# 贡献指南 / Contributing

欢迎给 workbuddy-powerkit 添砖加瓦。本仓库接受三类贡献：新技能包、MCP 服务器配置、自动化配方。

## 1. 新技能包（skills/）

- 放置路径：`skills/<skill-name>/SKILL.md`，frontmatter 的 `name` 必须等于目录名
- frontmatter 必填 `name` 与 `description`：description 写清触发词与使用场景（中文触发词，对齐现有技能风格），运行时按 description 匹配触发
- 正文按「结论先行 → 工作流步骤 → 验收标准」组织，控制在 200 行内；工作流步骤必须可执行，不留 TODO 占位
- 格式规范见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §1；逐技能施工样例（含 description 逐字模板）见 [docs/ASSET-SPEC.md](docs/ASSET-SPEC.md) §1

## 2. MCP 服务器配置（mcp/）

- 放置路径：`mcp/mcp.snippets.json`（供用户合并进 `~/.workbuddy/mcp.json`）
- schema：`type=stdio`（command/args/env）或 `type=http|sse`（url/headers）；env/headers 支持 `${VAR}`、`${VAR:-default}` 展开（采信同厂 CodeBuddy 官方《MCP 集成》口径，[假设] 项以实测为准）
- 每个条目的字段必须对照该服务器的官方文档/仓库，不猜字段；Windows 下 npx 条目用 `cmd /c` 包装
- 需要凭据的服务器只写 `${VAR}` 占位符，严禁提交真实密钥，并在 mcp/README.md 写明「本地 export 后再合并」

## 3. 自动化配方（automations/）

- 放置路径：`automations/<name>.md`
- 每个配方 = rrule 代码块 + 自包含 prompt 全文 + 创建参数说明
- rrule：`FREQ` 必须显式（DAILY/HOURLY/WEEKLY/MONTHLY/YEARLY + BYDAY/BYHOUR/BYMINUTE/BYMONTHDAY/INTERVAL）；一次性任务用 `scheduledAt`（ISO 8601）
- prompt 五要素：目标 / 输入绝对路径 / 输出位置 / 约束 / 失败处理——触发时看不到当前对话，所有背景信息必须写进 prompt

## CI 与提交前校验

CI（`.github/workflows/ci.yml`）在 push 到 main、pull_request 与手动触发时运行：`validate` job 执行两个校验脚本，`links` job 检查 Markdown 外链。**提交前本地先跑**：

```bash
node .github/scripts/check-json.mjs    # 递归校验仓库全部 *.json 合法性
node .github/scripts/check-skills.mjs  # 校验 SKILL.md frontmatter 与配方 rrule
```

两个脚本全部退出码为 0 才允许推送；链接失效同样会在 CI 失败。

## 提交前自查

- [ ] 文档类：结构完整、结论明确、推测内容已标注、行数受控
- [ ] 配置类：JSON 合法（`node .github/scripts/check-json.mjs` 实测通过）、格式对照官方文档
- [ ] 技能类：frontmatter 可解析、name 等于目录名、触发词具体、有验收标准
- [ ] 配方类：rrule 的 FREQ 显式且合法、prompt 五要素齐全
- [ ] 无裸凭据：token/密钥一律 `${VAR}` 占位符
- [ ] 交叉引用有效：文中链接指向的文件真实存在

> 资产规格以 [docs/ASSET-SPEC.md](docs/ASSET-SPEC.md) 为准；协作过程与事故教训见 [docs/TEAM-PROCESS.md](docs/TEAM-PROCESS.md)。
