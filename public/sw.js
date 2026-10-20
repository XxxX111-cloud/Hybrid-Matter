/*
 * Hybrid Matter — Service Worker
 * 跨平台静态托管（GitHub Pages 子路径 / Cloudflare Pages 根路径）自适应。
 *
 * 策略：
 *   - 导航 HTML：network-first（带超时），慢/离线回退缓存，保证新版本可达又能离线
 *   - JS / CSS（含 hash 文件名）：stale-while-revalidate，二次秒开、后台更新
 *   - 字体：cache-first（限额）
 *   - 图片：cache-first（LRU 限额）
 *   - 视频：cache-first（LRU 按个数限额，避免 CacheStorage 配额爆掉）
 *   - 首屏实际加载的核心资源由页面 postMessage 触发预缓存，
 *     按资源类型分发到对应缓存桶（自动覆盖 hash 文件名）
 */

'use strict';

var VERSION = 'hybrid-matter-v2';
var SHELL_CACHE = VERSION + '-shell';
var NAV_CACHE = VERSION + '-nav';
var ASSETS_CACHE = VERSION + '-assets';
var FONT_CACHE = VERSION + '-fonts';
var IMAGE_CACHE = VERSION + '-images';
var VIDEO_CACHE = VERSION + '-videos';
var OTHER_CACHE = VERSION + '-other';
var META_CACHE = VERSION + '-meta';

// 缓存条目上限（LRU）
var MAX_IMAGES = 90;
var MAX_VIDEOS = 12;
var MAX_FONTS = 20;
var NAV_TIMEOUT = 4000;

var SCOPE_URL = new URL(self.registration.scope);

var SHELL_FILES = [
  'index.html',
  'favicon-32.png',
  'manifest.webmanifest',
  'icons/apple-touch-icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

/* ---------------- 资源类型 → 缓存桶 ---------------- */

function chooseCache(url) {
  var p = url.pathname;
  if (/\.(?:js|mjs|css)(?:\?|$)/i.test(p)) return ASSETS_CACHE;
  if (/\.(?:woff2?|ttf|otf|eot)(?:\?|$)/i.test(p)) return FONT_CACHE;
  if (/\.(?:mp4|webm|mov|m4v|ogv)(?:\?|$)/i.test(p)) return VIDEO_CACHE;
  if (/\.(?:png|jpe?g|webp|gif|avif|svg|ico|bmp)(?:\?|$)/i.test(p)) return IMAGE_CACHE;
  return SHELL_CACHE;
}

/* ---------------- LRU 顺序记录（持久化到 meta cache） ---------------- */

function readLru(cacheName) {
  return caches.open(META_CACHE).then(function (c) {
    return c.match(new URL('__lru__/' + cacheName + '.json', SCOPE_URL));
  }).then(function (res) {
    if (!res) return [];
    return res.text().then(function (txt) {
      try { return JSON.parse(txt); } catch (e) { return []; }
    });
  }).catch(function () { return []; });
}

function writeLru(cacheName, arr) {
  return caches.open(META_CACHE).then(function (c) {
    var resp = new Response(JSON.stringify(arr), {
      headers: { 'Content-Type': 'application/json' }
    });
    return c.put(new URL('__lru__/' + cacheName + '.json', SCOPE_URL), resp);
  }).catch(function () {});
}

function touchLru(cacheName, itemUrl, maxCount) {
  return readLru(cacheName).then(function (arr) {
    arr = arr.filter(function (x) { return x.url !== itemUrl; });
    arr.push({ url: itemUrl, t: Date.now() });

    var removed = [];
    while (arr.length > maxCount) {
      removed.push(arr.shift());
    }
    if (removed.length) {
      return caches.open(cacheName).then(function (c) {
        return Promise.all(removed.map(function (x) {
          return c.delete(x.url).catch(function () {});
        }));
      }).then(function () { return writeLru(cacheName, arr); });
    }
    return writeLru(cacheName, arr);
  }).catch(function () {});
}

/* ---------------- 缓存策略 ---------------- */

function cacheFirst(request, cacheName, maxCount) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      if (cached) {
        touchLru(cacheName, request.url, maxCount);
        return cached;
      }
      return fetch(request).then(function (resp) {
        if (resp && (resp.ok || resp.type === 'opaque') && request.method === 'GET') {
          cache.put(request, resp.clone()).catch(function () {});
          touchLru(cacheName, request.url, maxCount);
        }
        return resp;
      });
    });
  });
}

