# 自动化配方：每月环境体检

> 来源：workbuddy-powerkit｜**修订 2026-10-19：路径改为占位符**
> 依赖：`skills/wb-env-doctor`（本仓库技能包）｜用法见文末创建参数。

## ⚠️ 使用前必读：先替换路径占位符

`<OUTPUT_DIR>` 需替换成你自己的**已存在**目录，如 `E:/VST/2026-10-19-11-21-43/`。

> 判定规则提醒：桌面版 WorkBuddy 下，用户级 `~/.workbuddy/mcp.json` **不存在属正常**（启动时被清理），不要判为失败项。详见 `skills/wb-env-doctor/SKILL.md`。

## 用途

每月 1 号早上 9 点对 WorkBuddy 本机环境做一次全量体检，出现失败项时报告首行置顶告警。

## rrule

```
FREQ=MONTHLY;BYMONTHDAY=1;BYHOUR=9;BYMINUTE=0
```

## Prompt（自包含，五要素）

【目标】生成本月环境体检报告：node/python/WSL、MCP 三处配置、用户级技能、磁盘，逐项 ✅/⚠️/❌。
【输入】无需外部输入文件；执行 `node --version`、`python --version`、`wsl -l -v` 与目录检查（`~/.workbuddy/mcp.json`、`~/.mcporter/mcporter.json`、`~/.workbuddy/skills/`）。
【输出】写入 `<OUTPUT_DIR>/wb-env-report-YYYY-MM.md`；存在 ❌ 项时，报告首行置顶「⚠️ 本月体检发现 N 个失败项」。
【约束】全程只读，不修改任何配置；凭据只记「已配置/未配置」，禁止读取或输出明文。用户级 `~/.workbuddy/mcp.json` 缺失记 ✅（桌面版正常状态），不计入失败项。
【失败处理】命令不存在记 ⚠️ 并给出修复建议，不中断整体体检；输出目录不存在时先创建再写入。

## 创建参数

- `name`：`monthly-env-check`
- `prompt`：上方 Prompt 全文（**先替换占位符**）
- `rrule`：`FREQ=MONTHLY;BYMONTHDAY=1;BYHOUR=9;BYMINUTE=0`
- `cwds`：`<OUTPUT_DIR>`
