const 必修第二册 = {
  textbook: '必修第二册',
  chapters: [
    {
      id: 'b2-ch5',
      title: '第五章 化工生产中的重要非金属元素',
      sections: [
        {
          id: 'b2-ch5-sec1',
          title: '第一节 硫及其化合物',
          exercises: [
            {
              id: 'b2c5s1-001',
              template: 'redox-reasoning',
              title: '二氧化硫与硫化氢反应',
              params: {
                substances: [
                  { key: 'sub1', formula: 'SO₂', valences: { S: 4, O: -2 } },
                  { key: 'sub2', formula: 'H₂S', valences: { H: 1, S: -2 } }
                ],
                identifyOptions: ['SO₂是氧化剂，H₂S是还原剂', 'SO₂是还原剂，H₂S是氧化剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，判断氧化剂和还原剂',
                finalEquation: 'SO₂ + 2H₂S → 3S↓ + 2H₂O',
                finalHint: '注意单质S既是氧化产物又是还原产物',
                reasoning: [
                  'SO₂中S为+4价→降价到0价，得电子→氧化剂。H₂S中S为-2价→升价到0价，失电子→还原剂',
                  'S从+4价降到0价得4e⁻，S从-2价升到0价失2e⁻，最小公倍数为4→SO₂配1，H₂S配2',
                  '完整的配平：SO₂ + 2H₂S → 3S↓ + 2H₂O，S既是氧化产物又是还原产物'
                ]
              }
            },
            {
              id: 'b2c5s1-002',
              template: 'redox-reasoning',
              title: '二氧化硫催化氧化',
              params: {
                substances: [
                  { key: 'sub1', formula: 'SO₂', valences: { S: 4, O: -2 } },
                  { key: 'sub2', formula: 'O₂', valences: { O: 0 } }
                ],
                identifyOptions: ['SO₂是还原剂，O₂是氧化剂', 'SO₂是氧化剂，O₂是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，判断氧化剂和还原剂',
                finalEquation: '2SO₂ + O₂ ═ 2SO₃',
                finalHint: '该反应使用V₂O₅作催化剂，反应条件为加热',
                reasoning: [
                  'SO₂中S为+4价→升价到+6价，失电子→还原剂。O₂中O为0价→降价到-2价，得电子→氧化剂',
                  'S从+4价升到+6价失2e⁻，O从0价降到-2价得2e⁻×2，最小公倍数为4→SO₂配2，O₂配1',
                  '完整的配平：2SO₂ + O₂ ═ 2SO₃，该反应是工业制硫酸的核心反应'
                ]
              }
            },
            {
              id: 'b2c5s1-003',
              template: 'error-analysis',
              title: '浓硫酸与铜反应中的常见错误',
              params: {
                statement: '铜与浓硫酸在加热条件下反应，产物为硫酸铜、二氧化硫和水。该反应中浓硫酸仅表现酸性，因为硫酸中的硫元素化合价没有变化。',
                errorOptions: ['"产物为硫酸铜、二氧化硫和水"', '"浓硫酸仅表现酸性"', '"硫酸中的硫元素化合价没有变化"', '"铜与浓硫酸在加热条件下反应"'],
                errorCorrectIndex: 1,
                principleKeyTerms: ['酸性', '强氧化性', '化合价'],
                principleHint: '浓硫酸与铜反应时同时体现了哪两种性质？',
                correctVersion: '铜与浓硫酸在加热条件下反应，产物为硫酸铜、二氧化硫和水。该反应中浓硫酸既表现酸性（生成CuSO₄）又表现强氧化性（生成SO₂），硫酸中的硫元素从+6价降至+4价。',
                finalHint: '浓硫酸具有三大特性：吸水性、脱水性和强氧化性。在与金属反应时，浓硫酸通常同时体现酸性和强氧化性。',
                reasoning: [
                  '错误在"浓硫酸仅表现酸性"——该反应中浓硫酸既表现酸性（生成CuSO₄）又表现强氧化性（生成SO₂），S从+6价降至+4价',
                  '浓硫酸中S为+6价，Cu从0价升到+2价，S从+6价降到+4价，电子转移Cu→H₂SO₄',
                  '正确的完整表述：浓硫酸既表现酸性（生成CuSO₄中SO₄²⁻）又表现强氧化性（生成SO₂），硫酸中S从+6价降至+4价'
                ]
              }
            },
            {
              id: 'b2c5s1-004',
              template: 'comparison-reasoning',
              title: 'SO₂漂白与Cl₂漂白的比较',
              params: {
                conceptA: 'SO₂漂白',
                conceptB: 'Cl₂漂白',
                description: '某气体能使品红溶液褪色，加热后红色恢复。该气体的漂白原理是什么？',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么它不可能是Cl₂漂白？',
                excludeHint: 'Cl₂漂白后的品红加热后能否恢复？',
                excludeKeyTerms: ['可逆', '加热恢复', '氧化漂白', '不可逆'],
                differenceOptions: ['SO₂漂白可逆而Cl₂漂白不可逆', 'SO₂漂白效果比Cl₂好', 'Cl₂漂白成本比SO₂低', 'SO₂漂白属于物理变化'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '将SO₂和Cl₂分别通入品红溶液，再分别加热褪色后的溶液，会发生什么现象？',
                scenarioOptions: ['SO₂褪色后加热恢复红色，Cl₂褪色后加热不恢复', '两者加热后都恢复红色', '两者加热后都不恢复', 'Cl₂褪色后加热恢复红色，SO₂褪色后加热不恢复'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  'SO₂漂白是化合漂白（可逆），与有色物质化合生成无色物质，加热分解恢复颜色',
                  'Cl₂漂白是氧化漂白（不可逆），HClO将有色物质氧化为无色物质，加热不能恢复',
                  'SO₂使品红褪色后加热恢复红色，Cl₂使品红褪色后加热不恢复，这是鉴别两者的重要方法'
                ]
              }
            },
            {
              id: 'b2c5s1-005',
              template: 'concept-construction',
              title: '浓硫酸的三大特性',
              params: {
                cases: ['浓硫酸可以做某些气体的干燥剂', '浓硫酸使蔗糖变黑（炭化）', '浓硫酸与铜在加热下反应生成SO₂'],
                caseOptions: ['吸水性', '脱水性', '强氧化性'],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '浓硫酸的三大特性',
                conceptName: '浓硫酸的吸水性、脱水性和强氧化性',
                definitionKeyTerms: ['吸水', '脱水', '强氧化'],
                definitionHint: '吸水性是物理变化，脱水性是化学变化，强氧化性体现在S元素化合价降低',
                fullDefinition: '浓硫酸具有吸水性（做干燥剂，物理变化）、脱水性（使有机物中的H、O按2:1比例脱去，化学变化）和强氧化性（与金属/非金属反应，S从+6价降低）。',
                boundaryItems: ['浓硫酸使蓝色胆矾变白体现脱水性', '浓硫酸使蔗糖炭化体现脱水性', '浓硫酸吸水属于化学变化', '浓硫酸与铜反应体现强氧化性和酸性'],
                boundaryCorrectIndices: [1, 3],
                explainPrompt: '为什么浓硫酸使胆矾变白是脱水性还是吸水性？',
                explainHint: '胆矾CuSO₄·5H₂O是结晶水合物，失水属于化学变化',
                explainKeyTerms: ['结晶水', '化学变化', '吸水', '脱水'],
                reasoning: [
                  '浓硫酸具有三大特性：吸水性（物理变化，如做干燥剂）、脱水性（化学变化，如使蔗糖炭化）、强氧化性（化学变化，S元素化合价降低）',
                  '吸水性吸水分子，脱水性脱氢氧元素——胆矾CuSO₄·5H₂O失去结晶水属于化学变化，是脱水而非吸水',
                  '浓硫酸与铜需加热才反应，体现强氧化性；与铁在常温下钝化，也体现强氧化性'
                ]
              }
            },
            {
              id: 'b2c5s1-006',
              template: 'experimental-reasoning',
              title: 'SO₄²⁻检验操作步骤',
              params: {
                goal: '检验溶液中是否存在SO₄²⁻',
                principleOptions: ['BaSO₄是白色沉淀且不溶于稀盐酸', 'Ag₂SO₄微溶于水', 'BaCO₃也是白色沉淀', 'BaSO₄溶于稀盐酸'],
                principleCorrectIndex: 0,
                keyStepItems: ['取少量待测液于试管中', '加入过量稀盐酸酸化', '滴加BaCl₂溶液', '观察是否有白色沉淀生成'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['取少量待测液于试管中', '加入过量稀盐酸酸化', '滴加BaCl₂溶液', '观察是否有白色沉淀生成'],
                orderPrompt: '按正确顺序排列SO₄²⁻检验步骤',
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先加盐酸酸化排除干扰，再加BaCl₂检验',
                consequenceOptions: ['无法排除CO₃²⁻、SO₃²⁻等干扰，可能观察到白色沉淀造成误判', '无法得到白色沉淀', '反应过于剧烈', '溶液变色无法观察'],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果先加BaCl₂后加盐酸会有什么后果？',
                reasoning: [
                  '先取少量待测液，再加入过量稀盐酸酸化（排除CO₃²⁻、SO₃²⁻、PO₄³⁻等干扰离子）',
                  '然后滴加BaCl₂溶液，若产生白色沉淀说明有SO₄²⁻（BaSO₄不溶于稀盐酸）',
                  '若先加BaCl₂后加盐酸，Ag⁺、CO₃²⁻等都能产生白色沉淀，干扰检验'
                ]
              }
            }
          ]
        },
        {
          id: 'b2-ch5-sec2',
          title: '第二节 氮及其化合物',
          exercises: [
            {
              id: 'b2c5s2-001',
              template: 'redox-reasoning',
              title: '氨的催化氧化',
              params: {
                substances: [
                  { key: 'sub1', formula: 'NH₃', valences: { N: -3, H: 1 } },
                  { key: 'sub2', formula: 'O₂', valences: { O: 0 } }
                ],
                identifyOptions: ['NH₃是还原剂，O₂是氧化剂', 'NH₃是氧化剂，O₂是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，判断氧化剂和还原剂',
                finalEquation: '4NH₃ + 5O₂ ═ 4NO + 6H₂O',
                finalHint: '该反应使用铂铑合金作催化剂，需高温条件',
                reasoning: [
                  'NH₃中N为-3价→升价到NO中+2价，失电子→还原剂。O₂中O为0价→降价到-2价，得电子→氧化剂',
                  'N从-3价升到+2价失5e⁻×4=20e⁻，O从0价降到-2价得2e⁻×5×2=20e⁻，配平为4NH₃+5O₂',
                  '完整的配平：4NH₃ + 5O₂ ═ 4NO + 6H₂O，这是工业制硝酸的第一步'
                ]
              }
            },
            {
              id: 'b2c5s2-002',
              template: 'redox-reasoning',
              title: '二氧化氮与水反应',
              params: {
                substances: [
                  { key: 'sub1', formula: 'NO₂', valences: { N: 4, O: -2 } },
                  { key: 'sub2', formula: 'H₂O', valences: { H: 1, O: -2 } }
                ],
                identifyOptions: ['NO₂既是氧化剂又是还原剂（歧化反应）', 'NO₂是氧化剂，H₂O是还原剂', 'NO₂是还原剂，H₂O是氧化剂', '两者都不是氧化还原反应'],
                identifyCorrectIndex: 0,
                identifyPrompt: '分析NO₂中N元素的化合价变化，判断反应类型',
                finalEquation: '3NO₂ + H₂O → 2HNO₃ + NO',
                finalHint: '歧化反应中同一元素既升高又降低',
                reasoning: [
                  'NO₂中N为+4价，一部分升到HNO₃中+5价（失电子→还原剂），一部分降到NO中+2价（得电子→氧化剂）',
                  '升价失1e⁻，降价得2e⁻，最小公倍数为2→升价N配2，降价N配1，即3NO₂→2HNO₃+NO',
                  '完整的配平：3NO₂ + H₂O → 2HNO₃ + NO，每3个NO₂转移2个电子'
                ]
              }
            },
            {
              id: 'b2c5s2-003',
              template: 'error-analysis',
              title: '硝酸性质辨析',
              params: {
                statement: '硝酸是一种强酸，具有强氧化性。浓硝酸与铜反应生成NO₂，稀硝酸与铜反应生成NO，因此稀硝酸的氧化性强于浓硝酸。',
                errorOptions: ['"硝酸是一种强酸"', '"浓硝酸与铜反应生成NO₂"', '"稀硝酸的氧化性强于浓硝酸"', '"稀硝酸与铜反应生成NO"'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['氧化性', '反应条件', '剧烈程度'],
                principleHint: '氧化性强弱应看反应条件（是否加热）和反应剧烈程度，而非还原产物中N的化合价',
                correctVersion: '硝酸是一种强酸，具有强氧化性。浓硝酸与铜反应生成NO₂，稀硝酸与铜反应生成NO。浓硝酸的氧化性强于稀硝酸。',
                finalHint: '氧化性强弱比较应看反应条件（是否加热、反应剧烈程度），而非还原产物中元素化合价的高低。浓硝酸与铜反应无需加热即可发生。',
                reasoning: [
                  '错误在"稀硝酸的氧化性强于浓硝酸"——浓硝酸浓度更高，氧化性更强',
                  '浓硝酸中N从+5价降到+4价（降1价），稀硝酸中N从+5价降到+2价（降3价），但价态变化不能直接比较氧化性强弱',
                  '浓硝酸与铜反应无需加热即可发生，稀硝酸需要加热，说明浓硝酸氧化性更强'
                ]
              }
            },
            {
              id: 'b2c5s2-004',
              template: 'concept-construction',
              title: '氨气的性质',
              params: {
                cases: ['氨气能使湿润的红色石蕊试纸变蓝', '氨气与HCl气体相遇产生白烟（NH₄Cl）', '氨气可被催化氧化为NO'],
                caseOptions: ['碱性', '还原性', '挥发性'],
                caseCorrectIndices: [0, 0, 1],
                caseCommonality: '氨气的物理和化学性质',
                conceptName: '氨气（NH₃）',
                definitionKeyTerms: ['无色', '刺激性', '小', '极易', '易'],
                definitionHint: '氨气的密度比空气小，极易溶于水，易液化',
                fullDefinition: '氨气是无色有刺激性气味的气体，密度比空气小，极易溶于水（1:700），易液化（液氨作制冷剂），水溶液呈弱碱性。',
                boundaryItems: ['液氨常用作制冷剂（利用氨易液化、汽化吸热）', '氨水的成分只有NH₃和H₂O', 'NH₃·H₂O在水溶液中完全电离为NH₄⁺和OH⁻', '氨的催化氧化产物为NO和H₂O'],
                boundaryCorrectIndices: [0, 3],
                explainPrompt: '为什么氨能使湿润的红色石蕊试纸变蓝？',
                explainHint: '氨气溶于水后溶液呈什么性？',
                explainKeyTerms: ['氨水', '弱碱', 'OH⁻'],
                reasoning: [
                  '氨气是无色有刺激性气味的气体，密度比空气小（用向下排空气法收集），极易溶于水（1:700）',
                  '氨气与水反应生成NH₃·H₂O，电离出OH⁻使溶液呈弱碱性，能使湿润红色石蕊试纸变蓝',
                  '氨气具有还原性（N为-3价，可被氧化），催化氧化生成NO，也是工业制硝酸的基础'
                ]
              }
            },
            {
              id: 'b2c5s2-005',
              template: 'comparison-reasoning',
              title: 'NO与NO₂性质比较',
              params: {
                conceptA: '一氧化氮（NO）',
                conceptB: '二氧化氮（NO₂）',
                description: '某气体为无色气体，不溶于水，与氧气接触后变为红棕色气体。该气体是什么？',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么它不可能是NO₂？',
                excludeHint: 'NO₂的颜色和溶解性如何？',
                excludeKeyTerms: ['无色', '红棕色', '不溶于水', '易溶于水'],
                differenceOptions: ['NO无色不溶于水，NO₂红棕色易溶于水', 'NO有毒而NO₂无毒', 'NO₂不溶于水，NO溶于水', 'NO和NO₂性质完全相同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '将盛有NO₂的试管倒扣在水中，观察到的现象是什么？',
                scenarioOptions: ['试管内液面上升，气体变为无色', '试管内液面下降，气体变为无色', '试管内液面不变化，气体仍为红棕色', '试管内液体变蓝'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  'NO是无色气体，不溶于水，有毒，能与O₂反应生成NO₂（2NO+O₂=2NO₂）',
                  'NO₂是红棕色气体，易溶于水，有刺激性气味，与水反应生成HNO₃和NO（3NO₂+H₂O=2HNO₃+NO）',
                  'NO₂与水反应后气体体积减小（3→1），且红棕色变为无色（NO₂→NO），故液面上升'
                ]
              }
            },
            {
              id: 'b2c5s2-006',
              template: 'experimental-reasoning',
              title: '氨气的实验室制备',
              params: {
                goal: '实验室制备氨气（NH₃）',
                principleOptions: ['2NH₄Cl + Ca(OH)₂ ═ CaCl₂ + 2NH₃↑ + 2H₂O', 'NH₄Cl ═ NH₃↑ + HCl↑', 'NH₄HCO₃ ═ NH₃↑ + CO₂↑ + H₂O', 'N₂ + 3H₂ ⇌ 2NH₃'],
                principleCorrectIndex: 0,
                keyStepItems: ['混合NH₄Cl和Ca(OH)₂固体于试管中加热', '用碱石灰干燥氨气', '用向下排空气法收集氨气', '用红色石蕊试纸放在试管口验满'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['混合NH₄Cl和Ca(OH)₂固体于试管中加热', '用碱石灰干燥氨气', '用向下排空气法收集氨气', '用红色石蕊试纸放在试管口验满'],
                orderPrompt: '按正确顺序排列氨气制备步骤',
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先发生反应，再干燥，再收集，最后验满',
                consequenceOptions: ['氨气与酸性干燥剂反应导致无法收集到氨气', '氨气无法产生', '试管可能炸裂', '氨气纯度降低'],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果用浓硫酸干燥氨气会有什么后果？',
                reasoning: [
                  '实验室用NH₄Cl和Ca(OH)₂固体混合加热制NH₃：2NH₄Cl+Ca(OH)₂═CaCl₂+2NH₃↑+2H₂O',
                  '氨气用碱石灰干燥（不能用浓硫酸或无水CaCl₂，因氨气与它们反应），用向下排空气法收集',
                  '验满用湿润红色石蕊试纸放在试管口，变蓝说明已满；试管口要塞棉花防止对流'
                ]
              }
            },
            {
              id: 'b2c5s2-007',
              template: 'redox-reasoning',
              title: '铜与稀硝酸反应',
              params: {
                substances: [
                  { key: 'sub1', formula: 'Cu', valences: { Cu: 0 } },
                  { key: 'sub2', formula: 'HNO₃', valences: { H: 1, N: 5, O: -2 } }
                ],
                identifyOptions: ['Cu是还原剂，HNO₃是氧化剂', 'Cu是氧化剂，HNO₃是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，判断氧化剂和还原剂',
                finalEquation: '3Cu + 8HNO₃(稀) → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O',
                finalHint: '稀硝酸中N从+5价降至+2价，得3e⁻',
                reasoning: [
                  'Cu从0价升至+2价，失电子→还原剂。HNO₃中N从+5价降至+2价，得电子→氧化剂',
                  'Cu失2e⁻×3=6e⁻，N得3e⁻×2=6e⁻，最小公倍数为6→Cu配3，NO配2',
                  '完整的配平：3Cu + 8HNO₃(稀) → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O，体现硝酸的酸性和强氧化性'
                ]
              }
            }
          ]
        },
        {
          id: 'b2-ch5-sec3',
          title: '第三节 无机非金属材料',
          exercises: [
            {
              id: 'b2c5s3-001',
              template: 'concept-construction',
              title: '二氧化硅与氢氟酸反应',
              params: {
                cases: ['氢氟酸能腐蚀玻璃', '氢氟酸不能保存在玻璃瓶中', 'SiO₂与HF反应生成SiF₄和H₂O'],
                caseOptions: ['SiO₂与HF的特殊反应', 'SiO₂的酸性', 'HF的强酸性'],
                caseCorrectIndices: [0],
                caseCommonality: 'SiO₂与HF的独特反应性',
                conceptName: 'SiO₂的特性反应',
                definitionKeyTerms: ['SiO₂', 'HF', '腐蚀玻璃', '塑料瓶'],
                definitionHint: 'SiO₂是酸性氧化物，但能跟HF反应——这是一个特例',
                fullDefinition: 'SiO₂是酸性氧化物，一般不跟酸反应，但能跟氢氟酸（HF）反应：SiO₂ + 4HF → SiF₄↑ + 2H₂O，因此氢氟酸可用作玻璃雕刻，需保存在塑料瓶中。',
                boundaryItems: ['玻璃是一种晶体，有固定的熔沸点', '水泥具有水硬性，与水混合后逐渐硬化', '氢氟酸可用于雕刻玻璃是因为SiO₂与HF反应', 'Na₂SiO₃的水溶液称为水玻璃，常用作黏合剂'],
                boundaryCorrectIndices: [1, 2, 3],
                explainPrompt: '为什么氢氟酸不能保存在玻璃瓶中？',
                explainHint: '玻璃的主要成分是SiO₂',
                explainKeyTerms: ['SiO₂', 'HF', '反应', '腐蚀'],
                reasoning: [
                  'SiO₂是酸性氧化物，一般不跟酸反应，但HF是例外——SiO₂ + 4HF → SiF₄↑ + 2H₂O',
                  '该反应无化合价变化，属于复分解反应，Si和O的化合价在反应前后不变',
                  '因为HF会腐蚀玻璃，所以氢氟酸必须保存在塑料瓶中'
                ]
              }
            },
            {
              id: 'b2c5s3-002',
              template: 'error-analysis',
              title: '硅与二氧化硅的常见误区',
              params: {
                statement: '光导纤维的主要成分是硅单质（Si），二氧化硅（SiO₂）可用作半导体材料，太阳能电池板的主要成分是SiO₂。',
                errorOptions: ['"光导纤维的主要成分是硅单质"', '"二氧化硅可用作半导体材料"', '"太阳能电池板的主要成分是SiO₂"', '以上全部正确'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['光导纤维', 'SiO₂', '半导体', '硅单质'],
                principleHint: '光导纤维和太阳能电池板的材料分别是什么？',
                correctVersion: '光导纤维的主要成分是二氧化硅（SiO₂），硅单质（Si）可用作半导体材料，太阳能电池板的主要成分是硅（Si）。',
                finalHint: '硅是半导体，二氧化硅是光导纤维。太阳能电池板需要光电转换，使用的是半导体硅而非SiO₂。',
                reasoning: [
                  '光导纤维主要成分是SiO₂（不是Si单质），Si单质用作半导体材料和太阳能电池板',
                  '错误在于"太阳能电池板的主要成分是SiO₂"——SiO₂不导电，不能做太阳能电池板',
                  '正确记忆：Si→半导体/太阳能电池板，SiO₂→光导纤维'
                ]
              }
            },
            {
              id: 'b2c5s3-003',
              template: 'concept-construction',
              title: '硅酸盐材料——传统无机非金属材料',
              params: {
                cases: ['生产玻璃的原料是纯碱、石灰石和石英砂', '制造水泥的主要原料是黏土和石灰石', '陶瓷的原料是高岭土'],
                caseOptions: ['水泥', '玻璃', '陶瓷'],
                caseCorrectIndices: [1, 0, 2],
                caseCommonality: '传统硅酸盐材料',
                conceptName: '传统无机非金属材料',
                definitionKeyTerms: ['水泥', '玻璃', '陶瓷', 'SiO₂', '硅酸盐'],
                definitionHint: '三大传统硅酸盐材料及其主要原料',
                fullDefinition: '传统硅酸盐材料主要包括水泥、玻璃和陶瓷三大类，其主要原料都含有SiO₂（或硅酸盐）。生产玻璃的原料是纯碱、石灰石和石英砂；制造水泥的主要原料是黏土和石灰石；陶瓷的原料是高岭土。',
                boundaryItems: ['玻璃是一种晶体，有固定的熔沸点', '水泥具有水硬性，与水混合后逐渐硬化', '氢氟酸可用于雕刻玻璃是因为SiO₂与HF反应', 'Na₂SiO₃的水溶液称为水玻璃，常用作黏合剂'],
                boundaryCorrectIndices: [1, 2, 3],
                explainPrompt: '为什么玻璃没有固定的熔沸点？',
                explainHint: '玻璃是晶体还是非晶体？',
                explainKeyTerms: ['非晶体', '玻璃态', '无固定熔点'],
                reasoning: [
                  '传统硅酸盐材料包括水泥、玻璃和陶瓷，主要原料都含SiO₂',
                  '玻璃是非晶体（玻璃态物质），没有固定的熔沸点，加热时在一定温度范围内逐渐软化',
                  'Na₂SiO₃水溶液称为水玻璃，具有黏合性，可用作黏合剂、防火剂等'
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'b2-ch6',
      title: '第六章 化学反应与能量',
      sections: [
        {
          id: 'b2-ch6-sec1',
          title: '第一节 化学反应与能量变化',
          exercises: [
            {
              id: 'b2c6s1-001',
              template: 'comparison-reasoning',
              title: '放热反应与吸热反应的比较',
              params: {
                conceptA: '放热反应',
                conceptB: '吸热反应',
                description: '某反应在常温下就能自发进行，并且伴随有明显的热量释放。该反应属于哪种类型？',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么它不可能是吸热反应？',
                excludeHint: '吸热反应通常需要持续加热才能进行',
                excludeKeyTerms: ['ΔH < 0', '放热', 'ΔH > 0', '吸热'],
                differenceOptions: ['放热反应ΔH<0，吸热反应ΔH>0', '放热反应不需要加热，吸热反应需要加热', '吸热反应不可能自发进行', '放热反应一定比吸热反应快'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '已知Ba(OH)₂·8H₂O与NH₄Cl的反应是吸热反应，触摸烧杯外壁会有什么感觉？',
                scenarioOptions: ['烧杯外壁温度降低（变凉）', '烧杯外壁温度升高（变热）', '温度无明显变化', '烧杯外壁结冰'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '放热反应ΔH<0，反应物总能量>生成物总能量。燃烧、中和、铝热反应属于放热反应',
                  '吸热反应ΔH>0，反应物总能量<生成物总能量。大多数分解反应、Ba(OH)₂·8H₂O与NH₄Cl反应属于吸热反应',
                  '放热反应不一定不需要加热（如铝热反应需引燃），吸热反应也不一定需要持续加热'
                ]
              }
            },
            {
              id: 'b2c6s1-002',
              template: 'concept-construction',
              title: '热化学方程式的书写',
              params: {
                cases: ['1 mol CH₄完全燃烧生成CO₂(g)和H₂O(l)放出890.3 kJ', '热化学方程式中各物质需标注状态', 'ΔH的数值与化学计量数成正比'],
                caseOptions: ['放热反应ΔH为负', '反应物总能量>生成物总能量', '热化学方程式需标注状态'],
                caseCorrectIndices: [0],
                caseCommonality: '热化学方程式的书写规范',
                conceptName: '热化学方程式',
                definitionKeyTerms: ['状态', 'ΔH', 'kJ/mol', '负值'],
                definitionHint: '热化学方程式必须标注物质状态，ΔH的单位为kJ/mol',
                fullDefinition: '热化学方程式是表示化学反应中热量变化的化学方程式，必须标注各物质状态（s、l、g、aq），ΔH为负值表示放热，单位为kJ/mol，系数加倍时ΔH也相应加倍。',
                boundaryItems: ['热化学方程式不需要注明反应条件', 'ΔH的单位与化学计量数有关', '可逆反应中ΔH表示完全反应时的热量变化', '热化学方程式中系数可以是分数'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么热化学方程式中系数可以是分数？',
                explainHint: 'ΔH的单位是kJ/mol，表示每摩尔反应',
                explainKeyTerms: ['物质的量', '系数', 'ΔH'],
                reasoning: [
                  '热化学方程式必须标注物质状态（s、l、g、aq），ΔH=-890.3 kJ/mol，负值表示放热',
                  'CH₄(g)+2O₂(g)→CO₂(g)+2H₂O(l) ΔH=-890.3 kJ/mol',
                  '系数加倍时ΔH也相应加倍；系数可用分数，如½，表示每摩尔反应'
                ]
              }
            },
            {
              id: 'b2c6s1-003',
              template: 'error-analysis',
              title: '热化学方程式常见错误',
              params: {
                statement: '已知H₂(g) + O₂(g) = H₂O(g) ΔH = -241.8 kJ/mol，则H₂的燃烧热为241.8 kJ/mol。',
                errorOptions: ['"H₂(g) + O₂(g) = H₂O(g)"缺少系数2', '"H₂O(g)"状态应为H₂O(l)', '"燃烧热为241.8 kJ/mol"漏了负号', '以上全部'],
                errorCorrectIndex: 3,
                principleKeyTerms: ['燃烧热', '液态水', 'ΔH', '负值'],
                principleHint: '燃烧热的定义中，H₂燃烧生成的水必须是什么状态？',
                correctVersion: '已知H₂(g) + ½O₂(g) = H₂O(l) ΔH = -285.8 kJ/mol，则H₂的燃烧热为-285.8 kJ/mol。',
                finalHint: '燃烧热中水的状态必须是液态（l），且ΔH为负值（放热）。此外热化学方程式要配平。',
                reasoning: [
                  '燃烧热定义：1 mol物质完全燃烧生成指定产物，H₂应生成液态水，且ΔH应为负值',
                  '错误1：缺少配平系数——应为H₂(g)+½O₂(g)；错误2：H₂O应为液态(l)；错误3：燃烧热漏了负号',
                  '正确应为H₂(g) + ½O₂(g) = H₂O(l) ΔH = -285.8 kJ/mol，燃烧热为-285.8 kJ/mol'
                ]
              }
            },
            {
              id: 'b2c6s1-004',
              template: 'concept-construction',
              title: '原电池原理',
              params: {
                cases: ['Zn-Cu-H₂SO₄原电池中Zn逐渐溶解，Cu上有气泡', '电子从Zn通过导线流向Cu', '电流从Cu经导线流向Zn'],
                caseOptions: ['化学能转化为电能', '负极发生氧化反应', '电子从负极流向正极'],
                caseCorrectIndices: [0],
                caseCommonality: '原电池的能量转化和电极反应',
                conceptName: '原电池',
                definitionKeyTerms: ['化学', '电', '氧化', '失', '还原', '得'],
                definitionHint: '原电池将化学能转化为电能，负极失电子发生氧化反应，正极得电子发生还原反应',
                fullDefinition: '原电池是将化学能转化为电能的装置。负极发生氧化反应（失电子），正极发生还原反应（得电子），电子从负极经外电路流向正极，电解质溶液中阳离子移向正极。',
                boundaryItems: ['Mg-Al-NaOH溶液中原电池中Mg做负极', 'Zn-Cu-H₂SO₄原电池中Zn为负极，发生Zn-2e⁻=Zn²⁺', '燃料电池不属于原电池', '原电池中负极发生还原反应'],
                boundaryCorrectIndices: [1],
                explainPrompt: '为什么Mg-Al-NaOH原电池中Al是负极而非更活泼的Mg？',
                explainHint: 'Al能与NaOH溶液反应而Mg不能',
                explainKeyTerms: ['电解质环境', '自发反应', '负极'],
                reasoning: [
                  '原电池将化学能转化为电能，负极发生氧化反应（失电子），正极发生还原反应（得电子）',
                  '电子从负极经外电路流向正极，电流方向相反；电解质中阳离子移向正极',
                  '负极判断：不是由金属活泼性唯一决定，还要考虑电解质环境，如Mg-Al-NaOH中Al为负极（Al与NaOH反应）'
                ]
              }
            },
            {
              id: 'b2c6s1-005',
              template: 'experimental-reasoning',
              title: '原电池电极判断思路',
              params: {
                goal: '判断原电池的正负极',
                principleOptions: ['原电池中失电子的一极为负极，得电子的一极为正极', '活泼金属一定做负极', '电子从正极流向负极', '电流从负极流向正极'],
                principleCorrectIndex: 0,
                keyStepItems: ['判断总反应是否为自发氧化还原反应', '确定两个电极材料及活性差异', '确定电解质环境（酸性/碱性/中性）', '根据反应判断正负极（失电子→负极）'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['判断总反应是否为自发氧化还原反应', '确定两个电极材料及活性差异', '确定电解质环境（酸性/碱性/中性）', '根据反应判断正负极（失电子→负极）'],
                orderPrompt: '按正确思路排列原电池电极判断步骤',
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先判断总反应，再考虑材料和电解质环境',
                consequenceOptions: ['错误判断正负极，如Mg-Al-NaOH中误判Mg为负极', '无法形成原电池', '电池短路', '无法产生电流'],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果不考虑电解质环境，在Mg-Al-NaOH中会得出什么错误结论？',
                reasoning: [
                  '第一步：判断总反应是否为自发氧化还原反应——这是构成原电池的前提',
                  '第二步：确定电极材料及活性差异；第三步：分析电解质环境（Mg-Al-NaOH中Al与NaOH反应而Mg不反应）',
                  '第四步：根据实际反应判断——失电子的一极是负极（Mg-Al-NaOH中Al为负极）'
                ]
              }
            }
          ]
        },
        {
          id: 'b2-ch6-sec2',
          title: '第二节 化学反应的速率与限度',
          exercises: [
            {
              id: 'b2c6s2-001',
              template: 'concept-construction',
              title: '影响化学反应速率的因素',
              params: {
                cases: ['夏天食物易变质，冬天不易变质', '将煤块粉碎后燃烧更剧烈', 'H₂和O₂在常温下反应极慢，点燃瞬间完成'],
                caseOptions: ['温度影响', '接触面积影响', '催化剂影响'],
                caseCorrectIndices: [0, 0, 2],
                caseCommonality: '影响化学反应速率的外因',
                conceptName: '影响化学反应速率的因素',
                definitionKeyTerms: ['浓度', '温度', '压强', '催化剂'],
                definitionHint: '影响反应速率的主要外因有四个',
                fullDefinition: '影响化学反应速率的外因主要有浓度、温度、压强和催化剂等。升高温度反应速率加快（每升高10℃，速率约变为原来的2~4倍）；增大反应物浓度反应速率加快；增大压强（对有气体参与的反应）本质是增大气体浓度；催化剂同等程度改变正逆反应速率。',
                boundaryItems: ['增大压强本质是增大气体浓度，对于无气体反应无影响', '催化剂同等程度改变正逆反应速率，平衡不移动', '固体和纯液体的浓度视为常数，增加其量速率不变', '温度对任何反应都有影响'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么增大压强不一定加快所有反应的速率？',
                explainHint: '压强只对有气体参与的反应有影响',
                explainKeyTerms: ['压强', '气体浓度', '无气体反应'],
                reasoning: [
                  '影响反应速率的外因：浓度、温度、压强、催化剂。温度每升高10℃，速率约变为原来的2~4倍',
                  '增大压强本质是增大气体浓度，对无气体参与的反应无影响；固体和纯液体的浓度视为常数',
                  '催化剂同等程度改变正逆反应速率，不改变平衡移动'
                ]
              }
            },
            {
              id: 'b2c6s2-002',
              template: 'error-analysis',
              title: '化学平衡状态理解',
              params: {
                statement: '当可逆反应达到平衡时，正反应速率和逆反应速率均为零，各组分浓度相等。',
                errorOptions: ['"正反应速率和逆反应速率均为零"', '"各组分浓度相等"', '以上全部', '以上都不对'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['动态平衡', '正逆反应速率相等', '不为零', '浓度保持不变'],
                principleHint: '化学平衡是动态平衡还是静态平衡？',
                correctVersion: '当可逆反应达到平衡时，正反应速率等于逆反应速率（不为零），各组分浓度保持不变（不一定相等）。',
                finalHint: '化学平衡的特征：逆（可逆反应）、等（正=逆≠0）、动（动态平衡）、定（浓度不变）、变（条件改变→平衡移动）。',
                reasoning: [
                  '化学平衡是动态平衡，正逆反应速率相等但不为零，各组分浓度保持不变但不一定相等',
                  '"正逆反应速率均为零"错误——平衡时反应仍在进行，只是速率相等（>0）',
                  '"各组分浓度相等"错误——平衡时各组分浓度保持不变，但不一定相等'
                ]
              }
            },
            {
              id: 'b2c6s2-003',
              template: 'experimental-reasoning',
              title: '勒夏特列原理的应用',
              params: {
                goal: '应用勒夏特列原理判断平衡移动方向',
                principleOptions: ['改变影响平衡的一个条件，平衡向减弱该改变的方向移动', '平衡向正反应方向移动', '平衡向逆反应方向移动', '平衡不移动'],
                principleCorrectIndex: 0,
                keyStepItems: ['写出可逆反应并标注正逆方向', '确定条件改变的类型（浓度/温度/压强）', '判断反应前后气体分子数的变化', '分析条件变化后平衡移动的方向'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['写出可逆反应并标注正逆方向', '确定条件改变的类型（浓度/温度/压强）', '判断反应前后气体分子数的变化', '分析条件变化后平衡移动的方向'],
                orderPrompt: '按正确思路排列勒夏特列原理应用步骤',
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先写出反应，再确定条件变化，再分析气体分子数，最后判断移动方向',
                consequenceOptions: ['得出错误的平衡移动方向', '无法判断平衡移动方向', '催化剂使平衡移动', '温度和压强变化互不影响'],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果不先判断气体分子数变化就直接分析压强变化的影响，会有什么后果？',
                reasoning: [
                  '写出可逆反应并标注正逆方向，确定条件改变类型（浓度/温度/压强）',
                  '判断反应前后气体分子数变化——压强变化只影响气体分子数不等的反应',
                  '勒夏特列原理：改变影响平衡的条件，平衡向减弱该改变的方向移动。催化剂不影响平衡'
                ]
              }
            },
            {
              id: 'b2c6s2-004',
              template: 'concept-construction',
              title: '速率相关化学方程式配平与转化',
              params: {
                cases: ['对于反应N₂(g)+3H₂(g)⇌2NH₃(g)，v(N₂)=0.2 mol·L⁻¹·min⁻¹', 'v(H₂)=3v(N₂)=0.6 mol·L⁻¹·min⁻¹', 'v(NH₃)=2v(N₂)=0.4 mol·L⁻¹·min⁻¹'],
                caseOptions: ['速率之比等于化学计量数之比', '浓度之比等于化学计量数之比', '平衡常数K不变'],
                caseCorrectIndices: [0],
                caseCommonality: '化学反应速率与化学计量数的关系',
                conceptName: '化学反应速率之比等于化学计量数之比',
                definitionKeyTerms: ['速率', '化学计量数', '正比'],
                definitionHint: '对于同一反应，不同物质表示的速率之比等于化学计量数之比',
                fullDefinition: '对于反应aA + bB → cC + dD，v(A):v(B):v(C):v(D) = a:b:c:d，即不同物质表示的反应速率之比等于其化学计量数之比。但注意：速率数值不同时，需转化为同一物质进行比较。',
                boundaryItems: ['速率之比等于化学计量数之比只适用于同一反应', '比较反应快慢需转化为同一种物质', '固体或纯液体的浓度视为常数', '速率之比等于计量数之比与反应是否可逆无关'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么比较不同反应的速率时不能直接用速率数值比较？',
                explainHint: '不同反应的化学计量数不同，速率数值意义不同',
                explainKeyTerms: ['化学计量数', '同一物质', '转化'],
                reasoning: [
                  '反应速率之比等于化学计量数之比，v(N₂):v(H₂):v(NH₃)=1:3:2',
                  'v(N₂)=0.2→v(H₂)=3×0.2=0.6，v(NH₃)=2×0.2=0.4（单位：mol·L⁻¹·min⁻¹）',
                  '比较反应快慢时需转化为同一物质进行比较，不能直接用不同物质的速率数值比较'
                ]
              }
            },
            {
              id: 'b2c6s2-005',
              template: 'comparison-reasoning',
              title: '平衡移动与速率的关系',
              params: {
                conceptA: '浓度对平衡的影响',
                conceptB: '温度对平衡的影响',
                description: '某可逆反应达到平衡后，改变一个条件，发现平衡常数K发生了改变。改变的条件是什么？',
                identifyCorrectIndex: 1,
                excludePrompt: '为什么改变浓度不是正确答案？',
                excludeHint: '平衡常数K只受什么因素影响？',
                excludeKeyTerms: ['平衡常数K', '温度', '浓度不影响K'],
                differenceOptions: ['浓度改变不影响K，温度改变会影响K', '浓度改变正逆反应速率不同步，温度改变同步', '浓度只影响正反应速率，温度影响正逆反应速率', '温度对平衡影响更大'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '对于放热反应，升高温度后平衡如何移动？K值如何变化？',
                scenarioOptions: ['平衡逆向移动（向吸热方向），K减小', '平衡正向移动（向放热方向），K增大', '平衡不移动，K不变', '平衡逆向移动，K增大'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '浓度改变时正逆反应速率均瞬间变化（变化幅度不同），但平衡常数K不变',
                  '温度改变时正逆反应速率均瞬间变化，且平衡常数K改变——K只受温度影响',
                  '升高温度平衡向吸热方向移动，对于放热反应平衡逆向移动，K值减小'
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'b2-ch7',
      title: '第七章 有机化合物',
      sections: [
        {
          id: 'b2-ch7-sec1',
          title: '第一节 认识有机化合物',
          exercises: [
            {
              id: 'b2c7s1-001',
              template: 'concept-construction',
              title: '甲烷的结构与性质',
              params: {
                cases: ['甲烷与氯气在光照下反应生成多种氯代产物', '甲烷不能使酸性KMnO₄溶液褪色', '甲烷在空气中燃烧产生淡蓝色火焰'],
                caseOptions: ['取代反应', '氧化反应（不能）', '燃烧反应'],
                caseCorrectIndices: [0, 0, 2],
                caseCommonality: '甲烷的化学性质',
                conceptName: '甲烷（CH₄）',
                definitionKeyTerms: ['CH₄', '正四面体', '109.5°', '饱和'],
                definitionHint: '甲烷的分子构型是正四面体，键角109.5°，属于饱和烃',
                fullDefinition: '甲烷的分子式为CH₄，空间构型为正四面体，键角为109.5°，是饱和烃（烷烃）。与氯气在光照下发生取代反应（分步进行），不能使酸性KMnO₄褪色，燃烧产生淡蓝色火焰。',
                boundaryItems: ['甲烷的取代反应中Cl₂可以换成Br₂', 'CH₄与Cl₂取代产物中HCl的量最多', '甲烷与氯气在光照下发生加成反应', '甲烷在空气中燃烧产生淡蓝色火焰'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么甲烷的取代反应产物中HCl的产量最多？',
                explainHint: '取代反应的分步进行中每一步都生成HCl',
                explainKeyTerms: ['分步取代', 'HCl', '每一步都产生'],
                reasoning: [
                  '甲烷是正四面体结构，键角109.5°，是饱和烃——不能使酸性KMnO₄褪色，不能与溴水反应',
                  '甲烷与Cl₂在光照下发生取代反应（分步进行，产物为混合物），HCl产量最多',
                  '甲烷燃烧产生淡蓝色火焰，产物为CO₂和H₂O'
                ]
              }
            },
            {
              id: 'b2c7s1-002',
              template: 'error-analysis',
              title: '烷烃命名常见错误',
              params: {
                statement: 'CH₃CH(CH₃)CH₂CH₃的名称是2-甲基丁烷，它和正戊烷互为同系物。',
                errorOptions: ['"2-甲基丁烷"名称错误', '"和正戊烷互为同系物"表述错误', '以上全部正确', '"CH₃CH(CH₃)CH₂CH₃"结构式书写错误'],
                errorCorrectIndex: 1,
                principleKeyTerms: ['同系物', '同分异构体', '相差n个CH₂', '分子式相同'],
                principleHint: '2-甲基丁烷和正戊烷的分子式都是C₅H₁₂，它们是什么关系？',
                correctVersion: 'CH₃CH(CH₃)CH₂CH₃的名称是2-甲基丁烷，它和正戊烷互为同分异构体。',
                finalHint: '同分异构体：分子式相同结构不同。同系物：结构相似，分子组成相差一个或多个CH₂。C₅H₁₂有3种同分异构体。',
                reasoning: [
                  '2-甲基丁烷和正戊烷分子式均为C₅H₁₂，是同分异构体关系（分子式相同结构不同）',
                  '同系物要求结构相似且分子组成相差n个CH₂（n≥1），这里分子式相同所以不是同系物',
                  '名称"2-甲基丁烷"正确——命名选最长碳链（4个C）为主链，甲基在2号位'
                ]
              }
            },
            {
              id: 'b2c7s1-003',
              template: 'experimental-reasoning',
              title: '烷烃系统命名步骤',
              params: {
                goal: '对烷烃进行系统命名',
                principleOptions: ['选最长碳链为主链，编号使取代基位置之和最小', '选支链最多的为主链', '从左边开始编号', '按取代基名称的字数排序'],
                principleCorrectIndex: 0,
                keyStepItems: ['选择最长碳链为主链', '如果有多条等长碳链，选择含取代基多的为主链', '编号使取代基位置编号之和最小', '写出取代基位置、数目和名称'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['选择最长碳链为主链', '如果有多条等长碳链，选择含取代基多的为主链', '编号使取代基位置编号之和最小', '写出取代基位置、数目和名称'],
                orderPrompt: '按正确顺序排列烷烃命名步骤',
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先选主链，再编号，最后写出名称',
                consequenceOptions: ['主链选择错误导致名称错误', '名称顺序错误', '取代基位置标错', '以上都可能发生'],
                consequenceCorrectIndex: 3,
                consequencePrompt: '如果选择不是最长的碳链作为主链会怎样？',
                reasoning: [
                  '第一步：选择最长碳链为主链（含碳原子数目最多）',
                  '第二步：若有多条等长碳链，选择含取代基多的为主链',
                  '第三步：编号使取代基位置之和最小（从离取代基最近端开始），最后写出名称'
                ]
              }
            }
          ]
        },
        {
          id: 'b2-ch7-sec2',
          title: '第二节 乙烯与有机高分子材料',
          exercises: [
            {
              id: 'b2c7s2-001',
              template: 'comparison-reasoning',
              title: '甲烷与乙烯的性质比较',
              params: {
                conceptA: '甲烷（CH₄）',
                conceptB: '乙烯（C₂H₄）',
                description: '某气态烃不能使酸性KMnO₄褪色，也不能使溴水褪色，与Cl₂在光照下反应。该烃是什么？',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么它不可能是乙烯？',
                excludeHint: '乙烯能使酸性KMnO₄和溴水褪色吗？',
                excludeKeyTerms: ['KMnO₄褪色', '溴水褪色', 'C=C', '加成'],
                differenceOptions: ['乙烯因含C=C双键而比甲烷活泼，能发生加成和加聚反应', '甲烷是气体而乙烯是液体', '甲烷有毒而乙烯无毒', '甲烷和乙烯都能使溴水褪色'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '如何鉴别甲烷和乙烯两种无色气体？',
                scenarioOptions: ['分别通入溴水或酸性KMnO₄溶液，褪色的是乙烯', '闻气味鉴别', '观察颜色', '用燃着的木条点燃'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '甲烷是饱和烃（CₙH₂ₙ₊₂），不能使KMnO₄和溴水褪色，与Cl₂光照取代',
                  '乙烯含C=C双键（CₙH₂ₙ），能使酸性KMnO₄褪色（被氧化），能使溴水褪色（加成），能加聚',
                  '鉴别甲烷和乙烯：通入溴水或酸性KMnO₄，褪色的是乙烯，不褪色的是甲烷'
                ]
              }
            },
            {
              id: 'b2c7s2-002',
              template: 'concept-construction',
              title: '乙烯与溴的加成反应',
              params: {
                cases: ['乙烯通入溴水中，溴水的橙红色褪去', 'CH₂=CH₂ + Br₂ → CH₂BrCH₂Br', '生成的无色油状液体1,2-二溴乙烷'],
                caseOptions: ['加成反应', '取代反应', '加聚反应'],
                caseCorrectIndices: [0],
                caseCommonality: '乙烯与溴的加成反应',
                conceptName: '乙烯的加成反应',
                definitionKeyTerms: ['C=C双键', '加成', '1,2-二溴乙烷', '溴水褪色'],
                definitionHint: 'C=C双键中的一个键易断裂，发生加成反应',
                fullDefinition: '乙烯使溴水褪色是发生了加成反应：CH₂=CH₂ + Br₂ → CH₂BrCH₂Br（1,2-二溴乙烷），该反应可用于鉴别乙烯和甲烷。C=C双键中σ键稳定，π键易断裂发生加成。',
                boundaryItems: ['该反应类型为加成反应', '乙烯使溴水褪色可用于鉴别乙烯和甲烷', '乙烯与溴的四氯化碳溶液也发生同样反应', '该反应中Br₂被还原为Br⁻'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么乙烯能使溴水褪色而甲烷不能？',
                explainHint: '乙烯分子中含有什么特殊结构？',
                explainKeyTerms: ['C=C', 'π键', '加成反应'],
                reasoning: [
                  '乙烯含C=C双键（一个σ键一个π键），π键易断裂发生加成反应',
                  'CH₂=CH₂ + Br₂ → CH₂BrCH₂Br，溴水褪色生成无色油状1,2-二溴乙烷',
                  '甲烷是饱和烃无C=C，不能使溴水褪色——这是鉴别乙烯和甲烷的方法'
                ]
              }
            },
            {
              id: 'b2c7s2-003',
              template: 'concept-construction',
              title: '有机高分子材料',
              params: {
                cases: ['乙烯发生加聚反应生成聚乙烯', '聚乙烯可用作食品包装袋', '聚氯乙烯（PVC）不能用于食品包装'],
                caseOptions: ['加聚反应', '热塑性材料', '安全与用途'],
                caseCorrectIndices: [0],
                caseCommonality: '有机高分子材料的合成与性质',
                conceptName: '聚合反应与高分子材料',
                definitionKeyTerms: ['加聚', '乙烯', '热塑性'],
                definitionHint: '聚乙烯由乙烯加聚而成，属于热塑性塑料',
                fullDefinition: '聚乙烯的合成反应类型为加聚反应，其单体为乙烯，聚乙烯属于热塑性高分子材料。聚合反应分为加聚反应（单体含C=C，产物只有聚合物）和缩聚反应（有小分子副产物）。',
                boundaryItems: ['天然橡胶的主要成分是聚异戊二烯', '酚醛树脂属于热固性塑料', '加聚反应产物中只有聚合物没有小分子副产物', '缩聚反应会生成小分子副产物如H₂O'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么聚氯乙烯不能用于食品包装？',
                explainHint: '聚氯乙烯的添加剂和分解产物有毒',
                explainKeyTerms: ['增塑剂', '有毒', 'PVC'],
                reasoning: [
                  '加聚反应：单体含C=C不饱和键，产物只有聚合物（无小分子副产物）',
                  '聚乙烯（PE）无毒，可用作食品包装袋；聚氯乙烯（PVC）含增塑剂等有毒物质，不能用于食品包装',
                  '热塑性塑料加热可熔化（如聚乙烯），热固性塑料加热不熔化（如酚醛树脂）'
                ]
              }
            },
            {
              id: 'b2c7s2-004',
              template: 'experimental-reasoning',
              title: '乙烯使溴水褪色实验现象分析',
              params: {
                goal: '验证乙烯与溴发生加成反应',
                principleOptions: ['乙烯与溴发生加成反应生成1,2-二溴乙烷', '乙烯与溴发生取代反应', '乙烯与溴发生加聚反应', '乙烯与溴发生氧化反应'],
                principleCorrectIndex: 0,
                keyStepItems: ['乙烯通入盛有溴水的试管中', '观察到溴水的橙红色逐渐褪去', 'CH₂=CH₂+Br₂→CH₂BrCH₂Br', '生成无色油状液体1,2-二溴乙烷'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['乙烯通入盛有溴水的试管中', '观察到溴水的橙红色逐渐褪去', 'CH₂=CH₂+Br₂→CH₂BrCH₂Br', '生成无色油状液体1,2-二溴乙烷'],
                orderPrompt: '按正确顺序排列实验过程',
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先通入乙烯，再观察现象，再写方程式，最终产物',
                consequenceOptions: ['无法观察到褪色现象', '生成白色沉淀', '反应过于剧烈', '溶液分层无法判断'],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果使用甲烷代替乙烯进行实验会观察到什么？',
                reasoning: [
                  '将乙烯通入溴水中，观察到溴水的橙红色逐渐褪去',
                  '反应为CH₂=CH₂+Br₂→CH₂BrCH₂Br（加成反应），生成无色油状1,2-二溴乙烷',
                  '甲烷无C=C双键，不能使溴水褪色——该实验可用于鉴别甲烷和乙烯'
                ]
              }
            }
          ]
        },
        {
          id: 'b2-ch7-sec3',
          title: '第三节 乙醇与乙酸',
          exercises: [
            {
              id: 'b2c7s3-001',
              template: 'redox-reasoning',
              title: '乙醇的催化氧化',
              params: {
                substances: [
                  { key: 'sub1', formula: 'CH₃CH₂OH', valences: { C: -2, H: 1, O: -2 } },
                  { key: 'sub2', formula: 'O₂', valences: { O: 0 } }
                ],
                identifyOptions: ['乙醇是还原剂，O₂是氧化剂', '乙醇是氧化剂，O₂是还原剂', '两者都是氧化剂', '两者都是还原剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，判断氧化剂和还原剂',
                finalEquation: '2CH₃CH₂OH + O₂ ═ 2CH₃CHO + 2H₂O',
                finalHint: 'Cu或Ag作催化剂，反应中-OH连接的C上脱去两个H',
                reasoning: [
                  '乙醇中与-OH相连的C为-1价→升高到乙醛中C=O的+1价（或醛基C为+1价），失电子→还原剂',
                  'O₂中O为0价→降到H₂O中-2价，得电子→氧化剂。每分子乙醇失2e⁻，O₂得4e⁻',
                  '完整的配平：2CH₃CH₂OH + O₂ ═ 2CH₃CHO + 2H₂O（Cu/Ag催化，加热）'
                ]
              }
            },
            {
              id: 'b2c7s3-002',
              template: 'redox-reasoning',
              title: '乙醇与钠的反应',
              params: {
                substances: [
                  { key: 'sub1', formula: 'CH₃CH₂OH', valences: { C: -2, H: 1, O: -2 } },
                  { key: 'sub2', formula: 'Na', valences: { Na: 0 } }
                ],
                identifyOptions: ['Na是还原剂，乙醇是氧化剂', 'Na是氧化剂，乙醇是还原剂', '两者都是还原剂', '两者都是氧化剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，判断氧化剂和还原剂',
                finalEquation: '2CH₃CH₂OH + 2Na → 2CH₃CH₂ONa + H₂↑',
                finalHint: '乙醇羟基上的H为+1价被还原为0价的H₂',
                reasoning: [
                  'Na从0价升至+1价（CH₃CH₂ONa中Na为+1），失电子→还原剂',
                  '乙醇羟基H从+1价降至0价（H₂），得电子→氧化剂。此反应中乙醇体现弱酸性（羟基H的活性）',
                  '完整的配平：2CH₃CH₂OH + 2Na → 2CH₃CH₂ONa + H₂↑，反应比水与钠缓和'
                ]
              }
            },
            {
              id: 'b2c7s3-003',
              template: 'error-analysis',
              title: '酯化反应机理辨析',
              params: {
                statement: '乙醇和乙酸在浓硫酸催化下发生酯化反应生成乙酸乙酯和水。该反应的机理是乙醇脱羟基、乙酸脱氢。',
                errorOptions: ['"乙醇和乙酸在浓硫酸催化下发生酯化反应"', '"生成乙酸乙酯和水"', '"乙醇脱羟基、乙酸脱氢"', '以上全部正确'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['酸脱羟基', '醇脱氢', '酯化反应机理'],
                principleHint: '酯化反应中酸和醇分别脱去什么基团？',
                correctVersion: '乙醇和乙酸在浓硫酸催化下发生酯化反应生成乙酸乙酯和水。该反应的机理是乙酸脱羟基、乙醇脱氢（酸脱羟基醇脱氢）。',
                finalHint: '酯化反应机理可记为：酸脱羟基醇脱氢（-OH来自羧酸，H来自醇羟基）。用同位素¹⁸O标记可证明。',
                reasoning: [
                  '错误在"乙醇脱羟基、乙酸脱氢"——正确的机理是"酸脱羟基醇脱氢"',
                  '即乙酸脱去-OH（羟基），乙醇脱去羟基上的H，结合生成水',
                  '用¹⁸O标记乙醇的羟基O，发现¹⁸O进入乙酸乙酯中，证明乙醇提供H、乙酸提供-OH'
                ]
              }
            },
            {
              id: 'b2c7s3-004',
              template: 'comparison-reasoning',
              title: '乙醇与乙酸的性质比较',
              params: {
                conceptA: '乙醇（C₂H₅OH）',
                conceptB: '乙酸（CH₃COOH）',
                description: '某物质能与NaHCO₃反应产生CO₂气体，该物质是什么？',
                identifyCorrectIndex: 1,
                excludePrompt: '为什么乙醇不能与NaHCO₃反应？',
                excludeHint: '乙醇的羟基H和乙酸的羧基H的酸性有何不同？',
                excludeKeyTerms: ['NaHCO₃', 'CO₂', '酸性', '羟基'],
                differenceOptions: ['乙醇显中性，乙酸显酸性；乙酸能与NaHCO₃反应而乙醇不能', '乙醇是液体而乙酸是固体', '乙醇有刺激性气味而乙酸有香味', '乙醇和乙酸不能相互反应'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '如何用化学方法鉴别乙醇和乙酸？',
                scenarioOptions: ['分别滴加NaHCO₃溶液，产生气泡的是乙酸', '分别加入金属钠，产生气泡的是乙酸', '分别加入水，溶解的是乙醇', '闻气味鉴别'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '乙醇官能团为羟基(-OH)，显中性，不能与NaHCO₃反应（但能与Na反应）',
                  '乙酸官能团为羧基(-COOH)，具有弱酸性，能与NaHCO₃反应产生CO₂',
                  '鉴别乙醇和乙酸：加入NaHCO₃溶液，产生气泡（CO₂）的是乙酸'
                ]
              }
            },
            {
              id: 'b2c7s3-005',
              template: 'experimental-reasoning',
              title: '乙酸乙酯的制备操作顺序',
              params: {
                goal: '实验室制备乙酸乙酯',
                principleOptions: ['CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O（浓硫酸催化，加热）', 'CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O（室温）', 'CH₃COOH + 2C₂H₅OH → CH₃COOC₂H₅ + 2H₂O', '不需要催化剂'],
                principleCorrectIndex: 0,
                keyStepItems: ['向试管中加入乙醇、乙酸和浓硫酸', '加热试管，收集乙酸乙酯', '将导管末端伸入饱和Na₂CO₃液面上方', '用饱和Na₂CO₃溶液接收产物'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['向试管中加入乙醇、乙酸和浓硫酸', '加热试管，收集乙酸乙酯', '将导管末端伸入饱和Na₂CO₃液面上方', '用饱和Na₂CO₃溶液接收产物'],
                orderPrompt: '按正确顺序排列乙酸乙酯制备步骤',
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先加药品混合，再加热，再用Na₂CO₃接收',
                consequenceOptions: ['液体飞溅（加入顺序颠倒）', '无法产生乙酸乙酯', '导管末端插入液面以下导致倒吸', '产物无法收集'],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果将浓硫酸先加入试管后再加乙醇和乙酸会怎样？',
                reasoning: [
                  '加入试剂的正确顺序：乙醇→浓硫酸→乙酸（防止浓硫酸稀释时液体飞溅）',
                  '导管末端不能伸入饱和Na₂CO₃液面以下（防倒吸），Na₂CO₃吸收乙醇和乙酸并降低酯的溶解度',
                  '浓硫酸的作用：催化、吸水（使平衡右移，提高产率）'
                ]
              }
            }
          ]
        },
        {
          id: 'b2-ch7-sec4',
          title: '第四节 基本营养物质',
          exercises: [
            {
              id: 'b2c7s4-001',
              template: 'concept-construction',
              title: '糖类分类与性质',
              params: {
                cases: ['葡萄糖能与新制Cu(OH)₂共热产生砖红色沉淀', '葡萄糖能发生银镜反应', '蔗糖水解产物为葡萄糖和果糖'],
                caseOptions: ['还原性糖的性质', '二糖的水解', '多糖的性质'],
                caseCorrectIndices: [0, 0, 1],
                caseCommonality: '糖类的分类和化学性质',
                conceptName: '糖类',
                definitionKeyTerms: ['单糖', '二糖', '多糖', 'C₆H₁₂O₆'],
                definitionHint: '糖类按水解情况分为三类',
                fullDefinition: '糖类可分为单糖（不能水解，如葡萄糖C₆H₁₂O₆、果糖）、二糖（水解为2分子单糖，如蔗糖→葡萄糖+果糖、麦芽糖→2葡萄糖）和多糖（水解为多分子单糖，如淀粉、纤维素）。葡萄糖能与新制Cu(OH)₂共热产生砖红色沉淀，能发生银镜反应。',
                boundaryItems: ['淀粉遇碘单质变蓝', '纤维素在人体内不能被消化', '葡萄糖和果糖互为同分异构体', '麦芽糖水解产物为2分子葡萄糖'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么纤维素在人体内不能被消化？',
                explainHint: '人体内是否有水解纤维素的酶？',
                explainKeyTerms: ['纤维素酶', '人体内没有'],
                reasoning: [
                  '单糖（葡萄糖C₆H₁₂O₆、果糖）不能水解，具有还原性（银镜反应、与新制Cu(OH)₂反应）',
                  '二糖（蔗糖→葡萄糖+果糖，麦芽糖→2葡萄糖）水解为2分子单糖',
                  '多糖（淀粉、纤维素）水解为多分子葡萄糖；淀粉遇I₂变蓝，人体内无纤维素酶不能消化纤维素'
                ]
              }
            },
            {
              id: 'b2c7s4-002',
              template: 'comparison-reasoning',
              title: '油脂与蛋白质的性质比较',
              params: {
                conceptA: '油脂',
                conceptB: '蛋白质',
                description: '某物质在碱性条件下水解，产物为高级脂肪酸盐和甘油。该物质属于哪类？',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么它不可能是蛋白质？',
                excludeHint: '蛋白质水解的最终产物是什么？',
                excludeKeyTerms: ['氨基酸', '甘油', '高级脂肪酸'],
                differenceOptions: ['油脂水解产物为甘油+脂肪酸，蛋白质水解产物为氨基酸', '油脂和蛋白质都是高分子化合物', '油脂和蛋白质都不能水解', '蛋白质属于酯类'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '向蛋白质溶液中加入饱和NaCl溶液产生沉淀，再加入水后沉淀溶解。这属于什么过程？',
                scenarioOptions: ['盐析（可逆）', '变性（不可逆）', '水解', '颜色反应'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '油脂是高级脂肪酸与甘油形成的酯，碱性水解（皂化反应）生成甘油和高级脂肪酸盐',
                  '蛋白质水解最终产物为氨基酸；盐析可逆（加轻金属盐），变性不可逆（加热/重金属盐）',
                  '蛋白质遇浓硝酸变黄（颜色反应），是蛋白质的特征反应之一'
                ]
              }
            },
            {
              id: 'b2c7s4-003',
              template: 'error-analysis',
              title: '营养物质性质误区',
              params: {
                statement: '蛋白质的盐析和变性都是不可逆过程。向蛋白质溶液中加入NaCl固体产生沉淀，加水后沉淀不溶解。',
                errorOptions: ['"蛋白质的盐析和变性都是不可逆过程"', '"向蛋白质溶液中加入NaCl固体产生沉淀"', '"加水后沉淀不溶解"', '以上全部错误'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['盐析可逆', '变性不可逆', '加水恢复溶解'],
                principleHint: '盐析和变性哪个是可逆的？',
                correctVersion: '蛋白质的盐析是可逆过程而变性不可逆。向蛋白质溶液中加入NaCl固体产生沉淀（盐析），加水后沉淀溶解。',
                finalHint: '盐析：轻金属盐使蛋白质溶解度降低（可逆）。变性：高温、重金属盐、强酸强碱、酒精等使蛋白质结构改变（不可逆）。',
                reasoning: [
                  '盐析是可逆过程（加入轻金属盐，蛋白质沉淀，加水后恢复溶解）',
                  '变性是不可逆过程（加热、重金属盐等使蛋白质失去活性）',
                  '加入NaCl发生的是盐析而非变性，加水后沉淀应能溶解'
                ]
              }
            },
            {
              id: 'b2c7s4-004',
              template: 'experimental-reasoning',
              title: '葡萄糖的检验——银镜反应',
              params: {
                goal: '用银镜反应检验葡萄糖',
                principleOptions: ['葡萄糖中的醛基(-CHO)在碱性环境中被银氨溶液氧化为羧基，Ag⁺被还原为Ag', '葡萄糖与AgNO₃直接反应', '葡萄糖在酸性条件下与银氨溶液反应', '葡萄糖使AgNO₃分解'],
                principleCorrectIndex: 0,
                keyStepItems: ['在洁净试管中加入AgNO₃溶液', '用稀氨水逐滴滴入至沉淀恰好溶解（配制银氨溶液）', '加入葡萄糖溶液水浴加热', '观察试管内壁出现光亮的银镜'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['在洁净试管中加入AgNO₃溶液', '用稀氨水逐滴滴入至沉淀恰好溶解（配制银氨溶液）', '加入葡萄糖溶液水浴加热', '观察试管内壁出现光亮的银镜'],
                orderPrompt: '按正确顺序排列银镜反应实验步骤',
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先配制银氨溶液，再加入葡萄糖水浴加热',
                consequenceOptions: ['试管不洁净无法得到光亮的银镜', '银氨溶液久置可能爆炸', '水浴温度过高或过低影响反应', '以上都可能'],
                consequenceCorrectIndex: 3,
                consequencePrompt: '如果试管不洁净会有什么后果？',
                reasoning: [
                  '先配制银氨溶液：AgNO₃溶液+稀氨水至沉淀恰好溶解（AgNO₃+NH₃·H₂O→[Ag(NH₃)₂]OH）',
                  '加入葡萄糖溶液，60-70℃水浴加热——葡萄糖中-CHO被氧化，Ag⁺被还原为Ag附着在试管壁',
                  '试管必须洁净才能获得光亮的银镜；银氨溶液须现配现用，不能久置（易爆炸）'
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'b2-ch8',
      title: '第八章 化学与可持续发展',
      sections: [
        {
          id: 'b2-ch8-sec1',
          title: '第一节 自然资源的开发利用',
          exercises: [
            {
              id: 'b2c8s1-001',
              template: 'redox-reasoning',
              title: '铝热反应',
              params: {
                substances: [
                  { key: 'sub1', formula: 'Al', valences: { Al: 0 } },
                  { key: 'sub2', formula: 'Fe₂O₃', valences: { Fe: 3, O: -2 } }
                ],
                identifyOptions: ['Al是还原剂，Fe₂O₃是氧化剂', 'Al是氧化剂，Fe₂O₃是还原剂', '两者都是还原剂', '两者都是氧化剂'],
                identifyCorrectIndex: 0,
                identifyPrompt: '根据化合价变化，判断氧化剂和还原剂',
                finalEquation: '2Al + Fe₂O₃ ═ 2Fe + Al₂O₃',
                finalHint: '铝热反应放出大量热，用于焊接铁轨',
                reasoning: [
                  'Al从0价升至+3价（Al₂O₃），失电子→还原剂。Fe从+3价降至0价（Fe），得电子→氧化剂',
                  'Al失3e⁻×2=6e⁻，Fe得3e⁻×2=6e⁻，配平为2Al+Fe₂O₃→2Fe+Al₂O₃',
                  '完整的配平：2Al + Fe₂O₃ ═ 2Fe + Al₂O₃，镁条引燃、氯酸钾助燃'
                ]
              }
            },
            {
              id: 'b2c8s1-002',
              template: 'concept-construction',
              title: '金属冶炼方法',
              params: {
                cases: ['电解熔融NaCl制取金属钠', '高炉炼铁用CO还原Fe₂O₃', '加热HgO得到汞'],
                caseOptions: ['电解法', '热还原法', '热分解法'],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '金属冶炼方法与金属活动性的关系',
                conceptName: '金属冶炼方法',
                definitionKeyTerms: ['电解', '热还原', '热分解'],
                definitionHint: '金属越活泼越难冶炼，电解法用于最活泼金属',
                fullDefinition: '金属冶炼的方法与金属活动性有关：K/Ca/Na/Mg/Al用电解法（电解熔融盐或氧化物），Zn/Fe/Cu用热还原法（常用C、CO、H₂、Al作还原剂），Hg/Ag用热分解法。',
                boundaryItems: ['工业上电解NaCl溶液制取金属钠', '铝热反应属于热还原法', '湿法炼铜：Fe+CuSO₄=FeSO₄+Cu', '高炉炼铁用CO还原Fe₂O₃'],
                boundaryCorrectIndices: [1, 2, 3],
                explainPrompt: '为什么电解NaCl溶液不能得到金属钠？',
                explainHint: '电解NaCl溶液时阴极上是什么离子放电？',
                explainKeyTerms: ['H⁺放电', 'OH⁻', '电解熔融态'],
                reasoning: [
                  '电解法用于最活泼金属（K~Al）：电解熔融盐或氧化物，电解NaCl溶液得到NaOH和Cl₂而非Na',
                  '热还原法用于中等活泼金属（Zn~Cu），常用C、CO、H₂、Al作还原剂',
                  '热分解法用于不活泼金属（Hg、Ag）：2HgO ═ 2Hg + O₂↑'
                ]
              }
            },
            {
              id: 'b2c8s1-003',
              template: 'experimental-reasoning',
              title: '海水提溴工艺',
              params: {
                goal: '从海水中提取溴（Br₂）',
                principleOptions: ['利用氧化还原反应将Br⁻氧化为Br₂，再通过吹出、吸收、再氧化提纯', '直接蒸馏海水得到Br₂', '加入AgNO₃沉淀Br⁻', '电解海水得到Br₂'],
                principleCorrectIndex: 0,
                keyStepItems: ['海水浓缩', '用Cl₂氧化Br⁻得到Br₂', '用热空气吹出溴', '用SO₂吸收吹出的Br₂（富集）', '再用Cl₂氧化得到高浓度Br₂'],
                keyStepCorrectIndices: [0, 1, 2, 3, 4],
                orderItems: ['海水浓缩', '用Cl₂氧化Br⁻得到Br₂', '用热空气吹出溴', '用SO₂吸收吹出的Br₂（富集）', '再用Cl₂氧化得到高浓度Br₂'],
                orderPrompt: '按正确顺序排列海水提溴步骤',
                orderCorrect: [0, 1, 2, 3, 4],
                orderHint: '先浓缩，再氧化，再吹出，再吸收富集，最后再氧化',
                consequenceOptions: ['低浓度Br₂运输成本高，无法工业量产', '无法得到Br₂', '溴无法从海水中分离', 'Br₂会挥发到空气中'],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果不进行富集步骤（SO₂吸收），直接氧化吹出后蒸馏会怎样？',
                reasoning: [
                  '海水浓缩后用Cl₂氧化：Cl₂+2Br⁻=Br₂+2Cl⁻（第一次氧化）',
                  '用热空气吹出Br₂，再用SO₂吸收富集：SO₂+Br₂+2H₂O=H₂SO₄+2HBr',
                  '最后用Cl₂再次氧化得到高浓度Br₂：Cl₂+2HBr=Br₂+2HCl，蒸馏得纯溴'
                ]
              }
            },
            {
              id: 'b2c8s1-004',
              template: 'error-analysis',
              title: '海水资源利用常见误解',
              params: {
                statement: '从海带中提取碘的工艺流程为：海带→灼烧→浸泡→过滤→氧化→萃取→蒸馏。其中氧化步骤用Cl₂将I⁻氧化为I₂，该离子方程式为Cl₂ + I⁻ = I₂ + 2Cl⁻。',
                errorOptions: ['"海带→灼烧→浸泡"步骤顺序错误', '"氧化→萃取→蒸馏"步骤错误', '"Cl₂ + I⁻ = I₂ + 2Cl⁻"离子方程式未配平', '以上全部正确'],
                errorCorrectIndex: 2,
                principleKeyTerms: ['电荷守恒', '原子守恒', '配平', '离子方程式'],
                principleHint: '离子方程式的配平需要满足什么守恒？',
                correctVersion: '从海带中提取碘的工艺流程为：海带→灼烧→浸泡→过滤→氧化→萃取→蒸馏。其中氧化步骤用Cl₂将I⁻氧化为I₂，该离子方程式为Cl₂ + 2I⁻ = I₂ + 2Cl⁻。',
                finalHint: '书写离子方程式必须遵循原子守恒和电荷守恒。Cl₂氧化I⁻时，一个Cl₂分子得2个电子，需要2个I⁻各失1个电子。',
                reasoning: [
                  '海带提碘流程正确：灼烧→浸泡→过滤→氧化（Cl₂+2I⁻=I₂+2Cl⁻）→萃取→蒸馏',
                  '错误在于离子方程式未配平——电荷不守恒：左边1个I⁻+Cl₂，右边I₂+2Cl⁻，电荷左-1右-2',
                  '正确：Cl₂ + 2I⁻ = I₂ + 2Cl⁻，一个Cl₂得2e⁻，需要2个I⁻各失1e⁻'
                ]
              }
            }
          ]
        },
        {
          id: 'b2-ch8-sec2',
          title: '第二节 化学品的合理使用',
          exercises: [
            {
              id: 'b2c8s2-001',
              template: 'concept-construction',
              title: '化肥与农药的合理使用',
              params: {
                cases: ['铵态氮肥不能与碱性物质混合使用', '过量使用化肥导致水体富营养化', '农药在作物上会有残留，应控制安全间隔期'],
                caseOptions: ['合理使用化肥', '合理使用农药', '环境保护'],
                caseCorrectIndices: [0, 0, 1],
                caseCommonality: '化学品的合理使用',
                conceptName: '化肥与农药的合理使用',
                definitionKeyTerms: ['氮肥', '磷肥', '钾肥', '农药残留', '环境污染'],
                definitionHint: '化学肥料三大类和农药滥用的后果',
                fullDefinition: '化学肥料主要包括氮肥、磷肥和钾肥三大类。农药的滥用会导致农药残留和环境污染等问题。铵态氮肥不能与碱性物质混合（遇碱放出NH₃损失肥效），过量使用化肥会导致水体富营养化（赤潮、水华）。',
                boundaryItems: ['铵态氮肥遇碱放出NH₃而损失肥效', '水体富营养化会导致赤潮和水华', '合理使用农药应做到对症下药、适时适量', '有机氯农药（如DDT）易在生物体内富集'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么铵态氮肥不能与草木灰（碱性）混合使用？',
                explainHint: '铵盐遇碱会发生什么反应？',
                explainKeyTerms: ['NH₄⁺', 'OH⁻', 'NH₃'],
                reasoning: [
                  '铵态氮肥（含NH₄⁺）遇碱性物质放出NH₃，导致氮元素损失肥效',
                  '过量使用化肥→水体富营养化（N、P过多）→赤潮（海水）和水华（淡水）',
                  '农药应合理使用：对症下药、适时适量、控制安全间隔期，降低残留'
                ]
              }
            },
            {
              id: 'b2c8s2-002',
              template: 'error-analysis',
              title: '药品安全使用常识',
              params: {
                statement: '阿司匹林具有解热镇痛作用，可以长期大量服用。处方药不需要医生处方即可在药店购买。',
                errorOptions: ['"解热镇痛作用"描述错误', '"可以长期大量服用"错误', '"处方药不需要医生处方即可在药店购买"错误', 'B和C均错误'],
                errorCorrectIndex: 3,
                principleKeyTerms: ['长期大量', '副作用', '处方药', '医生处方'],
                principleHint: '阿司匹林能否长期大量服用？处方药的定义是什么？',
                correctVersion: '阿司匹林具有解热镇痛作用，但不能长期大量服用。处方药必须凭执业医师处方才能购买。',
                finalHint: '是药三分毒，任何药品都有一定的毒副作用。处方药和非处方药的主要区别在于是否需要医生处方。',
                reasoning: [
                  '阿司匹林有解热镇痛作用（正确），但不可长期大量服用（有胃肠道副作用等）',
                  '处方药（Rx）必须凭执业医师处方购买，非处方药（OTC）可直接购买',
                  '因此B（长期大量服用错误）和C（处方药不需处方错误）均错误'
                ]
              }
            },
            {
              id: 'b2c8s2-003',
              template: 'comparison-reasoning',
              title: '处方药与非处方药',
              params: {
                conceptA: '处方药（Rx）',
                conceptB: '非处方药（OTC）',
                description: '某药品说明书上标注着"OTC"标识，购买该药品是否需要医生处方？',
                identifyCorrectIndex: 1,
                excludePrompt: '为什么它不可能是处方药？',
                excludeHint: 'OTC标识代表什么含义？',
                excludeKeyTerms: ['OTC', '非处方药', '不需要处方', 'Rx'],
                differenceOptions: ['处方药需医生处方，非处方药可直接购买', '处方药比非处方药便宜', '非处方药效果比处方药好', '两者没有区别'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '患了轻度感冒，想自行购买退烧药，应选择处方药还是非处方药？',
                scenarioOptions: ['非处方药（OTC），安全性较高可直接购买', '处方药（Rx），需要医生处方', '两者都可以', '都不可以'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '处方药（Rx）：用于较重疾病，必须凭执业医师处方购买，用药风险较高',
                  '非处方药（OTC）：用于轻症，安全性较高，可直接购买，按说明书使用',
                  'OTC标识的药品不需要医生处方即可购买'
                ]
              }
            }
          ]
        },
        {
          id: 'b2-ch8-sec3',
          title: '第三节 环境保护与绿色化学',
          exercises: [
            {
              id: 'b2c8s3-001',
              template: 'concept-construction',
              title: '绿色化学的核心思想',
              params: {
                cases: ['某反应中所有原料原子都进入期望产物中，无副产物', '利用太阳能分解水制氢代替电解水', '使用无毒无害的催化剂代替有毒催化剂'],
                caseOptions: ['原子经济性100%', '可再生资源利用', '使用安全化学品'],
                caseCorrectIndices: [0, 0, 2],
                caseCommonality: '绿色化学的核心理念',
                conceptName: '绿色化学',
                definitionKeyTerms: ['源头', '原子利用率'],
                definitionHint: '绿色化学的核心是从源头减少或消除污染',
                fullDefinition: '绿色化学的核心是利用化学原理从源头上减少或消除工业生产对环境的污染。其原子经济性可用原子利用率来衡量（原子利用率=期望产物总质量/反应物总质量×100%），理想反应的原子利用率为100%。',
                boundaryItems: ['绿色化学区别于"先污染后治理"', '催化加氢还原有机废物属于绿色化学', '利用太阳能分解水制氢是绿色化学的体现', '提高反应的选择性可以减少副产物产生'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么绿色化学强调从源头消除污染而非末端治理？',
                explainHint: '源头消除和末端治理的成本和效果有何不同？',
                explainKeyTerms: ['源头消除', '末端治理', '预防为主'],
                reasoning: [
                  '绿色化学从源头消除污染（原子经济性、无毒无害原料），而非先污染后治理',
                  '原子利用率=期望产物总质量/反应物总质量×100%，理想反应原子利用率100%',
                  '利用太阳能、提高反应选择性、使用无毒无害催化剂和溶剂都是绿色化学的体现'
                ]
              }
            },
            {
              id: 'b2c8s3-002',
              template: 'comparison-reasoning',
              title: '绿色化学与传统化学的比较',
              params: {
                conceptA: '绿色化学',
                conceptB: '传统化学（末端治理）',
                description: '某化工生产过程中，通过改进催化剂使副产物大幅减少，原子利用率从60%提高到95%。这体现了哪种化学理念？',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么这不属于传统化学的范畴？',
                excludeHint: '传统化学的特点是先生产再治理，而这里改进的是生产过程本身',
                excludeKeyTerms: ['源头', '原子经济性', '末端治理'],
                differenceOptions: ['绿色化学从源头消除污染，传统化学末端治理污染', '传统化学成本比绿色化学低', '绿色化学不产生任何废物', '传统化学不使用催化剂'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '某工厂采取"先排放废气再建设脱硫装置"的策略，这属于哪种方式？',
                scenarioOptions: ['传统化学（末端治理）', '绿色化学（源头消除）', '清洁生产', '原子经济性反应'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '绿色化学：从源头消除污染，原子经济性高，使用无毒无害原料，减少废物产生',
                  '传统化学：先生产后治理污染，原子经济性低，可能使用有毒有害原料',
                  '改进催化剂提高原子利用率属于绿色化学——从源头减少副产物，而非事后处理'
                ]
              }
            },
            {
              id: 'b2c8s3-003',
              template: 'experimental-reasoning',
              title: '酸雨形成与防治逻辑',
              params: {
                goal: '理解酸雨的形成过程及防治措施',
                principleOptions: ['化石燃料燃烧产生SO₂和NO₃，溶于雨水形成酸雨（pH<5.6）', 'CO₂溶于雨水形成酸雨', '酸雨是自然现象与人类活动无关', '酸雨只由SO₂引起'],
                principleCorrectIndex: 0,
                keyStepItems: ['化石燃料燃烧产生SO₂和NO₃', 'SO₂和NO₃溶于雨水形成酸雨', '烟气脱硫处理（如石灰石-石膏法）', '使用清洁能源减少SO₂排放', '汽车尾气催化转化减少NO₃排放'],
                keyStepCorrectIndices: [0, 1, 2, 3, 4],
                orderItems: ['化石燃料燃烧产生SO₂和NO₃', 'SO₂和NO₃溶于雨水形成酸雨', '烟气脱硫处理（如石灰石-石膏法）', '使用清洁能源减少SO₂排放', '汽车尾气催化转化减少NO₃排放'],
                orderPrompt: '按酸雨形成与防治的逻辑顺序排列',
                orderCorrect: [0, 1, 2, 3, 4],
                orderHint: '先看酸雨如何形成，再看如何防治',
                consequenceOptions: ['酸雨导致土壤酸化、建筑物腐蚀、水体酸化', '温室效应加剧', '臭氧层破坏', '光化学烟雾'],
                consequenceCorrectIndex: 0,
                consequencePrompt: '如果不治理酸雨会有什么环境后果？',
                reasoning: [
                  '酸雨的形成：化石燃料燃烧→SO₂和NO₃→溶于雨水→H₂SO₄和HNO₃（pH<5.6）',
                  'SO₂主要来自燃煤，NO₃主要来自汽车尾气；酸雨导致土壤酸化、建筑物腐蚀',
                  '防治措施：烟气脱硫（石灰石-石膏法）、使用清洁能源、汽车尾气催化转化'
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
