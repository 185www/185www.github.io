/**
 * Pomotodo V4 — app.js
 * V4 changes: dueDate → dueDatetime (precise time), calendar day view
 * All DOM IDs aligned with index.html; duplicate functions removed;
 * undefined variables fixed; event bindings corrected.
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
var currentCalMonth = new Date().getMonth();
var currentCalYear = new Date().getFullYear();
var selectedCalDate = null;
var calViewMode = 'month'; // 'month' | 'day'
var selectedCalDayDate = new Date().toISOString().slice(0, 10); // 日视图当前日期
var detailTaskId = null;

// Helper: extract date string (YYYY-MM-DD) from dueDatetime
function getTaskDate(t) {
  var d = t.dueDatetime || '';
  return d.length >= 10 ? d.slice(0, 10) : '';
}

// Helper: extract time string (HH:mm) from dueDatetime
function getTaskTime(t) {
  var d = t.dueDatetime || '';
  return d.length >= 16 ? d.slice(11, 16) : '';
}

// Helper: format dueDatetime for display
function fmtDue(t) {
  if (!t.dueDatetime) return '';
  var date = getTaskDate(t);
  var time = getTaskTime(t);
  return time ? date.slice(5) + ' ' + time : date.slice(5);
}
var wakeLockSentinel = null;
var currentFilter = 'all';
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
      var state = {
        settings: Object.assign({}, DEFAULTS.settings, d.settings || {}),
        tasks: d.tasks || [],
        sessions: d.sessions || [],
        projects: d.projects || []
      };
      // V3→V4 migration: dueDate → dueDatetime
      state.tasks.forEach(function(t) {
        if (t.dueDate && !t.dueDatetime) {
          t.dueDatetime = t.dueDate + 'T09:00';
          delete t.dueDate;
        }
        if (t.dueDate === '' || t.dueDate === undefined) {
          t.dueDatetime = t.dueDatetime || '';
          delete t.dueDate;
        }
      });
      return state;
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
        pomodorosCompleted: t.pomodorosCompleted || 0, estimatedPomodoros: 0,
        createdAt: t.createdAt || new Date().toISOString(),
        area: t.completed ? 'archive' : (t.today ? 'next' : 'inbox'),
        dueDatetime: '', projectId: '', notes: ''
      };
    });
    S = {
      settings: Object.assign({}, DEFAULTS.settings, old.settings || {}),
      tasks: nt, sessions: old.sessions || [], projects: []
    };
    S.settings.wakeLockEnabled = false;
    saveState();
  } catch(_) {}
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
  saveTimerState();
  startInterval();
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
  opts = opts || {};
  var tags = opts.tags ? opts.tags.slice() : [];
  var priority = opts.priority || 4;
  var isToday = opts.today || false;

  // Parse inline syntax from title
  title = title.replace(/!([1-4])/g, function(_, p) { priority = parseInt(p); return ''; });
  title = title.replace(/#(\S+)/g, function(_, t) { tags.push(t); return ''; });
  title = title.replace(/@today/gi, function() { isToday = true; return ''; });
  title = title.trim();
  if (!title) return null;

  var area = opts.area || (isToday ? 'next' : 'inbox');
  var task = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: title, tags: tags, priority: priority, today: isToday,
    completed: false, pinned: false, pomodorosCompleted: 0,
    estimatedPomodoros: opts.estimatedPomodoros || 0,
    createdAt: new Date().toISOString(),
    area: area, dueDatetime: opts.dueDatetime || '',
    projectId: opts.projectId || '', notes: opts.notes || ''
  };
  S.tasks.unshift(task); saveState(); renderTasks(); updateGtdCounts();
  return task;
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
  S.tasks = S.tasks.filter(function(x) { return x.id !== id; }); saveState(); renderTasks(); updateGtdCounts();
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
  var s1 = document.getElementById('qi-project');
  var s2 = document.getElementById('det-project');
  if (s1) s1.innerHTML = opts;
  if (s2) s2.innerHTML = opts;
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
  return S.tasks.filter(function(t) { return !t.completed && getTaskDate(t) && getTaskDate(t) < today; });
}

function updateGtdCounts() {
  var c = { inbox: 0, next: 0, projects: 0, someday: 0, archive: 0 };
  S.tasks.forEach(function(t) {
    if (t.completed || t.area === 'archive') c.archive++;
    else if (t.area === 'inbox') c.inbox++;
    else if (t.area === 'next' || t.today) c.next++;
    else if (t.projectId) c.projects++;
    else if (t.area === 'someday') c.someday++;
    else c.inbox++;
  });
  var set = function(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
  set('cnt-inbox', c.inbox); set('cnt-next', c.next);
  set('cnt-project', c.projects); set('cnt-someday', c.someday);
  set('cnt-archive', c.archive);
}

// ==================== DETAIL PANEL ====================
function openDetail(taskId) {
  var t = S.tasks.find(function(x) { return x.id === taskId; });
  if (!t) return;
  detailTaskId = taskId;
  document.getElementById('det-title').value = t.title || '';
  document.getElementById('det-due').value = t.dueDatetime || '';
  document.getElementById('det-area').value = t.area || 'inbox';
  document.getElementById('det-notes').value = t.notes || '';
  document.getElementById('det-estpomo').value = t.estimatedPomodoros || 0;
  document.getElementById('det-pomo-count').textContent = t.pomodorosCompleted || 0;
  document.getElementById('det-created').textContent = t.createdAt ? new Date(t.createdAt).toLocaleString('zh-CN') : '';
  document.querySelectorAll('#det-prio-group .prio-btn').forEach(function(btn) {
    btn.classList.toggle('active', parseInt(btn.dataset.prio) === (t.priority || 4));
  });
  renderDetailTags(t.tags || []);
  renderProjectSelects();
  var projSel = document.getElementById('det-project');
  if (projSel) projSel.value = t.projectId || '';
  document.getElementById('detail-overlay').removeAttribute('hidden');
  var panel = document.getElementById('detail-panel');
  panel.removeAttribute('hidden');
  setTimeout(function() { panel.classList.add('open'); }, 10);
}

function closeDetail() {
  var panel = document.getElementById('detail-panel');
  panel.classList.remove('open');
  setTimeout(function() {
    panel.setAttribute('hidden', '');
    document.getElementById('detail-overlay').setAttribute('hidden', '');
  }, 300);
  detailTaskId = null;
}

function saveDetail() {
  if (!detailTaskId) return;
  var t = S.tasks.find(function(x) { return x.id === detailTaskId; });
  if (!t) return;
  t.title = document.getElementById('det-title').value.trim() || t.title;
  t.dueDatetime = document.getElementById('det-due').value || '';
  t.area = document.getElementById('det-area').value || 'inbox';
  t.projectId = document.getElementById('det-project').value || '';
  t.notes = document.getElementById('det-notes').value || '';
  t.estimatedPomodoros = parseInt(document.getElementById('det-estpomo').value) || 0;
  var prioBtn = document.querySelector('#det-prio-group .prio-btn.active');
  if (prioBtn) t.priority = parseInt(prioBtn.dataset.prio) || 4;
  if (t.dueDatetime && t.area === 'inbox') t.area = 'next';
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

// ==================== CALENDAR ====================
function renderCalendar() {
  if (calViewMode === 'day') {
    renderCalDayView();
  } else {
    renderCalMonthView();
  }
  updateCalViewToggle();
}

function updateCalViewToggle() {
  var monthBtn = document.getElementById('cal-view-month');
  var dayBtn = document.getElementById('cal-view-day');
  if (monthBtn) monthBtn.classList.toggle('active', calViewMode === 'month');
  if (dayBtn) dayBtn.classList.toggle('active', calViewMode === 'day');
  var gridWrap = document.getElementById('cal-grid-wrap');
  var dayWrap = document.getElementById('cal-dayview');
  if (gridWrap) gridWrap.style.display = calViewMode === 'month' ? '' : 'none';
  if (dayWrap) dayWrap.style.display = calViewMode === 'day' ? '' : 'none';
}

function renderCalMonthView() {
  var y = currentCalYear, m = currentCalMonth;
  var titleEl = document.getElementById('cal-month');
  if (titleEl) titleEl.textContent = y + '年 ' + (m + 1) + '月';
  var firstDay = new Date(y, m, 1).getDay();
  var daysInMonth = new Date(y, m + 1, 0).getDate();
  var daysInPrev = new Date(y, m, 0).getDate();
  var today = new Date().toISOString().slice(0, 10);
  var taskMap = {};
  S.tasks.forEach(function(t) { var d = getTaskDate(t); if (d) taskMap[d] = (taskMap[d] || 0) + 1; });
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
  var dp = document.getElementById('cal-day-tasks');
  if (!dp) return;
  if (!selectedCalDate) { dp.setAttribute('hidden', ''); return; }
  dp.removeAttribute('hidden');
  var dayTitle = document.getElementById('cal-day-title');
  if (dayTitle) dayTitle.textContent = selectedCalDate.replace(/-/g, '/') + ' 的任务';
  var dayTasks = S.tasks.filter(function(t) {
    return getTaskDate(t) === selectedCalDate || (t.today && selectedCalDate === today && !t.completed);
  });
  var le = document.getElementById('cal-task-list');
  if (!le) return;
  if (dayTasks.length === 0) {
    le.innerHTML = '<li style="font-size:.82rem;color:var(--c-text2)">该日无任务</li>';
  } else {
    le.innerHTML = dayTasks.map(function(t) {
      var p = t.priority || 4;
      var pC = {1:'var(--c-p1)',2:'var(--c-p2)',3:'var(--c-p3)',4:'var(--c-p4)'};
      var timeStr = getTaskTime(t) ? '<span class="cal-task-time">' + esc(getTaskTime(t)) + '</span>' : '';
      return '<li class="cal-task-item" data-cal-task="' + t.id + '">' +
        '<span style="width:8px;height:8px;border-radius:50%;background:' + pC[p] + ';flex-shrink:0"></span>' +
        timeStr +
        (t.completed ? '<s>' + esc(t.title) + '</s>' : esc(t.title)) + '</li>';
    }).join('');
  }
}

function renderCalDayView() {
  var dateStr = selectedCalDayDate;
  var titleEl = document.getElementById('cal-month');
  if (titleEl) {
    var parts = dateStr.split('-');
    titleEl.textContent = parts[0] + '年' + parseInt(parts[1]) + '月' + parseInt(parts[2]) + '日';
  }
  var today = new Date().toISOString().slice(0, 10);
  var dayTasks = S.tasks.filter(function(t) {
    return getTaskDate(t) === dateStr || (t.today && dateStr === today && !t.completed);
  });
  dayTasks.sort(function(a, b) {
    var ta = getTaskTime(a) || '99:99';
    var tb = getTaskTime(b) || '99:99';
    return ta.localeCompare(tb);
  });
  var container = document.getElementById('cal-dayview-timeline');
  if (!container) return;
  if (dayTasks.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:40px 0;font-size:.85rem;color:var(--c-text2)">📋 该日无任务</div>';
    return;
  }
  var slots = {};
  for (var h = 6; h <= 23; h++) slots[String(h).padStart(2, '0')] = [];
  var noTimeTasks = [];
  dayTasks.forEach(function(t) {
    var time = getTaskTime(t);
    if (time && time >= '06:00' && time <= '23:59') {
      var hour = time.slice(0, 2);
      if (slots[hour]) slots[hour].push(t);
    } else {
      noTimeTasks.push(t);
    }
  });
  var html = '';
  for (var hr = 6; hr <= 23; hr++) {
    var key = String(hr).padStart(2, '0');
    var slotTasks = slots[key];
    html += '<div class="day-slot">';
    html += '<div class="day-slot-time">' + key + ':00</div>';
    html += '<div class="day-slot-tasks">';
    if (slotTasks.length === 0) {
      html += '<div class="day-slot-empty"></div>';
    } else {
      slotTasks.forEach(function(t) {
        var p = t.priority || 4;
        var pC = {1:'var(--c-p1)',2:'var(--c-p2)',3:'var(--c-p3)',4:'var(--c-p4)'};
        var time = getTaskTime(t) || '';
        html += '<div class="day-task-card prio-border-' + p + '" data-cal-task="' + t.id + '">' +
          '<span class="day-task-time">' + esc(time) + '</span>' +
          '<span class="day-task-dot" style="background:' + pC[p] + '"></span>' +
          '<span class="day-task-title' + (t.completed ? ' completed' : '') + '">' +
          (t.completed ? '<s>' + esc(t.title) + '</s>' : esc(t.title)) + '</span></div>';
      });
    }
    html += '</div></div>';
  }
  if (noTimeTasks.length > 0) {
    html += '<div class="day-slot"><div class="day-slot-time">⏰</div><div class="day-slot-tasks">';
    noTimeTasks.forEach(function(t) {
      var p = t.priority || 4;
      var pC = {1:'var(--c-p1)',2:'var(--c-p2)',3:'var(--c-p3)',4:'var(--c-p4)'};
      html += '<div class="day-task-card prio-border-' + p + '" data-cal-task="' + t.id + '">' +
        '<span class="day-task-dot" style="background:' + pC[p] + '"></span>' +
        '<span class="day-task-title' + (t.completed ? ' completed' : '') + '">' +
        (t.completed ? '<s>' + esc(t.title) + '</s>' : esc(t.title)) + '</span></div>';
    });
    html += '</div></div>';
  }
  container.innerHTML = html;
}

function selectCalDate(dateStr) {
  selectedCalDate = (selectedCalDate === dateStr) ? '' : dateStr;
  if (selectedCalDate) selectedCalDayDate = selectedCalDate;
  renderCalendar();
}

function switchCalView(mode) {
  calViewMode = mode;
  if (mode === 'day' && selectedCalDate) {
    selectedCalDayDate = selectedCalDate;
  }
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
  if (!el) return;
  el.innerHTML = quickInputTags.map(function(tag) {
    return '<span class="qi-tag" data-qi-remove-tag="' + esc(tag) + '">#' + esc(tag) + '</span>';
  }).join('');
}

function addTaskFromInput() {
  var input = document.getElementById('task-input');
  var title = input.value.trim();
  if (!title) return;
  var opts = {
    priority: quickInputPrio,
    tags: quickInputTags.slice(),
    today: false,
    dueDatetime: document.getElementById('qi-datetime').value || '',
    area: document.getElementById('qi-area').value || 'inbox',
    projectId: document.getElementById('qi-project').value || '',
    estimatedPomodoros: 0
  };
  var todayBtn = document.getElementById('qi-today-btn');
  if (todayBtn && todayBtn.classList.contains('active')) opts.today = true;
  addTask(title, opts);
  input.value = '';
  quickInputPrio = 4; quickInputTags = [];
  document.querySelectorAll('#quick-input-bar .prio-btn').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.prio) === 4);
  });
  renderQITags();
  var qiDate = document.getElementById('qi-datetime');
  if (qiDate) qiDate.value = '';
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
  var cycle = document.querySelector('.timer-cycle');
  if (cycle) cycle.textContent = '#' + (timer.cycleCount + 1);
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
  var tasks = S.tasks.slice();

  // Filter by GTD area
  if (currentArea && currentArea !== 'all') {
    tasks = tasks.filter(function(t) {
      if (currentArea === 'next') return t.area === 'next' || t.today;
      if (currentArea === 'projects') return !!t.projectId && !t.completed && t.area !== 'archive';
      return t.area === currentArea;
    });
  }

  tasks.sort(function(a, b) {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.priority !== b.priority) return a.priority - b.priority;
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return 0;
  });

  if (filter === 'active') tasks = tasks.filter(function(t) { return !t.completed; });
  if (filter === 'completed') tasks = tasks.filter(function(t) { return t.completed; });
  if (filter === 'today') tasks = tasks.filter(function(t) { return t.today && !t.completed; });
  if (filter === 'overdue') tasks = getOverdueTasks();

  var list = document.getElementById('task-list');
  if (!list) return;
  if (tasks.length === 0) {
    list.innerHTML = '<div class="empty-state">🥔 还没有土豆<br><small>最佳的土豆是一周内可完成的小任务</small></div>';
    return;
  }
  var prioLabels = {1:'P1',2:'P2',3:'P3',4:'P4'};
  list.innerHTML = tasks.map(function(t) {
    var isActive = timer.taskId === t.id;
    var p = t.priority || 4;
    var tagHtml = (t.tags || []).map(function(tag) { return '<span class="task-tag">#' + esc(tag) + '</span>'; }).join(' ');
    var todayBadge = t.today ? '<span class="task-today-badge">今日</span>' : '';
    var dueBadge = '';
    if (t.dueDatetime) {
      var isOverdue = getTaskDate(t) < new Date().toISOString().slice(0, 10) && !t.completed;
      dueBadge = '<span class="task-due-badge' + (isOverdue ? ' overdue' : '') + '">' + fmtDue(t) + '</span>';
    }
    var projBadge = '';
    if (t.projectId) {
      var proj = S.projects.find(function(pr) { return pr.id === t.projectId; });
      if (proj) projBadge = '<span class="task-area-badge">' + esc(proj.name) + '</span>';
    }
    var isOverdueItem = dueBadge.indexOf('overdue') > -1;
    return '<li class="task-item prio-' + p + (t.completed ? ' completed' : '') + (t.pinned ? ' pinned' : '') + (isActive ? ' active-task' : '') + (isOverdueItem ? ' overdue' : '') + '" data-id="' + t.id + '">' +
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
  overlay.removeAttribute('hidden');
  document.getElementById('modal-sub').textContent = '刚刚完成了 ' + S.settings.workDuration + ' 分钟专注';
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
  document.getElementById('modal-confirm').onclick = function() {
    var checked = tasksDiv.querySelectorAll('.modal-task-item.checked');
    var taskId = checked.length > 0 ? checked[0].dataset.id : null;
    overlay.setAttribute('hidden', ''); advanceAfterComplete(taskId);
  };
  document.getElementById('modal-skip').onclick = function() {
    overlay.setAttribute('hidden', ''); advanceAfterComplete(null);
  };
}

// ==================== TIME PICKER ====================
function showTimePicker() {
  if (timer.running) return;
  var overlay = document.getElementById('modal-time-picker');
  overlay.removeAttribute('hidden');
  var currentMin = getModeDuration(timer.mode);
  document.querySelectorAll('.time-preset').forEach(function(btn) {
    btn.classList.toggle('active', parseInt(btn.dataset.min) === currentMin);
  });
  document.getElementById('time-custom-input').value = '';
}

function applyTimePick(minutes) {
  minutes = Math.max(1, Math.min(90, parseInt(minutes) || getModeDuration(timer.mode)));
  if (timer.mode === 'work') S.settings.workDuration = minutes;
  else if (timer.mode === 'shortBreak') S.settings.shortBreakDuration = minutes;
  else S.settings.longBreakDuration = minutes;
  saveState(); timer.remaining = minutes * 60;
  timer.startedAt = null; timer.startedRemaining = null;
  document.getElementById('modal-time-picker').setAttribute('hidden', '');
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
  var tc = document.getElementById('s-today-count'); if (tc) tc.textContent = todaySess.length;
  var tm = document.getElementById('s-today-mins'); if (tm) tm.textContent = Math.round(todaySess.reduce(function(a, s) { return a + s.duration; }, 0) / 60) + 'm';
  var wc = document.getElementById('s-week-count'); if (wc) wc.textContent = weekSess.length;
  var ttl = document.getElementById('s-total-count'); if (ttl) ttl.textContent = totalSess.length;
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
  var tColor = isDark ? '#8b949e' : '#636e72';
  var gColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  if (weekChart) {
    weekChart.data.labels = labels;
    weekChart.data.datasets[0].data = counts;
    weekChart.options.scales.x.ticks.color = tColor;
    weekChart.options.scales.y.ticks.color = tColor;
    weekChart.update(); return;
  }

  var ctx = document.getElementById('chart-weekly');
  if (!ctx) return;
  var cfg = {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '番茄数',
        backgroundColor: 'rgba(231,76,60,0.7)',
        borderRadius: 4,
        maxBarThickness: 28
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: tColor, font: { size: 11 } }, grid: { color: gColor } },
        y: { beginAtZero: true, ticks: { color: tColor, stepSize: 1 }, grid: { color: gColor } }
      }
    }
  };
  try {
   weekChart = new Chart(ctx, cfg);
 } catch(err) {
   console.warn('Chart.js not available:', err);
   if (ctx && ctx.parentNode) {
     ctx.parentNode.innerHTML = '<p style="font-size:.8rem;color:var(--c-text2)">图表加载失败（Chart.js未就绪）</p>';
   }
 }
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
  var wl = el('opt-wakelock');
  if (wl) wl.checked = s.wakeLockEnabled || false;
  applyTheme(s.theme);
  renderProjectList();
  renderProjectSelects();
}

function readSettings() {
  var el = function(id) { return document.getElementById(id); };
  S.settings.workDuration = Math.max(1, parseInt(el('opt-work').value) || 25);
  S.settings.shortBreakDuration = Math.max(1, parseInt(el('opt-short').value) || 5);
  S.settings.longBreakDuration = Math.max(1, parseInt(el('opt-long').value) || 15);
  S.settings.longBreakInterval = Math.max(2, parseInt(el('opt-interval').value) || 4);
  S.settings.autoStartBreak = el('opt-auto-break').checked;
  S.settings.autoStartWork = el('opt-auto-work').checked;
  S.settings.soundEnabled = el('opt-sound').checked;
  S.settings.soundVolume = parseFloat(el('opt-volume').value);
  S.settings.notificationsEnabled = el('opt-notify').checked;
  var wlEl = el('opt-wakelock');
  if (wlEl) S.settings.wakeLockEnabled = wlEl.checked;
  saveState();
  if (!timer.running) timer.remaining = getModeDuration(timer.mode) * 60;
  updateTimerUI();
}

function applyTheme(theme) {
  document.body.dataset.theme = theme; S.settings.theme = theme; saveState();
  document.querySelectorAll('.t-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.theme === theme); });
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
  };
  reader.readAsText(file);
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
  document.getElementById('onboarding').removeAttribute('hidden');
  renderOnboardStep();
}
function renderOnboardStep() {
  var step = onboardSteps[onboardStep];
  var body = document.getElementById('onboarding-body');
  body.innerHTML = '<span class="ob-emoji">' + step.emoji + '</span><h3>' + step.title + '</h3><p>' + step.text + '</p>';
  var dots = document.getElementById('onboarding-dots');
  dots.innerHTML = onboardSteps.map(function(_, i) {
    return '<span class="onboarding-dot' + (i === onboardStep ? ' active' : '') + '"></span>';
  }).join('');
  document.getElementById('onboarding-next').textContent = onboardStep === onboardSteps.length - 1 ? '开始使用' : '下一步';
}
function closeOnboarding() {
  document.getElementById('onboarding').setAttribute('hidden', '');
  try { localStorage.setItem(ONBOARD_KEY, '1'); } catch(_) {}
}

// ==================== UTILS ====================
function fmtTime(sec) {
  var m = Math.floor(sec / 60), s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}
function esc(str) {
  var d = document.createElement('div'); d.textContent = str; return d.innerHTML;
}
function toast(msg) {
  var wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  wrap.appendChild(t); setTimeout(function() { t.remove(); }, 3000);
}

// ==================== INIT & EVENTS ====================
document.addEventListener('DOMContentLoaded', function() {
  // Safe event binding helper — never crashes on missing element
  function $on(id, evt, fn) { var e = document.getElementById(id); if (e) e.addEventListener(evt, fn); }

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

  var onboarded = false;
  try { onboarded = localStorage.getItem(ONBOARD_KEY) === '1'; } catch(_) {}
  if (!onboarded) setTimeout(showOnboarding, 600);

  if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(function() {}); }
  if (S.settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // ---- Timer ----
  $on('btn-start', 'click', function() { timer.running ? pauseTimer() : startTimer(); });
  $on('btn-reset', 'click', resetTimer);
  $on('btn-skip', 'click', skipTimer);
  $on('timer-ring-wrap', 'click', function() { if (!timer.running) showTimePicker(); });

  // ---- Mode buttons ----
  document.querySelectorAll('.mode-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (timer.running) return;
      timer.mode = btn.dataset.mode;
      timer.remaining = getModeDuration(btn.dataset.mode) * 60;
      timer.startedAt = null; timer.startedRemaining = null;
      document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active'); updateTimerUI();
    });
  });

  // ---- Task input ----
  var taskInput = document.getElementById('task-input');
  $on('task-add-btn', 'click', addTaskFromInput);
  taskInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') addTaskFromInput(); });

  // ---- Quick input toggle ----
  $on('task-input-more', 'click', toggleQuickInput);

  // ---- Quick input bar ----
  var qiBar = document.getElementById('quick-input-bar');
  if (qiBar) {
    qiBar.addEventListener('click', function(e) {
      var btn = e.target.closest('.prio-btn');
      if (btn && btn.dataset.prio) {
        quickInputPrio = parseInt(btn.dataset.prio);
        document.querySelectorAll('#quick-input-bar .prio-btn').forEach(function(b) {
          b.classList.toggle('active', parseInt(b.dataset.prio) === quickInputPrio);
        });
      }
    });
    var todayBtn = document.getElementById('qi-today-btn');
    if (todayBtn) todayBtn.addEventListener('click', function() { todayBtn.classList.toggle('active'); });
    var tagInput = document.getElementById('qi-tag-input');
    if (tagInput) tagInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var val = tagInput.value.trim();
        if (val && quickInputTags.indexOf(val) === -1) { quickInputTags.push(val); renderQITags(); }
        tagInput.value = '';
      }
    });
    qiBar.addEventListener('click', function(e) {
      var tag = e.target.closest('[data-qi-remove-tag]');
      if (tag) { quickInputTags = quickInputTags.filter(function(t) { return t !== tag.dataset.qiRemoveTag; }); renderQITags(); }
    });
  }

  // ---- Task list ----
  $on('task-list', 'click', function(e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
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

  // ---- GTD tabs ----
  var gtdTabs = document.getElementById('gtd-tabs');
  if (gtdTabs) gtdTabs.addEventListener('click', function(e) {
    var tab = e.target.closest('.gtd-tab');
    if (!tab) return;
    currentArea = tab.dataset.area;
    document.querySelectorAll('.gtd-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active'); renderTasks();
  });

  // ---- Nav buttons ----
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

  // ---- Calendar nav ----
  // View toggle
  var calMonthBtn = document.getElementById('cal-view-month');
  if (calMonthBtn) calMonthBtn.addEventListener('click', function() { switchCalView('month'); });
  var calDayBtn = document.getElementById('cal-view-day');
  if (calDayBtn) calDayBtn.addEventListener('click', function() { switchCalView('day'); });
  // Day view date navigation
  var calDayPrev = document.getElementById('cal-day-prev');
  if (calDayPrev) calDayPrev.addEventListener('click', function() {
    var d = new Date(selectedCalDayDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    selectedCalDayDate = d.toISOString().slice(0, 10);
    renderCalendar();
  });
  var calDayNext = document.getElementById('cal-day-next');
  if (calDayNext) calDayNext.addEventListener('click', function() {
    var d = new Date(selectedCalDayDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    selectedCalDayDate = d.toISOString().slice(0, 10);
    renderCalendar();
  });

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

  // ---- Calendar grid ----
  var calGrid = document.getElementById('cal-grid');
  if (calGrid) calGrid.addEventListener('click', function(e) {
    var cell = e.target.closest('.cal-day');
    if (!cell || cell.classList.contains('other-month')) return;
    if (cell.dataset.date) selectCalDate(cell.dataset.date);
  });

  // ---- Calendar task click ----
  var calTaskList = document.getElementById('cal-task-list');
  if (calTaskList) calTaskList.addEventListener('click', function(e) {
    var item = e.target.closest('[data-cal-task]');
    if (item) openDetail(item.dataset.calTask);
  });
  // Day view task click
  var dayTimeline = document.getElementById('cal-dayview-timeline');
  if (dayTimeline) dayTimeline.addEventListener('click', function(e) {
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

  // Detail priority
  document.querySelectorAll('#det-prio-group .prio-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#det-prio-group .prio-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  // Detail tag remove
  $on('detail-panel', 'click', function(e) {
    var chip = e.target.closest('[data-remove-tag]');
    if (!chip || !detailTaskId) return;
    var t = S.tasks.find(function(x) { return x.id === detailTaskId; });
    if (!t) return;
    t.tags = (t.tags || []).filter(function(tag) { return tag !== chip.dataset.removeTag; });
    saveState(); renderDetailTags(t.tags);
  });

  // Detail tag add
  var detTagInput = document.getElementById('det-tag-input');
  if (detTagInput) detTagInput.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    var val = detTagInput.value.trim();
    if (!val || !detailTaskId) return;
    var t = S.tasks.find(function(x) { return x.id === detailTaskId; });
    if (!t) return;
    if (!t.tags) t.tags = [];
    if (t.tags.indexOf(val) === -1) { t.tags.push(val); saveState(); renderDetailTags(t.tags); }
    detTagInput.value = '';
  });

  // ---- Time picker ----
  document.querySelectorAll('.time-preset').forEach(function(btn) {
    btn.addEventListener('click', function() { applyTimePick(parseInt(btn.dataset.min)); });
  });
  $on('time-custom-confirm', 'click', function() {
    applyTimePick(parseInt(document.getElementById('time-custom-input').value));
  });
  $on('time-custom-input', 'keydown', function(e) {
    if (e.key === 'Enter') applyTimePick(parseInt(this.value));
  });
  $on('time-picker-cancel', 'click', function() {
    document.getElementById('modal-time-picker').setAttribute('hidden', '');
  });

  // ---- Onboarding ----
  $on('onboarding-next', 'click', function() {
    if (onboardStep < onboardSteps.length - 1) { onboardStep++; renderOnboardStep(); }
    else closeOnboarding();
  });
  $on('onboarding-skip', 'click', closeOnboarding);

  // ---- Settings inputs ----
  ['opt-work','opt-short','opt-long','opt-interval','opt-auto-break','opt-auto-work','opt-sound','opt-notify'].forEach(function(id) {
    var s = document.getElementById(id);
    if (s) s.addEventListener('change', readSettings);
  });
  var volEl = document.getElementById('opt-volume');
  if (volEl) volEl.addEventListener('input', function(e) {
    var rv = document.getElementById('range-val');
    if (rv) rv.textContent = Math.round(e.target.value * 100) + '%';
    readSettings();
  });
  var testSound = document.getElementById('btn-test-sound');
  if (testSound) testSound.addEventListener('click', function() { chime(S.settings.soundVolume); });

  document.querySelectorAll('.t-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { applyTheme(btn.dataset.theme); });
  });

  var resetSett = document.getElementById('btn-reset-sett');
  if (resetSett) resetSett.addEventListener('click', function() {
    if (!confirm('恢复默认设置？')) return;
    S.settings = JSON.parse(JSON.stringify(DEFAULTS.settings)); saveState(); initSettings();
    if (!timer.running) { timer.remaining = getModeDuration(timer.mode) * 60; updateTimerUI(); }
    toast('设置已重置');
  });

  var clearAll = document.getElementById('btn-clear-all');
  if (clearAll) clearAll.addEventListener('click', function() {
    if (!confirm('⚠ 清除所有数据？不可恢复！')) return;
    localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_KEY + '_timer');
    S = JSON.parse(JSON.stringify(DEFAULTS));
    timer = {mode:'work', remaining:S.settings.workDuration*60, running:false, intervalId:null, startedAt:null, startedRemaining:null, cycleCount:0, taskId:null};
    saveState(); initSettings(); updateTimerUI(); renderTasks(); updateDoneList(); updateGtdCounts(); toast('数据已清除');
  });

  $on('btn-export', 'click', exportData);
  $on('btn-import', 'change', function(e) {
    if (e.target.files[0]) importData(e.target.files[0]); e.target.value = '';
  });

  var wle = document.getElementById('opt-wakelock');
  if (wle) wle.addEventListener('change', readSettings);

  // ---- Project management ----
  var addProjBtn = document.getElementById('btn-add-project');
  if (addProjBtn) addProjBtn.addEventListener('click', function() {
    var nameEl = document.getElementById('project-new-name');
    var colorEl = document.getElementById('project-new-color');
    if (nameEl && nameEl.value.trim()) {
      addProject(nameEl.value.trim(), colorEl ? colorEl.value : '#e74c3c');
      nameEl.value = '';
    }
  });
  var projList = document.getElementById('project-list');
  if (projList) projList.addEventListener('click', function(e) {
    var del = e.target.closest('[data-del-project]');
    if (del && confirm('删除此项目？')) deleteProject(del.dataset.delProject);
  });

  // ---- Keyboard shortcuts ----
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.code === 'Space') { e.preventDefault(); timer.running ? pauseTimer() : startTimer(); }
    if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) resetTimer();
    if (e.code === 'KeyT' && !e.ctrlKey && !e.metaKey) { var w = document.querySelector('[data-view="work"]'); if (w) w.click(); }
    if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) { var s = document.querySelector('[data-view="settings"]'); if (s) s.click(); }
  });
});
