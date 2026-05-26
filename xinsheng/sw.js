var CACHE = 'xsheng-v2'
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

// ─── Periodic Background Sync ───
self.addEventListener('periodicsync', function(e){
  if(e.tag==='xsheng-checkin') e.waitUntil(onPeriodicSync())
})

function onPeriodicSync(){
  return getSchedule().then(function(items){
    var now = new Date()
    var due = items.filter(function(item){
      var t = parseTime(item.time)
      if(!t) return false
      var d = new Date()
      d.setHours(t[0], t[1], 0, 0)
      return Math.abs(d-now) < 15*60*1000
    })
    return Promise.all(due.map(function(item){
      return self.registration.showNotification('🌱 新生', {
        body: item.text,
        icon: '/xinsheng/icon.svg',
        tag: 'xsheng-'+item.id,
        data: {view: item.view||'chat'},
        requireInteraction: true
      })
    }))
  })
}

function parseTime(s){
  if(!s) return null
  var m = s.match(/^(\d{1,2}):(\d{2})$/)
  return m ? [parseInt(m[1]), parseInt(m[2])] : null
}

function getSchedule(){
  var defaultSchedule = [
    {id:'morning', time:'07:00', text:'🌅 早上好。今天你想在哪件事上进步一点点？', view:'chat'},
    {id:'midday', time:'12:00', text:'☀️ 现在感觉怎么样？还记得你的计划吗？', view:'chat'},
    {id:'reminder', time:'17:00', text:'⚠️ 到高危时段了。深呼吸3次，再做选择。', view:'chat'},
    {id:'evening', time:'21:00', text:'🌙 今天过得怎么样？做了一件让自己骄傲的事吗？', view:'chat'}
  ]
  return Promise.resolve(defaultSchedule)
}

// ─── Notification Click ───
self.addEventListener('notificationclick', function(e){
  e.notification.close()
  var url = '/xinsheng/app.html'
  if(e.notification.data && e.notification.data.view){
    url += '#'+e.notification.data.view
  }
  e.waitUntil(
    self.clients.matchAll({type:'window'}).then(function(cls){
      for(var i=0;i<cls.length;i++){
        if(cls[i].url.indexOf('/xinsheng/')>=0) return cls[i].focus()
      }
      return self.clients.openWindow(url)
    })
  )
})
