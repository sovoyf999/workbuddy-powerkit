# 实测勘误与桌面版差异说明（v0.2 修订）

> 修订日期：2026-10-19｜环境：Windows 11 + WorkBuddy **桌面版** 5.8.3
> 触发原因：本仓库 v0.1 资产在另一台机器实装时**连续失败**，逐项排查后确认多处结论不成立。

本文档记录 v0.1 的错误结论与实测证据，供后续使用者避坑。

## 一、v0.1 的三处硬错误

### 错误 1：指引写 `~/.workbuddy/mcp.json`（桌面版无效）

v0.1 声称 MCP 配置写入用户级 `~/.workbuddy/mcp.json` 即生效。**桌面版会在启动时删掉它。**

实测证据（daemon.log / app.asar 逆向）：

```
ConnectorService.cleanupStaleUserMcpJson()
  → unlink(~/.workbuddy/mcp.json)
  → 日志标记: stale-user-mcp-json
  → metrics: wb.connector.legacy_cleanup{kind:"stale-user-mcp-json"}
```

现象：写好文件 → 重启 → 连接器列表仍为空。**用户会误以为自己操作错了。**

**结论**：该路径仅对 CodeBuddy Code（CLI）有效。桌面版添加自定义 MCP 只能走
**连接器管理 → 自定义连接器** 界面，由 UI 维护信任状态。

### 错误 2：手工伪造 MCP 插件无效（marketplace 校验）

v0.1 的 L2 模型隐含「MCP 是插件，可自行投放」。实测**不可行**。

手工造好插件实体 + `installed_plugins.json` + `enabledPlugins` 三处齐全后，启动仍报：

```
Failed to repair enabled plugins: <name>: plugin not found in marketplace
[DaemonBackgroundServices] Local configured plugin reconcile failed
  (reason=daemon-startup)
```

根因：daemon 启动会做 marketplace 校验（`[ConnectorMcpSnapshot] marketplaceEntries=380`），**不在索引内的插件一律判定缺失并跳过**。本地插件需要 marketplace 源与签名，无法手工注入。

**结论**：桌面版不要手工造 MCP 插件，走界面。

### 错误 3：`filesystem` 的 `/tmp` 在 Windows 上不存在

v0.1 snippets 用 `/tmp` 作示范目录。Windows 无此路径 → 启动失败。
已改为 `C:/Users/juice/.workbuddy/mcp-fs`（示范值，需自行替换）。

## 二、v0.1 的两处可维护性问题

### 问题 4：`ERR_MODULE_NOT_FOUND` 不是配置错误

`filesystem` 首次启动报：

```
Cannot find package '...\_npx\<hash>\node_modules\balanced-match\index.js'
code: 'ERR_MODULE_NOT_FOUND'
```

这是 **npx 缓存损坏**，与配置无关。修复：

```bash
rm -rf "$LOCALAPPDATA/npm-cache/_npx"
```

清完重启即恢复（实测 `Secure MCP Filesystem Server running on stdio`）。

> 该报错极具误导性——看起来像依赖写错，实际只需清缓存。已在 `skills/wb-mcp-doctor/SKILL.md` 中固化为排障规则。

### 问题 5：自动化配方硬编码构建机路径

v0.1 四个配方把输出路径写死为 `E:/VST/2026-10-19-09-17-48/`（原作者构建时的临时工作区）。他人克隆即失效。

已全部改为 `<OUTPUT_DIR>` / `<INPUT_DIR>` / `<SKILLS_DIR>` 占位符 + 替换说明。

另：`daily-standup` 依赖 `team-board.txt` + `team/` 目录，这是多 Agent 协作产物，**普通用户机器上不存在**，直接创建会每个工作日空跑一次。已补充「单人模式」改写方案。

## 三、判定标准：桌面版 vs CLI

| 项目 | 桌面版 WorkBuddy | CodeBuddy Code（CLI） |
|---|---|---|
| 自定义 MCP 载体 | 插件 + 界面添加 | `~/.workbuddy/mcp.json` 文件 |
| 用户级 mcp.json 缺失 | ✅ 正常（启动清理） | ❌ 需补齐 |
| 手工写 mcp.json 生效 | ❌ 会被删 | ✅ 生效 |
| 手工造插件 | ❌ marketplace 校验拦截 | 不适用 |
| 添加入口 | 连接器管理 → 自定义连接器 | `codebuddy mcp add` |

**技能与自动化执行前应先判定客户端类型**，不要跨版本照搬 v0.1 结论。

## 四、正确的排障依据

| 想知道 | 看哪里 |
|---|---|
| 插件是否真被加载 | `~/.workbuddy/logs/daemon.log` 的 `enabledPluginIds` 字段 |
| MCP 快照与校验 | daemon.log 的 `[ConnectorMcpSnapshot]` 行 |
| 插件为何没生效 | daemon.log 的 `plugin not found in marketplace` |
| mcp.json 为何消失 | daemon.log 的 `stale-user-mcp-json` |

> ⚠️ **`list_installed_plugins` 类工具只返回 connector 类型，不能用它判断 MCP 插件是否加载。**
> 本次排查中曾因误用它而得出「插件未加载」的错误结论，实际该工具的返回范围本就不含 MCP 插件。

## 五、修正后的资产状态

| 资产 | v0.1 | v0.2 |
|---|---|---|
| MCP 台数 | 4（含 github 远程 http） | 3（均免凭据） |
| MCP 安装路径 | 写 `~/.workbuddy/mcp.json` | 界面添加（桌面）/ CLI（CodeBuddy Code） |
| filesystem 路径 | `/tmp`（Windows 失效） | Windows 绝对路径示范值 |
| npx 缓存故障 | 未收录 | 已固化为排障规则 |
| 自动化路径 | 硬编码构建机路径 | 占位符 + 替换说明 |
| daily-standup 输入源 | 默认存在（实际不存在） | 补充单人模式改写方案 |
| 客户端差异 | 未区分 | 新增对照表 |

## 六、结论

**本仓库的 L1 技能层与 L3 自动化层可正常工作**（约定式目录 + rrule，与客户端版本无关）。
**L2 MCP 层必须区分客户端**；桌面版请走界面，不要手工写文件或造插件。

L4 专家包与 CI 不受影响。