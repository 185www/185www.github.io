# 🍅 Pomotodo V5 — 产品改进全套方案

> 基于《产品经理交接文档 V4》严格执行的四步工作流输出  
> 日期：2026-05-22 | 执行人：AI 产品经理

---

# 第一步：理论调研 — 理论→功能映射表

## 1. 番茄工作法 / 时间箱科学依据

### 1.1 时间箱（Timeboxing）与专注间歇效应
- **核心发现**：2025年范围综述（PMC12532815，32项研究，N=5,270）显示，结构化番茄间隔（24min工作/6min休息）比自主休息降低约20%疲劳、0.5分分心改善、0.4分动机提升；88%的研究报告正向结果。
- **来源**：Cirillo (1980s); PMC scoping review 2025; University of Illinois 2008 micro-break study
- **对本产品的启示**：当前25min/5min默认基本合理，但应支持灵活时长（如45/90min深度工作模式），并在番茄完成时强化正向反馈（"小胜利"感）。
- **优先级**：🔴高
- **实现难度**：⭐容易

### 1.2 警觉衰减与微休息
- **核心发现**：持续注意力任务中，警觉性在20-30分钟后显著下降（vigilance decrement），结构化微休息可恢复注意力资源。2025年元分析确认结构化间歇优于自主休息。
- **来源**：Mackworth (1948); Ariga & Lleras (2015); PMC12532815 2025 review
- **对本产品的启示**：休息时间不应只是"等待倒计时"，应引导用户进行注意力恢复型休息（远眺、深呼吸），而非刷手机。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 1.3 心流中断风险
- **核心发现**：研究也指出，对于已进入心流状态的用户，固定25分钟间隔可能打断心流。Thompson et al. (2021) 发现严格番茄钟可能干扰心流。
- **来源**：Thompson et al. (2021); PMC12292963 2025
- **对本产品的启示**：应提供"弹性番茄"模式——允许用户在心流中延长专注时段，到自然断点再休息。
- **优先级**：🟡中
- **实现难度**：⭐⭐中等

---

## 2. 习惯形成

### 2.1 习惯回路（线索→惯例→奖赏）
- **核心发现**：Duhigg (2012) 提出习惯三要素回路：Cue（线索）→ Routine（惯例）→ Reward（奖赏）。缺少任一环节，习惯无法形成。Graybiel的基底神经节研究证实习惯存储于基底神经节而非前额叶。
- **来源**：Duhigg "The Power of Habit" 2012; Graybiel (2008) basal ganglia habit research
- **对本产品的启示**：当前Pomotodo缺少"线索"触发和"奖赏"机制。应增加：①每日固定时间推送提醒（线索）②完成番茄/任务时的即时正反馈（奖赏）。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 2.2 习惯形成时间线
- **核心发现**：Lally et al. (2010) 发现习惯自动性形成中位数66天（范围18-254天），而非流行的"21天神话"。Surrey大学15年后随访确认此结论。
- **来源**：Lally et al. (2010) European Journal of Social Psychology; UCL/Surrey follow-up
- **对本产品的启示**：习惯追踪应设计为至少66天的连续记录视图，而非7天/30天就结束。用户看到长期趋势才能坚持。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 2.3 实施意向（If-Then Planning）
- **核心发现**：Gollwitzer (1999) 研究表明，制定具体"如果X那么Y"计划的人，执行率提高2-3倍。元分析持续确认此效应。
- **来源**：Gollwitzer (1999); Gollwitzer & Sheeran (2006) meta-analysis
- **对本产品的启示**：每日规划环节应引导用户形成"如果…那么…"语句，如"如果上午9点，那么开始写论文第一章"。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 2.4 习惯堆叠
- **核心发现**：James Clear (2018) 和 BJ Fogg 的研究支持"习惯堆叠"——将新习惯锚定在已有习惯之后，大幅降低启动门槛。
- **来源**：Clear "Atomic Habits" 2018; Fogg "Tiny Habits" 2019
- **对本产品的启示**：引导用户将"开始番茄"锚定在已有行为上（如"吃完午饭后→开始一个番茄"），可在引导流程中植入。
- **优先级**：🟡中
- **实现难度**：⭐容易

---

## 3. 拖延心理学

### 3.1 拖延是情绪调节问题
- **核心发现**：Sirois & Pychyl (2016) 明确提出拖延本质是短期情绪修复策略，而非时间管理问题。人们拖延是因为任务引发负面情绪（焦虑/无聊/挫败），拖延提供即时情绪缓解。
- **来源**：Sirois & Pychyl "Procrastination, Emotion Regulation, and Well-Being" 2016; White Rose review
- **对本产品的启示**：工具应降低任务的情绪门槛——逾期任务不应只用红色标记（增加焦虑），而应提供"低门槛重启"引导（如"只做5分钟"按钮）。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 3.2 时间动机理论（TMT）
- **核心发现**：Steel & König (2006) 提出拖延公式：动机 = (期望 × 价值) / (冲动性 × 延迟)。提高期望（我能做到）和价值（这事重要）、降低冲动性和延迟感，可减少拖延。
- **来源**：Steel (2007) Psychological Bulletin meta-analysis (691 correlations); Steel & König (2006)
- **对本产品的启示**：①提高期望：显示用户过去完成类似任务的记录 ②降低延迟：任务拆解为更小步骤使截止时间更近 ③降低冲动性：专注模式减少干扰。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 3.3 5分钟法则 / 2分钟法则
- **核心发现**：承诺只做5分钟即可大幅降低启动门槛，一旦开始，蔡格尼克效应使人倾向于继续。GTD的2分钟法则（如果2分钟能做完就立即做）也有实证支持。
- **来源**：普遍行为心理学实践; Allen "GTD" (2-minute rule)
- **对本产品的启示**：逾期/长期未开始的任务旁显示"5分钟启动"按钮，点击即开始5分钟短番茄，降低情绪门槛。
- **优先级**：🔴高
- **实现难度**：⭐容易

---

## 4. 目标设置理论

### 4.1 具体且挑战性的目标
- **核心发现**：Locke & Latham 35年研究一致表明：具体且有挑战性的目标比"尽力而为"目标产生更高绩效。目标具体性是绩效最强预测因子之一。
- **来源**：Locke & Latham (1990, 2002, 2006) "Building a Practically Useful Theory of Goal Setting"
- **对本产品的启示**：当前任务只有title和priority，缺少"具体目标"引导。应在添加任务时提示用户明确化目标（如"写论文"→"完成论文引言500字"）。
- **优先级**：🔴高
- **实现难度**：⭐容易

### 4.2 WOOP心理对比法
- **核心发现**：Oettingen (2014) 发现纯积极想象反而降低努力和达成率；WOOP（Wish-Outcome-Obstacle-Plan）通过交替想象积极结果和现实障碍，维持动机能量。多个RCT证实WOOP优于纯正向想象。
- **来源**：Oettingen "Rethinking Positive Thinking" 2014; NYU lab studies
- **对本产品的启示**：每日规划环节应引导用户不只写"今天要做什么"，还要预想障碍和对应计划（如果遇到X，那么我做Y）。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 4.3 反馈与目标承诺
- **核心发现**：Locke & Latham 强调目标设置后必须配以定期反馈，否则目标效应衰减。反馈的及时性比全面性更重要。
- **来源**：Locke & Latham (2006) Current Directions in Psychological Science
- **对本产品的启示**：番茄完成后即时反馈（已完成X/预估Y），每日结束时简要回顾（今日完成率）。
- **优先级**：🟡中
- **实现难度**：⭐容易

---

## 5. 心流状态

### 5.1 挑战-技能平衡
- **核心发现**：Csikszentmihalyi (1990) 确认心流的核心条件是挑战与技能的平衡——任务太难产生焦虑，太简单产生无聊。此外，清晰目标和即时反馈也是心流触发条件。
- **来源**：Csikszentmihalyi "Flow" 1990; iMotions 2025 multimodal flow research
- **对本产品的启示**：番茄钟固定25min对简单任务过长（无聊），对复杂任务过短（被打断）。应基于任务类型/难度建议灵活时长。
- **优先级**：🟡中
- **实现难度**：⭐⭐中等

### 5.2 心流三条件在工具中的实现
- **核心发现**：心流需要三个条件：①挑战-技能平衡 ②清晰目标 ③即时反馈。工具可以系统性地支持后两个条件。
- **来源**：Csikszentmihalyi (1990); Flown 2026 research review
- **对本产品的启示**：①每个番茄开始时显示当前任务的具体目标 ②番茄进行中显示进度反馈 ③完成时给出成就感反馈。
- **优先级**：🟡中
- **实现难度**：⭐容易

---

## 6. 间隔重复与记忆

### 6.1 遗忘曲线与间隔效应
- **核心发现**：Ebbinghaus (1885) 发现遗忘先快后慢；现代复制研究（PMC4492928, 2015）确认此曲线。间隔复习的最佳时间比约为保持间隔的10-20%（一周后的考试→隔1天复习最佳）。
- **来源**：Ebbinghaus (1885); Murre & Dros (2015) PMC4492928 replication
- **对本产品的启示**：对标注了"需复习"的任务，自动计算下次复习时间并到期提醒。纯前端可用简化间隔算法（1天→3天→7天→14天→30天）。
- **优先级**：🔴高（对学生用户价值极大）
- **实现难度**：⭐⭐⭐困难（需新增数据模型和算法）

### 6.2 测试效应
- **核心发现**：Roediger & Karpicke (2006) 证实主动检索练习比重复阅读产生更好的长期记忆保持，即使检索失败也有效。
- **来源**：Roediger & Karpicke (2006) Psychological Science; Karpicke & Roediger (2007) JML
- **对本产品的启示**：复习提醒不应只是"去看笔记"，而应引导主动回忆（如显示问题/提示，隐藏答案）。
- **优先级**：🟡中
- **实现难度**：⭐⭐⭐困难

---

## 7. 行为经济学助推

### 7.1 默认效应
- **核心发现**：Thaler & Sunstein (2008) 证实默认选项是最强力助推之一。人们倾向于接受预设选项，即使改变成本很低。默认效应由至少三个心理机制叠加：暗示推荐、惰性、损失厌恶。
- **来源**：Thaler & Sunstein "Nudge" 2008; PNAS 2022 meta-analysis of nudges
- **对本产品的启示**：新任务默认区域应为"📥收件箱"（已有），但可改进：新任务默认优先级P3（而非P4白），默认预估1个番茄（而非0），暗示用户做计划。
- **优先级**：🟡中
- **实现难度**：⭐容易

### 7.2 损失厌恶
- **核心发现**：Kahneman & Tversky 确立损失厌恶——失去100元的痛苦约为获得100元快乐的2倍。ForestApp利用此原理（离开=树枯死）极其有效。
- **来源**：Kahneman & Tversky (1979) Prospect Theory; Forest app behavioral evidence
- **对本产品的启示**：番茄中途退出时显示"你已经专注了X分钟，退出则此番茄不计入完成"的损失框架提示，而非中性确认。
- **优先级**：🔴高
- **实现难度**：⭐容易

### 7.3 实施意向助推
- **核心发现**：Gollwitzer元分析显示，if-then计划使目标达成率提升2-3倍，这本质上是一种选择架构助推——预先决定减少实时决策负担。
- **来源**：Gollwitzer & Sheeran (2006) meta-analysis; Workmate 2026 review
- **对本产品的启示**：在每日规划中自动为"今日标记"任务生成if-then语句模板。
- **优先级**：🟡中
- **实现难度**：⭐⭐中等

---

## 8. 自我决定理论

### 8.1 自主性
- **核心发现**：Deci & Ryan (2000) 确认自主性（感到行为出于自身选择）是内在动机三大支柱之一。选择感（即使有限选择）也能增强内在动机。Patall et al. (2008) 元分析证实提供选择提升内在动机。
- **来源**：Deci & Ryan (2000); Patall, Cooper & Robinson (2008) meta-analysis
- **对本产品的启示**：工具应提供灵活配置（时长、休息方式、主题），而非强迫唯一正确用法。当前已有自定义时长，但缺少"选择休息方式"等自主性设计。
- **优先级**：🟡中
- **实现难度**：⭐容易

### 8.2 胜任感
- **核心发现**：胜任感（感到自己在进步和掌握）需要可见的进步证据。SDT研究一致表明胜任感满足预测更强的持续动机和更好表现。
- **来源**：Deci & Ryan (2000); Niemiec & Ryan (2009)
- **对本产品的启示**：当前统计只有番茄计数，缺少"进步感"叙事。应增加：本周vs上周对比、个人最佳记录、连续专注天数等胜任感反馈。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 8.3 归属感（纯前端降级）
- **核心发现**：归属感（感到与他人连接）是第三大支柱，但在纯前端无后端场景下难以实现社交比较。
- **来源**：Deci & Ryan (2000)
- **对本产品的启示**：纯前端降级方案——显示"全球Pomotodo用户本周平均完成X个番茄"（硬编码统计数据），创造虚拟社会比较感。或提供"与昨天的自己比较"。
- **优先级**：🟢低
- **实现难度**：⭐容易

---

## 9. 认知负荷理论

### 9.1 工作记忆容量限制
- **核心发现**：Sweller (1988) 确认工作记忆容量约7±2项（Miller），持续时间约20秒。超出容量的外部认知负荷（extraneous load）会损害学习/决策效率。Mayer (2001) 据此发展出12条多媒体设计原则。
- **来源**：Sweller (1988); Miller (1956) 7±2; Mayer (2001) multimedia principles
- **对本产品的启示**：工具本身不应增加认知负荷——减少界面噪音、隐藏非必要选项、用渐进式披露代替一次性展示所有功能。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 9.2 分块效应（Chunking）
- **核心发现**：信息分组（chunking）可将有效工作记忆容量从7±2扩展到更大。项目→子任务层级本质就是chunking。
- **来源**：Miller (1956); Sweller CLT
- **对本产品的启示**：当前项目-子任务层级是好的chunking设计，但缺少引导——用户常把项目当标签用而非容器。应引导"大任务→拆为2-5个子任务"的chunking行为。
- **优先级**：🟡中
- **实现难度**：⭐容易

