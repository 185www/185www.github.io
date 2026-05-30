(function () {
  'use strict';

  // ========================================================================
  // DOM UTILITIES
  // ========================================================================

  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var key in attrs) {
        var val = attrs[key];
      if (key === 'className') el.className = val;
      else if (key === 'dataset') Object.assign(el.dataset, val);
      else if (key === 'style' && typeof val === 'object') Object.assign(el.style, val);
      else if (key === 'html') el.innerHTML = val;
      else if (key === 'htmlFor') el.setAttribute('for', val);
      else if (key === 'selected' || key === 'disabled' || key === 'checked' || key === 'readonly') {
        if (val) el.setAttribute(key, '');
      }
      else el.setAttribute(key, val);
      }
    }
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (child == null || child === false || child === true) continue;
      if (typeof child === 'string' || typeof child === 'number') {
        el.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof Node) {
        el.appendChild(child);
      } else if (Array.isArray(child)) {
        for (var j = 0; j < child.length; j++) {
          var c = child[j];
          if (c instanceof Node) el.appendChild(c);
        }
      }
    }
    return el;
  }

  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function qs(s, p) { return (p || document).querySelector(s); }
  function qsa(s, p) { return Array.from((p || document).querySelectorAll(s)); }

  // ========================================================================
  // CONSTANTS
  // ========================================================================

  var EMOJIS = ['🤖','🔍','✍️','📊','🎨','🧪','📝','🔧','🚀','💡','📈','🎯','🛠️','📋','⚡','🧠','🎭','🎪','🎬','📸','🎵','🎮','🌐','📱'];
  var STATUS = { pending:'待办', running:'进行中', review:'待检验', reviewed:'已检验', cancelled:'已取消' };
  var FLOW = ['pending','running','review','reviewed'];

  // ========================================================================
  // THEME
  // ========================================================================

  var themeBtn = document.getElementById('theme-toggle');

  function initTheme() {
    var s = Store.getSet();
    var pd = window.matchMedia('(prefers-color-scheme:dark)').matches;
    var t = s.theme || (pd ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = t === 'dark' ? '#0c0a09' : '#2d6a4f';
  }

  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme');
    var nxt = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nxt);
    Store.updSet({ theme: nxt });
    if (themeBtn) themeBtn.textContent = nxt === 'dark' ? '☀️' : '🌙';
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = nxt === 'dark' ? '#0c0a09' : '#2d6a4f';
    toast(nxt === 'dark' ? '🌙 暗色模式' : '☀️ 亮色模式');
  }

  // ========================================================================
  // TOAST
  // ========================================================================

  var toastContainer;

  function ensureToastContainer() {
    if (!toastContainer) {
      toastContainer = h('div', { className: 'toasts' });
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function toast(msg) {
    var tc = ensureToastContainer();
    var t = h('div', { className: 'toast' }, msg);
    tc.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity 300ms, transform 300ms';
      t.style.opacity = '0';
      t.style.transform = 'translateY(-12px)';
      setTimeout(function () { if (t.parentNode) t.remove(); }, 300);
    }, 2500);
  }

  // ========================================================================
  // MODAL
  // ========================================================================

  function openModal(contentEl) {
    closeModal();

    var overlay = h('div', { className: 'modal-overlay' });
    var modal = h('div', { className: 'modal', role: 'dialog', 'aria-modal': 'true' });
    var handle = h('div', { className: 'modal-handle' });
    modal.appendChild(handle);
    modal.appendChild(contentEl);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', onKey);

    trapFocus(modal);

    window.__modal = { overlay: overlay, modal: modal, content: contentEl };
  }

  function closeModal() {
    if (window.__modal) {
      if (window.__modal.overlay && window.__modal.overlay.parentNode) {
        window.__modal.overlay.remove();
      }
      window.__modal = null;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
  }

  function onKey(e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      var modal = window.__modal && window.__modal.modal;
      if (!modal) return;
      var focusable = qsa('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  }

  function trapFocus(el) {
    requestAnimationFrame(function () {
      var focusable = qsa('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', el);
      if (focusable.length) focusable[0].focus();
    });
  }

  // ========================================================================
  // STATE (derived from Store)
  // ========================================================================

  function getState() {
    var agents = Store.getAgents();
    var allTasks = Store.getTasks();
    var today = Store.todayStr();
    var overdue = Store.dueCheckins();
    var needsReview = Store.needsReview();
    var nextCheckin = Store.nextCheckin();
    var counts = Store.taskCounts();
    var agentCounts = {};
    agents.forEach(function (a) { agentCounts[a.id] = Store.taskCounts(a.id); });
    return { agents: agents, allTasks: allTasks, today: today, overdue: overdue, needsReview: needsReview, nextCheckin: nextCheckin, counts: counts, agentCounts: agentCounts };
  }

  // ========================================================================
  // WIDGETS (create/update pairs, DOM-based)
  // ========================================================================

  // --- BANNER ---
  function createBanner(state) {
    var el = h('div', { className: 'checkin-alert', dataset: { type: '' }, style: { display: 'none' } });
    updateBanner(el, state);
    return el;
  }

  function updateBanner(el, state) {
    var nr = state.needsReview.length;
    var od = state.overdue.length;
    var nx = state.nextCheckin;

    var newType;
    if (nr > 0) newType = 'alert';
    else if (od > 0) newType = 'overdue';
    else if (nx) newType = 'countdown';
    else newType = '';

    if (newType !== el.dataset.type) {
      clearCountdown();
      el.textContent = '';
      el.dataset.type = newType;

      if (newType === 'alert') {
        el.className = 'checkin-alert';
        el.style.display = '';
        el.append(
          h('div', { className: 'checkin-alert-icon' }, '🔔'),
          h('div', { className: 'checkin-alert-body' },
            h('div', { className: 'checkin-alert-title' }, nr + ' 个任务待检验'),
            h('div', { className: 'checkin-alert-desc' }, 'Agent 已完成工作，等待你的检查')
          ),
          h('button', { className: 'btn btn-sm btn-primary', dataset: { action: 'go-waiting' } }, '去查看')
        );
      } else if (newType === 'overdue') {
        el.className = 'checkin-alert';
        el.style.display = '';
        el.append(
          h('div', { className: 'checkin-alert-icon' }, '⏰'),
          h('div', { className: 'checkin-alert-body' },
            h('div', { className: 'checkin-alert-title' }, od.length + ' 个任务已到检验时间'),
            h('div', { className: 'checkin-alert-desc' }, '请检查进度并推进任务状态')
          ),
          h('button', { className: 'btn btn-sm btn-primary', dataset: { action: 'go-waiting' } }, '查看任务')
        );
      } else if (newType === 'countdown') {
        el.className = 'checkin-next';
        el.style.display = '';
        var cdText = h('div', { id: 'cd-text', className: 'checkin-next-time' });
        updateCountdown(cdText, nx);
        el.append(
          h('div', { className: 'checkin-next-icon' }, '⏰'),
          h('div', { className: 'checkin-next-body' },
            h('div', { className: 'checkin-next-title' }, '下次检验'),
            cdText
          ),
          h('div', { id: 'cd-time', className: 'checkin-next-schedule' }, nx.time)
        );
      } else {
        el.style.display = 'none';
      }
    } else {
      // Same type — update text in place (no DOM rebuild)
      if (newType === 'alert' || newType === 'overdue') {
        // No dynamic texts to update for these — counts change only on Store change
        // which triggers a full updateDashboard anyway, re-entering updateBanner
      } else if (newType === 'countdown') {
        var cd = el.querySelector('#cd-text');
        if (cd) updateCountdown(cd, nx);
      }
    }
  }

  var countdownTimer = null;

  function clearCountdown() {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  }

  function updateCountdown(el, nx) {
    clearCountdown();
    function tick() {
      var now = new Date();
      var chk = new Date(nx.date + 'T' + (nx.time || '12:00'));
      var diff = chk - now;
      if (diff <= 0) { el.textContent = '已到时间'; clearCountdown(); return; }
      var hh = Math.floor(diff / 3600000);
      var mm = Math.floor((diff % 3600000) / 60000);
      el.textContent = hh > 0 ? '还有 ' + hh + 'h ' + mm + 'min' : '还有 ' + mm + ' 分钟';
    }
    tick();
    countdownTimer = setInterval(tick, 30000);
  }

  // --- STATS ---
  function createStats(state) {
    var el = h('div', { className: 'stats-bar' });
    updateStats(el, state);
    return el;
  }

  function updateStats(el, state) {
    var c = state.counts;
    var items = [
      { key: 'pending', label: '待办', count: c.pending },
      { key: 'running', label: '进行中', count: c.running },
      { key: 'review', label: '待检验', count: c.review, hl: c.review > 0 },
      { key: 'reviewed', label: '已检验', count: c.reviewed }
    ];
    el.textContent = '';
    items.forEach(function (item) {
      var dot = h('span', { className: 'stat-dot ' + item.key });
      var stat = h('span', { className: 'stat' + (item.hl ? ' review-highlight' : '') }, dot, ' ', item.count + ' ' + item.label);
      el.appendChild(stat);
    });
  }

  // --- AGENT CARD ---
  function createAgentCard(agent, counts) {
    return h('div', { className: 'agent-card', dataset: { action: 'open-agent', id: agent.id } },
      h('div', { className: 'agent-card-header' },
        h('div', { className: 'agent-card-emoji' }, agent.emoji),
        h('div', { className: 'agent-card-info' },
          h('div', { className: 'agent-card-name' }, esc(agent.name)),
          h('div', { className: 'agent-card-desc' }, esc(agent.description || ''))
        )
      ),
      h('div', { className: 'agent-card-stats' },
        h('span', { className: 'stat' }, h('span', { className: 'stat-dot pending' }), ' ', counts.pending),
        h('span', { className: 'stat' }, h('span', { className: 'stat-dot running' }), ' ', counts.running),
        counts.review ? h('span', { className: 'stat review-highlight' }, h('span', { className: 'stat-dot review' }), ' ', counts.review) : null,
        h('span', { className: 'stat' }, h('span', { className: 'stat-dot reviewed' }), ' ', counts.reviewed)
      )
    );
  }

  // --- AGENT GRID ---
  function updateAgentGrid(el, state) {
    var agents = state.agents;
    el.textContent = '';
    agents.forEach(function (a) {
      el.appendChild(createAgentCard(a, state.agentCounts[a.id] || {}));
    });
  }

  // --- REVIEW LIST ---
  function createReviewList(state) {
    var el = h('div', { className: 'review-list', style: { display: 'none' } });
    updateReviewList(el, state);
    return el;
  }

  function updateReviewList(el, state) {
    var tasks = state.needsReview;
    if (!tasks.length) { el.style.display = 'none'; return; }
    el.style.display = '';
    el.textContent = '';
    var header = h('div', { className: 'section-header' },
      h('span', { className: 'section-title' }, '📋 待检验'),
      h('button', { className: 'btn btn-sm btn-primary', dataset: { action: 'batch-review' } }, '批量检验')
    );
    el.appendChild(header);
    tasks.forEach(function (t) {
      var ag = Store.getAgent(t.agentId);
      var item = h('div', { className: 'review-item', dataset: { action: 'open-task', id: t.id } },
        h('div', { className: 'review-item-check', dataset: { action: 'review-task', id: t.id } }, '✓'),
        h('div', { className: 'review-item-body' },
          h('div', { className: 'review-item-title' }, esc(t.title)),
          h('div', { className: 'review-item-meta' },
            (ag ? ag.emoji + ' ' + esc(ag.name) : '') + ' · 检验 ' + (t.checkinTime || '') + ' · x' + (t.iterationCount || 0)
          )
        ),
        (t.iterationCount > 1 ? h('span', { className: 'review-item-iteration' }, 'x' + t.iterationCount) : null)
      );
      el.appendChild(item);
    });
  }

  // --- TASK ITEM (for waiting view) ---
  function createTaskItem(task, agent) {
    var item = h('div', { className: 'task-item ' + task.status, dataset: { action: 'open-task', id: task.id } },
      h('div', { className: 'task-check', dataset: { action: 'advance-task', id: task.id } },
        task.status === 'reviewed' ? '✓' : ''
      ),
      h('div', { className: 'task-body' },
        h('div', { className: 'task-title' }, esc(task.title), task.iterationCount > 1 ? h('span', { className: 'iter-badge' }, 'x' + task.iterationCount) : null),
        h('div', { className: 'task-meta' },
          agent ? h('span', { className: 'task-time' }, agent.emoji + ' ' + esc(agent.name)) : null,
          h('span', { className: 'task-time' }, '🕐' + (task.scheduledTime || '')),
          task.checkinTime ? h('span', { className: 'task-checkin-time' }, '🔔' + task.checkinTime) : null,
          h('span', { className: 'task-status-badge ' + task.status }, STATUS_ICON(task.status) + ' ' + STATUS[task.status])
        ),
        task.description ? h('div', { className: 'task-desc' }, esc(task.description)) : null
      )
    );
    return item;
  }

  function STATUS_ICON(s) {
    return { pending:'⏳', running:'🔄', review:'🔔', reviewed:'✅', cancelled:'❌' }[s] || '';
  }

  // --- TIMELINE ITEM (for schedule view) ---
  function createTimelineItem(task, agent) {
    return h('div', { className: 'schedule-task ' + task.status, dataset: { action: 'open-task', id: task.id } },
      h('span', { className: 'schedule-task-dot' }),
      h('div', { className: 'schedule-task-body' },
        h('div', { className: 'schedule-task-title' }, STATUS_ICON(task.status), ' ', esc(task.title)),
        h('div', { className: 'schedule-task-agent' },
          (agent ? agent.emoji + ' ' + esc(agent.name) : '') +
          ' · 🕐' + (task.scheduledTime || '') +
          (task.checkinTime ? ' · 🔔' + task.checkinTime : '')
        )
      ),
      h('span', { className: 'schedule-task-time' }, '🕐' + (task.scheduledTime || ''))
    );
  }

  // ========================================================================
  // VIEWS
  // ========================================================================

  var viewContainer = document.getElementById('view-container');
  var currentView = 'dashboard';

  // --- DASHBOARD ---
  var dashboardEl;

  function initDashboard() {
    dashboardEl = h('div', { className: 'dashboard-view' });
    dashboardEl.appendChild(createBanner(getState()));
    dashboardEl.appendChild(createStats(getState()));
    var gridEl = h('div', { className: 'agents-grid' });
    updateAgentGrid(gridEl, getState());
    dashboardEl.appendChild(gridEl);
    dashboardEl.appendChild(createReviewList(getState()));
    viewContainer.appendChild(dashboardEl);
  }

  function updateDashboard() {
    var state = getState();
    var banner = dashboardEl.querySelector('.checkin-alert, .checkin-next');
    if (banner) updateBanner(banner, state);
    else { dashboardEl.insertBefore(createBanner(state), dashboardEl.firstChild); }
    var stats = dashboardEl.querySelector('.stats-bar');
    if (stats) updateStats(stats, state);
    var grid = dashboardEl.querySelector('.agents-grid');
    if (grid) updateAgentGrid(grid, state);
    var rl = dashboardEl.querySelector('.review-list');
    if (rl) updateReviewList(rl, state);
    else { var newRl = createReviewList(state); if (newRl.childNodes.length) dashboardEl.appendChild(newRl); }
  }

  // --- WAITING ---
  var waitingEl;

  function initWaiting() {
    waitingEl = h('div', { className: 'waiting-view' });
    updateWaitingContent();
    viewContainer.appendChild(waitingEl);
  }

  function updateWaiting() {
    if (waitingEl) updateWaitingContent();
  }

  function updateWaitingContent() {
    waitingEl.textContent = '';
    var state = getState();
    var today = state.today;
    var tasks = state.allTasks.filter(function (t) {
      return t.status !== 'cancelled' && !(t.status === 'reviewed' && t.scheduledDate !== today);
    });
    tasks.sort(function (a, b) {
      var d = (a.scheduledDate || '').localeCompare(b.scheduledDate || '');
      if (d !== 0) return d;
      return (a.scheduledTime || '').localeCompare(b.scheduledTime || '');
    });

    if (!tasks.length) {
      waitingEl.appendChild(
        h('div', { className: 'empty-state' },
          h('div', { className: 'empty-state-icon' }, '🌿'),
          h('h2', null, '没有任务'),
          h('p', null, '所有任务都已完成，享受宁静。')
        )
      );
      return;
    }

    var header = h('div', { className: 'section-header' },
      h('span', { className: 'section-title' }, '⏳ 等待中'),
      h('span', { className: 'stat' }, h('span', { className: 'stat-dot' }), ' ', tasks.length + ' 个')
    );
    waitingEl.appendChild(header);

    var list = h('div', { className: 'task-list' });
    var agentMap = {};
    state.agents.forEach(function (a) { agentMap[a.id] = a; });
    tasks.forEach(function (t) {
      list.appendChild(createTaskItem(t, agentMap[t.agentId]));
    });
    waitingEl.appendChild(list);
  }

  // --- SCHEDULE ---
  var scheduleEl;
  var schedDate = Store.todayStr();

  function initSchedule() {
    scheduleEl = h('div', { className: 'schedule-view' });
    updateScheduleContent();
    viewContainer.appendChild(scheduleEl);
  }

  function updateSchedule() {
    if (scheduleEl) updateScheduleContent();
  }

  function updateScheduleContent() {
    scheduleEl.textContent = '';
    var dt = new Date(schedDate + 'T12:00:00');
    var td = Store.todayStr();
    var isTd = schedDate === td;
    var wd = ['日','一','二','三','四','五','六'][dt.getDay()];
    var lb = isTd ? '今天' : (dt.getMonth() + 1) + '/' + dt.getDate();

    var header = h('div', { className: 'schedule-header' },
      h('div', { className: 'schedule-date-nav' },
        h('button', { dataset: { action: 'prev-day' } }, '‹'),
        h('span', { className: 'schedule-date-label' }, lb + ' 周' + wd),
        h('button', { dataset: { action: 'next-day' } }, '›'),
        isTd ? null : h('button', { className: 'btn btn-sm btn-secondary', dataset: { action: 'today' } }, '今天')
      )
    );
    scheduleEl.appendChild(header);

    var state = getState();
    var tasks = Store.getTasks({ date: schedDate }).filter(function (t) { return t.status !== 'cancelled'; });
    var agentMap = {};
    state.agents.forEach(function (a) { agentMap[a.id] = a; });

    if (!tasks.length) {
      scheduleEl.appendChild(
        h('div', { className: 'empty-state', style: { minHeight: '40vh' } },
          h('div', { style: { fontSize: '3rem', marginBottom: 'var(--space-md)' } }, '🌿'),
          h('p', null, '这一天没有安排')
        )
      );
      return;
    }

    var timeline = h('div', { className: 'schedule-timeline' });
    var hours = {};
    tasks.forEach(function (t) {
      var hh = parseInt((t.scheduledTime || '09').split(':')[0], 10);
      if (!hours[hh]) hours[hh] = [];
      hours[hh].push(t);
    });

    for (var hh = 0; hh < 24; hh++) {
      if (!hours[hh] || !hours[hh].length) continue;
      var slot = h('div', { className: 'schedule-hour' },
        h('div', { className: 'schedule-hour-label' }, hh === 0 ? '00:00' : Store.fmtTime(hh, 0))
      );
      var taskContainer = h('div', { className: 'schedule-tasks' });
      hours[hh].forEach(function (t) {
        taskContainer.appendChild(createTimelineItem(t, agentMap[t.agentId]));
      });
      slot.appendChild(taskContainer);
      timeline.appendChild(slot);
    }
    scheduleEl.appendChild(timeline);
  }

  // ========================================================================
  // NAVIGATION
  // ========================================================================

  var navItems = qsa('.nav-item');
  var fab = document.getElementById('fab');
  var headerTitle = document.querySelector('.header-title');

  function showView(name) {
    if (name === currentView && name !== 'schedule') return;
    currentView = name;
    var state = getState();

    dashboardEl.style.display = name === 'dashboard' ? '' : 'none';
    waitingEl.style.display = name === 'waiting' ? '' : 'none';
    scheduleEl.style.display = name === 'schedule' ? '' : 'none';

    navItems.forEach(function (el) {
      el.classList.toggle('active', el.dataset.view === name);
    });

    var titles = { dashboard: '🌱 Agent Garden', waiting: '⏳ 等待中', schedule: '📅 日程' };
    if (headerTitle) headerTitle.textContent = titles[name] || '🌱 Agent Garden';

    if (name === 'dashboard') updateDashboard();
    else if (name === 'waiting') updateWaiting();
    else if (name === 'schedule') updateSchedule();

    window.location.hash = '#' + name;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ========================================================================
  // EVENT DELEGATION
  // ========================================================================

  viewContainer.addEventListener('click', function (e) {
    var target = e.target.closest('[data-action]');
    if (!target) return;
    var action = target.dataset.action;
    var id = target.dataset.id;

    if (action === 'open-agent') { showAgentDetail(id); }
    else if (action === 'open-task') { var tid = id || target.closest('[data-id]') && target.closest('[data-id]').dataset.id; if (tid) showTaskDetail(tid); }
    else if (action === 'advance-task') { advanceTask(id || (target.closest('[data-id]') ? target.closest('[data-id]').dataset.id : null)); }
    else if (action === 'review-task') { var rid = id || (target.closest('[data-id]') ? target.closest('[data-id]').dataset.id : null); if (rid) { Store.updTask(rid, { status: 'reviewed' }); toast('✅ 已检验'); updateDashboard(); } }
    else if (action === 'batch-review') { showCheckin(); }
    else if (action === 'go-waiting') { showView('waiting'); }
    else if (action === 'prev-day') { var d = new Date(schedDate + 'T12:00:00'); d.setDate(d.getDate() - 1); schedDate = Store.todayStr(d); showView('schedule'); }
    else if (action === 'next-day') { var d = new Date(schedDate + 'T12:00:00'); d.setDate(d.getDate() + 1); schedDate = Store.todayStr(d); showView('schedule'); }
    else if (action === 'today') { schedDate = Store.todayStr(); showView('schedule'); }
  });

  function advanceTask(id) {
    if (!id) return;
    var t = Store.getTask(id);
    if (!t) return;
    var idx = FLOW.indexOf(t.status);
    var next = idx < 3 ? FLOW[idx + 1] : 'pending';
    Store.updTask(id, { status: next });
    toast(STATUS_ICON(next) + ' ' + (STATUS[next] || ''));
    if (currentView === 'waiting') updateWaiting();
    else if (currentView === 'dashboard') updateDashboard();
  }

  // ========================================================================
  // FAB
  // ========================================================================

  fab.addEventListener('click', function () {
    if (currentView === 'dashboard') {
      showAddAgent();
    } else if (currentView === 'waiting') {
      showAddTask(null);
    }
  });

  // ========================================================================
  // MODAL PAGES
  // ========================================================================

  function showAddAgent() {
    var onEmojiClick;
    var selectedEmoji = EMOJIS[0];

    var grid = h('div', { className: 'emoji-grid' });
    EMOJIS.forEach(function (e) {
      var btn = h('button', { className: 'emoji-option' + (e === selectedEmoji ? ' selected' : ''), dataset: { emoji: e } }, e);
      grid.appendChild(btn);
    });

    var content = h('div', null,
      h('div', { className: 'modal-title' }, '🌱 种植新的 Agent'),
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, '图标'),
        grid
      ),
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label', htmlFor: 'agent-name' }, '名称'),
        h('input', { className: 'form-input', id: 'agent-name', type: 'text', placeholder: '例如：代码审查官' })
      ),
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label', htmlFor: 'agent-desc' }, '描述'),
        h('input', { className: 'form-input', id: 'agent-desc', type: 'text', placeholder: '这个 Agent 负责什么' })
      ),
      h('div', { className: 'modal-actions' },
        h('button', { className: 'btn btn-secondary', dataset: { action: 'close-modal' } }, '取消'),
        h('button', { className: 'btn btn-primary', id: 'submit-agent' }, '添加')
      )
    );

    openModal(content);

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.emoji-option');
      if (!btn) return;
      qsa('.emoji-option', grid).forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      selectedEmoji = btn.dataset.emoji;
    });

    var submit = document.getElementById('submit-agent');
    if (submit) {
      submit.addEventListener('click', function () {
        var nameInput = document.getElementById('agent-name');
        var name = nameInput ? nameInput.value.trim() : '';
        if (!name) { if (nameInput) { nameInput.focus(); nameInput.style.borderColor = '#ef4444'; } return; }
        var descInput = document.getElementById('agent-desc');
        Store.addAgent({ name: name, emoji: selectedEmoji, description: descInput ? descInput.value.trim() : '' });
        closeModal();
        toast('🌱「' + name + '」已添加');
        if (currentView === 'dashboard') updateDashboard();
      });
    }

    var nameInput = document.getElementById('agent-name');
    if (nameInput) setTimeout(function () { nameInput.focus(); }, 100);
  }

  function showAddTask(agentId) {
    var td = Store.todayStr();
    var agents = Store.getAgents();

    var agentOptions = h('select', { className: 'form-select', id: 'task-agent' });
    agents.forEach(function (a) {
      agentOptions.appendChild(h('option', { value: a.id, selected: a.id === agentId ? '' : null }, a.emoji + ' ' + esc(a.name)));
    });

    var content = h('div', null,
      h('div', { className: 'modal-title' }, '📋 添加任务'),
      agents.length > 1 ? h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, 'Agent'),
        agentOptions
      ) : null,
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label', htmlFor: 'task-title' }, '任务'),
        h('input', { className: 'form-input', id: 'task-title', type: 'text', placeholder: '例如：审查 PR #42' })
      ),
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label', htmlFor: 'task-desc' }, '描述'),
        h('textarea', { className: 'form-textarea', id: 'task-desc', rows: 2 })
      ),
      h('div', { className: 'form-row' },
        h('div', { className: 'form-group' },
          h('label', { className: 'form-label', htmlFor: 'task-sched-date' }, '🕐 启动日期'),
          h('input', { className: 'form-input', id: 'task-sched-date', type: 'date', value: td })
        ),
        h('div', { className: 'form-group' },
          h('label', { className: 'form-label', htmlFor: 'task-sched-time' }, '启动时间'),
          h('input', { className: 'form-input', id: 'task-sched-time', type: 'time', value: '09:00' })
        )
      ),
      h('div', { className: 'form-group', style: { borderLeft: '3px solid var(--accent)', paddingLeft: 'var(--space-md)', marginBottom: 'var(--space-md)' } },
        h('label', { className: 'form-label', style: { color: 'var(--accent)' } }, '🔔 你的检验时间'),
        h('p', { style: { fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-sm)' } }, '设定你回来检查的时间，在此之前放心做其他事。'),
        h('div', { className: 'form-row' },
          h('div', { className: 'form-group' },
            h('input', { className: 'form-input', id: 'task-chk-date', type: 'date', value: td })
          ),
          h('div', { className: 'form-group' },
            h('input', { className: 'form-input', id: 'task-chk-time', type: 'time', value: '11:00' })
          )
        )
      ),
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label', htmlFor: 'task-notes' }, '备注'),
        h('textarea', { className: 'form-textarea', id: 'task-notes', rows: 2 })
      ),
      h('div', { className: 'modal-actions' },
        h('button', { className: 'btn btn-secondary', dataset: { action: 'close-modal' } }, '取消'),
        h('button', { className: 'btn btn-primary', id: 'submit-task' }, '添加')
      )
    );

    openModal(content);

    // Auto-set checkin time to +2h from start
    var schedTime = document.getElementById('task-sched-time');
    var chkTime = document.getElementById('task-chk-time');
    var schedDateEl = document.getElementById('task-sched-date');
    var chkDateEl = document.getElementById('task-chk-date');

    if (schedTime && chkTime) {
      schedTime.addEventListener('change', function () {
        var p = schedTime.value.split(':');
        var hh = Math.min(parseInt(p[0], 10) + 2, 23);
        chkTime.value = Store.fmtTime(hh, parseInt(p[1], 10) || 0);
      });
    }
    if (schedDateEl && chkDateEl) {
      schedDateEl.addEventListener('change', function () { chkDateEl.value = schedDateEl.value; });
    }

    var submit = document.getElementById('submit-task');
    if (submit) {
      submit.addEventListener('click', function () {
        var title = document.getElementById('task-title');
        var ttl = title ? title.value.trim() : '';
        if (!ttl) { if (title) { title.focus(); title.style.borderColor = '#ef4444'; } return; }
        var aid = agentOptions ? agentOptions.value : (agentId || agents[0].id);
        Store.addTask({
          agentId: aid,
          title: ttl,
          description: document.getElementById('task-desc') ? document.getElementById('task-desc').value.trim() : '',
          scheduledDate: schedDateEl ? schedDateEl.value : td,
          scheduledTime: schedTime ? schedTime.value : '09:00',
          checkinDate: chkDateEl ? chkDateEl.value : td,
          checkinTime: chkTime ? chkTime.value : '11:00',
          notes: document.getElementById('task-notes') ? document.getElementById('task-notes').value.trim() : ''
        });
        closeModal();
        toast('📋「' + ttl + '」已添加');
        if (currentView === 'waiting') updateWaiting();
        else if (currentView === 'dashboard') updateDashboard();
        else if (currentView === 'schedule') updateSchedule();
      });
    }

    var titleInput = document.getElementById('task-title');
    if (titleInput) setTimeout(function () { titleInput.focus(); }, 100);
  }

  function showAgentDetail(id) {
    var ag = Store.getAgent(id);
    if (!ag) return;
    var counts = Store.taskCounts(id);
    var tasks = Store.getTasks({ agentId: id });
    var agentMap = {}; agentMap[id] = ag;

    var list = h('div', { className: 'task-list', style: { maxHeight: '40vh', overflowY: 'auto' } });
    if (tasks.length) {
      tasks.forEach(function (t) { list.appendChild(createTaskItem(t, ag)); });
    } else {
      list.appendChild(h('p', { style: { textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-lg)' } }, '暂无任务'));
    }

    var content = h('div', null,
      h('div', { style: { textAlign: 'center', marginBottom: 'var(--space-md)' } },
        h('div', { style: { fontSize: '2.5rem', marginBottom: 'var(--space-xs)' } }, ag.emoji),
        h('div', { style: { fontSize: '1.1rem', fontWeight: 700 } }, esc(ag.name)),
        ag.description ? h('p', { style: { fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' } }, esc(ag.description)) : null
      ),
      h('div', { className: 'stats-bar', style: { justifyContent: 'center' } },
        h('span', { className: 'stat' }, h('span', { className: 'stat-dot pending' }), ' ', counts.pending),
        h('span', { className: 'stat' }, h('span', { className: 'stat-dot running' }), ' ', counts.running),
        h('span', { className: 'stat' }, h('span', { className: 'stat-dot review' }), ' ', counts.review),
        h('span', { className: 'stat' }, h('span', { className: 'stat-dot reviewed' }), ' ', counts.reviewed)
      ),
      list,
      h('div', { className: 'modal-actions' },
        h('button', { className: 'btn btn-primary', id: 'detail-add-task' }, '+ 添加任务'),
        h('button', { className: 'btn btn-secondary', dataset: { action: 'close-modal' } }, '关闭')
      )
    );

    openModal(content);

    var addBtn = document.getElementById('detail-add-task');
    if (addBtn) addBtn.addEventListener('click', function () { closeModal(); showAddTask(id); });

    // Task advancement within modal
    content.addEventListener('click', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;
      if (target.dataset.action === 'advance-task') {
        var tid = target.dataset.id;
        if (!tid) return;
        var t = Store.getTask(tid);
        if (!t) return;
        var idx = FLOW.indexOf(t.status);
        Store.updTask(tid, { status: idx < 3 ? FLOW[idx + 1] : 'pending' });
        closeModal();
        showAgentDetail(id);
        toast('状态已更新');
      }
      if (target.dataset.action === 'open-task') {
        var tid = target.dataset.id;
        if (tid) { closeModal(); showTaskDetail(tid); }
      }
    });
  }

  function showTaskDetail(id) {
    var t = Store.getTask(id);
    if (!t) return;
    var ag = Store.getAgent(t.agentId);

    var statusBtns = h('div', { className: 'status-options' });
    FLOW.forEach(function (s) {
      statusBtns.appendChild(
        h('button', { className: 'status-btn' + (t.status === s ? ' active' : ''), dataset: { action: 'set-status', status: s } },
          STATUS_ICON(s) + ' ' + STATUS[s]
        )
      );
    });
    if (t.status !== 'cancelled') {
      statusBtns.appendChild(
        h('button', { className: 'status-btn', dataset: { action: 'set-status', status: 'cancelled' } }, '❌ 取消')
      );
    }

    var content = h('div', null,
      h('div', { className: 'modal-title', style: { fontSize: '1rem' } }, esc(t.title)),
      h('p', { style: { textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-md)' } },
        (ag ? ag.emoji + ' ' + esc(ag.name) : '') + ' · ' + (t.scheduledDate || '') + ' ' + (t.scheduledTime || '')
      ),
      t.description ? h('div', { className: 'task-detail-info' }, esc(t.description)) : null,
      h('div', { className: 'task-detail-info' },
        h('div', { className: 'task-detail-row' }, h('span', null, '🤖 启动'), h('span', null, (t.scheduledDate || '') + ' ' + (t.scheduledTime || ''))),
        h('div', { className: 'task-detail-row highlight' }, h('span', null, '🔔 检验'), h('span', null, (t.checkinDate || '') + ' ' + (t.checkinTime || ''))),
        h('div', { className: 'task-detail-row' }, h('span', null, '🔄 迭代'), h('span', null, (t.iterationCount || 0) + ' 次'))
      ),
      t.iterationCount >= 2 ? h('div', { className: 'diminishing-notice' }, '📊 已迭代 ' + t.iterationCount + ' 次，收益递减。') : null,
      h('div', { className: 'form-group' },
        h('label', { className: 'form-label' }, '状态'),
        statusBtns
      ),
      t.notes ? h('div', { style: { background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-md)', marginTop: 'var(--space-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' } }, '📝 ' + esc(t.notes)) : null,
      h('div', { className: 'modal-actions' },
        h('button', { className: 'btn btn-secondary', dataset: { action: 'close-modal' } }, '关闭')
      )
    );

    openModal(content);

    content.addEventListener('click', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target || target.dataset.action !== 'set-status') return;
      var newStatus = target.dataset.status;
      if (!newStatus) return;
      Store.updTask(id, { status: newStatus });
      closeModal();
      toast(STATUS_ICON(newStatus) + ' ' + (STATUS[newStatus] || ''));
      if (currentView === 'dashboard') updateDashboard();
      else if (currentView === 'waiting') updateWaiting();
      else if (currentView === 'schedule') updateSchedule();
    });
  }

  function showCheckin() {
    var tasks = Store.needsReview();
    if (!tasks.length) { toast('没有待检验的任务'); return; }

    var list = h('div', { className: 'checkin-list' });
    tasks.forEach(function (t) {
      var ag = Store.getAgent(t.agentId);
      var item = h('div', { className: 'checkin-item', dataset: { id: t.id } });
      var header = h('div', { className: 'checkin-item-header' },
        h('span', { className: 'checkin-item-emoji' }, ag ? ag.emoji : '🤖'),
        h('div', { className: 'checkin-item-body' },
          h('div', { className: 'checkin-item-title' }, esc(t.title)),
          h('div', { className: 'checkin-item-meta' }, (ag ? esc(ag.name) : '') + ' · x' + (t.iterationCount || 0))
        ),
        h('button', { className: 'btn btn-sm btn-primary', dataset: { action: 'approve-one', id: t.id } }, '✓ 通过')
      );
      item.appendChild(header);
      var notesDiv = h('div', { className: 'checkin-item-notes' });
      var notesInput = h('input', { className: 'form-input checkin-note-input', type: 'text', placeholder: '检验备注（可选）' });
      notesDiv.appendChild(notesInput);
      item.appendChild(notesDiv);
      if (t.iterationCount >= 2) {
        item.appendChild(h('div', { className: 'diminishing-notice' },
          '📊 已迭代 ' + t.iterationCount + ' 次，收益递减阶段。' +
          (t.iterationCount >= 4 ? '建议评估是否真需继续优化。' : '请评估本次改进是否达到预期。')
        ));
      }
      list.appendChild(item);
    });

    var content = h('div', null,
      h('div', { className: 'modal-title' }, '🔔 批量检验'),
      h('p', { style: { textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-md)' } }, tasks.length + ' 个任务已完成'),
      list,
      h('div', { className: 'modal-actions' },
        h('button', { className: 'btn btn-secondary', dataset: { action: 'close-modal' } }, '稍后'),
        h('button', { className: 'btn btn-primary', id: 'approve-all' }, '全部通过')
      )
    );

    openModal(content);

    content.addEventListener('click', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;
      if (target.dataset.action === 'approve-one') {
        var tid = target.dataset.id;
        var item = target.closest('.checkin-item');
        var input = item ? item.querySelector('.checkin-note-input') : null;
        var u = { status: 'reviewed' };
        if (input && input.value.trim()) u.notes = input.value.trim();
        Store.updTask(tid, u);
        if (item) { item.style.opacity = '0.3'; target.textContent = '✓ 已检'; target.disabled = true; }
        toast('✅ 已通过');
      }
    });

    var approveAll = document.getElementById('approve-all');
    if (approveAll) {
      approveAll.addEventListener('click', function () {
        tasks.forEach(function (t) { Store.updTask(t.id, { status: 'reviewed' }); });
        Store.addSession({ taskIds: tasks.map(function (t) { return t.id; }), note: '批量检验' });
        closeModal();
        toast('✅ ' + tasks.length + ' 个已全部通过');
        if (currentView === 'dashboard') updateDashboard();
        else if (currentView === 'waiting') updateWaiting();
      });
    }
  }

  // Handle close-modal actions globally
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-action="close-modal"]')) {
      closeModal();
    }
  });

  // ========================================================================
  // AUTO REMINDER (notification only, no status changes)
  // ========================================================================

  var autoTimer = null;
  var knownOverdue = {};

  function startAutoReminder() {
    function check() {
      if (document.hidden) return;

      var overdue = Store.dueCheckins();
      var nr = Store.needsReview();

      var newOverdue = overdue.filter(function (t) { return !knownOverdue[t.id]; });
      if (newOverdue.length > 0) {
        newOverdue.forEach(function (t) { knownOverdue[t.id] = true; });
        sendNotif(nr.length + overdue.length, 'new');
        if (currentView === 'dashboard') updateDashboard();
      }

      // Update countdown if dashboard visible
      if (currentView === 'dashboard' && dashboardEl) {
        var banner = dashboardEl.querySelector('.checkin-next');
        if (banner) {
          var nx = Store.nextCheckin();
          if (nx) {
            var cd = banner.querySelector('#cd-text');
            if (cd) updateCountdown(cd, nx);
          }
        }
      }
    }

    // Initialize known overdue
    Store.dueCheckins().forEach(function (t) { knownOverdue[t.id] = true; });

    check();
    autoTimer = setInterval(check, 30000);

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) {
        var overdue = Store.dueCheckins();
        var newOnes = overdue.filter(function (t) { return !knownOverdue[t.id]; });
        if (newOnes.length > 0) {
          newOnes.forEach(function (t) { knownOverdue[t.id] = true; });
          sendNotif(Store.needsReview().length + overdue.length, 'return');
          if (currentView === 'dashboard') updateDashboard();
        }
      }
    });
  }

  function sendNotif(count, reason) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('🔔 Agent Garden', {
        body: count + ' 个任务等待处理',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E🌱%3C/text%3E%3C/svg%3E',
        tag: 'agent-garden',
        silent: false
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  function requestNotif() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  // ========================================================================
  // INIT
  // ========================================================================

  function init() {
    initTheme();
    if (!Store.hasData()) Store.loadDemo();

    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Create all three views
    initDashboard();
    initWaiting();
    initSchedule();

    // Routing
    var hash = window.location.hash.slice(1) || 'dashboard';
    showView(hash);
    window.addEventListener('hashchange', function () {
      var h = window.location.hash.slice(1) || 'dashboard';
      if (['dashboard', 'waiting', 'schedule'].indexOf(h) !== -1) {
        showView(h);
      }
    });

    // Subscribe to Store changes → auto-update current view
    Store.sub(function () {
      if (currentView === 'dashboard') updateDashboard();
      else if (currentView === 'waiting') updateWaiting();
      else if (currentView === 'schedule') updateSchedule();
    });

    // Auto reminder system
    startAutoReminder();
    requestNotif();

    // Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
