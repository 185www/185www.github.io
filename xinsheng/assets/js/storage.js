;(function(){
  var K = 'xsheng_v2'

  function d(){
    return {
      profile: null,          // {age,gender,smoke,alcohol,video}
      vow: null,              // {name,text,date}
      checkins: [],           // [{date,smoke,alcohol,video,alt,missionId}]
      missions: [],           // [{id,date,desc,done}]
      triggers: [],           // [{situation,behavior,alt}]
      cravings: [],           // [{date,behavior,resisted}]
      family: [],             // [{text,author,date}]
      missionsCompleted: 0,
      currentStep: 0          // wizard step
    }
  }

  function load(){
    try{
      var r = localStorage.getItem(K)
      if(r){ var o = JSON.parse(r); if(o&&typeof o==='object') return o }
    }catch(e){}
    return d()
  }

  function save(o){ try{ localStorage.setItem(K,JSON.stringify(o)) }catch(e){} }

  // profile
  function saveProfile(p){
    var o = load(); o.profile = p; save(o); return o
  }
  function getProfile(){ return load().profile }

  // vow
  function saveVow(name,text){
    var o = load()
    o.vow = {name:text?name:'无名氏',text:text||'我选择健康',date:today()}
    save(o); return o
  }
  function getVow(){ return load().vow }

  // checkin
  function todayCheckin(){
    var o = load(), t = today()
    return o.checkins.find(function(c){ return c.date===t }) || null
  }
  function addCheckin(entry){
    var o = load()
    entry.date = today()
    o.checkins.push(entry)
    save(o); return o
  }

  // mission
  function dailyMission(){
    var o = load(), t = today()
    var m = o.missions.find(function(x){ return x.date===t })
    if(m) return m
    // generate new mission
    var missions = [
      {desc:'今天饭后散步5分钟',check:function(e){return e.alt}},
      {desc:'今天少抽3根烟',check:function(e){return e.smoke}},
      {desc:'今天用茶代替酒',check:function(e){return e.alt}},
      {desc:'今天刷手机不超过1小时',check:function(e){return e.video}},
      {desc:'今天给家人打一个电话',check:function(e){return e.alt}},
      {desc:'今天对劝酒说"开车来的"',check:function(e){return e.alt}},
      {desc:'今天做10次深呼吸代替抽烟',check:function(e){return e.alt}},
      {desc:'今天睡前不碰手机',check:function(e){return e.video}},
      {desc:'今天把烟钱放进一个罐子',check:function(e){return e.alt}},
      {desc:'今天走5000步',check:function(e){return e.alt}}
    ]
    var idx = (o.missionsCompleted || 0) % missions.length
    var nm = {id:Date.now(), date:t, desc:missions[idx].desc, done:false}
    o.missions.push(nm)
    save(o); return nm
  }
  function completeMission(id){
    var o = load()
    for(var i=0;i<o.missions.length;i++){
      if(o.missions[i].id===id){ o.missions[i].done=true; break }
    }
    o.missionsCompleted = (o.missionsCompleted||0) + 1
    save(o); return o
  }

  // streak
  function streak(behavior){
    var o = load()
    var entries = o.checkins.filter(function(c){ return c[behavior] })
    if(!entries.length) return 0
    entries.sort(function(a,b){ return b.date.localeCompare(a.date) })
    var s = 0, d = new Date()
    d = d.toISOString().split('T')[0]
    for(var i=0;i<entries.length;i++){
      var diff = dayDiff(d, entries[i].date)
      if(diff===0){ s++; d = prevDay(d) }
      else if(diff===1) break
      else break
    }
    return s
  }

  function today(){ return new Date().toISOString().split('T')[0] }
  function prevDay(d){
    var dt = new Date(d+'T00:00:00')
    dt.setDate(dt.getDate()-1)
    return dt.toISOString().split('T')[0]
  }
  function dayDiff(a,b){
    return Math.round((new Date(a+'T00:00') - new Date(b+'T00:00'))/(86400000))
  }

  // savings
  function savings(){
    var o = load(), p = o.profile
    if(!p) return {money:0,time:0,days:0}
    var days = o.checkins.length
    var sDays = o.checkins.filter(function(c){return c.smoke}).length
    var aDays = o.checkins.filter(function(c){return c.alcohol}).length
    var vDays = o.checkins.filter(function(c){return c.video}).length
    var mRate = (p.smoke||0)*0.5 + (p.alcohol||0)*10
    var tRate = (p.video||0)
    return {
      money: Math.round(mRate * days),
      time: Math.round(tRate * days),
      days: days
    }
  }

  // loss calculation
  function lossCalc(p){
    if(!p) return null
    var age = p.age||55, smoke = p.smoke||0, alcohol = p.alcohol||0, video = p.video||0
    var bodyAge = age + smoke*0.3 + alcohol*0.2 + (video>2?(video-2)*0.15:0)
    if(age>60) bodyAge+=2
    bodyAge = Math.round(bodyAge)

    var yearsLost = 0
    if(smoke>0) yearsLost += smoke * 0.15
    if(alcohol>0) yearsLost += alcohol * 0.12
    yearsLost = Math.round(yearsLost*10)/10

    var moneyLost = smoke * 0.5 * 365 * Math.max(1,age-20) + alcohol * 10 * 365 * Math.max(1,age-30)
    var videoHoursYear = video * 365

    var cancerRisk = smoke>0 ? '增加'+(smoke*3)+'倍' : '无明显增加'
    var heartRisk = smoke>0 ? '增加'+(smoke*2)+'倍' : '正常范围'

    // family impact
    var missWedding = smoke>10 ? '78%' : smoke>0 ? '35%' : '12%'
    var missGrandchild = alcohol>3 ? '65%' : '22%'

    return {
      bodyAge: bodyAge,
      ageGap: bodyAge - age,
      yearsLost: yearsLost,
      moneyLost: Math.round(moneyLost),
      moneyMapped: moneyMap(moneyLost),
      videoHoursYear: videoHoursYear,
      videoDays: Math.round(videoHoursYear/24),
      cancerRisk: cancerRisk,
      heartRisk: heartRisk,
      missWedding: missWedding,
      missGrandchild: missGrandchild
    }
  }

  function moneyMap(m){
    if(m>500000) return {item:'一套房子的首付',icon:'🏠'}
    if(m>200000) return {item:'一辆家用汽车',icon:'🚗'}
    if(m>100000) return {item:'一次环球旅行',icon:'✈️'}
    if(m>50000) return {item:'一台好车',icon:'🚗'}
    if(m>10000) return {item:'一部最新款手机',icon:'📱'}
    if(m>5000) return {item:'一台空调',icon:'❄️'}
    return {item:'一个月的菜钱',icon:'🥬'}
  }

  // identity
  function identity(maxDays){
    if(maxDays>=100) return {level:3,text:'我是掌控自己人生的人'}
    if(maxDays>=30) return {level:2,text:'我是对家人负责的人'}
    if(maxDays>=7) return {level:1,text:'我是在乎自己的人'}
    return {level:0,text:''}
  }

  // triggers
  function saveTriggers(arr){
    var o = load(); o.triggers = arr; save(o)
  }
  function getTriggers(){ return load().triggers }

  // craving log
  function logCraving(behavior,resisted){
    var o = load()
    o.cravings.push({date:today(),behavior:behavior,resisted:resisted})
    save(o)
  }

  // family
  function addFamily(text,author){
    var o = load()
    o.family.push({text:text,author:author||'家人',date:today()})
    save(o); return o
  }
  function getFamily(){ return load().family }

  // step
  function getStep(){ return load().currentStep }
  function setStep(s){
    var o = load(); o.currentStep = s; save(o)
  }

  // export
  function exportData(){ return JSON.stringify(load(),null,2) }

  function showToast(msg){
    var el = document.querySelector('.toast')
    if(el) el.remove()
    var d = document.createElement('div')
    d.className = 'toast'
    d.textContent = msg
    document.body.appendChild(d)
    setTimeout(function(){ d.remove() }, 2500)
  }

  window.XS = {
    load:load, save:save,
    saveProfile:saveProfile, getProfile:getProfile,
    saveVow:saveVow, getVow:getVow,
    todayCheckin:todayCheckin, addCheckin:addCheckin,
    dailyMission:dailyMission, completeMission:completeMission,
    streak:streak, savings:savings,
    lossCalc:lossCalc, identity:identity,
    saveTriggers:saveTriggers, getTriggers:getTriggers,
    logCraving:logCraving,
    addFamily:addFamily, getFamily:getFamily,
    getStep:getStep, setStep:setStep,
    exportData:exportData, showToast:showToast
  }
})()