---

## 10. 蔡格尼克效应

### 10.1 未完成任务的记忆优势
- **核心发现**：Zeigarnik (1927) 发现未完成任务比已完成任务更容易被记住。2025年元分析（Nature Humanities & Social Sciences Communications）发现记忆优势难以复制，但Ovsiankina效应（恢复未完成任务的倾向）稳定可复现。
- **来源**：Zeigarnik (1927); Ovsiankina (1928); 2025 Nature meta-analysis
- **对本产品的启示**：①利用Ovsiankina效应：中断的番茄/未完成任务应突出显示，驱动用户回到它们 ②防止Zeigarnik负面影响：过多的未完成任务造成认知负担，应帮助用户"关闭"不重要的任务。
- **优先级**：🟡中
- **实现难度**：⭐容易

### 10.2 未完成任务的心理张力管理
- **核心发现**：适当的未完成任务张力可以驱动行动，但过多的开放循环（open loops）导致焦虑。GTD的"收件箱清零"就是减少开放循环。
- **来源**：Allen "GTD"; Zeigarnik research; Baumeister on mental clutter
- **对本产品的启示**：当收件箱积压超过N项时，提示用户"清理收件箱，释放心理空间"。显示开放循环计数。
- **优先级**：🟡中
- **实现难度**：⭐容易

---

## 11. 决策疲劳

### 11.1 意志力资源有限
- **核心发现**：Baumeister的决策疲劳研究表明，连续决策消耗自我控制资源，导致后续决策质量下降。Danziger (2011) 保释法官研究显示，随决策次数增加，批准率从65%降至近0（饭前恢复）。虽然"自我控制资源"模型存在复制争议（2016年23实验室复制失败），但决策质量下降现象本身已被确认。
- **来源**：Baumeister et al. (1998); Danziger et al. (2011); 2016 replication debate
- **对本产品的启示**：GTD的"收件箱清零"减少日常小决策。工具应减少用户需要做的决策数：智能默认值、自动归类建议、"今日三件事"聚焦。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 11.2 选择悖论
- **核心发现**：Schwartz (2004) 发现选择过多导致决策瘫痪、满意度降低和后悔增加。满意者（satisficers）比最大化者（maximizers）更快乐。
- **来源**：Schwartz "The Paradox of Choice" 2004
- **对本产品的启示**：任务列表不应一次性展示所有任务。默认视图只显示"今日任务"或"下一步行动"（有限选择），完整列表需主动切换。
- **优先级**：🔴高
- **实现难度**：⭐容易

---

## 12. 休息科学

### 12.1 注意恢复理论（ART）
- **核心发现**：Kaplan (1995) 注意恢复理论确认，定向注意力是有限资源，特定环境（自然、软迷恋/fascination）可恢复注意力。并非所有休息等价——刷手机不恢复注意力，自然场景可以。
- **来源**：Kaplan (1995) Journal of Environmental Psychology; Kaplan & Kaplan (1989)
- **对本产品的启示**：休息时间不应只是空白倒计时，应提供恢复性休息引导：深呼吸、远眺、起身活动，而非默认刷手机。
- **优先级**：🔴高
- **实现难度**：⭐⭐中等

### 12.2 超日节律（Ultradian Rhythm）
- **核心发现**：Kleitman 发现人体存在约90-120分钟的超日节律——大脑在清醒时也循环经历高/低警觉期。与90分钟节律同步工作（90分钟深度工作→20分钟恢复）比固定25分钟番茄更符合生理节律。
- **来源**：Kleitman (1961) BRAC; FocusBreaks 2025 ultradian review
- **对本产品的启示**：提供"深度工作模式"（45/90分钟长番茄），作为25分钟标准模式的补充选项。
- **优先级**：🟡中
- **实现难度**：⭐容易

### 12.3 微休息效力
- **核心发现**：研究表明短暂休息（even 30秒-5分钟）就能显著恢复注意力，但休息内容很关键——身体活动/远眺 > 社交媒体/无目的浏览。
- **来源**：Ariga & Lleras (2015); micro-break literature
- **对本产品的启示**：短休息（5分钟）提供"微休息菜单"：30秒深呼吸 → 2分钟站立拉伸 → 剩余时间自由休息。
- **优先级**：🟡中
- **实现难度**：⭐⭐中等

---

# 第二步：差距分析 — 差距分析矩阵

| # | 理论要求 | 现状 | 差距描述 | 影响 | 建议功能 |
|---|---------|------|---------|------|---------|
| G1 | 习惯回路三要素：线索→惯例→奖赏 | ⚠️部分 | 有惯例（番茄钟），但缺少外部线索触发和完成奖赏 | 🔴高 | 每日提醒推送 + 完成即时正反馈 |
| G2 | 习惯形成需要66天以上连续追踪 | ❌缺失 | 无习惯追踪/连续打卡功能，统计只看7天 | 🔴高 | 习惯连续打卡日历 + 长期趋势图 |
| G3 | 实施意向：if-then计划使执行率2-3倍 | ❌缺失 | 无每日规划环节，用户打开就看到列表 | 🔴高 | 每日启动规划流程（WOOP+if-then） |
| G4 | 拖延是情绪调节问题，需降低情绪门槛 | ⚠️部分 | 逾期任务只有红色标记（增加焦虑） | 🔴高 | 逾期任务"5分钟启动"按钮 + 情绪友好文案 |
| G5 | TMT：提高期望感（我能做到） | ❌缺失 | 无法看到自己过去的成功记录 | 🔴高 | 任务完成时记录关联，显示"上次类似任务你完成了" |
| G6 | 5分钟/2分钟法则降低启动门槛 | ❌缺失 | 番茄钟最短5分钟，但无"5分钟试一下"引导 | 🔴高 | 逾期/拖延任务旁"5分钟启动"按钮 |
| G7 | 具体且挑战性的目标 | ⚠️部分 | 任务title自由输入，无具体化引导 | 🟡中 | 添加任务时提示"目标具体化"建议 |
| G8 | WOOP：预想障碍+对应计划 | ❌缺失 | 无障碍预想机制 | 🔴高 | 每日规划中嵌入WOOP步骤 |
| G9 | 心流需要挑战-技能平衡，灵活时长 | ⚠️部分 | 有自定义时长但无场景引导 | 🟡中 | 按任务类型推荐时长（浅/深工作） |
| G10 | 心流三条件：清晰目标+即时反馈 | ⚠️部分 | 番茄进行中无目标显示，完成反馈弱 | 🟡中 | 番茄进行中显示任务目标，完成时增强反馈 |
| G11 | 间隔重复：遗忘曲线复习提醒 | ❌缺失 | 无复习提醒/间隔重复功能 | 🔴高 | "需复习"标签 + 简化SM2间隔提醒 |
| G12 | 默认效应：智能默认值减少决策 | ⚠️部分 | 新任务默认P4白优先级、0预估番茄 | 🟡中 | 改善默认值（P3/1个预估番茄） |
| G13 | 损失厌恶：退出番茄的损失框架 | ❌缺失 | 退出番茄确认是中性文案 | 🔴高 | 损失框架退出确认"你已专注X分钟，退出不计入" |
| G14 | 胜任感：可见的进步证据 | ❌缺失 | 统计只有计数，无进步叙事 | 🔴高 | 本周vs上周对比 + 个人最佳 + 连续天数 |
| G15 | 认知负荷最小化 | ⚠️部分 | 界面信息密度高，新用户上手成本大 | 🔴高 | 渐进式披露 + 新用户方法论引导 |
| G16 | 分块引导：大任务→子任务 | ⚠️部分 | 有子任务功能但无拆解引导 | 🟡中 | 项目/大任务自动提示"是否拆解为子任务？" |
| G17 | Ovsiankina效应：驱动恢复中断任务 | ⚠️部分 | 未完成番茄无突出显示 | 🟡中 | 中断的番茄在次日打开时突出提示"继续未完成" |
| G18 | 开放循环管理 | ⚠️部分 | 收件箱可无限积压无干预 | 🟡中 | 收件箱积压>N时提示清理 |
| G19 | 决策疲劳：减少日常决策数 | ❌缺失 | 用户每天手动决定做什么 | 🔴高 | "今日三件事"聚焦 + 智能排序 |
| G20 | 选择悖论：限制同时显示的选择 | ⚠️部分 | 默认显示所有任务 | 🔴高 | 默认视图→今日/下一步，全列表需切换 |
| G21 | ART：恢复性休息引导 | ❌缺失 | 休息时间无任何引导 | 🔴高 | 休息引导：深呼吸/远眺/起身，非刷手机 |
| G22 | 超日节律：90分钟深度工作模式 | ❌缺失 | 只有25分钟默认 | 🟡中 | 增加"深度工作"预设（45/90分钟） |
| G23 | 反馈及时性比全面性更重要 | ⚠️部分 | 番茄完成有音效但无量化反馈 | 🟡中 | 完成时显示"今日第X个番茄/预估进度" |
| G24 | 归属感降级：虚拟社会比较 | ❌缺失 | 完全没有对比参照 | 🟢低 | 硬编码"全球用户平均"对比线 |
| G25 | 习惯堆叠：将新习惯锚定已有行为 | ❌缺失 | 引导流程只讲工具用法不讲方法论 | 🟡中 | 引导中植入习惯堆叠建议 |

---

# 第三步：产品方案 — Pomotodo V5 改进方案

> 优先级排序原则：用户价值×实现可行性 > 理论支撑强度 > 最低viable改动 > 双用户群覆盖

---

### P-01: 每日启动规划（Daily Planning Ritual）
- **对应理论**：实施意向(Gollwitzer)、WOOP(Oettingen)、决策疲劳(Baumeister)
- **对应差距**：G3, G8, G19
- **用户故事**：作为学生/打工人，我想每天打开应用时有一个3分钟的规划仪式，帮我确定今天最重要的3件事并预想障碍，以便我不需要整天做决策就能知道该做什么。
- **功能描述**：
  - 每天首次打开应用（或手动触发），弹出"今日规划"引导卡片
  - Step 1：从收件箱/下一步中选择"今日三件事"（最多3个，强制限制选择）
  - Step 2：为每件事写一个if-then语句（模板："如果[时间/情境]，那么我就[行动]"）
  - Step 3：预想最大障碍 + 对应计划（WOOP简化版）
  - 完成后进入工作台，今日三件事置顶显示
  - 数据存储：`S.dailyPlan = { date, top3: [{taskId, ifThen, obstacle, plan}], completed }`
- **预期效果**：减少每日启动决策时间50%+，提高"最重要的事"完成率
- **优先级**：P0(必须做)
- **实现复杂度**：⭐⭐
- **技术约束**：纯前端可完全实现，数据存localStorage，每日一个plan对象约500字节

---

### P-02: 习惯连续打卡（Streak Tracking）
- **对应理论**：习惯回路(Duhigg)、习惯形成66天(Lally)、损失厌恶(Kahneman)
- **对应差距**：G1, G2, G14
- **用户故事**：作为学生/打工人，我想看到自己连续专注了多少天，以便我有动力不中断链锁，形成稳固习惯。
- **功能描述**：
  - 在统计Tab增加"习惯打卡"子视图
  - 显示连续天数（streak）、最长记录、总专注天数
  - 日历热力图：类似GitHub贡献图，每天一格，颜色深浅=番茄数
  - 断链提示："你的连续专注已中断，今天重新开始吧！"
  - 数据存储：基于已有sessions数据计算，无需额外存储（streak可缓存于`S.streakCache = { currentStreak, bestStreak, lastActiveDate }`）
- **预期效果**：基于损失厌恶，用户为不中断streak而每日启动至少1个番茄
- **优先级**：P0(必须做)
- **实现复杂度**：⭐⭐
- **技术约束**：纯前端从sessions计算，缓存streak值避免重复计算

---

### P-03: 休息引导（Rest Guidance）
- **对应理论**：注意恢复理论(Kaplan)、超日节律(Kleitman)、微休息效力
- **对应差距**：G21, G22
- **用户故事**：作为学生/打工人，我想在休息时间被引导做恢复性活动（而非刷手机），以便我下一个番茄的专注力更高。
- **功能描述**：
  - 休息开始时，工作台区域显示休息引导内容（替代空白倒计时）
  - 3种休息模式供选择（或随机推荐）：
    - 🧘 深呼吸（30秒引导动画 + 剩余自由休息）
    - 👀 远眺放松（"看窗外20秒"提示 + 眼球运动引导）
    - 🏃 起身活动（简易拉伸动作图示，2-3个动作）
  - 设置中增加"休息引导"开关和模式偏好
  - 长休息（15min）提供更完整的恢复建议
  - 数据存储：`S.settings.restGuidance = { enabled: true, mode: 'random' }`
- **预期效果**：减少"休息刷手机"行为，提高下一番茄专注度自我评分
- **优先级**：P0(必须做)
- **实现复杂度**：⭐⭐
- **技术约束**：纯CSS动画+JS倒计时，无需外部资源。休息引导内容硬编码为中文文案

---

### P-04: 逾期任务"5分钟启动"（Anti-Procrastination Button）
- **对应理论**：拖延情绪调节(Sirois)、5分钟法则、TMT(Steel)
- **对应差距**：G4, G6
- **用户故事**：作为学生/打工人，我想对逾期或长期未开始的任务看到"只做5分钟"的按钮，以便我降低启动情绪门槛，一旦开始就更容易继续。
- **功能描述**：
  - 逾期任务（dueDatetime < now && !completed）和3天以上未更新的收件箱任务，显示"🚀 5分钟启动"按钮
  - 点击后启动5分钟短番茄，自动关联该任务
  - 5分钟结束时弹出选择："继续专注？(+20min)" 或 "已进入状态，标记为进行中"
  - 按钮文案用损失框架："已逾期3天，5分钟就能开始"
  - 不增加新数据字段，复用现有session关联和番茄计时
