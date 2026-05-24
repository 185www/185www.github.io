# 生命账簿 Vital Ledger

**工作的真实成本，远比你想象的高。**

> 新社会中，很多人为了挣钱拼命工作，却忽略了身体对金钱的隐性消耗。这个工具让人们能够合理地控制生活与工作的平衡，计算一笔账：
> 每天什么时候上班、下班；从几岁工作到几岁停止、现在年龄又是多少；工作中是否存在久坐、熬夜等不良习惯——所有内容整合到一起，综合分析这份工作的投入与回报。

## 核心功能

| 模块 | 说明 |
|------|------|
| 基本信息 | 年龄、职业、性别、工作年限 |
| 工作时间 | 每日作息、通勤、加班、夜班 |
| 薪资与习惯 | 收入、久坐、睡眠、压力、烟酒 |
| 健康风险评估 | 基于职业流行病学的疾病概率预测 |
| 财务分析 | 收入 vs 医疗支出 vs 生产力损失的全面核算 |
| 生命时间线 | 工作占比、寿命损失预估 |
| 行动建议 | 基于科学研究的个性化改善方案 |

## 科学基础

本工具的数据模型基于以下同行评议研究：

- **久坐与死亡率**: JAMA Network Open, 2024 (48万人队列); American Journal of Epidemiology, 2018 (12.7万人队列)
- **工作压力与心血管疾病**: JACC Advances, 2025; PMC 60万人荟萃分析, 2015
- **长工时与中风**: The Lancet, 2015 (WHO/ILO联合数据)
- **睡眠不足的经济影响**: RAND Europe, 2016 (5国研究)
- **职业倦怠经济负担**: American Journal of Preventive Medicine, 2025
- **睡眠与代谢健康**: Stanford Lifestyle Medicine, 2024
- **职业特定疾病风险**: 基于CDC/NIOSH职业健康数据

详细引用见 `research/references.md`

## 使用方式

### 本地打开

直接浏览器打开 `index.html` 即可使用。

### GitHub Pages 部署

```bash
git clone https://github.com/你的用户名/vital-ledger.git
cd vital-ledger
git push origin main
```

在 GitHub 仓库 Settings → Pages 中选择 `main` 分支，根目录部署。

访问 `https://你的用户名.github.io/vital-ledger`

## 项目结构

```
vital-ledger/
├── index.html              # 主入口（完整单页应用）
├── README.md               # 项目文档
├── assets/
│   ├── css/
│   │   └── style.css       # 样式
│   └── js/
│       └── calculator.js   # 核心计算引擎
├── data/
│   ├── health-risks.js     # 健康风险数据（久坐/睡眠/压力等）
│   ├── economic-data.js    # 经济成本数据（医疗费用等）
│   └── diseases.js         # 疾病概率数据（按职业分类）
└── research/
    └── references.md       # 科学研究引用库
```

## 计算方法

### 健康风险评估
- 基于职业类型的基线疾病概率
- 根据个人生活习惯（久坐、睡眠、压力等）调整风险
- 使用相对风险 (RR) 乘数叠加
- 疾病潜伏期和严重程度分级

### 财务分析
- 职业生涯总收入（含工资增长率和折现）
- 养老金估算（替代率45%）
- 医疗支出来自疾病概率 × 年均医疗成本
- 生产力损失（缺勤+出勤效率损失）
- 有效时薪 = (收入 - 健康成本) / 工作时间

### 寿命影响
- 基于流行病学的归因风险计算
- QALY (Quality-Adjusted Life Year) 模型
- 多因素叠加（久坐 + 睡眠 + 压力 + 疾病）

## 免责声明

本工具仅用作个人反思和评估参考，不构成任何医学建议或诊断。所有计算结果为基于群体流行病学数据的统计估算，个体情况可能存在显著差异。如有健康问题，请咨询专业医疗人员。

## License

MIT
