const DiseaseData = {
  occupations: {
    officeWorker: {
      label: '办公室职员/程序员',
      risks: [
        { disease: 'cervicalSpondylosis', probability: 0.55, latencyYears: 8, severity: 'moderate' },
        { disease: 'lumbarDisc', probability: 0.45, latencyYears: 10, severity: 'moderate' },
        { disease: 'hypertension', probability: 0.30, latencyYears: 12, severity: 'mild' },
        { disease: 'type2Diabetes', probability: 0.18, latencyYears: 15, severity: 'moderate' },
        { disease: 'coronaryHeartDisease', probability: 0.15, latencyYears: 18, severity: 'severe' },
        { disease: 'depression', probability: 0.25, latencyYears: 5, severity: 'moderate' },
        { disease: 'burnout', probability: 0.30, latencyYears: 4, severity: 'moderate' },
        { disease: 'obesity', probability: 0.35, latencyYears: 8, severity: 'mild' },
        { disease: 'hemorrhoids', probability: 0.50, latencyYears: 5, severity: 'mild' },
        { disease: 'carpalTunnel', probability: 0.20, latencyYears: 6, severity: 'mild' },
        { disease: 'dryEye', probability: 0.60, latencyYears: 3, severity: 'mild' },
        { disease: 'sleepDisorder', probability: 0.25, latencyYears: 4, severity: 'mild' }
      ]
    },
    serviceWorker: {
      label: '服务业人员',
      risks: [
        { disease: 'hypertension', probability: 0.35, latencyYears: 10, severity: 'mild' },
        { disease: 'varicoseVeins', probability: 0.40, latencyYears: 8, severity: 'mild' },
        { disease: 'lumbarDisc', probability: 0.35, latencyYears: 10, severity: 'moderate' },
        { disease: 'depression', probability: 0.30, latencyYears: 5, severity: 'moderate' },
        { disease: 'burnout', probability: 0.28, latencyYears: 4, severity: 'moderate' },
        { disease: 'gastritis', probability: 0.40, latencyYears: 5, severity: 'mild' },
        { disease: 'coronaryHeartDisease', probability: 0.18, latencyYears: 18, severity: 'severe' },
        { disease: 'sleepDisorder', probability: 0.20, latencyYears: 4, severity: 'mild' }
      ]
    },
    manualWorker: {
      label: '体力劳动者',
      risks: [
        { disease: 'lumbarDisc', probability: 0.50, latencyYears: 8, severity: 'severe' },
        { disease: 'arthritis', probability: 0.40, latencyYears: 12, severity: 'moderate' },
        { disease: 'hypertension', probability: 0.25, latencyYears: 10, severity: 'mild' },
        { disease: 'hearingLoss', probability: 0.30, latencyYears: 15, severity: 'moderate' },
        { disease: 'respiratoryDisease', probability: 0.25, latencyYears: 12, severity: 'moderate' },
        { disease: 'carpalTunnel', probability: 0.25, latencyYears: 6, severity: 'moderate' },
        { disease: 'tendonitis', probability: 0.35, latencyYears: 5, severity: 'mild' }
      ]
    },
    medicalWorker: {
      label: '医护人员',
      risks: [
        { disease: 'depression', probability: 0.40, latencyYears: 4, severity: 'moderate' },
        { disease: 'burnout', probability: 0.50, latencyYears: 3, severity: 'severe' },
        { disease: 'lumbarDisc', probability: 0.35, latencyYears: 8, severity: 'moderate' },
        { disease: 'sleepDisorder', probability: 0.45, latencyYears: 3, severity: 'moderate' },
        { disease: 'infectiousDisease', probability: 0.30, latencyYears: 2, severity: 'moderate' },
        { disease: 'varicoseVeins', probability: 0.35, latencyYears: 6, severity: 'mild' },
        { disease: 'gastritis', probability: 0.35, latencyYears: 5, severity: 'mild' }
      ]
    },
    driver: {
      label: '驾驶员/运输业',
      risks: [
        { disease: 'lumbarDisc', probability: 0.55, latencyYears: 8, severity: 'severe' },
        { disease: 'cervicalSpondylosis', probability: 0.50, latencyYears: 6, severity: 'moderate' },
        { disease: 'hypertension', probability: 0.35, latencyYears: 10, severity: 'mild' },
        { disease: 'gastritis', probability: 0.45, latencyYears: 5, severity: 'mild' },
        { disease: 'hemorrhoids', probability: 0.55, latencyYears: 5, severity: 'mild' },
        { disease: 'hearingLoss', probability: 0.25, latencyYears: 15, severity: 'moderate' },
        { disease: 'sleepDisorder', probability: 0.30, latencyYears: 5, severity: 'moderate' },
        { disease: 'burnout', probability: 0.20, latencyYears: 5, severity: 'mild' }
      ]
    },
    teacher: {
      label: '教师/教育工作者',
      risks: [
        { disease: 'cervicalSpondylosis', probability: 0.45, latencyYears: 8, severity: 'moderate' },
        { disease: 'pharyngitis', probability: 0.55, latencyYears: 3, severity: 'mild' },
        { disease: 'varicoseVeins', probability: 0.35, latencyYears: 10, severity: 'mild' },
        { disease: 'depression', probability: 0.30, latencyYears: 6, severity: 'moderate' },
        { disease: 'lumbarDisc', probability: 0.30, latencyYears: 10, severity: 'moderate' },
        { disease: 'hypertension', probability: 0.25, latencyYears: 12, severity: 'mild' }
      ]
    }
  },

  diseaseDetails: {
    hypertension: {
      label: '高血压',
      description: '长期工作压力和不规律作息导致',
      annualCost: 4000,
      qalyLoss: 0.05,
      lifeYearsLost: 2,
      treatable: true
    },
    type2Diabetes: {
      label: '2型糖尿病',
      description: '久坐、不健康饮食和肥胖相关',
      annualCost: 10000,
      qalyLoss: 0.15,
      lifeYearsLost: 6,
      treatable: true
    },
    coronaryHeartDisease: {
      label: '冠心病',
      description: '工作压力、久坐、不良生活习惯累积',
      annualCost: 25000,
      qalyLoss: 0.25,
      lifeYearsLost: 8,
      treatable: true
    },
    stroke: {
      label: '中风(脑卒中)',
      description: '高血压、高压工作、久坐综合风险',
      annualCost: 35000,
      qalyLoss: 0.40,
      lifeYearsLost: 10,
      treatable: false
    },
    lumbarDisc: {
      label: '腰椎间盘突出',
      description: '久坐或重体力劳动导致',
      annualCost: 8000,
      qalyLoss: 0.12,
      lifeYearsLost: 1,
      treatable: true
    },
    cervicalSpondylosis: {
      label: '颈椎病',
      description: '长期低头办公或不良姿势导致',
      annualCost: 5000,
      qalyLoss: 0.08,
      lifeYearsLost: 0,
      treatable: true
    },
    depression: {
      label: '抑郁症',
      description: '长期工作压力、ERI失衡、社会孤立综合作用',
      annualCost: 12000,
      qalyLoss: 0.30,
      lifeYearsLost: 5,
      treatable: true
    },
    cancer: {
      label: '癌症(职业相关)',
      description: '夜班、环境暴露、长期压力综合因素',
      annualCost: 150000,
      qalyLoss: 0.50,
      lifeYearsLost: 12,
      treatable: false
    },
    obesity: {
      label: '肥胖',
      description: '久坐、不规律饮食、缺乏运动',
      annualCost: 3000,
      qalyLoss: 0.06,
      lifeYearsLost: 3,
      treatable: true
    },
    sleepDisorder: {
      label: '睡眠障碍',
      description: '加班、夜班、工作压力导致',
      annualCost: 4000,
      qalyLoss: 0.10,
      lifeYearsLost: 2,
      treatable: true
    },
    hemorrhoids: {
      label: '痔疮',
      description: '长期久坐压迫',
      annualCost: 1500,
      qalyLoss: 0.03,
      lifeYearsLost: 0,
      treatable: true
    },
    carpalTunnel: {
      label: '腕管综合征',
      description: '长期键盘/鼠标操作',
      annualCost: 2000,
      qalyLoss: 0.04,
      lifeYearsLost: 0,
      treatable: true
    },
    dryEye: {
      label: '干眼症',
      description: '长期面对屏幕',
      annualCost: 1000,
      qalyLoss: 0.02,
      lifeYearsLost: 0,
      treatable: true
    },
    varicoseVeins: {
      label: '静脉曲张',
      description: '长期站立工作',
      annualCost: 2000,
      qalyLoss: 0.04,
      lifeYearsLost: 0,
      treatable: true
    },
    gastritis: {
      label: '慢性胃炎',
      description: '不规律饮食、工作压力',
      annualCost: 2000,
      qalyLoss: 0.04,
      lifeYearsLost: 0,
      treatable: true
    },
    arthritis: {
      label: '骨关节炎',
      description: '长期体力劳动关节磨损',
      annualCost: 6000,
      qalyLoss: 0.15,
      lifeYearsLost: 1,
      treatable: false
    },
    hearingLoss: {
      label: '职业性听力损失',
      description: '长期噪音环境',
      annualCost: 3000,
      qalyLoss: 0.06,
      lifeYearsLost: 0,
      treatable: false
    },
    respiratoryDisease: {
      label: '慢性呼吸系统疾病',
      description: '工作环境粉尘/化学物暴露',
      annualCost: 8000,
      qalyLoss: 0.18,
      lifeYearsLost: 5,
      treatable: true
    },
    tendonitis: {
      label: '肌腱炎',
      description: '长期重复性动作',
      annualCost: 2000,
      qalyLoss: 0.04,
      lifeYearsLost: 0,
      treatable: true
    },
    burnout: {
      label: '职业倦怠',
      description: '长期高压工作、付出回报失衡(ERI模型)',
      annualCost: 8000,
      qalyLoss: 0.20,
      lifeYearsLost: 3,
      treatable: true
    },
    infectiousDisease: {
      label: '职业感染',
      description: '工作环境病原体暴露',
      annualCost: 5000,
      qalyLoss: 0.05,
      lifeYearsLost: 1,
      treatable: true
    },
    pharyngitis: {
      label: '慢性咽炎',
      description: '长期讲话或用嗓过度',
      annualCost: 1000,
      qalyLoss: 0.02,
      lifeYearsLost: 0,
      treatable: true
    }
  }
};
