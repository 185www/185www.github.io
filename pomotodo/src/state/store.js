/**
 * Global reactive state store
 * @module state/store
 */

import { get, set } from '../utils/storage.js';

// ---- Default state ----

const DEFAULTS = {
  settings: {
    theme: 'light',
    workDuration: 25,          // minutes
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,      // work sessions before long break
    autoStartBreak: true,
    autoStartWork: false,
    soundEnabled: true,
    soundVolume: 0.5,
    notificationsEnabled: true,
  },
  tasks: [],
  sessions: [],   // { id, taskId, type, start, end, duration }
};

/** @type {typeof DEFAULTS} */
let _state = structuredClone(DEFAULTS);

// Timer runtime state (not persisted)
let _timer = {
  mode: 'work',         // 'work' | 'shortBreak' | 'longBreak'
  remaining: 25 * 60,   // seconds
  isRunning: false,
  intervalId: null,
  cycleCount: 0,        // work pomodoros completed in current cycle
  startedAt: null,      // timestamp of current session start
};

let _ui = {
  activeView: 'timer',  // 'timer' | 'tasks' | 'stats' | 'settings'
  activeTaskId: null,
};

const _listeners = new Set();

/**
 * Subscribe to state changes
 * @param {Function} fn - callback(state, timer, ui)
 * @returns {Function} unsubscribe
 */
export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/** Notify all subscribers */
function _notify() {
  const snap = { ..._state, timer: { ..._timer }, ui: { ..._ui } };
  _listeners.forEach(fn => { try { fn(snap); } catch (_) {} });
}

/**
 * Get current state snapshot
 * @returns {Object}
 */
export function getState() {
  return { ..._state, timer: { ..._timer }, ui: { ..._ui } };
}

/**
 * Get timer state
 * @returns {Object}
 */
export function getTimer() {
  return { ..._timer };
}

/**
 * Get UI state
 * @returns {Object}
 */
export function getUI() {
  return { ..._ui };
}

// ---- Settings ----

/**
 * Update settings (shallow merge)
 * @param {Object} patch
 */
export function updateSettings(patch) {
  _state.settings = { ..._state.settings, ...patch };
  _persist();
  _notify();
}

/**
 * Reset all settings to defaults
 */
export function resetSettings() {
  _state.settings = structuredClone(DEFAULTS.settings);
  _persist();
  _notify();
}

// ---- Tasks ----

/**
 * Add a new task
 * @param {string} title
 * @param {'low'|'medium'|'high'} [priority='medium']
 * @returns {Object} the new task
 */
export function addTask(title, priority = 'medium') {
  const task = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
    title,
    completed: false,
    pomodorosCompleted: 0,
    priority,
    pinned: false,
    createdAt: new Date().toISOString(),
  };
  _state.tasks.unshift(task);
  _persist();
  _notify();
  return task;
}

/**
 * Update a task by id (shallow merge)
 * @param {string} id
 * @param {Object} patch
 */
export function updateTask(id, patch) {
  const idx = _state.tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  _state.tasks[idx] = { ..._state.tasks[idx], ...patch };
  _persist();
  _notify();
}

/**
 * Delete a task by id
 * @param {string} id
 */
export function deleteTask(id) {
  _state.tasks = _state.tasks.filter(t => t.id !== id);
  if (_ui.activeTaskId === id) _ui.activeTaskId = null;
  _persist();
  _notify();
}

/**
 * Toggle task completion
 * @param {string} id
 */
export function toggleTask(id) {
  const task = _state.tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  _persist();
  _notify();
}

/**
 * Toggle task pinned status
 * @param {string} id
 */
export function togglePin(id) {
  const task = _state.tasks.find(t => t.id === id);
  if (!task) return;
  task.pinned = !task.pinned;
  _persist();
  _notify();
}

/**
 * Increment a task's pomodoro count
 * @param {string} id
 */
export function incrementPomodoro(id) {
  const task = _state.tasks.find(t => t.id === id);
  if (!task) return;
  task.pomodorosCompleted++;
  _persist();
  _notify();
}

// ---- Sessions ----

/**
 * Record a completed session
 * @param {string} type - 'work' | 'shortBreak' | 'longBreak'
 * @param {number} duration - seconds
 */
export function addSession(type, duration) {
  const session = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    taskId: _ui.activeTaskId,
    type,
    start: _timer.startedAt || new Date().toISOString(),
    end: new Date().toISOString(),
    duration,
  };
  _state.sessions.push(session);
  _persist();
  _notify();
  return session;
}

// ---- Timer ----

/**
 * Set timer mode and reset remaining
 * @param {'work'|'shortBreak'|'longBreak'} mode
 */
export function setTimerMode(mode) {
  _timer.mode = mode;
  _timer.remaining = _getModeDuration(mode) * 60;
  _timer.isRunning = false;
  _timer.startedAt = null;
  if (_timer.intervalId) {
    clearInterval(_timer.intervalId);
    _timer.intervalId = null;
  }
  _notify();
}

/**
 * Start or resume the timer
 * @param {Function} onTick - called each second
 * @param {Function} onComplete - called when timer reaches 0
 */
export function startTimer(onTick, onComplete) {
  if (_timer.isRunning) return;
  _timer.isRunning = true;
  _timer.startedAt = _timer.startedAt || new Date().toISOString();
  _timer.intervalId = setInterval(() => {
    _timer.remaining--;
    if (typeof onTick === 'function') onTick();
    if (_timer.remaining <= 0) {
      stopTimer();
      if (typeof onComplete === 'function') onComplete();
    }
  }, 1000);
  _notify();
}

