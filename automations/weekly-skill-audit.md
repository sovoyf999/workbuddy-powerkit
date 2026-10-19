# 自动化配方：每周技能审计

> 来源：workbuddy-powerkit｜维护：team-lead（代 dev 构建）｜2026-10-19
> 依赖：`skills/wb-skill-auditor`（本仓库技能包）｜用法见文末创建参数。

## 用途

每周一上午 10 点对用户级技能做一次 frontmatter 与触发词质量审计，输出周报。

## rrule

```
FREQ=WEEKLY;BYDAY=MO;BYHOUR=10;BYMINUTE=0
```

## Prompt（自包含，五要素）

【目标】审计本机用户级技能的 frontmatter 规范性与触发词质量，输出审计周报。
【输入】绝对路径：`C:/Users/juice/.workbuddy/skills/`（枚举各技能目录的 SKILL.md）。
【输出】写入 `E:/VST/2026-10-19-09-17-48/skill-audit-YYYY-Www.md`（YYYY-Www 为 ISO 周编号）。
【约束】只读 skills 目录，禁止写入或修改任何技能文件；逐技能核对 name==目录名、description 必填且含触发词；不读取任何凭据。
【失败处理】skills 目录不存在时，输出「目录缺失：C:/Users/juice/.workbuddy/skills/」并正常结束。

## 创建参数

- `name`：`weekly-skill-audit`
- `prompt`：上方 Prompt 全文
- `rrule`：`FREQ=WEEKLY;BYDAY=MO;BYHOUR=10;BYMINUTE=0`
