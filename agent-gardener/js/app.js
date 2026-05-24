(function() {
  'use strict';

  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));

  const EMOJIS = [
    '🤖', '🔍', '✍️', '📊', '🎨', '🧪', '📝', '🔧',
    '🚀', '💡', '📈', '🎯', '🛠️', '📋', '⚡', '🧠',
    '🎭', '🎪', '🎬', '📸', '🎵', '🎮', '🌐', '📱'
  ];

  // ---- State ----
  let currentView = 'dashboard';
  let currentAgentId = null;
  let scheduleDate = Store.getDateStr(new Date());

  // ---- DOM refs ----
  const viewContainer = $('#view-container');
  const modalOverlay = $('#modal-overlay');
  const modal = $('#modal');
  const fab = $('#fab');
  const themeToggle = $('#theme-toggle');
  const headerTitle = $('.header-title');

  // ---- Navigation ----
  function navigate(view, data) {
    if (view === 'dashboard') {
      currentView = 'dashboard';
      currentAgentId = null;
      window.location.hash = '#dashboard';
    } else if (view === 'agent') {
      currentView = 'agent';
      currentAgentId = data;
      window.location.hash = '#agent-' + data;
    } else if (view === 'schedule') {
      currentView = 'schedule';
      currentAgentId = null;
      window.location.hash = '#schedule';
    }
    render();
  }

  function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    if (hash === 'dashboard') {
      currentView = 'dashboard';
      currentAgentId = null;
    } else if (hash.startsWith('agent-')) {
      currentView = 'agent';
      currentAgentId = hash.replace('agent-', '');
    } else if (hash === 'schedule') {
      currentView = 'schedule';
      currentAgentId = null;
    } else {
      currentView = 'dashboard';
      currentAgentId = null;
      window.location.hash = '#dashboard';
    }
    render();
  }

  // ---- Render ----
  function render() {
    updateNavHighlight();
    updateFab();
    updateHeader();

    viewContainer.style.animation = 'none';
    void viewContainer.offsetHeight;
    viewContainer.style.animation = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (currentView) {
      case 'dashboard': renderDashboard(); break;
      case 'agent': renderAgentDetail(currentAgentId); break;
      case 'schedule': renderSchedule(); break;
      default: renderDashboard();
    }
  }

  function updateNavHighlight() {
    $$('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === currentView);
    });
  }

  function updateFab() {
    if (currentView === 'dashboard') {
      fab.style.display = 'flex';
      fab.innerHTML = '<span>+</span>';
    } else if (currentView === 'agent' && currentAgentId) {
      fab.style.display = 'flex';
      fab.innerHTML = '<span>+</span>';
    } else {
      fab.style.display = 'none';
    }
  }

  function updateHeader() {
    if (currentView === 'dashboard') {
      headerTitle.textContent = 'Agent Gardener';
    } else if (currentView === 'agent') {
      const agent = Store.getAgent(currentAgentId);
      if (agent) {
        headerTitle.textContent = agent.emoji + ' ' + agent.name;
      } else {
        headerTitle.textContent = 'Agent';
      }
    } else if (currentView === 'schedule') {
      headerTitle.textContent = '📅 日程';
    }
  }

  // ---- Dashboard ----
  function renderDashboard() {
    const agents = Store.getAgents();

    if (agents.length === 0) {
      viewContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🌱</div>
          <h2>你的花园还是空的</h2>
          <p>添加你的第一个 Agent，开始高效管理工作流。<br>"其莳也若子，其置也若弃"</p>
          <button class="btn btn-primary" id="add-first-agent">添加第一个 Agent</button>
        </div>
      `;
      $('#add-first-agent').addEventListener('click', () => showAddAgentModal());
      return;
    }

    let html = `<div class="agents-grid">`;
    agents.forEach(agent => {
      const counts = Store.getTaskCounts(agent.id);
      const next = Store.getNextTaskTime(agent.id);
      let nextStr = '';
      if (next) {
        const isToday = next.date === Store.todayStr();
        nextStr = isToday ? next.time : next.date.slice(5) + ' ' + next.time;
      }
      html += `
        <div class="agent-card" data-agent-id="${agent.id}">
          <div class="agent-card-header">
            <div class="agent-card-emoji">${agent.emoji}</div>
            <div class="agent-card-info">
              <div class="agent-card-name">${escHtml(agent.name)}</div>
              <div class="agent-card-desc">${escHtml(agent.description || '无描述')}</div>
            </div>
          </div>
          <div class="agent-card-stats">
            <span class="stat">
              <span class="stat-dot pending"></span>
              ${counts.pending} 待办
            </span>
            <span class="stat">
              <span class="stat-dot running"></span>
              ${counts.running} 进行中
            </span>
            <span class="stat">
              <span class="stat-dot completed"></span>
              ${counts.completed} 已完成
            </span>
          </div>
          ${next ? `<div style="margin-top:8px;font-size:0.75rem;color:var(--text-tertiary);">下次: ${nextStr}</div>` : ''}
        </div>
      `;
    });
    html += `</div>`;
    viewContainer.innerHTML = html;

    $$('.agent-card').forEach(el => {
      el.addEventListener('click', () => {
        navigate('agent', el.dataset.agentId);
      });
    });
  }

  // ---- Agent Detail ----
  function renderAgentDetail(agentId) {
    const agent = Store.getAgent(agentId);
    if (!agent) {
      navigate('dashboard');
      return;
    }

    const counts = Store.getTaskCounts(agent.id);
    const tasks = Store.getTasksByAgent(agent.id);

    let html = `
      <div class="detail-header">
        <div class="detail-emoji">${agent.emoji}</div>
        <div class="detail-info">
          <div class="detail-name">${escHtml(agent.name)}</div>
          <div class="detail-desc">${escHtml(agent.description || '无描述')}</div>
        </div>
        <div class="detail-actions">
          <button class="btn btn-sm btn-secondary" id="edit-agent-btn" aria-label="编辑">✏️</button>
          <button class="btn btn-sm btn-danger" id="delete-agent-btn" aria-label="删除">🗑️</button>
        </div>
      </div>

      <div class="agent-card-stats" style="padding:0 0 var(--space-md);border:none;">
        <span class="stat"><span class="stat-dot pending"></span>${counts.pending} 待办</span>
        <span class="stat"><span class="stat-dot running"></span>${counts.running} 进行中</span>
        <span class="stat"><span class="stat-dot completed"></span>${counts.completed} 已完成</span>
        <span class="stat">📊 ${counts.total} 总计</span>
      </div>
    `;

    // Group tasks by date
    const grouped = {};
    tasks.forEach(t => {
      const date = t.scheduledDate || '未安排';
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(t);
    });

    const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    const today = Store.todayStr();

    if (dates.length === 0) {
      html += `
        <div class="empty-state" style="min-height:auto;padding:var(--space-2xl) 0;">
          <div style="font-size:3rem;margin-bottom:var(--space-md);">📋</div>
          <p style="color:var(--text-secondary);">还没有任务，点击下方按钮添加</p>
        </div>
      `;
    } else {
      html += `<div class="task-list">`;
      dates.forEach(date => {
        const label = date === today ? '今天' :
          date < today ? date.slice(5) + ' (已过期)' : date.slice(5);
        html += `
          <div class="section-header" style="padding-top:${date !== dates[0] ? 'var(--space-md)' : '0'}">
            <span class="section-title">${label}</span>
          </div>
        `;
        grouped[date].forEach(task => {
          html += renderTaskItem(task);
        });
      });
      html += `</div>`;
    }

    viewContainer.innerHTML = html;

    // Event listeners
    const edBtn = $('#edit-agent-btn');
    const delBtn = $('#delete-agent-btn');
    if (edBtn) edBtn.addEventListener('click', () => showEditAgentModal(agent.id));
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        if (confirm(`确定要删除 Agent「${agent.name}」及其所有任务吗？`)) {
          Store.deleteAgent(agent.id);
          navigate('dashboard');
        }
      });
    }

    setupTaskEvents();
  }

  function renderTaskItem(task) {
    const statusLabels = { pending: '待办', running: '进行中', completed: '已完成', cancelled: '已取消' };
    const statusIcons = { pending: '⏳', running: '🔄', completed: '✅', cancelled: '❌' };
    const timeDisplay = task.scheduledTime || '';
    let descHtml = task.description ? `<div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px;">${escHtml(task.description)}</div>` : '';
    return `
      <div class="task-item ${task.status}" data-task-id="${task.id}">
        <div class="task-check" data-action="toggle-status">${task.status === 'completed' ? '✓' : ''}</div>
        <div class="task-body">
          <div class="task-title">${escHtml(task.title)}</div>
          ${descHtml}
          <div class="task-meta">
            <span class="task-time">🕐 ${timeDisplay}</span>
            <span class="task-status-badge ${task.status}">${statusIcons[task.status] || '⏳'} ${statusLabels[task.status] || task.status}</span>
          </div>
        </div>
        <button class="task-delete-btn" data-action="delete-task" aria-label="删除任务">✕</button>
      </div>
    `;
  }

  function setupTaskEvents() {
    // Toggle task status
    viewContainer.querySelectorAll('.task-check').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskItem = el.closest('.task-item');
        const taskId = taskItem.dataset.taskId;
        const task = Store.getTask(taskId);
        if (!task) return;

        let nextStatus;
        switch (task.status) {
          case 'pending': nextStatus = 'running'; break;
          case 'running': nextStatus = 'completed'; break;
          case 'completed': nextStatus = 'pending'; break;
          default: nextStatus = 'pending';
        }

        Store.updateTask(taskId, { status: nextStatus });
        render();
        showToast(nextStatus === 'completed' ? '✅ 任务已完成' :
                  nextStatus === 'running' ? '🔄 任务已开始' : '⏳ 任务已重置');
      });
    });

    // Open task detail
    viewContainer.querySelectorAll('.task-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.task-check') || e.target.closest('.task-delete-btn')) return;
        showTaskDetailModal(el.dataset.taskId);
      });
    });

    // Delete task
    viewContainer.querySelectorAll('.task-delete-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = el.closest('.task-item').dataset.taskId;
        if (confirm('确定要删除这个任务吗？')) {
          Store.deleteTask(taskId);
          render();
          showToast('🗑️ 任务已删除');
        }
      });
    });
  }

  // ---- Schedule View ----
  function renderSchedule() {
    const date = new Date(scheduleDate + 'T12:00:00');
    const today = Store.todayStr();
    const isToday = scheduleDate === today;

    const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    const dateLabel = isToday ? '今天' :
      date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });

    let html = `
      <div class="schedule-header">
        <div class="schedule-date-nav">
          <button id="prev-date" aria-label="前一天">‹</button>
          <span class="schedule-date-label">${dateLabel} 周${weekday}</span>
          <button id="next-date" aria-label="后一天">›</button>
          ${!isToday ? `<button id="today-btn" class="btn btn-sm btn-secondary" style="margin-left:8px;">今天</button>` : ''}
        </div>
      </div>
      <div class="schedule-timeline" id="schedule-timeline">
    `;

    const tasks = Store.getTasksByDate(scheduleDate);
    const agents = Store.getAgents();
    const agentMap = {};
    const agentColors = ['#2d6a4f', '#e07a5f', '#3d85c6', '#b5838d', '#6b705c', '#e6b8a8', '#7b9e8c', '#c9a96e'];
    agents.forEach((a, i) => { agentMap[a.id] = a; a._color = agentColors[i % agentColors.length]; });

    if (tasks.length === 0) {
      html += `
        <div class="schedule-empty">
          <div style="font-size:3rem;margin-bottom:var(--space-md);">🌿</div>
          <p>今天没有安排任何任务</p>
          <p style="font-size:0.8rem;color:var(--text-tertiary);margin-top:4px;">享受宁静的一天</p>
        </div>
      `;
    } else {
      const hourTasks = {};
      for (let h = 0; h < 24; h++) {
        hourTasks[h] = [];
      }
      tasks.forEach(task => {
        const time = task.scheduledTime || '09:00';
        const hour = parseInt(time.split(':')[0], 10);
        if (hourTasks[hour]) hourTasks[hour].push(task);
      });

      for (let h = 0; h < 24; h++) {
        const slotTasks = hourTasks[h];
        const label = h === 0 ? '00:00' : Store.formatTime(h, 0);

        html += `<div class="schedule-hour" data-hour="${h}">`;
        html += `<div class="schedule-hour-label">${label}</div>`;
        html += `<div class="schedule-tasks">`;

        slotTasks.forEach(task => {
          const ag = agentMap[task.agentId];
          const statusIcons = { pending: '⏳', running: '🔄', completed: '✅', cancelled: '❌' };
          const dotColor = task.status === 'completed' ? 'var(--primary)' :
            task.status === 'running' ? (ag ? ag._color : 'var(--primary-light)') :
            (ag ? ag._color : 'var(--accent)');
          html += `
            <div class="schedule-task ${task.status}" data-task-id="${task.id}" data-agent-id="${task.agentId}">
              <span class="schedule-task-dot" style="background:${dotColor}"></span>
              <div class="schedule-task-body">
                <div class="schedule-task-title">${statusIcons[task.status] || ''} ${escHtml(task.title)}</div>
                <div class="schedule-task-agent">${ag ? ag.emoji + ' ' + escHtml(ag.name) : '未知 Agent'}</div>
              </div>
              <span class="schedule-task-time">${task.scheduledTime || ''}</span>
            </div>
          `;
        });

        html += `</div></div>`;
      }
    }

    html += `</div>`;

    viewContainer.innerHTML = html;

    if (isToday) {
      const nowH = new Date().getHours();
      const hourEl = viewContainer.querySelector(`.schedule-hour[data-hour="${nowH}"]`);
      if (hourEl) {
        const label = hourEl.querySelector('.schedule-hour-label');
        if (label) label.classList.add('current');
      }
    }

    // Event listeners
    const prevBtn = $('#prev-date');
    const nextBtn = $('#next-date');
    const todayBtn = $('#today-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => {
      const d = new Date(scheduleDate + 'T12:00:00');
      d.setDate(d.getDate() - 1);
      scheduleDate = Store.getDateStr(d);
      renderSchedule();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
      const d = new Date(scheduleDate + 'T12:00:00');
      d.setDate(d.getDate() + 1);
      scheduleDate = Store.getDateStr(d);
      renderSchedule();
    });

    if (todayBtn) todayBtn.addEventListener('click', () => {
      scheduleDate = Store.todayStr();
      renderSchedule();
    });

    // Click on schedule task
    viewContainer.querySelectorAll('.schedule-task').forEach(el => {
      el.addEventListener('click', () => {
        const taskId = el.dataset.taskId;
        const agentId = el.dataset.agentId;
        if (taskId) {
          showTaskDetailModal(taskId);
        }
      });
    });
  }

  // ---- Modals ----

  function openModal(html) {
    modal.classList.remove('hidden');
    modalOverlay.classList.remove('hidden');
    modal.innerHTML = `
      <div class="modal-handle"></div>
      ${html}
    `;
  }

  function closeModal() {
    modal.classList.add('hidden');
    modalOverlay.classList.add('hidden');
    modal.innerHTML = '';
  }

  modalOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ---- Add Agent Modal ----
  function showAddAgentModal() {
    const emojiGrid = EMOJIS.map(e =>
      `<button class="emoji-option" data-emoji="${e}">${e}</button>`
    ).join('');

    openModal(`
      <div class="modal-title">🌱 种植新的 Agent</div>
      <div class="form-group">
        <label class="form-label">选择图标</label>
        <div class="emoji-grid" id="emoji-grid">${emojiGrid}</div>
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
      </div>
    `);

    let selectedEmoji = EMOJIS[0];
    const emojiBtns = $$('.emoji-option');
    emojiBtns[0].classList.add('selected');

    emojiBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        emojiBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedEmoji = btn.dataset.emoji;
      });
    });

    $('#cancel-add-agent').addEventListener('click', closeModal);

    $('#confirm-add-agent').addEventListener('click', () => {
      const name = $('#agent-name').value.trim();
      const desc = $('#agent-desc').value.trim();
      if (!name) {
        $('#agent-name').focus();
        $('#agent-name').style.borderColor = '#ef4444';
        return;
      }
      Store.addAgent({ name, emoji: selectedEmoji, description: desc });
      closeModal();
      if (currentView === 'dashboard') render();
      else navigate('dashboard');
      showToast(`🌱 Agent「${name}」已添加`);
    });

    $('#agent-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') $('#confirm-add-agent').click();
    });

    setTimeout(() => $('#agent-name').focus(), 100);
  }

  // ---- Edit Agent Modal ----
  function showEditAgentModal(agentId) {
    const agent = Store.getAgent(agentId);
    if (!agent) return;

    const emojiGrid = EMOJIS.map(e =>
      `<button class="emoji-option ${e === agent.emoji ? 'selected' : ''}" data-emoji="${e}">${e}</button>`
    ).join('');

    openModal(`
      <div class="modal-title">✏️ 编辑 Agent</div>
      <div class="form-group">
        <label class="form-label">选择图标</label>
        <div class="emoji-grid" id="emoji-grid">${emojiGrid}</div>
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
      </div>
    `);

    let selectedEmoji = agent.emoji;
    $$('.emoji-option').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.emoji-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedEmoji = btn.dataset.emoji;
      });
    });

    $('#cancel-edit-agent').addEventListener('click', closeModal);

    $('#confirm-edit-agent').addEventListener('click', () => {
      const name = $('#agent-name').value.trim();
      if (!name) return;
      Store.updateAgent(agentId, { name, emoji: selectedEmoji, description: $('#agent-desc').value.trim() });
      closeModal();
      render();
      showToast(`✏️ Agent「${name}」已更新`);
    });
  }

  // ---- Add Task Modal ----
  function showAddTaskModal(agentId) {
    const agent = Store.getAgent(agentId);
    const today = Store.todayStr();

    openModal(`
      <div class="modal-title">📋 添加任务</div>
      ${agent ? `<p style="text-align:center;color:var(--text-secondary);font-size:0.85rem;margin-bottom:var(--space-lg);">${agent.emoji} ${escHtml(agent.name)}</p>` : ''}
      <div class="form-group">
        <label class="form-label" for="task-title">任务标题</label>
        <input class="form-input" id="task-title" type="text" placeholder="例如：审查 PR #42" autocomplete="off">
      </div>
      <div class="form-group">
        <label class="form-label" for="task-desc">详细描述</label>
        <textarea class="form-textarea" id="task-desc" placeholder="描述任务的具体要求..." rows="3"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="task-date">日期</label>
          <input class="form-input" id="task-date" type="date" value="${today}">
        </div>
        <div class="form-group">
          <label class="form-label" for="task-time">时间</label>
          <input class="form-input" id="task-time" type="time" value="09:00">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="task-notes">备注</label>
        <textarea class="form-textarea" id="task-notes" placeholder="任何额外备注..." rows="2"></textarea>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="cancel-add-task">取消</button>
        <button class="btn btn-primary" id="confirm-add-task">添加</button>
      </div>
    `);

    $('#cancel-add-task').addEventListener('click', closeModal);

    $('#confirm-add-task').addEventListener('click', () => {
      const title = $('#task-title').value.trim();
      if (!title) {
        $('#task-title').focus();
        $('#task-title').style.borderColor = '#ef4444';
        return;
      }
      Store.addTask({
        agentId,
        title,
        description: $('#task-desc').value.trim(),
        scheduledDate: $('#task-date').value,
        scheduledTime: $('#task-time').value,
        notes: $('#task-notes').value.trim()
      });
      closeModal();
      render();
      showToast(`📋 任务「${title}」已添加`);
    });

    $('#task-title').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        $('#task-desc').focus();
      }
    });

    setTimeout(() => $('#task-title').focus(), 100);
  }

  // ---- Task Detail Modal ----
  function showTaskDetailModal(taskId) {
    const task = Store.getTask(taskId);
    if (!task) return;

    const agent = Store.getAgent(task.agentId);
    const statusLabels = { pending: '待办', running: '进行中', completed: '已完成', cancelled: '已取消' };
    const statusIcons = { pending: '⏳', running: '🔄', completed: '✅', cancelled: '❌' };

    openModal(`
      <div class="modal-title" style="font-size:1rem;">${escHtml(task.title)}</div>
      <div style="text-align:center;margin-bottom:var(--space-lg);">
        <span style="font-size:0.85rem;color:var(--text-secondary);">
          ${agent ? agent.emoji + ' ' + escHtml(agent.name) : '未知 Agent'}
        </span>
        <span style="margin:0 8px;color:var(--text-tertiary);">·</span>
        <span style="font-size:0.85rem;color:var(--text-secondary);">${task.scheduledDate || ''} ${task.scheduledTime || ''}</span>
      </div>

      ${task.description ? `<div style="padding:var(--space-md);background:var(--surface-hover);border-radius:var(--radius-sm);margin-bottom:var(--space-lg);font-size:0.88rem;line-height:1.7;color:var(--text);">${escHtml(task.description)}</div>` : ''}

      <div class="form-group">
        <label class="form-label">当前状态</label>
        <div class="status-options">
          ${['pending', 'running', 'completed', 'cancelled'].map(s =>
            `<button class="status-btn ${task.status === s ? 'active' : ''}" data-status="${s}">${statusIcons[s]} ${statusLabels[s]}</button>`
          ).join('')}
        </div>
      </div>

      ${task.notes ? `<div class="status-info">📝 ${escHtml(task.notes)}</div>` : ''}

      <div class="modal-actions">
        <button class="btn btn-secondary" id="close-task-detail">关闭</button>
      </div>
    `);

    $$('.status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const newStatus = btn.dataset.status;
        Store.updateTask(taskId, { status: newStatus });
        closeModal();
        render();
        showToast(`${statusIcons[newStatus]} 状态已更新为「${statusLabels[newStatus]}」`);
      });
    });

    $('#close-task-detail').addEventListener('click', closeModal);
  }

  // ---- Toast ----
  function showToast(message) {
    const container = $('#toasts') || (() => {
      const el = document.createElement('div');
      el.id = 'toasts';
      el.className = 'toasts';
      document.body.appendChild(el);
      return el;
    })();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-12px)';
      toast.style.transition = 'opacity 300ms, transform 300ms';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ---- Utils ----
  function escHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Theme ----
  function initTheme() {
    const settings = Store.getSettings();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = settings.theme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggle(theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0c0a09' : '#2d6a4f';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    Store.updateSettings({ theme: next });
    updateThemeToggle(next);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === 'dark' ? '#0c0a09' : '#2d6a4f';
    showToast(next === 'dark' ? '🌙 已切换暗色模式' : '☀️ 已切换亮色模式');
  }

  function updateThemeToggle(theme) {
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // ---- Init ----
  function init() {
    initTheme();

    if (!Store.hasData()) {
      Store.loadDemo();
    }

    window.addEventListener('hashchange', handleHashChange);

    if (window.location.hash) {
      handleHashChange();
    } else {
      window.location.hash = '#dashboard';
      render();
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }

    fab.addEventListener('click', () => {
      if (currentView === 'dashboard') {
        showAddAgentModal();
      } else if (currentView === 'agent' && currentAgentId) {
        showAddTaskModal(currentAgentId);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
