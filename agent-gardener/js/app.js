(function() {
  'use strict';

  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));

  const EMOJIS = ['🤖','🔍','✍️','📊','🎨','🧪','📝','🔧','🚀','💡','📈','🎯','🛠️','📋','⚡','🧠','🎭','🎪','🎬','📸','🎵','🎮','🌐','📱'];
  const STATUS_LABELS = { pending:'待办', running:'进行中', review:'待检验', reviewed:'已检验', cancelled:'已取消' };
  const STATUS_ICONS = { pending:'⏳', running:'🔄', review:'🔔', reviewed:'✅', cancelled:'❌' };
  const STATUS_FLOW = ['pending','running','review','reviewed'];
  const STATUS_FLOW_ZH = ['待办','进行中','待检验','已检验'];

  let view = 'dashboard';
  let agentId = null;
  let schedDate = Store.todayStr();
  let cdi = null; // countdown interval
  let autoTimer = null;

  const vc = $('#view-container');
  const mo = $('#modal-overlay');
  const md = $('#modal');
  const fb = $('#fab');
  const tt = $('#theme-toggle');
  const ht = $('.header-title');
  const navItems = () => $$('.nav-item');

  // ==== NAVIGATION ====
  function nav(v, d) {
    if(v === 'dashboard') { view='dashboard'; agentId=null; window.location.hash='#dashboard'; }
    else if(v === 'waiting') { view='waiting'; agentId=null; window.location.hash='#waiting'; }
    else if(v === 'schedule') { view='schedule'; agentId=null; window.location.hash='#schedule'; }
    render();
  }

  function onHash() {
    const h = window.location.hash.slice(1) || 'dashboard';
    if(h==='dashboard') { view='dashboard'; agentId=null; }
    else if(h==='waiting') { view='waiting'; agentId=null; }
    else if(h==='schedule') { view='schedule'; agentId=null; }
    else { view='dashboard'; agentId=null; window.location.hash='#dashboard'; }
    render();
  }

  // ==== RENDER ====
  function render() {
    navItems().forEach(el => el.classList.toggle('active', el.dataset.view === view));
    updateFab(); updateHeader();
    vc.style.animation='none'; void vc.offsetHeight; vc.style.animation='';
    window.scrollTo({top:0,behavior:'smooth'});
    if(view==='dashboard') renderDash();
    else if(view==='waiting') renderWait();
    else if(view==='schedule') renderSched();
  }

  function updateFab() {
    if(view==='dashboard'||view==='waiting') { fb.style.display='flex'; fb.innerHTML='<span>+</span>'; }
    else { fb.style.display='none'; }
  }

  function updateHeader() {
    if(view==='dashboard') ht.textContent='🌱 Agent Garden';
    else if(view==='waiting') ht.textContent='⏳ 等待中';
    else if(view==='schedule') ht.textContent='📅 日程';
  }

  // ==== DASHBOARD ====
  function renderDash() {
    const agents = Store.getAgents();
    const nr = Store.needsReview();
    const nrc = nr.length;
    const nx = Store.nextCheckin();
    const gc = Store.taskCounts();

    if(!agents.length) {
      vc.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🌱</div><h2>你的花园还是空的</h2><p>添加第一个 Agent，开始管理你的 AI 工作流。<br>"其莳也若子，其置也若弃"</p><button class="btn btn-primary" id="add-first">添加第一个 Agent</button></div>`;
      $('#add-first').addEventListener('click', showAddAgent);
      return;
    }

    let h = '';

    // Checkin alert or countdown
    if(nrc > 0) {
      h += `<div class="banner alert"><div class="banner-icon">🔔</div><div class="banner-body"><div class="banner-title">${nrc} 个任务待检验</div><div class="banner-desc">Agent 已完成工作，等待你的检查</div></div><button class="btn btn-sm btn-primary" id="chk-btn">立即检验</button></div>`;
    } else if(nx) {
      h += `<div class="banner countdown"><div class="banner-icon">⏰</div><div class="banner-body"><div class="banner-title">下次检验</div><div class="banner-time" id="cd-text"></div></div><div class="banner-time-label">${nx.time}</div></div>`;
    }

    // Stats
    h += `<div class="stats"><span class="s"><span class="sd pending"></span>${gc.pending} 待办</span><span class="s"><span class="sd running"></span>${gc.running} 进行中</span><span class="s ${nrc?'hl':''}"><span class="sd review"></span>${gc.review} 待检验</span><span class="s"><span class="sd reviewed"></span>${gc.reviewed} 已检验</span></div>`;

    // Agent cards
    h += `<div class="grid">`;
    agents.forEach(a => {
      const c = Store.taskCounts(a.id);
      h += `<div class="card" data-id="${a.id}"><div class="card-hd"><div class="card-em">${a.emoji}</div><div class="card-info"><div class="card-nm">${esc(a.name)}</div><div class="card-desc">${esc(a.description||'')}</div></div></div><div class="card-st"><span class="s"><span class="sd pending"></span>${c.pending}</span><span class="s"><span class="sd running"></span>${c.running}</span>${c.review?`<span class="s hl"><span class="sd review"></span>${c.review}</span>`:''}<span class="s"><span class="sd reviewed"></span>${c.reviewed}</span></div></div>`;
    });
    h += `</div>`;

    // Needs review section
    if(nr.length) {
      h += `<div class="sec-hd"><span class="sec-tl">📋 待检验</span><button class="btn btn-sm btn-primary" id="batch-chk">批量检验</button></div><div class="rl">`;
      nr.forEach(t => {
        const ag = Store.getAgent(t.agentId);
        h += `<div class="ri" data-id="${t.id}"><div class="ri-cb" data-act="review">✓</div><div class="ri-bd"><div class="ri-tl">${esc(t.title)}</div><div class="ri-meta">${ag?ag.emoji+' '+esc(ag.name):''} · 检验 ${t.checkinTime||''} · x${t.iterationCount||0}</div></div></div>`;
      });
      h += `</div>`;
    }

    vc.innerHTML = h;

    // Events
    $$('.card').forEach(el => el.addEventListener('click', () => showAgentDetail(el.dataset.id)));
    const cb = $('#chk-btn'); if(cb) cb.addEventListener('click', showCheckin);
    const bb = $('#batch-chk'); if(bb) bb.addEventListener('click', showCheckin);
    vc.querySelectorAll('.ri-cb').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const tid = el.closest('.ri').dataset.id;
        Store.updTask(tid, {status:'reviewed'});
        render(); toast('✅ 已检验');
      });
    });
    vc.querySelectorAll('.ri').forEach(el => {
      el.addEventListener('click', e => {
        if(e.target.closest('.ri-cb')) return;
        showTaskDetail(el.dataset.id);
      });
    });

    // Countdown
    if(nx && nrc === 0) startCD(nx);
  }

  // ==== WAITING VIEW ====
  function renderWait() {
    const tasks = Store.getTasks();
    const agents = Store.getAgents();
    const am = {}; agents.forEach(a => { am[a.id]=a; });

    // Group by status
    const groups = { pending:'待启动', running:'进行中', review:'待检验', reviewed:'本次已完成' };
    let h = '';
    let any = false;

    ['pending','running','review','reviewed'].forEach(s => {
      const ts = tasks.filter(t => t.status === s);
      if(!ts.length) return;
      any = true;
      h += `<div class="sec-hd"><span class="sec-tl">${STATUS_ICONS[s]} ${groups[s]}</span><span class="sec-count">${ts.length}</span></div><div class="task-list">`;
      ts.forEach(t => {
        const ag = am[t.agentId];
        h += `<div class="ti ${s}" data-id="${t.id}"><div class="tc" data-act="advance">${s==='reviewed'?'✓':''}</div><div class="tb"><div class="tt">${esc(t.title)}</div><div class="tm"><span>${ag?ag.emoji+' '+esc(ag.name):''}</span><span> · 🕐${t.scheduledTime||''}</span>${t.checkinTime?`<span> · 🔔${t.checkinTime}</span>`:''}</div>${t.iterationCount>1?`<div class="ti-iter">已迭代 ${t.iterationCount} 次</div>`:''}</div></div>`;
      });
      h += `</div>`;
    });

    if(!any) {
      vc.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🌿</div><h2>没有进行中的任务</h2><p>所有任务都已完成，享受宁静。</p></div>`;
      return;
    }

    vc.innerHTML = h;

    // Advance status
    vc.querySelectorAll('.tc').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const tid = el.closest('.ti').dataset.id;
        const t = Store.getTask(tid); if(!t) return;
        const idx = STATUS_FLOW.indexOf(t.status);
        const next = idx < 3 ? STATUS_FLOW[idx+1] : 'pending';
        Store.updTask(tid, {status: next});
        render();
        toast(next==='running'?'🔄 Agent 已开始':next==='review'?'🔔 等待检验':next==='reviewed'?'✅ 已检验':'⏳ 已重置');
      });
    });

    // Click to detail
    vc.querySelectorAll('.ti').forEach(el => {
      el.addEventListener('click', e => {
        if(e.target.closest('.tc')) return;
        showTaskDetail(el.dataset.id);
      });
    });
  }

  // ==== SCHEDULE ====
  function renderSched() {
    const dt = new Date(schedDate + 'T12:00:00');
    const td = Store.todayStr();
    const isTd = schedDate === td;
    const wd = ['日','一','二','三','四','五','六'][dt.getDay()];
    const lb = isTd ? '今天' : dt.toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'});

    let h = `<div class="sched-hd"><div class="sched-nav"><button id="pd">‹</button><span class="sched-lb">${lb} 周${wd}</span><button id="nd">›</button>${!isTd?`<button id="tdb" class="btn btn-sm btn-secondary" style="margin-left:8px;">今天</button>`:''}</div></div><div class="sched-legend"><span style="background:var(--primary)"></span>启动 <span style="background:var(--accent);margin-left:12px;"></span>检验</div><div class="sched-tl">`;

    const tasks = Store.getTasks({date: schedDate});
    const agents = Store.getAgents(); const am = {}; agents.forEach(a => { am[a.id]=a; });

    if(!tasks.length) {
      h += `<div class="empty-state" style="min-height:40vh"><div style="font-size:3rem;margin-bottom:var(--space-md);">🌿</div><p>今天没有安排</p></div>`;
    } else {
      const evts = [];
      tasks.forEach(t => {
        evts.push({task:t, time:t.scheduledTime, type:'start'});
        if(t.checkinTime) evts.push({task:t, time:t.checkinTime, type:'checkin'});
      });
      evts.sort((a,b) => (a.time||'00:00').localeCompare(b.time||'00:00'));

      const hrs = {};
      evts.forEach(ev => {
        const hh = parseInt((ev.time||'09').split(':')[0], 10);
        if(!hrs[hh]) hrs[hh] = []; hrs[hh].push(ev);
      });

      for(let hh=0; hh<24; hh++) {
        const sl = hrs[hh]; if(!sl||!sl.length) continue;
        h += `<div class="sh" data-h="${hh}"><div class="sh-lb">${hh===0?'00:00':Store.fmtTime(hh,0)}</div><div class="stl">`;
        sl.forEach(ev => {
          const t = ev.task; const isChk = ev.type === 'checkin'; const ag = am[t.agentId];
          h += `<div class="st ${isChk?'chk':''} ${t.status}" data-id="${t.id}"><span class="std" style="background:${isChk?'var(--accent)':'var(--primary)'}"></span><div class="stb"><div class="stt">${STATUS_ICONS[t.status]||''} ${esc(t.title)}</div><div class="sta">${ag?ag.emoji+' '+esc(ag.name):''}${isChk?'·检验':''}</div></div><span class="st-time">${isChk?'🔔':'🕐'}${ev.time}</span></div>`;
        });
        h += `</div></div>`;
      }
    }
    h += `</div>`;

    vc.innerHTML = h;

    const pdb = $('#pd'); const ndb = $('#nd'); const tdb = $('#tdb');
    if(pdb) pdb.addEventListener('click', () => { const d=new Date(schedDate+'T12:00:00'); d.setDate(d.getDate()-1); schedDate=Store.todayStr(d); renderSched(); });
    if(ndb) ndb.addEventListener('click', () => { const d=new Date(schedDate+'T12:00:00'); d.setDate(d.getDate()+1); schedDate=Store.todayStr(d); renderSched(); });
    if(tdb) tdb.addEventListener('click', () => { schedDate=Store.todayStr(); renderSched(); });

    vc.querySelectorAll('.st').forEach(el => el.addEventListener('click', () => { const tid=el.dataset.id; if(tid) showTaskDetail(tid); }));
  }

  // ==== AGENT DETAIL (inline modal) ====
  function showAgentDetail(id) {
    const ag = Store.getAgent(id);
    if(!ag) return;
    const c = Store.taskCounts(id);
    const tasks = Store.getTasks({agentId:id});

    openModal(`
      <div class="modal-title" style="font-size:1rem;">${ag.emoji} ${esc(ag.name)}</div>
      <p style="text-align:center;color:var(--text-secondary);font-size:0.82rem;margin-bottom:var(--space-md);">${esc(ag.description||'')}</p>
      <div class="stats" style="justify-content:center;margin-bottom:var(--space-md);">
        <span class="s"><span class="sd pending"></span>${c.pending}</span>
        <span class="s"><span class="sd running"></span>${c.running}</span>
        <span class="s"><span class="sd review"></span>${c.review}</span>
        <span class="s"><span class="sd reviewed"></span>${c.reviewed}</span>
      </div>
      <div class="task-list" style="max-height:40vh;overflow-y:auto;">${tasks.length?tasks.map(t => taskHTML(t)).join(''):'<p style="text-align:center;color:var(--text-tertiary);padding:var(--space-lg)">暂无任务</p>'}</div>
      <div class="modal-actions"><button class="btn btn-secondary" id="agent-close">关闭</button><button class="btn btn-primary" id="agent-add-task">+ 添加任务</button></div>
    `);

    $('#agent-close').addEventListener('click', closeModal);
    $('#agent-add-task').addEventListener('click', () => { closeModal(); showAddTask(id); });
    setupTaskEvents();
  }

  function taskHTML(t) {
    const iter = t.iterationCount>1?`<span class="iter">x${t.iterationCount}</span>`:'';
    return `<div class="ti ${t.status}" data-id="${t.id}"><div class="tc" data-act="advance">${t.status==='reviewed'?'✓':''}</div><div class="tb"><div class="tt">${esc(t.title)} ${iter}</div><div class="tm"><span>🕐${t.scheduledTime||''}</span>${t.checkinTime?`<span>🔔${t.checkinTime}</span>`:''}<span class="tsb ${t.status}">${STATUS_ICONS[t.status]} ${STATUS_LABELS[t.status]}</span></div></div></div>`;
  }

  function setupTaskEvents() {
    vc.querySelectorAll('.tc').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const tid = el.closest('.ti').dataset.id;
        const t = Store.getTask(tid); if(!t) return;
        const idx = STATUS_FLOW.indexOf(t.status);
        Store.updTask(tid, {status: idx<3?STATUS_FLOW[idx+1]:'pending'});
        showAgentDetail(t.agentId);
        toast('状态已更新');
      });
    });
    vc.querySelectorAll('.ti').forEach(el => {
      el.addEventListener('click', e => {
        if(e.target.closest('.tc')) return;
        closeModal();
        showTaskDetail(el.dataset.id);
      });
    });
  }

  // ==== CHECK-IN MODE ====
  function showCheckin() {
    const tasks = Store.needsReview();
    if(!tasks.length) { toast('没有待检验的任务'); return; }
    const agents = Store.getAgents(); const am = {}; agents.forEach(a => { am[a.id]=a; });

    let h = `<div class="modal-title">🔔 批量检验</div><p style="text-align:center;color:var(--text-secondary);font-size:0.85rem;margin-bottom:var(--space-md);">${tasks.length} 个任务已完成</p><div class="chk-list">`;
    tasks.forEach(t => {
      const ag = am[t.agentId];
      h += `<div class="chk-it" data-id="${t.id}"><div class="chk-hd"><span class="chk-em">${ag?ag.emoji:'🤖'}</span><div class="chk-bd"><div class="chk-tl">${esc(t.title)}</div><div class="chk-meta">${ag?esc(ag.name):''} · x${t.iterationCount||0}</div></div><button class="btn btn-sm btn-primary chk-ap">✓ 通过</button></div><div class="chk-nt"><input class="form-input chk-inp" type="text" placeholder="检验备注（可选）"></div>${t.iterationCount>=2?`<div class="dim">📊 已迭代 ${t.iterationCount} 次，收益递减阶段。${t.iterationCount>=4?'建议评估是否真需继续优化。':'请评估本次改进是否达到预期。'}</div>`:''}</div>`;
    });
    h += `</div><div class="modal-actions"><button class="btn btn-secondary" id="chk-later">稍后</button><button class="btn btn-primary" id="chk-all">全部通过</button></div>`;

    openModal(h);

    md.querySelectorAll('.chk-ap').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = btn.closest('.chk-it');
        const tid = it.dataset.id;
        const inp = it.querySelector('.chk-inp');
        const u = {status:'reviewed'};
        if(inp&&inp.value.trim()) u.notes=inp.value.trim();
        Store.updTask(tid, u);
        it.style.opacity='0.3'; btn.textContent='✓ 已检'; btn.disabled=true;
        toast('✅ 已通过');
      });
    });

    const allBtn = md.querySelector('#chk-all');
    if(allBtn) allBtn.addEventListener('click', () => {
      tasks.forEach(t => Store.updTask(t.id, {status:'reviewed'}));
      Store.addSession({taskIds:tasks.map(t=>t.id), note:'批量检验'});
      closeModal(); render();
      toast(`✅ ${tasks.length} 个已全部通过`);
    });

    const laterBtn = md.querySelector('#chk-later');
    if(laterBtn) laterBtn.addEventListener('click', () => { closeModal(); render(); });
  }

  // ==== MODALS ====
  function openModal(h) { md.classList.remove('hidden'); mo.classList.remove('hidden'); md.innerHTML = `<div class="modal-handle"></div>${h}`; }
  function closeModal() { md.classList.add('hidden'); mo.classList.add('hidden'); md.innerHTML = ''; }
  mo.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

  // Add Agent
  function showAddAgent() {
    const grid = EMOJIS.map(e => `<button class="eo" data-e="${e}">${e}</button>`).join('');
    openModal(`<div class="modal-title">🌱 种植新的 Agent</div><div class="fg"><label class="fl">图标</label><div class="eg">${grid}</div></div><div class="fg"><label class="fl" for="an">名称</label><input class="fi" id="an" placeholder="例如：代码审查官"></div><div class="fg"><label class="fl" for="ad">描述</label><input class="fi" id="ad" placeholder="这个 Agent 负责什么"></div><div class="modal-actions"><button class="btn btn-secondary" id="caa">取消</button><button class="btn btn-primary" id="coa">添加</button></div>`);

    let sel = EMOJIS[0];
    const btns = $$('.eo'); btns[0].classList.add('sel');
    btns.forEach(b => b.addEventListener('click', () => { btns.forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); sel=b.dataset.e; }));
    $('#caa').addEventListener('click', closeModal);
    $('#coa').addEventListener('click', () => {
      const n = $('#an').value.trim();
      if(!n) { $('#an').focus(); $('#an').style.borderColor='#ef4444'; return; }
      Store.addAgent({name:n, emoji:sel, description:$('#ad').value.trim()});
      closeModal(); render(); toast(`🌱「${n}」已添加`);
    });
    setTimeout(()=>$('#an').focus(),100);
  }

  // Add Task (with checkin time)
  function showAddTask(aid) {
    const ag = Store.getAgent(aid);
    const td = Store.todayStr();
    openModal(`<div class="modal-title">📋 添加任务</div>${ag?`<p style="text-align:center;color:var(--text-secondary);font-size:0.85rem;margin-bottom:var(--space-sm);">${ag.emoji} ${esc(ag.name)}</p>`:''}<div class="fg"><label class="fl" for="ttl">任务</label><input class="fi" id="ttl" placeholder="例如：审查 PR #42"></div><div class="fg"><label class="fl" for="tdesc">描述</label><textarea class="fi ft" id="tdesc" rows="2"></textarea></div><div class="form-card"><div class="fg"><label class="fl" style="color:var(--primary);">🤖 Agent 启动时间</label><div class="fr"><div class="fg"><input class="fi" id="sd" type="date" value="${td}"></div><div class="fg"><input class="fi" id="st" type="time" value="09:00"></div></div></div></div><div class="form-card accent"><div class="fg"><label class="fl" style="color:var(--accent);">🔔 你的检验时间</label><p style="font-size:0.72rem;color:var(--text-tertiary);margin-bottom:var(--space-sm);">设定你回来检查的时间，在此之前放心做其他事。</p><div class="fr"><div class="fg"><input class="fi" id="cd" type="date" value="${td}"></div><div class="fg"><input class="fi" id="ct" type="time" value="11:00"></div></div></div></div><div class="fg"><label class="fl" for="nn">备注</label><textarea class="fi ft" id="nn" rows="2"></textarea></div><div class="modal-actions"><button class="btn btn-secondary" id="cat">取消</button><button class="btn btn-primary" id="cot">添加</button></div>`);

    const st = $('#st'); const ct = $('#ct'); const sd = $('#sd'); const cdd = $('#cd');
    st.addEventListener('change', () => { const p = st.value.split(':'); ct.value = Store.fmtTime(Math.min(parseInt(p[0],10)+2,23), parseInt(p[1],10)); });
    sd.addEventListener('change', () => { cdd.value = sd.value; });

    $('#cat').addEventListener('click', closeModal);
    $('#cot').addEventListener('click', () => {
      const ttl = $('#ttl').value.trim(); if(!ttl) { $('#ttl').focus(); return; }
      Store.addTask({ agentId:aid, title:ttl, description:$('#tdesc').value.trim(), scheduledDate:sd.value, scheduledTime:st.value, checkinDate:cdd.value, checkinTime:ct.value, notes:$('#nn').value.trim() });
      closeModal(); render(); toast(`📋「${ttl}」已添加`);
    });
    setTimeout(()=>$('#ttl').focus(),100);
  }

  // Task Detail
  function showTaskDetail(tid) {
    const t = Store.getTask(tid); if(!t) return;
    const ag = Store.getAgent(t.agentId);
    const flow = ['pending','running','review','reviewed'];

    openModal(`<div class="modal-title" style="font-size:1rem;">${esc(t.title)}</div>
      <div style="text-align:center;margin-bottom:var(--space-md);"><span style="font-size:0.85rem;color:var(--text-secondary);">${ag?ag.emoji+' '+esc(ag.name):''}</span><span style="margin:0 6px;color:var(--text-tertiary);">·</span><span style="font-size:0.85rem;color:var(--text-secondary);">${t.scheduledDate||''} ${t.scheduledTime||''}</span></div>
      ${t.description?`<div class="detail-box">${esc(t.description)}</div>`:''}
      <div class="detail-info"><div class="detail-r"><span>🤖 启动</span><span>${t.scheduledDate||''} ${t.scheduledTime||''}</span></div><div class="detail-r hl"><span>🔔 检验</span><span>${t.checkinDate||''} ${t.checkinTime||''}</span></div><div class="detail-r"><span>🔄 迭代</span><span>${t.iterationCount||0} 次</span></div></div>
      ${t.iterationCount>=2?`<div class="dim" style="margin-bottom:var(--space-md);">📊 已迭代 ${t.iterationCount} 次，收益递减。</div>`:''}
      <div class="fg"><label class="fl">状态</label><div class="so">${flow.map(s => `<button class="sb ${t.status===s?'active':''}" data-s="${s}">${STATUS_ICONS[s]} ${STATUS_LABELS[s]}</button>`).join('')}${t.status!=='cancelled'?`<button class="sb" data-s="cancelled">❌ 取消</button>`:''}</div></div>
      ${t.notes?`<div class="detail-box" style="background:var(--surface-hover);margin-top:var(--space-md);">📝 ${esc(t.notes)}</div>`:''}
      <div class="modal-actions"><button class="btn btn-secondary" id="close-td">关闭</button></div>`);

    md.querySelectorAll('.sb').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.updTask(tid, {status:btn.dataset.s});
        closeModal(); render();
        toast(`${STATUS_ICONS[btn.dataset.s]} 已更新`);
      });
    });
    $('#close-td').addEventListener('click', closeModal);
  }

  // ==== AUTO CHECKIN ====
  function startAuto() {
    if(autoTimer) clearInterval(autoTimer);

    function check() {
      if(!md.classList.contains('hidden')) return;
      const dd = Store.dueCheckins();
      if(dd.length) {
        dd.forEach(t => Store.updTask(t.id, {status:'review'}));
        const cnt = Store.needsReview().length;
        if(cnt > 0) { sendNotif(); toast(`🔔 ${cnt} 个任务已到检验时间`); if(view==='dashboard') render(); }
      }
    }

    check();
    autoTimer = setInterval(check, 30000);
  }

  function sendNotif() {
    if(!('Notification' in window)) return;
    const cnt = Store.needsReview().length;
    if(!cnt) return;
    if(Notification.permission === 'granted') {
      new Notification('🔔 Agent Garden', {
        body: `${cnt} 个任务等待检验`,
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E🌱%3C/text%3E%3C/svg%3E',
        tag: 'agent-garden', silent: false
      });
    } else if(Notification.permission === 'default') { Notification.requestPermission(); }
  }

  function reqNotif() {
    if('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  }

  // ==== COUNTDOWN ====
  function startCD(nx) {
    if(cdi) clearInterval(cdi);
    function up() {
      const el = $('#cd-text'); if(!el) { if(cdi) clearInterval(cdi); return; }
      const now = new Date();
      const chk = new Date(nx.date + 'T' + (nx.time||'12:00'));
      const diff = chk - now;
      if(diff <= 0) { el.textContent = '已到检验时间'; if(cdi) clearInterval(cdi); return; }
      const h = Math.floor(diff/(1000*60*60));
      const m = Math.floor((diff%(1000*60*60))/(1000*60));
      el.textContent = h > 0 ? `还有 ${h}h ${m}min` : `还有 ${m} 分钟`;
    }
    up();
    cdi = setInterval(up, 30000);
  }

  // ==== TOAST ====
  function toast(msg) {
    const c = $('#toasts') || (()=>{const e=document.createElement('div'); e.id='toasts'; e.className='toasts'; document.body.appendChild(e); return e;})();
    const t = document.createElement('div'); t.className='toast'; t.textContent=msg;
    c.appendChild(t);
    setTimeout(()=>{t.style.opacity='0'; t.style.transform='translateY(-12px)'; t.style.transition='opacity 300ms,transform 300ms'; setTimeout(()=>t.remove(),300);}, 2500);
  }

  // ==== UTILS ====
  function esc(s) { if(!s) return ''; const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

  // ==== THEME ====
  function initTheme() {
    const s = Store.getSet(); const pd = window.matchMedia('(prefers-color-scheme:dark)').matches;
    const t = s.theme || (pd?'dark':'light');
    document.documentElement.setAttribute('data-theme', t);
    if(tt) tt.textContent = t==='dark'?'☀️':'🌙';
    const m = document.querySelector('meta[name="theme-color"]'); if(m) m.content = t==='dark'?'#0c0a09':'#2d6a4f';
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const nxt = cur==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme', nxt);
    Store.updSet({theme:nxt});
    if(tt) tt.textContent = nxt==='dark'?'☀️':'🌙';
    const m = document.querySelector('meta[name="theme-color"]'); if(m) m.content = nxt==='dark'?'#0c0a09':'#2d6a4f';
    toast(nxt==='dark'?'🌙 暗色模式':'☀️ 亮色模式');
  }

  // ==== INIT ====
  function init() {
    initTheme();
    if(!Store.hasData()) Store.loadDemo();

    window.addEventListener('hashchange', onHash);

    if(window.location.hash) { onHash(); }
    else { window.location.hash='#dashboard'; }

    if(tt) tt.addEventListener('click', toggleTheme);

    fb.addEventListener('click', () => {
      if(view==='dashboard') showAddAgent();
      else if(view==='waiting') showAddAgent();
    });

    if('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js').catch(()=>{}); }

    // Auto-checkin: on open
    const dd = Store.dueCheckins();
    if(dd.length) { dd.forEach(t => Store.updTask(t.id, {status:'review'})); }
    if(Store.needsReview().length > 0) { setTimeout(showCheckin, 600); }

    startAuto();
    reqNotif();

    // Refresh on visibility change (user returns to tab)
    document.addEventListener('visibilitychange', () => {
      if(!document.hidden) {
        const d2 = Store.dueCheckins();
        if(d2.length) { d2.forEach(t => Store.updTask(t.id, {status:'review'})); render(); }
      }
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
