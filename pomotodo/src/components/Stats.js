/**
 * Stats component
 * @module components/Stats
 */

import { subscribe, getState, getSessionsByDateRange, getDataForExport, importDataFromJSON } from '../state/store.js';
import { todayStr, weekStartStr, monthStartStr, lastNDays, dayName, formatDuration } from '../utils/date.js';

let chartInstance = null;

export function renderStats(container) {
  const el = document.createElement('div');
  el.className = 'stats-view';
  el.innerHTML = `
    <div class="stats-summary">
      <div class="stat-card">
        <div class="stat-label">Today</div>
        <div class="stat-value" id="stat-today-count">0</div>
        <div class="stat-sub" id="stat-today-time">0m</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Week</div>
        <div class="stat-value" id="stat-week-count">0</div>
        <div class="stat-sub" id="stat-week-time">0m</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Month</div>
        <div class="stat-value" id="stat-month-count">0</div>
        <div class="stat-sub" id="stat-month-time">0m</div>
      </div>
    </div>
    <div class="stats-chart-container">
      <canvas id="stats-chart-canvas"></canvas>
    </div>
    <div class="stats-actions">
      <button class="btn-secondary" id="btn-export">Export</button>
      <label class="btn-secondary import-label">
        Import
        <input type="file" accept=".json" id="btn-import" style="display:none" />
      </label>
    </div>
  `;
  container.appendChild(el);

  const canvasEl = el.querySelector('#stats-chart-canvas');

  function updateStats() {
    const today = todayStr();
    const week = weekStartStr();
    const month = monthStartStr();
    const todaySessions = getSessionsByDateRange(today, today).filter(s => s.type === 'work');
    const weekSessions = getSessionsByDateRange(week, today).filter(s => s.type === 'work');
    const monthSessions = getSessionsByDateRange(month, today).filter(s => s.type === 'work');
    el.querySelector('#stat-today-count').textContent = todaySessions.length;
    el.querySelector('#stat-today-time').textContent = formatDuration(todaySessions.reduce((a, s) => a + s.duration, 0));
    el.querySelector('#stat-week-count').textContent = weekSessions.length;
    el.querySelector('#stat-week-time').textContent = formatDuration(weekSessions.reduce((a, s) => a + s.duration, 0));
    el.querySelector('#stat-month-count').textContent = monthSessions.length;
    el.querySelector('#stat-month-time').textContent = formatDuration(monthSessions.reduce((a, s) => a + s.duration, 0));
    renderChart(getState());
  }

  async function renderChart(state) {
    const Chart = (await import('chart.js')).default;
    const days = lastNDays(7);
    const labels = days.map(d => dayName(d));
    const data = days.map(d => {
      return getSessionsByDateRange(d, d)
        .filter(s => s.type === 'work')
        .reduce((acc, s) => acc + Math.round(s.duration / 60), 0);
    });
    const isDark = state.settings.theme === 'dark';
    const textColor = isDark ? '#aaa' : '#666';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

    if (chartInstance) {
      chartInstance.data.labels = labels;
      chartInstance.data.datasets[0].data = data;
      chartInstance.options.scales.x.ticks.color = textColor;
      chartInstance.options.scales.y.ticks.color = textColor;
      chartInstance.options.scales.x.grid.color = gridColor;
      chartInstance.options.scales.y.grid.color = gridColor;
      chartInstance.update();
      return;
    }

    var chartOpts = {
      type: 'bar',
         labels: labels,
        datasets: [{
          label: 'Focus (min)',
          backgroundColor: 'rgba(231,76,60,0.7)',
          borderRadius: 6,
          maxBarThickness: 32
        }]
    };
    chartOpts.options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: textColor },
            grid: { color: gridColor }
          },
          y: {
            beginAtZero: true,
            ticks: { color: textColor, stepSize: 25 },
            grid: { color: gridColor }
          }
        }
      };
    chartInstance = new Chart(canvasEl, chartOpts);
  }

  el.querySelector('#btn-export').addEventListener('click', async () => {
    try {
      const data = await getDataForExport();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pomotodo-backup-' + todayStr() + '.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export failed: ' + e.message);
    }
  });

  el.querySelector('#btn-import').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importDataFromJSON(data);
      alert('Data imported!');
      updateStats();
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
    e.target.value = '';
  });

  const unsub = subscribe(updateStats);
  updateStats();

  return () => {
    unsub();
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    el.remove();
  };
}
