# 自动化配方：每月环境体检

> 来源：workbuddy-powerkit｜维护：team-lead（代 dev 构建）｜2026-10-19
> 依赖：`skills/wb-env-doctor`（本仓库技能包）｜用法见文末创建参数。

## 用途

每月 1 号早上 9 点对 WorkBuddy 本机环境做一次全量体检，出现失败项时报告首行置顶告警。

## rrule

```
FREQ=MONTHLY;BYMONTHDAY=1;BYHOUR=9;BYMINUTE=0
```

## Prompt（自包含，五要素）

【目标】生成本月环境体检报告：node/python/WSL、MCP 三处配置、用户级技能、磁盘，逐项 ✅/⚠️/❌。
【输入】无需外部输入文件；执行 `node --version`、`python --version`、`wsl -l -v` 与目录检查（`~/.workbuddy/mcp.json`、`~/.mcporter/mcporter.json`、`~/.workbuddy/skills/`）。
【输出】写入 `E:/VST/2026-10-19-09-17-48/wb-env-report-YYYY-MM.md`；存在 ❌ 项时，报告首行置顶「⚠️ 本月体检发现 N 个失败项」。
【约束】全程只读，不修改任何配置；凭据只记「已配置/未配置」，禁止读取或输出明文。
【失败处理】命令不存在记 ⚠️ 并给出修复建议，不中断整体体检。

## 创建参数

- `name`：`monthly-env-check`
- `prompt`：上方 Prompt 全文
- `rrule`：`FREQ=MONTHLY;BYMONTHDAY=1;BYHOUR=9;BYMINUTE=0`
