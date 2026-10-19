---
name: wb-env-doctor
description: "WorkBuddy 本机环境一键体检：检查 node/python/WSL 版本与可用性、MCP 配置（三处分发）合法性与启用态、用户级技能加载态，输出三级健康报告（通过/警告/失败）与修复建议。当用户要求环境体检、环境检查、环境诊断、WorkBuddy 体检、工具为什么用不了、wb-env-doctor 时使用。"
---

# wb-env-doctor — 本机环境一键体检

> 已验证：2026-10-19 本机实跑通过（见文末「本机实测记录」）
> **修订 2026-10-19：桌面版实测发现「用户级 mcp.json 缺失」属正常状态，原 v0.1 误判为 ❌，已改为 ✅ 并附原因。**

## 工作流

1. **运行时检查**：依次执行 `node --version`、`python --version`、`wsl -l -v`，记录版本与状态。期望值：node ≥18、python 3.13.x、WSL 为 Stopped 属正常（首次使用先启动）
2. **MCP 配置定位（三处，只读）**：
   - 用户级 `~/.workbuddy/mcp.json`
   - 项目级 `<各项目>/project-resources/*/mcp.json`
   - `~/.mcporter/mcporter.json`
   逐一 `JSON.parse` 验证合法性，记录服务器名与类型；**不读凭据值**，只记「已配置/未配置」
   - **判定规则（重要）**：`~/.workbuddy/mcp.json` 不存在 → 记 **✅ 正常**。桌面版 daemon 启动时会主动清理该文件（见下方「已知行为」），它并非故障。
3. **技能加载态**：枚举 `~/.workbuddy/skills/*/SKILL.md`，记录数量与名称
4. **生成报告** `wb-env-report.md`：每项 ✅/⚠️/❌ + 实测值 + 修复建议
5. **容错**：命令/路径缺失记 ⚠️ 并给出修复命令，不中断整体流程

## 已知行为（桌面版 WorkBuddy 5.8.3 实测）

桌面版 daemon 启动时执行 `ConnectorService.cleanupStaleUserMcpJson()`，**无条件删除** `~/.workbuddy/mcp.json`（日志标记 `stale-user-mcp-json`）。

因此：

- 该文件缺失是**正常状态**，不要报 ❌，也不要建议用户去创建它（创建了也会被删）
- 桌面版添加自定义 MCP 的正确入口是 **连接器管理 → 自定义连接器** 界面，由 UI 处理信任状态
- 手工伪造 MCP 插件不可行：daemon 会做 marketplace 校验，日志报 `plugin not found in marketplace`
- 若用户使用的是 **CodeBuddy Code（CLI）**，则 `~/.workbuddy/mcp.json` 有效，此时缺失才需要提示补齐

**先判断客户端类型再下结论**，不要跨版本照搬判定。

## 报告格式

| 检查项 | 状态 | 实测值 | 修复建议 |
|---|---|---|---|
| node | ✅/⚠️/❌ | 版本号 | 建议命令 |

## 隐私红线

零明文凭据：任何 token/密钥只报「已配置/未配置」，禁止写进报告。

## 本机实测记录（2026-10-19，修订版）

| 检查项 | 状态 | 实测值 |
|---|---|---|
| node | ✅ | v22.22.2（托管运行时，PATH 直指） |
| python | ✅ | 3.13.14 |
| WSL | ✅ | Ubuntu / WSL 2 / Stopped（正常） |
| 用户级 ~/.workbuddy/mcp.json | ✅ | 不存在 —— **桌面版正常状态**（启动时主动清理，非故障） |
| ~/.mcporter/mcporter.json | ✅ | 存在（exa 已配，凭据未读） |
| 用户级技能 | ✅ | 8 个（原 4 个 + wb-* 四件套） |
| 磁盘 | ✅ | C / E 均充足 |

结论：全部通过。桌面版无需手工维护用户级 mcp.json；自定义 MCP 走界面添加。
