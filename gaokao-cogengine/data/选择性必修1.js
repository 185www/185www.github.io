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
              id: 'x1c1s1-001', template: 'concept-mapper',
              title: '放热反应与吸热反应',
              params: {
                definition: { blank: '放热反应ΔH____0，反应物总能量____生成物总能量；吸热反应ΔH____0，反应物总能量____生成物总能量', answer: '< > < >' },
                attributes: {
                  items: ['放热反应是体系向环境释放热量', '吸热反应是体系从环境吸收热量', '放热反应不需要任何条件就能发生', 'ΔH = 生成物总能量 - 反应物总能量'],
                  correctIndices: [0, 1, 3]
                },
                boundaries: {
                  items: ['燃烧反应是放热反应', 'Ba(OH)₂·8H₂O与NH₄Cl反应是吸热反应', 'C + CO₂ → 2CO是放热反应', '铝热反应是吸热反应'],
                  correctIndices: [0, 1]
                }
              }
            },
            {
              id: 'x1c1s1-002', template: 'equation-builder',
              title: '热化学方程式的书写',
              params: {
                description: '氢气在氧气中燃烧生成液态水，放热285.8kJ（注意热化学方程式规范）',
                reactants: 'H₂(g) + ½O₂(g)',
                reactionType: { options: ['氧化还原反应（放热）', '化合反应（放热）', '分解反应', '复分解反应'], correctIndex: 0 },
                products: 'H₂O(l)',
                coefficients: [1, 0.5, 1],
                hints: ['要注明物质状态(g/l/s/aq)', 'ΔH在方程右边用分号隔开', 'ΔH = -285.8 kJ/mol', '系数可以是分数']
              }
            },
            {
              id: 'x1c1s1-003', template: 'error-detector',
              title: 'ΔH的符号与单位',
              params: {
                statement: '已知反应2H₂(g) + O₂(g) = 2H₂O(l)放热571.6kJ，则该反应的ΔH = +571.6 kJ/mol',
                errorLocation: {
                  options: ['2H₂(g) + O₂(g)', '2H₂O(l)', 'ΔH = +571.6 kJ/mol', '没有错误'],
                  correctIndex: 2
                },
                explanation: {
                  options: ['放热反应ΔH应为负值', '放热反应ΔH应为正值', 'ΔH单位应为kJ', '反应热与系数无关'],
                  correctIndex: 0
                },
                correctVersion: 'ΔH = -571.6 kJ/mol（放热反应ΔH<0）',
                hint: '放热反应体系能量降低，ΔH为负'
              }
            },
            {
              id: 'x1c1s1-004', template: 'concept-mapper',
              title: '燃烧热与中和热',
              params: {
                definition: { blank: '燃烧热：____ mol纯物质完全燃烧生成指定产物时放出的热量。中和热：稀溶液中强酸强碱生成____ mol H₂O时的反应热，ΔH = ____', answer: '1 1 -57.3 kJ/mol' },
                attributes: {
                  items: ['燃烧热指定产物：C→CO₂(g)，H→H₂O(l)', '中和热与酸碱性种类无关', '弱酸弱碱的中和热绝对值等于57.3', '燃烧热ΔH<0，中和热ΔH<0'],
                  correctIndices: [0, 1, 3]
                },
                boundaries: {
                  items: ['CH₄的燃烧热是890.3kJ/mol', 'H₂SO₄与Ba(OH)₂的中和热为-57.3kJ/mol', '弱酸与强碱的中和热绝对值大于57.3', 'S燃烧生成SO₂的燃烧热是S→SO₂'],
                  correctIndices: [0, 3]
                }
              }
            },
            {
              id: 'x1c1s1-005', template: 'equation-builder',
              title: '键能法计算ΔH',
              params: {
                description: '已知H-H键能436kJ/mol，Cl-Cl键能243kJ/mol，H-Cl键能431kJ/mol，计算H₂ + Cl₂ = 2HCl的ΔH',
                reactants: 'H₂(g) + Cl₂(g)',
                reactionType: { options: ['化合反应（放热）', '氧化还原反应（放热）', '分解反应', '化合反应（吸热）'], correctIndex: 0 },
                products: '2HCl(g)',
                coefficients: [1, 1, 2],
                hints: ['ΔH = 反应物总键能 - 生成物总键能', 'ΔH = (436 + 243) - (2×431) = -183 kJ/mol', '键能法从断开键和形成键的角度计算']
              }
            }
          ]
        },
        {
          id: 'x1-ch1-sec2',
          title: '第二节 反应热的计算',
          exercises: [
            {
              id: 'x1c1s2-001', template: 'procedure-sequencer',
              title: '盖斯定律计算步骤',
              params: {
                steps: {
                  items: ['写出目标反应方程式', '分析已知反应，找出与目标反应的关系', '将已知反应进行加减组合（乘系数、调方向）', 'ΔH同步加减组合', '消去中间产物得到目标反应'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: [0, 1, 2, 4, 3]
                },
                notes: {
                  items: ['反应式乘系数时ΔH也乘相同系数', '反应逆向时ΔH变号', '中间产物系数必须相等才能消去', 'ΔH与反应路径有关'],
                  correctIndices: [0, 1, 2]
                }
              }
            },
            {
              id: 'x1c1s2-002', template: 'equation-builder',
              title: '盖斯定律加合法计算',
              params: {
                description: '已知：① C(s) + O₂(g) = CO₂(g) ΔH₁ = -393.5 kJ/mol；② CO(g) + ½O₂(g) = CO₂(g) ΔH₂ = -283.0 kJ/mol。求 C(s) + ½O₂(g) = CO(g) 的ΔH',
                reactants: 'C(s) + ½O₂(g)',
                reactionType: { options: ['氧化还原反应（放热）', '氧化还原反应（吸热）', '化合反应（放热）', '分解反应'], correctIndex: 0 },
                products: 'CO(g)',
                coefficients: [1, 0.5, 1],
                hints: ['目标反应 = ① - ②', 'ΔH = ΔH₁ - ΔH₂ = -393.5 - (-283.0) = -110.5 kJ/mol', '盖斯定律：反应热与路径无关']
              }
            },
            {
              id: 'x1c1s2-003', template: 'error-detector',
              title: '盖斯定律ΔH加减常见错误',
              params: {
                statement: '已知反应A→B ΔH₁，B→C ΔH₂，求A→C的ΔH。计算得ΔH = ΔH₂ - ΔH₁',
                errorLocation: {
                  options: ['反应A→B', '反应B→C', 'ΔH = ΔH₂ - ΔH₁', '没有错误'],
                  correctIndex: 2
                },
                explanation: {
                  options: ['A→C可由A→B与B→C相加得到，ΔH = ΔH₁ + ΔH₂', 'A→C应是A→B减去B→C', '反应热不能直接相加减', '盖斯定律只适用于恒温恒压'],
                  correctIndex: 0
                },
                correctVersion: 'A→C = (A→B) + (B→C)，所以ΔH = ΔH₁ + ΔH₂',
                hint: '反应式相加时ΔH也相加，中间产物消去'
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
              id: 'x1c2s1-001', template: 'concept-mapper',
              title: '化学反应速率的概念',
              params: {
                definition: { blank: '化学反应速率用____来表示，公式v = ____，常用单位为____或____', answer: '单位时间内反应物浓度的减少或生成物浓度的增加 Δc/Δt mol/(L·s) mol/(L·min)' },
                attributes: {
                  items: ['各物质速率之比等于化学计量数之比', 'v = Δc/Δt适用于所有反应', '固体和纯液体的浓度视为常数，不用其表示速率', '速率是瞬时速率不是平均速率'],
                  correctIndices: [0, 2]
                },
                boundaries: {
                  items: ['对于反应A+3B⇌2C，v(A):v(B):v(C)=1:3:2', '对于反应A+3B⇌2C，v(A)=v(C)', 'v(B)=0.6mol/(L·s)时，v(C)=0.4mol/(L·s)', '化学反应速率总是正值'],
                  correctIndices: [0, 2, 3]
                }
              }
            },
            {
              id: 'x1c2s1-002', template: 'comparator',
              title: '影响反应速率的因素',
              params: {
                conceptA: '内因',
                conceptB: '外因',
                featuresA: {
                  items: ['反应物本身的性质决定', '浓度影响反应速率', '温度影响反应速率', '与反应物化学键强弱有关', 'Na与H₂O反应比Mg剧烈因其活泼性'],
                  correctIndices: [0, 3, 4]
                },
                featuresB: {
                  items: ['浓度增大速率加快', '温度升高速率加快（每升高10℃约2-4倍）', '对有气体反应，压强增大等价于浓度增大', '催化剂不改变化学平衡常数', '接触面积越大反应越快'],
                  correctIndices: [0, 1, 2, 3, 4]
                },
                difference: {
                  options: ['内因是决定性因素，外因通过内因起作用', '外因不影响反应速率', '内因可改变而外因不可改变', '两者互不影响'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'x1c2s1-003', template: 'equation-builder',
              title: '速率常数k与阿伦尼乌斯公式',
              params: {
                description: '对于基元反应aA+bB→产物，速率方程v=k[A]ᵃ[B]ᵇ，k为速率常数',
                reactants: 'aA + bB',
                reactionType: { options: ['基元反应', '复杂反应', '可逆反应', '链式反应'], correctIndex: 0 },
                products: '产物',
                coefficients: [1, 1, 1],
                hints: ['k与浓度无关，与温度和催化剂有关', '温度升高k增大（阿伦尼乌斯公式）', '催化剂降低活化能，使k增大']
              }
            }
          ]
        },
        {
          id: 'x1-ch2-sec2',
          title: '第二节 化学平衡',
          exercises: [
            {
              id: 'x1c2s2-001', template: 'concept-mapper',
              title: '化学平衡状态的特征',
              params: {
                definition: { blank: '化学平衡状态的特征可概括为：逆（____）、等（____）、动（____）、定（____）、变（____）', answer: '可逆反应 正逆反应速率相等 动态平衡 各组分浓度不变 条件改变平衡移动' },
                attributes: {
                  items: ['平衡时正逆反应速率相等但不为零', '平衡时各组分浓度相等', '平衡时各组分浓度保持不变', '平衡时反应停止了'],
                  correctIndices: [0, 2]
                },
                boundaries: {
                  items: ['平衡后加入反应物，平衡正向移动', '平衡后升高温度，平衡向吸热方向移动', '催化剂能改变化学平衡位置', '平衡后改变压强一定影响平衡'],
                  correctIndices: [0, 1]
                }
              }
            },
            {
              id: 'x1c2s2-002', template: 'equation-builder',
              title: '平衡常数K的表达式',
              params: {
                description: '对于可逆反应aA + bB ⇌ cC + dD，写出平衡常数K的表达式',
                reactants: 'aA + bB',
                reactionType: { options: ['可逆反应', '不可逆反应', '基元反应', '链式反应'], correctIndex: 0 },
                products: 'cC + dD',
                coefficients: [1, 1, 1, 1],
                hints: ['K = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ', '纯固体和纯液体不写入K表达式', 'K只与温度有关']
              }
            },
            {
              id: 'x1c2s2-003', template: 'comparator',
              title: 'Q与K比较判断平衡移动',
              params: {
                conceptA: 'Q < K',
                conceptB: 'Q > K',
                featuresA: {
                  items: ['反应正向进行（向生成物方向）', '反应逆向进行（向反应物方向）', 'Q = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ（浓度商）', '未达到平衡状态', '有沉淀析出'],
                  correctIndices: [0, 2, 3]
                },
                featuresB: {
                  items: ['反应正向进行', '反应逆向进行（向反应物方向）', '过饱和状态', 'Q = Ksp时有沉淀生成', 'Q > Ksp时有沉淀析出'],
                  correctIndices: [1, 2, 4]
                },
                difference: {
                  options: ['Q<K正向移动，Q>K逆向移动', 'Q<K逆向移动，Q>K正向移动', 'Q与K比较不影响平衡', '只有Q=K时反应才进行'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'x1c2s2-004', template: 'error-detector',
              title: '勒夏特列原理的应用',
              params: {
                statement: '对于反应2NO₂(g) ⇌ N₂O₄(g) ΔH<0，升高温度，平衡向放热方向移动，NO₂浓度减小',
                errorLocation: {
                  options: ['升高温度', '平衡向放热方向移动', 'NO₂浓度减小', '没有错误'],
                  correctIndex: 2
                },
                explanation: {
                  options: ['升温使平衡向吸热方向移动（逆向），NO₂浓度增大', '升温使平衡向放热方向移动，NO₂浓度减小', '升温不影响平衡', '升温使NO₂浓度不变'],
                  correctIndex: 0
                },
                correctVersion: '升温使平衡向吸热方向（逆向）移动，NO₂浓度增大，体系颜色加深',
                hint: '△H<0表示正向放热，逆向吸热。升温向吸热方向移动'
              }
            },
            {
              id: 'x1c2s2-005', template: 'procedure-sequencer',
              title: '平衡移动方向的判断步骤',
              params: {
                steps: {
                  items: ['判断条件改变的类型（浓度/温度/压强）', '分析该条件改变对平衡的影响方向', '根据勒夏特列原理得出平衡移动方向', '判断移动后的现象（颜色/转化率等）', '如果涉及K值变化，分析K的增减'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: [0, 1, 2, 3, 4]
                },
                notes: {
                  items: ['温度改变会影响K值，浓度改变不影响K值', '压强改变本质上是浓度的改变', '催化剂不影响平衡位置', '勒夏特列原理适用于所有动态平衡'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'x1c2s2-006', template: 'concept-mapper',
              title: '等效平衡',
              params: {
                definition: { blank: '等效平衡是指相同条件下，同一可逆反应，起始投料方式不同但达到____的平衡状态。恒温恒容时反应前后气体系数和不等则投料____，相等则投料____；恒温恒压时投料____', answer: '相同 等比 等量 等比' },
                attributes: {
                  items: ['等效平衡中各组分百分含量相同', '恒容下反应前后气体系数和不等，投料等比不等效', '恒容下反应前后气体系数和相等，投料等量等效', '恒压下投料等比一定等效'],
                  correctIndices: [0, 2, 3]
                },
                boundaries: {
                  items: ['H₂+I₂⇌2HI恒容投料1:1和2:2等效', 'N₂+3H₂⇌2NH₃恒容投料1:3和2:6不等效', 'N₂+3H₂⇌2NH₃恒压投料1:3和2:6等效', '等效平衡体系中各物质浓度一定相等'],
                  correctIndices: [0, 2, 3]
                }
              }
            }
          ]
        },
        {
          id: 'x1-ch2-sec3',
          title: '第三节 化学反应的方向',
          exercises: [
            {
              id: 'x1c2s3-001', template: 'concept-mapper',
              title: '化学反应方向的判据——ΔG',
              params: {
                definition: { blank: '自发反应的判据是ΔG = ΔH - TΔS。当ΔG____0时反应自发进行，ΔG____0时反应达平衡，ΔG____0时反应非自发', answer: '< = >' },
                attributes: {
                  items: ['ΔH<0且ΔS>0，任何温度下自发', 'ΔH>0且ΔS<0，任何温度下非自发', 'ΔH<0且ΔS<0，高温下自发', 'ΔH>0且ΔS>0，高温下自发'],
                  correctIndices: [0, 1, 3]
                },
                boundaries: {
                  items: ['ΔS>0表示熵增（混乱度增大）', '气体分子数增加的反应ΔS>0', 'ΔS随温度升高而增大', '自发反应一定可以实际发生'],
                  correctIndices: [0, 1]
                }
              }
            }
          ]
        },
        {
          id: 'x1-ch2-sec4',
          title: '第四节 化学反应的调控',
          exercises: [
            {
              id: 'x1c2s4-001', template: 'error-detector',
              title: '合成氨的工业条件选择',
              params: {
                statement: '合成氨反应N₂+3H₂⇌2NH₃ ΔH<0，为提高平衡产率应选择高温、高压、使用催化剂',
                errorLocation: {
                  options: ['高温', '高压', '使用催化剂', '没有错误'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['该反应放热，升温平衡逆向移动，产率降低。实际采用400~500℃兼顾速率与平衡', '高压虽然提高产率但受设备限制，实际用20~50MPa', '催化剂不影响产率只加快速率', '以上都不对'],
                  correctIndex: 0
                },
                correctVersion: '合成氨采用400~500℃（平衡与速率兼顾）、20~50MPa（适当高压）、铁触媒催化的条件',
                hint: '工业条件选择需综合考虑速率、平衡、设备成本'
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
              id: 'x1c3s1-001', template: 'comparator',
              title: '强电解质与弱电解质的比较',
              params: {
                conceptA: '强电解质',
                conceptB: '弱电解质',
                featuresA: {
                  items: ['完全电离（不可逆）', '部分电离（可逆）', '包括强酸、强碱、大多数盐', '存在于电离平衡', '离子方程式中写成离子形式'],
                  correctIndices: [0, 2, 4]
                },
                featuresB: {
                  items: ['完全电离', '部分电离（存在电离平衡）', '包括弱酸（如CH₃COOH）、弱碱（如NH₃·H₂O）、水', '溶液中以分子形式为主', '离子方程式中写成分子形式'],
                  correctIndices: [1, 2, 3, 4]
                },
                difference: {
                  options: ['电离程度不同（完全vs部分）', '溶解度不同', '导电性一定不同', '颜色不同'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'x1c3s1-002', template: 'concept-mapper',
              title: '电离平衡的影响因素',
              params: {
                definition: { blank: '电离平衡是____的过程。弱电解质的电离程度用电离度α表示，α = ____。稀释弱酸溶液，电离度____，c(H⁺)____', answer: '弱电解质电离成离子的速率等于离子结合成分子的速率 已电离的分子数/起始分子数 增大 减小' },
                attributes: {
                  items: ['温度升高促进电离（电离是吸热的）', '加水稀释促进电离（电离度增大）', '加入同离子抑制电离', '电离平衡常数Ka越大酸性越弱'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['CH₃COOH中加入CH₃COONa，c(H⁺)减小', 'NH₃·H₂O中加入NH₄Cl，碱性增强', '稀释CH₃COOH溶液，c(H⁺)增大', '加热促进水的电离，Kw增大'],
                  correctIndices: [0, 3]
                }
              }
            }
          ]
        },
        {
          id: 'x1-ch3-sec2',
          title: '第二节 水的电离和溶液的pH',
          exercises: [
            {
              id: 'x1c3s2-001', template: 'concept-mapper',
              title: '水的离子积Kw与pH',
              params: {
                definition: { blank: '水的离子积Kw = c(H⁺)·c(OH⁻)，25℃时Kw = ____。pH = -lg c(H⁺)。中性时c(H⁺)____c(OH⁻)，pH____7', answer: '1.0×10⁻¹⁴ = =' },
                attributes: {
                  items: ['Kw只与温度有关，温度升高Kw增大', 'Kw适用于所有稀溶液', '酸性溶液中c(H⁺)>c(OH⁻)', '碱性溶液中c(H⁺)=c(OH⁻)'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['25℃时pH=7的溶液一定中性', '100℃时Kw≈10⁻¹²，中性pH=6', 'pH=0的溶液c(H⁺)=1mol/L', 'pH每减小1，c(H⁺)增大10倍'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'x1c3s2-002', template: 'equation-builder',
              title: '酸碱中和滴定中的pH计算',
              params: {
                description: '25℃下，取20.00mL 0.1000mol/L HCl溶液，用0.1000mol/L NaOH溶液滴定，计算滴定至等当点时溶液的pH',
                reactants: 'HCl + NaOH',
                reactionType: { options: ['中和反应', '氧化还原反应', '复分解反应', '水解反应'], correctIndex: 0 },
                products: 'NaCl + H₂O',
                coefficients: [1, 1, 1, 1],
                hints: ['强酸强碱完全中和，生成强酸强碱盐不水解', '等当点时c(H⁺)=c(OH⁻)=√Kw=1×10⁻⁷', 'pH = -lg(1×10⁻⁷) = 7']
              }
            },
            {
              id: 'x1c3s2-003', template: 'error-detector',
              title: 'pH计算常见错误',
              params: {
                statement: '将pH=3的盐酸稀释10倍，pH变为4；稀释100倍，pH变为5；稀释1000倍，pH变为6；稀释10000倍，pH变为7',
                errorLocation: {
                  options: ['pH=3稀释10倍得pH=4', '稀释100倍得pH=5', '稀释1000倍得pH=6', '稀释10000倍得pH=7'],
                  correctIndex: 3
                },
                explanation: {
                  options: ['酸无限稀释不可能变为碱性（pH>7），接近中性但略小于7', '稀释10000倍后pH精确值为6.96', '以上都对', 'pH=7是精确计算结果'],
                  correctIndex: 0
                },
                correctVersion: '强酸稀释10000倍后pH≈6.96（无限稀释接近7但略小于7，不会超过7）',
                hint: '酸稀释不可能变碱性，要考虑水电离的H⁺'
              }
            }
          ]
        },
        {
          id: 'x1-ch3-sec3',
          title: '第三节 盐类的水解',
          exercises: [
            {
              id: 'x1c3s3-001', template: 'concept-mapper',
              title: '盐类水解的规律',
              params: {
                definition: { blank: '盐类水解规律：谁____谁水解，谁____显谁性。强酸弱碱盐水解显____性，强碱弱酸盐水解显____性，都强____水解', answer: '弱 强 酸 碱 不' },
                attributes: {
                  items: ['弱酸强碱盐（CH₃COONa）显碱性', '强酸弱碱盐（NH₄Cl）显酸性', '强酸强碱盐（NaCl）不水解呈中性', '弱酸弱碱盐水解显酸性'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['FeCl₃水解使溶液显酸性', 'Na₂CO₃水解使溶液显碱性', 'Al₂(SO₄)₃水溶液显中性', 'NH₄NO₃水溶液显碱性'],
                  correctIndices: [0, 1]
                }
              }
            },
            {
              id: 'x1c3s3-002', template: 'error-detector',
              title: '水解离子方程式的书写',
              params: {
                statement: 'FeCl₃水解的离子方程式为：Fe³⁺ + 3H₂O = Fe(OH)₃↓ + 3H⁺',
                errorLocation: {
                  options: ['Fe³⁺ + 3H₂O', '= Fe(OH)₃↓', '= 3H⁺', '水解符号'],
                  correctIndex: 3
                },
                explanation: {
                  options: ['水解是微弱可逆的，应该用⇌而不是=，也不能写沉淀符号', 'Fe(OH)₃是沉淀应该用↓', 'H⁺和Fe³⁺都不对', '以上都不对'],
                  correctIndex: 0
                },
                correctVersion: 'Fe³⁺ + 3H₂O ⇌ Fe(OH)₃ + 3H⁺（水解可逆，不能用=和↓）',
                hint: '一般水解用⇌，不标↑↓（彻底双水解除外）'
              }
            },
            {
              id: 'x1c3s3-003', template: 'equation-builder',
              title: '水解常数Kh与Ka/Kb关系',
              params: {
                description: '已知CH₃COOH的Ka=1.75×10⁻⁵，求CH₃COONa水解常数Kh',
                reactants: 'CH₃COO⁻ + H₂O',
                reactionType: { options: ['水解反应', '中和反应', '电离反应', '氧化还原反应'], correctIndex: 0 },
                products: 'CH₃COOH + OH⁻',
                coefficients: [1, 1, 1, 1],
                hints: ['Kh = Kw / Ka', 'Kw=1.0×10⁻¹⁴，Ka=1.75×10⁻⁵', 'Kh = 1.0×10⁻¹⁴ / 1.75×10⁻⁵ ≈ 5.71×10⁻¹⁰']
              }
            }
          ]
        },
        {
          id: 'x1-ch3-sec4',
          title: '第四节 沉淀溶解平衡',
          exercises: [
            {
              id: 'x1c3s4-001', template: 'concept-mapper',
              title: '沉淀溶解平衡与Ksp',
              params: {
                definition: { blank: '对于AmBn(s) ⇌ mAⁿ⁺(aq) + nBᵐ⁻(aq)，Ksp = ____。Ksp只与____有关。Q____Ksp时有沉淀生成', answer: '[Aⁿ⁺]ᵐ[Bᵐ⁻]ⁿ 温度 >' },
                attributes: {
                  items: ['Ksp越大溶解度越大（同类型）', '温度升高多数Ksp增大', 'Ksp与浓度无关', 'Ksp可判断沉淀的生成与溶解'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['AgCl的Ksp大于AgBr的Ksp', '向AgCl饱和液中加NaCl，c(Ag⁺)减小', '向AgCl饱和液中加AgNO₃，Ksp变大', 'Q<Ksp时无沉淀析出'],
                  correctIndices: [0, 1, 3]
                }
              }
            },
            {
              id: 'x1c3s4-002', template: 'procedure-sequencer',
              title: '沉淀转化的判断',
              params: {
                steps: {
                  items: ['写出两种沉淀的溶解平衡表达式', '查出两种沉淀的Ksp值', '比较Ksp大小（同类型）', '判断转化方向（向Ksp更小的方向）', '写出转化反应的离子方程式'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: [0, 1, 2, 3, 4]
                },
                notes: {
                  items: ['沉淀转化方向：溶解度大的→溶解度小的', 'AgCl(白)→AgBr(浅黄)→AgI(黄)→Ag₂S(黑)', 'Ksp相差越大转化越彻底', 'Ksp大的沉淀不能转化为Ksp小的沉淀'],
                  correctIndices: [0, 1, 2]
                }
              }
            },
            {
              id: 'x1c3s4-003', template: 'error-detector',
              title: '溶度积Ksp的表达式',
              params: {
                statement: '对于沉淀Ag₂CrO₄(s) ⇌ 2Ag⁺(aq) + CrO₄²⁻(aq)，其Ksp = [Ag⁺][CrO₄²⁻]',
                errorLocation: {
                  options: ['Ag₂CrO₄(s) ⇌ 2Ag⁺', 'CrO₄²⁻(aq)', 'Ksp = [Ag⁺][CrO₄²⁻]', '没有错误'],
                  correctIndex: 2
                },
                explanation: {
                  options: ['Ksp表达式需要系数作为指数，应为[Ag⁺]²[CrO₄²⁻]', '浓度就是简单的乘积', 'Ksp应该在水溶液中计算', '以上都不对'],
                  correctIndex: 0
                },
                correctVersion: 'Ksp(Ag₂CrO₄) = [Ag⁺]²[CrO₄²⁻]',
                hint: 'Ksp表达式中离子浓度要加上对应的化学计量数作为指数'
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
              id: 'x1c4s1-001', template: 'comparator',
              title: '原电池与电解池的对比',
              params: {
                conceptA: '原电池',
                conceptB: '电解池',
                featuresA: {
                  items: ['化学能转化为电能', '电能转化为化学能', '负极发生氧化反应（失电子）', '正极发生还原反应（得电子）', '电子由负极经外电路流向正极', '阳极与电源正极相连'],
                  correctIndices: [0, 2, 3, 4]
                },
                featuresB: {
                  items: ['化学能转化为电能', '电能转化为化学能', '阳极发生氧化反应（阴离子放电）', '阴极发生还原反应（阳离子放电）', '阳极与电源正极相连', '阴极与电源负极相连'],
                  correctIndices: [1, 2, 3, 4, 5]
                },
                difference: {
                  options: ['能量转化方式不同（化学能→电能 vs 电能→化学能）', '电极名称完全相同', '电子流向完全相同', '反应类型完全相同'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'x1c4s1-002', template: 'equation-builder',
              title: '铜锌原电池的电极反应',
              params: {
                description: '铜锌原电池（Zn|H₂SO₄|Cu），写出负极和正极的电极反应式',
                reactants: 'Zn + 2H⁺',
                reactionType: { options: ['氧化还原反应（自发放电）', '非氧化还原反应', '复分解反应', '化合反应'], correctIndex: 0 },
                products: 'Zn²⁺ + H₂',
                coefficients: [1, 2, 1, 1],
                hints: ['负极（Zn）：Zn - 2e⁻ = Zn²⁺（氧化）', '正极（Cu）：2H⁺ + 2e⁻ = H₂↑（还原）', '电子从Zn经导线流向Cu']
              }
            },
            {
              id: 'x1c4s1-003', template: 'error-detector',
              title: '原电池电极的判断',
              params: {
                statement: '在Mg-Al-NaOH溶液构成的原电池中，Mg比Al活泼，因此Mg做负极，Al做正极',
                errorLocation: {
                  options: ['Mg比Al活泼', 'Mg做负极', 'Al做正极', '没有错误'],
                  correctIndex: 2
                },
                explanation: {
                  options: ['Al能与NaOH溶液反应而Mg不能，Al失电子作负极', 'Mg做负极正确', 'Mg-Al-NaOH中Mg做负极', '活泼金属一定做负极'],
                  correctIndex: 0
                },
                correctVersion: 'Mg-Al-NaOH溶液：Al能与NaOH反应而Mg不能，Al作负极，Mg作正极',
                hint: '电极判断要看电解质环境，能与电解质反应的金属作负极'
              }
            }
          ]
        },
        {
          id: 'x1-ch4-sec2',
          title: '第二节 电解池',
          exercises: [
            {
              id: 'x1c4s2-001', template: 'procedure-sequencer',
              title: '电解池的放电顺序',
              params: {
                steps: {
                  items: ['接通电源，判断阴、阳极', '分析溶液中存在的阴、阳离子', '阳极：阴离子放电，按S²⁻>I⁻>Br⁻>Cl⁻>OH⁻>含氧酸根顺序', '阴极：阳离子放电，按Ag⁺>Cu²⁺>H⁺(酸)>Fe²⁺>Zn²⁺>H⁺(水)顺序', '写出电极反应式和总反应式'],
                  correctIndices: [0, 1, 2, 3, 4],
                  correctOrder: [0, 1, 2, 3, 4]
                },
                notes: {
                  items: ['阳极发生氧化反应（阴离子失电子）', '阴极发生还原反应（阳离子得电子）', '惰性电极（Pt/C）不参与反应，活性电极（Cu/Ag）可能溶解', '放电顺序与离子浓度有关，浓度远大于标准时顺序可能改变'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            },
            {
              id: 'x1c4s2-002', template: 'equation-builder',
              title: '电解NaCl饱和溶液',
              params: {
                description: '用惰性电极电解饱和食盐水（氯碱工业原理）',
                reactants: '2NaCl + 2H₂O',
                reactionType: { options: ['电解反应（氧化还原）', '水解反应', '复分解反应', '化合反应'], correctIndex: 0 },
                products: '2NaOH + H₂ + Cl₂',
                coefficients: [2, 2, 2, 1, 1],
                hints: ['阳极（Cl⁻放电）：2Cl⁻ - 2e⁻ = Cl₂↑', '阴极（H⁺放电）：2H₂O + 2e⁻ = H₂↑ + 2OH⁻', '总：2NaCl + 2H₂O =电解= 2NaOH + H₂↑ + Cl₂↑']
              }
            },
            {
              id: 'x1c4s2-003', template: 'concept-mapper',
              title: '电解精炼铜与电镀',
              params: {
                definition: { blank: '电解精炼铜：粗铜作____极，精铜作____极，电解质为____。电镀：镀件作____极，镀层金属作____极', answer: '阳 阴 CuSO₄溶液 阴 阳' },
                attributes: {
                  items: ['粗铜中的活泼金属（Zn/Fe）比Cu先失电子进入溶液', '电解精炼后阳极泥中含有Au/Ag等贵金属', '电镀时阳极金属溶解补充镀液离子', '电镀过程中镀液浓度不变'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['电解精炼铜时阳极：Cu - 2e⁻ = Cu²⁺', '电解精炼铜时阴极：Cu²⁺ + 2e⁻ = Cu', '电镀锌时镀件接电源正极', '电镀时镀层金属做阳极溶解'],
                  correctIndices: [0, 1, 3]
                }
              }
            }
          ]
        },
        {
          id: 'x1-ch4-sec3',
          title: '第三节 金属的腐蚀与防护',
          exercises: [
            {
              id: 'x1c4s3-001', template: 'concept-mapper',
              title: '电化学腐蚀的类型',
              params: {
                definition: { blank: '钢铁的吸氧腐蚀：正极反应____。析氢腐蚀：在____条件下发生，正极反应____', answer: 'O₂+2H₂O+4e⁻=4OH⁻ 酸性 2H⁺+2e⁻=H₂↑' },
                attributes: {
                  items: ['吸氧腐蚀是钢铁最常见的腐蚀方式', '析氢腐蚀需要酸性环境', '腐蚀的本质是形成原电池', '两种腐蚀中Fe均做负极失电子'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['吸氧腐蚀总反应：2Fe+O₂+2H₂O=2Fe(OH)₂', 'Fe(OH)₂进一步氧化为铁锈Fe₂O₃·xH₂O', '析氢腐蚀产生H₂', '析氢腐蚀不产生H₂'],
                  correctIndices: [0, 1, 2]
                }
              }
            },
            {
              id: 'x1c4s3-002', template: 'error-detector',
              title: '金属防护方法的选择',
              params: {
                statement: '牺牲阳极法保护钢铁设备：将被保护的钢铁设备与电源负极相连，作为阴极受到保护',
                errorLocation: {
                  options: ['与电源负极相连', '作为阴极受到保护', '牺牲阳极法', '没有错误'],
                  correctIndex: 2
                },
                explanation: {
                  options: ['与电源负极相连的是外加电流法，牺牲阳极法是用更活泼金属作牺牲阳极', '作为阴极受保护正确', '牺牲阳极法符合原理', '以上都不对'],
                  correctIndex: 0
                },
                correctVersion: '牺牲阳极法：用更活泼的金属（如Zn）与被保护的钢铁设备相连，Zn做负极（牺牲阳极）被腐蚀，钢铁做正极受保护',
                hint: '牺牲阳极法用自己的牺牲换保护（不接电源），外加电流法接电源负极'
              }
            },
            {
              id: 'x1c4s3-003', template: 'comparator',
              title: '吸氧腐蚀与析氢腐蚀的比较',
              params: {
                conceptA: '吸氧腐蚀',
                conceptB: '析氢腐蚀',
                featuresA: {
                  items: ['正极：O₂+2H₂O+4e⁻=4OH⁻', '正极：2H⁺+2e⁻=H₂↑', '中性或碱性条件发生', '酸性条件发生', '是钢铁最主要的腐蚀方式', '总反应：2Fe+O₂+2H₂O=2Fe(OH)₂'],
                  correctIndices: [0, 2, 4, 5]
                },
                featuresB: {
                  items: ['正极：O₂+2H₂O+4e⁻=4OH⁻', '正极：2H⁺+2e⁻=H₂↑', '中性或碱性条件发生', '酸性条件发生', '产生的H₂可能有氢脆风险'],
                  correctIndices: [1, 3, 4]
                },
                difference: {
                  options: ['电解质酸碱性不同，正极反应不同', '负极反应不同', '钢铁做不同电极', '防护方法不同'],
                  correctIndex: 0
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
