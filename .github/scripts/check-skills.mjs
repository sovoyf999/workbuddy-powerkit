#!/usr/bin/env node
/**
 * check-skills.mjs — 校验 skills 目录下 SKILL.md frontmatter 规范性与 automations 目录调度定义
 * 规则（依据 docs/ASSET-SPEC.md）:
 *   1. 每个技能目录必须含 SKILL.md
 *   2. frontmatter 必填 name 与 description
 *   3. name 必须等于目录名
 *   4. automations/*.md 必须含显式 FREQ= 或 scheduledAt
 * 用法: node .github/scripts/check-skills.mjs [skills目录] [automations目录]
 * 退出码: 0=全部通过, 1=存在问题
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const skillsDir = process.argv[2] || 'skills';
const autosDir = process.argv[3] || 'automations';
let errors = 0;

if (existsSync(skillsDir)) {
  for (const name of readdirSync(skillsDir)) {
    const p = join(skillsDir, name, 'SKILL.md');
    if (!existsSync(p)) {
      console.error(`❌ ${name}: 缺少 SKILL.md`);
      errors++;
      continue;
    }
    const content = readFileSync(p, 'utf8');
    const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) {
      console.error(`❌ ${name}: 缺少 frontmatter（--- 包裹的头区域）`);
      errors++;
      continue;
    }
    const hasName = /^name:\s*\S+/m.test(fm[1]);
    const hasDesc = /^description:\s*\S+/m.test(fm[1]);
    const nameMatch = fm[1].match(/^name:\s*(.+)$/m);
    const declared = nameMatch ? nameMatch[1].trim() : '';
    if (!hasName || !hasDesc) {
      console.error(`❌ ${name}: frontmatter 缺 name 或 description`);
      errors++;
    } else if (declared !== name) {
      console.error(`❌ ${name}: name(${declared}) 与目录名不一致`);
      errors++;
    } else {
      console.log(`✅ ${name}`);
    }
  }
} else {
  console.log(`（跳过：${skillsDir} 不存在）`);
}

if (existsSync(autosDir)) {
  for (const f of readdirSync(autosDir).filter((f) => f.endsWith('.md'))) {
    const content = readFileSync(join(autosDir, f), 'utf8');
    if (/FREQ=/.test(content) || /scheduledAt/.test(content)) {
      console.log(`✅ ${f}（含调度定义）`);
    } else {
      console.error(`❌ ${f}: 未找到 FREQ= 或 scheduledAt`);
      errors++;
    }
  }
} else {
  console.log(`（跳过：${autosDir} 不存在）`);
}

console.log(errors === 0 ? '\n全部通过' : `\n共 ${errors} 个问题`);
process.exit(errors === 0 ? 0 : 1);
