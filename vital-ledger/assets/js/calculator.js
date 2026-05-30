const VitalLedgerCalculator = {
  calculate(input) {
    const profile = this.buildProfile(input);
    const workLifeAnalysis = this.analyzeWorkLife(profile);
    const healthRisks = this.assessHealthRisks(profile);
    const financialAnalysis = this.calculateFinances(profile, healthRisks);
    const lifeImpact = this.calculateLifeImpact(profile, healthRisks);
    const recommendations = this.generateRecommendations(profile, healthRisks, financialAnalysis, workLifeAnalysis);

    return {
      profile,
      workLifeAnalysis,
      healthRisks,
      financialAnalysis,
      lifeImpact,
      recommendations,
      timestamp: Date.now()
    };
  },

  buildProfile(input) {
    const age = input.age;
    const startWorkAge = input.startWorkAge;
    const retirementAge = input.retirementAge;
    const lifeExpectancy = input.lifeExpectancy || 77;

    const yearsWorked = Math.max(0, age - startWorkAge);
    const yearsToRetire = Math.max(0, retirementAge - age);
    const totalWorkingYears = Math.max(0, retirementAge - startWorkAge);
    const postRetirementYears = Math.max(0, lifeExpectancy - retirementAge);

    return {
      ...input,
      age,
      startWorkAge,
      retirementAge,
      yearsWorked,
      yearsToRetire,
      totalWorkingYears,
      lifeExpectancy,
      postRetirementYears,
      dailyWorkHours: input.dailyWorkHours || 8,
      weeklyWorkDays: input.weeklyWorkDays || 5,
      monthlySalary: input.monthlySalary || 0,
      annualSalary: (input.monthlySalary || 0) * 12,
      hasOvertime: input.hasOvertime || false,
      overtimeHoursPerWeek: input.overtimeHoursPerWeek || 0
    };
  },

  analyzeWorkLife(profile) {
    const dailyCommute = profile.commuteMinutes || 0;
    const dailyWorkHours = profile.dailyWorkHours || 8;
    const dailySleepHours = profile.sleepHours || 7;
    const weeklyWorkDays = profile.weeklyWorkDays || 5;

    const totalDailyWorkCommitment = dailyWorkHours + dailyCommute / 60;
    const dailyFreeTime = 24 - totalDailyWorkCommitment - dailySleepHours - 1.5;
    const weeklyWorkHours = dailyWorkHours * weeklyWorkDays + (profile.overtimeHoursPerWeek || 0);
    const weeklyFreeTime = dailyFreeTime * 7;

    const yearlyWorkHours = weeklyWorkHours * 49;
    const yearlyFreeTime = weeklyFreeTime * 52;

    const lifetimeWorkHours = yearlyWorkHours * profile.totalWorkingYears;
    const lifetimeFreeTime = yearlyFreeTime * (profile.lifeExpectancy - profile.startWorkAge);

    const workLifeRatio = lifetimeWorkHours / (lifetimeFreeTime + lifetimeWorkHours);

    return {
      totalDailyWorkCommitment,
      dailyFreeTime,
      weeklyWorkHours,
      weeklyFreeTime,
      yearlyWorkHours,
      yearlyFreeTime,
      lifetimeWorkHours,
      lifetimeFreeTime,
      workLifeRatio
    };
  },

  assessHealthRisks(profile) {
    const riskFactors = [];
    let rawMultiplicativeRR = 1.0;
    let totalQalyLoss = 0;
    let estimatedDiseases = [];
    let attenuationFactor = 0.55;

    const occupationData = DiseaseData.occupations[profile.occupationType];
    if (occupationData) {
      occupationData.risks.forEach(risk => {
        const disease = DiseaseData.diseaseDetails[risk.disease];
        if (!disease) return;

        let adjustedProb = risk.probability;

        if (profile.sedentaryHours > 6) {
          if (['lumbarDisc', 'cervicalSpondylosis', 'obesity', 'type2Diabetes', 'hemorrhoids'].includes(risk.disease)) {
            adjustedProb = Math.min(0.95, adjustedProb * 1.25);
          }
        }

        if (profile.sleepHours < 6) {
          if (['hypertension', 'type2Diabetes', 'obesity', 'depression'].includes(risk.disease)) {
            adjustedProb = Math.min(0.95, adjustedProb * 1.2);
          }
        }

        if (profile.stressLevel === 'high') {
          if (['coronaryHeartDisease', 'stroke', 'depression', 'hypertension'].includes(risk.disease)) {
            adjustedProb = Math.min(0.95, adjustedProb * 1.3);
          }
        }

        if (profile.eriImbalance) {
          if (['depression', 'burnout', 'coronaryHeartDisease', 'hypertension'].includes(risk.disease)) {
            adjustedProb = Math.min(0.95, adjustedProb * 1.35);
          }
        }

        if (profile.socialIsolation === 'high') {
          if (['depression', 'coronaryHeartDisease', 'hypertension', 'obesity'].includes(risk.disease)) {
            adjustedProb = Math.min(0.95, adjustedProb * 1.25);
          }
        }

        estimatedDiseases.push({
          id: risk.disease,
          name: disease.label,
          probability: adjustedProb,
          latencyYears: risk.latencyYears,
          severity: risk.severity,
          annualCost: disease.annualCost,
          qalyLossPerYear: disease.qalyLoss,
          lifeYearsLost: disease.lifeYearsLost,
          description: disease.description,
          treatable: disease.treatable
        });
      });
    }

    estimatedDiseases.sort((a, b) => b.probability - a.probability);

    estimatedDiseases.forEach(d => {
      totalQalyLoss += d.qalyLossPerYear * d.probability;
    });

    if (profile.sedentaryHours > 6) {
      const sedentaryRR = 1.0 + (profile.sedentaryHours - 6) * 0.08;
      rawMultiplicativeRR *= sedentaryRR;
      riskFactors.push({
        factor: '久坐',
        rr: sedentaryRR,
        detail: `每日久坐${profile.sedentaryHours}小时`,
        evidence: 'JAMA Network Open, 2024'
      });
    }

    if (profile.sleepHours < 7) {
      const sleepRR = profile.sleepHours < 6 ? 1.13 : 1.07;
      rawMultiplicativeRR *= sleepRR;
      riskFactors.push({
        factor: '睡眠不足',
        rr: sleepRR,
        detail: `每日睡眠${profile.sleepHours}小时`,
        evidence: 'RAND Europe, 2016'
      });
    }

    if (profile.stressLevel === 'high') {
      rawMultiplicativeRR *= 1.4;
      riskFactors.push({ factor: '工作高压(Job Strain)', rr: 1.4, detail: '高要求低控制工作模式', evidence: 'The Lancet, 2012' });
    } else if (profile.stressLevel === 'moderate') {
      rawMultiplicativeRR *= 1.2;
      riskFactors.push({ factor: '工作压力', rr: 1.2, detail: '中度工作压力', evidence: 'PMC荟萃分析, 2015' });
    }

    if (profile.eriImbalance) {
      rawMultiplicativeRR *= 1.46;
      riskFactors.push({ factor: '付出-回报失衡(ERI)', rr: 1.46, detail: '高付出低回报工作模式', evidence: 'Siegrist ERI模型, Neurosci Biobehav Rev, 2017' });
    }

    if (profile.hasOvertime && profile.overtimeHoursPerWeek > 0) {
      const otRR = profile.overtimeHoursPerWeek >= 55 ? 1.33 :
                   profile.overtimeHoursPerWeek >= 48 ? 1.13 : 1.05;
      rawMultiplicativeRR *= otRR;
      riskFactors.push({
        factor: '加班',
        rr: otRR,
        detail: `每周加班${profile.overtimeHoursPerWeek}小时`,
        evidence: 'The Lancet, 2015'
      });
    }

    if (profile.hasNightShift) {
      rawMultiplicativeRR *= 1.24;
      riskFactors.push({ factor: '夜班', rr: 1.24, detail: '频繁夜班工作', evidence: 'BMJ, 2016' });
    }

    if (profile.smoking) {
      rawMultiplicativeRR *= 1.50;
      riskFactors.push({ factor: '吸烟', rr: 1.50, detail: '吸烟习惯', evidence: 'WHO' });
    }

    if (profile.drinking === 'heavy') {
      rawMultiplicativeRR *= 1.30;
      riskFactors.push({ factor: '酗酒', rr: 1.30, detail: '重度饮酒', evidence: 'WHO' });
    }

    if (profile.socialIsolation === 'high') {
      rawMultiplicativeRR *= 1.29;
      riskFactors.push({ factor: '社会孤立', rr: 1.29, detail: '高社会孤立风险', evidence: 'WHO Commission on Social Connection, 2024' });
    } else if (profile.socialIsolation === 'moderate') {
      rawMultiplicativeRR *= 1.10;
      riskFactors.push({ factor: '社交不足', rr: 1.10, detail: '社交联系较少', evidence: 'CDC Social Connectedness, 2024' });
    }

    if (profile.workplaceAirQuality === 'poor') {
      rawMultiplicativeRR *= 1.12;
      riskFactors.push({ factor: '办公空气质量差', rr: 1.12, detail: '室内空气质量差', evidence: 'ScienceDirect IAQ研究, 2025' });
    }

    const adjustedRR = 1.0 + (rawMultiplicativeRR - 1.0) * attenuationFactor;

    const healthScore = Math.max(5, Math.min(100, 100 - (adjustedRR - 1) * 50));

    return {
      compositeRR: Math.round(adjustedRR * 100) / 100,
      rawMultiplicativeRR: Math.round(rawMultiplicativeRR * 100) / 100,
      totalQalyLoss: Math.round(totalQalyLoss * 100) / 100,
      estimatedDiseases,
      riskFactors,
      healthScore
    };
  },

  calculateFinances(profile, healthRisks) {
    const monthlySalary = profile.monthlySalary || 0;
    const annualSalary = monthlySalary * 12;
    const yearsToRetire = profile.yearsToRetire;
    const yearsWorked = profile.yearsWorked;
    const postRetirementYears = profile.postRetirementYears;

    const salaryGrowthRate = 0.05;
    const discountRate = 0.02;

    let totalFutureEarnings = 0;
    for (let i = 0; i < yearsToRetire; i++) {
      const futureSalary = annualSalary * Math.pow(1 + salaryGrowthRate, i);
      const discountedSalary = futureSalary / Math.pow(1 + discountRate, i);
      totalFutureEarnings += discountedSalary;
    }

    let totalPastEarnings = 0;
    for (let i = 0; i < yearsWorked; i++) {
      const pastSalary = annualSalary * Math.pow(1 + salaryGrowthRate, -(i + 1));
      totalPastEarnings += pastSalary;
    }

    const totalCareerEarnings = totalPastEarnings + totalFutureEarnings;

    const pensionAnnual = monthlySalary * 12 * 0.45;
    let totalPension = 0;
    for (let i = 0; i < postRetirementYears; i++) {
      totalPension += pensionAnnual / Math.pow(1 + discountRate, i);
    }

    const totalLifetimeIncome = totalCareerEarnings + totalPension;

    let totalMedicalCosts = 0;
    let annualMedicalCosts = 0;

    healthRisks.estimatedDiseases.forEach(disease => {
      const onsetAge = profile.startWorkAge + disease.latencyYears;
      const yearsWithDisease = Math.max(0, profile.lifeExpectancy - onsetAge);

      if (yearsWithDisease > 0) {
        const diseaseCost = disease.annualCost * disease.probability * Math.min(yearsWithDisease, 30);
        totalMedicalCosts += diseaseCost;
      }
      annualMedicalCosts += disease.annualCost * disease.probability;
    });

    const productivityLossAnnual = annualSalary * 0.15;
    const totalProductivityLoss = productivityLossAnnual * yearsToRetire;

    const netWorkReturn = totalFutureEarnings - totalMedicalCosts - totalProductivityLoss;

    const costBenefitRatio = totalMedicalCosts > 0 ?
      totalFutureEarnings / totalMedicalCosts : Infinity;

    const healthCostRatio = annualSalary > 0 ?
      (annualMedicalCosts / annualSalary) * 100 : 0;

    const workDaysPerYear = 250;
    const effectiveHourlyRate = workDaysPerYear > 0 && profile.dailyWorkHours > 0 ?
      (annualSalary - annualMedicalCosts) / (profile.dailyWorkHours * workDaysPerYear) : 0;

    return {
      monthlySalary,
      annualSalary,
      totalPastEarnings: Math.round(totalPastEarnings),
      totalFutureEarnings: Math.round(totalFutureEarnings),
      totalCareerEarnings: Math.round(totalCareerEarnings),
      totalPension: Math.round(totalPension),
      totalLifetimeIncome: Math.round(totalLifetimeIncome),
      annualMedicalCosts: Math.round(annualMedicalCosts),
      totalMedicalCosts: Math.round(totalMedicalCosts),
      productivityLossAnnual: Math.round(productivityLossAnnual),
      totalProductivityLoss: Math.round(totalProductivityLoss),
      netWorkReturn: Math.round(netWorkReturn),
      costBenefitRatio,
      healthCostRatio: Math.round(healthCostRatio * 10) / 10,
      effectiveHourlyRate: Math.round(effectiveHourlyRate)
    };
  },

  calculateLifeImpact(profile, healthRisks) {
    const averageLifeExpectancy = profile.lifeExpectancy || 77;
    let lifeYearsLost = 0;

    healthRisks.estimatedDiseases.forEach(disease => {
      if (!disease.treatable) {
        lifeYearsLost += (disease.lifeYearsLost || 0) * disease.probability;
      } else {
        lifeYearsLost += (disease.lifeYearsLost || 0) * disease.probability * 0.6;
      }
    });

    const sleepLoss = profile.sleepHours < 5 ? 2 :
                      profile.sleepHours < 6 ? 1.3 :
                      profile.sleepHours < 7 ? 0.5 : 0;

    const sedentaryLoss = profile.sedentaryHours > 10 ? 2 :
                          profile.sedentaryHours > 8 ? 1.2 :
                          profile.sedentaryHours > 6 ? 0.5 : 0;

    lifeYearsLost += sleepLoss + sedentaryLoss;

    const adjustedLifeExpectancy = Math.max(averageLifeExpectancy - lifeYearsLost, profile.age + 1);
    const healthyLifeExpectancy = Math.max(profile.age + 1, adjustedLifeExpectancy - healthRisks.totalQalyLoss * 4);

    const healthyYearsRatio = adjustedLifeExpectancy > 0 ?
      (healthyLifeExpectancy / adjustedLifeExpectancy) * 100 : 50;

    return {
      averageLifeExpectancy,
      adjustedLifeExpectancy: Math.round(adjustedLifeExpectancy * 10) / 10,
      lifeYearsLost: Math.round(lifeYearsLost * 10) / 10,
      healthyLifeExpectancy: Math.round(healthyLifeExpectancy * 10) / 10,
      healthyYearsRatio: Math.round(healthyYearsRatio),
      totalWorkingYears: profile.totalWorkingYears,
      yearsWorked: profile.yearsWorked
    };
  },

  generateRecommendations(profile, healthRisks, financialAnalysis, workLifeAnalysis) {
    const recommendations = [];
    const healthWarnings = [];

    if (profile.sedentaryHours > 6) {
      const neededActivity = profile.sedentaryHours > 8 ? '30' : '15';
      recommendations.push({
        category: '运动',
        priority: 'high',
        title: '减少久坐，增加运动',
        description: `每日需额外${neededActivity}分钟中高强度运动来抵消久坐风险`,
        actionItems: [
          '每45分钟站起来活动5分钟',
          '使用站立办公桌',
          '午休时间散步15分钟',
          `每日目标: ${neededActivity}分钟有氧运动`
        ],
        evidence: 'JAMA Network Open, 2024: 每日15-30分钟可抵消久坐风险'
      });
    }

    if (profile.sleepHours < 7) {
      recommendations.push({
        category: '睡眠',
        priority: 'high',
        title: '改善睡眠质量',
        description: `当前睡眠${profile.sleepHours}h/晚，建议增加至7-9小时`,
        actionItems: [
          '固定作息时间，包括周末',
          '睡前1小时停止使用电子设备',
          '保持卧室黑暗、安静、凉爽',
          '避免睡前摄入咖啡因和酒精'
        ],
        evidence: 'RAND Europe: 睡眠不足致美国年损失$411B; AASM: 成人需7h+'
      });
    }

    if (profile.stressLevel === 'high') {
      recommendations.push({
        category: '压力管理',
        priority: 'high',
        title: '降低工作压力',
        description: '高压工作使心脏病风险增加40%，需积极干预',
        actionItems: [
          '与上司沟通工作量和工作自主权',
          '每天安排10分钟正念冥想',
          '培养工作外的兴趣爱好',
          '考虑职业转型或调整岗位'
        ],
        evidence: 'The Lancet, 2012: Job Strain与CHD风险HR=1.23; PMC 60万人群研究'
      });
    }

    if (profile.eriImbalance) {
      recommendations.push({
        category: '付出-回报平衡',
        priority: 'high',
        title: '改善付出-回报平衡',
        description: '高付出低回报工作模式使心理健康风险增加90%',
        actionItems: [
          '与雇主讨论薪酬公平性和晋升机会',
          '评估当前工作的长期价值',
          '考虑提升技能以换取更好的职业回报',
          '在付出和回报间设定明确的界限'
        ],
        evidence: 'Siegrist ERI模型: ERI与压力相关心理障碍OR=1.9; 与CVD关联r=0.26'
      });
    }

    if (profile.hasOvertime && profile.overtimeHoursPerWeek >= 10) {
      recommendations.push({
        category: '工时管理',
        priority: 'high',
        title: '减少加班',
        description: `每周加班${profile.overtimeHoursPerWeek}h，中风风险增加33%`,
        actionItems: [
          '设定明确的下班时间界限',
          '提高工作时间内效率',
          '与雇主协商弹性工作制',
          '必要时考虑更换工作'
        ],
        evidence: 'The Lancet, 2015: 55h+/周工作中风风险RR=1.33'
      });
    }

    if (healthRisks.estimatedDiseases.length > 0) {
      const topDiseases = healthRisks.estimatedDiseases.slice(0, 3);
      const diseaseNames = topDiseases.map(d => d.name).join('、');
      recommendations.push({
        category: '健康筛查',
        priority: 'medium',
        title: '针对性健康筛查',
        description: `高风险疾病: ${diseaseNames}，建议定期筛查`,
        actionItems: [
          `每年体检重点关注: ${diseaseNames}`,
          '建立个人健康档案',
          '出现早期症状及时就医'
        ],
        evidence: '基于职业流行病学风险数据'
      });
    }

    if (financialAnalysis.healthCostRatio > 20) {
      recommendations.push({
        category: '财务规划',
        priority: 'medium',
        title: '健康支出预警',
        description: `医疗支出占收入的${financialAnalysis.healthCostRatio}%，需重新评估`,
        actionItems: [
          '配置足额医疗保险',
          '建立健康储蓄金',
          '重新评估工作与健康的真实平衡'
        ],
        evidence: '基于个人健康风险评估'
      });
    }

    if (profile.socialIsolation === 'high') {
      recommendations.push({
        category: '社交连接',
        priority: 'high',
        title: '加强社交连接',
        description: '社会孤立是全因死亡率的重要预测因子，需主动建立社交网络',
        actionItems: [
          '每周安排至少2次面对面社交活动',
          '加入兴趣社团或社区活动',
          '与同事建立工作以外的联系',
          '定期与家人朋友保持深度交流'
        ],
        evidence: 'WHO Commission on Social Connection, 2024; CDC: 社会孤立风险堪比每日吸15支烟'
      });
    }

    if (profile.workplaceAirQuality === 'poor') {
      recommendations.push({
        category: '工作环境',
        priority: 'medium',
        title: '改善办公环境',
        description: '空气质量差可导致认知能力下降50%，需关注办公环境',
        actionItems: [
          '定期开窗通风',
          '使用空气净化器',
          '在工位放置绿植',
          '与物业沟通改善中央空调系统维护'
        ],
        evidence: 'ScienceDirect, 2025: IAQ影响工作表现; 认知表现下降达50%'
      });
    }

    const workLifeRatio = workLifeAnalysis.workLifeRatio;
    if (workLifeRatio > 0.35) {
      recommendations.push({
        category: '生活平衡',
        priority: 'high',
        title: '重建生活平衡',
        description: `工作占生命时间${(workLifeRatio * 100).toFixed(0)}%，远超健康水平`,
        actionItems: [
          '重新定义成功的标准',
          '每日保留2小时"自我时间"',
          '安排定期的亲友社交',
          '考虑"降级"生活方式减少经济压力'
        ],
        evidence: 'WHO: 工作生活失衡是心理健康的首要风险因素'
      });
    }

    const philosophicalQuestions = [
      {
        question: '如果生命只剩下10年，你还会继续现在的工作吗？',
        reflection: '这个问题不是为了让你辞职，而是帮你厘清什么才是真正重要的。'
      },
      {
        question: '你用健康换来的钱，够不够把健康买回来？',
        reflection: '医疗账单只是显性成本，疼痛、焦虑、错过的家庭时光是隐性成本。'
      },
      {
        question: '你是在"生活"，还是只是在"为生活做准备"？',
        reflection: '很多人一生都在为未来储蓄，却从未真正活过现在。'
      },
      {
        question: '你的孩子或晚辈看到你的生活方式，他们会向往吗？',
        reflection: '我们传给下一代的不仅是财富，还有对待生命的态度。'
      },
      {
        question: '如果你现在就停止工作，你的人生还剩下什么？',
        reflection: '工作给了你身份和收入，但没有了工作，你是谁？这个答案很重要。'
      }
    ];

    return {
      items: recommendations,
      warnings: healthWarnings,
      philosophicalQuestions,
      summary: this.generateSummary(profile, healthRisks, financialAnalysis)
    };
  },

  generateSummary(profile, healthRisks, financialAnalysis) {
    const totalLifeValue = financialAnalysis.totalLifetimeIncome;
    const totalHealthCost = financialAnalysis.totalMedicalCosts;
    const ratio = totalLifeValue > 0 ? (totalHealthCost / totalLifeValue) * 100 : 0;

    if (ratio > 35) {
      return {
        verdict: 'warning',
        title: '🚨 警示：工作的健康代价过高',
        message: `你一生中将把收入的${Math.round(ratio)}%花在工作导致的疾病上。这不是一份工作，这几乎是一个以健康为代价的"交易"。`
      };
    } else if (ratio > 18) {
      return {
        verdict: 'caution',
        title: '⚠️ 注意：需要重新审视工作平衡',
        message: `工作的医疗代价占收入的${Math.round(ratio)}%，已显著偏高。建议调整工作方式和生活习惯。`
      };
    } else {
      return {
        verdict: 'good',
        title: '✅ 相对平衡：但仍需持续关注',
        message: `健康代价占比${Math.round(ratio)}%，在可控范围内。但预防永远胜于治疗。`
      };
    }
  }
};
