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
              id: 'xb2c1s1-001', template: 'error-analysis',
              title: '电子排布式的常见错误',
              params: {
                statement: '某同学写出Fe原子的电子排布式为1s²2s²2p⁶3s²3p⁶3d⁸',
                errorOptions: ['3d⁸的电子数错误', '缺少4s²轨道', '1s²的电子数错误', '2p⁶超出容量'],
                errorCorrectIndex: 1,
                principleKeyTerms: ['构造原理', '能级交错', '4s', '3d'],
                principleHint: '电子填充顺序遵循构造原理，注意4s与3d的能级交错',
                correctVersion: '1s²2s²2p⁶3s²3p⁶3d⁶4s²',
                finalHint: '填充顺序：1s<2s<2p<3s<3p<4s<3d；书写顺序按能层由低到高',
                reasoning: ['Fe原子核外有26个电子', '根据构造原理，填充顺序为1s→2s→2p→3s→3p→4s→3d，4s能量低于3d，先填4s后填3d', '因此Fe的3d层实际有6个电子而不是8个', '正确排布式应为1s²2s²2p⁶3s²3p⁶3d⁶4s²']
              }
            },
            {
              id: 'xb2c1s1-002', template: 'concept-construction',
              title: '能级与电子排布规则',
              params: {
                cases: ['H：1s¹', 'He：1s²', 'N：1s²2s²2p₁¹2p₂¹2p₃¹'],
                caseOptions: ['遵循能量最低原理', '遵循泡利原理', '遵循洪特规则'],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '电子排布的三条基本原理',
                conceptName: '电子排布三原理',
                definitionKeyTerms: ['能量最低', '泡利', '洪特'],
                definitionHint: '原子核外电子排布遵循____原理、____原理和____规则',
                fullDefinition: '原子核外电子排布遵循能量最低原理、泡利原理和洪特规则',
                boundaryItems: ['Cr的价电子排布为3d⁵4s¹', 'Cu的价电子排布为3d⁹4s²', 'N的轨道表达式为1s²2s²2p₁¹2p₂¹2p₃¹', 'O的轨道表达式为1s²2s²2p₁²2p₂¹2p₃¹'],
                boundaryCorrectIndices: [0, 2],
                explainPrompt: '为什么Cr的价电子排布是3d⁵4s¹而不是3d⁴4s²？',
                explainHint: '洪特规则特例：半满结构更稳定',
                explainKeyTerms: ['半满', '洪特规则特例'],
                reasoning: ['Cr原子核外有24个电子', '按构造原理应填为3d⁴4s²', '但3d轨道半满（d⁵）时能量更低，因此洪特规则特例使Cr的排布为3d⁵4s¹', '同理Cu为3d¹⁰4s¹（全满）']
              }
            },
            {
              id: 'xb2c1s1-003', template: 'comparison-reasoning',
              title: '4s与3d轨道的能量比较与排布',
              params: {
                conceptA: '4s轨道',
                conceptB: '3d轨道',
                description: '4s轨道主量子数n=4，3d轨道主量子数n=3。由于能级交错，4s能量在K（19）、Ca（20）时低于3d，但在Sc（21）之后高于3d。',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么不能说3d轨道的能量始终高于4s？',
                excludeHint: '能级交错发生在不同能层之间，且随原子序数变化',
                excludeKeyTerms: ['能级交错', '原子序数', '能量变化'],
                differenceOptions: ['能级交错导致填充顺序与书写顺序不同', '电子数不同', '形状不同', '方向不同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: 'Sc（原子序数21）的最后一个电子填入哪个轨道？',
                scenarioOptions: ['3d轨道', '4s轨道', '4p轨道', '4d轨道'],
                scenarioCorrectIndex: 0,
                reasoning: ['K和Ca时4s能量低于3d，电子先填4s后填3d', '从Sc开始3d能量低于4s，因此最后一个电子填入3d', '书写时按主量子数顺序（4s在3d前），但填充顺序需按能量高低', '能级交错导致同一能层内不同能级能量可能随原子序数交叉变化']
              }
            },
            {
              id: 'xb2c1s1-004', template: 'error-analysis',
              title: '轨道表达式的书写',
              params: {
                statement: '某同学画出N原子的轨道表达式为1s² 2s² 2pₓ² 2pᵧ¹',
                errorOptions: ['2pₓ²违背洪特规则', '1s²电子数太多', '缺少2s轨道', '2pᵧ¹位置错误'],
                errorCorrectIndex: 0,
                principleKeyTerms: ['洪特规则', '简并轨道', '分占', '自旋平行'],
                principleHint: '电子在简并轨道上优先分占且自旋平行',
                correctVersion: '1s² 2s² 2pₓ¹ 2pᵧ¹ 2p_z¹',
                finalHint: '洪特规则：相同能级简并轨道上，电子优先单独占据且自旋平行',
                reasoning: ['N原子核外有7个电子，排布为1s²2s²2p³', '2p能级有3个简并轨道（2pₓ、2pᵧ、2p_z）', '洪特规则要求3个电子分占3个不同轨道且自旋平行', '正确轨道表达式为1s² 2s² 2pₓ¹ 2pᵧ¹ 2p_z¹']
              }
            }
          ]
        },
        {
          id: 'xb2-ch1-sec2',
          title: '第二节 原子结构与元素的性质',
          exercises: [
            {
              id: 'xb2c1s2-001', template: 'concept-construction',
              title: '第一电离能的递变规律',
              params: {
                cases: ['同一周期从Li到Ne电离能总体增大', '同一主族从Li到Cs电离能逐渐减小', 'N的电离能大于O，Be的电离能大于B（反常现象）'],
                caseOptions: ['同周期从左到右总体增大', '同主族从上到下减小', '半满全满结构导致反常'],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '第一电离能的周期性递变规律',
                conceptName: '第一电离能递变规律',
                definitionKeyTerms: ['气态', '基态', '最低能量'],
                definitionHint: '第一电离能是指____态电中性____原子失去一个电子转化为____态阳离子所需要的____能量',
                fullDefinition: '第一电离能是指气态电中性基态原子失去一个电子转化为气态基态阳离子所需要的最低能量',
                boundaryItems: ['Mg的第一电离能大于Al（3s²全满稳定）', 'Na的第一电离能大于K', 'Cl的第一电离能大于F', 'Ne的第一电离能是第二周期最大的'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么N的第一电离能大于O？',
                explainHint: 'N的2p轨道电子构型为半满，更稳定',
                explainKeyTerms: ['半满', '洪特规则特例'],
                reasoning: ['N：1s²2s²2p³，2p轨道半满，结构稳定，失去电子需更多能量', 'O：1s²2s²2p⁴，需将电子配对产生排斥，易失去一个电子', '因此N的第一电离能大于O', '同理，Be的第一电离能大于B（Be的2s²全满）']
              }
            },
            {
              id: 'xb2c1s2-002', template: 'comparison-reasoning',
              title: '电离能与电负性的对比',
              params: {
                conceptA: '第一电离能',
                conceptB: '电负性',
                description: '第一电离能是气态原子失去电子所需的最低能量（kJ/mol）；电负性是原子对键合电子的吸引能力，为无量纲相对值（鲍林标度）。两者同周期总体均增大，但电离能有反常（Be>B，N>O）。',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么电负性不能与电离能直接比较数值大小？',
                excludeHint: '考虑两者的单位与物理意义',
                excludeKeyTerms: ['无量纲', '能量单位', '物理意义'],
                differenceOptions: ['电离能是能量单位，电负性是无量纲相对值', '电离能同周期增大，电负性同周期减小', '电离能只与金属有关', '电负性只与非金属有关'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '同周期元素从左到右，电离能和电负性的变化趋势分别是什么？',
                scenarioOptions: ['电离能总体增大但有反常，电负性一直增大', '都一直增大', '都一直减小', '电离能一直增大，电负性总体增大'],
                scenarioCorrectIndex: 0,
                reasoning: ['电离能是能量物理量（kJ/mol），电负性是无量纲相对值', '两者同周期均随原子序数增大而总体增大', '电离能有反常（半满全满结构的稳定性），电负性无此反常', 'F的电负性最大（4.0），He的电离能最大']
              }
            },
            {
              id: 'xb2c1s2-003', template: 'concept-construction',
              title: 'Mg与Al的第一电离能反常',
              params: {
                cases: ['Mg价电子排布3s²，第一电离能738 kJ/mol', 'Al价电子排布3s²3p¹，第一电离能578 kJ/mol', '一般规律：同周期从左到右电离能增大，但Mg>Al反常'],
                caseOptions: ['Mg的3s轨道全满，结构更稳定', 'Al的原子半径小于Mg', 'Mg的核电荷数大于Al', 'Mg的相对原子质量大于Al'],
                caseCorrectIndices: [0],
                caseCommonality: '全满电子结构使原子更稳定，电离能更大',
                conceptName: '全满结构的稳定性',
                definitionKeyTerms: ['全满', '稳定', '电离能'],
                definitionHint: '处于____状态的电子构型更稳定，失去电子需要____能量',
                fullDefinition: '全满电子结构（s²、p⁶、d¹⁰、f¹⁴）使原子能量更低、更稳定，因此第一电离能更大',
                boundaryItems: ['Mg的第一电离能大于Al（3s²全满）', 'N的第一电离能大于O（2p³半满）', 'Zn的第一电离能大于Ga（3d¹⁰4s²全满）', 'Ne的第一电离能大于Na（2p⁶全满）'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么Zn的第一电离能大于Ga？',
                explainHint: 'Zn的价层电子构型是什么？',
                explainKeyTerms: ['3d¹⁰', '4s²', '全满'],
                reasoning: ['Mg的价电子排布为3s²，处于全满稳定状态', 'Al的价电子排布为3s²3p¹，失去一个电子反而能达到3s²全满', '全满结构需破坏才能电离，需要更多能量', '因此Mg的第一电离能（738）反常大于Al（578）']
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
              id: 'xb2c2s1-001', template: 'comparison-reasoning',
              title: 'σ键与π键的比较',
              params: {
                conceptA: 'σ键',
                conceptB: 'π键',
                description: 'σ键电子云沿键轴头碰头重叠，可绕键轴旋转，单键均为σ键，重叠程度大键能较大。π键电子云垂直于键轴肩并肩重叠，不能绕键轴旋转，存在于双键和三键中，重叠程度小键能较小。',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么π键不能绕键轴旋转？',
                excludeHint: 'π键的电子云重叠方式有何特点？',
                excludeKeyTerms: ['肩并肩', '平行', '断开'],
                differenceOptions: ['重叠方式不同：σ键头碰头，π键肩并肩', '方向不同', '原子数不同', '能量相同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: 'N₂分子（N≡N）中含有几个σ键和几个π键？',
                scenarioOptions: ['1个σ键和2个π键', '2个σ键和1个π键', '3个σ键', '3个π键'],
                scenarioCorrectIndex: 0,
                reasoning: ['σ键电子云沿键轴头碰头重叠，重叠度高，键能大，可绕键轴旋转', 'π键电子云垂直于键轴肩并肩重叠，重叠度低，键能小，不能绕键轴旋转', '单键=1个σ键，双键=1σ+1π，三键=1σ+2π', 'N≡N三键含1个σ键和2个π键']
              }
            },
            {
              id: 'xb2c2s1-002', template: 'concept-construction',
              title: '共价键的分类与判断',
              params: {
                cases: ['H₂分子中H-H为同种原子间的共价键', 'HCl分子中H-Cl为不同原子间的共价键', 'N₂分子中N≡N含多个共价键'],
                caseOptions: ['同种原子形成非极性键', '不同原子形成极性键', '三键含1个σ键和2个π键'],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '共价键可按键的极性和重叠方式分类',
                conceptName: '共价键分类体系',
                definitionKeyTerms: ['σ键', 'π键', '极性键', '非极性键'],
                definitionHint: '按电子云重叠方式分为____键和____键，按极性分为____键和____键',
                fullDefinition: '按电子云重叠方式共价键分为σ键和π键，按极性分为极性键和非极性键',
                boundaryItems: ['Cl₂分子中只含非极性σ键', 'O₂分子中只含σ键', '乙烯中C=C含1个σ键和1个π键', '乙炔中C≡C含1个σ键和2个π键'],
                boundaryCorrectIndices: [0, 2, 3],
                explainPrompt: '为什么O₂分子中既有σ键又有π键？',
                explainHint: 'O₂分子的Lewis结构中有O=O双键',
                explainKeyTerms: ['双键', 'σ键', 'π键'],
                reasoning: ['H₂中H-H为非极性σ键（同种原子，电负性差为零）', 'HCl中H-Cl为极性σ键（不同原子电负性不同）', 'N₂中N≡N三键含1个σ键和2个π键', '共价键分类：按重叠方式（σ/π），按成键原子异同（极性/非极性）']
              }
            }
          ]
        },
        {
          id: 'xb2-ch2-sec2',
          title: '第二节 分子的空间结构',
          exercises: [
            {
              id: 'xb2c2s2-001', template: 'concept-construction',
              title: 'VSEPR理论',
              params: {
                cases: ['CH₄：正四面体构型，键角109.5°', 'NH₃：三角锥构型，键角107.3°', 'H₂O：V形构型，键角104.5°'],
                caseOptions: ['中心原子无孤对电子，为正四面体', '中心原子有1对孤对电子，为三角锥', '中心原子有2对孤对电子，为V形'],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '价层电子对互斥理论决定分子空间构型',
                conceptName: 'VSEPR理论（价层电子对互斥理论）',
                definitionKeyTerms: ['成键电子对', '孤电子对', '排斥'],
                definitionHint: 'VSEPR理论认为，分子的空间构型由____对和____对之间的排斥作用决定',
                fullDefinition: 'VSEPR理论认为分子的空间构型由成键电子对和孤电子对之间的排斥作用决定，电子对间尽量远离使排斥最小',
                boundaryItems: ['CH₄为正四面体（无孤对电子）', 'NH₃为三角锥形（1对孤对电子）', 'H₂O为V形（2对孤对电子）', 'CO₂为V形'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么H₂O的键角（104.5°）小于NH₃（107.3°）？',
                explainHint: '孤电子对数越多，对成键电子对的排斥越大',
                explainKeyTerms: ['孤对电子', '排斥力', '键角压缩'],
                reasoning: ['价层电子对（包括成键和孤对）间尽量远离使排斥最小', '孤电子对的排斥力大于成键电子对', 'CH₄无孤对→4对排斥均衡→正四面体109.5°', 'NH₃有1对孤对→键角压缩至107.3°，H₂O有2对→压缩至104.5°']
              }
            },
            {
              id: 'xb2c2s2-002', template: 'comparison-reasoning',
              title: '三种杂化轨道类型的比较',
              params: {
                conceptA: 'sp³杂化',
                conceptB: 'sp²杂化',
                description: 'sp³由1个s和3个p轨道杂化生成4个等价杂化轨道，正四面体构型，键角109°28\'。sp²由1个s和2个p轨道杂化生成3个等价杂化轨道，平面三角形构型，键角120°。',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么sp²杂化只能形成3个杂化轨道？',
                excludeHint: '参与杂化的原子轨道总数决定杂化轨道数',
                excludeKeyTerms: ['1个s', '2个p', '共3个轨道'],
                differenceOptions: ['杂化轨道数目不同：sp³有4个，sp²有3个', '参与杂化的p轨道数不同', '键角不同', '以上都是'],
                differenceCorrectIndex: 3,
                scenarioPrompt: 'BF₃分子中B原子采用什么杂化？空间构型如何？',
                scenarioOptions: ['sp²杂化，平面三角形', 'sp³杂化，正四面体', 'sp杂化，直线形', '不杂化'],
                scenarioCorrectIndex: 0,
                reasoning: ['sp³由1个s和3个p杂化→4个轨道，正四面体，键角109°28\'', 'sp²由1个s和2个p杂化→3个轨道，平面三角形，键角120°', 'sp由1个s和1个p杂化→2个轨道，直线形，键角180°', '杂化轨道数=σ键数+孤电子对数，用于确定杂化类型']
              }
            },
            {
              id: 'xb2c2s2-003', template: 'concept-construction',
              title: 'CH₄、NH₃、H₂O的杂化类型与空间构型',
              params: {
                cases: ['CH₄：正四面体，键角109.5°，无孤对电子', 'NH₃：三角锥，键角107.3°，有1对孤对电子', 'H₂O：V形，键角104.5°，有2对孤对电子'],
                caseOptions: ['无孤对电子，构型为正四面体', '1对孤对电子，构型为三角锥', '2对孤对电子，构型为V形'],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '中心原子均为sp³杂化，孤电子对数不同导致空间构型不同',
                conceptName: '孤电子对效应对分子构型的影响',
                definitionKeyTerms: ['孤电子对', 'sp³杂化', '键角压缩'],
                definitionHint: '相同杂化方式下，____对数越多，键角被____得越小',
                fullDefinition: '中心原子相同杂化方式下，孤电子对数越多，对成键电子对的排斥越大，键角被压缩得越小',
                boundaryItems: ['H₂O为V形（2对孤对电子）', 'NH₃为三角锥（1对孤对电子）', 'CH₄为正四面体（0对孤对电子）', 'CO₂为直线形'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么H₂O的键角（104.5°）比NH₃（107.3°）更小？',
                explainHint: 'H₂O有2对孤对电子，NH₃只有1对',
                explainKeyTerms: ['孤对电子', '排斥', '压缩'],
                reasoning: ['CH₄、NH₃、H₂O中心原子均为sp³杂化，电子对构型均为四面体', 'CH₄无孤对电子，4个成键电子对排斥均衡', 'NH₃有1对孤对电子，孤对排斥力>成键排斥，键角压缩至107.3°', 'H₂O有2对孤对电子，键角进一步压缩至104.5°']
              }
            },
            {
              id: 'xb2c2s2-004', template: 'error-analysis',
              title: '杂化轨道类型判断',
              params: {
                statement: '某同学认为BF₃中B原子采用sp³杂化，空间构型为正四面体',
                errorOptions: ['BF₃中B是sp²杂化，不是sp³', 'BF₃中B是sp杂化', 'BF₃空间构型正确', 'B没有参与杂化'],
                errorCorrectIndex: 0,
                principleKeyTerms: ['杂化轨道数', 'σ键数', '孤电子对数'],
                principleHint: '杂化轨道数 = σ键数（配位数） + 孤电子对数',
                correctVersion: 'BF₃中B为sp²杂化，平面三角形构型，键角120°',
                finalHint: 'B有3个价电子，与3个F形成3个σ键，无孤对电子，杂化轨道数=3',
                reasoning: ['B原子有3个价电子，与3个F原子形成3个σ键', 'B原子无孤对电子，杂化轨道数=3+0=3', '需要3个等价杂化轨道，故采用sp²杂化', 'sp²杂化空间构型为平面三角形，键角120°']
              }
            }
          ]
        },
        {
          id: 'xb2-ch2-sec3',
          title: '第三节 分子结构与物质的性质',
          exercises: [
            {
              id: 'xb2c2s3-001', template: 'concept-construction',
              title: '分子极性的判断',
              params: {
                cases: ['CO₂直线形对称，正负电荷中心重合', 'CCl₄正四面体对称，正负电荷中心重合', 'CH₄正四面体对称，正负电荷中心重合'],
                caseOptions: ['结构对称的分子为非极性分子', '含极性键的分子一定是极性分子', '只由非极性键构成的分子为非极性分子'],
                caseCorrectIndices: [0],
                caseCommonality: '分子结构对称时正负电荷中心重合，为非极性分子',
                conceptName: '分子极性判断规则',
                definitionKeyTerms: ['对称', '正负电荷中心', '重合'],
                definitionHint: '分子极性取决于分子结构是否____。正负电荷中心____的是非极性分子',
                fullDefinition: '分子极性由分子结构对称性决定：正负电荷中心重合的是非极性分子，不重合的是极性分子',
                boundaryItems: ['CO₂为直线形对称，是非极性分子', 'H₂O为V形不对称，是极性分子', 'NH₃为三角锥形，是非极性分子', 'CCl₄为正四面体，是非极性分子'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么CO₂含极性键（C=O）却是非极性分子？',
                explainHint: '考虑CO₂的空间构型',
                explainKeyTerms: ['直线形', '对称', '向量和为零'],
                reasoning: ['分子极性的判断依据是正负电荷中心是否重合', 'CO₂为直线形对称结构，两个C=O键极性相互抵消', 'CCl₄为正四面体对称，四个C-Cl键极性向量和为零', 'H₂O为V形不对称结构，两个O-H键极性不能抵消，为极性分子']
              }
            },
            {
              id: 'xb2c2s3-002', template: 'comparison-reasoning',
              title: '范德华力与氢键的比较',
              params: {
                conceptA: '范德华力',
                conceptB: '氢键',
                description: '范德华力是分子间普遍存在的作用力，随相对分子质量增大而增大，影响熔沸点和溶解度。氢键存在于含F、O、N的氢化物分子间，比范德华力强，有方向性和饱和性。',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么氢键不是化学键？',
                excludeHint: '比较氢键与化学键的强度',
                excludeKeyTerms: ['强度', '分子间作用力', '化学键'],
                differenceOptions: ['氢键有方向性和饱和性，范德华力没有', '范德华力比氢键强', '氢键只存在于气态', '范德华力只存在于固态'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '为什么H₂O的沸点（100℃）远高于H₂S（-60℃）？',
                scenarioOptions: ['H₂O分子间存在氢键', 'H₂O的相对分子质量更大', 'H₂S分子间存在氢键', 'H₂O的分子极性更弱'],
                scenarioCorrectIndex: 0,
                reasoning: ['范德华力普遍存在，随相对分子质量增大而增大', '氢键存在于含F、O、N的氢化物分子间，有方向性和饱和性', '氢键的强度约为范德华力的5-10倍', '水的沸点反常高就是因为水分子间能形成氢键']
              }
            },
            {
              id: 'xb2c2s3-003', template: 'concept-construction',
              title: '水的沸点反常高于H₂S的原因',
              params: {
                cases: ['H₂O（Mr=18）沸点100℃', 'H₂S（Mr=34）沸点-60℃', '一般规律：相对分子质量越大，范德华力越大，沸点越高'],
                caseOptions: ['H₂O分子间存在氢键使沸点反常升高', 'H₂O的分子极性更强', 'H₂O的相对分子质量更大', 'H₂S分子间作用力更弱'],
                caseCorrectIndices: [0],
                caseCommonality: '氢键使水的沸点反常高于同族氢化物',
                conceptName: '氢键对沸点的影响',
                definitionKeyTerms: ['氢键', '沸点', '反常'],
                definitionHint: '含F、O、N的氢化物分子间可形成____，使熔沸点____升高',
                fullDefinition: '含F、O、N的氢化物分子间可形成氢键，使熔沸点反常高于同族其他元素的氢化物',
                boundaryItems: ['H₂O的沸点高于H₂S（氢键）', 'HF的沸点高于HCl（氢键）', 'NH₃的沸点高于PH₃（氢键）', 'CH₄的沸点高于SiH₄'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么CH₄的沸点低于SiH₄？',
                explainHint: 'CH₄分子间无氢键，遵循范德华力递变规律',
                explainKeyTerms: ['范德华力', '相对分子质量'],
                reasoning: ['一般规律：相对分子质量越大，范德华力越大，沸点越高', 'H₂O（Mr=18）< H₂S（Mr=34），但H₂O沸点远高于H₂S', '原因是H₂O分子间有氢键，H₂S分子间无氢键', '氢键的强度远大于范德华力，导致沸点反常升高']
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
              id: 'xb2c3s1-001', template: 'concept-construction',
              title: '晶体与非晶体的区别',
              params: {
                cases: ['NaCl有固定熔点、有规则外形', '金刚石有固定熔点、各向异性', '玻璃无固定熔点、各向同性'],
                caseOptions: ['晶体有固定熔点和各向异性', '非晶体无固定熔点', '晶体有周期性有序排列'],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '晶体与非晶体的本质区别',
                conceptName: '晶体与非晶体的区别',
                definitionKeyTerms: ['周期性有序', '固定熔点', '各向异性'],
                definitionHint: '晶体具有____排列、____熔点和____异性，非晶体没有这些特征',
                fullDefinition: '晶体具有周期性有序排列、固定熔点和各向异性，非晶体没有这些特征',
                boundaryItems: ['NaCl是晶体', '玻璃是非晶体', '金刚石是晶体', '橡胶是晶体'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么玻璃没有固定的熔点？',
                explainHint: '玻璃的内部结构如何？',
                explainKeyTerms: ['非晶体', '长程无序', '短程有序'],
                reasoning: ['晶体内部质点在三维空间呈周期性有序排列', '晶体具有固定熔点和各向异性', '非晶体内部质点排列长程无序、短程有序', '非晶体无固定熔点、各向同性']
              }
            }
          ]
        },
        {
          id: 'xb2-ch3-sec2',
          title: '第二节 分子晶体与共价晶体',
          exercises: [
            {
              id: 'xb2c3s2-001', template: 'comparison-reasoning',
              title: '分子晶体与共价晶体的比较',
              params: {
                conceptA: '分子晶体',
                conceptB: '共价晶体（原子晶体）',
                description: '分子晶体由分子通过分子间作用力结合，熔点低、硬度小，干冰、I₂是典型代表。共价晶体由原子通过共价键结合成空间网状结构，熔点高、硬度大，金刚石、SiO₂是典型代表。',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么共价晶体熔点远高于分子晶体？',
                excludeHint: '比较两种晶体内微粒间的作用力',
                excludeKeyTerms: ['共价键', '分子间作用力', '强度差异'],
                differenceOptions: ['构成粒子和作用力不同', '颜色不同', '导电性相同', '密度相同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '下列物质中熔点最高的是哪个？',
                scenarioOptions: ['金刚石（共价晶体）', '干冰（分子晶体）', '碘（分子晶体）', '冰（分子晶体）'],
                scenarioCorrectIndex: 0,
                reasoning: ['分子晶体由分子通过分子间作用力（范德华力/氢键）结合', '共价晶体由原子通过共价键结合成空间网状结构', '共价键强度远大于分子间作用力', '因此共价晶体熔点更高、硬度更大']
              }
            },
            {
              id: 'xb2c3s2-002', template: 'concept-construction',
              title: '典型共价晶体的判断',
              params: {
                cases: ['金刚石：碳原子通过共价键形成空间网状结构', '晶体硅：硅原子通过共价键形成空间网状结构', 'SiO₂：硅氧原子通过共价键形成空间网状结构'],
                caseOptions: ['由原子通过共价键形成空间网状结构', '由分子通过分子间作用力形成', '熔沸点很高、硬度很大'],
                caseCorrectIndices: [0, 2],
                caseCommonality: '共价晶体的结构特征与物理性质',
                conceptName: '共价晶体（原子晶体）',
                definitionKeyTerms: ['共价键', '空间网状', '金刚石'],
                definitionHint: '常见的共价晶体有____、____、____和____',
                fullDefinition: '共价晶体是由原子通过共价键结合形成的空间网状结构晶体，如金刚石、晶体硅、碳化硅、二氧化硅',
                boundaryItems: ['SiO₂是共价晶体', '干冰是分子晶体', 'SiC是共价晶体', 'CO₂是共价晶体'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么SiO₂是共价晶体而CO₂是分子晶体？',
                explainHint: 'Si与O和C与O的成键方式不同',
                explainKeyTerms: ['空间网状', '分子间作用力', '共价键'],
                reasoning: ['共价晶体由原子通过共价键形成空间网状结构', '金刚石、晶体硅、SiC、SiO₂都是典型共价晶体', '共价晶体熔沸点高、硬度大', '共价晶体一般不导电（Si是半导体除外）']
              }
            }
          ]
        },
        {
          id: 'xb2-ch3-sec3',
          title: '第三节 金属晶体与离子晶体',
          exercises: [
            {
              id: 'xb2c3s3-001', template: 'comparison-reasoning',
              title: '四大晶体类型的综合比较',
              params: {
                conceptA: '离子晶体',
                conceptB: '金属晶体',
                description: '离子晶体由阴阳离子通过离子键结合，熔融态能导电，硬度较大，NaCl、CaO是典型。金属晶体由金属阳离子与自由电子通过金属键结合，能导电导热有延展性，Fe、Cu是典型。',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么金属晶体具有延展性而离子晶体不具有？',
                excludeHint: '比较两者的成键方式',
                excludeKeyTerms: ['自由电子', '金属键', '滑动'],
                differenceOptions: ['离子晶体熔融导电，金属晶体固态导电', '金属晶体不导电', '离子晶体硬度都小', '所有金属晶体熔点都高'],
                differenceCorrectIndex: 0,
                scenarioPrompt: 'NaCl在熔融状态下能导电但在固态时不导电，为什么？',
                scenarioOptions: ['熔融时离子可自由移动，固态时离子被束缚在晶格中', '固态时NaCl不导电是因为没有自由电子', '熔融时电子可自由移动', '固态时NaCl不存在离子'],
                scenarioCorrectIndex: 0,
                reasoning: ['离子晶体由阴阳离子通过离子键结合，熔融时离子可自由移动而导电', '金属晶体由金属阳离子和自由电子通过金属键结合，自由电子使金属固态就能导电', '金属键无方向性，原子层可滑动，故有延展性', '离子键有方向性，滑动会破坏结构，故离子晶体脆']
              }
            },
            {
              id: 'xb2c3s3-002', template: 'experimental-reasoning',
              title: '离子晶体熔沸点比较的思路',
              params: {
                goal: '比较不同离子晶体的熔沸点高低',
                principleOptions: ['晶格能越大，离子晶体熔沸点越高', '相对分子质量越大，熔沸点越高', '分子间作用力越大，熔沸点越高', '共价键越强，熔沸点越高'],
                principleCorrectIndex: 0,
                keyStepItems: ['比较离子所带电荷数', '比较离子半径大小', '判断晶格能大小', '得出熔沸点高低结论'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['比较离子电荷', '比较离子半径', '分析晶格能', '判断熔沸点'],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先分析影响晶格能的微观因素，再得出宏观熔沸点结论',
                consequenceOptions: ['离子电荷越多、半径越小，晶格能越大，熔沸点越高', '离子电荷越多、半径越大，晶格能越大', '离子电荷越少、半径越小，晶格能越大', '晶格能与离子电荷和半径无关'],
                consequenceCorrectIndex: 0,
                reasoning: ['晶格能是衡量离子晶体稳定性的物理量', '离子电荷越多，离子间静电作用越强，晶格能越大', '离子半径越小，离子间距越小，晶格能越大', '晶格能越大，离子晶体熔沸点越高']
              }
            }
          ]
        },
        {
          id: 'xb2-ch3-sec4',
          title: '第四节 配合物与超分子',
          exercises: [
            {
              id: 'xb2c3s4-001', template: 'concept-construction',
              title: '配合物的基本概念',
              params: {
                cases: ['[Cu(NH₃)₄]²⁺：Cu²⁺为中心，NH₃为配体', '[Ag(NH₃)₂]⁺：Ag⁺为中心，NH₃为配体', 'Fe(SCN)₃：Fe³⁺为中心，SCN⁻为配体'],
                caseOptions: ['中心原子/离子提供空轨道', '配体提供孤对电子', '配位键是特殊的共价键'],
                caseCorrectIndices: [0, 1, 2],
                caseCommonality: '配合物由中心原子和配体通过配位键形成',
                conceptName: '配合物的基本结构',
                definitionKeyTerms: ['中心原子/离子', '配体', '配位键'],
                definitionHint: '配合物由____（提供空轨道）和____（提供孤对电子）通过____键结合而成',
                fullDefinition: '配合物由中心原子/离子（提供空轨道）和配体（提供孤对电子）通过配位键结合而成',
                boundaryItems: ['[Cu(NH₃)₄]²⁺是配合物', 'Fe(SCN)₃是配合物', 'NaCl是配合物', '[Ag(NH₃)₂]⁺是配合物'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么NaCl不是配合物？',
                explainHint: 'Na⁺和Cl⁻之间是什么作用力？',
                explainKeyTerms: ['离子键', '配位键', '孤对电子'],
                reasoning: ['配合物由中心原子（提供空轨道）和配体（提供孤对电子）通过配位键形成', '中心原子通常是过渡金属离子（有空的d轨道）', '配体必须含有孤对电子（如NH₃、H₂O、CN⁻、SCN⁻等）', '配位键是一种特殊的共价键（共用电子对由配体单方提供）']
              }
            }
          ]
        }
      ]
    }
  ]
};
