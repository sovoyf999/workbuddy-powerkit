# 自动化配方：工作日站会摘要

> 来源：workbuddy-powerkit｜维护：team-lead（代 dev 构建）｜2026-10-19
> 用法：把下方 rrule 与 prompt 通过 automation 工具创建定时任务；创建参数见文末。

## 用途

每个工作日早上 9 点汇总昨日完成 / 今日计划 / 阻塞三项，生成站会摘要，省人工翻记录。

## rrule

```
FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9;BYMINUTE=0
```

## Prompt（自包含，五要素）

【目标】生成本工作日站会摘要：昨日完成、今日计划、当前阻塞三段。
【输入】绝对路径：`E:/VST/2026-10-19-09-17-48/team-board.txt`（团队留言板，含任务进展记录）与同目录下 `team/` 目录中最近的产出文件列表。
【输出】写入 `E:/VST/2026-10-19-09-17-48/standup-YYYY-MM-DD.md`（YYYY-MM-DD 为当天日期）。
【约束】只读输入文件，不改写；无更新时输出「无更新」并正常结束，不得报错；摘要每段不超过 5 条。
【失败处理】输入文件不存在时，在输出文件首行注明「输入缺失」并列出尝试过的路径。

## 创建参数

- `name`：`daily-standup`
- `prompt`：上方 Prompt 全文
- `rrule`：`FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9;BYMINUTE=0`
