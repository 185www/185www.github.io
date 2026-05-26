/* Pomotodo V5 — app.js */
(function(){
'use strict';

/* ============= STATE ============= */
const STORAGE_KEY = 'pomotodo_v4';
const CIRCUMFERENCE = 2 * Math.PI * 88; // ~553.1

const defaultSettings = {
  work:25, shortBreak:5, longBreak:15, longBreakInterval:4,
  autoBreak:true, autoWork:false, restGuide:true, focusMode:true,
  celebration:true, interruptConfirm:true,
  sound:true, volume:0.7, notify:false, wakelock:false,
  theme:'light'
};

let S = loadState();
let timerWorker = null;
let wakeLockSentinel = null;
let chartInstance = null;
let currentTimerId = null;

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const d = JSON.parse(raw);
      if(d && typeof d === 'object' && (d.version === 3 || d.version === 4)) return d;
    }
  }catch(e){}
  return freshState();
}

function freshState(){
  return {
    version:4,
    settings:{...defaultSettings},
    tasks:[],
    projects:[],
    sessions:[],
    pomodoroHistory:{},
    dailyFocusTasks:[],
    lastCompletedTaskId:null,
    lastCompletedCycle:0,
    showOnboarding:true,
    _lastVisitDate:null,
    _reviewedDates:{},
    _lastWeeklyReviewDate:null,
    timer:{
      mode:'work',
      phase:'idle',
      remaining:defaultSettings.work*60,
      total:defaultSettings.work*60,
      intervalsCompleted:0,
      currentCycle:1,
      currentTaskId:null,
    }
  };
}

function saveState(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
  } catch(e) {}
}

/* ============= DOM REFS ============= */
const $ = id => document.getElementById(id);
const qs = (sel, ctx) => (ctx||document).querySelector(sel);
const qsa = (sel, ctx) => (ctx||document).querySelectorAll(sel);

/* ============= UTILITY ============= */
function fmtTime(s){
  const m = Math.floor(s/60), sec = s%60;
  return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
}

function todayStr(){
  const d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function dateStr(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function isoNow(){return new Date().toISOString();}

function toast(msg, dur=2500){
  const w = $('toast-wrap');
  const el = document.createElement('div');
  el.className='toast';
  el.textContent=msg;
  w.appendChild(el);
  setTimeout(()=>{el.remove();}, dur);
}

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}

function playSound(callback){
  if(!S.settings.sound) { if(callback) callback(); return; }
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type='sine';
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime+0.5);
    g.gain.setValueAtTime(S.settings.volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.8);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime+0.8);
    setTimeout(()=>{
      ctx.close();
      if(callback) callback();
    },900);
  }catch(e){ if(callback) callback(); }
}

function requestNotify(title, body){
  if(!S.settings.notify) return;
  if(Notification.permission==='granted'){
    new Notification(title, {body, icon:'./icons/icon-192.png'});
  }
}

/* ============= TIMER ============= */
function initTimerWorker(){
  if(timerWorker){
    timerWorker.terminate();
    timerWorker = null;
  }
  try{
    timerWorker = new Worker('./timer-worker.js');
    timerWorker.onmessage = e => {
      if(e.data.type==='tick'){
        S.timer.remaining = e.data.remaining;
        S.timer.total = e.data.total;
        updateTimerDisplay();
      }else if(e.data.type==='done'){
        onTimerComplete();
      }
    };
  }catch(e){
    // fallback: use setInterval
    timerWorker = null;
  }
}

function startTimer(){
  if(S.timer.phase==='running') return;
  if(S.timer.remaining <= 0){
    S.timer.remaining = S.settings[S.timer.mode]*60;
    S.timer.total = S.settings[S.timer.mode]*60;
  }
  S.timer.phase = 'running';
  updateTimerModeClass();
  updateTimerDisplay();
  updateTimerBtn();
  if(timerWorker){
    timerWorker.postMessage({type:'start', remaining:S.timer.remaining, total:S.timer.total});
  }else{
    const fbStart=Date.now(), fbTotal=S.timer.remaining;
    if(currentTimerId) clearInterval(currentTimerId);
    currentTimerId = setInterval(()=>{
      S.timer.remaining=Math.max(0,fbTotal-Math.floor((Date.now()-fbStart)/1000));
      updateTimerDisplay();
      if(S.timer.remaining <= 0){
        if(currentTimerId) clearInterval(currentTimerId);
        currentTimerId = null;
        onTimerComplete();
      }
    },200);
  }
  requestWakeLock();
  saveState();
}

function pauseTimer(){
  if(S.timer.phase!=='running') return;
  S.timer.phase='paused';
  if(timerWorker){
    timerWorker.postMessage({type:'pause'});
  }else if(currentTimerId){
    clearInterval(currentTimerId);
    currentTimerId = null;
  }
  updateTimerBtn();
  releaseWakeLock();
  saveState();
}

function resumeTimer(){
  if(S.timer.phase!=='paused') return;
  startTimer();
}

function resetTimer(){
  stopTimer();
  S.timer.remaining = S.settings[S.timer.mode]*60;
  S.timer.total = S.settings[S.timer.mode]*60;
  S.timer.phase='idle';
  S.timer.currentTaskId=null;
  updateTimerDisplay();
  updateTimerBtn();
  updateTimerModeClass();
  saveState();
}

function stopTimer(){
  if(timerWorker){
    timerWorker.postMessage({type:'stop'});
  }else if(currentTimerId){
    clearInterval(currentTimerId);
    currentTimerId = null;
  }
  releaseWakeLock();
}

function setTimerMode(mode){
  if(S.timer.phase==='running') return;
  S.timer.mode = mode;
  S.timer.remaining = S.settings[mode]*60;
  S.timer.total = S.settings[mode]*60;
  S.timer.phase='idle';
  updateTimerDisplay();
  updateTimerBtn();
  updateTimerModeClass();
  updateModeBtns();
  saveState();
}

function updateTimerDisplay(){
  const el = $('timer-digits');
  if(el) el.textContent = fmtTime(S.timer.remaining);
  const cycle = $('timer-cycle');
  if(cycle) cycle.textContent = '#' + S.timer.currentCycle;
  // ring
  const pct = S.timer.total > 0 ? S.timer.remaining/S.timer.total : 0;
  const offset = CIRCUMFERENCE * (1-pct);
  const fill = qs('.ring-fill');
  if(fill) fill.style.strokeDashoffset = offset;
}

function updateTimerModeClass(){
  const wrap = $('timer-ring-wrap');
  if(!wrap) return;
  wrap.classList.toggle('timer-mode-break', S.timer.mode !== 'work');
}

function updateModeBtns(){
  qsa('.mode-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.mode===S.timer.mode);
  });
}

function updateTimerBtn(){
  const btn = $('btn-start');
  if(!btn) return;
  if(S.timer.phase==='running'){
    btn.textContent = '⏸ 暂停';
    btn.className = 'btn-timer primary running';
  }else if(S.timer.phase==='paused'){
    btn.textContent = '▶ 继续';
    btn.className = 'btn-timer primary';
  }else if(S.timer.phase==='finished'){
    btn.textContent = '▶ 下一个番茄';
    btn.className = 'btn-timer primary';
  }else{
    const label = S.timer.mode==='work' ? '开始专注' : S.timer.mode==='shortBreak' ? '开始短休息' : '开始长休息';
    btn.textContent = '▶ '+label;
    btn.className = 'btn-timer primary';
  }
}

function updateActiveTaskDisplay(){
  const el = $('timer-active-task');
  if(!el) return;
  if(S.timer.currentTaskId){
    const t = findTask(S.timer.currentTaskId);
    if(t){
      el.innerHTML = '当前任务：<a class="task-link" data-id="'+t.id+'">' + escHtml(t.title) + '</a>';
      return;
    }
  }
  el.innerHTML = '';
}

function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* timer complete */
function onTimerComplete(){
  S.timer.phase='finished';
  stopTimer();
  updateTimerBtn();

  if(S.timer.mode==='work'){
    recordPomodoro();
    playSound(()=>{
      if(S.settings.celebration) showCelebration();
      showCompletionModal();
      requestNotify('🍅 番茄完成！','专注完成，休息一下吧');
    });
  }else{
    playSound(()=>{
      requestNotify('☕ 休息结束','该回来继续工作了');
    });
    if(S.settings.autoWork){
      setTimeout(()=>{ if(S.timer.phase==='finished') startTimer(); }, 1000);
    }
  }
  saveState();
}

function recordPomodoro(){
  const today = todayStr();
  if(!S.pomodoroHistory[today]) S.pomodoroHistory[today] = {count:0,focusMins:0};
  S.pomodoroHistory[today].count++;
  S.pomodoroHistory[today].focusMins += S.timer.total/60;
  S.timer.intervalsCompleted++;
  S.timer.currentCycle++;

  // record session
  const sess = {
    id: uid(),
    type: S.timer.mode,
    duration: S.timer.total,
    start: new Date(Date.now() - S.timer.total*1000).toISOString(),
    taskId: S.timer.currentTaskId,
    completed: true
  };
  S.sessions.push(sess);

  let estimateReached = false;
  if(S.timer.currentTaskId){
    const t = findTask(S.timer.currentTaskId);
    if(t){
      t.completedPomodoros = (t.completedPomodoros||0)+1;
      S.lastCompletedTaskId = t.id;
      if(t.estimatedPomodoros && t.completedPomodoros >= t.estimatedPomodoros){
        estimateReached = true;
      }
    }
  }
  if(estimateReached){
    setTimeout(()=>{
      const t = findTask(S.timer.currentTaskId);
      if(t && !t.completed){
        toast('🎯 预估番茄已达成，建议标记任务完成！');
      }
    }, 2000);
  }
}

function showCompletionModal(){
  const sub = $('modal-sub');
  const tasks = $('modal-tasks');
  sub.textContent = '已完成第 '+S.timer.intervalsCompleted+' 个番茄';
  tasks.innerHTML = '';
  // show completed tasks today
  getTodayDone().forEach(t=>{
    const div = document.createElement('div');
    div.className='task-item';
    div.innerHTML='<span class="task-text">'+escHtml(t.title)+'</span>';
    tasks.appendChild(div);
  });
  $('modal-complete').hidden = false;
}

function getTodayDone(){
  const today = todayStr();
  return S.tasks.filter(t=>t.completed && t.completedAt && t.completedAt.startsWith(today));
}

