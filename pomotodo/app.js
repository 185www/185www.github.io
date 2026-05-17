/**
 * Pomotodo V3 — app.js (Bug-fix rewrite)
 * Timestamp-based timer (works with screen off)
 * Priority P1-P4, GTD areas, Calendar, Detail Panel, Quick Input
 */

// ==================== CONSTANTS ====================
var LS_KEY = 'pomotodo_v3';
var LS_KEY_V2 = 'pomotodo_v2';
var CIRC = 2 * Math.PI * 88;
var ONBOARD_KEY = 'pomotodo_onboarded_v3';

var DEFAULTS = {
  settings: {
    workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15,
    longBreakInterval: 4, autoStartBreak: true, autoStartWork: false,
    soundEnabled: true, soundVolume: 0.7, notificationsEnabled: false,
    wakeLockEnabled: false, theme: 'light'
  },
  tasks: [], sessions: [], projects: []
};

// ==================== STATE ====================
var S = loadState();

var currentArea = 'inbox';
var currentFilter = 'all';
var currentCalMonth = new Date().getMonth();
var currentCalYear = new Date().getFullYear();
var selectedCalDate = null;
var detailTaskId = null;
var wakeLockSentinel = null;
var quickInputVisible = false;
var quickInputPrio = 4;
var quickInputTags = [];

var timer = {
  mode: 'work', remaining: S.settings.workDuration * 60,
  running: false, intervalId: null,
  startedAt: null, startedRemaining: null,
  cycleCount: 0, taskId: null
};

// Web Worker for background timing
var timerWorker = null;
try {
  timerWorker = new Worker('./timer-worker.js');
  timerWorker.onmessage = function(e) {
    var d = e.data;
    if (d.type === 'tick') { timer.remaining = d.remaining; updateTimerUI(); }
    else if (d.type === 'complete') { timer.remaining = 0; timer.running = false; onTimerComplete(); }
  };
} catch(_) { timerWorker = null; }

// ==================== STATE I/O ====================
function acquireWakeLock() {
  if (!S.settings.wakeLockEnabled || !('wakeLock' in navigator)) return;
  navigator.wakeLock.request('screen').then(function(s) {
    wakeLockSentinel = s;
    wakeLockSentinel.addEventListener('release', function() { wakeLockSentinel = null; });
  }).catch(function() { wakeLockSentinel = null; });
}
function releaseWakeLock() {
  if (wakeLockSentinel) { wakeLockSentinel.release(); wakeLockSentinel = null; }
}

function loadState() {
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (raw) {
      var d = JSON.parse(raw);
      return {
        settings: Object.assign({}, DEFAULTS.settings, d.settings || {}),
        tasks: d.tasks || [],
        sessions: d.sessions || [],
        projects: d.projects || []
      };
    }
  } catch (_) {}
  return JSON.parse(JSON.stringify(DEFAULTS));
}

function migrateFromV2() {
  try {
    if (localStorage.getItem(LS_KEY)) return;
    var raw = localStorage.getItem(LS_KEY_V2);
    if (!raw) return;
    var old = JSON.parse(raw);
    var nt = (old.tasks || []).map(function(t) {
      return {
        id: t.id, title: t.title, tags: t.tags || [], priority: t.priority || 4,
        today: t.today || false, completed: t.completed || false, pinned: t.pinned || false,
        pomodorosCompleted: t.pomodorosCompleted || 0,
        createdAt: t.createdAt || new Date().toISOString(),
        area: t.completed ? 'archive' : (t.today ? 'next' : 'inbox'),
        dueDate: '', projectId: '', notes: '', estimatedPomodoros: 0
      };
    });
    S = {
      settings: Object.assign({}, DEFAULTS.settings, old.settings || {}),
      tasks: nt, sessions: old.sessions || [], projects: []
    };
    saveState();
  } catch (_) {}
}

function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (_) {}
}

function saveTimerState() {
  try {
    localStorage.setItem(LS_KEY + '_timer', JSON.stringify({
      mode: timer.mode, startedAt: timer.startedAt,
      startedRemaining: timer.startedRemaining,
      running: timer.running, cycleCount: timer.cycleCount, taskId: timer.taskId
    }));
  } catch(_) {}
}

function loadTimerState() {
  try {
    var raw = localStorage.getItem(LS_KEY + '_timer');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch(_) { return null; }
}

function clearTimerState() {
  try { localStorage.removeItem(LS_KEY + '_timer'); } catch(_) {}
}

function recoverTimer() {
  var saved = loadTimerState();
  if (!saved || !saved.running || !saved.startedAt) return;
  var elapsed = (Date.now() - new Date(saved.startedAt).getTime()) / 1000;
  var remaining = saved.startedRemaining - Math.floor(elapsed);
  if (remaining <= 0) {
    timer.mode = saved.mode; timer.startedAt = saved.startedAt;
    timer.startedRemaining = saved.startedRemaining;
    timer.cycleCount = saved.cycleCount || 0; timer.taskId = saved.taskId;
    timer.running = false; timer.remaining = 0;
    clearTimerState(); onTimerComplete();
  } else {
    timer.mode = saved.mode; timer.startedAt = saved.startedAt;
    timer.startedRemaining = saved.startedRemaining;
    timer.remaining = remaining; timer.running = true;
    timer.cycleCount = saved.cycleCount || 0; timer.taskId = saved.taskId;
    startInterval(); updateTimerUI();
  }
}

// ==================== AUDIO ====================
var _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}
function beep(freq, dur, vol) {
  freq = freq || 880; dur = dur || 0.15; vol = vol || 0.5;
  try {
    var c = getAudioCtx(), o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime); o.stop(c.currentTime + dur);
  } catch (_) {}
}
function chime(v) {
  beep(523, 0.18, v);
  setTimeout(function() { beep(659, 0.18, v); }, 200);
  setTimeout(function() { beep(784, 0.3, v); }, 400);
}
function click(v) { beep(1200, 0.04, v * 0.3); }

// ==================== NOTIFICATIONS ====================
function notify(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try { new Notification(title, {body: body, icon: './icons/icon-192.png', tag: 'pomotodo'}); } catch (_) {}
}

// ==================== TIMER ====================
function getModeDuration(mode) {
  var s = S.settings;
  if (mode === 'shortBreak') return s.shortBreakDuration;
  if (mode === 'longBreak') return s.longBreakDuration;
  return s.workDuration;
}

function startInterval() {
  clearInterval(timer.intervalId);
  timer.intervalId = setInterval(function() {
    if (!timer.startedAt) return;
    var elapsed = (Date.now() - new Date(timer.startedAt).getTime()) / 1000;
    timer.remaining = Math.max(0, timer.startedRemaining - Math.floor(elapsed));
    updateTimerUI();
    if (timer.remaining <= 0) {
      timer.running = false; clearInterval(timer.intervalId); timer.intervalId = null;
      onTimerComplete();
    }
  }, 250);
}

function startTimer() {
  if (timer.running) return;
  click(S.settings.soundVolume);
  timer.running = true;
  timer.startedAt = new Date().toISOString();
  timer.startedRemaining = timer.remaining;
  saveTimerState(); startInterval();
  if (timerWorker) timerWorker.postMessage({ type: 'start', startTime: Date.now(), duration: timer.remaining });
  updateTimerUI(); acquireWakeLock();
}

