# 自动化配方：每月 MCP 巡检

> 来源：workbuddy-powerkit｜**修订 2026-10-19：路径改为占位符 + 客户端类型分流**
> 依赖：`skills/wb-mcp-doctor`（本仓库技能包）｜用法见文末创建参数。

## ⚠️ 使用前必读：先替换路径占位符

`<OUTPUT_DIR>` 需替换成你自己的**已存在**目录，如 `E:/VST/2026-10-19-11-21-43/`。

## ⚠️ 桌面版与 CLI 的判定差异

本配方在两类客户端上判定标准不同，**必须先判断客户端类型**：

| 客户端 | `~/.workbuddy/mcp.json` 缺失 | 判定 |
|---|---|---|
| 桌面版 WorkBuddy | 正常（启动时 `cleanupStaleUserMcpJson` 主动清理） | ✅ 正常，不算失败 |
| CodeBuddy Code（CLI） | 确实缺失 | ❌ 需提示补齐 |

桌面版另有「`plugin not found in marketplace`」= 手工插件被 marketplace 校验拦截，应引导改走**连接器管理 → 自定义连接器**界面，而非手工建文件。详见 `skills/wb-mcp-doctor/SKILL.md`。

## 用途

每月 15 号早上 9 点巡检三处 MCP 配置的健康度（JSON 合法性 / 条目格式 / 凭据占位符）。

## rrule

```
FREQ=MONTHLY;BYMONTHDAY=15;BYHOUR=9;BYMINUTE=0
```

## Prompt（自包含，五要素）

【目标】生成本月 MCP 巡检报告：先判断客户端类型，再按对应标准逐台 ✅/⚠️/❌ + 修复建议。
【输入】绝对路径：桌面版 → `~/.workbuddy/plugins/cache/*/*/*/.mcp.json` 与 `C:/Users/juice/.mcporter/mcporter.json`；CodeBuddy Code（CLI） → `C:/Users/juice/.workbuddy/mcp.json`（若存在）、项目级 `project-resources/*/mcp.json`、`C:/Users/juice/.mcporter/mcporter.json`。
【输出】写入 `<OUTPUT_DIR>/mcp-health-YYYY-MM.md`。
【约束】只读配置；stdio 条目须有 command、http/sse 须有 url；`Bearer `/`sk-`/`ghp_` 后跟非 `${...}` 长串判明文 ❌；凭据只报「已配置/未配置」。桌面版下用户级 mcp.json 缺失记 ✅，不计失败。
【失败处理】配置文件缺失（CLI 口径）记 ❌ 并给出建立模板的建议（参考 mcp/README.md）；输出目录不存在时先创建再写入；若启动报 ERR_MODULE_NOT_FOUND，提示清空 `%LOCALAPPDATA%\npm-cache\_npx` 而非改配置。

## 创建参数

- `name`：`monthly-mcp-check`
- `prompt`：上方 Prompt 全文（**先替换占位符**）
- `rrule`：`FREQ=MONTHLY;BYMONTHDAY=15;BYHOUR=9;BYMINUTE=0`
- `cwds`：`<OUTPUT_DIR>`