- **预期效果**：逾期任务重新启动率提升30%+
- **优先级**：P0(必须做)
- **实现复杂度**：⭐
- **技术约束**：复用现有计时器和session，仅增加UI判断逻辑

---

### P-05: 番茄退出损失框架确认（Loss-Framed Quit Confirmation）
- **对应理论**：损失厌恶(Kahneman & Tversky)
- **对应差距**：G13
- **用户故事**：作为学生/打工人，我想在想要放弃当前番茄时看到已投入时间的损失提醒，以便我更倾向坚持完成而非轻易退出。
- **功能描述**：
  - 点击重置/放弃番茄时，确认弹窗改用损失框架文案
  - 当前文案（假设）："确定要重置吗？" → 改为："你已经专注了18分钟，放弃则这18分钟不计入今日完成 ⚠️"
  - 番茄进度>50%时，额外显示"还剩7分钟就能完成一个番茄！"
  - 按钮措辞：[继续专注]（主按钮/高亮） + [放弃番茄]（次按钮/灰色）
  - 仅修改文案和按钮样式，不增加新数据
- **预期效果**：番茄放弃率降低15-25%
- **优先级**：P0(必须做)
- **实现复杂度**：⭐
- **技术约束**：仅修改confirm/toast文案，零数据模型变更

---

### P-06: 胜任感进步仪表盘（Competence Dashboard）
- **对应理论**：自我决定理论-胜任感(Deci & Ryan)、目标设置反馈(Locke & Latham)
- **对应差距**：G14, G23
- **用户故事**：作为学生/打工人，我想在统计页面看到自己"本周比上周进步了"的叙事，以便我感到自己在变得更强而不是只是机械地计数。
- **功能描述**：
  - 统计Tab顶部增加"进步概览"卡片：
    - 本周 vs 上周番茄数对比（↑12% 或 ↓5%）
    - 个人最佳记录（单日最多番茄、最长连续天数）
    - "你已累计专注 XXX 小时，相当于 Y 部电影"
  - 每日最后完成番茄时，Toast显示"今日第X个番茄！🏆"
  - 数据来源：从sessions计算，`S.personalBest = { maxDailyPomodoros, longestStreak, totalHours }`缓存
- **预期效果**：增强胜任感→维持长期使用动机
- **优先级**：P0(必须做)
- **实现复杂度**：⭐⭐
- **技术约束**：纯前端计算，缓存personalBest避免重复计算

---

### P-07: 智能默认值与任务输入增强
- **对应理论**：默认效应(Thaler)、认知负荷(Sweller)、选择悖论(Schwartz)
- **对应差距**：G12, G15, G20
- **用户故事**：作为学生/打工人，我想添加任务时减少需要做的决定数量，以便我把精力放在执行而非计划上。
- **功能描述**：
  - 新任务默认优先级从P4(白)改为P3(黄)——暗示"这是普通任务"
  - 新任务默认预估番茄从0改为1——暗示"这事至少需要1个番茄"
  - 快捷输入栏默认展开（而非需点击⚙），降低发现成本
  - 任务列表默认视图改为"今日"（而非"全部"），减少选择悖论
  - 收件箱>10项时，顶部显示"🧹 收件箱有N项待处理，花2分钟清理？"
- **预期效果**：新用户任务添加决策时间降低40%
- **优先级**：P1(应该做)
- **实现复杂度**：⭐
- **技术约束**：仅修改默认值和过滤逻辑，零数据模型变更

---

### P-08: 新用户方法论引导（Onboarding V2）
- **对应理论**：认知负荷(Sweller)、习惯堆叠(Clear/Fogg)、自我决定理论-自主性
- **对应差距**：G15, G25
- **用户故事**：作为新用户，我想在首次使用时不仅了解按钮在哪，更知道"怎么用这个工具才能真正提高效率"，以便我不会空着应用不知道干什么。
- **功能描述**：
  - 4步工具介绍 → 改为 6步方法论引导：
    1. 欢迎页：理念"不只是番茄钟，是你的效率操作系统"
    2. 收件箱清零：讲解GTD流程，引导把脑中任务倒入收件箱
    3. 今日三件事：讲解"选择悖论"和"今日聚焦"
    4. 第一个番茄：引导启动第一个25分钟番茄
    5. 习惯堆叠：建议"每天[固定时间]打开Pomotodo做规划"
    6. 休息也是工作：讲解休息引导功能
  - 使用`S.onboardingV2Completed`标记完成状态
  - 渐进式披露：首次使用时隐藏高级功能（项目、日历详情），逐步解锁
- **预期效果**：新用户7天留存率提升25%
- **优先级**：P1(应该做)
- **实现复杂度**：⭐⭐
- **技术约束**：纯前端，引导步骤内容硬编码中文

---

### P-09: 任务拆解引导（Chunking Prompt）
- **对应理论**：分块效应(Miller)、目标设置具体性(Locke & Latham)、WOOP(Oettingen)
- **对应差距**：G7, G16
- **用户故事**：作为学生/打工人，我想在创建一个大任务时被引导拆解为子任务，以便我不会面对一个庞大模糊的任务而拖延。
- **功能描述**：
  - 添加/编辑任务时，如果标题包含"写/做/完成/准备/复习"等动词+大目标，弹出"建议拆解"提示
  - 项目区域增加"项目健康度"：0个子任务的项目显示⚠️"这个项目还没有可执行步骤"
  - 项目详情面板顶部增加引导："一个好项目 = 2-5个可在1个番茄内完成的子任务"
  - 不增加新数据字段，仅增加UI提示逻辑
- **预期效果**：项目拆解率提升→减少"大任务拖延"
- **优先级**：P1(应该做)
- **实现复杂度**：⭐
- **技术约束**：仅UI提示逻辑，关键词匹配硬编码

---

### P-10: 深度工作模式（Deep Work Preset）
- **对应理论**：超日节律(Kleitman)、心流挑战-技能平衡(Csikszentmihalyi)
- **对应差距**：G9, G22
- **用户故事**：作为打工人/考研学生，我想有时用45分钟或90分钟的深度专注时段，以便我进入心流而不被打断。
- **功能描述**：
  - 计时器模式选择增加"🧠 深度工作"预设：45min专注/10min休息
  - 设置中增加"自定义预设"功能：用户可保存多个时长预设（如"考研阅读60min"）
  - 深度工作模式下，休息引导自动切换为更完整的恢复建议
  - 数据存储：`S.settings.workPresets = [{ name, workDuration, breakDuration }]`
- **预期效果**：满足深度工作需求，减少"25分钟太短"的用户流失
- **优先级**：P1(应该做)
- **实现复杂度**：⭐
- **技术约束**：复用现有计时逻辑，仅增加预设配置

---

### P-11: 复习提醒（Spaced Repetition Reminder）
- **对应理论**：遗忘曲线(Ebbinghaus)、间隔效应、测试效应(Roediger)
- **对应差距**：G11
- **用户故事**：作为学生，我想对需要记忆的任务/笔记设定复习提醒，以便我在遗忘临界点被提醒复习，而不是考前临时抱佛脚。
- **功能描述**：
  - 任务详情面板增加"🔄 需复习"开关
  - 开启后，自动按简化间隔算法计算复习日期：1天→3天→7天→14天→30天
  - 复习日到期时，任务在列表中显示"📖 今日复习"标签
  - 首次复习时显示主动回忆提示："先试着回忆，再查看笔记"
  - 数据存储：`task.reviewSchedule = { enabled, nextReviewDate, interval, reviewCount }`
  - 过滤器增加"待复习"选项
- **预期效果**：对学生用户核心价值，提高长期记忆保持率
- **优先级**：P1(应该做)
- **实现复杂度**：⭐⭐⭐
- **技术约束**：需新增task数据字段和间隔计算逻辑，需数据迁移（loadState中兼容旧task无reviewSchedule字段）

---

### P-12: 番茄进行中目标显示（In-Pomodoro Goal Display）
- **对应理论**：心流清晰目标(Csikszentmihalyi)、目标设置具体性(Locke & Latham)
- **对应差距**：G10
- **用户故事**：作为用户，我想番茄钟进行中看到当前任务的具体目标，以便我不走神、保持专注。
- **功能描述**：
  - 番茄计时器下方显示当前关联任务的标题
  - 如果任务有notes，截取第一行作为"本次目标"显示
  - 无关联任务时显示"自由专注——想好这25分钟的目标"
  - 完成时Toast："✅ [任务标题] 完成一个番茄！今日第X个"
- **预期效果**：减少番茄中走神率
- **优先级**：P2(可以做)
- **实现复杂度**：⭐
- **技术约束**：复用现有taskId关联逻辑，仅增加显示

---

### P-13: 收件箱清零助推（Inbox Zero Nudge）
- **对应理论**：蔡格尼克效应、决策疲劳(Baumeister)、GTD收件箱清零
- **对应差距**：G18
- **用户故事**：作为用户，我想被提醒清理积压的收件箱，以便未处理的任务不造成心理负担。
- **功能描述**：
  - 收件箱项目数>5时，显示横幅："📥 收件箱有N项待处理，花2分钟清零？"
  - 点击进入"快速清零模式"：逐个显示任务，3个操作按钮：①→下一步 ②📁→项目 ③🗑️删除
  - 收件箱=0时显示"✨ 收件箱清零！大脑空间已释放"
  - 不增加新数据字段
- **预期效果**：减少收件箱积压，降低开放循环心理负担
- **优先级**：P2(可以做)
- **实现复杂度**：⭐
- **技术约束**：纯UI逻辑，复用现有任务移动功能

---

### P-14: 每日回顾（Daily Review）
- **对应理论**：目标设置反馈(Locke & Latham)、自我决定理论-胜任感、WOOP复盘
- **对应差距**：G8, G14, G23
- **用户故事**：作为用户，我想在每天结束时看到简短回顾，以便我知道自己做到了什么、没做到什么，明天可以调整。
- **功能描述**：
  - 每天22:00后（或用户自定义时间），打开应用弹出"今日回顾"卡片
  - 显示：今日完成番茄数/预估对比、今日三件事完成率、streak状态
  - 一个简短反思输入："今天最大的收获是___"
  - 回顾数据存入`S.dailyReviews = [{ date, reflection, completionRate }]`（限最近30天）
  - 可在设置中关闭
- **预期效果**：增强反思习惯→行为调整→长期进步
- **优先级**：P2(可以做)
- **实现复杂度**：⭐⭐
- **技术约束**：需新增dailyReviews数据字段，约30天×100字节=3KB

---

### P-15: 预估vs实际对比（Estimate vs Actual）
- **对应理论**：目标设置反馈、胜任感、规划谬误(Kahneman)
- **对应差距**：G5, G14, G23
- **用户故事**：作为用户，我想看到任务预估番茄数和实际完成数的对比，以便我逐渐校准自己的时间预估能力。
- **功能描述**：
  - 任务详情面板显示：预估X / 实际Y 个番茄
  - 完成任务时，如果实际≠预估，显示对比条
  - 统计Tab增加"预估准确率"指标：最近30天任务的预估偏差
  - 不增加新数据字段（已有estimatedPomodoros和pomodorosCompleted）
- **预期效果**：帮助用户校准规划谬误，提高未来预估准确度
- **优先级**：P2(可以做)
- **实现复杂度**：⭐⭐
- **技术约束**：已有数据，仅需计算和UI展示

---

# 第四步：前端实施技术规格（P0级功能）

---

## 实施规格：P-01 每日启动规划

**修改文件**：app.js / index.html / style.css

**新增数据字段**：
```javascript
// 在 S 对象中新增
S.dailyPlan = {
  date: '',           // 'YYYY-MM-DD' 当天日期
  top3: [{            // 今日三件事
    taskId: '',       // 关联任务ID
    ifThen: '',       // if-then语句，如"如果9:00，那么开始写论文引言"
    obstacle: '',     // 预想障碍
    plan: ''          // 障碍应对计划
  }, ...],            // 最多3项
  completed: false    // 今日规划是否已完成
}
```

**新增DOM元素**：
```html
<!-- index.html: 在 view-work 内部、panel-timer之前插入 -->
<div class="panel panel-daily-plan" id="panel-daily-plan" style="display:none">
  <div class="daily-plan-header">
    <h2>📋 今日规划</h2>
    <span class="daily-plan-date" id="daily-plan-date"></span>
    <button class="btn-skip" id="btn-skip-plan">跳过</button>
  </div>
  <div class="daily-plan-steps" id="daily-plan-steps">
    <!-- Step 1: 选三件事 -->
    <div class="plan-step" id="plan-step-1">
      <h3>Step 1: 选择今日最重要的3件事</h3>
      <div class="plan-task-picker" id="plan-task-picker"></div>
      <div class="plan-selected" id="plan-selected-top3"></div>
    </div>
    <!-- Step 2: if-then -->
    <div class="plan-step" id="plan-step-2" style="display:none">
      <h3>Step 2: 制定执行计划</h3>
      <div class="if-then-forms" id="if-then-forms"></div>
    </div>
    <!-- Step 3: WOOP障碍 -->
    <div class="plan-step" id="plan-step-3" style="display:none">
      <h3>Step 3: 预想障碍</h3>
      <div class="obstacle-forms" id="obstacle-forms"></div>
    </div>
  </div>
  <div class="daily-plan-actions">
    <button class="btn-prev" id="btn-plan-prev" style="display:none">上一步</button>
    <button class="btn-next" id="btn-plan-next">下一步</button>
    <button class="btn-finish" id="btn-plan-finish" style="display:none">开始今天！</button>
  </div>
</div>
```
JS引用：`panel-daily-plan`, `daily-plan-date`, `btn-skip-plan`, `plan-step-1/2/3`, `plan-task-picker`, `plan-selected-top3`, `if-then-forms`, `obstacle-forms`, `btn-plan-prev/next/finish`