$('modal-confirm').onclick = ()=>{
  $('modal-complete').hidden = true;
  handleTimerFinish();
};

$('modal-skip').onclick = ()=>{
  $('modal-complete').hidden = true;
  handleTimerFinish();
};

function handleTimerFinish(){
  if(S.timer.mode==='work'){
    // check for rest guide
    const isLong = S.timer.intervalsCompleted % S.settings.longBreakInterval === 0;
    if(isLong){
      setTimerMode('longBreak');
    }else{
      setTimerMode('shortBreak');
    }
    if(S.settings.autoBreak){
      startTimer();
    }
    if(S.settings.restGuide && !S.settings.autoBreak){
      showRestGuide();
    }
  }else{
    setTimerMode('work');
    if(S.settings.autoWork){
      startTimer();
    }
  }
  updateDoneToday();
  renderTasks();
}

/* abandon confirm */
$('btn-skip').onclick = ()=>{
  if(S.timer.mode!=='work' && (S.timer.phase==='idle'||S.timer.phase==='running')){
    // skip break
    stopTimer();
    handleTimerFinish();
    return;
  }
  if(S.timer.phase !== 'running' && S.timer.phase !== 'paused') return;
  if(S.settings.interruptConfirm){
    const elapsed = S.timer.total - S.timer.remaining;
    $('abandon-minutes').textContent = Math.round(elapsed/60);
    $('modal-abandon-confirm').hidden = false;
  }else{
    abandonPomo();
  }
};

$('abandon-continue').onclick = ()=>{ $('modal-abandon-confirm').hidden = true; };

$('abandon-confirm').onclick = ()=>{
  $('modal-abandon-confirm').hidden = true;
  abandonPomo();
};

function abandonPomo(){
  resetTimer();
  toast('番茄已放弃');
}

/* ============= WAKE LOCK ============= */
async function requestWakeLock(){
  if(!S.settings.wakelock) return;
  try{
    if(navigator.wakeLock){
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      wakeLockSentinel.onrelease = ()=>{ wakeLockSentinel = null; };
    }
  }catch(e){}
}

function releaseWakeLock(){
  if(wakeLockSentinel){
    wakeLockSentinel.release().catch(()=>{});
    wakeLockSentinel = null;
  }
}

/* ============= TASK CRUD ============= */
function findTask(id){ return S.tasks.find(t=>t.id===id); }

function createTask(title, opts={}){
  const t = {
    id: uid(),
    title: title.trim(),
    area: opts.area || 'inbox',
    priority: opts.priority || 4,
    tags: opts.tags || [],
    due: opts.due || null,
    project: opts.project || '',
    parentId: opts.parentId || null,
    subtasks: [],
    pinned: false,
    estimatedPomodoros: opts.estimatedPomodoros || 0,
    completedPomodoros: 0,
    notes: opts.notes || '',
    completed: false,
    completedAt: null,
    createdAt: isoNow(),
  };
  S.tasks.push(t);
  saveState();
  return t;
}

function updateTask(id, changes){
  const t = findTask(id);
  if(!t) return;
  Object.assign(t, changes);
  saveState();
  return t;
}

function deleteTask(id){
  const t = findTask(id);
  if(!t) return;
  // also delete subtasks
  if(t.subtasks && t.subtasks.length){
    t.subtasks.forEach(st=>{
      const idx = S.tasks.findIndex(x => x.id === st.id);
      if(idx!==-1) S.tasks.splice(idx,1);
    });
  }
  const i = S.tasks.indexOf(t);
  if(i!==-1) S.tasks.splice(i,1);
  if(S.timer.currentTaskId===id) S.timer.currentTaskId=null;
  saveState();
}

function toggleTaskComplete(id){
  const t = findTask(id);
  if(!t) return;
  if(t.area==='done' && t.completed){
    t.completed = false;
    t.completedAt = null;
    t.area = 'inbox';
    saveState();
    renderTasks();
    updateDoneToday();
    updateAllViews();
    return;
  }
  // check subtasks
  if(!t.completed && t.subtasks && t.subtasks.length){
    const allDone = t.subtasks.every(st=>{
      const stt = findTask(st.id);
      return !stt || stt.completed;
    });
    if(!allDone){
      toast('请先完成所有子任务');
      return;
    }
  }
  t.completed = !t.completed;
  t.completedAt = t.completed ? isoNow() : null;
  if(t.completed && t.area!=='done') t.area='done';
  saveState();
  renderTasks();
  updateDoneToday();
  updateAllViews();
}

function addSubtask(parentId, title){
  const parent = findTask(parentId);
  if(!parent) return;
  const st = createTask(title.trim(), {parentId, area:'next'});
  parent.subtasks = parent.subtasks || [];
  parent.subtasks.push({id:st.id, title:st.title, completed:false});
  saveState();
  return st;
}

/* parse quick input */
function parseQuickInput(str){
  let title = str;
  const tags = [];
  let priority = 4;
  let due = null;

  // !priority
  title = title.replace(/!(\d)/, (m,p)=>{
    priority = parseInt(p);
    if(priority<1) priority=1;
    if(priority>4) priority=4;
    return '';
  }).trim();

  // @today or @YYYY-MM-DD
  title = title.replace(/@(\S+)/, (m,p)=>{
    if(p==='today'||p==='今日'||p==='今天'){
      due = new Date();
      due.setHours(23,59,0,0);
      return '';
    }
    // try parse date
    const match = p.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(match){
      due = new Date(parseInt(match[1]),parseInt(match[2])-1,parseInt(match[3]),23,59);
      return '';
    }
    return m;
  }).trim();

  // #tag
  title.replace(/#(\S+)/g, (m,tag)=>{
    tags.push(tag);
    return '';
  });
  title = title.replace(/#\S+/g,'').trim();

  return {title, tags, priority, due};
}

function renderTasks(){
  const list = $('task-list');
  if(!list) return;
  const activeArea = qs('.gtd-tab.active');
  const area = activeArea ? activeArea.dataset.area : 'inbox';
  const filter = qs('.filter-btn.active');
  const fval = filter ? filter.dataset.filter : 'all';

  // projects tab shows projects list instead
  if(area==='projects'){
    renderProjectPanelList(list);
    updateAreaCounts();
    return;
  }

  let tasks = S.tasks.filter(t=>{
    if(t.parentId){
      const p = findTask(t.parentId);
      if(p) return false;
    }
    return t.area===area;
  });

  if(fval==='today'){
    const td = todayStr();
    tasks = tasks.filter(t=>{
      if(t.completed && t.completedAt && t.completedAt.startsWith(td)) return true;
      if(t.due){
        const d = new Date(t.due);
        return dateStr(d)===td;
      }
      return false;
    });
  }else if(fval==='overdue'){
    const now = new Date();
    tasks = tasks.filter(t=>!t.completed && t.due && new Date(t.due)<now);
  }else if(fval==='active'){
    tasks = tasks.filter(t=>!t.completed);
  }else if(fval==='completed'){
    tasks = tasks.filter(t=>t.completed);
  }

  // sort: incomplete first, priority asc, due asc
  tasks.sort((a,b)=>{
    if(a.completed!==b.completed) return a.completed ? 1 : -1;
    if(a.priority!==b.priority) return a.priority-b.priority;
    if(a.due && b.due) return new Date(a.due)-new Date(b.due);
    if(a.due) return -1;
    if(b.due) return 1;
    return 0;
  });

  list.innerHTML = '';
  tasks.forEach(t=>{
    const item = document.createElement('li');
    item.className = 'task-item' + (t.completed ? ' completed' : '');
    item.dataset.id = t.id;

    const hasChildren = t.subtasks && t.subtasks.length > 0;

    const prioEmoji = ['','🔴','🟠','🟡','⚪'][t.priority]||'⚪';

    let extraMeta = '';
    if(area==='waiting'){
      if(t.delegatedTo) extraMeta += '<span class="task-delegated">→ '+escHtml(t.delegatedTo)+'</span>';
      if(t.expectedDate) extraMeta += '<span class="task-expected">📅 '+fmtDue(t.expectedDate)+'</span>';
    }

    item.innerHTML = `
      <div class="task-check ${t.completed?'checked':''}" data-action="toggle">${t.completed?'✓':''}</div>
      <span class="task-prio">${prioEmoji}</span>
      ${area==='inbox' && !t.completed ? '<span class="task-clarify-btn" data-action="clarify">🧹</span>' : ''}
      <span class="task-text">${escHtml(t.title)}${hasChildren?' <span class="task-sub-indicator">📋</span>':''}</span>
      <div class="task-meta">
        ${t.tags && t.tags.length ? t.tags.map(tg=>'<span class="task-tag">#'+escHtml(tg)+'</span>').join('') : ''}
        ${t.project ? '<span class="task-project-dot" style="background:'+(getProjectColor(t.project)||'#888')+'"></span>' : ''}
        ${t.due ? '<span class="task-due'+(new Date(t.due)<new Date() && !t.completed?' overdue':'')+'">'+fmtDue(t.due)+'</span>' : ''}
        ${extraMeta}
      </div>
    `;
    item.onclick = (e)=>{
      const action = e.target.dataset.action;
      if(action==='toggle'){
        e.stopPropagation();
        toggleTaskComplete(t.id);
        return;
      }
      if(action==='clarify'){
        e.stopPropagation();
        openClarify(t.id);
        return;
      }
      if(!e.target.closest('.task-check') && !e.target.closest('.task-clarify-btn')){
        openDetail(t.id);
      }
    };
    list.appendChild(item);
  });

  // update counts
  updateAreaCounts();
}

function updateAreaCounts(){
  ['inbox','next','projects','waiting','someday','reference','done'].forEach(a=>{
    const cnt = S.tasks.filter(t=>{
      if(t.parentId){
        const p = findTask(t.parentId);
        if(p) return false;
      }
      return t.area===a && !t.completed;
    }).length;
    const el = $('cnt-'+a);
    if(el) el.textContent = cnt;
  });
}

function getProjectColor(name){
  const p = S.projects.find(x=>x.name===name);
  return p ? p.color : '#888';
}