/**
 * Pause the timer
 */
export function pauseTimer() {
  _timer.isRunning = false;
  if (_timer.intervalId) {
    clearInterval(_timer.intervalId);
    _timer.intervalId = null;
  }
  _notify();
}

/**
 * Stop and clear interval (no state change)
 */
export function stopTimer() {
  _timer.isRunning = false;
  if (_timer.intervalId) {
    clearInterval(_timer.intervalId);
    _timer.intervalId = null;
  }
}

/**
 * Reset timer to current mode's full duration
 */
export function resetTimer() {
  stopTimer();
  _timer.remaining = _getModeDuration(_timer.mode) * 60;
  _timer.startedAt = null;
  _notify();
}

/**
 * Skip to the next session type
 * @param {Function} onTick
 * @param {Function} onComplete
 */
export function skipTimer(onTick, onComplete) {
  const duration = _getModeDuration(_timer.mode) * 60;
  // If more than half completed, count the session
  if (_timer.remaining < duration * 0.5) {
    addSession(_timer.mode, duration - _timer.remaining);
    if (_timer.mode === 'work' && _ui.activeTaskId) {
      incrementPomodoro(_ui.activeTaskId);
      _timer.cycleCount++;
    }
  }
  stopTimer();
  _advanceMode();
  _notify();
}

/**
 * Get duration in minutes for a mode
 * @param {string} mode
 * @returns {number}
 * @private
 */
function _getModeDuration(mode) {
  const s = _state.settings;
  switch (mode) {
    case 'work': return s.workDuration;
    case 'shortBreak': return s.shortBreakDuration;
    case 'longBreak': return s.longBreakDuration;
    default: return s.workDuration;
  }
}

/**
 * Advance to the next mode in the cycle
 * @private
 */
function _advanceMode() {
  if (_timer.mode === 'work') {
    if (_timer.cycleCount >= _state.settings.longBreakInterval) {
      _timer.mode = 'longBreak';
      _timer.cycleCount = 0;
    } else {
      _timer.mode = 'shortBreak';
    }
  } else {
    _timer.mode = 'work';
  }
  _timer.remaining = _getModeDuration(_timer.mode) * 60;
  _timer.startedAt = null;
}

/**
 * Complete the current timer — record session, advance, maybe auto-start
 * @returns {{ nextMode: string, autoStart: boolean }}
 */
export function completeTimer() {
  const duration = _getModeDuration(_timer.mode) * 60;
  addSession(_timer.mode, duration);
  if (_timer.mode === 'work') {
    if (_ui.activeTaskId) incrementPomodoro(_ui.activeTaskId);
    _timer.cycleCount++;
  }
  stopTimer();
  _advanceMode();
  const autoStart = _timer.mode !== 'work'
    ? _state.settings.autoStartBreak
    : _state.settings.autoStartWork;
  return { nextMode: _timer.mode, autoStart };
}

// ---- UI ----

/**
 * Switch the active view
 * @param {string} view
 */
export function setView(view) {
  _ui.activeView = view;
  _notify();
}

/**
 * Set the active task for the timer
 * @param {string|null} taskId
 */
export function setActiveTask(taskId) {
  _ui.activeTaskId = taskId;
  _notify();
}

// ---- Persistence ----

const STORAGE_KEY = 'pomotodo_data';

/**
 * Persist state to storage
 * @private
 */
async function _persist() {
  const data = {
    settings: _state.settings,
    tasks: _state.tasks,
    sessions: _state.sessions,
    lastSync: Date.now(),
  };
  await set(STORAGE_KEY, data);
}

/**
 * Load state from storage
 * @returns {Promise<void>}
 */
export async function loadState() {
  const data = await get(STORAGE_KEY);
  if (data) {
    if (data.settings) _state.settings = { ..._state.settings, ...data.settings };
    if (Array.isArray(data.tasks)) _state.tasks = data.tasks;
    if (Array.isArray(data.sessions)) _state.sessions = data.sessions;
  }
  // Sync timer remaining with settings
  if (!_timer.isRunning) {
    _timer.remaining = _getModeDuration(_timer.mode) * 60;
  }
  _notify();
}

/**
 * Clear all data and reset
 * @returns {Promise<void>}
 */
export async function clearAllData() {
  const { clearAll } = await import('../utils/storage.js');
  await clearAll();
  _state = structuredClone(DEFAULTS);
  _ui.activeTaskId = null;
  resetTimer();
  _notify();
}

/**
 * Get all data for export
 * @returns {Promise<Object>}
 */
export async function getDataForExport() {
  const { getAll } = await import('../utils/storage.js');
  return getAll();
}

/**
 * Import data from JSON
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function importDataFromJSON(data) {
  const { importData: imp } = await import('../utils/storage.js');
  await imp(data);
  await loadState();
}

/**
 * Get sorted tasks (pinned first, then by createdAt desc)
 * @returns {Object[]}
 */
export function getSortedTasks() {
  return [..._state.tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

/**
 * Get sessions filtered by date range
 * @param {string} from - YYYY-MM-DD
 * @param {string} to - YYYY-MM-DD
 * @returns {Object[]}
 */
export function getSessionsByDateRange(from, to) {
  return _state.sessions.filter(s => {
    const d = s.start.slice(0, 10);
    return d >= from && d <= to;
  });
}