**新增/修改函数**：
```
checkDailyPlan()        // 每次打开app时检查：是否今天、是否已完成。调用位置：DOMContentLoaded
showDailyPlan()         // 显示规划面板，初始化3步流程
renderPlanTaskPicker()  // 渲染任务选择列表（收件箱+下一步+今日标记的任务）
selectPlanTask(taskId)  // 选择/取消选择任务到top3
renderIfThenForms()     // 渲染Step2的if-then输入表单
renderObstacleForms()   // 渲染Step3的障碍输入表单
nextPlanStep()          // 下一步
prevPlanStep()          // 上一步
finishDailyPlan()       // 保存dailyPlan到S，标记completed=true，隐藏面板
skipDailyPlan()         // 跳过（不保存），隐藏面板
saveDailyPlan()         // 持久化S.dailyPlan → localStorage
renderTop3Banner()      // 工作台顶部显示"今日三件事"横幅
```

**数据迁移**：在`loadState()`中添加：
```javascript
if (!S.dailyPlan) S.dailyPlan = { date: '', top3: [], completed: false };
```

**缓存版本升级**：sw.js `CACHE = 'pomotodo-v20-daily-plan'`, index.html `app.js?v=20`

**验证方法**：
1. 清空localStorage或新开隐私窗口
2. 打开应用，应看到"今日规划"3步引导
3. 选择3个任务，填写if-then和障碍
4. 点击"开始今天"，工作台应显示今日三件事横幅
5. 刷新页面，不应再次弹出规划（completed=true）
6. 次日打开，应再次弹出规划

---

## 实施规格：P-02 习惯连续打卡

**修改文件**：app.js / index.html / style.css

**新增数据字段**：
```javascript
S.streakCache = {
  currentStreak: 0,     // 当前连续天数
  bestStreak: 0,        // 最长连续天数
  lastActiveDate: '',   // 'YYYY-MM-DD' 最后有番茄的日期
  totalActiveDays: 0,   // 总专注天数
  personalBest: {
    maxDailyPomodoros: 0, // 单日最多番茄
    maxDailyDate: '',     // 创纪录日期
  }
}
```

**新增DOM元素**：
```html
<!-- index.html: 在 stats-view 内部，现有统计卡片之后 -->
<div class="stats-streak" id="stats-streak">
  <div class="streak-hero" id="streak-hero">
    <span class="streak-number" id="streak-number">0</span>
    <span class="streak-label">天连续专注</span>
  </div>
  <div class="streak-meta">
    <div class="streak-best">🏆 最长记录: <span id="streak-best">0</span>天</div>
    <div class="streak-total">📊 累计专注: <span id="streak-total">0</span>天</div>
  </div>
  <div class="streak-heatmap" id="streak-heatmap">
    <!-- JS动态生成：最近12周的热力图格子 -->
  </div>
</div>
```
JS引用：`stats-streak`, `streak-number`, `streak-best`, `streak-total`, `streak-heatmap`

**新增/修改函数**：
```
calculateStreak()        // 遍历sessions计算连续天数，更新streakCache
renderStreakSection()    // 渲染习惯打卡区域（调用位置：renderStats内部）
renderStreakHeatmap()    // 渲染12周热力图（7行×12列）
updateStreakOnComplete() // 番茄完成时更新streak（调用位置：onTimerComplete内部）
```

**数据迁移**：在`loadState()`中添加：
```javascript
if (!S.streakCache) S.streakCache = { currentStreak: 0, bestStreak: 0, lastActiveDate: '', totalActiveDays: 0, personalBest: { maxDailyPomodoros: 0, maxDailyDate: '' } };
```

**缓存版本升级**：同P-01版本号（若同步发布则共用v20）

**验证方法**：
1. 完成至少1个番茄
2. 打开统计Tab，应显示streak=1天
3. 次日再完成1个番茄，streak应=2
4. 跳过一天后完成番茄，streak应重置为1
5. 热力图应显示对应日期的颜色深浅

---

## 实施规格：P-03 休息引导

**修改文件**：app.js / index.html / style.css

**新增数据字段**：
```javascript
// 在 S.settings 中新增
S.settings.restGuidance = {
  enabled: true,        // 是否开启休息引导
  mode: 'random'        // 'random' | 'breathe' | 'look' | 'stretch'
}
```

**新增DOM元素**：
```html
<!-- index.html: 在 panel-timer 内部，timer显示区域之后 -->
<div class="rest-guidance" id="rest-guidance" style="display:none">
  <div class="rest-guidance-content" id="rest-guidance-content">
    <!-- JS动态填充3种引导内容之一 -->
  </div>
  <div class="rest-guidance-timer" id="rest-guidance-timer"></div>
</div>
```
JS引用：`rest-guidance`, `rest-guidance-content`, `rest-guidance-timer`

**新增/修改函数**：
```
startRestGuidance()      // 休息开始时调用，随机选择或按偏好显示引导
renderBreatheGuide()     // 🧘 深呼吸引导：吸气4秒→屏息4秒→呼气6秒动画
renderLookGuide()        // 👀 远眺引导："看20英尺外20秒"
renderStretchGuide()     // 🏃 拉伸引导：3个简易动作图示（CSS绘制）
stopRestGuidance()       // 休息结束/用户切走时清理
```

**调用位置**：`advanceAfterComplete()` 中，当切换到休息模式时调用 `startRestGuidance()`

**数据迁移**：在`loadState()` → `readSettings()` 中添加：
```javascript
if (!S.settings.restGuidance) S.settings.restGuidance = { enabled: true, mode: 'random' };
```

**缓存版本升级**：同上

**验证方法**：
1. 完成一个番茄钟
2. 休息开始时，工作台区域应显示休息引导（而非空白倒计时）
3. 点击3种模式标签可切换
4. 设置中可关闭/选择偏好模式
5. 关闭后休息应恢复为纯倒计时

---

## 实施规格：P-04 逾期任务"5分钟启动"

**修改文件**：app.js / style.css

**新增数据字段**：无（复用现有session和task模型）

**新增DOM元素**：无独立HTML元素，在`renderTasks()`中条件性插入按钮

**新增/修改函数**：
```
isTaskProcrastinated(task)  // 判断是否逾期/拖延：dueDatetime<now且!completed，或createdAt超过3天且area仍为inbox
renderQuickStartBtn(task)   // 在拖延任务项旁渲染"🚀 5分钟启动"按钮
startQuickPomodoro(taskId)  // 启动5分钟短番茄并关联task，调用startTimer()前设置时长为5
onQuickPomodoroComplete()   // 5分钟完成时弹出"继续专注(+20min)"或"标记进行中"选择
```

**调用位置**：
- `renderTasks()` 中，对每个任务调用 `isTaskProcrastinated()`，如为true则渲染按钮
- `onTimerComplete()` 中，如session是quickStart类型，调用 `onQuickPomodoroComplete()`

**CSS新增**：
```css
.quick-start-btn { /* 🚀5分钟启动按钮样式 */ }
```

**缓存版本升级**：同上

**验证方法**：
1. 创建一个任务，设置截止时间为过去时间
2. 任务列表中该任务旁应显示"🚀 5分钟启动"按钮
3. 点击按钮，计时器应启动5分钟番茄
4. 5分钟完成，应弹出继续/标记选择
5. 点击"继续"，应追加20分钟

---

## 实施规格：P-05 番茄退出损失框架确认

**修改文件**：app.js

**新增数据字段**：无

**新增DOM元素**：无（复用现有confirm/toast机制）

**新增/修改函数**：
```
// 修改现有重置/放弃逻辑中的确认弹窗
confirmResetPomodoro()   // 替换原有的重置确认逻辑
// 核心变更：计算已专注分钟数，组装损失框架文案
// "你已经专注了{elapsed}分钟，放弃则这{elapsed}分钟不计入今日完成 ⚠️"
// 番茄进度>50%时追加"还剩{remaining}分钟就能完成一个番茄！"
// 按钮顺序：[继续专注](primary) + [放弃番茄](secondary/灰色)
```

**调用位置**：重置按钮的click handler中，替换原有confirm逻辑

**缓存版本升级**：同上

**验证方法**：
1. 启动一个番茄钟
2. 等待1-2分钟后点击重置
3. 应看到损失框架确认文案（非中性确认）
4. 主按钮应为"继续专注"（高亮），次按钮为"放弃番茄"（灰色）
5. 进度>50%时应有额外鼓励文案

---

## 实施规格：P-06 胜任感进步仪表盘

**修改文件**：app.js / index.html / style.css

**新增数据字段**：复用P-02的`streakCache.personalBest`，不额外增加

**新增DOM元素**：
```html
<!-- index.html: stats-view 内部，现有统计卡片区域 -->
<div class="stats-progress" id="stats-progress">
  <div class="progress-compare" id="progress-compare">
    <span class="compare-label">本周 vs 上周</span>
    <span class="compare-value" id="compare-value"></span>
  </div>
  <div class="progress-best" id="progress-best">
    <span>🏆 个人最佳: 单日<span id="best-daily-count">0</span>个番茄</span>
  </div>
  <div class="progress-total" id="progress-total">
    <span>⏱️ 累计专注 <span id="total-hours">0</span> 小时</span>
  </div>
</div>
```

**新增/修改函数**：
```
renderProgressDashboard()  // 渲染进步仪表盘（调用位置：renderStats内部）
calculateWeeklyCompare()   // 计算本周vs上周番茄数对比
calculateTotalHours()      // 计算累计专注小时数
```

**缓存版本升级**：同上

**验证方法**：
1. 完成几个番茄
2. 打开统计Tab，应显示"进步概览"卡片
3. 本周/上周对比箭头方向正确
4. 累计小时数与sessions记录一致

---

# 附录：实施优先级总表

| 编号 | 功能 | 优先级 | 复杂度 | 涉及差距 |
|------|------|--------|--------|---------|
| P-01 | 每日启动规划 | P0 | ⭐⭐ | G3,G8,G19 |
| P-02 | 习惯连续打卡 | P0 | ⭐⭐ | G1,G2,G14 |
| P-03 | 休息引导 | P0 | ⭐⭐ | G21,G22 |
| P-04 | 逾期5分钟启动 | P0 | ⭐ | G4,G6 |
| P-05 | 番茄退出损失确认 | P0 | ⭐ | G13 |
| P-06 | 胜任感进步仪表盘 | P0 | ⭐⭐ | G14,G23 |
| P-07 | 智能默认值 | P1 | ⭐ | G12,G15,G20 |
| P-08 | 新用户方法论引导 | P1 | ⭐⭐ | G15,G25 |
| P-09 | 任务拆解引导 | P1 | ⭐ | G7,G16 |
| P-10 | 深度工作模式 | P1 | ⭐ | G9,G22 |
| P-11 | 复习提醒 | P1 | ⭐⭐⭐ | G11 |
| P-12 | 番茄进行中目标显示 | P2 | ⭐ | G10 |
| P-13 | 收件箱清零助推 | P2 | ⭐ | G18 |
| P-14 | 每日回顾 | P2 | ⭐⭐ | G8,G14,G23 |
| P-15 | 预估vs实际对比 | P2 | ⭐⭐ | G5,G14,G23 |

---

# 实施路线图

**Phase 1（立即）**：P-04 + P-05 + P-07 — 低复杂度高价值，1-2天可完成  
**Phase 2（本周）**：P-01 + P-02 + P-06 — 核心新功能，3-5天  
**Phase 3（下周）**：P-03 + P-08 + P-09 + P-10 — 体验优化，3-4天  
**Phase 4（后续）**：P-11 + P-12~15 — 高复杂度/P2功能，按需排|累计进度即时反馈 |

---

# 第三步：产品方案 — Pomotodo V5 产品改进方案

## P-01: 每日启动规划（Daily Kickoff）

- **对应理论**：实施意向(Gollwitzer) + WOOP(Oettingen) + 决策疲劳(Baumeister) + 习惯回路(线索)
- **对应差距**：G3, G8, G19, G1
- **用户故事**：作为学生/打工人，我想每天第一次打开应用时被引导做5分钟规划，以便带着清晰计划开始一天而非面对混乱列表发呆。
- **功能描述**：
  1. 每天首次打开Pomotodo时，弹出"每日启动"面板（非阻塞式，可跳过）
  2. 面板分3步：①"今日三件事"（从今日标记/高优先级中自动推荐3个，可调） ②"可能遇到的障碍"+ if-then对策 ③"开始第一个番茄"按钮
  3. 完成规划后，工作台默认聚焦到"今日三件事"
  4. 设置中可关闭此功能
- **预期效果**：用户每日启动时间从"无规划直接开始"→"5分钟结构化规划"，预期任务完成率提升15-25%
- **优先级**：P0
- **实现复杂度**：⭐⭐
- **技术约束**：纯前端，需在localStorage记录当日是否已规划（`lastKickoffDate`）

## P-02: "5分钟启动"按钮（Quick Start）

- **对应理论**：拖延情绪调节(Sirois) + TMT(Steel) + 5分钟法则 + 习惯回路(降低惯例门槛)
- **对应差距**：G4, G6
- **用户故事**：作为拖延中的学生，我想在逾期任务旁看到"5分钟启动"按钮，以便不用下决心做完整番茄就能开始行动。
- **功能描述**：
  1. 逾期任务和超过3天未开始的任务旁显示"🚀 5分钟启动"按钮
  2. 点击→自动开始5分钟短番茄（不可自定义时长，固定5min）
  3. 5分钟结束后弹出鼓励"很好，你已经开始了！要继续25分钟吗？"
  4. 文案使用损失厌恶框架："只差5分钟就能打破拖延"
- **预期效果**：逾期任务重启率提升20-30%
- **优先级**：P0
- **实现复杂度**：⭐
- **技术约束**：需新增session type: 'quickStart'，计时器逻辑复用

## P-03: 番茄完成即时正反馈（Win Feedback）

- **对应理论**：习惯回路(奖赏) + 自我决定理论(胜任感) + 蔡格尼克效应
- **对应差距**：G1, G14, G23
- **用户故事**：作为打工人，我想在完成每个番茄时感受到成就感，以便形成"完成→奖赏→下次更想做"的正循环。
- **功能描述**：
  1. 番茄完成时，除现有音效外增加：①进度条动画（已完成X/预估Y番茄） ②鼓励文案随机轮播（"专注达人！"/"又消灭一个番茄！"/"第N个番茄，今天效率爆表！"） ③完成当天目标时特殊庆祝动画
  2. 连续完成3个番茄触发"🔥专注力爆棚"toast
  3. 完成预估的最后一个番茄时显示"🎉 任务番茄目标达成！"