/* ============= PROJECT PANEL ============= */
function renderProjectPanelList(list){
  list.innerHTML = '';
  S.projects.filter(p=>p.status==='active').forEach(p=>{
    const tasks = S.tasks.filter(t=>t.project===p.name && !t.completed);
    const doneTasks = S.tasks.filter(t=>t.project===p.name && t.completed);
    const totalPomos = tasks.reduce((s,t)=>s+(t.completedPomodoros||0),0)+doneTasks.reduce((s,t)=>s+(t.completedPomodoros||0),0);
    const nextAct = tasks.find(t=>t.area==='next');
    const div = document.createElement('div');
    div.className='task-item';
    div.innerHTML=`<div class="project-header"><span class="proj-color" style="background:${p.color}"></span><span class="proj-name">${escHtml(p.name)}</span><span class="proj-status">${tasks.length}个待办</span></div>`;
    if(p.outcome) div.innerHTML+=`<div class="project-outcome">🎯 ${escHtml(p.outcome)}</div>`;
    if(tasks.length+doneTasks.length>0){
      const pct = Math.min(100,(totalPomos/Math.max(1,(tasks.length+doneTasks.length)))*100);
      div.innerHTML+=`<div class="project-progress-bar"><div class="project-progress-fill" style="width:${pct}%"></div></div>`;
    }
    if(nextAct) div.innerHTML+=`<div class="project-next-action">▶ 下一步：${escHtml(nextAct.title)}</div>`;
    div.innerHTML+=`<div class="project-actions"><button class="btn-sm" data-action="add-next">＋下一步</button><button class="btn-sm btn-primary" data-action="focus">🍅 专注</button></div>`;
    div.onclick=e=>{
      const act=e.target.dataset.action;
      if(act==='add-next'){
        e.stopPropagation();
        const title=prompt('下一步行动：');
        if(!title) return;
        const t=createTask(title,{area:'next',project:p.name});
        toast('已添加下一步行动');
        renderProjectPanelList(list);
        updateAreaCounts();
      }else if(act==='focus'){
        e.stopPropagation();
        const target=nextAct||tasks[0];
        if(target){
          S.timer.currentTaskId=target.id;
          saveState();
          updateActiveTaskDisplay();
          navigateTo('work');
        }else{
          toast('项目暂无待办任务');
        }
      }else{
        openProjectDetail(p.id);
      }
    };
    list.appendChild(div);
  });
  if(list.children.length===0){
    list.innerHTML='<li class="task-item" style="justify-content:center;color:var(--text2);font-size:13px">暂无活跃项目</li>';
  }
}

function openProjectDetail(pid){
  const p=S.projects.find(x=>x.id===pid);
  if(!p) return;
  const tasks=S.tasks.filter(t=>t.project===p.name);
  // reuse detail panel with project view
  $('det-title').value = p.name;
  qsa('#det-prio-group .prio-btn').forEach(b=>b.classList.remove('active'));
  $('det-area').value = 'projects';
  $('det-project').value = p.name;
  $('det-parent-section').style.display='none';
  $('det-subtask-section').hidden = true;
  $('det-promote-project').style.display='none';
  $('det-estpomo').value = 0;
  $('det-notes').value = p.outcome||'';
  $('det-pomo-count').textContent = tasks.reduce((s,t)=>s+(t.completedPomodoros||0),0);
  $('det-created').textContent = '项目 ID: '+p.id.slice(0,8);
  // add delegated/waiting fields
  $('det-due').value = '';
  $('det-tags').innerHTML = '';
  $('det-delegated-row').hidden = true;
  $('det-expected-row').hidden = true;
  $('detail-panel').hidden=false;
  $('detail-panel').classList.add('show');
  $('detail-overlay').hidden=false;
  setTimeout(()=>$('detail-overlay').classList.add('show'),10);
  // change save to update project outcome
  $('det-save').onclick = ()=>{
    const newName=$('det-title').value.trim();
    if(!newName){toast('项目名称不能为空');return;}
    p.name=newName;
    p.outcome=$('det-notes').value;
    saveState();
    closeDetail();
    renderProjectPanelList($('task-list'));
    renderProjects();
    renderTasks();
  };
  $('det-delete').onclick = ()=>{
    if(!confirm('确定删除项目"'+p.name+'"？关联任务的项目字段将被清空。')) return;
    S.tasks.forEach(t=>{if(t.project===p.name) t.project='';});
    S.projects=S.projects.filter(x=>x.id!==pid);
    saveState();
    closeDetail();
    renderProjects();
    renderTasks();
  };
}

/* ============= CLARIFY ============= */
let clarifyTaskId = null;

function openClarify(id){
  clarifyTaskId = id;
  const t = findTask(id);
  if(!t) return;
  $('cl-title').textContent = escHtml(t.title);
  // populate project select
  const sel = $('cl-project-sel');
  sel.innerHTML = '<option value="">无项目</option>';
  S.projects.forEach(p=>{
    const opt = document.createElement('option');
    opt.value = p.name;
    opt.textContent = p.name;
    sel.appendChild(opt);
  });
  // reset extras
  $('cl-extras').hidden = true;
  $('cl-project-select').hidden = true;
  $('cl-waiting-fields').hidden = true;
  $('cl-delegated').value = '';
  $('cl-expected').value = '';
  $('cl-confirm').dataset.action = '';
  $('modal-clarify').hidden = false;
}

qsa('.cl-btn').forEach(b=>{
  b.onclick = ()=>{
    const action = b.dataset.action;
    $('cl-confirm').dataset.action = action;
    if(action==='project'){
      $('cl-project-select').hidden = false;
      $('cl-waiting-fields').hidden = true;
    }else if(action==='waiting'){
      $('cl-project-select').hidden = true;
      $('cl-waiting-fields').hidden = false;
    }else{
      $('cl-project-select').hidden = true;
      $('cl-waiting-fields').hidden = true;
    }
    $('cl-extras').hidden = (action!=='project' && action!=='waiting');
  };
});

$('cl-cancel').onclick = ()=>{ $('modal-clarify').hidden = true; clarifyTaskId = null; };

$('cl-confirm').onclick = ()=>{
  const action = $('cl-confirm').dataset.action;
  if(!action || clarifyTaskId===null) return;
  const t = findTask(clarifyTaskId);
  if(!t) return;
  switch(action){
    case 'delete':
      deleteTask(clarifyTaskId);
      toast('已删除');
      break;
    case 'doitnow':
      t.area = 'done';
      t.completed = true;
      t.completedAt = isoNow();
      toast('⚡ 已完成！');
      break;
    case 'next':
      t.area = 'next';
      toast('已转为下一步行动');
      break;
    case 'project':
      t.area = 'projects';
      t.project = $('cl-project-sel').value || t.project;
      toast('已归入项目');
      break;
    case 'waiting':
      t.area = 'waiting';
      t.delegatedTo = $('cl-delegated').value.trim() || null;
      t.expectedDate = $('cl-expected').value || null;
      toast('已设为等待他人');
      break;
    case 'someday':
      t.area = 'someday';
      toast('已移至将来也许');
      break;
    case 'reference':
      t.area = 'reference';
      toast('已转为参考信息');
      break;
  }
  $('modal-clarify').hidden = true;
  clarifyTaskId = null;
  saveState();
  renderTasks();
  updateDoneToday();
  updateAllViews();
};

/* ============= WEEKLY REVIEW ============= */
const weeklyReviewSteps = [
  { title:'📥 清空收件箱', desc:'将所有待处理的任务厘清到合适的区域', check:()=>S.tasks.filter(t=>t.area==='inbox'&&!t.completed).length===0 },
  { title:'📁 检查项目', desc:'查看所有活跃项目，确保都有下一步行动', check:()=>S.projects.filter(p=>p.status==='active').length===0 },
  { title:'▶ 审查行动清单', desc:'检查下一步行动是否仍然有效、优先级正确', check:()=>false },
  { title:'⏳ 检查等待清单', desc:'检查等待他人的事项，跟进过期项目', check:()=>S.tasks.filter(t=>t.area==='waiting'&&!t.completed).length===0 },
  { title:'💭 回顾将来也许', desc:'检查 someday 清单，看看是否有可以转为项目的', check:()=>S.tasks.filter(t=>t.area==='someday'&&!t.completed).length===0 },
  { title:'✅ 回顾已完成', desc:'看看本周完成了哪些任务，给自己鼓励', check:()=>false },
];
let wrCurrentStep = 0;

function showWeeklyReview(){
  wrCurrentStep = 0;
  renderWRStep();
  $('weekly-review-overlay').hidden = false;
}

function renderWRStep(){
  const step = weeklyReviewSteps[wrCurrentStep];
  const body = $('wr-body');
  const counts = {
    inbox: S.tasks.filter(t=>t.area==='inbox'&&!t.completed).length,
    projects: S.projects.filter(p=>p.status==='active').length,
    next: S.tasks.filter(t=>t.area==='next'&&!t.completed).length,
    waiting: S.tasks.filter(t=>t.area==='waiting'&&!t.completed).length,
    someday: S.tasks.filter(t=>t.area==='someday'&&!t.completed).length,
    done: S.tasks.filter(t=>t.area==='done'&&t.completedAt&&t.completedAt.startsWith(todayStr())).length,
  };
  let html = `<h4>${step.title}</h4><p style="font-size:13px;color:var(--text2);margin:4px 0 8px">${step.desc}</p>`;
  html += `<div class="wr-step-item"><span class="wr-count">📥</span> 收件箱待厘清：<strong>${counts.inbox}</strong></div>`;
  html += `<div class="wr-step-item"><span class="wr-count">📁</span> 活跃项目：<strong>${counts.projects}</strong></div>`;
  html += `<div class="wr-step-item"><span class="wr-count">▶</span> 下一步行动：<strong>${counts.next}</strong></div>`;
  html += `<div class="wr-step-item"><span class="wr-count">⏳</span> 等待他人：<strong>${counts.waiting}</strong></div>`;
  html += `<div class="wr-step-item"><span class="wr-count">💭</span> 将来也许：<strong>${counts.someday}</strong></div>`;
  html += `<div class="wr-step-item"><span class="wr-count">✅</span> 今日完成：<strong>${counts.done}</strong></div>`;
  body.innerHTML = html;
  $('wr-step').textContent = (wrCurrentStep+1)+'/'+weeklyReviewSteps.length;
  $('wr-prev').hidden = wrCurrentStep===0;
  $('wr-next').textContent = wrCurrentStep>=weeklyReviewSteps.length-1 ? '完成回顾' : '下一步';
}

