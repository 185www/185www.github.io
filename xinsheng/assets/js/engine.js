;(function(){
var $=function(id){return document.getElementById(id)}

var nodes=[]    // flat array of current session nodes
var nodeMap={}  // id → node lookup

function init(){
  var state=XS.getState()
  if(state.completed){showDashboard();return}

  var chat=$('chat-messages')
  if(chat&&!chat.children.length){
    var h=document.createElement('div')
    h.className='msg coach hint'
    h.innerHTML='<p style="color:#8a8f9a;font-size:.85rem;text-align:center">— 点击下方按钮开始对话 —</p>'
    chat.appendChild(h)
  }

  var day=XS.getDay()
  var sd
  if(day===0) sd={nodes:PROTO.S0}
  else if(day===1) sd={nodes:PROTO.S1}
  else if(day===2) sd={nodes:PROTO.S2}
  else sd={nodes:PROTO.getDaily(day)}

  nodes=sd.nodes||[]
  nodeMap={}
  for(var i=0;i<nodes.length;i++){
    if(nodes[i]&&nodes[i].id) nodeMap[nodes[i].id]=nodes[i]
  }

  var resumeId=XS.getState().currentNodeId
  var startNode=resumeId&&nodeMap[resumeId]?nodeMap[resumeId]:nodes[0]
  if(startNode) showNode(startNode)
}

function showNode(node){
  if(!node) return
  XS.setSessionState(XS.getState().currentSession||'onboarding',node.id)

  var chat=$('chat-messages')
  // remove hint
  var hint=chat&&chat.querySelector('.hint')
  if(hint) hint.remove()

  // typing dots
  var dots=document.createElement('div')
  dots.className='typing-indicator'
  dots.innerHTML='<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>'
  if(chat) chat.appendChild(dots)
  if(chat) chat.scrollTop=chat.scrollHeight

  var delay=Math.max(600,Math.min(2500,(node.coach||'').length*25))

  setTimeout(function(){
    if(dots.parentNode) dots.remove()
    // coach message
    var m=document.createElement('div')
    m.className='msg coach'
    var parts=(node.coach||'').split('\n\n')
    var html=''
    for(var i=0;i<parts.length;i++){
      html+='<p>'+parts[i].replace(/\n/g,'<br>')+'</p>'
    }
    m.innerHTML=html
    if(chat) chat.appendChild(m)
    if(chat) chat.scrollTop=chat.scrollHeight

    // options
    setTimeout(function(){
      if(node.options&&node.options.length){
        showOptions(node.options)
      }else{
        showEnd()
      }
    },400)
  },delay)
}

function showOptions(opts){
  var chat=$('chat-messages')
  if(!chat) return
  var c=document.createElement('div')
  c.className='options-container'
  for(var i=0;i<opts.length;i++){
    (function(opt){
      var b=document.createElement('button')
      b.className='option-btn'
      b.textContent=opt.text
      b.onclick=function(){
        // disable all buttons
        var btns=c.querySelectorAll('.option-btn')
        for(var j=0;j<btns.length;j++){btns[j].disabled=true;btns[j].style.opacity='0.4'}
        // user msg
        var u=document.createElement('div')
        u.className='msg user'
        u.textContent=opt.text
        chat.appendChild(u)
        chat.scrollTop=chat.scrollHeight
        // effect
        if(opt.effect) try{opt.effect()}catch(e){}
        // next
        var next=opt.next&&nodeMap[opt.next]?nodeMap[opt.next]:null
        if(next){
          setTimeout(function(){showNode(next)},600)
        }else{
          setTimeout(showEnd,600)
        }
      }
      c.appendChild(b)
    })(opts[i])
  }
  chat.appendChild(c)
  chat.scrollTop=chat.scrollHeight
}

function showEnd(){
  var chat=$('chat-messages')
  if(!chat) return
  var m=document.createElement('div')
  m.className='msg coach'
  m.innerHTML='<p style="color:#ffd93d;text-align:center;font-weight:500">🔔 今天就到这里。我明天再来找你。</p>'
  chat.appendChild(m)

  var b=document.createElement('button')
  b.className='btn-primary btn-lg'
  b.textContent='📊 查看进度'
  b.style.margin='1rem .8rem'
  b.onclick=showDashboard
  chat.appendChild(b)
  chat.scrollTop=chat.scrollHeight
}

function showDashboard(){
  $('page-chat')&&$('page-chat').classList.remove('active')
  $('page-dashboard')&&$('page-dashboard').classList.add('active')

  var state=XS.getState()
  var day=XS.getDay()
  $('d-day')&&($('d-day').textContent='第 '+(day+1)+' 天')

  var sc=0;for(var i=0;i<state.checkins.length;i++){if(state.checkins[i].success)sc++}
  $('d-streak')&&($('d-streak').textContent=sc)

  var trigs=state.triggers||[]
  $('d-triggers-count')&&($('d-triggers-count').textContent=trigs.length+' 个')

  var fm={smoke:'🚬烟',alcohol:'🍺酒',video:'📱手机',all:'全部'}
  $('d-focus-display')&&($('d-focus-display').textContent=state.focus?fm[state.focus]||state.focus:'—')

  var id=state.identityLevel||0
  var idt=['','我是在乎自己的人','我是对家人负责的人','我是掌控自己人生的人']
  var idb=['','🟢 Lv.1','🟡 Lv.2','🔴 Lv.3']
  if(id>0&&$('d-identity')){
    $('d-identity').style.display='block'
    $('d-identity-text')&&($('d-identity-text').textContent=idb[id]+' '+idt[id])
  }else if($('d-identity')){
    $('d-identity').style.display='none'
  }

  var pct=Math.round((day/21)*100)
  $('d-progress-bar')&&($('d-progress-bar').style.width=Math.min(pct,100)+'%')
  $('d-progress-text')&&($('d-progress-text').textContent=day+' / 21 天')

  if(trigs.length&&$('d-triggers')){
    $('d-triggers').style.display='block'
    $('d-triggers').innerHTML='已识别触发场景：<strong>'+trigs.join('、')+'</strong>'
  }else if($('d-triggers')){
    $('d-triggers').style.display='none'
  }

  if(state.focus&&$('d-focus')){
    $('d-focus').style.display='block'
    $('d-focus').innerHTML='当前专注：<strong>'+(fm[state.focus]||state.focus)+'</strong>'
  }else if($('d-focus')){
    $('d-focus').style.display='none'
  }

  if(day<=21){
    $('d-session-btn')&&($('d-session-btn').textContent='📋 第 '+(day+1)+' 天会话')
  }else{
    $('d-session-btn')&&($('d-session-btn').textContent='🎉 重新开始')
  }
}

// ─── Init ─────────────────────
document.addEventListener('DOMContentLoaded',function(){
  $('d-session-btn')&&($('d-session-btn').onclick=function(){
    $('page-dashboard')&&$('page-dashboard').classList.remove('active')
    $('page-chat')&&$('page-chat').classList.add('active')
    $('chat-messages')&&($('chat-messages').innerHTML='')
    init()
  })

  $('d-reset-btn')&&($('d-reset-btn').onclick=function(){
    if(confirm('确定要重新开始吗？所有进度将清空。')){
      XS.reset()
      $('chat-messages')&&($('chat-messages').innerHTML='')
      init()
    }
  })

  // nav
  var navs=document.querySelectorAll('.nav-btn')
  for(var i=0;i<navs.length;i++){
    navs[i].onclick=function(){
      var t=this.dataset.page
      var pages=document.querySelectorAll('.page')
      for(var j=0;j<pages.length;j++)pages[j].classList.remove('active')
      var p=$(t)
      if(p)p.classList.add('active')
      var btns=document.querySelectorAll('.nav-btn')
      for(var j=0;j<btns.length;j++)btns[j].classList.remove('active')
      this.classList.add('active')
      if(t==='page-dashboard') showDashboard()
    }
  }

  // force chat visible first
  $('page-chat')&&$('page-chat').classList.add('active')
  $('page-dashboard')&&$('page-dashboard').classList.remove('active')

  init()
})

window.XEngine={init:init}
})()
