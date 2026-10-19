---
name: wb-skill-auditor
description: "扫描本机已装技能（用户级 ~/.workbuddy/skills/ 与内置插件缓存），审计每个 SKILL.md 的 frontmatter 规范性（name/description 必填、name 与目录名一致、description 含触发词与使用场景）与工作流可执行性，输出审计报告（问题清单 + 修复建议）。当用户要求技能审计、skill 审计、检查我的技能、技能质量检查、wb-skill-auditor 时使用。"
---

# wb-skill-auditor — 已装技能审计

> 已验证：2026-10-19 本机实跑通过（见文末「本机实测记录」）

## 工作流

1. **枚举**：列出用户级 `~/.workbuddy/skills/` 全部技能目录（预期 ≥4）；内置插件缓存目录只计数不逐个体检
2. **frontmatter 三项校验**（对照 workbuddy-powerkit 的 `.github/scripts/check-skills.mjs`）：
   - `name` 与 `description` 必填
   - `name` 必须等于目录名
   - `description` 含触发词与使用场景（纯名词无触发词记 ⚠️）
3. **正文检查**：是否含占位 TODO、不可执行步骤（如「稍后补充」）
4. **输出** `skill-audit-report.md`：表格（技能 / name 合规 / 触发词质量 / 问题 / 建议）
5. **只读**：全程不写用户级 skills 目录；验证方式可用目录 mtime 前后对比

## 快速命令

```bash
node .github/scripts/check-skills.mjs ~/.workbuddy/skills   # frontmatter 机检
```

## 隐私红线

只读技能元数据与正文；不读取、不输出任何凭据。

## 本机实测记录（2026-10-19）

用户级技能审计（真实数据，4/4 通过机检）：

| 技能 | name 合规 | description 质量 | 问题 |
|---|---|---|---|
| agent-reach | ✅ | ✅ 含触发词（调研/搜索等） | 无 |
| qqmusic | ✅ | ✅ 中英双语触发词完整 | 无 |
| task-comms | ✅ | ✅ 含触发词与场景 | Minor：name/description 行尾有多余空格（不影响解析，建议修） |
| wsl-ubuntu | ✅ | ✅ 含使用场景 | 无 |

坏样例检出测试（check-skills.mjs 对临时目录，两个坏样本均正确检出、退出码 1）：
- `bad-no-desc`（缺 description）→ ❌「frontmatter 缺 name 或 description」
- `bad-name-mismatch`（name≠目录名）→ ❌「name(wrong-name) 与目录名不一致」
