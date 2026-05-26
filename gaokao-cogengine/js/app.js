const App = {
  currentView: 'textbooks',
  currentTextbook: null,
  currentChapter: null,
  currentSection: null,
  textbookData: {},

  MODULE_NAMES: {
    '必修第一册': '必修第一册',
    '必修第二册': '必修第二册',
    '选择性必修1': '选择性必修1 化学反应原理',
    '选择性必修2': '选择性必修2 物质结构与性质',
    '选择性必修3': '选择性必修3 有机化学基础',
    '化学实验': '化学实验（独立模块）'
  },

  init() {
    this.registerTextbook('必修第一册', 必修第一册);
    this.registerTextbook('必修第二册', 必修第二册);
    this.registerTextbook('选择性必修1', 选择性必修1);
    this.registerTextbook('选择性必修2', 选择性必修2);
    this.registerTextbook('选择性必修3', 选择性必修3);
    this.registerTextbook('化学实验', 化学实验);
    this.render();
  },

  registerTextbook(key, data) {
    this.textbookData[key] = data;
  },

  render() {
    const app = document.getElementById('app');
    if (!app) return;
    switch (this.currentView) {
      case 'textbooks': this.renderTextbooks(app); break;
      case 'chapters': this.renderChapters(app); break;
      case 'sections': this.renderSections(app); break;
      case 'exercises': this.renderExercises(app); break;
      case 'exercise': this.renderExercise(app); break;
      default: this.renderTextbooks(app);
    }
  },

  /* ===== Textbook List ===== */
  renderTextbooks(app) {
    const records = Store.getRecords();
    app.innerHTML = `
      <div class="page">
        <header class="page-header">
          <h1 class="page-title">高考化学认知引擎</h1>
          <p class="page-subtitle">分步推理训练 · ${Object.keys(records).length} 道练习已复习</p>
        </header>
        <div class="textbook-grid">
          ${Object.entries(this.MODULE_NAMES).map(([key, name]) => {
            const stats = this.getModuleStats(key);
            return `
              <div class="textbook-card" data-key="${key}">
                <div class="card-title">${name}</div>
                <div class="card-stats">
                  <span class="stat">${stats.total} 道练习</span>
                  <span class="stat ${stats.due > 0 ? 'due' : ''}">待复习 ${stats.due}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${stats.mastery}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    app.querySelectorAll('.textbook-card').forEach(el => {
      el.addEventListener('click', () => {
        this.currentTextbook = el.dataset.key;
        this.currentView = 'chapters';
        this.render();
      });
    });
  },

  getModuleStats(key) {
    const data = this.textbookData[key];
    if (!data) return { total: 0, due: 0, mastery: 0 };
    let total = 0;
    const allExercises = [];
    data.chapters.forEach(ch => {
      ch.sections.forEach(sec => {
        sec.exercises.forEach(ex => {
          total++;
          allExercises.push(ex.id);
        });
      });
    });
    const records = Store.getRecords();
    const due = allExercises.filter(id => {
      const r = records[id];
      if (!r || !r.nextReview) return true;
      return new Date(r.nextReview) <= new Date();
    }).length;
    const mastered = allExercises.filter(id => {
      const r = records[id];
      return r && r.interval >= 14;
    }).length;
    return { total, due, mastery: total > 0 ? Math.round(mastered / total * 100) : 0 };
  },

  /* ===== Chapter List ===== */
  renderChapters(app) {
    const data = this.textbookData[this.currentTextbook];
    if (!data) { this.currentView = 'textbooks'; return this.render(); }
    app.innerHTML = `
      <div class="page">
        <header class="page-header">
          <button class="back-btn" data-action="back-textbooks">&larr; 返回</button>
          <h1 class="page-title">${this.MODULE_NAMES[this.currentTextbook]}</h1>
        </header>
        <div class="chapter-list">
          ${data.chapters.map((ch, ci) => {
            const secCount = ch.sections.length;
            const exCount = ch.sections.reduce((s, sec) => s + sec.exercises.length, 0);
            return `
              <div class="chapter-card" data-chapter="${ci}">
                <div class="chapter-title">${ch.title}</div>
                <div class="chapter-meta">${secCount} 节 · ${exCount} 道练习</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    app.querySelector('[data-action="back-textbooks"]').addEventListener('click', () => {
      this.currentView = 'textbooks';
      this.render();
    });
    app.querySelectorAll('.chapter-card').forEach(el => {
      el.addEventListener('click', () => {
        this.currentChapter = parseInt(el.dataset.chapter);
        this.currentView = 'sections';
        this.render();
      });
    });
  },

  /* ===== Section List ===== */
  renderSections(app) {
    const data = this.textbookData[this.currentTextbook];
    const chapter = data.chapters[this.currentChapter];
    app.innerHTML = `
      <div class="page">
        <header class="page-header">
          <button class="back-btn" data-action="back-chapters">&larr; 返回</button>
          <h1 class="page-title">${chapter.title}</h1>
        </header>
        <div class="section-list">
          ${chapter.sections.map((sec, si) => `
            <div class="section-card" data-section="${si}">
              <div class="section-title">${sec.title}</div>
              <div class="section-meta">${sec.exercises.length} 道练习</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    app.querySelector('[data-action="back-chapters"]').addEventListener('click', () => {
      this.currentView = 'chapters';
      this.render();
    });
    app.querySelectorAll('.section-card').forEach(el => {
      el.addEventListener('click', () => {
        this.currentSection = parseInt(el.dataset.section);
        this.currentView = 'exercises';
        this.render();
      });
    });
  },

  /* ===== Exercise List ===== */
  renderExercises(app) {
    const data = this.textbookData[this.currentTextbook];
    const chapter = data.chapters[this.currentChapter];
    const section = chapter.sections[this.currentSection];
    const records = Store.getRecords();
    app.innerHTML = `
      <div class="page">
        <header class="page-header">
          <button class="back-btn" data-action="back-sections">&larr; 返回</button>
          <h1 class="page-title">${section.title}</h1>
        </header>
        <div class="exercise-list">
          ${section.exercises.map((ex, ei) => {
            const r = records[ex.id];
            const statusClass = r ? (r.lastResult === 'pass' ? 'status-done' : 'status-fail') : 'status-new';
            return `
              <div class="exercise-card ${statusClass}" data-exercise="${ei}">
                <div class="exercise-title">${ex.title}</div>
                <div class="exercise-template">${ExerciseTemplates[ex.template]?.name || ex.template}</div>
                <div class="exercise-status">${r ? (r.lastResult === 'pass' ? `✓ 已掌握 (${r.interval || 0}天)` : '✗ 需重做') : '未开始'}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    app.querySelector('[data-action="back-sections"]').addEventListener('click', () => {
      this.currentView = 'sections';
      this.render();
    });
    app.querySelectorAll('.exercise-card').forEach(el => {
      el.addEventListener('click', () => {
        const ei = parseInt(el.dataset.exercise);
        this.startExercise(ei);
      });
    });
  },

  /* ===== Exercise Runner ===== */
  startExercise(exerciseIndex) {
    const data = this.textbookData[this.currentTextbook];
    const chapter = data.chapters[this.currentChapter];
    const section = chapter.sections[this.currentSection];
    const ex = section.exercises[exerciseIndex];
    this._currentExerciseData = ex;
    this._currentExerciseIndex = exerciseIndex;

    const stepData = ExerciseEngine.start(ex);
    if (!stepData) {
      this._showFeedback('暂时无法加载该练习', 'error');
      return;
    }

    this.currentView = 'exercise';
    this._renderExerciseStep();
  },

  renderExercise(app) {
    if (!this._currentExerciseData || !ExerciseEngine.getCurrentStep()) {
      this.currentView = 'exercises';
      this.render();
      return;
    }
    this._renderExerciseStep();
  },

  _renderExerciseStep() {
    const app = document.getElementById('app');
    const stepData = ExerciseEngine.getCurrentStep();
    const ex = this._currentExerciseData;

    if (!stepData) {
      this._finishExercise();
      return;
    }
    let inputHtml = '';
    if (stepData.type === 'fill-blank') {
      inputHtml = `
        <input type="text" class="answer-input" id="answer-input" placeholder="输入答案..." autocomplete="off">
        <button class="btn-primary" id="submit-answer">提交</button>
        ${stepData.hint ? `<button class="btn-hint" id="show-hint">提示</button>` : ''}
        <div class="hint-text" id="hint-text" style="display:none">${stepData.hint || ''}</div>
      `;
    } else if (stepData.type === 'choice' || stepData.type === 'multi-choice') {
      inputHtml = `
        <div class="options-list" id="options-list">
          ${(stepData.options || []).map((opt, i) => `
            <label class="option-label">
              <input type="${stepData.type === 'choice' ? 'radio' : 'checkbox'}" name="answer" value="${i}">
              <span>${opt}</span>
            </label>
          `).join('')}
        </div>
        <button class="btn-primary" id="submit-answer">提交</button>
      `;
    }

    app.innerHTML = `
      <div class="page">
        <header class="page-header">
          <button class="back-btn" id="exit-exercise">&larr; 退出</button>
          <h1 class="page-title">${ex.title}</h1>
        </header>
        <div class="exercise-progress">
          <div class="step-indicator">步骤 ${stepData.index}/${stepData.total}</div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${(stepData.index - 1) / stepData.total * 100}%"></div>
          </div>
        </div>
        <div class="step-prompt">${stepData.prompt.replace(/\n/g, '<br>')}</div>
        <div class="step-input">${inputHtml}</div>
        <div class="feedback-area" id="feedback-area"></div>
      </div>
    `;

    app.querySelector('#exit-exercise')?.addEventListener('click', () => {
      ExerciseEngine.reset();
      this.currentView = 'exercises';
      this.render();
    });

    app.querySelector('#submit-answer')?.addEventListener('click', () => {
      this._handleAnswer();
    });

    app.querySelector('#show-hint')?.addEventListener('click', () => {
      const hintEl = document.getElementById('hint-text');
      if (hintEl) hintEl.style.display = 'block';
    });

    app.querySelector('#answer-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._handleAnswer();
    });
  },

  _handleAnswer() {
    const stepData = ExerciseEngine.getCurrentStep();
    if (!stepData) return;

    let answer;
    if (stepData.type === 'fill-blank') {
      answer = document.getElementById('answer-input')?.value || '';
    } else if (stepData.type === 'choice') {
      const selected = document.querySelector('input[name="answer"]:checked');
      answer = selected ? parseInt(selected.value) : null;
    } else if (stepData.type === 'multi-choice') {
      const selected = document.querySelectorAll('input[name="answer"]:checked');
      answer = Array.from(selected).map(el => parseInt(el.value));
    }

    if (answer === null || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
      this._showFeedback('请先输入答案', 'error');
      return;
    }

    const result = ExerciseEngine.submitAnswer(answer);

    if (result.status === 'failed') {
      this._showFeedback(`回答错误！正确：${result.result.expectedAnswer || ''}`, 'error');
      setTimeout(() => {
        this._finishExercise(result.result);
      }, 1500);
    } else if (result.status === 'passed') {
      this._showFeedback('全部回答正确！', 'success');
      setTimeout(() => {
        this._finishExercise(result.result);
      }, 1000);
    } else {
      this._showFeedback('回答正确！', 'success');
      setTimeout(() => {
        this._renderExerciseStep();
      }, 600);
    }
  },

  _showFeedback(msg, type) {
    const el = document.getElementById('feedback-area');
    if (el) el.innerHTML = `<div class="feedback feedback-${type}">${msg}</div>`;
  },

  _finishExercise(result) {
    const ex = this._currentExerciseData;
    if (result) {
      Store.updateRecord(ex.id, result);
    }
    ExerciseEngine.reset();
    this.currentView = 'exercises';
    this.render();
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