$('wr-next').onclick = ()=>{
  if(wrCurrentStep >= weeklyReviewSteps.length-1){
    S._lastWeeklyReviewDate = todayStr();
    saveState();
    $('weekly-review-overlay').hidden = true;
    toast('✅ 本周回顾完成！');
    return;
  }
  wrCurrentStep++;
  renderWRStep();
};

$('wr-prev').onclick = ()=>{
  if(wrCurrentStep>0){ wrCurrentStep--; renderWRStep(); }
};

$('wr-skip').onclick = ()=>{
  S._lastWeeklyReviewDate = todayStr();
  saveState();
  $('weekly-review-overlay').hidden = true;
};

function fmtDue(d){
  if(!d) return '';
  const dt = new Date(d);
  const now = new Date();
  const diff = Math.ceil((dt-now)/(86400000));
  if(diff<0) return '逾期' + Math.abs(diff) + '天';
  if(diff===0) return '今天';
  if(diff===1) return '明天';
  if(diff<=7) return diff+'天后';
  return (dt.getMonth()+1)+'/'+dt.getDate();
}

/* ============= TASK FILTERS & TABS ============= */
qsa('.filter-btn').forEach(b=>{
  b.onclick = ()=>{
    qsa('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    renderTasks();
  };
});

qsa('.gtd-tab').forEach(b=>{
  b.onclick = ()=>{
    qsa('.gtd-tab').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    renderTasks();
  };
});

/* ============= TASK INPUT ============= */
$('task-input').onkeydown = e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    addFromInput();
  }
};

$('task-add-btn').onclick = addFromInput;

function addFromInput(){
  const input = $('task-input');
  const raw = input.value.trim();
  if(!raw) return;
  const parsed = parseQuickInput(raw);

  const qiPrio = qs('.prio-btn.active');
  const prio = qiPrio ? parseInt(qiPrio.dataset.prio) : parsed.priority;

  const qiProject = $('qi-project');
  const qiDue = $('qi-datetime');
  const qiTags = Array.from(qsa('#qi-tags .det-tag')).map(el=>el.dataset.tag);

  const mergedTags = [...new Set([...parsed.tags, ...qiTags])];

  const task = createTask(parsed.title, {
    area: 'inbox',
    priority: prio,
    tags: mergedTags,
    due: qiDue.value ? new Date(qiDue.value).toISOString() : parsed.due ? parsed.due.toISOString() : null,
    project: qiProject.value || '',
  });

  input.value = '';
  toast('已添加到收件箱');
  renderTasks();
  updateDoneToday();
  updateAllViews();
}

/* quick input bar */
$('task-input-more').onclick = ()=>{
  const bar = $('quick-input-bar');
  bar.hidden = !bar.hidden;
};

qsa('.prio-btn').forEach(b=>{
  b.onclick = ()=>{
    qsa('.prio-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
  };
});

$('qi-tag-input').onkeydown = e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    const val = e.target.value.trim();
    if(!val) return;
    const container = $('qi-tags');
    const tag = document.createElement('span');
    tag.className='det-tag';
    tag.dataset.tag = val;
    tag.innerHTML = '#'+escHtml(val)+' <span class="det-tag-del" data-action="del-tag">✕</span>';
    tag.onclick = e2=>{
      if(e2.target.dataset.action==='del-tag') tag.remove();
    };
    container.appendChild(tag);
    e.target.value='';
  }
};

$('qi-today-btn').onclick = ()=>{
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59).toISOString().slice(0,16);
  $('qi-datetime').value = local;
};

/* ============= DETAIL PANEL ============= */
let detailTaskId = null;

function openDetail(id){
  if(closeDetailTimer){
    clearTimeout(closeDetailTimer);
    closeDetailTimer = null;
  }
  detailTaskId = id;
  const t = findTask(id);
  if(!t) return;
  $('det-title').value = t.title;
  // prio
  qsa('#det-prio-group .prio-btn').forEach(b=>{
    b.classList.toggle('active', parseInt(b.dataset.prio)===t.priority);
  });
  // tags
  const tagsEl = $('det-tags');
  tagsEl.innerHTML = '';
  (t.tags||[]).forEach(tag=>{
    const span = document.createElement('span');
    span.className='det-tag';
    span.innerHTML = '#'+escHtml(tag)+' <span class="det-tag-del" data-action="del-tag-detail">✕</span>';
    span.querySelector('[data-action="del-tag-detail"]').onclick = ()=>{
      t.tags = t.tags.filter(x=>x!==tag);
      saveState();
      openDetail(id);
      renderTasks();
    };
    tagsEl.appendChild(span);
  });
  // due
  $('det-due').value = t.due ? new Date(t.due).toISOString().slice(0,16) : '';
  // delegated / expected
  const delRow = $('det-delegated-row');
  const expRow = $('det-expected-row');
  if(t.area==='waiting'){
    delRow.hidden = false;
    expRow.hidden = false;
    $('det-delegated').value = t.delegatedTo||'';
    $('det-expected').value = t.expectedDate||'';
  }else{
    delRow.hidden = true;
    expRow.hidden = true;
  }
  // area
  $('det-area').value = t.area;
  // project
  $('det-project').value = t.project||'';
  // parent
  const parentSec = $('det-parent-section');
  if(t.parentId){
    const p = findTask(t.parentId);
    if(p){
      parentSec.style.display='';
      $('det-parent-link').textContent = p.title;
      $('det-parent-link').onclick = ()=>{ openDetail(p.id); };
    }else{
      parentSec.style.display='none';
    }
  }else{
    parentSec.style.display='none';
  }
  // subtasks
  const subSec = $('det-subtask-section');
  subSec.hidden = false;
  $('det-subtask-count').textContent = (t.subtasks||[]).length;
  renderDetailSubtasks(t);
  // promote button
  const promoteBtn = $('det-promote-project');
  promoteBtn.style.display = t.parentId ? 'none' : '';
  // est pomo
  $('det-estpomo').value = t.estimatedPomodoros||0;
  // notes
  $('det-notes').value = t.notes||'';
  // pomo count
  $('det-pomo-count').textContent = t.completedPomodoros||0;
  // created
  $('det-created').textContent = new Date(t.createdAt).toLocaleString('zh-CN');
  // restore standard task handlers (in case openProjectDetail overrode them)
  $('det-save').onclick = detSaveTask;
  $('det-delete').onclick = detDeleteTask;
  // show
  $('detail-panel').hidden = false;
  $('detail-panel').classList.add('show');
  $('detail-overlay').hidden = false;
  setTimeout(()=>$('detail-overlay').classList.add('show'), 10);
}

function renderDetailSubtasks(t){
  const list = $('det-subtask-list');
  list.innerHTML = '';
  (t.subtasks||[]).forEach(st=>{
    const stt = findTask(st.id);
    if(!stt) return;
    const div = document.createElement('div');
    div.className='det-subtask';
    const checked = stt.completed;
    div.innerHTML = `<span class="st-check ${checked?'checked':''}">${checked?'✓':''}</span><span>${escHtml(stt.title)}</span>`;
    div.onclick = ()=>{
      toggleTaskComplete(stt.id);
      openDetail(t.id);
    };
    list.appendChild(div);
  });
}

$('det-subtask-add-btn').onclick = ()=>{
  const input = $('det-subtask-input');
  const title = input.value.trim();
  if(!title || !detailTaskId) return;
  addSubtask(detailTaskId, title);
  input.value='';
  openDetail(detailTaskId);
  renderTasks();
};

$('det-subtask-input').onkeydown = e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    $('det-subtask-add-btn').click();
  }
};

$('det-tag-input').onkeydown = e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    const val = e.target.value.trim();
    if(!val || !detailTaskId) return;
    const t = findTask(detailTaskId);
    if(!t) return;
    if(!t.tags) t.tags=[];
    if(!t.tags.includes(val)){
      t.tags.push(val);
      saveState();
    }
    e.target.value='';
    openDetail(detailTaskId);
    renderTasks();
  }
};

function detSaveTask(){
  if(!detailTaskId) return;
  const t = findTask(detailTaskId);
  if(!t) return;
  const title = $('det-title').value.trim();
  if(!title){ toast('标题不能为空'); return; }
  t.title = title;
  const activePrio = qs('#det-prio-group .prio-btn.active');
  if(activePrio) t.priority = parseInt(activePrio.dataset.prio);
  t.due = $('det-due').value ? new Date($('det-due').value).toISOString() : null;
  t.area = $('det-area').value;
  t.project = $('det-project').value;
  t.estimatedPomodoros = parseInt($('det-estpomo').value) || 0;
  t.notes = $('det-notes').value;
  if(t.area==='waiting'){
    t.delegatedTo = $('det-delegated').value.trim() || null;
    t.expectedDate = $('det-expected').value || null;
  }
  saveState();
  closeDetail();
  renderTasks();
  updateAllViews();
}

function detDeleteTask(){
  if(!detailTaskId) return;
  if(!confirm('确定删除该任务？')) return;
  deleteTask(detailTaskId);
  closeDetail();
  renderTasks();
  updateDoneToday();
}

$('det-save').onclick = detSaveTask;
$('det-delete').onclick = detDeleteTask;

$('det-start-timer').onclick = ()=>{
  if(!detailTaskId) return;
  // set timer mode to work and start
  setTimerMode('work');
  if(S.timer.phase==='running'){
    pauseTimer();
  }
  S.timer.currentTaskId = detailTaskId;
  S.timer.remaining = S.settings.work*60;
  S.timer.total = S.settings.work*60;
  startTimer();
  updateActiveTaskDisplay();
  closeDetail();
};

$('det-promote-project').onclick = ()=>{
  if(!detailTaskId) return;
  const t = findTask(detailTaskId);
  if(!t || t.area==='projects') return;
  // create a project with this task name
  const projName = t.title;
  if(S.projects.find(p=>p.name===projName)){
    toast('项目已存在');
    return;
  }
  const colors = ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3498db','#9b59b6','#1abc9c','#e91e63'];
  S.projects.push({id:uid(), name:projName, color:colors[S.projects.length%colors.length], outcome:'', status:'active', nextActionId:null});
  t.area='projects';
  t.project=projName;
  saveState();
  openDetail(t.id);
  renderProjects();
  renderTasks();
  toast('已转为项目');
};

let closeDetailTimer = null;

function closeDetail(){
  $('detail-panel').classList.remove('show');
  $('detail-overlay').classList.remove('show');
  if(closeDetailTimer) clearTimeout(closeDetailTimer);
  closeDetailTimer = setTimeout(()=>{
    $('detail-panel').hidden = true;
    $('detail-overlay').hidden = true;
    closeDetailTimer = null;
  }, 250);
  detailTaskId = null;
}

