---
name: wb-mcp-doctor
description: "检查 MCP 配置健康度：三处分发的 mcp.json JSON 合法性、服务器条目格式对照官方 schema（stdio 需 command；http/sse 需 url；env/headers 支持 ${VAR} 展开）、凭据检查（拒绝明文 token，必须 ${VAR} 形式）、逐台启动验证（stdio 拉起不崩、http 返回状态码），输出健康报告与修复建议。当用户要求 MCP 体检、MCP 检查、mcp 配置检查、MCP 连不上、wb-mcp-doctor 时使用。"
---

# wb-mcp-doctor — MCP 配置医生

> 已验证：2026-10-19 本机实跑通过（见文末「本机实测记录」）
> **修订 2026-10-19：补充 npx 缓存损坏排障、客户端类型分流、marketplace 校验失败诊断。**

## 工作流

1. **先判断客户端类型**（决定后续判定标准，不可跳过）：
   - **桌面版**：MCP 走插件制 + 界面添加，`~/.workbuddy/mcp.json` 会被启动清理
   - **CodeBuddy Code（CLI）**：MCP 走 `~/.workbuddy/mcp.json` 文件
2. **定位配置（只读）**：
   - 桌面版 → `~/.workbuddy/plugins/cache/*/*/*/.mcp.json` 与 `~/.mcporter/mcporter.json`
   - CLI → `~/.workbuddy/mcp.json`、项目级 `project-resources/*/mcp.json`、`~/.mcporter/mcporter.json`
3. **JSON 合法性**：逐一 `JSON.parse`（可用 `node .github/scripts/check-json.mjs <目录>` 机检）
4. **格式对照官方 schema**：
   - `type=stdio` 必须有 `command`（缺 → ❌）
   - `type=http|sse` 必须有 `url`（缺 → ❌）
   - `env`/`headers` 支持 `${VAR}`、`${VAR:-default}` 展开
5. **凭据检查**：`Bearer `/`sk-`/`ghp_` 后跟非 `${...}` 的长串 → 判明文 ❌（必须改为 `${VAR}` 占位）
6. **启动验证**：stdio 用 `timeout 60 npx -y <pkg>` 试拉，记录是否稳定挂起；http 用 `curl -s -o /dev/null -w "%{http_code}"` 记状态码
7. **输出** `mcp-health-report.md`：每台 ✅/⚠️/❌ + 修复建议

## 已知行为与排障（桌面版 5.8.3 实测）

### ① 用户级 mcp.json 缺失 = 正常

daemon 启动执行 `cleanupStaleUserMcpJson()` **无条件删除** `~/.workbuddy/mcp.json`（日志 `stale-user-mcp-json`）。

- 缺失记 ✅，**不要**建议用户创建（创建后仍会被删）
- 桌面版自定义 MCP 正确入口：连接器管理 → 自定义连接器 → 粘 JSON → 信任

### ② 手工伪造插件无效

若用户手工造 MCP 插件并登记 `installed_plugins.json` + `enabledPlugins`，启动仍报：

```
Failed to repair enabled plugins: <name>: plugin not found in marketplace
```

daemon 拿插件去 marketplace 索引校验（`ConnectorMcpSnapshot marketplaceEntries=380`），不在索引内即判缺失。本地插件需 marketplace 源与签名，**无法手工注入**，应引导走界面。

### ③ npx 缓存损坏（最常见假故障）

启动报 `Cannot find package '...\_npx\<hash>\node_modules\<pkg>\index.js'` + `ERR_MODULE_NOT_FOUND`：

**这不是配置错误**，是 npx 缓存损坏。修复：

```bash
rm -rf "$LOCALAPPDATA/npm-cache/_npx"
```

清完重启即恢复。**看到模块找不到先清缓存，别急着改配置。**

### ④ filesystem 路径不可用

- Windows 下 `/tmp` 不存在 → 报启动失败
- 路径应指向专用空目录，避免暴露整个工作区
- 首次使用前确认目录已存在

## 隐私红线

只报「已配置/未配置」；禁止把任何凭据值写进报告（对齐 INVENTORY 隐私红线）。

## 本机实测记录（2026-10-19，修订版）

三台免凭据 MCP 启动实测：

| 测试 | 结果 |
|---|---|
| 合法 JSON（mcp.snippets.json） | ✅ check-json.mjs 通过 |
| JSON 语法错样例 | ❌ 正确检出 |
| 明文 token 样例 | ❌ 正确判定（规则见工作流 5） |
| `@modelcontextprotocol/server-filesystem` 1.0.0 stdio 试拉 | ⚠️ 首次 `ERR_MODULE_NOT_FOUND` → 清 npx 缓存后 ✅ `Secure MCP Filesystem Server running on stdio` |
| `@modelcontextprotocol/server-memory` 1.0.0 stdio 试拉 | ✅ `Knowledge Graph MCP Server running on stdio` |
| `time-mcp` 1.0.6 stdio 试拉 | ✅ `Starting Time MCP server...` |
| `@modelcontextprotocol/server-fetch` / `server-time` | ❌ npm 404 不存在——已从 snippets 剔除（生态漂移实证） |
| 写 `~/.workbuddy/mcp.json` 后连接器列表 | ❌ 为空（被 `cleanupStaleUserMcpJson` 清理） |
| 手工造 MCP 插件 | ❌ `plugin not found in marketplace` |

**排障速查**：桌面版 MCP 不生效 → 先确认客户端类型 → 再查插件实体/`installed_plugins.json`/`enabledPlugins` 三处 → 查 daemon.log 的 `enabledPluginIds` 与 `[ConnectorMcpSnapshot]` 行 → 报 `plugin not found` 即判定为 marketplace 校验拦截，引导改走界面。

> 注：`list_installed_plugins` 类工具只返回 connector 类型，**不能**用它判断 MCP 插件是否加载；应以 daemon.log 为准。