function pauseTimer() {
  if (!timer.running) return;
  click(S.settings.soundVolume);
  timer.running = false; clearInterval(timer.intervalId); timer.intervalId = null;
  if (timer.startedAt) {
    var elapsed = (Date.now() - new Date(timer.startedAt).getTime()) / 1000;
    timer.remaining = Math.max(0, timer.startedRemaining - Math.floor(elapsed));
  }
  timer.startedAt = null; timer.startedRemaining = null;
  saveTimerState();
  if (timerWorker) timerWorker.postMessage({ type: 'pause' });
  updateTimerUI();
}

function resetTimer() {
  click(S.settings.soundVolume);
  timer.running = false; clearInterval(timer.intervalId); timer.intervalId = null;
  timer.remaining = getModeDuration(timer.mode) * 60;
  timer.startedAt = null; timer.startedRemaining = null;
  clearTimerState();
  if (timerWorker) timerWorker.postMessage({ type: 'stop' });
  updateTimerUI();
}

function onTimerComplete() {
  var dur = getModeDuration(timer.mode) * 60;
  var session = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    type: timer.mode, start: timer.startedAt,
    end: new Date().toISOString(), duration: dur, taskId: null
  };
  if (S.settings.soundEnabled) chime(S.settings.soundVolume);
  if (S.settings.notificationsEnabled) {
    var names = {work: '专注完成', shortBreak: '短休息结束', longBreak: '长休息结束'};
    notify('🍅 ' + names[timer.mode], timer.mode === 'work' ? '休息一下吧' : '开始专注吧');
  }
  clearTimerState(); releaseWakeLock();
  if (timer.mode === 'work') {
    timer.cycleCount++; S.sessions.push(session); saveState(); showCompleteModal(session);
  } else {
    S.sessions.push(session); saveState();
    timer.mode = 'work'; timer.remaining = S.settings.workDuration * 60;
    timer.startedAt = null; timer.startedRemaining = null;
    if (S.settings.autoStartWork) setTimeout(startTimer, 500);
    updateTimerUI(); updateDoneList();
  }
}

function advanceAfterComplete(selectedTaskId) {
  var session = S.sessions[S.sessions.length - 1];
  if (selectedTaskId && session) {
    session.taskId = selectedTaskId;
    var task = S.tasks.find(function(t) { return t.id === selectedTaskId; });
    if (task) { task.pomodorosCompleted++; saveState(); }
  }
  saveState();
  if (timer.cycleCount >= S.settings.longBreakInterval) {
    timer.mode = 'longBreak'; timer.remaining = S.settings.longBreakDuration * 60; timer.cycleCount = 0;
  } else { timer.mode = 'shortBreak'; timer.remaining = S.settings.shortBreakDuration * 60; }
  timer.startedAt = null; timer.startedRemaining = null;
  if (S.settings.autoStartBreak) setTimeout(startTimer, 500);
  updateTimerUI(); updateDoneList(); renderTasks();
}

function skipTimer() {
  click(S.settings.soundVolume); clearInterval(timer.intervalId);
  timer.running = false; timer.intervalId = null;
  var total = getModeDuration(timer.mode) * 60;
  if (timer.remaining < total * 0.5) {
    var session = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      type: timer.mode, start: timer.startedAt || new Date().toISOString(),
      end: new Date().toISOString(), duration: total - timer.remaining, taskId: null
    };
    S.sessions.push(session); if (timer.mode === 'work') timer.cycleCount++; saveState();
  }
  if (timer.mode === 'work') {
    if (timer.cycleCount >= S.settings.longBreakInterval) {
      timer.mode = 'longBreak'; timer.remaining = S.settings.longBreakDuration * 60; timer.cycleCount = 0;
    } else { timer.mode = 'shortBreak'; timer.remaining = S.settings.shortBreakDuration * 60; }
  } else { timer.mode = 'work'; timer.remaining = S.settings.workDuration * 60; }
  timer.startedAt = null; timer.startedRemaining = null; clearTimerState();
  if (timerWorker) timerWorker.postMessage({ type: 'stop' });
  updateTimerUI(); updateDoneList();
}

// ==================== TASKS ====================
function addTask(title, opts) {
  var tags = []; var priority = 4; var isToday = false;
  title = title.replace(/!([1-4])/g, function(_, p) { priority = parseInt(p); return ''; });
  title = title.replace(/#(\S+)/g, function(_, t) { tags.push(t); return ''; });
  title = title.replace(/@today/gi, function() { isToday = true; return ''; });
  title = title.trim(); if (!title) return;
  // Merge opts from quick input bar
  if (opts) {
    if (opts.priority && opts.priority >= 1 && opts.priority <= 4) priority = opts.priority;
    if (opts.tags && opts.tags.length) tags = tags.concat(opts.tags);
    if (opts.today) isToday = true;
  }
  var area = (opts && opts.area) ? opts.area : (isToday ? 'next' : 'inbox');
  var dueDate = (opts && opts.dueDate) ? opts.dueDate : '';
  var projectId = (opts && opts.projectId) ? opts.projectId : '';
  var estimatedPomodoros = (opts && opts.estimatedPomodoros) ? opts.estimatedPomodoros : 0;
  var task = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: title, tags: tags, priority: priority, today: isToday,
    completed: false, pinned: false, pomodorosCompleted: 0,
    createdAt: new Date().toISOString(),
    area: area, dueDate: dueDate, projectId: projectId,
    notes: '', estimatedPomodoros: estimatedPomodoros
  };
  S.tasks.unshift(task); saveState(); renderTasks(); updateGtdCounts(); return task;
}

function toggleTask(id) {
  var t = S.tasks.find(function(x) { return x.id === id; });
  if (!t) return; t.completed = !t.completed;
  if (t.completed) t.area = 'archive';
  saveState(); renderTasks(); updateGtdCounts();
}
function pinTask(id) {
  var t = S.tasks.find(function(x) { return x.id === id; });
  if (!t) return; t.pinned = !t.pinned; saveState(); renderTasks();
}
function deleteTask(id) {
  S.tasks = S.tasks.filter(function(x) { return x.id !== id; });
  saveState(); renderTasks(); updateGtdCounts();
}
function selectTask(id) {
  var el = document.querySelector('.task-item.active-task');
  if (el) el.classList.remove('active-task');
  timer.taskId = (timer.taskId === id) ? null : id;
  updateTimerUI(); renderTasks();
}
function cyclePriority(id) {
  var t = S.tasks.find(function(x) { return x.id === id; });
  if (!t) return; t.priority = (t.priority % 4) + 1;
  saveState(); renderTasks();
}

function updateTask(id, updates) {
  var t = S.tasks.find(function(x) { return x.id === id; });
  if (!t) return;
  Object.keys(updates).forEach(function(k) { t[k] = updates[k]; });
  if (t.today && t.area === 'inbox') t.area = 'next';
  saveState(); renderTasks(); updateGtdCounts();
}

