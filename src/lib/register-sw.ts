/**
 * 注册 Service Worker
 * - 自适应子路径（GitHub Pages /Hybrid-Matter）与根路径（Cloudflare Pages）
 * - 首次激活后，把当前页实际加载的核心资源（JS/CSS/字体/图片）发给 SW 预缓存，
 *   自动覆盖 hash 文件名，无需构建期注入 precache manifest
 */
function collectLoadedUrls(): string[] {
  const STATIC_RE = /\.(?:js|mjs|css|woff2?|ttf|otf|svg|png|jpe?g|webp|gif|avif|webmanifest|json)(?:\?|$)/i;
  return performance
    .getEntriesByType('resource')
    .map((entry) => entry.name)
    .filter((u) => {
      try {
        const url = new URL(u, location.href);
        if (url.origin !== location.origin) return false;
        return STATIC_RE.test(url.pathname);
      } catch {
        return false;
      }
    });
}

export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return;

  const swUrl = new URL('sw.js', document.baseURI).href;
  const scope = new URL('.', document.baseURI).pathname;

  const precacheLoaded = () => {
    navigator.serviceWorker.ready
      .then((reg) => {
        const urls = collectLoadedUrls();
        reg.active?.postMessage({ type: 'PRECACHE_URLS', urls });
      })
      .catch(() => {
        /* 预缓存失败不影响正常使用 */
      });
  };

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl, { scope })
      .then((reg) => {
        const worker = reg.installing || reg.waiting;
        if (worker) {
          worker.addEventListener('statechange', (event) => {
            const sw = event.target as ServiceWorker;
            if (sw.state === 'activated') precacheLoaded();
          });
        } else if (reg.active) {
          precacheLoaded();
        }
      })
      .catch((err) => {
        // 注册失败不阻断站点
        console.warn('[pwa] Service Worker 注册失败：', err);
      });
  });
}
