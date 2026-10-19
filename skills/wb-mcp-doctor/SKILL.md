---
name: wb-mcp-doctor
description: "检查 MCP 配置健康度：三处分发的 mcp.json JSON 合法性、服务器条目格式对照官方 schema（stdio 需 command；http/sse 需 url；env/headers 支持 ${VAR} 展开）、凭据检查（拒绝明文 token，必须 ${VAR} 形式）、逐台启动验证（stdio 拉起不崩、http 返回状态码），输出健康报告与修复建议。当用户要求 MCP 体检、MCP 检查、mcp 配置检查、MCP 连不上、wb-mcp-doctor 时使用。"
---

# wb-mcp-doctor — MCP 配置医生

> 已验证：2026-10-19 本机实跑通过（见文末「本机实测记录」）

## 工作流

1. **定位三处配置**（只读）：用户级 `~/.workbuddy/mcp.json`、项目级 `project-resources/*/mcp.json`、`~/.mcporter/mcporter.json`
2. **JSON 合法性**：逐一 `JSON.parse`（可用 `node .github/scripts/check-json.mjs <目录>` 机检）
3. **格式对照官方 schema**：
   - `type=stdio` 必须有 `command`（缺 → ❌）
   - `type=http|sse` 必须有 `url`（缺 → ❌）
   - `env`/`headers` 支持 `${VAR}`、`${VAR:-default}` 展开
4. **凭据检查**：`Bearer `/`sk-`/`ghp_` 后跟非 `${...}` 的长串 → 判明文 ❌（必须改为 `${VAR}` 占位）
5. **启动验证**：stdio 用 `timeout 60 npx -y <pkg>` 试拉，记录是否稳定挂起；http 用 `curl -s -o /dev/null -w "%{http_code}"` 记状态码
6. **输出** `mcp-health-report.md`：每台 ✅/⚠️/❌ + 修复建议（精确到「合并进哪个文件、加哪几行」）

## 隐私红线

只报「已配置/未配置」；禁止把任何凭据值写进报告（对齐 INVENTORY 隐私红线）。

## 本机实测记录（2026-10-19）

三处配置定位：用户级 mcp.json **不存在**（已知现状）；项目级（wb-issues）与 mcporter（exa）均在，凭据未读。

样例与启动实测：

| 测试 | 结果 |
|---|---|
| 合法 JSON（workbuddy-powerkit/mcp.snippets.json） | ✅ check-json.mjs 通过 |
| JSON 语法错样例 | ❌ 正确检出 |
| 明文 token 样例 | ❌ 正确判定（规则见工作流 4） |
| `@modelcontextprotocol/server-filesystem` 1.0.0 stdio 试拉 | ✅ 稳定挂起 60s 无错误 |
| `time-mcp` 1.0.6 stdio 试拉 | ✅ 稳定挂起 60s 无错误 |
| `@modelcontextprotocol/server-fetch` / `server-time` | ❌ npm 404 不存在——已从 snippets 剔除（生态漂移实证） |
