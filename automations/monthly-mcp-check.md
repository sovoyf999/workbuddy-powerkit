# 自动化配方：每月 MCP 巡检

> 来源：workbuddy-powerkit｜维护：team-lead（代 dev 构建）｜2026-10-19
> 依赖：`skills/wb-mcp-doctor`（本仓库技能包）｜用法见文末创建参数。

## 用途

每月 15 号早上 9 点巡检三处 MCP 配置的健康度（JSON 合法性 / 条目格式 / 凭据占位符）。

## rrule

```
FREQ=MONTHLY;BYMONTHDAY=15;BYHOUR=9;BYMINUTE=0
```

## Prompt（自包含，五要素）

【目标】生成本月 MCP 巡检报告：三处配置逐台 ✅/⚠️/❌ + 修复建议。
【输入】绝对路径：`C:/Users/juice/.workbuddy/mcp.json`（若存在）、项目级 `project-resources/*/mcp.json`、`C:/Users/juice/.mcporter/mcporter.json`。
【输出】写入 `E:/VST/2026-10-19-09-17-48/mcp-health-YYYY-MM.md`。
【约束】只读配置；stdio 条目须有 command、http/sse 须有 url；`Bearer `/`sk-`/`ghp_` 后跟非 `${...}` 长串判明文 ❌；凭据只报「已配置/未配置」。
【失败处理】配置文件缺失记 ❌ 并给出建立统一模板的建议（参考 workbuddy-powerkit/mcp/README.md）。

## 创建参数

- `name`：`monthly-mcp-check`
- `prompt`：上方 Prompt 全文
- `rrule`：`FREQ=MONTHLY;BYMONTHDAY=15;BYHOUR=9;BYMINUTE=0`
