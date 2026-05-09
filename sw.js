const CACHE_NAME = 'action-trigger-v1';
const ASSETS = [
  './',
  './action-app.html',
  './manifest.json',
  './index.html'
];

// 安装事件：缓存资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null)
    ))
  );
});

// 拦截请求：优先网络，失败则用缓存
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
