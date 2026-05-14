/**
 * Settings component — theme, durations, sounds, notifications, data management
 * @module components/Settings
 */

import { subscribe, getState, updateSettings, clearAllData, resetSettings } from '../state/store.js';
import { requestPermission, isNotificationAvailable } from '../utils/notifier.js';
import { playComplete } from '../utils/audio.js';

/**
 * Render the Settings component
 * @param {HTMLElement} container
 * @returns {Function} cleanup
 */
export function renderSettings(container) {
  const el = document.createElement('div');
  el.className = 'settings-view';
  container.appendChild(el);

  function render() {
    const s = getState().settings;
    el.innerHTML =
      '<div class="settings-group">' +
        '<h3>外观</h3>' +
        '<div class="setting-row"><label>主题</label>' +
          '<div class="toggle-group">' +
            '<button class="toggle-btn ' + (s.theme === 'light' ? 'active' : '') + '" data-val="light">☀ 浅色</button>' +
            '<button class="toggle-btn ' + (s.theme === 'dark' ? 'active' : '') + '" data-val="dark">🌙 深色</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="settings-group">' +
        '<h3>计时器</h3>' +
        '<div class="setting-row"><label>专注时长 (分钟)</label><input type="number" class="setting-input" id="set-work" min="1" max="120" value="' + s.workDuration + '" /></div>' +
        '<div class="setting-row"><label>短休息 (分钟)</label><input type="number" class="setting-input" id="set-short" min="1" max="60" value="' + s.shortBreakDuration + '" /></div>' +
        '<div class="setting-row"><label>长休息 (分钟)</label><input type="number" class="setting-input" id="set-long" min="1" max="60" value="' + s.longBreakDuration + '" /></div>' +
        '<div class="setting-row"><label>长休息间隔 (番茄数)</label><input type="number" class="setting-input" id="set-interval" min="2" max="10" value="' + s.longBreakInterval + '" /></div>' +
        '<div class="setting-row"><label>自动开始休息</label><label class="switch"><input type="checkbox" id="set-auto-break" ' + (s.autoStartBreak ? 'checked' : '') + ' /><span class="slider"></span></label></div>' +
        '<div class="setting-row"><label>自动开始专注</label><label class="switch"><input type="checkbox" id="set-auto-work" ' + (s.autoStartWork ? 'checked' : '') + ' /><span class="slider"></span></label></div>' +
      '</div>' +

      '<div class="settings-group">' +
        '<h3>声音与通知</h3>' +
        '<div class="setting-row"><label>提示音</label><label class="switch"><input type="checkbox" id="set-sound" ' + (s.soundEnabled ? 'checked' : '') + ' /><span class="slider"></span></label></div>' +
        '<div class="setting-row"><label>音量</label><input type="range" class="setting-range" id="set-volume" min="0" max="1" step="0.1" value="' + s.soundVolume + '" /><span class="range-value">' + Math.round(s.soundVolume * 100) + '%</span></div>' +
        '<div class="setting-row"><label>浏览器通知</label><label class="switch"><input type="checkbox" id="set-notify" ' + (s.notificationsEnabled ? 'checked' : '') + ' /><span class="slider"></span></label>' +
          (!isNotificationAvailable() ? '<button class="btn-sm" id="btn-req-notify">授权通知</button>' : '') +
        '</div>' +
        '<div class="setting-row"><label>测试提示音</label><button class="btn-secondary" id="btn-test-sound">🔊 播放</button></div>' +
      '</div>' +

      '<div class="settings-group settings-danger">' +
        '<h3>数据</h3>' +
        '<div class="setting-row"><label>重置设置</label><button class="btn-secondary" id="btn-reset-settings">恢复默认</button></div>' +
        '<div class="setting-row"><label>清除所有数据</label><button class="btn-danger" id="btn-clear-data">⚠ 清除数据</button></div>' +
      '</div>';

    // Bind events
    el.querySelectorAll('.toggle-btn[data-val]').forEach(btn => {
      btn.addEventListener('click', () => { updateSettings({ theme: btn.dataset.val }); });
    });
    el.querySelector('#set-work').addEventListener('change', (e) => { updateSettings({ workDuration: Math.max(1, parseInt(e.target.value) || 25) }); });
    el.querySelector('#set-short').addEventListener('change', (e) => { updateSettings({ shortBreakDuration: Math.max(1, parseInt(e.target.value) || 5) }); });
    el.querySelector('#set-long').addEventListener('change', (e) => { updateSettings({ longBreakDuration: Math.max(1, parseInt(e.target.value) || 15) }); });
    el.querySelector('#set-interval').addEventListener('change', (e) => { updateSettings({ longBreakInterval: Math.max(2, parseInt(e.target.value) || 4) }); });
    el.querySelector('#set-auto-break').addEventListener('change', (e) => { updateSettings({ autoStartBreak: e.target.checked }); });
    el.querySelector('#set-auto-work').addEventListener('change', (e) => { updateSettings({ autoStartWork: e.target.checked }); });
    el.querySelector('#set-sound').addEventListener('change', (e) => { updateSettings({ soundEnabled: e.target.checked }); });
    el.querySelector('#set-notify').addEventListener('change', (e) => { updateSettings({ notificationsEnabled: e.target.checked }); if (e.target.checked) requestPermission(); });
    el.querySelector('#set-volume').addEventListener('input', (e) => { updateSettings({ soundVolume: parseFloat(e.target.value) }); el.querySelector('.range-value').textContent = Math.round(e.target.value * 100) + '%'; });
    el.querySelector('#btn-test-sound').addEventListener('click', () => { playComplete(s.soundVolume); });
    const reqBtn = el.querySelector('#btn-req-notify');
    if (reqBtn) {
      reqBtn.addEventListener('click', async () => { const r = await requestPermission(); if (r === 'granted') updateSettings({ notificationsEnabled: true }); else alert('通知权限被拒绝'); });
    }
    el.querySelector('#btn-reset-settings').addEventListener('click', () => { if (confirm('确定恢复默认设置？')) resetSettings(); });
    el.querySelector('#btn-clear-data').addEventListener('click', async () => { if (confirm('⚠ 此操作将清除所有数据，确定？')) { await clearAllData(); alert('数据已清除'); } });
  }

  const unsub = subscribe(render);
  render();
  return () => { unsub(); el.remove(); };
}
