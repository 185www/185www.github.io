const CACHE = 'pomotodo-v5-fix';
const ASSETS = ['./', './index.html', './style.css', './app.js', './timer-worker.js', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(err => {
      console.warn('SW cache addAll failed:', err);
    }))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first strategy for JS/CSS/HTML, cache-first for static assets
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isDynamic = url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  
  if (isDynamic) {
    // Network first, fallback to cache
    e.respondWith(
      fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // Cache first, fallback to network
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
  }
});
