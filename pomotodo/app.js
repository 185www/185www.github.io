/**
 * Pomotodo — app.js
 * Pure static app: timer + tasks + stats + settings
 * Data: localStorage
 */

// ==================== CONSTANTS ====================
const LS_KEY = 'pomotodo_v2';
const CIRC = 2 * Math.PI * 88;

const DEFAULTS = {
  settings: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreak: true,
    autoStartWork: false,
    soundEnabled: true,
    soundVolume: 0.7,
    notificationsEnabled: false,
    theme: 'light'
  },
  tasks: [],
  sessions: []
};

// ==================== STATE ====================
let S = loadState();
let timer = {
  mode: 'work',
  remaining: S.settings.workDuration * 60,
  running: false,
  intervalId: null,
  startedAt: null,
  cycleCount: 0,
  taskId: null
};

// ==================== STATE I/O ====================
function loadState() {
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (raw) {
      var d = JSON.parse(raw);
      return {
        settings: Object.assign({}, DEFAULTS.settings, d.settings || {}),
        tasks: d.tasks || [],
        sessions: d.sessions || []
      };
    }
  } catch (_) {}
  return JSON.parse(JSON.stringify(DEFAULTS));
}

function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (_) {}
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

function startTimer() {
  if (timer.running) return;
  click(S.settings.soundVolume);
  timer.running = true;
  timer.startedAt = timer.startedAt || new Date().toISOString();
  timer.intervalId = setInterval(tick, 1000);
  updateTimerUI();
}

function pauseTimer() {
  if (!timer.running) return;
  click(S.settings.soundVolume);
  timer.running = false;
  clearInterval(timer.intervalId);
  timer.intervalId = null;
  updateTimerUI();
}

function resetTimer() {
  click(S.settings.soundVolume);
  timer.running = false;
  clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.remaining = getModeDuration(timer.mode) * 60;
  timer.startedAt = null;
  updateTimerUI();
}

function tick() {
  if (timer.remaining <= 1) {
    timer.remaining = 0;
    timer.running = false;
    clearInterval(timer.intervalId);
    timer.intervalId = null;
    onTimerComplete();
    return;
  }
  timer.remaining--;
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
  if (timer.mode === 'work') {
    timer.cycleCount++;
    S.sessions.push(session);
    saveState();
    showCompleteModal(session);
  } else {
    S.sessions.push(session);
    saveState();
    timer.mode = 'work';
    timer.remaining = S.settings.workDuration * 60;
    timer.startedAt = null;
    if (S.settings.autoStartWork) setTimeout(startTimer, 500);
    updateTimerUI();
    updateDoneList();
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
    timer.mode = 'longBreak';
    timer.remaining = S.settings.longBreakDuration * 60;
    timer.cycleCount = 0;
  } else {
    timer.mode = 'shortBreak';
    timer.remaining = S.settings.shortBreakDuration * 60;
  }
  timer.startedAt = null;
  if (S.settings.autoStartBreak) setTimeout(startTimer, 500);
  updateTimerUI(); updateDoneList(); renderTasks();
}

function skipTimer() {
  click(S.settings.soundVolume);
  clearInterval(timer.intervalId);
  timer.running = false; timer.intervalId = null;
  var total = getModeDuration(timer.mode) * 60;
  if (timer.remaining < total * 0.5) {
    var session = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      type: timer.mode, start: timer.startedAt || new Date().toISOString(),
      end: new Date().toISOString(), duration: total - timer.remaining, taskId: null
    };
    S.sessions.push(session);
    if (timer.mode === 'work') timer.cycleCount++;
    saveState();
  }
  if (timer.mode === 'work') {
    if (timer.cycleCount >= S.settings.longBreakInterval) {
      timer.mode = 'longBreak'; timer.remaining = S.settings.longBreakDuration * 60; timer.cycleCount = 0;
    } else { timer.mode = 'shortBreak'; timer.remaining = S.settings.shortBreakDuration * 60; }
  } else { timer.mode = 'work'; timer.remaining = S.settings.workDuration * 60; }
  timer.startedAt = null;
  updateTimerUI(); updateDoneList();
}

// ==================== TASKS ====================
function addTask(title) {
  var tags = [];
  title = title.replace(/#(\S+)/g, function(_, t) { tags.push(t); return ''; }).trim();
  if (!title) return;
  var task = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: title, tags: tags, completed: false, pinned: false,
    pomodorosCompleted: 0, createdAt: new Date().toISOString()
  };
  S.tasks.unshift(task); saveState(); renderTasks();
  return task;
}

