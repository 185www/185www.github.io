(function() {
  'use strict';

  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));

  const EMOJIS = ['🤖','🔍','✍️','📊','🎨','🧪','📝','🔧','🚀','💡','📈','🎯','🛠️','📋','⚡','🧠','🎭','🎪','🎬','📸','🎵','🎮','🌐','📱'];

  let currentView = 'dashboard';
  let currentAgentId = null;
  let scheduleDate = Store.todayStr();
  let countdownInterval = null;

  const viewContainer = $('#view-container');
  const modalOverlay = $('#modal-overlay');
  const modal = $('#modal');
  const fab = $('#fab');
  const themeToggle = $('#theme-toggle');
  const headerTitle = $('.header-title');

  // ---- Navigation ----
  function navigate(view, data) {
    if (view === 'dashboard') { currentView = 'dashboard'; currentAgentId = null; window.location.hash = '#dashboard'; }
    else if (view === 'agent') { currentView = 'agent'; currentAgentId = data; window.location.hash = '#agent-' + data; }
    else if (view === 'schedule') { currentView = 'schedule'; currentAgentId = null; window.location.hash = '#schedule'; }
    render();
  }

  function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    if (hash === 'dashboard') { currentView = 'dashboard'; currentAgentId = null; }
    else if (hash.startsWith('agent-')) { currentView = 'agent'; currentAgentId = hash.replace('agent-', ''); }
    else if (hash === 'schedule') { currentView = 'schedule'; currentAgentId = null; }
    else { currentView = 'dashboard'; currentAgentId = null; window.location.hash = '#dashboard'; }
    render();
  }

  // ---- Render ----
  function render() {
    updateNavHighlight(); updateFab(); updateHeader();
    viewContainer.style.animation = 'none'; void viewContainer.offsetHeight; viewContainer.style.animation = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    switch (currentView) {
      case 'dashboard': renderDashboard(); break;
      case 'agent': renderAgentDetail(currentAgentId); break;
      case 'schedule': renderSchedule(); break;
      default: renderDashboard();
    }
  }

  function updateNavHighlight() {
    $$('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === currentView));
  }

  function updateFab() {
    if (currentView === 'dashboard' || (currentView === 'agent' && currentAgentId)) {
      fab.style.display = 'flex'; fab.innerHTML = '<span>+</span>';
    } else { fab.style.display = 'none'; }
  }

  function updateHeader() {
    if (currentView === 'dashboard') headerTitle.textContent = '🌱 Agent Gardener';
    else if (currentView === 'agent') {
      const agent = Store.getAgent(currentAgentId);
      headerTitle.textContent = agent ? agent.emoji + ' ' + agent.name : 'Agent';
    } else if (currentView === 'schedule') headerTitle.textContent = '📅 日程';
  }

  // ======================================================================
  // DASHBOARD
  // ======================================================================
  function renderDashboard() {
    const agents = Store.getAgents();
    const needsReview = Store.getNeedsReview();
    const pendingReviewCount = needsReview.length;
    const nextCheckin = Store.getNextCheckin();
    const counts = Store.getTaskCounts();

    if (agents.length === 0) {
      viewContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🌱</div>
          <h2>你的花园还是空的</h2>
          <p>添加你的第一个 Agent，开始高效管理工作流。<br>"其莳也若子，其置也若弃"</p>
          <button class="btn btn-primary" id="add-first-agent">添加第一个 Agent</button>
        </div>`;
      $('#add-first-agent').addEventListener('click', showAddAgentModal);
      return;
    }

    let html = '';

    // --- Next Check-in Banner ---
    if (pendingReviewCount > 0) {
      html += `
        <div class="checkin-alert">
          <div class="checkin-alert-icon">🔔</div>
          <div class="checkin-alert-body">
            <div class="checkin-alert-title">${pendingReviewCount} 个任务待检验</div>
            <div class="checkin-alert-desc">Agent 已完成工作，等待你的检查</div>
          </div>
          <button class="btn btn-sm btn-primary" id="start-checkin-btn">立即检验</button>
        </div>`;
    } else if (nextCheckin) {
      html += `
        <div class="checkin-next">
          <div class="checkin-next-icon">⏰</div>
          <div class="checkin-next-body">
            <div class="checkin-next-title">下次检验</div>
            <div class="checkin-next-time" id="next-checkin-countdown"></div>
          </div>
          <div class="checkin-next-schedule">${nextCheckin.time}</div>
        </div>`;
    }

    // --- Stats Bar ---
    html += `
      <div class="stats-bar">
        <span class="stat"><span class="stat-dot pending"></span>${counts.pending} 待办</span>
        <span class="stat"><span class="stat-dot running"></span>${counts.running} 进行中</span>
        <span class="stat"><span class="stat-dot review"></span>${counts.review} 待检验</span>
        <span class="stat"><span class="stat-dot reviewed"></span>${counts.reviewed} 已检验</span>
      </div>`;

    // --- Agent Cards ---
    html += `<div class="agents-grid">`;
    agents.forEach(agent => {
      const c = Store.getTaskCounts(agent.id);
      const next = Store.getNextCheckin && Store.getNextCheckin();
      html += `
        <div class="agent-card" data-agent-id="${agent.id}">
          <div class="agent-card-header">
            <div class="agent-card-emoji">${agent.emoji}</div>
            <div class="agent-card-info">
              <div class="agent-card-name">${escHtml(agent.name)}</div>
              <div class="agent-card-desc">${escHtml(agent.description || '')}</div>
            </div>
          </div>
          <div class="agent-card-stats">
            <span class="stat"><span class="stat-dot pending"></span>${c.pending}</span>
            <span class="stat"><span class="stat-dot running"></span>${c.running}</span>
            ${c.review ? `<span class="stat review-highlight"><span class="stat-dot review"></span>${c.review} 待检</span>` : ''}
            <span class="stat"><span class="stat-dot reviewed"></span>${c.reviewed}</span>
          </div>
        </div>`;
    });
    html += `</div>`;

    // --- Ready for Review Section ---
    if (needsReview.length > 0) {
      html += `
        <div class="section-header" style="padding-top:var(--space-md)">
          <span class="section-title">📋 待检验任务</span>
          <button class="btn btn-sm btn-primary" id="batch-review-btn">批量检验</button>
        </div>
        <div class="review-list">`;
      needsReview.forEach(task => {
        const agent = Store.getAgent(task.agentId);
        html += `
          <div class="review-item" data-task-id="${task.id}">
            <div class="review-item-check" data-action="mark-reviewed">✓</div>
            <div class="review-item-body">
              <div class="review-item-title">${escHtml(task.title)}</div>
              <div class="review-item-meta">${agent ? agent.emoji + ' ' + escHtml(agent.name) : ''} · 预期检验: ${task.checkinTime || ''}</div>
            </div>
            <span class="review-item-iteration">x${task.iterationCount || 0}</span>
          </div>`;
      });
      html += `</div>`;
    }

    viewContainer.innerHTML = html;

    // --- Event Listeners ---
    $$('.agent-card').forEach(el => {
      el.addEventListener('click', () => navigate('agent', el.dataset.agentId));
    });

    const checkinBtn = $('#start-checkin-btn');
    if (checkinBtn) checkinBtn.addEventListener('click', showCheckinMode);

    const batchBtn = $('#batch-review-btn');
    if (batchBtn) batchBtn.addEventListener('click', showCheckinMode);

    // Mark individual review items
    viewContainer.querySelectorAll('.review-item-check').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = el.closest('.review-item').dataset.taskId;
        Store.updateTask(taskId, { status: 'reviewed' });
        render();
        showToast('✅ 任务已检验');
      });
    });

    // Click review item to see details
    viewContainer.querySelectorAll('.review-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.review-item-check')) return;
        showTaskDetailModal(el.dataset.taskId);
      });
    });

    // Start countdown if no pending review items
    if (nextCheckin && pendingReviewCount === 0) {
      startCountdown(nextCheckin);
    }
  }

  // ---- Countdown ----
  function startCountdown(nextCheckin) {
    if (countdownInterval) clearInterval(countdownInterval);

    function update() {
      const el = $('#next-checkin-countdown');
      if (!el) { if (countdownInterval) clearInterval(countdownInterval); return; }

      const now = new Date();
      const checkinDate = new Date(nextCheckin.date + 'T' + (nextCheckin.time || '12:00'));
      const diff = checkinDate - now;

      if (diff <= 0) {
        el.textContent = '已到检验时间';
        if (countdownInterval) clearInterval(countdownInterval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 0) {
        el.textContent = `还有 ${hours} 小时 ${minutes} 分钟`;
      } else {
        el.textContent = `还有 ${minutes} 分钟`;
      }
    }

    update();
    countdownInterval = setInterval(update, 30000);
  }

  // ======================================================================
  // AGENT DETAIL
  // ======================================================================
  function renderAgentDetail(agentId) {
    const agent = Store.getAgent(agentId);
    if (!agent) { navigate('dashboard'); return; }

    const counts = Store.getTaskCounts(agent.id);
    const tasks = Store.getTasks({ agentId });

    let html = `
      <div class="detail-header">
        <div class="detail-emoji">${agent.emoji}</div>
        <div class="detail-info">
          <div class="detail-name">${escHtml(agent.name)}</div>
          <div class="detail-desc">${escHtml(agent.description || '')}</div>
        </div>
        <div class="detail-actions">
          <button class="btn btn-sm btn-secondary" id="edit-agent-btn">✏️</button>
          <button class="btn btn-sm btn-danger" id="delete-agent-btn">🗑️</button>
        </div>
      </div>
      <div class="agent-card-stats" style="padding:0 0 var(--space-md);border:none;">
        <span class="stat"><span class="stat-dot pending"></span>${counts.pending} 待办</span>
        <span class="stat"><span class="stat-dot running"></span>${counts.running} 进行中</span>
        <span class="stat"><span class="stat-dot review"></span>${counts.review} 待检验</span>
        <span class="stat"><span class="stat-dot reviewed"></span>${counts.reviewed} 已检验</span>
        <span class="stat">📊 ${counts.total} 总计</span>
      </div>`;

    // Group by date
    const grouped = {};
    tasks.forEach(t => {
      const d = t.scheduledDate || '未安排';
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(t);
    });
    const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    const today = Store.todayStr();

    if (dates.length === 0) {
      html += `<div class="empty-state" style="min-height:auto;padding:var(--space-2xl) 0;"><div style="font-size:3rem;margin-bottom:var(--space-md);">📋</div><p style="color:var(--text-secondary);">还没有任务</p></div>`;
    } else {
      html += `<div class="task-list">`;
      dates.forEach(date => {
        const label = date === today ? '今天' : date < today ? date.slice(5) + ' (已过期)' : date.slice(5);
        html += `<div class="section-header" style="padding-top:${date !== dates[0] ? 'var(--space-md)' : '0'}"><span class="section-title">${label}</span></div>`;
        grouped[date].forEach(task => html += renderTaskItem(task));
      });
      html += `</div>`;
    }

    viewContainer.innerHTML = html;

    const edBtn = $('#edit-agent-btn');
    const delBtn = $('#delete-agent-btn');
    if (edBtn) edBtn.addEventListener('click', () => showEditAgentModal(agent.id));
    if (delBtn) delBtn.addEventListener('click', () => {
      if (confirm(`确定删除「${agent.name}」及其所有任务？`)) {
        Store.deleteAgent(agent.id); navigate('dashboard');
      }
    });

    setupTaskEvents();
  }

  function renderTaskItem(task) {
    const s = task.status;
    const labels = { pending: '待办', running: '进行中', review: '待检验', reviewed: '已检验', cancelled: '已取消' };
    const icons = { pending: '⏳', running: '🔄', review: '🔔', reviewed: '✅', cancelled: '❌' };
    const iter = task.iterationCount > 1 ? `<span class="iter-badge">x${task.iterationCount}</span>` : '';
    return `
      <div class="task-item ${s}" data-task-id="${task.id}">
        <div class="task-check" data-action="advance-status">
          ${s === 'reviewed' ? '✓' : s === 'cancelled' ? '✕' : ''}
        </div>
        <div class="task-body">
          <div class="task-title">${escHtml(task.title)} ${iter}</div>
          ${task.description ? `<div class="task-desc">${escHtml(task.description)}</div>` : ''}
          <div class="task-meta">
            <span class="task-time">🕐 ${task.scheduledTime || ''}</span>
            ${task.checkinTime ? `<span class="task-checkin-time">🔔 检验 ${task.checkinTime}</span>` : ''}
            <span class="task-status-badge ${s}">${icons[s] || '⏳'} ${labels[s] || s}</span>
          </div>
        </div>
        <button class="task-delete-btn" data-action="delete-task">✕</button>
      </div>`;
  }

  function setupTaskEvents() {
    // Advance status on check click
    viewContainer.querySelectorAll('.task-check').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = el.closest('.task-item').dataset.taskId;
        const task = Store.getTask(taskId);
        if (!task) return;
        const flow = ['pending', 'running', 'review', 'reviewed'];
        const idx = flow.indexOf(task.status);
        const next = idx < 3 ? flow[idx + 1] : 'pending';
        Store.updateTask(taskId, { status: next });
        render();
        const msgs = { running: '🔄 Agent 已开始工作', review: '🔔 Agent 已完成，等待检验', reviewed: '✅ 已检验', pending: '⏳ 已重置' };
        showToast(msgs[next] || '状态已更新');
      });
    });

    viewContainer.querySelectorAll('.task-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.task-check') || e.target.closest('.task-delete-btn')) return;
        showTaskDetailModal(el.dataset.taskId);
      });
    });

    viewContainer.querySelectorAll('.task-delete-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = el.closest('.task-item').dataset.taskId;
        if (confirm('确定删除？')) { Store.deleteTask(taskId); render(); showToast('🗑️ 已删除'); }
      });
    });
  }

  // ======================================================================
  // SCHEDULE VIEW
  // ======================================================================
  function renderSchedule() {
    const date = new Date(scheduleDate + 'T12:00:00');
    const today = Store.todayStr();
    const isToday = scheduleDate === today;
    const weekday = ['日','一','二','三','四','五','六'][date.getDay()];
    const dateLabel = isToday ? '今天' : date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });

    let html = `
      <div class="schedule-header">
        <div class="schedule-date-nav">
          <button id="prev-date">‹</button>
          <span class="schedule-date-label">${dateLabel} 周${weekday}</span>
          <button id="next-date">›</button>
          ${!isToday ? `<button id="today-btn" class="btn btn-sm btn-secondary" style="margin-left:8px;">今天</button>` : ''}
        </div>
      </div>
      <div class="schedule-info">
        <span style="font-size:0.78rem;color:var(--text-secondary);">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--primary);margin-right:4px;"></span>启动时间
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--accent);margin:0 4px 0 12px;"></span>检验时间
        </span>
      </div>
      <div class="schedule-timeline">`;

    const tasks = Store.getTasks({ date: scheduleDate });
    const agents = Store.getAgents();
    const agentMap = {};
    agents.forEach((a, i) => { agentMap[a.id] = a; a._color = ['#2d6a4f','#e07a5f','#3d85c6','#b5838d','#6b705c','#e6b8a8','#7b9e8c','#c9a96e'][i % 8]; });

    if (tasks.length === 0) {
      html += `<div class="schedule-empty"><div style="font-size:3rem;margin-bottom:var(--space-md);">🌿</div><p>今天没有安排任务</p></div>`;
    } else {
      const hours = {};
      for (let h = 0; h < 24; h++) hours[h] = [];

      // Collect all events (start + checkin)
      const events = [];
      tasks.forEach(task => {
        const ag = agentMap[task.agentId];
        events.push({ task, time: task.scheduledTime, type: 'start', agent: ag });
        if (task.checkinTime) events.push({ task, time: task.checkinTime, type: 'checkin', agent: ag });
      });
      events.sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));

      events.forEach(ev => {
        const h = parseInt((ev.time || '09:00').split(':')[0], 10);
        if (!hours[h]) hours[h] = [];
        hours[h].push(ev);
      });

      for (let h = 0; h < 24; h++) {
        const slotEvents = hours[h];
        if (slotEvents.length === 0) continue;
        const label = h === 0 ? '00:00' : Store.formatTime(h, 0);
        html += `<div class="schedule-hour" data-hour="${h}"><div class="schedule-hour-label">${label}</div><div class="schedule-tasks">`;
        slotEvents.forEach(ev => {
          const t = ev.task;
          const isCheckin = ev.type === 'checkin';
          const dotColor = isCheckin ? 'var(--accent)' : (t.status === 'reviewed' ? 'var(--primary)' : 'var(--primary-light)');
          const statusIcons = { pending: '', running: '🔄', review: '🔔', reviewed: '✅', cancelled: '' };
          const timeStr = isCheckin ? '🔔 ' + t.checkinTime : '🕐 ' + t.scheduledTime;
          html += `
            <div class="schedule-task ${isCheckin ? 'checkin-event' : ''} ${t.status}" data-task-id="${t.id}" title="${isCheckin ? '检验时间' : '启动时间'}">
              <span class="schedule-task-dot" style="background:${dotColor}"></span>
              <div class="schedule-task-body">
                <div class="schedule-task-title">${statusIcons[t.status] || ''} ${escHtml(t.title)}</div>
                <div class="schedule-task-agent">${ev.agent ? ev.agent.emoji + ' ' + escHtml(ev.agent.name) : ''} ${isCheckin ? '· 检验' : ''}</div>
              </div>
              <span class="schedule-task-time">${timeStr}</span>
            </div>`;
        });
        html += `</div></div>`;
      }
    }
    html += `</div>`;
    viewContainer.innerHTML = html;

    // Events
    const pBtn = $('#prev-date'), nBtn = $('#next-date'), tBtn = $('#today-btn');
    if (pBtn) pBtn.addEventListener('click', () => { const d = new Date(scheduleDate + 'T12:00:00'); d.setDate(d.getDate() - 1); scheduleDate = Store.getDateStr(d); renderSchedule(); });
    if (nBtn) nBtn.addEventListener('click', () => { const d = new Date(scheduleDate + 'T12:00:00'); d.setDate(d.getDate() + 1); scheduleDate = Store.getDateStr(d); renderSchedule(); });
    if (tBtn) tBtn.addEventListener('click', () => { scheduleDate = Store.todayStr(); renderSchedule(); });

    viewContainer.querySelectorAll('.schedule-task').forEach(el => {
      el.addEventListener('click', () => {
        const tid = el.dataset.taskId;
        if (tid) showTaskDetailModal(tid);
      });
    });
  }

  // ======================================================================
  // CHECK-IN MODE (批量化检验模式)
  // ======================================================================
  function showCheckinMode() {
    const tasks = Store.getNeedsReview();
    if (tasks.length === 0) { showToast('没有待检验的任务'); return; }

    const agents = Store.getAgents();
    const agentMap = {};
    agents.forEach(a => { agentMap[a.id] = a; });

    openModal(`
      <div class="modal-title" style="font-size:1.1rem;">🔔 批量检验</div>
      <p style="text-align:center;color:var(--text-secondary);font-size:0.85rem;margin-bottom:var(--space-md);">
        ${tasks.length} 个任务已完成，等待你的检查
      </p>
      <div class="checkin-list">`);

    tasks.forEach(task => {
      const ag = agentMap[task.agentId];
      const timeSince = task.completedAt ? formatTimeAgo(task.completedAt) : '';
      modal.innerHTML += `
        <div class="checkin-item" data-task-id="${task.id}">
          <div class="checkin-item-header">
            <span class="checkin-item-emoji">${ag ? ag.emoji : '🤖'}</span>
            <div class="checkin-item-body">
              <div class="checkin-item-title">${escHtml(task.title)}</div>
              <div class="checkin-item-meta">${ag ? escHtml(ag.name) : ''} · 已完成${timeSince ? ' ' + timeSince : ''} · 迭代 x${task.iterationCount || 0}</div>
            </div>
            <button class="btn btn-sm btn-primary checkin-item-approve">✓ 通过</button>
          </div>
          <div class="checkin-item-notes">
            <input class="form-input checkin-note-input" type="text" placeholder="检验备注（可选）" autocomplete="off">
          </div>
          ${task.iterationCount >= 2 ? `
          <div class="diminishing-notice">
            📊 已迭代 ${task.iterationCount} 次，典型收益曲线：首次 ~80%，后续递减。
            ${task.iterationCount >= 4 ? '建议考虑是否真的需要继续优化。' : '请评估本次改进是否达到预期。'}
          </div>` : ''}
        </div>`;
    });

    modal.innerHTML += `
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="close-checkin">稍后再检</button>
        <button class="btn btn-primary" id="approve-all">全部通过</button>
      </div>`;

    // Individual approve
    modal.querySelectorAll('.checkin-item-approve').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.checkin-item');
        const taskId = item.dataset.taskId;
        const note = item.querySelector('.checkin-note-input');
        const updates = { status: 'reviewed' };
        if (note && note.value.trim()) updates.notes = note.value.trim();
        Store.updateTask(taskId, updates);
        item.style.opacity = '0.3';
        btn.textContent = '✓ 已检';
        btn.disabled = true;
        showToast('✅ 已通过');
      });
    });

    // Approve all
    const approveAllBtn = modal.querySelector('#approve-all');
    if (approveAllBtn) approveAllBtn.addEventListener('click', () => {
      tasks.forEach(t => Store.updateTask(t.id, { status: 'reviewed' }));
      closeModal();
      render();
      showToast(`✅ ${tasks.length} 个任务已全部通过`);
    });

    const closeCheckinBtn = modal.querySelector('#close-checkin');
    if (closeCheckinBtn) closeCheckinBtn.addEventListener('click', () => { closeModal(); render(); });
  }

  // ======================================================================
  // MODALS
  // ======================================================================
  function openModal(html) {
    modal.classList.remove('hidden'); modalOverlay.classList.remove('hidden');
    modal.innerHTML = `<div class="modal-handle"></div>${html}`;
  }

  function closeModal() {
    modal.classList.add('hidden'); modalOverlay.classList.add('hidden'); modal.innerHTML = '';
  }

  modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ---- Add Agent ----
  function showAddAgentModal() {
    const grid = EMOJIS.map(e => `<button class="emoji-option" data-emoji="${e}">${e}</button>`).join('');
    openModal(`
      <div class="modal-title">🌱 种植新的 Agent</div>
      <div class="form-group">
        <label class="form-label">选择图标</label>
        <div class="emoji-grid">${grid}</div>
      </div>
      <div class="form-group">
        <label class="form-label" for="agent-name">名称</label>
        <input class="form-input" id="agent-name" type="text" placeholder="例如：代码审查官" autocomplete="off">
      </div>
      <div class="form-group">
        <label class="form-label" for="agent-desc">描述</label>
        <input class="form-input" id="agent-desc" type="text" placeholder="这个 Agent 负责什么工作" autocomplete="off">
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="cancel-add-agent">取消</button>
        <button class="btn btn-primary" id="confirm-add-agent">添加</button>
      </div>`);

    let selectedEmoji = EMOJIS[0];
    const emojiBtns = $$('.emoji-option');
    emojiBtns[0].classList.add('selected');
    emojiBtns.forEach(btn => btn.addEventListener('click', () => {
      emojiBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected'); selectedEmoji = btn.dataset.emoji;
    }));
    $('#cancel-add-agent').addEventListener('click', closeModal);
    $('#confirm-add-agent').addEventListener('click', () => {
      const name = $('#agent-name').value.trim();
      if (!name) { $('#agent-name').focus(); $('#agent-name').style.borderColor = '#ef4444'; return; }
      Store.addAgent({ name, emoji: selectedEmoji, description: $('#agent-desc').value.trim() });
      closeModal();
      if (currentView === 'dashboard') render(); else navigate('dashboard');
      showToast(`🌱 「${name}」已添加`);
    });
    setTimeout(() => $('#agent-name').focus(), 100);
  }

  // ---- Edit Agent ----
  function showEditAgentModal(agentId) {
    const agent = Store.getAgent(agentId);
    if (!agent) return;
    const grid = EMOJIS.map(e =>
      `<button class="emoji-option ${e === agent.emoji ? 'selected' : ''}" data-emoji="${e}">${e}</button>`).join('');
    openModal(`
      <div class="modal-title">✏️ 编辑 Agent</div>
      <div class="form-group">
        <label class="form-label">选择图标</label>
        <div class="emoji-grid">${grid}</div>
      </div>
      <div class="form-group">
        <label class="form-label" for="agent-name">名称</label>
        <input class="form-input" id="agent-name" type="text" value="${escHtml(agent.name)}" autocomplete="off">
      </div>
      <div class="form-group">
        <label class="form-label" for="agent-desc">描述</label>
        <input class="form-input" id="agent-desc" type="text" value="${escHtml(agent.description || '')}" autocomplete="off">
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="cancel-edit-agent">取消</button>
        <button class="btn btn-primary" id="confirm-edit-agent">保存</button>
      </div>`);

    let selectedEmoji = agent.emoji;
    $$('.emoji-option').forEach(btn => btn.addEventListener('click', () => {
      $$('.emoji-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected'); selectedEmoji = btn.dataset.emoji;
    }));
    $('#cancel-edit-agent').addEventListener('click', closeModal);
    $('#confirm-edit-agent').addEventListener('click', () => {
      const name = $('#agent-name').value.trim();
      if (!name) return;
      Store.updateAgent(agentId, { name, emoji: selectedEmoji, description: $('#agent-desc').value.trim() });
      closeModal(); render();
      showToast(`✏️ 「${name}」已更新`);
    });
  }

  // ---- Add Task (with check-in time) ----
  function showAddTaskModal(agentId) {
    const agent = Store.getAgent(agentId);
    const today = Store.todayStr();
    openModal(`
      <div class="modal-title">📋 添加任务</div>
      ${agent ? `<p style="text-align:center;color:var(--text-secondary);font-size:0.85rem;margin-bottom:var(--space-md);">${agent.emoji} ${escHtml(agent.name)}</p>` : ''}
      <div class="form-group">
        <label class="form-label" for="task-title">任务标题</label>
        <input class="form-input" id="task-title" type="text" placeholder="例如：审查 PR #42" autocomplete="off">
      </div>
      <div class="form-group">
        <label class="form-label" for="task-desc">详细描述</label>
        <textarea class="form-textarea" id="task-desc" placeholder="描述任务的具体要求..." rows="2"></textarea>
      </div>
      <div class="form-group" style="margin-bottom:var(--space-sm);">
        <label class="form-label">🤖 Agent 启动时间</label>
        <div class="form-row">
          <div class="form-group">
            <input class="form-input" id="task-date" type="date" value="${today}">
          </div>
          <div class="form-group">
            <input class="form-input" id="task-time" type="time" value="09:00">
          </div>
        </div>
      </div>
      <div class="form-group" style="background:var(--surface-hover);padding:var(--space-md);border-radius:var(--radius-sm);margin-bottom:var(--space-md);">
        <label class="form-label" style="color:var(--primary);">🔔 你的检验时间</label>
        <p style="font-size:0.75rem;color:var(--text-tertiary);margin-bottom:var(--space-sm);">设定你回来检查结果的时间。在这之前，放心做其他事。</p>
        <div class="form-row">
          <div class="form-group">
            <input class="form-input" id="checkin-date" type="date" value="${today}">
          </div>
          <div class="form-group">
            <input class="form-input" id="checkin-time" type="time" value="11:00">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="task-notes">备注</label>
        <textarea class="form-textarea" id="task-notes" placeholder="任何额外备注..." rows="2"></textarea>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="cancel-add-task">取消</button>
        <button class="btn btn-primary" id="confirm-add-task">添加</button>
      </div>`);

    // Auto-calculate check-in time based on start time
    const startTimeInput = $('#task-time');
    const checkinTimeInput = $('#checkin-time');
    const startDateInput = $('#task-date');
    const checkinDateInput = $('#checkin-date');

    startTimeInput.addEventListener('change', () => {
      const parts = startTimeInput.value.split(':');
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const ch = Math.min(h + 2, 23);
      checkinTimeInput.value = Store.formatTime(ch, m);
    });

    startDateInput.addEventListener('change', () => {
      checkinDateInput.value = startDateInput.value;
    });

    $('#cancel-add-task').addEventListener('click', closeModal);
    $('#confirm-add-task').addEventListener('click', () => {
      const title = $('#task-title').value.trim();
      if (!title) { $('#task-title').focus(); $('#task-title').style.borderColor = '#ef4444'; return; }
      Store.addTask({
        agentId, title,
        description: $('#task-desc').value.trim(),
        scheduledDate: startDateInput.value,
        scheduledTime: startTimeInput.value,
        checkinDate: checkinDateInput.value,
        checkinTime: checkinTimeInput.value,
        notes: $('#task-notes').value.trim()
      });
      closeModal(); render();
      showToast(`📋 任务「${title}」已添加`);
    });
    setTimeout(() => $('#task-title').focus(), 100);
  }

  // ---- Task Detail ----
  function showTaskDetailModal(taskId) {
    const task = Store.getTask(taskId);
    if (!task) return;
    const agent = Store.getAgent(task.agentId);
    const labels = { pending: '待办', running: '进行中', review: '待检验', reviewed: '已检验', cancelled: '已取消' };
    const icons = { pending: '⏳', running: '🔄', review: '🔔', reviewed: '✅', cancelled: '❌' };
    const flow = ['pending', 'running', 'review', 'reviewed'];

    openModal(`
      <div class="modal-title" style="font-size:1rem;">${escHtml(task.title)}</div>
      <div style="text-align:center;margin-bottom:var(--space-md);">
        <span style="font-size:0.85rem;color:var(--text-secondary);">${agent ? agent.emoji + ' ' + escHtml(agent.name) : ''}</span>
        <span style="margin:0 6px;color:var(--text-tertiary);">·</span>
        <span style="font-size:0.85rem;color:var(--text-secondary);">${task.scheduledDate || ''} ${task.scheduledTime || ''}</span>
      </div>

      ${task.description ? `<div style="padding:var(--space-md);background:var(--surface-hover);border-radius:var(--radius-sm);margin-bottom:var(--space-md);font-size:0.88rem;color:var(--text);">${escHtml(task.description)}</div>` : ''}

      <div class="task-detail-info">
        <div class="task-detail-row">
          <span>🤖 启动</span>
          <span>${task.scheduledDate || ''} ${task.scheduledTime || ''}</span>
        </div>
        <div class="task-detail-row highlight">
          <span>🔔 检验</span>
          <span>${task.checkinDate || ''} ${task.checkinTime || ''}</span>
        </div>
        <div class="task-detail-row">
          <span>🔄 迭代次数</span>
          <span>${task.iterationCount || 0} 次</span>
        </div>
      </div>

      ${task.iterationCount >= 2 ? `
      <div class="diminishing-notice" style="margin-bottom:var(--space-md);">
        📊 已迭代 ${task.iterationCount} 次，收益递减阶段。建议评估本次改进是否达到预期。
      </div>` : ''}

      <div class="form-group">
        <label class="form-label">状态</label>
        <div class="status-options">
          ${flow.map(s =>
            `<button class="status-btn ${task.status === s ? 'active' : ''}" data-status="${s}">${icons[s]} ${labels[s]}</button>`
          ).join('')}
          ${task.status === 'cancelled' ? `<button class="status-btn active" data-status="cancelled">❌ 已取消</button>` : `<button class="status-btn" data-status="cancelled">❌ 取消</button>`}
        </div>
      </div>

      ${task.notes ? `<div class="status-info">📝 ${escHtml(task.notes)}</div>` : ''}

      <div class="modal-actions">
        <button class="btn btn-secondary" id="close-task-detail">关闭</button>
      </div>`);

    $$('.status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.updateTask(taskId, { status: btn.dataset.status });
        closeModal(); render();
        showToast(`状态已更新为「${labels[btn.dataset.status] || btn.dataset.status}」`);
      });
    });
    $('#close-task-detail').addEventListener('click', closeModal);
  }

  // ======================================================================
  // TOAST
  // ======================================================================
  function showToast(message) {
    const container = $('#toasts') || (() => {
      const el = document.createElement('div'); el.id = 'toasts'; el.className = 'toasts';
      document.body.appendChild(el); return el;
    })();
    const toast = document.createElement('div'); toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0'; toast.style.transform = 'translateY(-12px)';
      toast.style.transition = 'opacity 300ms, transform 300ms';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ======================================================================
  // UTILS
  // ======================================================================
  function escHtml(str) {
    if (!str) return '';
    const div = document.createElement('div'); div.textContent = str; return div.innerHTML;
  }

  function formatTimeAgo(ts) {
    if (!ts) return '';
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    if (min < 1) return '刚刚';
    if (min < 60) return min + '分钟前';
    const h = Math.floor(min / 60);
    if (h < 24) return h + '小时前';
    return Math.floor(h / 24) + '天前';
  }

  // ======================================================================
  // THEME
  // ======================================================================
  function initTheme() {
    const settings = Store.getSettings();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = settings.theme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0c0a09' : '#2d6a4f';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    Store.updateSettings({ theme: next });
    if (themeToggle) themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === 'dark' ? '#0c0a09' : '#2d6a4f';
    showToast(next === 'dark' ? '🌙 暗色模式' : '☀️ 亮色模式');
  }

  // ======================================================================
  // INIT
  // ======================================================================
  function init() {
    initTheme();

    if (!Store.hasData()) Store.loadDemo();

    window.addEventListener('hashchange', handleHashChange);

    if (window.location.hash) {
      handleHashChange();
    } else {
      window.location.hash = '#dashboard';
      render();
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    fab.addEventListener('click', () => {
      if (currentView === 'dashboard') showAddAgentModal();
      else if (currentView === 'agent' && currentAgentId) showAddTaskModal(currentAgentId);
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
