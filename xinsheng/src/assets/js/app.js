;(function(){
  var $ = function(id){ return document.getElementById(id) }

  function init(){
    var profile = XS.getProfile()
    if(profile){
      // returning user — go straight to dashboard
      XS.setStep(4)
      renderDashboard()
      showPage('page-dashboard')
    } else {
      // new user — start wizard
      renderStep(0)
      showPage('page-wizard')
    }
    setupNav()
    setupCravingModal()
  }

  // ─── Wizard ────────────────────────────────────
  function renderStep(step){
    XS.setStep(step)
    var steps = document.querySelectorAll('.step')
    for(var i=0;i<steps.length;i++) steps[i].classList.remove('active')
    var el = $('step-'+step)
    if(el) el.classList.add('active')

    var dots = document.querySelectorAll('.step-dot')
    for(var i=0;i<dots.length;i++){
      dots[i].classList.toggle('done', i<step)
      dots[i].classList.toggle('active', i===step)
    }
  }

  // Step 0 → 1: submit profile
  $('btn-calc') && $('btn-calc').addEventListener('click', function(){
    var age = parseInt($('calc-age').value) || 55
    var gender = document.querySelector('input[name="gender"]:checked').value
    var smoke = parseInt($('calc-smoke').value) || 0
    var alcohol = parseInt($('calc-alcohol').value) || 0
    var video = parseInt($('calc-video').value) || 0

    var p = {age:age, gender:gender, smoke:smoke, alcohol:alcohol, video:video}
    XS.saveProfile(p)

    renderResults(p)
    renderStep(1)
  })

  // Step 1 → 2: hope
  $('btn-to-hope') && $('btn-to-hope').addEventListener('click', function(){
    renderStep(2)
  })

  // Step 2 → 3: commitment
  $('btn-to-vow') && $('btn-to-vow').addEventListener('click', function(){
    renderStep(3)
  })

  // Step 3 → 4: save vow + dashboard
  $('btn-save-vow') && $('btn-save-vow').addEventListener('click', function(){
    var name = ($('vow-name').value || '').trim()
    var text = ($('vow-text').value || '').trim() || '我选择健康'
    XS.saveVow(name, text)
    renderCertificate(name, text)
    renderStep(4)
    setTimeout(function(){ showPage('page-dashboard'); renderDashboard() }, 2000)
  })

  // skip to dashboard
  $('btn-skip-vow') && $('btn-skip-vow').addEventListener('click', function(){
    XS.saveVow('','我选择健康')
    XS.setStep(4)
    renderDashboard()
    showPage('page-dashboard')
  })

  // ─── Step 1: Results (Loss Frame) ───────────────
  function renderResults(p){
    var lc = XS.lossCalc(p)
    if(!lc) return

    // body age
    $('r-bodyage').textContent = lc.bodyAge + '岁'
    $('r-agegap').textContent = (lc.ageGap>0?'比实际大':'比实际小')+Math.abs(lc.ageGap)+'岁'

    // years lost
    $('r-yearslost').textContent = lc.yearsLost + '年'

    // money
    $('r-money').textContent = '¥' + lc.moneyLost.toLocaleString()
    $('r-moneyitem').textContent = lc.moneyMapped.icon + ' ' + lc.moneyMapped.item

    // video
    $('r-videodays').textContent = lc.videoDays + '天'
    $('r-videohours').textContent = lc.videoHoursYear.toLocaleString() + '小时'

    // health risks
    $('r-cancer').textContent = lc.cancerRisk
    $('r-heart').textContent = lc.heartRisk

    // family impact
    $('r-wedding').textContent = lc.missWedding
    $('r-grandchild').textContent = lc.missGrandchild

    // trigger the "money burning" animation
    startBurnCounter(p)

    // alcohol warning
    if(p.alcohol >= 5){
      $('alcohol-warn') && ($('alcohol-warn').style.display='block')
    }
  }

  // ─── Money Burn Counter (Real-time) ─────────────
  var burnInterval = null
  function startBurnCounter(p){
    if(burnInterval) clearInterval(burnInterval)
    var ratePerMin = ((p.smoke||0)*0.5 + (p.alcohol||0)*10) / (365*24*60)
    var total = 0
    // start from today's "already burned" amount
    var today = new Date()
    var hoursToday = today.getHours() + today.getMinutes()/60
    total = ratePerMin * 60 * hoursToday

    var el = $('burn-counter')
    if(!el) return
    burnInterval = setInterval(function(){
      total += ratePerMin
      el.textContent = '¥' + total.toFixed(2)
      // animate
      el.style.transform = 'scale(1.1)'
      setTimeout(function(){ el.style.transform = 'scale(1)' }, 150)
    }, 1000)
  }

  // ─── Step 2: Hope (Recovery Timeline) ───────────
  // static content rendered in HTML

  // ─── Step 3: Commitment (Vow) ──────────────────
  function renderCertificate(name, text){
    $('cert-name').textContent = name || '我'
    $('cert-text').textContent = text
    $('cert-date').textContent = new Date().toLocaleDateString('zh-CN', {
      year:'numeric', month:'long', day:'numeric'
    })
  }

  // ─── Step 4: Dashboard ─────────────────────────
  function renderDashboard(){
    var profile = XS.getProfile()
    renderMissions()
    renderCheckinState()
    renderStreaks()
    renderSavings()
    renderIdentity()
    renderFamily()
    renderFireBelt()
  }

  function renderCheckinState(){
    var t = XS.todayCheckin()
    var items = document.querySelectorAll('.checkin-item')
    for(var i=0;i<items.length;i++){
      var cb = items[i].querySelector('input[type="checkbox"]')
      if(cb){
        var behavior = items[i].dataset.behavior
        cb.checked = t ? !!t[behavior] : false
      }
    }
  }

  $('btn-checkin') && $('btn-checkin').addEventListener('click', function(){
    var t = XS.todayCheckin()
    if(t){ XS.showToast('今天已记录'); return }

    var entry = {}
    var items = document.querySelectorAll('.checkin-item')
    for(var i=0;i<items.length;i++){
      var cb = items[i].querySelector('input[type="checkbox"]')
      if(cb) entry[items[i].dataset.behavior] = cb.checked
    }

    if(!entry.smoke && !entry.alcohol && !entry.video && !entry.alt){
      // check if at least one is true
      var any = false
      for(var k in entry){ if(entry[k]){ any=true; break } }
      if(!any){ XS.showToast('至少选一项 ☝️'); return }
    }

    XS.addCheckin(entry)
    XS.showToast('✅ 今日记录完成！')

    // check mission
    var m = XS.dailyMission()
    if(m && !m.done && entry.alt){
      XS.completeMission(m.id)
      XS.showToast('🎯 今日使命完成！')
    }
    renderDashboard()
  })

  function renderMissions(){
    var m = XS.dailyMission()
    if(m){
      $('mission-text').textContent = m.desc
      $('mission-badge').textContent = m.done ? '✅ 已完成' : '⏳ 未完成'
      $('mission-badge').className = 'badge ' + (m.done ? 'badge-done' : 'badge-pending')
    }
    $('mission-count').textContent = '已完成 ' + (XS.load().missionsCompleted||0) + ' 个使命'
  }

  function renderStreaks(){
    $('s-smoke').textContent = XS.streak('smoke')
    $('s-alcohol').textContent = XS.streak('alcohol')
    $('s-video').textContent = XS.streak('video')
  }

  function renderSavings(){
    var s = XS.savings()
    $('sv-money').textContent = '¥' + s.money.toLocaleString()
    $('sv-time').textContent = s.time + '小时'
    $('sv-days').textContent = s.days + '天'
  }

  function renderIdentity(){
    var maxS = Math.max(XS.streak('smoke'), XS.streak('alcohol'), XS.streak('video'))
    var id = XS.identity(maxS)
    if(id.level>0){
      $('identity-section').classList.remove('hidden')
      $('identity-text').textContent = id.text
      $('identity-level').textContent = 'Lv.' + id.level
    } else {
      $('identity-section').classList.add('hidden')
    }
  }

  function renderFamily(){
    var msgs = XS.getFamily()
    var el = $('family-list')
    if(!msgs.length){
      el.innerHTML = '<p class="empty">还没有家人寄语</p>'
    } else {
      var html = ''
      for(var i=0;i<msgs.length;i++){
        html += '<div class="msg"><span class="msg-text">'+esc(msgs[i].text)+'</span><span class="msg-author">— '+esc(msgs[i].author)+'</span></div>'
      }
      el.innerHTML = html
    }
  }

  $('btn-family-add') && $('btn-family-add').addEventListener('click', function(){
    var text = ($('family-input').value||'').trim()
    var author = ($('family-author').value||'').trim() || '家人'
    if(!text){ XS.showToast('写一段话吧'); return }
    XS.addFamily(text, author)
    $('family-input').value = ''
    $('family-author').value = ''
    XS.showToast('❤️ 寄语已保存')
    renderFamily()
  })

  // Fire belt — the "don't break the chain" visual
  function renderFireBelt(){
    var o = XS.load()
    var days = 14
    var html = ''
    for(var i=days-1;i>=0;i--){
      var d = new Date()
      d.setDate(d.getDate()-i)
      var ds = d.toISOString().split('T')[0]
      var found = o.checkins.some(function(c){ return c.date===ds && (c.smoke||c.alcohol||c.video||c.alt) })
      var cls = found ? 'fire lit' : 'fire'
      html += '<div class="'+cls+'"></div>'
    }
    var el = $('fire-belt')
    if(el) el.innerHTML = html
  }

  // ─── Craving Rescue ─────────────────────────────
  function setupCravingModal(){
    $('btn-craving') && $('btn-craving').addEventListener('click', function(){
      $('craving-modal').classList.remove('hidden')
      // start breathing guide
      startBreathing()
    })

    $('btn-craving-close') && $('btn-craving-close').addEventListener('click', function(){
      $('craving-modal').classList.add('hidden')
    })

    // craving behavior selection
    var btns = document.querySelectorAll('.craving-behavior-btn')
    for(var i=0;i<btns.length;i++){
      btns[i].addEventListener('click', function(){
        var behavior = this.dataset.behavior
        XS.logCraving(behavior, true)
        XS.showToast('💪 你战胜了一次冲动！')
        // show alternative suggestion
        var alternatives = {
          smoke:'嚼口香糖、深呼吸1分钟、出去走走',
          alcohol:'喝杯茶、喝气泡水、说"医生不让喝了"',
          video:'做10个深蹲、闭眼休息、给家人打电话'
        }
        $('craving-alt').textContent = '试试：' + (alternatives[behavior]||'深呼吸1分钟')
        $('craving-alt').classList.remove('hidden')
      })
    }
  }

  function startBreathing(){
    var el = $('breathing-circle')
    if(!el) return
    var phrases = ['吸气...', '屏气...', '呼气...']
    var i = 0
    el.textContent = phrases[0]
    el.className = 'breathing-circle inhale'
    setInterval(function(){
      i = (i+1)%3
      el.textContent = phrases[i]
      el.className = 'breathing-circle ' + (i===0?'inhale':i===1?'hold':'exhale')
    }, 3000)
  }

  // ─── Navigation ─────────────────────────────────
  function setupNav(){
    document.querySelectorAll('.nav-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var target = this.dataset.page
        showPage(target)
        if(target==='page-dashboard') renderDashboard()
      })
    })
  }

  function showPage(id){
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active') })
    var el = $(id)
    if(el) el.classList.add('active')

    document.querySelectorAll('.nav-btn').forEach(function(b){ b.classList.remove('active') })
    var nb = document.querySelector('.nav-btn[data-page="'+id+'"]')
    if(nb) nb.classList.add('active')
  }

  // ─── Utils ──────────────────────────────────────
  function esc(s){ return (s||'').replace(/[<>&]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c]}) }

  document.addEventListener('DOMContentLoaded', init)
})()
