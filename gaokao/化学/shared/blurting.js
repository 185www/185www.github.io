/* ===== 全部输出模式 (Blurting) ===== */
/* 自由回忆：给定主题，写出所有知识，系统对比检查 */
const ChemBlurting = (function() {

  const PROMPTS = {
    '01-基本概念': [
      {
        topic: '物质的量及其相关计算',
        instruction: '写出关于物质的量的一切：定义、公式、单位、相关物理量（NA、M、Vm、c）及其换算关系',
        keyPoints: [
          'n = N/NA 粒子数与物质的量换算',
          'n = m/M 质量与物质的量换算',
          'n = V/Vm 气体体积与物质的量换算（标况 22.4 L/mol）',
          'n = cV 溶液浓度与物质的量换算',
          '阿伏加德罗常数 NA ≈ 6.02×10²³',
          '气体摩尔体积标况下 22.4 L/mol，只适用于气体',
          '物质的量浓度 c = n/V，配制一定浓度溶液的步骤'
        ],
        reference: '物质的量是联系宏观与微观的桥梁，通过 NA、M、Vm、c 四个桥梁连接粒子数、质量、气体体积、溶液浓度。'
      },
      {
        topic: '氧化还原反应',
        instruction: '写出关于氧化还原反应的一切：本质、判断、口诀、配平、常见氧化剂/还原剂',
        keyPoints: [
          '本质：电子转移（得失或偏移）',
          '特征：化合价变化',
          '口诀：升失氧还（还原剂被氧化），降得还氧（氧化剂被还原）',
          '配平步骤：标化合价→找升降→求最小公倍数→配系数→检查',
          '常见氧化剂：Cl₂、O₂、浓H₂SO₄、HNO₃、KMnO₄、Fe³⁺',
          '常见还原剂：Al、Zn、Fe、C、H₂、CO、I⁻、Fe²⁺',
          '电子转移数 = 化合价变化值 × 原子个数'
        ],
        reference: '氧化还原反应中，还原剂失电子被氧化，发生氧化反应得到氧化产物；氧化剂得电子被还原，发生还原反应得到还原产物。'
      },
      {
        topic: '元素周期律',
        instruction: '写出关于元素周期表/律的一切：结构、递变规律、位-构-性关系',
        keyPoints: [
          '7个周期（1-3短周期，4-7长周期）',
          '16个族（7主族A、7副族B、1VIII族、1零族）',
          '同周期从左→右：原子半径↓，金属性↓，非金属性↑',
          '同主族从上→下：原子半径↑，金属性↑，非金属性↓',
          '主族族序数 = 最外层电子数 = 最高正价',
          '电子排布规律：2n²、最外层≤8、次外层≤18'
        ],
        reference: '元素周期表是元素周期律的表现形式，横向看周期递变，纵向看同族相似性。'
      }
    ],
    '02-元素化合物': [
      {
        topic: '钠及其化合物',
        instruction: '写出关于钠及其化合物的一切：物理性质、化学性质、重要反应、Na₂O/Na₂O₂/Na₂CO₃/NaHCO₃',
        keyPoints: [
          '钠：银白、质软、密度0.97、熔点低、保存在煤油中',
          '与O₂：4Na+O₂=2Na₂O（常温），2Na+O₂→点燃→Na₂O₂（点燃）',
          '与H₂O：2Na+2H₂O=2NaOH+H₂↑，现象：浮熔游响红',
          'Na₂O₂：淡黄色，供氧剂，2Na₂O₂+2H₂O=4NaOH+O₂↑',
          'Na₂O₂+2CO₂=2Na₂CO₃+O₂（呼吸面具原理）',
          'Na₂CO₃（纯碱/苏打）vs NaHCO₃（小苏打）：热稳定性、溶解度、碱性',
          '侯氏制碱法：NaCl+NH₃+CO₂+H₂O=NaHCO₃↓+NH₄Cl'
        ],
        reference: '钠是典型的活泼金属，其化合物包括氧化物（Na₂O、Na₂O₂）、碱（NaOH）和盐（Na₂CO₃、NaHCO₃），在工业和生活中有重要用途。'
      },
      {
        topic: '铁及其化合物',
        instruction: '写出关于铁及其化合物的一切：铁单质性质、氧化物、氢氧化物、Fe²⁺/Fe³⁺转化与检验',
        keyPoints: [
          'Fe与O₂：3Fe+2O₂→点燃→Fe₃O₄（火星四射）',
          'Fe与Cl₂：2Fe+3Cl₂→点燃→2FeCl₃（Fe³⁺）',
          'Fe与S：Fe+S→△→FeS（Fe²⁺）',
          'Fe₂O₃（铁红/红棕色）、FeO（黑色）、Fe₃O₄（磁性氧化铁/黑色）',
          'Fe(OH)₂：白色→灰绿→红褐色（被O₂氧化为Fe(OH)₃）',
          'Fe³⁺检验：KSCN→血红色',
          'Fe²⁺检验：KSCN无现象→加氯水→变红',
          'Fe²⁺→Fe³⁺：Cl₂/O₂/H₂O₂氧化；Fe³⁺→Fe²⁺：Fe/Cu/I⁻还原'
        ],
        reference: '铁是过渡金属的典型代表，其+2和+3价之间的转化是高考重点，铁三角（Fe-Fe²⁺-Fe³⁺）转化关系必须熟练掌握。'
      },
      {
        topic: '氯、硫、氮及其化合物',
        instruction: '写出关于卤素/硫/氮的重要化合物：Cl₂、SO₂、NH₃、HNO₃、浓H₂SO₄的性质与反应',
        keyPoints: [
          'Cl₂：黄绿色、有毒，Cl₂+H₂O⇌HCl+HClO',
          'HClO：弱酸、不稳定、强氧化性（漂白）',
          '氯水成分：三分子（Cl₂/H₂O/HClO）、三离子（H⁺/Cl⁻/ClO⁻）',
          'SO₂：酸性氧化物、还原性、漂白性（可逆，加热恢复）',
          '浓H₂SO₄：吸水性、脱水性、强氧化性（Cu+2H₂SO₄→CuSO₄+SO₂↑+2H₂O）',
          'NH₃：碱性、还原性、实验室制法（NH₄Cl+Ca(OH)₂）',
          'HNO₃：强氧化性，浓→NO₂，稀→NO',
          '钝化：Fe/Al在浓H₂SO₄/浓HNO₃中常温钝化'
        ],
        reference: '这三种非金属元素及其化合物是元素化合物部分的核心内容，涉及多种氧化态和重要的工业反应。'
      }
    ],
    '03-反应原理': [
      {
        topic: '化学反应与能量',
        instruction: '写出关于反应热的一切：ΔH计算、盖斯定律、燃烧热、中和热、热化学方程式',
        keyPoints: [
          'ΔH = 生成物总能量 - 反应物总能量（恒压）',
          'ΔH = 反应物总键能 - 生成物总键能',
          '放热反应ΔH<0，吸热反应ΔH>0',
          '盖斯定律：反应热与路径无关，ΔH=ΣΔHᵢ',
          '燃烧热：1mol纯物质完全燃烧生成稳定氧化物放热',
          '中和热：强酸强碱稀溶液生成1mol水，ΔH=-57.3kJ/mol',
          '热化学方程式：标状态、系数与ΔH对应'
        ],
        reference: '能量变化是化学反应的基本特征之一，盖斯定律为计算难以直接测量的反应热提供了方法。'
      },
      {
        topic: '化学平衡与移动',
        instruction: '写出关于化学平衡的一切：平衡特征、勒夏特列原理、平衡常数K、转化率',
        keyPoints: [
          '平衡特征：逆等动定变',
          '勒夏特列原理：改变条件→平衡向减弱改变的方向移动',
          '浓度：增反应物/减生成物→正向移动',
          '温度：升温→吸热方向；降温→放热方向',
          '压强：增压→气体体积减小方向',
          'K = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ，K只与温度有关',
          '转化率 = 已转化/起始 × 100%'
        ],
        reference: '化学平衡是动态平衡，勒夏特列原理定性判断移动方向，平衡常数K定量描述反应限度。'
      },
      {
        topic: '水溶液中的离子平衡',
        instruction: '写出关于水溶液的一切：Kw、pH、盐类水解、沉淀溶解平衡Ksp',
        keyPoints: [
          'Kw = c(H⁺)·c(OH⁻)，25℃时1.0×10⁻¹⁴',
          'pH = -lg c(H⁺)，pH<7酸性，=7中性，>7碱性',
          '盐类水解：谁弱谁水解，谁强显谁性',
          '水解常数 Kh = Kw/Ka 或 Kw/Kb',
          'Ksp：沉淀溶解平衡常数，Q<Ksp→溶解，Q>Ksp→沉淀',
          '沉淀转化：向溶解度更小的方向转化'
        ],
        reference: '水溶液中的离子平衡是高考化学的难点和重点，涉及三大平衡体系（水的电离、盐类水解、沉淀溶解平衡）的综合分析。'
      },
      {
        topic: '电化学基础',
        instruction: '写出关于电化学的一切：原电池、电解池、金属腐蚀与防护',
        keyPoints: [
          '原电池：负极氧化（失电子），正极还原（得电子）',
          '原电池电子：负极→外电路→正极',
          '电解池：阳极氧化（与正极相连），阴极还原（与负极相连）',
          '阴离子放电顺序：S²⁻>I⁻>Br⁻>Cl⁻>OH⁻>含氧酸根',
          '阳离子放电顺序：Ag⁺>Cu²⁺>H⁺>Fe²⁺>Zn²⁺',
          '吸氧腐蚀：中性/碱性，Fe-2e⁻=Fe²⁺，O₂+2H₂O+4e⁻=4OH⁻',
          '析氢腐蚀：酸性，2H⁺+2e⁻=H₂↑',
          '金属防护：牺牲阳极法、外加电流法'
        ],
        reference: '电化学是化学反应原理的重要组成部分，原电池和电解池是对立统一的电化学体系。'
      }
    ],
    '04-有机化学': [
      {
        topic: '有机反应类型归纳',
        instruction: '写出所有有机反应类型及其特点：取代、加成、消去、加聚、缩聚、氧化、还原',
        keyPoints: [
          '取代反应：一换一（卤代、硝化、酯化、水解）',
          '加成反应：不饱和→饱和（C=C加H₂/X₂/HX/H₂O）',
          '消去反应：饱和→不饱和（醇脱水、卤代烃脱HX）',
          '加聚反应：C=C单体→高分子（聚乙烯等）',
          '缩聚反应：单体缩合→高分子+小分子（聚酯、蛋白质）',
          '氧化反应：醇→醛→酸，烯烃/炔烃被KMnO₄氧化',
          '还原反应：加氢（醛→醇，烯→烷）'
        ],
        reference: '有机反应类型是推断题的基础，每种反应类型对应特定的反应条件和结构特征。'
      },
      {
        topic: '烃及其衍生物的转化关系',
        instruction: '写出烃→卤代烃→醇→醛→羧酸→酯的转化路线及条件',
        keyPoints: [
          '烷烃→卤代烃：光照+X₂',
          '卤代烃→醇：NaOH/H₂O/△（水解）',
          '醇→醛：Cu/O₂/△（催化氧化）',
          '醛→羧酸：银氨溶液或新制Cu(OH)₂',
          '羧酸→酯：浓H₂SO₄/△（酯化，酸脱羟基醇脱氢）',
          '醇→烯烃：浓H₂SO₄/170℃（消去）',
          '烯烃→醇：H₂O/催化剂（水化）',
          '卤代烃→烯烃：NaOH/醇/△（消去）'
        ],
        reference: '烃的衍生物转化链是有机化学的核心主线，掌握各步反应的条件和机理是关键。'
      }
    ],
    '05-物质结构': [
      {
        topic: '化学键与分子间作用力',
        instruction: '写出关于化学键的一切：离子键/共价键/金属键的特征与判断、分子极性、氢键',
        keyPoints: [
          '离子键：活泼金属+活泼非金属，静电作用',
          '共价键：原子间共用电子对，分极性键和非极性键',
          'σ键（头碰头）和π键（肩并肩）',
          '分子极性判断：双原子看是否同种，多原子看是否对称',
          '氢键：F/O/N的氢化物，使熔沸点升高',
          '范德华力：普遍存在，随分子量增大而增大'
        ],
        reference: '化学键决定物质的化学性质，分子间作用力决定物理性质（熔沸点、溶解度）。'
      },
      {
        topic: '晶体类型与性质',
        instruction: '写出四大晶体类型及其特征：构成粒子、作用力、熔沸点、导电性、典型例子',
        keyPoints: [
          '离子晶体：阴阳离子+离子键，高熔点，熔融导电（NaCl）',
          '原子晶体：原子+共价键，很高熔点，不导电（金刚石、SiC、SiO₂）',
          '分子晶体：分子+分子间力，低熔点，不导电（干冰、I₂）',
          '金属晶体：阳离子+自由电子+金属键，导电导热（Fe、Cu）',
          '晶体熔沸点：原子晶体 > 离子晶体 > 分子晶体',
          '杂化轨道：sp（直线180°）、sp²（平面120°）、sp³（四面体109.5°）'
        ],
        reference: '晶体类型决定了物质的宏观性质，判断晶体类型的关键是看构成粒子和粒子间作用力。'
      }
    ],
    '06-化学实验': [
      {
        topic: '常用仪器的使用与基本操作',
        instruction: '写出所有重要实验仪器的使用方法和基本安全操作',
        keyPoints: [
          '试管加热：液体≤1/3、45°倾斜、固体口略向下',
          '酒精灯：不对燃、灯帽盖灭',
          '量筒读数：视线与凹液面最低处水平',
          '容量瓶：检漏→溶→冷→转→洗→定→摇',
          '过滤：一贴二低三靠',
          '蒸发：搅拌、余热蒸干',
          '蒸馏：碎瓷片、温度计支管口、冷凝水进下出上',
          '分液：下层下端放、上层上口倒'
        ],
        reference: '基本操作是化学实验的基础，每种操作都有其原理和注意事项。'
      },
      {
        topic: '气体的制备、收集与净化',
        instruction: '写出常见气体（O₂、H₂、CO₂、Cl₂、NH₃、SO₂、NO₂）的制法、收集方法和尾气处理',
        keyPoints: [
          'O₂：2KMnO₄→△→ 或 2H₂O₂→MnO₂→',
          'CO₂：CaCO₃+2HCl，不用H₂SO₄',
          'Cl₂：MnO₂+4HCl(浓)→△→',
          'NH₃：2NH₄Cl+Ca(OH)₂→△→，碱石灰干燥',
          '收集方法：密度>空气→向上排空气，<空气→向下排空气',
          '排水集气：H₂、O₂、NO、CO、CH₄',
          '尾气处理：Cl₂/SO₂→NaOH，CO→点燃',
          '干燥原则：酸性干燥剂（浓H₂SO₄）不能干燥碱性气体'
        ],
        reference: '气体制备是实验题的核心考点，涉及发生装置、净化装置、收集装置、尾气处理装置的完整流程。'
      },
      {
        topic: '物质的分离与提纯',
        instruction: '写出所有分离提纯方法及其适用范围：过滤、蒸发、结晶、蒸馏、分液、萃取',
        keyPoints: [
          '过滤：固液分离',
          '蒸发结晶：溶解度受温度影响小的溶质（NaCl）',
          '降温结晶：溶解度受温度影响大的溶质（KNO₃）',
          '蒸馏：沸点差大的液体混合物',
          '分液：互不相溶的液体（水+四氯化碳）',
          '萃取：溶质在互不相溶溶剂中溶解度不同',
          '萃取剂选择三标准：不互溶、溶解度大、不反应',
          '常见物质检验：Cl⁻(AgNO₃+HNO₃)、SO₄²⁻(BaCl₂+HCl)、NH₄⁺(NaOH+加热)'
        ],
        reference: '分离提纯是化学实验的基本技能，根据物质性质的差异选择合适的方法。'
      }
    ]
  };

  function getPromptsForCategory(categoryKey) {
    return PROMPTS[categoryKey] || [];
  }

  function renderBlurtingView(container) {
    if (!container) return;

    let html = `
      <div class="blurting-select">
        <div class="card-title">📝 全部输出模式</div>
        <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">
          选择一个主题，写出你能回忆的<strong>所有</strong>相关知识。
          完成后系统将对照完整知识清单检查遗漏。
        </p>
        <div class="blurting-topics" id="blurtingTopics">
    `;

    html += '<div style="font-size:13px;color:var(--text-secondary)">暂无可用主题</div>';

    html += `
        </div>
      </div>
      <div id="blurtingArea" style="display:none"></div>
    `;

    container.innerHTML = html;
  }

  function renderTopics(categoryKey, container) {
    if (!container) return;
    const prompts = getPromptsForCategory(categoryKey);

    if (prompts.length === 0) {
      container.innerHTML = '<div style="font-size:13px;color:var(--text-secondary)">该分类暂无全部输出练习主题</div>';
      return;
    }

    container.innerHTML = prompts.map((p, i) => `
      <div class="blurting-topic-item" onclick="ChemBlurting.startBlurting('${categoryKey}', ${i})">
        <div class="blurting-topic-name">${p.topic}</div>
        <div class="blurting-topic-desc">${p.instruction.slice(0, 60)}...</div>
        <span class="blurting-start-btn">开始 →</span>
      </div>
    `).join('');
  }

  function startBlurting(categoryKey, promptIndex) {
    const prompts = getPromptsForCategory(categoryKey);
    if (!prompts[promptIndex]) return;

    const prompt = prompts[promptIndex];
    const selectArea = document.getElementById('blurtingTopics');
    const blurtingArea = document.getElementById('blurtingArea');

    if (selectArea) selectArea.style.display = 'none';
    if (blurtingArea) {
      blurtingArea.style.display = 'block';
      blurtingArea.innerHTML = `
        <div class="blurting-card">
          <div class="blurting-header">
            <button class="btn btn-outline btn-sm" onclick="ChemBlurting.backToTopics()" style="margin-right:8px">← 返回</button>
            <span class="blurting-badge">全部输出</span>
          </div>
          <div class="blurting-prompt">
            <div class="blurting-label">📌 主题</div>
            <div class="blurting-topic-title">${prompt.topic}</div>
            <div style="font-size:14px;color:var(--text-secondary);margin-top:8px">${prompt.instruction}</div>
          </div>
          <div class="form-group" style="margin-top:16px">
            <label for="blurtingInput">✍️ 写出你记住的所有内容</label>
            <textarea class="form-textarea blurting-input" id="blurtingInput" rows="10" placeholder="不要翻书或查资料，写出你能回忆的一切..."></textarea>
          </div>
          <div id="blurtingCheckArea">
            <button class="btn btn-primary btn-block" onclick="ChemBlurting.checkBlurting('${categoryKey}', ${promptIndex})">🔍 检查我的输出</button>
          </div>
        </div>
      `;
    }
  }

  function backToTopics() {
    const selectArea = document.getElementById('blurtingTopics');
    const blurtingArea = document.getElementById('blurtingArea');

    if (selectArea) selectArea.style.display = 'block';
    if (blurtingArea) {
      blurtingArea.style.display = 'none';
      blurtingArea.innerHTML = '';
    }
  }

  function checkBlurting(categoryKey, promptIndex) {
    const prompts = getPromptsForCategory(categoryKey);
    if (!prompts[promptIndex]) return;

    const prompt = prompts[promptIndex];
    const input = document.getElementById('blurtingInput');
    if (!input) return;
    const userText = input.value.trim();

    if (!userText) {
      alert('请先写出你记住的内容再检查！');
      return;
    }

    const results = prompt.keyPoints.map(kp => {
      const keywords = kp.replace(/[（(].*?[）)]/g, '').split(/[、，,;；：]/).map(s => s.trim()).filter(s => s.length > 1);
      const matched = keywords.some(kw => userText.includes(kw));
      return { point: kp, matched };
    });

    const matchedCount = results.filter(r => r.matched).length;
    const totalPoints = results.length;
    const pct = Math.round(matchedCount / totalPoints * 100);

    let checklistHtml = results.map(r =>
      `<div class="kp-item ${r.matched ? 'matched' : 'missed'}">${r.matched ? '✅' : '❌'} ${r.point}</div>`
    ).join('');

    document.getElementById('blurtingCheckArea').innerHTML = `
      <div class="blurting-result">
        <div class="blurting-reference">
          <div style="font-weight:600;margin-bottom:6px;font-size:14px">📋 知识覆盖检查</div>
          <div style="font-size:15px;margin-bottom:8px">
            覆盖 <strong>${matchedCount}/${totalPoints}</strong> 个知识点 (${pct}%)
            <div class="progress-bar" style="margin:8px 0">
              <div class="fill" style="width:${pct}%;background:${pct >= 70 ? 'var(--success)' : pct >= 40 ? 'var(--warning)' : 'var(--danger)'}"></div>
            </div>
          </div>
          <div class="kp-list">${checklistHtml}</div>
        </div>
        <div style="margin-top:16px;padding:12px;background:#f8fafc;border-radius:8px">
          <div style="font-weight:600;margin-bottom:4px;font-size:13px">📖 参考答案要点</div>
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">${prompt.reference}</div>
        </div>
        <div class="modal-actions" style="margin-top:16px">
          <button class="btn btn-outline btn-sm" onclick="ChemBlurting.backToTopics()">← 其他主题</button>
          <button class="btn btn-outline btn-sm" onclick="ChemBlurting.retry()">✏️ 重写</button>
        </div>
      </div>
    `;
  }

  function retry() {
    const checkArea = document.getElementById('blurtingCheckArea');
    if (checkArea) {
      const input = document.getElementById('blurtingInput');
      if (input) input.focus();
      checkArea.innerHTML = `
        <button class="btn btn-primary btn-block" onclick="ChemBlurting.checkBlurting()">🔍 检查我的输出</button>
      `;
    }
  }

  return {
    getPromptsForCategory,
    renderBlurtingView,
    renderTopics,
    startBlurting,
    backToTopics,
    checkBlurting,
    retry
  };
})();
