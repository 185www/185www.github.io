/**
 * Timer component — displays countdown ring, controls, and mode indicator
 * @module components/Timer
 */

import {
  subscribe, getState, getTimer,
  startTimer as storeStartTimer,
  pauseTimer as storePauseTimer,
  resetTimer as storeResetTimer,
  skipTimer as storeSkipTimer,
  completeTimer as storeCompleteTimer,
  setTimerMode,
} from '../state/store.js';
import { formatTime } from '../utils/date.js';
import { playComplete, playClick } from '../utils/audio.js';
import { notify, requestPermission } from '../utils/notifier.js';

/**
 * Render the Timer component into a container
 * @param {HTMLElement} container
 * @returns {Function} cleanup
 */
export function renderTimer(container) {
  const el = document.createElement('div');
  el.className = 'timer-view';
  el.innerHTML = `
    <div class="timer-mode-tabs">
      <button class="mode-tab" data-mode="work">专注</button>
      <button class="mode-tab" data-mode="shortBreak">短休息</button>
      <button class="mode-tab" data-mode="longBreak">长休息</button>
    </div>
    <div class="timer-display">
      <svg class="timer-ring" viewBox="0 0 200 200">
        <circle class="ring-bg" cx="100" cy="100" r="90" />
        <circle class="ring-progress" cx="100" cy="100" r="90" />
      </svg>
      <div class="timer-text">25:00</div>
    </div>
    <div class="timer-task-label"></div>
    <div class="timer-controls">
      <button class="btn-icon" id="btn-reset" title="重置 (R)">↺</button>
      <button class="btn-primary" id="btn-start">开始</button>
      <button class="btn-icon" id="btn-skip" title="跳过">⏭</button>
    </div>
    <div class="timer-cycle-dots"></div>
  `;
  container.appendChild(el);

  // Refs
  const textEl = el.querySelector('.timer-text');
  const progressEl = el.querySelector('.ring-progress');
  const startBtn = el.getElementById('btn-start');
  const resetBtn = el.getElementById('btn-reset');
  const skipBtn = el.getElementById('btn-skip');
  const taskLabel = el.querySelector('.timer-task-label');
  const dotsEl = el.querySelector('.timer-cycle-dots');
  const modeTabs = el.querySelectorAll('.mode-tab');

  // Display update
  function updateDisplay() {
    const t = getTimer();
    const s = getState();
    const total = getDuration(t.mode, s.settings) * 60;
    const remaining = t.remaining;

    textEl.textContent = formatTime(remaining);

    // SVG ring
    const circumference = 2 * Math.PI * 90;
    const pct = total > 0 ? remaining / total : 1;
    progressEl.style.strokeDasharray = circumference;
    progressEl.style.strokeDashoffset = circumference * (1 - pct);

    // Color
    const colors = { work: 'var(--c-primary)', shortBreak: 'var(--c-break-short)', longBreak: 'var(--c-break-long)' };
    progressEl.style.stroke = colors[t.mode] || colors.work;
    textEl.style.color = colors[t.mode] || colors.work;

    // Button
    startBtn.textContent = t.isRunning ? '暂停' : (t.remaining < total ? '继续' : '开始');
    startBtn.classList.toggle('running', t.isRunning);

    // Mode tabs
    modeTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.mode === t.mode));

    // Task label
    if (s.ui.activeTaskId) {
      const task = s.tasks.find(tk => tk.id === s.ui.activeTaskId);
      taskLabel.textContent = task ? '🍅 ' + task.title : '';
    } else {
      taskLabel.textContent = '';
    }

    // Cycle dots
    const interval = s.settings.longBreakInterval;
    let dots = '';
    for (let i = 0; i < interval; i++) {
      dots += '<span class="dot ' + (i < t.cycleCount ? 'filled' : '') + '"></span>';
    }
    dotsEl.innerHTML = dots;

    // Page title
    document.title = t.isRunning ? formatTime(remaining) + ' - Pomotodo' : 'Pomotodo';
  }

  function getDuration(mode, settings) {
    switch (mode) {
      case 'work': return settings.workDuration;
      case 'shortBreak': return settings.shortBreakDuration;
      case 'longBreak': return settings.longBreakDuration;
      default: return settings.workDuration;
    }
  }

  function handleTick() { updateDisplay(); }

  function handleComplete() {
    const s = getState();
    const t = getTimer();
    const result = storeCompleteTimer();

    if (s.settings.soundEnabled) playComplete(s.settings.soundVolume);
    const modeLabel = { work: '专注时间', shortBreak: '短休息', longBreak: '长休息' };
    if (s.settings.notificationsEnabled) {
      notify('Pomotodo', (modeLabel[t.mode] || '计时') + '结束！');
    }

    if (result.autoStart) {
      storeStartTimer(handleTick, handleComplete);
    }
    updateDisplay();
  }

  // Events
  startBtn.addEventListener('click', () => {
    const t = getTimer();
    playClick();
    if (t.isRunning) {
      storePauseTimer();
    } else {
      requestPermission();
      storeStartTimer(handleTick, handleComplete);
    }
    updateDisplay();
  });

  resetBtn.addEventListener('click', () => {
    playClick();
    storeResetTimer();
    updateDisplay();
  });

  skipBtn.addEventListener('click', () => {
    playClick();
    storeSkipTimer(handleTick, handleComplete);
    updateDisplay();
  });

  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playClick();
      setTimerMode(tab.dataset.mode);
      updateDisplay();
    });
  });

  const unsub = subscribe(updateDisplay);
  updateDisplay();

  return () => { unsub(); el.remove(); };
}
