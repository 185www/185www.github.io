/**
 * TaskList component — CRUD for tasks with pin/complete/pomodoro tracking
 * @module components/TaskList
 */

import {
  subscribe, getSortedTasks, addTask, updateTask,
  deleteTask, toggleTask, togglePin, setActiveTask, getState
} from '../state/store.js';
import { playClick, playTaskComplete } from '../utils/audio.js';

let _editingId = null;

/**
 * Render the TaskList component
 * @param {HTMLElement} container
 * @returns {Function} cleanup
 */
export function renderTaskList(container) {
  const el = document.createElement('div');
  el.className = 'tasks-view';
  el.innerHTML = `
    <div class="task-input-row">
      <input type="text" class="task-input" placeholder="添加新任务…" maxlength="100" />
      <select class="task-priority-select">
        <option value="low">低</option>
        <option value="medium" selected>中</option>
        <option value="high">高</option>
      </select>
      <button class="btn-add" title="添加任务">+</button>
    </div>
    <ul class="task-list"></ul>
    <div class="task-empty" style="display:none;">暂无任务，添加一个吧</div>
  `;
  container.appendChild(el);

  const inputEl = el.querySelector('.task-input');
  const priorityEl = el.querySelector('.task-priority-select');
  const addBtn = el.querySelector('.btn-add');
  const listEl = el.querySelector('.task-list');
  const emptyEl = el.querySelector('.task-empty');

  function handleAdd() {
    const title = inputEl.value.trim();
    if (!title) return;
    playClick();
    addTask(title, priorityEl.value);
    inputEl.value = '';
    inputEl.focus();
  }

  addBtn.addEventListener('click', handleAdd);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAdd(); });

  function renderTasks() {
    const s = getState();
    const tasks = getSortedTasks();
    if (tasks.length === 0) {
      listEl.innerHTML = '';
      emptyEl.style.display = '';
      return;
    }
    emptyEl.style.display = 'none';

    listEl.innerHTML = tasks.map(t => {
      const isActive = s.ui.activeTaskId === t.id;
      const editing = _editingId === t.id;
      return '<li class="task-item ' + (t.completed ? 'completed ' : '') + (isActive ? 'active ' : '') + 'priority-' + t.priority + '" data-id="' + t.id + '">' +
        '<button class="task-check" title="完成">' + (t.completed ? '✓' : '○') + '</button>' +
        (editing ? '<input class="task-edit-input" value="' + esc(t.title) + '" />' : '<span class="task-title">' + esc(t.title) + '</span>') +
        '<span class="task-pomodoros">' + '🍅'.repeat(t.pomodorosCompleted) + '</span>' +
        '<div class="task-actions">' +
        '<button class="btn-sm task-pin" title="' + (t.pinned ? '取消置顶' : '置顶') + '">' + (t.pinned ? '📌' : '📍') + '</button>' +
        '<button class="btn-sm task-select" title="关联到当前番茄">' + (isActive ? '🍅' : '○') + '</button>' +
        (!editing ? '<button class="btn-sm task-edit" title="编辑">✏</button>' : '') +
        (editing ? '<button class="btn-sm task-save" title="保存">✓</button>' : '') +
        '<button class="btn-sm delete task-delete" title="删除">✕</button>' +
        '</div></li>';
    }).join('');

    // Bind events
    listEl.querySelectorAll('.task-item').forEach(item => {
      const id = item.dataset.id;
      item.querySelector('.task-check').addEventListener('click', () => {
        const task = tasks.find(t => t.id === id);
        if (task && !task.completed) playTaskComplete(); else playClick();
        toggleTask(id);
      });
      item.querySelector('.task-pin').addEventListener('click', () => { playClick(); togglePin(id); });
      item.querySelector('.task-select').addEventListener('click', () => {
        playClick();
        const current = getState().ui.activeTaskId;
        setActiveTask(current === id ? null : id);
      });
      const editBtn = item.querySelector('.task-edit');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          _editingId = id;
          renderTasks();
          const inp = listEl.querySelector('.task-edit-input');
          if (inp) { inp.focus(); inp.select(); }
        });
      }
      const saveBtn = item.querySelector('.task-save');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const inp = item.querySelector('.task-edit-input');
          const val = inp.value.trim();
          if (val) { playClick(); updateTask(id, { title: val }); }
          _editingId = null;
          renderTasks();
        });
        const inp = item.querySelector('.task-edit-input');
        if (inp) {
          inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveBtn.click();
            if (e.key === 'Escape') { _editingId = null; renderTasks(); }
          });
        }
      }
      item.querySelector('.task-delete').addEventListener('click', () => {
        if (confirm('确定删除此任务？')) { playClick(); deleteTask(id); }
      });
    });
  }

  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  const unsub = subscribe(renderTasks);
  renderTasks();
  return () => { unsub(); el.remove(); };
}