// ==================== PROJECTS ====================
function addProject(name, color) {
  if (!name) return;
  S.projects.push({id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: name, color: color || '#e74c3c'});
  saveState(); renderProjectList(); renderProjectSelects();
}
function deleteProject(id) {
  S.projects = S.projects.filter(function(x) { return x.id !== id; });
  S.tasks.forEach(function(t) { if (t.projectId === id) t.projectId = ''; });
  saveState(); renderProjectList(); renderProjectSelects();
}
function renderProjectSelects() {
  var opts = '<option value="">无项目</option>' + S.projects.map(function(p) {
    return '<option value="' + p.id + '">' + esc(p.name) + '</option>';
  }).join('');
  var s1 = document.getElementById('qi-project'); var s2 = document.getElementById('det-project');
  if (s1) s1.innerHTML = opts; if (s2) s2.innerHTML = opts;
}
function renderProjectList() {
  var el = document.getElementById('project-list');
  if (!el) return;
  if (S.projects.length === 0) { el.innerHTML = '<span style="font-size:.78rem;color:var(--c-text2)">暂无项目</span>'; return; }
  el.innerHTML = S.projects.map(function(p) {
    return '<div class="project-item"><span class="project-color" style="background:' + p.color + '"></span><span class="project-name">' + esc(p.name) + '</span><span class="project-del" data-del-project="' + p.id + '">✕</span></div>';
  }).join('');
}

// ==================== GTD HELPERS ====================
function getTasksForArea(area) {
  if (area === 'all') return S.tasks;
  return S.tasks.filter(function(t) { return t.area === area; });
}
function getOverdueTasks() {
  var today = new Date().toISOString().slice(0, 10);
  return S.tasks.filter(function(t) { return !t.completed && t.dueDate && t.dueDate < today; });
}

function updateGtdCounts() {
  var c = {inbox:0, next:0, projects:0, someday:0, archive:0};
  S.tasks.forEach(function(t) {
    if (t.completed || t.area === 'archive') c.archive++;
    else if (t.area === 'inbox') c.inbox++;
    else if (t.area === 'next' || t.today) c.next++;
    else if (t.projectId) c.projects++;
    else if (t.area === 'someday') c.someday++;
    else c.inbox++;
  });
  var el = function(id) { return document.getElementById(id); };
  if (el('cnt-inbox')) el('cnt-inbox').textContent = c.inbox;
  if (el('cnt-next')) el('cnt-next').textContent = c.next;
  if (el('cnt-project')) el('cnt-project').textContent = c.projects;
  if (el('cnt-someday')) el('cnt-someday').textContent = c.someday;
  if (el('cnt-archive')) el('cnt-archive').textContent = c.archive;
}

// ==================== DETAIL PANEL (V3: uses det-* IDs) ====================
function openDetail(taskId) {
  var t = S.tasks.find(function(x) { return x.id === taskId; });
  if (!t) return; detailTaskId = taskId;
  var el = function(id) { return document.getElementById(id); };
  if (el('det-title')) el('det-title').value = t.title || '';
  if (el('det-due')) el('det-due').value = t.dueDate || '';
  if (el('det-area')) el('det-area').value = t.area || 'inbox';
  if (el('det-notes')) el('det-notes').value = t.notes || '';
  if (el('det-estpomo')) el('det-estpomo').value = t.estimatedPomodoros || 0;
  if (el('det-pomo-count')) el('det-pomo-count').textContent = t.pomodorosCompleted || 0;
  if (el('det-created')) el('det-created').textContent = t.createdAt ? new Date(t.createdAt).toLocaleString('zh-CN') : '';
  document.querySelectorAll('#det-prio-group .prio-btn').forEach(function(btn) {
    btn.classList.toggle('active', parseInt(btn.dataset.prio) === (t.priority || 4));
  });
  renderDetailTags(t.tags || []);
  renderProjectSelects();
  var projSel = el('det-project');
  if (projSel) projSel.value = t.projectId || '';
  var ov = el('detail-overlay');
  if (ov) ov.removeAttribute('hidden');
  var panel = el('detail-panel');
  panel.removeAttribute('hidden');
  setTimeout(function() { panel.classList.add('open'); }, 10);
}
function closeDetail() {
  var panel = document.getElementById('detail-panel');
  panel.classList.remove('open');
  setTimeout(function() {
    panel.setAttribute('hidden', '');
    var ov = document.getElementById('detail-overlay');
    if (ov) ov.setAttribute('hidden', '');
  }, 300);
  detailTaskId = null;
}
function saveDetail() {
  if (!detailTaskId) return;
  var t = S.tasks.find(function(x) { return x.id === detailTaskId; });
  if (!t) return;
  var el = function(id) { return document.getElementById(id); };
  t.title = (el('det-title') ? el('det-title').value.trim() : '') || t.title;
  t.dueDate = el('det-due') ? el('det-due').value : '';
  t.area = el('det-area') ? el('det-area').value : 'inbox';
  t.projectId = el('det-project') ? el('det-project').value : '';
  t.notes = el('det-notes') ? el('det-notes').value : '';
  t.estimatedPomodoros = parseInt(el('det-estpomo') ? el('det-estpomo').value : 0) || 0;
  var prioBtn = document.querySelector('#det-prio-group .prio-btn.active');
  if (prioBtn) t.priority = parseInt(prioBtn.dataset.prio) || 4;
  // Handle tags from detail tag chips
  var tagChips = document.querySelectorAll('#det-tags .det-tag-chip');
  t.tags = []; tagChips.forEach(function(chip) {
    var tag = chip.dataset.removeTag;
    if (tag) t.tags.push(tag);
  });
  // Handle tag input
  var tagInput = el('det-tag-input');
  if (tagInput && tagInput.value.trim()) {
    t.tags = t.tags.concat(tagInput.value.trim().split(/[\s,]+/).filter(Boolean));
  }
  if (t.dueDate && t.area === 'inbox') t.area = 'next';
  if (t.area === 'next') t.today = true;
  saveState(); renderTasks(); updateGtdCounts(); closeDetail();
  toast('任务已保存');
}
function renderDetailTags(tags) {
  var el = document.getElementById('det-tags');
  if (!el) return;
  el.innerHTML = tags.map(function(tag) {
    return '<span class="det-tag-chip" data-remove-tag="' + esc(tag) + '">#' + esc(tag) + ' ✕</span>';
  }).join('');
}