$('detail-close').onclick = closeDetail;
$('detail-overlay').onclick = closeDetail;

/* ============= TIMER CLICK HANDLERS ============= */
$('btn-start').onclick = ()=>{
  if(S.timer.phase==='idle'){
    // if mode is work and no active task and there's a last completed, suggest resumption
    if(S.timer.mode==='work' && !S.timer.currentTaskId && S.lastCompletedTaskId){
      const lastTask = findTask(S.lastCompletedTaskId);
      if(lastTask && !lastTask.completed){
        // auto-assign last task
        S.timer.currentTaskId = lastTask.id;
        saveState();
        updateActiveTaskDisplay();
      }
    }
    startTimer();
    if(S.settings.focusMode) applyFocusMode(true);
  }else if(S.timer.phase==='running'){
    pauseTimer();
    if(S.settings.focusMode) applyFocusMode(false);
  }else if(S.timer.phase==='paused'){
    resumeTimer();
    if(S.settings.focusMode) applyFocusMode(true);
  }else if(S.timer.phase==='finished'){
    handleTimerFinish();
    return;
  }
  updateActiveTaskDisplay();
};

/* timer digits click — open time picker */
$('timer-digits').onclick = ()=>{
  if(S.timer.phase==='running') return;
  $('modal-time-picker').hidden = false;
};

$('time-picker-cancel').onclick = ()=>{ $('modal-time-picker').hidden = true; };

$('modal-time-picker').onclick = e=>{
  if(e.target === $('modal-time-picker')) $('modal-time-picker').hidden = true;
};

qsa('.time-preset').forEach(b=>{
  b.onclick = ()=>{
    qsa('.time-preset').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const mins = parseInt(b.dataset.min);
    S.timer.remaining = mins*60;
    S.timer.total = mins*60;
    updateTimerDisplay();
    $('modal-time-picker').hidden = true;
    toast('已设为 '+mins+' 分钟');
  };
});

$('time-custom-confirm').onclick = ()=>{
  const mins = parseInt($('time-custom-input').value);
  if(!mins || mins<1 || mins>90) return;
  S.timer.remaining = mins*60;
  S.timer.total = mins*60;
  updateTimerDisplay();
  $('modal-time-picker').hidden = true;
  toast('已设为 '+mins+' 分钟');
};

$('btn-reset').onclick = ()=>{
  if(S.timer.phase==='running' || S.timer.phase==='paused'){
    if(S.settings.interruptConfirm && S.timer.mode==='work'){
      const elapsed = S.timer.total - S.timer.remaining;
      $('abandon-minutes').textContent = Math.round(elapsed/60);
      $('modal-abandon-confirm').hidden = false;
      return;
    }
  }
  resetTimer();
};

qsa('.mode-btn').forEach(b=>{
  b.onclick = ()=>{
    setTimerMode(b.dataset.mode);
  };
});

/* ============= FOCUS MODE ============= */
function applyFocusMode(on){
  const wrap = qs('.work-view');
  if(!wrap) return;
  if(on && S.settings.focusMode && S.timer.mode==='work'){
    wrap.classList.add('focus-mode');
  }else{
    wrap.classList.remove('focus-mode');
  }
}

/* ============= REST GUIDE ============= */
function showRestGuide(){
  $('rest-guide-overlay').hidden = false;
}

$('rest-options').onclick = e=>{
  const btn = e.target.closest('.rest-opt-btn');
  if(!btn) return;
  const type = btn.dataset.rest;
  const instr = {
    breathe: '🧘 闭眼深呼吸\n\n1. 慢慢吸气 4 秒\n2. 屏住呼吸 4 秒\n3. 缓缓呼气 6 秒\n4. 重复 5 次\n\n完成后可以自由休息',
    stretch: '🤸 站立伸展\n\n1. 双手向上伸直，拉伸全身 30秒\n2. 左右侧弯腰各 30秒\n3. 转动脖子，顺时针逆时针各 3圈\n\n完成后可以自由休息',
    nature: '🌿 远眺放松\n\n1. 走到窗边或阳台\n2. 眺望远方至少 20秒\n3. 注意绿色的植物或开阔的景色\n\n完成后可以自由休息',
    free: '自由休息，记得设定休息时长'
  };
  $('rest-instruction').textContent = instr[type] || instr.free;
  $('rest-timer-display').hidden = false;
};

$('rest-guide-overlay').onclick = e=>{
  if(e.target === $('rest-guide-overlay')){
    $('rest-guide-overlay').hidden = true;
  }
};

/* ============= CELEBRATION ============= */
function showCelebration(){
  if(!S.settings.celebration) return;
  const overlay = $('celebration-overlay');
  overlay.hidden = false;
  const container = qs('.confetti-container');
  container.innerHTML = '';
  const colors = ['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22','#1abc9c','#e91e63'];
  for(let i=0;i<80;i++){
    const c = document.createElement('div');
    c.className='confetti';
    c.style.left=Math.random()*100+'%';
    c.style.background=colors[Math.floor(Math.random()*colors.length)];
    c.style.width=(6+Math.random()*8)+'px';
    c.style.height=(6+Math.random()*8)+'px';
    c.style.animationDuration=(2+Math.random()*3)+'s';
    c.style.animationDelay=Math.random()*1.5+'s';
    container.appendChild(c);
  }
  setTimeout(()=>{
    overlay.hidden = true;
  }, 4000);
}

/* ============= DAILY LAUNCH ============= */
function showDailyLaunch(){
  const today = todayStr();
  // show yesterday's stats
  const y = new Date(); y.setDate(y.getDate()-1);
  const yStr = dateStr(y);
  const yData = S.pomodoroHistory[yStr];
  if(yData){
    $('dl-y-pomo').textContent = yData.count;
    $('dl-yesterday').hidden = false;
  }else{
    $('dl-yesterday').hidden = true;
  }

  // show focus list
  renderDlFocus();

  // inbox hint
  const inboxCount = S.tasks.filter(t=>t.area==='inbox' && !t.completed).length;
  if(inboxCount > 0){
    $('dl-inbox-count').textContent = inboxCount;
    $('dl-inbox-hint').hidden = false;
  }else{
    $('dl-inbox-hint').hidden = true;
  }

  $('daily-launch-overlay').hidden = false;
}

function renderDlFocus(){
  const list = $('dl-focus-list');
  list.innerHTML = '';
  S.dailyFocusTasks.forEach((item,i)=>{
    const div = document.createElement('div');
    div.className='dl-focus-item';
    div.innerHTML = `<span>${i+1}. ${escHtml(item.title)}</span><span class="dfi-del" data-idx="${i}">✕</span>`;
    div.querySelector('.dfi-del').onclick = ()=>{
      const taskIdx = S.tasks.findIndex(t=>t.id===item.id);
      if(taskIdx>=0 && !S.tasks[taskIdx].completed) S.tasks.splice(taskIdx,1);
      S.dailyFocusTasks.splice(i,1);
      saveState();
      renderDlFocus();
      renderTasks();
    };
    list.appendChild(div);
  });
}

$('dl-quick-add-btn').onclick = ()=>{
  const input = $('dl-quick-input');
  const val = input.value.trim();
  if(!val) return;
  if(S.dailyFocusTasks.length >= 3){
    toast('最多选择 3 个焦点任务');
    return;
  }
  let task = S.tasks.find(t=>t.title===val && !t.completed);
  if(!task) task = createTask(val);
  S.dailyFocusTasks.push({id: task.id, title: val});
  input.value='';
  saveState();
  renderDlFocus();
};

$('dl-quick-input').onkeydown = e=>{
  if(e.key==='Enter'){ e.preventDefault(); $('dl-quick-add-btn').click(); }
};

$('dl-skip').onclick = ()=>{
  $('daily-launch-overlay').hidden = true;
};

$('dl-start').onclick = ()=>{
  // auto-focus first focus task
  if(S.dailyFocusTasks.length > 0){
    const existing = S.tasks.find(t=>t.id===S.dailyFocusTasks[0].id && !t.completed);
    if(existing){
      S.timer.currentTaskId = existing.id;
      saveState();
      updateActiveTaskDisplay();
    }
  }
  $('daily-launch-overlay').hidden = true;
  toast('今天也要加油！🍅');
};

/* ============= DAILY REVIEW ============= */
function showDailyReview(){
  const today = todayStr();
  const data = S.pomodoroHistory[today] || {count:0,focusMins:0};
  $('dr-pomo').textContent = data.count;
  $('dr-mins').textContent = Math.round(data.focusMins);

  // compare with yesterday
  const y = new Date(); y.setDate(y.getDate()-1);
  const yStr = dateStr(y);
  const yData = S.pomodoroHistory[yStr];
  if(yData){
    const diff = data.count - yData.count;
    $('dr-diff-pomo').textContent = (diff>=0?'+':'')+diff;
    $('dr-compare').hidden = false;
  }else{
    $('dr-compare').hidden = true;
  }

  // suggestion
  const unfinished = S.tasks.filter(t=>!t.completed && (t.area==='next'||t.area==='inbox'));
  let suggestion = '今天完成了 '+data.count+' 个番茄，共 '+Math.round(data.focusMins)+' 分钟。';
  if(unfinished.length > 0){
    suggestion += ' 明天可以优先处理 "';
    suggestion += unfinished[0].title;
    suggestion += '" 等 ' + unfinished.length + ' 个待办。';
  }else{
    suggestion += ' 所有任务都完成了，好好休息！';
  }
  $('dr-suggestion').textContent = suggestion;

  $('daily-review-overlay').hidden = false;
}

$('dr-skip').onclick = ()=>{ $('daily-review-overlay').hidden = true; };
$('dr-done').onclick = ()=>{ $('daily-review-overlay').hidden = true; };

/* ============= RESUMPTION BAR ============= */
function checkTaskResumption(){
  const bar = $('resumption-bar');
  if(!bar) return;
  if(!S.lastCompletedTaskId) return;
  const task = findTask(S.lastCompletedTaskId);
  if(!task || task.completed){
    bar.hidden = true;
    return;
  }
  $('resumption-task-name').textContent = task.title;
  $('resumption-resume').onclick = ()=>{
    S.timer.currentTaskId = task.id;
    saveState();
    updateActiveTaskDisplay();
    if(S.timer.mode!=='work') setTimerMode('work');
    S.timer.remaining = S.settings.work*60;
    S.timer.total = S.settings.work*60;
    startTimer();
    bar.hidden = true;
  };
  $('resumption-dismiss').onclick = ()=>{
    bar.hidden = true;
  };
  bar.hidden = false;
}