function toggleTask(id) {
  var t = S.tasks.find(function(x) { return x.id === id; });
  if (!t) return; t.completed = !t.completed; saveState(); renderTasks();
}

function pinTask(id) {
  var t = S.tasks.find(function(x) { return x.id === id; });
  if (!t) return; t.pinned = !t.pinned; saveState(); renderTasks();
}

function deleteTask(id) {
  S.tasks = S.tasks.filter(function(x) { return x.id !== id; }); saveState(); renderTasks();
}

function selectTask(id) {
  var el = document.querySelector('.task-item.active-task');
  if (el) el.classList.remove('active-task');
  timer.taskId = (timer.taskId === id) ? null : id;
  updateTimerUI(); renderTasks();
}

// ==================== RENDER ====================
function updateTimerUI() {
  var total = getModeDuration(timer.mode) * 60;
  var pct = total > 0 ? timer.remaining / total : 1;
  var ring = document.querySelector('.ring-fill');
  ring.style.strokeDasharray = CIRC;
  ring.style.strokeDashoffset = CIRC * (1 - pct);
  ring.className = 'ring-fill' + (timer.mode === 'shortBreak' ? ' short' : '') + (timer.mode === 'longBreak' ? ' long' : '');
  var digits = document.querySelector('.timer-digits');
  digits.textContent = fmtTime(timer.remaining);
  digits.className = 'timer-digits' + (timer.mode === 'shortBreak' ? ' short' : '') + (timer.mode === 'longBreak' ? ' long' : '');
  var btn = document.getElementById('btn-start');
  btn.textContent = timer.running ? '⏸ 暂停' : (timer.remaining < total ? '▶ 继续' : '▶ 开始专注');
  btn.classList.toggle('running', timer.running);
  document.querySelector('.timer-cycle').textContent = '#' + (timer.cycleCount + 1);
  var label = document.getElementById('timer-active-task');
  if (timer.taskId) {
    var t = S.tasks.find(function(x) { return x.id === timer.taskId; });
    label.textContent = t ? '🍅 ' + t.title : '';
  } else { label.textContent = ''; }
  document.title = timer.running ? fmtTime(timer.remaining) + ' - Pomotodo' : 'Pomotodo';
}