// ==================== CALENDAR (uses currentCalYear/currentCalMonth/selectedCalDate) ====================
function renderCalendar() {
  var y = currentCalYear, m = currentCalMonth;
  var mNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var monthEl = document.getElementById('cal-month');
  if (monthEl) monthEl.textContent = y + '年 ' + mNames[m];
  var firstDay = new Date(y, m, 1).getDay();
  var daysInMonth = new Date(y, m + 1, 0).getDate();
  var daysInPrev = new Date(y, m, 0).getDate();
  var today = new Date().toISOString().slice(0, 10);
  var taskMap = {};
  S.tasks.forEach(function(t) { if (t.dueDate) taskMap[t.dueDate] = (taskMap[t.dueDate] || 0) + 1; });
  var html = '';
  for (var i = firstDay - 1; i >= 0; i--) html += '<div class="cal-day other-month">' + (daysInPrev - i) + '</div>';
  for (var day = 1; day <= daysInMonth; day++) {
    var ds = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    var cls = 'cal-day';
    if (ds === today) cls += ' today';
    if (ds === selectedCalDate) cls += ' selected';
    if (taskMap[ds]) cls += ' has-task';
    html += '<div class="' + cls + '" data-date="' + ds + '">' + day + '</div>';
  }
  var totalCells = firstDay + daysInMonth;
  var rem = (7 - (totalCells % 7)) % 7;
  for (var j = 1; j <= rem; j++) html += '<div class="cal-day other-month">' + j + '</div>';
  var grid = document.getElementById('cal-grid');
  if (grid) grid.innerHTML = html;
  renderCalendarDayTasks();
}
function renderCalendarDayTasks() {
  var dp = document.getElementById('cal-day-tasks');
  if (!dp) return;
  if (!selectedCalDate) { dp.setAttribute('hidden', ''); return; }
  dp.removeAttribute('hidden');
  var titleEl = document.getElementById('cal-day-title');
  if (titleEl) titleEl.textContent = selectedCalDate.replace(/-/g, '/') + ' 的任务';
  var dayTasks = S.tasks.filter(function(t) {
    return t.dueDate === selectedCalDate || (t.today && selectedCalDate === new Date().toISOString().slice(0, 10) && !t.completed);
  });
  var le = document.getElementById('cal-task-list');
  if (!le) return;
  if (dayTasks.length === 0) { le.innerHTML = '<li style="font-size:.82rem;color:var(--c-text2)">该日无任务</li>'; return; }
  le.innerHTML = dayTasks.map(function(t) {
    var p = t.priority || 4;
    var pC = {1:'var(--c-p1)',2:'var(--c-p2)',3:'var(--c-p3)',4:'var(--c-p4)'};
    return '<li class="cal-task-item" data-cal-task="' + t.id + '"><span style="width:8px;height:8px;border-radius:50%;background:' + pC[p] + ';flex-shrink:0"></span>' + (t.completed ? '<s>' + esc(t.title) + '</s>' : esc(t.title)) + '</li>';
  }).join('');
}
function selectCalDate(dateStr) {
  selectedCalDate = (selectedCalDate === dateStr) ? '' : dateStr;
  renderCalendar();
}

// ==================== QUICK INPUT ====================
function toggleQuickInput() {
  quickInputVisible = !quickInputVisible;
  var bar = document.getElementById('quick-input-bar');
  var btn = document.getElementById('task-input-more');
  if (quickInputVisible) { bar.removeAttribute('hidden'); btn.classList.add('active'); }
  else { bar.setAttribute('hidden', ''); btn.classList.remove('active'); }
}
function renderQITags() {
  var el = document.getElementById('qi-tags');
  if (el) el.innerHTML = quickInputTags.map(function(tag) {
    return '<span class="qi-tag" data-qi-remove-tag="' + esc(tag) + '">#' + esc(tag) + '</span>';
  }).join('');
}
function addTaskFromInput() {
  var input = document.getElementById('task-input');
  var title = input.value.trim();
  if (!title) return;
  var opts = {
    priority: quickInputPrio, tags: quickInputTags.slice(), today: false,
    dueDate: document.getElementById('qi-date') ? document.getElementById('qi-date').value : '',
    area: document.getElementById('qi-area') ? document.getElementById('qi-area').value : 'inbox',
    projectId: document.getElementById('qi-project') ? document.getElementById('qi-project').value : '',
    estimatedPomodoros: 0
  };
  var todayBtn = document.getElementById('qi-today-btn');
  if (todayBtn && todayBtn.classList.contains('active')) opts.today = true;
  addTask(title, opts); input.value = '';
  quickInputPrio = 4; quickInputTags = [];
  document.querySelectorAll('#quick-input-bar .prio-btn').forEach(function(b) { b.classList.toggle('active', parseInt(b.dataset.prio) === 4); });
  renderQITags();
  if (document.getElementById('qi-date')) document.getElementById('qi-date').value = '';
  if (todayBtn) todayBtn.classList.remove('active');
  toast('土豆已添加');
}

// ==================== RENDER ====================
function updateTimerUI() {
  var total = getModeDuration(timer.mode) * 60;
  var pct = total > 0 ? timer.remaining / total : 1;
  var ring = document.querySelector('.ring-fill');
  if (ring) {
    ring.style.strokeDasharray = CIRC;
    ring.style.strokeDashoffset = CIRC * (1 - pct);
    ring.className = 'ring-fill' + (timer.mode === 'shortBreak' ? ' short' : '') + (timer.mode === 'longBreak' ? ' long' : '');
  }
  var digits = document.querySelector('.timer-digits');
  if (digits) {
    digits.textContent = fmtTime(timer.remaining);
    digits.className = 'timer-digits' + (timer.mode === 'shortBreak' ? ' short' : '') + (timer.mode === 'longBreak' ? ' long' : '');
  }
  var btn = document.getElementById('btn-start');
  if (btn) {
    btn.textContent = timer.running ? '⏸ 暂停' : (timer.remaining < total ? '▶ 继续' : '▶ 开始专注');
    btn.classList.toggle('running', timer.running);
  }
  var cycleEl = document.querySelector('.timer-cycle');
  if (cycleEl) cycleEl.textContent = '#' + (timer.cycleCount + 1);
  var label = document.getElementById('timer-active-task');
  if (label) {
    if (timer.taskId) {
      var t = S.tasks.find(function(x) { return x.id === timer.taskId; });
      label.textContent = t ? '🍅 ' + t.title : '';
    } else { label.textContent = ''; }
  }
  document.title = timer.running ? fmtTime(timer.remaining) + ' - Pomotodo' : 'Pomotodo';
}