- **预期效果**：番茄完成后的"满足感"评分提升，连续使用天数增加
- **优先级**：P0
- **实现复杂度**：⭐
- **技术约束**：纯前端动画，CSS animation

## P-04: 习惯连续打卡（Streak Tracker）

- **对应理论**：习惯形成66天(Lally) + 习惯回路(奖赏+线索) + 损失厌恶
- **对应差距**：G2, G14
- **用户故事**：作为学生，我想看到自己连续使用番茄钟的天数和长期趋势，以便利用"不想断链"的心理维持习惯。
- **功能描述**：
  1. 统计页顶部新增"🔥 连续专注 X 天"卡片
  2. 日历式打卡视图（类似GitHub贡献图），显示过去90天每天是否有番茄完成
  3. 连续天数每达7天/30天/66天里程碑时显示成就toast
  4. "断链"时显示鼓励而非惩罚："没关系，66天习惯才形成一半，今天重新开始！"
  5. 本周vs上周番茄数对比
- **预期效果**：用户7日留存率提升15-20%
- **优先级**：P0
- **实现复杂度**：⭐⭐
- **技术约束**：需在sessions数据上计算连续天数，纯前端可遍历。需存`lastStreakDate`等缓存字段

## P-05: 恢复性休息引导（Rest Guide）

- **对应理论**：注意恢复理论(Kaplan) + 超日节律(Kleitman) + 休息科学
- **对应差距**：G21, G22
- **用户故事**：作为打工人，我想在休息时间被引导做真正恢复注意力的事，而非无意识地刷手机浪费5分钟。
- **功能描述**：
  1. 休息开始时，计时器区域变为休息引导面板
  2. 短休息(5min)引导序列：①10秒深呼吸动画（吸气4s→屏气4s→呼气6s）②"站起来活动一下"提示 ③剩余时间自由休息倒计时
  3. 长休息(15min)引导：①深呼吸 ②"远眺窗外20秒" ③建议起身走动/喝水 ④剩余时间倒计时
  4. 设置中可开关"休息引导"（默认开启）
  5. 新增"深度工作"预设时长：45min/90min（在设置中可选）
- **预期效果**：休息后下一个番茄的完成率提升10-15%
- **优先级**：P0
- **实现复杂度**：⭐⭐
- **技术约束**：纯CSS动画+JS计时器状态切换，无后端依赖

## P-06: 损失框架退出确认（Loss-Framed Quit）

- **对应理论**：损失厌恶(Kahneman & Tversky) + 助推(Thaler)
- **对应差距**：G13
- **用户故事**：作为正在专注的用户，我想在退出番茄时被提醒已经投入的时间将浪费，以便利用损失厌恶帮助我坚持完成。
- **功能描述**：
  1. 番茄进行中点击重置/暂停放弃时，弹出确认弹窗
  2. 确认文案使用损失框架："你已经专注了18分钟，放弃则这18分钟不计入完成记录。确定要放弃吗？"
  3. 确认按钮文案："坚持完成"（主按钮/绿色） + "放弃"（次按钮/灰色）
  4. 专注超过50%时番茄后，确认弹窗增加"只剩X分钟了！"
- **预期效果**：番茄完成率提升10-15%
- **优先级**：P1
- **实现复杂度**：⭐
- **技术约束**：修改现有reset/stop逻辑，加确认弹窗

## P-07: 复习提醒（间隔重复）

- **对应理论**：遗忘曲线(Ebbinghaus) + 间隔效应 + 测试效应(Roediger)
- **对应差距**：G11
- **用户故事**：作为备考学生，我想标记某些任务为"需复习"并在遗忘临界点收到提醒，以便不再考前突击而是科学复习。
- **功能描述**：
  1. 任务详情面板增加"🔄 需复习"开关
  2. 开启后，任务完成后自动按简化间隔算法排期复习：1天→3天→7天→14天→30天
  3. 到期复习日在日历中显示"复习"标记，GTD列表中显示"📖今日复习"区域
  4. 复习提醒在每日启动规划中显示
  5. 复习完成记录`lastReviewAt`和`nextReviewAt`，间隔翻倍
- **预期效果**：对学生用户长期记忆保持率提升25-40%
- **优先级**：P1
- **实现复杂度**：⭐⭐⭐
- **技术约束**：需新增task字段`needsReview(bool)`, `lastReviewAt(ISO)`, `nextReviewAt(ISO)`, `reviewInterval(days)`, `reviewCount(int)`。需在`loadState()`中写迁移逻辑

## P-08: 智能默认值与任务创建引导

- **对应理论**：默认效应(Thaler) + 目标具体性(Locke & Latham) + 认知负荷(Sweller)
- **对应差距**：G7, G12, G15
- **用户故事**：作为新用户，我想在添加任务时被轻量引导写出更具体的目标并获得合理默认值，以便减少决策疲劳同时提升任务质量。
- **功能描述**：
  1. 新任务默认优先级从P4改为P3
  2. 新任务默认预估番茄从0改为1
  3. 添加任务输入框placeholder轮播提示："试试写具体目标：如'完成论文引言500字'而非'写论文'"
  4. 任务title含模糊词时（"看看"/"想想"/"了解一下"）自动提示"💡 试试定一个可衡量的目标？"
  5. 项目卡片中如果项目无子任务，显示"💡 把项目拆解为2-3个子任务，更容易开始"
- **预期效果**：任务具体性提升，子任务使用率提升
- **优先级**：P1
- **实现复杂度**：⭐
- **技术约束**：修改默认值+placeholder文案+简单关键词匹配

## P-09: 进步仪表盘（Progress Dashboard）

- **对应理论**：自我决定理论(胜任感) + 目标反馈(Locke & Latham) + 习惯回路(奖赏)
- **对应差距**：G14, G23
- **用户故事**：作为用户，我想在统计页看到自己的进步趋势和个人记录，以便感受到"我在变强"的胜任感驱动持续使用。
- **功能描述**：
  1. 统计页增加"个人最佳"区域：单日最多番茄 / 最长连续天数 / 单周最多番茄
  2. 本周vs上周对比卡片（↑↓箭头+百分比变化）
  3. "效率曲线"：过去7天各时段番茄分布热力图，发现个人高效时段
  4. 标签分布图增加关联番茄数（当前只有任务数）
- **预期效果**：用户统计页停留时间增加，连续使用意愿增强
- **优先级**：P1
- **实现复杂度**：⭐⭐
- **技术约束**：需遍历sessions计算统计值，纯前端可完成。需缓存计算结果避免每次重新遍历

## P-10: 收件箱清理助推（Inbox Zero Nudge）

- **对应理论**：蔡格尼克效应 + 决策疲劳 + 开放循环管理
- **对应差距**：G18, G11
- **用户故事**：作为用户，我想在收件箱积压过多时被温和推动清理，以便减少心理负担和决策疲劳。
- **功能描述**：
  1. 收件箱项数>5时，在GTD Tab徽章旁显示橙色"整理"提示
  2. 收件箱项数>10时，弹出非阻塞式banner："📥 收件箱有X项待整理，2分钟搞定？"
  3. 点击进入"快速整理"模式：逐项显示任务，每个提供3个快捷按钮→"下一步📋"/"项目📁"/"归档📦"/"删除🗑️"
  4. 整理完成显示"✨ 收件箱清零！大脑释放了"
- **预期效果**：收件箱平均项数下降50%，GTD区域使用率提升
- **优先级**：P2
- **实现复杂度**：⭐⭐
- **技术约束**：纯前端，快速整理模式需新DOM+渲染逻辑

## P-11: 新用户方法论引导升级

- **对应理论**：认知负荷理论(Sweller) + 自我决定理论(自主性) + 习惯堆叠
- **对应差距**：G15
- **用户故事**：作为新用户，我想在首次使用时不仅了解工具操作，还学会"怎么用GTD+番茄钟提高效率"的方法论，以便真正受益而非只是多了一个app。
- **功能描述**：
  1. 现有4步引导扩展为6步：①欢迎 ②番茄钟原理（30秒科普） ③GTD区域含义 ④"习惯堆叠"建议 ⑤创建第一个任务+番茄 ⑥完成！
  2. 每步控制在15秒内阅读
  3. 引导完成后，首次添加任务时仍有轻量提示
- **预期效果**：新用户7日留存率提升20%
- **优先级**：P2
- **实现复杂度**：⭐⭐
- **技术约束**：修改现有onboarding逻辑，增加步骤

## P-12: 弹性番茄模式（Flex Pomodoro）

- **对应理论**：心流(挑战-技能平衡) + 超日节律 + 心流中断风险
- **对应差距**：G9, G10, G22
- **用户故事**：作为深度工作者，我想在心流中延长番茄而非被25分钟闹钟打断，以便持续高质量输出。
- **功能描述**：
  1. 番茄进行中，倒计时归零前5分钟显示"⏳ 延长15分钟？"按钮
  2. 点击→当前番茄+15分钟（最多延长2次）
  3. 设置中新增"专注模式"预设：标准(25/5) / 深度(45/10) / 马拉松(90/20)
  4. 弹性番茄仍记为1个完成番茄（不论实际时长），但session中记录真实duration
- **预期效果**：深度工作用户满意度显著提升
- **优先级**：P2
- **实现复杂度**：⭐⭐
- **技术约束**：修改计时器逻辑，session duration记录实际值而非预设值

---

# 第四步：前端实施技术规格（P0级功能）

---

## 实施规格：P-01 每日启动规划

**修改文件**：app.js / index.html / style.css

**新增数据字段**：
```javascript
// 在 S.settings 中新增
lastKickoffDate: '',      // string, 'YYYY-MM-DD'，记录今日是否已规划
kickoffEnabled: true,     // bool, 是否启用每日启动
kickoffTop3: [],          // array of taskIds，今日三件事ID列表
```

**新增DOM元素**：
```html
<!-- 在 index.html 的 <main id="view-work"> 开头插入 -->
<div id="kickoff-overlay" class="kickoff-overlay hidden">
  <div class="kickoff-panel">
    <h2>🌅 每日启动</h2>
    <div class="kickoff-step" data-step="1">
      <h3>今日三件事</h3>
      <div id="kickoff-top3-list"></div>
      <p class="kickoff-hint">从今日标记和高优先级中为你推荐</p>
    </div>
    <div class="kickoff-step" data-step="2">
      <h3>预想障碍</h3>
      <textarea id="kickoff-obstacle" placeholder="今天可能遇到什么障碍？"></textarea>
      <textarea id="kickoff-plan" placeholder="如果遇到障碍，我打算…"></textarea>
    </div>
    <div class="kickoff-step" data-step="3">
      <button id="kickoff-start-btn" class="btn-primary">🍅 开始第一个番茄</button>
      <button id="kickoff-skip-btn" class="btn-secondary">跳过，直接开始</button>
    </div>
  </div>
</div>
```
JS引用：`document.getElementById('kickoff-overlay')`, `document.getElementById('kickoff-top3-list')`, `document.getElementById('kickoff-obstacle')`, `document.getElementById('kickoff-plan')`, `document.getElementById('kickoff-start-btn')`, `document.getElementById('kickoff-skip-btn')`

**新增/修改函数**：
```javascript
// app.js 新增
function shouldShowKickoff() {}
// 检查 S.settings.lastKickoffDate !== todayStr → 返回 bool
// 参数：无（读全局S） | 返回：bool
// 调用位置：initApp() 末尾

function renderKickoffPanel() {}
// 渲染每日启动面板，自动推荐3个任务
// 参数：无 | 返回：void
// 调用位置：shouldShowKickoff() 为true时

function confirmKickoff(taskIds, obstacle, plan) {}
// 用户完成规划，保存lastKickoffDate和kickoffTop3
// 参数：taskIds(Array), obstacle(String), plan(String) | 返回：void
// 调用位置：kickoff-start-btn click handler

function skipKickoff() {}
// 用户跳过规划，仅保存lastKickoffDate
// 参数：无 | 返回：void
// 调用位置：kickoff-skip-btn click handler
```

**缓存版本升级**：sw.js → `pomotodo-v20-kickoff`, index.html → `app.js?v=20`

**验证方法**：
1. 清除localStorage或首次打开 → 应自动弹出每日启动面板
2. 选择3个任务，填写障碍，点击开始 → 面板关闭，工作台聚焦今日三件事
3. 刷新页面 → 不再弹出（已记录今日日期）
4. 次日打开 → 再次弹出

---

## 实施规格：P-02 "5分钟启动"按钮

**修改文件**：app.js / style.css

**新增数据字段**：
```javascript
// 在 session 对象中，type 新增值
type: 'quickStart',  // 新增类型，5分钟快速启动
```

**新增DOM元素**：
```html
<!-- 在 renderTasks() 中逾期/长期未开始任务项内动态插入 -->
<button class="quick-start-btn" data-task-id="xxx">🚀 5分钟启动</button>
```
JS引用：通过事件委托在任务列表容器上监听 `.quick-start-btn` click

**新增/修改函数**：
```javascript
// app.js 新增
function isOverdueOrStale(task) {}
// 判断任务是否逾期或超过3天未开始
// 参数：task(Object) | 返回：bool
// 调用位置：renderTasks() 中

function startQuickStart(taskId) {}
// 启动5分钟短番茄，关联指定任务
// 参数：taskId(String) | 返回：void
// 调用位置：.quick-start-btn click handler

function onQuickStartComplete(taskId) {}
// 5分钟完成回调：显示鼓励文案+继续25分钟选项
// 参数：taskId(String) | 返回：void
// 调用位置：onTimerComplete() 中 type==='quickStart' 分支
```

