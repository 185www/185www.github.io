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
              id: 'exp-c1s1-001', template: 'procedure-sequencer',
              title: '过滤操作的要点（一贴二低三靠）',
              params: {
                steps: {
                  items: ['将滤纸紧贴漏斗内壁（一贴）', '滤纸边缘低于漏斗边缘（二低之一）', '液面低于滤纸边缘（二低之二）', '烧杯嘴紧靠玻璃棒引流（三靠之一）', '玻璃棒轻靠三层滤纸处（三靠之二）', '漏斗下端紧靠烧杯内壁（三靠之三）'],
                  correctIndices: [0, 1, 2, 3, 4, 5],
                  correctOrder: '一贴 → 二低（滤纸低→液面低） → 三靠（烧杯嘴→玻璃棒→漏斗下端）'
                },
                notes: {
                  items: ['一贴是为了防止滤纸与漏斗壁之间有气泡影响过滤速度', '二低是为了防止液体溢出', '三靠的目的是防止液体溅出和水花四溅', '过滤时玻璃棒起引流作用'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'exp-c1s1-002', template: 'concept-mapper',
              title: '量筒的正确读数方法',
              params: {
                definition: { blank: '用量筒量取液体时，视线应与____保持水平，仰视读数偏____，俯视读数偏____', answer: '凹液面最低处 小 大' },
                attributes: {
                  items: ['仰视造成读数偏小（实际体积偏大）', '俯视造成读数偏大（实际体积偏小）', '量筒读数时视线与凹液面最低处水平', '量筒可用于配制溶液'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['量取9.5mL水应用10mL量筒', '量筒的精度为0.1mL', '量筒可以加热', '量筒可用于稀释浓硫酸'],
                  correctIndices: [0, 1]
                }
              }
            },
            {
              id: 'exp-c1s1-003', template: 'error-detector',
              title: '容量瓶的使用',
              params: {
                statement: '配制100mL 1.00mol/L NaCl溶液时，将称好的NaCl直接倒入容量瓶中，加蒸馏水至刻度线',
                errorLocation: {
                  options: ['NaCl应先在烧杯中溶解，冷却后再转移至容量瓶', 'NaCl应用量筒溶解', '容量瓶可以加热溶解', '加水的操作正确'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['容量瓶不能直接用于溶解固体，物质溶解可能有热效应，应先在烧杯中溶解并冷却至室温后再转移至容量瓶', '量筒不能用于溶解', '容量瓶不能加热', '直接加水操作错误'],
                  correctIndex: 0
                },
                correctVersion: 'NaCl在烧杯中溶解→冷却→用玻璃棒引流转移至容量瓶→洗涤烧杯2-3次→定容→摇匀',
                hint: '容量瓶是精密量器，不能加热或直接溶解固体'
              }
            },
            {
              id: 'exp-c1s1-004', template: 'concept-mapper',
              title: '加热操作的安全要点',
              params: {
                definition: { blank: '试管加热液体时液体体积不超过试管容积的____，试管与桌面成____角，管口____', answer: '1/3 45° 不对人' },
                attributes: {
                  items: ['加热固体时试管口略向下倾斜', '加热液体时试管口向上倾斜45°', '给试管加热时先预热再固定加热', '试管夹夹在试管口处'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['加热固体试管口略向下倾斜（防冷凝水倒流炸裂）', '加热液体试管口不能对着人', '烧杯加热需垫石棉网', '蒸发皿可直接加热'],
                  correctIndices: [0, 1, 2, 3]
                }
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
              id: 'exp-c2s1-001', template: 'equation-builder',
              title: 'O₂的实验室制法',
              params: {
                description: '实验室用加热高锰酸钾的方法制取氧气，写出化学方程式及收集方法',
                reactants: '2KMnO₄',
                reactionType: {
                  options: ['加热分解反应', '化合反应', '置换反应', '复分解反应'],
                  correctIndex: 0
                },
                products: 'K₂MnO₄ + MnO₂ + O₂↑',
                coefficients: ['收集方法：向上排空气法或排水法', '试管口略向下倾斜', '管口放棉花防高锰酸钾粉末堵塞导管'],
                hints: ['KMnO₄中Mn为+7价，分解后生成K₂MnO₄(+6)和MnO₂(+4)，发生歧化']
              }
            },
            {
              id: 'exp-c2s1-002', template: 'equation-builder',
              title: 'CO₂的实验室制法',
              params: {
                description: '实验室用大理石（CaCO₃）与稀盐酸反应制取CO₂，写出化学方程式并说明不用稀硫酸的原因',
                reactants: 'CaCO₃ + 2HCl',
                reactionType: {
                  options: ['复分解反应', '化合反应', '置换反应', '分解反应'],
                  correctIndex: 0
                },
                products: 'CaCl₂ + H₂O + CO₂↑',
                coefficients: ['不用稀H₂SO₄原因：生成CaSO₄微溶，覆盖大理石表面阻止反应', '收集方法：向上排空气法', '验满：燃着的木条放在集气瓶口，熄灭'],
                hints: ['CaCO₃+2HCl→CaCl₂+H₂O+CO₂↑，不能用H₂SO₄或HNO₃']
              }
            },
            {
              id: 'exp-c2s1-003', template: 'comparator',
              title: 'H₂与O₂的收集方法对比',
              params: {
                conceptA: 'H₂的收集',
                conceptB: 'O₂的收集',
                featuresA: {
                  items: ['密度小于空气（Mr=2<29）', '向下排空气法', '也可用排水法', '密度大于空气（Mr=32>29）', '向上排空气法'],
                  correctIndices: [0, 1, 2]
                },
                featuresB: {
                  items: ['密度大于空气（Mr=32>29）', '向上排空气法', '也可用排水法', '密度小于空气', '向下排空气法'],
                  correctIndices: [0, 1, 2]
                },
                difference: {
                  options: ['H₂向下排空气，O₂向上排空气（密度差异）', 'H₂用向上排空气', 'O₂不能用排水法', '两者收集方法相同'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'exp-c2s1-004', template: 'procedure-sequencer',
              title: 'Cl₂的实验室制取与尾气处理',
              params: {
                steps: {
                  items: ['MnO₂与浓HCl混合加热', '用向上排空气法收集Cl₂', '尾气用NaOH溶液吸收', '检验Cl₂已收集满（湿润的淀粉碘化钾试纸）'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: '制气（MnO₂+浓HCl加热）→ 收集（向上排空气）→ 验满（淀粉KI试纸）→ 尾气处理（NaOH溶液）'
                },
                notes: {
                  items: ['MnO₂+4HCl(浓)→△→MnCl₂+Cl₂↑+2H₂O', '浓HCl需过量且加热温度不宜过高（防止HCl挥发过多）', 'Cl₂密度大于空气，用向上排空气法', '尾气必须用NaOH吸收（Cl₂有毒）'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'exp-c2s1-005', template: 'equation-builder',
              title: 'SO₂的实验室制法',
              params: {
                description: '实验室用亚硫酸钠与浓硫酸反应制取SO₂，写出化学方程式',
                reactants: 'Na₂SO₃ + H₂SO₄(浓)',
                reactionType: {
                  options: ['复分解反应（强酸制弱酸）', '氧化还原反应', '化合反应', '分解反应'],
                  correctIndex: 0
                },
                products: 'Na₂SO₄ + SO₂↑ + H₂O',
                coefficients: ['用浓H₂SO₄而非稀H₂SO₄', '收集方法：向上排空气法', '尾气处理：NaOH溶液吸收'],
                hints: ['SO₂密度大于空气，有刺激性气味，有毒']
              }
            },
            {
              id: 'exp-c2s1-006', template: 'error-detector',
              title: 'NH₃的干燥方法',
              params: {
                statement: '实验室制得的NH₃可用浓硫酸干燥后收集',
                errorLocation: {
                  options: ['NH₃是碱性气体，不能用浓H₂SO₄干燥（二者反应）', '浓H₂SO₄可以干燥NH₃', 'NH₃用排水法收集', 'NH₃用向上排空气法收集'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['NH₃+H₂SO₄→(NH₄)₂SO₄，NH₃是碱性气体，浓H₂SO₄是酸性干燥剂，二者反应。干燥NH₃应用碱石灰', '正确', '氨气极易溶于水', 'NH₃密度小于空气'],
                  correctIndex: 0
                },
                correctVersion: 'NH₃用碱石灰干燥（不能用浓H₂SO₄也不能用CaCl₂——CaCl₂与NH₃生成CaCl₂·8NH₃）',
                hint: '碱性气体用碱性干燥剂，酸性气体用酸性干燥剂，中性气体用中性干燥剂'
              }
            },
            {
              id: 'exp-c2s1-007', template: 'concept-mapper',
              title: '排空气集气法',
              params: {
                definition: { blank: '气体密度____于空气用向上排空气法，密度____于空气用向下排空气法，密度接近____的不宜用排空气法', answer: '大 小 29' },
                attributes: {
                  items: ['Mr>29的气体用向上排空气法（如Cl₂ 71、CO₂ 44、SO₂ 64）', 'Mr<29的气体用向下排空气法（如H₂ 2、NH₃ 17、CH₄ 16）', 'CO（Mr=28）密度接近空气，不宜用排空气法', '所有气体都能用排空气法收集'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['O₂（Mr=32）用向上排空气法', 'H₂（Mr=2）用向下排空气法', 'NH₃（Mr=17）用向下排空气法', 'NO（Mr=30）用向上排空气法（实际NO遇O₂反应，只能用排水法）'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'exp-c2s1-008', template: 'concept-mapper',
              title: '干燥剂的选择原则',
              params: {
                definition: { blank: '酸性干燥剂（如浓H₂SO₄）不能干燥____性气体，碱性干燥剂（如碱石灰）不能干燥____性气体', answer: '碱 酸' },
                attributes: {
                  items: ['浓H₂SO₄可干燥CO₂、SO₂、Cl₂（酸性或中性气体）', '碱石灰可干燥NH₃、H₂（碱性或中性气体）', 'CaCl₂可干燥大多数气体（但不能干燥NH₃）', 'NH₃不能用P₂O₅干燥'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['浓H₂SO₄干燥NH₃（错误）', '碱石灰干燥CO₂（错误）', 'CaCl₂干燥Cl₂（正确）', 'P₂O₅干燥HCl（正确）'],
                  correctIndices: [2, 3]
                }
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
              id: 'exp-c3s1-001', template: 'procedure-sequencer',
              title: '蒸馏操作的正确步骤',
              params: {
                steps: {
                  items: ['加碎瓷片（沸石）防暴沸', '通入冷凝水（下进上出）', '加热蒸馏瓶', '温度计水银球放在支管口处', '先通冷凝水后加热'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: '加碎瓷片 → 装温度计 → 通冷凝水 → 加热 → 收集馏分'
                },
                notes: {
                  items: ['冷凝水下进上出可使冷凝管充满水且水流方向与蒸汽方向相反', '温度计水银球在支管口处测量蒸汽温度', '碎瓷片防止暴沸（若忘记加，应冷却后补加）', '先停止加热再停止通冷凝水'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'exp-c3s1-002', template: 'error-detector',
              title: '分液操作',
              params: {
                statement: '分液时，上下两层液体均从分液漏斗下端放出',
                errorLocation: {
                  options: ['上层液体应从分液漏斗上口倒出，不是从下端放出', '上下液体都从下端放是正确的', '分液漏斗不能分离液体', '上层液体从下端放也是正确的'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['下层液体从下端放出后，上层液体应从分液漏斗上口倒出，防止下层液体污染上层液体', '两者都从下端放出是错误的', '分液漏斗可用于分离互不相溶的液体', '从下端放上层液体会被下层液体残留污染'],
                  correctIndex: 0
                },
                correctVersion: '下层液体从下端放出，待下层流完后及时关闭旋塞，上层液体从上口倒出',
                hint: '分液漏斗使用前需要检漏，记住下层下走上走上'
              }
            },
            {
              id: 'exp-c3s1-003', template: 'concept-mapper',
              title: '萃取与分液',
              params: {
                definition: { blank: '萃取是利用溶质在____的溶剂中____不同进行分离的方法，分液用于分离____的液体', answer: '两种互不相溶 溶解度 互不相溶' },
                attributes: {
                  items: ['萃取剂与原溶剂不互溶', '溶质在萃取剂中的溶解度远大于在原溶剂中', '萃取剂与溶质不反应', '用CCl₄萃取碘水中的I₂'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['酒精可萃取碘水中的碘（错误，酒精与水互溶）', 'CCl₄萃取碘水，下层为紫色I₂的CCl₄溶液', '苯萃取碘水，上层为紫色', '汽油可萃取溴水中的Br₂'],
                  correctIndices: [1, 2, 3]
                }
              }
            },
            {
              id: 'exp-c3s1-004', template: 'comparator',
              title: '蒸发结晶与降温结晶的对比',
              params: {
                conceptA: '蒸发结晶',
                conceptB: '降温结晶',
                featuresA: {
                  items: ['适用于溶解度受温度影响小的物质', '通过加热蒸发溶剂使溶质析出', '如从NaCl溶液中得到NaCl晶体', '适用于溶解度受温度影响大的物质', '如从KNO₃溶液中得到KNO₃晶体'],
                  correctIndices: [0, 1, 2]
                },
                featuresB: {
                  items: ['适用于溶解度受温度影响大的物质', '通过降温使溶质析出', '如从KNO₃溶液中得到KNO₃晶体', '通过加热蒸发溶剂使溶质析出', '如从NaCl溶液中得到NaCl晶体'],
                  correctIndices: [0, 1, 2]
                },
                difference: {
                  options: ['溶解度受温度影响小的用蒸发结晶，影响大的用降温结晶', '蒸发结晶需降温', '降温结晶需加热', '两者原理相同'],
                  correctIndex: 0
                }
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
              id: 'exp-c4s1-001', template: 'equation-builder',
              title: 'Cl⁻的检验方法',
              params: {
                description: '检验溶液中是否含有Cl⁻的方法：先加稀HNO₃酸化，再加AgNO₃溶液。写出原理及现象',
                reactants: 'AgNO₃ + Cl⁻（稀HNO₃酸化后）',
                reactionType: {
                  options: ['复分解反应（生成白色沉淀）', '氧化还原反应', '中和反应', '水解反应'],
                  correctIndex: 0
                },
                products: 'AgCl↓ + NO₃⁻',
                coefficients: ['AgCl为白色沉淀，不溶于稀硝酸', '先加稀HNO₃排除CO₃²⁻、PO₄³⁻、SO₃²⁻等干扰'],
                hints: ['一定要先加稀HNO₃酸化，不能加稀H₂SO₄或HCl']
              }
            },
            {
              id: 'exp-c4s1-002', template: 'procedure-sequencer',
              title: 'SO₄²⁻的检验操作顺序',
              params: {
                steps: {
                  items: ['取适量待测液于试管中', '先加过量稀HCl酸化', '无明显现象（排除CO₃²⁻、SO₃²⁻等干扰）', '再加BaCl₂溶液', '产生白色沉淀BaSO₄，证明含SO₄²⁻'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: '取样 → 加稀HCl酸化 → 无现象 → 加BaCl₂ → 白色沉淀'
                },
                notes: {
                  items: ['先加HCl酸化排除CO₃²⁻（产生CO₂气泡）、SO₃²⁻（产生SO₂气体）、Ag⁺（生成AgCl）等干扰', 'BaSO₄白色沉淀不溶于稀盐酸', '不能用稀HNO₃酸化（HNO₃可能将SO₃²⁻氧化为SO₄²⁻）', '不能用稀H₂SO₄酸化（引入SO₄²⁻干扰）'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'exp-c4s1-003', template: 'concept-mapper',
              title: '常见阳离子的检验',
              params: {
                definition: { blank: 'Fe³⁺用____溶液检验，现象为____；NH₄⁺用____溶液加热检验，用____试纸检测气体', answer: 'KSCN 血红色 NaOH 红色石蕊' },
                attributes: {
                  items: ['Fe³⁺+3SCN⁻→Fe(SCN)₃血红色', 'NH₄⁺+OH⁻→△→NH₃↑+H₂O，湿润红色石蕊试纸变蓝', 'Cu²⁺溶液呈蓝色，加NaOH产生蓝色沉淀', 'Fe²⁺加KSCN直接变血红色'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['Fe²⁺加KSCN无现象，再加氯水变红（被氧化为Fe³⁺）', 'K⁺的焰色反应为紫色（透过蓝色钴玻璃）', 'Na⁺的焰色反应为黄色', '所有金属离子都有颜色'],
                  correctIndices: [0, 1, 2]
                }
              }
            },
            {
              id: 'exp-c4s1-004', template: 'error-detector',
              title: 'Fe²⁺与Fe³⁺的检验混淆',
              params: {
                statement: '某溶液中加入KSCN溶液变血红色，证明溶液中含Fe²⁺',
                errorLocation: {
                  options: ['KSCN变血红色是Fe³⁺的特征反应，不能证明Fe²⁺', 'KSCN变血红色证明含Fe²⁺', '变血红色说明不含铁离子', 'KSCN变血红色是Cu²⁺的特征'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['KSCN与Fe³⁺反应生成血红色Fe(SCN)₃，是Fe³⁺的特征反应。检验Fe²⁺应加KSCN无现象后再加氯水变红', '正确现象', 'Fe²⁺不显色', 'Cu²⁺遇KSCN不变红'],
                  correctIndex: 0
                },
                correctVersion: 'Fe³⁺检验：加KSCN→血红色。Fe²⁺检验：加KSCN无现象→再加氯水→变血红色（Fe²⁺被氧化为Fe³⁺）',
                hint: 'Fe³⁺可直接用KSCN检出，Fe²⁺需先氧化再检出'
              }
            },
            {
              id: 'exp-c4s1-005', template: 'equation-builder',
              title: 'I⁻的检验（氧化萃取法）',
              params: {
                description: '检验I⁻时先加氯水氧化，再用CCl₄萃取观察颜色，写出反应原理',
                reactants: '2I⁻ + Cl₂',
                reactionType: {
                  options: ['氧化还原反应', '置换反应', '复分解反应', '化合反应'],
                  correctIndex: 0
                },
                products: 'I₂ + 2Cl⁻',
                coefficients: ['I₂在CCl₄中呈紫色（有机层）', 'CCl₄密度大于水，紫色在下层'],
                hints: ['卤素单质在有机溶剂中的颜色：Cl₂黄绿、Br₂橙红、I₂紫红']
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
              id: 'exp-c5s1-001', template: 'procedure-sequencer',
              title: '中和滴定的操作步骤',
              params: {
                steps: {
                  items: ['检漏并润洗滴定管（用待装液润洗2-3次）', '装液、排气泡、调零读数', '向锥形瓶中加入待测液和指示剂', '滴定（左手控塞，右手摇瓶，眼观颜色变化）', '终点判断（半分钟不褪色）并记录读数'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: '检漏润洗 → 装液排气泡 → 加待测液指示剂 → 滴定 → 终点判断'
                },
                notes: {
                  items: ['滴定管用前用待装液润洗（锥形瓶不能润洗）', '滴定过程左手控制活塞/玻璃球，右手摇动锥形瓶', '眼睛注视锥形瓶内颜色变化而非滴定管刻度', '滴定近终点时需半滴半滴加入'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'exp-c5s1-002', template: 'concept-mapper',
              title: '中和滴定误差分析',
              params: {
                definition: { blank: '滴定误差分析的依据是c(待测)=c(标准)×V(标准)/V(待测)，分析V(标准)的____或____', answer: '偏大 偏小' },
                attributes: {
                  items: ['未用标准液润洗滴定管→V(标)偏大→c(待测)偏高', '滴定管有气泡消失后读数→V(标)偏大→c(待测)偏高', '锥形瓶用待测液润洗→n(待测)偏大→V(标)偏大→c(待测)偏高', '滴定终点俯视读数→V(标)偏小→c(待测)偏低'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['锥形瓶中有蒸馏水不影响（n不变）→c(待测)无影响', '滴定管尖嘴有气泡→V(标)偏小→c(待测)偏低', '振荡时溶液溅出→n(待测)减小→V(标)偏小→c(待测)偏低', '指示剂用量过多会引起误差'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'exp-c5s1-003', template: 'error-detector',
              title: '滴定管读数误差',
              params: {
                statement: '中和滴定终点时俯视滴定管读数，读数为25.00mL，实际消耗标准液体积大于25.00mL',
                errorLocation: {
                  options: ['俯视读数偏小，实际体积大于读数，描述正确', '俯视读数偏大', '俯视读数无影响', '实际体积小于读数'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['俯视滴定管读数时视线偏高，读数偏小，因此实际消耗标准液体积比读数大。导致计算出的c(待测)偏低', '俯视应偏小', '读数有误差', '实际体积正确'],
                  correctIndex: 0
                },
                correctVersion: '俯视滴定管读数：视线偏高→读数偏小→V(标)记录偏小→c(待测)计算值偏低',
                hint: '滴定管0刻度在上，读数从上到下增大，俯视看到的是偏上的刻度（数值偏小）'
              }
            },
            {
              id: 'exp-c5s1-004', template: 'comparator',
              title: '酸式滴定管与碱式滴定管的对比',
              params: {
                conceptA: '酸式滴定管',
                conceptB: '碱式滴定管',
                featuresA: {
                  items: ['下端为玻璃旋塞', '用于盛装酸性或氧化性溶液', '不能盛装碱性溶液（玻璃塞被腐蚀粘连）', '下端为橡胶管+玻璃球', '用于盛装碱性溶液'],
                  correctIndices: [0, 1, 2]
                },
                featuresB: {
                  items: ['下端为橡胶管+玻璃球', '用于盛装碱性溶液', '不能盛装强氧化性溶液（腐蚀橡胶）', '下端为玻璃旋塞', '用于盛装酸性溶液'],
                  correctIndices: [0, 1, 2]
                },
                difference: {
                  options: ['酸式滴定管用玻璃旋塞（耐酸腐蚀），碱式滴定管用橡胶管（耐碱腐蚀）', '酸式滴定管只能装碱', '碱式滴定管只能装酸', '两者完全一样'],
                  correctIndex: 0
                }
              }
            }
          ]
        },
        {
          id: 'exp-ch5-sec2',
          title: '第二节 溶液配制',
          exercises: [
            {
              id: 'exp-c5s2-001', template: 'procedure-sequencer',
              title: '一定物质的量浓度溶液的配制',
              params: {
                steps: {
                  items: ['计算所需溶质的质量或体积', '称量或量取', '在烧杯中溶解/稀释并冷却至室温', '转移至容量瓶（玻璃棒引流）', '洗涤烧杯和玻璃棒2-3次', '定容、摇匀、装瓶贴标签'],
                  correctIndices: [0, 1, 2, 3, 4, 5],
                  correctOrder: '计算 → 称量 → 溶解冷却 → 转移 → 洗涤 → 定容摇匀'
                },
                notes: {
                  items: ['用容量瓶前需检漏', '溶解后需冷却至室温才能转移（热溶液影响体积）', '转移时用玻璃棒引流', '定容时用胶头滴管逐滴加至凹液面最低处与刻度线相切'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'exp-c5s2-002', template: 'concept-mapper',
              title: '配制溶液的误差分析',
              params: {
                definition: { blank: 'c=n/V，称量偏小或溶质损失使n____，定容偏大使V____，都会使c____', answer: '偏小 偏大 偏低' },
                attributes: {
                  items: ['称量时左码右物（使用游码）→n偏小→c偏低', '溶解时未冷却至室温就转移→V偏小→c偏高', '未洗涤烧杯和玻璃棒→n偏小→c偏低', '定容时仰视刻度线→V偏大→c偏低'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['定容时俯视刻度线→V偏小→c偏高', '摇匀后发现液面低于刻度线再加水→V偏大→c偏低', '容量瓶中有少量蒸馏水不影响结果', '转移时溶液溅出→n偏小→c偏低'],
                  correctIndices: [0, 1, 2, 3]
                }
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
              id: 'exp-c6s1-001', template: 'concept-mapper',
              title: '常见试剂的保存方法',
              params: {
                definition: { blank: 'NaOH溶液用____塞（不用玻璃塞），浓HNO₃用____瓶，氢氟酸用____瓶', answer: '橡胶 棕色 塑料' },
                attributes: {
                  items: ['NaOH与玻璃中的SiO₂反应生成Na₂SiO₃会粘连瓶塞', '见光易分解的试剂（浓HNO₃、AgNO₃）用棕色瓶', 'HF腐蚀玻璃，用塑料瓶保存', '金属钠保存在水中'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['金属钠保存在煤油中（密度大于煤油）', '白磷保存在水中（隔绝空气）', '浓H₂SO₄用玻璃塞（浓H₂SO₄不腐蚀玻璃）', '溴用水液封保存（减少挥发）'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'exp-c6s1-002', template: 'error-detector',
              title: 'NaOH溶液的保存',
              params: {
                statement: 'NaOH溶液应装在配有玻璃塞的细口玻璃瓶中',
                errorLocation: {
                  options: ['NaOH溶液应用橡胶塞（与玻璃反应粘连）', '答案正确', 'NaOH溶液应用塑料瓶', 'NaOH溶液不能装在细口瓶中'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['NaOH与玻璃中的SiO₂反应：SiO₂+2NaOH→Na₂SiO₃+H₂O，Na₂SiO₃有黏性，会使玻璃塞粘连，应使用橡胶塞', '正确', '玻璃瓶可以装NaOH', '细口瓶用于装溶液是正确的'],
                  correctIndex: 0
                },
                correctVersion: 'NaOH溶液用细口玻璃瓶盛装，配橡胶塞（或软木塞），不用玻璃塞',
                hint: 'SiO₂ + 2NaOH = Na₂SiO₃ + H₂O，碱性溶液不能用玻璃塞'
              }
            }
          ]
        }
      ]
    }
  ]
};
