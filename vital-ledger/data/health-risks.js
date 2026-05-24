const HealthRiskData = {
  sedentary: {
    label: '久坐',
    description: '长时间保持坐姿工作',
    dailyThresholds: [
      { hours: 4, riskMultiplier: 1.0, label: '较少久坐' },
      { hours: 6, riskMultiplier: 1.16, label: '中度久坐' },
      { hours: 8, riskMultiplier: 1.37, label: '高度久坐' },
      { hours: 10, riskMultiplier: 1.54, label: '极度久坐' }
    ],
    healthEffects: {
      cvd: { rr: 1.34, label: '心血管疾病风险增加34%' },
      allCause: { rr: 1.16, label: '全因死亡率增加16%' },
      diabetes: { rr: 1.20, label: '2型糖尿病风险增加20%' },
      cancer: { rr: 1.13, label: '癌症风险增加13%' },
      musculoskeletal: { rr: 1.45, label: '肌肉骨骼疾病风险增加45%' }
    },
    studies: [
      'JAMA Network Open, 2024 - 台湾48万人群队列研究',
      'American Journal of Epidemiology, 2018 - 美国癌症学会12.7万人群研究',
      'PLOS One, 2024 - UC Riverside年轻人群研究'
    ]
  },

  sleepDeprivation: {
    label: '睡眠不足',
    description: '每日睡眠时间少于推荐量',
    dailyThresholds: [
      { hours: 8, riskMultiplier: 1.0, label: '充足睡眠(7-9h)' },
      { hours: 6.5, riskMultiplier: 1.07, label: '轻度不足(6-7h)' },
      { hours: 5.5, riskMultiplier: 1.13, label: '中度不足(5-6h)' },
      { hours: 4.5, riskMultiplier: 1.20, label: '严重不足(<5h)' }
    ],
    healthEffects: {
      allCause: { rr: 1.13, label: '全因死亡率增加13%(<6h)' },
      obesity: { rr: 1.38, label: '肥胖风险增加38%' },
      cvd: { rr: 1.15, label: '心血管疾病风险增加15%' },
      diabetes: { rr: 1.28, label: '糖尿病风险增加28%' },
      metabolic: { rr: 1.20, label: '代谢紊乱风险增加20%' }
    },
    studies: [
      'RAND Europe, 2016 - 5国跨国产能损失研究',
      'American Academy of Sleep Medicine, 2018 - 睡眠与工作绩效',
      'Stanford Lifestyle Medicine, 2024 - 睡眠剥夺与代谢健康'
    ]
  },

  workStress: {
    label: '工作压力',
    description: '高要求低控制的工作压力(Job Strain)',
    levels: [
      { level: 'low', rr: 1.0, label: '低压工作' },
      { level: 'moderate', rr: 1.2, label: '中度压力' },
      { level: 'high', rr: 1.4, label: '高压工作' }
    ],
    healthEffects: {
      chd: { rr: 1.40, label: '冠心病风险增加40%' },
      stroke: { rr: 1.25, label: '中风风险增加25%' },
      diabetes: { rr: 1.15, label: '糖尿病风险增加15%' },
      mental: { rr: 1.50, label: '心理健康问题风险增加50%' }
    },
    studies: [
      'JACC Advances, 2025 - 工作心理压力与冠心病',
      'The Lancet, 2012 - 19.7万人Job Strain与CHD荟萃分析',
      'Harvard Health, 2023 - 工作压力对心脏的影响',
      'Lancet Diabetes Endocrinol, 2018 - 工作压力与死亡风险'
    ]
  },

  effortRewardImbalance: {
    label: '付出-回报失衡',
    description: '高付出低回报的工作模式(ERI模型)',
    levels: [
      { level: false, rr: 1.0, label: '基本平衡' },
      { level: true, rr: 1.46, label: '高付出低回报' }
    ],
    healthEffects: {
      mentalDisorder: { or: 1.90, label: '心理障碍风险增加90%' },
      cvd: { r: 0.26, label: '心血管指标关联r=0.26' },
      chd: { rr: 1.44, label: '冠心病风险增加44%' },
      burnout: { rr: 1.60, label: '职业倦怠风险增加60%' },
      diabetes: { rr: 1.30, label: '2型糖尿病风险增加30%' }
    },
    studies: [
      'Siegrist, 1996/2016 - ERI模型原创与验证',
      'Neurosci Biobehav Rev, 2017 - ERI与CVD指标荟萃分析(N=93,817)',
      'Scandinavian J Work, 2020 - ERI与心理障碍前瞻性研究',
      'Work & Stress, 2025 - ERI与离职意愿的性别差异'
    ]
  },

  socialIsolation: {
    label: '社会孤立',
    description: '工作导致的社交联系不足',
    levels: [
      { level: 'low', rr: 1.0, label: '社交充实' },
      { level: 'moderate', rr: 1.10, label: '社交一般' },
      { level: 'high', rr: 1.29, label: '社交孤立' }
    ],
    healthEffects: {
      allCause: { rr: 1.29, label: '全因死亡率增加29%' },
      cvd: { rr: 1.34, label: '心血管疾病风险增加34%' },
      dementia: { rr: 1.50, label: '痴呆风险增加50%' },
      depression: { rr: 1.40, label: '抑郁风险增加40%' },
      mortalityEquiv: '相当于每日吸15支烟或肥胖(BMI>30)'
    },
    studies: [
      'WHO Commission on Social Connection, 2024-2026',
      'CDC Social Connectedness, 2024 - 健康影响系统评估',
      'PMC, 2024 - 社会连接作为心理健康关键因素',
      'Lancet Public Health, 2023 - 孤独与死亡率系统综述'
    ]
  },

  indoorAirQuality: {
    label: '室内空气质量',
    description: '办公场所空气质量对健康和认知的影响',
    levels: [
      { level: 'good', rr: 1.0, label: '良好' },
      { level: 'moderate', rr: 1.05, label: '一般' },
      { level: 'poor', rr: 1.12, label: '较差' }
    ],
    healthEffects: {
      cognitiveDecline: { label: '认知测试表现下降达50%' },
      productivityLoss: { label: '生产力损失达9%' },
      respiratory: { rr: 1.15, label: '呼吸系统症状增加15%' },
      sbs: { label: '病态建筑综合征症状显著增加' }
    },
    studies: [
      'ScienceDirect, 2025 - IAQ与办公表现机器学习研究',
      'Dialogues in Health, 2024 - 病态建筑综合征与IAQ',
      'CKGSB, 2020 - 空气污染与中国制造业生产力损失',
      'ISTISAN 25/15, 2025 - 意大利办公空气质量国家标准'
    ]
  },

  physicalLabor: {
    label: '体力劳动',
    description: '工作中需要长时间站立/负重/重复动作',
    levels: [
      { level: 'light', rr: 1.0, label: '轻度体力' },
      { level: 'moderate', rr: 1.15, label: '中度体力' },
      { level: 'heavy', rr: 1.30, label: '重度体力' }
    ],
    healthEffects: {
      msd: { rr: 1.60, label: '肌肉骨骼疾病风险增加60%' },
      arthritis: { rr: 1.35, label: '关节炎风险增加35%' },
      hearing: { rr: 1.20, label: '听力损伤风险增加20%' },
      respiratory: { rr: 1.18, label: '呼吸系统疾病风险增加18%' }
    },
    studies: [
      'WHO/ILO, 2021 - 职业伤害全球负担报告',
      'Scandinavian Journal of Work, 2019 - 体力劳动与退行性疾病'
    ]
  },

  overtime: {
    label: '加班工作',
    description: '每周工作时间超过标准',
    weeklyThresholds: [
      { hours: 40, rr: 1.0, label: '标准工时' },
      { hours: 48, rr: 1.13, label: '适度加班(48h)' },
      { hours: 55, rr: 1.33, label: '大量加班(55h)' },
      { hours: 60, rr: 1.42, label: '过度加班(60h+)' }
    ],
    healthEffects: {
      stroke: { rr: 1.33, label: '中风风险增加33%(55h+)' },
      chd: { rr: 1.13, label: '冠心病风险增加13%(49-54h)' },
      anxiety: { rr: 1.35, label: '焦虑风险增加35%' },
      burnout: { rr: 1.60, label: '职业倦怠风险增加60%' }
    },
    studies: [
      'The Lancet, 2015 - 长工时与中风风险',
      'American Journal of Preventive Medicine, 2025 - 职业倦怠经济负担',
      'WHO, 2021 - 长工时导致74.5万人死亡/年'
    ]
  },

  nightShift: {
    label: '夜班工作',
    description: '需要夜间工作(22:00-6:00)',
    frequencyLevels: [
      { freq: 'never', rr: 1.0, label: '无夜班' },
      { freq: 'occasional', rr: 1.10, label: '偶尔夜班' },
      { freq: 'frequent', rr: 1.25, label: '频繁夜班' },
      { freq: 'always', rr: 1.42, label: '固定夜班' }
    ],
    healthEffects: {
      cancer: { rr: 1.15, label: '癌症风险增加15%(IARC 2A类)' },
      cvd: { rr: 1.24, label: '心血管风险增加24%' },
      metabolic: { rr: 1.30, label: '代谢综合征风险增加30%' },
      digestive: { rr: 1.25, label: '消化系统疾病风险增加25%' }
    },
    studies: [
      'IARC, 2019 - 夜班工作致癌性评估(2A类)',
      'BMJ, 2016 - 夜班与冠心病风险',
      'Occupational Medicine, 2020 - 夜班对代谢的影响'
    ]
  }
};