/* ============= QUICK START 5-MIN ============= */
function showQuickStartContinue(taskName){
  $('qs-task-name').textContent = taskName;
  $('modal-quickstart-continue').hidden = false;
}

$('qs-continue').onclick = ()=>{
  $('modal-quickstart-continue').hidden = true;
  S.timer.remaining = S.settings.work*60;
  S.timer.total = S.settings.work*60;
  startTimer();
};

$('qs-stop').onclick = ()=>{
  $('modal-quickstart-continue').hidden = true;
};

/* ============= CALENDAR ============= */
let calViewDate = new Date();
let calMode = 'month';

function renderCalendar(){
  $('cal-month').textContent = calViewDate.getFullYear()+'年'+(calViewDate.getMonth()+1)+'月';
  if(calMode==='month'){
    renderMonthGrid();
    $('cal-dayview').style.display='none';
    $('cal-day-tasks').hidden=true;
  }else{
    $('cal-dayview').style.display='';
    $('cal-grid-wrap').style.display='none';
    renderDayView();
  }
}

function renderMonthGrid(){
  const grid = $('cal-grid');
  const year = calViewDate.getFullYear();
  const month = calViewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  grid.innerHTML = '';
  const today = todayStr();

  // previous month days
  for(let i=firstDay-1;i>=0;i--){
    const d = daysInPrev-i;
    const dt = new Date(year, month-1, d);
    const ds = dateStr(dt);
    const count = (S.pomodoroHistory[ds]||{}).count||0;
    const cell = document.createElement('div');
    cell.className='cal-day other-month';
    cell.textContent = d;
    if(count>0) cell.innerHTML += '<span class="cal-dot completed"></span>';
    cell.onclick = ()=>selectDate(dt);
    cell.ondblclick = (e)=>{ e.stopPropagation(); switchToDayView(dt); };
    grid.appendChild(cell);
  }

  // current month
  for(let d=1;d<=daysInMonth;d++){
    const dt = new Date(year, month, d);
    const ds = dateStr(dt);
    const count = (S.pomodoroHistory[ds]||{}).count||0;
    const cell = document.createElement('div');
    cell.className='cal-day';
    if(ds===today) cell.classList.add('today');
    cell.textContent = d;
    if(count>0){
      const dot = document.createElement('span');
      dot.className='cal-dot completed';
      cell.appendChild(dot);
    }
    cell.onclick = ()=>selectDate(dt);
    cell.ondblclick = (e)=>{ e.stopPropagation(); switchToDayView(dt); };
    grid.appendChild(cell);
  }

  // next month days (fill rest of grid)
  const totalCells = firstDay+daysInMonth;
  const remaining = (7 - totalCells % 7) % 7;
  if(remaining>0){
    // need a separate row
    for(let d=1;d<=remaining;d++){
      const dt = new Date(year, month+1, d);
      const ds = dateStr(dt);
      const count = (S.pomodoroHistory[ds]||{}).count||0;
      const cell = document.createElement('div');
      cell.className='cal-day other-month';
      cell.textContent = d;
      if(count>0) cell.innerHTML += '<span class="cal-dot completed"></span>';
      cell.onclick = ()=>selectDate(dt);
      cell.ondblclick = (e)=>{ e.stopPropagation(); switchToDayView(dt); };
      grid.appendChild(cell);
    }
  }
}

function switchToDayView(dt){
  calViewDate = new Date(dt);
  calMode = 'day';
  $('cal-view-month').classList.remove('active');
  $('cal-view-day').classList.add('active');
  $('cal-grid-wrap').style.display='none';
  $('cal-dayview').style.display='';
  renderCalendar();
}

function selectDate(dt){
  const ds = dateStr(dt);
  // show tasks for that day
  const tasks = S.tasks.filter(t=>{
    if(t.completed && t.completedAt && t.completedAt.startsWith(ds)) return true;
    if(t.due && new Date(t.due).toDateString()===dt.toDateString()) return true;
    return false;
  });
  $('cal-day-title').textContent = dt.getFullYear()+'年'+(dt.getMonth()+1)+'月'+dt.getDate()+'日';
  const list = $('cal-task-list');
  list.innerHTML = '';
  tasks.forEach(t=>{
    const item = document.createElement('li');
    item.className='task-item' + (t.completed?' completed':'');
    item.innerHTML = `<span class="task-text">${escHtml(t.title)}</span>`;
    item.onclick = ()=>{ openDetail(t.id); };
    list.appendChild(item);
  });
  $('cal-day-tasks').hidden = false;
}

function renderDayView(){
  $('cal-day-date-label').textContent = calViewDate.toLocaleDateString('zh-CN', {year:'numeric',month:'long',day:'numeric',weekday:'long'});
  const timeline = $('cal-dayview-timeline');
  timeline.innerHTML = '';
  const ds = dateStr(calViewDate);
  const dayTasks = S.tasks.filter(t=>{
    if(t.completed && t.completedAt && t.completedAt.startsWith(ds)) return true;
    if(t.due && new Date(t.due).toDateString()===calViewDate.toDateString()) return true;
    return false;
  });
  // show time blocks
  for(let h=6;h<23;h++){
    const slot = document.createElement('div');
    slot.className='cal-time-slot';
    slot.innerHTML = `<span class="time-label">${String(h).padStart(2,'0')}:00</span>`;
    // find tasks for this hour
    const hourStr = String(h).padStart(2,'0');
    const ts = dayTasks.filter(t=>t.completedAt && t.completedAt.includes('T'+hourStr));
    ts.forEach(t=>{
      const span = document.createElement('span');
      span.className='event-indicator';
      span.textContent = t.title;
      slot.appendChild(span);
    });
    timeline.appendChild(slot);
  }
}

$('cal-prev').onclick = ()=>{
  if(calMode==='month'){
    calViewDate.setMonth(calViewDate.getMonth()-1);
  }else{
    calViewDate.setDate(calViewDate.getDate()-1);
  }
  renderCalendar();
};

$('cal-next').onclick = ()=>{
  if(calMode==='month'){
    calViewDate.setMonth(calViewDate.getMonth()+1);
  }else{
    calViewDate.setDate(calViewDate.getDate()+1);
  }
  renderCalendar();
};

$('cal-today-btn').onclick = ()=>{
  calViewDate = new Date();
  renderCalendar();
};

$('cal-view-month').onclick = ()=>{
  calMode='month';
  $('cal-view-month').classList.add('active');
  $('cal-view-day').classList.remove('active');
  $('cal-grid-wrap').style.display='';
  $('cal-dayview').style.display='none';
  renderCalendar();
};

$('cal-view-day').onclick = ()=>{
  calMode='day';
  $('cal-view-day').classList.add('active');
  $('cal-view-month').classList.remove('active');
  $('cal-grid-wrap').style.display='none';
  $('cal-dayview').style.display='';
  renderCalendar();
};

$('cal-day-prev').onclick = ()=>{ calViewDate.setDate(calViewDate.getDate()-1); renderDayView(); };
$('cal-day-next').onclick = ()=>{ calViewDate.setDate(calViewDate.getDate()+1); renderDayView(); };

/* ============= STATS ============= */
function renderStats(){
  const today = todayStr();
  const td = S.pomodoroHistory[today] || {count:0,focusMins:0};
  // week
  let weekCount = 0;
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // Mon=1...Sun=7
  for(let i=0;i<7;i++){
    const d = new Date(now);
    d.setDate(d.getDate()-i);
    const ds = dateStr(d);
    const c = (S.pomodoroHistory[ds]||{}).count||0;
    weekCount += c;
  }
  // total
  let total = 0;
  Object.values(S.pomodoroHistory).forEach(d=>{ total+=d.count; });

  $('s-today-count').textContent = td.count;
  $('s-today-mins').textContent = Math.round(td.focusMins)+'m';
  $('s-week-count').textContent = weekCount;
  $('s-total-count').textContent = total;

  // habit streak
  renderStreak();
  // heatmap
  renderHeatmap();
  // tags
  renderTagBars();
  // daily focus
  renderDailyFocus();
  // chart
  renderWeeklyChart();
}

function renderStreak(){
  let current = 0;
  let longest = 0;
  let temp = 0;
  const d = new Date();
  const today = todayStr();

  // current streak: consecutive days ending today with data
  if(S.pomodoroHistory[today] && S.pomodoroHistory[today].count>0){
    current = 1;
    temp = 1;
  }

  // go backwards counting consecutive days
  for(let i=1;i<366;i++){
    const p = new Date(d);
    p.setDate(p.getDate()-i);
    const ds = dateStr(p);
    const data = S.pomodoroHistory[ds];
    if(data && data.count>0){
      temp++;
      // current only counts if today has data AND chain is unbroken
      if(current>0) current++;
    }else{
      if(temp>longest) longest=temp;
      temp=0;
      if(i>1) break;
    }
  }
  if(temp>longest) longest=temp;
  // if today has no data, current streak is 0
  if(!S.pomodoroHistory[today] || S.pomodoroHistory[today].count===0) current=0;

  $('h-current').textContent = current;
  $('h-longest').textContent = longest;

  // 66-day goal
  const goalFill = $('h-goal-fill');
  const goalText = $('h-goal-text');
  const pct = Math.min(100, (current/66)*100);
  goalFill.style.width = pct+'%';
  goalText.textContent = current+'/66';

  const badge = $('streak-badge');
  badge.hidden = current===0;
  $('streak-num').textContent = current;
}

function renderHeatmap(){
  const grid = $('habit-heatmap');
  grid.innerHTML = '';
  const now = new Date();
  // show last 12 weeks (84 days)
  const days = 84;
  for(let i=days-1;i>=0;i--){
    const d = new Date(now);
    d.setDate(d.getDate()-i);
    const ds = dateStr(d);
    const data = S.pomodoroHistory[ds];
    const count = data ? data.count : 0;
    const cell = document.createElement('div');
    cell.className='habit-cell';
    const level = count===0 ? 0 : count===1 ? 1 : count<=3 ? 2 : count<=6 ? 3 : 4;
    cell.dataset.level = level;
    cell.dataset.title = ds + ': ' + count + (count>0?' 个番茄':'');
    grid.appendChild(cell);
  }
}

