const CACHE = 'pomotodo-v4';
const ASSETS = ['./','./index.html','./style.css','./app.js','./timer-worker.js','./favicon.svg','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  const isDynamic=url.pathname.endsWith('.js')||url.pathname.endsWith('.css')||url.pathname.endsWith('.html')||url.pathname.endsWith('/');
  if(isDynamic){
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c));}return r;}).catch(()=>caches.match(e.request)));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
