const 化学实验 = {
  textbook: '化学实验（跨模块专题）',

  chapters: [
    {
      id: 'exp-ch1',
      title: '第一章 实验安全与基本操作',
      sections: [
        {
          id: 'exp-ch1-sec1',
          title: '第一节 实验安全与基本操作',
          exercises: [
            {
              id: 'exp-c1s1-001', template: 'experimental-reasoning',
              title: '过滤操作的要点（一贴二低三靠）',
              params: {
                goal: '过滤操作的要点',
                principleOptions: [
                  '利用滤纸拦截固体颗粒，液体透过滤纸',
                  '利用离心分离固体和液体',
                  '利用密度差异静置分层'
                ],
                principleCorrectIndex: 0,
                keyStepItems: [
                  '滤纸紧贴漏斗内壁（一贴）',
                  '滤纸边缘低于漏斗边缘（二低之一）',
                  '液面低于滤纸边缘（二低之二）',
                  '烧杯嘴靠玻璃棒引流（三靠之一）',
                  '玻璃棒轻靠三层滤纸处（三靠之二）',
                  '漏斗下端紧靠烧杯内壁（三靠之三）'
                ],
                keyStepCorrectIndices: [0, 1, 2, 3, 4, 5],
                orderItems: [
                  '排干气泡使滤纸贴紧',
                  '调整滤纸高度',
                  '倒入滤液',
                  '引流入漏斗'
                ],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先做好准备，再开始过滤',
                consequenceOptions: [
                  '滤纸与漏斗壁之间有气泡会减慢过滤速度',
                  '顺序不影响结果',
                  '先倒滤液会导致滤纸破损'
                ],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果不先让滤纸紧贴漏斗内壁会怎样？',
                reasoning: [
                  '过滤的原理：固体颗粒太大无法通过滤纸孔隙，液体分子可以通过',
                  '一贴（无气泡）→二低→三靠，每一步都有其必要性',
                  '气泡会占据滤纸和漏斗之间的空间，降低有效过滤面积',
                  '玻璃棒起引流作用，防止液体溅出'
                ]
              }
            },
            {
              id: 'exp-c1s1-002', template: 'concept-construction',
              title: '量筒的正确读数方法',
              params: {
                cases: [
                  '仰视量筒读数',
                  '俯视量筒读数',
                  '平视量筒读数'
                ],
                caseOptions: [
                  '视线与凹液面最低处水平',
                  '视线与凸液面最高处水平',
                  '视线与液面任意处水平'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '量筒读数时视线应与凹液面最低处保持水平',
                conceptName: '量筒的正确读数方法',
                definitionKeyTerms: ['凹液面最低处', '水平', '仰视偏小', '俯视偏大'],
                definitionHint: '视线高低对读数的影响',
                fullDefinition: '用量筒量取液体时，视线应与凹液面最低处保持水平；仰视造成读数偏小（实际体积偏大），俯视造成读数偏大（实际体积偏小）',
                boundaryItems: [
                  '量取9.5mL水应用10mL量筒',
                  '量筒的精度为0.1mL',
                  '量筒可以加热',
                  '量筒可用于稀释浓硫酸'
                ],
                boundaryCorrectIndices: [0, 1],
                explainPrompt: '为什么仰视读数偏小？',
                explainHint: '思考视线方向与液面的关系',
                explainKeyTerms: ['仰视', '凹液面', '读数偏小'],
                reasoning: [
                  '量筒刻度从下往上增大',
                  '仰视时视线斜向上看，看到的刻度线比实际液面对应的刻度线偏低',
                  '所以仰视读数<实际体积（读数偏小）',
                  '俯视时相反，读数>实际体积'
                ]
              }
            },
            {
              id: 'exp-c1s1-003', template: 'error-analysis',
              title: '容量瓶的使用',
              params: {
                statement: '配制100mL 1.00mol/L NaCl溶液时，将称好的NaCl直接倒入容量瓶中，加蒸馏水至刻度线',
                errorOptions: [
                  'NaCl应先在烧杯中溶解，冷却后再转移至容量瓶',
                  'NaCl应用量筒溶解',
                  '容量瓶可以加热溶解',
                  '加水的操作正确'
                ],
                errorCorrectIndex: 0,
                principleKeyTerms: ['容量瓶', '精密量器', '不能加热', '溶解热效应'],
                principleHint: '容量瓶的用途限制',
                correctVersion: 'NaCl在烧杯中溶解→冷却→用玻璃棒引流转移至容量瓶→洗涤烧杯2-3次→定容→摇匀',
                finalHint: '容量瓶是精密量器，不能加热或直接溶解固体',
                reasoning: [
                  '容量瓶是精密量器，只能用于定容，不能用于溶解或加热',
                  '物质溶解可能有热效应（放热或吸热），热溶液体积不准',
                  '直接倒入容量瓶可能使溶质沾在瓶颈处',
                  '正确操作：烧杯溶解→冷却→玻璃棒引流转移→洗涤→定容→摇匀'
                ]
              }
            },
            {
              id: 'exp-c1s1-004', template: 'concept-construction',
              title: '加热操作的安全要点',
              params: {
                cases: [
                  '加热试管中的液体',
                  '加热试管中的固体',
                  '加热烧杯中的液体'
                ],
                caseOptions: [
                  '试管口不能对着人',
                  '试管口需密封',
                  '试管可直接用酒精灯加热'
                ],
                caseCorrectIndices: [0, 2],
                caseCommonality: '加热时试管口不能对着人，且需注意液体体积和倾斜角度',
                conceptName: '加热操作的安全要点',
                definitionKeyTerms: ['试管容积1/3', '45°角', '管口不对人', '先预热'],
                definitionHint: '试管加热液体时的三个关键参数',
                fullDefinition: '试管加热液体时液体体积不超过试管容积的1/3，试管与桌面成45°角，管口不对人；加热固体时试管口略向下倾斜（防冷凝水回流炸裂）；加热前先预热',
                boundaryItems: [
                  '加热固体试管口略向下倾斜（防冷凝水倒流炸裂）',
                  '加热液体试管口不能对着人',
                  '烧杯加热需垫石棉网',
                  '蒸发皿可直接加热'
                ],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么加热固体时试管口要略向下倾斜？',
                explainHint: '考虑水蒸气的冷凝',
                explainKeyTerms: ['冷凝水', '回流', '炸裂'],
                reasoning: [
                  '加热固体时，固体中的水分受热蒸发，在试管口较冷处冷凝',
                  '试管口向下倾斜可使冷凝水沿管口流出，避免倒流至加热处',
                  '冷凝水倒流到高温底部会使试管骤然受冷而炸裂',
                  '加热液体时则需向上倾斜45°，使受热面积均匀'
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'exp-ch2',
      title: '第二章 气体的制备',
      sections: [
        {
          id: 'exp-ch2-sec1',
          title: '第一节 常见气体的实验室制法',
          exercises: [
            {
              id: 'exp-c2s1-001', template: 'concept-construction',
              title: 'O₂的实验室制法',
              params: {
                cases: [
                  '加热高锰酸钾制O₂',
                  '加热氯酸钾和二氧化锰制O₂',
                  '双氧水在MnO₂催化下制O₂'
                ],
                caseOptions: [
                  '均通过加热含氧化合物分解产生O₂',
                  '均通过电解水产生O₂',
                  '均通过光合作用产生O₂'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '实验室制O₂通过含氧化合物的分解反应',
                conceptName: 'O₂的实验室制法',
                definitionKeyTerms: ['2KMnO₄', '加热分解', '歧化反应', '向上排空气法', '排水法'],
                definitionHint: '高锰酸钾分解是歧化反应',
                fullDefinition: '实验室用加热高锰酸钾制取O₂：2KMnO₄→△→K₂MnO₄+MnO₂+O₂↑，收集方法为向上排空气法或排水法，试管口略向下倾斜且管口放棉花防高锰酸钾粉末堵塞导管',
                boundaryItems: [
                  '高锰酸钾制O₂需在管口放棉花',
                  '收集O₂可用排水法（O₂不易溶于水）',
                  'O₂密度大于空气可用向上排空气法',
                  '高锰酸钾分解是化合反应'
                ],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么高锰酸钾制O₂的试管口要放棉花？',
                explainHint: '高锰酸钾是粉末状固体',
                explainKeyTerms: ['粉末', '堵塞', '导管'],
                reasoning: [
                  '高锰酸钾是紫色粉末，加热时粉末可能随气流进入导管',
                  '棉花可阻挡粉末进入导管，防止导管堵塞',
                  '同时粉末也不会进入水槽污染水（排水法时）',
                  '用氯酸钾或双氧水制O₂则不需要棉花'
                ]
              }
            },
            {
              id: 'exp-c2s1-002', template: 'concept-construction',
              title: 'CO₂的实验室制法',
              params: {
                cases: [
                  'CaCO₃与稀HCl反应',
                  'CaCO₃与稀H₂SO₄反应',
                  'CaCO₃与稀HNO₃反应'
                ],
                caseOptions: [
                  '均能产生CO₂气体',
                  '均不能产生CO₂',
                  '均产生H₂'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '碳酸盐与酸反应生成CO₂',
                conceptName: 'CO₂的实验室制法',
                definitionKeyTerms: ['CaCO₃', '稀HCl', '复分解反应', '不用稀H₂SO₄'],
                definitionHint: '为什么用盐酸不用硫酸',
                fullDefinition: '实验室用大理石（CaCO₃）与稀盐酸反应制取CO₂：CaCO₃+2HCl→CaCl₂+H₂O+CO₂↑。不用稀H₂SO₄的原因是生成CaSO₄微溶，覆盖大理石表面阻止反应继续',
                boundaryItems: [
                  'CaCO₃与稀HCl反应可用启普发生器',
                  '密置向上排空气法收集',
                  '验满用燃着木条放在集气瓶口熄灭',
                  'CO₂可用排水法收集'
                ],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么不用稀H₂SO₄制CO₂？',
                explainHint: '考虑生成物的溶解性',
                explainKeyTerms: ['CaSO₄', '微溶', '覆盖表面'],
                reasoning: [
                  'CaSO₄微溶于水（溶解度仅0.2g左右）',
                  '生成的CaSO₄会附着在大理石表面形成致密薄膜',
                  '这层薄膜阻止了H⁺与CaCO₃进一步接触',
                  '因此反应很快停止，无法持续制取CO₂'
                ]
              }
            },
            {
              id: 'exp-c2s1-003', template: 'comparison-reasoning',
              title: 'H₂与O₂的收集方法对比',
              params: {
                conceptA: 'H₂的收集',
                conceptB: 'O₂的收集',
                description: '一种气体用向下排空气法收集，另一种用向上排空气法收集',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么O₂不能用向下排空气法？',
                excludeHint: '比较两者的相对分子质量',
                excludeKeyTerms: ['密度', '29', '空气平均Mr'],
                differenceOptions: [
                  'H₂密度小于空气（Mr=2<29）用向下排空气法，O₂密度大于空气（Mr=32>29）用向上排空气法',
                  'H₂用向上排空气法，O₂用向下排空气法',
                  '两者都用排水法',
                  '两者都用排空气法'
                ],
                differenceCorrectIndex: 0,
                scenarioPrompt: 'CO（Mr=28）的收集方法应如何选择？',
                scenarioOptions: [
                  '不宜用排空气法（密度与空气接近），应用排水法',
                  '用向上排空气法',
                  '用向下排空气法',
                  '只能用向下排空气法'
                ],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '排空气法的依据是气体密度与空气（Mr≈29）的差异',
                  'Mr>29的气体重，沉在底部，用向上排空气法',
                  'Mr<29的气体轻，浮在上方，用向下排空气法',
                  'Mr接近29的气体排空气法效果差，最好用排水法'
                ]
              }
            },
            {
              id: 'exp-c2s1-004', template: 'experimental-reasoning',
              title: 'Cl₂的实验室制取与尾气处理',
              params: {
                goal: 'Cl₂的实验室制取与尾气处理',
                principleOptions: [
                  'MnO₂氧化浓HCl中的Cl⁻生成Cl₂',
                  'MnO₂催化浓HCl分解',
                  '浓HCl直接分解放出Cl₂'
                ],
                principleCorrectIndex: 0,
                keyStepItems: [
                  'MnO₂与浓HCl混合加热',
                  '用向上排空气法收集Cl₂',
                  '尾气用NaOH溶液吸收',
                  '湿润淀粉碘化钾试纸验满'
                ],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: [
                  'MnO₂与浓HCl混合加热',
                  '向上排空气法收集Cl₂',
                  '湿润淀粉KI试纸验满',
                  'NaOH溶液吸收尾气'
                ],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '制气→收集→验满→尾气处理',
                consequenceOptions: [
                  'Cl₂有毒，必须用NaOH吸收尾气',
                  '可用水吸收尾气替代NaOH',
                  'Cl₂无毒无需处理'
                ],
                consequenceCorrectIndex: 0,
                consequencePrompt: '为什么必须进行尾气处理？',
                reasoning: [
                  'Cl₂有毒（黄绿色刺激性气体），直接排放有害',
                  'Cl₂+2NaOH→NaCl+NaClO+H₂O，碱液可充分吸收',
                  'Cl₂密度大于空气，用向上排空气法收集',
                  '湿润淀粉KI试纸遇Cl₂变蓝（Cl₂置换出I₂遇淀粉变蓝）'
                ]
              }
            },
            {
              id: 'exp-c2s1-005', template: 'concept-construction',
              title: 'SO₂的实验室制法',
              params: {
                cases: [
                  'Na₂SO₃与浓H₂SO₄反应',
                  'Na₂SO₃与稀H₂SO₄反应',
                  'Na₂SO₃与HCl反应'
                ],
                caseOptions: [
                  '均属于强酸制弱酸原理',
                  '均属于氧化还原反应',
                  '均属于化合反应'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '亚硫酸盐与强酸反应生成SO₂',
                conceptName: 'SO₂的实验室制法',
                definitionKeyTerms: ['Na₂SO₃', '浓H₂SO₄', '强酸制弱酸', '复分解反应'],
                definitionHint: '为何用浓硫酸而非稀硫酸',
                fullDefinition: '实验室用亚硫酸钠与浓硫酸反应制取SO₂：Na₂SO₃+H₂SO₄(浓)→Na₂SO₄+SO₂↑+H₂O，收集用向上排空气法，尾气用NaOH溶液吸收',
                boundaryItems: [
                  'SO₂密度大于空气用向上排空气法',
                  '尾气必须用NaOH溶液吸收',
                  'SO₂有刺激性气味有毒',
                  'SO₂可用排水法收集'
                ],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么用浓H₂SO₄而不用稀H₂SO₄？',
                explainHint: '考虑反应速率和SO₂的溶解度',
                explainKeyTerms: ['浓硫酸', '溶解度', '反应速率'],
                reasoning: [
                  'SO₂易溶于水（1:40），用稀H₂SO₄会降低SO₂的产率',
                  '浓H₂SO₄提供H⁺的同时含水量低，减少SO₂的溶解损失',
                  '浓H₂SO₄与Na₂SO₃反应速率适中，易于控制',
                  'SO₂有毒，必须有尾气处理措施'
                ]
              }
            },
            {
              id: 'exp-c2s1-006', template: 'error-analysis',
              title: 'NH₃的干燥方法',
              params: {
                statement: '实验室制得的NH₃可用浓硫酸干燥后收集',
                errorOptions: [
                  'NH₃是碱性气体，不能用浓H₂SO₄干燥（二者反应）',
                  '浓H₂SO₄可以干燥NH₃',
                  'NH₃用排水法收集',
                  'NH₃用向上排空气法收集'
                ],
                errorCorrectIndex: 0,
                principleKeyTerms: ['碱性气体', '酸性干燥剂', '浓H₂SO₄', '碱石灰'],
                principleHint: '干燥剂选择：酸性干燥剂不能干燥碱性气体',
                correctVersion: 'NH₃用碱石灰干燥（不能用浓H₂SO₄，也不能用CaCl₂——CaCl₂与NH₃生成CaCl₂·8NH₃）',
                finalHint: '碱性气体用碱性干燥剂，酸性气体用酸性干燥剂，中性气体用中性干燥剂',
                reasoning: [
                  'NH₃是碱性气体，浓H₂SO₄是酸性干燥剂',
                  'NH₃+H₂SO₄→(NH₄)₂SO₄，两者发生反应',
                  '干燥NH₃应用碱石灰（碱性干燥剂）',
                  'CaCl₂也不能干燥NH₃（生成CaCl₂·8NH₃）'
                ]
              }
            },
            {
              id: 'exp-c2s1-007', template: 'concept-construction',
              title: '排空气集气法',
              params: {
                cases: [
                  'Cl₂（Mr=71）的收集',
                  'H₂（Mr=2）的收集',
                  'CO（Mr=28）的收集'
                ],
                caseOptions: [
                  '密度大于空气用向上排空气法',
                  '密度小于空气用向下排空气法',
                  '密度接近空气不宜用排空气法'
                ],
                caseCorrectIndices: [1],
                caseCommonality: '气体密度与空气密度（Mr≈29）的比较决定排空气法方向',
                conceptName: '排空气集气法的选择原则',
                definitionKeyTerms: ['Mr>29', '向上排空气法', 'Mr<29', '向下排空气法'],
                definitionHint: '以空气平均Mr=29为界',
                fullDefinition: '气体密度大于空气（Mr>29）用向上排空气法，密度小于空气（Mr<29）用向下排空气法，密度与空气接近（Mr≈29）的不宜用排空气法',
                boundaryItems: [
                  'O₂（Mr=32）用向上排空气法',
                  'H₂（Mr=2）用向下排空气法',
                  'NH₃（Mr=17）用向下排空气法',
                  'NO（Mr=30）用向上排空气法（实际NO遇O₂反应，只能用排水法）'
                ],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么Mr接近29的气体不宜用排空气法？',
                explainHint: '考虑气体扩散',
                explainKeyTerms: ['扩散', '纯度', '空气混合'],
                reasoning: [
                  '气体密度与空气越接近，扩散混合越快',
                  '排空气法收集到的气体纯度低、混有大量空气',
                  'CO（Mr=28）与空气密度几乎相同，不能用排空气法',
                  'NO虽Mr=30但遇O₂立即反应，只能用排水法'
                ]
              }
            },
            {
              id: 'exp-c2s1-008', template: 'concept-construction',
              title: '干燥剂的选择原则',
              params: {
                cases: [
                  '浓H₂SO₄干燥CO₂',
                  '碱石灰干燥NH₃',
                  '浓H₂SO₄干燥NH₃'
                ],
                caseOptions: [
                  '酸性干燥剂不能干燥碱性气体',
                  '所有干燥剂都能干燥所有气体',
                  '干燥剂选择与气体酸碱性无关'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '干燥剂不能与待干燥气体发生化学反应',
                conceptName: '干燥剂的选择原则',
                definitionKeyTerms: ['酸性干燥剂', '碱性干燥剂', '中性干燥剂', '酸性气体', '碱性气体'],
                definitionHint: '酸碱性匹配原则',
                fullDefinition: '酸性干燥剂（浓H₂SO₄、P₂O₅）能干燥酸性或中性气体，不能干燥碱性气体（NH₃等）；碱性干燥剂（碱石灰）能干燥碱性或中性气体，不能干燥酸性气体（CO₂、SO₂、Cl₂等）',
                boundaryItems: [
                  '浓H₂SO₄干燥NH₃（错误——发生反应）',
                  '碱石灰干燥CO₂（错误——发生反应）',
                  'CaCl₂干燥Cl₂（正确——不反应）',
                  'P₂O₅干燥HCl（正确——不反应）'
                ],
                boundaryCorrectIndices: [2, 3],
                explainPrompt: '为什么浓H₂SO₄不能干燥NH₃？',
                explainHint: '考虑两者反应',
                explainKeyTerms: ['酸碱性反应', 'NH₃+H₂SO₄'],
                reasoning: [
                  '浓H₂SO₄是酸性干燥剂，NH₃是碱性气体',
                  '2NH₃+H₂SO₄→(NH₄)₂SO₄，两者发生中和反应',
                  '碱性气体只能用碱性或中性干燥剂',
                  'CaCl₂虽为中性，但不能干燥NH₃（生成CaCl₂·8NH₃）'
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'exp-ch3',
      title: '第三章 分离提纯',
      sections: [
        {
          id: 'exp-ch3-sec1',
          title: '第一节 混合物的分离与提纯',
          exercises: [
            {
              id: 'exp-c3s1-001', template: 'experimental-reasoning',
              title: '蒸馏操作的正确步骤',
              params: {
                goal: '蒸馏操作的要点',
                principleOptions: [
                  '利用液体混合物中各组分沸点不同进行分离',
                  '利用固体颗粒大小不同进行分离',
                  '利用密度差异进行分离'
                ],
                principleCorrectIndex: 0,
                keyStepItems: [
                  '加碎瓷片（沸石）防暴沸',
                  '温度计水银球放在支管口处',
                  '冷凝水下进上出',
                  '先通冷凝水后加热'
                ],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: [
                  '加碎瓷片',
                  '装温度计',
                  '通冷凝水',
                  '加热蒸馏'
                ],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先防暴沸，再通冷凝水，最后加热',
                consequenceOptions: [
                  '若忘记加碎瓷片应冷却后补加，不可直接加入热溶液',
                  '忘记加碎瓷片立即加入会停止暴沸',
                  '碎瓷片可有可无'
                ],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果蒸馏时忘记加碎瓷片怎么办？',
                reasoning: [
                  '碎瓷片提供汽化中心，使液体平稳沸腾防止暴沸',
                  '冷凝水下进上出可使冷凝管充满水且水流方向与蒸汽方向相反，提高冷凝效率',
                  '温度计水银球在支管口处测量的是蒸汽温度而非液体温度',
                  '先停止加热再停止通冷凝水，防止冷凝管过热损坏'
                ]
              }
            },
            {
              id: 'exp-c3s1-002', template: 'error-analysis',
              title: '分液操作',
              params: {
                statement: '分液时，上下两层液体均从分液漏斗下端放出',
                errorOptions: [
                  '上层液体应从分液漏斗上口倒出，不是从下端放出',
                  '上下液体都从下端放是正确的',
                  '分液漏斗不能分离液体',
                  '上层液体从下端放也是正确的'
                ],
                errorCorrectIndex: 0,
                principleKeyTerms: ['下层液体', '下端放出', '上层液体', '上口倒出'],
                principleHint: '哪层从哪出',
                correctVersion: '下层液体从下端放出，待下层流完后及时关闭旋塞，上层液体从上口倒出',
                finalHint: '分液漏斗使用前需要检漏，记住下层下走上走上',
                reasoning: [
                  '下层液体从下端放出经过旋塞流出',
                  '若上层液体也从下端放出，会沾有残留的下层液体而受污染',
                  '上层液体从上口倒出可避免下层液体残留的污染',
                  '分液前需检漏，确保旋塞和塞子不漏液'
                ]
              }
            },
            {
              id: 'exp-c3s1-003', template: 'concept-construction',
              title: '萃取与分液',
              params: {
                cases: [
                  '用CCl₄萃取碘水中的I₂',
                  '用苯萃取碘水中的I₂',
                  '用酒精萃取碘水中的I₂'
                ],
                caseOptions: [
                  '萃取剂与原溶剂不互溶',
                  '萃取剂与原溶剂互溶',
                  '萃取剂密度需大于水'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '萃取剂需与原溶剂互不相溶',
                conceptName: '萃取与分液',
                definitionKeyTerms: ['互不相溶', '溶解度', '分液漏斗', '萃取剂'],
                definitionHint: '萃取的三个条件',
                fullDefinition: '萃取是利用溶质在两种互不相溶的溶剂中溶解度不同进行分离的方法，分液用于分离互不相溶的液体。萃取剂需满足：与原溶剂不互溶、溶质在萃取剂中溶解度远大于在原溶剂中、萃取剂与溶质不反应',
                boundaryItems: [
                  '酒精可萃取碘水中的碘（错误，酒精与水互溶）',
                  'CCl₄萃取碘水，下层为紫色I₂的CCl₄溶液',
                  '苯萃取碘水，上层为紫色',
                  '汽油可萃取溴水中的Br₂'
                ],
                boundaryCorrectIndices: [1, 2, 3],
                explainPrompt: '为什么酒精不能用于萃取碘水中的碘？',
                explainHint: '考虑酒精与水的互溶性',
                explainKeyTerms: ['互溶', '分层', '萃取条件'],
                reasoning: [
                  '萃取的首要条件是萃取剂与原溶剂互不相溶，才能形成分层',
                  '酒精与水以任意比互溶，无法形成分层',
                  '没有分层就无法通过分液分离',
                  'CCl₄、苯、汽油都是非极性溶剂，与水不互溶，是合适的萃取剂'
                ]
              }
            },
            {
              id: 'exp-c3s1-004', template: 'comparison-reasoning',
              title: '蒸发结晶与降温结晶的对比',
              params: {
                conceptA: '蒸发结晶',
                conceptB: '降温结晶',
                description: '一种通过蒸发溶剂使溶质析出，另一种通过降温使溶质析出',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么降温结晶不能用于NaCl溶液？',
                excludeHint: '比较NaCl和KNO₃的溶解度曲线',
                excludeKeyTerms: ['溶解度', '温度影响', '曲线陡峭'],
                differenceOptions: [
                  '溶解度受温度影响小的用蒸发结晶（如NaCl），影响大的用降温结晶（如KNO₃）',
                  '蒸发结晶需降温，降温结晶需加热',
                  '两者原理相同',
                  '蒸发结晶用于KNO₃，降温结晶用于NaCl'
                ],
                differenceCorrectIndex: 0,
                scenarioPrompt: '从含有少量NaCl的KNO₃溶液中提纯KNO₃，应选择哪种方法？',
                scenarioOptions: [
                  '降温结晶（KNO₃溶解度受温度影响大，降温时大量析出，NaCl留在母液中）',
                  '蒸发结晶（将水全部蒸干）',
                  '直接过滤',
                  '蒸馏'
                ],
                scenarioCorrectIndex: 0,
                reasoning: [
                  'NaCl溶解度受温度影响很小（随温度升高略微增大）',
                  '蒸发溶剂使NaCl过饱和而结晶析出',
                  'KNO₃溶解度受温度影响很大（随温度升高急剧增大）',
                  '降温使KNO₃溶解度骤降而结晶析出，杂质留在母液中'
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'exp-ch4',
      title: '第四章 物质的检验',
      sections: [
        {
          id: 'exp-ch4-sec1',
          title: '第一节 常见离子的检验',
          exercises: [
            {
              id: 'exp-c4s1-001', template: 'concept-construction',
              title: 'Cl⁻的检验方法',
              params: {
                cases: [
                  'AgNO₃溶液滴入含Cl⁻的溶液中',
                  'AgNO₃溶液滴入含CO₃²⁻的溶液中',
                  'AgNO₃溶液滴入含SO₄²⁻的溶液中'
                ],
                caseOptions: [
                  'Ag⁺与阴离子生成沉淀，但需排除干扰离子',
                  '所有阴离子都能使AgNO₃产生白色沉淀',
                  'AgNO₃只能检验Cl⁻'
                ],
                caseCorrectIndices: [0],
                caseCommonality: 'AgNO₃检验卤离子需先排除干扰',
                conceptName: 'Cl⁻的检验方法',
                definitionKeyTerms: ['稀HNO₃', 'AgNO₃', '白色沉淀', 'AgCl', '酸化'],
                definitionHint: '为什么要先加稀HNO₃酸化',
                fullDefinition: '检验Cl⁻的方法：先加稀HNO₃酸化（排除CO₃²⁻、PO₄³⁻、SO₃²⁻等干扰），再加AgNO₃溶液，产生不溶于稀HNO₃的白色沉淀（AgCl），证明含Cl⁻',
                boundaryItems: [
                  '稀HNO₃酸化排除CO₃²⁻（产生CO₂气泡）',
                  'AgCl不溶于稀硝酸',
                  'Ag₂CO₃可溶于稀硝酸（产生气泡）',
                  '检验Cl⁻时可加稀H₂SO₄酸化'
                ],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么检验Cl⁻时一定要先加稀HNO₃酸化？',
                explainHint: '哪些离子会干扰Ag⁺沉淀？',
                explainKeyTerms: ['CO₃²⁻', 'PO₄³⁻', '干扰沉淀', '酸化分解'],
                reasoning: [
                  'CO₃²⁻+Ag⁺→Ag₂CO₃↓白色沉淀，干扰Cl⁻检验',
                  'Ag₂CO₃+2HNO₃→2AgNO₃+H₂O+CO₂↑溶于稀HNO₃',
                  'AgCl不溶于稀HNO₃，可通过酸化后沉淀是否溶解区分',
                  '不能用稀H₂SO₄酸化（引入SO₄²⁻与Ag⁺生成微溶Ag₂SO₄）'
                ]
              }
            },
            {
              id: 'exp-c4s1-002', template: 'experimental-reasoning',
              title: 'SO₄²⁻的检验操作顺序',
              params: {
                goal: 'SO₄²⁻的检验操作程序',
                principleOptions: [
                  'Ba²⁺与SO₄²⁻生成不溶于酸的白色BaSO₄沉淀',
                  'Ba²⁺与所有阴离子都生成沉淀',
                  '白色沉淀一定是BaSO₄'
                ],
                principleCorrectIndex: 0,
                keyStepItems: [
                  '取适量待测液于试管中',
                  '先加过量稀HCl酸化',
                  '无明显现象（排除CO₃²⁻、SO₃²⁻等干扰）',
                  '再加BaCl₂溶液',
                  '产生白色沉淀BaSO₄证明含SO₄²⁻'
                ],
                keyStepCorrectIndices: [0, 1, 2, 3, 4],
                orderItems: [
                  '取样',
                  '加稀HCl酸化',
                  '观察无现象',
                  '加BaCl₂溶液'
                ],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '取样→酸化→排除干扰→沉淀检验',
                consequenceOptions: [
                  '若先加BaCl₂再加HCl，可能将BaCO₃沉淀误判为BaSO₄',
                  '先加BaCl₂再加HCl不影响结果',
                  '酸化步骤可有可无'
                ],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果不先加HCl酸化直接加BaCl₂会怎样？',
                reasoning: [
                  '先加HCl酸化可排除CO₃²⁻（产生CO₂气泡）、SO₃²⁻（产生SO₂气体）、Ag⁺（生成AgCl）等干扰',
                  'BaSO₄白色沉淀不溶于稀盐酸',
                  '不能用稀HNO₃酸化（HNO₃可能将SO₃²⁻氧化为SO₄²⁻）',
                  '不能用稀H₂SO₄酸化（引入SO₄²⁻干扰检验）'
                ]
              }
            },
            {
              id: 'exp-c4s1-003', template: 'concept-construction',
              title: '常见阳离子的检验',
              params: {
                cases: [
                  'Fe³⁺遇KSCN变血红色',
                  'NH₄⁺与OH⁻加热产生使湿润红色石蕊试纸变蓝的气体',
                  'Cu²⁺溶液呈蓝色，加NaOH产生蓝色沉淀'
                ],
                caseOptions: [
                  '特征反应或特征现象可用于阳离子的鉴别',
                  '所有阳离子都需用焰色反应检验',
                  '所有阳离子都需用沉淀反应检验'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '利用特征反应或特征现象鉴别阳离子',
                conceptName: '常见阳离子的检验方法',
                definitionKeyTerms: ['Fe³⁺', 'KSCN', '血红色', 'NH₄⁺', 'NaOH', '湿润红色石蕊试纸'],
                definitionHint: 'Fe³⁺和NH₄⁺的鉴别手段',
                fullDefinition: 'Fe³⁺用KSCN溶液检验，现象为血红色（Fe³⁺+3SCN⁻→Fe(SCN)₃）；NH₄⁺用NaOH溶液加热检验，用湿润红色石蕊试纸检测产生的NH₃气体（变蓝）',
                boundaryItems: [
                  'Fe²⁺加KSCN无现象，再加氯水变红（被氧化为Fe³⁺）',
                  'K⁺的焰色反应为紫色（透过蓝色钴玻璃）',
                  'Na⁺的焰色反应为黄色',
                  '所有金属离子都有颜色'
                ],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么Fe²⁺不能直接用KSCN检验？',
                explainHint: 'KSCN检验的是哪种离子？',
                explainKeyTerms: ['Fe³⁺', 'Fe²⁺', 'SCN⁻', '络合反应'],
                reasoning: [
                  'KSCN与Fe³⁺反应生成血红色Fe(SCN)₃，是Fe³⁺的特征反应',
                  'Fe²⁺与SCN⁻不发生显色反应',
                  '检验Fe²⁺需先氧化为Fe³⁺（如加氯水）后再用KSCN检验',
                  'NH₄⁺检验利用碱性气体NH₃使红色石蕊试纸变蓝'
                ]
              }
            },
            {
              id: 'exp-c4s1-004', template: 'error-analysis',
              title: 'Fe²⁺与Fe³⁺的检验混淆',
              params: {
                statement: '某溶液中加入KSCN溶液变血红色，证明溶液中含Fe²⁺',
                errorOptions: [
                  'KSCN变血红色是Fe³⁺的特征反应，不能证明Fe²⁺',
                  'KSCN变血红色证明含Fe²⁺',
                  '变血红色说明不含铁离子',
                  'KSCN变血红色是Cu²⁺的特征'
                ],
                errorCorrectIndex: 0,
                principleKeyTerms: ['KSCN', 'Fe³⁺', '血红色', 'Fe²⁺', '氧化'],
                principleHint: 'KSCN检验的具体对象',
                correctVersion: 'Fe³⁺检验：加KSCN→血红色。Fe²⁺检验：加KSCN无现象→再加氯水→变血红色（Fe²⁺被氧化为Fe³⁺）',
                finalHint: 'Fe³⁺可直接用KSCN检出，Fe²⁺需先氧化再检出',
                reasoning: [
                  'KSCN与Fe³⁺反应生成血红色络合物Fe(SCN)₃',
                  'Fe²⁺与SCN⁻不反应，无颜色变化',
                  '检验Fe²⁺的正确方法：先加KSCN无现象→再加氯水（氧化）→变血红色',
                  '不能直接将KSCN变红作为Fe²⁺的证据'
                ]
              }
            },
            {
              id: 'exp-c4s1-005', template: 'concept-construction',
              title: 'I⁻的检验（氧化萃取法）',
              params: {
                cases: [
                  'Cl₂氧化I⁻生成I₂',
                  'Br₂氧化I⁻生成I₂',
                  'Fe³⁺氧化I⁻生成I₂'
                ],
                caseOptions: [
                  'I⁻被氧化剂氧化生成I₂，再用有机溶剂萃取观察颜色',
                  'I⁻直接与萃取剂反应显色',
                  'I⁻在水溶液中直接显紫色'
                ],
                caseCorrectIndices: [0],
                caseCommonality: 'I⁻先被氧化为I₂，再通过萃取显色',
                conceptName: 'I⁻的氧化萃取检验法',
                definitionKeyTerms: ['2I⁻', 'Cl₂', 'I₂', 'CCl₄', '紫色', '氧化还原'],
                definitionHint: '两步法：氧化→萃取',
                fullDefinition: '检验I⁻时先加氯水氧化（2I⁻+Cl₂→I₂+2Cl⁻），I₂再用CCl₄萃取，有机层（CCl₄层）呈紫色。CCl₄密度大于水，紫色在下层',
                boundaryItems: [
                  'Cl₂氧化I⁻是氧化还原反应',
                  'I₂在CCl₄中呈紫色',
                  'CCl₄密度大于水紫色在下层',
                  '苯萃取I₂紫色在上层'
                ],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么检验I⁻要用两步法（先氧化再萃取）？',
                explainHint: 'I⁻本身有没有颜色？',
                explainKeyTerms: ['I⁻无色', 'I₂紫色', '有机溶剂显色'],
                reasoning: [
                  'I⁻在水溶液中无色，无法直接观察',
                  '氧化为I₂后，I₂在有机溶剂中显色明显（紫色）',
                  'CCl₄与水不互溶，可萃取出I₂便于观察',
                  '卤素单质在有机溶剂中的颜色：Cl₂黄绿、Br₂橙红、I₂紫红'
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'exp-ch5',
      title: '第五章 定量实验',
      sections: [
        {
          id: 'exp-ch5-sec1',
          title: '第一节 中和滴定',
          exercises: [
            {
              id: 'exp-c5s1-001', template: 'experimental-reasoning',
              title: '中和滴定的操作步骤',
              params: {
                goal: '中和滴定的操作程序',
                principleOptions: [
                  '用已知浓度的标准液滴定未知浓度的待测液，通过指示剂变色判断终点',
                  '直接用待测液滴定标准液',
                  '通过pH试纸随时检测'
                ],
                principleCorrectIndex: 0,
                keyStepItems: [
                  '检漏并润洗滴定管（用待装液润洗2-3次）',
                  '装液、排气泡、调零读数',
                  '向锥形瓶中加入待测液和指示剂',
                  '滴定（左手控塞，右手摇瓶，眼观颜色变化）'
                ],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: [
                  '检漏润洗',
                  '装液排气泡',
                  '加待测液和指示剂',
                  '滴定至终点'
                ],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先准备滴定管，再加待测液，最后滴定',
                consequenceOptions: [
                  '锥形瓶用待测液润洗会使测定结果偏高',
                  '锥形瓶润洗不影响结果',
                  '滴定管不需要润洗'
                ],
                consequenceCorrectIndex: 0,
                consequencePrompt: '锥形瓶能否用待测液润洗？为什么？',
                reasoning: [
                  '滴定管必须用待装液润洗以防稀释标准液',
                  '锥形瓶不能润洗（润洗会使n(待测)偏大，造成结果偏高）',
                  '滴定过程：左手控制活塞/玻璃球，右手摇动锥形瓶',
                  '眼睛注视锥形瓶内颜色变化而非滴定管刻度'
                ]
              }
            },
            {
              id: 'exp-c5s1-002', template: 'concept-construction',
              title: '中和滴定误差分析',
              params: {
                cases: [
                  '未用标准液润洗滴定管',
                  '滴定管有气泡消失后读数',
                  '锥形瓶用待测液润洗',
                  '滴定终点俯视读数'
                ],
                caseOptions: [
                  '使V(标准)偏大或偏小，导致c(待测)偏高或偏低',
                  '所有操作误差对结果无影响',
                  '只有称量误差会影响结果'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '所有操作误差通过影响V(标准)来影响c(待测)',
                conceptName: '中和滴定误差分析',
                definitionKeyTerms: ['c(待测)', 'c(标准)×V(标准)/V(待测)', 'V(标准)偏大', 'V(标准)偏小'],
                definitionHint: '利用公式c(待测)=c(标准)×V(标准)/V(待测)分析',
                fullDefinition: '滴定误差分析的依据是c(待测)=c(标准)×V(标准)/V(待测)，分析V(标准)的偏大或偏小。V(标)偏大→c(待测)偏高，V(标)偏小→c(待测)偏低',
                boundaryItems: [
                  '锥形瓶中有蒸馏水不影响（n不变）→c(待测)无影响',
                  '滴定管尖嘴有气泡→V(标)偏小→c(待测)偏低',
                  '振荡时溶液溅出→n(待测)减小→V(标)偏小→c(待测)偏低',
                  '指示剂用量过多会引起误差'
                ],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么未用标准液润洗滴定管会导致c(待测)偏高？',
                explainHint: '润洗不充分会使标准液被稀释',
                explainKeyTerms: ['标准液稀释', 'V(标)偏大', '浓度计算'],
                reasoning: [
                  '未用标准液润洗，滴定管内壁残留水分稀释标准液',
                  '为达到终点需要消耗更多标准液，V(标)记录偏大',
                  'c(待测)=c(标准)×V(标准)/V(待测)，V(标)偏大→c(待测)偏高',
                  '同理，锥形瓶中有蒸馏水不影响n(待测)，故无影响'
                ]
              }
            },
            {
              id: 'exp-c5s1-003', template: 'error-analysis',
              title: '滴定管读数误差',
              params: {
                statement: '中和滴定终点时俯视滴定管读数，读数为25.00mL，实际消耗标准液体积大于25.00mL',
                errorOptions: [
                  '俯视读数偏小，实际体积大于读数，描述正确',
                  '俯视读数偏大',
                  '俯视读数无影响',
                  '实际体积小于读数'
                ],
                errorCorrectIndex: 0,
                principleKeyTerms: ['俯视', '读数偏小', '滴定管0刻度在上', '视线偏高'],
                principleHint: '滴定管的刻度方向',
                correctVersion: '俯视滴定管读数：视线偏高→读数偏小→V(标)记录偏小→c(待测)计算值偏低',
                finalHint: '滴定管0刻度在上，读数从上到下增大，俯视看到的是偏上的刻度（数值偏小）',
                reasoning: [
                  '滴定管0刻度在上方，刻度值从上到下增大',
                  '俯视时视线偏高，看到的刻度线位置偏上（数值偏小）',
                  '读数偏小意味着记录的V(标)小于实际消耗体积',
                  'c(待测)=c(标准)×V(标准)/V(待测)，V(标)记录偏小→c(待测)偏低'
                ]
              }
            },
            {
              id: 'exp-c5s1-004', template: 'comparison-reasoning',
              title: '酸式滴定管与碱式滴定管的对比',
              params: {
                conceptA: '酸式滴定管',
                conceptB: '碱式滴定管',
                description: '一种滴定管用玻璃旋塞控制流速，另一种用橡胶管和玻璃球控制',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么氧化性溶液（如KMnO₄）不能用碱式滴定管？',
                excludeHint: '考虑橡胶的耐腐蚀性',
                excludeKeyTerms: ['橡胶管', '氧化性', '腐蚀'],
                differenceOptions: [
                  '酸式滴定管用玻璃旋塞（耐酸和氧化剂腐蚀），碱式滴定管用橡胶管（耐碱腐蚀，但强氧化剂会腐蚀橡胶）',
                  '酸式滴定管只能装碱，碱式滴定管只能装酸',
                  '两者完全一样',
                  '酸式滴定管用于装碱性溶液'
                ],
                differenceCorrectIndex: 0,
                scenarioPrompt: '使用碱式滴定管装KMnO₄溶液会怎样？',
                scenarioOptions: [
                  'KMnO₄有强氧化性，会腐蚀碱式滴定管的橡胶管',
                  'KMnO₄可以正常使用',
                  '碱式滴定管比酸式更适合KMnO₄',
                  'KMnO₄会腐蚀玻璃旋塞'
                ],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '酸式滴定管玻璃旋塞耐酸和强氧化剂腐蚀',
                  '碱式滴定管橡胶管不耐强氧化剂（会腐蚀老化）',
                  '碱性溶液会腐蚀玻璃旋塞（生成Na₂SiO₃粘连），必须用碱式滴定管',
                  '选择滴定管时既要考虑酸碱性也要考虑氧化性'
                ]
              }
            }
          ]
        },
        {
          id: 'exp-ch5-sec2',
          title: '第二节 溶液配制',
          exercises: [
            {
              id: 'exp-c5s2-001', template: 'experimental-reasoning',
              title: '一定物质的量浓度溶液的配制',
              params: {
                goal: '一定物质的量浓度溶液的配制步骤',
                principleOptions: [
                  '准确称取/量取溶质，在容量瓶中定容至精确体积',
                  '用量筒粗略配制',
                  '在烧杯中粗略配制即可'
                ],
                principleCorrectIndex: 0,
                keyStepItems: [
                  '计算所需溶质的质量或体积',
                  '称量或量取',
                  '在烧杯中溶解/稀释并冷却至室温',
                  '转移至容量瓶（玻璃棒引流）',
                  '洗涤烧杯和玻璃棒2-3次',
                  '定容、摇匀、装瓶贴标签'
                ],
                keyStepCorrectIndices: [0, 1, 2, 3, 4, 5],
                orderItems: [
                  '计算所需溶质',
                  '称量或量取',
                  '溶解并冷却',
                  '转移至容量瓶',
                  '洗涤烧杯和玻璃棒',
                  '定容摇匀'
                ],
                orderCorrect: [0, 1, 2, 3, 4, 5],
                orderHint: '计算→称量→溶解冷却→转移→洗涤→定容',
                consequenceOptions: [
                  '溶解后未冷却至室温就转移，冷却后V偏小，c偏高',
                  '未冷却转移无影响',
                  '热溶液定容更准确'
                ],
                consequenceCorrectIndex: 0,
                consequencePrompt: '为什么溶解后必须冷却至室温才能转移至容量瓶？',
                reasoning: [
                  '容量瓶在20°C校准，热溶液体积偏大',
                  '冷却后体积缩小，导致实际液面低于刻度线，V偏小',
                  'c=n/V，V偏小使c偏高',
                  '洗涤烧杯和玻璃棒是为了将所有溶质全部转移至容量瓶'
                ]
              }
            },
            {
              id: 'exp-c5s2-002', template: 'concept-construction',
              title: '配制溶液的误差分析',
              params: {
                cases: [
                  '称量时左码右物（使用游码）',
                  '溶解时未冷却至室温就转移',
                  '未洗涤烧杯和玻璃棒',
                  '定容时仰视刻度线'
                ],
                caseOptions: [
                  '使n偏小或V偏大，导致c偏低',
                  '使n偏大或V偏小，导致c偏高',
                  '所有操作都不影响结果'
                ],
                caseCorrectIndices: [0, 1],
                caseCommonality: 'c=n/V，任何使n偏小或V偏大的操作使c偏低；使n偏大或V偏小的操作使c偏高',
                conceptName: '配制溶液的误差分析',
                definitionKeyTerms: ['c=n/V', 'n偏小', 'V偏大', 'c偏低', 'V偏小', 'c偏高'],
                definitionHint: '从c=n/V公式出发，分析n和V的变化',
                fullDefinition: 'c=n/V，称量偏小或溶质损失使n偏小→c偏低；定容偏大使V偏大→c偏低；反之n偏大或V偏小使c偏高',
                boundaryItems: [
                  '定容时俯视刻度线→V偏小→c偏高',
                  '摇匀后发现液面低于刻度线再加水→V偏大→c偏低',
                  '容量瓶中有少量蒸馏水不影响结果',
                  '转移时溶液溅出→n偏小→c偏低'
                ],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么摇匀后发现液面低于刻度线不能再加水？',
                explainHint: '考虑溶液是否均匀',
                explainKeyTerms: ['摇匀', '液面下降', '挂壁', '再加水稀释'],
                reasoning: [
                  '摇匀后液面低于刻度线是因为溶液挂壁附着在容量瓶刻度线上方',
                  '此时溶液浓度已经准确，再加水会使V偏大，c偏低',
                  '容量瓶中有少量蒸馏水不影响n和最终V，所以无影响',
                  '俯视定容时实际液面低于刻度线，V偏小，c偏高'
                ]
              }
            }
          ]
        }
      ]
    },

    {
      id: 'exp-ch6',
      title: '第六章 试剂保存与仪器',
      sections: [
        {
          id: 'exp-ch6-sec1',
          title: '第一节 试剂的保存方法',
          exercises: [
            {
              id: 'exp-c6s1-001', template: 'concept-construction',
              title: '常见试剂的保存方法',
              params: {
                cases: [
                  'NaOH溶液保存在细口玻璃瓶中',
                  '浓HNO₃保存在棕色瓶中',
                  '氢氟酸保存在塑料瓶中'
                ],
                caseOptions: [
                  '试剂保存需考虑与容器的反应及光稳定性',
                  '所有试剂都用玻璃瓶保存',
                  '所有试剂都用棕色瓶保存'
                ],
                caseCorrectIndices: [0],
                caseCommonality: '试剂的化学性质决定保存容器的材质和颜色',
                conceptName: '常见试剂的保存方法',
                definitionKeyTerms: ['橡胶塞', '玻璃塞', '棕色瓶', '塑料瓶', '煤油', '水封'],
                definitionHint: '碱、光敏、腐蚀性、遇水反应四类',
                fullDefinition: 'NaOH溶液用橡胶塞（不用玻璃塞——SiO₂+2NaOH→Na₂SiO₃粘连）；浓HNO₃见光分解用棕色瓶；氢氟酸腐蚀玻璃用塑料瓶；金属钠保存在煤油中；白磷保存在水中',
                boundaryItems: [
                  '金属钠保存在煤油中（密度大于煤油）',
                  '白磷保存在水中（隔绝空气）',
                  '浓H₂SO₄用玻璃塞（浓H₂SO₄不腐蚀玻璃）',
                  '溴用水液封保存（减少挥发）'
                ],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么NaOH溶液不能用玻璃塞？',
                explainHint: '玻璃的主要成分是什么？',
                explainKeyTerms: ['SiO₂', 'Na₂SiO₃', '粘连'],
                reasoning: [
                  '玻璃中含有SiO₂，NaOH与SiO₂反应：SiO₂+2NaOH→Na₂SiO₃+H₂O',
                  'Na₂SiO₃有黏性，会使玻璃瓶塞与瓶口粘连无法打开',
                  '因此碱性溶液应使用橡胶塞或软木塞',
                  '浓HNO₃见光分解，用棕色瓶可阻隔光线延缓分解'
                ]
              }
            },
            {
              id: 'exp-c6s1-002', template: 'error-analysis',
              title: 'NaOH溶液的保存',
              params: {
                statement: 'NaOH溶液应装在配有玻璃塞的细口玻璃瓶中',
                errorOptions: [
                  'NaOH溶液应用橡胶塞（与玻璃反应粘连）',
                  '答案正确',
                  'NaOH溶液应用塑料瓶',
                  'NaOH溶液不能装在细口瓶中'
                ],
                errorCorrectIndex: 0,
                principleKeyTerms: ['SiO₂', 'NaOH', 'Na₂SiO₃', '橡胶塞'],
                principleHint: 'NaOH与玻璃塞发生的化学反应',
                correctVersion: 'NaOH溶液用细口玻璃瓶盛装，配橡胶塞（或软木塞），不用玻璃塞',
                finalHint: 'SiO₂+2NaOH→Na₂SiO₃+H₂O，碱性溶液不能用玻璃塞',
                reasoning: [
                  'NaOH与玻璃中的SiO₂反应生成Na₂SiO₃',
                  'Na₂SiO₃有黏性，会使玻璃塞粘连在瓶口上',
                  '橡胶塞不受碱液腐蚀，可以正常使用',
                  '细口瓶盛装溶液是正确的，问题出在瓶塞材质'
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