function renderTasks() {
  var filter = currentFilter;
  var area = currentArea;
  var tasks = S.tasks.slice();
  // Filter by GTD area first
  if (area && area !== 'all') {
    tasks = tasks.filter(function(t) {
      if (area === 'inbox') return t.area === 'inbox' && !t.completed;
      if (area === 'next') return (t.area === 'next' || t.today) && !t.completed;
      if (area === 'projects') return !!t.projectId && !t.completed;
      if (area === 'someday') return t.area === 'someday' && !t.completed;
      if (area === 'archive') return t.completed || t.area === 'archive';
      return true;
    });
  }
  // Then apply status filter
  if (filter === 'active') tasks = tasks.filter(function(t) { return !t.completed; });
  else if (filter === 'completed') tasks = tasks.filter(function(t) { return t.completed; });
  else if (filter === 'today') tasks = tasks.filter(function(t) { return t.today && !t.completed; });
  else if (filter === 'overdue') tasks = getOverdueTasks();
  // Sort
  tasks.sort(function(a, b) {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return 0;
  });
  var list = document.getElementById('task-list');
  if (!list) return;
  if (tasks.length === 0) {
    list.innerHTML = '<div class="empty-state">🥔 还没有土豆<br><small>输入任务 #标签 !1紧急 @today</small></div>';
    return;
  }
  var prioLabels = {1:'P1',2:'P2',3:'P3',4:'P4'};
  list.innerHTML = tasks.map(function(t) {
    var isActive = timer.taskId === t.id;
    var p = t.priority || 4;
    var tagHtml = (t.tags || []).map(function(tag) { return '<span class="task-tag">#' + esc(tag) + '</span>'; }).join(' ');
    var todayBadge = t.today ? '<span class="task-today-badge">今日</span>' : '';
    var dueBadge = '';
    if (t.dueDate) {
      var today = new Date().toISOString().slice(0, 10);
      var isOverdue = t.dueDate < today && !t.completed;
      dueBadge = '<span class="task-due-badge' + (isOverdue ? ' overdue' : '') + '">' + t.dueDate.slice(5) + '</span>';
    }
    var projBadge = '';
    if (t.projectId) {
      var proj = S.projects.find(function(pr) { return pr.id === t.projectId; });
      if (proj) projBadge = '<span class="task-area-badge">' + esc(proj.name) + '</span>';
    }
    return '<li class="task-item prio-' + p + (t.completed ? ' completed' : '') + (t.pinned ? ' pinned' : '') + (isActive ? ' active-task' : '') + (dueBadge && dueBadge.indexOf('overdue') >= 0 ? ' overdue' : '') + '" data-id="' + t.id + '">' +
      '<div class="task-check" data-act="toggle" data-id="' + t.id + '">' + (t.completed ? '✓' : '') + '</div>' +
      '<span class="task-prio-badge p' + p + '" data-act="prio" data-id="' + t.id + '" title="切换优先级">' + prioLabels[p] + '</span>' +
      '<span class="task-text" data-act="detail" data-id="' + t.id + '">' + esc(t.title) + ' ' + tagHtml + todayBadge + dueBadge + projBadge + '</span>' +
      '<span class="task-pomo">' + '🍅'.repeat(Math.min(t.pomodorosCompleted, 5)) + (t.pomodorosCompleted > 5 ? '+' + t.pomodorosCompleted : '') + '</span>' +
      '<div class="task-btns">' +
      '<button class="task-btn" data-act="pin" data-id="' + t.id + '">' + (t.pinned ? '📌' : '📍') + '</button>' +
      '<button class="task-btn" data-act="select" data-id="' + t.id + '">' + (isActive ? '🍅' : '○') + '</button>' +
      '<button class="task-btn del" data-act="delete" data-id="' + t.id + '">✕</button>' +
      '</div></li>';
  }).join('');
}

function updateDoneList() {
  var today = new Date().toISOString().slice(0, 10);
  var todaySessions = S.sessions.filter(function(s) { return s.start && s.start.slice(0, 10) === today; });
  var countEl = document.getElementById('done-count');
  if (countEl) countEl.textContent = todaySessions.length;
  var list = document.getElementById('done-list');
  if (!list) return;
  list.innerHTML = todaySessions.slice(-10).reverse().map(function(s) {
    var task = s.taskId ? S.tasks.find(function(t) { return t.id === s.taskId; }) : null;
    var name = task ? esc(task.title) : (s.type === 'work' ? '专注' : '休息');
    var emoji = s.type === 'work' ? '🍅' : '☕';
    var time = s.start ? new Date(s.start).toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}) : '';
    return '<li class="done-item"><span class="done-emoji">' + emoji + '</span>' + name + '<span class="done-time">' + time + '</span></li>';
  }).join('');
}

// ==================== COMPLETE MODAL ====================
function showCompleteModal(session) {
  var overlay = document.getElementById('modal-complete');
  if (!overlay) return;
  overlay.removeAttribute('hidden');
  var subEl = document.getElementById('modal-sub');
  if (subEl) subEl.textContent = '刚刚完成了 ' + S.settings.workDuration + ' 分钟专注';
  var tasksDiv = document.getElementById('modal-tasks');
  var activeTasks = S.tasks.filter(function(t) { return !t.completed; });
  if (activeTasks.length === 0) {
    tasksDiv.innerHTML = '<p style="font-size:.8rem;color:var(--c-text2)">暂无待办土豆</p>';
  } else {
    tasksDiv.innerHTML = activeTasks.slice(0, 8).map(function(t) {
      return '<div class="modal-task-item" data-id="' + t.id + '"><div class="mt-check">○</div>' + esc(t.title) + '</div>';
    }).join('');
    tasksDiv.querySelectorAll('.modal-task-item').forEach(function(el) {
      el.addEventListener('click', function() {
        el.classList.toggle('checked');
        el.querySelector('.mt-check').textContent = el.classList.contains('checked') ? '✓' : '○';
      });
    });
  }
  var confirmBtn = document.getElementById('modal-confirm');
  var skipBtn = document.getElementById('modal-skip');
  confirmBtn.onclick = function() {
    var checked = tasksDiv.querySelectorAll('.modal-task-item.checked');
    var taskId = checked.length > 0 ? checked[0].dataset.id : null;
    overlay.setAttribute('hidden', ''); advanceAfterComplete(taskId);
  };
  skipBtn.onclick = function() {
    overlay.setAttribute('hidden', ''); advanceAfterComplete(null);
  };
}

// ==================== TIME PICKER ====================
function showTimePicker() {
  if (timer.running) return;
  var overlay = document.getElementById('modal-time-picker');
  if (!overlay) return;
  overlay.removeAttribute('hidden');
  var currentMin = getModeDuration(timer.mode);
  document.querySelectorAll('.time-preset').forEach(function(btn) {
    btn.classList.toggle('active', parseInt(btn.dataset.min) === currentMin);
  });
  var customInput = document.getElementById('time-custom-input');
  if (customInput) customInput.value = '';
}
function applyTimePick(minutes) {
  minutes = Math.max(1, Math.min(90, parseInt(minutes) || getModeDuration(timer.mode)));
  if (timer.mode === 'work') S.settings.workDuration = minutes;
  else if (timer.mode === 'shortBreak') S.settings.shortBreakDuration = minutes;
  else S.settings.longBreakDuration = minutes;
  saveState(); timer.remaining = minutes * 60;
  timer.startedAt = null; timer.startedRemaining = null;
  var overlay = document.getElementById('modal-time-picker');
  if (overlay) overlay.setAttribute('hidden', '');
  updateTimerUI(); initSettings();
}

// ==================== STATS ====================
var weekChart = null;

function renderStats() {
  var today = new Date().toISOString().slice(0, 10);
  var weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  var todaySess = S.sessions.filter(function(s) { return s.type === 'work' && s.start && s.start.slice(0, 10) === today; });
  var weekSess = S.sessions.filter(function(s) { return s.type === 'work' && s.start && s.start >= weekAgo; });
  var totalSess = S.sessions.filter(function(s) { return s.type === 'work'; });
  var el = function(id) { return document.getElementById(id); };
  if (el('s-today-count')) el('s-today-count').textContent = todaySess.length;
  if (el('s-today-mins')) el('s-today-mins').textContent = Math.round(todaySess.reduce(function(a, s) { return a + s.duration; }, 0) / 60) + 'm';
  if (el('s-week-count')) el('s-week-count').textContent = weekSess.length;
  if (el('s-total-count')) el('s-total-count').textContent = totalSess.length;
  renderWeeklyChart(); renderTagBars();
}

