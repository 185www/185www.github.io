const 必修第一册 = {
  textbook: '必修第一册',

  chapters: [
    {
      id: 'b1-ch1',
      title: '第一章 物质及其变化',
      sections: [
        {
          id: 'b1-ch1-sec1',
          title: '第一节 物质的分类及转化',
          exercises: [
            {
              id: 'b1c1s1-001', template: 'concept-construction',
              title: '分散系的分类',
              params: {
                cases: ['食盐水无丁达尔效应', 'Fe(OH)₃胶体有丁达尔效应', '泥水静置分层'],
                caseOptions: [
                  '分散质粒子直径不同',
                  '颜色不同',
                  '稳定性不同'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '三者按分散质粒子直径分类',
                conceptName: '分散系的分类',
                definitionKeyTerms: ['粒子直径', '胶体', '浊液'],
                definitionHint: '考虑分散质粒子的大小范围',
                fullDefinition: '分散系按分散质粒子直径分为溶液（<1nm）、胶体（1-100nm）、浊液（>100nm）',
                boundaryItems: ['蛋白质溶液属于胶体', 'NaCl溶液属于胶体', '烟、雾属于胶体', '悬浊液属于胶体'],
                boundaryCorrectIndices: [0, 2],
                explainPrompt: '为什么蛋白质溶液是胶体，而NaCl溶液不是？',
                explainHint: '考虑分子直径大小',
                explainKeyTerms: ['蛋白质', '直径', '纳米'],
                reasoning: [
                  '三种分散系的本质区别：分散质粒子直径不同—溶液<1nm（均一稳定透明），胶体1-100nm（介稳，丁达尔效应），浊液>100nm（不稳定）',
                  '分类标准是粒子直径，不是颜色或透明性。溶液粒子<1nm，胶体1-100nm，浊液>100nm',
                  '蛋白质分子直径在纳米级（1-100nm），所以蛋白质溶液实为胶体。NaCl完全电离，离子<1nm，为真溶液',
                  '蛋白质分子直径约几纳米，属胶体范围。Na⁺和Cl⁻直径远小于1nm，属溶液'
                ]
              }
            },
            {
              id: 'b1c1s1-002', template: 'concept-construction',
              title: '丁达尔效应',
              params: {
                cases: ['激光笔照射Fe(OH)₃胶体出现光路', '激光笔照射NaCl溶液无光路', '雾天车灯光路明显'],
                caseOptions: [
                  '胶体粒子对光散射',
                  '溶液粒子太小无法散射光',
                  '光的折射现象'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '丁达尔效应是胶体特有的光学性质',
                conceptName: '丁达尔效应',
                definitionKeyTerms: ['散射', '胶体', '光路'],
                definitionHint: '丁达尔效应是胶体粒子对光的什么作用？',
                fullDefinition: '丁达尔效应是胶体粒子对光的散射现象，是区分胶体和溶液的最简便方法',
                boundaryItems: ['激光笔照射Fe(OH)₃胶体出现光路', '激光笔照射NaCl溶液出现光路', '森林中的光柱是丁达尔效应', '雾天车灯光路是丁达尔效应'],
                boundaryCorrectIndices: [0, 2, 3],
                explainPrompt: '为什么森林中的光柱是丁达尔效应？',
                explainHint: '空气中含有胶体粒子',
                explainKeyTerms: ['胶体粒子', '散射', '光柱'],
                reasoning: [
                  '丁达尔效应的本质：胶体粒子直径（1-100nm）与可见光波长相近，对光产生散射',
                  '溶液粒子太小（<1nm），不能产生明显散射，所以激光通过没有光路',
                  '森林中空气含有灰尘、小液滴等胶体粒子，对阳光散射形成光柱'
                ]
              }
            }
          ]
        },
        {
          id: 'b1-ch1-sec2',
          title: '第二节 离子反应',
          exercises: [
            {
              id: 'b1c1s2-001', template: 'concept-construction',
              title: '电解质与非电解质的判断',
              params: {
                cases: ['NaCl固体不导电但NaCl溶液导电', 'HCl气体不导电但水溶液导电', '铜能导电'],
                caseOptions: [
                  '电解质需在水溶液或熔融态下才能导电',
                  '固体状态导电性是判断电解质的唯一标准',
                  '单质能导电但不属于电解质'
                ],
                caseCorrectIndices: [0, 0, 2],
                caseCommonality: '电解质是化合物，导电需特定条件',
                conceptName: '电解质的定义',
                definitionKeyTerms: ['水溶液中', '熔融状态', '化合物'],
                definitionHint: '电解质是化合物，需在什么条件下导电？',
                fullDefinition: '电解质是在水溶液中或熔融状态下能导电的化合物。单质和混合物既不是电解质也不是非电解质',
                boundaryItems: ['HCl是电解质', '蔗糖是非电解质', '铜是电解质', 'NaOH溶液是电解质'],
                boundaryCorrectIndices: [0, 1],
                explainPrompt: '为什么铜不是电解质而HCl是电解质？',
                explainHint: '电解质必须是化合物',
                explainKeyTerms: ['单质', '化合物', '电解质'],
                reasoning: [
                  '电解质定义三要素：化合物、水溶液或熔融态、能导电。NaCl是化合物，水溶液导电→电解质',
                  '铜是单质，不是化合物，所以既不是电解质也不是非电解质',
                  'HCl是化合物，水溶液导电→电解质。蔗糖水溶液不导电→非电解质',
                  'NaOH溶液是混合物（NaOH+H₂O），不是化合物，所以不是电解质'
                ]
              }
            },
            {
              id: 'b1c1s2-002', template: 'comparison-reasoning',
              title: '强电解质与弱电解质的比较',
              params: {
                conceptA: '强电解质',
                conceptB: '弱电解质',
                description: '完全电离，溶液中以离子形式存在，包括强酸、强碱、大多数盐',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么它不可能是弱电解质？',
                excludeHint: '比较电离程度',
                excludeKeyTerms: ['完全电离', '电离程度'],
                differenceOptions: ['电离程度不同', '溶解度不同', '温度敏感度不同', '颜色不同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '相同浓度的盐酸和醋酸溶液，哪种pH更小？',
                scenarioOptions: ['盐酸更小', '醋酸更小', '一样', '无法判断'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '强电解质完全电离，溶液中以离子形式存在；弱电解质部分电离，存在电离平衡',
                  '相同浓度的强酸（盐酸）比弱酸（醋酸）电离出的H⁺更多，所以pH更小',
                  '强电解质包括强酸、强碱、大多数盐；弱电解质包括弱酸、弱碱、水',
                  ''
                ]
              }
            },
            {
              id: 'b1c1s2-003', template: 'concept-construction',
              title: '中和反应的概念',
              params: {
                cases: ['HCl + NaOH → NaCl + H₂O', 'H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O', 'CO₂ + H₂O → H₂CO₃'],
                caseOptions: [
                  '属于中和反应',
                  '属于化合反应',
                  '属于复分解反应但不是中和反应',
                  '属于氧化还原反应'
                ],
                caseCorrectIndices: [0, 0, 1],
                caseCommonality: '前两个是中和反应（酸+碱→盐+水），第三个是化合反应',
                conceptName: '中和反应',
                definitionKeyTerms: ['酸', '碱', '盐', '水'],
                definitionHint: '中和反应是酸和碱反应生成盐和水的反应，属于复分解反应',
                fullDefinition: '中和反应是酸和碱反应生成盐和水的反应，属于复分解反应的一种，反应前后各元素化合价不变',
                boundaryItems: ['HCl与NaOH的反应是中和反应', 'CO₂与NaOH的反应是中和反应', 'H₂SO₄与Ba(OH)₂的反应是中和反应', '中和反应一定有水生成'],
                boundaryCorrectIndices: [0, 2, 3],
                explainPrompt: '为什么H₂SO₄与Ba(OH)₂反应属于中和反应？',
                explainHint: '反应物是酸和碱，生成盐和水',
                explainKeyTerms: ['酸', '碱', '盐', '水'],
                reasoning: [
                  '中和反应定义：酸+碱→盐+水。HCl是酸，NaOH是碱，→NaCl（盐）+H₂O（水）',
                  '中和反应属于复分解反应，反应前后各元素化合价不变',
                  'CO₂+H₂O→H₂CO₃是化合反应，不是中和反应（CO₂不是酸）',
                  'H₂SO₄+Ba(OH)₂→BaSO₄↓+2H₂O：酸+碱→盐+水，符合中和反应定义'
                ]
              }
            },
            {
              id: 'b1c1s2-004', template: 'concept-construction',
              title: '离子方程式中物质的拆分规则',
              params: {
                cases: ['CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑', 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑', 'AgNO₃ + NaCl → AgCl↓ + NaNO₃'],
                caseOptions: [
                  '难溶物写化学式不拆',
                  '可溶性强电解质拆成离子',
                  '沉淀写化学式不拆'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '离子方程式中，难溶物、气体、弱电解质写化学式，可溶性强电解质拆成离子',
                conceptName: '离子方程式的书写规则',
                definitionKeyTerms: ['拆', '不拆', '难溶', '气体'],
                definitionHint: '离子方程式中什么物质不能拆成离子？',
                fullDefinition: '离子方程式中：可溶性强电解质拆成离子形式；难溶物、气体、弱电解质、单质、氧化物写化学式不拆',
                boundaryItems: ['CaCO₃是难溶物，离子方程式中不拆', 'AgCl是沉淀，不拆', 'CaCO₃与盐酸的反应是复分解反应', 'CO₂在离子方程式中写化学式'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么CaCO₃在离子方程式中不能拆成离子？',
                explainHint: 'CaCO₃的溶解性如何？',
                explainKeyTerms: ['难溶', '不拆', 'CaCO₃'],
                reasoning: [
                  'CaCO₃难溶于水，在水中几乎不电离，应写化学式不拆。离子方程式：CaCO₃+2H⁺→Ca²⁺+H₂O+CO₂↑',
                  '可溶性强电解质（如HCl、Na₂CO₃）拆成离子。AgCl↓不拆、CO₂↑不拆、CaCO₃↓不拆',
                  '难溶物、气体、弱电解质（如H₂O、CH₃COOH）、单质、氧化物一律写化学式'
                ]
              }
            }
          ]
        },
        {
          id: 'b1-ch1-sec3',
          title: '第三节 氧化还原反应',
          exercises: [
            {
              id: 'b1c1s3-001', template: 'concept-construction',
              title: '氧化还原反应本质与特征',
              params: {
                cases: ['Fe + CuSO₄ → FeSO₄ + Cu中铁和铜化合价变化', 'NaOH + HCl → NaCl + H₂O中所有元素化合价不变', 'Cl₂ + H₂O → HCl + HClO中Cl化合价变化'],
                caseOptions: [
                  '有元素化合价升降，是氧化还原反应',
                  '无元素化合价升降，不是氧化还原反应'
                ],
                caseCorrectIndices: [0, 1, 0],
                caseCommonality: '氧化还原反应的特征是化合价变化，本质是电子转移',
                conceptName: '氧化还原反应的特征与本质',
                definitionKeyTerms: ['化合价变化', '电子转移', '氧化还原'],
                definitionHint: '氧化还原反应的特征和本质分别是什么？',
                fullDefinition: '氧化还原反应的特征是化合价变化（表观特征），本质是电子转移（或偏移）',
                boundaryItems: ['Fe + CuSO₄ → FeSO₄ + Cu是氧化还原反应', 'NaOH + HCl → NaCl + H₂O是氧化还原反应', 'Cl₂ + H₂O → HCl + HClO是氧化还原反应', 'CaCO₃ → CaO + CO₂↑是氧化还原反应'],
                boundaryCorrectIndices: [0, 2],
                explainPrompt: '为什么Cl₂+H₂O是氧化还原反应，而NaOH+HCl不是？',
                explainHint: '比较各元素化合价是否变化',
                explainKeyTerms: ['化合价', 'Cl₂', '歧化', '变化'],
                reasoning: [
                  '氧化还原反应的特征是化合价变化。Fe+CuSO₄中Fe从0→+2，Cu从+2→0→氧化还原反应',
                  'NaOH+HCl中Na、O、H、Cl所有元素化合价不变→非氧化还原反应',
                  'Cl₂+H₂O中Cl从0→-1（HCl中）和0→+1（HClO中），化合价变化→氧化还原反应',
                  'CaCO₃分解中Ca、C、O化合价均不变→非氧化还原反应'
                ]
              }
            },
            {
              id: 'b1c1s3-002', template: 'error-analysis',
              title: '氧化还原反应口诀常见错误',
              params: {
                statement: '在氧化还原反应中，"升失氧"的意思是化合价升高的物质被氧化、作氧化剂',
                errorOptions: ['化合价升高的物质', '被氧化', '作氧化剂', '没有错误'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['升失氧', '还原剂', '被氧化'],
                principleHint: '"升失氧"完整的口诀是什么？',
                correctVersion: '升失氧：化合价升高→失电子→被氧化→作还原剂',
                finalHint: '口诀是：升失氧化还原剂，降得还原氧化剂',
                reasoning: [
                  '"升失氧"完整的口诀是"升失氧化还原剂"：化合价升高→失电子→被氧化→作还原剂。常见的混淆是把"还原剂"和"氧化剂"搞反',
                  '记忆方法：升失氧→还原剂（"失"谐音"是"，"还"→还原）。注意氧化剂本身被还原，还原剂本身被氧化',
                  '正确口诀：升失氧化还原剂（化合价升高、失电子、被氧化、作还原剂）；降得还原氧化剂（化合价降低、得电子、被还原、作氧化剂）'
                ]
              }
            },
            {
              id: 'b1c1s3-003', template: 'redox-reasoning',
              title: '铁与硫酸铜的置换反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Fe', valences: { Fe: 0 } },
                  { key: 'reactant2', formula: 'CuSO₄', valences: { Cu: 2, S: 6, O: -2 } }
                ],
                identifyOptions: ['Fe是还原剂，CuSO₄是氧化剂', 'Fe是氧化剂，CuSO₄是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: 'Fe + CuSO₄ → FeSO₄ + Cu',
                finalHint: 'Fe从0→+2价，Cu从+2→0价，电子转移守恒',
                reasoning: [
                  'Fe从0价升到+2价，化合价升高，失电子→还原剂。Cu从+2价降到0价，化合价降低，得电子→氧化剂',
                  'Fe + Cu²⁺ → Fe²⁺ + Cu，一个Fe失去2个电子，一个Cu²⁺得到2个电子',
                  '配平系数：1Fe + 1CuSO₄ → 1FeSO₄ + 1Cu',
                  ''
                ]
              }
            },
            {
              id: 'b1c1s3-004', template: 'redox-reasoning',
              title: '钠在氯气中燃烧',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Na', valences: { Na: 0 } },
                  { key: 'reactant2', formula: 'Cl₂', valences: { Cl: 0 } }
                ],
                identifyOptions: ['Na是还原剂，Cl₂是氧化剂', 'Na是氧化剂，Cl₂是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '2Na + Cl₂ → 2NaCl',
                finalHint: 'Na失电子→还原剂，Cl₂得电子→氧化剂',
                reasoning: [
                  'Na从0价升到+1价，化合价升高，失电子→还原剂。Cl从0价降到-1价，化合价降低，得电子→氧化剂',
                  '每1个Na失去1个电子，每1个Cl₂得到2个电子，最小公倍数为2',
                  '2Na + Cl₂ → 2NaCl',
                  ''
                ]
              }
            },
            {
              id: 'b1c1s3-005', template: 'error-analysis',
              title: '配平口诀顺序错误',
              params: {
                statement: '氧化还原反应配平的步骤是：标化合价→求最小公倍数→找升降→配系数→检查氧氢',
                errorOptions: ['标化合价', '求最小公倍数→找升降', '找升降→求最小公倍数', '配系数→检查氧氢'],
                errorCorrectIndex: 1,
                principleKeyTerms: ['标化合价', '找升降', '最小公倍数'],
                principleHint: '配平的逻辑顺序：先确定升降数值再求最小公倍数',
                correctVersion: '标化合价→找升降→求最小公倍数→配系数→检查氧氢',
                finalHint: '先标化合价，再找升降变化，然后求最小公倍数',
                reasoning: [
                  '正确的配平顺序：先标化合价→找升降数值→求最小公倍数→配系数→检查。口诀中"求最小公倍数"应在"找升降"之后',
                  '先找升降：例如Fe₂O₃+CO→Fe+CO₂，Fe从+3→0（每个降3），C从+2→+4（每个升2），最小公倍数6',
                  '最后检查原子守恒：反应前后各原子个数相等'
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'b1-ch2',
      title: '第二章 海水中的重要元素——钠和氯',
      sections: [
        {
          id: 'b1-ch2-sec1',
          title: '第一节 钠及其化合物',
          exercises: [
            {
              id: 'b1c2s1-001', template: 'redox-reasoning',
              title: '钠与氧气常温反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Na', valences: { Na: 0 } },
                  { key: 'reactant2', formula: 'O₂', valences: { O: 0 } }
                ],
                identifyOptions: ['Na是还原剂，O₂是氧化剂', 'Na是氧化剂，O₂是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '4Na + O₂ → 2Na₂O',
                finalHint: 'Na从0→+1，O从0→-2，常温生成Na₂O（白色）',
                reasoning: [
                  'Na从0价升到+1价，化合价升高，失电子→还原剂。O从0价降到-2价，化合价降低，得电子→氧化剂',
                  '每4个Na失去4个电子，每个O₂得到4个电子，电子转移守恒',
                  '4Na + O₂ → 2Na₂O',
                  ''
                ]
              }
            },
            {
              id: 'b1c2s1-002', template: 'redox-reasoning',
              title: '钠在空气中燃烧',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Na', valences: { Na: 0 } },
                  { key: 'reactant2', formula: 'O₂', valences: { O: 0 } }
                ],
                identifyOptions: ['Na是还原剂，O₂是氧化剂', 'Na是氧化剂，O₂是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '2Na + O₂ → Na₂O₂',
                finalHint: '燃烧产物是Na₂O₂（淡黄色），Na₂O₂中O为-1价',
                reasoning: [
                  'Na从0价升到+1价，化合价升高，失电子→还原剂。O从0价降到-1价，化合价降低，得电子→氧化剂',
                  '每2个Na失去2个电子，每个O₂得到2个电子（每个O从0→-1，得1e⁻）',
                  '2Na + O₂ → Na₂O₂（燃烧产物与常温和不同：常温得Na₂O，燃烧得Na₂O₂）',
                  ''
                ]
              }
            },
            {
              id: 'b1c2s1-003', template: 'experimental-reasoning',
              title: '钠与水反应现象',
              params: {
                goal: '观察并解释钠与水反应的现象',
                principleOptions: ['2Na + 2H₂O → 2NaOH + H₂↑（放热反应）', '2Na + H₂O → Na₂O + H₂', 'Na + H₂O → NaOH + H₂', '2Na + 2H₂O → 2NaH + O₂'],
                principleCorrectIndex: 0,
                keyStepItems: ['钠浮在水面（密度小于水）', '钠熔化成小球（反应放热，钠熔点低）', '钠迅速游动（产生H₂推动）', '发出嘶嘶声（反应剧烈）', '溶液变红（生成NaOH，酚酞变红）'],
                keyStepCorrectIndices: [0, 1, 2, 3, 4],
                orderItems: ['钠浮在水面', '钠熔化成小球', '钠迅速游动', '发出嘶嘶声', '溶液变红'],
                orderPrompt: '将钠与水反应的现象按发生顺序排列',
                orderCorrect: [0, 1, 2, 3, 4],
                orderHint: '浮→熔→游→响→红',
                consequenceOptions: ['若钠未熔化就说明反应放热不足', '若没有嘶嘶声说明没有H₂产生', '现象顺序反映反应进程：接触→放热→产气→扩散'],
                consequenceCorrectIndex: 2,
                consequencePrompt: '为什么钠先浮在水面，然后才熔化成小球？',
                reasoning: [
                  '钠的密度（0.97g/cm³）小于水，所以钠浮在水面',
                  '反应剧烈放热（2Na+2H₂O→2NaOH+H₂↑放热），钠的熔点低（约98℃），所以熔化成小球',
                  '产生的H₂推动小球在水面迅速游动，同时发出嘶嘶声',
                  '生成的NaOH使酚酞变红，证明有碱生成'
                ]
              }
            },
            {
              id: 'b1c2s1-004', template: 'redox-reasoning',
              title: '钠与水反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Na', valences: { Na: 0 } },
                  { key: 'reactant2', formula: 'H₂O', valences: { H: 1, O: -2 } }
                ],
                identifyOptions: ['Na是还原剂，H₂O是氧化剂', 'Na是氧化剂，H₂O是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '2Na + 2H₂O → 2NaOH + H₂↑',
                finalHint: 'Na从0→+1，H₂O中H从+1→0，Na还原H₂O中的H',
                reasoning: [
                  'Na从0价升到+1价，化合价升高，失电子→还原剂。H₂O中H从+1价降到0价，化合价降低，得电子→氧化剂',
                  '每2个Na失去2个电子，每2个H₂O中的H各得1个电子（共得2个电子），生成1个H₂',
                  '2Na + 2H₂O → 2NaOH + H₂↑',
                  ''
                ]
              }
            },
            {
              id: 'b1c2s1-005', template: 'redox-reasoning',
              title: 'Na₂O₂与H₂O反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Na₂O₂', valences: { Na: 1, O: -1 } },
                  { key: 'reactant2', formula: 'H₂O', valences: { H: 1, O: -2 } }
                ],
                identifyOptions: ['Na₂O₂既是氧化剂又是还原剂', 'Na₂O₂是氧化剂，H₂O是还原剂', 'Na₂O₂是还原剂，H₂O是氧化剂', 'H₂O既是氧化剂又是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '这是一个歧化反应，分析Na₂O₂中O的化合价变化：谁是氧化剂和还原剂？',
                finalEquation: '2Na₂O₂ + 2H₂O → 4NaOH + O₂↑',
                finalHint: 'Na₂O₂中O为-1价，歧化为O₂（0价）和OH⁻（-2价）',
                reasoning: [
                  'Na₂O₂中O为-1价，一部分从-1价升到0价（O₂中），失电子→还原剂；另一部分从-1价降到-2价（OH⁻中），得电子→氧化剂',
                  'Na₂O₂既是氧化剂又是还原剂（歧化反应）。每2个Na₂O₂中，2个O升到0价，2个O降到-2价',
                  '2Na₂O₂ + 2H₂O → 4NaOH + O₂↑',
                  ''
                ]
              }
            },
            {
              id: 'b1c2s1-006', template: 'redox-reasoning',
              title: 'Na₂O₂与CO₂反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Na₂O₂', valences: { Na: 1, O: -1 } },
                  { key: 'reactant2', formula: 'CO₂', valences: { C: 4, O: -2 } }
                ],
                identifyOptions: ['Na₂O₂既是氧化剂又是还原剂', 'Na₂O₂是氧化剂，CO₂是还原剂', 'Na₂O₂是还原剂，CO₂是氧化剂', 'CO₂既是氧化剂又是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '分析Na₂O₂中O的化合价变化：谁是氧化剂和还原剂？',
                finalEquation: '2Na₂O₂ + 2CO₂ → 2Na₂CO₃ + O₂',
                finalHint: '呼吸面具供氧原理，Na₂O₂中O歧化',
                reasoning: [
                  'Na₂O₂中O为-1价，歧化：部分O升到0价（O₂中）作还原剂，部分O降到-2价（CO₃²⁻中）作氧化剂',
                  'Na₂O₂既是氧化剂又是还原剂。CO₂不参与氧化还原，提供酸性环境生成CO₃²⁻',
                  '2Na₂O₂ + 2CO₂ → 2Na₂CO₃ + O₂',
                  ''
                ]
              }
            },
            {
              id: 'b1c2s1-007', template: 'comparison-reasoning',
              title: 'Na₂CO₃与NaHCO₃的比较',
              params: {
                conceptA: 'Na₂CO₃',
                conceptB: 'NaHCO₃',
                description: '白色粉末，易溶于水，水溶液碱性较强，受热难分解，俗名纯碱',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么它不可能是NaHCO₃？',
                excludeHint: '比较热稳定性',
                excludeKeyTerms: ['受热难分解', '热稳定性'],
                differenceOptions: ['热稳定性不同', '颜色不同', '水溶性不同', '俗名不同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '将等物质的量的两者分别加入足量盐酸，哪个产生的CO₂更多？',
                scenarioOptions: ['Na₂CO₃更多', 'NaHCO₃更多', '一样多', '都不产生'],
                scenarioCorrectIndex: 1,
                reasoning: [
                  '描述中的"受热难分解"表明它是Na₂CO₃，因为NaHCO₃受热易分解：2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑',
                  'NaHCO₃受热易分解是两者的本质区别之一',
                  'Na₂CO₃与酸反应分两步（先Na₂CO₃+HCl→NaHCO₃+NaCl，再NaHCO₃+HCl→NaCl+H₂O+CO₂），而NaHCO₃一步就出CO₂。等物质的量时NaHCO₃产CO₂更快更集中',
                  ''
                ]
              }
            },
            {
              id: 'b1c2s1-008', template: 'concept-construction',
              title: '分解反应的判断',
              params: {
                cases: ['2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑', 'CaCO₃ → CaO + CO₂↑', '2KClO₃ → 2KCl + 3O₂↑'],
                caseOptions: [
                  '分解反应（非氧化还原）',
                  '分解反应（氧化还原）',
                  '化合反应',
                  '复分解反应'
                ],
                caseCorrectIndices: [0, 0, 1],
                caseCommonality: '前两个是非氧化还原的分解反应，第三个是氧化还原的分解反应',
                conceptName: '分解反应',
                definitionKeyTerms: ['一种物质', '两种或多种', '分解'],
                definitionHint: '分解反应是由一种物质生成两种或多种物质的反应',
                fullDefinition: '分解反应是由一种物质生成两种或多种其他物质的反应。根据是否发生化合价变化，可分为氧化还原型分解和非氧化还原型分解',
                boundaryItems: ['NaHCO₃的分解是非氧化还原反应', 'KClO₃的分解是氧化还原反应', '分解反应一定有化合价变化', 'CaCO₃分解没有化合价变化'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么NaHCO₃分解是非氧化还原反应，而KClO₃分解是氧化还原反应？',
                explainHint: '比较各元素化合价在反应前后是否变化',
                explainKeyTerms: ['化合价', '变化', '分解'],
                reasoning: [
                  'NaHCO₃分解：Na₂CO₃+H₂O+CO₂中所有元素化合价与反应前相同→非氧化还原分解',
                  'CaCO₃分解：CaO+CO₂中Ca、C、O化合价均不变→非氧化还原分解',
                  'KClO₃分解：KCl+O₂中Cl从+5价降到-1价（得电子），O从-2价升到0价（失电子）→氧化还原分解',
                  ''
                ]
              }
            },
            {
              id: 'b1c2s1-009', template: 'experimental-reasoning',
              title: '侯氏制碱法',
              params: {
                goal: '用侯氏制碱法制备纯碱（Na₂CO₃）',
                principleOptions: ['NaCl + NH₃ + CO₂ + H₂O → NaHCO₃↓ + NH₄Cl，NaHCO₃加热分解得Na₂CO₃', '2NaCl + CO₂ + H₂O → Na₂CO₃ + 2HCl', 'NaCl + NH₃ → NaNH₂ + HCl', 'NaCl + H₂CO₃ → NaHCO₃ + HCl'],
                principleCorrectIndex: 0,
                keyStepItems: ['向饱和食盐水中先通NH₃使溶液呈碱性', '再通CO₂生成NaHCO₃沉淀', '过滤得到NaHCO₃固体', '加热NaHCO₃得到Na₂CO₃'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['通入NH₃', '通入CO₂', '过滤NaHCO₃', '加热NaHCO₃', '回收NH₄Cl'],
                orderPrompt: '将侯氏制碱法的步骤按正确顺序排列',
                orderCorrect: [0, 1, 2, 3, 4],
                orderHint: '先通NH₃后通CO₂，先沉淀后加热',
                consequenceOptions: ['若先通CO₂后通NH₃，溶液酸性强不利于吸收CO₂', '顺序可互换', '先通NH₃使溶液呈碱性，利于CO₂吸收'],
                consequenceCorrectIndex: 2,
                consequencePrompt: '为什么要先通NH₃后通CO₂？',
                reasoning: [
                  '先通NH₃使溶液呈碱性，可大量吸收CO₂：NH₃+H₂O→NH₃·H₂O→NH₄⁺+OH⁻',
                  '碱性条件下CO₂转化为HCO₃⁻，与Na⁺结合生成NaHCO₃（溶解度小，析出沉淀）',
                  'NaHCO₃加热分解：2NaHCO₃→Na₂CO₃+H₂O+CO₂↑，得到纯碱',
                  '母液中的NH₄Cl可作氮肥回收利用'
                ]
              }
            },
            {
              id: 'b1c2s1-010', template: 'error-analysis',
              title: 'Na₂O₂与SO₂反应产物',
              params: {
                statement: 'Na₂O₂与SO₂反应：Na₂O₂ + SO₂ = Na₂SO₃ + O₂',
                errorOptions: ['反应物Na₂O₂', '反应物SO₂', '产物Na₂SO₃', '产物O₂'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['Na₂O₂', '强氧化性', 'SO₂', '还原性', 'Na₂SO₄'],
                principleHint: 'Na₂O₂有强氧化性，SO₂有还原性，产物应是什么？',
                correctVersion: 'Na₂O₂ + SO₂ = Na₂SO₄',
                finalHint: '过氧化钠有强氧化性，将SO₂氧化为SO₄²⁻，而非SO₃²⁻',
                reasoning: [
                  'Na₂O₂中O为-1价，有强氧化性。SO₂中S为+4价，有还原性',
                  'Na₂O₂应将SO₂氧化为+6价的SO₄²⁻，产物应为Na₂SO₄而非Na₂SO₃',
                  '正确反应：Na₂O₂ + SO₂ = Na₂SO₄（不再产生O₂，因为Na₂O₂的O全部用于氧化SO₂）',
                  ''
                ]
              }
            }
          ]
        },
        {
          id: 'b1-ch2-sec2',
          title: '第二节 氯及其化合物',
          exercises: [
            {
              id: 'b1c2s2-001', template: 'redox-reasoning',
              title: 'Cl₂与水反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Cl₂', valences: { Cl: 0 } },
                  { key: 'reactant2', formula: 'H₂O', valences: { H: 1, O: -2 } }
                ],
                identifyOptions: ['Cl₂既是氧化剂又是还原剂', 'Cl₂是氧化剂，H₂O是还原剂', 'Cl₂是还原剂，H₂O是氧化剂', 'H₂O既是氧化剂又是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '分析Cl₂中Cl的化合价变化：Cl₂是氧化剂还是还原剂？',
                finalEquation: 'Cl₂ + H₂O → HCl + HClO',
                finalHint: 'Cl₂歧化：Cl从0→-1（得电子）和0→+1（失电子）',
                reasoning: [
                  'Cl₂中Cl为0价，反应后一部分Cl降到-1价（HCl中，得电子→氧化剂），一部分Cl升到+1价（HClO中，失电子→还原剂）',
                  'Cl₂既是氧化剂又是还原剂（歧化反应）。每个Cl₂分子中一个Cl得1e⁻（→Cl⁻），一个Cl失1e⁻（→ClO⁻）',
                  'Cl₂ + H₂O → HCl + HClO，生成的HClO有漂白性',
                  ''
                ]
              }
            },
            {
              id: 'b1c2s2-002', template: 'redox-reasoning',
              title: 'Cl₂与NaOH反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Cl₂', valences: { Cl: 0 } },
                  { key: 'reactant2', formula: 'NaOH', valences: { Na: 1, O: -2, H: 1 } }
                ],
                identifyOptions: ['Cl₂既是氧化剂又是还原剂', 'Cl₂是氧化剂，NaOH是还原剂', 'Cl₂是还原剂，NaOH是氧化剂', 'NaOH既是氧化剂又是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '分析Cl₂中Cl的化合价变化：谁是氧化剂和还原剂？',
                finalEquation: 'Cl₂ + 2NaOH → NaCl + NaClO + H₂O',
                finalHint: '制漂白液原理，Cl₂歧化',
                reasoning: [
                  'Cl₂中Cl从0价歧化：一部分降到-1价（NaCl中，得电子→氧化剂），一部分升到+1价（NaClO中，失电子→还原剂）',
                  'Cl₂既是氧化剂又是还原剂。每1个Cl₂中，1个Cl得1e⁻→Cl⁻，1个Cl失1e⁻→ClO⁻',
                  'Cl₂ + 2NaOH → NaCl + NaClO + H₂O',
                  ''
                ]
              }
            },
            {
              id: 'b1c2s2-003', template: 'experimental-reasoning',
              title: 'Cl₂的实验室制法',
              params: {
                goal: '在实验室中制备氯气（Cl₂）',
                principleOptions: ['MnO₂ + 4HCl(浓) → MnCl₂ + Cl₂↑ + 2H₂O', '2NaCl + H₂SO₄ → Na₂SO₄ + 2HCl', 'Cl₂ + H₂O → HCl + HClO', '2NaCl + 2H₂O → 2NaOH + Cl₂↑ + H₂↑'],
                principleCorrectIndex: 0,
                keyStepItems: ['检查装置气密性', 'MnO₂与浓HCl混合', '加热', '用向上排空气法收集Cl₂', '尾气用NaOH吸收'],
                keyStepCorrectIndices: [0, 1, 2, 3, 4],
                orderItems: ['检查气密性', '混合药品', '加热', '收集Cl₂', '尾气处理'],
                orderPrompt: '将Cl₂实验室制法的步骤按正确顺序排列',
                orderCorrect: [0, 1, 2, 3, 4],
                orderHint: '先检密，后加药，再加热，先收集后处理',
                consequenceOptions: ['若先加热后加药可能发生危险', '若不用NaOH吸收Cl₂会污染空气', '可用向下排空气法收集Cl₂'],
                consequenceCorrectIndex: 1,
                consequencePrompt: '为什么Cl₂的尾气必须用NaOH溶液吸收？',
                reasoning: [
                  'Cl₂有毒，必须用NaOH吸收防止污染空气：Cl₂+2NaOH→NaCl+NaClO+H₂O',
                  'MnO₂与浓HCl需要加热才能反应，生成MnCl₂、Cl₂和H₂O',
                  'Cl₂密度大于空气（约2.5倍），用向上排空气法收集',
                  '浓HCl需过量，若HCl浓度降低则反应停止'
                ]
              }
            },
            {
              id: 'b1c2s2-004', template: 'redox-reasoning',
              title: '漂白粉的制备',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Cl₂', valences: { Cl: 0 } },
                  { key: 'reactant2', formula: 'Ca(OH)₂', valences: { Ca: 2, O: -2, H: 1 } }
                ],
                identifyOptions: ['Cl₂既是氧化剂又是还原剂', 'Cl₂是氧化剂，Ca(OH)₂是还原剂', 'Cl₂是还原剂，Ca(OH)₂是氧化剂', 'Ca(OH)₂既是氧化剂又是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '分析Cl₂中Cl的化合价变化：谁是氧化剂和还原剂？',
                finalEquation: '2Cl₂ + 2Ca(OH)₂ → CaCl₂ + Ca(ClO)₂ + 2H₂O',
                finalHint: '有效成分是Ca(ClO)₂，Cl₂歧化',
                reasoning: [
                  'Cl₂从0价歧化：→-1价（CaCl₂中，得电子→氧化剂）和→+1价（Ca(ClO)₂中，失电子→还原剂）',
                  'Cl₂既是氧化剂又是还原剂。每2个Cl₂中，2个Cl得电子→2Cl⁻，2个Cl失电子→2ClO⁻',
                  '2Cl₂ + 2Ca(OH)₂ → CaCl₂ + Ca(ClO)₂ + 2H₂O',
                  ''
                ]
              }
            },
            {
              id: 'b1c2s2-005', template: 'experimental-reasoning',
              title: 'Cl⁻检验操作步骤',
              params: {
                goal: '检验某溶液中是否含有Cl⁻',
                principleOptions: ['Ag⁺ + Cl⁻ → AgCl↓（白色沉淀，不溶于稀硝酸）', 'Ag⁺ + Cl⁻ → AgCl↓（可溶于稀硝酸）', 'Ba²⁺ + Cl⁻ → BaCl₂↓', '2Ag⁺ + Cl⁻ → Ag₂Cl↓'],
                principleCorrectIndex: 0,
                keyStepItems: ['取少量待测液', '加入稀HNO₃酸化', '加入AgNO₃溶液', '观察是否有白色沉淀'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['取待测液', '加稀HNO₃酸化', '加AgNO₃溶液', '观察沉淀'],
                orderPrompt: '将Cl⁻检验的步骤按正确顺序排列',
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先取液，后酸化，再加AgNO₃',
                consequenceOptions: ['若不加HNO₃酸化，CO₃²⁻会干扰（Ag₂CO₃也是白色沉淀）', '顺序无所谓', '应先加AgNO₃后加HNO₃'],
                consequenceCorrectIndex: 0,
                consequencePrompt: '为什么必须先加稀HNO₃酸化？',
                reasoning: [
                  '检验Cl⁻的原理：Ag⁺+Cl⁻→AgCl↓（白色沉淀，不溶于稀硝酸）',
                  '必须先加稀HNO₃酸化排除CO₃²⁻等干扰：Ag₂CO₃也是白色沉淀，但溶于稀硝酸',
                  '若不酸化，CO₃²⁻+2Ag⁺→Ag₂CO₃↓（白），会误判为有Cl⁻',
                  'AgCl不溶于稀硝酸，Ag₂CO₃+2HNO₃→2AgNO₃+H₂O+CO₂↑（沉淀溶解）'
                ]
              }
            }
          ]
        },
        {
          id: 'b1-ch2-sec3',
          title: '第三节 物质的量',
          exercises: [
            {
              id: 'b1c2s3-001', template: 'concept-construction',
              title: '物质的量的定义与单位',
              params: {
                cases: ['1mol H₂O含有约6.02×10²³个水分子', '1mol NaCl含有1mol Na⁺和1mol Cl⁻', '50g铁钉不能说1mol铁钉'],
                caseOptions: [
                  '物质的量适用于微观粒子',
                  '物质的量就是物质的质量',
                  '摩尔是物质的量的单位'
                ],
                caseCorrectIndices: [0, 0, 0],
                caseCommonality: '物质的量是表示含有一定数目粒子的集合体的物理量',
                conceptName: '物质的量',
                definitionKeyTerms: ['粒子', '集合体', '摩尔'],
                definitionHint: '物质的量是连接宏观与微观的桥梁',
                fullDefinition: '物质的量是表示含有一定数目微观粒子的集合体的物理量，符号n，单位摩尔（mol）。1 mol任何粒子含有约6.02×10²³个粒子（阿伏加德罗常数）',
                boundaryItems: ['1mol氢原子可以这样表示', '1mol氧气分子中的氧原子是1mol', '1mol NaCl含有1mol Na⁺和1mol Cl⁻', '物质的量不能用于宏观物体'],
                boundaryCorrectIndices: [0, 2, 3],
                explainPrompt: '为什么物质的量不能用于宏观物体（如1mol铁钉）？',
                explainHint: '宏观物体中包含的粒子数量太大',
                explainKeyTerms: ['宏观', '微观', '粒子', '6.02×10²³'],
                reasoning: [
                  '物质的量是用于衡量微观粒子（原子、分子、离子、电子等）数量的物理量',
                  '1mol任何粒子的粒子数约为6.02×10²³（阿伏加德罗常数），这是一个巨大的数字',
                  '宏观物体（如1个铁钉）中含有约10²³个原子，说"1mol铁钉"无法明确是指铁钉个体还是铁原子',
                  '用摩尔时必须指明粒子种类，如1mol H₂O、1mol Fe等'
                ]
              }
            },
            {
              id: 'b1c2s3-002', template: 'concept-construction',
              title: 'N、n、M、Vm、c的关系',
              params: {
                cases: ['18g H₂O的物质的量为1mol（n=m/M）', '标况下22.4L CO₂的物质的量为1mol（n=V/Vm）', '1L 1mol/L NaCl溶液含1mol NaCl（c=n/V）'],
                caseOptions: [
                  'n = m/M（质量→物质的量）',
                  'n = V/Vm（气体体积→物质的量）',
                  'c = n/V（物质的量浓度）'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '三个公式涵盖质量、体积、浓度与物质的量的换算',
                conceptName: '物质的量的计算关系',
                definitionKeyTerms: ['质量', '摩尔质量', '气体摩尔体积', '物质的量浓度'],
                definitionHint: 'n=m/M, n=V/Vm, c=n/V分别对应什么物理量？',
                fullDefinition: 'n=m/M（质量法，适用于任何物质）、n=V/Vm（气体体积法，标况Vm=22.4L/mol）、c=n/V（溶液浓度法）',
                boundaryItems: ['标况下1mol任何气体体积都约是22.4L', '标况下H₂O是气体', '气体摩尔体积适用于任何条件下的气体', 'Vm=22.4L/mol只适用于标况（0℃，101kPa）'],
                boundaryCorrectIndices: [0, 3],
                explainPrompt: '为什么标况下H₂O不能用气体摩尔体积22.4L/mol？',
                explainHint: '标况下H₂O的状态是什么？',
                explainKeyTerms: ['标况', 'H₂O', '液态', '气体'],
                reasoning: [
                  'n=m/M适用于任何物质（固体、液体、气体），m是质量，M是摩尔质量',
                  'n=V/Vm只适用于气体，且Vm=22.4L/mol只在标况（0℃，101kPa）下成立',
                  '标况下H₂O是液态，不是气体，不能用气体摩尔体积',
                  'c=n/V只适用于溶液，V是溶液体积（单位L），n是溶质的物质的量'
                ]
              }
            },
            {
              id: 'b1c2s3-003', template: 'error-analysis',
              title: '阿伏加德罗定律常见错误',
              params: {
                statement: '同温同压下，相同体积的任何物质含有相同数目的分子',
                errorOptions: ['同温同压', '相同体积', '任何物质', '相同数目的分子'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['阿伏加德罗定律', '气体', '分子数'],
                principleHint: '阿伏加德罗定律适用于什么状态？',
                correctVersion: '同温同压下，相同体积的任何气体含有相同数目的分子',
                finalHint: '阿伏加德罗定律只适用于气体，不适用于固体和液体',
                reasoning: [
                  '阿伏加德罗定律仅适用于气体状态。固体和液体的分子间距不同，相同体积时分子数不同',
                  '同温同压下，气体分子间距由温度和压强决定，与气体种类无关（理想气体状态方程PV=nRT）',
                  '相同体积的气体在相同条件下含有相同数目的分子',
                  ''
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'b1-ch3',
      title: '第三章 铁 金属材料',
      sections: [
        {
          id: 'b1-ch3-sec1',
          title: '第一节 铁及其化合物',
          exercises: [
            {
              id: 'b1c3s1-001', template: 'redox-reasoning',
              title: '铁在氧气中燃烧',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Fe', valences: { Fe: 0 } },
                  { key: 'reactant2', formula: 'O₂', valences: { O: 0 } }
                ],
                identifyOptions: ['Fe是还原剂，O₂是氧化剂', 'Fe是氧化剂，O₂是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '3Fe + 2O₂ → Fe₃O₄',
                finalHint: 'Fe₃O₄可写成FeO·Fe₂O₃，Fe有+2和+3价',
                reasoning: [
                  'Fe从0价升到+2/+3价（Fe₃O₄中），化合价升高，失电子→还原剂。O从0价降到-2价，化合价降低，得电子→氧化剂',
                  '3Fe共失去8个电子（2个Fe→Fe³⁺各失3e⁻，1个Fe→Fe²⁺失2e⁻），2个O₂共得8个电子',
                  '3Fe + 2O₂ → Fe₃O₄（Fe₃O₄是黑色固体）',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s1-002', template: 'redox-reasoning',
              title: '铁与氯气反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Fe', valences: { Fe: 0 } },
                  { key: 'reactant2', formula: 'Cl₂', valences: { Cl: 0 } }
                ],
                identifyOptions: ['Fe是还原剂，Cl₂是氧化剂', 'Fe是氧化剂，Cl₂是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '2Fe + 3Cl₂ → 2FeCl₃',
                finalHint: 'Cl₂是强氧化剂，Fe直接被氧化到+3价',
                reasoning: [
                  'Fe从0价升到+3价，化合价升高，失电子→还原剂。Cl从0价降到-1价，化合价降低，得电子→氧化剂',
                  '每2个Fe共失去6个电子，每3个Cl₂共得到6个电子',
                  '2Fe + 3Cl₂ → 2FeCl₃（无论Cl₂量多少都生成FeCl₃，不是FeCl₂）',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s1-003', template: 'redox-reasoning',
              title: '铁与硫反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Fe', valences: { Fe: 0 } },
                  { key: 'reactant2', formula: 'S', valences: { S: 0 } }
                ],
                identifyOptions: ['Fe是还原剂，S是氧化剂', 'Fe是氧化剂，S是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: 'Fe + S → FeS',
                finalHint: 'S的氧化性较弱，Fe只被氧化到+2价',
                reasoning: [
                  'Fe从0价升到+2价，化合价升高，失电子→还原剂。S从0价降到-2价，化合价降低，得电子→氧化剂',
                  'Fe失去2个电子，S得到2个电子',
                  'Fe + S → FeS（对比Cl₂：S氧化性弱于Cl₂，Fe只被氧化到+2价）',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s1-004', template: 'redox-reasoning',
              title: '铁与水蒸气反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Fe', valences: { Fe: 0 } },
                  { key: 'reactant2', formula: 'H₂O', valences: { H: 1, O: -2 } }
                ],
                identifyOptions: ['Fe是还原剂，H₂O是氧化剂', 'Fe是氧化剂，H₂O是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '3Fe + 4H₂O(g) → Fe₃O₄ + 4H₂',
                finalHint: '高温下Fe还原水蒸气中的H',
                reasoning: [
                  'Fe从0价升到+2/+3价（Fe₃O₄中），化合价升高，失电子→还原剂。H₂O中H从+1价降到0价，化合价降低，得电子→氧化剂',
                  '3Fe共失去8个电子，4个H₂O中的8个H共得到8个电子',
                  '3Fe + 4H₂O(g) → Fe₃O₄ + 4H₂（高温条件）',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s1-005', template: 'redox-reasoning',
              title: 'Fe(OH)₂被氧化为Fe(OH)₃',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Fe(OH)₂', valences: { Fe: 2, O: -2, H: 1 } },
                  { key: 'reactant2', formula: 'O₂', valences: { O: 0 } },
                  { key: 'reactant3', formula: 'H₂O', valences: { H: 1, O: -2 } }
                ],
                identifyOptions: ['Fe(OH)₂是还原剂，O₂是氧化剂', 'Fe(OH)₂是氧化剂，O₂是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃',
                finalHint: '颜色变化：白色→灰绿色→红褐色',
                reasoning: [
                  'Fe(OH)₂中Fe从+2价升到+3价，化合价升高，失电子→还原剂。O₂中O从0价降到-2价，化合价降低，得电子→氧化剂',
                  '4个Fe(OH)₂失4个电子，1个O₂得4个电子',
                  '4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s1-006', template: 'comparison-reasoning',
              title: 'Fe²⁺与Fe³⁺的性质比较',
              params: {
                conceptA: 'Fe²⁺',
                conceptB: 'Fe³⁺',
                description: '浅绿色，与KSCN无血红色，有还原性，加Cl₂可氧化为Fe³⁺',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么它不可能是Fe³⁺？',
                excludeHint: '比较与KSCN的显色反应和颜色',
                excludeKeyTerms: ['浅绿色', 'KSCN', '无血红色'],
                differenceOptions: ['氧化性强弱不同', '颜色不同', '与KSCN显色反应不同', '以上都是'],
                differenceCorrectIndex: 3,
                scenarioPrompt: '如何用KSCN溶液鉴别Fe²⁺和Fe³⁺溶液？',
                scenarioOptions: ['Fe³⁺遇KSCN显血红色，Fe²⁺不显色', 'Fe²⁺遇KSCN显血红色，Fe³⁺不显色', '两者都显色', '两者都不显色'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  'Fe²⁺溶液呈浅绿色，Fe³⁺溶液呈棕黄色，颜色不同',
                  'Fe³⁺与KSCN反应显血红色（Fe³⁺+3SCN⁻→Fe(SCN)₃），Fe²⁺与KSCN不显色，这是鉴别Fe³⁺的特征反应',
                  'Fe²⁺有还原性（可被Cl₂、O₂等氧化为Fe³⁺），Fe³⁺有较强氧化性（可被Fe、Cu等还原为Fe²⁺）',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s1-007', template: 'redox-reasoning',
              title: 'FeCl₃腐蚀铜板',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'FeCl₃', valences: { Fe: 3, Cl: -1 } },
                  { key: 'reactant2', formula: 'Cu', valences: { Cu: 0 } }
                ],
                identifyOptions: ['Cu是还原剂，FeCl₃是氧化剂', 'Cu是氧化剂，FeCl₃是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '2FeCl₃ + Cu → 2FeCl₂ + CuCl₂',
                finalHint: 'Fe³⁺氧化Cu，用于腐蚀印刷电路板',
                reasoning: [
                  'Cu从0价升到+2价，化合价升高，失电子→还原剂。FeCl₃中Fe从+3价降到+2价，化合价降低，得电子→氧化剂',
                  '每1个Cu失去2个电子，每2个Fe³⁺各得1个电子（共得2个电子）',
                  '2FeCl₃ + Cu → 2FeCl₂ + CuCl₂（印刷电路板腐蚀原理）',
                  ''
                ]
              }
            }
          ]
        },
        {
          id: 'b1-ch3-sec2',
          title: '第二节 金属材料',
          exercises: [
            {
              id: 'b1c3s2-001', template: 'redox-reasoning',
              title: '铝与盐酸反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Al', valences: { Al: 0 } },
                  { key: 'reactant2', formula: 'HCl', valences: { H: 1, Cl: -1 } }
                ],
                identifyOptions: ['Al是还原剂，HCl是氧化剂', 'Al是氧化剂，HCl是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '2Al + 6HCl → 2AlCl₃ + 3H₂↑',
                finalHint: 'Al从0→+3，H从+1→0',
                reasoning: [
                  'Al从0价升到+3价，化合价升高，失电子→还原剂。HCl中H从+1价降到0价，化合价降低，得电子→氧化剂',
                  '每2个Al失去6个电子，每6个H⁺各得1个电子（共得6个电子）',
                  '2Al + 6HCl → 2AlCl₃ + 3H₂↑',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s2-002', template: 'redox-reasoning',
              title: '铝与NaOH溶液反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Al', valences: { Al: 0 } },
                  { key: 'reactant2', formula: 'NaOH', valences: { Na: 1, O: -2, H: 1 } },
                  { key: 'reactant3', formula: 'H₂O', valences: { H: 1, O: -2 } }
                ],
                identifyOptions: ['Al是还原剂，NaOH和H₂O中的H⁺是氧化剂', 'Al是氧化剂，NaOH是还原剂', 'Al是还原剂，H₂O是氧化剂', 'Al是氧化剂，NaOH和H₂O是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '分析Al和H的化合价变化：谁是还原剂？谁是氧化剂？',
                finalEquation: '2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑',
                finalHint: 'Al是两性金属，既能与酸又能与碱反应生成H₂',
                reasoning: [
                  'Al从0价升到+3价，化合价升高，失电子→还原剂。NaOH和H₂O中的H从+1价降到0价，得电子→氧化剂',
                  '每2个Al失去6个电子，NaOH和H₂O中的6个H⁺各得1个电子（共得6个电子）',
                  '2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s2-003', template: 'redox-reasoning',
              title: '铝热反应',
              params: {
                substances: [
                  { key: 'reactant1', formula: 'Al', valences: { Al: 0 } },
                  { key: 'reactant2', formula: 'Fe₂O₃', valences: { Fe: 3, O: -2 } }
                ],
                identifyOptions: ['Al是还原剂，Fe₂O₃是氧化剂', 'Al是氧化剂，Fe₂O₃是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，谁是还原剂（化合价升高）？谁是氧化剂（化合价降低）？',
                finalEquation: '2Al + Fe₂O₃ → 2Fe + Al₂O₃',
                finalHint: '大量放热，用于焊接铁轨',
                reasoning: [
                  'Al从0价升到+3价，化合价升高，失电子→还原剂。Fe₂O₃中Fe从+3价降到0价，化合价降低，得电子→氧化剂',
                  '每2个Al失去6个电子，每2个Fe³⁺各得3个电子（共得6个电子）',
                  '2Al + Fe₂O₃ → 2Fe + Al₂O₃（大量放热，温度可达2000℃以上）',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s2-004', template: 'concept-construction',
              title: 'Al(OH)₃的两性',
              params: {
                cases: ['Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O（与酸反应）', 'Al(OH)₃ + NaOH → NaAlO₂ + 2H₂O（与碱反应）', 'Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O（只与酸反应）'],
                caseOptions: [
                  '与酸反应体现碱性',
                  '与碱反应体现酸性',
                  '两性氢氧化物'
                ],
                caseCorrectIndices: [0, 1, 0],
                caseCommonality: 'Al(OH)₃既能与酸反应又能与碱反应，是两性氢氧化物',
                conceptName: '两性氢氧化物',
                definitionKeyTerms: ['两性', '酸', '碱', 'Al(OH)₃'],
                definitionHint: '既能与酸反应又能与碱反应的氢氧化物叫什么？',
                fullDefinition: '两性氢氧化物既能与酸反应（体现碱性）又能与碱反应（体现酸性），如Al(OH)₃。大多数氢氧化物是碱性的',
                boundaryItems: ['Al(OH)₃是两性氢氧化物', 'NaOH是两性氢氧化物', 'Mg(OH)₂是碱性氢氧化物', 'Al(OH)₃与NaOH反应是复分解反应'],
                boundaryCorrectIndices: [0, 2, 3],
                explainPrompt: '为什么Al(OH)₃被称为两性氢氧化物？',
                explainHint: '两性指既能与酸反应又能与碱反应',
                explainKeyTerms: ['酸', '碱', '两性', 'Al(OH)₃'],
                reasoning: [
                  'Al(OH)₃与HCl反应：Al(OH)₃+3HCl→AlCl₃+3H₂O，体现碱性（中和酸）',
                  'Al(OH)₃与NaOH反应：Al(OH)₃+NaOH→NaAlO₂+2H₂O，体现酸性（与碱反应）',
                  'Mg(OH)₂只能与酸反应（碱性），不能与碱反应，因此不是两性',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s2-005', template: 'concept-construction',
              title: '铝的化合物转化',
              params: {
                cases: ['AlCl₃ + 3NaOH(适量) → Al(OH)₃↓ + 3NaCl', 'Al(OH)₃ + NaOH(过量) → NaAlO₂ + 2H₂O', 'NaAlO₂ + HCl(适量) → Al(OH)₃↓ + NaCl'],
                caseOptions: [
                  'AlCl₃与适量碱生成Al(OH)₃沉淀',
                  'Al(OH)₃溶于过量强碱生成偏铝酸盐',
                  '偏铝酸盐与适量酸生成Al(OH)₃沉淀'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '铝的化合物在酸碱中可相互转化',
                conceptName: '铝的化合物转化规律',
                definitionKeyTerms: ['Al(OH)₃', '两性', 'Al³⁺', 'AlO₂⁻'],
                definitionHint: 'Al³⁺与适量/过量碱反应产物有何不同？',
                fullDefinition: 'Al³⁺+适量OH⁻→Al(OH)₃↓；Al(OH)₃+过量OH⁻→AlO₂⁻+2H₂O；AlO₂⁻+H⁺+H₂O→Al(OH)₃↓',
                boundaryItems: ['AlCl₃与过量NaOH反应生成NaAlO₂', 'AlCl₃与适量NaOH反应生成Al(OH)₃', 'NaAlO₂与过量HCl反应生成AlCl₃', 'NaAlO₂与适量HCl反应生成Al(OH)₃'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么Al(OH)₃既能溶于过量碱又能溶于过量酸？',
                explainHint: 'Al(OH)₃是两性氢氧化物',
                explainKeyTerms: ['两性', 'Al(OH)₃', '过量'],
                reasoning: [
                  'AlCl₃与适量NaOH：Al³⁺+3OH⁻→Al(OH)₃↓（白色胶状沉淀）',
                  'Al(OH)₃与过量NaOH：Al(OH)₃+OH⁻→AlO₂⁻+2H₂O（沉淀溶解）',
                  'NaAlO₂与适量酸：AlO₂⁻+H⁺+H₂O→Al(OH)₃↓；与过量酸：AlO₂⁻+4H⁺→Al³⁺+2H₂O',
                  ''
                ]
              }
            },
            {
              id: 'b1c3s2-006', template: 'concept-construction',
              title: '合金的概念与特点',
              params: {
                cases: ['黄铜（Cu-Zn合金）硬度大于纯铜', '焊锡（Sn-Pb合金）熔点低于纯金属', '铝合金密度小且强度高'],
                caseOptions: [
                  '合金硬度一般大于成分金属',
                  '合金熔点一般低于成分金属',
                  '合金性能优于纯金属'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '合金具有不同于纯金属的优良性能',
                conceptName: '合金',
                definitionKeyTerms: ['两种或多种', '金属', '金属特性', '熔合'],
                definitionHint: '合金是由什么物质熔合而成的？',
                fullDefinition: '合金是由两种或多种金属（或金属与非金属）熔合而成的具有金属特性的物质',
                boundaryItems: ['黄铜是合金', '不锈钢是合金', '铝合金是合金', '金刚石是合金'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么合金的硬度通常大于其成分金属？',
                explainHint: '原子排列的规整性被破坏',
                explainKeyTerms: ['原子', '排列', '阻碍', '滑移'],
                reasoning: [
                  '合金中不同原子的半径不同，破坏了纯金属中原子的规整排列，阻碍原子层滑移→硬度增大',
                  '合金中不同金属原子间的键能差异，使熔化所需能量降低→熔点降低',
                  '不锈钢是铁铬镍合金，铝合金是铝铜镁等合金，金刚石是碳单质，不是合金',
                  ''
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'b1-ch4',
      title: '第四章 物质结构 元素周期律',
      sections: [
        {
          id: 'b1-ch4-sec1',
          title: '第一节 原子结构与元素周期表',
          exercises: [
            {
              id: 'b1c4s1-001', template: 'concept-construction',
              title: '原子结构与组成',
              params: {
                cases: ['所有¹H原子都有1个质子（质子数=1）', '¹²C和¹⁴C质子数相同（都是6）但中子数不同', '¹⁶O和¹⁸O的核外电子数相同（都是8）'],
                caseOptions: [
                  '质子数决定元素种类',
                  '中子数不同决定核素不同',
                  '同位素核外电子数相同'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '原子由原子核（质子+中子）和核外电子组成，质子数决定元素',
                conceptName: '原子结构、元素与核素',
                definitionKeyTerms: ['质子数', '中子数', '核素', '同位素'],
                definitionHint: '元素由什么决定？核素由什么决定？',
                fullDefinition: '原子由原子核（质子+中子）和核外电子组成。质子数决定元素种类；质子数相同中子数不同的原子互为同位素',
                boundaryItems: ['¹H、²H、³H互为同位素', '¹²C和¹⁴C互为同位素', 'O₂和O₃互为同位素', '¹⁶O和¹⁸O的核外电子数相同'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么O₂和O₃不是同位素？',
                explainHint: '同位素指原子之间的关系',
                explainKeyTerms: ['原子', '分子', '同位素', '质子数'],
                reasoning: [
                  '质子数决定元素种类：所有H原子都有1个质子→同属氢元素',
                  '同位素定义：质子数相同中子数不同的同种元素的不同原子。¹H、²H、³H质子数都是1，中子数分别为0、1、2',
                  'O₂和O₃是分子（同素异形体），不是原子。同位素指的是原子之间的关系',
                  '¹⁶O和¹⁸O的质子数都是8，核外电子数都是8（原子中质子数=电子数）'
                ]
              }
            },
            {
              id: 'b1c4s1-002', template: 'concept-construction',
              title: '元素周期表结构',
              params: {
                cases: ['Li在第二周期IA族（2个电子层，最外层1个电子）', 'Ne在第二周期0族（最外层8电子稳定结构）', 'Fe在第四周期VIII族'],
                caseOptions: [
                  '周期数=电子层数',
                  '主族序数=最外层电子数',
                  '0族元素最外层为稳定结构'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '周期表位置由电子层数和最外层电子数决定',
                conceptName: '元素周期表的结构',
                definitionKeyTerms: ['周期', '族', '主族', '副族'],
                definitionHint: '周期表有几个周期、几个族？',
                fullDefinition: '元素周期表有7个周期（1-3短周期、4-6长周期、7不完全周期）、16个族（7主族、7副族、VIII族、0族）',
                boundaryItems: ['Na在第3周期IA族', 'He在第1周期0族', 'Fe在第4周期VIII族', 'Cl在第2周期VIIA族'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么Cl不在第二周期VIIA族？',
                explainHint: '周期数由电子层数决定',
                explainKeyTerms: ['电子层', '周期', 'Cl'],
                reasoning: [
                  '周期数=原子核外电子层数。Cl有3个电子层（K、L、M），所以在第三周期',
                  '主族序数=最外层电子数。Cl最外层7个电子→VIIA族',
                  '族分为主族（IA~VIIA）、副族（IB~VIIB）、VIII族和0族。VIII族有3列（Fe、Co、Ni）',
                  ''
                ]
              }
            },
            {
              id: 'b1c4s1-003', template: 'concept-construction',
              title: '核外电子排布规律',
              params: {
                cases: ['K层最多2个电子', 'M层最多18个电子', 'Ca的原子结构示意图为+20 2 8 8 2'],
                caseOptions: [
                  '第n层最多容纳2n²个电子',
                  '最外层不超过8个电子',
                  '电子先排满内层再排外层'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '电子排布遵循能量最低原理和各层容量限制',
                conceptName: '核外电子排布规律',
                definitionKeyTerms: ['能量最低', '2n²', '最外层8', '次外层18'],
                definitionHint: '核外电子排布遵循什么原理？每层最多容纳多少电子？',
                fullDefinition: '核外电子排布遵循：①能量最低原理（先排满内层再排外层）；②每层最多2n²个电子；③最外层≤8，次外层≤18',
                boundaryItems: ['K层最多2个电子', 'M层最多18个电子', 'Ca的原子结构示意图为+20 2 8 8 2', 'Cl的最外层有7个电子'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么Ca的核外电子排布是2 8 8 2而不是2 8 10？',
                explainHint: '最外层电子数不能超过多少？',
                explainKeyTerms: ['最外层', '8电子', 'Ca', '排布'],
                reasoning: [
                  '能量最低原理：电子先排满能量低的K层（n=1），再排L层（n=2），然后M层（n=3）',
                  '每层最多2n²：K层2×1²=2，L层2×2²=8，M层2×3²=18',
                  '最外层不超过8个（Ca最外层是第4层，虽第4层最多可排32个，但最外层不能超过8个）',
                  ''
                ]
              }
            }
          ]
        },
        {
          id: 'b1-ch4-sec2',
          title: '第二节 元素周期律',
          exercises: [
            {
              id: 'b1c4s2-001', template: 'comparison-reasoning',
              title: '同周期与同主族元素性质递变',
              params: {
                conceptA: '同周期（从左到右）',
                conceptB: '同主族（从上到下）',
                description: '原子半径逐渐减小，金属性逐渐减弱，非金属性逐渐增强，最高价氧化物水化物酸性增强',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么不可能是在同主族中从上到下的变化？',
                excludeHint: '同主族从上到下原子半径增大',
                excludeKeyTerms: ['原子半径', '减小', '同周期'],
                differenceOptions: ['原子半径变化方向相反', '金属性变化方向相同', '非金属性变化方向相反', 'A和C都是'],
                differenceCorrectIndex: 3,
                scenarioPrompt: '第三周期元素中，原子半径最大的是？',
                scenarioOptions: ['Na（最左）', 'Cl（最右）', 'Al（中间）', 'Si'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '同周期从左到右：原子半径减小（核电荷数增大，对电子引力增强），金属性减弱，非金属性增强',
                  '同主族从上到下：原子半径增大（电子层增多），金属性增强，非金属性减弱',
                  '同周期和同主族中原子半径变化方向相反（同周期减小，同主族增大），非金属性变化方向也相反',
                  ''
                ]
              }
            },
            {
              id: 'b1c4s2-002', template: 'concept-construction',
              title: '元素金属性与非金属性',
              params: {
                cases: ['Na与水剧烈反应，Mg与水缓慢反应→Na金属性比Mg强', 'Cl₂能置换出H₂S中的S→Cl非金属性比S强', 'K与水反应比Na更剧烈→K金属性比Na强'],
                caseOptions: [
                  '金属性越强，单质与水反应越剧烈',
                  '非金属性越强，单质氧化性越强',
                  '同主族从上到下金属性增强'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '金属性/非金属性强弱可通过单质的反应活性判断',
                conceptName: '元素金属性与非金属性的判断',
                definitionKeyTerms: ['金属性', '非金属性', '最高价氧化物水化物'],
                definitionHint: '金属性和非金属性强弱如何判断？',
                fullDefinition: '金属性强弱判断：单质与水/酸反应置换氢的能力、最高价氧化物水化物的碱性。非金属性强弱判断：与H₂化合的难易、氢化物的稳定性、最高价氧化物水化物的酸性',
                boundaryItems: ['Na的金属性比Mg强', 'Cl的非金属性比S强', 'O的非金属性比F强', 'K的金属性比Na强'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么O的非金属性比F弱？',
                explainHint: 'F是周期表中非金属性最强的元素',
                explainKeyTerms: ['非金属性', 'F', '最强'],
                reasoning: [
                  '金属性：与水反应剧烈程度、最高价氧化物水化物碱性。Na反应比Mg剧烈→Na金属性更强',
                  '非金属性：单质氧化性、最高价氧化物水化物酸性。Cl₂能置换S（Cl₂+H₂S→2HCl+S↓）→Cl非金属性更强',
                  '元素周期表中非金属性最强的是F（右上角），金属性最强的是Fr（左下角）',
                  ''
                ]
              }
            }
          ]
        },
        {
          id: 'b1-ch4-sec3',
          title: '第三节 化学键',
          exercises: [
            {
              id: 'b1c4s3-001', template: 'concept-construction',
              title: '化学键类型',
              params: {
                cases: ['NaCl由Na⁺和Cl⁻通过离子键结合', 'HCl由H和Cl通过共价键结合', 'Fe由Fe³⁺和自由电子通过金属键结合'],
                caseOptions: [
                  '离子键：阴阳离子间静电作用',
                  '共价键：原子间共用电子对',
                  '金属键：金属阳离子与自由电子间作用'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '三种基本化学键类型：离子键、共价键、金属键',
                conceptName: '化学键的类型',
                definitionKeyTerms: ['离子键', '共价键', '金属键'],
                definitionHint: '化学键主要分为哪三种类型？',
                fullDefinition: '化学键分为离子键（阴阳离子间的静电作用）、共价键（原子间通过共用电子对形成）、金属键（金属阳离子与自由电子间的静电作用）',
                boundaryItems: ['NaCl中含有离子键', 'HCl中含有共价键', 'Fe中含有金属键', 'NH₄Cl中只有共价键'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么NH₄Cl中既有离子键又有共价键？',
                explainHint: 'NH₄⁺内部和NH₄⁺与Cl⁻之间分别是什么键？',
                explainKeyTerms: ['NH₄⁺', '离子键', '共价键'],
                reasoning: [
                  '离子键：活泼金属（IA/IIA）与活泼非金属（VIA/VIIA）之间形成。NaCl中Na⁺与Cl⁻通过离子键结合',
                  '共价键：非金属原子之间通过共用电子对形成。HCl中H和Cl各提供一个电子形成共用电子对',
                  'NH₄Cl中：NH₄⁺与Cl⁻之间是离子键，但NH₄⁺内部N与H之间是共价键（含配位键）',
                  ''
                ]
              }
            },
            {
              id: 'b1c4s3-002', template: 'concept-construction',
              title: '离子键与共价键的判断',
              params: {
                cases: ['NaCl（IA族金属+VIIA族非金属）：离子键', 'HCl（非金属+非金属）：共价键', 'NaOH（含金属但含原子团）：既有离子键又有共价键'],
                caseOptions: [
                  '活泼金属与活泼非金属→离子键',
                  '非金属之间→共价键',
                  '含原子团的离子化合物中有共价键'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '离子键和共价键的判断依据成键元素的类型',
                conceptName: '离子键与共价键的判断方法',
                definitionKeyTerms: ['金属', '非金属', '离子键', '共价键'],
                definitionHint: '什么情况下形成离子键？什么情况下形成共价键？',
                fullDefinition: '活泼金属（IA/IIA）与活泼非金属（VIA/VIIA）之间形成离子键；非金属之间形成共价键；含原子团的离子化合物（如NaOH、NH₄Cl）中既有离子键又有共价键',
                boundaryItems: ['NaCl是离子化合物', 'HCl是共价化合物', 'NaOH含有离子键和共价键', 'AlCl₃是离子化合物'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么AlCl₃是共价化合物而不是离子化合物？',
                explainHint: 'Al和Cl的电负性差值不够大',
                explainKeyTerms: ['AlCl₃', '共价化合物', '电负性'],
                reasoning: [
                  '典型离子键：IA/IIA族金属与VIA/VIIA族非金属。Na(IA)+Cl(VIIA)→离子键',
                  '非金属原子间：H(非金属)+Cl(非金属)→共价键。HCl是共价化合物',
                  '含原子团的离子化合物如NaOH：Na⁺与OH⁻之间是离子键，OH⁻内部是共价键',
                  ''
                ]
              }
            },
            {
              id: 'b1c4s3-003', template: 'concept-construction',
              title: '电子式与8电子稳定结构',
              params: {
                cases: ['NaCl的电子式中Na⁺没有电子（失电子给Cl）', 'CO₂中C满足8电子（4+|+4|=8）', 'BF₃中B不满足8电子（3+|+3|=6）'],
                caseOptions: [
                  '离子化合物电子式中阳离子直接用离子符号',
                  '判断8电子：|化合价|+最外层电子数=8',
                  '不满足8电子的化合物呈缺电子结构'
                ],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '8电子稳定结构是判断原子是否达到稳定结构的标准',
                conceptName: '8电子稳定结构',
                definitionKeyTerms: ['化合价', '最外层电子数', '8电子'],
                definitionHint: '如何判断原子是否满足8电子稳定结构？',
                fullDefinition: '判断8电子结构的公式：|化合价|+最外层电子数=8（H为2）。满足则达到8电子稳定结构，不满足则未达到',
                boundaryItems: ['Cl₂中每个Cl满足8电子', 'H₂O中H满足2电子', 'SO₂中S满足8电子', 'N₂中每个N满足8电子'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么BF₃中B不满足8电子？',
                explainHint: 'B最外层3个电子，化合价+3',
                explainKeyTerms: ['B', '6电子', '缺电子'],
                reasoning: [
                  '8电子判断：|化合价|+最外层电子数=8。CO₂中C：4（最外层）+|+4|（化合价）=8→满足',
                  'BF₃中B：3（最外层）+|+3|（化合价）=6→不满足8电子，B是缺电子原子',
                  'Cl₂：Cl最外层7个电子，化合价0→7+0=7，但Cl₂中每个Cl通过共价键满足8电子。N₂：N最外层5，化合价0，5+0=5，但N≡N三键使每个N满足8电子',
                  ''
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
