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
              id: 'xb3c1s1-001', template: 'concept-construction',
              title: '官能团的识别',
              params: {
                cases: ['CH₃CH₂OH中含羟基-OH', 'HCHO中含醛基-CHO', 'CH₃COOCH₃中含酯基-COO-'],
                caseOptions: ['均为决定有机化合物化学特性的原子或原子团', '均为含有氧元素的官能团', '均为不含碳的官能团'],
                caseCorrectIndices: [0],
                caseCommonality: '每个案例中的结构单元（羟基、醛基、酯基）都是决定有机化合物化学特性的特殊原子或原子团，即官能团',
                conceptName: '官能团',
                definitionKeyTerms: ['化学特性', '特殊', '原子或原子团'],
                definitionHint: '官能团是决定有机化合物什么性质的什么结构单元？',
                fullDefinition: '官能团是决定有机化合物化学特性的特殊原子或原子团',
                boundaryItems: ['CH₃CH₂OH中含羟基', 'HCHO中含醛基', 'CH₃COOH中含酯基', 'CH₃COOCH₃中含酯基'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么CH₃COOH中含酯基是错误说法？',
                explainHint: '乙酸含有羧基(-COOH)而非酯基',
                explainKeyTerms: ['羧基', '酯基'],
                reasoning: [
                  '观察每个案例中的结构单元：羟基、醛基、酯基',
                  '这些结构单元都决定了所在化合物的化学特性',
                  '官能团的正确定义：决定有机化合物化学特性的特殊原子或原子团',
                  '注意区分易混淆的官能团：乙酸含羧基而非酯基'
                ]
              }
            },
            {
              id: 'xb3c1s1-002', template: 'error-analysis',
              title: '同分异构体计数',
              params: {
                statement: '分子式为C₄H₁₀的烷烃有3种同分异构体',
                errorOptions: ['C₄H₁₀只有2种同分异构体', 'C₄H₁₀有4种同分异构体', 'C₄H₁₀不是烷烃', '同分异构体只有1种'],
                errorCorrectIndex: 0,
                principleKeyTerms: ['同分异构体', '碳链异构', '正丁烷', '异丁烷'],
                principleHint: 'C₄H₁₀的碳链只有直链和带支链两种连接方式',
                correctVersion: 'C₄H₁₀有2种同分异构体：正丁烷和异丁烷',
                finalHint: 'C₄H₁₀的同分异构体为正丁烷CH₃CH₂CH₂CH₃和异丁烷(CH₃)₂CHCH₃共2种',
                reasoning: [
                  'C₄H₁₀符合烷烃通式CnH₂n₊₂，是烷烃',
                  '碳链异构只有两种：直链（正丁烷）和带一个支链（异丁烷）',
                  '正丁烷：CH₃CH₂CH₂CH₃；异丁烷：(CH₃)₂CHCH₃',
                  '所以正确说法是C₄H₁₀有2种同分异构体'
                ]
              }
            },
            {
              id: 'xb3c1s1-003', template: 'comparison-reasoning',
              title: '同系物与同分异构体的区别',
              params: {
                conceptA: '同系物',
                conceptB: '同分异构体',
                description: '结构相似，分子组成相差一个或多个CH₂，通式相同，化学性质相似',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么这个描述不符合同分异构体？',
                excludeHint: '同分异构体的分子式相同，而非相差CH₂',
                excludeKeyTerms: ['分子式相同', '分子组成相差'],
                differenceOptions: ['同系物分子式不同，同分异构体分子式相同', '同系物结构不同，同分异构体结构相似', '同系物属于同一类物质', '同分异构体属于同一类物质'],
                differenceCorrectIndex: 0,
                scenarioPrompt: 'CH₃CH₃和CH₃CH₂CH₃的关系是什么？',
                scenarioOptions: ['同系物（相差一个CH₂）', '同分异构体（分子式相同）', '同一物质', '同素异形体'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '同系物：结构相似，分子组成相差一个或多个CH₂，通式相同，化学性质相似',
                  '同分异构体：分子式相同，结构不同的化合物',
                  '二者的核心区别：分子式是否相同',
                  'CH₃CH₃和CH₃CH₂CH₃相差CH₂，是同系物关系'
                ]
              }
            },
            {
              id: 'xb3c1s1-004', template: 'concept-construction',
              title: 'C₄H₁₀O的醇类同分异构体',
              params: {
                cases: ['CH₃CH₂CH₂CH₂OH（1-丁醇）', 'CH₃CH₂CH(OH)CH₃（2-丁醇）', '(CH₃)₂CHCH₂OH（2-甲基-1-丙醇）', '(CH₃)₃COH（2-甲基-2-丙醇）'],
                caseOptions: ['均为C₄H₁₀O的醇类同分异构体', '均为C₄H₁₀O的醚类同分异构体', '均为不饱和醇'],
                caseCorrectIndices: [0],
                caseCommonality: '四个结构式的分子式均为C₄H₁₀O，且都含有-OH基团，是醇类的同分异构体',
                conceptName: '同分异构体',
                definitionKeyTerms: ['分子式相同', '结构不同', '醇类'],
                definitionHint: '分子式相同但结构不同的化合物互称什么？',
                fullDefinition: '同分异构体是指分子式相同而结构不同的化合物之间的互称',
                boundaryItems: ['CH₃CH₂CH₂CH₂OH（1-丁醇）', 'CH₃OCH₂CH₂CH₃（甲丙醚）', '(CH₃)₂CHCH₂OH（2-甲基-1-丙醇）', 'CH₃CH₂OH（乙醇）'],
                boundaryCorrectIndices: [0, 2],
                explainPrompt: '为什么CH₃OCH₂CH₂CH₃不是C₄H₁₀O的醇类同分异构体？',
                explainHint: 'CH₃OCH₂CH₂CH₃不含-OH，是醚类',
                explainKeyTerms: ['醇', '醚', '官能团'],
                reasoning: [
                  '同分异构体：分子式相同而结构不同的化合物',
                  'C₄H₁₀O的醇类需含-OH基团',
                  '先写碳链异构（C₄的三种碳链），再移动-OH位置',
                  '注意对称性排除重复结构，共4种'
                ]
              }
            }
          ]
        },
        {
          id: 'xb3-ch1-sec2',
          title: '第二节 研究有机化合物的一般方法',
          exercises: [
            {
              id: 'xb3c1s2-001', template: 'experimental-reasoning',
              title: '有机物结构确定的步骤',
              params: {
                goal: '确定未知有机化合物的结构',
                principleOptions: ['先确定分子式再推断官能团和结构', '直接用红外光谱确定结构', '先测熔沸点再推断结构', '用核磁共振确定所有信息'],
                principleCorrectIndex: 0,
                keyStepItems: ['元素分析确定实验式', '质谱法测定相对分子质量确定分子式', '红外光谱检测官能团', '核磁共振氢谱确定氢原子类型'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['元素分析确定实验式', '质谱法确定分子式', '红外光谱检测官能团', '核磁共振氢谱确定氢原子类型'],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先定性定量分析元素组成，再测相对分子质量，然后分析官能团，最后确定氢原子连接方式',
                consequenceOptions: ['若顺序颠倒，可能会错误判断结构', '顺序不影响结果', '可以跳过元素分析步骤', '只需红外光谱即可'],
                consequenceCorrectIndex: 0,
                reasoning: [
                  '第一步：元素分析——确定C、H、O等元素的质量分数，得到实验式',
                  '第二步：质谱法——测定相对分子质量，结合实验式确定分子式',
                  '第三步：红外光谱——检测特征吸收峰，判断官能团种类',
                  '第四步：核磁共振氢谱——分析峰面积比（=氢原子数比），确定结构'
                ]
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
              id: 'xb3c2s1-001', template: 'error-analysis',
              title: '烷烃的系统命名',
              params: {
                statement: 'CH₃CH(CH₃)CH₂CH₃的正确名称是2-乙基丙烷',
                errorOptions: ['未选最长碳链为主链，应为2-甲基丁烷', '名称正确', '应为3-甲基丁烷', '应为2-乙基丙烷正确'],
                errorCorrectIndex: 0,
                principleKeyTerms: ['最长碳链', '主链', '编号', '取代基位次和最小'],
                principleHint: '应先选最长碳链为主链，再编号使取代基位次和最小',
                correctVersion: '2-甲基丁烷（或异戊烷）',
                finalHint: '最长碳链为4个碳原子，是丁烷，甲基在2号位，正确名称是2-甲基丁烷',
                reasoning: [
                  '第一步：选最长碳链为主链——该结构最长碳链含4个C，应为丁烷而非丙烷',
                  '第二步：编号——从离取代基最近的一端开始，甲基在2号位',
                  '第三步：命名——2-甲基丁烷（也称异戊烷）',
                  '常见错误：误以为乙基可在2号丙烷上，实际最长链为4个碳'
                ]
              }
            },
            {
              id: 'xb3c2s1-002', template: 'concept-construction',
              title: '烷烃的化学性质',
              params: {
                cases: ['CH₄与Cl₂在光照下反应生成CH₃Cl', 'C₂H₆在空气中燃烧生成CO₂和H₂O', 'CH₄与Cl₂光照下可生成CH₂Cl₂'],
                caseOptions: ['均为烷烃的特征化学变化', '均为取代反应', '均为加成反应'],
                caseCorrectIndices: [0],
                caseCommonality: '这些反应代表了烷烃的两类主要化学性质：取代反应和燃烧反应',
                conceptName: '烷烃的化学性质',
                definitionKeyTerms: ['取代反应', '燃烧', '光照', '卤素'],
                definitionHint: '烷烃在光照下可与卤素发生什么反应？在空气中可发生什么？',
                fullDefinition: '烷烃在光照下可与卤素发生取代反应，在空气中可完全燃烧生成CO₂和H₂O',
                boundaryItems: ['CH₄+Cl₂→光照→CH₃Cl+HCl', 'CH₄+Cl₂→光照→CH₂Cl₂+HCl', 'CH₄使酸性KMnO₄褪色', 'CH₄与Cl₂的取代反应可生成四种氯代物'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么CH₄使酸性KMnO₄褪色不是烷烃的性质？',
                explainHint: '烷烃中碳碳单键稳定，不能使酸性KMnO₄褪色',
                explainKeyTerms: ['烷烃', '酸性KMnO₄', '氧化'],
                reasoning: [
                  '烷烃在光照下与卤素发生取代反应（连锁反应）',
                  '烷烃在空气中燃烧生成CO₂和H₂O',
                  '烷烃不能使酸性KMnO₄褪色（碳碳单键稳定）',
                  '取代反应可逐步进行，生成一氯至四氯代物'
                ]
              }
            }
          ]
        },
        {
          id: 'xb3-ch2-sec2',
          title: '第二节 烯烃 炔烃',
          exercises: [
            {
              id: 'xb3c2s2-001', template: 'concept-construction',
              title: '乙烯与溴的加成反应',
              params: {
                cases: ['CH₂=CH₂ + Br₂ → CH₂BrCH₂Br', 'CH₂=CH₂ + H₂O → 催化剂→ CH₃CH₂OH', 'CH₂=CH₂ + HCl → CH₃CH₂Cl'],
                caseOptions: ['均为烯烃的加成反应（C=C打开，原子加在双键碳上）', '均为取代反应', '均为氧化反应'],
                caseCorrectIndices: [0],
                caseCommonality: '三个反应中乙烯的C=C双键都打开，两个原子或基团分别加在两个双键碳上，属于加成反应',
                conceptName: '加成反应',
                definitionKeyTerms: ['不饱和键', '打开', '原子或基团', '加成'],
                definitionHint: '不饱和键打开，其他原子或基团加在原来不饱和碳上的反应叫什么？',
                fullDefinition: '加成反应是有机物分子中不饱和键（如C=C、C≡C、C=O等）打开，其他原子或基团直接加在原来不饱和碳上的反应',
                boundaryItems: ['CH₄+Cl₂→光照→CH₃Cl+HCl', 'CH₂=CH₂+Br₂→CH₂BrCH₂Br', 'CH≡CH+HCl→CH₂=CHCl', 'CH₃CH₃+Br₂→光照→CH₃CH₂Br+HBr'],
                boundaryCorrectIndices: [1, 2],
                explainPrompt: '为什么CH₄+Cl₂→光照→CH₃Cl不是加成反应？',
                explainHint: '甲烷中没有不饱和键，是取代反应',
                explainKeyTerms: ['不饱和键', '取代', '加成'],
                reasoning: [
                  '加成反应的定义：不饱和键打开，原子直接加在不饱和碳上',
                  '乙烯含C=C双键，是不饱和键',
                  'Br₂中的Br原子分别加在两个双键碳上，生成1,2-二溴乙烷',
                  '该反应不生成小分子副产物，是典型的加成反应'
                ]
              }
            },
            {
              id: 'xb3c2s2-002', template: 'comparison-reasoning',
              title: '烯烃与炔烃的对比',
              params: {
                conceptA: '烯烃',
                conceptB: '炔烃',
                description: '含不饱和键，可使溴水褪色，可发生加成反应，通式为CnH₂n₋₂',
                identifyCorrectIndex: 1,
                excludePrompt: '为什么这个描述不是烯烃？',
                excludeHint: '烯烃的通式为CnH₂n，不是CnH₂n₋₂',
                excludeKeyTerms: ['通式', 'CnH₂n', 'CnH₂n₋₂'],
                differenceOptions: ['炔烃的不饱和度更大，可发生更多步加成', '烯烃不能使溴水褪色', '炔烃不可加聚', '烯烃通式与炔烃相同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '某烃的分子式为C₂H₂，它可能具有什么结构特征？',
                scenarioOptions: ['含C≡C三键，是乙炔', '含C=C双键，是乙烯', '含碳碳单键，是乙烷', '含苯环结构'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '烯烃通式：CnH₂n，含C=C双键；炔烃通式：CnH₂n₋₂，含C≡C三键',
                  '两者都可发生加成反应，都可使溴水褪色',
                  'C≡C三键的不饱和度比C=C双键大，可进行两步加成',
                  '端基炔（如乙炔）还可与银氨溶液反应生成沉淀'
                ]
              }
            },
            {
              id: 'xb3c2s2-003', template: 'concept-construction',
              title: '乙炔与HCl的加成反应',
              params: {
                cases: ['HC≡CH + HCl → HgCl₂/△→ CH₂=CHCl', 'HC≡CH + 2Br₂ → CHBr₂CHBr₂', 'CH₂=CH₂ + HCl → CH₃CH₂Cl'],
                caseOptions: ['均为对不饱和键的加成反应（C≡C或C=C打开）', '均为取代反应', '均为消去反应'],
                caseCorrectIndices: [0],
                caseCommonality: '三个反应中不饱和键（C≡C或C=C）打开，其他原子加在不饱和碳上，都是加成反应',
                conceptName: '加成反应',
                definitionKeyTerms: ['不饱和键', '打开', '加成'],
                definitionHint: '乙炔与HCl在催化剂作用下发生什么反应生成氯乙烯？',
                fullDefinition: '加成反应是有机物分子中不饱和键（C=C、C≡C等）打开，其他原子或基团直接加在原来不饱和碳上的反应',
                boundaryItems: ['HC≡CH+HCl→CH₂=CHCl', 'HC≡CH+2Br₂→CHBr₂CHBr₂', 'CH₄+Cl₂→光照→CH₃Cl+HCl', 'CH₃CH₃→高温→CH₂=CH₂+H₂'],
                boundaryCorrectIndices: [0, 1],
                explainPrompt: '为什么CH₄+Cl₂→光照→CH₃Cl不是加成反应？',
                explainHint: '甲烷中没有不饱和键，发生的是取代反应',
                explainKeyTerms: ['不饱和键', '取代', '加成'],
                reasoning: [
                  '乙炔含C≡C三键，是不饱和键',
                  'H和Cl原子分别加在两个三键碳上，C≡C部分打开形成C=C',
                  '生成的CH₂=CHCl是氯乙烯（PVC单体）',
                  '该反应符合加成反应的定义：不饱和键打开，原子直接加成'
                ]
              }
            },
            {
              id: 'xb3c2s2-004', template: 'experimental-reasoning',
              title: '乙烯的实验室制法',
              params: {
                goal: '用乙醇在浓硫酸作用下制取乙烯气体',
                principleOptions: ['乙醇在浓H₂SO₄作用下于170℃发生消去反应生成乙烯', '乙醇在浓H₂SO₄作用下于140℃生成乙醚', '乙醇直接加热分解生成乙烯', '乙醇与浓H₂SO₄发生氧化反应生成乙烯'],
                principleCorrectIndex: 0,
                keyStepItems: ['检查装置气密性', '加入乙醇和浓H₂SO₄混合液及碎瓷片', '迅速加热至170℃', '用排水集气法收集乙烯'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['检查装置气密性', '加入试剂和碎瓷片', '加热至170℃', '用排水法收集气体'],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '实验前先检查气密性，再加入试剂，然后控制温度反应，最后收集产物',
                consequenceOptions: ['温度控制在140℃会生成乙醚而非乙烯', '温度高低不影响产物', '不需要检查气密性', '可用排空气法收集乙烯'],
                consequenceCorrectIndex: 0,
                reasoning: [
                  '第一步：检查装置气密性——防止气体泄漏',
                  '第二步：加入试剂（乙醇+浓H₂SO₄）和碎瓷片（防暴沸）',
                  '第三步：温度计插入液面下，控制温度在170℃（140℃生成乙醚）',
                  '第四步：乙烯密度与空气接近，用排水集气法收集'
                ]
              }
            }
          ]
        },
        {
          id: 'xb3-ch2-sec3',
          title: '第三节 芳香烃',
          exercises: [
            {
              id: 'xb3c2s3-001', template: 'concept-construction',
              title: '苯的化学性质',
              params: {
                cases: ['苯与液溴在FeBr₃催化下发生取代生成溴苯', '苯与浓HNO₃和浓H₂SO₄发生硝化反应', '苯与H₂在Ni催化下加成生成环己烷'],
                caseOptions: ['均为苯的特征化学反应（取代和加成）', '均为取代反应', '均为氧化反应'],
                caseCorrectIndices: [0],
                caseCommonality: '这三个反应代表了苯的两类化学性质：取代反应（溴代、硝化）和加成反应（加氢）',
                conceptName: '苯的化学性质',
                definitionKeyTerms: ['取代反应', '加成反应', '苯环', '独特键'],
                definitionHint: '苯分子中的碳碳键是介于单键和双键之间的独特键，可发生什么反应和什么反应？',
                fullDefinition: '苯分子中的碳碳键是介于单键和双键之间的独特键，可发生取代反应和加成反应',
                boundaryItems: ['甲苯能使酸性KMnO₄褪色（侧链氧化）', '苯使溴水褪色（萃取，非反应）', '苯与Br₂的CCl₄溶液反应', '苯在光照下与Cl₂发生取代（侧链）'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么苯使溴水褪色是萃取而非化学反应？',
                explainHint: '苯萃取溴水中的Br₂使水层颜色变浅，但Br₂仍以分子形式存在于苯层',
                explainKeyTerms: ['萃取', '物理变化', '化学变化'],
                reasoning: [
                  '苯环的独特结构决定了它易取代、难加成的性质',
                  '取代反应：卤代、硝化、磺化',
                  '在催化剂（Ni）和加热条件下，苯可与H₂加成生成环己烷',
                  '苯不能使酸性KMnO₄褪色，使溴水褪色是萃取（物理变化）'
                ]
              }
            },
            {
              id: 'xb3c2s3-002', template: 'comparison-reasoning',
              title: '苯与甲苯的化学性质对比',
              params: {
                conceptA: '苯',
                conceptB: '甲苯',
                description: '含有苯环，能发生硝化反应生成TNT，能被酸性KMnO₄氧化，甲基使苯环活化',
                identifyCorrectIndex: 1,
                excludePrompt: '为什么这个描述不是苯？',
                excludeHint: '苯不能被酸性KMnO₄氧化，且苯不能生成TNT（三硝基甲苯）',
                excludeKeyTerms: ['KMnO₄氧化', 'TNT', '甲基活化'],
                differenceOptions: ['甲苯的甲基使苯环活化，且侧链可被KMnO₄氧化', '苯比甲苯活泼', '甲苯不能硝化', '苯能发生侧链反应'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '甲苯中滴加酸性KMnO₄溶液，紫色褪去，而苯不能使KMnO₄褪色，为什么？',
                scenarioOptions: ['甲苯的甲基侧链可被KMnO₄氧化为-COOH', '甲苯的苯环被KMnO₄氧化', '苯不能被KMnO₄氧化是因为苯环稳定', '甲苯溶解了KMnO₄'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '苯：不与酸性KMnO₄反应，可发生硝化（生成硝基苯）、溴代',
                  '甲苯：含甲基侧链，可被KMnO₄氧化为-COOH（苯甲酸）',
                  '甲基是邻对位定位基，使苯环活化（硝化生成TNT）',
                  '甲苯在光照下侧链H被取代，在Fe催化下苯环H被取代'
                ]
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
              id: 'xb3c3s1-001', template: 'comparison-reasoning',
              title: '卤代烃的取代反应与消去反应',
              params: {
                conceptA: '取代反应（水解）',
                conceptB: '消去反应',
                description: '条件为NaOH水溶液加热，C-X键断裂，反应中生成醇',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么这个描述不是消去反应？',
                excludeHint: '消去反应的条件是NaOH醇溶液加热，产物是烯烃',
                excludeKeyTerms: ['NaOH水溶液', '生成醇', 'NaOH醇溶液', '生成烯烃'],
                differenceOptions: ['水解生成醇（羟基取代卤素），消去生成烯烃（脱HX）', '反应条件相同', '产物相同', '反应物不同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '溴乙烷与NaOH醇溶液共热，主要产物是什么？',
                scenarioOptions: ['乙烯（消去产物）', '乙醇（水解产物）', '乙烷', '溴乙烷不反应'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '取代（水解）：NaOH水溶液加热，-OH取代-X，生成醇',
                  '消去：NaOH醇溶液加热，脱去HX，生成烯烃或炔烃',
                  '两种反应互为竞争关系，通过控制条件选择产物',
                  '关键区别：反应条件不同，产物类型不同'
                ]
              }
            }
          ]
        },
        {
          id: 'xb3-ch3-sec2',
          title: '第二节 醇酚',
          exercises: [
            {
              id: 'xb3c3s2-001', template: 'redox-reasoning',
              title: '乙醇的催化氧化',
              params: {
                substances: [
                  { key: 'sub1', formula: 'CH₃CH₂OH', valences: { C_alpha: -1, C_beta: -3, O: -2, H_oh: 1 } }
                ],
                identifyOptions: ['CH₃CH₂OH → CH₃CHO，C从-1价升至+1价，被氧化', 'CH₃CH₂OH → CH₃CHO，O被还原', 'CH₃CH₂OH → CH₃CHO，H被还原', '该反应不是氧化还原反应'],
                identifyCorrectIndex: 0,
                finalEquation: '2CH₃CH₂OH + O₂ → Cu/Ag/△→ 2CH₃CHO + 2H₂O',
                finalHint: '乙醇的催化氧化：-OH上的H和α-C上的H脱去形成C=O，α-C从-1价升至+1价',
                reasoning: [
                  '乙醇中α-C的化合价：-1价（C与O和H相连）',
                  '催化氧化后生成乙醛：C=O双键使α-C升至+1价',
                  '乙醇失去2个H（-OH上的H和α-C上的H），被O₂氧化，CuO被还原为Cu',
                  '铜丝由黑变红（CuO→Cu）证明Cu是催化剂，参与了氧化还原循环'
                ]
              }
            },
            {
              id: 'xb3c3s2-002', template: 'concept-construction',
              title: '乙醇的化学性质',
              params: {
                cases: ['2CH₃CH₂OH+2Na→2CH₃CH₂ONa+H₂↑', 'CH₃CH₂OH →浓H₂SO₄/170℃→ CH₂=CH₂+H₂O', 'CH₃CH₂OH →浓H₂SO₄/140℃→ CH₃CH₂OCH₂CH₃+H₂O'],
                caseOptions: ['均为乙醇在不同条件下的特征反应', '均为消去反应', '均为氧化反应'],
                caseCorrectIndices: [0],
                caseCommonality: '这三个反应分别代表了乙醇与Na的置换反应、分子内消去（170℃）和分子间脱水（140℃）',
                conceptName: '乙醇的化学性质',
                definitionKeyTerms: ['与Na反应', '消去', '取代', '催化氧化'],
                definitionHint: '乙醇与Na反应生成什么？在浓H₂SO₄ 170℃下发生什么反应生成乙烯？',
                fullDefinition: '乙醇与Na反应生成乙醇钠和H₂，在浓H₂SO₄ 170℃下发生消去反应生成乙烯，在Cu催化下可被氧化为乙醛',
                boundaryItems: ['乙醇使酸性KMnO₄褪色', '乙醇可被酸性KMnO₄氧化为乙酸', '乙醇不能发生酯化反应', '乙醇与HBr反应生成溴乙烷（取代）'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么乙醇不能发生酯化反应是错误的？',
                explainHint: '醇羟基可与羧酸发生酯化反应',
                explainKeyTerms: ['酯化', '醇羟基', '羧酸'],
                reasoning: [
                  '乙醇与金属Na反应：置换-OH上的H，生成乙醇钠和H₂',
                  '分子内消去（170℃）：脱去H₂O生成乙烯',
                  '分子间脱水（140℃）：两分子乙醇脱一分子H₂O生成乙醚',
                  '乙醇可被酸性KMnO₄氧化为乙酸，与HBr反应取代生成溴乙烷'
                ]
              }
            },
            {
              id: 'xb3c3s2-003', template: 'error-analysis',
              title: '苯酚的性质判断',
              params: {
                statement: '苯酚与NaHCO₃溶液反应生成CO₂气体，证明苯酚的酸性比碳酸强',
                errorOptions: ['苯酚的酸性弱于碳酸，不能与NaHCO₃反应', '苯酚与NaHCO₃反应产生CO₂', '苯酚不与NaOH反应', '苯酚不是酸'],
                errorCorrectIndex: 0,
                principleKeyTerms: ['酸性强弱', 'H₂CO₃', '苯酚', 'NaHCO₃'],
                principleHint: '酸性强弱：H₂CO₃ > 苯酚 > HCO₃⁻',
                correctVersion: '苯酚能与NaOH反应生成苯酚钠，但不能与NaHCO₃反应。苯酚遇FeCl₃显紫色',
                finalHint: '苯酚的酸性很弱（Ka约1.0×10⁻¹⁰），介于碳酸（Ka₁=4.3×10⁻⁷）和HCO₃⁻（Ka₂=5.6×10⁻¹¹）之间',
                reasoning: [
                  '酸性强弱顺序：H₂CO₃ > 苯酚 > HCO₃⁻',
                  '只有酸性比H₂CO₃强的物质才能与NaHCO₃反应放出CO₂',
                  '苯酚酸性弱于H₂CO₃，所以不能与NaHCO₃反应',
                  '苯酚能与NaOH反应（中和），遇FeCl₃显紫色（特征反应）'
                ]
              }
            },
            {
              id: 'xb3c3s2-004', template: 'concept-construction',
              title: '苯酚与溴水的取代反应',
              params: {
                cases: ['C₆H₅OH+3Br₂→C₆H₂Br₃OH↓+3HBr', 'C₆H₅OH+浓溴水→白色沉淀', '苯酚能使溴水褪色'],
                caseOptions: ['均为苯酚苯环上的取代反应（邻对位H被Br取代）', '均为加成反应', '均为氧化反应'],
                caseCorrectIndices: [0],
                caseCommonality: '酚羟基使苯环活化，邻对位H易被Br取代生成2,4,6-三溴苯酚白色沉淀',
                conceptName: '苯酚的取代反应',
                definitionKeyTerms: ['酚羟基', '邻对位', '活化', '取代'],
                definitionHint: '酚羟基对苯环有什么影响？使哪些位置的H更容易被取代？',
                fullDefinition: '酚羟基是邻对位定位基，使苯环活化，邻位和对位的氢原子更容易被其他原子或基团取代',
                boundaryItems: ['苯与液溴在FeBr₃催化下反应生成溴苯', '苯酚与浓溴水反应生成白色沉淀', '苯酚与FeCl₃溶液显紫色', '甲苯与浓HNO₃反应生成TNT'],
                boundaryCorrectIndices: [1],
                explainPrompt: '为什么苯与液溴的反应不是苯酚与溴水的反应类型？',
                explainHint: '苯的溴代需FeBr₃催化，苯酚的溴代不需要催化剂（酚羟基活化）',
                explainKeyTerms: ['催化剂', '活化', '取代'],
                reasoning: [
                  '酚羟基的邻对位定位效应：使苯环电子密度增大，邻对位H活泼',
                  '苯酚与浓溴水反应：3个Br分别取代2个邻位和1个对位的H',
                  '生成的2,4,6-三溴苯酚为白色沉淀，可定性检验苯酚',
                  '苯的溴代需FeBr₃催化，苯酚的溴代不需要催化剂'
                ]
              }
            }
          ]
        },
        {
          id: 'xb3-ch3-sec3',
          title: '第三节 醛酮',
          exercises: [
            {
              id: 'xb3c3s3-001', template: 'experimental-reasoning',
              title: '银镜反应的操作步骤',
              params: {
                goal: '用银镜反应验证醛基的存在',
                principleOptions: ['醛基在碱性条件下可将银氨溶液中的Ag⁺还原为Ag单质', '醛基与AgNO₃直接反应生成Ag', '醛基在酸性条件下还原Ag⁺', '银镜反应不需要加热'],
                principleCorrectIndex: 0,
                keyStepItems: ['试管用NaOH溶液煮沸洗净', '向AgNO₃溶液中逐滴滴加氨水至沉淀恰好溶解配制银氨溶液', '加入乙醛溶液水浴加热', '观察光亮的银镜产生'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['洗净试管', '配制银氨溶液（AgNO₃ + 氨水）', '加乙醛水浴加热', '观察银镜'],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先洗净试管，再配制银氨溶液（现配现用），然后加入乙醛加热，最后观察现象',
                consequenceOptions: ['试管不洁净则不能形成光亮的银镜', '试管不洁净不影响反应', '银氨溶液可长期保存', '可直接加热无需水浴'],
                consequenceCorrectIndex: 0,
                reasoning: [
                  '第一步：用NaOH煮沸洗净试管——去除油污，确保玻璃表面洁净才能析出光亮的银镜',
                  '第二步：配制银氨溶液——AgNO₃中加氨水至沉淀恰好溶解，生成[Ag(NH₃)₂]OH',
                  '第三步：水浴加热——乙醛与银氨溶液反应，Ag⁺被还原为Ag',
                  '第四步：观察——试管壁形成光亮的银镜'
                ]
              }
            },
            {
              id: 'xb3c3s3-002', template: 'comparison-reasoning',
              title: '醛基检验方法的对比',
              params: {
                conceptA: '银镜反应',
                conceptB: '与新制Cu(OH)₂反应',
                description: '试剂为银氨溶液，需水浴加热，产物为光亮的银镜，试剂要现配现用',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么这个描述不是新制Cu(OH)₂反应？',
                excludeHint: 'Cu(OH)₂反应的试剂是Cu(OH)₂悬浊液，需加热至沸腾，产物为砖红色Cu₂O',
                excludeKeyTerms: ['Cu(OH)₂', 'Cu₂O', '砖红色', '沸腾'],
                differenceOptions: ['银镜反应产生Ag，Cu(OH)₂反应产生Cu₂O，现象和试剂不同', '试剂相同', '现象相同', '条件相同'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '某未知溶液既能发生银镜反应，又能与新制Cu(OH)₂加热生成砖红色沉淀，该物质最可能含有什么？',
                scenarioOptions: ['醛基（-CHO）', '羟基（-OH）', '羧基（-COOH）', '酯基（-COO-）'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '银镜反应：醛基在碱性条件下将Ag⁺还原为Ag，在试管壁析出光亮的银镜',
                  'Cu(OH)₂反应：醛基在碱性条件下将Cu²⁺还原为Cu₂O砖红色沉淀',
                  '两种反应均需碱性条件，加热，都检验醛基',
                  '差异：试剂不同（Ag⁺ vs Cu²⁺）、产物不同（Ag vs Cu₂O）、加热方式不同'
                ]
              }
            }
          ]
        },
        {
          id: 'xb3-ch3-sec4',
          title: '第四节 羧酸 羧酸衍生物',
          exercises: [
            {
              id: 'xb3c3s4-001', template: 'concept-construction',
              title: '乙酸与乙醇的酯化反应',
              params: {
                cases: ['CH₃COOH+C₂H₅OH ⇌ 浓H₂SO₄/△ CH₃COOC₂H₅+H₂O', 'CH₃CH₂COOH+CH₃OH → CH₃CH₂COOCH₃+H₂O', 'HCOOH+C₂H₅OH → HCOOC₂H₅+H₂O'],
                caseOptions: ['均为羧酸与醇在浓H₂SO₄催化下发生的酯化反应', '均为加成反应', '均为氧化反应'],
                caseCorrectIndices: [0],
                caseCommonality: '三个反应都是羧酸与醇在浓H₂SO₄和加热条件下生成酯和水的反应，属于酯化（取代）反应',
                conceptName: '酯化反应',
                definitionKeyTerms: ['羧酸', '醇', '浓H₂SO₄', '酯', '水'],
                definitionHint: '羧酸和醇在浓H₂SO₄和加热条件下生成什么和什么？',
                fullDefinition: '酯化反应是羧酸和醇在浓硫酸催化下生成酯和水的反应，属于取代反应',
                boundaryItems: ['乙酸与乙醇在浓H₂SO₄下生成乙酸乙酯', '乙酸乙酯在稀H₂SO₄下水解生成乙酸和乙醇', '乙烯与水加成生成乙醇', '乙醛被O₂氧化为乙酸'],
                boundaryCorrectIndices: [0],
                explainPrompt: '为什么乙酸乙酯的水解不是酯化反应？',
                explainHint: '酯化是羧酸+醇→酯+水，水解是酯+水→羧酸+醇，方向相反',
                explainKeyTerms: ['酯化', '水解', '可逆反应'],
                reasoning: [
                  '酯化反应的机理：酸脱羟基醇脱氢（同位素¹⁸O证实）',
                  '浓H₂SO₄的作用：催化剂和吸水剂',
                  '反应可逆，用可逆符号（⇌）表示',
                  '生成的酯可用饱和Na₂CO₃溶液吸收提纯'
                ]
              }
            },
            {
              id: 'xb3c3s4-002', template: 'concept-construction',
              title: '乙酸的化学性质',
              params: {
                cases: ['CH₃COOH⇌CH₃COO⁻+H⁺（弱酸性）', 'CH₃COOH+NaOH→CH₃COONa+H₂O', 'CH₃COOH+NaHCO₃→CH₃COONa+CO₂↑+H₂O'],
                caseOptions: ['均为乙酸的酸性（弱酸，能与碱和碳酸盐反应）', '均为乙酸的还原性', '均为乙酸的氧化性'],
                caseCorrectIndices: [0],
                caseCommonality: '三个反应都体现了乙酸的酸性：电离、与碱中和、与碳酸盐反应生成CO₂',
                conceptName: '乙酸的酸性',
                definitionKeyTerms: ['弱酸', '酸性', '羧基', '电离'],
                definitionHint: '乙酸具有弱酸性，能使石蕊变红，酸性强于碳酸',
                fullDefinition: '乙酸是具有弱酸性的有机酸，能使紫色石蕊变红，能与活泼金属、碱、碱性氧化物和某些盐（如碳酸盐）反应',
                boundaryItems: ['乙酸能与金属Na反应生成H₂', '乙酸能与Cu(OH)₂反应使沉淀溶解', '乙酸不能与Na₂CO₃反应', '乙酸与乙醇在浓H₂SO₄下发生酯化'],
                boundaryCorrectIndices: [0, 1, 3],
                explainPrompt: '为什么乙酸不能与Na₂CO₃反应是错误的？',
                explainHint: '乙酸的酸性（Ka=1.75×10⁻⁵）强于碳酸（Ka₁=4.3×10⁻⁷）',
                explainKeyTerms: ['酸性', '碳酸', '强于'],
                reasoning: [
                  '乙酸是弱酸，但酸性强于碳酸（Ka: 乙酸>H₂CO₃）',
                  '乙酸与Na反应：置换出H₂',
                  '乙酸与Cu(OH)₂：酸碱中和使沉淀溶解',
                  '乙酸与Na₂CO₃反应生成CO₂（证明酸性强于H₂CO₃）'
                ]
              }
            },
            {
              id: 'xb3c3s4-003', template: 'error-analysis',
              title: '酯化反应的机理',
              params: {
                statement: '酯化反应的机理是酸脱氢醇脱羟基，即羧酸提供H原子，醇提供-OH',
                errorOptions: ['酯化反应是酸脱羟基醇脱氢，说反了', '说法正确', '酯化反应不需要脱水', '酯化反应是氧化反应'],
                errorCorrectIndex: 0,
                principleKeyTerms: ['酸脱羟基', '醇脱氢', '同位素¹⁸O证实'],
                principleHint: '用同位素¹⁸O标记醇中的氧，发现¹⁸O出现在酯中而非水中',
                correctVersion: '酯化反应机理：酸脱羟基醇脱氢。RCOOH + R\'OH → RCOOR\' + H₂O',
                finalHint: '酯化反应中羧酸脱去-OH（羟基），醇脱去-H（氢），二者结合生成水，剩余部分连接成酯',
                reasoning: [
                  '酯化反应的机理通过同位素¹⁸O标记证实',
                  '如果用¹⁸O标记醇中的氧，生成的酯中含有¹⁸O，而水中不含',
                  '证明羧酸提供-OH，醇提供-H（正确机理：酸脱羟基醇脱氢）',
                  '所以"酸脱氢醇脱羟基"的说法是反的'
                ]
              }
            },
            {
              id: 'xb3c3s4-004', template: 'experimental-reasoning',
              title: '乙酸乙酯制备实验的操作',
              params: {
                goal: '制备乙酸乙酯并分离提纯',
                principleOptions: ['乙酸与乙醇在浓H₂SO₄催化下发生酯化反应生成乙酸乙酯', '乙酸与乙醇直接混合生成乙酸乙酯', '乙酸乙酯可用水萃取分离', '反应不需催化剂'],
                principleCorrectIndex: 0,
                keyStepItems: ['向试管中加入乙醇、乙酸和浓H₂SO₄', '用饱和Na₂CO₃溶液接收产物', '加热使反应发生', '振荡后静置分液得乙酸乙酯'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['加入试剂（乙醇+乙酸+浓H₂SO₄）', '加热反应', '用饱和Na₂CO₃溶液接收', '分液提纯'],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '先加试剂，再加热反应，然后用饱和Na₂CO₃溶液吸收，最后分离提纯',
                consequenceOptions: ['导管口在液面上方（防倒吸）', '导管口伸入液面以下', '不用饱和Na₂CO₃也可', '不需振荡'],
                consequenceCorrectIndex: 0,
                reasoning: [
                  '第一步：加入试剂（乙醇、乙酸、浓H₂SO₄），浓H₂SO₄作催化剂和吸水剂',
                  '第二步：加热使酯化反应发生，导管口在液面上方（防倒吸）',
                  '第三步：饱和Na₂CO₃溶液吸收——吸收乙醇、中和乙酸、降低酯的溶解度',
                  '第四步：振荡后静置分液，得乙酸乙酯'
                ]
              }
            }
          ]
        },
        {
          id: 'xb3-ch3-sec5',
          title: '第五节 有机合成',
          exercises: [
            {
              id: 'xb3c3s5-001', template: 'experimental-reasoning',
              title: '由乙醇合成乙酸的路线',
              params: {
                goal: '以乙醇为原料合成乙酸',
                principleOptions: ['乙醇先催化氧化为乙醛，再氧化为乙酸', '乙醇直接氧化为乙酸', '乙醇先消去再氧化', '乙醇与酸反应生成乙酸'],
                principleCorrectIndex: 0,
                keyStepItems: ['乙醇在Cu催化下氧化为乙醛', '乙醛再氧化为乙酸', '乙醇也可直接用酸性KMnO₄氧化为乙酸', '分离提纯得到乙酸'],
                keyStepCorrectIndices: [0, 1, 2, 3],
                orderItems: ['乙醇', '乙醛（催化氧化）', '乙酸（氧化）', '提纯'],
                orderCorrect: [0, 1, 2, 3],
                orderHint: '官能团转化路线：醇→醛→酸（逐步氧化）',
                consequenceOptions: ['若氧化条件控制不当，乙醇可能被过度氧化为CO₂', '氧化不会过度', '乙醇不能氧化为酸', '反应不可控'],
                consequenceCorrectIndex: 0,
                reasoning: [
                  '第一步：乙醇在Cu或Ag催化下与O₂反应生成乙醛（催化氧化）',
                  '第二步：乙醛在催化剂存在下继续氧化生成乙酸（醛易被氧化为酸）',
                  '也可用酸性KMnO₄直接将乙醇氧化为乙酸',
                  '醇→醛→酸是官能团转化的典型路线（逐步氧化）'
                ]
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
              id: 'xb3c4s1-001', template: 'concept-construction',
              title: '糖类的分类与性质',
              params: {
                cases: ['葡萄糖（C₆H₁₂O₆，不能水解）', '蔗糖（C₁₂H₂₂O₁₁，水解生成2分子单糖）', '淀粉[(C₆H₁₀O₅)ₙ，水解生成多分子单糖]'],
                caseOptions: ['分别为单糖、二糖和多糖的代表', '均为二糖', '均为还原性糖'],
                caseCorrectIndices: [0],
                caseCommonality: '这三个案例分别代表了糖类的三种分类：单糖（不能水解）、二糖（水解生成2分子单糖）、多糖（水解生成多分子单糖）',
                conceptName: '糖类的分类',
                definitionKeyTerms: ['单糖', '二糖', '多糖', '水解'],
                definitionHint: '糖类按能否水解及水解产物分为哪三类？',
                fullDefinition: '糖类分为单糖（不能水解）、二糖（水解生成2分子单糖）和多糖（水解生成多分子单糖）',
                boundaryItems: ['葡萄糖能发生银镜反应', '蔗糖不能发生银镜反应', '淀粉遇碘变蓝', '纤维素能发生银镜反应'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么纤维素不能发生银镜反应？',
                explainHint: '纤维素是多糖，分子中虽然含-OH但无自由醛基',
                explainKeyTerms: ['多糖', '醛基', '银镜反应'],
                reasoning: [
                  '糖类分类依据：能否水解及水解产物的数目',
                  '单糖（如葡萄糖、果糖）：不能水解，含还原性基团',
                  '二糖（如蔗糖、麦芽糖）：水解成2分子单糖',
                  '多糖（如淀粉、纤维素）：水解成多分子单糖'
                ]
              }
            },
            {
              id: 'xb3c4s1-002', template: 'comparison-reasoning',
              title: '葡萄糖与果糖的对比',
              params: {
                conceptA: '葡萄糖',
                conceptB: '果糖',
                description: '分子式C₆H₁₂O₆，含醛基，能发生银镜反应，属于己醛糖',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么这个描述不是果糖？',
                excludeHint: '果糖是己酮糖（含酮基），但在碱性条件下可异构化为葡萄糖',
                excludeKeyTerms: ['己酮糖', '酮基', '己醛糖', '醛基'],
                differenceOptions: ['葡萄糖含醛基，果糖含酮基，但果糖在碱性条件下可异构化为葡萄糖', '葡萄糖是酮糖', '果糖无还原性', '两者没有区别'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '果糖能否发生银镜反应？',
                scenarioOptions: ['能，因为在碱性条件下果糖可异构化为葡萄糖（含醛基）', '不能，果糖不含醛基', '能，果糖本身就含醛基', '不能，果糖无还原性'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '葡萄糖：己醛糖（含醛基-CHO），是还原性糖',
                  '果糖：己酮糖（含酮基C=O），在碱性条件下可异构化为葡萄糖',
                  '两者均为还原性糖（果糖因异构化也能发生银镜反应）',
                  '这是中学常见的易混淆点：酮糖本身不含醛基但在碱性条件下可转化'
                ]
              }
            }
          ]
        },
        {
          id: 'xb3-ch4-sec2',
          title: '第二节 蛋白质',
          exercises: [
            {
              id: 'xb3c4s2-001', template: 'concept-construction',
              title: '蛋白质的化学性质',
              params: {
                cases: ['蛋白质在酸/碱/酶作用下水解生成氨基酸', '蛋白质遇浓HNO₃变黄（颜色反应）', '蛋白质灼烧有烧焦羽毛气味'],
                caseOptions: ['均为蛋白质的特征化学性质', '均为物理变化', '均为盐析现象'],
                caseCorrectIndices: [0],
                caseCommonality: '这三个案例分别代表了蛋白质的水解、颜色反应和灼烧鉴别三种特征性质',
                conceptName: '蛋白质的化学性质',
                definitionKeyTerms: ['水解', '氨基酸', '颜色反应', '变性', '盐析'],
                definitionHint: '蛋白质最终水解产物是什么？蛋白质遇浓HNO₃变黄是什么反应？',
                fullDefinition: '蛋白质最终水解产物为氨基酸；蛋白质遇浓HNO₃变黄称为颜色反应；蛋白质灼烧有烧焦羽毛气味',
                boundaryItems: ['(NH₄)₂SO₄可使蛋白质盐析', '重金属盐使蛋白质变性', '加热使蛋白质变性', '酒精使蛋白质变性'],
                boundaryCorrectIndices: [0, 1, 2, 3],
                explainPrompt: '为什么盐析和变性都是蛋白质的重要性质？',
                explainHint: '盐析和变性是蛋白质的两类重要性质，区别在于可逆性',
                explainKeyTerms: ['盐析', '变性', '可逆', '不可逆'],
                reasoning: [
                  '蛋白质水解：最终产物为α-氨基酸',
                  '颜色反应：含苯环的蛋白质遇浓HNO₃变黄',
                  '盐析：加入铵盐或轻金属盐，可逆（物理变化），用于分离提纯',
                  '变性：加热、重金属盐、强酸强碱、酒精等，不可逆（化学变化）'
                ]
              }
            },
            {
              id: 'xb3c4s2-002', template: 'comparison-reasoning',
              title: '盐析与变性的对比',
              params: {
                conceptA: '盐析',
                conceptB: '变性',
                description: '加入轻金属盐或铵盐，可逆过程（加水可恢复），蛋白质结构未改变，用于分离提纯蛋白质',
                identifyCorrectIndex: 0,
                excludePrompt: '为什么这个描述不是变性？',
                excludeHint: '变性是不可逆过程，蛋白质空间结构被破坏',
                excludeKeyTerms: ['可逆', '不可逆', '结构未改变', '结构破坏'],
                differenceOptions: ['盐析可逆（物理变化），变性不可逆（化学变化）', '都是可逆的', '都是不可逆的', '盐析是化学变化'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '向鸡蛋清溶液中加入(NH₄)₂SO₄饱和溶液出现白色沉淀，再加入蒸馏水沉淀溶解，这是什么过程？',
                scenarioOptions: ['盐析（可逆，物理变化）', '变性（不可逆，化学变化）', '水解反应', '颜色反应'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '盐析：加入轻金属盐或铵盐，蛋白质溶解度降低而析出，结构未变',
                  '盐析可逆：加水后蛋白质重新溶解，用于分离提纯',
                  '变性：加热、重金属盐、强酸强碱、紫外线等，空间结构被破坏',
                  '变性不可逆：失去生理活性，加水不能恢复'
                ]
              }
            },
            {
              id: 'xb3c4s2-003', template: 'concept-construction',
              title: '氨基酸的缩合反应',
              params: {
                cases: ['2H₂NCH₂COOH→H₂NCH₂CONHCH₂COOH+H₂O（甘氨酸缩合）', 'H₂NCH₂COOH+H₂NCH(CH₃)COOH→二肽+H₂O', '多个氨基酸缩合形成多肽链'],
                caseOptions: ['均为氨基酸通过缩合反应生成肽键(-CONH-)', '均为氧化反应', '均为加成反应'],
                caseCorrectIndices: [0],
                caseCommonality: '三个案例都是氨基酸分子间通过羧基(-COOH)和氨基(-NH₂)脱水缩合，形成肽键(-CONH-)的过程',
                conceptName: '缩合反应',
                definitionKeyTerms: ['羧基', '氨基', '脱水', '肽键'],
                definitionHint: '一个氨基酸的羧基与另一个氨基酸的氨基通过脱水反应形成什么化学键？',
                fullDefinition: '缩合反应是氨基酸的羧基脱-OH、氨基脱-H，脱水形成肽键(-CONH-)的过程',
                boundaryItems: ['两个甘氨酸缩合生成二肽', '氨基酸与NaOH反应（中和）', '氨基酸与HCl反应（成盐）', '多肽进一步水解生成氨基酸'],
                boundaryCorrectIndices: [0],
                explainPrompt: '为什么氨基酸与NaOH的反应不是缩合反应？',
                explainHint: '那是酸碱中和反应，没有形成肽键',
                explainKeyTerms: ['中和', '肽键', '脱水缩合'],
                reasoning: [
                  '氨基酸的缩合：一个氨基酸的-COOH脱-OH，另一个氨基酸的-NH₂脱-H',
                  '脱去的-OH和-H结合生成H₂O，剩余部分以肽键(-CONH-)连接',
                  '两个氨基酸缩合→二肽，多个氨基酸缩合→多肽/蛋白质',
                  '肽键(-CONH-)是蛋白质一级结构的关键化学键'
                ]
              }
            }
          ]
        },
        {
          id: 'xb3-ch4-sec3',
          title: '第三节 核酸',
          exercises: [
            {
              id: 'xb3c4s3-001', template: 'concept-construction',
              title: '核酸的基本组成',
              params: {
                cases: ['核苷酸由磷酸、五碳糖和含氮碱基组成', 'DNA含脱氧核糖，碱基为A、T、C、G', 'RNA含核糖，碱基为A、U、C、G'],
                caseOptions: ['均为核酸（DNA/RNA）的结构组成特征', '均为氨基酸的组成', '均为糖类的组成'],
                caseCorrectIndices: [0],
                caseCommonality: '三个案例描述了核酸的基本组成单位（核苷酸）以及DNA和RNA在糖和碱基上的区别',
                conceptName: '核酸的基本组成',
                definitionKeyTerms: ['核苷酸', '磷酸', '五碳糖', '含氮碱基'],
                definitionHint: '核酸的基本组成单位是什么？由哪三部分组成？',
                fullDefinition: '核酸的基本组成单位是核苷酸，由磷酸、五碳糖（核糖或脱氧核糖）和含氮碱基三部分组成',
                boundaryItems: ['DNA是双螺旋结构', 'RNA通常是单链结构', 'DNA和RNA的糖不同', 'DNA和RNA的碱基完全相同'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么DNA和RNA的碱基完全相同是错误的？',
                explainHint: 'DNA有T（胸腺嘧啶），RNA有U（尿嘧啶）替代了T',
                explainKeyTerms: ['T', 'U', 'DNA', 'RNA'],
                reasoning: [
                  '核酸的基本单位是核苷酸（磷酸+五碳糖+碱基）',
                  'DNA的五碳糖是脱氧核糖，碱基为A、T、C、G（双螺旋结构）',
                  'RNA的五碳糖是核糖，碱基为A、U、C、G（单链结构）',
                  'DNA和RNA的碱基不完全相同：DNA含T不含U，RNA含U不含T'
                ]
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
              id: 'xb3c5s1-001', template: 'comparison-reasoning',
              title: '加聚反应与缩聚反应的对比',
              params: {
                conceptA: '加聚反应',
                conceptB: '缩聚反应',
                description: '单体含两个或多个官能团，产物生成同时有小分子副产物（H₂O、HCl等），聚酯、蛋白质是典型产物',
                identifyCorrectIndex: 1,
                excludePrompt: '为什么这个描述不是加聚反应？',
                excludeHint: '加聚反应的单体含不饱和键，产物只有高聚物，无小分子副产物',
                excludeKeyTerms: ['小分子副产物', '不饱和键', '双官能团'],
                differenceOptions: ['加聚无小分子副产物，缩聚有小分子副产物', '加聚生成水', '缩聚需催化剂', '两者无区别'],
                differenceCorrectIndex: 0,
                scenarioPrompt: '乙烯生成聚乙烯的反应属于哪种类型？',
                scenarioOptions: ['加聚反应（单体含C=C，无小分子副产物）', '缩聚反应（生成小分子副产物）', '加成反应（单体间不聚合）', '消去反应'],
                scenarioCorrectIndex: 0,
                reasoning: [
                  '加聚反应：单体含不饱和键（C=C），产物仅高聚物，无小分子副产物',
                  '缩聚反应：单体含两个或多个官能团，产物生成同时有小分子副产物（H₂O、HCl等）',
                  '加聚典型产物：聚乙烯、聚氯乙烯、聚苯乙烯',
                  '缩聚典型产物：聚酯、聚酰胺（蛋白质、尼龙）'
                ]
              }
            },
            {
              id: 'xb3c5s1-002', template: 'concept-construction',
              title: '聚乙烯的加聚反应',
              params: {
                cases: ['nCH₂=CH₂ → 催化剂→ [CH₂-CH₂]ₙ（聚乙烯）', 'nCH₂=CHCl → [CH₂-CHCl]ₙ（聚氯乙烯）', 'nCH₂=CH-C₆H₅ → [CH₂-CH(C₆H₅)]ₙ（聚苯乙烯）'],
                caseOptions: ['均为烯烃单体的加聚反应（C=C打开，单体相互连接成链）', '均为缩聚反应', '均为消去反应'],
                caseCorrectIndices: [0],
                caseCommonality: '三个案例都是含有C=C的烯烃单体在催化剂作用下打开双键，单体间相互连接形成高分子的加聚反应',
                conceptName: '加聚反应',
                definitionKeyTerms: ['C=C', '打开', '单体', '聚合物', '无小分子副产物'],
                definitionHint: '含C=C键的单体在催化剂作用下打开双键相互连接成高分子的反应叫什么？',
                fullDefinition: '加聚反应是含不饱和键（C=C）的单体在催化剂作用下打开双键，相互连接形成高分子化合物的反应，反应中无小分子副产物生成',
                boundaryItems: ['乙烯加聚生成聚乙烯', '苯酚与甲醛缩聚生成酚醛树脂', '氯乙烯加聚生成聚氯乙烯', '乙酸与乙醇的酯化反应'],
                boundaryCorrectIndices: [0, 2],
                explainPrompt: '为什么苯酚与甲醛的反应不是加聚反应？',
                explainHint: '苯酚与甲醛的反应有小分子副产物（H₂O）生成，是缩聚反应',
                explainKeyTerms: ['缩聚', '小分子副产物', '加聚'],
                reasoning: [
                  '加聚反应条件：单体必须含C=C不饱和键',
                  '反应过程：C=C打开，单体间首尾连接成长碳链',
                  '产物仅为高聚物，无小分子析出',
                  '聚乙烯是最简单的加聚产物，n为聚合度'
                ]
              }
            },
            {
              id: 'xb3c5s1-003', template: 'error-analysis',
              title: '加聚产物单体的判断',
              params: {
                statement: '由单体CH₂=CHCl加聚得到的高聚物是[CH₂-CHCl]ₙ，单体名为乙烯',
                errorOptions: ['单体名为氯乙烯，不是乙烯', '高聚物是聚乙烯', '加聚产物写法错误', '单体名称正确'],
                errorCorrectIndex: 0,
                principleKeyTerms: ['氯乙烯', '聚氯乙烯', '加聚', '单体判断'],
                principleHint: '加聚产物的单体判断：两个碳一组，恢复C=C双键',
                correctVersion: '单体为氯乙烯(CH₂=CHCl)，加聚产物为聚氯乙烯[CH₂-CHCl]ₙ，简称PVC',
                finalHint: 'CH₂=CHCl是氯乙烯（乙烯的一个H被Cl取代），其加聚产物是聚氯乙烯',
                reasoning: [
                  '观察聚合物主链[CH₂-CHCl]ₙ，每两个碳为一组',
                  '恢复C=C双键，得到单体CH₂=CHCl',
                  '该单体名称为氯乙烯，不是乙烯（乙烯是CH₂=CH₂）',
                  '产物应称为聚氯乙烯（PVC），与聚乙烯不同'
                ]
              }
            }
          ]
        },
        {
          id: 'xb3-ch5-sec2',
          title: '第二节 高分子材料',
          exercises: [
            {
              id: 'xb3c5s2-001', template: 'concept-construction',
              title: '常见高分子材料的用途',
              params: {
                cases: ['聚乙烯制塑料袋和保鲜膜', '聚氯乙烯制管道和电线绝缘层', '合成橡胶用于制轮胎'],
                caseOptions: ['均为合成高分子材料的典型用途', '均为天然材料的用途', '均为金属材料的用途'],
                caseCorrectIndices: [0],
                caseCommonality: '三个案例分别代表了塑料、合成橡胶这类合成高分子材料在日常生活中的典型应用',
                conceptName: '合成高分子材料',
                definitionKeyTerms: ['塑料', '合成橡胶', '合成纤维', '三大合成材料'],
                definitionHint: '三大合成材料是指哪三类？',
                fullDefinition: '三大合成材料是指塑料、合成橡胶和合成纤维，它们是以人工合成的高分子化合物为基体制成的材料',
                boundaryItems: ['涤纶是合成纤维', '锦纶是合成纤维', '尼龙是合成纤维', '棉花是合成纤维'],
                boundaryCorrectIndices: [0, 1, 2],
                explainPrompt: '为什么棉花不是合成纤维？',
                explainHint: '棉花是天然纤维素纤维，不是人工合成的',
                explainKeyTerms: ['合成纤维', '天然纤维', '棉花', '纤维素'],
                reasoning: [
                  '三大合成材料：塑料、合成橡胶、合成纤维',
                  '合成纤维是人工合成的，如涤纶、锦纶、尼龙等',
                  '棉花、羊毛、蚕丝是天然纤维（不是合成的）',
                  '合成高分子材料性能优异，应用广泛'
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
