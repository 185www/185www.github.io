const 选择性必修1 = {
  textbook: '选择性必修1',

  chapters: [
    {
      id: 'x1-ch1',
      title: '第一章 化学反应的热效应',
      sections: [
        {
          id: 'x1-ch1-sec1',
          title: '第一节 反应热',
          exercises: [
            {
              id: 'x1c1s1-001', template: 'concept-construction',
              title: '放热反应与吸热反应',
              params: {
                cases: ['C + O₂ → CO₂ 放出大量热', 'Ba(OH)₂·8H₂O + NH₄Cl 反应使烧杯温度骤降', 'H₂ + Cl₂ → 2HCl 光照即反应放出热'],
                caseOptions: ['反应前后体系能量变化不同', '反应是否需要加热', '反应物颜色不同'],
                caseCorrectIndices: [0],
                caseCommonality: '放热反应ΔH<0（体系向环境放热），吸热反应ΔH>0（环境向体系吸热）',
                conceptName: '放热反应与吸热反应',
                definitionKeyTerms: ['ΔH', '放热', '吸热', '能量'],
                definitionHint: '考虑反应物和生成物的总能量关系',
                fullDefinition: '放热反应是反应物总能量高于生成物总能量的反应（ΔH<0），反应向环境释放热量；吸热反应相反（ΔH>0）',
                boundaryItems: ['燃烧反应是放热反应', 'Ba(OH)₂·8H₂O与NH₄Cl反应是吸热', 'C + CO₂ → 2CO是放热反应', '铝热反应是放热反应'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么C + CO₂ → 2CO不是放热反应？',
                explainHint: '这个反应需要持续高温条件',
                explainKeyTerms: ['吸收', '热量', '高温'],
                reasoning: [
                  '燃烧反应（例：C+O₂→CO₂）、中和反应、铝热反应等均为放热反应（ΔH<0）。Ba(OH)₂·8H₂O与NH₄Cl反应、C+CO₂高温下反应等为吸热反应（ΔH>0）',
                  '判断放/吸热的依据：ΔH=生成物总能量-反应物总能量，ΔH<0放热，ΔH>0吸热。反应条件（加热）≠吸热反应',
                  'C + CO₂ → 2CO需要持续高温条件是因为该反应是吸热反应，一旦停止供热反应即停止。燃烧反应（放热）点燃后可自行维持',
                  '铝热反应：2Al + Fe₂O₃ → 2Fe + Al₂O₃，大量放热用于焊接铁轨'
                ]
              }
            },
            {
              id: 'x1c1s1-002', template: 'redox-reasoning',
              title: '热化学方程式的书写',
              params: {
                substances: [
                  { key: 'h2', formula: 'H₂(g)', valences: { H: 0 } },
                  { key: 'o2', formula: 'O₂(g)', valences: { O: 0 } },
                  { key: 'h2o', formula: 'H₂O(l)', valences: { H: 1, O: -2 } }
                ],
                identifyOptions: ['H₂是还原剂，O₂是氧化剂', 'H₂是氧化剂，O₂是还原剂', '两者都是', '无氧化还原'],
                identifyCorrectIndex: 0,
                identifyPrompt: 'H₂在O₂中燃烧，判断氧化剂和还原剂',
                finalEquation: 'H₂(g) + ½O₂(g) → H₂O(l) ΔH = -285.8 kJ/mol',
                finalHint: '注意注明物质状态，ΔH符号正确',
                reasoning: [
                  'H从0价→+1价，失电子→还原剂；O从0价→-2价，得电子→氧化剂',
                  'H₂ + ½O₂ → H₂O，配平后标注状态(g)、(l)，放热反应用负号ΔH = -285.8 kJ/mol'
                ]
              }
            },
            {
              id: 'x1c1s1-003', template: 'error-analysis',
              title: 'ΔH的符号与单位',
              params: {
                statement: '已知反应2H₂(g) + O₂(g) = 2H₂O(l)放热571.6kJ，则该反应的ΔH = +571.6 kJ/mol',
                errorOptions: ['2H₂(g) + O₂(g)', '2H₂O(l)', 'ΔH = +571.6 kJ/mol', '没有错误'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['放热反应', 'ΔH', '负值'],
                principleHint: '放热反应体系能量降低，ΔH为负',
                correctVersion: 'ΔH = -571.6 kJ/mol（放热反应ΔH<0）',
                finalHint: 'ΔH = 生成物总能量 - 反应物总能量，放热时体系能量降低，ΔH为负',
                reasoning: [
                  '放热反应中体系向环境放出热量，体系总能量降低，故ΔH = 生成物总能量 - 反应物总能量 < 0',
                  'ΔH < 0为放热反应，使用负号表示。ΔH = -571.6 kJ/mol表示每2mol H₂完全燃烧放热571.6kJ',
                  'ΔH的单位是kJ/mol（每摩尔反应），注意与反应的热效应区分'
                ]
              }
            },
            {
              id: 'x1c1s1-004', template: 'concept-construction',
              title: '燃烧热与中和热',
              params: {
                cases: ['1mol CH₄完全燃烧生成CO₂(g)和H₂O(l)放出890.3kJ', '强酸强碱稀溶液中和生成1mol H₂O放出57.3kJ', '1mol S燃烧生成SO₂(g)放出296.8kJ'],
                caseOptions: ['都是反应热的一种类型', '都必须在标准状况下测量', '生成物状态有特定要求'],
                caseCorrectIndices: [0],
                caseCommonality: '燃烧热和中和热都是特定条件下的反应热，ΔH<0',
                conceptName: '燃烧热与中和热',
                definitionKeyTerms: ['燃烧热', '中和热', '指定产物', '稀溶液'],
                definitionHint: '燃烧热要求1mol纯物质完全燃烧生成指定产物；中和热指稀溶液中酸和碱中和生成1mol H₂O的热效应',
                fullDefinition: '燃烧热：1mol纯物质完全燃烧生成指定稳定产物时放出的热量。中和热：稀溶液中强酸强碱中和生成1mol H₂O时的反应热，ΔH = -57.3 kJ/mol',
                boundaryItems: ['CH₄的燃烧热是890.3kJ/mol', 'H₂SO₄与Ba(OH)₂的中和热为-57.3kJ/mol', '弱酸与强碱的中和热绝对值大于57.3', 'S燃烧生成SO₂的燃烧热是S→SO₂'],
                boundaryCorrectIndices: [0, 3],
                explainPrompt: '为什么H₂SO₄与Ba(OH)₂中和的热效应不是-57.3kJ/mol（每mol H₂O）？',
                explainHint: '考虑沉淀生成的影响',
                explainKeyTerms: ['沉淀', '额外热效应', 'BaSO₄'],
                reasoning: [
                  '燃烧热定义要素：1mol纯物质、完全燃烧、生成指定稳定产物（C→CO₂(g)，H→H₂O(l)，S→SO₂(g)等）',
                  '中和热：稀强酸强碱中和生成1mol H₂O(l)时ΔH = -57.3 kJ/mol，与酸和碱的种类无关',
                  'H₂SO₄与Ba(OH)₂的中和反应伴随BaSO₄沉淀生成，沉淀过程也有热效应，因此总放热不等于57.3kJ',
                  '弱酸弱碱因电离过程吸热，其中和热绝对值小于57.3 kJ/mol'
                ]
              }
            },
            {
              id: 'x1c1s1-005', template: 'concept-construction',
              title: '键能法计算ΔH',
              params: {
                cases: ['H₂ + Cl₂ → 2HCl，已知H-H键能436kJ/mol，Cl-Cl键能243kJ/mol，H-Cl键能431kJ/mol', 'H₂ + Br₂ → 2HBr，已知Br-Br键能193kJ/mol，H-Br键能366kJ/mol'],
                caseOptions: ['都通过键能数据计算ΔH', '反应条件相同', '产物状态相同'],
                caseCorrectIndices: [0],
                caseCommonality: '利用键能数据：ΔH = 反应物总键能 - 生成物总键能',
                conceptName: '键能法计算ΔH',
                definitionKeyTerms: ['键能', 'ΔH', '断键吸热', '成键放热'],
                definitionHint: '断键吸收热量，成键放出热量，ΔH为两者之差',
                fullDefinition: '键能法：ΔH = Σ(反应物键能) - Σ(生成物键能)。断键吸热（+），成键放热（-），ΔH>0吸热，ΔH<0放热',
                boundaryItems: ['ΔH = (436+243) - (2×431) = -183 kJ/mol（放热）', '键能数据越大表示键越牢固', 'ΔH与反应条件无关', '键能法适用于所有化学反应'],
                boundaryCorrectIndices: [0, 1],
                explainPrompt: '为什么H₂ + Cl₂的ΔH为负值（放热反应）？',
                explainHint: '比较断键吸收的能量和成键放出的能量',
                explainKeyTerms: ['断键吸热', '成键放热', '净放热'],
                reasoning: [
                  'ΔH = 反应物总键能 - 生成物总键能 = (436 + 243) - (2×431) = 679 - 862 = -183 kJ/mol < 0',
                  '断键吸收679kJ（正值），成键放出862kJ（负值），净放热183kJ，故ΔH为负',
                  '键能越大键越牢固，H-Cl键能大说明HCl分子稳定。实际计算时需注意系数的匹配'
                ]
              }
            }
          ]
        },
        {
          id: 'x1-ch1-sec2',
          title: '第二节 反应热的计算',
          exercises: [
            {
              id: 'x1c1s2-001', template: 'experimental-reasoning',
              title: '盖斯定律计算步骤',
              params: {
                goal: '利用盖斯定律由已知反应的热化学方程式计算目标反应的ΔH',
                principleOptions: ['盖斯定律：反应热与路径无关，可通过已知反应加减组合得到目标反应的ΔH', '反应热与反应路径有关', '直接测量目标反应的ΔH', '通过键能数据计算目标反应的ΔH'],
                principleCorrectIndex: 0,
                keyStepItems: ['写出目标反应方程式', '分析已知反应，找出与目标反应的关系', '将已知反应进行加减组合（乘系数、调方向）', 'ΔH同步加减组合', '消去中间产物得到目标反应'],
                keyStepCorrectIndices: [0, 1, 2, 3, 4],
                orderItems: ['写出目标反应方程式', '分析已知反应，找出与目标反应的关系', '将已知反应进行加减组合', 'ΔH同步加减组合', '消去中间产物得到目标反应'],
                orderCorrect: [0, 1, 2, 3, 4],
                orderHint: '先明确目标，再分析已知关系，最后数学组合',
                consequenceOptions: ['得到正确的ΔH', '消去中间产物失败', 'ΔH符号和数值错误'],
                consequenceCorrectIndex: 0,
                reasoning: [
                  '盖斯定律的核心：ΔH仅与始态和终态有关，与路径无关，因此可以将已知反应组合得到目标反应',
                  '乘系数：反应式及ΔH同时乘以相同倍数；调方向：ΔH改变符号',
                  '关键点：中间产物的系数必须相等才能消去，确保组合正确',
                  'ΔH与反应路径无关，但不能直接对反应热数值进行加减而不考虑反应式的组合关系'
                ]
              }
            },
            {
              id: 'x1c1s2-002', template: 'concept-construction',
              title: '盖斯定律加合法计算',
              params: {
                cases: ['已知：① C(s)+O₂(g)=CO₂(g) ΔH₁=-393.5 kJ/mol；② CO(g)+½O₂(g)=CO₂(g) ΔH₂=-283.0 kJ/mol。求C(s)+½O₂(g)=CO(g)的ΔH', '已知：③ 2H₂(g)+O₂(g)=2H₂O(l) ΔH₃=-571.6 kJ/mol；④ 2H₂O₂(l)=2H₂O(l)+O₂(g) ΔH₄=-196.4 kJ/mol。求H₂(g)+O₂(g)=H₂O₂(l)的ΔH'],
                caseOptions: ['都通过已知反应加减组合求目标ΔH', '都涉及燃烧反应', '都使用相同反应物'],
                caseCorrectIndices: [0],
                caseCommonality: '利用盖斯定律通过已知反应的加减组合求出目标反应的ΔH',
                conceptName: '盖斯定律加合法计算',
                definitionKeyTerms: ['盖斯定律', '加减组合', '乘系数', '调方向'],
                definitionHint: '目标反应可由已知反应通过乘系数、调方向后相加得到，ΔH同步运算',
                fullDefinition: '盖斯定律：化学反应的反应热只与反应的始态和终态有关，与反应路径无关。可通过已知热化学方程式的线性组合计算出目标反应的ΔH',
                boundaryItems: ['①-②得C(s)+½O₂(g)=CO(g)，ΔH=ΔH₁-ΔH₂=-110.5 kJ/mol', '反应式乘系数时ΔH乘相同系数', '反应式调方向时ΔH变号', '盖斯定律ΔH计算与反应物状态无关'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么计算ΔH = -110.5 kJ/mol时反应式是①-②？',
                explainHint: '目标反应中CO在产物侧，已知反应②中CO在反应物侧',
                explainKeyTerms: ['消去', '中间产物', 'CO₂'],
                reasoning: [
                  '目标：C(s)+½O₂(g)→CO(g)。已知①有C→CO₂，②有CO→CO₂，需要消去CO₂',
                  '①-②：(C+O₂→CO₂) - (CO+½O₂→CO₂) = C+½O₂→CO，消去了CO₂',
                  'ΔH = ΔH₁ - ΔH₂ = -393.5 - (-283.0) = -110.5 kJ/mol',
                  '关键技巧：目标反应中某物质在产物侧，已知反应中该物质在反应物侧→需反转已知反应（ΔH变号）'
                ]
              }
            },
            {
              id: 'x1c1s2-003', template: 'error-analysis',
              title: '盖斯定律ΔH加减常见错误',
              params: {
                statement: '已知反应A→B ΔH₁，B→C ΔH₂，求A→C的ΔH。计算得ΔH = ΔH₂ - ΔH₁',
                errorOptions: ['反应A→B', '反应B→C', 'ΔH = ΔH₂ - ΔH₁', '没有错误'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['盖斯定律', '相加', '中间产物'],
                principleHint: 'A→C可由A→B与B→C相加得到',
                correctVersion: 'A→C = (A→B) + (B→C)，所以ΔH = ΔH₁ + ΔH₂',
                finalHint: '反应式相加时ΔH也相加，中间产物消去',
                reasoning: [
                  'A→C = (A→B) + (B→C)，因为A→B再B→C相当于从A到C，中间产物B被消去',
                  'ΔH应该为ΔH₁ + ΔH₂而非ΔH₂ - ΔH₁，因为两个反应方向一致',
                  '盖斯定律的本质：反应热具有可加性，多个连续反应的ΔH等于各步ΔH之和'
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'x1-ch2',
      title: '第二章 化学反应速率与化学平衡',
      sections: [
        {
          id: 'x1-ch2-sec1',
          title: '第一节 化学反应速率',
          exercises: [
            {
              id: 'x1c2s1-001', template: 'concept-construction',
              title: '化学反应速率的概念',
              params: {
                cases: ['反应A+3B⇌2C中，c(A)从2mol/L降到1mol/L用时10s', '反应N₂+3H₂⇌2NH₃中v(N₂)=0.1mol/(L·s)，则v(H₂)=0.3mol/(L·s)', '反应2SO₂+O₂⇌2SO₃中v(SO₂)=0.2mol/(L·min)'],
                caseOptions: ['都表示单位时间内浓度的变化', '都使用固体表示速率', '都使用瞬时速率'],
                caseCorrectIndices: [0],
                caseCommonality: '化学反应速率v=Δc/Δt表示单位时间内反应物浓度的减少或生成物浓度的增加',
                conceptName: '化学反应速率',
                definitionKeyTerms: ['Δc', 'Δt', '浓度变化', '单位时间'],
                definitionHint: '速率是浓度变化量与时间变化量的比值',
                fullDefinition: '化学反应速率用单位时间内反应物浓度的减少或生成物浓度的增加来表示，v=Δc/Δt，常用单位为mol/(L·s)或mol/(L·min)。各物质速率之比等于化学计量数之比',
                boundaryItems: ['v(A):v(B):v(C)=1:3:2（反应A+3B⇌2C）', 'v(B)=0.6mol/(L·s)时v(C)=0.4mol/(L·s)', '固体和纯液体的浓度视为常数，不用其表示速率', 'v = Δc/Δt是平均速率而不是瞬时速率'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么固体和纯液体不能用于表示化学反应速率？',
                explainHint: '固体和纯液体的浓度在反应中如何变化？',
                explainKeyTerms: ['浓度常数', '固体密度不变', '单位体积内物质的量不变'],
                reasoning: [
                  '化学反应速率用浓度变化量表示，固体和纯液体的浓度视为定值（ρ/M），Δc=0，无法表示反应快慢',
                  '各物质速率之比等于化学计量数之比，如aA+bB→cC+dD，v(A)/a=v(B)/b=v(C)/c=v(D)/d',
                  'v=Δc/Δt为平均速率（某时间段内），与瞬时速率不同。浓度越大通常碰撞频率越高、速率越快'
                ]
              }
            },
            {
              id: 'x1c2s1-002', template: 'comparison-reasoning',
              title: '影响反应速率的因素',
              params: {
                conceptA: '内因（反应物本身性质）',
                conceptB: '外因（浓度/温度/压强/催化剂）',
                description: 'Na与H₂O反应比Mg剧烈得多。升高温度、增大浓度、使用催化剂均能加快反应速率',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么不是外因？',
                excludeHint: 'Na与Mg的活泼性不同是本质差异',
                excludeKeyTerms: ['本质', '性质', '化学键'],
                differenceOptions: ['内因是决定性因素，外因通过内因起作用', '外因不影响反应速率', '内因可改变而外因不可改变', '两者互不影响'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '将食物放入冰箱冷藏可以延长保质期，这是利用了哪种因素？',
                scenarioOptions: ['内因', '温度（外因）', '浓度（外因）', '催化剂'],
                scenarioCorrectIndex: 1,
                reasoning: [
                  '内因是反应物自身的化学性质（键能、结构等），是反应速率的决定性因素。如Na比Mg活泼是因为Na更易失电子',
                  '外因（浓度、温度、压强、催化剂）通过改变活化分子百分数或碰撞频率来影响速率',
                  '浓度增大→单位体积内分子总数增多→有效碰撞频率增大；温度升高→活化分子百分数增大',
                  '催化剂降低活化能→活化分子百分数显著增大→速率加快。外因不改变反应的本质和方向'
                ]
              }
            },
            {
              id: 'x1c2s1-003', template: 'concept-construction',
              title: '速率常数k与阿伦尼乌斯公式',
              params: {
                cases: ['基元反应aA+bB→产物，速率方程v=k[A]ᵃ[B]ᵇ', '温度升高10℃，k增大为原来2-4倍', '催化剂使k显著增大'],
                caseOptions: ['都与速率常数k有关', '都涉及反应级数', '都需要确定反应机理'],
                caseCorrectIndices: [0],
                caseCommonality: '速率常数k是反应速率的重要量度，受温度和催化剂影响',
                conceptName: '速率常数k与阿伦尼乌斯公式',
                definitionKeyTerms: ['k', '速率常数', '活化能', '阿伦尼乌斯公式'],
                definitionHint: 'k的物理意义及影响因素',
                fullDefinition: '速率常数k是与浓度无关的物理量，与温度和催化剂有关。阿伦尼乌斯公式：k=A·e^(-Ea/RT)，温度升高k增大，催化剂降低活化能使k增大',
                boundaryItems: ['k与浓度无关', '温度升高k增大', '催化剂降低活化能使k增大', '反应级数越大k越大'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么催化剂能显著增大反应速率？',
                explainHint: '从活化能和k的角度思考',
                explainKeyTerms: ['活化能', 'Ea', '指数关系'],
                reasoning: [
                  '基元反应的速率方程可直接由化学计量数写出：v=k[A]ᵃ[B]ᵇ，k为速率常数',
                  '阿伦尼乌斯公式k=A·e^(-Ea/RT)：活化能Ea越小、温度T越高，k越大',
                  '催化剂通过改变反应路径降低活化能，Ea减小→e^(-Ea/RT)指数增大→k显著增大',
                  'k不随浓度变化，但A（指前因子）和Ea（活化能）是反应的特征参数'
                ]
              }
            }
          ]
        },
        {
          id: 'x1-ch2-sec2',
          title: '第二节 化学平衡',
          exercises: [
            {
              id: 'x1c2s2-001', template: 'concept-construction',
              title: '化学平衡状态的特征',
              params: {
                cases: ['密闭容器中N₂+3H₂⇌2NH₃达到平衡后各组分浓度不变', '平衡后加入N₂，平衡正向移动', '平衡后升高温度，平衡向吸热方向移动'],
                caseOptions: ['都涉及动态平衡状态', '都涉及平衡移动', '都使用催化剂'],
                caseCorrectIndices: [0],
                caseCommonality: '化学平衡是可逆反应在密闭容器中达到的正逆反应速率相等、各组分浓度不变的状态',
                conceptName: '化学平衡状态的特征',
                definitionKeyTerms: ['逆', '等', '动', '定', '变'],
                definitionHint: '化学平衡特征可概括为五个字：逆、等、动、定、变',
                fullDefinition: '化学平衡特征：逆（可逆反应）、等（正逆反应速率相等≠0）、动（动态平衡）、定（各组分浓度不变）、变（条件改变平衡移动）',
                boundaryItems: ['平衡时正逆反应速率相等但不为零', '平衡时各组分浓度保持不变', '平衡后加入反应物平衡正向移动', '催化剂能改变化学平衡位置'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么催化剂不能改变平衡位置？',
                explainHint: '催化剂对正逆反应速率的影响是否相同？',
                explainKeyTerms: ['同等改变', '正逆速率', 'V正=V逆'],
                reasoning: [
                  '化学平衡为动态平衡：V正=V逆≠0，反应仍在进行但各物质浓度不变',
                  '平衡特征五字：逆（前提）、等（本质）、动（属性）、定（表现）、变（外因导致移动）',
                  '催化剂同倍增大正逆反应速率，因此V正=V逆的关系不变，平衡不移动，但到达平衡的时间缩短',
                  '平衡移动：浓度改变→Q≠K→移动；温度改变→K变→移动；压强改变→若气体计量数和相等则平衡不移动'
                ]
              }
            },
            {
              id: 'x1c2s2-002', template: 'concept-construction',
              title: '平衡常数K的表达式',
              params: {
                cases: ['对于反应N₂+3H₂⇌2NH₃，K=[NH₃]²/[N₂][H₂]³', '对于反应CH₃COOH⇌CH₃COO⁻+H⁺，Ka=[CH₃COO⁻][H⁺]/[CH₃COOH]'],
                caseOptions: ['都使用生成物浓度幂之积除以反应物浓度幂之积', '都包含固体', '都是气相反应'],
                caseCorrectIndices: [0],
                caseCommonality: '平衡常数K是生成物浓度幂之积与反应物浓度幂之积的比值',
                conceptName: '平衡常数K的表达式',
                definitionKeyTerms: ['K', '浓度幂', '纯固体', '纯液体'],
                definitionHint: 'K的表达式中纯固体和纯液体不写入',
                fullDefinition: '对于可逆反应aA+bB⇌cC+dD，K=[C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ。纯固体和纯液体的浓度视为常数，不写入K表达式。K只与温度有关',
                boundaryItems: ['K只与温度有关', 'K值越大反应正向进行程度越大', '纯固体和纯液体不写入K表达式', '反应系数加倍时K值平方'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么纯固体和纯液体不写入平衡常数表达式？',
                explainHint: '固体和液体的浓度在反应中如何变化？',
                explainKeyTerms: ['浓度恒定', '密度', '摩尔质量'],
                reasoning: [
                  '纯固体和纯液体的浓度视为常数（密度/摩尔质量），不因量的改变而变化，故不写入K表达式',
                  'K的表达式与化学方程式的书写方式有关，书写方式不同K值可能不同（如系数加倍则K平方）',
                  'K只随温度变化，不随浓度、压强变化。通过K值大小可判断反应进行的程度'
                ]
              }
            },
            {
              id: 'x1c2s2-003', template: 'comparison-reasoning',
              title: 'Q与K比较判断平衡移动',
              params: {
                conceptA: 'Q < K',
                conceptB: 'Q > K',
                description: '反应N₂+3H₂⇌2NH₃在某时刻Q=0.1，K=0.5。另一时刻Q=1.0，K=0.5',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么Q=1.0，K=0.5的情况不是Q<K？',
                excludeHint: '比较Q和K的大小来判断',
                excludeKeyTerms: ['Q>K', '逆向', '反应物'],
                differenceOptions: ['Q<K正向移动，Q>K逆向移动', 'Q<K逆向移动，Q>K正向移动', 'Q与K比较不影响平衡', '只有Q=K时反应才进行'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '某反应在25℃时K=100，该温度下Q=50，判断反应方向？',
                scenarioOptions: ['正向进行', '逆向进行', '已达平衡', '无法判断'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  'Q=[C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ（任意时刻的浓度商），K为平衡常数（平衡时的浓度商）',
                  'Q<K→生成物浓度偏小→正向移动达到平衡；Q>K→生成物浓度偏大→逆向移动达到平衡',
                  'Q=K时体系处于平衡状态，正逆反应速率相等',
                  'Ksp沉淀溶解平衡类似：Q<Ksp无沉淀，Q=Ksp饱和，Q>Ksp有沉淀析出'
                ]
              }
            },
            {
              id: 'x1c2s2-004', template: 'error-analysis',
              title: '勒夏特列原理的应用',
              params: {
                statement: '对于反应2NO₂(g) ⇌ N₂O₄(g) ΔH<0，升高温度，平衡向放热方向移动，NO₂浓度减小',
                errorOptions: ['升高温度', '平衡向放热方向移动', 'NO₂浓度减小', '没有错误'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['ΔH<0', '放热', '吸热', '勒夏特列原理'],
                principleHint: '△H<0表示正向放热，逆向吸热。升温向吸热方向移动',
                correctVersion: '升温使平衡向吸热方向（逆向）移动，NO₂浓度增大，体系颜色加深',
                finalHint: '升高温度平衡向吸热方向移动，降温向放热方向移动',
                reasoning: [
                  '勒夏特列原理：改变影响平衡的一个条件，平衡向减弱这种改变的方向移动',
                  '该反应正向放热（ΔH<0），逆向吸热。升高温度平衡向吸热方向（逆向）移动',
                  '平衡逆向移动后NO₂浓度增大（NO₂为红棕色，体系颜色加深），而非减小',
                  '温度变化影响K值：升温K变小（放热反应），与原陈述结论一致'
                ]
              }
            },
            {
              id: 'x1c2s2-005', template: 'experimental-reasoning',
              title: '平衡移动方向的判断步骤',
              params: {
                goal: '判断条件改变后化学平衡的移动方向',
                principleOptions: ['勒夏特列原理：平衡向减弱条件改变的方向移动', '质量守恒定律', '能量守恒定律', '阿伏加德罗定律'],
                principleCorrectIndex: 0,
                keyStepItems: ['判断条件改变的类型（浓度/温度/压强）', '分析该条件改变对平衡的影响方向', '根据勒夏特列原理得出平衡移动方向', '判断移动后的现象（颜色/转化率等）', '如果涉及K值变化，分析K的增减'],
                keyStepCorrectIndices: [0, 1, 2, 3, 4],
                orderItems: ['判断条件改变的类型', '分析该条件改变对平衡的影响方向', '根据勒夏特列原理得出平衡移动方向', '判断移动后的现象', '分析K值变化'],
                orderCorrect: [0, 1, 2, 3, 4],
                orderHint: '先识别变化，再分析影响，最后判断结果',
                consequenceOptions: ['准确判断平衡移动方向', '误判移动方向', '无法确定现象'],
                consequenceCorrectIndex: 0,
                reasoning: [
                  '勒夏特列原理适用于所有动态平衡，判断前提是明确条件改变的类型',
                  '浓度改变不影响K值，但使Q≠K从而平衡移动；温度改变使K值变化；压强改变本质是浓度的变化',
                  '催化剂不影响平衡位置（同倍改变正逆反应速率），只影响到达平衡的时间',
                  '注意适用条件：勒夏特列原理只能判断减弱趋势，不能判断具体数值变化'
                ]
              }
            },
            {
              id: 'x1c2s2-006', template: 'concept-construction',
              title: '等效平衡',
              params: {
                cases: ['恒温恒容下H₂+I₂⇌2HI，投料1:1与2:2达到相同平衡状态', '恒温恒容下N₂+3H₂⇌2NH₃，投料1:3与2:6不等效', '恒温恒压下N₂+3H₂⇌2NH₃，投料1:3与2:6等效'],
                caseOptions: ['都讨论不同投料方式能否达到相同平衡', '都使用相同催化剂', '反应物状态相同'],
                caseCorrectIndices: [0],
                caseCommonality: '等效平衡探究不同起始投料能否达到组成相同的平衡状态',
                conceptName: '等效平衡',
                definitionKeyTerms: ['等效平衡', '恒温恒容', '恒温恒压', '投料等比/等量'],
                definitionHint: '等效平衡的条件取决于容器条件（恒容/恒压）和反应前后气体分子数的变化',
                fullDefinition: '等效平衡：相同条件下同一可逆反应，不同起始投料方式达到的平衡状态中各组分百分含量相同。恒温恒容时，反应前后气体系数和不等需投料等量；相等时等比即可。恒温恒压时投料等比即等效',
                boundaryItems: ['恒容下H₂+I₂⇌2HI投料1:1和2:2等效（反应前后气体分子数相等）', '恒容下N₂+3H₂⇌2NH₃投料1:3和2:6不等效（气体分子数不等）', '恒压下N₂+3H₂⇌2NH₃投料1:3和2:6等效', '等效平衡体系中各物质浓度一定相等'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么恒容下N₂+3H₂⇌2NH₃投料1:3与2:6不等效？',
                explainHint: '反应前后气体分子数变化，恒容下压强不同',
                explainKeyTerms: ['压强', '气体分子数', '平衡移动'],
                reasoning: [
                  '等效平衡的核心：最终各组分百分含量（而非浓度）相同',
                  '恒温恒容条件：若反应前后气体分子数不等（如N₂+3H₂⇌2NH₃），需投料完全相同（等量）才等效',
                  '恒温恒容条件：若反应前后气体分子数相等（如H₂+I₂⇌2HI），投料等比即等效（压强不影响平衡）',
                  '恒温恒压条件：投料等比即等效（体积可调，保持总压不变）'
                ]
              }
            }
          ]
        },
        {
          id: 'x1-ch2-sec3',
          title: '第三节 化学反应的方向',
          exercises: [
            {
              id: 'x1c2s3-001', template: 'concept-construction',
              title: '化学反应方向的判据——ΔG',
              params: {
                cases: ['常温下2H₂O₂→2H₂O+O₂自发进行（ΔH<0，ΔS>0）', 'NH₄Cl(s)→NH₃(g)+HCl(g)室温下自发（ΔH>0，ΔS>0）', 'N₂+3H₂⇌2NH₃高温下非自发，低温自发（ΔH<0，ΔS<0）'],
                caseOptions: ['都通过ΔG=ΔH-TΔS判断方向', '都是放热反应', '都是熵增反应'],
                caseCorrectIndices: [0],
                caseCommonality: '自发反应方向由吉布斯自由能变ΔG=ΔH-TΔS决定，ΔG<0自发',
                conceptName: 'ΔG与反应方向',
                definitionKeyTerms: ['ΔG', 'ΔH', 'ΔS', '自发'],
                definitionHint: '综合焓变和熵变两个因素判断反应方向',
                fullDefinition: '自发反应判据：ΔG=ΔH-TΔS。ΔG<0自发，ΔG=0平衡，ΔG>0非自发。ΔH<0且ΔS>0时任何温度自发；ΔH>0且ΔS<0时任何温度非自发',
                boundaryItems: ['ΔH<0且ΔS>0任何温度自发', 'ΔH>0且ΔS<0任何温度非自发', 'ΔH<0且ΔS<0低温自发', 'ΔS>0表示熵增（气体分子数增加）'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么NH₄Cl分解（ΔH>0，ΔS>0）在室温下能自发进行？',
                explainHint: '计算ΔG=ΔH-TΔS，谁占主导？',
                explainKeyTerms: ['TΔS', '熵增', '温度'],
                reasoning: [
                  'ΔH>0（吸热）不利自发，ΔS>0（熵增）有利自发。室温时TΔS项可能大于ΔH，使ΔG<0',
                  'ΔH<0且ΔS<0：低温时|TΔS|<|ΔH|，ΔG<0自发；高温时|TΔS|>|ΔH|，ΔG>0非自发',
                  'ΔG只能判断反应方向（可能性），不能判断反应速率（现实性）——热力学与动力学因素',
                  '气体分子数增加的反应ΔS>0，固体→气体或气体分子数增多的反应熵增大'
                ]
              }
            }
          ]
        },
        {
          id: 'x1-ch2-sec4',
          title: '第四节 化学反应的调控',
          exercises: [
            {
              id: 'x1c2s4-001', template: 'error-analysis',
              title: '合成氨的工业条件选择',
              params: {
                statement: '合成氨反应N₂+3H₂⇌2NH₃ ΔH<0，为提高平衡产率应选择高温、高压、使用催化剂',
                errorOptions: ['高温', '高压', '使用催化剂', '没有错误'],
                errorCorrectIndex: 0,
                principleKeyTerms: ['放热反应', '平衡移动', '速率'],
                principleHint: '该反应放热，升温平衡逆向移动，产率降低',
                correctVersion: '合成氨采用400~500℃（平衡与速率兼顾）、20~50MPa（适当高压）、铁触媒催化的条件',
                finalHint: '工业条件选择需综合考虑速率、平衡、设备成本',
                reasoning: [
                  '合成氨放热（ΔH<0），升高温度平衡逆向移动，NH₃产率降低。但低温反应速率太慢，故实际采用400~500℃兼顾速率与平衡',
                  '高压有利于平衡正向移动（气体分子数减少），但受设备成本限制，采用20~50MPa',
                  '催化剂（铁触媒）不改变化学平衡位置，但可以降低活化能、加快反应速率，使在较温和条件下达到较高产率',
                  '工业条件选择的三大原则：反应速率、平衡产率、生产成本（设备/能源/原料）'
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'x1-ch3',
      title: '第三章 水溶液中的离子反应与平衡',
      sections: [
        {
          id: 'x1-ch3-sec1',
          title: '第一节 电离平衡',
          exercises: [
            {
              id: 'x1c3s1-001', template: 'comparison-reasoning',
              title: '强电解质与弱电解质的比较',
              params: {
                conceptA: '强电解质',
                conceptB: '弱电解质',
                description: 'HCl在水中完全电离，CH₃COOH在水中部分电离',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么CH₃COOH不是强电解质？',
                excludeHint: 'CH₃COOH在水中的电离程度',
                excludeKeyTerms: ['部分电离', '可逆', '电离平衡'],
                differenceOptions: ['电离程度不同（完全vs部分）', '溶解度不同', '导电性一定不同', '颜色不同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '相同浓度的HCl和CH₃COOH溶液，哪个导电性更强？',
                scenarioOptions: ['HCl', 'CH₃COOH', '一样强', '无法比较'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '强电解质（强酸/强碱/大多数盐）在水中完全电离，不可逆，用"="连接',
                  '弱电解质（弱酸/弱碱/水）在水中部分电离，存在电离平衡，用"⇌"连接',
                  '强电解质电离方程式中写成离子形式，弱电解质保留分子形式。溶液导电性取决于自由移动离子浓度',
                  '相同浓度时强电解质电离出的离子浓度远大于弱电解质，故导电性更强'
                ]
              }
            },
            {
              id: 'x1c3s1-002', template: 'concept-construction',
              title: '电离平衡的影响因素',
              params: {
                cases: ['CH₃COOH溶液中加水稀释，c(H⁺)减小但电离度增大', 'CH₃COOH溶液中加入CH₃COONa固体，c(H⁺)减小', '加热NH₃·H₂O，c(OH⁻)增大'],
                caseOptions: ['都影响电离平衡的移动', '都改变溶液体积', '都加入其他物质'],
                caseCorrectIndices: [0],
                caseCommonality: '温度、浓度、同离子效应等外因可影响弱电解质的电离平衡',
                conceptName: '电离平衡的影响因素',
                definitionKeyTerms: ['电离平衡', '温度', '稀释', '同离子效应'],
                definitionHint: '电离吸热，升温促进电离；稀释促进电离但离子浓度不一定增大',
                fullDefinition: '电离平衡是弱电解质电离成离子的速率等于离子结合成分子的速率时的状态。影响因素：①温度升高促进电离（电离吸热）；②稀释促进电离（电离度增大）；③同离子效应抑制电离',
                boundaryItems: ['CH₃COOH中加入CH₃COONa，c(H⁺)减小（同离子效应）', 'NH₃·H₂O中加入NH₄Cl，碱性减弱', '稀释CH₃COOH溶液，c(H⁺)先增大后减小', '加热促进水的电离，Kw增大'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么稀释CH₃COOH溶液，c(H⁺)会减小？电离度不是增大了吗？',
                explainHint: '稀释后总体积增大，即使电离度增大，H⁺的物质的量增加幅度不如体积增加幅度',
                explainKeyTerms: ['体积增大', '浓度稀释', '电离度'],
                reasoning: [
                  '温度：电离吸热，升温平衡正向移动，电离度增大，离子浓度增大',
                  '稀释：加水稀释平衡正向移动，电离度增大，但c(H⁺)仍减小（体积增大的稀释效应大于电离增量的效应）',
                  '同离子效应：加入含有相同离子的强电解质，平衡逆向移动，电离度减小',
                  '电离度α=已电离分子数/起始分子数×100%，稀释使α增大但并不意味着所有离子浓度都增大'
                ]
              }
            }
          ]
        },
        {
          id: 'x1-ch3-sec2',
          title: '第二节 水的电离和溶液的pH',
          exercises: [
            {
              id: 'x1c3s2-001', template: 'concept-construction',
              title: '水的离子积Kw与pH',
              params: {
                cases: ['25℃时纯水c(H⁺)=c(OH⁻)=1×10⁻⁷mol/L，Kw=1×10⁻¹⁴', '100℃时纯水c(H⁺)=c(OH⁻)=1×10⁻⁶mol/L，Kw=1×10⁻¹²', 'pH=3的盐酸c(H⁺)=1×10⁻³mol/L'],
                caseOptions: ['都用Kw=c(H⁺)·c(OH⁻)和水溶液中的H⁺/OH⁻关系', '都是酸性溶液', '都包含水的电离'],
                caseCorrectIndices: [0],
                caseCommonality: 'Kw=c(H⁺)·c(OH⁻)适用于所有水溶液体系，pH=-lg c(H⁺)',
                conceptName: '水的离子积Kw与pH',
                definitionKeyTerms: ['Kw', 'c(H⁺)', 'c(OH⁻)', 'pH'],
                definitionHint: 'Kw只与温度有关，pH是c(H⁺)的负对数',
                fullDefinition: '水的离子积Kw=c(H⁺)·c(OH⁻)，25℃时Kw=1.0×10⁻¹⁴。pH=-lg c(H⁺)。中性时c(H⁺)=c(OH⁻)，pH=-lg√Kw。Kw只与温度有关，温度升高Kw增大',
                boundaryItems: ['25℃时pH=7的溶液一定中性', '100℃时Kw≈10⁻¹²，中性pH=6', 'pH=0的溶液c(H⁺)=1mol/L', 'pH每减小1，c(H⁺)增大10倍'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么100℃时中性溶液的pH=6而不是7？',
                explainHint: '中性时c(H⁺)=c(OH⁻)=√Kw',
                explainKeyTerms: ['Kw', '温度', '中性'],
                reasoning: [
                  'Kw=c(H⁺)·c(OH⁻)是水的自偶电离平衡常数，只与温度有关（温度升高Kw增大）',
                  '中性溶液c(H⁺)=c(OH⁻)，pH=-lg c(H⁺)=-lg√Kw。100℃时Kw=10⁻¹²，√Kw=10⁻⁶，pH=6',
                  'pH=-lg c(H⁺)，c(H⁺)越大pH越小。pH=0时c(H⁺)=1mol/L，pH=7时c(H⁺)=10⁻⁷mol/L',
                  'Kw适用于所有稀水溶液体系（包括酸性/碱性溶液），是计算溶液pH的基础'
                ]
              }
            },
            {
              id: 'x1c3s2-002', template: 'concept-construction',
              title: '酸碱中和滴定中的pH计算',
              params: {
                cases: ['25℃下20.00mL 0.1000mol/L HCl用0.1000mol/L NaOH滴定至等当点，pH=7', '25℃下20.00mL 0.1000mol/L CH₃COOH用0.1000mol/L NaOH滴定至等当点，pH>7'],
                caseOptions: ['都是中和滴定pH计算', '都使用强碱滴定', '等当点pH相同'],
                caseCorrectIndices: [0],
                caseCommonality: '中和滴定等当点的pH取决于产物盐的性质（强酸强碱盐中性，弱酸强碱盐碱性）',
                conceptName: '酸碱中和滴定中的pH计算',
                definitionKeyTerms: ['等当点', '滴定', 'pH', '指示剂'],
                definitionHint: '等当点（化学计量点）时酸和碱恰好完全中和，pH由生成的盐决定',
                fullDefinition: '中和滴定等当点pH计算：强酸强碱完全中和生成强酸强碱盐不水解，pH=7（25℃）。强酸弱碱滴定生成强酸弱碱盐水解显酸性（pH<7）。强碱弱酸滴定生成强碱弱酸盐水解显碱性（pH>7）',
                boundaryItems: ['强酸强碱滴定等当点pH=7', '强碱弱酸滴定等当点pH>7', '强酸弱碱滴定等当点pH<7', '滴定突跃范围与酸碱性无关'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么强酸滴定弱碱等当点时pH<7？',
                explainHint: '生成的盐是否水解？',
                explainKeyTerms: ['水解', '弱碱阳离子', 'H⁺'],
                reasoning: [
                  '等当点时酸和碱恰好完全中和，但生成的盐可能水解导致溶液不呈中性',
                  '强酸弱碱盐（如NH₄Cl）中弱碱阳离子水解：NH₄⁺+H₂O⇌NH₃·H₂O+H⁺，溶液显酸性',
                  '强碱弱酸盐（如CH₃COONa）中弱酸阴离子水解：CH₃COO⁻+H₂O⇌CH₃COOH+OH⁻，溶液显碱性',
                  '选择指示剂时需让指示剂的变色范围在滴定突跃范围内，如强酸强碱滴定选酚酞或甲基橙'
                ]
              }
            },
            {
              id: 'x1c3s2-003', template: 'error-analysis',
              title: 'pH计算常见错误',
              params: {
                statement: '将pH=3的盐酸稀释10倍，pH变为4；稀释100倍，pH变为5；稀释1000倍，pH变为6；稀释10000倍，pH变为7',
                errorOptions: ['pH=3稀释10倍得pH=4', '稀释100倍得pH=5', '稀释1000倍得pH=6', '稀释10000倍得pH=7'],
                errorCorrectIndex: 3,
                principleKeyTerms: ['无限稀释', '水电离', '酸碱性'],
                principleHint: '酸无限稀释不可能变为碱性（pH>7），接近中性但略小于7',
                correctVersion: '强酸稀释10000倍后pH≈6.96（无限稀释接近7但略小于7，不会超过7）',
                finalHint: '酸稀释不可能变碱性，要考虑水电离的H⁺',
                reasoning: [
                  '强酸稀释时c(H⁺)来自酸和水两部分的贡献。酸极稀时水电离的H⁺不可忽略',
                  'pH=3的盐酸c(H⁺)=10⁻³mol/L，稀释10000倍后c(H⁺)酸=10⁻⁷mol/L，水电离的c(H⁺)≈10⁻⁷mol/L（25℃），总c(H⁺)≈2×10⁻⁷mol/L，pH≈6.70',
                  '更精确计算：总c(H⁺)=c(H⁺)酸+c(H⁺)水，pH=-lg(10⁻⁷+10⁻⁷)=-lg(2×10⁻⁷)≈6.70',
                  '结论：酸无限稀释只能无限接近7但不会超过7，碱无限稀释亦然'
                ]
              }
            }
          ]
        },
        {
          id: 'x1-ch3-sec3',
          title: '第三节 盐类的水解',
          exercises: [
            {
              id: 'x1c3s3-001', template: 'concept-construction',
              title: '盐类水解的规律',
              params: {
                cases: ['CH₃COONa溶于水显碱性', 'NH₄Cl溶于水显酸性', 'NaCl溶于水显中性'],
                caseOptions: ['都根据盐的组成判断水溶液的酸碱性', '都完全电离', '都发生水解'],
                caseCorrectIndices: [0],
                caseCommonality: '盐类水解规律：谁弱谁水解，谁强显谁性。弱酸强碱盐显碱性，强酸弱碱盐显酸性，强酸强碱盐不水解',
                conceptName: '盐类水解的规律',
                definitionKeyTerms: ['水解', '弱酸阴离子', '弱碱阳离子', '显性'],
                definitionHint: '判断盐的组成：阳离子来自强碱还是弱碱？阴离子来自强酸还是弱酸？',
                fullDefinition: '盐类水解规律：有弱才水解，都弱都水解，越弱越水解，谁强显谁性。强酸强碱盐（如NaCl）不水解显中性；强酸弱碱盐（如NH₄Cl）水解显酸性；弱酸强碱盐（如CH₃COONa）水解显碱性',
                boundaryItems: ['FeCl₃水解使溶液显酸性', 'Na₂CO₃水解使溶液显碱性', 'Al₂(SO₄)₃水溶液显中性', 'NH₄NO₃水溶液显碱性'],
                boundaryCorrectIndices: [0, 1],
                explainPrompt: '为什么FeCl₃溶液显酸性？',
                explainHint: 'FeCl₃中Fe³⁺是来自弱碱还是强碱？',
                explainKeyTerms: ['Fe³⁺', '水解', 'H⁺', '弱碱阳离子'],
                reasoning: [
                  'CH₃COONa：CH₃COO⁻（弱酸根）+H₂O⇌CH₃COOH+OH⁻，溶液显碱性',
                  'NH₄Cl：NH₄⁺（弱碱阳离子）+H₂O⇌NH₃·H₂O+H⁺，溶液显酸性',
                  'FeCl₃中Fe³⁺是弱碱阳离子：Fe³⁺+3H₂O⇌Fe(OH)₃+3H⁺，溶液显酸性',
                  'Na₂CO₃中CO₃²⁻是二元弱酸根：CO₃²⁻+H₂O⇌HCO₃⁻+OH⁻，溶液显碱性'
                ]
              }
            },
            {
              id: 'x1c3s3-002', template: 'error-analysis',
              title: '水解离子方程式的书写',
              params: {
                statement: 'FeCl₃水解的离子方程式为：Fe³⁺ + 3H₂O = Fe(OH)₃↓ + 3H⁺',
                errorOptions: ['Fe³⁺ + 3H₂O', '= Fe(OH)₃↓', '= 3H⁺', '水解符号'],
                errorCorrectIndex: 3,
                principleKeyTerms: ['微弱', '可逆', '⇌'],
                principleHint: '水解是微弱可逆的，应该用⇌而不是=，也不能写沉淀符号',
                correctVersion: 'Fe³⁺ + 3H₂O ⇌ Fe(OH)₃ + 3H⁺（水解可逆，不能用=和↓）',
                finalHint: '一般水解用⇌，不标↑↓（彻底双水解除外）',
                reasoning: [
                  '单水解是微弱且可逆的过程，必须用可逆符号"⇌"，不能用等号"="',
                  '单水解程度很小，产物一般浓度较低，不标"↑"气体符号和"↓"沉淀符号',
                  '少数彻底双水解（如Al³⁺和HCO₃⁻）程度较大可用"="并标↑↓',
                  '书写水解离子方程式的三步：①找出弱离子；②写水解反应；③检查可逆符号、电荷守恒、原子守恒'
                ]
              }
            },
            {
              id: 'x1c3s3-003', template: 'concept-construction',
              title: '水解常数Kh与Ka/Kb关系',
              params: {
                cases: ['已知CH₃COOH的Ka=1.75×10⁻⁵，求CH₃COONa水解常数Kh=Kw/Ka≈5.71×10⁻¹⁰', '已知NH₃·H₂O的Kb=1.8×10⁻⁵，求NH₄Cl水解常数Kh=Kw/Kb≈5.56×10⁻¹⁰'],
                caseOptions: ['都通过Kh=Kw/Ka(或Kb)计算水解常数', '都使用相同方法', '都涉及强电解质'],
                caseCorrectIndices: [0],
                caseCommonality: 'Kh = Kw / Ka（弱酸盐）或 Kh = Kw / Kb（弱碱盐），越弱越水解',
                conceptName: '水解常数Kh与Ka/Kb关系',
                definitionKeyTerms: ['Kh', 'Ka', 'Kb', 'Kw'],
                definitionHint: 'Kh与Ka/Kb成反比，Ka或Kb越小Kh越大，水解程度越大',
                fullDefinition: '水解常数Kh：对于弱酸强碱盐（A⁻+H₂O⇌HA+OH⁻），Kh=Kw/Ka；对于强酸弱碱盐（B⁺+H₂O⇌BOH+H⁺），Kh=Kw/Kb。Ka/Kb越小（酸/碱越弱），Kh越大，水解程度越大',
                boundaryItems: ['Kh = Kw / Ka（弱酸盐）', 'Kh = Kw / Kb（弱碱盐）', '温度升高Kh增大（水解吸热）', 'Ka越小Kh越小'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么Ka越小Kh越大？',
                explainHint: '水解常数与电离常数的关系公式',
                explainKeyTerms: ['反比', 'Kw', '越弱越水解'],
                reasoning: [
                  '弱酸盐（CH₃COONa）水解：CH₃COO⁻+H₂O⇌CH₃COOH+OH⁻，Kh=[CH₃COOH][OH⁻]/[CH₃COO⁻]',
                  '分子分母同乘[H⁺]：Kh=Kw/Ka。Ka越小→Kh越大→水解程度越大（越弱越水解）',
                  '弱碱盐（NH₄Cl）水解：NH₄⁺+H₂O⇌NH₃·H₂O+H⁺，Kh=Kw/Kb',
                  '温度升高促进水解（水解吸热），Kh增大；稀释促进水解，水解度增大'
                ]
              }
            }
          ]
        },
        {
          id: 'x1-ch3-sec4',
          title: '第四节 沉淀溶解平衡',
          exercises: [
            {
              id: 'x1c3s4-001', template: 'concept-construction',
              title: '沉淀溶解平衡与Ksp',
              params: {
                cases: ['AgCl(s)⇌Ag⁺(aq)+Cl⁻(aq)，Ksp=[Ag⁺][Cl⁻]', '向AgCl饱和液中加入NaCl，c(Ag⁺)减小', '向AgCl饱和液中加入AgNO₃，Ksp不变'],
                caseOptions: ['都涉及沉淀溶解平衡和Ksp', '都有沉淀生成', '都改变溶液体积'],
                caseCorrectIndices: [0],
                caseCommonality: '沉淀溶解平衡是动态平衡，Ksp是溶解平衡常数，只与温度有关',
                conceptName: '沉淀溶解平衡与Ksp',
                definitionKeyTerms: ['Ksp', '沉淀溶解平衡', '温度'],
                definitionHint: 'Ksp表达式类似于平衡常数，离子浓度加指数（计量数）',
                fullDefinition: '对于AmBn(s)⇌mAⁿ⁺(aq)+nBᵐ⁻(aq)，Ksp=[Aⁿ⁺]ᵐ[Bᵐ⁻]ⁿ。Ksp只与温度有关。Q=Ksp饱和，Q>Ksp有沉淀，Q<Ksp沉淀溶解。同类型沉淀Ksp越大溶解度越大',
                boundaryItems: ['AgCl的Ksp大于AgBr的Ksp', '向AgCl饱和液中加NaCl，c(Ag⁺)减小（同离子效应）', '向AgCl饱和液中加AgNO₃，Ksp变大', 'Q<Ksp时无沉淀析出'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么向AgCl饱和溶液中加入NaCl，c(Ag⁺)会减小？',
                explainHint: 'Cl⁻浓度增大后Q和Ksp的关系',
                explainKeyTerms: ['同离子效应', 'Cl⁻', '平衡左移'],
                reasoning: [
                  'Ksp是沉淀溶解平衡常数，只与温度有关。温度升高大多数Ksp增大',
                  '同离子效应：加入含相同离子的强电解质，平衡逆向移动，难溶电解质溶解度减小',
                  'Q与Ksp比较：Q=Ksp饱和，Q>Ksp有沉淀生成，Q<Ksp沉淀溶解（不饱和）',
                  '同类型沉淀（如AgCl、AgBr、AgI），Ksp越小溶解度越小，沉淀越易生成'
                ]
              }
            },
            {
              id: 'x1c3s4-002', template: 'experimental-reasoning',
              title: '沉淀转化的判断',
              params: {
                goal: '判断并实现沉淀转化（从一种难溶电解质转化为更难溶的电解质）',
                principleOptions: ['沉淀转化方向：向Ksp更小（溶解度更小）的方向转化', '沉淀转化与浓度无关', 'Ksp大的可以转化为Ksp小的', '任何沉淀之间都可以相互转化'],
                principleCorrectIndex: 0,
                keyStepItems: ['写出两种沉淀的溶解平衡表达式', '查出两种沉淀的Ksp值', '比较Ksp大小（同类型）', '判断转化方向（向Ksp更小的方向）', '写出转化反应的离子方程式'],
                keyStepCorrectIndices: [0, 1, 2, 3, 4],
                orderItems: ['写出两种沉淀的溶解平衡', '查出Ksp值', '比较Ksp大小', '判断转化方向', '写出转化离子方程式'],
                orderCorrect: [0, 1, 2, 3, 4],
                orderHint: '先明确反应，再比较数据，最后判断方向',
                consequenceOptions: ['实现沉淀转化（如AgCl→AgBr→AgI→Ag₂S）', '转化方向判断反了', '无法找到合适的沉淀剂'],
                consequenceCorrectIndex: 0,
                reasoning: [
                  '沉淀转化方向：溶解度大的→溶解度小的（即Ksp大的→Ksp小的），离子浓度更低的更稳定',
                  '典型转化链：AgCl(白,Ksp≈1.8×10⁻¹⁰)→AgBr(浅黄,Ksp≈5.4×10⁻¹³)→AgI(黄,Ksp≈8.5×10⁻¹⁷)→Ag₂S(黑,Ksp≈6.3×10⁻⁵⁰)',
                  'Ksp相差越大，转化越彻底。通过加入适当的沉淀剂（Br⁻、I⁻、S²⁻等）实现转化',
                  '注意：不同类型的沉淀（如AgCl和Ag₂CrO₄）不能直接比较Ksp大小，需计算溶解度'
                ]
              }
            },
            {
              id: 'x1c3s4-003', template: 'error-analysis',
              title: '溶度积Ksp的表达式',
              params: {
                statement: '对于沉淀Ag₂CrO₄(s) ⇌ 2Ag⁺(aq) + CrO₄²⁻(aq)，其Ksp = [Ag⁺][CrO₄²⁻]',
                errorOptions: ['Ag₂CrO₄(s) ⇌ 2Ag⁺', 'CrO₄²⁻(aq)', 'Ksp = [Ag⁺][CrO₄²⁻]', '没有错误'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['系数', '指数', 'Ksp表达式'],
                principleHint: 'Ksp表达式中离子浓度要加上对应的化学计量数作为指数',
                correctVersion: 'Ksp(Ag₂CrO₄) = [Ag⁺]²[CrO₄²⁻]',
                finalHint: '平衡常数表达式中浓度幂的指数等于化学计量数',
                reasoning: [
                  'Ksp表达式的形式与平衡常数一致：生成物浓度幂之积，浓度指数等于化学计量数',
                  'Ag₂CrO₄溶解：1个Ag₂CrO₄产生2个Ag⁺和1个CrO₄²⁻，∴Ksp=[Ag⁺]²[CrO₄²⁻]',
                  '常见错误：漏写系数指数，对于AgCl、AgBr等1:1型沉淀因指数为1常被忽略，但对Ag₂CrO₄等非1:1型必须注意'
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'x1-ch4',
      title: '第四章 化学反应与电能',
      sections: [
        {
          id: 'x1-ch4-sec1',
          title: '第一节 原电池',
          exercises: [
            {
              id: 'x1c4s1-001', template: 'comparison-reasoning',
              title: '原电池与电解池的对比',
              params: {
                conceptA: '原电池',
                conceptB: '电解池',
                description: 'Cu-Zn原电池将化学能转化为电能；电解NaCl溶液将电能转化为化学能',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么Cu-Zn装置不是电解池？',
                excludeHint: '是否连接了外接电源',
                excludeKeyTerms: ['自发放电', '化学能→电能', '无外接电源'],
                differenceOptions: ['能量转化方式不同（化学能→电能 vs 电能→化学能）', '电极名称完全相同', '电子流向完全相同', '反应类型完全相同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '将两个铂电极插入CuCl₂溶液并连接直流电源，这是什么装置？',
                scenarioOptions: ['电解池', '原电池', '浓差电池', '不能确定'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '原电池将化学能转化为电能（自发放电），负极氧化（失电子），正极还原（得电子），电子从负极经外电路流向正极',
                  '电解池将电能转化为化学能（非自发放电），阳极氧化（阴离子放电），阴极还原（阳离子放电），阳极与电源正极相连',
                  '原电池中较活泼金属作负极被腐蚀，电解池中阳极若为活性电极则可能溶解',
                  '两者共同点：均发生氧化还原反应，电子转移是核心'
                ]
              }
            },
            {
              id: 'x1c4s1-002', template: 'redox-reasoning',
              title: '铜锌原电池的电极反应',
              params: {
                substances: [
                  { key: 'zn', formula: 'Zn', valences: { Zn: 0 } },
                  { key: 'zn2', formula: 'Zn²⁺', valences: { Zn: 2 } },
                  { key: 'h', formula: 'H⁺', valences: { H: 1 } },
                  { key: 'h2', formula: 'H₂', valences: { H: 0 } }
                ],
                identifyOptions: ['Zn是还原剂，H⁺是氧化剂', 'Zn是氧化剂，H⁺是还原剂', 'Cu是还原剂', '无氧化还原'],
                identifyCorrectIndex: 0,
                identifyPrompt: '铜锌原电池中Zn和H⁺分别发生什么反应？',
                finalEquation: '负极：Zn - 2e⁻ = Zn²⁺（氧化）；正极：2H⁺ + 2e⁻ = H₂↑（还原）',
                finalHint: '负极失电子（氧化），正极得电子（还原），电子从Zn经导线流向Cu',
                reasoning: [
                  'Zn（0价）→Zn²⁺（+2价），失2e⁻，发生氧化反应，Zn是还原剂（负极）',
                  'H⁺（+1价）→H₂（0价），得2e⁻，发生还原反应，H⁺是氧化剂（正极）',
                  'Zn比Cu活泼，Zn优先失电子作负极，Cu作正极传递电子。电子从Zn→导线→Cu→溶液中H⁺',
                  '总反应：Zn + 2H⁺ = Zn²⁺ + H₂↑。盐桥（若有）维持电荷平衡'
                ]
              }
            },
            {
              id: 'x1c4s1-003', template: 'error-analysis',
              title: '原电池电极的判断',
              params: {
                statement: '在Mg-Al-NaOH溶液构成的原电池中，Mg比Al活泼，因此Mg做负极，Al做正极',
                errorOptions: ['Mg比Al活泼', 'Mg做负极', 'Al做正极', '没有错误'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['电解质环境', '自发放电', 'Al与NaOH反应'],
                principleHint: '电极判断要看电解质环境，能与电解质反应的金属作负极',
                correctVersion: 'Mg-Al-NaOH溶液：Al能与NaOH反应而Mg不能，Al作负极，Mg作正极',
                finalHint: '原电池负极的判断：能与电解质溶液反应（自发放电）的金属作负极',
                reasoning: [
                  '原电池的负极由"谁更易与电解质发生自发放电反应"决定，而非绝对的金属活泼性顺序',
                  'Mg-Al-NaOH中：Al+NaOH→NaAlO₂+H₂（Al失电子被氧化），Mg不与NaOH反应，故Al作负极',
                  '若换为Mg-Al-HCl溶液：Mg+2HCl→MgCl₂+H₂，Mg更活泼且与HCl反应，则Mg作负极',
                  '结论：电极判断必须结合电解质环境，活泼金属不一定作负极'
                ]
              }
            }
          ]
        },
        {
          id: 'x1-ch4-sec2',
          title: '第二节 电解池',
          exercises: [
            {
              id: 'x1c4s2-001', template: 'experimental-reasoning',
              title: '电解池的放电顺序',
              params: {
                goal: '判断电解池中阴、阳两极的放电顺序并正确书写电极反应式',
                principleOptions: ['阳极阴离子放电（还原性顺序），阴极阳离子放电（氧化性顺序）', '阳极阳离子放电，阴极阴离子放电', '放电顺序与浓度无关', '所有离子同时放电'],
                principleCorrectIndex: 0,
                keyStepItems: ['接通电源判断阴、阳极', '分析溶液中存在的阴、阳离子', '阳极：阴离子放电，按S²⁻>I⁻>Br⁻>Cl⁻>OH⁻>含氧酸根顺序', '阴极：阳离子放电，按Ag⁺>Cu²⁺>H⁺(酸)>Fe²⁺>Zn²⁺>H⁺(水)顺序', '写出电极反应式和总反应式'],
                keyStepCorrectIndices: [0, 1, 2, 3, 4],
                orderItems: ['接通电源判断阴、阳极', '分析溶液中离子', '按放电顺序判断阳极反应', '按放电顺序判断阴极反应', '写出电极和总反应式'],
                orderCorrect: [0, 1, 2, 3, 4],
                orderHint: '先判断电极，再分析离子，最后根据放电顺序写反应式',
                consequenceOptions: ['正确写出全部电极反应式', '放电顺序判断错误导致反应式错误', '遗漏某离子的放电竞争'],
                consequenceCorrectIndex: 0,
                reasoning: [
                  '阳极发生氧化反应，阴离子在阳极放电。放电顺序（还原性）：S²⁻>I⁻>Br⁻>Cl⁻>OH⁻>含氧酸根（如SO₄²⁻、NO₃⁻）',
                  '阴极发生还原反应，阳离子在阴极放电。放电顺序（氧化性）：Ag⁺>Cu²⁺>H⁺(酸)>Fe²⁺>Zn²⁺>H⁺(水)>Al³⁺>Mg²⁺>Na⁺',
                  '惰性电极（Pt、石墨）不参与反应；活性电极（Cu、Ag等）做阳极时会溶解（金属本身失电子）',
                  '浓度远大于标准浓度时放电顺序可能改变（如高浓度Zn²⁺溶液可能比H⁺先放电）'
                ]
              }
            },
            {
              id: 'x1c4s2-002', template: 'redox-reasoning',
              title: '电解NaCl饱和溶液',
              params: {
                substances: [
                  { key: 'nacl', formula: 'NaCl', valences: { Na: 1, Cl: -1 } },
                  { key: 'h2o', formula: 'H₂O', valences: { H: 1, O: -2 } },
                  { key: 'cl2', formula: 'Cl₂', valences: { Cl: 0 } },
                  { key: 'h2', formula: 'H₂', valences: { H: 0 } }
                ],
                identifyOptions: ['阳极Cl⁻失电子，阴极H₂O得电子', '阳极Na⁺失电子，阴极Cl⁻得电子', '两者都是氧化反应', '无氧化还原'],
                identifyCorrectIndex: 0,
                identifyPrompt: '电解饱和NaCl溶液中Cl⁻和H₂O的电子得失情况',
                finalEquation: '阳极：2Cl⁻ - 2e⁻ = Cl₂↑；阴极：2H₂O + 2e⁻ = H₂↑ + 2OH⁻；总：2NaCl + 2H₂O =电解= 2NaOH + H₂↑ + Cl₂↑',
                finalHint: 'Cl⁻放电顺序优先于OH⁻（高浓度Cl⁻溶液中），H₂O中H⁺放电顺序优先于Na⁺',
                reasoning: [
                  '阳极：Cl⁻（-1价）→Cl₂（0价），失电子，氧化反应。Cl⁻浓度高时放电顺序优先于OH⁻',
                  '阴极：H₂O中H⁺（+1价）→H₂（0价），得电子，还原反应。放电顺序H₂O>Na⁺',
                  '总反应：2NaCl + 2H₂O =电解= 2NaOH + H₂↑ + Cl₂↑（氯碱工业原理）',
                  '产物判断：阳极Cl₂，阴极H₂和OH⁻（即NaOH），工业上利用此反应制取Cl₂和NaOH'
                ]
              }
            },
            {
              id: 'x1c4s2-003', template: 'concept-construction',
              title: '电解精炼铜与电镀',
              params: {
                cases: ['粗铜作阳极、精铜作阴极、CuSO₄为电解质进行电解精炼铜', '铁制品镀锌：铁作阴极、锌作阳极、含Zn²⁺溶液为电镀液'],
                caseOptions: ['都是利用电解原理进行的电化学加工方法', '阳极都溶解', '阴极都被镀'],
                caseCorrectIndices: [0],
                caseCommonality: '电解精炼铜和电镀都利用电解池原理，阳极金属溶解、阴极金属析出',
                conceptName: '电解精炼铜与电镀',
                definitionKeyTerms: ['精炼铜', '粗铜阳极', '电镀', '镀层金属'],
                definitionHint: '阳极溶解失去电子，阴极析出得电子，注意精炼铜和电镀的杂质处理差异',
                fullDefinition: '电解精炼铜：粗铜作阳极（Cu-2e⁻=Cu²⁺及活泼金属杂质溶解），精铜作阴极（Cu²⁺+2e⁻=Cu），阳极泥含Au/Ag等。电镀：镀件作阴极、镀层金属作阳极，电镀液含镀层金属离子，浓度基本不变',
                boundaryItems: ['电解精炼铜时粗铜中Zn/Fe等比Cu先失电子进入溶液', '电解精炼铜后阳极泥含Au/Ag等贵金属', '电镀锌时镀件接电源正极', '电镀时镀层金属做阳极溶解'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么电镀过程中镀液浓度基本不变？',
                explainHint: '比较阳极和阴极的反应',
                explainKeyTerms: ['阳极溶解', '阴极析出', '得失电子相等'],
                reasoning: [
                  '电解精炼铜：粗铜中的Au、Ag等不溶解，沉淀为阳极泥可回收。Zn、Fe等活泼金属虽溶解但不影响阴极Cu的纯度（较难在阴极还原）',
                  '电镀：阳极镀层金属溶解（M-ne⁻=Mⁿ⁺）补充镀液，阴极Mⁿ⁺+ne⁻=M析出，阳极溶解和阴极析出速率相等，镀液浓度不变',
                  '控制电流密度、温度等条件使镀层均匀致密'
                ]
              }
            }
          ]
        },
        {
          id: 'x1-ch4-sec3',
          title: '第三节 金属的腐蚀与防护',
          exercises: [
            {
              id: 'x1c4s3-001', template: 'concept-construction',
              title: '电化学腐蚀的类型',
              params: {
                cases: ['钢铁在潮湿空气中生锈（吸氧腐蚀）', '钢铁在酸性环境下腐蚀产生H₂（析氢腐蚀）', '铜铁接触在潮湿环境中Fe先被腐蚀'],
                caseOptions: ['都属于电化学腐蚀', '都产生H₂', '都需要酸性条件'],
                caseCorrectIndices: [0],
                caseCommonality: '电化学腐蚀是钢铁在电解质溶液中形成原电池，Fe作负极被腐蚀',
                conceptName: '吸氧腐蚀与析氢腐蚀',
                definitionKeyTerms: ['吸氧腐蚀', '析氢腐蚀', '正极反应', 'Fe'],
                definitionHint: '根据电解质溶液的酸碱性判断腐蚀类型',
                fullDefinition: '吸氧腐蚀（最常见）：中性/碱性条件下，正极O₂+2H₂O+4e⁻=4OH⁻，总反应2Fe+O₂+2H₂O=2Fe(OH)₂，进一步氧化为铁锈。析氢腐蚀：酸性条件下，正极2H⁺+2e⁻=H₂↑。两种腐蚀中Fe均做负极：Fe-2e⁻=Fe²⁺',
                boundaryItems: ['吸氧腐蚀总反应：2Fe+O₂+2H₂O=2Fe(OH)₂', 'Fe(OH)₂进一步氧化为铁锈Fe₂O₃·xH₂O', '析氢腐蚀产生H₂', '析氢腐蚀不产生H₂'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么钢铁在潮湿空气中主要发生吸氧腐蚀而不是析氢腐蚀？',
                explainHint: '潮湿空气的酸碱性如何？',
                explainKeyTerms: ['中性条件', 'O₂', '去极化'],
                reasoning: [
                  '吸氧腐蚀条件：中性或碱性（潮湿空气近乎中性），O₂做去极化剂',
                  '吸氧腐蚀两阶段：①Fe-2e⁻=Fe²⁺（负极），O₂+2H₂O+4e⁻=4OH⁻（正极）；②Fe(OH)₂被O₂氧化为铁锈Fe₂O₃·xH₂O',
                  '析氢腐蚀条件：酸性较强环境（如酸雨、工业废气），H⁺做去极化剂',
                  '无论何种腐蚀，Fe均做负极被氧化，防护需隔绝O₂和H₂O或采用电化学保护'
                ]
              }
            },
            {
              id: 'x1c4s3-002', template: 'error-analysis',
              title: '金属防护方法的选择',
              params: {
                statement: '牺牲阳极法保护钢铁设备：将被保护的钢铁设备与电源负极相连，作为阴极受到保护',
                errorOptions: ['与电源负极相连', '作为阴极受到保护', '牺牲阳极法', '没有错误'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['牺牲阳极', '外加电流', '阴极保护'],
                principleHint: '与电源负极相连的是外加电流的阴极保护法，不是牺牲阳极法',
                correctVersion: '牺牲阳极法：用更活泼的金属（如Zn）与被保护的钢铁设备相连，Zn做负极（牺牲阳极）被腐蚀，钢铁做正极受保护',
                finalHint: '牺牲阳极法用自己的牺牲换保护（不接电源），外加电流法接电源负极',
                reasoning: [
                  '牺牲阳极法：不接外电源，用更活泼金属（如Zn、Mg）作牺牲阳极（负极）与被保护钢铁设备（正极）相连形成原电池，牺牲阳极被腐蚀而钢铁受到保护',
                  '外加电流法：将被保护金属与电源负极相连作阴极，用惰性辅助阳极，通入直流电实现保护',
                  '原描述混淆了两种方法：与电源负极相连的是外加电流法而非牺牲阳极法',
                  '两种方法均为电化学保护法，适用于不同场景（牺牲阳极法适合小规模，外加电流法适合大规模）'
                ]
              }
            },
            {
              id: 'x1c4s3-003', template: 'comparison-reasoning',
              title: '吸氧腐蚀与析氢腐蚀的比较',
              params: {
                conceptA: '吸氧腐蚀',
                conceptB: '析氢腐蚀',
                description: '钢铁在潮湿空气中缓慢生锈；钢铁在酸雨中迅速腐蚀产生气泡',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么产生气泡的情况不是吸氧腐蚀？',
                excludeHint: '气泡的成分是什么？什么条件下会产生H₂？',
                excludeKeyTerms: ['H₂', '酸性', '析氢'],
                differenceOptions: ['电解质酸碱性不同，正极反应不同', '负极反应不同', '钢铁做不同电极', '防护方法不同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '某钢铁设施长期暴露在含有SO₂的工业大气中，哪种腐蚀占主导？',
                scenarioOptions: ['析氢腐蚀（酸雨使环境酸化）', '吸氧腐蚀', '两者同时发生', '不发生腐蚀'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '吸氧腐蚀：中性/碱性条件，正极O₂+2H₂O+4e⁻=4OH⁻，负极Fe-2e⁻=Fe²⁺，总反应慢，占钢铁腐蚀的绝大多数',
                  '析氢腐蚀：酸性条件（pH<4.3），正极2H⁺+2e⁻=H₂↑，负极Fe-2e⁻=Fe²⁺，产生H₂气泡，腐蚀速率较快',
                  '两种腐蚀中Fe均做负极（失电子），区别在于正极反应（O₂还原vs H⁺还原）和电解质的pH',
                  '实际腐蚀中两种类型可能同时存在，但以吸氧腐蚀为主（日常环境下多为中性）'
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