function renderTagBars(){
  const container = $('tag-bars');
  container.innerHTML = '';
  const tagCount = {};
  S.tasks.forEach(t=>{
    if(t.completed){
      (t.tags||[]).forEach(tag=>{
        tagCount[tag] = (tagCount[tag]||0)+1;
      });
    }
  });
  const sorted = Object.entries(tagCount).sort((a,b)=>b[1]-a[1]);
  const max = sorted.length>0 ? sorted[0][1] : 1;
  sorted.forEach(([tag,count])=>{
    const row = document.createElement('div');
    row.className='tag-bar-row';
    row.innerHTML = `<span class="tag-name">#${escHtml(tag)}</span><div class="tag-bar"><div class="tag-bar-fill" style="width:${(count/max)*100}%"></div></div><span class="tag-count">${count}</span>`;
    container.appendChild(row);
  });
}

function renderDailyFocus(){
  const section = $('daily-focus-section');
  const list = $('df-list');
  list.innerHTML = '';
  if(S.dailyFocusTasks.length===0){
    section.hidden = true;
    return;
  }
  section.hidden = false;
  const today = todayStr();
  const completedToday = S.tasks.filter(t=>t.completed && t.completedAt && t.completedAt.startsWith(today)).length;
  $('df-count').textContent = Math.min(completedToday, S.dailyFocusTasks.length)+'/'+S.dailyFocusTasks.length;

  // check each focus task
  let doneCount = 0;
  S.dailyFocusTasks.forEach(item=>{
    const existing = S.tasks.find(t=>t.title===item.title && t.completed && t.completedAt && t.completedAt.startsWith(today));
    const div = document.createElement('div');
    div.className='df-item';
    const checked = !!existing;
    if(checked) doneCount++;
    div.innerHTML = `<span class="st-check ${checked?'checked':''}">${checked?'✓':''}</span><span>${escHtml(item.title)}</span>`;
    list.appendChild(div);
  });

  // progress
  const progress = $('focus-progress');
  progress.hidden = false;
  $('focus-progress-fill').style.width = (doneCount/S.dailyFocusTasks.length*100)+'%';
  $('focus-progress-text').textContent = doneCount+'/'+S.dailyFocusTasks.length;
}

