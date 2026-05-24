/* ===== 渐进提示系统 ===== */
const ChemHints = (function() {

  function renderHintButton(card, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const hints = card.hints || [];
    if (hints.length === 0) return;

    let hintIndex = 0;
    const existing = container.querySelector('.hint-container');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = 'hint-container';
    div.innerHTML = `
      <button class="hint-btn" id="hintBtn">💡 提示</button>
      <div class="hint-text" id="hintText"></div>
    `;
    container.appendChild(div);

    const btn = div.querySelector('#hintBtn');
    const text = div.querySelector('#hintText');

    btn.addEventListener('click', function() {
      if (hintIndex < hints.length) {
        text.textContent = '💡 ' + hints[hintIndex];
        text.classList.add('show');
        hintIndex++;
        if (hintIndex >= hints.length) {
          btn.textContent = '✅ 已显示全部提示';
          btn.disabled = true;
        } else {
          btn.textContent = '💡 下一条提示 (' + (hints.length - hintIndex) + ')';
        }
      }
    });
  }

  function resetHints() {
    document.querySelectorAll('.hint-container').forEach(el => el.remove());
  }

  return {
    renderHintButton,
    resetHints
  };
})();
