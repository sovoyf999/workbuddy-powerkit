---
name: wb-env-doctor
description: "WorkBuddy 本机环境一键体检：检查 node/python/WSL 版本与可用性、MCP 配置（三处分发）合法性与启用态、用户级技能加载态，输出三级健康报告（通过/警告/失败）与修复建议。当用户要求环境体检、环境检查、环境诊断、WorkBuddy 体检、工具为什么用不了、wb-env-doctor 时使用。"
---

# wb-env-doctor — 本机环境一键体检

> 已验证：2026-10-19 本机实跑通过（见文末「本机实测记录」）

## 工作流

1. **运行时检查**：依次执行 `node --version`、`python --version`、`wsl -l -v`，记录版本与状态。期望值：node ≥18、python 3.13.x、WSL 为 Stopped 属正常（首次使用先启动）
2. **MCP 配置定位（三处分发，只读）**：
   - 用户级 `~/.workbuddy/mcp.json`
   - 项目级 `<各项目>/project-resources/*/mcp.json`
   - `~/.mcporter/mcporter.json`
   逐一 `JSON.parse` 验证合法性，记录服务器名与类型；**不读凭据值**，只记「已配置/未配置」
3. **技能加载态**：枚举 `~/.workbuddy/skills/*/SKILL.md`，记录数量与名称
4. **生成报告** `wb-env-report.md`：每项 ✅/⚠️/❌ + 实测值 + 修复建议
5. **容错**：命令/路径缺失记 ⚠️ 并给出修复命令，不中断整体流程

## 报告格式

| 检查项 | 状态 | 实测值 | 修复建议 |
|---|---|---|---|
| node | ✅/⚠️/❌ | 版本号 | 建议命令 |

## 隐私红线

零明文凭据：任何 token/密钥只报「已配置/未配置」，禁止写进报告。

## 本机实测记录（2026-10-19）

| 检查项 | 状态 | 实测值 |
|---|---|---|
| node | ✅ | v22.22.2（托管运行时，PATH 直指） |
| python | ✅ | 3.13.14 |
| WSL | ✅ | Ubuntu / WSL 2 / Stopped（正常） |
| 用户级 ~/.workbuddy/mcp.json | ❌ | 不存在（三处分发现状，非故障） |
| ~/.mcporter/mcporter.json | ✅ | 存在（exa 已配，凭据未读） |
| 用户级技能 | ✅ | 4 个：agent-reach / qqmusic / task-comms / wsl-ubuntu |
| 磁盘 | ✅ | C 剩 81G/217G（63%）；E 剩 461G/932G（51%） |

结论：1 项 ❌（用户级 mcp.json 缺失，属已知现状）→ 修复建议：按 workbuddy-powerkit 的 `mcp/README.md` 建立统一模板。
