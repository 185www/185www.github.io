/* ===== 理解轨道 — 费曼解释 / 自解释模式 ===== */
const ChemUnderstanding = (function() {

  let keyPointsChecked = [];

  function renderFeynmanCard(card, reviewIndex, total, container) {
    if (!container) return;

    const keyPoints = (card.hints && card.hints.length > 0) ? card.hints : [];

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="font-size:13px;color:var(--text-secondary)">${reviewIndex+1}/${total}</span>
        <span style="font-size:12px;color:var(--text-secondary)">🧠 理解模式 · 费曼技巧</span>
      </div>
      <div class="progress-bar"><div class="fill" style="width:${reviewIndex/total*100}%"></div></div>
      <div class="feynman-card">
        <div class="feynman-prompt">
          <div class="feynman-label">📌 用你自己的话解释</div>
          <div class="feynman-question">${card.front}</div>
        </div>
        <div class="form-group" style="margin-top:16px">
          <label for="feynmanInput">✍️ 你的解释</label>
          <textarea class="form-textarea feynman-input" id="feynmanInput" rows="6" placeholder="假装你在给一个没学过这个知识的同学讲..."></textarea>
        </div>
        <div id="feynmanCheckArea">
          <button class="btn btn-primary btn-block" id="feynmanCheckBtn" onclick="ChemUnderstanding.checkExplanation('${card.id}')">🔍 检查我的理解</button>
        </div>
      </div>
    `;
  }

  function checkExplanation(cardId) {
    const input = document.getElementById('feynmanInput');
    if (!input) return;

    const cards = ChemEngine.loadCards();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const keyPoints = (card.hints && card.hints.length > 0) ? card.hints : [];
    const userText = input.value.trim();

    if (!userText) {
      alert('请先写一些你的解释再检查！');
      return;
    }

    keyPointsChecked = keyPoints.map(kp => {
      const keywords = kp.replace(/[（(].*?[）)]/g, '').split(/[、，,]/).map(s => s.trim()).filter(s => s);
      const matched = keywords.some(kw => userText.includes(kw));
      return { point: kp, matched };
    });

    const matchedCount = keyPointsChecked.filter(k => k.matched).length;
    const totalPoints = keyPointsChecked.length;

    let checklistHtml = keyPointsChecked.map(k =>
      `<div class="kp-item ${k.matched ? 'matched' : 'missed'}">${k.matched ? '✅' : '❌'} ${k.point}</div>`
    ).join('');

    const score = totalPoints > 0 ? Math.round(matchedCount / totalPoints * 100) : 50;

    document.getElementById('feynmanCheckArea').innerHTML = `
      <div class="feynman-result" style="margin-top:16px">
        <div class="feynman-reference">
          <div style="font-weight:600;margin-bottom:6px;font-size:14px">📖 参考答案</div>
          <div style="font-size:14px;background:#f1f5f9;padding:12px;border-radius:8px;line-height:1.7;white-space:pre-wrap">${card.back}</div>
        </div>
        ${totalPoints > 0 ? `
        <div style="margin-top:12px">
          <div style="font-weight:600;margin-bottom:6px;font-size:14px">📋 关键点覆盖</div>
          <div style="font-size:13px">覆盖 <strong>${matchedCount}/${totalPoints}</strong> 个关键点 (${score}%)</div>
          <div class="kp-list">${checklistHtml}</div>
        </div>` : ''}
        <div style="margin-top:16px;text-align:center">
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">你的理解程度？</div>
          <div class="score-buttons">
            <button class="score-btn hard" onclick="ChemUnderstanding.rate('${card.id}', 1)">😅 没理解</button>
            <button class="score-btn medium" onclick="ChemUnderstanding.rate('${card.id}', 2)">🤔 部分理解</button>
            <button class="score-btn easy" onclick="ChemUnderstanding.rate('${card.id}', 4)">✅ 完全理解</button>
          </div>
        </div>
        <div style="margin-top:12px;text-align:center">
          <button class="btn btn-outline btn-sm" onclick="ChemUnderstanding.retry()">✏️ 重新写</button>
        </div>
      </div>
    `;
  }

  function rate(cardId, score) {
    ChemEngine.reviewCard(cardId, score);
    keyPointsChecked = [];

    const event = new CustomEvent('feynman-rated');
    document.dispatchEvent(event);
  }

  function retry() {
    keyPointsChecked = [];
    const event = new CustomEvent('feynman-retry');
    document.dispatchEvent(event);
  }

  return {
    renderFeynmanCard,
    checkExplanation,
    rate,
    retry
  };
})();