function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      var network = fetch(request).then(function (resp) {
        if (resp && resp.ok && request.method === 'GET') {
          cache.put(request, resp.clone()).catch(function () {});
        }
        return resp;
      }).catch(function () { return null; });

      return cached || network;
    });
  });
}

function fetchWithTimeout(request, ms) {
  return new Promise(function (resolve, reject) {
    var done = false;
    var timer = setTimeout(function () {
      if (done) return;
      done = true;
      reject(new Error('network timeout'));
    }, ms);
    fetch(request).then(function (r) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(r);
    }, function (e) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      reject(e);
    });
  });
}

function navigationFirst(request) {
  return caches.open(NAV_CACHE).then(function (cache) {
    return fetchWithTimeout(request, NAV_TIMEOUT).then(function (resp) {
      if (resp && resp.ok) {
        cache.put(request, resp.clone()).catch(function () {});
        return resp;
      }
      throw new Error('bad response');
    }).catch(function () {
      return cache.match(request).then(function (cached) {
        if (cached) return cached;
        // SPA 离线回退：返回缓存的 index.html
        return caches.open(SHELL_CACHE).then(function (sc) {
          return sc.match(new URL('index.html', SCOPE_URL));
        }).then(function (shell) {
          if (shell) return shell;
          return new Response('当前处于离线状态，且本地未缓存该页面。', {
            status: 503,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        });
      });
    });
  });
}

/* ---------------- 生命周期 ---------------- */

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      return Promise.all(SHELL_FILES.map(function (f) {
        return cache.add(new URL(f, SCOPE_URL)).catch(function () { return null; });
      }));
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) {
          return k.indexOf(VERSION) !== 0;
        }).map(function (k) {
          return caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ---------------- 预缓存消息（按类型分发到正确桶） ---------------- */

function precacheUrls(urls) {
  return Promise.all(urls.map(function (u) {
    try {
      var url = new URL(u, SCOPE_URL);
      if (url.origin !== SCOPE_URL.origin) return null;
      if (url.pathname.indexOf(SCOPE_URL.pathname) !== 0) return null;
      var bucket = chooseCache(url);
      return caches.open(bucket).then(function (c) {
        return c.match(url).then(function (exists) {
          if (exists) return null;
          return c.add(url).catch(function () { return null; });
        });
      });
    } catch (e) {
      return null;
    }
  }));
}

self.addEventListener('message', function (event) {
  var data = event.data;
  if (!data) return;
  if (data.type === 'PRECACHE_URLS' && Array.isArray(data.urls)) {
    event.waitUntil(precacheUrls(data.urls));
  } else if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ---------------- 主路由 ---------------- */

function inScope(url) {
  if (url.origin !== SCOPE_URL.origin) return false;
  return url.pathname.indexOf(SCOPE_URL.pathname) === 0;
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);
  if (!inScope(url)) return; // 跨域资源（在线字体等）走默认网络

  if (request.mode === 'navigate') {
    event.respondWith(navigationFirst(request));
    return;
  }

  var bucket = chooseCache(url);

  if (bucket === ASSETS_CACHE) {
    event.respondWith(staleWhileRevalidate(request, ASSETS_CACHE));
  } else if (bucket === FONT_CACHE) {
    event.respondWith(cacheFirst(request, FONT_CACHE, MAX_FONTS));
  } else if (bucket === VIDEO_CACHE) {
    event.respondWith(cacheFirst(request, VIDEO_CACHE, MAX_VIDEOS));
  } else if (bucket === IMAGE_CACHE) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, MAX_IMAGES));
  } else {
    // 其余同源 GET（manifest、json 等）：SWR，失败回退网络
    event.respondWith(
      staleWhileRevalidate(request, OTHER_CACHE).then(function (r) {
        return r || fetch(request);
      }).catch(function () {
        return fetch(request);
      })
    );
  }
});