function renderWeeklyChart() {
  var days = [];
  for (var i = 6; i >= 0; i--) days.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
  var labels = days.map(function(d) {
    var dt = new Date(d + 'T00:00:00');
    return ['日','一','二','三','四','五','六'][dt.getDay()];
  });
  var counts = days.map(function(d) {
    return S.sessions.filter(function(s) { return s.type === 'work' && s.start && s.start.slice(0, 10) === d; }).length;
  });
  var isDark = S.settings.theme === 'dark';
  var tc = isDark ? '#8b949e' : '#636e72';
  var gc = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  if (weekChart) {
    weekChart.data.labels = labels; weekChart.data.datasets[0].data = counts;
    weekChart.options.scales.x.ticks.color = tc; weekChart.options.scales.y.ticks.color = tc;
    weekChart.update(); return;
  }
  var ctx = document.getElementById('chart-weekly');
  if (!ctx) return;
  var cfg = {}; cfg.type = 'bar'; cfg.data = {}; cfg.data.labels = labels;
  cfg.data.datasets = [{}];
  cfg.data.datasets[0].label = '番茄数';
  cfg.data.datasets[0].data = counts;
  cfg.data.datasets[0].backgroundColor = 'rgba(231,76,60,0.7)';
  cfg.data.datasets[0].borderRadius = 4; cfg.data.datasets[0].maxBarThickness = 28;
  cfg.options = {}; cfg.options.responsive = true; cfg.options.maintainAspectRatio = false;
  cfg.options.plugins = { legend: { display: false } };
  cfg.options.scales = {}; cfg.options.scales.x = {}; cfg.options.scales.x.ticks = { color: tc, font: { size: 11 } };
  cfg.options.scales.x.grid = { color: gc }; cfg.options.scales.y = {}; cfg.options.scales.y.beginAtZero = true;
  cfg.options.scales.y.ticks = { color: tc, stepSize: 1 }; cfg.options.scales.y.grid = { color: gc };
  weekChart = new Chart(ctx, cfg);
}

function renderTagBars() {
  var tagMap = {};
  S.sessions.forEach(function(s) {
    if (s.type !== 'work' || !s.taskId) return;
    var t = S.tasks.find(function(x) { return x.id === s.taskId; });
    if (!t) return;
    (t.tags || []).forEach(function(tag) { tagMap[tag] = (tagMap[tag] || 0) + 1; });
    if (!t.tags || t.tags.length === 0) { tagMap['未标记'] = (tagMap['未标记'] || 0) + 1; }
  });
  var entries = Object.entries(tagMap).sort(function(a, b) { return b[1] - a[1]; });
  var max = entries.length > 0 ? entries[0][1] : 1;
  var colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#95a5a6'];
  var container = document.getElementById('tag-bars');
  if (!container) return;
  if (entries.length === 0) { container.innerHTML = '<p style="font-size:.8rem;color:var(--c-text2)">暂无标签数据</p>'; return; }
  container.innerHTML = entries.map(function(pair, i) {
    var name = pair[0], count = pair[1];
    return '<div class="tag-bar-row"><span class="tag-bar-name">' + esc(name) + '</span>' +
      '<div class="tag-bar-track"><div class="tag-bar-fill" style="width:' + (count / max * 100).toFixed(0) + '%;background:' + colors[i % colors.length] + '"></div></div>' +
      '<span class="tag-bar-val">' + count + '</span></div>';
  }).join('');
}

// ==================== SETTINGS ====================
function initSettings() {
  var s = S.settings;
  var el = function(id) { return document.getElementById(id); };
  if (el('opt-work')) el('opt-work').value = s.workDuration;
  if (el('opt-short')) el('opt-short').value = s.shortBreakDuration;
  if (el('opt-long')) el('opt-long').value = s.longBreakDuration;
  if (el('opt-interval')) el('opt-interval').value = s.longBreakInterval;
  if (el('opt-auto-break')) el('opt-auto-break').checked = s.autoStartBreak;
  if (el('opt-auto-work')) el('opt-auto-work').checked = s.autoStartWork;
  if (el('opt-sound')) el('opt-sound').checked = s.soundEnabled;
  if (el('opt-volume')) el('opt-volume').value = s.soundVolume;
  if (el('range-val')) el('range-val').textContent = Math.round(s.soundVolume * 100) + '%';
  if (el('opt-notify')) el('opt-notify').checked = s.notificationsEnabled;
  if (el('opt-wakelock')) el('opt-wakelock').checked = s.wakeLockEnabled || false;
  applyTheme(s.theme);
  renderProjectList(); renderProjectSelects();
}

function readSettings() {
  var el = function(id) { return document.getElementById(id); };
  S.settings.workDuration = Math.max(1, parseInt(el('opt-work') ? el('opt-work').value : 25) || 25);
  S.settings.shortBreakDuration = Math.max(1, parseInt(el('opt-short') ? el('opt-short').value : 5) || 5);
  S.settings.longBreakDuration = Math.max(1, parseInt(el('opt-long') ? el('opt-long').value : 15) || 15);
  S.settings.longBreakInterval = Math.max(2, parseInt(el('opt-interval') ? el('opt-interval').value : 4) || 4);
  S.settings.autoStartBreak = el('opt-auto-break') ? el('opt-auto-break').checked : true;
  S.settings.autoStartWork = el('opt-auto-work') ? el('opt-auto-work').checked : false;
  S.settings.soundEnabled = el('opt-sound') ? el('opt-sound').checked : true;
  S.settings.soundVolume = parseFloat(el('opt-volume') ? el('opt-volume').value : 0.7);
  S.settings.notificationsEnabled = el('opt-notify') ? el('opt-notify').checked : false;
  var wlEl = el('opt-wakelock');
  if (wlEl) S.settings.wakeLockEnabled = wlEl.checked;
  saveState(); if (!timer.running) timer.remaining = getModeDuration(timer.mode) * 60; updateTimerUI();
}