function renderTasks() {
  var filter = currentFilter;
  var tasks = S.tasks.slice();
  tasks.sort(function(a, b) {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return 0;
  });
  if (filter === 'active') tasks = tasks.filter(function(t) { return !t.completed; });
  if (filter === 'completed') tasks = tasks.filter(function(t) { return t.completed; });
  var list = document.getElementById('task-list');
  if (tasks.length === 0) {
    list.innerHTML = '<div class="empty-state">🥔 还没有土豆<br><small>最佳的土豆是一周内可完成的小任务</small></div>';
    return;
  }
  list.innerHTML = tasks.map(function(t) {
    var isActive = timer.taskId === t.id;
    var tagHtml = (t.tags || []).map(function(tag) { return '<span class="task-tag">#' + esc(tag) + '</span>'; }).join(' ');
    return '<li class="task-item' + (t.completed ? ' completed' : '') + (t.pinned ? ' pinned' : '') + (isActive ? ' active-task' : '') + '" data-id="' + t.id + '">' +
      '<div class="task-check" data-act="toggle" data-id="' + t.id + '">' + (t.completed ? '✓' : '') + '</div>' +
      '<span class="task-text">' + esc(t.title) + ' ' + tagHtml + '</span>' +
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
  document.getElementById('done-count').textContent = todaySessions.length;
  var list = document.getElementById('done-list');
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
    overlay.setAttribute('hidden', '');
    advanceAfterComplete(taskId);
  };
  document.getElementById('modal-skip').onclick = function() {
    overlay.setAttribute('hidden', '');
    advanceAfterComplete(null);
  };
}

// ==================== STATS ====================
var weekChart = null;
var tagChart = null;

function renderStats() {
  var today = new Date().toISOString().slice(0, 10);
  var weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  var todaySess = S.sessions.filter(function(s) { return s.type === 'work' && s.start && s.start.slice(0, 10) === today; });
  var weekSess = S.sessions.filter(function(s) { return s.type === 'work' && s.start && s.start >= weekAgo; });
  document.getElementById('s-today-count').textContent = todaySess.length;
  document.getElementById('s-today-mins').textContent = Math.round(todaySess.reduce(function(a, s) { return a + s.duration; }, 0) / 60) + 'm';
  document.getElementById('s-week-count').textContent = weekSess.length;
  renderWeeklyChart();
  renderTagBars();
}

function renderWeeklyChart() {
  var days = [];
  for (var i = 6; i >= 0; i--) {
    days.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
  }
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
    weekChart.data.labels = labels;
    weekChart.data.datasets[0].data = counts;
    weekChart.options.scales.x.ticks.color = tc;
    weekChart.options.scales.y.ticks.color = tc;
    weekChart.update();
    return;
  }

  var ctx = document.getElementById('chart-weekly');
  var cfg = {};
  cfg.type = 'bar';
  cfg.data = {};
  cfg.data.labels = labels;
  cfg.data.datasets = [];
  cfg.data.datasets[0] = {};
  cfg.data.datasets[0].label = '番茄数';
  cfg.data.datasets[0].data = counts;
  cfg.data.datasets[0].backgroundColor = 'rgba(231,76,60,0.7)';
  cfg.data.datasets[0].borderRadius = 4;
  cfg.data.datasets[0].maxBarThickness = 28;
  cfg.options = {};
  cfg.options.responsive = true;
  cfg.options.maintainAspectRatio = false;
  cfg.options.plugins = { legend: { display: false } };
  cfg.options.scales = {};
  cfg.options.scales.x = {};
  cfg.options.scales.x.ticks = { color: tc, font: { size: 11 } };
  cfg.options.scales.x.grid = { color: gc };
  cfg.options.scales.y = {};
  cfg.options.scales.y.beginAtZero = true;
  cfg.options.scales.y.ticks = { color: tc, stepSize: 1 };
  cfg.options.scales.y.grid = { color: gc };
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
  if (entries.length === 0) {
    container.innerHTML = '<p style="font-size:.8rem;color:var(--c-text2)">暂无标签数据</p>';
    return;
  }
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
  document.getElementById('opt-work').value = s.workDuration;
  document.getElementById('opt-short').value = s.shortBreakDuration;
  document.getElementById('opt-long').value = s.longBreakDuration;
  document.getElementById('opt-interval').value = s.longBreakInterval;
  document.getElementById('opt-auto-break').checked = s.autoStartBreak;
  document.getElementById('opt-auto-work').checked = s.autoStartWork;
  document.getElementById('opt-sound').checked = s.soundEnabled;
  document.getElementById('opt-volume').value = s.soundVolume;
  document.getElementById('range-val').textContent = Math.round(s.soundVolume * 100) + '%';
  document.getElementById('opt-notify').checked = s.notificationsEnabled;
  applyTheme(s.theme);
}

