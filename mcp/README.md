# MCP 增强配置（mcp/）

> 来源：workbuddy-powerkit｜构建：team-lead（代 dev，2026-10-19）｜所有条目均经本机实测

## 一、收录清单（4 台，全部实测存在）

| 键名 | 包 / 地址 | 实测版本 | 用途 | 凭据 |
|---|---|---|---|---|
| filesystem | `@modelcontextprotocol/server-filesystem` | 1.0.0 | 带权限的文件读写 | 无 |
| memory | `@modelcontextprotocol/server-memory` | 1.0.0 | 知识图谱跨会话记忆 | 无 |
| time | `time-mcp`（社区） | 1.0.6 | 时区/时间转换，自动化配方底座 | 无 |
| github | `https://api.githubcopilot.com/mcp/`（远程 http） | — | 仓库 issue/PR/release 管理 | `${GITHUB_MCP_PAT}` 占位 |

## 二、合并进本机配置

1. **先配凭据**（仅 github 需要）：
   ```bash
   export GITHUB_MCP_PAT="ghp_你的token"   # 每次会话生效；写进 shell profile 可持久化
   ```
2. **合并**：把 `mcp.snippets.json` 中 `mcpServers` 下的条目，并入用户级 `~/.workbuddy/mcp.json`（文件不存在则新建，整体结构就是 `{"mcpServers": {…}}`）
3. **校验**：`node .github/scripts/check-json.mjs <mcp.json所在目录>`
4. **filesystem 路径**：snippet 中 `/tmp` 是示范值，换成你要开放的目录（绝对路径）
5. **Windows 说明**：npx 条目用 `cmd /c` 包装——Git Bash 里 `npx` 直接 spawn 在部分 MCP 宿主下路径解析异常，`cmd /c` 是官方 README 明示的稳妥写法

## 三、三处分发机制（本机实证，2026-10-19）

用户级 `~/.workbuddy/mcp.json` **默认不存在**，MCP 配置实际分布在三处：

| 分发位置 | 实例 | 状态 |
|---|---|---|
| 项目级 `project-resources/*/mcp.json` | wb-issues（http） | 已配置 |
| `~/.mcporter/mcporter.json` | exa（http，搜索类） | 已配置 |
| 内置 MCP 插件 | mcp-ardot-mcp-app、mcp-miora | 已配置 |

本模板的意义：给用户级一个统一入口，与上述三处并存不冲突（键名去重即可）。

## 四、github 本地备选（不想用远程托管）

```json
"github": {
  "type": "stdio",
  "command": "docker",
  "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_MCP_PAT}" }
}
```

## 五、实测记录（2026-10-19）

| 验证项 | 命令 | 结果 |
|---|---|---|
| 包存在性 | `npm view <pkg> version` | filesystem 1.0.0 / memory 1.0.0 / time-mcp 1.0.6 ✅ |
| filesystem stdio 启动 | `timeout 60 npx -y @modelcontextprotocol/server-filesystem /tmp` | ✅ 稳定挂起无错误 |
| memory stdio 启动 | `timeout 60 npx -y @modelcontextprotocol/server-memory` | ✅ 稳定挂起无错误 |
| time stdio 启动 | `timeout 60 npx -y time-mcp` | ✅ 稳定挂起无错误 |
| **勘误** | `npm view @modelcontextprotocol/server-fetch` | ❌ **404 不存在**（原规格书误列，已剔除） |
| **勘误** | `npm view @modelcontextprotocol/server-time` | ❌ **404 不存在**（原规格书误列，已剔除） |
| JSON 合法性 | `node .github/scripts/check-json.mjs .` | ✅ 通过 |

> 生态在漂移：MCP 官方参考实现持续调整（第三方服务器列表 2026-04 已迁入官方 Registry）。**套用本模板前先跑 `npm view` 复核版本**；Registry 入口：https://registry.modelcontextprotocol.io

## 六、中文 MCP 社区索引

- 官方 Registry：https://registry.modelcontextprotocol.io
- 官方仓库（参考实现）：https://github.com/modelcontextprotocol/servers
- 社区精选：https://github.com/punkpeye/awesome-mcp-servers
