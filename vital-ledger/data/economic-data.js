const EconomicData = {
  currency: 'CNY',
  currencySymbol: '¥',

  medicalCosts: {
    annualCheckup: { min: 500, max: 2000, avg: 1000, label: '年度体检' },
    outpatientPerVisit: { min: 100, max: 500, avg: 250, label: '单次门诊' },
    hospitalizationPerDay: { min: 800, max: 3000, avg: 1500, label: '住院日均费用' },

    chronicDiseases: {
      hypertension: {
        annualCost: { min: 2000, max: 8000, avg: 4000 },
        lifetimeCost: { min: 80000, max: 300000, avg: 150000 },
        label: '高血压'
      },
      type2Diabetes: {
        annualCost: { min: 5000, max: 20000, avg: 10000 },
        lifetimeCost: { min: 200000, max: 600000, avg: 350000 },
        label: '2型糖尿病'
      },
      coronaryHeartDisease: {
        annualCost: { min: 10000, max: 50000, avg: 25000 },
        lifetimeCost: { min: 300000, max: 1000000, avg: 600000 },
        label: '冠心病'
      },
      stroke: {
        annualCost: { min: 15000, max: 80000, avg: 35000 },
        lifetimeCost: { min: 400000, max: 1500000, avg: 800000 },
        label: '中风'
      },
      lumbarDisc: {
        annualCost: { min: 3000, max: 15000, avg: 8000 },
        lifetimeCost: { min: 50000, max: 300000, avg: 120000 },
        label: '腰椎间盘突出'
      },
      cervicalSpondylosis: {
        annualCost: { min: 2000, max: 10000, avg: 5000 },
        lifetimeCost: { min: 30000, max: 200000, avg: 80000 },
        label: '颈椎病'
      },
      depression: {
        annualCost: { min: 5000, max: 30000, avg: 12000 },
        lifetimeCost: { min: 100000, max: 600000, avg: 300000 },
        label: '抑郁症'
      },
      cancer: {
        annualCost: { min: 50000, max: 300000, avg: 150000 },
        lifetimeCost: { min: 200000, max: 2000000, avg: 800000 },
        label: '癌症'
      }
    }
  },

  income: {
    avgLifetimeIncome: 1500000,
    avgMonthlySalary: 8000,
    avgRetirementAge: 60,
    avgLifeExpectancy: 77,
    pensionReplacementRate: 0.45
  },

  productivityLoss: {
    absenteeismPerYear: { min: 2, max: 10, avg: 5, unit: '天/年', label: '因病缺勤' },
    presenteeismLoss: { min: 0.05, max: 0.30, avg: 0.15, label: '出勤但效率损失比例' },
    burnoutCostPerEmployee: 28447,
    burnoutStudy: 'American Journal of Preventive Medicine, 2025 - 职业倦怠人均年成本$3,999-$20,683'
  },

  lifeValue: {
    qalyWeight: { full: 1.0, moderate: 0.7, severe: 0.4 },
    willingnessToPayPerQaly: { min: 50000, max: 200000, avg: 100000 },
    statisticalLifeValue: 7000000
  }
};
