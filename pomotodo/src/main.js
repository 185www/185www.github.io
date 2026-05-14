/**
 * Pomotodo — Main application entry point
 * @module main
 */

import './style.css';
import { subscribe, getState, setView, loadState, getTimer, pauseTimer } from './state/store.js';
import { renderTimer } from './components/Timer.js';
import { renderTaskList } from './components/TaskList.js';
import { renderStats } from './components/Stats.js';
import { renderSettings } from './components/Settings.js';
import { playClick } from './utils/audio.js';

const app = document.getElementById('app');

// ---- Navigation tabs ----
const NAV_ITEMS = [
  { id: 'timer', label: '计时', icon: '🍅' },
  { id: 'tasks', label: '任务', icon: '📋' },
  { id: 'stats', label: '统计', icon: '📊' },
  { id: 'settings', label: '设置', icon: '⚙' },
];

// ---- Build shell ----
function buildShell() {
  app.innerHTML = `
    <header class="app-header">
      <h1 class="app-title">🍅 Pomotodo</h1>
    </header>
    <nav class="tab-bar">
      ${NAV_ITEMS.map(n => `
        <button class="tab-item" data-view="${n.id}">
          <span class="tab-icon">${n.icon}</span>
          <span class="tab-label">${n.label}</span>
        </button>
      `).join('')}
    </nav>
    <div class="view-container"></div>
    <div class="toast-container" id="toast-container"></div>
  `;
}

// ---- View management ----
let _activeView = 'timer';
let _cleanupFns = {};

function switchView(viewId) {
  if (_activeView === viewId) return;
  playClick();

  // Cleanup previous
  if (_cleanupFns[_activeView]) {
    _cleanupFns[_activeView]();
    delete _cleanupFns[_activeView];
  }

  _activeView = viewId;
  setView(viewId);

  // Update tabs
  document.querySelectorAll('.tab-item').forEach(t => {
    t.classList.toggle('active', t.dataset.view === viewId);
  });

  // Render new view
  const vc = document.querySelector('.view-container');
  vc.innerHTML = '';
  switch (viewId) {
    case 'timer':
      _cleanupFns[viewId] = renderTimer(vc);
      break;
    case 'tasks':
      _cleanupFns[viewId] = renderTaskList(vc);
      break;
    case 'stats':
      _cleanupFns[viewId] = renderStats(vc);
      break;
    case 'settings':
      _cleanupFns[viewId] = renderSettings(vc);
      break;
  }
}

// ---- Toast ----
export function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ---- Keyboard shortcuts ----
document.addEventListener('keydown', (e) => {
  // Don't trigger when typing in inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      document.querySelector('#btn-start')?.click();
      break;
    case 'KeyR':
      if (!e.ctrlKey && !e.metaKey) {
        document.querySelector('#btn-reset')?.click();
      }
      break;
    case 'KeyT':
      if (!e.ctrlKey && !e.metaKey) switchView('tasks');
      break;
    case 'KeyS':
      if (!e.ctrlKey && !e.metaKey) switchView('settings');
      break;
  }
});

// ---- Tab click events ----
app.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab-item');
  if (tab) switchView(tab.dataset.view);
});

// ---- Theme sync ----
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',
    theme === 'dark' ? '#1a1a2e' : '#e74c3c'
  );
}

subscribe((state) => {
  applyTheme(state.settings.theme);
});

// ---- Visibility change — pause timer logic ----
document.addEventListener('visibilitychange', () => {
  // Timer keeps running in background via setInterval; just update title
});

// ---- Init ----
async function init() {
  buildShell();
  await loadState();
  const state = getState();
  applyTheme(state.settings.theme);
  switchView('timer');
}

init();
