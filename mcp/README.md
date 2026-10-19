# MCP 增强配置（mcp/）

> 来源：workbuddy-powerkit｜**实测修订：2026-10-19 在 Windows 桌面版 WorkBuddy 5.8.3 上实测**
> 收录 3 台免凭据服务器（filesystem / memory / time）

## ⚠️ 先读这一节：桌面版不接受手工写入的 mcp.json

**这是本仓库 v0.1 的重大勘误。** v0.1 曾指引用户写 `~/.workbuddy/mcp.json`，在桌面版上**无效**。

桌面版 daemon 启动时有两个行为会让手工配置失效：

| 行为 | 证据 | 后果 |
|---|---|---|
| **无条件删除** `~/.workbuddy/mcp.json` | `ConnectorService.cleanupStaleUserMcpJson()`，日志标记 `stale-user-mcp-json` | 手写文件重启后消失，连接器列表永远为空 |
| **marketplace 校验插件** | 日志 `plugin not found in marketplace`，`ConnectorMcpSnapshot marketplaceEntries=380` | 手工造的 MCP 插件一律判定缺失并跳过 |

因此 `~/.workbuddy/mcp.json` 这条路**只对 CodeBuddy Code（CLI）有效**，对桌面版无效。

## 一、收录清单（3 台，均实测通过启动验证）

| 键名 | 包 | 实测版本 | 用途 | 凭据 |
|---|---|---|---|---|
| filesystem | `@modelcontextprotocol/server-filesystem` | 1.0.0 | 指定目录内的受限文件读写 | 无 |
| memory | `@modelcontextprotocol/server-memory` | 1.0.0 | 知识图谱跨会话记忆 | 无 |
| time | `time-mcp`（社区） | 1.0.6 | 时区/时间转换 | 无 |

三台均免凭据，装好即用。

## 二、怎么装（按你的客户端选一条）

### 方案 A：桌面版 —— 走界面添加（推荐）

1. 打开 **连接器管理 → 右上角「自定义连接器」**
2. 把 `mcp.snippets.json` 里的 `mcpServers` 内容粘进去
3. 保存后按界面提示点 **信任**

界面会自行处理信任状态，**不经过 marketplace 校验**，这是桌面版唯一可靠的自定义 MCP 路径。

### 方案 B：CodeBuddy Code（CLI）—— 走文件

CLI 才是真正读 `~/.workbuddy/mcp.json` 的那一侧：

```bash
codebuddy mcp add <name> --transport stdio --scope user -- <command> <args...>
```

或直接维护 `~/.workbuddy/mcp.json`（结构照抄本目录 `mcp.snippets.json`）。

## 三、filesystem 路径必须换掉

`mcp.snippets.json` 里的 `C:/Users/juice/.workbuddy/mcp-fs` 是**示范值**，务必换成你自己的绝对路径：

- 建议指向一个专用空目录（如 `~/.workbuddy/mcp-fs`），**不要指向工作区根目录**——该 MCP 会获得该目录下全部读写权限
- Windows 下**不能用 `/tmp`**（v0.1 的 bug：Linux 路径在 Windows 上不存在）
- 首次使用前确保目录已存在，否则启动可能失败

## 四、npx 缓存损坏 —— 最常见的翻车点

首次启动若报：

```
Error: Cannot find package '...\_npx\<hash>\node_modules\balanced-match\index.js'
code: 'ERR_MODULE_NOT_FOUND'
```

**不是配置写错，是 npx 缓存损坏。** 修复：

```bash
rm -rf "$LOCALAPPDATA/npm-cache/_npx"
```

清完重启即可正常（实测 `Secure MCP Filesystem Server running on stdio`）。

## 五、想走「插件制」？注意 marketplace 校验

桌面版的 MCP 以插件形式内置，结构为：

```
插件根目录/
├── .codebuddy-plugin/plugin.json   ← name / category:"mcp-app" / workbuddy.runtimeOwner:"agent-cli"
└── .mcp.json                       ← mcpServers，支持 ${CODEBUDDY_PLUGIN_ROOT}
```

**但不要手工伪造插件。** 手工造好后即使 `installed_plugins.json` 与 `enabledPlugins` 都登记成功，启动仍会报：

```
Failed to repair enabled plugins: <name>: plugin not found in marketplace
```

daemon 会拿插件去 marketplace 索引核对，不在索引内即判定缺失。本地插件需要 marketplace 源与签名，无法手工注入。**请走方案 A。**

## 六、github 本地备选（不想用远程托管）

```json
"github": {
  "type": "stdio",
  "command": "docker",
  "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}" }
}
```

> v0.1 默认收录的 `github` 远程 http 条目已从 snippets 移除：WorkBuddy 已内置 GitHub 连接器，重复配置且需额外 token。如需按仓库 / issue / PR 精细操作再用上面的 docker 版。

## 七、实测记录（2026-10-19，Windows 11 + WorkBuddy 桌面版）

| 验证项 | 结果 |
|---|---|
| `npm view @modelcontextprotocol/server-filesystem version` | ✅ 1.0.0 |
| `npm view @modelcontextprotocol/server-memory version` | ✅ 1.0.0 |
| `npm view time-mcp version` | ✅ 1.0.6 |
| filesystem stdio 启动（清 npx 缓存后） | ✅ `Secure MCP Filesystem Server running on stdio` |
| memory stdio 启动 | ✅ `Knowledge Graph MCP Server running on stdio` |
| time stdio 启动 | ✅ `Starting Time MCP server...` |
| 写 `~/.workbuddy/mcp.json` 后连接器列表 | ❌ 为空（被 `cleanupStaleUserMcpJson` 清理） |
| 手工造 MCP 插件 | ❌ `plugin not found in marketplace` |
| `npm view @modelcontextprotocol/server-fetch` | ❌ 404 不存在（v0.1 已剔除） |
| `npm view @modelcontextprotocol/server-time` | ❌ 404 不存在（v0.1 已剔除） |

> 生态在漂移：MCP 官方参考实现持续调整（第三方服务器列表 2026-04 已迁入官方 Registry）。**套用前先跑 `npm view` 复核**；Registry：https://registry.modelcontextprotocol.io

## 八、中文 MCP 社区索引

- 官方 Registry：https://registry.modelcontextprotocol.io
- 官方仓库（参考实现）：https://github.com/modelcontextprotocol/servers
- 社区精选：https://github.com/punkpeye/awesome-mcp-servers