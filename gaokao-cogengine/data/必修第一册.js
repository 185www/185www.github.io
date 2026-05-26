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
              id: 'b1c1s1-001', template: 'concept-mapper',
              title: '分散系的分类',
              params: {
                definition: { blank: '分散系按分散质粒子直径分为____、____、____', answer: '溶液 胶体 浊液' },
                attributes: {
                  items: ['胶体粒子直径在1-100nm之间', '溶液是均一稳定的', '浊液是均一透明的', '胶体有丁达尔效应'],
                  correctIndices: [0, 1, 3]
                },
                boundaries: {
                  items: ['蛋白质溶液属于胶体', 'NaCl溶液属于胶体', '烟、雾属于胶体', '悬浊液属于胶体'],
                  correctIndices: [0, 2]
                }
              }
            },
            {
              id: 'b1c1s1-002', template: 'concept-mapper',
              title: '丁达尔效应',
              params: {
                definition: { blank: '丁达尔效应是____特有的现象，用来____', answer: '胶体 区分胶体和溶液' },
                attributes: {
                  items: ['丁达尔效应是胶体粒子对光的散射', '溶液也能产生明显的丁达尔效应', '浊液能产生丁达尔效应', '丁达尔效应是区分胶体和溶液的最简便方法'],
                  correctIndices: [0, 3]
                },
                boundaries: {
                  items: ['激光笔照射Fe(OH)₃胶体出现光路', '激光笔照射NaCl溶液出现光路', '森林中的光柱是丁达尔效应', '雾天车灯光路是丁达尔效应'],
                  correctIndices: [0, 2, 3]
                }
              }
            }
          ]
        },
        {
          id: 'b1-ch1-sec2',
          title: '第二节 离子反应',
          exercises: [
            {
              id: 'b1c1s2-001', template: 'concept-mapper',
              title: '电解质与非电解质的判断',
              params: {
                definition: { blank: '电解质是在____或____下能导电的____', answer: '水溶液中 熔融状态 化合物' },
                attributes: {
                  items: ['单质不是电解质也不是非电解质', '混合物不是电解质也不是非电解质', 'CO₂的水溶液导电，CO₂是电解质', 'NaCl固体不导电，NaCl不是电解质'],
                  correctIndices: [0, 1]
                },
                boundaries: {
                  items: ['HCl是电解质', '蔗糖是非电解质', '铜是电解质', 'NaOH溶液是电解质'],
                  correctIndices: [0, 1]
                }
              }
            },
            {
              id: 'b1c1s2-002', template: 'comparator',
              title: '强电解质与弱电解质的比较',
              params: {
                conceptA: '强电解质',
                conceptB: '弱电解质',
                featuresA: {
                  items: ['完全电离', '部分电离', '溶液中以离子形式存在', '包括强酸、强碱、大多数盐', '包括弱酸、弱碱、水'],
                  correctIndices: [0, 2, 3]
                },
                featuresB: {
                  items: ['完全电离', '部分电离', '存在电离平衡', '包括弱酸弱碱', '离子方程式中写成离子形式'],
                  correctIndices: [1, 2, 3]
                },
                difference: {
                  options: ['电离程度不同', '溶解度不同', '温度敏感度不同', '颜色不同'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'b1c1s2-003', template: 'equation-builder',
              title: '盐酸与NaOH中和反应',
              params: {
                description: '盐酸与氢氧化钠的中和反应',
                reactants: 'HCl + NaOH',
                reactionType: { options: ['复分解反应', '化合反应', '置换反应', '分解反应'], correctIndex: 0 },
                products: 'NaCl + H₂O',
                coefficients: [1, 1, 1, 1],
                hints: ['中和反应属于复分解反应', '产物是盐和水']
              }
            },
            {
              id: 'b1c1s2-004', template: 'equation-builder',
              title: '碳酸钙与盐酸反应',
              params: {
                description: '碳酸钙与盐酸的反应（不拆的固体）',
                reactants: 'CaCO₃ + HCl',
                reactionType: { options: ['复分解反应', '化合反应', '氧化还原反应', '分解反应'], correctIndex: 0 },
                products: 'CaCl₂ + H₂O + CO₂',
                coefficients: [1, 2, 1, 1, 1],
                hints: ['CaCO₃是难溶固体，不拆', '产物是CaCl₂、水和二氧化碳']
              }
            }
          ]
        },
        {
          id: 'b1-ch1-sec3',
          title: '第三节 氧化还原反应',
          exercises: [
            {
              id: 'b1c1s3-001', template: 'concept-mapper',
              title: '氧化还原反应本质与特征',
              params: {
                definition: { blank: '氧化还原反应的本质是____，特征是____', answer: '电子转移（或偏移） 化合价变化' },
                attributes: {
                  items: ['有电子转移的反应一定是氧化还原反应', '化合价变化的反应不一定是氧化还原反应', '氧化还原反应中一定有元素化合价升降', '置换反应一定是氧化还原反应'],
                  correctIndices: [0, 2, 3]
                },
                boundaries: {
                  items: ['Fe + CuSO₄ → FeSO₄ + Cu是氧化还原反应', 'NaOH + HCl → NaCl + H₂O是氧化还原反应', 'Cl₂ + H₂O → HCl + HClO是氧化还原反应', 'CaCO₃ → CaO + CO₂↑是氧化还原反应'],
                  correctIndices: [0, 2]
                }
              }
            },
            {
              id: 'b1c1s3-002', template: 'error-detector',
              title: '氧化还原反应口诀常见错误',
              params: {
                statement: '在氧化还原反应中，"升失氧"的意思是化合价升高的物质被氧化、作氧化剂',
                errorLocation: {
                  options: ['化合价升高的物质', '被氧化', '作氧化剂', '没有错误'],
                  correctIndex: 2
                },
                explanation: {
                  options: ['升失氧→被氧化→作还原剂（还原剂被氧化）', '升失氧→被氧化→作氧化剂', '降得还→被还原→作氧化剂', '以上都不对'],
                  correctIndex: 0
                },
                correctVersion: '升失氧：化合价升高→失电子→被氧化→作还原剂',
                hint: '失电子的是还原剂'
              }
            },
            {
              id: 'b1c1s3-003', template: 'equation-builder',
              title: '铁与硫酸铜的置换反应',
              params: {
                description: '铁与硫酸铜溶液的置换反应（氧化还原）',
                reactants: 'Fe + CuSO₄',
                reactionType: { options: ['置换反应（氧化还原）', '化合反应', '复分解反应', '分解反应'], correctIndex: 0 },
                products: 'FeSO₄ + Cu',
                coefficients: [1, 1, 1, 1],
                hints: ['Fe从0价升到+2价', 'Cu从+2价降到0价']
              }
            },
            {
              id: 'b1c1s3-004', template: 'equation-builder',
              title: '钠在氯气中燃烧',
              params: {
                description: '钠在氯气中燃烧',
                reactants: 'Na + Cl₂',
                reactionType: { options: ['化合反应（氧化还原）', '分解反应', '氧化还原反应', '化合反应（非氧化还原）'], correctIndex: 0 },
                products: 'NaCl',
                coefficients: [2, 1, 2],
                hints: ['Na从0价升到+1价', 'Cl从0价降到-1价']
              }
            },
            {
              id: 'b1c1s3-005', template: 'error-detector',
              title: '配平口诀顺序错误',
              params: {
                statement: '氧化还原反应配平的步骤是：标化合价→求最小公倍数→找升降→配系数→检查氧氢',
                errorLocation: {
                  options: ['标化合价', '求最小公倍数→找升降', '找升降→求最小公倍数', '配系数→检查氧氢'],
                  correctIndex: 2
                },
                explanation: {
                  options: ['应先找升降变化再求最小公倍数', '应先求最小公倍数再找升降', '顺序无影响', '检验应在配平之前'],
                  correctIndex: 0
                },
                correctVersion: '标化合价→找升降→求最小公倍数→配系数→检查氧氢',
                hint: '先标出化合价变化，再找升降数值，最后求最小公倍数'
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
              id: 'b1c2s1-001', template: 'equation-builder',
              title: '钠与氧气常温反应',
              params: {
                description: '钠在空气中常温下被氧化',
                reactants: 'Na + O₂',
                reactionType: { options: ['化合反应（氧化还原）', '氧化还原反应', '化合反应（非氧化还原）', '置换反应'], correctIndex: 0 },
                products: 'Na₂O',
                coefficients: [4, 1, 2],
                hints: ['Na从0价升到+1价', 'O从0价降到-2价', '常温下生成氧化钠']
              }
            },
            {
              id: 'b1c2s1-002', template: 'equation-builder',
              title: '钠在空气中燃烧',
              params: {
                description: '钠在空气中燃烧（注意产物与常温不同）',
                reactants: 'Na + O₂',
                reactionType: { options: ['化合反应（氧化还原）', '分解反应', '置换反应', '氧化还原反应'], correctIndex: 0 },
                products: 'Na₂O₂',
                coefficients: [2, 1, 1],
                hints: ['燃烧产物是过氧化钠', 'Na₂O₂中O为-1价', '产物是淡黄色固体']
              }
            },
            {
              id: 'b1c2s1-003', template: 'procedure-sequencer',
              title: '钠与水反应现象',
              params: {
                steps: {
                  items: ['钠浮在水面', '钠熔化成小球', '钠迅速游动', '发出嘶嘶声', '溶液变红（加酚酞）', '产生气泡'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: [0, 1, 2, 3, 4]
                },
                notes: {
                  items: ['钠的密度小于水', '反应放热使钠熔化', '产生氢气推动小球运动', '生成的NaOH使酚酞变红', '钠与水反应生成O₂'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'b1c2s1-004', template: 'equation-builder',
              title: '钠与水反应',
              params: {
                description: '钠与水的反应',
                reactants: 'Na + H₂O',
                reactionType: { options: ['置换反应（氧化还原）', '复分解反应', '化合反应', '分解反应'], correctIndex: 0 },
                products: 'NaOH + H₂',
                coefficients: [2, 2, 2, 1],
                hints: ['Na从0价升到+1价', 'H从+1价降到0价']
              }
            },
            {
              id: 'b1c2s1-005', template: 'equation-builder',
              title: 'Na₂O₂与H₂O反应',
              params: {
                description: '过氧化钠与水反应（供氧剂原理）',
                reactants: 'Na₂O₂ + H₂O',
                reactionType: { options: ['歧化反应（氧化还原）', '化合反应', '复分解反应', '非氧化还原反应'], correctIndex: 0 },
                products: 'NaOH + O₂',
                coefficients: [2, 2, 4, 1],
                hints: ['Na₂O₂中O为-1价，歧化为0价和-2价', '反应放热']
              }
            },
            {
              id: 'b1c2s1-006', template: 'equation-builder',
              title: 'Na₂O₂与CO₂反应',
              params: {
                description: '过氧化钠与二氧化碳反应（呼吸面具供氧原理）',
                reactants: 'Na₂O₂ + CO₂',
                reactionType: { options: ['歧化反应（氧化还原）', '化合反应', '非氧化还原反应', '置换反应'], correctIndex: 0 },
                products: 'Na₂CO₃ + O₂',
                coefficients: [2, 2, 2, 1],
                hints: ['O从-1价歧化为0价和-2价', '用于呼吸面具和潜水艇供氧']
              }
            },
            {
              id: 'b1c2s1-007', template: 'comparator',
              title: 'Na₂CO₃与NaHCO₃的比较',
              params: {
                conceptA: 'Na₂CO₃（纯碱/苏打）',
                conceptB: 'NaHCO₃（小苏打）',
                featuresA: {
                  items: ['白色粉末', '白色晶体', '易溶于水', '水溶液碱性较强', '受热难分解', '受热易分解', '俗名纯碱或苏打', '俗名小苏打'],
                  correctIndices: [0, 2, 3, 4, 6]
                },
                featuresB: {
                  items: ['白色粉末', '白色晶体', '溶解度小于Na₂CO₃', '水溶液呈弱碱性', '受热难分解', '受热易分解', '俗名小苏打'],
                  correctIndices: [1, 2, 3, 5, 6]
                },
                difference: {
                  options: ['热稳定性不同', '颜色不同', '水溶性不同', '俗名不同'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'b1c2s1-008', template: 'equation-builder',
              title: 'NaHCO₃受热分解',
              params: {
                description: '碳酸氢钠受热分解',
                reactants: 'NaHCO₃',
                reactionType: { options: ['分解反应（非氧化还原）', '分解反应（氧化还原）', '化合反应', '复分解反应'], correctIndex: 0 },
                products: 'Na₂CO₃ + H₂O + CO₂',
                coefficients: [2, 1, 1, 1],
                hints: ['无化合价变化，是非氧化还原反应', '产物是碳酸钠、水和二氧化碳']
              }
            },
            {
              id: 'b1c2s1-009', template: 'procedure-sequencer',
              title: '侯氏制碱法',
              params: {
                steps: {
                  items: ['向饱和食盐水中通入NH₃', '再通入CO₂', '过滤得到NaHCO₃沉淀', '加热NaHCO₃得到Na₂CO₃', '得到NH₄Cl副产物'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: [0, 1, 2, 3, 4]
                },
                notes: {
                  items: ['先通NH₃使溶液呈碱性，利于吸收CO₂', 'NaHCO₃溶解度小，以沉淀形式析出', 'NH₄Cl可作氮肥', '侯氏制碱法的发明者是侯德榜'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'b1c2s1-010', template: 'error-detector',
              title: 'Na₂O₂与SO₂反应产物',
              params: {
                statement: 'Na₂O₂与SO₂反应：Na₂O₂ + SO₂ = Na₂SO₃ + O₂',
                errorLocation: {
                  options: ['反应物Na₂O₂', '反应物SO₂', '产物Na₂SO₃', '产物O₂'],
                  correctIndex: 2
                },
                explanation: {
                  options: ['Na₂O₂有强氧化性，SO₂有还原性，产物应为Na₂SO₄', 'Na₂O₂与SO₂不反应', '应生成Na₂S和O₂', '应生成Na₂SO₃和SO₃'],
                  correctIndex: 0
                },
                correctVersion: 'Na₂O₂ + SO₂ = Na₂SO₄',
                hint: '过氧化钠有强氧化性，将SO₂氧化为SO₄²⁻'
              }
            }
          ]
        },
        {
          id: 'b1-ch2-sec2',
          title: '第二节 氯及其化合物',
          exercises: [
            {
              id: 'b1c2s2-001', template: 'equation-builder',
              title: 'Cl₂与水反应',
              params: {
                description: '氯气与水反应（生成两种酸）',
                reactants: 'Cl₂ + H₂O',
                reactionType: { options: ['歧化反应（氧化还原）', '化合反应', '非氧化还原反应', '置换反应'], correctIndex: 0 },
                products: 'HCl + HClO',
                coefficients: [1, 1, 1, 1],
                hints: ['Cl从0价歧化为-1价和+1价', 'HClO是弱酸，有漂白性']
              }
            },
            {
              id: 'b1c2s2-002', template: 'equation-builder',
              title: 'Cl₂与NaOH反应',
              params: {
                description: '氯气与氢氧化钠反应（制漂白液）',
                reactants: 'Cl₂ + NaOH',
                reactionType: { options: ['歧化反应（氧化还原）', '复分解反应', '化合反应', '氧化还原反应'], correctIndex: 0 },
                products: 'NaCl + NaClO + H₂O',
                coefficients: [1, 2, 1, 1, 1],
                hints: ['Cl₂歧化为Cl⁻和ClO⁻', '用于工业制漂白液']
              }
            },
            {
              id: 'b1c2s2-003', template: 'procedure-sequencer',
              title: 'Cl₂的实验室制法',
              params: {
                steps: {
                  items: ['MnO₂与浓HCl混合', '加热', '用向上排空气法收集Cl₂', '尾气用NaOH吸收', '检查装置气密性'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: [4, 0, 1, 2, 3]
                },
                notes: {
                  items: ['浓HCl需过量', 'MnO₂也可用KMnO₄代替（不用加热）', '用向下排空气法收集', '尾气用NaOH吸收：Cl₂+2NaOH→NaCl+NaClO+H₂O'],
                  correctIndices: [0, 1, 3]
                }
              }
            },
            {
              id: 'b1c2s2-004', template: 'equation-builder',
              title: '漂白粉的制备',
              params: {
                description: '工业制漂白粉：Cl₂与石灰乳反应',
                reactants: 'Cl₂ + Ca(OH)₂',
                reactionType: { options: ['歧化反应（氧化还原）', '复分解反应', '化合反应', '置换反应'], correctIndex: 0 },
                products: 'CaCl₂ + Ca(ClO)₂ + H₂O',
                coefficients: [2, 2, 1, 1, 2],
                hints: ['有效成分是Ca(ClO)₂', '石灰乳即Ca(OH)₂悬浊液']
              }
            },
            {
              id: 'b1c2s2-005', template: 'procedure-sequencer',
              title: 'Cl⁻检验操作步骤',
              params: {
                steps: {
                  items: ['取待测液', '加入稀HNO₃酸化', '加入AgNO₃溶液', '观察是否有白色沉淀'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: [0, 1, 2, 3]
                },
                notes: {
                  items: ['必须先加稀HNO₃排除CO₃²⁻干扰', 'AgCl沉淀不溶于稀HNO₃', 'Ag₂CO₃沉淀溶于稀HNO₃', '直接加AgNO₃即可，不需要酸化'],
                  correctIndices: [0, 1, 2]
                }
              }
            }
          ]
        },
        {
          id: 'b1-ch2-sec3',
          title: '第三节 物质的量',
          exercises: [
            {
              id: 'b1c2s3-001', template: 'concept-mapper',
              title: '物质的量的定义与单位',
              params: {
                definition: { blank: '物质的量是表示____的物理量，符号____，单位____', answer: '含有一定数目粒子的集合体 n mol' },
                attributes: {
                  items: ['1mol任何粒子含有约6.02×10²³个粒子', '物质的量的单位是摩尔', '物质的量就是物质的质量', '物质的量适用于微观粒子'],
                  correctIndices: [0, 1, 3]
                },
                boundaries: {
                  items: ['1mol氢原子可以这样表示', '1mol氧气分子中的氧原子是1mol', '1mol NaCl含有1mol Na⁺和1mol Cl⁻', '物质的量不能用于宏观物体'],
                  correctIndices: [0, 2, 3]
                }
              }
            },
            {
              id: 'b1c2s3-002', template: 'concept-mapper',
              title: 'N、n、M、Vm、c的关系',
              params: {
                definition: { blank: 'n = ____/____，n = ____/____，n = ____/____（气体），c = ____/____', answer: 'N NA m M V Vm n V' },
                attributes: {
                  items: ['摩尔质量的单位是g/mol', '气体摩尔体积标况下为22.4L/mol', '物质的量浓度的单位是mol/L', '摩尔质量在数值上等于相对分子质量'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['标况下1mol任何气体体积都约是22.4L', '标况下H₂O是气体', '气体摩尔体积适用于任何条件下的气体', 'Vm=22.4L/mol只适用于标况（0℃，101kPa）'],
                  correctIndices: [0, 3]
                }
              }
            },
            {
              id: 'b1c2s3-003', template: 'error-detector',
              title: '阿伏加德罗定律常见错误',
              params: {
                statement: '同温同压下，相同体积的任何物质含有相同数目的分子',
                errorLocation: {
                  options: ['同温同压', '相同体积', '任何物质', '相同数目的分子'],
                  correctIndex: 2
                },
                explanation: {
                  options: ['阿伏加德罗定律只适用于气体', '液体和固体不适用此定律', '应改为"同温同压下，相同体积的任何气体含有相同数目的分子"', '以上都对'],
                  correctIndex: 3
                },
                correctVersion: '同温同压下，相同体积的任何气体含有相同数目的分子',
                hint: '阿伏加德罗定律只适用于气体'
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
              id: 'b1c3s1-001', template: 'equation-builder',
              title: '铁在氧气中燃烧',
              params: {
                description: '铁在纯氧中燃烧',
                reactants: 'Fe + O₂',
                reactionType: { options: ['化合反应（氧化还原）', '分解反应', '置换反应'], correctIndex: 0 },
                products: 'Fe₃O₄',
                coefficients: [3, 2, 1],
                hints: ['生成Fe₃O₄不是Fe₂O₃', 'Fe₃O₄是黑色固体，可写成FeO·Fe₂O₃']
              }
            },
            {
              id: 'b1c3s1-002', template: 'equation-builder',
              title: '铁与氯气反应',
              params: {
                description: '铁在氯气中燃烧（强氧化剂）',
                reactants: 'Fe + Cl₂',
                reactionType: { options: ['化合反应（氧化还原）', '置换反应', '复分解反应', '分解反应'], correctIndex: 0 },
                products: 'FeCl₃',
                coefficients: [2, 3, 2],
                hints: ['Cl₂是强氧化剂，Fe直接氧化到+3价', '无论Cl₂量多少都生成FeCl₃']
              }
            },
            {
              id: 'b1c3s1-003', template: 'equation-builder',
              title: '铁与硫反应',
              params: {
                description: '铁粉与硫粉混合加热',
                reactants: 'Fe + S',
                reactionType: { options: ['化合反应（氧化还原）', '置换反应', '复分解反应'], correctIndex: 0 },
                products: 'FeS',
                coefficients: [1, 1, 1],
                hints: ['S的氧化性较弱，Fe只被氧化到+2价', '产物是黑色固体']
              }
            },
            {
              id: 'b1c3s1-004', template: 'equation-builder',
              title: '铁与水蒸气反应',
              params: {
                description: '高温下铁与水蒸气反应',
                reactants: 'Fe + H₂O(g)',
                reactionType: { options: ['置换反应（氧化还原）', '化合反应', '复分解反应', '分解反应'], correctIndex: 0 },
                products: 'Fe₃O₄ + H₂',
                coefficients: [3, 4, 1, 4],
                hints: ['Fe被氧化为Fe₃O₄', 'H₂O中的H被还原为H₂']
              }
            },
            {
              id: 'b1c3s1-005', template: 'equation-builder',
              title: 'Fe(OH)₂被氧化为Fe(OH)₃',
              params: {
                description: 'Fe(OH)₂在空气中被氧化',
                reactants: 'Fe(OH)₂ + O₂ + H₂O',
                reactionType: { options: ['氧化还原反应', '化合反应', '复分解反应', '非氧化还原反应'], correctIndex: 0 },
                products: 'Fe(OH)₃',
                coefficients: [4, 1, 2, 4],
                hints: ['Fe从+2价升到+3价', '颜色变化：白色→灰绿色→红褐色']
              }
            },
            {
              id: 'b1c3s1-006', template: 'comparator',
              title: 'Fe²⁺与Fe³⁺的性质比较',
              params: {
                conceptA: 'Fe²⁺（亚铁离子）',
                conceptB: 'Fe³⁺（铁离子）',
                featuresA: {
                  items: ['浅绿色', '棕黄色', '与KSCN无血红色', '与KSCN显血红色', '有还原性', '有氧化性（较强）', '加Cl₂氧化为Fe³⁺', '加Fe还原为Fe²⁺'],
                  correctIndices: [0, 2, 4, 6]
                },
                featuresB: {
                  items: ['浅绿色', '棕黄色', '与KSCN显血红色', '有较强氧化性', '加Fe还原为Fe²⁺', '加Cl₂氧化为Fe³⁺'],
                  correctIndices: [1, 2, 3, 4]
                },
                difference: {
                  options: ['氧化性强弱不同', '颜色不同', '与KSCN显色反应不同', '以上都是'],
                  correctIndex: 3
                }
              }
            },
            {
              id: 'b1c3s1-007', template: 'equation-builder',
              title: 'FeCl₃腐蚀铜板',
              params: {
                description: 'FeCl₃溶液腐蚀铜制印刷电路板',
                reactants: 'FeCl₃ + Cu',
                reactionType: { options: ['氧化还原反应', '置换反应', '复分解反应', '化合反应'], correctIndex: 0 },
                products: 'FeCl₂ + CuCl₂',
                coefficients: [2, 1, 2, 1],
                hints: ['Fe³⁺被还原为Fe²⁺', 'Cu被氧化为Cu²⁺']
              }
            }
          ]
        },
        {
          id: 'b1-ch3-sec2',
          title: '第二节 金属材料',
          exercises: [
            {
              id: 'b1c3s2-001', template: 'equation-builder',
              title: '铝与盐酸反应',
              params: {
                description: '铝与稀盐酸反应',
                reactants: 'Al + HCl',
                reactionType: { options: ['置换反应（氧化还原）', '复分解反应', '化合反应', '非氧化还原反应'], correctIndex: 0 },
                products: 'AlCl₃ + H₂',
                coefficients: [2, 6, 2, 3],
                hints: ['Al从0价升到+3价', 'H从+1价降到0价']
              }
            },
            {
              id: 'b1c3s2-002', template: 'equation-builder',
              title: '铝与NaOH溶液反应',
              params: {
                description: '铝与氢氧化钠溶液反应（两性特征）',
                reactants: 'Al + NaOH + H₂O',
                reactionType: { options: ['氧化还原反应', '复分解反应', '置换反应', '化合反应'], correctIndex: 0 },
                products: 'NaAlO₂ + H₂',
                coefficients: [2, 2, 2, 2, 3],
                hints: ['Al是唯一既能与酸又能与碱反应放出H₂的金属', '产物是偏铝酸钠和氢气']
              }
            },
            {
              id: 'b1c3s2-003', template: 'equation-builder',
              title: '铝热反应',
              params: {
                description: '铝热反应（铝与氧化铁反应）',
                reactants: 'Al + Fe₂O₃',
                reactionType: { options: ['置换反应（氧化还原）', '化合反应', '复分解反应'], correctIndex: 0 },
                products: 'Fe + Al₂O₃',
                coefficients: [2, 1, 2, 1],
                hints: ['Al从0价升到+3价', 'Fe从+3价降到0价', '大量放热，用于焊接铁轨']
              }
            },
            {
              id: 'b1c3s2-004', template: 'equation-builder',
              title: 'Al(OH)₃的两性（与酸反应）',
              params: {
                description: '氢氧化铝与盐酸反应',
                reactants: 'Al(OH)₃ + HCl',
                reactionType: { options: ['复分解反应', '氧化还原反应', '化合反应', '分解反应'], correctIndex: 0 },
                products: 'AlCl₃ + H₂O',
                coefficients: [1, 3, 1, 3],
                hints: ['复分解反应，无化合价变化', 'Al(OH)₃显碱性']
              }
            },
            {
              id: 'b1c3s2-005', template: 'equation-builder',
              title: 'Al(OH)₃的两性（与碱反应）',
              params: {
                description: '氢氧化铝与NaOH溶液反应',
                reactants: 'Al(OH)₃ + NaOH',
                reactionType: { options: ['复分解反应', '氧化还原反应', '化合反应'], correctIndex: 0 },
                products: 'NaAlO₂ + H₂O',
                coefficients: [1, 1, 1, 2],
                hints: ['Al(OH)₃显两性', '产物是偏铝酸钠和水']
              }
            },
            {
              id: 'b1c3s2-006', template: 'concept-mapper',
              title: '合金的概念与特点',
              params: {
                definition: { blank: '合金是由____熔合而成的具有____的物质', answer: '两种或多种金属（或金属与非金属） 金属特性' },
                attributes: {
                  items: ['合金硬度一般大于成分金属', '合金熔点一般低于成分金属', '合金一定是金属与金属的熔合物', '合金具有金属特性'],
                  correctIndices: [0, 1, 3]
                },
                boundaries: {
                  items: ['黄铜是合金', '不锈钢是合金', '铝合金是合金', '金刚石是合金'],
                  correctIndices: [0, 1, 2]
                }
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
              id: 'b1c4s1-001', template: 'concept-mapper',
              title: '原子结构与组成',
              params: {
                definition: { blank: '原子由____和____组成，其中____决定元素种类，____和____决定核素种类', answer: '原子核 核外电子 质子数 质子数 中子数' },
                attributes: {
                  items: ['质子数=核电荷数=原子序数', '质量数=质子数+中子数', '同种元素原子的中子数一定相同', '质子数相同中子数不同的原子互为同位素'],
                  correctIndices: [0, 1, 3]
                },
                boundaries: {
                  items: ['¹H、²H、³H互为同位素', '¹²C和¹⁴C互为同位素', 'O₂和O₃互为同位素', '¹⁶O和¹⁸O的核外电子数相同'],
                  correctIndices: [0, 1, 3]
                }
              }
            },
            {
              id: 'b1c4s1-002', template: 'concept-mapper',
              title: '元素周期表结构',
              params: {
                definition: { blank: '元素周期表有____个周期、____个族，其中____个主族、____个副族', answer: '7 16 7 7' },
                attributes: {
                  items: ['短周期指第1、2、3周期', '同一周期电子层数相同', '第VIII族有3列', '0族元素化学性质最活泼'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['Na在第3周期IA族', 'He在第1周期0族', 'Fe在第4周期VIII族', 'Cl在第2周期VIIA族'],
                  correctIndices: [0, 1, 2]
                }
              }
            },
            {
              id: 'b1c4s1-003', template: 'concept-mapper',
              title: '核外电子排布规律',
              params: {
                definition: { blank: '核外电子排布遵循____原理、每层最多容纳____个电子、最外层不超过____个电子', answer: '能量最低 2n² 8' },
                attributes: {
                  items: ['电子先排满内层再排外层', '第n层最多容纳2n²个电子', '最外层电子数不超过8个', '次外层电子数不超过18个'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['K层最多2个电子', 'M层最多18个电子', 'Ca的原子结构示意图为+20 2 8 8 2', 'Cl的最外层有7个电子'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            }
          ]
        },
        {
          id: 'b1-ch4-sec2',
          title: '第二节 元素周期律',
          exercises: [
            {
              id: 'b1c4s2-001', template: 'comparator',
              title: '同周期与同主族元素性质递变',
              params: {
                conceptA: '同周期递变（从左到右）',
                conceptB: '同主族递变（从上到下）',
                featuresA: {
                  items: ['原子半径逐渐减小', '原子半径逐渐增大', '金属性逐渐减弱', '金属性逐渐增强', '非金属性逐渐增强', '非金属性逐渐减弱', '最高价氧化物水化物酸性增强'],
                  correctIndices: [0, 2, 4, 6]
                },
                featuresB: {
                  items: ['原子半径逐渐减小', '原子半径逐渐增大', '金属性逐渐减弱', '金属性逐渐增强', '非金属性逐渐增强', '非金属性逐渐减弱', '最高价氧化物水化物碱性增强'],
                  correctIndices: [1, 3, 5, 6]
                },
                difference: {
                  options: ['原子半径变化方向相反', '金属性变化方向相同', '非金属性变化方向相反', 'A和C都是'],
                  correctIndex: 3
                }
              }
            },
            {
              id: 'b1c4s2-002', template: 'concept-mapper',
              title: '元素金属性与非金属性',
              params: {
                definition: { blank: '元素金属性的判断依据：____越强金属性越强；元素非金属性的判断依据：____越强非金属性越强', answer: '单质与水或酸反应置换氢的能力 最高价氧化物水化物的酸性' },
                attributes: {
                  items: ['金属性最强的元素是Fr', '非金属性最强的元素是F', '同周期从左到右金属性增强', '同主族从上到下金属性增强'],
                  correctIndices: [0, 1, 3]
                },
                boundaries: {
                  items: ['Na的金属性比Mg强', 'Cl的非金属性比S强', 'O的非金属性比F强', 'K的金属性比Na强'],
                  correctIndices: [0, 1, 3]
                }
              }
            }
          ]
        },
        {
          id: 'b1-ch4-sec3',
          title: '第三节 化学键',
          exercises: [
            {
              id: 'b1c4s3-001', template: 'concept-mapper',
              title: '化学键类型',
              params: {
                definition: { blank: '化学键主要分为____、____和____三种类型', answer: '离子键 共价键 金属键' },
                attributes: {
                  items: ['离子键是阴阳离子间的静电作用', '共价键是原子间共用电子对', '金属键是金属阳离子与自由电子间的作用', '离子键没有方向性和饱和性'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['NaCl中含有离子键', 'HCl中含有共价键', 'Fe中含有金属键', 'NH₄Cl中只有共价键'],
                  correctIndices: [0, 1, 2]
                }
              }
            },
            {
              id: 'b1c4s3-002', template: 'concept-mapper',
              title: '离子键与共价键的判断',
              params: {
                definition: { blank: '判断离子键的方法：____和非金属（____族）结合通常形成离子键', answer: '活泼金属（IA/IIA） VIA/VIIA' },
                attributes: {
                  items: ['活泼金属与活泼非金属形成离子键', '非金属之间形成共价键', 'NH₄Cl中的NH₄⁺与Cl⁻形成离子键', '所有含金属的化合物都是离子化合物'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['NaCl是离子化合物', 'HCl是共价化合物', 'NaOH含有离子键和共价键', 'AlCl₃是离子化合物'],
                  correctIndices: [0, 1, 2]
                }
              }
            },
            {
              id: 'b1c4s3-003', template: 'concept-mapper',
              title: '电子式与8电子稳定结构',
              params: {
                definition: { blank: '判断8电子结构的公式：____（H为2）。满足此条件则达到8电子稳定结构', answer: '|化合价| + 最外层电子数 = 8' },
                attributes: {
                  items: ['NaCl的电子式中Na⁺没有电子', 'CO₂中C满足8电子', 'BF₃中B不满足8电子（只有6电子）', 'PCl₅中P满足8电子'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['Cl₂中每个Cl满足8电子', 'H₂O中H满足2电子', 'SO₂中S满足8电子', 'N₂中每个N满足8电子'],
                  correctIndices: [0, 1, 3]
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
