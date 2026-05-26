const 选择性必修3 = {
  textbook: '选择性必修3 有机化学基础',

  chapters: [
    {
      id: 'xb3-ch1',
      title: '第一章 有机化合物的结构特点与研究方法',
      sections: [
        {
          id: 'xb3-ch1-sec1',
          title: '第一节 有机化合物的结构特点',
          exercises: [
            {
              id: 'xb3c1s1-001', template: 'concept-mapper',
              title: '官能团的识别',
              params: {
                definition: { blank: '官能团是决定有机化合物____的____原子或原子团', answer: '化学特性 特殊' },
                attributes: {
                  items: ['碳碳双键C=C是烯烃的官能团', '羟基-OH是醇和酚的官能团', '醛基-CHO是醛的官能团', '苯环是芳香烃的官能团'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['CH₃CH₂OH中含羟基', 'HCHO中含醛基', 'CH₃COOH中含酯基', 'CH₃COOCH₃中含酯基'],
                  correctIndices: [0, 1, 3]
                }
              }
            },
            {
              id: 'xb3c1s1-002', template: 'error-detector',
              title: '同分异构体计数',
              params: {
                statement: '分子式为C₄H₁₀的烷烃有3种同分异构体',
                errorLocation: {
                  options: ['C₄H₁₀只有2种同分异构体', 'C₄H₁₀有4种同分异构体', 'C₄H₁₀不是烷烃', '同分异构体只有1种'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['C₄H₁₀的同分异构体为正丁烷CH₃CH₂CH₂CH₃和异丁烷(CH₃)₂CHCH₃共2种', 'C₄H₁₀有4种碳链异构', 'C₄H₁₀符合CnH₂n₊₂是烷烃', '只有1种不符合丁烷的结构'],
                  correctIndex: 0
                },
                correctVersion: 'C₄H₁₀有2种同分异构体：正丁烷和异丁烷',
                hint: 'C₄H₁₀的碳链只有直链和带支链两种连接方式'
              }
            },
            {
              id: 'xb3c1s1-003', template: 'comparator',
              title: '同系物与同分异构体的区别',
              params: {
                conceptA: '同系物',
                conceptB: '同分异构体',
                featuresA: {
                  items: ['结构相似', '分子组成相差一个或多个CH₂', '通式相同', '分子式相同', '化学性质相似'],
                  correctIndices: [0, 1, 2, 4]
                },
                featuresB: {
                  items: ['结构相似', '分子组成相差一个或多个CH₂', '分子式相同', '结构不同', '通式相同'],
                  correctIndices: [2, 3, 4]
                },
                difference: {
                  options: ['同系物分子式不同，同分异构体分子式相同', '同系物结构不同，同分异构体结构相似', '同系物属于同一类物质', '同分异构体属于同一类物质'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'xb3c1s1-004', template: 'equation-builder',
              title: 'C₄H₁₀O的醇类同分异构体',
              params: {
                description: '分子式为C₄H₁₀O的醇共有几种同分异构体？选择正确答案',
                reactants: 'C₄H₁₀O（醇类，含-OH）',
                reactionType: {
                  options: ['4种', '2种', '3种', '5种'],
                  correctIndex: 0
                },
                products: 'CH₃CH₂CH₂CH₂OH   CH₃CH₂CH(OH)CH₃   (CH₃)₂CHCH₂OH   (CH₃)₃COH',
                coefficients: ['1-丁醇', '2-丁醇', '2-甲基-1-丙醇', '2-甲基-2-丙醇'],
                hints: ['先写碳链异构，再移动-OH位置，注意对称性']
              }
            }
          ]
        },
        {
          id: 'xb3-ch1-sec2',
          title: '第二节 研究有机化合物的一般方法',
          exercises: [
            {
              id: 'xb3c1s2-001', template: 'procedure-sequencer',
              title: '有机物结构确定的步骤',
              params: {
                steps: {
                  items: ['元素分析确定实验式', '质谱法测定相对分子质量确定分子式', '红外光谱检测官能团', '核磁共振氢谱确定氢原子类型'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: '元素分析 → 质谱 → 红外光谱 → 核磁共振氢谱'
                },
                notes: {
                  items: ['元素分析可得出C、H、O等元素的质量分数', '质谱图中最大质荷比就是相对分子质量', '红外光谱可判断官能团种类', '核磁共振氢谱的峰面积比等于氢原子数比'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            }
          ]
        }
      ]
    },

    {
      id: 'xb3-ch2',
      title: '第二章 烃',
      sections: [
        {
          id: 'xb3-ch2-sec1',
          title: '第一节 烷烃',
          exercises: [
            {
              id: 'xb3c2s1-001', template: 'error-detector',
              title: '烷烃的系统命名',
              params: {
                statement: 'CH₃CH(CH₃)CH₂CH₃的正确名称是2-乙基丙烷',
                errorLocation: {
                  options: ['未选最长碳链为主链，应为2-甲基丁烷', '名称正确', '应为3-甲基丁烷', '应为2-乙基丙烷正确'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['最长碳链为4个碳，是丁烷，甲基在2号位，正确名称是2-甲基丁烷', '命名正确', '编号应从左端开始', '乙基不可能在2号位丙烷上'],
                  correctIndex: 0
                },
                correctVersion: '2-甲基丁烷（或异戊烷）',
                hint: '应先选最长碳链为主链，再编号使取代基位次和最小'
              }
            },
            {
              id: 'xb3c2s1-002', template: 'concept-mapper',
              title: '烷烃的化学性质',
              params: {
                definition: { blank: '烷烃在光照下可与____发生____反应，在空气中可____燃烧', answer: '卤素 取代 完全' },
                attributes: {
                  items: ['烷烃在光照下与Cl₂发生取代反应', '烷烃与Br₂水发生加成反应', '烷烃燃烧生成CO₂和H₂O', '甲烷与Cl₂光照反应是连锁反应'],
                  correctIndices: [0, 2, 3]
                },
                boundaries: {
                  items: ['CH₄+Cl₂→光照→CH₃Cl+HCl', 'CH₄+Cl₂→光照→CH₂Cl₂+HCl', 'CH₄使酸性KMnO₄褪色', 'CH₄与Cl₂的取代反应可生成四种氯代物'],
                  correctIndices: [0, 1, 3]
                }
              }
            }
          ]
        },
        {
          id: 'xb3-ch2-sec2',
          title: '第二节 烯烃 炔烃',
          exercises: [
            {
              id: 'xb3c2s2-001', template: 'equation-builder',
              title: '乙烯与溴的加成反应',
              params: {
                description: '乙烯使溴的四氯化碳溶液褪色，写出反应的化学方程式及反应类型',
                reactants: 'CH₂=CH₂ + Br₂',
                reactionType: {
                  options: ['加成反应', '取代反应', '消去反应', '氧化反应'],
                  correctIndex: 0
                },
                products: 'CH₂BrCH₂Br',
                coefficients: ['1,2-二溴乙烷', '反应条件：常温', '溴水褪色现象'],
                hints: ['C=C双键打开，Br原子分别加在两个C上']
              }
            },
            {
              id: 'xb3c2s2-002', template: 'comparator',
              title: '烯烃与炔烃的对比',
              params: {
                conceptA: '烯烃',
                conceptB: '炔烃',
                featuresA: {
                  items: ['通式CnH₂n', '含C=C双键', '可使溴水褪色', '可发生加聚反应', '通式CnH₂n₋₂'],
                  correctIndices: [0, 1, 2, 3]
                },
                featuresB: {
                  items: ['通式CnH₂n₋₂', '含C≡C三键', '可使溴水褪色', '可发生加成反应', '可与银氨溶液反应生成沉淀（端基炔）'],
                  correctIndices: [0, 1, 2, 3, 4]
                },
                difference: {
                  options: ['炔烃的不饱和度更大，可发生更多步加成', '烯烃不能使溴水褪色', '炔烃不可加聚', '烯烃通式与炔烃相同'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'xb3c2s2-003', template: 'equation-builder',
              title: '乙炔与HCl的加成反应',
              params: {
                description: '乙炔与HCl在催化剂作用下发生加成反应生成氯乙烯，写出化学方程式',
                reactants: 'HC≡CH + HCl',
                reactionType: {
                  options: ['加成反应', '取代反应', '消去反应', '聚合反应'],
                  correctIndex: 0
                },
                products: 'CH₂=CHCl',
                coefficients: ['氯乙烯（PVC单体）', '催化剂：HgCl₂', '反应条件：加热'],
                hints: ['C≡C三键部分打开，H和Cl分加在两个C上，生成含C=C的产物']
              }
            },
            {
              id: 'xb3c2s2-004', template: 'procedure-sequencer',
              title: '乙烯的实验室制法',
              params: {
                steps: {
                  items: ['将乙醇和浓H₂SO₄混合加热至170℃', '加入碎瓷片防暴沸', '用排水集气法收集乙烯', '检查装置气密性'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: '检查气密性 → 加碎瓷片 → 加热至170℃ → 收集乙烯'
                },
                notes: {
                  items: ['温度计水银球插入液面下', '浓H₂SO₄作催化剂和脱水剂', '温度控制在170℃避免生成乙醚', '乙烯不能用排空气法收集（密度与空气接近）'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            }
          ]
        },
        {
          id: 'xb3-ch2-sec3',
          title: '第三节 芳香烃',
          exercises: [
            {
              id: 'xb3c2s3-001', template: 'concept-mapper',
              title: '苯的化学性质',
              params: {
                definition: { blank: '苯分子中的碳碳键是介于____和____之间的____键，可发生____反应和____反应', answer: '单键 双键 独特 取代 加成' },
                attributes: {
                  items: ['苯不能使酸性KMnO₄褪色', '苯在FeBr₃催化下与液溴发生取代', '苯与浓HNO₃和浓H₂SO₄发生硝化反应', '苯与H₂在Ni催化下可加成生成环己烷'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['甲苯能使酸性KMnO₄褪色（侧链氧化）', '苯使溴水褪色（萃取，非反应）', '苯与Br₂的CCl₄溶液反应', '苯在光照下与Cl₂发生取代（侧链）'],
                  correctIndices: [0, 1, 3]
                }
              }
            },
            {
              id: 'xb3c2s3-002', template: 'comparator',
              title: '苯与甲苯的化学性质对比',
              params: {
                conceptA: '苯',
                conceptB: '甲苯',
                featuresA: {
                  items: ['不与酸性KMnO₄反应', '可发生硝化反应（生成硝基苯）', '可发生溴代反应', '可被酸性KMnO₄氧化', '侧链可发生取代反应'],
                  correctIndices: [0, 1, 2]
                },
                featuresB: {
                  items: ['能被酸性KMnO₄氧化（侧链被氧化为-COOH）', '可发生硝化反应（生成TNT）', '可发生溴代反应（侧链光照取代）', '不与酸性KMnO₄反应', '甲基使苯环活化'],
                  correctIndices: [0, 1, 2, 4]
                },
                difference: {
                  options: ['甲苯的甲基使苯环活化，且侧链可被KMnO₄氧化', '苯比甲苯活泼', '甲苯不能硝化', '苯能发生侧链反应'],
                  correctIndex: 0
                }
              }
            }
          ]
        }
      ]
    },

    {
      id: 'xb3-ch3',
      title: '第三章 烃的衍生物',
      sections: [
        {
          id: 'xb3-ch3-sec1',
          title: '第一节 卤代烃',
          exercises: [
            {
              id: 'xb3c3s1-001', template: 'comparator',
              title: '卤代烃的取代反应与消去反应',
              params: {
                conceptA: '取代反应（水解）',
                conceptB: '消去反应',
                featuresA: {
                  items: ['条件：NaOH水溶液加热', '生成醇', '反应中C-X键断裂', '条件：NaOH醇溶液加热', '生成烯烃'],
                  correctIndices: [0, 1, 2]
                },
                featuresB: {
                  items: ['条件：NaOH醇溶液加热', '生成烯烃（或炔烃）', '脱去HX小分子', '条件：NaOH水溶液加热', '生成醇'],
                  correctIndices: [0, 1, 2]
                },
                difference: {
                  options: ['水解生成醇（羟基取代卤素），消去生成烯烃（脱HX）', '反应条件相同', '产物相同', '反应物不同'],
                  correctIndex: 0
                }
              }
            }
          ]
        },
        {
          id: 'xb3-ch3-sec2',
          title: '第二节 醇酚',
          exercises: [
            {
              id: 'xb3c3s2-001', template: 'equation-builder',
              title: '乙醇的催化氧化',
              params: {
                description: '乙醇在Cu或Ag催化下被O₂氧化为乙醛，写出化学方程式',
                reactants: '2CH₃CH₂OH + O₂',
                reactionType: {
                  options: ['催化氧化反应', '消去反应', '取代反应', '还原反应'],
                  correctIndex: 0
                },
                products: '2CH₃CHO + 2H₂O',
                coefficients: ['催化剂：Cu或Ag', '反应条件：加热', '现象：铜丝由黑变红（CuO→Cu）'],
                hints: ['醇的催化氧化：-OH上的H和α-C上的H脱去形成C=O']
              }
            },
            {
              id: 'xb3c3s2-002', template: 'concept-mapper',
              title: '乙醇的化学性质',
              params: {
                definition: { blank: '乙醇与Na反应生成____和____，在浓H₂SO₄作用下170℃发生____反应生成____', answer: '乙醇钠 H₂ 消去 乙烯' },
                attributes: {
                  items: ['2CH₃CH₂OH+2Na→2CH₃CH₂ONa+H₂↑', '乙醇在浓H₂SO₄ 170℃下消去生成乙烯', '乙醇在浓H₂SO₄ 140℃下分子间脱水生成乙醚', '乙醇可与NaOH反应'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['乙醇使酸性KMnO₄褪色', '乙醇可被酸性KMnO₄氧化为乙酸', '乙醇不能发生酯化反应', '乙醇与HBr反应生成溴乙烷（取代）'],
                  correctIndices: [0, 1, 3]
                }
              }
            },
            {
              id: 'xb3c3s2-003', template: 'error-detector',
              title: '苯酚的性质判断',
              params: {
                statement: '苯酚与NaHCO₃溶液反应生成CO₂气体，证明苯酚的酸性比碳酸强',
                errorLocation: {
                  options: ['苯酚的酸性弱于碳酸，不能与NaHCO₃反应', '苯酚与NaHCO₃反应产生CO₂', '苯酚不与NaOH反应', '苯酚不是酸'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['苯酚的酸性比H₂CO₃弱（Ka：苯酚<碳酸），只能与NaOH反应，不能与NaHCO₃反应', '苯酚酸性强于碳酸', '苯酚是强酸', '正确'],
                  correctIndex: 0
                },
                correctVersion: '苯酚能与NaOH反应生成苯酚钠，但不能与NaHCO₃反应。苯酚遇FeCl₃显紫色',
                hint: '酸性强弱：H₂CO₃ > 苯酚 > HCO₃⁻'
              }
            },
            {
              id: 'xb3c3s2-004', template: 'equation-builder',
              title: '苯酚与溴水的取代反应',
              params: {
                description: '苯酚与浓溴水反应生成白色沉淀，写出化学方程式',
                reactants: 'C₆H₅OH + 3Br₂',
                reactionType: {
                  options: ['取代反应', '加成反应', '氧化反应', '消去反应'],
                  correctIndex: 0
                },
                products: 'C₆H₂Br₃OH↓ + 3HBr',
                coefficients: ['2,4,6-三溴苯酚（白色沉淀）', '用于苯酚的定性检验和定量测定'],
                hints: ['酚羟基使苯环上邻对位H活性增强，容易被Br取代']
              }
            }
          ]
        },
        {
          id: 'xb3-ch3-sec3',
          title: '第三节 醛酮',
          exercises: [
            {
              id: 'xb3c3s3-001', template: 'procedure-sequencer',
              title: '银镜反应的操作步骤',
              params: {
                steps: {
                  items: ['向AgNO₃溶液中逐滴滴加氨水至沉淀恰好溶解', '加入乙醛溶液水浴加热', '试管用NaOH溶液煮沸洗净', '观察光亮的银镜产生'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: '洗净试管 → 配制银氨溶液 → 加乙醛水浴加热 → 观察银镜'
                },
                notes: {
                  items: ['银氨溶液要现配现用', '水浴加热不能直接加热', '试管必须洁净才能形成光亮的银镜', '反应后银镜可用稀HNO₃洗去'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'xb3c3s3-002', template: 'comparator',
              title: '醛基检验方法的对比',
              params: {
                conceptA: '银镜反应',
                conceptB: '与新制Cu(OH)₂反应',
                featuresA: {
                  items: ['试剂为银氨溶液[Ag(NH₃)₂]OH', '产物为光亮的银镜', '需水浴加热', '反应后生成砖红色沉淀', '试剂要现配现用'],
                  correctIndices: [0, 1, 2, 4]
                },
                featuresB: {
                  items: ['试剂为新制Cu(OH)₂悬浊液', '产物为砖红色Cu₂O沉淀', '需加热至沸腾', '需在碱性条件下反应', '产生光亮的银镜'],
                  correctIndices: [0, 1, 2, 3]
                },
                difference: {
                  options: ['银镜反应产生Ag，Cu(OH)₂反应产生Cu₂O，现象和试剂不同', '试剂相同', '现象相同', '条件相同'],
                  correctIndex: 0
                }
              }
            }
          ]
        },
        {
          id: 'xb3-ch3-sec4',
          title: '第四节 羧酸 羧酸衍生物',
          exercises: [
            {
              id: 'xb3c3s4-001', template: 'equation-builder',
              title: '乙酸与乙醇的酯化反应',
              params: {
                description: '乙酸和乙醇在浓H₂SO₄作用下发生酯化反应生成乙酸乙酯，写出化学方程式及反应机理',
                reactants: 'CH₃COOH + C₂H₅OH',
                reactionType: {
                  options: ['酯化反应（取代反应）', '加成反应', '消去反应', '氧化反应'],
                  correctIndex: 0
                },
                products: 'CH₃COOC₂H₅ + H₂O',
                coefficients: ['催化剂：浓H₂SO₄', '反应条件：加热', '可逆反应，用可逆符号⇌'],
                hints: ['酸脱羟基醇脱氢——羧酸脱-OH，醇脱-H']
              }
            },
            {
              id: 'xb3c3s4-002', template: 'concept-mapper',
              title: '乙酸的化学性质',
              params: {
                definition: { blank: '乙酸具有____性（能使石蕊变红），可与醇发生____反应，是一种____酸', answer: '酸 酯化 弱' },
                attributes: {
                  items: ['CH₃COOH⇌CH₃COO⁻+H⁺（弱酸性）', 'CH₃COOH+NaOH→CH₃COONa+H₂O', 'CH₃COOH+NaHCO₃→CH₃COONa+CO₂↑+H₂O', '乙酸酸性强于碳酸'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['乙酸能与金属Na反应生成H₂', '乙酸能与Cu(OH)₂反应使沉淀溶解', '乙酸不能与Na₂CO₃反应', '乙酸与乙醇在浓H₂SO₄下发生酯化'],
                  correctIndices: [0, 1, 3]
                }
              }
            },
            {
              id: 'xb3c3s4-003', template: 'error-detector',
              title: '酯化反应的机理',
              params: {
                statement: '酯化反应的机理是酸脱氢醇脱羟基，即羧酸提供H原子，醇提供-OH',
                errorLocation: {
                  options: ['酯化反应是酸脱羟基醇脱氢，说反了', '说法正确', '酯化反应不需要脱水', '酯化反应是氧化反应'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['酯化反应中羧酸脱去-OH（羟基），醇脱去-H（氢），二者结合生成水，剩余部分连接成酯', '正确', '酯化不生成水', '不是氧化反应'],
                  correctIndex: 0
                },
                correctVersion: '酯化反应机理：酸脱羟基醇脱氢。RCOOH + R\'OH → RCOOR\' + H₂O',
                hint: '用同位素¹⁸O标记醇中的氧，发现¹⁸O出现在酯中而非水中，为酸脱羟基提供了证据'
              }
            },
            {
              id: 'xb3c3s4-004', template: 'procedure-sequencer',
              title: '乙酸乙酯制备实验的操作',
              params: {
                steps: {
                  items: ['向试管中加入乙醇、乙酸和浓H₂SO₄', '用饱和Na₂CO₃溶液接收产物', '加热使反应发生', '振荡后静置分液得乙酸乙酯'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: '加试剂 → 加热反应 → 饱和Na₂CO₃接收 → 分液提纯'
                },
                notes: {
                  items: ['浓H₂SO₄作催化剂和吸水剂', '饱和Na₂CO₃溶液可吸收乙醇、中和乙酸、减小酯的溶解度', '导管口在液面上方（防倒吸）', '振荡时会有气泡产生（CO₂）'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            }
          ]
        },
        {
          id: 'xb3-ch3-sec5',
          title: '第五节 有机合成',
          exercises: [
            {
              id: 'xb3c3s5-001', template: 'procedure-sequencer',
              title: '由乙醇合成乙酸的路线',
              params: {
                steps: {
                  items: ['乙醇在Cu催化下氧化为乙醛', '乙醛再氧化为乙酸', '乙醇先发生消去反应或直接氧化', '分离提纯得到乙酸'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: '乙醇 → 乙醛（催化氧化） → 乙酸（氧化） → 提纯'
                },
                notes: {
                  items: ['CH₃CH₂OH→Cu/△→CH₃CHO', 'CH₃CHO→催化剂/O₂→CH₃COOH', '醇→醛→酸是官能团转化的典型路线', '也可用酸性KMnO₄直接将乙醇氧化为乙酸'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            }
          ]
        }
      ]
    },

    {
      id: 'xb3-ch4',
      title: '第四章 生物大分子',
      sections: [
        {
          id: 'xb3-ch4-sec1',
          title: '第一节 糖类',
          exercises: [
            {
              id: 'xb3c4s1-001', template: 'concept-mapper',
              title: '糖类的分类与性质',
              params: {
                definition: { blank: '糖类分为____（不能水解）、____（水解生成2分子单糖）和____（水解生成多分子单糖）', answer: '单糖 二糖 多糖' },
                attributes: {
                  items: ['葡萄糖是单糖，分子式C₆H₁₂O₆', '蔗糖是二糖，水解生成葡萄糖和果糖', '淀粉和纤维素是多糖，通式(C₆H₁₀O₅)ₙ', '所有糖类都有甜味'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['葡萄糖能发生银镜反应', '蔗糖不能发生银镜反应', '淀粉遇碘变蓝', '纤维素能发生银镜反应'],
                  correctIndices: [0, 1, 2]
                }
              }
            },
            {
              id: 'xb3c4s1-002', template: 'comparator',
              title: '葡萄糖与果糖的对比',
              params: {
                conceptA: '葡萄糖',
                conceptB: '果糖',
                featuresA: {
                  items: ['属于己醛糖（含醛基）', '能发生银镜反应', '与新制Cu(OH)₂反应生成砖红色沉淀', '属于己酮糖（含酮基）', '是还原性糖'],
                  correctIndices: [0, 1, 2, 4]
                },
                featuresB: {
                  items: ['属于己酮糖（含酮基）', '在碱性条件下能转化为葡萄糖，可发生银镜反应', '是还原性糖', '属于己醛糖', '不能发生银镜反应'],
                  correctIndices: [0, 1, 2]
                },
                difference: {
                  options: ['葡萄糖含醛基，果糖含酮基，但果糖在碱性条件下可异构化为葡萄糖', '葡萄糖是酮糖', '果糖无还原性', '两者没有区别'],
                  correctIndex: 0
                }
              }
            }
          ]
        },
        {
          id: 'xb3-ch4-sec2',
          title: '第二节 蛋白质',
          exercises: [
            {
              id: 'xb3c4s2-001', template: 'concept-mapper',
              title: '蛋白质的化学性质',
              params: {
                definition: { blank: '蛋白质最终水解产物为____；蛋白质遇浓HNO₃变黄的反应称为____反应', answer: '氨基酸 颜色' },
                attributes: {
                  items: ['蛋白质水解最终产物是氨基酸', '盐析是可逆过程（加水恢复）', '变性是不可逆过程', '蛋白质灼烧有烧焦羽毛气味'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['(NH₄)₂SO₄可使蛋白质盐析', '重金属盐使蛋白质变性', '加热使蛋白质变性', '酒精使蛋白质变性'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'xb3c4s2-002', template: 'comparator',
              title: '盐析与变性的对比',
              params: {
                conceptA: '盐析',
                conceptB: '变性',
                featuresA: {
                  items: ['加入轻金属盐或铵盐', '可逆过程（加水可恢复）', '蛋白质结构未改变', '不可逆过程', '蛋白质空间结构被破坏'],
                  correctIndices: [0, 1, 2]
                },
                featuresB: {
                  items: ['加热、强酸、强碱、重金属盐等', '不可逆过程', '蛋白质空间结构被破坏', '可逆过程', '适用于分离提纯蛋白质'],
                  correctIndices: [0, 1, 2]
                },
                difference: {
                  options: ['盐析可逆（物理变化），变性不可逆（化学变化）', '都是可逆的', '都是不可逆的', '盐析是化学变化'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'xb3c4s2-003', template: 'equation-builder',
              title: '氨基酸的缩合反应',
              params: {
                description: '两个甘氨酸分子之间发生缩合反应形成二肽，写出反应方程式及生成的化学键名称',
                reactants: '2H₂NCH₂COOH',
                reactionType: {
                  options: ['缩合反应（生成肽键）', '加成反应', '消去反应', '氧化反应'],
                  correctIndex: 0
                },
                products: 'H₂NCH₂CONHCH₂COOH + H₂O',
                coefficients: ['生成肽键（-CONH-）', '一个氨基酸脱-COOH中的-OH', '另一个氨基酸脱-NH₂中的-H'],
                hints: ['羧基脱-OH，氨基脱-H，结合成水，剩余部分连成肽键']
              }
            }
          ]
        },
        {
          id: 'xb3-ch4-sec3',
          title: '第三节 核酸',
          exercises: [
            {
              id: 'xb3c4s3-001', template: 'concept-mapper',
              title: '核酸的基本组成',
              params: {
                definition: { blank: '核酸的基本组成单位是____，由____、____和____三部分组成', answer: '核苷酸 磷酸 五碳糖 含氮碱基' },
                attributes: {
                  items: ['DNA含脱氧核糖，RNA含核糖', 'DNA碱基为A、T、C、G', 'RNA碱基为A、U、C、G', '核酸是遗传信息的携带者'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['DNA是双螺旋结构', 'RNA通常是单链结构', 'DNA和RNA的糖不同', 'DNA和RNA的碱基完全相同'],
                  correctIndices: [0, 1, 2]
                }
              }
            }
          ]
        }
      ]
    },

    {
      id: 'xb3-ch5',
      title: '第五章 合成高分子',
      sections: [
        {
          id: 'xb3-ch5-sec1',
          title: '第一节 合成高分子的基本方法',
          exercises: [
            {
              id: 'xb3c5s1-001', template: 'comparator',
              title: '加聚反应与缩聚反应的对比',
              params: {
                conceptA: '加聚反应',
                conceptB: '缩聚反应',
                featuresA: {
                  items: ['单体含不饱和键（C=C）', '产物只有高聚物，无小分子', '聚乙烯、聚氯乙烯是典型产物', '产物生成同时有小分子副产物', '单体通常为双官能团分子'],
                  correctIndices: [0, 1, 2]
                },
                featuresB: {
                  items: ['单体含两个或多个官能团', '产物生成同时有小分子副产物（H₂O、HCl等）', '聚酯、蛋白质是典型产物', '产物只有高聚物', '单体含不饱和键'],
                  correctIndices: [0, 1, 2]
                },
                difference: {
                  options: ['加聚无小分子副产物，缩聚有小分子副产物', '加聚生成水', '缩聚需催化剂', '两者无区别'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'xb3c5s1-002', template: 'equation-builder',
              title: '聚乙烯的加聚反应',
              params: {
                description: '乙烯单体在催化剂作用下发生加聚反应生成聚乙烯，写出反应方程式',
                reactants: 'nCH₂=CH₂',
                reactionType: {
                  options: ['加聚反应', '缩聚反应', '加成反应', '取代反应'],
                  correctIndex: 0
                },
                products: '[CH₂-CH₂]ₙ',
                coefficients: ['聚乙烯（PE）', '条件：催化剂、加热加压', 'n为聚合度'],
                hints: ['C=C双键打开，单体间相互连接成长碳链']
              }
            },
            {
              id: 'xb3c5s1-003', template: 'error-detector',
              title: '加聚产物单体的判断',
              params: {
                statement: '由单体CH₂=CHCl加聚得到的高聚物是[CH₂-CHCl]ₙ，单体名为乙烯',
                errorLocation: {
                  options: ['单体名为氯乙烯，不是乙烯', '高聚物是聚乙烯', '加聚产物写法错误', '单体名称正确'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['CH₂=CHCl是氯乙烯（乙烯的一个H被Cl取代），其加聚产物是聚氯乙烯（PVC）', '是乙烯', '写法正确', '名称正确'],
                  correctIndex: 0
                },
                correctVersion: '单体为氯乙烯(CH₂=CHCl)，加聚产物为聚氯乙烯[CH₂-CHCl]ₙ，简称PVC',
                hint: '加聚产物的单体判断：两个碳一组，恢复C=C双键'
              }
            }
          ]
        },
        {
          id: 'xb3-ch5-sec2',
          title: '第二节 高分子材料',
          exercises: [
            {
              id: 'xb3c5s2-001', template: 'concept-mapper',
              title: '常见高分子材料的用途',
              params: {
                definition: { blank: '三大合成材料是指____、____和____', answer: '塑料 合成橡胶 合成纤维' },
                attributes: {
                  items: ['聚乙烯可制塑料袋和保鲜膜', '聚氯乙烯可制管道和电线绝缘层', '合成橡胶用于制轮胎', '天然橡胶不是合成材料'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['涤纶是合成纤维', '锦纶是合成纤维', '尼龙是合成纤维', '棉花是合成纤维'],
                  correctIndices: [0, 1, 2]
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
