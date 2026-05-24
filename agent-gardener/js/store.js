const Store = (() => {
  const STORAGE_KEY = 'agent_gardener_v2';

  const defaults = {
    agents: [],
    tasks: [],
    settings: { theme: 'light' }
  };

  let data = null;
  let listeners = [];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        data = JSON.parse(raw);
        data.agents = data.agents || [];
        data.tasks = data.tasks || [];
        data.settings = Object.assign({}, defaults.settings, data.settings || {});
      } else {
        data = JSON.parse(JSON.stringify(defaults));
      }
    } catch {
      data = JSON.parse(JSON.stringify(defaults));
    }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }

  function notify() { listeners.forEach(fn => fn()); }

  function subscribe(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter(f => f !== fn); };
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function getDateStr(d) {
    d = d || new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function todayStr() { return getDateStr(new Date()); }

  function formatTime(h, m) {
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  function compareTime(a, b) {
    if (!a) return 1; if (!b) return -1; return a.localeCompare(b);
  }

  function nowISO() {
    const d = new Date();
    return getDateStr(d) + 'T' + formatTime(d.getHours(), d.getMinutes());
  }

  // ---- Agent CRUD ----
  function getAgents() {
    return [...data.agents].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  function getAgent(id) {
    return data.agents.find(a => a.id === id);
  }

  function addAgent({ name, emoji, description }) {
    const agent = {
      id: generateId(),
      name: name.trim(),
      emoji: emoji || '🤖',
      description: (description || '').trim(),
      createdAt: Date.now(),
      sortOrder: data.agents.length
    };
    data.agents.push(agent);
    save(); notify();
    return agent;
  }

  function updateAgent(id, updates) {
    const idx = data.agents.findIndex(a => a.id === id);
    if (idx === -1) return null;
    Object.assign(data.agents[idx], updates);
    save(); notify();
    return data.agents[idx];
  }

  function deleteAgent(id) {
    data.agents = data.agents.filter(a => a.id !== id);
    data.tasks = data.tasks.filter(t => t.agentId !== id);
    save(); notify();
  }

  // ---- Task CRUD ----
  const STATUS_FLOW = ['pending', 'running', 'review', 'reviewed', 'cancelled'];

  function getTasks(opts = {}) {
    let tasks = [...data.tasks];
    if (opts.agentId) tasks = tasks.filter(t => t.agentId === opts.agentId);
    if (opts.date) tasks = tasks.filter(t => t.scheduledDate === opts.date);
    if (opts.checkinDate) tasks = tasks.filter(t => t.checkinDate === opts.checkinDate);
    if (opts.status) tasks = tasks.filter(t => t.status === opts.status);
    if (opts.statusIn) tasks = tasks.filter(t => opts.statusIn.includes(t.status));
    if (opts.needsReview) tasks = tasks.filter(t => t.status === 'review');

    tasks.sort((a, b) => {
      const tc = compareTime(a.scheduledTime, b.scheduledTime);
      if (tc !== 0) return tc;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
    return tasks;
  }

  function getTask(id) { return data.tasks.find(t => t.id === id); }

  function addTask({ agentId, title, description, scheduledDate, scheduledTime,
                     checkinDate, checkinTime, notes }) {
    const now = todayStr();
    const task = {
      id: generateId(),
      agentId,
      title: title.trim(),
      description: (description || '').trim(),
      scheduledDate: scheduledDate || now,
      scheduledTime: scheduledTime || '09:00',
      checkinDate: checkinDate || scheduledDate || now,
      checkinTime: checkinTime || (() => {
        const h = parseInt((scheduledTime || '09:00').split(':')[0], 10) + 2;
        return formatTime(Math.min(h, 23), 0);
      })(),
      status: 'pending',
      iterationCount: 0,
      notes: (notes || '').trim(),
      createdAt: Date.now(),
      completedAt: null
    };
    data.tasks.push(task);
    save(); notify();
    return task;
  }

  function updateTask(id, updates) {
    const idx = data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const task = data.tasks[idx];
    if (updates.status && updates.status !== task.status) {
      if (updates.status === 'review' && task.status !== 'review') {
        updates.completedAt = Date.now();
      }
      if (updates.status === 'running') {
        updates.iterationCount = (task.iterationCount || 0) + 1;
      }
      if (updates.status === 'reviewed') {
        updates.reviewedAt = Date.now();
      }
    }

    Object.assign(task, updates);
    save(); notify();
    return task;
  }

  function deleteTask(id) {
    data.tasks = data.tasks.filter(t => t.id !== id);
    save(); notify();
  }

  function getTaskCounts(agentId) {
    const tasks = agentId ? data.tasks.filter(t => t.agentId === agentId) : data.tasks;
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      running: tasks.filter(t => t.status === 'running').length,
      review: tasks.filter(t => t.status === 'review').length,
      reviewed: tasks.filter(t => t.status === 'reviewed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length
    };
  }

  function getNeedsReview() {
    return data.tasks.filter(t => t.status === 'review')
      .sort((a, b) => compareTime(a.checkinTime, b.checkinTime));
  }

  function getNextCheckin() {
    const now = nowISO();
    const todaysTasks = data.tasks.filter(t => {
      if (t.status !== 'running' && t.status !== 'pending') return false;
      const checkinISO = t.checkinDate + 'T' + (t.checkinTime || '12:00');
      return checkinISO > now;
    });
    if (todaysTasks.length === 0) return null;
    todaysTasks.sort((a, b) => {
      const aISO = a.checkinDate + 'T' + (a.checkinTime || '12:00');
      const bISO = b.checkinDate + 'T' + (b.checkinTime || '12:00');
      return aISO.localeCompare(bISO);
    });
    const next = todaysTasks[0];
    return {
      date: next.checkinDate,
      time: next.checkinTime,
      taskId: next.id,
      agentId: next.agentId,
      title: next.title
    };
  }

  function getPendingReviewCount() {
    return data.tasks.filter(t => t.status === 'review').length;
  }

  function getDueCheckins() {
    const now = nowISO();
    return data.tasks.filter(t => {
      if (t.status !== 'running' && t.status !== 'pending') return false;
      const checkISO = t.checkinDate + 'T' + (t.checkinTime || '12:00');
      return checkISO <= now;
    });
  }

  function hasDueCheckins() {
    return getDueCheckins().length > 0 || getPendingReviewCount() > 0;
  }

  // ---- Settings ----
  function getSettings() { return { ...data.settings }; }

  function updateSettings(updates) {
    Object.assign(data.settings, updates);
    save(); notify();
    return data.settings;
  }

  // ---- Demo Data ----
  function hasData() { return data.agents.length > 0 || data.tasks.length > 0; }

  function loadDemo() {
    if (hasData()) return;
    const today = todayStr();

    const a1 = addAgent({ name: '代码审查官', emoji: '🔍', description: '审查 PR、代码质量反馈' });
    const a2 = addAgent({ name: '内容创作师', emoji: '✍️', description: '撰写博客文章和技术文档' });
    const a3 = addAgent({ name: '数据分析师', emoji: '📊', description: '分析指标、生成报告' });

    const t1 = addTask({ agentId: a1.id, title: '审查 PR #127 - 新功能实现', scheduledDate: today, scheduledTime: '09:00', checkinDate: today, checkinTime: '11:00' });
    const t2 = addTask({ agentId: a1.id, title: '审查 PR #128 - Bug 修复', scheduledDate: today, scheduledTime: '14:00', checkinDate: today, checkinTime: '16:00' });
    const t3 = addTask({ agentId: a2.id, title: '撰写月度技术总结', scheduledDate: today, scheduledTime: '10:00', checkinDate: today, checkinTime: '12:00' });
    const t4 = addTask({ agentId: a3.id, title: '生成 Q2 用户增长报告', scheduledDate: today, scheduledTime: '13:30', checkinDate: today, checkinTime: '15:30' });
    const t5 = addTask({ agentId: a2.id, title: '编辑 API 文档 V3', scheduledDate: today, scheduledTime: '15:00', checkinDate: today, checkinTime: '17:00' });

    // Set different statuses to demonstrate workflow
    updateTask(t2.id, { status: 'running' });
    updateTask(t4.id, { status: 'review' });
    updateTask(t5.id, { status: 'reviewed' });
  }

  load();

  return {
    subscribe, getAgents, getAgent, addAgent, updateAgent, deleteAgent,
    getTasks, getTask, addTask, updateTask, deleteTask,
    getTaskCounts, getNeedsReview, getNextCheckin, getPendingReviewCount,
    getDueCheckins, hasDueCheckins,
    getSettings, updateSettings,
    getDateStr, todayStr, formatTime, nowISO,
    STATUS_FLOW, hasData, loadDemo
  };
})();
