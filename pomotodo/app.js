/**
 * Pomotodo V5 — app.js
 * V5 changes: P0 features (daily launch, rest guide, celebration, abandon confirm,
 * daily focus, habit streak, daily review) + P1 features (5-min quick start,
 * task resumption prompt, light focus mode)
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
    wakeLockEnabled: false, theme: 'light',
        // V5 settings
        restGuideEnabled: true,
        focusModeEnabled: true,
        celebrationEnabled: true,
        interruptionConfirm: true,
        lastLaunchDate: '',
        lastReviewDate: '',
        dailyFocusIds: []
  },
 tasks: [], sessions: [], projects: [],
 habitStreak: { currentStreak: 0, longestStreak: 0, lastActiveDate: '', calendarData: {} },
 dailyReviews: []
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
var currentProjectView = null; // 当前展开的项目ID（GTD项目Tab中）
var currentParentView = null; // 当前查看子任务的父任务ID

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
// V5 runtime state (NOT persisted in S.settings)
var _quickStartTaskId = null;
var _lastResumptionDate = '';
var _lastResumptionTask = '';
// ==================== MODAL QUEUE SYSTEM ====================
var _modalQueue = [];
var _activeModal = null;
function queueModal(id, showFn, priority) {
  priority = priority || 50;
  if (_activeModal === id) return;
  for (var i = 0; i < _modalQueue.length; i++) {
    if (_modalQueue[i].id === id) return;
  }
  _modalQueue.push({ id: id, show: showFn, priority: priority });
  _modalQueue.sort(function(a, b) { return a.priority - b.priority; });
  _processModalQueue();
}
function _processModalQueue() {
  if (_activeModal) return;
  if (_modalQueue.length === 0) { _showPendingResumption(); return; }
  var next = _modalQueue.shift();
  _activeModal = next.id;
  next.show();
}
function closeActiveModal() {
  _activeModal = null;
  _processModalQueue();
}
var _pendingResumption = null;
function _showPendingResumption() {
  if (_pendingResumption) { _pendingResumption(); _pendingResumption = null; }
}
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
 projects: d.projects || [],
 habitStreak: Object.assign({}, DEFAULTS.habitStreak, d.habitStreak || {}),
 dailyReviews: d.dailyReviews || []
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
 if (!t.parentId) t.parentId = '';
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
    // V5 P-12: Dispatch focus mode toggle
    document.dispatchEvent(new CustomEvent('timer-focus-toggle'));
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
    // V5 P-12: Dispatch focus mode toggle
    document.dispatchEvent(new CustomEvent('timer-focus-toggle'));
}

function resetTimer() {
 // V5 P-04: If timer is running, show abandon confirm modal instead
 if (timer.running && S.settings.interruptionConfirm !== false) {
  var mins = Math.floor((getModeDuration(timer.mode) * 60 - timer.remaining) / 60);
  var minsEl = document.getElementById('abandon-minutes');
  if (minsEl) minsEl.textContent = Math.max(mins, 1);
  document.getElementById('modal-abandon-confirm').hidden = false;
  _activeModal = 'abandon-confirm';
  return;
 }
  click(S.settings.soundVolume);
  timer.running = false; clearInterval(timer.intervalId); timer.intervalId = null;
  timer.remaining = getModeDuration(timer.mode) * 60;
  timer.startedAt = null; timer.startedRemaining = null;
  clearTimerState();
  if (timerWorker) timerWorker.postMessage({ type: 'stop' });
  updateTimerUI();
}

function onTimerComplete() {
 // V5 P-08: Handle quick start 5-min completion
 if (_quickStartTaskId && timer.mode === 'work') {
  var qId = _quickStartTaskId;
  _quickStartTaskId = null;
  onQuickStartComplete(qId);
  return;
 }
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
    timer.cycleCount++; S.sessions.push(session); saveState();
    // V5 P-06: Update habit streak on work completion
    updateHabitStreak();
 showCelebration();
    showCompleteModal(session);
    // V5 P-02: Show rest guide when transitioning to break
    showRestGuide();
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
  if (timer.mode === 'work' && timer.remaining < total * 0.5) {
    var session = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      type: timer.mode, start: timer.startedAt || new Date().toISOString(),
      end: new Date().toISOString(), duration: total - timer.remaining, taskId: null
    };
    S.sessions.push(session); timer.cycleCount++; saveState();
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
    projectId: opts.projectId || '', 
  parentId: opts.parentId || '',notes: opts.notes || ''
  ,
        dailyFocus: false};
  S.tasks.unshift(task); saveState(); renderTasks(); updateGtdCounts();
  return task;
}

function getSubtasks(parentId) {
  return S.tasks.filter(function(t) { return t.parentId === parentId; });
}

function hasSubtasks(task) {
  return S.tasks.some(function(t) { return t.parentId === task.id; });
}

function addSubtask(parentId, title) {
  var parentTask = S.tasks.find(function(t) { return t.id === parentId; });
  if (!parentTask) return null;
  var task = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: title,
    tags: [],
    priority: parentTask.priority || 4,
    today: parentTask.today || false,
    completed: false,
    pinned: false,
    pomodorosCompleted: 0,
    estimatedPomodoros: 0,
    createdAt: new Date().toISOString(),
    area: parentTask.area || 'next',
    dueDatetime: '',
    projectId: parentTask.projectId || '',
    parentId: parentId,
    notes: ''
  };
  S.tasks.unshift(task);
  saveState();
  return task;
}

function toggleTask(id) {
  var t = S.tasks.find(function(x) { return x.id === id; });
  if (!t) return;
  var wasCompleted = t.completed;
  var wasArchive = t.area === 'archive';
  t.completed = !t.completed;
  if (t.completed) {
    if (!t.parentId) t.area = 'archive';
  } else {
    if (!t.parentId && t.area === 'archive') {
      t.area = t.today ? 'next' : 'inbox';
    }
  }
  saveState(); renderTasks(); updateGtdCounts();
  // 恢复任务时给出明确的toast反馈
  if (wasCompleted && wasArchive && !t.completed) {
    var areaNames = {inbox:'📥 收件箱', next:'▶ 下一步', projects:'📁 项目', someday:'💭 将来/也许'};
    toast('已恢复到 ' + (areaNames[t.area] || t.area));
  }
  // 子任务完成时：检查是否所有同级子任务都已完成，提示完成父任务
  if (t.completed && t.parentId) {
    var parent = S.tasks.find(function(x) { return x.id === t.parentId; });
    if (parent && !parent.completed) {
      var siblings = getSubtasks(t.parentId);
      var allDone = siblings.every(function(s) { return s.completed; });
      if (allDone && siblings.length > 0) {
        toast('🎉 所有子任务已完成！考虑完成父任务「' + parent.title + '」');
      }
    }
  }
}
function pinTask(id) {
  var t = S.tasks.find(function(x) { return x.id === id; });
  if (!t) return; t.pinned = !t.pinned; saveState(); renderTasks();
}
function deleteTask(id) {
  var childIds = S.tasks.filter(function(x) { return x.parentId === id; }).map(function(x) { return x.id; });
  childIds.forEach(function(cid) { deleteTask(cid); });
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
    // 只统计顶层任务（无parentId），避免子任务重复计数
    if (t.parentId) return;
    if (t.completed || t.area === 'archive') c.archive++;
    else if (t.area === 'inbox') c.inbox++;
    else if (t.area === 'next' || t.today) c.next++;
    else if (t.area === 'projects') c.projects++;
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

  // 子任务区域
  var subtaskSection = document.getElementById('det-subtask-section');
  var parentSection = document.getElementById('det-parent-section');
  var parentLink = document.getElementById('det-parent-link');

  // 如果有父任务，显示父任务信息
  if (parentSection && parentLink) {
    if (t.parentId) {
      var parent = S.tasks.find(function(pt) { return pt.id === t.parentId; });
      if (parent) {
        parentLink.textContent = parent.title;
        parentLink.dataset.parentId = parent.id;
        parentSection.style.display = '';
      } else {
        parentSection.style.display = 'none';
      }
    } else {
      parentSection.style.display = 'none';
    }
  }

  // 子任务列表
  if (subtaskSection) {
    if (t.parentId) {
      // 子任务不显示子任务区域
      subtaskSection.style.display = 'none';
    } else {
      subtaskSection.style.display = '';
      renderDetailSubtasks(t.id);
    }
  }


  // "转为项目"按钮：如果任务不是项目区域且无子任务，显示升级入口
  var promoteBtn = document.getElementById('det-promote-project');
  if (promoteBtn) {
    promoteBtn.style.display = (!t.parentId && t.area !== 'projects' && !hasSubtasks(t)) ? '' : 'none';
  }
  document.getElementById('detail-overlay').removeAttribute('hidden');
  var panel = document.getElementById('detail-panel');
  panel.removeAttribute('hidden');
  setTimeout(function() { panel.classList.add('open'); }, 10);
}

function renderDetailSubtasks(parentId) {
  var listEl = document.getElementById('det-subtask-list');
  var countEl = document.getElementById('det-subtask-count');
  if (!listEl) return;
  var children = getSubtasks(parentId);
  var activeCount = children.filter(function(c) { return !c.completed; }).length;
  if (countEl) countEl.textContent = children.length + ' 子任务（' + activeCount + ' 待办）';
  if (children.length === 0) {
    listEl.innerHTML = '<span style="font-size:.78rem;color:var(--c-text2)">暂无子任务</span>';
    return;
  }
  listEl.innerHTML = children.map(function(c) {
    return '<div class="det-subtask-item' + (c.completed ? ' completed' : '') + '" data-subtask-id="' + c.id + '">'
      + '<span class="det-subtask-check" data-act="toggle" data-id="' + c.id + '">' + (c.completed ? '✓' : '○') + '</span>'
      + '<span class="det-subtask-title">' + esc(c.title) + '</span>'
      + '<span class="det-subtask-del" data-act="delete-subtask" data-id="' + c.id + '">✕</span>'
      + '</div>';
  }).join('');
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
  // parentId is not editable in detail panel (it's set via addSubtask or promote)
  // Sync tags: read current tag chips from detail panel to ensure consistency
  var tagChips = document.querySelectorAll('#det-tags .det-tag-chip');
  if (tagChips.length > 0 || t.tags.length > 0) {
    // Only sync if there are visible chips or existing tags (avoid overwriting on partial render)
    var currentTags = [];
    tagChips.forEach(function(chip) {
      var tagText = chip.getAttribute('data-remove-tag');
      if (tagText) currentTags.push(tagText);
    });
    t.tags = currentTags;
  }
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

// 双击日历日期 → 切换到日视图
function selectCalDateAndSwitch(dateStr) {
  selectedCalDate = dateStr;
  selectedCalDayDate = dateStr;
  calViewMode = 'day';
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
  // 智能默认area：根据当前GTD tab设置默认area
  var qiArea = document.getElementById('qi-area');
  var defaultArea = 'inbox';
  // 如果quick-input bar可见且用户选了area，优先用那个
  if (qiArea && qiArea.value && qiArea.value !== 'inbox') {
    defaultArea = qiArea.value;
  } else if (currentArea && currentArea !== 'inbox' && currentArea !== 'archive' && currentArea !== 'all') {
    // 根据当前GTD tab设置默认area
    defaultArea = currentArea;
  }
  var opts = {
    priority: quickInputPrio,
    tags: quickInputTags.slice(),
    today: false,
    dueDatetime: document.getElementById('qi-datetime').value || '',
    area: qiArea ? (qiArea.value || defaultArea) : defaultArea,
    projectId: document.getElementById('qi-project').value || '',
    estimatedPomodoros: 0
  };
  // 如果在项目Tab且area不是projects，自动设为projects
  if (currentArea === 'projects' && opts.area !== 'projects') {
    opts.area = 'projects';
  }
  var todayBtn = document.getElementById('qi-today-btn');
  if (todayBtn && todayBtn.classList.contains('active')) opts.today = true;
  addTask(title, opts);
  input.value = '';
  quickInputPrio = 4;
  quickInputTags = [];
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

// ==================== PROJECT CARD VIEW ====================
function renderProjectCards(listEl, tasks) {
  // 找出所有无parentId的顶层任务
  var parentTasks = tasks.filter(function(t) { return !t.parentId; });
  
  // 分为两类：有子任务的项目卡片 vs 无子任务的普通任务
  var projectItems = parentTasks.filter(function(t) { return hasSubtasks(t); });
  var simpleItems = parentTasks.filter(function(t) { return !hasSubtasks(t); });
  
  var html = '';
  
  // 项目卡片区域
  if (projectItems.length > 0) {
    html += '<div class="project-cards-section">';
    html += '<div class="project-cards-label">📁 项目（点击卡片查看子任务）</div>';
    html += projectItems.map(function(t) {
      var p = t.priority || 4;
      var kids = getSubtasks(t.id);
      var activeKids = kids.filter(function(k) { return !k.completed; }).length;
      var doneKids = kids.length - activeKids;
      var progress = kids.length > 0 ? Math.round((doneKids / kids.length) * 100) : 0;
      var proj = t.projectId ? S.projects.find(function(pr) { return pr.id === t.projectId; }) : null;
      var projColor = proj ? proj.color : 'var(--c-accent)';
      var projName = proj ? esc(proj.name) : '';
      var tagHtml = (t.tags || []).map(function(tag) { return '<span class="task-tag">#' + esc(tag) + '</span>'; }).join(' ');
      var dueStr = t.dueDatetime ? fmtDue(t) : '';
      return '<div class="project-card" data-act="view-subtasks" data-id="' + t.id + '">'
        + '<div class="project-card-header">'
        + '<span class="project-card-prio p' + p + '">P' + p + '</span>'
        + '<span class="project-card-title">' + esc(t.title) + '</span>'
        + (projName ? '<span class="project-card-proj" style="color:' + projColor + '">● ' + projName + '</span>' : '')
        + '<div class="project-card-actions">' + '<button class="project-card-act" data-act="detail" data-id="' + t.id + '" title="详情">📝</button>' + '<button class="project-card-act" data-act="delete" data-id="' + t.id + '" title="删除">🗑</button>' + '</div>' + '</div>'
        + (tagHtml || dueStr ? '<div class="project-card-meta">' + tagHtml + (dueStr ? '<span class="task-due-badge">' + dueStr + '</span>' : '') + '</div>' : '')
        + '<div class="project-card-stats">'
        + '<span class="project-card-stat">📋 ' + kids.length + ' 子任务</span>'
        + '<span class="project-card-stat">✅ ' + doneKids + ' 完成</span>'
        + '<span class="project-card-stat">▶ ' + activeKids + ' 待办</span>'
        + '</div>'
        + (kids.length > 0 ? '<div class="project-card-progress"><div class="project-card-progress-bar" style="width:' + progress + '%;background:' + projColor + '"></div></div>' : '')
        + '</div>';
    }).join('');
    html += '</div>';
  }
  
  // 普通任务列表区域
  if (simpleItems.length > 0) {
    html += '<div class="project-simple-section">';
    html += '<div class="project-cards-label">📝 待规划任务（可在详情面板添加子任务升级为项目）</div>';
    var prioLabels = {1:'P1',2:'P2',3:'P3',4:'P4'};
    html += simpleItems.map(function(t) {
      var p = t.priority || 4;
      var tagHtml = (t.tags || []).map(function(tag) { return '<span class="task-tag">#' + esc(tag) + '</span>'; }).join(' ');
      var dueBadge = '';
      if (t.dueDatetime) {
        var isOverdue = getTaskDate(t) < new Date().toISOString().slice(0, 10) && !t.completed;
        dueBadge = '<span class="task-due-badge' + (isOverdue ? ' overdue' : '') + '">' + fmtDue(t) + '</span>';
      }
      return '<li class="task-item prio-' + p + '" data-id="' + t.id + '">'
        + '<div class="task-check" data-act="toggle" data-id="' + t.id + '"></div>'
        + '<span class="task-prio-badge p' + p + '" data-act="prio" data-id="' + t.id + '" title="切换优先级">' + prioLabels[p] + '</span>'
        + '<span class="task-text" data-act="detail" data-id="' + t.id + '">' + esc(t.title) + ' ' + tagHtml + dueBadge + '</span>'
        + '<span class="task-pomo">' + '🍅'.repeat(Math.min(t.pomodorosCompleted, 5)) + '</span>'
        + '<div class="task-btns">'
        + '<button class="task-btn" data-act="select" data-id="' + t.id + '">○</button>'
        + '<button class="task-btn del" data-act="delete" data-id="' + t.id + '">✕</button>'
        + '</div></li>';
    }).join('');
    html += '</div>';
  }
  
  if (parentTasks.length === 0) {
    listEl.innerHTML = '<div class="empty-state">📁 还没有项目<br><small>在上方输入框添加项目任务，然后在详情面板中添加子任务来规划项目</small></div>';
    return;
  }
  
  listEl.innerHTML = html;
}

// ==================== SUBTASK DRILL-DOWN VIEW ====================
function renderSubtaskView(listEl, parentTask) {
  if (!parentTask) {
    currentParentView = null;
    renderTasks();
    return;
  }
  // 获取所有子任务（包括已完成的），不受area过滤影响
  var kids = getSubtasks(parentTask.id);
  var activeKids = kids.filter(function(k) { return !k.completed; }).length;
  var doneKids = kids.length - activeKids;
  var p = parentTask.priority || 4;
  var prioLabels = {1:'P1',2:'P2',3:'P3',4:'P4'};
  var progressPct = kids.length > 0 ? Math.round((doneKids / kids.length) * 100) : 0;
  var dueStr = parentTask.dueDatetime ? fmtDue(parentTask) : '';
  var html = '<div class="subtask-view-header">'
    + '<button class="subtask-back-btn" data-act="back-to-project">← 返回项目列表</button>'
    + '<div class="subtask-parent-info">'
    + '<span class="task-prio-badge p' + p + '">' + prioLabels[p] + '</span>'
    + '<span class="subtask-parent-title">' + esc(parentTask.title) + '</span>'
    + (dueStr ? '<span class="task-due-badge' + (parentTask.dueDatetime && getTaskDate(parentTask) < new Date().toISOString().slice(0, 10) ? ' overdue' : '') + '">' + dueStr + '</span>' : '')
    + '</div>'
    + '<div class="subtask-progress-row">'
    + '<div class="subtask-progress-bar"><div class="subtask-progress-fill" style="width:' + progressPct + '%"></div></div>'
    + '<span class="subtask-progress-pct">' + progressPct + '%</span>'
    + '<span class="subtask-parent-stats">✅' + doneKids + ' / 📋' + kids.length + '</span>'
    + '</div>'
    + '</div>';
  // 快速操作栏：完成所有子任务
  if (activeKids > 0) {
    html += '<div class="subtask-quick-actions">'
      + '<button class="btn-sm" data-act="complete-all-subtasks" data-id="' + parentTask.id + '" title="完成所有待办子任务">✅ 完成所有子任务</button>'
      + '</div>';
  }
  // 子任务添加输入框
  html += '<div class="subtask-add-row">'
    + '<input type="text" id="subtask-input" class="subtask-add-input" placeholder="添加子任务..." data-parent-id="' + parentTask.id + '" />'
    + '<button id="subtask-add-btn" class="btn-sm btn-primary" data-parent-id="' + parentTask.id + '">＋</button>'
    + '</div>';
  // 子任务列表（包含已完成和未完成）
  html += '<ul class="subtask-list">';
  if (kids.length === 0) {
    html += '<li class="empty-state" style="padding:1rem">📋 暂无子任务<br><small>子任务是项目下的可执行步骤</small></li>';
  } else {
    // 先显示待办子任务，再显示已完成子任务
    var activeList = kids.filter(function(k) { return !k.completed; });
    var doneList = kids.filter(function(k) { return k.completed; });
    
    activeList.forEach(function(t) {
      html += renderSubtaskItem(t);
    });
    
    if (doneList.length > 0) {
      html += '<li class="subtask-divider">✅ 已完成 (' + doneList.length + ')</li>';
      doneList.forEach(function(t) {
        html += renderSubtaskItem(t);
      });
    }
  }
  html += '</ul>';
  listEl.innerHTML = html;
}

function renderSubtaskItem(t) {
  var isActive = timer.taskId === t.id;
  var tp = t.priority || 4;
  var prioLabels = {1:'P1',2:'P2',3:'P3',4:'P4'};
  var tagHtml = (t.tags || []).map(function(tag) { return '<span class="task-tag">#' + esc(tag) + '</span>'; }).join(' ');
  var dueBadge = '';
  if (t.dueDatetime) {
    var isOverdue = getTaskDate(t) < new Date().toISOString().slice(0, 10) && !t.completed;
    dueBadge = '<span class="task-due-badge' + (isOverdue ? ' overdue' : '') + '">' + fmtDue(t) + '</span>';
  }
  return '<li class="task-item prio-' + tp + (t.completed ? ' completed' : '') + (isActive ? ' active-task' : '') + '" data-id="' + t.id + '">'
    + '<div class="task-check" data-act="toggle" data-id="' + t.id + '">' + (t.completed ? '✓' : '') + '</div>'
    + '<span class="task-prio-badge p' + tp + '" data-act="prio" data-id="' + t.id + '">' + prioLabels[tp] + '</span>'
    + '<span class="task-text" data-act="detail" data-id="' + t.id + '">' + esc(t.title) + ' ' + tagHtml + dueBadge + '</span>'
    + '<span class="task-pomo">' + '🍅'.repeat(Math.min(t.pomodorosCompleted, 5)) + '</span>'
    + '<div class="task-btns">'
    + '<button class="task-btn" data-act="select" data-id="' + t.id + '">' + (isActive ? '🍅' : '○') + '</button>'
    + '<button class="task-btn del" data-act="delete" data-id="' + t.id + '">✕</button>'
    + '</div></li>';
}

// ==================== ARCHIVE GROUPED VIEW ====================
function renderArchiveView(listEl, tasks) {
    // 按完成日期分组，最新在前
    var today = new Date().toISOString().slice(0, 10);
    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    var groups = {};
    tasks.forEach(function(t) {
        var dateKey = t.completed ? (t.createdAt || '').slice(0, 10) || '未知日期' : (t.createdAt || '').slice(0, 10) || '未知日期';
        // 尝试从sessions中找到完成时间
        var sess = S.sessions.filter(function(s) { return s.taskId === t.id && s.type === 'work'; });
        if (sess.length > 0) {
            dateKey = sess[sess.length - 1].start.slice(0, 10) || dateKey;
        }
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(t);
    });
    var sortedKeys = Object.keys(groups).sort().reverse();
    var prioLabels = {1:'P1',2:'P2',3:'P3',4:'P4'};
    var html = '';
    sortedKeys.forEach(function(dk) {
        var label = dk;
        if (dk === today) label = '📅 今天';
        else if (dk === yesterday) label = '📅 昨天';
        else label = '📅 ' + dk;
        html += '<div class="archive-group"><div class="archive-group-label">' + esc(label) + '</div><ul class="archive-group-list">';
        groups[dk].forEach(function(t) {
            var p = t.priority || 4;
            var tagHtml = (t.tags || []).map(function(tag) { return '<span class="task-tag">#' + esc(tag) + '</span>'; }).join(' ');
            var projBadge = '';
            if (t.projectId) {
                var proj = S.projects.find(function(pr) { return pr.id === t.projectId; });
                if (proj) projBadge = '<span class="task-area-badge">' + esc(proj.name) + '</span>';
            }
            var parentBadge = '';
            if (t.parentId) {
                var parent = S.tasks.find(function(pt) { return pt.id === t.parentId; });
                if (parent) parentBadge = '<span class="task-parent-badge">📁 ' + esc(parent.title) + '</span>';
            }
            html += '<li class="task-item prio-' + p + ' completed" data-id="' + t.id + '">' +
                '<div class="task-check" data-act="toggle" data-id="' + t.id + '">✓</div>' +
                '<span class="task-prio-badge p' + p + '">' + prioLabels[p] + '</span>' +
                '<span class="task-text" data-act="detail" data-id="' + t.id + '">' + esc(t.title) + ' ' + tagHtml + projBadge + parentBadge + '</span>' +
                '<span class="task-pomo">' + '🍅'.repeat(Math.min(t.pomodorosCompleted, 5)) + '</span>' +
                '<div class="task-btns">' +
                '<button class="task-btn" data-act="restore" data-id="' + t.id + '" title="恢复到待办">↩</button>' +
                '<button class="task-btn del" data-act="delete" data-id="' + t.id + '">✕</button>' +
                '</div></li>';
        });
        html += '</ul></div>';
    });
    listEl.innerHTML = html || '<div class="empty-state">📭 归档为空<br><small>完成后的任务会自动归档到这里，可点击 ↩ 恢复</small></div>';
}

function renderTasks() {
  var filter = currentFilter;
  var tasks = S.tasks.slice();

  // Filter by GTD area
  if (currentArea && currentArea !== 'all') {
    tasks = tasks.filter(function(t) {
      if (currentArea === 'next') return t.area === 'next';
      if (currentArea === 'projects') return t.area === 'projects' && !t.completed;
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

  // ---- 项目Tab: 卡片视图 + 子任务钻入 ----
  if (currentArea === 'projects' && !currentParentView) {
    renderProjectCards(list, tasks);
    return;
  }
  if (currentArea === 'projects' && currentParentView) {
    var parentTask = S.tasks.find(function(t) { return t.id === currentParentView; });
    if (parentTask) {
      renderSubtaskView(list, parentTask);
      // 自动聚焦子任务输入框，方便快速添加
      setTimeout(function() {
        var si = document.getElementById('subtask-input');
        if (si) si.focus();
      }, 50);
    } else {
      currentParentView = null;
      renderProjectCards(list, tasks);
    }
    return;
  }

  // 归档区：按完成时间分组
  if (currentArea === 'archive' && tasks.length > 0) {
    renderArchiveView(list, tasks);
    return;
  }
  if (tasks.length === 0) {
    list.innerHTML = '<div class="empty-state">🥔 还没有土豆<br><small>在上方输入框添加任务，支持 #标签 !1优先级 @today 快捷语法</small></div>';
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
    var subtaskBadge = '';
    if (!t.parentId && hasSubtasks(t)) {
      var kids = getSubtasks(t.id);
      var activeKids = kids.filter(function(k) { return !k.completed; }).length;
      subtaskBadge = '<span class="task-subtask-badge">📋' + activeKids + '/' + kids.length + '</span>';
    }
    var parentBadge = '';
    if (t.parentId) {
      var parent = S.tasks.find(function(pt) { return pt.id === t.parentId; });
      if (parent) parentBadge = '<span class="task-parent-badge">📁 ' + esc(parent.title) + '</span>';
    }
    var isOverdueItem = dueBadge.indexOf('overdue') > -1;
    return '<li class="task-item prio-' + p + (t.completed ? ' completed' : '') + (t.pinned ? ' pinned' : '') + (isActive ? ' active-task' : '') + (isOverdueItem ? ' overdue' : '') + '" data-id="' + t.id + '">' +
      '<div class="task-check" data-act="toggle" data-id="' + t.id + '">' + (t.completed ? '✓' : '') + '</div>' +
      '<span class="task-prio-badge p' + p + '" data-act="prio" data-id="' + t.id + '" title="切换优先级">' + prioLabels[p] + '</span>' +
      '<span class="task-text" data-act="detail" data-id="' + t.id + '">' + esc(t.title) + ' ' + tagHtml + todayBadge + dueBadge + projBadge + parentBadge + subtaskBadge + '</span>' +
      '<span class="task-pomo">' + '🍅'.repeat(Math.min(t.pomodorosCompleted, 5)) + (t.pomodorosCompleted > 5 ? '+' + t.pomodorosCompleted : '') + '</span>' +
      '<div class="task-btns">' +
      '<button class="task-btn" data-act="pin" data-id="' + t.id + '">' + (t.pinned ? '📌' : '📍') + '</button>' +
              (isOverdueItem ? '<button class="task-btn quickstart-btn" data-act="quickstart" data-id="' + t.id + '" title="5\u5206\u949f\u5feb\u901f\u542f\u52a8">\u26a1</button>' : '')
      '<button class="task-btn" data-act="select" data-id="' + t.id + '">' + (isActive ? '🍅' : '○') + '</button>' +
      '<button class="task-btn del" data-act="delete" data-id="' + t.id + '">✕</button>' +
      '</div></li>';
  }).join('');
}

function updateDoneList() {
  var today = new Date().toISOString().slice(0, 10);
  var todaySessions = S.sessions.filter(function(s) { return s.type === 'work' && s.start && s.start.slice(0, 10) === today; });
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
  queueModal('modal-complete', function() {
    var overlay = document.getElementById('modal-complete');
    overlay.removeAttribute('hidden');
    _activeModal = 'modal-complete';
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
      overlay.setAttribute('hidden', ''); closeActiveModal(); advanceAfterComplete(taskId);
    };
    document.getElementById('modal-skip').onclick = function() {
      overlay.setAttribute('hidden', ''); closeActiveModal(); advanceAfterComplete(null);
    };
  }, 40);
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
                data: counts,
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

// ==================== V5 FEATURES ====================

// --- P-02: Rest Guide ---
fu
function closeRestGuide() {
  document.getElementById('rest-guide-overlay').hidden = true;
  closeActiveModal();
}

function selectRestOption(type) {
 var instructions = {
  breathe: '闭上眼睛，缓慢深呼吸…\n吸气4秒 → 屏息4秒 → 呼气6秒\n重复3-5次，感受呼吸的节奏',
  stretch: '站起来，做简单伸展：\n① 颈部缓缓旋转 ×5\n② 肩部上下耸放 ×5\n③ 手腕旋转 ×5\n④ 站立体前屈 ×3',
  nature: '看看窗外的绿色植物\n或远处的天空和建筑\n让目光在远处停留至少30秒',
  free: '自由休息中…\n记得离开屏幕，让眼睛休息'
 };
 var instEl = document.getElementById('rest-instruction');
 if (instEl) instEl.textContent = instructions[type] || instructions.free;
 document.getElementById('rest-options').hidden = true;
 document.getElementById('rest-timer-display').hidden = false;
}

// --- P-03: Celebration on Task Completion ---
function showCelebration() {
    if (!S.settings.celebrationEnabled) return;
    var overlay = document.getElementById('celebration-overlay');
    if (!overlay) return;
    overlay.hidden = false;
    // Create confetti particles
    var container = overlay.querySelector('.confetti-container');
    if (container) {
        container.innerHTML = '';
        for (var i = 0; i < 30; i++) {
            var particle = document.createElement('span');
            particle.className = 'confetti-particle';
            var colors = ['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6','#1abc9c','#e91e63','#ff6b6b'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 0.5 + 's';
            particle.style.animationDuration = (1 + Math.random() * 1.5) + 's';
            var size = 6 + Math.random() * 8;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            container.appendChild(particle);
        }
    }
    // Auto-hide after 2.5 seconds
    setTimeout(function() {
        overlay.hidden = true;
    }, 2500);
}


// --- P-05: Daily Focus (Top 3) ---
function renderDailyFocus() {
 var focusTasks = S.tasks.filter(function(t) { return t.dailyFocus && !t.completed; });
 var section = document.getElementById('daily-focus-section');
 var list = document.getElementById('df-list');
 if (!section || !list) return;
 if (focusTasks.length === 0) { section.hidden = true; return; }
 section.hidden = false;
 var countEl = document.getElementById('df-count');
 if (countEl) countEl.textContent = focusTasks.length + '/3';
 list.innerHTML = '';
 focusTasks.forEach(function(t) {
  var li = document.createElement('li');
  li.className = 'df-item' + (timer.taskId === t.id ? ' df-active' : '');
  li.innerHTML = '<span class="df-prio prio-' + t.priority + '"></span>' +
   '<span class="df-title">' + escHtml(t.title) + '</span>' +
   '<button class="df-start-btn" data-task-id="' + t.id + '" title="开始番茄钟">🍅</button>' +
   '<button class="df-remove-btn" data-task-id="' + t.id + '" title="移出焦点">✕</button>';
  list.appendChild(li);
 });
 if (focusTasks.length > 5) toast('💡 聚焦3件事效率最高，建议精简');
}
function toggleDailyFocus(id) {
 var t = S.tasks.find(function(x) { return x.id === id; });
 if (!t) return;
 t.dailyFocus = !t.dailyFocus;
 saveState(); renderTasks(); renderDailyFocus();
}
function updateFocusProgress(done, total) {
 var bar = document.getElementById('focus-progress');
 var fill = document.getElementById('focus-progress-fill');
 var text = document.getElementById('focus-progress-text');
 if (!bar) return;
 if (total === 0) { bar.hidden = true; return; }
 bar.hidden = false;
 if (fill) fill.style.width = Math.round(done / total * 100) + '%';
 if (text) text.textContent = done + '/' + total;
}

// --- P-06: Habit Streak ---
function updateHabitStreak() {
 var today = new Date().toISOString().slice(0, 10);
 var cal = S.habitStreak.calendarData || {};
 var todayWork = S.sessions.filter(function(s) {
  return s.type === 'work' && s.start && s.start.slice(0, 10) === today;
 }).length;
 cal[today] = todayWork;
 S.habitStreak.calendarData = cal;
 var streak = 0;
 var d = new Date();
 while (true) {
  var key = d.toISOString().slice(0, 10);
  if (cal[key] && cal[key] > 0) { streak++; d.setDate(d.getDate() - 1); }
  else break;
 }
 S.habitStreak.currentStreak = streak;
 if (streak > S.habitStreak.longestStreak) S.habitStreak.longestStreak = streak;
 S.habitStreak.lastActiveDate = today;
 saveState();
 var badge = document.getElementById('streak-badge');
 var num = document.getElementById('streak-num');
 if (badge && streak > 0) { badge.hidden = false; if (num) num.textContent = streak; }
 else if (badge) { badge.hidden = true; }
}
function renderHabitStreak() {
 var el = function(id) { return document.getElementById(id); };
 if (el('h-current')) el('h-current').textContent = S.habitStreak.currentStreak;
 if (el('h-longest')) el('h-longest').textContent = S.habitStreak.longestStreak;
 var pct = Math.min(100, Math.round(S.habitStreak.currentStreak / 66 * 100));
 if (el('h-goal-fill')) el('h-goal-fill').style.width = pct + '%';
 if (el('h-goal-text')) el('h-goal-text').textContent = S.habitStreak.currentStreak + '/66';
 var heatmap = el('habit-heatmap');
 if (!heatmap) return;
 heatmap.innerHTML = '';
 for (var i = 29; i >= 0; i--) {
  var d = new Date(Date.now() - i * 86400000);
  var key = d.toISOString().slice(0, 10);
  var count = (S.habitStreak.calendarData || {})[key] || 0;
  var cell = document.createElement('span');
  cell.className = 'hm-cell' + (count > 0 ? ' hm-active hm-lv' + Math.min(count, 4) : '');
  cell.title = key + ': ' + count + '个番茄';
  heatmap.appendChild(cell);
 }
}

// --- P-01: Daily Launch Ritual ---
function checkDailyLaunch() {
 var today = new Date().toISOString().slice(0, 10);
 if (S.settings.lastLaunchDate === today) return;
 queueModal('daily-launch', function() { renderDailyLaunch(); }, 10);
}
function renderDailyLaunch() {
 var today = new Date().toISOString().slice(0, 10);
 var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
 var ySess = S.sessions.filter(function(s) {
  return s.type === 'work' && s.start && s.start.slice(0, 10) === yesterday;
 });
 var el = function(id) { return document.getElementById(id); };
 if (el('dl-y-pomo')) el('dl-y-pomo').textContent = ySess.length;
 var todayTasks = S.tasks.filter(function(t) { return t.today && !t.completed && !t.parentId; });
 var list = el('dl-focus-list');
 if (list) {
  list.innerHTML = '';
  todayTasks.forEach(function(t) {
   var li = document.createElement('li');
   li.className = 'dl-focus-item';
   li.innerHTML = '<label><input type="checkbox" data-task-id="' + t.id + '" /> ' +
    '<span class="dl-prio prio-' + t.priority + '"></span> ' + escHtml(t.title) + '</label>';
   list.appendChild(li);
  });
  (S.settings.dailyFocusIds || []).forEach(function(fid) {
   var cb = list.querySelector('[data-task-id="' + fid + '"]');
   if (cb) cb.checked = true;
  });
 }
 var inboxCount = S.tasks.filter(function(t) { return t.area === 'inbox' && !t.completed; }).length;
 var inboxHint = el('dl-inbox-hint');
 if (inboxHint) {
  if (inboxCount > 3) {
   inboxHint.hidden = false;
   var ic = el('dl-inbox-count');
   if (ic) ic.textContent = inboxCount;
  } else { inboxHint.hidden = true; }
 }
 el('daily-launch-overlay').hidden = false;
  _activeModal = 'daily-launch';
}
function confirmDailyLaunch() {
 var checks = document.querySelectorAll('#dl-focus-list input[type=checkbox]:checked');
 var ids = [];
 checks.forEach(function(cb) { ids.push(cb.dataset.taskId); });
 S.settings.dailyFocusIds = ids;
 S.tasks.forEach(function(t) { t.dailyFocus = ids.indexOf(t.id) >= 0; });
 S.settings.lastLaunchDate = new Date().toISOString().slice(0, 10);
 saveState();
 document.getElementById('daily-launch-overlay').hidden = true;
  closeActiveModal();
 renderDailyFocus();
 if (ids.length > 0) { timer.taskId = ids[0]; updateTimerUI(); }
}

// --- P-07: Daily Review ---
function checkDailyReview() {
 var today = new Date().toISOString().slice(0, 10);
 if (S.settings.lastReviewDate === today) return;
 var hour = new Date().getHours();
 var todayPomo = S.sessions.filter(function(s) {
  return s.type === 'work' && s.start && s.start.slice(0, 10) === today;
 }).length;
 if (todayPomo < 1 || hour < 17) return;
 queueModal('daily-review', function() { renderDailyReview(); }, 30);
}
function renderDailyReview() {
 var today = new Date().toISOString().slice(0, 10);
 var todaySess = S.sessions.filter(function(s) {
  return s.type === 'work' && s.start && s.start.slice(0, 10) === today;
 });
 var todayMins = todaySess.reduce(function(sum, s) { return sum + (s.duration || 0); }, 0) / 60;
 var el = function(id) { return document.getElementById(id); };
 if (el('dr-pomo')) el('dr-pomo').textContent = todaySess.length;
 if (el('dr-mins')) el('dr-mins').textContent = Math.round(todayMins);
 var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
 var yPomo = S.sessions.filter(function(s) {
  return s.type === 'work' && s.start && s.start.slice(0, 10) === yesterday;
 }).length;
 var diff = todaySess.length - yPomo;
 var diffEl = el('dr-diff-pomo');
 if (diffEl) diffEl.textContent = (diff > 0 ? '+' : '') + diff;
 var overdue = S.tasks.filter(function(t) {
  return !t.completed && t.dueDatetime && t.dueDatetime.slice(0, 10) < today;
 }).length;
 var sugEl = el('dr-suggestion');
 if (sugEl) sugEl.textContent = overdue > 0 ?
  '你有 ' + overdue + ' 个逾期任务，明天优先处理？' : '今天表现不错，明天继续保持！';
 document.getElementById('daily-review-overlay').hidden = false;
  _activeModal = 'daily-review';
}
function saveDailyReview() {
 var today = new Date().toISOString().slice(0, 10);
 S.settings.lastReviewDate = today;
 S.dailyReviews.push({ date: today, pomodoros: 0, tasksCompleted: 0 });
 var cutoff = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
 S.dailyReviews = S.dailyReviews.filter(function(r) { return r.date >= cutoff; });
 saveState();
 document.getElementById('daily-review-overlay').hidden = true;
  closeActiveModal();
}

// --- P-08: 5-Minute Quick Start for Overdue ---
function quickStartOverdue(taskId) {
  var t = S.tasks.find(function(x) { return x.id === taskId; });
  if (!t) return;
  timer.taskId = taskId;
  timer.mode = 'work';
  timer.remaining = 5 * 60; // 5 minutes
  timer.startedAt = null;
  timer.startedRemaining = null;
  timer.running = false;
  // Set up callback: after 5min, prompt to continue with full pomodoro
  _quickStartTaskId = taskId;
  saveState();
  startTimer();
  updateTimerUI();
  toast('⚡ 5分钟启动！先做起来再说');
}

// Handle 5-min quick start completion → prompt to continue
fu
function confirmQuickStartContinue() {
  var overlay = document.getElementById('modal-quickstart-continue');
  if (overlay) overlay.hidden = true;
  // Switch to full 25-min pomodoro
  timer.mode = 'work';
  timer.remaining = S.settings.workDuration * 60;
  timer.startedAt = null;
  timer.startedRemaining = null;
  _quickStartTaskId = null;
  saveState();
  startTimer();
  updateTimerUI();
  toast('🍅 进入完整专注！你已经在状态了');
}

function declineQuickStartContinue() {
  var overlay = document.getElementById('modal-quickstart-continue');
  if (overlay) overlay.hidden = true;
  // Record the 5-min session and go to break
  _quickStartTaskId = null;
  saveState();
  toast('👍 5分钟也很好，积少成多！');
}

// --- P-09: Task Resumption Prompt ---
function checkTaskResumption() {
  // Check if there was an interrupted work session
  var today = new Date().toISOString().slice(0, 10);
  var recentWork = S.sessions.filter(function(s) {
    return s.type === 'work' && s.start && s.start.slice(0, 10) === today;
  });
  // Find last worked-on task that is still incomplete
  var lastTaskId = null;
  for (var i = recentWork.length - 1; i >= 0; i--) {
    if (recentWork[i].taskId) {
      var t = S.tasks.find(function(x) { return x.id === recentWork[i].taskId; });
      if (t && !t.completed) {
        lastTaskId = recentWork[i].taskId;
        break;
      }
    }
  }
  // Also check if timer was previously associated with a task
  if (!lastTaskId && timer.taskId) {
    var tt = S.tasks.find(function(x) { return x.id === timer.taskId; });
    if (tt && !tt.completed) lastTaskId = timer.taskId;
  }
  if (!lastTaskId) return;
  var task = S.tasks.find(function(x) { return x.id === lastTaskId; });
  if (!task) return;
  // Don't show if timer is already running
  if (timer.running) return;
  // Don't show if already shown today
  if (_lastResumptionDate === today && _lastResumptionTask === lastTaskId) return;
  var _showResumptionBar = function() {
    var bar = document.getElementById('resumption-bar');
    var nameEl = document.getElementById('resumption-task-name');
    if (bar && nameEl) {
      nameEl.textContent = task.title;
      bar.hidden = false;
      bar.dataset.taskId = lastTaskId;
    }
  };
  if (_activeModal) {
    _pendingResumption = _showResumptionBar;
  } else {
    _showResumptionBar();
  }
}

function resumeLastTask(taskId) {
  var bar = document.getElementById('resumption-bar');
  if (bar) bar.hidden = true;
  timer.taskId = taskId;
  timer.mode = 'work';
  timer.remaining = S.settings.workDuration * 60;
  timer.startedAt = null;
  timer.startedRemaining = null;
  startTimer();
  updateTimerUI();
  var t = S.tasks.find(function(x) { return x.id === taskId; });
  toast('↩ 继续专注：' + (t ? t.title : ''));
}

function dismissResumption() {
  var bar = document.getElementById('resumption-bar');
  if (bar) bar.hidden = true;
}

// --- P-12: Light Focus Mode ---
function enterFocusMode() {
  var panel = document.querySelector('.panel-tasks');
  var timerPanel = document.querySelector('.panel-timer');
  if (panel) panel.classList.add('focus-collapsed');
  if (timerPanel) timerPanel.classList.add('focus-expanded');
  document.body.classList.add('focus-mode-active');
}

function exitFocusMode() {
  var panel = document.querySelector('.panel-tasks');
  var timerPanel = document.querySelector('.panel-timer');
  if (panel) panel.classList.remove('focus-collapsed');
  if (timerPanel) timerPanel.classList.remove('focus-expanded');
  document.body.classList.remove('focus-mode-active');
}

// --- V5 Init ---
function initV5Features() {
 renderDailyFocus();
 renderHabitStreak();
 // V5 P-07: Check daily review at app startup
 checkDailyReview();
 var badge = document.getElementById('streak-badge');
 if (badge && S.habitStreak.currentStreak > 0) {
  badge.hidden = false;
  var num = document.getElementById('streak-num');
  if (num) num.textContent = S.habitStreak.currentStreak;
 }
 var focusIds = S.settings.dailyFocusIds || [];
 var focusDone = focusIds.filter(function(fid) {
  var ft = S.tasks.find(function(x) { return x.id === fid; });
  return ft && ft.completed;
 }).length;
 updateFocusProgress(focusDone, focusIds.length);
  setTimeout(checkTaskResumption, 800);
 setTimeout(checkDailyLaunch, 300);
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
var escHtml = esc;
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

  migrateFromV2(); initSettings(); updateTimerUI(); renderTasks(); updateDoneList(); updateGtdCounts(); renderCalendar(); initV5Features();
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
  // 阻止项目卡片内部按钮的点击冒泡到卡片本身
  if (btn.classList.contains('project-card-act')) {
    e.stopPropagation();
  }
    if (act === 'toggle') toggleTask(id);
    else if (act === 'pin') pinTask(id);
    else if (act === 'select') selectTask(id);
    else if (act === 'prio') cyclePriority(id);
    else if (act === 'detail') openDetail(id);
    else if (act === 'delete') { if (confirm('删除此土豆？')) {
        deleteTask(id);
        // 如果在子任务钻入视图中，且删除后无子任务了，返回项目列表
        if (currentParentView) {
          var remaining = getSubtasks(currentParentView);
          var parent = S.tasks.find(function(x) { return x.id === currentParentView; });
          if (!parent || remaining.length === 0) {
            currentParentView = null;
            renderTasks();
          }
        }
      } }
    else if (act === 'view-subtasks') {
      currentParentView = id;
      renderTasks();
    }
    else if (act === 'restore') { toggleTask(id); } else if (act === 'quickstart') {
        quickStartOverdue(id);
    } else if (act === 'back-to-project') {
      currentParentView = null;
      renderTasks();
    }
  });
// 双击任务项打开详情
$on('task-list', 'dblclick', function(e) {
  var item = e.target.closest('.task-item');
  if (item && item.dataset.id) {
    openDetail(item.dataset.id);
  }
});

// ---- Subtask bulk actions (delegated) ----
$on('task-list', 'click', function(e) {
  var bulkBtn = e.target.closest('[data-act="complete-all-subtasks"]');
  if (bulkBtn) {
    var parentId = bulkBtn.dataset.id;
    if (!parentId) return;
    var kids = getSubtasks(parentId);
    var changed = false;
    kids.forEach(function(k) {
      if (!k.completed) {
        k.completed = true;
        changed = true;
      }
    });
    if (changed) {
      saveState();
      renderTasks();
      updateGtdCounts();
      toast('🎉 所有子任务已完成！');
    }
    return;
  }
});

  // ---- Subtask input (delegated) ----
  $on('task-list', 'click', function(e) {
    var addBtn = e.target.closest('#subtask-add-btn');
    if (addBtn) {
      var input = document.getElementById('subtask-input');
      var parentId = addBtn.dataset.parentId;
      if (input && input.value.trim() && parentId) {
        addSubtask(parentId, input.value.trim());
        input.value = '';
        renderTasks();
        updateGtdCounts();
        // 也刷新详情面板（如果打开）
        if (detailTaskId === parentId) renderDetailSubtasks(parentId);
      }
    }
  });
  $on('task-list', 'keydown', function(e) {
    var input = e.target.closest('#subtask-input');
    if (input && e.key === 'Enter') {
      var parentId = input.dataset.parentId;
      if (input.value.trim() && parentId) {
        addSubtask(parentId, input.value.trim());
        input.value = '';
        renderTasks();
        updateGtdCounts();
        if (detailTaskId === parentId) renderDetailSubtasks(parentId);
      }
    }
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
    currentParentView = null;
    document.querySelectorAll('.gtd-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');     // 同步 quick-input 的 area select
  // 切换GTD区域时重置过滤器为'全部'
  currentFilter = 'all';
  document.querySelectorAll('.filter-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.filter === 'all');
  });
    var qiArea = document.getElementById('qi-area');
    if (qiArea && currentArea && currentArea !== 'archive' && currentArea !== 'all') {
      qiArea.value = currentArea;
    }
renderTasks();
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
if (calGrid) calGrid.addEventListener('dblclick', function(e) {
  var cell = e.target.closest('.cal-day');
  if (!cell || cell.classList.contains('other-month')) return;
  if (cell.dataset.date) selectCalDateAndSwitch(cell.dataset.date);
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
// Detail: start timer for this task
var detStartTimer = document.getElementById('det-start-timer');
if (detStartTimer) detStartTimer.addEventListener('click', function() {
  if (!detailTaskId) return;
  timer.taskId = detailTaskId;
  if (!timer.running) startTimer();
  updateTimerUI();
  toast('🍅 已开始专注此任务');
});

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

  // Detail subtask actions (toggle, delete, add)
  $on('detail-panel', 'click', function(e) {
    var subtaskAct = e.target.closest('[data-act]');
    if (!subtaskAct || !detailTaskId) return;
    var act = subtaskAct.dataset.act;
    var id = subtaskAct.dataset.id;
    if (act === 'toggle' && id) {
      // 子任务toggle：完成后不归档，刷新详情面板子任务列表
      toggleTask(id);
      renderDetailSubtasks(detailTaskId);
    } else if (act === 'delete-subtask' && id) {
      if (confirm('删除此子任务？')) {
        deleteTask(id);
        renderDetailSubtasks(detailTaskId);
        updateGtdCounts();
      }
    }
  });
  // Detail: add subtask from input
  var detSubtaskInput = document.getElementById('det-subtask-input');
  if (detSubtaskInput) detSubtaskInput.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' || !detailTaskId) return;
    var val = detSubtaskInput.value.trim();
    if (!val) return;
    addSubtask(detailTaskId, val);
    detSubtaskInput.value = '';
    renderDetailSubtasks(detailTaskId);
    renderTasks();
    updateGtdCounts();
  });
  var detSubtaskAddBtn = document.getElementById('det-subtask-add-btn');
  if (detSubtaskAddBtn) detSubtaskAddBtn.addEventListener('click', function() {
    if (!detailTaskId) return;
    var input = document.getElementById('det-subtask-input');
    if (input && input.value.trim()) {
      addSubtask(detailTaskId, input.value.trim());
      input.value = '';
      renderDetailSubtasks(detailTaskId);
      renderTasks();
      updateGtdCounts();
    }
  });
  // Detail: click parent link to navigate
  var parentLink = document.getElementById('det-parent-link');
  if (parentLink) parentLink.addEventListener('click', function() {
    var pid = parentLink.dataset.parentId;
    if (pid) {
      closeDetail();
      setTimeout(function() { openDetail(pid); }, 350);
    }
  });

  // Detail: promote to project
  $on('det-promote-project', 'click', function() {
    if (!detailTaskId) return;
    var t = S.tasks.find(function(x) { return x.id === detailTaskId; });
    if (!t) return;
    t.area = 'projects';
    saveState();
    toast('已转为项目，可在项目Tab中添加子任务');
    closeDetail();
    currentArea = 'projects';
    document.querySelectorAll('.gtd-tab').forEach(function(tab) {
      tab.classList.toggle('active', tab.dataset.area === 'projects');
    });
    renderTasks();
    updateGtdCounts();
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
  // P-08: Quick start continue modal buttons
  $on('qs-continue', 'click', confirmQuickStartContinue);
  $on('qs-stop', 'click', declineQuickStartContinue);
  // P-09: Task resumption bar
  $on('resumption-resume', 'click', function() {
    var bar = document.getElementById('resumption-bar');
    if (bar && bar.dataset.taskId) resumeLastTask(bar.dataset.taskId);
  });
  $on('resumption-dismiss', 'click', dismissResumption);
  // P-12: Focus mode — auto enter/exit on timer start/pause
  var origStartTimer = startTimer;
  // We wrap timer start/pause to toggle focus mode
  document.addEventListener('timer-focus-toggle', function() {
    if (timer.running) {
      if (S.settings.focusModeEnabled !== false) enterFocusMode();
    } else {
      exitFocusMode();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { if (detailTaskId) { closeDetail(); return; } if (quickInputVisible) { toggleQuickInput(); return; } }
  // Ctrl+Enter 保存详情面板
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && detailTaskId) {
    e.preventDefault();
    saveDetail();
    return;
  }
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.code === 'Space') { e.preventDefault(); timer.running ? pauseTimer() : startTimer(); }
    if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) resetTimer();
    if (e.code === 'KeyT' && !e.ctrlKey && !e.metaKey) { var w = document.querySelector('[data-view="work"]'); if (w) w.click(); }
    if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) { var s = document.querySelector('[data-view="settings"]'); if (s) s.click(); }
  });

 // ---- V5: Daily Launch Overlay ----
 $on('dl-start', 'click', confirmDailyLaunch);
 $on('dl-skip', 'click', function() {
 document.getElementById('daily-launch-overlay').hidden = true;
  closeActiveModal();
 });
 $on('dl-quick-add-btn', 'click', function() {
 var input = document.getElementById('dl-quick-input');
 if (input && input.value.trim()) {
 addTask(input.value.trim());
 input.value = '';
 renderDailyLaunch();
 }
 });
 var dlQuickInput = document.getElementById('dl-quick-input');
 if (dlQuickInput) dlQuickInput.addEventListener('keydown', function(e) {
 if (e.key === 'Enter') document.getElementById('dl-quick-add-btn').click();
 });

 // ---- V5: Abandon Confirm Modal ----
 $on('abandon-continue', 'click', function() {
 document.getElementById('modal-abandon-confirm').hidden = true;
  closeActiveModal();
 });
 $on('abandon-confirm', 'click', function() {
 document.getElementById('modal-abandon-confirm').hidden = true;
  closeActiveModal();
 timer.running = false;
 timer.remaining = getModeDuration(timer.mode) * 60;
 timer.startedAt = null;
 timer.startedRemaining = null;
 clearTimerState();
 updateTimerUI();
 });

 // ---- V5: Rest Guide Overlay ----
 document.querySelectorAll('.rest-opt-btn').forEach(function(btn) {
 btn.addEventListener('click', function() {
 selectRestOption(btn.dataset.rest);
 });
 });
 // Rest guide close buttons
 $on('rest-start-btn', 'click', closeRestGuide);
 $on('rest-skip-btn', 'click', closeRestGuide);

 // ---- V5: Daily Review Overlay ----
 $on('dr-done', 'click', saveDailyReview);
 $on('dr-skip', 'click', function() {
 document.getElementById('daily-review-overlay').hidden = true;
  closeActiveModal();
 });
});
