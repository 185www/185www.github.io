const Store = (() => {
  const STORAGE_KEY = 'agent_gardener';

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }

  function notify() {
    listeners.forEach(fn => fn());
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter(f => f !== fn); };
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function getDateStr(date) {
    const d = date || new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function todayStr() {
    return getDateStr(new Date());
  }

  function getToday() {
    return new Date();
  }

  function formatTime(h, m) {
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  function getTimeFromStr(s) {
    if (!s) return null;
    const [h, m] = s.split(':').map(Number);
    return { h, m };
  }

  function compareTime(a, b) {
    if (!a) return 1;
    if (!b) return -1;
    return a.localeCompare(b);
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
    save();
    notify();
    return agent;
  }

  function updateAgent(id, updates) {
    const idx = data.agents.findIndex(a => a.id === id);
    if (idx === -1) return null;
    Object.assign(data.agents[idx], updates);
    save();
    notify();
    return data.agents[idx];
  }

  function deleteAgent(id) {
    data.agents = data.agents.filter(a => a.id !== id);
    data.tasks = data.tasks.filter(t => t.agentId !== id);
    save();
    notify();
  }

  // ---- Task CRUD ----

  function getTasks(opts = {}) {
    let tasks = [...data.tasks];

    if (opts.agentId) {
      tasks = tasks.filter(t => t.agentId === opts.agentId);
    }

    if (opts.date) {
      tasks = tasks.filter(t => t.scheduledDate === opts.date);
    }

    if (opts.status) {
      tasks = tasks.filter(t => t.status === opts.status);
    }

    tasks.sort((a, b) => {
      const timeCmp = compareTime(a.scheduledTime, b.scheduledTime);
      if (timeCmp !== 0) return timeCmp;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    return tasks;
  }

  function getTasksByAgent(agentId) {
    return getTasks({ agentId });
  }

  function getTasksByDate(date) {
    return getTasks({ date });
  }

  function getTask(id) {
    return data.tasks.find(t => t.id === id);
  }

  function addTask({ agentId, title, description, scheduledTime, scheduledDate, notes }) {
    const task = {
      id: generateId(),
      agentId,
      title: title.trim(),
      description: (description || '').trim(),
      scheduledTime: scheduledTime || '09:00',
      scheduledDate: scheduledDate || todayStr(),
      status: 'pending',
      notes: (notes || '').trim(),
      createdAt: Date.now(),
      completedAt: null
    };
    data.tasks.push(task);
    save();
    notify();
    return task;
  }

  function updateTask(id, updates) {
    const idx = data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;

    if (updates.status === 'completed' && data.tasks[idx].status !== 'completed') {
      updates.completedAt = Date.now();
    }
    if (updates.status && updates.status !== 'completed') {
      updates.completedAt = null;
    }

    Object.assign(data.tasks[idx], updates);
    save();
    notify();
    return data.tasks[idx];
  }

  function deleteTask(id) {
    data.tasks = data.tasks.filter(t => t.id !== id);
    save();
    notify();
  }

  function getTaskCounts(agentId) {
    const tasks = data.tasks.filter(t => t.agentId === agentId);
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      running: tasks.filter(t => t.status === 'running').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length
    };
  }

  function getNextTaskTime(agentId) {
    const today = todayStr();
    const tasks = data.tasks
      .filter(t => t.agentId === agentId && t.scheduledDate >= today && t.status === 'pending')
      .sort((a, b) => {
        if (a.scheduledDate !== b.scheduledDate) return a.scheduledDate.localeCompare(b.scheduledDate);
        return compareTime(a.scheduledTime, b.scheduledTime);
      });
    if (tasks.length === 0) return null;
    return { date: tasks[0].scheduledDate, time: tasks[0].scheduledTime };
  }

  // ---- Settings ----

  function getSettings() {
    return { ...data.settings };
  }

  function updateSettings(updates) {
    Object.assign(data.settings, updates);
    save();
    notify();
    return data.settings;
  }

  // ---- Demo Data ----

  function hasData() {
    return data.agents.length > 0 || data.tasks.length > 0;
  }

  function loadDemo() {
    if (hasData()) return;

    const agent1 = addAgent({
      name: '代码审查官',
      emoji: '🔍',
      description: 'Reviewing PRs and providing code feedback'
    });

    const agent2 = addAgent({
      name: '内容创作师',
      emoji: '✍️',
      description: 'Writing blog posts and documentation'
    });

    const agent3 = addAgent({
      name: '数据分析师',
      emoji: '📊',
      description: 'Analyzing metrics and generating reports'
    });

    const today = todayStr();

    addTask({
      agentId: agent1.id,
      title: '审查 PR #127 - 新功能实现',
      scheduledTime: '09:00',
      scheduledDate: today
    });

    addTask({
      agentId: agent1.id,
      title: '审查 PR #128 - Bug 修复',
      scheduledTime: '14:00',
      scheduledDate: today
    });

    addTask({
      agentId: agent2.id,
      title: '撰写月度技术总结',
      scheduledTime: '10:00',
      scheduledDate: today
    });

    addTask({
      agentId: agent3.id,
      title: '生成 Q2 用户增长报告',
      scheduledTime: '13:30',
      scheduledDate: today
    });

    addTask({
      agentId: agent2.id,
      title: '编辑 API 文档 V3',
      scheduledTime: '15:00',
      scheduledDate: today
    });
  }

  // Initialize
  load();

  return {
    subscribe,
    getAgents,
    getAgent,
    addAgent,
    updateAgent,
    deleteAgent,
    getTasks,
    getTasksByAgent,
    getTasksByDate,
    getTask,
    addTask,
    updateTask,
    deleteTask,
    getTaskCounts,
    getNextTaskTime,
    getSettings,
    updateSettings,
    getDateStr,
    todayStr,
    getToday,
    formatTime,
    hasData,
    loadDemo
  };
})();
