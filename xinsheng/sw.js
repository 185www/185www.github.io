var CACHE = 'xsheng-v3'
var ASSETS = ['/xinsheng/app.html', '/xinsheng/icon.svg', '/xinsheng/manifest.json']

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){return c.addAll(ASSETS)}).then(self.skipWaiting())
  )
})

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(ks){
      return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))
    }).then(self.clients.claim())
  )
})

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(r){return r||fetch(e.request)})
  )
})
