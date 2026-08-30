/**
 * 清理 Vite 构建产物中的平台注入内容，使 index.html 可独立部署到 GitHub Pages
 * 等静态托管环境（不依赖妙搭平台的 HTML 模板替换与运行时注入）。
 *
 * 处理范围：构建产物目录下的 index.html
 *   1. 移除所有含 {{ }} 模板变量的内联 script
 *   2. 移除平台监控/日志外链 script（ibytedapm / feishucdn / bytescm 等）
 *   3. 替换残留的模板占位符（appName / appDescription / appAvatar / basename 等）
 *   4. 注入自适应 basename 脚本，使应用在任意子路径下都能正确初始化 Router
 *
 * 使用：node scripts/sanitize-standalone.mjs [distDir]
 *   默认 distDir = dist/gh-pages
 */

import fs from 'node:fs';
import path from 'node:path';

// —— 配置 ——
const DIST_DIR = process.argv[2] ?? 'dist/gh-pages';
const APP_NAME = 'Hybrid Matter';
const APP_DESCRIPTION = 'Xiang Chenghao Digital Media Art Portfolio';
const FAVICON_PATH = './favicon.svg';

// 需要移除的外链 script 的 src 特征域名
const REMOTE_SCRIPT_HOST_PATTERNS = [
  'ibytedapm.com',
  'feishucdn.com',
  'bytescm.com',
  'bytednsdoc.com',
  'lf3-short.ibytedapm.com',
];

// —— 主流程 ——
const indexPath = path.resolve(DIST_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error(`[sanitize] ❌ 找不到 index.html: ${indexPath}`);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');
const stats = {
  scriptsRemoved: 0,
  placeholdersReplaced: 0,
  basenameInjected: false,
};

// 1. 移除所有内联 script（内容含 {{ 或 }} 模板变量的）
const SCRIPT_INLINE_RE = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;
html = html.replace(SCRIPT_INLINE_RE, (match, content) => {
  if (content.includes('{{') || content.includes('}}')) {
    stats.scriptsRemoved++;
    return '';
  }
  return match;
});

// 2. 移除外链 script（src 命中平台域名的）
const SCRIPT_REMOTE_RE = /<script[^>]*\ssrc="([^"]+)"[^>]*><\/script>/gi;
html = html.replace(SCRIPT_REMOTE_RE, (match, src) => {
  const isPlatform = REMOTE_SCRIPT_HOST_PATTERNS.some((h) => src.includes(h));
  if (isPlatform) {
    stats.scriptsRemoved++;
    return '';
  }
  return match;
});

// 3. 替换模板占位符
const placeholderMap = {
  '{{appName}}': APP_NAME,
  '{{{appName}}}': APP_NAME,
  '{{appDescription}}': APP_DESCRIPTION,
  '{{{appDescription}}}': APP_DESCRIPTION,
  '{{appAvatar}}': FAVICON_PATH,
  '{{{appAvatar}}}': FAVICON_PATH,
  '{{basename}}': '',
  '{{{basename}}}': '',
};

for (const [placeholder, replacement] of Object.entries(placeholderMap)) {
  if (html.includes(placeholder)) {
    const before = html;
    html = html.split(placeholder).join(replacement);
    const count = Math.max(1, Math.abs(Math.round((before.length - html.length) / (placeholder.length - replacement.length))) || 1);
    stats.placeholdersReplaced += count;
  }
}

// 兜底：移除任何残留的 {{xxx}} 或 {{{xxx}}} 占位符
const LEFTOVER_RE = /\{\{\{?[^{}]+\}?\}\}/g;
const leftoverMatches = html.match(LEFTOVER_RE);
if (leftoverMatches) {
  stats.placeholdersReplaced += leftoverMatches.length;
  html = html.replace(LEFTOVER_RE, '');
}

// 4. 注入自适应 basename 脚本（放在 <head> 最开头）
const basenameScript =
  "<script>window.__BASENAME__ = new URL('.', document.baseURI).pathname;</script>";

if (!html.includes('window.__BASENAME__')) {
  html = html.replace('<head>', `<head>\n    ${basenameScript}`);
  stats.basenameInjected = true;
}

// —— 写回 ——
fs.writeFileSync(indexPath, html, 'utf-8');

// —— 输出结果 ——
console.log('[sanitize] ✅ index.html 清理完成');
console.log(`  移除平台 script:   ${stats.scriptsRemoved} 个`);
console.log(`  替换模板占位符:     ${stats.placeholdersReplaced} 处`);
console.log(`  注入 basename 脚本: ${stats.basenameInjected ? '是' : '已存在，跳过'}`);
console.log(`  输出文件:           ${indexPath}`);
