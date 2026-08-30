/**
 * sanitize-standalone.js
 *
 * 清理 Vite 构建产物 index.html 中的平台注入内容，使应用可独立部署到
 * GitHub Pages 等静态托管环境（不依赖妙搭平台的 HTML 模板替换与运行时注入）。
 *
 * 处理内容：
 *   1. 移除含模板变量 {{ }} 的内联 script
 *   2. 移除外链 src 命中平台域名的 script
 *   3. 移除内容中引用了平台域名的内联 script（动态创建监控脚本等）
 *   4. 替换残留的模板占位符（appName / appDescription / appAvatar 等）
 *   5. 注入自适应 basename 脚本，使应用在任意子路径下都能正确初始化 Router
 *
 * 使用：node sanitize-standalone.js [distDir]
 *   默认 distDir = dist/gh-pages
 *
 * 此脚本放在 public/ 下仅为可写性考虑，GitHub Actions workflow 中
 * 通过 node public/sanitize-standalone.js 调用。
 */

import fs from 'fs';
import path from 'path';

// —— 配置 ——
const DIST_DIR = process.argv[2] || 'dist/gh-pages';
const APP_NAME = 'Hybrid Matter';
const APP_DESCRIPTION = 'Xiang Chenghao Digital Media Art Portfolio';
const FAVICON_PATH = './favicon.svg';

const PLATFORM_HOST_PATTERNS = [
  'ibytedapm.com',
  'feishucdn.com',
  'bytescm.com',
  'bytednsdoc.com',
  'lf3-short.ibytedapm.com',
  'lf-cdn-tos.bytegoofy.com',
  'p3-lark.byteimg.com',
];

// 平台注入的内联脚本特征关键词（不含 {{}}、也不含域名，但同样需要移除）
const PLATFORM_INLINE_MARKERS = [
  'KSlardarWeb',
  'slardar',
  '__slardarErrBuf',
  'collectEvent',
  'LogAnalyticsObject',
  'needsPolyfill',
  'polyfills.js',
  'window.appId',
  'window.userId',
  'window.tenantId',
  'window.csrfToken',
  'window.ENVIRONMENT',
  'window._appInfo',
  'appInfo',
];

function containsPlatformHost(str) {
  return PLATFORM_HOST_PATTERNS.some(function (h) {
    return str.indexOf(h) !== -1;
  });
}

function containsPlatformMarker(str) {
  return PLATFORM_INLINE_MARKERS.some(function (m) {
    return str.indexOf(m) !== -1;
  });
}

// —— 主流程 ——
const indexPath = path.resolve(DIST_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('[sanitize] ❌ 找不到 index.html: ' + indexPath);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');
const stats = {
  inlineScriptsRemoved: 0,
  remoteScriptsRemoved: 0,
  placeholdersReplaced: 0,
  basenameInjected: false,
};

// 1. 移除内联 script（内容含 {{ }} 模板变量，或引用了平台域名的）
const SCRIPT_INLINE_RE = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;
html = html.replace(SCRIPT_INLINE_RE, function (match, content) {
  const hasTemplate = content.indexOf('{{') !== -1 || content.indexOf('}}') !== -1;
  const hasPlatformHost = containsPlatformHost(content);
  const hasPlatformMarker = containsPlatformMarker(content);
  if (hasTemplate || hasPlatformHost || hasPlatformMarker) {
    stats.inlineScriptsRemoved++;
    return '';
  }
  return match;
});

// 2. 移除外链 script（src 命中平台域名的）
const SCRIPT_REMOTE_RE = /<script[^>]*\ssrc="([^"]+)"[^>]*><\/script>/gi;
html = html.replace(SCRIPT_REMOTE_RE, function (match, src) {
  if (containsPlatformHost(src)) {
    stats.remoteScriptsRemoved++;
    return '';
  }
  return match;
});

// 3. 替换模板占位符
const placeholderMap = {
  '{{{appName}}}': APP_NAME,
  '{{appName}}': APP_NAME,
  '{{{appDescription}}}': APP_DESCRIPTION,
  '{{appDescription}}': APP_DESCRIPTION,
  '{{{appAvatar}}}': FAVICON_PATH,
  '{{appAvatar}}': FAVICON_PATH,
  '{{{basename}}}': '',
  '{{basename}}': '',
};

for (const placeholder in placeholderMap) {
  if (!Object.prototype.hasOwnProperty.call(placeholderMap, placeholder)) continue;
  const replacement = placeholderMap[placeholder];
  if (html.indexOf(placeholder) !== -1) {
    const before = html;
    html = html.split(placeholder).join(replacement);
    const diff = before.length - html.length;
    const denom = placeholder.length - replacement.length;
    const count = denom === 0 ? 0 : Math.abs(Math.round(diff / denom));
    stats.placeholdersReplaced += Math.max(0, count);
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

if (html.indexOf('window.__BASENAME__') === -1) {
  html = html.replace('<head>', '<head>\n    ' + basenameScript);
  stats.basenameInjected = true;
}

// 5. 清理连续的空行（可选，让输出更整洁）
html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

// —— 写回 ——
fs.writeFileSync(indexPath, html, 'utf-8');

// —— 输出结果 ——
console.log('[sanitize] ✅ index.html 清理完成');
console.log('  移除内联 script:   ' + stats.inlineScriptsRemoved + ' 个');
console.log('  移除外链 script:   ' + stats.remoteScriptsRemoved + ' 个');
console.log('  替换模板占位符:     ' + stats.placeholdersReplaced + ' 处');
console.log('  注入 basename 脚本: ' + (stats.basenameInjected ? '是' : '已存在，跳过'));
console.log('  输出文件:           ' + indexPath);