**修改现有函数**：
- `startTimer()`: 增加对 `type='quickStart'` 的支持，时长固定300秒
- `onTimerComplete()`: 增加 `type==='quickStart'` 分支，调用 `onQuickStartComplete()`
- `renderTasks()`: 对满足 `isOverdueOrStale()` 的任务项插入 `.quick-start-btn`

**缓存版本升级**：与P-01合并为v20

**验证方法**：
1. 创建一个任务，设置截止时间为过去 → 应显示"🚀 5分钟启动"按钮
2. 点击按钮 → 开始5分钟倒计时
3. 5分钟结束 → 弹出鼓励文案和"继续25分钟"按钮
4. 点击继续 → 开始25分钟标准番茄

---

## 实施规格：P-03 番茄完成即时正反馈

**修改文件**：app.js / style.css

**新增数据字段**：无（使用现有sessions和tasks数据计算）

**新增DOM元素**：
```html
<div id="win-feedback" class="win-feedback hidden">
  <div class="win-feedback-content">
    <span class="win-emoji">🍅</span>
    <p id="win-text" class="win-text"></p>
    <div id="win-progress" class="win-progress"></div>
  </div>
</div>
```
JS引用：`document.getElementById('win-feedback')`, `document.getElementById('win-text')`, `document.getElementById('win-progress')`

**新增/修改函数**：
```javascript
// app.js 新增
const WIN_PHRASES = [
  '专注达人！', '又消灭一个番茄！', '效率爆表！',
  '心流状态！', '太棒了，继续保持！', '番茄收割机！',
  '你比99%的人更专注！', '完成即自由！'
];

function showWinFeedback(taskId) {}
// 番茄完成时显示正反馈弹窗
// 参数：taskId(String|null) | 返回：void
// 调用位置：onTimerComplete() 中 type==='work' 分支

function getWinPhrase() {}
// 随机获取鼓励文案
// 参数：无 | 返回：String

function renderWinProgress(taskId) {}
// 渲染"已完成X/预估Y番茄"进度条
// 参数：taskId(String|null) | 返回：HTML string
// 调用位置：showWinFeedback() 内部

function checkStreakBonus() {}
// 检查连续3番茄等成就条件，触发额外toast
// 参数：无（读全局S计算）| 返回：void
// 调用位置：showWinFeedback() 内部
```

**修改现有函数**：
- `onTimerComplete()`: type==='work'时调用 `showWinFeedback(taskId)`

**缓存版本升级**：与P-01合并为v20

**验证方法**：
1. 完成一个25分钟番茄 → 弹出正反馈窗口，显示随机鼓励文案
2. 关联任务完成番茄时 → 同时显示"X/Y番茄"进度
3. 连续完成3个番茄 → 触发"🔥专注力爆棚"toast
4. 完成任务预估的最后一个番茄 → 显示"🎉 任务番茄目标达成！"

---

## 实施规格：P-04 习惯连续打卡

**修改文件**：app.js / index.html / style.css

**新增数据字段**：
```javascript
// 在 S 中新增（非settings，独立缓存字段）
streakCache: {
  currentStreak: 0,        // 当前连续天数
  longestStreak: 0,        // 历史最长连续天数
  lastActiveDate: '',      // 'YYYY-MM-DD' 最后有番茄的日期
  personalBest: {
    dailyPomodoros: 0,     // 单日最多番茄
    dailyPomodorosDate: '',// 达成日期
    weeklyPomodoros: 0,    // 单周最多番茄
  }
}
```

**新增DOM元素**：
```html
<!-- 在统计页 stats-view 开头插入 -->
<div class="streak-card">
  <div class="streak-number" id="streak-count">0</div>
  <div class="streak-label">🔥 连续专注天数</div>
</div>
<div class="streak-heatmap" id="streak-heatmap"></div>
```
JS引用：`document.getElementById('streak-count')`, `document.getElementById('streak-heatmap')`

**新增/修改函数**：
```javascript
// app.js 新增
function calculateStreak() {}
// 遍历sessions计算连续天数
// 参数：无（读全局S.sessions） | 返回：{currentStreak, longestStreak, lastActiveDate}
// 调用位置：onTimerComplete() 后 + renderStats() 中

function updateStreakCache() {}
// 更新S.streakCache并saveState
// 参数：无 | 返回：void
// 调用位置：calculateStreak() 后

function renderStreakHeatmap() {}
// 渲染90天打卡热力图
// 参数：无 | 返回：void
// 调用位置：renderStats() 中

function checkMilestone(streak) {}
// 检查7/30/66天里程碑，触发toast
// 参数：streak(Number) | 返回：void
// 调用位置：updateStreakCache() 中

function getWeekComparison() {}
// 计算本周vs上周番茄数对比
// 参数：无 | 返回：{thisWeek, lastWeek, change}
// 调用位置：renderStats() 中
```

**修改现有函数**：
- `renderStats()`: 在顶部渲染streak卡片和热力图
- `onTimerComplete()`: 调用 `updateStreakCache()`

**数据迁移**：
```javascript
// 在 loadState() 的迁移逻辑中新增
if (!S.streakCache) {
  S.streakCache = { currentStreak: 0, longestStreak: 0, lastActiveDate: '', personalBest: { dailyPomodoros: 0, dailyPomodorosDate: '', weeklyPomodoros: 0 } };
}
```

**缓存版本升级**：与P-01合并为v20

**验证方法**：
1. 完成番茄后查看统计页 → 显示连续天数和热力图
2. 连续2天完成番茄 → 连续天数显示为2
3. 漏掉1天 → 连续天数重置为1（新开始），但不惩罚
4. 达到7天 → 触发里程碑toast

---

## 实施规格：P-05 恢复性休息引导

**修改文件**：app.js / index.html / style.css

**新增数据字段**：
```javascript
// 在 S.settings 中新增
restGuideEnabled: true,   // bool, 是否开启休息引导
deepWorkPresets: [        // 深度工作预设（用户可选）
  { name: '标准', work: 25, shortBreak: 5, longBreak: 15 },
  { name: '深度', work: 45, shortBreak: 10, longBreak: 20 },
  { name: '马拉松', work: 90, shortBreak: 20, longBreak: 30 }
]
```

**新增DOM元素**：
```html
<!-- 在 timer区域，休息时替换圆环显示 -->
<div id="rest-guide" class="rest-guide hidden">
  <div class="rest-phase" id="rest-phase-breath">
    <div class="breath-animation">
      <div class="breath-circle" id="breath-circle"></div>
      <p id="breath-text">吸气…</p>
    </div>
  </div>
  <div class="rest-phase" id="rest-phase-stand" hidden>
    <p class="rest-tip">🧍 站起来活动一下</p>
  </div>
  <div class="rest-phase" id="rest-phase-look" hidden>
    <p class="rest-tip">👁️ 远眺窗外20秒</p>
  </div>
  <div class="rest-timer" id="rest-free-timer">
    <p>自由休息</p>
    <span id="rest-countdown"></span>
  </div>
</div>
```
JS引用：`document.getElementById('rest-guide')`, `document.getElementById('breath-circle')`, `document.getElementById('breath-text')`, 等

**新增/修改函数**：
```javascript
// app.js 新增
function startRestGuide(type) {}
// 休息开始时启动引导序列
// 参数：type('shortBreak'|'longBreak') | 返回：void
// 调用位置：onTimerComplete() → advanceAfterComplete() 休息阶段

function runBreathAnimation(durationSec) {}
// 运行深呼吸CSS动画
// 参数：durationSec(Number) | 返回：void
// 调用位置：startRestGuide() 内

function showRestTip(tipType, durationSec) {}
// 显示休息提示（站立/远眺等）
// 参数：tipType('stand'|'look'|'walk'), durationSec(Number) | 返回：void
// 调用位置：startRestGuide() 内按序列调用

function hideRestGuide() {}
// 隐藏休息引导面板
// 参数：无 | 返回：void
// 调用位置：休息结束 / 用户手动关闭
```

**修改现有函数**：
- `advanceAfterComplete()`: 休息开始时调用 `startRestGuide()`
- `startTimer()`: 休息结束时调用 `hideRestGuide()`

**设置页面修改**：
- 新增"休息引导"开关
- 新增"专注模式预设"选择器（标准/深度/马拉松）

**缓存版本升级**：与P-01合并为v20

**验证方法**：
1. 完成25分钟番茄 → 休息开始，显示深呼吸动画
2. 10秒后 → 切换到"站起来活动"提示
3. 长休息 → 额外显示"远眺窗外"提示
4. 设置中关闭休息引导 → 休息时不显示引导，恢复原样
5. 设置中选择"深度工作"预设 → 工作时长变为45分钟

---

## 数据迁移总览（loadState() 修改）

```javascript
// app.js loadState() 中新增迁移
function migrateStateV20(S) {
  // P-01: 每日启动
  if (S.settings.lastKickoffDate === undefined) S.settings.lastKickoffDate = '';
  if (S.settings.kickoffEnabled === undefined) S.settings.kickoffEnabled = true;
  if (S.settings.kickoffTop3 === undefined) S.settings.kickoffTop3 = [];
  
  // P-02: 无新字段，session type 新增值 'quickStart'
  
  // P-03: 无新字段
  
  // P-04: 连续打卡缓存
  if (!S.streakCache) {
    S.streakCache = {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      personalBest: { dailyPomodoros: 0, dailyPomodorosDate: '', weeklyPomodoros: 0 }
    };
  }
  
  // P-05: 休息引导
  if (S.settings.restGuideEnabled === undefined) S.settings.restGuideEnabled = true;
  if (!S.settings.deepWorkPresets) {
    S.settings.deepWorkPresets = [
      { name: '标准', work: 25, shortBreak: 5, longBreak: 15 },
      { name: '深度', work: 45, shortBreak: 10, longBreak: 20 },
      { name: '马拉松', work: 90, shortBreak: 20, longBreak: 30 }
    ];
  }
  
  // P-08: 智能默认值
  // 默认优先级从4改3、预估番茄从0改1，在addTask()中修改
  
  return S;
}
```

---

## 全局修改清单

| 文件 | 修改概要 |
|------|---------|
| **sw.js** | `CACHE` → `pomotodo-v20-kickoff` |
| **index.html** | `app.js?v=19` → `app.js?v=20`；新增 kickoff-overlay, rest-guide, win-feedback DOM |
| **app.js** | 新增~15个函数；修改 `loadState()`(迁移), `initApp()`(kickoff检查), `startTimer()`(quickStart+restGuide), `onTimerComplete()`(winFeedback+streak), `advanceAfterComplete()`(restGuide), `renderTasks()`(quickStart按钮), `renderStats()`(streak+heatmap), `addTask()`(默认值), `initSettings()`(新设置项) |
| **style.css** | 新增样式（追加到文件末尾）：`.kickoff-*`, `.quick-start-btn`, `.win-*`, `.streak-*`, `.rest-guide-*`, `.breath-*` |

---

## 验证总流程

1. `git push origin main` → 等待GitHub Actions部署
2. 访问 `https://185www.github.io/pomotodo/`，Ctrl+Shift+R硬刷新
3. 首次打开 → 每日启动规划面板（P-01）
4. 规划完成 → 工作台聚焦今日三件事
5. 逾期任务 → 显示"5分钟启动"按钮（P-02）
6. 点击5分钟启动 → 完成 → 鼓励+继续选项
7. 开始标准番茄 → 完成 → 正反馈弹窗（P-03）
8. 休息开始 → 深呼吸引导（P-05）
9. 统计页 → 连续天数+热力图（P-04）
10. 设置页 → 休息引导开关+专注模式预设

---

*文档结束。以上为四步工作流的完整输出。下一步：按P0优先级逐一实施代码修改。*时显示"今日第X个番茄/预估进度" |
| G24 | 归属感降级：虚拟社会比较 | ❌缺失 | 完全没有对比参照 | 🟢低 | 硬编码"全球用户平均"对比线 |
| G25 | 习惯堆叠：将新习惯锚定已有行为 | ❌缺失 | 引导流程只讲工具用法不讲方法论 | 🟡中 | 引导中植入习惯堆叠建议 |

---

# 第三步：产品方案 — Pomotodo V5 改进方案

> 优先级排序原则：用户价值×实现可行性 > 理论支撑强度 > 最低viable改动 > 双用户群覆盖

---

### P-01: 每日启动规划（Daily Planning Ritual）
- **对应理论**：实施意向(Gollwitzer)、WOOP(Oettingen)、决策疲劳(Baumeister)
- **对应差距**：G3, G8, G19
- **用户故事**：作为学生/打工人，我想每天打开应用时有一个3分钟的规划仪式，帮我确定今天最重要的3件事并预想障碍，以便我不需要整天做决策就能知道该做什么。
- **功能描述**：
  - 每天首次打开应用（或手动触发），弹出"今日规划"引导卡片
  - Step 1：从收件箱/下一步中选择"今日三件事"（最多3个，强制限制选择）
  - Step 2：为每件事写一个if-then语句（模板："如果[时间/情境]，那么我就[行动]"）
  - Step 3：预想最大障碍 + 对应计划（WOOP简化版）
  - 完成后进入工作台，今日三件事置顶显示
  - 数据存储：`S.dailyPlan = { date, top3: [{taskId, ifThen, obstacle, plan}], completed }`
- **预期效果**：减少每日启动决策时间50%+，提高"最重要的事"完成率
- **优先级**：P0(必须做)
- **实现复杂度**：⭐⭐
- **技术约束**：纯前端可完全实现，数据存localStorage，每日一个plan对象约500字节

---

### P-02: 习惯连续打卡（Streak Tracking）
- **对应理论**：习惯回路(Duhigg)、习惯形成66天(Lally)、损失厌恶(Kahneman)
- **对应差距**：G1, G2, G14
- **用户故事**：作为学生/打工人，我想看到自己连续专注了多少天，以便我有动力不中断链锁，形成稳固习惯。
- **功能描述**：
  - 在统计Tab增加"习惯打卡"子视图
  - 显示连续天数（streak）、最长记录、总专注天数
  - 日历热力图：类似GitHub贡献图，每天一格，颜色深浅=番茄数
  - 断链提示："你的连续专注已中断，今天重新开始吧！"
  - 数据存储：基于已有sessions数据计算，无需额外存储（streak可缓存于`S.streakCache = { currentStreak, bestStreak, lastActiveDate }`）
