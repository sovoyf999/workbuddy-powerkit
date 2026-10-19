# 版本路线图（ROADMAP）

> 维护：architect｜日期：2026-10-19｜配套：docs/ARCHITECTURE.md（四层模型）、docs/ASSET-SPEC.md（施工图纸）
> 节奏原则：先齐备（v0.1）→ 听反馈（v0.2）→ 再冻结（v1.0）。

## v0.1 首版（本仓库当前目标：四层资产齐备）

- 交付物：
  - skills/：4 个 wb- 技能包（wb-env-doctor / wb-skill-auditor / wb-mcp-doctor / wb-automation-chef）
  - mcp/：mcp.snippets.json（4 台服务器）+ README.md（三处分发机制 + 中文社区索引）
  - automations/：4 个自包含配方（工作日站会 / 每周技能审计 / 每月环境体检 / 每月 MCP 巡检）
  - .github/workflows/ci.yml（JSON 校验 + Markdown 链接检查 + frontmatter 检查）
  - docs/：ARCHITECTURE / ROADMAP / ASSET-SPEC + README 完稿
- 退出标准：
  - CI 三项检查在 main 全绿（见 ASSET-SPEC §4 通过标准）
  - tester 实测：4 技能均可被 WorkBuddy 加载并跑通一遍工作流；mcp.snippets.json 至少 github 远程与 1 台 stdio 本机启动成功
  - 1 条 rrule 配方成功创建为定时自动化（wb-automation-chef 产出验证）
  - 验收标准（team/验收标准.md）逐项勾选通过

## v0.2 社区反馈迭代（GitHub Issues 驱动）

- 交付物：issue 分类闭环（bug/增强/doc）；技能健壮性修复；MCP 清单按社区反馈扩容（每台须附本机启动证据）；EXPERT-SOP.md（专家包 SOP，差距 #6）
- 退出标准：完成 ≥1 轮社区反馈闭环；新增 MCP 服务器 100% 通过「本机启动 + 工具列表非空」实测；文档与实现零矛盾

## v1.0 规范冻结（稳定 API/技能规范）

- 交付物：技能 frontmatter 规范 v1.0 冻结（name/description 必填，wb- 前缀命名约定成文）；mcp.snippets.json schema 版本化（含 schema 声明文件）；CHANGELOG + CONTRIBUTING 定稿；跨平台技能迁移指南（Claude Skills ↔ WorkBuddy，差距 #9）
- 退出标准：连续两个 v0.2 无 breaking 类反馈；所有资产行文与实测行为一致；CI 门禁覆盖全部资产类型

> 版本号随 git tag 走；每版退出标准由 tester 复核、队长放行。
