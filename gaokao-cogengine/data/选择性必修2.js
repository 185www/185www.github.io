const 选择性必修2 = {
  textbook: '选择性必修2 物质结构与性质',

  chapters: [
    {
      id: 'xb2-ch1',
      title: '第一章 原子结构与性质',
      sections: [
        {
          id: 'xb2-ch1-sec1',
          title: '第一节 原子结构',
          exercises: [
            {
              id: 'xb2c1s1-001', template: 'error-detector',
              title: '电子排布式的常见错误',
              params: {
                statement: '某同学写出Fe原子的电子排布式为1s²2s²2p⁶3s²3p⁶3d⁸',
                errorLocation: {
                  options: ['3d⁸的电子数错误', '缺少4s²轨道', '1s²的电子数错误', '2p⁶超出容量'],
                  correctIndex: 1
                },
                explanation: {
                  options: ['Fe的3d轨道最多容纳6个电子', 'Fe的电子应先填满4s再填3d，排布式应为1s²2s²2p⁶3s²3p⁶3d⁶4s²', '1s轨道最多2个电子', '2p轨道最多6个电子'],
                  correctIndex: 1
                },
                correctVersion: '1s²2s²2p⁶3s²3p⁶3d⁶4s²',
                hint: '注意能级交错：4s能量低于3d，先填4s'
              }
            },
            {
              id: 'xb2c1s1-002', template: 'concept-mapper',
              title: '能级与电子排布规则',
              params: {
                definition: { blank: '原子核外电子排布遵循____原理、____原理和____规则', answer: '能量最低 泡利 洪特' },
                attributes: {
                  items: ['同一原子轨道中最多容纳2个自旋相反的电子', '电子优先占据能量最低的轨道', '电子在相同能级的不同轨道上优先分占且自旋平行', '3d轨道的能量高于4s'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['Cr的价电子排布为3d⁵4s¹', 'Cu的价电子排布为3d⁹4s²', 'N的轨道表达式为1s²2s²2p¹₂p¹₂p¹', 'O的轨道表达式为1s²2s²2p²₂p¹₂p¹'],
                  correctIndices: [0, 2]
                }
              }
            },
            {
              id: 'xb2c1s1-003', template: 'comparator',
              title: '4s与3d轨道的能量比较与排布',
              params: {
                conceptA: '4s轨道',
                conceptB: '3d轨道',
                featuresA: {
                  items: ['主量子数n=4', '主量子数n=3', '能量低于3d（K和Ca填充时）', '能量高于3d（Sc之后）', '最多容纳2个电子'],
                  correctIndices: [0, 2, 4]
                },
                featuresB: {
                  items: ['主量子数n=4', '主量子数n=3', '能量低于4s', '最多容纳10个电子', '有5个简并轨道'],
                  correctIndices: [1, 3, 4]
                },
                difference: {
                  options: ['能级交错导致填充顺序与书写顺序不同', '电子数不同', '形状不同', '方向不同'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'xb2c1s1-004', template: 'error-detector',
              title: '轨道表达式的书写',
              params: {
                statement: '某同学画出N原子的轨道表达式为1s² 2s² 2pₓ² 2pᵧ¹',
                errorLocation: {
                  options: ['2pₓ²违背洪特规则', '1s²电子数太多', '缺少2s轨道', '2pᵧ¹位置错误'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['N的2p能级有3个电子，应分占3个不同轨道且自旋平行', '1s轨道最多2个电子', '2s轨道已正确填充', '2pᵧ位置正确'],
                  correctIndex: 0
                },
                correctVersion: '1s² 2s² 2pₓ¹ 2pᵧ¹ 2p_z¹',
                hint: '洪特规则：电子在相同能级的简并轨道上优先单独占据且自旋平行'
              }
            }
          ]
        },
        {
          id: 'xb2-ch1-sec2',
          title: '第二节 原子结构与元素的性质',
          exercises: [
            {
              id: 'xb2c1s2-001', template: 'concept-mapper',
              title: '第一电离能的递变规律',
              params: {
                definition: { blank: '第一电离能是指____态电中性____原子失去一个电子转化为____态阳离子所需要的____能量', answer: '气 基 气 最低' },
                attributes: {
                  items: ['同周期从左到右第一电离能总体呈增大趋势', '同主族从上到下第一电离能减小', 'N的第一电离能大于O', 'Be的第一电离能小于B'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['Mg的第一电离能大于Al（3s²全满稳定）', 'Na的第一电离能大于K', 'Cl的第一电离能大于F', 'Ne的第一电离能是第二周期最大的'],
                  correctIndices: [0, 1, 3]
                }
              }
            },
            {
              id: 'xb2c1s2-002', template: 'comparator',
              title: '电离能与电负性的对比',
              params: {
                conceptA: '第一电离能',
                conceptB: '电负性',
                featuresA: {
                  items: ['气态原子失去一个电子所需能量', '原子对键合电子的吸引能力', '单位kJ/mol', '同周期Be>B、N>O有反常', 'F的电负性最大'],
                  correctIndices: [0, 2, 3]
                },
                featuresB: {
                  items: ['气态原子失去一个电子所需能量', '原子对键合电子的吸引能力', '无量纲数值', '同周期从左到右增大', 'Cs的电负性最小'],
                  correctIndices: [1, 2, 3, 4]
                },
                difference: {
                  options: ['电离能是能量单位，电负性是无量纲相对值', '电离能同周期增大，电负性同周期减小', '电离能只与金属有关', '电负性只与非金属有关'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'xb2c1s2-003', template: 'equation-builder',
              title: 'Mg与Al的第一电离能反常',
              params: {
                description: 'Mg与Al在第三周期，Mg的第一电离能（738 kJ/mol）大于Al（578 kJ/mol），选择正确的解释',
                reactants: 'Mg 1s²2s²2p⁶3s²',
                reactionType: {
                  options: ['Mg的3s轨道全满，结构稳定', 'Al的原子半径小于Mg', 'Mg的核电荷数大于Al', 'Mg的相对原子质量大于Al'],
                  correctIndex: 0
                },
                products: 'Mg⁺ 1s²2s²2p⁶3s¹',
                coefficients: ['全满结构更稳定，失去电子需要更多能量'],
                hints: ['洪特规则特例：全满、半满结构更稳定']
              }
            }
          ]
        }
      ]
    },

    {
      id: 'xb2-ch2',
      title: '第二章 分子结构与性质',
      sections: [
        {
          id: 'xb2-ch2-sec1',
          title: '第一节 共价键',
          exercises: [
            {
              id: 'xb2c2s1-001', template: 'comparator',
              title: 'σ键与π键的比较',
              params: {
                conceptA: 'σ键',
                conceptB: 'π键',
                featuresA: {
                  items: ['电子云沿键轴方向头碰头重叠', '电子云垂直于键轴肩并肩重叠', '可绕键轴旋转', '单键都是σ键', '重叠程度大，键能较大'],
                  correctIndices: [0, 2, 3, 4]
                },
                featuresB: {
                  items: ['电子云垂直于键轴肩并肩重叠', '不能绕键轴旋转', '存在于双键和三键中', '重叠程度小，键能较小', '电子云沿键轴方向重叠'],
                  correctIndices: [0, 1, 2, 3]
                },
                difference: {
                  options: ['重叠方式不同：σ键头碰头，π键肩并肩', '方向不同', '原子数不同', '能量相同'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'xb2c2s1-002', template: 'concept-mapper',
              title: '共价键的分类与判断',
              params: {
                definition: { blank: '按电子云重叠方式共价键分为____键和____键，按极性分为____键和____键', answer: 'σ π 极性 非极性' },
                attributes: {
                  items: ['H₂分子中含非极性σ键', 'HCl分子中含极性σ键', 'N₂分子中含1个σ键和2个π键', '乙烷分子中只含σ键'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['Cl₂分子中只含非极性σ键', 'O₂分子中只含σ键', '乙烯中C=C含1个σ键和1个π键', '乙炔中C≡C含1个σ键和2个π键'],
                  correctIndices: [0, 2, 3]
                }
              }
            }
          ]
        },
        {
          id: 'xb2-ch2-sec2',
          title: '第二节 分子的空间结构',
          exercises: [
            {
              id: 'xb2c2s2-001', template: 'concept-mapper',
              title: 'VSEPR理论',
              params: {
                definition: { blank: 'VSEPR理论认为，分子的空间构型由____对和____对之间的排斥作用决定', answer: '成键电子 孤电子' },
                attributes: {
                  items: ['价层电子对包括σ键电子对和孤电子对', '电子对间尽量远离使排斥最小', '孤电子对的排斥力大于成键电子对', 'H₂O的VSEPR模型为正四面体'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['CH₄为正四面体（无孤对电子）', 'NH₃为三角锥形（1对孤对电子）', 'H₂O为V形/角形（2对孤对电子）', 'CO₂为V形'],
                  correctIndices: [0, 1, 2]
                }
              }
            },
            {
              id: 'xb2c2s2-002', template: 'comparator',
              title: '三种杂化轨道类型的比较',
              params: {
                conceptA: 'sp³杂化',
                conceptB: 'sp²杂化',
                featuresA: {
                  items: ['由1个s和3个p轨道杂化', '由1个s和2个p轨道杂化', '生成4个等价杂化轨道', '空间构型为正四面体', '键角109°28\''],
                  correctIndices: [0, 2, 3, 4]
                },
                featuresB: {
                  items: ['由1个s和3个p轨道杂化', '由1个s和2个p轨道杂化', '生成3个等价杂化轨道', '空间构型为平面三角形', '键角120°'],
                  correctIndices: [1, 2, 3, 4]
                },
                difference: {
                  options: ['杂化轨道数目不同：sp³有4个，sp²有3个', '参与杂化的p轨道数不同', '键角不同', '以上都是'],
                  correctIndex: 3
                }
              }
            },
            {
              id: 'xb2c2s2-003', template: 'equation-builder',
              title: 'CH₄、NH₃、H₂O的杂化类型与空间构型',
              params: {
                description: 'CH₄、NH₃、H₂O的中心原子均为sp³杂化，但空间构型不同，选择正确的解释',
                reactants: '中心原子：C、N、O',
                reactionType: {
                  options: ['孤电子对数不同导致排斥不同，构型分别为正四面体、三角锥、V形', '中心原子电负性不同', '配位原子数不同', '键长不同'],
                  correctIndex: 0
                },
                products: 'CH₄正四面体  NH₃三角锥  H₂OV形',
                coefficients: ['C无孤对→正四面体', 'N有1对孤对→三角锥', 'O有2对孤对→V形'],
                hints: ['孤电子对的排斥力大于成键电子对']
              }
            },
            {
              id: 'xb2c2s2-004', template: 'error-detector',
              title: '杂化轨道类型判断',
              params: {
                statement: '某同学认为BF₃中B原子采用sp³杂化，空间构型为正四面体',
                errorLocation: {
                  options: ['BF₃中B是sp²杂化，不是sp³', 'BF₃中B是sp杂化', 'BF₃空间构型正确', 'B没有参与杂化'],
                  correctIndex: 0
                },
                explanation: {
                  options: ['BF₃中B有3个价电子，与3个F形成3个σ键，无孤对电子，采用sp²杂化，平面三角形', 'B有4个价电子应sp³杂化', 'BF₃中B与4个F成键', 'B不参与杂化是离子键'],
                  correctIndex: 0
                },
                correctVersion: 'BF₃中B为sp²杂化，平面三角形构型，键角120°',
                hint: '杂化轨道数 = σ键数 + 孤电子对数'
              }
            }
          ]
        },
        {
          id: 'xb2-ch2-sec3',
          title: '第三节 分子结构与物质的性质',
          exercises: [
            {
              id: 'xb2c2s3-001', template: 'concept-mapper',
              title: '分子极性的判断',
              params: {
                definition: { blank: '分子极性取决于分子结构是否____。正负电荷中心____的是非极性分子', answer: '对称 重合' },
                attributes: {
                  items: ['双原子分子中，同种原子形成非极性键，分子非极性', '双原子分子中，不同原子形成极性键，分子极性', '多原子分子中，结构对称则为非极性分子', 'CH₄为正四面体，是非极性分子'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['CO₂为直线形对称，是非极性分子', 'H₂O为V形不对称，是极性分子', 'NH₃为三角锥形，是非极性分子', 'CCl₄为正四面体，是非极性分子'],
                  correctIndices: [0, 1, 3]
                }
              }
            },
            {
              id: 'xb2c2s3-002', template: 'comparator',
              title: '范德华力与氢键的比较',
              params: {
                conceptA: '范德华力',
                conceptB: '氢键',
                featuresA: {
                  items: ['分子间普遍存在的相互作用力', '存在于含F、O、N的氢化物分子间', '随相对分子质量增大而增大', '影响物质的熔沸点和溶解度', '比化学键弱很多'],
                  correctIndices: [0, 2, 3, 4]
                },
                featuresB: {
                  items: ['存在于含F、O、N的氢化物分子间', '比范德华力强', '具有方向性和饱和性', '使水的熔沸点反常升高', '随相对分子质量增大而增大'],
                  correctIndices: [0, 1, 2, 3]
                },
                difference: {
                  options: ['氢键有方向性和饱和性，范德华力没有', '范德华力比氢键强', '氢键只存在于气态', '范德华力只存在于固态'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'xb2c2s3-003', template: 'equation-builder',
              title: '水的沸点反常高于H₂S的原因',
              params: {
                description: 'H₂O的相对分子质量小于H₂S，但沸点却远高于H₂S，选择正确解释',
                reactants: 'H₂O (Mr=18) vs H₂S (Mr=34)',
                reactionType: {
                  options: ['H₂O分子间存在氢键，H₂S分子间无氢键', 'H₂O的分子极性更强', 'H₂O的相对分子质量更大', 'H₂S分子间作用力更弱'],
                  correctIndex: 0
                },
                products: 'H₂O沸点100℃  H₂S沸点-60℃',
                coefficients: ['O的电负性大且半径小，H₂O分子间形成氢键'],
                hints: ['含F、O、N的氢化物分子间可形成氢键']
              }
            }
          ]
        }
      ]
    },

    {
      id: 'xb2-ch3',
      title: '第三章 晶体结构与性质',
      sections: [
        {
          id: 'xb2-ch3-sec1',
          title: '第一节 物质的聚集状态与晶体的常识',
          exercises: [
            {
              id: 'xb2c3s1-001', template: 'concept-mapper',
              title: '晶体与非晶体的区别',
              params: {
                definition: { blank: '晶体具有____排列、____熔点和____异性，非晶体没有这些特征', answer: '周期性有序 固定 各向' },
                attributes: {
                  items: ['晶体有固定的熔沸点', '非晶体没有固定的熔点', '晶体具有各向异性', '非晶体具有各向异性'],
                  correctIndices: [0, 1, 2]
                },
                boundaries: {
                  items: ['NaCl是晶体', '玻璃是非晶体', '金刚石是晶体', '橡胶是晶体'],
                  correctIndices: [0, 1, 2]
                }
              }
            }
          ]
        },
        {
          id: 'xb2-ch3-sec2',
          title: '第二节 分子晶体与共价晶体',
          exercises: [
            {
              id: 'xb2c3s2-001', template: 'comparator',
              title: '分子晶体与共价晶体的比较',
              params: {
                conceptA: '分子晶体',
                conceptB: '共价晶体（原子晶体）',
                featuresA: {
                  items: ['由分子通过分子间作用力结合', '由原子通过共价键结合', '熔点低', '硬度小', '干冰、I₂是典型代表'],
                  correctIndices: [0, 2, 3, 4]
                },
                featuresB: {
                  items: ['由原子通过共价键结合', '熔点很高', '硬度大', '金刚石、SiO₂是典型代表', '一般不导电'],
                  correctIndices: [0, 1, 2, 3, 4]
                },
                difference: {
                  options: ['构成粒子和作用力不同', '颜色不同', '导电性相同', '密度相同'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'xb2c3s2-002', template: 'concept-mapper',
              title: '典型共价晶体的判断',
              params: {
                definition: { blank: '常见的共价晶体有____、____、____和____', answer: '金刚石 晶体硅 碳化硅 二氧化硅' },
                attributes: {
                  items: ['原子晶体中原子间以共价键形成空间网状结构', '原子晶体熔沸点很高', '原子晶体硬度大', '原子晶体一般不导电（Si是半导体除外）'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['SiO₂是共价晶体', '干冰是分子晶体', 'SiC是共价晶体', 'CO₂是共价晶体'],
                  correctIndices: [0, 1, 2]
                }
              }
            }
          ]
        },
        {
          id: 'xb2-ch3-sec3',
          title: '第三节 金属晶体与离子晶体',
          exercises: [
            {
              id: 'xb2c3s3-001', template: 'comparator',
              title: '四大晶体类型的综合比较',
              params: {
                conceptA: '离子晶体',
                conceptB: '金属晶体',
                featuresA: {
                  items: ['阴阳离子通过离子键结合', '熔融状态能导电', '硬度较大', 'NaCl、CaO是典型代表', '具有良好的延展性'],
                  correctIndices: [0, 1, 2, 3]
                },
                featuresB: {
                  items: ['金属阳离子与自由电子通过金属键结合', '能导电导热', '有延展性', 'Fe、Cu是典型代表', '熔融状态不导电'],
                  correctIndices: [0, 1, 2, 3]
                },
                difference: {
                  options: ['离子晶体熔融导电，金属晶体固态导电', '金属晶体不导电', '离子晶体硬度大', '金属晶体熔点都高'],
                  correctIndex: 0
                }
              }
            },
            {
              id: 'xb2c3s3-002', template: 'procedure-sequencer',
              title: '离子晶体熔沸点比较的思路',
              params: {
                steps: {
                  items: ['比较离子所带电荷数', '比较离子半径大小', '判断晶格能大小', '得出熔沸点高低结论'],
                  correctIndices: [0, 1, 2, 3],
                  correctOrder: '离子电荷 → 离子半径 → 晶格能 → 熔沸点'
                },
                notes: {
                  items: ['离子电荷越多晶格能越大', '离子半径越小晶格能越大', '晶格能越大熔沸点越高', 'MgO的熔沸点高于NaCl'],
                  correctIndices: [0, 1, 2, 3]
                }
              }
            }
          ]
        },
        {
          id: 'xb2-ch3-sec4',
          title: '第四节 配合物与超分子',
          exercises: [
            {
              id: 'xb2c3s4-001', template: 'concept-mapper',
              title: '配合物的基本概念',
              params: {
                definition: { blank: '配合物由____（提供空轨道）和____（提供孤对电子）通过____键结合而成', answer: '中心原子/离子 配体 配位' },
                attributes: {
                  items: ['中心原子通常是过渡金属离子', '配体必须含有孤对电子', '配位键是一种特殊的共价键', '[Cu(NH₃)₄]²⁺中Cu²⁺是中心离子'],
                  correctIndices: [0, 1, 2, 3]
                },
                boundaries: {
                  items: ['[Cu(NH₃)₄]²⁺是配合物', 'Fe(SCN)₃是配合物', 'NaCl是配合物', '[Ag(NH₃)₂]⁺是配合物'],
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
