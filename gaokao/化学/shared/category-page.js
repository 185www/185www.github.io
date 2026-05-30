/* ===== 分类页面共享逻辑 v2 ===== */
(function() {
  const $ = id => document.getElementById(id);

  const pathParts = window.location.pathname.replace(/\/$/, '').replace(/\/index\.html$/, '').split('/');
  const CATEGORY_KEY = pathParts[pathParts.length - 1] || '';
  const CATEGORY_NAME = ChemEngine.categoryName(CATEGORY_KEY);

  let currentTab = 'review';
  let reviewQueue = [];
  let reviewIndex = 0;
  let currentCard = null;

  function showToast(msg) {
    const t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  }

  function init() {
    document.title = `${CATEGORY_NAME} · 化学记忆系统`;
    const titleEl = document.querySelector('.app-header h1');
    if (titleEl) titleEl.textContent = CATEGORY_NAME;
    setupTabs();
    showTab('review');
  }

  function setupTabs() {
    document.querySelectorAll('.tab-item').forEach(el => {
      el.addEventListener('click', function() {
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        showTab(this.dataset.tab);
      });
    });
  }

  function showTab(tab) {
    currentTab = tab;
    ['review', 'cards', 'add', 'import', 'blurting'].forEach(t => {
      const el = $(`tab-${t}`);
      if (el) el.style.display = t === tab ? 'block' : 'none';
    });
    if (tab === 'review') startReview();
    if (tab === 'cards') renderCardList();
    if (tab === 'blurting') renderBlurting();
  }

  /* ===== 复习 ===== */
  function startReview() {
    const allDue = ChemEngine.getDueCards();
    reviewQueue = allDue.filter(c => c.category === CATEGORY_KEY);
    reviewIndex = 0;
    ChemHints.resetHints();

    if (reviewQueue.length === 0) {
      const allCards = ChemEngine.getCardsByCategory(CATEGORY_KEY);
      const newCards = allCards.filter(c => c.repetitions === 0);
      if (newCards.length > 0) {
        $('tab-review').innerHTML = `
          <div class="celebration">
            <div class="icon">📚</div>
            <h2>${newCards.length} 张新卡片待学习</h2>
            <p>今天没有到期复习，但你有新卡片可以开始学习。</p>
            <button class="btn btn-primary" onclick="startNewLearning()" style="margin-top:16px">🚀 开始学习新卡片</button>
          </div>
        `;
        window.startNewLearning = function() {
          reviewQueue = newCards.slice(0, 20);
          reviewIndex = 0;
          renderCard();
        };
      } else {
        $('tab-review').innerHTML = `
          <div class="celebration">
            <div class="icon">🎉</div>
            <h2>${CATEGORY_NAME} 已完成</h2>
            <p>所有卡片都已掌握或正在复习中。</p>
            <p style="margin-top:12px;font-size:13px;color:var(--text-secondary)">去"添加"或"导入"选项卡增加新内容</p>
          </div>
        `;
      }
      return;
    }
    renderCard();
  }

  function renderCard() {
    if (reviewIndex >= reviewQueue.length) {
      $('tab-review').innerHTML = `
        <div class="celebration">
          <div class="icon">🎉</div>
          <h2>太棒了！</h2>
          <p>完成 ${reviewQueue.length} 张复习！</p>
        </div>
      `;
      return;
    }
    currentCard = reviewQueue[reviewIndex];
    const card = currentCard;

    if (card.mode === 'understanding') {
      ChemUnderstanding.renderFeynmanCard(card, reviewIndex, reviewQueue.length, $('tab-review'));
      return;
    }

    const difficultyLabel = card.D < 0.3 ? '容易' : card.D < 0.6 ? '适中' : '困难';

    $('tab-review').innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="font-size:13px;color:var(--text-secondary)">${reviewIndex+1}/${reviewQueue.length}</span>
        <span style="font-size:12px;color:var(--text-secondary)">复习 ${card.repetitions} 次 · 难度 ${difficultyLabel}</span>
      </div>
      <div class="progress-bar"><div class="fill" style="width:${reviewIndex/reviewQueue.length*100}%"></div></div>
      <div class="review-card" id="cardEl">
        <div class="review-card-inner" id="cardInner">
          <div class="review-card-front">
            <div class="label">👆 点击翻转</div>
            <div class="text">${card.front}</div>
          </div>
          <div class="review-card-back">
            <div class="text">${card.back || '(无答案)'}</div>
            ${card.memo ? `<div class="memo">💡 ${card.memo}</div>` : ''}
            <div class="retention-bar" id="hintArea"></div>
          </div>
        </div>
      </div>
      <div class="tap-hint">👆 点击卡片查看答案</div>
      <div class="score-buttons" id="scoreBtns" style="display:none">
        <button class="score-btn hard" onclick="scoreCard(1)">😅 忘了</button>
        <button class="score-btn medium" onclick="scoreCard(2)">🤔 困难</button>
        <button class="score-btn easy" onclick="scoreCard(4)">✅ 轻松</button>
      </div>
    `;

    let flipped = false;
    const inner = $('cardInner');
    const el = $('cardEl');
    if (el) el.addEventListener('click', function(e) {
      if (e.target.closest('.score-btn')) return;
      if (e.target.closest('.hint-btn')) return;
      flipped = !flipped;
      inner.classList.toggle('flipped');
      if (flipped) {
        $('scoreBtns').style.display = 'flex';
        ChemHints.renderHintButton(card, 'hintArea');
      }
    });
  }

  window.scoreCard = function(score) {
    if (reviewIndex >= reviewQueue.length) return;
    const card = reviewQueue[reviewIndex];
    ChemEngine.reviewCard(card.id, score);
    reviewIndex++;
    ChemHints.resetHints();
    renderCard();
  };

  /* ===== 卡片列表 + 搜索 ===== */
  function renderCardList() {
    const cards = ChemEngine.getCardsByCategory(CATEGORY_KEY);
    const isEmpty = cards.length === 0;

    let html = `
      <div style="margin-bottom:12px">
        <div class="search-box">
          <input type="text" class="form-input" id="cardSearch" placeholder="🔍 搜索卡片..." oninput="filterCards()">
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:8px" id="cardCount">共 ${cards.length} 张卡片</div>
      </div>
      <div class="card-list" id="cardList">
    `;

    if (isEmpty) {
      html += `
        <div class="empty-state">
          <div class="icon">📭</div>
          <div class="text">这里还没有卡片</div>
          <div class="sub">在"添加"或"导入"选项卡中添加内容</div>
        </div>
      `;
    } else {
      cards.sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      cards.forEach(c => {
        const due = new Date(c.nextReview) <= today;
        const difficultyLabel = c.D < 0.3 ? '易' : c.D < 0.6 ? '中' : '难';
        html += `
          <div class="card-item" onclick="showCardDetail('${c.id}')">
            <div class="front">${c.front}</div>
            <div class="back">${c.back ? (c.back.length > 60 ? c.back.slice(0,60)+'...' : c.back) : '(空)'}</div>
            <div class="meta">
              <span class="tag">${c.mode === 'memory' ? '📝记忆' : '🧠理解'}</span>
              <span class="tag-difficulty" data-d="${c.D}">难度:${difficultyLabel}</span>
              <span>${due ? '🔴到期' : `📅${formatDate(c.nextReview)}`}</span>
              <span>✓${c.repetitions}次</span>
            </div>
          </div>
        `;
      });
    }
    html += '</div>';
    $('tab-cards').innerHTML = html;
  }

  window.filterCards = function() {
    const q = document.getElementById('cardSearch').value.trim().toLowerCase();
    const cards = ChemEngine.getCardsByCategory(CATEGORY_KEY);
    const filtered = q ? cards.filter(c =>
      (c.front && c.front.toLowerCase().includes(q)) ||
      (c.back && c.back.toLowerCase().includes(q)) ||
      (c.memo && c.memo.toLowerCase().includes(q))
    ) : cards;

    const countEl = document.getElementById('cardCount');
    if (countEl) countEl.textContent = q
      ? `找到 ${filtered.length} / ${cards.length} 张卡片`
      : `共 ${cards.length} 张卡片`;

    const list = document.getElementById('cardList');
    if (!list) return;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    filtered.sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));

    list.innerHTML = filtered.length === 0
      ? `<div class="empty-state"><div class="icon">🔍</div><div class="text">没有匹配的卡片</div></div>`
      : filtered.map(c => {
          const due = new Date(c.nextReview) <= today;
          const difficultyLabel = c.D < 0.3 ? '易' : c.D < 0.6 ? '中' : '难';
          return `<div class="card-item" onclick="showCardDetail('${c.id}')">
            <div class="front">${c.front}</div>
            <div class="back">${c.back ? (c.back.length > 60 ? c.back.slice(0,60)+'...' : c.back) : '(空)'}</div>
            <div class="meta">
              <span class="tag">${c.mode === 'memory' ? '📝记忆' : '🧠理解'}</span>
              <span>难度:${difficultyLabel}</span>
              <span>${due ? '🔴到期' : `📅${formatDate(c.nextReview)}`}</span>
              <span>✓${c.repetitions}次</span>
            </div>
          </div>`;
        }).join('');
  };

  function formatDate(d) {
    const date = new Date(d);
    return `${date.getMonth()+1}/${date.getDate()}`;
  }

  /* ===== 卡片详情 v2 ===== */
  window.showCardDetail = function(id) {
    const cards = ChemEngine.loadCards();
    const card = cards.find(c => c.id === id);
    if (!card) return;

    const R = card.lastReviewed && card.S > 0
      ? (ChemEngine.calcRetrievability(
          (new Date() - new Date(card.lastReviewed)) / (1000 * 60 * 60 * 24),
          card.S
        ) * 100).toFixed(1)
      : '—';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <h3>📇 卡片详情</h3>
        <p><strong>问题：</strong>${card.front}</p>
        <p><strong>答案：</strong>${card.back || '(空)'}</p>
        ${card.memo ? `<p><strong>💡 记忆线索：</strong>${card.memo}</p>` : ''}
        ${card.textbookRef ? `<p><strong>📖 教材参考：</strong>${card.textbookRef}</p>` : ''}
        ${card.tags && card.tags.length ? `<p><strong>🏷️ 标签：</strong>${card.tags.join(', ')}</p>` : ''}
        <div style="font-size:13px;color:var(--text-secondary);margin-top:8px">
          分类：${ChemEngine.categoryName(card.category)} ·
          模式：${card.mode === 'memory' ? '记忆轨' : '理解轨'}
        </div>
        <div class="fsrs-stats">
          <div class="fsrs-stat"><span class="fsrs-label">难度 D</span><span class="fsrs-value">${(card.D || 0.5).toFixed(2)}</span></div>
          <div class="fsrs-stat"><span class="fsrs-label">稳定性 S</span><span class="fsrs-value">${(card.S || 1).toFixed(1)} 天</span></div>
          <div class="fsrs-stat"><span class="fsrs-label">记忆保留率 R</span><span class="fsrs-value">${R}%</span></div>
          <div class="fsrs-stat"><span class="fsrs-label">当前间隔</span><span class="fsrs-value">${card.interval} 天</span></div>
          <div class="fsrs-stat"><span class="fsrs-label">复习次数</span><span class="fsrs-value">${card.repetitions}</span></div>
          <div class="fsrs-stat"><span class="fsrs-label">遗忘次数</span><span class="fsrs-value">${card.lapses}</span></div>
        </div>
        <p style="font-size:13px;color:var(--text-secondary)">
          创建：${new Date(card.createdAt).toLocaleDateString()} ·
          下次复习：${new Date(card.nextReview).toLocaleDateString()}
        </p>
        <div class="modal-actions">
          <button class="btn btn-outline btn-sm" onclick="this.closest('.modal-overlay').remove()">关闭</button>
          <button class="btn btn-outline btn-sm" style="color:var(--danger);border-color:var(--danger)" onclick="deleteCardConfirm('${card.id}')">🗑️ 删除</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === this) this.remove();
    });
  };

  window.deleteCardConfirm = function(id) {
    if (confirm('确定删除这张卡片？')) {
      ChemEngine.deleteCard(id);
      document.querySelector('.modal-overlay').remove();
      if (currentTab === 'cards') renderCardList();
      showToast('已删除');
    }
  };

  /* ===== 添加卡片 v2 ===== */
  function setupAddForm() {
    const form = $('addForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const front = $('addFront').value.trim();
      const back = $('addBack').value.trim();
      const memo = $('addMemo').value.trim();
      const mode = $('addMode').value;
      const hintsText = $('addHints') ? $('addHints').value.trim() : '';
      const textbookRef = $('addTextbook') ? $('addTextbook').value.trim() : '';
      const tagsText = $('addTags') ? $('addTags').value.trim() : '';
      if (!front || !back) { showToast('请填写正反面内容'); return; }

      const card = ChemEngine.addCard(front, back, CATEGORY_KEY, memo, mode);
      const hints = hintsText.split('\n').map(s => s.trim()).filter(s => s);
      const tags = tagsText.split(/[,，、]/).map(s => s.trim()).filter(s => s);
      if (hints.length || textbookRef || tags.length) {
        ChemEngine.updateCard(card.id, { hints, textbookRef, tags });
      }
      showToast('✅ 已添加');
      this.reset();
    });
  }

  /* ===== 批量导入 v2 ===== */
  function setupImport() {
    const btn = $('importBtn');
    const textarea = $('importText');
    if (!btn || !textarea) return;

    textarea.addEventListener('input', function() {
      const lines = this.value.trim().split('\n').filter(l => l.trim());
      let valid = 0;
      const preview = lines.map(line => {
        const parts = line.split('|').map(s => s.trim());
        if (parts.length >= 2 && parts[0] && parts[1]) {
          valid++;
          return `<div class="line">✅ ${parts[0]} → ${parts[1].slice(0,30)}${parts[1].length > 30 ? '...' : ''}</div>`;
        }
        return `<div class="line invalid">⚠️ 格式错误: ${line}</div>`;
      }).join('');
      $('importPreview').innerHTML = preview || '<div class="line" style="color:var(--text-secondary)">等待输入...</div>';
      btn.textContent = `📥 导入 ${valid} 张卡片`;
      btn.disabled = valid === 0;
    });

    btn.addEventListener('click', function() {
      const lines = textarea.value.trim().split('\n').filter(l => l.trim());
      const cards = [];
      lines.forEach(line => {
        const parts = line.split('|').map(s => s.trim());
        if (parts.length >= 2 && parts[0] && parts[1]) {
          cards.push({
            front: parts[0], back: parts[1], memo: parts[2] || '',
            hints: parts[3] ? parts[3].split(';').map(s => s.trim()).filter(s => s) : [],
            category: CATEGORY_KEY, mode: 'memory'
          });
        }
      });
      if (cards.length === 0) { showToast('没有有效的卡片数据'); return; }
      const added = ChemEngine.addCardsBulk(cards);
      showToast(`✅ 成功导入 ${added.length} 张卡片`);
      textarea.value = '';
      $('importPreview').innerHTML = '';
      btn.disabled = true;
      btn.textContent = '📥 导入';
    });
  }

  function setupPreset() {
    const btn = $('loadPreset');
    if (!btn) return;
    btn.addEventListener('click', function() {
      const existing = ChemEngine.getCardsByCategory(CATEGORY_KEY);
      if (existing.length > 0) {
        if (!confirm('该分类已有卡片，确定要追加预设内容吗？')) return;
      }
      const presets = ChemEngine.getPresetCards(CATEGORY_KEY);
      if (presets.length === 0) { showToast('该分类暂无预设内容'); return; }
      const added = ChemEngine.addCardsBulk(presets);
      showToast(`✅ 已导入 ${added.length} 张预设卡片`);
      if (currentTab === 'cards') renderCardList();
    });
  }

  /* ===== 全部输出 (Blurting) ===== */
  function renderBlurting() {
    const container = $('tab-blurting');
    if (!ChemBlurting) return;
    ChemBlurting.renderBlurtingView(container);
    const topicsContainer = document.getElementById('blurtingTopics');
    if (topicsContainer) {
      ChemBlurting.renderTopics(CATEGORY_KEY, topicsContainer);
    }
  }

  /* ===== 键盘快捷键 ===== */
  function setupKeyboard() {
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      if (currentTab === 'review') {
        const flipEl = document.getElementById('cardInner');
        const scoreBtns = document.getElementById('scoreBtns');

        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (scoreBtns && scoreBtns.style.display === 'flex') {
            // Already flipped, do nothing on space (use number keys for scoring)
          } else if (flipEl) {
            flipEl.click();
          }
        }

        if (e.key === '1') {
          const btn = document.querySelector('.score-btn.hard');
          if (btn && scoreBtns && scoreBtns.style.display === 'flex') btn.click();
        }
        if (e.key === '2') {
          const btn = document.querySelector('.score-btn.medium');
          if (btn && scoreBtns && scoreBtns.style.display === 'flex') btn.click();
        }
        if (e.key === '4' || e.key === '3') {
          const btn = document.querySelector('.score-btn.easy');
          if (btn && scoreBtns && scoreBtns.style.display === 'flex') btn.click();
        }

        if (e.key === 'h' || e.key === 'H') {
          const hintBtn = document.getElementById('hintBtn');
          if (hintBtn && !hintBtn.disabled) hintBtn.click();
        }
      }

      if (e.key === 's' || e.key === 'S') {
        const searchBox = document.getElementById('cardSearch');
        if (searchBox) { searchBox.focus(); e.preventDefault(); }
      }
    });
  }

  /* ===== 初始化 ===== */
  document.addEventListener('DOMContentLoaded', function() {
    init();
    setupAddForm();
    setupImport();
    setupPreset();
    setupKeyboard();

    document.addEventListener('feynman-rated', function() {
      if (reviewIndex >= reviewQueue.length) return;
      reviewIndex++;
      ChemHints.resetHints();
      renderCard();
    });

    document.addEventListener('feynman-retry', function() {
      if (reviewIndex >= reviewQueue.length) return;
      renderCard();
    });
  });
})();
