;(function(){
  var K = 'xsheng_v3'

  function fresh(){
    return {
      startDate: null,
      day: 0,
      currentSession: 'onboarding',
      currentNodeId: null,
      completed: false,
      protocolComplete: false,
      sessionsCompleted: [],
      values: null,
      readiness: null,
      triggers: [],
      alt: null,
      coping: null,
      focus: null,
      checkins: [],
      identityLevel: 0,
      createdAt: null
    }
  }

  function load(){
    try{
      var r = localStorage.getItem(K)
      if(r){ var o = JSON.parse(r); if(o&&typeof o==='object') return o }
    }catch(e){}
    var f = fresh()
    f.createdAt = Date.now()
    return f
  }

  function save(o){ try{ localStorage.setItem(K,JSON.stringify(o)) }catch(e){} }

  function getState(){ return load() }

  function getDay(){
    var o = load()
    if(!o.startDate){
      o.startDate = Date.now()
      o.day = 0
      save(o)
      return 0
    }
    var elapsed = Math.floor((Date.now() - o.startDate) / (86400000))
    var day = Math.min(elapsed, 21)
    if(day !== o.day){
      o.day = day
      save(o)
    }
    return day
  }

  function setSessionState(session, nodeId){
    var o = load()
    o.currentSession = session
    o.currentNodeId = nodeId
    save(o)
  }

  function completeSession(sessionId){
    var o = load()
    if(o.sessionsCompleted.indexOf(sessionId) < 0){
      o.sessionsCompleted.push(sessionId)
    }
    save(o)
  }

  function completeProtocol(){
    var o = load()
    o.protocolComplete = true
    o.completed = true
    save(o)
  }

  function scheduleNext(){
    var o = load()
    // Move to next session type based on completed count
    var completed = o.sessionsCompleted.length
    if(completed <= 0) o.currentSession = 'onboarding'
    else if(completed <= 1) o.currentSession = 'cues'
    else if(completed <= 2) o.currentSession = 'planning'
    else o.currentSession = 'daily'
    o.currentNodeId = null
    save(o)
  }

  function setValue(v){
    var o = load(); o.values = v; save(o)
  }
  function setReadiness(r){
    var o = load(); o.readiness = r; save(o)
  }
  function addTrigger(t){
    var o = load()
    if(o.triggers.indexOf(t) < 0) o.triggers.push(t)
    save(o)
  }
  function setAlt(a){
    var o = load(); o.alt = a; save(o)
  }
  function setCoping(c){
    var o = load(); o.coping = c; save(o)
  }
  function setFocus(f){
    var o = load(); o.focus = f; save(o)
  }
  function addCheckin(entry){
    var o = load()
    o.checkins.push(entry)
    save(o)
  }
  function unlockIdentity(level){
    var o = load()
    if(level > (o.identityLevel||0)) o.identityLevel = level
    save(o)
  }

  function reset(){
    var f = fresh()
    f.createdAt = Date.now()
    save(f)
    return f
  }

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
    getState:getState, getDay:getDay,
    setSessionState:setSessionState,
    completeSession:completeSession,
    completeProtocol:completeProtocol,
    scheduleNext:scheduleNext,
    setValue:setValue, setReadiness:setReadiness,
    addTrigger:addTrigger, setAlt:setAlt,
    setCoping:setCoping, setFocus:setFocus,
    addCheckin:addCheckin,
    unlockIdentity:unlockIdentity,
    reset:reset,
    showToast:showToast
  }
})()
