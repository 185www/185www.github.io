;(function(){
  var $ = function(id){ return document.getElementById(id) }
  var q = function(s){ return document.querySelectorAll(s) }

  var currentSession = null
  var currentNode = null

  function init(){
    var state = XS.getState()
    if(state.completed){
      showDashboard()
      return
    }

    // Add hint for first-time users
    var chat = $('chat-messages')
    if(chat.children.length === 0){
      var hint = document.createElement('div')
      hint.className = 'msg coach hint'
      hint.innerHTML = '<p style="color:var(--dim);font-size:.85rem;text-align:center">👇 点下方的选项跟我对话</p>'
      chat.appendChild(hint)
    }

    var sessionType = state.currentSession || 'onboarding'
    var nodeId = state.currentNodeId || null
    startSession(sessionType, nodeId)
  }

  function startSession(type, resumeNodeId){
    currentSession = type
    var day = XS.getDay()
    var sessionData = XProtocol.getSessionForDay(day)
    var nodes = sessionData.nodes

    if(!nodes || !nodes.length){
      showDashboard()
      return
    }

    var startNode = null
    if(resumeNodeId){
      startNode = findNode(nodes, resumeNodeId)
    }
    if(!startNode){
      startNode = nodes[0]
    }

    renderNode(startNode, nodes)
  }

  function findNode(nodes, id){
    for(var i=0;i<nodes.length;i++){
      if(nodes[i].id === id) return nodes[i]
      // Also search inside options' next references
    }
    // Search all nodes recursively by scanning all reachable nodes
    var visited = {}
    function search(list){
      for(var i=0;i<list.length;i++){
        if(list[i].id === id) return list[i]
        if(visited[list[i].id]) continue
        visited[list[i].id] = true
        if(list[i].options){
          for(var j=0;j<list[i].options.length;j++){
            var next = list[i].options[j].next
            if(next){
              var found = search(findNodesByIds(nodes, [next]))
              if(found) return found
            }
          }
        }
      }
      return null
    }
    function findNodesByIds(nodes, ids){
      var result = []
      for(var i=0;i<nodes.length;i++){
        if(ids.indexOf(nodes[i].id) >= 0) result.push(nodes[i])
      }
      return result
    }
    return search(nodes)
  }

  // ─── Rendering ──────────────────────────────
  function renderNode(node, allNodes){
    if(!node) return
    currentNode = node

    // Save state
    XS.setSessionState(currentSession, node.id)

    var chat = $('chat-messages')
    if(!chat) return

    // Add coach message
    addCoachMessage(node.coach, function(){
      if(node.options && node.options.length){
        renderOptions(node.options, allNodes)
      } else {
        // No options = end of session
        renderEndOfSession()
      }
    })
  }

  function addCoachMessage(text, callback){
    var chat = $('chat-messages')

    // Remove hint if present
    var hint = chat.querySelector('.hint')
    if(hint) hint.remove()

    // Show typing indicator
    var typing = document.createElement('div')
    typing.className = 'typing-indicator'
    typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>'
    chat.appendChild(typing)
    chat.scrollTop = chat.scrollHeight

    // Calculate typing delay based on text length
    var delay = Math.max(800, Math.min(3000, text.length * 30))

    setTimeout(function(){
      // Remove typing indicator
      typing.remove()

      // Add message
      var msg = document.createElement('div')
      msg.className = 'msg coach'

      // Handle multi-paragraph text
      var paragraphs = text.split('\n\n')
      var html = ''
      for(var i=0;i<paragraphs.length;i++){
        var p = paragraphs[i].replace(/\n/g, '<br>')
        html += '<p>' + p + '</p>'
      }
      msg.innerHTML = html
      chat.appendChild(msg)
      chat.scrollTop = chat.scrollHeight

      if(callback) setTimeout(callback, 400)
    }, delay)
  }

  function renderOptions(options, allNodes){
    var chat = $('chat-messages')
    var container = document.createElement('div')
    container.className = 'options-container'

    for(var i=0;i<options.length;i++){
      (function(opt){
        var btn = document.createElement('button')
        btn.className = 'option-btn'
        btn.textContent = opt.text
        btn.addEventListener('click', function(){
          // Disable all buttons
          container.querySelectorAll('.option-btn').forEach(function(b){
            b.disabled = true
            b.style.opacity = '0.5'
          })

          // Show user's choice
          var userMsg = document.createElement('div')
          userMsg.className = 'msg user'
          userMsg.textContent = opt.text
          chat.appendChild(userMsg)
          chat.scrollTop = chat.scrollHeight

          // Execute side effect
          if(opt.effect) try{ opt.effect() }catch(e){}

          // Find next node
          if(opt.next){
            var nextNode = findNode(allNodes, opt.next)
            if(nextNode){
              setTimeout(function(){ renderNode(nextNode, allNodes) }, 600)
              return
            }
          }

          // No next node found
          renderEndOfSession()
        })
        container.appendChild(btn)
      })(options[i])
    }

    chat.appendChild(container)
    chat.scrollTop = chat.scrollHeight
  }

  function renderEndOfSession(){
    var chat = $('chat-messages')
    setTimeout(function(){
      var msg = document.createElement('div')
      msg.className = 'msg coach'
      msg.innerHTML = '<p class="session-end">🔔 这次就到这里。我明天再来找你。</p>'
      chat.appendChild(msg)
      chat.scrollTop = chat.scrollHeight

      // Show "回到首页" button
      var btn = document.createElement('button')
      btn.className = 'btn-primary btn-lg'
      btn.textContent = '回到首页'
      btn.style.margin = '1rem .8rem'
      btn.addEventListener('click', function(){
        showDashboard()
      })
      chat.appendChild(btn)
      chat.scrollTop = chat.scrollHeight
    }, 800)
  }

  // ─── Dashboard ──────────────────────────────
  function showDashboard(){
    $('page-chat').classList.remove('active')
    $('page-dashboard').classList.add('active')

    var state = XS.getState()
    var day = XS.getDay()

    // Day
    $('d-day').textContent = '第 ' + (day+1) + ' 天'

    // Success count
    var successCount = state.checkins.filter(function(c){return c.success}).length
    $('d-streak').textContent = successCount

    // Trigger count
    var triggers = state.triggers || []
    $('d-triggers-count').textContent = triggers.length + ' 个'

    // Focus
    var focusText = state.focus ? {smoke:'🚬烟',alcohol:'🍺酒',video:'📱手机',all:'全部'}[state.focus] || state.focus : '—'
    $('d-focus-display').textContent = focusText

    // Identity
    var id = state.identityLevel || 0
    var idTexts = ['', '我是在乎自己的人','我是对家人负责的人','我是掌控自己人生的人']
    var idBadges = ['','🟢 Lv.1','🟡 Lv.2','🔴 Lv.3']
    if(id>0){
      $('d-identity').style.display = 'block'
      $('d-identity-text').textContent = idBadges[id] + ' ' + idTexts[id]
    } else {
      $('d-identity').style.display = 'none'
    }

    // Protocol progress
    var totalDays = XProtocol.totalDays
    var pct = Math.round((day / totalDays) * 100)
    $('d-progress-bar').style.width = Math.min(pct, 100) + '%'
    $('d-progress-text').textContent = day + ' / ' + totalDays + ' 天'

    // Triggers detail
    if(triggers.length){
      $('d-triggers').style.display = 'block'
      $('d-triggers').innerHTML = '已识别触发场景：<strong>' + triggers.join('、') + '</strong>'
    } else {
      $('d-triggers').style.display = 'none'
    }

    // Focus detail
    if(state.focus){
      $('d-focus').style.display = 'block'
      $('d-focus').innerHTML = '当前专注：<strong>' + focusText + '</strong>'
    } else {
      $('d-focus').style.display = 'none'
    }

    // Session button
    if(day <= totalDays){
      $('d-session-btn').textContent = '📋 第 ' + (day+1) + ' 天会话'
    } else {
      $('d-session-btn').textContent = '🎉 重新开始'
    }
  }

  // ─── Init ────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function(){
    // Continue session from dashboard
    $('d-session-btn').addEventListener('click', function(){
      $('page-dashboard').classList.remove('active')
      $('page-chat').classList.add('active')
      var chat = $('chat-messages')
      chat.innerHTML = ''
      init()
    })

    // Reset
    $('d-reset-btn').addEventListener('click', function(){
      if(confirm('确定要重新开始吗？所有进度将清空。')){
        XS.reset()
        $('chat-messages').innerHTML = ''
        init()
      }
    })

    // Navigation
    q('.nav-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var target = this.dataset.page
        q('.page').forEach(function(p){ p.classList.remove('active') })
        $(target).classList.add('active')
        q('.nav-btn').forEach(function(b){ b.classList.remove('active') })
        this.classList.add('active')
        if(target === 'page-dashboard') showDashboard()
      })
    })

    // Start
    init()
  })

  // Export
  window.XEngine = { init:init }
})()
