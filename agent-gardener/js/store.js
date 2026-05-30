const Store = (() => {
  const KEY = 'agent_garden_v3';

  const def = {
    agents: [],
    tasks: [],
    sessions: [],
    settings: { theme: 'light', notif: false }
  };

  let d = null;
  let subs = [];

  function load() {
    try {
      const r = localStorage.getItem(KEY);
      if (r) { d = JSON.parse(r); d.agents = d.agents || []; d.tasks = d.tasks || []; d.sessions = d.sessions || []; d.settings = Object.assign({}, def.settings, d.settings || {}); }
      else { d = JSON.parse(JSON.stringify(def)); }
    } catch { d = JSON.parse(JSON.stringify(def)); }
  }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
  function notify() { subs.forEach(f => f()); }
  function sub(f) { subs.push(f); return () => { subs = subs.filter(s => s !== f); }; }

  function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function todayStr(dd) { const t = dd || new Date(); return t.getFullYear() + '-' + String(t.getMonth()+1).padStart(2,'0') + '-' + String(t.getDate()).padStart(2,'0'); }
  function nowStr() { const t = new Date(); return todayStr(t) + 'T' + String(t.getHours()).padStart(2,'0') + ':' + String(t.getMinutes()).padStart(2,'0'); }
  function fmtTime(h,m) { return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0'); }
  function cmpTime(a,b) { if(!a) return 1; if(!b) return -1; return a.localeCompare(b); }

  // ==== AGENTS ====
  function getAgents() { return [...d.agents].sort((a,b) => (a.sortOrder||0)-(b.sortOrder||0)); }
  function getAgent(i) { return d.agents.find(a => a.id === i); }

  function addAgent(o) {
    const a = { id: id(), name: o.name.trim(), emoji: o.emoji||'🤖', description: (o.description||'').trim(), createdAt: Date.now(), sortOrder: d.agents.length };
    d.agents.push(a); save(); notify(); return a;
  }

  function updAgent(i, u) { const idx = d.agents.findIndex(a => a.id === i); if(idx===-1) return null; Object.assign(d.agents[idx], u); save(); notify(); return d.agents[idx]; }
  function delAgent(i) { d.agents = d.agents.filter(a => a.id !== i); d.tasks = d.tasks.filter(t => t.agentId !== i); save(); notify(); }

  // ==== TASKS ====
  const STATI = ['pending','running','review','reviewed','cancelled'];

  function getTasks(o = {}) {
    let t = [...d.tasks];
    if(o.agentId) t = t.filter(x => x.agentId === o.agentId);
    if(o.date) t = t.filter(x => x.scheduledDate === o.date);
    if(o.status) t = t.filter(x => x.status === o.status);
    if(o.statusIn) t = t.filter(x => o.statusIn.includes(x.status));
    t.sort((a,b) => { const c = cmpTime(a.scheduledTime, b.scheduledTime); if(c!==0) return c; return (b.createdAt||0)-(a.createdAt||0); });
    return t;
  }

  function getTask(i) { return d.tasks.find(t => t.id === i); }

  function addTask(o) {
    const now = todayStr();
    const startH = parseInt((o.scheduledTime||'09:00').split(':')[0], 10);
    const task = {
      id: id(), agentId: o.agentId, title: o.title.trim(), description: (o.description||'').trim(),
      scheduledDate: o.scheduledDate || now, scheduledTime: o.scheduledTime || '09:00',
      checkinDate: o.checkinDate || o.scheduledDate || now, checkinTime: o.checkinTime || fmtTime(Math.min(startH+2,23), 0),
      status: 'pending', iterationCount: 0, notes: (o.notes||'').trim(),
      createdAt: Date.now(), completedAt: null, reviewedAt: null
    };
    d.tasks.push(task); save(); notify(); return task;
  }

  function updTask(i, u) {
    const idx = d.tasks.findIndex(t => t.id === i);
    if(idx === -1) return null;
    const t = d.tasks[idx];
    if(u.status && u.status !== t.status) {
      if(u.status === 'running') u.iterationCount = (t.iterationCount||0) + 1;
      if(u.status === 'review' && t.status !== 'review') u.completedAt = Date.now();
      if(u.status === 'reviewed') u.reviewedAt = Date.now();
    }
    Object.assign(t, u); save(); notify(); return t;
  }

  function delTask(i) { d.tasks = d.tasks.filter(t => t.id !== i); save(); notify(); }

  function taskCounts(aid) {
    const t = aid ? d.tasks.filter(x => x.agentId === aid) : d.tasks;
    return { total: t.length, pending: t.filter(x => x.status==='pending').length, running: t.filter(x => x.status==='running').length, review: t.filter(x => x.status==='review').length, reviewed: t.filter(x => x.status==='reviewed').length, cancelled: t.filter(x => x.status==='cancelled').length };
  }

  function needsReview() { return d.tasks.filter(t => t.status === 'review').sort((a,b) => cmpTime(a.checkinTime, b.checkinTime)); }

  function nextCheckin() {
    const n = nowStr();
    const upcoming = d.tasks.filter(t => {
      if(t.status !== 'running' && t.status !== 'pending') return false;
      const c = t.checkinDate + 'T' + (t.checkinTime||'12:00');
      return c > n;
    });
    if(!upcoming.length) return null;
    upcoming.sort((a,b) => (a.checkinDate+'T'+a.checkinTime).localeCompare(b.checkinDate+'T'+b.checkinTime));
    const nx = upcoming[0];
    return { date: nx.checkinDate, time: nx.checkinTime, taskId: nx.id, agentId: nx.agentId, title: nx.title };
  }

  // Tasks whose checkin time has passed but still pending/running
  function dueCheckins() {
    const n = nowStr();
    return d.tasks.filter(t => {
      if(t.status !== 'running' && t.status !== 'pending') return false;
      const c = t.checkinDate + 'T' + (t.checkinTime||'12:00');
      return c <= n;
    });
  }

  function hasDue() { return dueCheckins().length > 0 || needsReview().length > 0; }

  // ==== SESSIONS ====
  function addSession(o) {
    const s = { id: id(), dateTime: Date.now(), taskIds: o.taskIds||[], note: (o.note||'').trim() };
    d.sessions.push(s); save(); notify(); return s;
  }

  function getSessions(n = 20) { return [...d.sessions].sort((a,b) => b.dateTime - a.dateTime).slice(0, n); }

  // ==== SETTINGS ====
  function getSet() { return {...d.settings}; }
  function updSet(u) { Object.assign(d.settings, u); save(); notify(); return d.settings; }

  // ==== DEMO ====
  function hasData() { return d.agents.length > 0 || d.tasks.length > 0; }

  function loadDemo() {
    if(hasData()) return;
    const td = todayStr();
    const a1 = addAgent({ name:'代码审查官', emoji:'🔍', description:'审查 PR、代码质量反馈' });
    const a2 = addAgent({ name:'内容创作师', emoji:'✍️', description:'撰写博客和技术文档' });
    const a3 = addAgent({ name:'数据分析师', emoji:'📊', description:'分析指标、生成报告' });

    const t1 = addTask({ agentId:a1.id, title:'审查 PR #127', scheduledDate:td, scheduledTime:'09:00', checkinDate:td, checkinTime:'11:00' });
    const t2 = addTask({ agentId:a1.id, title:'审查 PR #128', scheduledDate:td, scheduledTime:'14:00', checkinDate:td, checkinTime:'16:00' });
    const t3 = addTask({ agentId:a2.id, title:'撰写月度技术总结', scheduledDate:td, scheduledTime:'10:00', checkinDate:td, checkinTime:'12:00' });
    const t4 = addTask({ agentId:a3.id, title:'生成 Q2 用户增长报告', scheduledDate:td, scheduledTime:'13:30', checkinDate:td, checkinTime:'15:30' });
    const t5 = addTask({ agentId:a2.id, title:'编辑 API 文档 V3', scheduledDate:td, scheduledTime:'15:00', checkinDate:td, checkinTime:'17:00' });

    updTask(t2.id, { status:'running' });
    updTask(t4.id, { status:'review' });
    updTask(t5.id, { status:'reviewed' });
  }

  load();

  return {
    sub, getAgents, getAgent, addAgent, updAgent, delAgent,
    getTasks, getTask, addTask, updTask, delTask,
    taskCounts, needsReview, nextCheckin, dueCheckins, hasDue,
    addSession, getSessions,
    getSet, updSet,
    todayStr, nowStr, fmtTime, STATI, hasData, loadDemo
  };
})();
