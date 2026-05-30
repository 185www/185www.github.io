/* ===== 高考冲刺·化学记忆系统 - 核心引擎 v2 ===== */
/* 算法: FSRS-lite (D/S/R 三参数) + 数据管理层 */

const ChemEngine = (function() {
  const STORAGE_KEY = 'chem_cards';
  const VERSION_KEY = 'chem_engine_version';
  const SETTINGS_KEY = 'chem_settings';
  const LOG_KEY = 'chem_review_log';
  const CURRENT_VERSION = 2;

  const DEFAULT_SETTINGS = {
    newPerDay: 20,
    maxReviewsPerDay: 100,
    targetRetention: 0.8
  };

  /* ===== FSRS-lite 算法 ===== */
  function calcRetrievability(daysElapsed, stability) {
    if (stability <= 0) return 0;
    return Math.pow(2, -Math.max(0, daysElapsed) / stability);
  }

  function calcNextReview(score, card) {
    let { S, D } = card;
    if (typeof S !== 'number' || S < 1) S = 1;
    if (typeof D !== 'number') D = 0.5;

    let newS, newD, lapsesInc = 0;
    const settings = loadSettings();
    const targetR = settings.targetRetention || 0.8;

    if (score >= 3) {
      const mult = 1.3 + (score - 3) * 0.15;
      newS = Math.max(1, S * mult);
      newD = Math.max(0, Math.min(1, D - 0.04 * (score - 3)));
    } else if (score === 2) {
      newS = Math.max(1, S * 0.5);
      newD = Math.min(1, D + 0.1);
      lapsesInc = 1;
    } else {
      newS = 1;
      newD = Math.min(1, D + 0.15);
      lapsesInc = 1;
    }

    const log2inv = Math.log2(1 / targetR);
    const intervalRaw = newS * log2inv;
    const interval = Math.max(1, Math.min(365, Math.round(intervalRaw)));

    const now = new Date();
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + interval);
    nextDate.setHours(23, 59, 0, 0);

    return {
      S: newS,
      D: newD,
      interval,
      repetitions: (score >= 3 ? (card.repetitions || 0) + 1 : 0),
      lapses: (card.lapses || 0) + lapsesInc,
      nextReview: nextDate.toISOString(),
      lastScore: score,
      lastReviewed: now.toISOString()
    };
  }

  /* ===== 数据层 ===== */
  function loadCards() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
  }

  function saveCards(cards) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }

  function loadSettings() {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) { return DEFAULT_SETTINGS; }
  }

  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  /* ===== 数据迁移 ===== */
  function migrateIfNeeded() {
    const ver = localStorage.getItem(VERSION_KEY);
    if (ver == CURRENT_VERSION) return;

    const cards = loadCards();
    let changed = false;
    cards.forEach(c => {
      if (!c._v || c._v < 2) {
        c.D = (c.mode === 'memory') ? 0.3 : 0.6;
        c.S = (c.interval && c.interval > 0) ? c.interval : 1;
        c.hints = c.hints || [];
        c.textbookRef = c.textbookRef || '';
        c.tags = c.tags || [];
        c.reviewHistory = c.reviewHistory || [];
        c._v = 2;
        changed = true;
      }
    });
    if (changed) saveCards(cards);
    localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
  }

  /* ===== 统计 ===== */
  function getStats() {
    const cards = loadCards();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const due = cards.filter(c => new Date(c.nextReview) <= today);
    const newToday = cards.filter(c => (c.repetitions || 0) === 0);
    const mastered = cards.filter(c => c.interval >= 30);
    const total = cards.length;

    const byCategory = {};
    cards.forEach(c => {
      const cat = c.category || '未分类';
      if (!byCategory[cat]) byCategory[cat] = { total: 0, mastered: 0, due: 0, lapses: 0, avgD: 0 };
      const g = byCategory[cat];
      g.total++;
      if (c.interval >= 30) g.mastered++;
      if (new Date(c.nextReview) <= today) g.due++;
      g.lapses += c.lapses || 0;
      g.avgD = ((g.avgD * (g.total - 1)) + (c.D || 0.5)) / g.total;
    });

    return { total, due: due.length, newToday: newToday.length, mastered: mastered.length, byCategory };
  }

  /* ===== CRUD ===== */
  function addCard(front, back, category, memo, mode) {
    const cards = loadCards();
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const card = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      front, back, category: category || '未分类',
      memo: memo || '',
      mode: mode || 'memory',
      createdAt: now.toISOString(),
      nextReview: tomorrow.toISOString(),
      interval: 0,
      D: (mode === 'memory') ? 0.3 : 0.6,
      S: 1,
      repetitions: 0,
      lapses: 0,
      lastScore: null,
      lastReviewed: null,
      hints: [],
      textbookRef: '',
      tags: [],
      reviewHistory: [],
      _v: 2
    };
    cards.push(card);
    saveCards(cards);
    return card;
  }

  function addCardsBulk(cardsData) {
    const cards = loadCards();
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const added = [];
    cardsData.forEach(d => {
      const mode = d.mode || 'memory';
      const card = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        front: d.front || '',
        back: d.back || '',
        category: d.category || '未分类',
        memo: d.memo || '',
        mode,
        createdAt: now.toISOString(),
        nextReview: tomorrow.toISOString(),
        interval: 0,
        D: mode === 'memory' ? 0.3 : 0.6,
        S: 1,
        repetitions: 0,
        lapses: 0,
        lastScore: null,
        lastReviewed: null,
        hints: d.hints || [],
        textbookRef: d.textbookRef || '',
        tags: d.tags || [],
        reviewHistory: [],
        _v: 2
      };
      cards.push(card);
      added.push(card);
    });
    saveCards(cards);
    return added;
  }

  function updateCard(id, updates) {
    const cards = loadCards();
    const idx = cards.findIndex(c => c.id === id);
    if (idx === -1) return null;
    cards[idx] = { ...cards[idx], ...updates };
    saveCards(cards);
    return cards[idx];
  }

  function reviewCard(id, score) {
    const cards = loadCards();
    const idx = cards.findIndex(c => c.id === id);
    if (idx === -1) return null;
    const updated = calcNextReview(score, cards[idx]);
    cards[idx] = { ...cards[idx], ...updated };
    if (!cards[idx].reviewHistory) cards[idx].reviewHistory = [];
    cards[idx].reviewHistory.push({
      date: cards[idx].lastReviewed,
      score,
      R: calcRetrievability(0, cards[idx].S)
    });
    if (cards[idx].reviewHistory.length > 200) {
      cards[idx].reviewHistory = cards[idx].reviewHistory.slice(-200);
    }
    saveCards(cards);
    logReview(cards[idx]);
    return cards[idx];
  }

  function deleteCard(id) {
    const cards = loadCards().filter(c => c.id !== id);
    saveCards(cards);
  }

  function getCardsByCategory(category) {
    return loadCards().filter(c => c.category === category);
  }

  function getDueCards(category) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cards = category ? getCardsByCategory(category) : loadCards();
    return cards.filter(c => new Date(c.nextReview) <= today)
      .sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
  }

  function getAllCategories() {
    const cards = loadCards();
    return [...new Set(cards.map(c => c.category))].sort();
  }

  /* ===== 搜索 ===== */
  function searchCards(query) {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return loadCards().filter(c =>
      (c.front && c.front.toLowerCase().includes(q)) ||
      (c.back && c.back.toLowerCase().includes(q)) ||
      (c.memo && c.memo.toLowerCase().includes(q)) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(q))) ||
      (c.textbookRef && c.textbookRef.toLowerCase().includes(q))
    );
  }

  /* ===== 复习日志 ===== */
  function logReview(card) {
    try {
      const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      logs.push({
        cardId: card.id,
        front: card.front,
        score: card.lastScore,
        interval: card.interval,
        timestamp: card.lastReviewed,
        category: card.category,
        D: card.D,
        S: card.S
      });
      if (logs.length > 5000) logs.splice(0, logs.length - 5000);
      localStorage.setItem(LOG_KEY, JSON.stringify(logs));
    } catch(e) {}
  }

  function getReviewHistory(days = 7) {
    try {
      const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      return logs.filter(l => new Date(l.timestamp) >= cutoff);
    } catch(e) { return []; }
  }

  function getRetentionStats() {
    const cards = loadCards();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let totalR = 0;
    let countR = 0;
    cards.forEach(c => {
      if (c.repetitions > 0 && c.S > 0 && c.lastReviewed) {
        const last = new Date(c.lastReviewed);
        const elapsed = (today - last) / (1000 * 60 * 60 * 24);
        const R = calcRetrievability(elapsed, c.S);
        totalR += R;
        countR++;
      }
    });
    return { avgRetention: countR > 0 ? totalR / countR : 0, trackedCards: countR };
  }

  /* ===== 数据导入/导出 ===== */
  function exportData() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function importData(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!Array.isArray(data)) return false;
      saveCards(data);
      localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
      return true;
    } catch(e) { return false; }
  }

  /* ===== 预设化学知识库 ===== */
  function getPresetCards(categoryKey) {
    const allPresets = {
      '01-基本概念': getBasicConceptCards(),
      '02-元素化合物': getElementCompoundCards(),
      '03-反应原理': getReactionPrincipleCards(),
      '04-有机化学': getOrganicCards(),
      '05-物质结构': getStructureCards(),
      '06-化学实验': getExperimentCards()
    };
    return allPresets[categoryKey] || [];
  }

  function getBasicConceptCards() {
    return [
      { front: '物质的量的定义', back: '表示含有一定数目粒子的集合体的物理量，符号 n，单位 mol', category: '01-基本概念', mode: 'memory', memo: '核心物理量之一', tags: ['物质的量', 'SI'] },
      { front: '阿伏加德罗常数 NA', back: '1 mol 任何粒子所含的粒子数，NA ≈ 6.02×10²³ mol⁻¹', category: '01-基本概念', mode: 'memory', memo: '近似值 6.02×10²³', tags: ['物质的量'] },
      { front: '摩尔质量 M', back: '单位物质的量的物质所具有的质量，单位 g/mol。数值上等于相对原子/分子质量', category: '01-基本概念', mode: 'memory', tags: ['物质的量'] },
      { front: '气体摩尔体积 Vm', back: '单位物质的量的气体所占的体积。标准状况(0℃,101kPa)下，Vm ≈ 22.4 L/mol', category: '01-基本概念', mode: 'memory', memo: '标况下 22.4 L/mol，只适用于气体', tags: ['物质的量'] },
      { front: '物质的量浓度 c', back: '单位体积溶液里所含溶质 B 的物质的量，cB = nB/V，单位 mol/L', category: '01-基本概念', mode: 'memory', tags: ['物质的量'] },
      { front: 'n = N/NA', back: '物质的量 = 粒子数 / 阿伏加德罗常数', category: '01-基本概念', mode: 'memory', tags: ['物质的量', '公式'] },
      { front: 'n = m/M', back: '物质的量 = 质量 / 摩尔质量', category: '01-基本概念', mode: 'memory', tags: ['物质的量', '公式'] },
      { front: 'n = V/Vm（气体）', back: '物质的量 = 气体体积 / 气体摩尔体积（标况下 Vm = 22.4 L/mol）', category: '01-基本概念', mode: 'memory', tags: ['物质的量', '公式'] },
      { front: 'n = cV（溶液）', back: '物质的量 = 物质的量浓度 × 溶液体积', category: '01-基本概念', mode: 'memory', tags: ['物质的量', '公式'] },
      { front: '电解质 vs 非电解质', back: '电解质：在水溶液或熔融状态下能导电的化合物（酸、碱、盐、金属氧化物）。非电解质：在上述条件下都不能导电的化合物（蔗糖、乙醇、CO₂、SO₂、NH₃）', category: '01-基本概念', mode: 'memory', memo: '单质和混合物既不是电解质也不是非电解质', tags: ['离子反应'] },
      { front: '强电解质 vs 弱电解质', back: '强电解质：完全电离（强酸、强碱、大多数盐）。弱电解质：部分电离（弱酸、弱碱、水）', category: '01-基本概念', mode: 'memory', tags: ['离子反应'] },
      { front: '四大强酸', back: 'H₂SO₄、HCl、HNO₃、HClO₄', category: '01-基本概念', mode: 'memory', memo: '硫盐硝高', tags: ['离子反应'] },
      { front: '四大强碱', back: 'NaOH、KOH、Ca(OH)₂、Ba(OH)₂', category: '01-基本概念', mode: 'memory', memo: '钠钾钙钡', tags: ['离子反应'] },
      { front: '离子方程式的书写步骤', back: '写（写化学方程式）→ 拆（可溶性强电解质拆成离子）→ 删（删去两边相同的离子）→ 查（检查原子守恒和电荷守恒）', category: '01-基本概念', mode: 'memory', memo: '写拆删查', tags: ['离子反应'] },
      { front: '离子共存的判断', back: '看颜色（Cu²⁺蓝/Fe³⁺黄/Fe²⁺浅绿/MnO₄⁻紫红）→ 看酸碱性（H⁺/OH⁻）→ 看反应（沉淀/气体/弱电解质/氧化还原/络合/双水解）', category: '01-基本概念', mode: 'memory', tags: ['离子反应'] },
      { front: '氧化还原反应本质', back: '有电子转移（得失或偏移）的反应。特征：化合价变化。口诀：升失氧（还原剂），降得还（氧化剂）', category: '01-基本概念', mode: 'memory', memo: '升失氧还，降得还氧', tags: ['氧化还原'] },
      { front: '常见氧化剂', back: 'Cl₂、O₂、浓 H₂SO₄、HNO₃、KMnO₄(H⁺)、H₂O₂、Fe³⁺、NaClO', category: '01-基本概念', mode: 'memory', tags: ['氧化还原'] },
      { front: '常见还原剂', back: 'Al、Zn、Fe；C、H₂、CO、SO₂、H₂S；S²⁻、I⁻、Fe²⁺、SO₃²⁻', category: '01-基本概念', mode: 'memory', tags: ['氧化还原'] },
      { front: '氧化还原反应配平口诀', back: '标化合价 → 找升降 → 求最小公倍数 → 配系数 → 检查氧氢', category: '01-基本概念', mode: 'memory', memo: '标找求配查', tags: ['氧化还原'] },
      { front: '元素周期表结构', back: '7 个周期（1-3 短周期，4-7 长周期），16 个族（7 主族、7 副族、1 VIII 族、1 0 族）', category: '01-基本概念', mode: 'memory', tags: ['周期表'] },
      { front: '同周期递变规律', back: '从左→右：原子半径↓，金属性↓，非金属性↑，最高价氧化物水化物酸性↑碱性↓，气态氢化物稳定性↑', category: '01-基本概念', mode: 'memory', tags: ['周期表'] },
      { front: '同主族递变规律', back: '从上→下：原子半径↑，金属性↑，非金属性↓，最高价氧化物水化物酸性↓碱性↑，气态氢化物稳定性↓', category: '01-基本概念', mode: 'memory', tags: ['周期表'] },
      { front: '化合价口诀', back: '一价氢氯钾钠银，二价氧钙钡镁锌，三铝四硅五氮磷，二三铁二四碳，二四六硫都齐全，铜汞二价最常见', category: '01-基本概念', mode: 'memory', memo: '经典化合价口诀', tags: ['化合价'] },
      { front: '分散系分类', back: '溶液（d<1nm）、胶体（1-100nm）、浊液（d>100nm）', category: '01-基本概念', mode: 'memory', tags: ['分散系'] },
      { front: '焰色反应', back: '钠(Na)：黄色；钾(K)：紫色（透过蓝色钴玻璃观察）；钙(Ca)：砖红色；铜(Cu)：绿色', category: '01-基本概念', mode: 'memory', memo: 'Na黄K紫Ca砖红Cu绿', tags: ['实验现象'] },
      { front: '阿伏加德罗定律', back: '同温同压下，相同体积的任何气体含有相同数目的分子。推论：同温同压下，气体体积比 = 物质的量比 = 分子数比。同温同容下，压强比 = 物质的量比', category: '01-基本概念', mode: 'memory', memo: '三同定一同', tags: ['物质的量'] },
      { front: '胶体的性质', back: '丁达尔效应（光学性质，区分胶体和溶液）；电泳（胶粒带电，在外电场下定向移动）；聚沉（加电解质/加热/加相反电荷胶体）；渗析（提纯胶体，半透膜分离小分子）', category: '01-基本概念', mode: 'memory', memo: '丁达电泳聚沉渗析', tags: ['分散系'] },
      { front: '电子式书写方法', back: '用小黑点或叉号表示最外层电子的式子。金属阳离子直接用离子符号；阴离子加方括号标电荷；共价化合物共用电子对；离子化合物阴阳离子间用电子转移表示', category: '01-基本概念', mode: 'memory', tags: ['化学键'] },
      { front: '8电子稳定结构的判断', back: '主族元素：|化合价| + 最外层电子数 = 8 则满足 8 电子稳定结构（H 为 2）。注意：BF₃ 中 B 不满足（6 电子）、PCl₅ 中 P 不满足（10 电子）、SO₂ 中 S 不满足', category: '01-基本概念', mode: 'memory', memo: '判断公式：|化合价| + 最外层电子 = 8', tags: ['化学键'] },
      { front: '氧化还原反应的本质与判断方法', back: '本质：有电子转移（得失或偏移）。判断依据：化合价发生变化。口诀：升（化合价升高）—失（失电子）—氧（被氧化）—还（作还原剂）；降—得—还—氧。氧化剂具有氧化性，被还原，发生还原反应，得到还原产物。电子转移数 = 化合价变化值 × 原子个数', category: '01-基本概念', mode: 'understanding', hints: ['电子转移是氧化还原反应的实质', '化合价变化是判断依据', '升失氧还：还原剂被氧化', '降得还氧：氧化剂被还原', '会计算电子转移数'], tags: ['氧化还原'] },
      { front: '离子方程式书写与离子共存判断', back: '书写步骤：写（化学方程式）→拆（可溶性强电解质拆成离子）→删（删两边相同离子）→查（原子守恒+电荷守恒）。离子共存判断流程：看颜色（Cu²⁺蓝/Fe³⁺黄等）→看酸碱环境→看是否反应（沉淀/气体/弱电解质/氧化还原/络合/双水解）', category: '01-基本概念', mode: 'understanding', hints: ['离子方程式四步法：写拆删查', '哪些物质不能拆：单质、气体、沉淀、弱电解质、氧化物', '离子共存需检查多个维度', '有色离子的颜色需要记住'], tags: ['离子反应'] },
    ];
  }

  function getElementCompoundCards() {
    return [
      { front: '钠的物理性质', back: '银白色、质软（可用刀切）、密度比水小（0.97 g/cm³）、熔点低（97.8℃）、良好导电导热', category: '02-元素化合物', mode: 'memory' },
      { front: '钠与氧气反应（常温）', back: '4Na + O₂ = 2Na₂O（白色，切面很快变暗）', category: '02-元素化合物', mode: 'memory' },
      { front: '钠在空气中燃烧', back: '2Na + O₂ —点燃→ Na₂O₂（淡黄色固体，火焰黄色）', category: '02-元素化合物', mode: 'memory', memo: '产物是过氧化钠不是氧化钠' },
      { front: '钠与水反应现象', back: '浮（密度小于水）、熔（熔点低、放热熔化）、游（产生气体推动）、响（反应剧烈）、红（生成 NaOH 使酚酞变红）', category: '02-元素化合物', mode: 'memory', memo: '浮熔游响红' },
      { front: '钠与水反应方程式', back: '2Na + 2H₂O = 2NaOH + H₂↑', category: '02-元素化合物', mode: 'memory' },
      { front: '钠与CuSO₄溶液反应', back: '2Na + 2H₂O = 2NaOH + H₂↑，CuSO₄ + 2NaOH = Cu(OH)₂↓ + Na₂SO₄。总：2Na + 2H₂O + CuSO₄ = Cu(OH)₂↓ + Na₂SO₄ + H₂↑', category: '02-元素化合物', mode: 'memory', memo: '钠先与水反应，生成的碱再与盐反应' },
      { front: '钠的保存', back: '保存在煤油或石蜡油中（密度比煤油大，比水小）', category: '02-元素化合物', mode: 'memory' },
      { front: '钠在空气中的变化过程', back: 'Na（银白）→ Na₂O（变暗）→ NaOH（白色固体）→ NaOH 潮解（表面变湿）→ Na₂CO₃·10H₂O（白色块状）→ Na₂CO₃（白色粉末）', category: '02-元素化合物', mode: 'memory', memo: 'Na→Na₂O→NaOH→Na₂CO₃·10H₂O→Na₂CO₃' },
      { front: 'Na₂O 的性质', back: '白色固体，碱性氧化物。Na₂O + H₂O = 2NaOH，Na₂O + CO₂ = Na₂CO₃', category: '02-元素化合物', mode: 'memory' },
      { front: 'Na₂O₂ 的性质', back: '淡黄色固体，过氧化物（不属于碱性氧化物）。O 为 -1 价。强氧化性，可用于漂白、消毒、供氧剂', category: '02-元素化合物', mode: 'memory', memo: 'Na₂O₂ 中阴阳离子个数比 1:2' },
      { front: 'Na₂O₂ 与 H₂O 反应', back: '2Na₂O₂ + 2H₂O = 4NaOH + O₂↑', category: '02-元素化合物', mode: 'memory' },
      { front: 'Na₂O₂ 与 CO₂ 反应', back: '2Na₂O₂ + 2CO₂ = 2Na₂CO₃ + O₂（供氧剂的原理）', category: '02-元素化合物', mode: 'memory' },
      { front: 'Na₂O₂ 与 SO₂ 反应', back: 'Na₂O₂ + SO₂ = Na₂SO₄（注意：不是生成 Na₂SO₃ 和 O₂）', category: '02-元素化合物', mode: 'memory', memo: '特殊反应，不是复分解' },
      { front: 'Na₂CO₃ 俗称、性质', back: '纯碱、苏打。白色粉末，易溶于水，水溶液呈碱性（水解）。热稳定性好，受热难分解', category: '02-元素化合物', mode: 'memory' },
      { front: 'NaHCO₃ 俗称、性质', back: '小苏打。白色晶体，易溶于水（溶解度小于 Na₂CO₃），水溶液呈弱碱性。受热易分解：2NaHCO₃ —△→ Na₂CO₃ + H₂O + CO₂↑', category: '02-元素化合物', mode: 'memory' },
      { front: 'Na₂CO₃ 与 NaHCO₃ 鉴别', back: '加热法（NaHCO₃ 分解产生 CO₂ 使澄清石灰水变浑浊）；加酸法（NaHCO₃ 反应更剧烈）；测 pH 法（同浓度 Na₂CO₃ 碱性更强）', category: '02-元素化合物', mode: 'memory' },
      { front: '侯氏制碱法', back: '向饱和食盐水中通入 NH₃ 和 CO₂，生成 NaHCO₃ 沉淀（溶解度小），过滤后加热得 Na₂CO₃。NaCl + NH₃ + CO₂ + H₂O = NaHCO₃↓ + NH₄Cl，2NaHCO₃ —△→ Na₂CO₃ + H₂O + CO₂↑', category: '02-元素化合物', mode: 'memory' },

      { front: '铝的物理性质', back: '银白色金属，密度小（2.7 g/cm³，轻金属），延展性好，导电导热性好', category: '02-元素化合物', mode: 'memory' },
      { front: '铝的两性（与酸反应）', back: '2Al + 6HCl = 2AlCl₃ + 3H₂↑', category: '02-元素化合物', mode: 'memory' },
      { front: '铝的两性（与碱反应）', back: '2Al + 2NaOH + 2H₂O = 2NaAlO₂ + 3H₂↑（或 2Al + 2NaOH + 6H₂O = 2Na[Al(OH)₄] + 3H₂↑）', category: '02-元素化合物', mode: 'memory', memo: '铝是唯一既能与酸又能与碱反应放出 H₂ 的金属' },
      { front: '铝的钝化', back: '常温下 Al 在浓 H₂SO₄、浓 HNO₃ 中发生钝化（形成致密氧化膜），可用铝制容器盛装', category: '02-元素化合物', mode: 'memory' },
      { front: '铝热反应', back: '2Al + Fe₂O₃ —高温→ 2Fe + Al₂O₃（大量放热，用于焊接铁轨、冶炼难熔金属）', category: '02-元素化合物', mode: 'memory', memo: 'Al 和 Fe₂O₃ 的混合物叫铝热剂' },
      { front: 'Al₂O₃ 的两性', back: '与酸：Al₂O₃ + 6HCl = 2AlCl₃ + 3H₂O。与碱：Al₂O₃ + 2NaOH = 2NaAlO₂ + H₂O', category: '02-元素化合物', mode: 'memory' },
      { front: 'Al(OH)₃ 的两性', back: '与酸：Al(OH)₃ + 3HCl = AlCl₃ + 3H₂O。与碱：Al(OH)₃ + NaOH = NaAlO₂ + 2H₂O', category: '02-元素化合物', mode: 'memory' },
      { front: 'Al(OH)₃ 的制备（为什么不用强碱）', back: '用氨水：Al₂(SO₄)₃ + 6NH₃·H₂O = 2Al(OH)₃↓ + 3(NH₄)₂SO₄。不用 NaOH 是因为 Al(OH)₃ 溶于过量强碱', category: '02-元素化合物', mode: 'memory', memo: '实验室用氨水制备 Al(OH)₃' },
      { front: '明矾净水原理', back: 'KAl(SO₄)₂·12H₂O → Al³⁺ 水解生成 Al(OH)₃ 胶体 → 吸附水中悬浮杂质→沉降', category: '02-元素化合物', mode: 'memory' },
      { front: 'Al³⁺ 与 AlO₂⁻ 共存问题', back: 'Al³⁺ + 3AlO₂⁻ + 6H₂O = 4Al(OH)₃↓（双水解反应，不能大量共存）', category: '02-元素化合物', mode: 'memory' },

      { front: '铁与氧气反应', back: '3Fe + 2O₂ —点燃→ Fe₃O₄（剧烈燃烧，火星四射，生成黑色固体）', category: '02-元素化合物', mode: 'memory', memo: '生成 Fe₃O₄ 不是 Fe₂O₃' },
      { front: '铁与水蒸气反应', back: '3Fe + 4H₂O(g) —高温→ Fe₃O₄ + 4H₂↑', category: '02-元素化合物', mode: 'memory' },
      { front: '铁与氯气反应', back: '2Fe + 3Cl₂ —点燃→ 2FeCl₃（生成 Fe³⁺，与 Cl₂ 的量无关）', category: '02-元素化合物', mode: 'memory', memo: 'Cl₂ 强氧化性，直接把 Fe 氧化到 Fe³⁺' },
      { front: '铁与硫反应', back: 'Fe + S —△→ FeS（生成 FeS，S 氧化性较弱，只能将 Fe 氧化到 Fe²⁺）', category: '02-元素化合物', mode: 'memory' },
      { front: 'Fe₂O₃ 的性质', back: '红棕色粉末（铁锈主要成分），俗称铁红。与酸：Fe₂O₃ + 6HCl = 2FeCl₃ + 3H₂O。用作红色颜料', category: '02-元素化合物', mode: 'memory' },
      { front: 'FeO 的性质', back: '黑色粉末。FeO + 2HCl = FeCl₂ + H₂O。不稳定，在空气中加热被氧化为 Fe₂O₃', category: '02-元素化合物', mode: 'memory' },
      { front: 'Fe₃O₄', back: '黑色晶体，俗称磁性氧化铁。有磁性的铁的氧化物。Fe₃O₄ 可写成 FeO·Fe₂O₃', category: '02-元素化合物', mode: 'memory' },
      { front: 'Fe(OH)₂ 的制备与性质', back: '白色沉淀（FeSO₄ + 2NaOH = Fe(OH)₂↓ + Na₂SO₄）。极易被氧化：4Fe(OH)₂ + O₂ + 2H₂O = 4Fe(OH)₃（白色→灰绿→红褐色）', category: '02-元素化合物', mode: 'memory', memo: 'Fe(OH)₂ 要隔绝空气制备' },
      { front: 'Fe³⁺ 的检验', back: '加 KSCN 溶液：Fe³⁺ + 3SCN⁻ = Fe(SCN)₃（血红色）', category: '02-元素化合物', mode: 'memory' },
      { front: 'Fe²⁺ 的检验', back: '加 KSCN 无现象，再加氯水（或 H₂O₂）变红。或加铁氰化钾 K₃[Fe(CN)₆] 产生蓝色沉淀', category: '02-元素化合物', mode: 'memory' },
      { front: 'Fe²⁺ 与 Fe³⁺ 转化', back: 'Fe²⁺ —(Cl₂/O₂/H₂O₂)→ Fe³⁺（氧化）；Fe³⁺ —(Fe/Cu/I⁻)→ Fe²⁺（还原）', category: '02-元素化合物', mode: 'memory' },
      { front: '铜与 FeCl₃ 反应', back: 'Cu + 2FeCl₃ = CuCl₂ + 2FeCl₂（FeCl₃ 腐蚀铜制印刷电路板）', category: '02-元素化合物', mode: 'memory' },

      { front: 'Cl₂ 的物理性质', back: '黄绿色有刺激性气味气体，密度比空气大，有毒，易液化。1 体积水约溶解 2 体积 Cl₂', category: '02-元素化合物', mode: 'memory' },
      { front: 'Cl₂ 与 H₂O 反应', back: 'Cl₂ + H₂O ⇌ HCl + HClO（次氯酸，弱酸，有漂白性、强氧化性）', category: '02-元素化合物', mode: 'memory' },
      { front: '氯水的成分', back: '三分子（Cl₂、H₂O、HClO）；三离子（H⁺、Cl⁻、ClO⁻、OH⁻ 少量）', category: '02-元素化合物', mode: 'memory', memo: '新制氯水有漂白性（HClO），久置氯水变为稀盐酸' },
      { front: 'HClO 的性质', back: '弱酸（酸性比 H₂CO₃ 弱），不稳定（2HClO —光照→ 2HCl + O₂↑），强氧化性（杀菌消毒、漂白）', category: '02-元素化合物', mode: 'memory' },
      { front: 'Cl₂ 与 NaOH 反应', back: 'Cl₂ + 2NaOH = NaCl + NaClO + H₂O（用于制漂白液、处理尾气）', category: '02-元素化合物', mode: 'memory' },
      { front: '制漂白粉', back: '2Cl₂ + 2Ca(OH)₂ = CaCl₂ + Ca(ClO)₂ + 2H₂O。漂白粉有效成分为 Ca(ClO)₂', category: '02-元素化合物', mode: 'memory' },
      { front: '漂白粉失效原理', back: 'Ca(ClO)₂ + CO₂ + H₂O = CaCO₃↓ + 2HClO（强酸制弱酸），2HClO —光照→ 2HCl + O₂↑', category: '02-元素化合物', mode: 'memory' },
      { front: 'Cl⁻ 的检验', back: '先加稀 HNO₃ 酸化（排除 CO₃²⁻ 等干扰），再加 AgNO₃ 溶液 → 产生白色沉淀 AgCl', category: '02-元素化合物', mode: 'memory', memo: '一定要先加酸酸化' },
      { front: '溴 Br₂ 的性质', back: '深红棕色液体，易挥发（有刺激性气味），密度比水大。少量溴保存在棕色细口瓶，用水液封', category: '02-元素化合物', mode: 'memory' },
      { front: '碘 I₂ 的性质', back: '紫黑色固体，易升华（遇冷凝华），淀粉遇 I₂ 变蓝。碘酒就是 I₂ 的酒精溶液', category: '02-元素化合物', mode: 'memory' },

      { front: 'SO₂ 的物理性质', back: '无色有刺激性气味气体，密度比空气大，易溶于水（1:40），有毒', category: '02-元素化合物', mode: 'memory' },
      { front: 'SO₂ 的化学性质', back: '酸性氧化物（SO₂ + H₂O ⇌ H₂SO₃）：还原性（使 KMnO₄/溴水褪色）：氧化性（2H₂S + SO₂ = 3S↓ + 2H₂O）：漂白性（使品红褪色，加热恢复）', category: '02-元素化合物', mode: 'memory', memo: 'SO₂ 漂白是化合漂白（可逆），Cl₂ 漂白是氧化漂白（不可逆）' },
      { front: 'SO₂ 的催化氧化', back: '2SO₂ + O₂ ⇌ 2SO₃（工业制硫酸核心反应，用 V₂O₅ 作催化剂）', category: '02-元素化合物', mode: 'memory' },
      { front: '浓 H₂SO₄ 的三大特性', back: '吸水性（作干燥剂）、脱水性（使蔗糖碳化变黑）、强氧化性（与 Cu/C 等反应）', category: '02-元素化合物', mode: 'memory', memo: '吸水性→物理变化，脱水性→化学变化' },
      { front: 'Cu 与浓 H₂SO₄ 反应', back: 'Cu + 2H₂SO₄(浓) —△→ CuSO₄ + SO₂↑ + 2H₂O', category: '02-元素化合物', mode: 'memory' },
      { front: 'C 与浓 H₂SO₄ 反应', back: 'C + 2H₂SO₄(浓) —△→ CO₂↑ + 2SO₂↑ + 2H₂O', category: '02-元素化合物', mode: 'memory' },
      { front: 'SO₄²⁻ 的检验', back: '先加稀 HCl 酸化（排除 CO₃²⁻、SO₃²⁻、PO₄³⁻ 干扰），再加 BaCl₂ 溶液 → 产生白色沉淀 BaSO₄', category: '02-元素化合物', mode: 'memory', memo: '先加 HCl 酸化是关键' },

      { front: 'NH₃ 的物理性质', back: '无色有刺激性气味气体，密度比空气小，极易溶于水（1:700），易液化', category: '02-元素化合物', mode: 'memory', memo: '氨的喷泉实验' },
      { front: 'NH₃ 的化学性质', back: '碱性（NH₃ + H⁺ = NH₄⁺）：还原性（催化氧化：4NH₃ + 5O₂ —催化剂/△→ 4NO + 6H₂O）：与酸反应生成铵盐', category: '02-元素化合物', mode: 'memory' },
      { front: '氨水的成分', back: '三分子（NH₃、H₂O、NH₃·H₂O）；三离子（NH₄⁺、OH⁻、H⁺ 少量）。NH₃·H₂O 是弱碱', category: '02-元素化合物', mode: 'memory' },
      { front: 'NH₃ 的实验室制法', back: '2NH₄Cl + Ca(OH)₂ —△→ CaCl₂ + 2NH₃↑ + 2H₂O。用向下排空气法收集，用红色石蕊试纸验满', category: '02-元素化合物', mode: 'memory' },
      { front: 'NH₄⁺ 的检验', back: '加浓 NaOH 溶液加热，产生使湿润红色石蕊试纸变蓝的气体（NH₃）', category: '02-元素化合物', mode: 'memory' },
      { front: 'HNO₃ 的性质', back: '强酸，强氧化性。无论浓稀都有氧化性。浓 HNO₃ 与 Cu：Cu + 4HNO₃(浓) = Cu(NO₃)₂ + 2NO₂↑ + 2H₂O。稀 HNO₃ 与 Cu：3Cu + 8HNO₃(稀) = 3Cu(NO₃)₂ + 2NO↑ + 4H₂O', category: '02-元素化合物', mode: 'memory', memo: '浓硝酸→NO₂，稀硝酸→NO' },
      { front: '铝、铁在浓 HNO₃ 中', back: '常温下钝化（形成致密氧化膜），可用铝/铁制容器盛装浓 HNO₃', category: '02-元素化合物', mode: 'memory' },
      { front: '王水', back: '浓 HNO₃ : 浓 HCl = 1:3（体积比），能溶解金和铂', category: '02-元素化合物', mode: 'memory' },
      { front: 'NO 与 NO₂', back: 'NO：无色气体，有毒，不溶于水，与 O₂ 反应生成 NO₂。NO₂：红棕色气体，有毒，有刺激性气味，与 H₂O 反应：3NO₂ + H₂O = 2HNO₃ + NO', category: '02-元素化合物', mode: 'memory' },
      { front: 'NO₂ 与 NaOH 反应（尾气处理）', back: 'NO₂ + NO + 2NaOH = 2NaNO₂ + H₂O；2NO₂ + 2NaOH = NaNO₃ + NaNO₂ + H₂O', category: '02-元素化合物', mode: 'memory' },

      { front: 'SiO₂ 的性质', back: '酸性氧化物。SiO₂ + 2NaOH = Na₂SiO₃ + H₂O；SiO₂ + 4HF = SiF₄↑ + 2H₂O（氢氟酸雕刻玻璃）。不溶于水', category: '02-元素化合物', mode: 'memory' },
      { front: '硅的用途', back: '半导体材料（太阳能电池板）、光导纤维（SiO₂）、水泥/玻璃/陶瓷（硅酸盐材料）', category: '02-元素化合物', mode: 'memory' },
      { front: '光导纤维成分', back: 'SiO₂（二氧化硅），不是硅单质', category: '02-元素化合物', mode: 'memory' },
      { front: '水玻璃', back: 'Na₂SiO₃ 的水溶液，黏合剂，耐火材料。盛放碱性溶液的试剂瓶不能用玻璃塞（2NaOH + SiO₂ = Na₂SiO₃ + H₂O 会粘连）', category: '02-元素化合物', mode: 'memory' },

      { front: '碱金属元素递变规律', back: '从上到下：原子半径↑，熔沸点↓，金属性↑，单质与水/酸反应剧烈程度↑', category: '02-元素化合物', mode: 'memory', tags: ['周期表'] },
      { front: '卤族元素递变规律', back: '从上到下：原子半径↑，熔沸点↑，非金属性↓，单质氧化性↓，阴离子还原性↑', category: '02-元素化合物', mode: 'memory', tags: ['周期表'] },

      /* 新增：金属材料 */
      { front: '合金的定义与特性', back: '合金是由两种或多种金属（或金属与非金属）熔合而成的具有金属特性的物质。特性：硬度一般比成分金属大，熔点一般比成分金属低', category: '02-元素化合物', mode: 'memory', tags: ['金属'] },
      { front: '铝合金的用途', back: '密度小、强度大、耐腐蚀。用于飞机、汽车、门窗、电线电缆等', category: '02-元素化合物', mode: 'memory', tags: ['金属'] },
      { front: '铜的常见化合物颜色', back: 'CuO（黑色）、Cu₂O（砖红色）、CuSO₄·5H₂O（蓝色）、Cu(OH)₂（蓝色沉淀）、CuCl₂（蓝绿色溶液）、CuS（黑色）', category: '02-元素化合物', mode: 'memory', memo: '铜的化合物颜色多样', tags: ['金属', '颜色'] },

      /* 新增：海水资源 */
      { front: '海水提溴（工业流程）', back: '浓缩→氧化（Cl₂ + 2Br⁻ = Br₂ + 2Cl⁻）→吹出→吸收（SO₂ + Br₂ + 2H₂O = H₂SO₄ + 2HBr）→再氧化（Cl₂ + 2Br⁻ = Br₂）→蒸馏', category: '02-元素化合物', mode: 'memory', memo: '浓缩-氧化-吹出-吸收-再氧化' },
      { front: '海水提碘（工业流程）', back: '海带→灼烧→浸泡→过滤→氧化（H₂O₂ + 2I⁻ + 2H⁺ = I₂ + 2H₂O）→萃取→蒸馏', category: '02-元素化合物', mode: 'memory', memo: '烧-泡-滤-氧-萃-蒸' },
      { front: '金属冶炼常见方法', back: '电解法（K/Ca/Na/Mg/Al）：电解熔融盐或氧化物。热还原法（Zn/Fe/Cu）：C/CO/H₂/Al 还原氧化物。热分解法（Hg/Ag）：加热分解氧化物', category: '02-元素化合物', mode: 'memory', memo: '钾钙钠镁铝电解，锌铁铜等热还原' },
    ];
  }

  function getReactionPrincipleCards() {
    return [
      { front: '放热反应 vs 吸热反应', back: '放热反应：ΔH<0，反应物总能量>生成物总能量（燃烧、中和、金属与酸、大多数化合、铝热）。吸热反应：ΔH>0，反应物总能量<生成物总能量（大多数分解、盐类水解、C+CO₂、Ba(OH)₂·8H₂O+NH₄Cl）', category: '03-反应原理', mode: 'memory' },
      { front: 'ΔH 的计算（键能法）', back: 'ΔH = 反应物总键能 - 生成物总键能', category: '03-反应原理', mode: 'memory' },
      { front: 'ΔH 的计算（总能量法）', back: 'ΔH = 生成物总能量 - 反应物总能量', category: '03-反应原理', mode: 'memory' },
      { front: '盖斯定律', back: '化学反应不论一步完成还是分步完成，其反应热相同。ΔH = ΔH₁ + ΔH₂ + ...（反应热与路径无关）', category: '03-反应原理', mode: 'memory' },
      { front: '热化学方程式书写要点', back: '①标状态(s/l/g/aq)；②ΔH 与方程式中系数对应；③ΔH 单位 kJ/mol；④注明温度和压强（25℃,101kPa 可不写）；⑤可逆反应用 ⇌，ΔH 是指完全反应', category: '03-反应原理', mode: 'memory' },
      { front: '燃烧热定义', back: '1 mol 纯物质完全燃烧生成指定产物（H₂O 为液态、C 为 CO₂ 等）时所放出的热量', category: '03-反应原理', mode: 'memory' },
      { front: '中和热定义', back: '稀溶液中，强酸与强碱发生中和反应生成 1 mol 水时的反应热。ΔH = -57.3 kJ/mol', category: '03-反应原理', mode: 'memory', memo: '弱酸/弱碱的中和热绝对值小于 57.3（电离吸热）' },
      { front: '化学反应速率公式', back: 'v = Δc/Δt（单位：mol/(L·s) 或 mol/(L·min)）。各物质速率之比 = 化学计量数之比', category: '03-反应原理', mode: 'memory' },
      { front: '影响反应速率的因素（内因）', back: '反应物本身的性质（决定因素，如 Na 与水反应比 Mg 剧烈）', category: '03-反应原理', mode: 'memory' },
      { front: '影响反应速率的因素（外因）', back: '①浓度↑→速率↑（固体和纯液体除外）；②温度↑→速率↑（每升高 10℃速率约 2-4 倍）；③压强↑（对有气体反应）→速率↑（实质是浓度↑）；④催化剂→改变速率；⑤其他：接触面积、原电池等', category: '03-反应原理', mode: 'memory' },
      { front: '化学平衡状态特征', back: '逆（可逆反应）、等（正=逆）、动（动态平衡）、定（各组分浓度不变）、变（条件改变→平衡移动）', category: '03-反应原理', mode: 'memory', memo: '逆等动定变' },
      { front: '勒夏特列原理', back: '改变影响平衡的一个条件（浓度、温度、压强），平衡向减弱这种改变的方向移动', category: '03-反应原理', mode: 'memory' },
      { front: '勒夏特列原理—浓度', back: '增大反应物浓度（或减小生成物浓度）→平衡正向移动；减小反应物浓度（或增大生成物浓度）→平衡逆向移动', category: '03-反应原理', mode: 'memory' },
      { front: '勒夏特列原理—温度', back: '升高温度→平衡向吸热方向移动；降低温度→平衡向放热方向移动', category: '03-反应原理', mode: 'memory' },
      { front: '勒夏特列原理—压强', back: '增大压强→平衡向气体体积减小的方向移动；减小压强→平衡向气体体积增大的方向移动。如果反应前后气体分子数相等，压强变化不影响平衡', category: '03-反应原理', mode: 'memory' },
      { front: '化学平衡常数 K', back: '对于 aA + bB ⇌ cC + dD，K = [C]^c[D]^d / [A]^a[B]^b。K 只与温度有关，温度不变 K 不变', category: '03-反应原理', mode: 'memory', memo: 'K 越大，反应进行程度越大' },
      { front: '转化率', back: '转化率 = 已转化的某反应物量 / 该反应物起始量 × 100%。增大一种反应物浓度，其自身转化率降低，另一种反应物浓度转化率升高', category: '03-反应原理', mode: 'memory' },
      { front: '水的离子积 Kw', back: 'Kw = c(H⁺)·c(OH⁻)。25℃时 Kw = 1.0×10⁻¹⁴。升高温度 Kw 增大。适用于所有稀溶液', category: '03-反应原理', mode: 'memory' },
      { front: 'pH 计算', back: 'pH = -lg c(H⁺)。c(H⁺) = 10^(-pH)。室温下：pH<7 酸性，pH=7 中性，pH>7 碱性', category: '03-反应原理', mode: 'memory' },
      { front: '盐类水解规律', back: '谁弱谁水解，谁强显谁性，都弱都水解，越弱越水解，都强不水解。如：强酸弱碱盐（NH₄Cl）显酸性，强碱弱酸盐（CH₃COONa）显碱性', category: '03-反应原理', mode: 'memory' },
      { front: '原电池原理', back: '负极：失电子（氧化反应），电子流出；正极：得电子（还原反应），电子流入。负极→正极（电子通过外电路），内电路：阳离子→正极，阴离子→负极', category: '03-反应原理', mode: 'memory' },
      { front: '原电池电极判断', back: '活泼金属→负极（如 Zn），不活泼金属或导电非金属→正极（Cu、C）。特殊情况：Mg-Al-NaOH 溶液，Al 做负极', category: '03-反应原理', mode: 'memory', memo: '要看电解质环境' },
      { front: '电解池原理', back: '阳极：与电源正极相连，发生氧化反应（阴离子放电）。阴极：与电源负极相连，发生还原反应（阳离子放电）', category: '03-反应原理', mode: 'memory' },
      { front: '阴离子放电顺序', back: 'S²⁻ > I⁻ > Br⁻ > Cl⁻ > OH⁻ > 含氧酸根 (SO₄²⁻/NO₃⁻) > F⁻', category: '03-反应原理', mode: 'memory' },
      { front: '阳离子放电顺序', back: 'Ag⁺ > Cu²⁺ > H⁺(酸) > Fe²⁺ > Zn²⁺ > H⁺(水) > Al³⁺ > Mg²⁺ > Na⁺ > K⁺', category: '03-反应原理', mode: 'memory' },
      { front: '电化学腐蚀—吸氧腐蚀', back: '中性/碱性条件：负极 Fe - 2e⁻ = Fe²⁺；正极 O₂ + 2H₂O + 4e⁻ = 4OH⁻。总：2Fe + O₂ + 2H₂O = 2Fe(OH)₂，继续氧化为铁锈', category: '03-反应原理', mode: 'memory' },
      { front: '电化学腐蚀—析氢腐蚀', back: '酸性条件：负极 Fe - 2e⁻ = Fe²⁺；正极 2H⁺ + 2e⁻ = H₂↑', category: '03-反应原理', mode: 'memory' },
      { front: '金属防护方法', back: '①改变内部结构（如不锈钢）；②覆盖保护层（涂油漆、电镀）；③电化学保护（牺牲阳极法—活泼金属作负极；外加电流法—被保护金属接电源负极）', category: '03-反应原理', mode: 'memory' },
      { front: '沉淀溶解平衡—Ksp', back: '对于 AmBn(s) ⇌ mAⁿ⁺(aq) + nBᵐ⁻(aq)，Ksp = [Aⁿ⁺]ᵐ[Bᵐ⁻]ⁿ。Ksp 只与温度有关', category: '03-反应原理', mode: 'memory' },
      { front: 'Q 与 Ksp 的关系', back: 'Q < Ksp：未饱和（无沉淀/沉淀溶解）；Q = Ksp：饱和；Q > Ksp：过饱和（有沉淀析出）', category: '03-反应原理', mode: 'memory' },
      { front: '沉淀转化的方向', back: '一般来说，沉淀向溶解度更小的方向转化。如 AgCl(白) → AgBr(浅黄) → AgI(黄) → Ag₂S(黑)', category: '03-反应原理', mode: 'memory' },
      { front: '盖斯定律的计算应用', back: '已知：① C(s) + O₂(g) = CO₂(g) ΔH₁；② CO(g) + ½O₂(g) = CO₂(g) ΔH₂。求 C→CO 的 ΔH。答案：ΔH = ΔH₁ - ΔH₂（反应① - 反应②）', category: '03-反应原理', mode: 'understanding', memo: '反应热加减对应方程式加减', tags: ['计算'] },
      { front: '勒夏特列原理的理解与应用', back: '核心：改变影响平衡的一个条件，平衡向减弱这种改变的方向移动。浓度：增大反应物浓度→正向移动；减小生成物浓度→正向移动。温度：升温→向吸热方向移动；降温→向放热方向移动。压强（对有气体反应）：增压→向气体体积减小方向移动。催化剂不影响平衡，只改变到达平衡的时间', category: '03-反应原理', mode: 'understanding', hints: ['平衡移动的方向与条件改变的方向相反', '浓度改变只影响体系中物质的浓度比', '温度改变影响K值（K只与温度有关）', '压强改变本质是浓度改变', '催化剂同等改变正逆反应速率，不影响平衡'], tags: ['化学平衡'] },
      { front: '原电池与电解池的对比分析', back: '原电池：化学能→电能。负极（氧化反应，失电子），正极（还原反应，得电子）。电子由负极经外电路流向正极。电解池：电能→化学能。阳极（氧化反应，与电源正极相连），阴极（还原反应，与电源负极相连）。阴离子移向阳极放电，阳离子移向阴极放电', category: '03-反应原理', mode: 'understanding', hints: ['原电池负极发生氧化，电解池阳极发生氧化', '原电池电子从负极流向正极', '电解池阴离子放电顺序和阳离子放电顺序', '电化学腐蚀的本质是原电池反应'], tags: ['电化学'] },
      { front: '水解常数 Kh', back: 'Kh = Kw / Ka（弱酸强碱盐）或 Kh = Kw / Kb（强酸弱碱盐）。Kh 越大，水解程度越大，溶液碱性（或酸性）越强。Kh 只与温度有关（温度↑→Kw↑→Kh↑）', category: '03-反应原理', mode: 'memory', tags: ['水溶液'] },
      { front: '等效平衡', back: '相同条件下，同一可逆反应，只要起始投料方式不同但达到相同的平衡状态，即为等效平衡。恒温恒容：投料等比（反应前后气体系数和不等）或等量（气体系数和相等）。恒温恒压：投料等比即可', category: '03-反应原理', mode: 'memory', memo: '恒容看量，恒压看比', tags: ['化学平衡'] },
      { front: '化学反应速率常数 k', back: '对于基元反应 aA + bB → 产物，v = k[A]ᵃ[B]ᵇ。k 与浓度无关，与温度和催化剂有关。温度↑→k↑（阿伦尼乌斯公式）。催化剂→降低活化能→k 增大', category: '03-反应原理', mode: 'memory', tags: ['速率'] },
      { front: '活化能与反应速率关系', back: '活化能 Ea 越大，反应越慢。催化剂通过降低活化能提高反应速率。温度升高，分子能量增加，活化分子百分数增大，反应速率加快', category: '03-反应原理', mode: 'memory', tags: ['速率'] },
      { front: '盖斯定律的计算方法', back: '加合法：目标反应 = 已知反应加减组合。关键：①反应式加减时 ΔH 同步加减；②反应式乘以系数时 ΔH 也乘相同系数；③反应逆向时 ΔH 变号。注意消去中间产物', category: '03-反应原理', mode: 'understanding', hints: ['目标反应由已知反应组合得到', 'ΔH 与反应式系数成比例', '中间产物要抵消', '练习：由C→CO₂和CO→CO₂求C→CO'], tags: ['计算'] },
    ];
  }

  function getOrganicCards() {
    return [
      { front: '有机物的分类', back: '按碳骨架：链状有机物、环状有机物（脂环、芳香）。按官能团：烃（烷/烯/炔/芳香烃）、烃的衍生物（卤代烃/醇/酚/醚/醛/酮/羧酸/酯等）', category: '04-有机化学', mode: 'memory' },
      { front: '常见官能团（一）', back: 'C=C（碳碳双键）、C≡C（碳碳三键）、—X（卤素原子）、—OH（羟基）、—O—（醚键）', category: '04-有机化学', mode: 'memory' },
      { front: '常见官能团（二）', back: '—CHO（醛基）、—CO—（羰基）、—COOH（羧基）、—COO—（酯基）、—NH₂（氨基）、—CONH—（酰胺键/肽键）', category: '04-有机化学', mode: 'memory' },
      { front: '烷烃通式', back: 'CnH₂n₊₂（n≥1）。均为饱和烃，只含 C-C 单键和 C-H 键', category: '04-有机化学', mode: 'memory' },
      { front: '烯烃通式', back: 'CnH₂n（n≥2）。含一个 C=C 双键。可发生加成、加聚、氧化反应', category: '04-有机化学', mode: 'memory' },
      { front: '炔烃通式', back: 'CnH₂n₋₂（n≥2）。含一个 C≡C 三键。可发生加成、氧化反应', category: '04-有机化学', mode: 'memory' },
      { front: '苯的同系物通式', back: 'CnH₂n₋₆（n≥6）。含一个苯环。可发生取代（卤代/硝化/磺化）、加成（与 H₂）、侧链氧化', category: '04-有机化学', mode: 'memory' },
      { front: '同分异构体类型', back: '碳链异构（碳骨架不同）、位置异构（官能团位置不同）、官能团异构（官能团种类不同）', category: '04-有机化学', mode: 'memory' },
      { front: '常见官能团异构', back: '烯烃=环烷烃(CnH₂n)；炔烃=二烯烃(CnH₂n₋₂)；醇=醚(CnH₂n₊₂O)；醛=酮(CnH₂nO)；羧酸=酯(CnH₂nO₂)', category: '04-有机化学', mode: 'memory' },
      { front: '烷烃系统命名法', back: '选最长碳链为主链 → 编号使取代基位置和最小 → 写：取代基位置-取代基名 母体名', category: '04-有机化学', mode: 'memory', memo: '选主链→编号→写名称' },
      { front: '同系物', back: '结构相似、分子组成相差一个或多个 CH₂ 的有机物。通式相同，化学性质相似，物理性质递变', category: '04-有机化学', mode: 'memory' },
      { front: '取代反应', back: '有机物中 H 原子被其他原子或原子团取代。类型：卤代、硝化、磺化、酯化、水解、分子间脱水等', category: '04-有机化学', mode: 'memory' },
      { front: '加成反应', back: '不饱和键（C=C、C≡C、C=O、苯环）与 H₂/X₂/HX/H₂O 等发生加成。如：乙烯与溴水反应使其褪色', category: '04-有机化学', mode: 'memory' },
      { front: '消去反应', back: '从有机物分子中脱去一个小分子（H₂O/HX 等）生成不饱和化合物。如：乙醇在浓 H₂SO₄ 170℃ 脱水生成乙烯', category: '04-有机化学', mode: 'memory', memo: '乙醇消去条件：浓 H₂SO₄、170℃' },
      { front: '加聚反应', back: '含 C=C 的单体通过加成方式聚合。如：nCH₂=CH₂ → [CH₂-CH₂]ₙ（聚乙烯）', category: '04-有机化学', mode: 'memory' },
      { front: '缩聚反应', back: '单体间通过缩合脱去小分子（H₂O/HCl）形成高聚物。如：二元酸+二元醇→聚酯+H₂O。氨基酸→蛋白质+H₂O', category: '04-有机化学', mode: 'memory' },
      { front: '酯化反应机理', back: '酸脱羟基醇脱氢。RCOOH + R\'OH ⇌ RCOOR\' + H₂O（浓 H₂SO₄ 催化，可逆反应）', category: '04-有机化学', mode: 'memory' },
      { front: '水解反应', back: '酯、卤代烃、二糖/多糖、蛋白质等在适当条件下与水反应。如：RCOOR\' + H₂O ⇌ RCOOH + R\'OH（酸/碱催化）', category: '04-有机化学', mode: 'memory' },
      { front: '能使溴水褪色的有机物', back: '烯烃、炔烃（加成褪色）；苯酚（取代褪色 白色沉淀）；醛（氧化褪色）；含不饱和键的有机物', category: '04-有机化学', mode: 'memory' },
      { front: '能使酸性 KMnO₄ 褪色的有机物', back: '烯烃、炔烃（氧化）、苯的同系物（侧链氧化）、醇类、醛类、酚类', category: '04-有机化学', mode: 'memory', memo: '苯不能使 KMnO₄ 褪色，但甲苯可以' },
      { front: '醇的化学性质', back: '①与 Na 反应（2R-OH + 2Na → 2R-ONa + H₂↑）；②消去（浓 H₂SO₄ 170℃）；③催化氧化（Cu/O₂ △→ 醛/酮）；④酯化', category: '04-有机化学', mode: 'memory' },
      { front: '醛基的检验', back: '银镜反应（RCHO + 2[Ag(NH₃)₂]OH → RCOONH₄ + 2Ag↓ + 3NH₃ + H₂O）；与新制 Cu(OH)₂ 反应（RCHO + 2Cu(OH)₂ + NaOH → RCOONa + Cu₂O↓(砖红) + 3H₂O）', category: '04-有机化学', mode: 'memory' },
      { front: '羧基的酸性', back: 'RCOOH ⇌ RCOO⁻ + H⁺（弱酸）。能与 NaOH/NaHCO₃ 反应。RCOOH + NaHCO₃ → RCOONa + CO₂↑ + H₂O（酚不能与 NaHCO₃ 反应）', category: '04-有机化学', mode: 'memory' },
      { front: '苯酚的化学性质', back: '弱酸性（C₆H₅OH + NaOH → C₆H₅ONa + H₂O，但不与 NaHCO₃ 反应）；与浓溴水取代（三溴苯酚白色沉淀）；遇 FeCl₃ 显紫色（鉴别）', category: '04-有机化学', mode: 'memory', memo: '酚羟基—OH 直接连在苯环上' },
      { front: '糖类分类', back: '单糖（葡萄糖 C₆H₁₂O₆、果糖，不能水解）、二糖（蔗糖/麦芽糖 C₁₂H₂₂O₁₁，可水解为 2 分子单糖）、多糖（淀粉/纤维素(C₆H₁₀O₅)ₙ，可水解为多分子单糖）', category: '04-有机化学', mode: 'memory' },
      { front: '葡萄糖的检验', back: '银镜反应（光亮的银镜）；与新制 Cu(OH)₂ 共热（砖红色 Cu₂O 沉淀）', category: '04-有机化学', mode: 'memory' },
      { front: '油脂', back: '油脂是高级脂肪酸与甘油形成的酯。油（液态，含不饱和键，可加成）→脂肪（固态）。油脂在碱性条件下水解叫皂化反应（制肥皂）', category: '04-有机化学', mode: 'memory' },
      { front: '蛋白质的性质', back: '①水解（最终产物氨基酸）；②盐析（可逆，加水恢复）；③变性（不可逆，加热/重金属盐/酒精等）；④颜色反应（含苯环的蛋白质+浓 HNO₃ 变黄）；⑤灼烧有烧焦羽毛气味', category: '04-有机化学', mode: 'memory' },
      { front: '有机推断常见突破口', back: '条件→反应类型：O₂/Cu/△（醇→醛/酮）；H₂/Ni（加成）；NaOH/H₂O/△（卤代烃水解/酯水解）；浓 H₂SO₄/△（酯化/消去）；光照（烷烃卤代）；Fe/液溴（苯环溴代）', category: '04-有机化学', mode: 'memory' },
      { front: '重要有机反应类型的本质区别', back: '取代反应：原子或原子团替换H原子（卤代、硝化、酯化、水解）。加成反应：不饱和键打开加原子/原子团（C=C加H₂/X₂/HX/H₂O，C≡C加H₂，C=O加H₂，苯环加H₂）。消去反应：脱去小分子生成不饱和键（醇脱水、卤代烃脱HX）。加聚：C=C单体加成聚合。缩聚：单体缩合脱小分子聚合（聚酯、蛋白质）', category: '04-有机化学', mode: 'understanding', hints: ['取代反应是一换一，没有不饱和键消耗', '加成反应消耗不饱和键', '消去反应生成不饱和键', '加聚只生成高聚物，无小分子副产物', '缩聚生成高聚物和小分子副产物'], tags: ['反应类型'] },
      { front: '系统命名法—烷烃命名举例', back: 'CH₃CH(CH₃)CH₂CH₃ → 2-甲基丁烷。CH₃C(CH₃)₂CH₃ → 2,2-二甲基丙烷（新戊烷）。CH₃CH(C₂H₅)CH₂CH₂CH₃ → 3-甲基己烷（选最长链为主链，编号使取代基位次和最小）', category: '04-有机化学', mode: 'memory', tags: ['命名'] },
      { front: '烯烃/炔烃的系统命名', back: '①选含双键/三键的最长碳链为主链；②从离双键/三键最近端编号；③写：取代基位置-取代基名-双键位置-母体名', category: '04-有机化学', mode: 'memory', tags: ['命名'] },
      { front: '苯的同系物的命名', back: '苯环上的取代基位置用邻/间/对（ortho/meta/para）表示。编号：使取代基位次和最小。如：邻二甲苯（1,2-二甲苯）、间二甲苯（1,3-二甲苯）、对二甲苯（1,4-二甲苯）', category: '04-有机化学', mode: 'memory', tags: ['命名'] },
      { front: '常见高聚物单体判断', back: '加聚产物：找 C=C 链节，两个碳一组恢复双键得单体。缩聚产物：找酯基（-COO-）或肽键（-CONH-），断键后加 H/OH 得单体（二元酸+二元醇 或 氨基酸）', category: '04-有机化学', mode: 'memory', memo: '加聚看C=C，缩聚找酯键/肽键', tags: ['高分子'] },
      { front: '有机合成路线设计思路', back: '目标分子 → 分析碳骨架和官能团 → 逆推前体 → 确定反应类型。常用策略：增长碳链（卤代烃+NaCN→腈→水解→酸）、缩短碳链（烯烃氧化→醛/酸）、官能团转化（醇→醛→酸）、保护与脱保护', category: '04-有机化学', mode: 'memory', tags: ['合成'] },
    ];
  }

  function getStructureCards() {
    return [
      { front: '原子组成', back: '原子核（质子 Z + 中子 N）+ 核外电子（Z 个）。质子数 = 核电荷数 = 原子序数 = 核外电子数', category: '05-物质结构', mode: 'memory' },
      { front: '元素周期表结构', back: '7 个周期（1-3 短周期，4-7 长周期），16 个族（7 主族 A、7 副族 B、1 VIII 族、1 0 族）', category: '05-物质结构', mode: 'memory' },
      { front: '主族元素族序数', back: '主族族序数 = 最外层电子数 = 最高正价 = 8 - |最低负价|', category: '05-物质结构', mode: 'memory' },
      { front: '核外电子排布规律', back: '①能量最低原理；②每层最多 2n² 个电子；③最外层不超过 8 个（第一层不超过 2 个）；④次外层不超过 18 个', category: '05-物质结构', mode: 'memory' },
      { front: '元素金属性递变', back: '同一周期从左→右金属性减弱；同一主族从上→下金属性增强。金属性最强 Fr', category: '05-物质结构', mode: 'memory' },
      { front: '元素非金属性递变', back: '同一周期从左→右非金属性增强；同一主族从上→下非金属性减弱。非金属性最强 F', category: '05-物质结构', mode: 'memory' },
      { front: '化学键类型', back: '离子键（阴阳离子间静电作用，如 NaCl）；共价键（原子间共用电子对，如 HCl）；金属键（金属阳离子与自由电子间作用）', category: '05-物质结构', mode: 'memory' },
      { front: '共价键分类', back: '按极性：极性键（不同种原子，如 HCl）、非极性键（同种原子，如 Cl₂）。按电子云重叠：σ 键（头碰头）、π 键（肩并肩）', category: '05-物质结构', mode: 'memory' },
      { front: '离子键的判断', back: '活泼金属（IA/IIA）+ 活泼非金属（VIA/VIIA）→ 离子键。如：NaCl、MgO、K₂S。NH₄Cl 中有离子键（NH₄⁺ 与 Cl⁻）', category: '05-物质结构', mode: 'memory' },
      { front: '分子间作用力', back: '范德华力（分子间普遍存在，影响熔沸点，随相对分子质量增大而增大）；氢键（含 F/O/N 的氢化物分子间，如 H₂O/NH₃/HF）', category: '05-物质结构', mode: 'memory' },
      { front: '氢键对性质的影响', back: '氢键使物质熔沸点升高（H₂O > H₂S，HF > HCl）。水分子间氢键是冰浮在水上的原因', category: '05-物质结构', mode: 'memory' },
      { front: 'sp³ 杂化', back: '1 个 s + 3 个 p → 4 个 sp³ 杂化轨道，正四面体构型（键角 109.5°）。如 CH₄、CCl₄、金刚石中的 C', category: '05-物质结构', mode: 'memory' },
      { front: 'sp² 杂化', back: '1 个 s + 2 个 p → 3 个 sp² 杂化轨道，平面三角形（键角 120°）。如 C₂H₄ 中的 C、C₆H₆ 中的 C', category: '05-物质结构', mode: 'memory' },
      { front: 'sp 杂化', back: '1 个 s + 1 个 p → 2 个 sp 杂化轨道，直线形（键角 180°）。如 C₂H₂ 中的 C、CO₂ 中的 C', category: '05-物质结构', mode: 'memory' },
      { front: '分子极性判断', back: '双原子分子：同种原子→非极性（H₂、Cl₂），不同种→极性（HCl）。多原子分子：看空间结构是否对称（对称→非极性，如 CH₄/CO₂；不对称→极性，如 H₂O/NH₃）', category: '05-物质结构', mode: 'memory' },
      { front: '四大晶体类型', back: '离子晶体（NaCl，高熔点，熔融导电）、原子晶体/共价晶体（金刚石、SiC，很高熔点，不导电）、分子晶体（干冰、I₂，低熔点，熔融不导电）、金属晶体（Fe、Cu，导电导热）', category: '05-物质结构', mode: 'memory' },
      { front: '典型原子晶体', back: '金刚石(C)、晶体硅(Si)、碳化硅(SiC)、二氧化硅(SiO₂)', category: '05-物质结构', mode: 'memory' },
      { front: '四大晶体类型的比较', back: '离子晶体：阴阳离子通过离子键结合，高熔点，熔融导电（如NaCl）。原子晶体：原子通过共价键结合，很高熔点，一般不导电（如金刚石）。分子晶体：分子通过分子间作用力结合，低熔点，熔融不导电（如干冰）。金属晶体：金属阳离子与自由电子通过金属键结合，导电导热（如Fe）。判断方法：看构成粒子及作用力', category: '05-物质结构', mode: 'understanding', hints: ['离子晶体看是否有金属+非金属', '原子晶体看是否是C/Si/SiO₂/SiC', '分子晶体看是否有分子间作用力', '金属晶体看是否有金属光泽和延展性', '熔沸点一般是：原子晶体 > 离子晶体 > 分子晶体'], tags: ['晶体'] },
      { front: '核外电子排布式书写', back: '按能级顺序填充：1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ 5s² 4d¹⁰ 5p⁶ 6s² ... 注意：先填 4s 再填 3d（能量 4s < 3d），但书写时按主量子数顺序排列', category: '05-物质结构', mode: 'memory', memo: '能量顺序：1s 2s2p 3s3p 4s3d4p 5s4d5p', tags: ['电子排布'] },
      { front: '轨道表达式（泡利原理与洪特规则）', back: '泡利原理：一个原子轨道最多容纳 2 个电子且自旋相反。洪特规则：电子在相同能级的不同轨道上优先单独占据且自旋平行。特例：半满/全满稳定（如 Cr 3d⁵4s¹，Cu 3d¹⁰4s¹）', category: '05-物质结构', mode: 'memory', tags: ['电子排布'] },
      { front: '第一电离能递变规律', back: '同一周期从左→右整体增大（Be→B 和 N→O 反常：Be 全满稳定、N 半满稳定）。同一主族从上→下减小。同一原子逐级电离能 I₁ < I₂ < I₃ ...', category: '05-物质结构', mode: 'memory', tags: ['周期表'] },
      { front: '电负性概念与递变', back: '电负性：原子对键合电子的吸引能力。F 最大（4.0），Cs 最小（0.7）。同一周期从左→右增大，同一主族从上→下减小。电负性差 > 1.7 → 离子键，< 1.7 → 共价键', category: '05-物质结构', mode: 'memory', tags: ['周期表', '化学键'] },
    ];
  }

  function getExperimentCards() {
    return [
      { front: '实验安全—浓酸溅到皮肤', back: '先用大量水冲洗，再用 3%-5% NaHCO₃ 溶液冲洗', category: '06-化学实验', mode: 'memory' },
      { front: '实验安全—浓碱溅到皮肤', back: '先用大量水冲洗，再涂 1%-2% 硼酸溶液', category: '06-化学实验', mode: 'memory' },
      { front: '实验安全—酒精着火', back: '用湿抹布盖灭（不能用水）', category: '06-化学实验', mode: 'memory' },
      { front: '试管加热液体', back: '液体体积不超过试管容积的 1/3，试管倾斜 45°，管口不对人', category: '06-化学实验', mode: 'memory' },
      { front: '试管加热固体', back: '试管口略向下倾斜（防止冷凝水倒流炸裂试管）', category: '06-化学实验', mode: 'memory' },
      { front: '酒精灯使用', back: '禁止向燃着的酒精灯添加酒精；禁止用燃着的酒精灯引燃另一盏灯；用灯帽盖灭', category: '06-化学实验', mode: 'memory' },
      { front: '量筒读数', back: '视线与凹液面最低处保持水平。仰视→读数偏小，俯视→读数偏大', category: '06-化学实验', mode: 'memory' },
      { front: '容量瓶使用', back: '检漏→洗→溶（烧杯）→冷→转移（玻璃棒引流）→洗（烧杯和玻璃棒 2-3 次）→定容→摇匀。不能直接溶解，不能用玻璃棒伸入容量瓶搅拌', category: '06-化学实验', mode: 'memory', memo: '算量溶冷移洗定摇' },
      { front: '配制一定浓度溶液的误差分析', back: '俯视定容→V 偏小→c 偏高；仰视定容→V 偏大→c 偏低。未洗烧杯→n 偏小→c 偏低。溶液未冷却→V 偏小→c 偏高', category: '06-化学实验', mode: 'memory' },
      { front: '过滤操作要点', back: '一贴（滤纸紧贴漏斗壁）、二低（滤纸边缘低于漏斗边缘、液面低于滤纸边缘）、三靠（烧杯嘴靠玻璃棒、玻璃棒靠三层滤纸、漏斗下端靠烧杯内壁）', category: '06-化学实验', mode: 'memory', memo: '一贴二低三靠' },
      { front: '蒸发操作要点', back: '玻璃棒不断搅拌（防止局部过热飞溅）；出现大量固体时停止加热，利用余热蒸干', category: '06-化学实验', mode: 'memory' },
      { front: '蒸馏操作要点', back: '加碎瓷片防暴沸；温度计水银球在支管口处；冷凝水下进上出；先通冷凝水后加热', category: '06-化学实验', mode: 'memory' },
      { front: '分液操作要点', back: '下层液体从下端放出（及时关闭旋塞），上层液体从上口倒出。使用前要检漏', category: '06-化学实验', mode: 'memory' },
      { front: '萃取剂选择标准', back: '①与原溶剂不互溶；②溶质在萃取剂中溶解度远大于在原溶剂中；③与溶质不反应', category: '06-化学实验', mode: 'memory' },
      { front: '气体发生装置（固+固加热）', back: '如：O₂(KMnO₄)、NH₃(NH₄Cl+Ca(OH)₂)。试管口略向下倾斜', category: '06-化学实验', mode: 'memory' },
      { front: '气体发生装置（固+液不加热）', back: '如：H₂(Zn+H₂SO₄)、CO₂(CaCO₃+HCl)、NO₂(Cu+HNO₃)。用启普发生器或简易装置', category: '06-化学实验', mode: 'memory' },
      { front: '气体发生装置（固/液+液加热）', back: '如：Cl₂(MnO₂+浓 HCl)、SO₂(Na₂SO₃+浓 H₂SO₄)、C₂H₄(乙醇+浓 H₂SO₄ 170℃)。需要加热并控温', category: '06-化学实验', mode: 'memory' },
      { front: '排空气集气法', back: '密度大于空气（相对分子质量 >29）：向上排空气。密度小于空气（<29）：向下排空气。密度接近 29 的气体不宜用排空气法', category: '06-化学实验', mode: 'memory' },
      { front: '排水集气法', back: '适用于难溶或微溶于水且不与水反应的气体：H₂、O₂、NO、CO、CH₄、C₂H₄', category: '06-化学实验', mode: 'memory' },
      { front: '气体干燥原则', back: '酸性干燥剂（浓 H₂SO₄、P₂O₅）→干燥酸性或中性气体，不能干燥碱性气体（NH₃）。碱性干燥剂（碱石灰、CaO）→干燥碱性或中性气体，不能干燥酸性气体（CO₂、Cl₂、SO₂）', category: '06-化学实验', mode: 'memory' },
      { front: 'O₂ 的实验室制法', back: '2KMnO₄ —△→ K₂MnO₄ + MnO₂ + O₂↑ 或 2H₂O₂ —MnO₂→ 2H₂O + O₂↑', category: '06-化学实验', mode: 'memory' },
      { front: 'CO₂ 的实验室制法', back: 'CaCO₃ + 2HCl = CaCl₂ + H₂O + CO₂↑（不用 H₂SO₄ 因为生成 CaSO₄ 微溶覆盖表面阻止反应）', category: '06-化学实验', mode: 'memory' },
      { front: 'H₂ 的实验室制法', back: 'Zn + H₂SO₄(稀) = ZnSO₄ + H₂↑（不用浓 H₂SO₄ 或 HNO₃ 因为不产生 H₂）', category: '06-化学实验', mode: 'memory' },
      { front: 'Cl₂ 的实验室制法', back: 'MnO₂ + 4HCl(浓) —△→ MnCl₂ + Cl₂↑ + 2H₂O', category: '06-化学实验', mode: 'memory' },
      { front: 'SO₂ 的实验室制法', back: 'Na₂SO₃ + H₂SO₄(浓) = Na₂SO₄ + SO₂↑ + H₂O', category: '06-化学实验', mode: 'memory' },
      { front: 'NH₃ 的实验室制法', back: '2NH₄Cl + Ca(OH)₂ —△→ CaCl₂ + 2NH₃↑ + 2H₂O。干燥用碱石灰（不能用浓 H₂SO₄ 或 CaCl₂——CaCl₂ 与 NH₃ 结合）', category: '06-化学实验', mode: 'memory' },
      { front: '喷泉实验原理', back: '气体在液体中溶解度很大或与液体快速反应，造成瓶内压强迅速减小，形成喷泉。如：NH₃+H₂O、HCl+H₂O', category: '06-化学实验', mode: 'memory' },
      { front: '装置气密性检查', back: '将导管末端浸入水中，用手握住容器外壁（或用酒精灯微热），若导管口有气泡冒出，松手后形成一段稳定水柱，则气密性良好', category: '06-化学实验', mode: 'memory' },
      { front: '尾气处理—Cl₂', back: '用 NaOH 溶液吸收（Cl₂ + 2NaOH = NaCl + NaClO + H₂O）', category: '06-化学实验', mode: 'memory' },
      { front: '尾气处理—SO₂', back: '用 NaOH 溶液吸收（SO₂ + 2NaOH = Na₂SO₃ + H₂O）', category: '06-化学实验', mode: 'memory' },
      { front: '尾气处理—CO', back: '点燃（CO 有毒且可燃）', category: '06-化学实验', mode: 'memory' },
      { front: '尾气处理—H₂S', back: '用 NaOH 或 CuSO₄ 溶液吸收', category: '06-化学实验', mode: 'memory' },
      { front: '试纸的使用', back: '检验溶液：用玻璃棒蘸取点试纸中部。检验气体：用蒸馏水润湿，粘在玻璃棒一端，放在集气瓶口（不接触）', category: '06-化学实验', mode: 'memory' },
      { front: '常见干燥剂与适用范围', back: '浓 H₂SO₄（酸性，不可干燥 NH₃/H₂S）；碱石灰（碱性，不可干燥 Cl₂/CO₂/SO₂）；CaCl₂（中性，不可干燥 NH₃）；P₂O₅（酸性）', category: '06-化学实验', mode: 'memory' },
      { front: '物质分离—过滤', back: '分离固体与液体混合物', category: '06-化学实验', mode: 'memory' },
      { front: '物质分离—蒸发结晶', back: '分离溶于溶剂的固体溶质（如 NaCl 溶液获得 NaCl 晶体）', category: '06-化学实验', mode: 'memory' },
      { front: '物质分离—降温结晶', back: '分离溶解度受温度影响大的物质（如 KNO₃ 溶液中获得 KNO₃ 晶体）', category: '06-化学实验', mode: 'memory' },
      { front: '物质分离—蒸馏', back: '分离沸点差较大的液体混合物（如酒精和水）', category: '06-化学实验', mode: 'memory' },
      { front: '物质分离—分液', back: '分离互不相溶的两种液体（如水和四氯化碳）', category: '06-化学实验', mode: 'memory' },
      { front: '物质分离—萃取', back: '用萃取剂将溶质从原溶剂中提取出来。如用 CCl₄ 萃取碘水中的 I₂', category: '06-化学实验', mode: 'memory' },
      { front: 'Fe(OH)₃ 胶体制备', back: '将饱和 FeCl₃ 溶液逐滴滴入沸水中，继续煮沸至液体呈红褐色。FeCl₃ + 3H₂O —△→ Fe(OH)₃(胶体) + 3HCl', category: '06-化学实验', mode: 'memory', memo: '不能过量煮沸，否则胶体聚沉' },
      { front: '混合物的分离与提纯方法选择', back: '过滤：不溶性固体与液体（粗盐提纯）。蒸发结晶：溶解度受温度影响小的溶质（NaCl）。降温结晶：溶解度受温度影响大的溶质（KNO₃）。蒸馏：沸点不同的液体混合物（酒精+水）。分液：互不相溶的液体（水+四氯化碳）。萃取：溶质在两种互不相溶的溶剂中溶解度差异（CCl₄萃取碘水）', category: '06-化学实验', mode: 'understanding', hints: ['固液分离用过滤', '从溶液中得固体看溶解度随温度变化', '分离液体混合物看是否互溶和沸点差异', '萃取剂的选择标准有三条'], tags: ['分离提纯'] },
      { front: '常见阳离子的检验', back: 'H⁺：紫色石蕊变红。NH₄⁺：加NaOH加热→使红色石蕊试纸变蓝。Fe³⁺：加KSCN→血红色。Fe²⁺：加KSCN无现象→再加氯水→变红。Cu²⁺：溶液蓝色，加NaOH→蓝色沉淀', category: '06-化学实验', mode: 'memory', tags: ['检验'] },
      { front: '常见阴离子的检验', back: 'Cl⁻：加HNO₃酸化→加AgNO₃→白色沉淀。SO₄²⁻：加HCl酸化→加BaCl₂→白色沉淀。CO₃²⁻：加HCl→产生使澄清石灰水变浑浊的气体。I⁻：加氯水和CCl₄振荡→下层紫色', category: '06-化学实验', mode: 'memory', tags: ['检验'] },
      { front: '试剂保存注意事项', back: 'NaOH 溶液：橡胶塞（不用玻璃塞，会和SiO₂反应）。浓 HNO₃：棕色瓶（见光分解）。Na：煤油中保存。AgNO₃：棕色瓶。氢氟酸 HF：塑料瓶（腐蚀玻璃）。氨水：密封低温', category: '06-化学实验', mode: 'memory', memo: '碱液橡胶塞，见光棕色瓶', tags: ['保存'] },
      { front: '中和滴定操作要点', back: '检漏→洗（滴定管用待装液润洗 2-3 次）→装液→排气泡→调零→滴定（左手控活塞，右手摇锥形瓶，眼观锥形瓶内颜色变化）→记读数。终点判断：半分钟不褪色', category: '06-化学实验', mode: 'memory', memo: '润洗、排气、控速、半分钟', tags: ['滴定'] },
      { front: '中和滴定误差分析', back: '未润洗滴定管→c(待测)偏高。锥形瓶用待测液洗→c(待测)偏高。滴定前有气泡后无→c(待测)偏高。滴定终点读错（仰小俯大）→注意是溶液体积误差', category: '06-化学实验', mode: 'memory', tags: ['滴定'] },
    ];
  }

  function loadAllPresets() {
    const keys = ['01-基本概念','02-元素化合物','03-反应原理','04-有机化学','05-物质结构','06-化学实验'];
    let total = 0;
    keys.forEach(k => {
      const existing = getCardsByCategory(k);
      if (existing.length > 0) return;
      const presets = getPresetCards(k);
      addCardsBulk(presets);
      total += presets.length;
    });
    return total;
  }

  function categoryName(key) {
    const names = {
      '01-基本概念': '基本概念与理论',
      '02-元素化合物': '元素化合物',
      '03-反应原理': '化学反应原理',
      '04-有机化学': '有机化学基础',
      '05-物质结构': '物质结构与性质',
      '06-化学实验': '化学实验'
    };
    return names[key] || key;
  }

  return {
    // 算法
    calcRetrievability,
    calcNextReview,
    // 数据层
    loadCards, saveCards, loadSettings, saveSettings,
    // 迁移
    migrateIfNeeded,
    // CRUD
    addCard, addCardsBulk, updateCard, deleteCard, reviewCard,
    getCardsByCategory, getDueCards, getAllCategories,
    // 统计
    getStats, getReviewHistory, getRetentionStats,
    // 搜索
    searchCards,
    // 导入导出
    exportData, importData,
    // 预设
    getPresetCards, loadAllPresets, categoryName
  };
})();

/* 启动时自动检测并迁移数据 */
ChemEngine.migrateIfNeeded();
