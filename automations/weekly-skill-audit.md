# 自动化配方：每周技能审计

> 来源：workbuddy-powerkit｜**修订 2026-10-19：路径改为占位符，消除硬编码**
> 依赖：`skills/wb-skill-auditor`（本仓库技能包）｜用法见文末创建参数。

## ⚠️ 使用前必读：先替换路径占位符

本配方中的 `<SKILLS_DIR>` 与 `<OUTPUT_DIR>` 是**占位符**，需替换成你自己的绝对路径后再创建任务。直接照抄会写到错误位置。

| 占位符 | 含义 | 本机示例 |
|---|---|---|
| `<SKILLS_DIR>` | 用户级技能目录 | `C:/Users/juice/.workbuddy/skills/` |
| `<OUTPUT_DIR>` | 报告输出目录（**需已存在**） | `E:/VST/2026-10-19-11-21-43/` |

未替换时的表现：技能目录仍能扫到（审计结果正常），但报告写到不存在的路径 → 触发输出失败。**必须把 `<OUTPUT_DIR>` 设为一个已存在的目录。**

## 用途

每周一上午 10 点对用户级技能做一次 frontmatter 与触发词质量审计，输出周报。

## rrule

```
FREQ=WEEKLY;BYDAY=MO;BYHOUR=10;BYMINUTE=0
```

## Prompt（自包含，五要素）

【目标】审计本机用户级技能的 frontmatter 规范性与触发词质量，输出审计周报。
【输入】绝对路径：`<SKILLS_DIR>`（枚举各技能目录的 SKILL.md）。
【输出】写入 `<OUTPUT_DIR>/skill-audit-YYYY-Www.md`（YYYY-Www 为 ISO 周编号）。
【约束】只读 skills 目录，禁止写入或修改任何技能文件；逐技能核对 name==目录名、description 必填且含触发词；不读取任何凭据。
【失败处理】skills 目录不存在时，输出「目录缺失：<SKILLS_DIR>」并正常结束；输出目录不存在时先创建再写入，仍失败则记录错误路径并正常结束。

## 创建参数

- `name`：`weekly-skill-audit`
- `prompt`：上方 Prompt 全文（**先把占位符替换掉**）
- `rrule`：`FREQ=WEEKLY;BYDAY=MO;BYHOUR=10;BYMINUTE=0`
- `cwds`：`<OUTPUT_DIR>`（任务的工作目录）