- **预期效果**：基于损失厌恶，用户为不中断streak而每日启动至少1个番茄
- **优先级**：P0(必须做)
- **实现复杂度**：⭐⭐
- **技术约束**：纯前端从sessions计算，缓存streak值避免重复计算

---

### P-03: 休息引导（Rest Guidance）
- **对应理论**：注意恢复理论(Kaplan)、超日节律(Kleitman)、微休息效力
- **对应差距**：G21, G22
- **用户故事**：作为学生/打工人，我想在休息时间被引导做恢复性活动（而非刷手机），以便我下一个番茄的专注力更高。
- **功能描述**：
  - 休息开始时，工作台区域显示休息引导内容（替代空白倒计时）
  - 3种休息模式供选择（或随机推荐）：
    - 🧘 深呼吸（30秒引导动画 + 剩余自由休息）
    - 👀 远眺放松（"看窗外20秒"提示 + 眼球运动引导）
    - 🏃 起身活动（简易拉伸动作图示，2-3个动作）
  - 设置中增加"休息引导"开关和模式偏好
  - 长休息（15min）提供更完整的恢复建议
  - 数据存储：`S.settings.restGuidance = { enabled: true, mode: 'random' }`
- **预期效果**：减少"休息刷手机"行为，提高下一番茄专注度自我评分
- **优先级**：P0(必须做)
- **实现复杂度**：⭐⭐
- **技术约束**：纯CSS动画+JS倒计时，无需外部资源。休息引导内容硬编码为中文文案

---

### P-04: 逾期任务"5分钟启动"（Anti-Procrastination Button）
- **对应理论**：拖延情绪调节(Sirois)、5分钟法则、TMT(Steel)
- **对应差距**：G4, G6
- **用户故事**：作为学生/打工人，我想对逾期或长期未开始的任务看到"只做5分钟"的按钮，以便我降低启动情绪门槛，一旦开始就更容易继续。
- **功能描述**：
  - 逾期任务（dueDatetime < now && !completed）和3天以上未更新的收件箱任务，显示"🚀 5分钟启动"按钮
  - 点击后启动5分钟短番茄，自动关联该任务
  - 5分钟结束时弹出选择："继续专注？(+20min)" 或 "已进入状态，标记为进行中"
  - 按钮文案用损失框架："已逾期3天，5分钟就能开始"
  - 不增加新数据字段，复用现有session关联和番茄计时
- **预期效果**：逾期任务重新启动率提升30%+
- **优先级**：P0(必须做)
- **实现复杂度**：⭐
- **技术约束**：复用现有计时器和session，仅增加UI判断逻辑

---

### P-05: 番茄退出损失框架确认（Loss-Framed Quit Confirmation）
- **对应理论**：损失厌恶(Kahneman & Tversky)
- **对应差距**：G13
- **用户故事**：作为学生/打工人，我想在想要放弃当前番茄时看到已投入时间的损失提醒，以便我更倾向坚持完成而非轻易退出。
- **功能描述**：
  - 点击重置/放弃番茄时，确认弹窗改用损失框架文案
  - 当前文案（假设）："确定要重置吗？" → 改为："你已经专注了18分钟，放弃则这18分钟不计入今日完成 ⚠️"
  - 番茄进度>50%时，额外显示"还剩7分钟就能完成一个番茄！"
  - 按钮措辞：[继续专注]（主按钮/高亮） + [放弃番茄]（次按钮/灰色）
  - 仅修改文案和按钮样式，不增加新数据
- **预期效果**：番茄放弃率降低15-25%
- **优先级**：P0(必须做)
- **实现复杂度**：⭐
- **技术约束**：仅修改confirm/toast文案，零数据模型变更

---

### P-06: 胜任感进步仪表盘（Competence Dashboard）
- **对应理论**：自我决定理论-胜任感(Deci & Ryan)、目标设置反馈(Locke & Latham)
- **对应差距**：G14, G23
- **用户故事**：作为学生/打工人，我想在统计页面看到自己"本周比上周进步了"的叙事，以便我感到自己在变得更强而不是只是机械地计数。
- **功能描述**：
  - 统计Tab顶部增加"进步概览"卡片：
    - 本周 vs 上周番茄数对比（↑12% 或 ↓5%）
    - 个人最佳记录（单日最多番茄、最长连续天数）
    - "你已累计专注 XXX 小时，相当于 Y 部电影"
  - 每日最后完成番茄时，Toast显示"今日第X个番茄！🏆"
  - 数据来源：从sessions计算，`S.personalBest = { maxDailyPomodoros, longestStreak, totalHours }`缓存
- **预期效果**：增强胜任感→维持长期使用动机
- **优先级**：P0(必须做)
- **实现复杂度**：⭐⭐
- **技术约束**：纯前端计算，缓存personalBest避免重复计算

---

### P-07: 智能默认值与任务输入增强
- **对应理论**：默认效应(Thaler)、认知负荷(Sweller)、选择悖论(Schwartz)
- **对应差距**：G12, G15, G20
- **用户故事**：作为学生/打工人，我想添加任务时减少需要做的决定数量，以便我把精力放在执行而非计划上。
- **功能描述**：
  - 新任务默认优先级从P4(白)改为P3(黄)——暗示"这是普通任务"
  - 新任务默认预估番茄从0改为1——暗示"这事至少需要1个番茄"
  - 快捷输入栏默认展开（而非需点击⚙），降低发现成本
  - 任务列表默认视图改为"今日"（而非"全部"），减少选择悖论
  - 收件箱>10项时，顶部显示"🧹 收件箱有N项待处理，花2分钟清理？"
- **预期效果**：新用户任务添加决策时间降低40%
- **优先级**：P1(应该做)
- **实现复杂度**：⭐
- **技术约束**：仅修改默认值和过滤逻辑，零数据模型变更

---

### P-08: 新用户方法论引导（Onboarding V2）
- **对应理论**：认知负荷(Sweller)、习惯堆叠(Clear/Fogg)、自我决定理论-自主性
- **对应差距**：G15, G25
- **用户故事**：作为新用户，我想在首次使用时不仅了解按钮在哪，更知道"怎么用这个工具才能真正提高效率"，以便我不会空着应用不知道干什么。
- **功能描述**：
  - 4步工具介绍 → 改为 6步方法论引导：
    1. 欢迎页：理念"不只是番茄钟，是你的效率操作系统"
    2. 收件箱清零：讲解GTD流程，引导把脑中任务倒入收件箱
    3. 今日三件事：讲解"选择悖论"和"今日聚焦"
    4. 第一个番茄：引导启动第一个25分钟番茄
    5. 习惯堆叠：建议"每天[固定时间]打开Pomotodo做规划"
    6. 休息也是工作：讲解休息引导功能
  - 使用`S.onboardingV2Completed`标记完成状态
  - 渐进式披露：首次使用时隐藏高级功能（项目、日历详情），逐步解锁
- **预期效果**：新用户7天留存率提升25%
- **优先级**：P1(应该做)
- **实现复杂度**：⭐⭐
- **技术约束**：纯前端，引导步骤内容硬编码中文

---

### P-09: 任务拆解引导（Chunking Prompt）
- **对应理论**：分块效应(Miller)、目标设置具体性(Locke & Latham)、WOOP(Oettingen)
- **对应差距**：G7, G16
- **用户故事**：作为学生/打工人，我想在创建一个大任务时被引导拆解为子任务，以便我不会面对一个庞大模糊的任务而拖延。
- **功能描述**：
  - 添加/编辑任务时，如果标题包含"写/做/完成/准备/复习"等动词+大目标，弹出"建议拆解"提示
  - 项目区域增加"项目健康度"：0个子任务的项目显示⚠️"这个项目还没有可执行步骤"
  - 项目详情面板顶部增加引导："一个好项目 = 2-5个可在1个番茄内完成的子任务"
  - 不增加新数据字段，仅增加UI提示逻辑
- **预期效果**：项目拆解率提升→减少"大任务拖延"
- **优先级**：P1(应该做)
- **实现复杂度**：⭐
- **技术约束**：仅UI提示逻辑，关键词匹配硬编码

---

### P-10: 深度工作模式（Deep Work Preset）
- **对应理论**：超日节律(Kleitman)、心流挑战-技能平衡(Csikszentmihalyi)
- **对应差距**：G9, G22
- **用户故事**：作为打工人/考研学生，我想有时用45分钟或90分钟的深度专注时段，以便我进入心流而不被打断。
- **功能描述**：
  - 计时器模式选择增加"🧠 深度工作"预设：45min专注/10min休息
  - 设置中增加"自定义预设"功能：用户可保存多个时长预设（如"考研阅读60min"）
  - 深度工作模式下，休息引导自动切换为更完整的恢复建议
  - 数据存储：`S.settings.workPresets = [{ name, workDuration, breakDuration }]`
- **预期效果**：满足深度工作需求，减少"25分钟太短"的用户流失
- **优先级**：P1(应该做)
- **实现复杂度**：⭐
- **技术约束**：复用现有计时逻辑，仅增加预设配置

---

### P-11: 复习提醒（Spaced Repetition Reminder）
- **对应理论**：遗忘曲线(Ebbinghaus)、间隔效应、测试效应(Roediger)
- **对应差距**：G11
- **用户故事**：作为学生，我想对需要记忆的任务/笔记设定复习提醒，以便我在遗忘临界点被提醒复习，而不是考前临时抱佛脚。
- **功能描述**：
  - 任务详情面板增加"🔄 需复习"开关
  - 开启后，自动按简化间隔算法计算复习日期：1天→3天→7天→14天→30天
  - 复习日到期时，任务在列表中显示"📖 今日复习"标签
  - 首次复习时显示主动回忆提示："先试着回忆，再查看笔记"
  - 数据存储：`task.reviewSchedule = { enabled, nextReviewDate, interval, reviewCount }`
  - 过滤器增加"待复习"选项
- **预期效果**：对学生用户核心价值，提高长期记忆保持率
- **优先级**：P1(应该做)
- **实现复杂度**：⭐⭐⭐
- **技术约束**：需新增task数据字段和间隔计算逻辑，需数据迁移（loadState中兼容旧task无reviewSchedule字段）

---

### P-12: 番茄进行中目标显示（In-Pomodoro Goal Display）
- **对应理论**：心流清晰目标(Csikszentmihalyi)、目标设置具体性(Locke & Latham)
- **对应差距**：G10
- **用户故事**：作为用户，我想番茄钟进行中看到当前任务的具体目标，以便我不走神、保持专注。
- **功能描述**：
  - 番茄计时器下方显示当前关联任务的标题
  - 如果任务有notes，截取第一行作为"本次目标"显示
  - 无关联任务时显示"自由专注——想好这25分钟的目标"
  - 完成时Toast："✅ [任务标题] 完成一个番茄！今日第X个"
- **预期效果**：减少番茄中走神率
- **优先级**：P2(可以做)
- **实现复杂度**：⭐
- **技术约束**：复用现有taskId关联逻辑，仅增加显示

---

### P-13: 收件箱清零助推（Inbox Zero Nudge）
- **对应理论**：蔡格尼克效应、决策疲劳(Baumeister)、GTD收件箱清零
- **对应差距**：G18
- **用户故事**：作为用户，我想被提醒清理积压的收件箱，以便未处理的任务不造成心理负担。
- **功能描述**：
  - 收件箱项目数>5时，显示横幅："📥 收件箱有N项待处理，花2分钟清零？"
  - 点击进入"快速清零模式"：逐个显示任务，3个操作按钮：①→下一步 ②📁→项目 ③🗑️删除
  - 收件箱=0时显示"✨ 收件箱清零！大脑空间已释放"
  - 不增加新数据字段
- **预期效果**：减少收件箱积压，降低开放循环心理负担
- **优先级**：P2(可以做)
- **实现复杂度**：⭐
- **技术约束**：纯UI逻辑，复用现有任务移动功能

---

### P-14: 每日回顾（Daily Review）
- **对应理论**：目标设置反馈(Locke & Latham)、自我决定理论-胜任感、WOOP复盘
- **对应差距**：G8, G14, G23
- **用户故事**：作为用户，我想在每天结束时看到简短回顾，以便我知道自己做到了什么、没做到什么，明天可以调整。
- **功能描述**：
  - 每天22:00后（或用户自定义时间），打开应用弹出"今日回顾"卡片
  - 显示：今日完成番茄数/预估对比、今日三件事完成率、streak状态
  - 一个简短反思输入："今天最大的收获是___"
  - 回顾数据存入`S.dailyReviews = [{ date, reflection, completionRate }]`（限最近30天）
  - 可在设置中关闭
- **预期效果**：增强反思习惯→行为调整→长期进步
- **优先级**：P2(可以做)
- **实现复杂度**：⭐⭐
- **技术约束**：需新增dailyReviews数据字段，约30天×100字节=3KB

---

### P-15: 预估vs实际对比（Estimate vs Actual）
- **对应理论**：目标设置反馈、胜任感、规划谬误(Kahneman)
- **对应差距**：G5, G14, G23
- **用户故事**：作为用户，我想看到任务预估番茄数和实际完成数的对比，以便我逐渐校准自己的时间预估能力。
- **功能描述**：
  - 任务详情面板显示：预估X / 实际Y 个番茄
  - 完成任务时，如果实际≠预估，显示对比条
  - 统计Tab增加"预估准确率"指标：最近30天任务的预估偏差
  - 不增加新数据字段（已有estimatedPomodoros和pomodorosCompleted）
- **预期效果**：帮助用户校准规划谬误，提高未来预估准确度
- **优先级**：P2(可以做)
- **实现复杂度**：⭐⭐
- **技术约束**：已有数据，仅需计算和UI展示

---

# 第四步：前端实施技术规格（P0级功能）

