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
 *   5. 注入自适应 basename 脚本 + 独立部署 polyfill
 *      （mock 平台 SDK 全局变量、拦截 /spark/ 前缀请求，保证应用在脱离平台时也能正常挂载）
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

function containsPlatformHost(str) {
  return PLATFORM_HOST_PATTERNS.some(function (h) {
    return str.indexOf(h) !== -1;
  });
}

// —— 独立部署 polyfill 脚本（注入到 <head> 最开头，在主 bundle 之前执行）——
// 作用：
//   1. 设置合理的平台全局变量默认值，避免 SDK 顶层初始化崩溃
//   2. 拦截 fetch / XMLHttpRequest，对 /spark/ 前缀的平台接口直接返回 mock 响应
//   3. 关闭 spark runtime 模式，让 SDK 走 standalone 降级路径
const STANDALONE_POLYFILL = `
<script>
  // —— 独立部署 polyfill ——
  // 在平台 SDK 加载前执行，mock 所有平台运行时依赖，确保应用脱离平台也能正常挂载。
  (function () {
    'use strict';

    // 1. 基础全局变量：给 SDK 顶层初始化提供安全默认值
    window.appId = window.appId || 'standalone-app';
    window.userId = window.userId || '';
    window.tenantId = window.tenantId || '';
    window.token = window.token || '';
    window.csrfToken = window.csrfToken || null;
    window.ENVIRONMENT = window.ENVIRONMENT || 'production';
    window.IS_MIAODA_PREVIEW = false;
    window._IS_Spark_RUNTIME = false;  // 关键：关闭 spark runtime，SDK 走 standalone 降级
    window._FULLSTACK_RUNTIME_INITIALIZED__ = true;  // 阻止 SDK 重复执行顶层初始化

    // 2. 拦截 fetch：对 /spark/ 与 /app/*/__runtime__/ 平台接口直接返回 mock 成功响应
    var originalFetch = window.fetch;
    if (originalFetch) {
      window.fetch = function (input, init) {
        var url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
        // 命中平台运行时接口 → 直接返回 mock 成功，不发真实请求
        if (
          url.indexOf('/spark/') !== -1 ||
          url.indexOf('/__runtime__/') !== -1 ||
          url.indexOf('/get_published') !== -1 ||
          url.indexOf('/current_server_timestamp') !== -1 ||
          url.indexOf('/observability/') !== -1 ||
          url.indexOf('/metrics/collect') !== -1 ||
          url.indexOf('/logs/collect') !== -1 ||
          url.indexOf('/traces/collect') !== -1
        ) {
          return Promise.resolve(new Response(JSON.stringify({
            code: 0,
            status_code: '0',
            msg: 'ok',
            data: {
              app_info: {
                app_name: 'Hybrid Matter',
                app_avatar: './favicon.svg',
                app_description: 'Xiang Chenghao Digital Media Art Portfolio'
              },
              app_runtime_extra: {
                bucket: { default_bucket_id: 'default' }
              },
              timestampNs: '0'
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
        return originalFetch.apply(this, arguments);
      };
    }

    // 3. 拦截 XMLHttpRequest：同样拦截 /spark/ 等平台接口
    if (window.XMLHttpRequest) {
      var OriginalXHR = window.XMLHttpRequest;
      window.XMLHttpRequest = function () {
        var xhr = new OriginalXHR();
        var _url = '';
        var _isMock = false;
        var _method = 'GET';

        var originalOpen = xhr.open;
        xhr.open = function (method, url) {
          _method = method;
          _url = url;
          _isMock =
            url.indexOf('/spark/') !== -1 ||
            url.indexOf('/__runtime__/') !== -1 ||
            url.indexOf('/get_published') !== -1 ||
            url.indexOf('/observability/') !== -1 ||
            url.indexOf('/metrics/collect') !== -1 ||
            url.indexOf('/logs/collect') !== -1 ||
            url.indexOf('/traces/collect') !== -1;
          return originalOpen.apply(this, arguments);
        };

        var originalSend = xhr.send;
        xhr.send = function (body) {
          if (_isMock) {
            // 异步模拟成功响应
            var self = this;
            setTimeout(function () {
              try {
                Object.defineProperty(self, 'readyState', { value: 4, writable: true });
                Object.defineProperty(self, 'status', { value: 200, writable: true });
                Object.defineProperty(self, 'statusText', { value: 'OK', writable: true });
                Object.defineProperty(self, 'responseText', {
                  value: JSON.stringify({
                    code: 0,
                    status_code: '0',
                    data: { app_info: { app_name: 'Hybrid Matter' } }
                  }),
                  writable: true
                });
                if (self.onreadystatechange) self.onreadystatechange();
                if (self.onload) self.onload();
              } catch (e) { /* ignore */ }
            }, 0);
            return;
          }
          return originalSend.apply(this, arguments);
        };

        return xhr;
      };
    }
  })();
</script>`;

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
  polyfillInjected: false,
};

// 1. 移除内联 script（内容含 {{ }} 模板变量，或引用了平台域名的）
const SCRIPT_INLINE_RE = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;
html = html.replace(SCRIPT_INLINE_RE, function (match, content) {
  const hasTemplate = content.indexOf('{{') !== -1 || content.indexOf('}}') !== -1;
  const hasPlatformHost = containsPlatformHost(content);
  if (hasTemplate || hasPlatformHost) {
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

// 4. 注入自适应 basename 脚本 + 独立部署 polyfill（放在 <head> 最开头）
const basenameScript =
  "<script>window.__BASENAME__ = new URL('.', document.baseURI).pathname;</script>";

if (html.indexOf('window.__BASENAME__') === -1) {
  html = html.replace('<head>', '<head>\n    ' + basenameScript);
  stats.basenameInjected = true;
}

// 注入独立部署 polyfill（必须在主 bundle 之前执行，所以放 <head> 最开头，紧跟 basename 之后）
if (html.indexOf('_IS_Spark_RUNTIME') === -1) {
  html = html.replace('<head>', '<head>\n  ' + STANDALONE_POLYFILL.trim());
  stats.polyfillInjected = true;
}

// 5. 清理连续的空行（可选，让输出更整洁）
html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

// —— 写回 ——
fs.writeFileSync(indexPath, html, 'utf-8');

// —— 输出结果 ——
console.log('[sanitize] ✅ index.html 清理完成');
console.log('  移除内联 script:     ' + stats.inlineScriptsRemoved + ' 个');
console.log('  移除外链 script:     ' + stats.remoteScriptsRemoved + ' 个');
console.log('  替换模板占位符:       ' + stats.placeholdersReplaced + ' 处');
console.log('  注入 basename 脚本:   ' + (stats.basenameInjected ? '是' : '已存在，跳过'));
console.log('  注入 standalone polyfill: ' + (stats.polyfillInjected ? '是' : '已存在，跳过'));
console.log('  输出文件:             ' + indexPath);
