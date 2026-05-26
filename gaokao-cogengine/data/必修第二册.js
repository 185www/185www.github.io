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
              template: 'equation-builder',
              title: '二氧化硫与硫化氢反应',
              params: {
                description: '二氧化硫表现出氧化性时，与硫化氢气体反应生成单质硫和水。请配平该反应。',
                reactants: 'SO₂ + H₂S',
                reactionType: { options: ['氧化还原反应', '化合反应', '分解反应', '置换反应'], correctIndex: 0 },
                products: 'S↓ + H₂O',
                coefficients: [1, 2, 3, 2],
                hints: ['SO₂中S为+4价，H₂S中S为-2价，产物S为0价', '电子转移数为4，SO₂得4e⁻，H₂S失2e⁻×2']
              }
            },
            {
              id: 'b2c5s1-002',
              template: 'equation-builder',
              title: '二氧化硫催化氧化',
              params: {
                description: '工业制硫酸的核心反应——二氧化硫在催化剂作用下被氧气氧化为三氧化硫。',
                reactants: 'SO₂ + O₂',
                reactionType: { options: ['化合反应', '氧化还原反应', '分解反应', '置换反应'], correctIndex: 1 },
                products: 'SO₃',
                coefficients: [2, 1, 2],
                hints: ['该反应使用V₂O₅作催化剂', '反应条件为加热', 'SO₃溶于水生成硫酸']
              }
            },
            {
              id: 'b2c5s1-003',
              template: 'error-detector',
              title: '浓硫酸与铜反应中的常见错误',
              params: {
                statement: '铜与浓硫酸在加热条件下反应，产物为硫酸铜、二氧化硫和水。该反应中浓硫酸仅表现酸性，因为硫酸中的硫元素化合价没有变化。',
                errorLocation: { options: ['"产物为硫酸铜、二氧化硫和水"', '"浓硫酸仅表现酸性"', '"硫酸中的硫元素化合价没有变化"', '"铜与浓硫酸在加热条件下反应"'], correctIndex: 1 },
                explanation: { options: ['浓硫酸在该反应中既表现酸性（生成CuSO₄）又表现强氧化性（生成SO₂），硫酸中S从+6价降至+4价', '反应产物不正确，铜与浓硫酸反应不生成二氧化硫', '硫酸中的硫元素确实没有变化，但氢元素化合价降低', '该反应不需要加热即可进行'], correctIndex: 0 },
                correctVersion: '铜与浓硫酸在加热条件下反应，产物为硫酸铜、二氧化硫和水。该反应中浓硫酸既表现酸性（生成CuSO₄）又表现强氧化性（生成SO₂），硫酸中的硫元素从+6价降至+4价。',
                hint: '浓硫酸具有三大特性：吸水性、脱水性和强氧化性。在与金属反应时，浓硫酸通常同时体现酸性和强氧化性。'
              }
            },
            {
              id: 'b2c5s1-004',
              template: 'comparator',
              title: 'SO₂漂白与Cl₂漂白的比较',
              params: {
                conceptA: 'SO₂漂白',
                conceptB: 'Cl₂漂白',
                featuresA: { items: ['漂白原理为化合漂白（可逆）', '使品红褪色后加热可恢复红色', '漂白原理为氧化漂白（不可逆）', '属于物理变化'], correctIndices: [0, 1] },
                featuresB: { items: ['使品红褪色后加热不可恢复', '漂白原理为氧化漂白', '属于化学变化中的氧化反应', '漂白过程无化学反应'], correctIndices: [0, 1, 2] },
                difference: { options: ['SO₂漂白可逆而Cl₂漂白不可逆', 'SO₂漂白效果比Cl₂好', 'Cl₂漂白成本比SO₂低', 'SO₂漂白属于物理变化'], correctIndex: 0 }
              }
            },
            {
              id: 'b2c5s1-005',
              template: 'concept-mapper',
              title: '浓硫酸的三大特性',
              params: {
                definition: { blank: '浓硫酸具有________性（做干燥剂）、________性（使蔗糖变黑）和________性（与金属/非金属反应）。', answer: '吸水、脱水、强氧化' },
                attributes: {
                  items: ['吸水性属于物理变化', '脱水性属于化学变化', '浓硫酸做干燥剂时不可干燥NH₃和H₂S', '浓硫酸在常温下与铁剧烈反应'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['浓硫酸使蓝色胆矾变白体现脱水性', '浓硫酸使蔗糖炭化体现脱水性', '浓硫酸吸水属于化学变化', '浓硫酸与铜反应体现强氧化性和酸性'],
                  correctIndices: [1, 3]
                }
              }
            },
            {
              id: 'b2c5s1-006',
              template: 'procedure-sequencer',
              title: 'SO₄²⁻检验操作步骤',
              params: {
                steps: {
                  items: ['加入过量稀盐酸酸化', '观察是否有白色沉淀生成', '取少量待测液于试管中', '滴加BaCl₂溶液'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: [2, 0, 3, 1]
                },
                notes: {
                  items: ['先加盐酸酸化可排除CO₃²⁻、SO₃²⁻、PO₄³⁻的干扰', '盐酸必须用稀盐酸', 'Ag⁺存在时会产生AgCl白色沉淀干扰检验', 'BaSO₄沉淀为白色不溶于稀盐酸'],
                  correctIndices: [0, 1, 3]
                }
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
              template: 'equation-builder',
              title: '氨的催化氧化',
              params: {
                description: '工业制硝酸的第一步，氨气在催化剂作用下与氧气反应生成一氧化氮和水。',
                reactants: 'NH₃ + O₂',
                reactionType: { options: ['化合反应', '氧化还原反应', '分解反应', '置换反应'], correctIndex: 1 },
                products: 'NO + H₂O',
                coefficients: [4, 5, 4, 6],
                hints: ['NH₃中N为-3价，被氧化为NO中+2价', '需使用铂铑合金作催化剂', '反应条件为高温']
              }
            },
            {
              id: 'b2c5s2-002',
              template: 'equation-builder',
              title: '二氧化氮与水反应',
              params: {
                description: '二氧化氮溶于水生成硝酸和一氧化氮，该反应是工业制硝酸的重要步骤。',
                reactants: 'NO₂ + H₂O',
                reactionType: { options: ['氧化还原反应', '化合反应', '分解反应', '复分解反应'], correctIndex: 0 },
                products: 'HNO₃ + NO',
                coefficients: [3, 1, 2, 1],
                hints: ['NO₂中N为+4价，歧化为HNO₃(+5)和NO(+2)', '每3个NO₂分子参与反应转移2个电子']
              }
            },
            {
              id: 'b2c5s2-003',
              template: 'error-detector',
              title: '硝酸性质辨析',
              params: {
                statement: '硝酸是一种强酸，具有强氧化性。浓硝酸与铜反应生成NO₂，稀硝酸与铜反应生成NO，因此稀硝酸的氧化性强于浓硝酸。',
                errorLocation: { options: ['"硝酸是一种强酸"', '"浓硝酸与铜反应生成NO₂"', '"稀硝酸的氧化性强于浓硝酸"', '"稀硝酸与铜反应生成NO"'], correctIndex: 2 },
                explanation: { options: ['浓硝酸中硝酸浓度更高，氧化性更强；与铜反应时浓硝酸被还原为NO₂（N降1价），稀硝酸被还原为NO（N降3价），价态变化不能直接比较氧化性强弱，实际上浓硝酸氧化性更强', '硝酸不是强酸，是中强酸', '浓硝酸与铜不反应', '稀硝酸与铜反应生成NO₂'], correctIndex: 0 },
                correctVersion: '硝酸是一种强酸，具有强氧化性。浓硝酸与铜反应生成NO₂，稀硝酸与铜反应生成NO。浓硝酸的氧化性强于稀硝酸。',
                hint: '氧化性强弱比较应看反应条件（是否加热、反应剧烈程度），而非还原产物中元素化合价的高低。浓硝酸与铜反应无需加热即可发生。'
              }
            },
            {
              id: 'b2c5s2-004',
              template: 'concept-mapper',
              title: '氨气的性质',
              params: {
                definition: { blank: '氨气是____色有________性气味的气体，密度比空气____，____溶于水，____液化。', answer: '无、刺激、小、极易、易' },
                attributes: {
                  items: ['氨气能使湿润的红色石蕊试纸变蓝', '氨气与HCl气体相遇产生白烟（NH₄Cl）', '氨水是弱碱，NH₃·H₂O完全电离', '氨气具有还原性，可被催化氧化'],
                  correctIndices: [0, 1, 3]
                },
                boundaries: {
                  items: ['液氨常用作制冷剂（利用氨易液化、汽化吸热）', '氨水的成分只有NH₃和H₂O', 'NH₃·H₂O在水溶液中完全电离为NH₄⁺和OH⁻', '氨的催化氧化产物为NO和H₂O'],
                  correctIndices: [0, 3]
                }
              }
            },
            {
              id: 'b2c5s2-005',
              template: 'comparator',
              title: 'NO与NO₂性质比较',
              params: {
                conceptA: '一氧化氮（NO）',
                conceptB: '二氧化氮（NO₂）',
                featuresA: { items: ['无色气体', '不溶于水', '有毒', '与O₂反应生成NO₂'], correctIndices: [0, 1, 2, 3] },
                featuresB: { items: ['红棕色气体', '易溶于水', '有刺激性气味', '与水反应生成HNO₃和NO'], correctIndices: [0, 1, 2, 3] },
                difference: { options: ['NO无色不溶于水，NO₂红棕色易溶于水', 'NO有毒而NO₂无毒', 'NO₂不溶于水，NO溶于水', 'NO和NO₂性质完全相同'], correctIndex: 0 }
              }
            },
            {
              id: 'b2c5s2-006',
              template: 'procedure-sequencer',
              title: '氨气的实验室制备',
              params: {
                steps: {
                  items: ['用向下排空气法收集氨气', '用红色石蕊试纸放在试管口验满', '混合NH₄Cl和Ca(OH)₂固体于试管中加热', '用碱石灰干燥氨气'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: [2, 3, 0, 1]
                },
                notes: {
                  items: ['干燥氨气不能用浓硫酸或无水CaCl₂', '试管口应略向下倾斜', '收集氨气的试管口要塞一团棉花防止对流', '氨气密度比空气大，应用向上排空气法'],
                  correctIndices: [0, 1, 2]
                }
              }
            },
            {
              id: 'b2c5s2-007',
              template: 'equation-builder',
              title: '铜与稀硝酸反应',
              params: {
                description: '铜与稀硝酸反应生成硝酸铜、一氧化氮和水，这是实验室制取NO的方法。',
                reactants: 'Cu + HNO₃(稀)',
                reactionType: { options: ['氧化还原反应', '化合反应', '分解反应', '复分解反应'], correctIndex: 0 },
                products: 'Cu(NO₃)₂ + NO↑ + H₂O',
                coefficients: [3, 8, 3, 2, 4],
                hints: ['Cu从0价升至+2价', 'HNO₃中N从+5价降至+2价', '每3个Cu转移6个电子']
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
              template: 'equation-builder',
              title: '二氧化硅与氢氟酸反应',
              params: {
                description: '氢氟酸能腐蚀玻璃，常用于雕刻玻璃，这是SiO₂与HF的特殊反应。',
                reactants: 'SiO₂ + HF',
                reactionType: { options: ['复分解反应', '氧化还原反应', '化合反应', '置换反应'], correctIndex: 0 },
                products: 'SiF₄↑ + H₂O',
                coefficients: [1, 4, 1, 2],
                hints: ['SiO₂是酸性氧化物但能与HF反应', 'HF要保存在塑料瓶中']
              }
            },
            {
              id: 'b2c5s3-002',
              template: 'error-detector',
              title: '硅与二氧化硅的常见误区',
              params: {
                statement: '光导纤维的主要成分是硅单质（Si），二氧化硅（SiO₂）可用作半导体材料，太阳能电池板的主要成分是SiO₂。',
                errorLocation: { options: ['"光导纤维的主要成分是硅单质"', '"二氧化硅可用作半导体材料"', '"太阳能电池板的主要成分是SiO₂"', '以上全部正确'], correctIndex: 2 },
                explanation: { options: ['光导纤维主要成分是SiO₂，硅单质（Si）用作半导体材料和太阳能电池板，二氧化硅是光导纤维的原料。题干三处描述全部错误', '只有第一处错误', '只有第二处错误', '只有第三处错误'], correctIndex: 0 },
                correctVersion: '光导纤维的主要成分是二氧化硅（SiO₂），硅单质（Si）可用作半导体材料，太阳能电池板的主要成分是硅（Si）。',
                hint: '硅是半导体，二氧化硅是光导纤维。太阳能电池板需要光电转换，使用的是半导体硅而非SiO₂。'
              }
            },
            {
              id: 'b2c5s3-003',
              template: 'concept-mapper',
              title: '硅酸盐材料——传统无机非金属材料',
              params: {
                definition: { blank: '传统硅酸盐材料主要包括____、____和____三大类，其主要原料都含有____。', answer: '水泥、玻璃、陶瓷、SiO₂（或硅酸盐）' },
                attributes: {
                  items: ['生产玻璃的原料是纯碱、石灰石和石英砂', '制造水泥的主要原料是黏土和石灰石', '普通玻璃的组成可表示为Na₂O·CaO·6SiO₂', '陶瓷的原料是高岭土'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['玻璃是一种晶体，有固定的熔沸点', '水泥具有水硬性，与水混合后逐渐硬化', '氢氟酸可用于雕刻玻璃是因为SiO₂与HF反应', 'Na₂SiO₃的水溶液称为水玻璃，常用作黏合剂'],
                  correctIndices: [1, 2, 3]
                }
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
              template: 'comparator',
              title: '放热反应与吸热反应的比较',
              params: {
                conceptA: '放热反应',
                conceptB: '吸热反应',
                featuresA: { items: ['ΔH < 0', '反应物总能量 > 生成物总能量', '燃烧、中和、铝热反应属于放热反应', '大多数分解反应属于放热反应'], correctIndices: [0, 1, 2] },
                featuresB: { items: ['ΔH > 0', '反应物总能量 < 生成物总能量', '大多数分解反应属于吸热反应', 'Ba(OH)₂·8H₂O与NH₄Cl反应属于吸热反应'], correctIndices: [0, 1, 2, 3] },
                difference: { options: ['放热反应ΔH<0，吸热反应ΔH>0', '放热反应不需要加热，吸热反应需要加热', '吸热反应不可能自发进行', '放热反应一定比吸热反应快'], correctIndex: 0 }
              }
            },
            {
              id: 'b2c6s1-002',
              template: 'equation-builder',
              title: '热化学方程式的书写',
              params: {
                description: '1 mol甲烷完全燃烧生成CO₂(气)和H₂O(液)放出890.3 kJ热量，请写出该反应的热化学方程式。',
                reactants: 'CH₄(g) + O₂(g)',
                reactionType: { options: ['放热反应', '吸热反应', '可逆反应', '分解反应'], correctIndex: 0 },
                products: 'CO₂(g) + H₂O(l)',
                coefficients: [1, 2, 1, 2],
                hints: ['热化学方程式必须标注各物质状态：s、l、g、aq', 'ΔH = -890.3 kJ/mol，负值表示放热', '系数加倍时ΔH也相应加倍']
              }
            },
            {
              id: 'b2c6s1-003',
              template: 'error-detector',
              title: '热化学方程式常见错误',
              params: {
                statement: '已知H₂(g) + O₂(g) = H₂O(g) ΔH = -241.8 kJ/mol，则H₂的燃烧热为241.8 kJ/mol。',
                errorLocation: { options: ['"H₂(g) + O₂(g) = H₂O(g)"缺少系数2', '"H₂O(g)"状态应为H₂O(l)', '"燃烧热为241.8 kJ/mol"漏了负号', '以上全部'], correctIndex: 3 },
                explanation: { options: ['燃烧热定义：1 mol物质完全燃烧生成指定产物，H₂应生成液态水，且ΔH应为负值。正确应为H₂(g) + ½O₂(g) = H₂O(l) ΔH = -285.8 kJ/mol', '仅状态错误', '仅符号错误', '仅系数错误'], correctIndex: 0 },
                correctVersion: '已知H₂(g) + ½O₂(g) = H₂O(l) ΔH = -285.8 kJ/mol，则H₂的燃烧热为-285.8 kJ/mol。',
                hint: '燃烧热中水的状态必须是液态（l），且ΔH为负值（放热）。此外热化学方程式要配平。'
              }
            },
            {
              id: 'b2c6s1-004',
              template: 'concept-mapper',
              title: '原电池原理',
              params: {
                definition: { blank: '原电池是将________能转化为________能的装置。负极发生________反应（____电子），正极发生________反应（____电子）。', answer: '化学、电、氧化、失、还原、得' },
                attributes: {
                  items: ['较活泼的金属通常做负极', '电子从负极经外电路流向正极', '电解质溶液中阳离子移向负极', '原电池反应本质是自发进行的氧化还原反应'],
                  correctIndices: [0, 1, 3]
                },
                boundaries: {
                  items: ['Mg-Al-NaOH溶液中原电池中Mg做负极', 'Zn-Cu-H₂SO₄原电池中Zn为负极，发生Zn - 2e⁻ = Zn²⁺', '燃料电池不属于原电池', '原电池中负极发生还原反应'],
                  correctIndices: [1]
                }
              }
            },
            {
              id: 'b2c6s1-005',
              template: 'procedure-sequencer',
              title: '原电池电极判断思路',
              params: {
                steps: {
                  items: ['确定电解质环境（酸性/碱性/中性）', '判断总反应是否为自发氧化还原反应', '根据反应判断正负极（失电子→负极）', '确定两个电极材料及活性差异'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: [1, 3, 0, 2]
                },
                notes: {
                  items: ['活泼金属不一定总是负极，如Mg-Al-NaOH中Al为负极', '正极上发生还原反应，通常是H⁺、O₂或金属离子得电子', '原电池中电子从负极流向正极，电流方向相反', '电解质中阳离子移向负极'],
                  correctIndices: [0, 1, 2]
                }
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
              template: 'concept-mapper',
              title: '影响化学反应速率的因素',
              params: {
                definition: { blank: '影响化学反应速率的外因主要有____、____、____和____等。', answer: '浓度、温度、压强、催化剂' },
                attributes: {
                  items: ['升高温度，反应速率加快（每升高10℃，速率约变为原来的2~4倍）', '增大反应物浓度，反应速率加快', '增大压强对有气体参与的反应一定加快反应速率', '催化剂只加快正反应速率'],
                  correctIndices: [0, 1]
                },
                boundaries: {
                  items: ['增大压强本质是增大气体浓度，对于无气体反应无影响', '催化剂同等程度改变正逆反应速率，平衡不移动', '固体和纯液体的浓度视为常数，增加其量速率不变', '温度对任何反应都有影响'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'b2c6s2-002',
              template: 'error-detector',
              title: '化学平衡状态理解',
              params: {
                statement: '当可逆反应达到平衡时，正反应速率和逆反应速率均为零，各组分浓度相等。',
                errorLocation: { options: ['"正反应速率和逆反应速率均为零"', '"各组分浓度相等"', '以上全部', '以上都不对'], correctIndex: 2 },
                explanation: { options: ['化学平衡是动态平衡，正逆反应速率相等但不为零，各组分浓度保持不变但不一定相等', '只有速率描述错误', '只有浓度描述错误', '描述完全正确'], correctIndex: 0 },
                correctVersion: '当可逆反应达到平衡时，正反应速率等于逆反应速率（不为零），各组分浓度保持不变（不一定相等）。',
                hint: '化学平衡的特征：逆（可逆反应）、等（正=逆≠0）、动（动态平衡）、定（浓度不变）、变（条件改变→平衡移动）。'
              }
            },
            {
              id: 'b2c6s2-003',
              template: 'procedure-sequencer',
              title: '勒夏特列原理的应用',
              params: {
                steps: {
                  items: ['分析条件变化后平衡移动的方向', '判断反应前后气体分子数的变化', '写出可逆反应并标注正逆方向', '确定条件改变的类型（浓度/温度/压强）'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: [2, 3, 1, 0]
                },
                notes: {
                  items: ['催化剂不影响化学平衡，只改变到达平衡时间', '升高温度平衡向吸热方向移动', '增大压强平衡向气体体积减小方向移动', '反应前后气体分子数相等时压强变化不影响平衡'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'b2c6s2-004',
              template: 'equation-builder',
              title: '速率相关化学方程式配平与转化',
              params: {
                description: '对于反应N₂(g) + 3H₂(g) ⇌ 2NH₃(g)，若v(N₂) = 0.2 mol·L⁻¹·min⁻¹，请根据速率之比等于化学计量数之比写出v(H₂)和v(NH₃)。',
                reactants: 'N₂ + 3H₂',
                reactionType: { options: ['化合反应', '可逆反应', '氧化还原反应', '分解反应'], correctIndex: 1 },
                products: '2NH₃',
                coefficients: [1, 3, 2],
                hints: ['v(H₂) = 3v(N₂) = 0.6 mol·L⁻¹·min⁻¹', 'v(NH₃) = 2v(N₂) = 0.4 mol·L⁻¹·min⁻¹', '速率之比=化学计量数之比']
              }
            },
            {
              id: 'b2c6s2-005',
              template: 'comparator',
              title: '平衡移动与速率的关系',
              params: {
                conceptA: '浓度对平衡的影响',
                conceptB: '温度对平衡的影响',
                featuresA: { items: ['增大反应物浓度，平衡正向移动', '减小生成物浓度，平衡正向移动', '改变浓度，平衡常数K不变', '浓度改变速率：正逆速率均瞬间变化'], correctIndices: [0, 1, 2, 3] },
                featuresB: { items: ['升高温度，平衡向吸热方向移动', '降低温度，平衡向放热方向移动', '改变温度，平衡常数K改变', '温度改变速率：正逆速率均瞬间变化'], correctIndices: [0, 1, 2, 3] },
                difference: { options: ['浓度改变不影响K，温度改变会影响K', '浓度改变正逆反应速率不同步，温度改变同步', '浓度只影响正反应速率，温度影响正逆反应速率', '温度对平衡影响更大'], correctIndex: 0 }
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
              template: 'concept-mapper',
              title: '甲烷的结构与性质',
              params: {
                definition: { blank: '甲烷的分子式为____，空间构型为____，键角为____。它是____烃（饱和/不饱和）。', answer: 'CH₄、正四面体、109.5°、饱和' },
                attributes: {
                  items: ['甲烷与氯气在光照下发生取代反应', '甲烷不能使酸性KMnO₄溶液褪色', '甲烷的取代反应产物中CH₃Cl是气体', '甲烷的取代反应是分步进行的'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['甲烷的取代反应中Cl₂可以换成Br₂', 'CH₄与Cl₂取代产物中HCl的量最多', '甲烷与氯气在光照下发生加成反应', '甲烷在空气中燃烧产生淡蓝色火焰'],
                  correctIndices: [0, 1, 3]
                }
              }
            },
            {
              id: 'b2c7s1-002',
              template: 'error-detector',
              title: '烷烃命名常见错误',
              params: {
                statement: 'CH₃CH(CH₃)CH₂CH₃的名称是2-甲基丁烷，它和正戊烷互为同系物。',
                errorLocation: { options: ['"2-甲基丁烷"名称错误', '"和正戊烷互为同系物"表述错误', '以上全部正确', '"CH₃CH(CH₃)CH₂CH₃"结构式书写错误'], correctIndex: 1 },
                explanation: { options: ['2-甲基丁烷与正戊烷分子式均为C₅H₁₂，是同分异构体关系而非同系物（同系物必相差n个CH₂）', '名称错误，应为3-甲基丁烷', '完全正确', '结构式错误'], correctIndex: 0 },
                correctVersion: 'CH₃CH(CH₃)CH₂CH₃的名称是2-甲基丁烷，它和正戊烷互为同分异构体。',
                hint: '同分异构体：分子式相同结构不同。同系物：结构相似，分子组成相差一个或多个CH₂。C₅H₁₂有3种同分异构体。'
              }
            },
            {
              id: 'b2c7s1-003',
              template: 'procedure-sequencer',
              title: '烷烃系统命名步骤',
              params: {
                steps: {
                  items: ['编号使取代基位置编号之和最小', '写出取代基位置、数目和名称', '选择最长碳链为主链', '如果有多条等长碳链，选择含取代基多的为主链'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: [2, 3, 0, 1]
                },
                notes: {
                  items: ['编号从离取代基最近端开始', '当有多个相同取代基时，合并写出，用二、三等表示数目', '不同取代基按顺序规则，简单在前复杂在后', '主链必须选择含碳原子数目最多的链'],
                  correctIndices: [0, 1, 2, 3]
                }
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
              template: 'comparator',
              title: '甲烷与乙烯的性质比较',
              params: {
                conceptA: '甲烷（CH₄）',
                conceptB: '乙烯（C₂H₄）',
                featuresA: { items: ['不能使酸性KMnO₄褪色', '不能使溴水褪色', '与Cl₂在光照下发生取代反应', '通式为CₙH₂ₙ₊₂，饱和烃'], correctIndices: [0, 1, 2, 3] },
                featuresB: { items: ['能使酸性KMnO₄褪色（被氧化）', '能使溴水褪色（加成反应）', '可发生加聚反应生成聚乙烯', '通式为CₙH₂ₙ，不饱和烃'], correctIndices: [0, 1, 2, 3] },
                difference: { options: ['乙烯因含C=C双键而比甲烷活泼，能发生加成和加聚反应', '甲烷是气体而乙烯是液体', '甲烷有毒而乙烯无毒', '甲烷和乙烯都能使溴水褪色'], correctIndex: 0 }
              }
            },
            {
              id: 'b2c7s2-002',
              template: 'equation-builder',
              title: '乙烯与溴的加成反应',
              params: {
                description: '乙烯使溴水褪色，这是乙烯与溴发生加成反应生成1,2-二溴乙烷的过程。',
                reactants: 'CH₂=CH₂ + Br₂',
                reactionType: { options: ['加成反应', '取代反应', '加聚反应', '消去反应'], correctIndex: 0 },
                products: 'CH₂BrCH₂Br',
                coefficients: [1, 1, 1],
                hints: ['C=C双键中的一个键易断裂，发生加成', '1,2-二溴乙烷是无色液体']
              }
            },
            {
              id: 'b2c7s2-003',
              template: 'concept-mapper',
              title: '有机高分子材料',
              params: {
                definition: { blank: '聚乙烯的合成反应类型为________反应，其单体为________，聚乙烯属于________（热塑性/热固性）高分子材料。', answer: '加聚、乙烯、热塑性' },
                attributes: {
                  items: ['聚合反应分为加聚反应和缩聚反应两类', '加聚反应中单体含C=C不饱和键', '聚乙烯可用作食品包装袋', '聚氯乙烯（PVC）可用于食品包装'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['天然橡胶的主要成分是聚异戊二烯', '酚醛树脂属于热固性塑料', '加聚反应产物中只有聚合物没有小分子副产物', '缩聚反应会生成小分子副产物如H₂O'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'b2c7s2-004',
              template: 'procedure-sequencer',
              title: '乙烯使溴水褪色实验现象分析',
              params: {
                steps: {
                  items: ['CH₂=CH₂ + Br₂ → CH₂BrCH₂Br', '观察到溴水的橙红色逐渐褪去', '生成无色油状液体1,2-二溴乙烷', '乙烯通入盛有溴水的试管中'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: [3, 1, 0, 2]
                },
                notes: {
                  items: ['该反应类型为加成反应', '乙烯使溴水褪色可用于鉴别乙烯和甲烷', '乙烯与溴的四氯化碳溶液也发生同样反应', '该反应中Br₂被还原为Br⁻'],
                  correctIndices: [0, 1, 2]
                }
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
              template: 'equation-builder',
              title: '乙醇的催化氧化',
              params: {
                description: '乙醇在铜或银催化下被氧气氧化为乙醛，这是醇类的重要化学反应。',
                reactants: 'CH₃CH₂OH + O₂',
                reactionType: { options: ['氧化反应', '还原反应', '取代反应', '消去反应'], correctIndex: 0 },
                products: 'CH₃CHO + H₂O',
                coefficients: [2, 1, 2, 2],
                hints: ['Cu或Ag作催化剂', '反应中-OH连接的C上脱去两个H', '乙醇被氧化为乙醛，乙醛可继续氧化为乙酸']
              }
            },
            {
              id: 'b2c7s3-002',
              template: 'equation-builder',
              title: '乙醇与钠的反应',
              params: {
                description: '乙醇与钠反应生成乙醇钠和氢气，该反应比水与钠的反应更缓和。',
                reactants: 'CH₃CH₂OH + Na',
                reactionType: { options: ['置换反应', '氧化还原反应', '取代反应', '中和反应'], correctIndex: 1 },
                products: 'CH₃CH₂ONa + H₂↑',
                coefficients: [2, 2, 2, 1],
                hints: ['乙醇中羟基上的氢原子被钠置换', '2个乙醇分子产生1个H₂分子', '反应比水与钠的反应缓和，说明乙醇羟基H的活性比水弱']
              }
            },
            {
              id: 'b2c7s3-003',
              template: 'error-detector',
              title: '酯化反应机理辨析',
              params: {
                statement: '乙醇和乙酸在浓硫酸催化下发生酯化反应生成乙酸乙酯和水。该反应的机理是乙醇脱羟基、乙酸脱氢。',
                errorLocation: { options: ['"乙醇和乙酸在浓硫酸催化下发生酯化反应"', '"生成乙酸乙酯和水"', '"乙醇脱羟基、乙酸脱氢"', '以上全部正确'], correctIndex: 2 },
                explanation: { options: ['酯化反应的机理是"酸脱羟基醇脱氢"，即乙酸脱羟基（-OH），乙醇脱羟基上的氢（H）', '反应物不是乙醇和乙酸', '产物不是乙酸乙酯和水', '不需要浓硫酸催化'], correctIndex: 0 },
                correctVersion: '乙醇和乙酸在浓硫酸催化下发生酯化反应生成乙酸乙酯和水。该反应的机理是乙酸脱羟基、乙醇脱氢（酸脱羟基醇脱氢）。',
                hint: '酯化反应机理可记为：酸脱羟基醇脱氢（-OH来自羧酸，H来自醇羟基）。用同位素¹⁸O标记可证明。'
              }
            },
            {
              id: 'b2c7s3-004',
              template: 'comparator',
              title: '乙醇与乙酸的性质比较',
              params: {
                conceptA: '乙醇（C₂H₅OH）',
                conceptB: '乙酸（CH₃COOH）',
                featuresA: { items: ['官能团为羟基（-OH）', '与Na反应产生H₂', '可发生催化氧化生成乙醛', '与NaHCO₃不反应'], correctIndices: [0, 1, 2, 3] },
                featuresB: { items: ['官能团为羧基（-COOH）', '具有酸性，可使紫色石蕊变红', '与NaHCO₃反应产生CO₂', '能与乙醇发生酯化反应'], correctIndices: [0, 1, 2, 3] },
                difference: { options: ['乙醇显中性，乙酸显酸性；乙酸能与NaHCO₃反应而乙醇不能', '乙醇是液体而乙酸是固体', '乙醇有刺激性气味而乙酸有香味', '乙醇和乙酸不能相互反应'], correctIndex: 0 }
              }
            },
            {
              id: 'b2c7s3-005',
              template: 'procedure-sequencer',
              title: '乙酸乙酯的制备操作顺序',
              params: {
                steps: {
                  items: ['向试管中加入乙醇、乙酸和浓硫酸', '用饱和Na₂CO₃溶液接收产物', '将导管末端伸入饱和Na₂CO₃液面上方', '加热试管，收集乙酸乙酯'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: [0, 1, 2, 3]
                },
                notes: {
                  items: ['加入试剂顺序：乙醇→浓硫酸→乙酸（防止液体飞溅）', '浓硫酸的作用：催化、吸水（使平衡右移）', '饱和Na₂CO₃溶液的作用：吸收乙醇和乙酸，降低乙酸乙酯溶解度', '导管末端不能伸入液面以下（防倒吸）'],
                  correctIndices: [0, 1, 2, 3]
                }
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
              template: 'concept-mapper',
              title: '糖类分类与性质',
              params: {
                definition: { blank: '糖类可分为____（不能水解）、____（水解为2分子单糖）和____（水解为多分子单糖）。葡萄糖的分子式为____。', answer: '单糖、二糖、多糖、C₆H₁₂O₆' },
                attributes: {
                  items: ['葡萄糖能与新制Cu(OH)₂共热产生砖红色沉淀', '葡萄糖能发生银镜反应', '蔗糖水解产物为葡萄糖和果糖', '淀粉和纤维素互为同分异构体'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['淀粉遇碘单质变蓝', '纤维素在人体内不能被消化', '葡萄糖和果糖互为同分异构体', '麦芽糖水解产物为2分子葡萄糖'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'b2c7s4-002',
              template: 'comparator',
              title: '油脂与蛋白质的性质比较',
              params: {
                conceptA: '油脂',
                conceptB: '蛋白质',
                featuresA: { items: ['是高级脂肪酸与甘油形成的酯', '在碱性条件下的水解称为皂化反应', '油（液态）含有C=C键，可加成', '属于酯类化合物'], correctIndices: [0, 1, 2, 3] },
                featuresB: { items: ['水解的最终产物是氨基酸', '盐析是可逆过程（加水恢复）', '变性是不可逆过程（加热/重金属盐）', '遇浓硝酸变黄（颜色反应）'], correctIndices: [0, 1, 2, 3] },
                difference: { options: ['油脂水解产物为甘油+脂肪酸，蛋白质水解产物为氨基酸', '油脂和蛋白质都是高分子化合物', '油脂和蛋白质都不能水解', '蛋白质属于酯类'], correctIndex: 0 }
              }
            },
            {
              id: 'b2c7s4-003',
              template: 'error-detector',
              title: '营养物质性质误区',
              params: {
                statement: '蛋白质的盐析和变性都是不可逆过程。向蛋白质溶液中加入NaCl固体产生沉淀，加水后沉淀不溶解。',
                errorLocation: { options: ['"蛋白质的盐析和变性都是不可逆过程"', '"向蛋白质溶液中加入NaCl固体产生沉淀"', '"加水后沉淀不溶解"', '以上全部错误'], correctIndex: 2 },
                explanation: { options: ['盐析是可逆过程（加入轻金属盐，蛋白质沉淀，加水后恢复溶解）；变性是不可逆过程（加热、重金属盐等使蛋白质失去活性）。加入NaCl发生的盐析，加水应能恢复', '加入NaCl不会产生沉淀', '盐析现象描述错误', '所有描述都正确'], correctIndex: 0 },
                correctVersion: '蛋白质的盐析是可逆过程而变性不可逆。向蛋白质溶液中加入NaCl固体产生沉淀（盐析），加水后沉淀溶解。',
                hint: '盐析：轻金属盐使蛋白质溶解度降低（可逆）。变性：高温、重金属盐、强酸强碱、酒精等使蛋白质结构改变（不可逆）。'
              }
            },
            {
              id: 'b2c7s4-004',
              template: 'procedure-sequencer',
              title: '葡萄糖的检验——银镜反应',
              params: {
                steps: {
                  items: ['加入葡萄糖溶液水浴加热', '在洁净试管中加入AgNO₃溶液', '用稀氨水逐滴滴入至沉淀恰好溶解（配制银氨溶液）', '观察试管内壁出现光亮的银镜'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: [1, 2, 0, 3]
                },
                notes: {
                  items: ['银镜反应需要在碱性环境中进行', '试管必须洁净才能获得光亮的银镜', '水浴加热温度控制在60-70℃', '银氨溶液要现配现用，不能久置'],
                  correctIndices: [0, 1, 2, 3]
                }
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
              template: 'equation-builder',
              title: '铝热反应',
              params: {
                description: '铝热反应用于焊接铁轨和冶炼难熔金属，铝与氧化铁在高温下反应生成铁和氧化铝。',
                reactants: 'Al + Fe₂O₃',
                reactionType: { options: ['氧化还原反应', '化合反应', '分解反应', '复分解反应'], correctIndex: 0 },
                products: 'Fe + Al₂O₃',
                coefficients: [2, 1, 2, 1],
                hints: ['Al从0价升至+3价，Fe从+3价降至0价', '铝热反应放出大量热', '镁条引燃，氯酸钾助燃']
              }
            },
            {
              id: 'b2c8s1-002',
              template: 'concept-mapper',
              title: '金属冶炼方法',
              params: {
                definition: { blank: '金属冶炼的方法与金属活动性有关：K/Ca/Na/Mg/Al用____法，Zn/Fe/Cu用____法，Hg/Ag用____法。', answer: '电解、热还原、热分解' },
                attributes: {
                  items: ['电解法适用于活泼金属（电解熔融盐或氧化物）', '热还原法常用C、CO、H₂、Al作还原剂', '热分解法适用于不活泼金属（Hg、Ag）', '工业上电解熔融NaCl制取钠，电解熔融Al₂O₃制取铝'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['工业上电解NaCl溶液制取金属钠', '铝热反应属于热还原法', '湿法炼铜：Fe + CuSO₄ = FeSO₄ + Cu', '高炉炼铁用CO还原Fe₂O₃'],
                  correctIndices: [1, 2, 3]
                }
              }
            },
            {
              id: 'b2c8s1-003',
              template: 'procedure-sequencer',
              title: '海水提溴工艺',
              params: {
                steps: {
                  items: ['用Cl₂氧化Br⁻得到Br₂', '用SO₂吸收吹出的Br₂（富集）', '用热空气吹出溴', '再用Cl₂氧化得到高浓度Br₂', '海水浓缩'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: [4, 0, 2, 1, 3]
                },
                notes: {
                  items: ['第一次氧化：Cl₂ + 2Br⁻ = Br₂ + 2Cl⁻', '吸收过程：SO₂ + Br₂ + 2H₂O = H₂SO₄ + 2HBr', '第二次氧化后蒸馏得到纯溴', '海水提溴的原理是氧化还原反应'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'b2c8s1-004',
              template: 'error-detector',
              title: '海水资源利用常见误解',
              params: {
                statement: '从海带中提取碘的工艺流程为：海带→灼烧→浸泡→过滤→氧化→萃取→蒸馏。其中氧化步骤用Cl₂将I⁻氧化为I₂，该离子方程式为Cl₂ + I⁻ = I₂ + 2Cl⁻。',
                errorLocation: { options: ['"海带→灼烧→浸泡"步骤顺序错误', '"氧化→萃取→蒸馏"步骤错误', '"Cl₂ + I⁻ = I₂ + 2Cl⁻"离子方程式未配平', '以上全部正确'], correctIndex: 2 },
                explanation: { options: ['离子方程式未配平，电荷不守恒。正确为：Cl₂ + 2I⁻ = I₂ + 2Cl⁻', '工艺流程步骤完全错误', '氧化步骤不应用Cl₂', '全部正确，无错误'], correctIndex: 0 },
                correctVersion: '从海带中提取碘的工艺流程为：海带→灼烧→浸泡→过滤→氧化→萃取→蒸馏。其中氧化步骤用Cl₂将I⁻氧化为I₂，该离子方程式为Cl₂ + 2I⁻ = I₂ + 2Cl⁻。',
                hint: '书写离子方程式必须遵循原子守恒和电荷守恒。Cl₂氧化I⁻时，一个Cl₂分子得2个电子，需要2个I⁻各失1个电子。'
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
              template: 'concept-mapper',
              title: '化肥与农药的合理使用',
              params: {
                definition: { blank: '化学肥料主要包括____、____和____三大类。农药的滥用会导致____和____等问题。', answer: '氮肥、磷肥、钾肥、农药残留、环境污染' },
                attributes: {
                  items: ['铵态氮肥不能与碱性物质混合使用', '过量使用化肥会导致水体富营养化', '农药在作物上会有残留，应控制安全间隔期', '磷肥过量会导致土壤酸化'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['铵态氮肥遇碱放出NH₃而损失肥效', '水体富营养化会导致赤潮和水华', '合理使用农药应做到对症下药、适时适量', '有机氯农药（如DDT）易在生物体内富集'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'b2c8s2-002',
              template: 'error-detector',
              title: '药品安全使用常识',
              params: {
                statement: '阿司匹林具有解热镇痛作用，可以长期大量服用。处方药不需要医生处方即可在药店购买。',
                errorLocation: { options: ['"解热镇痛作用"描述错误', '"可以长期大量服用"错误', '"处方药不需要医生处方即可在药店购买"错误', 'B和C均错误'], correctIndex: 3 },
                explanation: { options: ['阿司匹林虽有解热镇痛作用，但不可长期大量服用（有胃肠道副作用等）；处方药必须凭执业医师处方才能购买', '只有B错误', '只有C错误', 'A也错误'], correctIndex: 0 },
                correctVersion: '阿司匹林具有解热镇痛作用，但不能长期大量服用。处方药必须凭执业医师处方才能购买。',
                hint: '是药三分毒，任何药品都有一定的毒副作用。处方药和非处方药的主要区别在于是否需要医生处方。'
              }
            },
            {
              id: 'b2c8s2-003',
              template: 'comparator',
              title: '处方药与非处方药',
              params: {
                conceptA: '处方药（Rx）',
                conceptB: '非处方药（OTC）',
                featuresA: { items: ['必须凭执业医师处方购买', '用于治疗较重疾病', '用药风险较高', '需要在医生指导下使用'], correctIndices: [0, 1, 2, 3] },
                featuresB: { items: ['不需要医生处方即可购买', '用于轻症或常见症状', '安全性较高，副作用较小', '按说明书或药师指导使用'], correctIndices: [0, 1, 2, 3] },
                difference: { options: ['处方药需医生处方，非处方药可直接购买', '处方药比非处方药便宜', '非处方药效果比处方药好', '两者没有区别'], correctIndex: 0 }
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
              template: 'concept-mapper',
              title: '绿色化学的核心思想',
              params: {
                definition: { blank: '绿色化学的核心是利用化学原理从____上减少或消除工业生产对环境的污染。其原子经济性可用________来衡量。', answer: '源头、原子利用率' },
                attributes: {
                  items: ['原子利用率 = 期望产物总质量 / 反应物总质量 × 100%', '理想反应的原子利用率为100%', '绿色化学提倡使用无毒无害的原料和催化剂', '绿色化学关注处理已经产生的污染'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['绿色化学区别于"先污染后治理"', '催化加氢还原有机废物属于绿色化学', '利用太阳能分解水制氢是绿色化学的体现', '提高反应的选择性可以减少副产物产生'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'b2c8s3-002',
              template: 'comparator',
              title: '绿色化学与传统化学的比较',
              params: {
                conceptA: '绿色化学',
                conceptB: '传统化学（末端治理）',
                featuresA: { items: ['从源头消除污染', '原子经济性高', '使用无毒无害原料', '减少废物产生'], correctIndices: [0, 1, 2, 3] },
                featuresB: { items: ['先生产后治理污染', '原子经济性低', '可能使用有毒有害原料', '废物产生后再处理'], correctIndices: [0, 1, 2, 3] },
                difference: { options: ['绿色化学从源头消除污染，传统化学末端治理污染', '传统化学成本比绿色化学低', '绿色化学不产生任何废物', '传统化学不使用催化剂'], correctIndex: 0 }
              }
            },
            {
              id: 'b2c8s3-003',
              template: 'procedure-sequencer',
              title: '酸雨形成与防治逻辑',
              params: {
                steps: {
                  items: ['SO₂和NO₃溶于雨水形成酸雨', '使用清洁能源减少SO₂排放', '化石燃料燃烧产生SO₂和NO₃', '汽车尾气催化转化减少NO₃排放', '烟气脱硫处理（如石灰石-石膏法）'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: [2, 0, 4, 1, 3]
                },
                notes: {
                  items: ['酸雨的pH < 5.6', 'SO₂主要来自燃煤，NO₃主要来自汽车尾气', '石灰石-石膏法：CaCO₃ → CaO → CaSO₄', '氮氧化物与光化学烟雾有关'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            }
          ]
        }
      ]
    }
  ]
};

