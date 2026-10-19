#!/usr/bin/env node
/**
 * check-json.mjs — 递归校验仓库全部 *.json 合法性（排除 node_modules/.git）
 * 用法: node .github/scripts/check-json.mjs [根目录，默认当前目录]
 * 退出码: 0=全部合法, 1=存在非法 JSON
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.argv[2] || '.';
let total = 0;
let bad = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
    } else if (extname(entry.name) === '.json') {
      total++;
      try {
        JSON.parse(readFileSync(p, 'utf8'));
        console.log(`✅ ${p}`);
      } catch (err) {
        bad++;
        console.error(`❌ ${p}: ${err.message}`);
      }
    }
  }
}

walk(root);
console.log(`\n共校验 ${total} 个 JSON 文件，${bad} 个非法`);
process.exit(bad === 0 ? 0 : 1);