function readSettings() {
  S.settings.workDuration = Math.max(1, parseInt(document.getElementById('opt-work').value) || 25);
  S.settings.shortBreakDuration = Math.max(1, parseInt(document.getElementById('opt-short').value) || 5);
  S.settings.longBreakDuration = Math.max(1, parseInt(document.getElementById('opt-long').value) || 15);
  S.settings.longBreakInterval = Math.max(2, parseInt(document.getElementById('opt-interval').value) || 4);
  S.settings.autoStartBreak = document.getElementById('opt-auto-break').checked;
  S.settings.autoStartWork = document.getElementById('opt-auto-work').checked;
  S.settings.soundEnabled = document.getElementById('opt-sound').checked;
  S.settings.soundVolume = parseFloat(document.getElementById('opt-volume').value);
  S.settings.notificationsEnabled = document.getElementById('opt-notify').checked;
  saveState();
  if (!timer.running) timer.remaining = getModeDuration(timer.mode) * 60;
  updateTimerUI();
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  S.settings.theme = theme;
  saveState();
  document.querySelectorAll('.t-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.theme === theme); });
}

// ==================== UTILS ====================
function fmtTime(sec) {
  var m = Math.floor(sec / 60), s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function esc(str) {
  var d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function toast(msg) {
  var wrap = document.getElementById('toast-wrap');
  var t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(function() { t.remove(); }, 3000);
}

// ==================== DATA I/O ====================
function exportData() {
  var blob = new Blob([JSON.stringify(S, null, 2)], {type: 'application/json'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pomotodo-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click(); URL.revokeObjectURL(a.href);
  toast('数据已导出');
}

function importData(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var d = JSON.parse(e.target.result);
      if (d.settings) S.settings = Object.assign({}, DEFAULTS.settings, d.settings);
      if (Array.isArray(d.tasks)) S.tasks = d.tasks;
      if (Array.isArray(d.sessions)) S.sessions = d.sessions;
      saveState(); toast('数据已导入');
      initSettings(); renderTasks(); updateTimerUI(); updateDoneList();
    } catch(err) { toast('导入失败: ' + err.message); }
  };
  reader.readAsText(file);
}

// ==================== INIT & EVENTS ====================
var currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
  initSettings(); updateTimerUI(); renderTasks(); updateDoneList();

  if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(function() {}); }
  if (S.settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') { Notification.requestPermission(); }

  document.getElementById('btn-start').addEventListener('click', function() { timer.running ? pauseTimer() : startTimer(); });
  document.getElementById('btn-reset').addEventListener('click', resetTimer);
  document.getElementById('btn-skip').addEventListener('click', skipTimer);

  document.querySelectorAll('.mode-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (timer.running) return;
      timer.mode = btn.dataset.mode;
      timer.remaining = getModeDuration(btn.dataset.mode) * 60;
      timer.startedAt = null;
      document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      updateTimerUI();
    });
  });

  var input = document.getElementById('task-input');
  document.getElementById('task-add-btn').addEventListener('click', function() { addTask(input.value); input.value = ''; input.focus(); });
  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { addTask(input.value); input.value = ''; } });

  document.getElementById('task-list').addEventListener('click', function(e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var id = btn.dataset.id, act = btn.dataset.act;
    if (act === 'toggle') toggleTask(id);
    else if (act === 'pin') pinTask(id);
    else if (act === 'select') selectTask(id);
    else if (act === 'delete') { if (confirm('删除此土豆？')) deleteTask(id); }
  });

  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderTasks();
    });
  });

  document.querySelectorAll('.nav-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
      document.getElementById('view-' + btn.dataset.view).classList.add('active');
      if (btn.dataset.view === 'stats') renderStats();
    });
  });

  ['opt-work','opt-short','opt-long','opt-interval','opt-auto-break','opt-auto-work','opt-sound','opt-notify'].forEach(function(id) {
    document.getElementById(id).addEventListener('change', readSettings);
  });
  document.getElementById('opt-volume').addEventListener('input', function(e) {
    document.getElementById('range-val').textContent = Math.round(e.target.value * 100) + '%';
    readSettings();
  });
  document.getElementById('btn-test-sound').addEventListener('click', function() { chime(S.settings.soundVolume); });

  document.querySelectorAll('.t-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { applyTheme(btn.dataset.theme); });
  });

  document.getElementById('btn-reset-sett').addEventListener('click', function() {
    if (!confirm('恢复默认设置？')) return;
    S.settings = JSON.parse(JSON.stringify(DEFAULTS.settings)); saveState(); initSettings();
    if (!timer.running) { timer.remaining = getModeDuration(timer.mode) * 60; updateTimerUI(); }
    toast('设置已重置');
  });

  document.getElementById('btn-clear-all').addEventListener('click', function() {
    if (!confirm('⚠ 清除所有数据？不可恢复！')) return;
    localStorage.removeItem(LS_KEY);
    S = JSON.parse(JSON.stringify(DEFAULTS));
    timer = {mode: 'work', remaining: S.settings.workDuration * 60, running: false, intervalId: null, startedAt: null, cycleCount: 0};
    saveState(); initSettings(); updateTimerUI(); renderTasks(); updateDoneList();
    toast('数据已清除');
  });

  document.getElementById('btn-export').addEventListener('click', exportData);
  document.getElementById('btn-import').addEventListener('change', function(e) {
    if (e.target.files[0]) importData(e.target.files[0]); e.target.value = '';
  });

  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') { e.preventDefault(); timer.running ? pauseTimer() : startTimer(); }
    if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) resetTimer();
    if (e.code === 'KeyT' && !e.ctrlKey && !e.metaKey) document.querySelector('[data-view="work"]').click();
    if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) document.querySelector('[data-view="settings"]').click();
  });
});
