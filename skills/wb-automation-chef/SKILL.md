---
name: wb-automation-chef
description: "自然语言日程需求 → WorkBuddy 定时自动化配方生成器：把每天/工作日/每周/每月/一次性的需求翻译成合法 rrule（FREQ 显式；DAILY/HOURLY/WEEKLY/MONTHLY/YEARLY + BYDAY/BYHOUR/BYMINUTE/BYMONTHDAY/INTERVAL；一次性用 scheduledAt ISO 8601）与自包含 prompt（目标/输入绝对路径/输出位置/约束/失败处理五要素，不依赖对话上下文）。当用户要求定时任务、自动化配方、每天自动执行、每周提醒、排个日程、wb-automation-chef 时使用。"
---

# wb-automation-chef — 自动化配方生成器

> 已验证：2026-10-19 干跑测试通过（见文末「干跑实测记录」）

## 工作流

1. **解析需求**：抽取频率 / 时间 / 动作三要素。模糊时间（如「月末」「月底」「下午」）**必须追问确认，不猜**——`BYMONTHDAY` 仅支持 1-31，不支持 -1
2. **生成 rrule**：`FREQ` 必须显式；周期性用 `FREQ=DAILY/HOURLY/WEEKLY/MONTHLY/YEARLY` + `BYDAY/BYHOUR/BYMINUTE/BYMONTHDAY/INTERVAL`；一次性用 `scheduledAt`（ISO 8601）
3. **生成自包含 prompt**：五要素缺一不可——目标 / 输入（绝对路径）/ 输出位置 / 约束 / 失败处理。触发时无人在场也能跑，不依赖任何对话上下文
4. **输出配方文件**：rrule 代码块 + prompt 全文 + 创建参数（`name` / `prompt` / `rrule` 或 `scheduledAt`）
5. **自检**：FREQ 显式、rrule 合法、prompt 五要素逐项可勾

## 配方模板

```markdown
## 用途
一句话。

## rrule
FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0

## Prompt（自包含，五要素）
【目标】…
【输入】绝对路径：…
【输出】写入：…
【约束】…
【失败处理】…
```

## 干跑实测记录（2026-10-19，未创建真实任务）

| 测试需求 | 产出 | 判定 |
|---|---|---|
| 每个工作日早上 9 点站会 | `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9;BYMINUTE=0` | ✅ |
| 每周一上午 10 点技能审计 | `FREQ=WEEKLY;BYDAY=MO;BYHOUR=10;BYMINUTE=0` | ✅ |
| 每月 1 号早上 9 点环境体检 | `FREQ=MONTHLY;BYMONTHDAY=1;BYHOUR=9;BYMINUTE=0` | ✅ |
| 每个月末 | **已追问**（「月末」指哪一天）未生成 rrule | ✅ 符合「模糊必须追问」 |
| 明天下午 3 点提醒 | 一次性：`scheduledAt`（ISO 8601，示例 `2026-10-20T15:00`） | ✅ |

完整配方示例见 `workbuddy-powerkit/automations/` 下 4 个文件。