---

## 实施规格：P-01 每日启动规划

**修改文件**：app.js / index.html / style.css

**新增数据字段**：
```javascript
// 在 S 对象中新增
S.dailyPlan = {
  date: '',           // 'YYYY-MM-DD' 当天日期
  top3: [{            // 今日三件事
    taskId: '',       // 关联任务ID
    ifThen: '',       // if-then语句，如"如果9:00，那么开始写论文引言"
    obstacle: '',     // 预想障碍
    plan: ''          // 障碍应对计划
  }, ...],            // 最多3项
  completed: false    // 今日规划是否已完成
}
```

**新增DOM元素**：
```html
<!-- index.html: 在 view-work 内部、panel-timer之前插入 -->
<div class="panel panel-daily-plan" id="panel-daily-plan" style="display:none">
  <div class="daily-plan-header">
    <h2>📋 今日规划</h2>
    <span class="daily-plan-date" id="daily-plan-date"></span>
    <button class="btn-skip" id="btn-skip-plan">跳过</button>
  </div>
  <div class="daily-plan-steps" id="daily-plan-steps">
    <!-- Step 1: 选三件事 -->
    <div class="plan-step" id="plan-step-1">
      <h3>Step 1: 选择今日最重要的3件事</h3>
      <div class="plan-task-picker" id="plan-task-picker"></div>
      <div class="plan-selected" id="plan-selected-top3"></div>
    </div>
    <!-- Step 2: if-then -->
    <div class="plan-step" id="plan-step-2" style="display:none">
      <h3>Step 2: 制定执行计划</h3>
      <div class="if-then-forms" id="if-then-forms"></div>
    </div>
    <!-- Step 3: WOOP障碍 -->
    <div class="plan-step" id="plan-step-3" style="display:none">
      <h3>Step 3: 预想障碍</h3>
      <div class="obstacle-forms" id="obstacle-forms"></div>
    </div>
  </div>
  <div class="daily-plan-actions">
    <button class="btn-prev" id="btn-plan-prev" style="display:none">上一步</button>
    <button class="btn-next" id="btn-plan-next">下一步</button>
    <button class="btn-finish" id="btn-plan-finish" style="display:none">开始今天！</button>
  </div>
</div>
```
JS引用：`panel-daily-plan`, `daily-plan-date`, `btn-skip-plan`, `plan-step-1/2/3`, `plan-task-picker`, `plan-selected-top3`, `if-then-forms`, `obstacle-forms`, `btn-plan-prev/next/finish`

**新增/修改函数**：
```
checkDailyPlan()        // 每次打开app时检查：是否今天、是否已完成。调用位置：DOMContentLoaded
showDailyPlan()         // 显示规划面板，初始化3步流程
renderPlanTaskPicker()  // 渲染任务选择列表（收件箱+下一步+今日标记的任务）
selectPlanTask(taskId)  // 选择/取消选择任务到top3
renderIfThenForms()     // 渲染Step2的if-then输入表单
renderObstacleForms()   // 渲染Step3的障碍输入表单
nextPlanStep()          // 下一步
prevPlanStep()          // 上一步
finishDailyPlan()       // 保存dailyPlan到S，标记completed=true，隐藏面板
skipDailyPlan()         // 跳过（不保存），隐藏面板
saveDailyPlan()         // 持久化S.dailyPlan → localStorage
renderTop3Banner()      // 工作台顶部显示"今日三件事"横幅
```

**数据迁移**：在`loadState()`中添加：
```javascript
if (!S.dailyPlan) S.dailyPlan = { date: '', top3: [], completed: false };
```

**缓存版本升级**：sw.js `CACHE = 'pomotodo-v20-daily-plan'`, index.html `app.js?v=20`

**验证方法**：
1. 清空localStorage或新开隐私窗口
2. 打开应用，应看到"今日规划"3步引导
3. 选择3个任务，填写if-then和障碍
4. 点击"开始今天"，工作台应显示今日三件事横幅
5. 刷新页面，不应再次弹出规划（completed=true）
6. 次日打开，应再次弹出规划

---

## 实施规格：P-02 习惯连续打卡

**修改文件**：app.js / index.html / style.css

**新增数据字段**：
```javascript
S.streakCache = {
  currentStreak: 0,     // 当前连续天数
  bestStreak: 0,        // 最长连续天数
  lastActiveDate: '',   // 'YYYY-MM-DD' 最后有番茄的日期
  totalActiveDays: 0,   // 总专注天数
  personalBest: {
    maxDailyPomodoros: 0, // 单日最多番茄
    maxDailyDate: '',     // 创纪录日期
  }
}
```

**新增DOM元素**：
```html
<!-- index.html: 在 stats-view 内部，现有统计卡片之后 -->
<div class="stats-streak" id="stats-streak">
  <div class="streak-hero" id="streak-hero">
    <span class="streak-number" id="streak-number">0</span>
    <span class="streak-label">天连续专注</span>
  </div>
  <div class="streak-meta">
    <div class="streak-best">🏆 最长记录: <span id="streak-best">0</span>天</div>
    <div class="streak-total">📊 累计专注: <span id="streak-total">0</span>天</div>
  </div>
  <div class="streak-heatmap" id="streak-heatmap">
    <!-- JS动态生成：最近12周的热力图格子 -->
  </div>
</div>
```
JS引用：`stats-streak`, `streak-number`, `streak-best`, `streak-total`, `streak-heatmap`

**新增/修改函数**：
```
calculateStreak()        // 遍历sessions计算连续天数，更新streakCache
renderStreakSection()    // 渲染习惯打卡区域（调用位置：renderStats内部）
renderStreakHeatmap()    // 渲染12周热力图（7行×12列）
updateStreakOnComplete() // 番茄完成时更新streak（调用位置：onTimerComplete内部）
```

**数据迁移**：在`loadState()`中添加：
```javascript
if (!S.streakCache) S.streakCache = { currentStreak: 0, bestStreak: 0, lastActiveDate: '', totalActiveDays: 0, personalBest: { maxDailyPomodoros: 0, maxDailyDate: '' } };
```

**缓存版本升级**：同P-01版本号（若同步发布则共用v20）

**验证方法**：
1. 完成至少1个番茄
2. 打开统计Tab，应显示streak=1天
3. 次日再完成1个番茄，streak应=2
4. 跳过一天后完成番茄，streak应重置为1
5. 热力图应显示对应日期的颜色深浅

---

## 实施规格：P-03 休息引导

**修改文件**：app.js / index.html / style.css

**新增数据字段**：
```javascript
// 在 S.settings 中新增
S.settings.restGuidance = {
  enabled: true,        // 是否开启休息引导
  mode: 'random'        // 'random' | 'breathe' | 'look' | 'stretch'
}
```

**新增DOM元素**：
```html
<!-- index.html: 在 panel-timer 内部，timer显示区域之后 -->
<div class="rest-guidance" id="rest-guidance" style="display:none">
  <div class="rest-guidance-content" id="rest-guidance-content">
    <!-- JS动态填充3种引导内容之一 -->
  </div>
  <div class="rest-guidance-timer" id="rest-guidance-timer"></div>
</div>
```
JS引用：`rest-guidance`, `rest-guidance-content`, `rest-guidance-timer`

**新增/修改函数**：
```
startRestGuidance()      // 休息开始时调用，随机选择或按偏好显示引导
renderBreatheGuide()     // 🧘 深呼吸引导：吸气4秒→屏息4秒→呼气6秒动画
renderLookGuide()        // 👀 远眺引导："看20英尺外20秒"
renderStretchGuide()     // 🏃 拉伸引导：3个简易动作图示（CSS绘制）
stopRestGuidance()       // 休息结束/用户切走时清理
```

**调用位置**：`advanceAfterComplete()` 中，当切换到休息模式时调用 `startRestGuidance()`

**数据迁移**：在`loadState()` → `readSettings()` 中添加：
```javascript
if (!S.settings.restGuidance) S.settings.restGuidance = { enabled: true, mode: 'random' };
```

**缓存版本升级**：同上

**验证方法**：
1. 完成一个番茄钟
2. 休息开始时，工作台区域应显示休息引导（而非空白倒计时）
3. 点击3种模式标签可切换
4. 设置中可关闭/选择偏好模式
5. 关闭后休息应恢复为纯倒计时

---

## 实施规格：P-04 逾期任务"5分钟启动"

**修改文件**：app.js / style.css

**新增数据字段**：无（复用现有session和task模型）

**新增DOM元素**：无独立HTML元素，在`renderTasks()`中条件性插入按钮

**新增/修改函数**：
```
isTaskProcrastinated(task)  // 判断是否逾期/拖延：dueDatetime<now且!completed，或createdAt超过3天且area仍为inbox
renderQuickStartBtn(task)   // 在拖延任务项旁渲染"🚀 5分钟启动"按钮
startQuickPomodoro(taskId)  // 启动5分钟短番茄并关联task，调用startTimer()前设置时长为5
onQuickPomodoroComplete()   // 5分钟完成时弹出"继续专注(+20min)"或"标记进行中"选择
```

**调用位置**：
- `renderTasks()` 中，对每个任务调用 `isTaskProcrastinated()`，如为true则渲染按钮
- `onTimerComplete()` 中，如session是quickStart类型，调用 `onQuickPomodoroComplete()`

**CSS新增**：
```css
.quick-start-btn { /* 🚀5分钟启动按钮样式 */ }
```

**缓存版本升级**：同上

**验证方法**：
1. 创建一个任务，设置截止时间为过去时间
2. 任务列表中该任务旁应显示"🚀 5分钟启动"按钮
3. 点击按钮，计时器应启动5分钟番茄
4. 5分钟完成，应弹出继续/标记选择
5. 点击"继续"，应追加20分钟

---

## 实施规格：P-05 番茄退出损失框架确认

**修改文件**：app.js

**新增数据字段**：无

**新增DOM元素**：无（复用现有confirm/toast机制）

**新增/修改函数**：
```
// 修改现有重置/放弃逻辑中的确认弹窗
confirmResetPomodoro()   // 替换原有的重置确认逻辑
// 核心变更：计算已专注分钟数，组装损失框架文案
// "你已经专注了{elapsed}分钟，放弃则这{elapsed}分钟不计入今日完成 ⚠️"
// 番茄进度>50%时追加"还剩{remaining}分钟就能完成一个番茄！"
// 按钮顺序：[继续专注](primary) + [放弃番茄](secondary/灰色)
```

**调用位置**：重置按钮的click handler中，替换原有confirm逻辑

**缓存版本升级**：同上

**验证方法**：
1. 启动一个番茄钟
2. 等待1-2分钟后点击重置
3. 应看到损失框架确认文案（非中性确认）
4. 主按钮应为"继续专注"（高亮），次按钮为"放弃番茄"（灰色）
5. 进度>50%时应有额外鼓励文案

---

## 实施规格：P-06 胜任感进步仪表盘

**修改文件**：app.js / index.html / style.css

**新增数据字段**：复用P-02的`streakCache.personalBest`，不额外增加

**新增DOM元素**：
```html
<!-- index.html: stats-view 内部，现有统计卡片区域 -->
<div class="stats-progress" id="stats-progress">
  <div class="progress-compare" id="progress-compare">
    <span class="compare-label">本周 vs 上周</span>
    <span class="compare-value" id="compare-value"></span>
  </div>
  <div class="progress-best" id="progress-best">
    <span>🏆 个人最佳: 单日<span id="best-daily-count">0</span>个番茄</span>
  </div>
  <div class="progress-total" id="progress-total">
    <span>⏱️ 累计专注 <span id="total-hours">0</span> 小时</span>
  </div>
</div>
```

**新增/修改函数**：
```
renderProgressDashboard()  // 渲染进步仪表盘（调用位置：renderStats内部）
calculateWeeklyCompare()   // 计算本周vs上周番茄数对比
calculateTotalHours()      // 计算累计专注小时数
```

**缓存版本升级**：同上

**验证方法**：
1. 完成几个番茄
2. 打开统计Tab，应显示"进步概览"卡片
3. 本周/上周对比箭头方向正确
4. 累计小时数与sessions记录一致

---

# 附录：实施优先级总表

| 编号 | 功能 | 优先级 | 复杂度 | 涉及差距 |
|------|------|--------|--------|---------|
| P-01 | 每日启动规划 | P0 | ⭐⭐ | G3,G8,G19 |
| P-02 | 习惯连续打卡 | P0 | ⭐⭐ | G1,G2,G14 |
| P-03 | 休息引导 | P0 | ⭐⭐ | G21,G22 |
| P-04 | 逾期5分钟启动 | P0 | ⭐ | G4,G6 |
| P-05 | 番茄退出损失确认 | P0 | ⭐ | G13 |
| P-06 | 胜任感进步仪表盘 | P0 | ⭐⭐ | G14,G23 |
| P-07 | 智能默认值 | P1 | ⭐ | G12,G15,G20 |
| P-08 | 新用户方法论引导 | P1 | ⭐⭐ | G15,G25 |
| P-09 | 任务拆解引导 | P1 | ⭐ | G7,G16 |
| P-10 | 深度工作模式 | P1 | ⭐ | G9,G22 |
| P-11 | 复习提醒 | P1 | ⭐⭐⭐ | G11 |
| P-12 | 番茄进行中目标显示 | P2 | ⭐ | G10 |
| P-13 | 收件箱清零助推 | P2 | ⭐ | G18 |
| P-14 | 每日回顾 | P2 | ⭐⭐ | G8,G14,G23 |
| P-15 | 预估vs实际对比 | P2 | ⭐⭐ | G5,G14,G23 |

---

# 实施路线图

**Phase 1（立即）**：P-04 + P-05 + P-07 — 低复杂度高价值，1-2天可完成  
**Phase 2（本周）**：P-01 + P-02 + P-06 — 核心新功能，3-5天  
**Phase 3（下周）**：P-03 + P-08 + P-09 + P-10 — 体验优化，3-4天  
**Phase 4（后续）**：P-11 + P-12~15 — 高复杂度/P2功能，按需排