function renderWeeklyChart(){
  const canvas = $('chart-weekly');
  if(!canvas) return;
  if(chartInstance){
    chartInstance.destroy();
    chartInstance = null;
  }
  if(typeof Chart === 'undefined') return;
  const now = new Date();
  const labels = [];
  const data = [];
  for(let i=6;i>=0;i--){
    const d = new Date(now);
    d.setDate(d.getDate()-i);
    labels.push((d.getMonth()+1)+'/'+d.getDate());
    const ds = dateStr(d);
    data.push((S.pomodoroHistory[ds]||{}).count||0);
  }
  chartInstance = new Chart(canvas, {
    type:'bar',
    data:{
      labels,
      datasets:[{
        label:'番茄数',
        data,
        backgroundColor:'rgba(231,76,60,0.6)',
        borderColor:'#e74c3c',
        borderWidth:1,
        borderRadius:4,
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{
        y:{beginAtZero:true,ticks:{stepSize:1},grid:{color:'rgba(0,0,0,0.06)'}},
        x:{grid:{display:false}}
      }
    }
  });
}

/* ============= EXPORT / IMPORT ============= */
$('btn-export').onclick = ()=>{
  const blob = new Blob([JSON.stringify(S,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url;
  a.download='pomotodo-backup-'+todayStr()+'.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('数据已导出');
};

$('btn-import').onchange = e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev)=>{
    try{
      const data = JSON.parse(ev.target.result);
      if(!data || !data.version) throw new Error('Invalid format');
      S = data;
      saveState();
      toast('数据已导入');
      initApp();
    }catch(err){
      toast('导入失败：文件格式不正确');
    }
  };
  reader.readAsText(file);
  e.target.value='';
};

/* ============= SETTINGS ============= */
function loadSettings(){
  const s = S.settings;
  $('opt-work').value = s.work;
  $('opt-short').value = s.shortBreak;
  $('opt-long').value = s.longBreak;
  $('opt-interval').value = s.longBreakInterval;
  $('opt-auto-break').checked = s.autoBreak;
  $('opt-auto-work').checked = s.autoWork;
  $('opt-rest-guide').checked = s.restGuide;
  $('opt-focus-mode').checked = s.focusMode;
  $('opt-celebration').checked = s.celebration;
  $('opt-interrupt-confirm').checked = s.interruptConfirm;
  $('opt-sound').checked = s.sound;
  $('opt-volume').value = s.volume;
  $('range-val').textContent = Math.round(s.volume*100)+'%';
  $('opt-notify').checked = s.notify;
  $('opt-wakelock').checked = s.wakelock;
  // theme
  applyTheme(s.theme);
  qsa('.t-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.theme===s.theme);
  });
}

$('opt-volume').oninput = function(){
  S.settings.volume = parseFloat(this.value);
  $('range-val').textContent = Math.round(this.value*100)+'%';
  saveState();
};

$('opt-notify').onchange = function(){
  S.settings.notify = this.checked;
  if(this.checked && Notification.permission==='default'){
    Notification.requestPermission();
  }
  saveState();
};

function bindSettingToggle(id, key){
  const el = $(id);
  if(!el) return;
  el.onchange = function(){
    S.settings[key] = this.checked;
    saveState();
    applySettings();
  };
}

bindSettingToggle('opt-auto-break','autoBreak');
bindSettingToggle('opt-auto-work','autoWork');
bindSettingToggle('opt-rest-guide','restGuide');
bindSettingToggle('opt-focus-mode','focusMode');
bindSettingToggle('opt-celebration','celebration');
bindSettingToggle('opt-interrupt-confirm','interruptConfirm');
bindSettingToggle('opt-sound','sound');
bindSettingToggle('opt-wakelock','wakelock');

const settingsKeyMap = {work:'work', short:'shortBreak', long:'longBreak', interval:'longBreakInterval'};
['opt-work','opt-short','opt-long','opt-interval'].forEach(id=>{
  $(id).onchange = function(){
    const key = settingsKeyMap[id.replace('opt-','')];
    const val = parseInt(this.value);
    if(val<1) return;
    S.settings[key] = val;
    saveState();
    if(S.timer.phase==='idle'){
      S.timer.remaining = S.settings[S.timer.mode]*60;
      S.timer.total = S.settings[S.timer.mode]*60;
      updateTimerDisplay();
    }
  };
});

qsa('.t-btn').forEach(b=>{
  b.onclick = ()=>{
    S.settings.theme = b.dataset.theme;
    applyTheme(S.settings.theme);
    qsa('.t-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    saveState();
  };
});

function applyTheme(theme){
  document.body.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content = theme==='dark' ? '#1a1a2e' : '#e74c3c';
}

$('btn-test-sound').onclick = ()=>{ playSound(); };

/* ============= PROJECTS ============= */
function renderProjects(){
  const list = $('project-list');
  list.innerHTML = '';
  S.projects.forEach((p,i)=>{
    const div = document.createElement('div');
    div.className='project-item';
    const statusIcon = p.status==='complete'?'✅':p.status==='someday'?'💭':'📁';
    div.innerHTML = `<span class="proj-color" style="background:${p.color}"></span><span class="proj-name">${escHtml(p.name)} ${p.outcome?'<span style="font-size:11px;color:var(--text2)">— '+escHtml(p.outcome)+'</span>':''}</span><span style="font-size:11px;color:var(--text2)">${statusIcon}</span><span class="proj-del" data-idx="${i}">✕</span>`;
    div.querySelector('.proj-del').onclick = ()=>{
      if(!confirm('删除项目 "'+p.name+'"？关联的任务将保留但项目字段会清空。')) return;
      S.tasks.forEach(t=>{ if(t.project===p.name) t.project=''; });
      S.projects.splice(i,1);
      saveState();
      renderProjects();
      renderTasks();
    };
    div.onclick = (e)=>{
      if(e.target.closest('.proj-del')) return;
      const newOutcome = prompt('项目成果（期望结果）：', p.outcome||'');
      if(newOutcome!==null) p.outcome = newOutcome;
      const newStatus = prompt('状态：active / complete / someday', p.status);
      if(newStatus && ['active','complete','someday'].includes(newStatus)) p.status = newStatus;
      saveState();
      renderProjects();
      renderTasks();
    };
    list.appendChild(div);
  });

  // fill project selects
  const selects = [$('qi-project'), $('det-project')];
  selects.forEach(sel=>{
    if(!sel) return;
    const current = sel.value;
    sel.innerHTML = '<option value="">无项目</option>';
    S.projects.forEach(p=>{
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = p.name;
      sel.appendChild(opt);
    });
    sel.value = current;
  });
}

$('btn-add-project').onclick = ()=>{
  const name = $('project-new-name').value.trim();
  if(!name){ toast('请输入项目名称'); return; }
  if(S.projects.find(p=>p.name===name)){ toast('项目已存在'); return; }
  const outcome = prompt('期望成果（可选，按回车跳过）：') || '';
  const color = $('project-new-color').value;
  S.projects.push({id:uid(), name, color, outcome, status:'active', nextActionId:null});
  saveState();
  renderProjects();
  $('project-new-name').value='';
  toast('项目已添加');
};

/* ============= SETTINGS RESET ============= */
$('btn-reset-sett').onclick = ()=>{
  if(!confirm('恢复所有设置为默认值？')) return;
  Object.assign(S.settings, defaultSettings);
  saveState();
  loadSettings();
  toast('设置已重置');
};

$('btn-clear-all').onclick = ()=>{
  if(!confirm('确定清除全部数据？此操作不可恢复。')) return;
  if(!confirm('再次确认：所有任务、统计、设置都将被清除。')) return;
  localStorage.removeItem(STORAGE_KEY);
  S = freshState();
  saveState();
  initApp();
  toast('数据已清除');
};

/* ============= ONBOARDING ============= */
const onboardingSteps = [
  { title:'🍅 欢迎使用 Pomotodo', desc:'番茄工作法与 GTD 的结合，帮你更高效地完成任务。' },
  { title:'⏱️ 番茄钟计时', desc:'设置 25 分钟专注时间，完成后休息 5 分钟。每个番茄都是一次深度工作。' },
  { title:'📋 GTD 任务管理', desc:'收件箱 → 下一步 → 项目 → 将来/也许 → 归档。用 #标签 !优先级 @截止日期 快速输入。' },
  { title:'📊 统计与习惯', desc:'追踪每日番茄数、连续天数、66 天习惯目标。图表和热力图让你直观看到进步。' },
  { title:'🔥 打造习惯', desc:'连续完成 66 天的番茄钟，培养深度工作的习惯。开始你的第一天吧！' },
];
let onboardingStep = 0;

function showOnboarding(){
  if(!S.showOnboarding) return;
  $('onboarding').hidden = false;
  renderOnboardingStep();
}

function renderOnboardingStep(){
  const step = onboardingSteps[onboardingStep];
  $('onboarding-body').innerHTML = `<h2>${step.title}</h2><p>${step.desc}</p>`;
  // dots
  const dotsEl = $('onboarding-dots');
  dotsEl.innerHTML = '';
  onboardingSteps.forEach((_,i)=>{
    const dot = document.createElement('span');
    dot.className='onboarding-dot'+(i===onboardingStep?' active':'');
    dotsEl.appendChild(dot);
  });
  const nextBtn = $('onboarding-next');
  if(onboardingStep >= onboardingSteps.length-1){
    nextBtn.textContent = '🚀 开始使用';
  }else{
    nextBtn.textContent = '下一步 →';
  }
}

$('onboarding-next').onclick = ()=>{
  onboardingStep++;
  if(onboardingStep >= onboardingSteps.length){
    finishOnboarding();
  }else{
    renderOnboardingStep();
  }
};

$('onboarding-skip').onclick = finishOnboarding;

function finishOnboarding(){
  S.showOnboarding = false;
  saveState();
  $('onboarding').hidden = true;
  showDailyLaunch();
}

/* ============= NAVIGATION ============= */
function navigateTo(view){
  qsa('.view').forEach(v=>v.classList.remove('active'));
  qsa('.nav-btn').forEach(b=>b.classList.remove('active'));
  const target = $('view-'+view);
  if(target) target.classList.add('active');
  const navBtn = qs(`.nav-btn[data-view="${view}"]`);
  if(navBtn) navBtn.classList.add('active');

  if(view==='stats') renderStats();
  if(view==='calendar') renderCalendar();
  if(view==='work') applyFocusMode(S.timer.phase==='running');
}

qsa('.nav-btn').forEach(b=>{
  b.onclick = ()=>{
    navigateTo(b.dataset.view);
    closeDetail();
  };
});

/* ============= UPDATE ALL VIEWS ============= */
function updateAllViews(){
  renderTasks();
  updateDoneToday();
  updateActiveTaskDisplay();
  updateAreaCounts();
}

function updateDoneToday(){
  const list = $('done-list');
  if(!list) return;
  const todayItems = getTodayDone();
  $('done-count').textContent = todayItems.length;
  list.innerHTML = todayItems.slice(0,50).map(t=>
    '<li class="done-item"><span>'+escHtml(t.title)+'</span><span class="done-tag">#'+(t.tags&&t.tags[0]?t.tags[0]:'完成')+'</span></li>'
  ).join('');
}

/* ============= SETTINGS APPLY ============= */
function applySettings(){
  // nothing immediate needed
}

/* ============= KEYBOARD SHORTCUTS ============= */
document.addEventListener('keydown', e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
  const anyModalOpen = !$('modal-complete').hidden || !$('modal-abandon-confirm').hidden || !$('rest-guide-overlay').hidden || !$('daily-launch-overlay').hidden || !$('daily-review-overlay').hidden || !$('modal-quickstart-continue').hidden || !$('onboarding').hidden || !$('modal-clarify').hidden || !$('weekly-review-overlay').hidden;
  if(anyModalOpen && e.key!=='Escape') return;
  switch(e.key){
    case ' ':
      e.preventDefault();
      if(S.timer.phase==='running') pauseTimer();
      else if(S.timer.phase==='paused') resumeTimer();
      else if(S.timer.phase==='finished'){ handleTimerFinish(); }
      else startTimer();
      break;
    case 'r': case 'R':
      if(S.timer.phase!=='finished') resetTimer();
      break;
    case '1': setTimerMode('work'); break;
    case '2': setTimerMode('shortBreak'); break;
    case '3': setTimerMode('longBreak'); break;
    case 't': case 'T':
      {
        const modes=['work','shortBreak','longBreak'];
        const idx=modes.indexOf(S.timer.mode);
        setTimerMode(modes[(idx+1)%modes.length]);
      }
      break;
    case 's': case 'S':
      if(S.timer.phase==='running'||S.timer.phase==='paused'){
        if(S.settings.interruptConfirm && S.timer.mode==='work'){
          const elapsed=S.timer.total-S.timer.remaining;
          $('abandon-minutes').textContent=Math.round(elapsed/60);
          $('modal-abandon-confirm').hidden=false;
        }else if(S.timer.mode!=='work'){
          stopTimer();
          handleTimerFinish();
        }else{
          resetTimer();
        }
      }
      break;
    case 'n': case 'N':
      if(e.ctrlKey || e.metaKey){
        addFromInput();
      }else{
        $('task-input').focus();
      }
      break;
    case 'Escape':
      closeDetail();
      $('modal-complete').hidden = true;
      $('modal-abandon-confirm').hidden = true;
      $('rest-guide-overlay').hidden = true;
      $('daily-launch-overlay').hidden = true;
      $('daily-review-overlay').hidden = true;
      $('modal-quickstart-continue').hidden = true;
      $('onboarding').hidden = true;
      $('modal-clarify').hidden = true;
      $('weekly-review-overlay').hidden = true;
      clarifyTaskId = null;
      break;
  }
});

/* ============= DATA MIGRATION ============= */
function migrateData(){
  if(S.version===3){
    S.tasks.forEach(t=>{
      if(t.area==='archive') t.area='done';
      if(t.projectId===undefined) t.projectId=null;
      if(t.delegatedTo===undefined) t.delegatedTo=null;
      if(t.expectedDate===undefined) t.expectedDate=null;
      if(t.context===undefined) t.context='';
    });
    S.projects.forEach(p=>{
      if(!p.id) p.id=uid();
      if(p.outcome===undefined) p.outcome='';
      if(p.status===undefined) p.status='active';
      if(p.nextActionId===undefined) p.nextActionId=null;
    });
    S.version=4;
    saveState();
  }
}

/* ============= INIT ============= */
function initApp(){
  migrateData();
  // ensure S has proper timer object
  if(!S.timer) S.timer = freshState().timer;
  if(!S.pomodoroHistory) S.pomodoroHistory = {};
  if(!S.projects) S.projects = [];
  if(!S.dailyFocusTasks) S.dailyFocusTasks = [];
  if(!S.sessions) S.sessions = [];
  if(!S.settings) S.settings = {...defaultSettings};

  // set default fields for tasks and projects
  S.tasks.forEach(t=>{
    if(t.projectId===undefined) t.projectId=null;
    if(t.delegatedTo===undefined) t.delegatedTo=null;
    if(t.expectedDate===undefined) t.expectedDate=null;
    if(t.context===undefined) t.context='';
  });
  S.projects.forEach(p=>{
    if(!p.id) p.id=uid();
    if(p.outcome===undefined) p.outcome='';
    if(p.status===undefined) p.status='active';
    if(p.nextActionId===undefined) p.nextActionId=null;
  });

  // merge settings with defaults
  Object.keys(defaultSettings).forEach(k=>{
    if(S.settings[k]===undefined) S.settings[k]=defaultSettings[k];
  });

  // ensure metadata fields
  if(S._reviewedDates===undefined) S._reviewedDates={};
  if(S._lastVisitDate===undefined) S._lastVisitDate=null;
  if(S._lastWeeklyReviewDate===undefined) S._lastWeeklyReviewDate=null;

  // if timer was running on page unload, reset to idle (can't track wall-clock time)
  if(S.timer.phase==='running') S.timer.phase='idle';

  // ensure timer state
  if(!S.timer.mode) S.timer.mode='work';
  if(!S.timer.phase) S.timer.phase='idle';
  if(!S.timer.remaining) S.timer.remaining=S.settings.work*60;
  if(!S.timer.total) S.timer.total=S.settings.work*60;
  if(!S.timer.currentCycle) S.timer.currentCycle=1;

  // init timer worker
  initTimerWorker();

  // UI
  loadSettings();
  renderProjects();
  updateAllViews();
  updateTimerDisplay();
  updateTimerBtn();
  updateTimerModeClass();
  updateModeBtns();
  updateActiveTaskDisplay();

  // daily review (end of day check) - show if switching days
  checkDailyReview();

  // task resumption
  checkTaskResumption();

  // weekly review
  if(S._lastWeeklyReviewDate){
    const [wy,wm,wd] = S._lastWeeklyReviewDate.split('-').map(Number);
    const wl = new Date(wy,wm-1,wd);
    const diffDays = Math.floor((Date.now()-wl.getTime())/86400000);
    if(diffDays>=7) setTimeout(showWeeklyReview, 1200);
  }

  // onboarding or daily launch
  if(S.showOnboarding){
    showOnboarding();
  }else{
    // check if first visit today
    const today = todayStr();
    if(!S._lastVisitDate || S._lastVisitDate !== today){
      showDailyLaunch();
    }
  }
  S._lastVisitDate = todayStr();
  saveState();

  // navigation default
  navigateTo('work');
}

function checkDailyReview(){
  const today = todayStr();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  const yStr = dateStr(yesterday);
  const yData = S.pomodoroHistory[yStr];
  if(yData && yData.count > 0 && !S._reviewedDates) S._reviewedDates={};
  if(!S._reviewedDates) S._reviewedDates={};
  if(yData && yData.count > 0 && !S._reviewedDates[yStr]){
    S._reviewedDates[yStr] = true;
    saveState();
    setTimeout(showDailyReview, 500);
  }
}

/* ============= START ============= */
document.addEventListener('DOMContentLoaded', initApp);

// register service worker
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}

// handle visibility change — persist timer state when page hides
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden && timerWorker){
    saveState();
  }else if(!document.hidden){
    updateTimerDisplay();
    updateTimerBtn();
  }
});
// also save on unload
window.addEventListener('pagehide', ()=>{ saveState(); });

})();