function applyTheme(theme) {
  document.body.dataset.theme = theme; S.settings.theme = theme; saveState();
  document.querySelectorAll('.t-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.theme === theme); });
}

// ==================== UTILS ====================
function fmtTime(sec) {
  var m = Math.floor(sec / 60), s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}
function esc(str) { var d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
function toast(msg) {
  var wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  wrap.appendChild(t); setTimeout(function() { t.remove(); }, 3000);
}

// ==================== DATA I/O ====================
function exportData() {
  var blob = new Blob([JSON.stringify(S, null, 2)], {type: 'application/json'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'pomotodo-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click(); URL.revokeObjectURL(a.href); toast('数据已导出');
}
function importData(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var d = JSON.parse(e.target.result);
      if (d.settings) S.settings = Object.assign({}, DEFAULTS.settings, d.settings);
      if (Array.isArray(d.tasks)) S.tasks = d.tasks;
      if (Array.isArray(d.sessions)) S.sessions = d.sessions;
      if (Array.isArray(d.projects)) S.projects = d.projects;
      S.tasks.forEach(function(t) { if (!t.priority) t.priority = 4; if (t.today === undefined) t.today = false; });
      saveState(); toast('数据已导入');
      initSettings(); renderTasks(); updateTimerUI(); updateDoneList(); updateGtdCounts();
    } catch(err) { toast('导入失败: ' + err.message); }
  }; reader.readAsText(file);
}

// ==================== ONBOARDING ====================
var onboardSteps = [
  { emoji: '🍅', title: '欢迎使用 Pomotodo', text: '番茄钟 + GTD 时间管理工具，帮你专注工作、高效完成任务。' },
  { emoji: '⏱️', title: '点击数字调时长', text: '点击圆圈中的时间数字，快速调整专注/休息时长。锁屏后计时器不会中断！' },
  { emoji: '🥔', title: '智能土豆清单', text: '用 #标签 分类，用 !1~!4 设优先级，用 @today 标记今日任务。' },
  { emoji: '☕', title: '开始专注吧', text: '按空格键开始/暂停，专注25分钟后自动提醒休息。祝你高效！' }
];
var onboardStep = 0;

function showOnboarding() {
  var overlay = document.getElementById('onboarding');
  if (overlay) overlay.removeAttribute('hidden');
  renderOnboardStep();
}
function renderOnboardStep() {
  var step = onboardSteps[onboardStep];
  var body = document.getElementById('onboarding-body');
  if (body) body.innerHTML = '<span class="ob-emoji">' + step.emoji + '</span><h3>' + step.title + '</h3><p>' + step.text + '</p>';
  var dots = document.getElementById('onboarding-dots');
  if (dots) dots.innerHTML = onboardSteps.map(function(_, i) {
    return '<span class="onboarding-dot' + (i === onboardStep ? ' active' : '') + '"></span>';
  }).join('');
  var nextBtn = document.getElementById('onboarding-next');
  if (nextBtn) nextBtn.textContent = onboardStep === onboardSteps.length - 1 ? '开始使用' : '下一步';
}
function closeOnboarding() {
  var overlay = document.getElementById('onboarding');
  if (overlay) overlay.setAttribute('hidden', '');
  try { localStorage.setItem(ONBOARD_KEY, '1'); } catch(_) {}
}

// ==================== INIT & EVENTS ====================
document.addEventListener('DOMContentLoaded', function() {
  migrateFromV2(); initSettings(); updateTimerUI(); renderTasks(); updateDoneList(); updateGtdCounts(); renderCalendar();
  recoverTimer();

  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && timer.running && timer.startedAt) {
      var elapsed = (Date.now() - new Date(timer.startedAt).getTime()) / 1000;
      timer.remaining = Math.max(0, timer.startedRemaining - Math.floor(elapsed));
      updateTimerUI();
      if (timer.remaining <= 0) { timer.running = false; onTimerComplete(); }
    }
  });

  // Onboarding
  var onboarded = false;
  try { onboarded = localStorage.getItem(ONBOARD_KEY) === '1'; } catch(_) {}
  if (!onboarded) setTimeout(showOnboarding, 600);

  // Service Worker
  if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(function() {}); }

  // Notification permission
  if (S.settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') { Notification.requestPermission(); }

  // ---- Timer buttons ----
  document.getElementById('btn-start').addEventListener('click', function() { timer.running ? pauseTimer() : startTimer(); });
  document.getElementById('btn-reset').addEventListener('click', resetTimer);
  document.getElementById('btn-skip').addEventListener('click', skipTimer);
  document.getElementById('timer-ring-wrap').addEventListener('click', function() { if (timer.running) return; showTimePicker(); });

  // ---- Timer mode buttons ----
  document.querySelectorAll('.mode-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (timer.running) return;
      timer.mode = btn.dataset.mode; timer.remaining = getModeDuration(btn.dataset.mode) * 60;
      timer.startedAt = null; timer.startedRemaining = null;
      document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active'); updateTimerUI();
    });
  });

  // ---- Task input ----
  var input = document.getElementById('task-input');
  document.getElementById('task-add-btn').addEventListener('click', function() { addTaskFromInput(); input.focus(); });
  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { addTaskFromInput(); } });

  // ---- Quick input bar toggle ----
  var moreBtn = document.getElementById('task-input-more');
  if (moreBtn) moreBtn.addEventListener('click', toggleQuickInput);

  // ---- Quick input: priority buttons ----
  document.querySelectorAll('#quick-input-bar .prio-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      quickInputPrio = parseInt(btn.dataset.prio) || 4;
      document.querySelectorAll('#quick-input-bar .prio-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
  // ---- Quick input: today button ----
  var qiTodayBtn = document.getElementById('qi-today-btn');
  if (qiTodayBtn) qiTodayBtn.addEventListener('click', function() { qiTodayBtn.classList.toggle('active'); });
  // ---- Quick input: tag input ----
  var qiTagInput = document.getElementById('qi-tag-input');
  if (qiTagInput) qiTagInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var tag = qiTagInput.value.trim();
      if (tag && quickInputTags.indexOf(tag) === -1) { quickInputTags.push(tag); renderQITags(); }
      qiTagInput.value = '';
    }
  });
  // ---- Quick input: remove tag ----
  var qiTags = document.getElementById('qi-tags');
  if (qiTags) qiTags.addEventListener('click', function(e) {
    var chip = e.target.closest('[data-qi-remove-tag]');
    if (!chip) return;
    quickInputTags = quickInputTags.filter(function(t) { return t !== chip.dataset.qiRemoveTag; });
    renderQITags();
  });

  // ---- Task list delegation ----
  document.getElementById('task-list').addEventListener('click', function(e) {
    var btn = e.target.closest('[data-act]'); if (!btn) return;
    var id = btn.dataset.id, act = btn.dataset.act;
    if (act === 'toggle') toggleTask(id);
    else if (act === 'pin') pinTask(id);
    else if (act === 'select') selectTask(id);
    else if (act === 'prio') cyclePriority(id);
    else if (act === 'detail') openDetail(id);
    else if (act === 'delete') { if (confirm('删除此土豆？')) deleteTask(id); }
  });

  // ---- Filter buttons ----
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active'); renderTasks();
    });
  });

  // ---- GTD area tabs ----
  var gtdTabs = document.getElementById('gtd-tabs');
  if (gtdTabs) gtdTabs.addEventListener('click', function(e) {
    var tab = e.target.closest('.gtd-tab');
    if (!tab) return;
    currentArea = tab.dataset.area;
    document.querySelectorAll('.gtd-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active'); renderTasks();
  });

  // ---- Nav buttons (single binding!) ----
  document.querySelectorAll('.nav-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
      var target = document.getElementById('view-' + btn.dataset.view);
      if (target) target.classList.add('active');
      if (btn.dataset.view === 'stats') renderStats();
      if (btn.dataset.view === 'calendar') renderCalendar();
    });
  });

  // ---- Time picker ----
  document.querySelectorAll('.time-preset').forEach(function(btn) {
    btn.addEventListener('click', function() { applyTimePick(parseInt(btn.dataset.min)); });
  });
  var customConfirm = document.getElementById('time-custom-confirm');
  if (customConfirm) customConfirm.addEventListener('click', function() {
    applyTimePick(parseInt(document.getElementById('time-custom-input').value));
  });
  var customInput = document.getElementById('time-custom-input');
  if (customInput) customInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') applyTimePick(parseInt(this.value));
  });
  var timeCancel = document.getElementById('time-picker-cancel');
  if (timeCancel) timeCancel.addEventListener('click', function() {
    document.getElementById('modal-time-picker').setAttribute('hidden', '');
  });

  // ---- Onboarding ----
  document.getElementById('onboarding-next').addEventListener('click', function() {
    if (onboardStep < onboardSteps.length - 1) { onboardStep++; renderOnboardStep(); }
    else closeOnboarding();
  });
  document.getElementById('onboarding-skip').addEventListener('click', closeOnboarding);

  // ---- Settings inputs ----
  ['opt-work','opt-short','opt-long','opt-interval','opt-auto-break','opt-auto-work','opt-sound','opt-notify'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('change', readSettings);
  });
  var volEl = document.getElementById('opt-volume');
  if (volEl) volEl.addEventListener('input', function(e) {
    var rv = document.getElementById('range-val');
    if (rv) rv.textContent = Math.round(e.target.value * 100) + '%';
    readSettings();
  });
  document.getElementById('btn-test-sound').addEventListener('click', function() { chime(S.settings.soundVolume); });

  // ---- Theme buttons ----
  document.querySelectorAll('.t-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { applyTheme(btn.dataset.theme); });
  });

  // ---- Settings reset/clear ----
  document.getElementById('btn-reset-sett').addEventListener('click', function() {
    if (!confirm('恢复默认设置？')) return;
    S.settings = JSON.parse(JSON.stringify(DEFAULTS.settings)); saveState(); initSettings();
    if (!timer.running) { timer.remaining = getModeDuration(timer.mode) * 60; updateTimerUI(); }
    toast('设置已重置');
  });
  document.getElementById('btn-clear-all').addEventListener('click', function() {
    if (!confirm('⚠ 清除所有数据？不可恢复！')) return;
    localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_KEY + '_timer');
    S = JSON.parse(JSON.stringify(DEFAULTS));
    timer = {mode:'work', remaining:S.settings.workDuration*60, running:false, intervalId:null, startedAt:null, startedRemaining:null, cycleCount:0, taskId:null};
    saveState(); initSettings(); updateTimerUI(); renderTasks(); updateDoneList(); updateGtdCounts(); toast('数据已清除');
  });

  // ---- Export/Import ----
  document.getElementById('btn-export').addEventListener('click', exportData);
  document.getElementById('btn-import').addEventListener('change', function(e) {
    if (e.target.files[0]) importData(e.target.files[0]); e.target.value = '';
  });

  // ---- Calendar navigation ----
  var calPrev = document.getElementById('cal-prev');
  if (calPrev) calPrev.addEventListener('click', function() {
    currentCalMonth--; if (currentCalMonth < 0) { currentCalMonth = 11; currentCalYear--; }
    selectedCalDate = null; renderCalendar();
  });
  var calNext = document.getElementById('cal-next');
  if (calNext) calNext.addEventListener('click', function() {
    currentCalMonth++; if (currentCalMonth > 11) { currentCalMonth = 0; currentCalYear++; }
    selectedCalDate = null; renderCalendar();
  });
  var calTodayBtn = document.getElementById('cal-today-btn');
  if (calTodayBtn) calTodayBtn.addEventListener('click', function() {
    var n = new Date(); currentCalYear = n.getFullYear(); currentCalMonth = n.getMonth();
    selectedCalDate = null; renderCalendar();
  });

  // ---- Calendar grid click ----
  var calGrid = document.getElementById('cal-grid');
  if (calGrid) calGrid.addEventListener('click', function(e) {
    var c = e.target.closest('.cal-day');
    if (!c || c.classList.contains('other-month')) return;
    if (c.dataset.date) selectCalDate(c.dataset.date);
  });
  // ---- Calendar task click -> open detail ----
  var calTaskList = document.getElementById('cal-task-list');
  if (calTaskList) calTaskList.addEventListener('click', function(e) {
    var item = e.target.closest('[data-cal-task]');
    if (item) openDetail(item.dataset.calTask);
  });

  // ---- Detail panel ----
  var detailClose = document.getElementById('detail-close');
  if (detailClose) detailClose.addEventListener('click', closeDetail);
  var detailSave = document.getElementById('det-save');
  if (detailSave) detailSave.addEventListener('click', saveDetail);
  var detailDelete = document.getElementById('det-delete');
  if (detailDelete) detailDelete.addEventListener('click', function() {
    if (detailTaskId && confirm('删除此任务？')) { deleteTask(detailTaskId); closeDetail(); }
  });
  var detailOverlay = document.getElementById('detail-overlay');
  if (detailOverlay) detailOverlay.addEventListener('click', function(e) { if (e.target === this) closeDetail(); });
  // ---- Detail priority buttons ----
  document.querySelectorAll('#det-prio-group .prio-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#det-prio-group .prio-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
  // ---- Detail tag remove ----
  var detTags = document.getElementById('det-tags');
  if (detTags) detTags.addEventListener('click', function(e) {
    var chip = e.target.closest('[data-remove-tag]');
    if (!chip || !detailTaskId) return;
    var t = S.tasks.find(function(x) { return x.id === detailTaskId; });
    if (!t) return;
    t.tags = (t.tags || []).filter(function(tag) { return tag !== chip.dataset.removeTag; });
    renderDetailTags(t.tags); saveState();
  });
  // ---- Detail tag add ----
  var detTagInput = document.getElementById('det-tag-input');
  if (detTagInput) detTagInput.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    var tag = detTagInput.value.trim();
    if (!tag || !detailTaskId) return;
    var t = S.tasks.find(function(x) { return x.id === detailTaskId; });
    if (!t) return;
    if (!t.tags) t.tags = [];
    if (t.tags.indexOf(tag) === -1) { t.tags.push(tag); renderDetailTags(t.tags); saveState(); }
    detTagInput.value = '';
  });

  // ---- Project management ----
  var addProjectBtn = document.getElementById('btn-add-project');
  if (addProjectBtn) addProjectBtn.addEventListener('click', function() {
    var nameEl = document.getElementById('project-new-name');
    var colorEl = document.getElementById('project-new-color');
    if (nameEl && nameEl.value.trim()) {
      addProject(nameEl.value.trim(), colorEl ? colorEl.value : '#e74c3c');
      nameEl.value = '';
    }
  });
  var projectListEl = document.getElementById('project-list');
  if (projectListEl) projectListEl.addEventListener('click', function(e) {
    var del = e.target.closest('[data-del-project]');
    if (del && confirm('删除此项目？')) deleteProject(del.dataset.delProject);
  });

  // ---- Wake lock toggle ----
  var wle = document.getElementById('opt-wakelock');
  if (wle) wle.addEventListener('change', readSettings);

  // ---- Keyboard shortcuts ----
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') { e.preventDefault(); timer.running ? pauseTimer() : startTimer(); }
    if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) resetTimer();
    if (e.code === 'KeyT' && !e.ctrlKey && !e.metaKey) document.querySelector('[data-view="work"]').click();
    if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) document.querySelector('[data-view="settings"]').click();
  });
});
