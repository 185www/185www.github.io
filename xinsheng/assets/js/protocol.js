// 21-Day Evidence-Based Intervention Protocol
// Techniques used:
//   MI: Motivational Interviewing (open questions, reflections, affirmations, summaries)
//   CBT: Cognitive Behavioral Therapy (cognitive restructuring, behavioral activation)
//   ACT: Acceptance and Commitment Therapy (values clarification, committed action)
//   BCT: Behavior Change Technique Taxonomy (Michie et al. 2013)
//   II: Implementation Intentions (Gollwitzer 1999)
//   SDT: Self-Determination Theory (autonomy, competence, relatedness)

(function(){
  // ─── Session 0: Onboarding — Values & Discrepancy (MI) ───
  var S0 = [
    {
      id:'welcome',
      coach:'你好。我不是来教你该怎么生活的。\n\n我是来陪你聊聊的。你愿意花几分钟跟我聊聊吗？',
      options:[
        {text:'行，聊聊就聊聊',next:'why'},
        {text:'我没什么好聊的',next:'resist'}
      ]
    },
    {
      id:'resist',
      coach:'我理解。很多人都觉得自己没什么好聊的。\n\n那这样——你能不能帮我一个小忙？就当是帮别人看看这个工具好不好用。你愿意吗？',
      options:[
        {text:'好吧，帮你看看',next:'why'},
        {text:'算了',next:'exit'}
      ]
    },
    {
      id:'exit',
      coach:'没关系。如果你想聊了，随时回来。\n\n祝你身体健康。',
      options:[]
    },
    {
      id:'why',
      coach:'好，那我先问你一个问题。\n\n在你这个年纪，你觉得什么对你来说最重要？',
      options:[
        {text:'家人的幸福',next:'value_family',effect:function(){XS.setValue('family')}},
        {text:'自己的健康',next:'value_health',effect:function(){XS.setValue('health')}},
        {text:'活得有尊严',next:'value_dignity',effect:function(){XS.setValue('dignity')}},
        {text:'看着孩子成家立业',next:'value_child',effect:function(){XS.setValue('child')}}
      ]
    },
    {
      id:'value_family',
      coach:'家人的幸福，对吧。\n\n那我想问你一个问题——你觉得你现在每天抽烟/喝酒的习惯，对家人的幸福有影响吗？\n\n不用回答我，你自己心里想想就行。',
      options:[
        {text:'有点影响',next:'reflect_family'},
        {text:'没什么影响',next:'reflect_family'},
        {text:'我没想过这个问题',next:'reflect_family'}
      ]
    },
    {
      id:'reflect_family',
      coach:'嗯。\n\n你知道吗，二手烟让家人肺癌风险增加30%。你带给他们的不只是烟雾，还有担心。\n\n你儿子/女儿可能从来不说，但他们每天都在担心你。',
      options:[
        {text:'⋯⋯',next:'affirm_family'}
      ]
    },
    {
      id:'affirm_family',
      coach:'但你刚才说了，家人的幸福对你很重要。\n\n这说明你是一个在乎家人的人。你只是需要一个更好的方法来在乎他们。\n\n我说的对吗？',
      options:[
        {text:'对',next:'pivot1'},
        {text:'可能吧',next:'pivot1'}
      ]
    },
    {
      id:'value_health',
      coach:'健康，对吧。\n\n但你知道吗，中国有超过3亿人抽烟，其中70%的人都说自己"想戒但戒不掉"。\n\n他们不是不想健康——他们只是被困住了。',
      options:[
        {text:'我也是这样',next:'reflect_health'},
        {text:'我还没到那个程度',next:'reflect_health'}
      ]
    },
    {
      id:'reflect_health',
      coach:'嗯。\n\n你说健康对你很重要。那你觉得，你现在的习惯跟"健康"之间，有没有什么矛盾？\n\n不用回答我，只是让你想一想。',
      options:[
        {text:'有点矛盾',next:'affirm_health'},
        {text:'没什么矛盾',next:'affirm_health'}
      ]
    },
    {
      id:'affirm_health',
      coach:'你能承认这一点，其实挺不容易的。很多人连想都不愿意想。\n\n这说明你是一个诚实面对自己的人。',
      options:[
        {text:'⋯⋯',next:'pivot1'}
      ]
    },
    {
      id:'value_dignity',
      coach:'活得有尊严。\n\n那我想问你一个问题——你觉得一个人到了晚年，不能控制自己的身体，离不开烟酒，这算不算有尊严？',
      options:[
        {text:'不算',next:'reflect_dignity'},
        {text:'我没想过',next:'reflect_dignity'}
      ]
    },
    {
      id:'reflect_dignity',
      coach:'嗯。尊严不是别人给的，是自己守住的。\n\n你每天抽的每一根烟、喝的每一杯酒，其实都在一点点拿走你的选择权。\n\n到最后不是你在选择抽烟，而是烟在控制你。',
      options:[
        {text:'⋯⋯你说得对',next:'affirm_dignity'}
      ]
    },
    {
      id:'affirm_dignity',
      coach:'但你能说出"活得有尊严"，说明你心里还有那个不想被控制的人。\n\n那个人还在。',
      options:[
        {text:'⋯⋯',next:'pivot1'}
      ]
    },
    {
      id:'value_child',
      coach:'看着孩子成家立业。\n\n那我问你一个有点直接的问题——你觉得你现在的身体状态，能保证你看到那一天吗？',
      options:[
        {text:'不好说',next:'reflect_child'},
        {text:'应该可以吧',next:'reflect_child'}
      ]
    },
    {
      id:'reflect_child',
      coach:'我说个数据吧。每天抽一包烟的人，平均寿命比不抽烟的人短10年。\n\n10年。你可能错过孩子的婚礼，错过孙子的出生，错过很多你盼了一辈子的东西。',
      options:[
        {text:'⋯⋯',next:'affirm_child'}
      ]
    },
    {
      id:'affirm_child',
      coach:'但你在乎这些事情。这说明你是一个心里装着家人的人。\n\n你不是不想活到那一天——你只是需要有人帮你一把。',
      options:[
        {text:'⋯⋯',next:'pivot1'}
      ]
    },
    {
      id:'pivot1',
      coach:'我不是要你今天就把烟酒全戒了。那是你的选择，我不会替你做。\n\n但我可以问你一个问题吗？',
      options:[
        {text:'你问吧',next:'readiness'}
      ]
    },
    {
      id:'readiness',
      coach:'如果有一个方法，能让你在不失去生活乐趣的同时，也让家人少担心一些——\n\n你愿意试一试吗？哪怕只是很小的一步。',
      options:[
        {text:'愿意试试',next:'commit_small',effect:function(){XS.setReadiness('ready')}},
        {text:'我没信心',next:'confidence',effect:function(){XS.setReadiness('low')}},
        {text:'我觉得没必要',next:'no_need',effect:function(){XS.setReadiness('no')}}
      ]
    },
    {
      id:'confidence',
      coach:'我理解。很多人不是不想，而是试过太多次都失败了。\n\n但这不是你的问题——戒烟戒酒本来就很难，比你想象的要难得多。科学研究显示，平均要尝试6-7次才能成功。\n\n所以"失败"不是你的错，是这个过程的正常部分。',
      options:[
        {text:'那我再试试？',next:'commit_small'},
        {text:'算了',next:'exit_kind'}
      ]
    },
    {
      id:'no_need',
      coach:'你觉得没必要，对吧。那是你的判断，我尊重。\n\n但我想问你最后一个问题——如果有一天你真的因为抽烟喝酒进了医院，你觉得谁会是第一个哭的人？',
      options:[
        {text:'⋯⋯',next:'commit_small'}
      ]
    },
    {
      id:'commit_small',
      coach:'好。那我们不做大的承诺。就做一件很小的事——\n\n明天，你能不能比平时少抽一根烟？或少喝一杯酒？或少刷10分钟手机？\n\n就一天。就一点点。试试看。',
      options:[
        {text:'好，我试试',next:'onboard_done',effect:function(){XS.completeSession(0); XS.scheduleNext()}},
        {text:'我做不到',next:'even_smaller'}
      ]
    },
    {
      id:'even_smaller',
      coach:'那更小一点：明天你每次想抽烟的时候，先等5分钟再抽。\n\n就这个。这个能做到吗？',
      options:[
        {text:'这个可以',next:'onboard_done',effect:function(){XS.completeSession(0); XS.scheduleNext()}},
        {text:'这个也不行',next:'accept_resist'}
      ]
    },
    {
      id:'accept_resist',
      coach:'没关系。有些人需要更多时间。\n\n那你愿不愿意明天只是"观察"自己——不改变任何习惯，只是注意一下：你什么时候会想抽烟/喝酒/刷手机？\n\n只是看看，不做任何改变。',
      options:[
        {text:'只是看看，可以',next:'onboard_done',effect:function(){XS.completeSession(0); XS.scheduleNext()}},
        {text:'不行',next:'exit_kind'}
      ]
    },
    {
      id:'exit_kind',
      coach:'好的，我听到了。\n\n不管你什么时候想聊，我都在这里。\n\n祝你身体健康。',
      options:[]
    },
    {
      id:'onboard_done',
      coach:'谢谢你的信任。\n\n明天我来找你，到时候我们再聊。\n\n记住：你不需要一次性改变所有事情。\n\n只需要迈出最小的一步。',
      options:[]
    }
  ]

  // ─── Session 1: Cue Awareness (CBT + Self-Monitoring) ───
  var S1 = [
    {
      id:'s1_greet',
      coach:'你好。昨天你答应我试试看——今天感觉怎么样？',
      options:[
        {text:'还不错，试了一下',next:'s1_well'},
        {text:'没做到，还是老样子',next:'s1_struggle'},
        {text:'我没试',next:'s1_notry'}
      ]
    },
    {
      id:'s1_well',
      coach:'不管做到了多少，哪怕只是少了一点点，都是进步。\n\n我想问你一个问题——你一般在什么情况下最想抽烟/喝酒/刷手机？',
      options:[
        {text:'吃完饭的时候',next:'s1_cue_meal',effect:function(){XS.addTrigger('meal')}},
        {text:'跟朋友在一起的时候',next:'s1_cue_social',effect:function(){XS.addTrigger('social')}},
        {text:'觉得无聊/没意思的时候',next:'s1_cue_bored',effect:function(){XS.addTrigger('bored')}},
        {text:'心情不好的时候',next:'s1_cue_stress',effect:function(){XS.addTrigger('stress')}}
      ]
    },
    {
      id:'s1_struggle',
      coach:'没做到很正常的。科学研究发现，大多数人在真正改变之前，平均试过6-7次。\n\n你不是"失败了"，你只是在积累经验。\n\n不过我好奇的是——你一般在什么情况下最想抽烟/喝酒/刷手机？',
      options:[
        {text:'吃完饭的时候',next:'s1_cue_meal',effect:function(){XS.addTrigger('meal')}},
        {text:'跟朋友在一起的时候',next:'s1_cue_social',effect:function(){XS.addTrigger('social')}},
        {text:'觉得无聊的时候',next:'s1_cue_bored',effect:function(){XS.addTrigger('bored')}},
        {text:'心情不好的时候',next:'s1_cue_stress',effect:function(){XS.addTrigger('stress')}}
      ]
    },
    {
      id:'s1_notry',
      coach:'没关系。你在做出改变之前，先"观察"自己也是一种进步。\n\n我今天想问你一个问题——你一般在什么情况下最想抽烟/喝酒/刷手机？',
      options:[
        {text:'吃完饭',next:'s1_cue_meal',effect:function(){XS.addTrigger('meal')}},
        {text:'跟人在一起',next:'s1_cue_social',effect:function(){XS.addTrigger('social')}},
        {text:'无聊的时候',next:'s1_cue_bored',effect:function(){XS.addTrigger('bored')}},
        {text:'心情不好',next:'s1_cue_stress',effect:function(){XS.addTrigger('stress')}}
      ]
    },
    {
      id:'s1_cue_meal',
      coach:'饭后一根烟/一杯酒，对吧。\n\n这是最典型的习惯回路：吃饭（触发）→ 抽烟/喝酒（行为）→ 满足感（奖励）。\n\n你知道吗，这个回路已经被研究透了。神经科学研究显示，这个回路一旦形成，你的大脑会自动执行它，甚至不需要你"决定"去抽。就像条件反射。',
      options:[
        {text:'对，就是条件反射',next:'s1_replace'},
        {text:'那我怎么办？',next:'s1_replace'}
      ]
    },
    {
      id:'s1_cue_social',
      coach:'社交场合，是吧。因为你"不抽烟不喝酒"就显得不合群。\n\n这里面有个心理学概念叫"社会规范"——你觉得所有人都这样，所以你也这样。\n\n但你知道吗？其实很多人也想少抽少喝，只是没人敢先开口。\n\n如果你说"我开车来的"或者"医生不让喝了"，大多数人不会劝你。他们可能反而佩服你。',
      options:[
        {text:'有道理',next:'s1_replace'},
        {text:'但面子过不去',next:'s1_face'}
      ]
    },
    {
      id:'s1_face',
      coach:'面子问题，我理解。在中国文化里，拒绝劝酒确实不容易。\n\n但你想过一个角度没有——"能控制自己的人，才是真正有面子的人。"\n\n那些被烟酒控制的人，其实是最没面子的。',
      options:[
        {text:'⋯⋯这个角度我没想过',next:'s1_replace'}
      ]
    },
    {
      id:'s1_cue_bored',
      coach:'无聊的时候，对吧。\n\n这就是典型的"时间填补"行为。不是因为你真的需要烟酒或手机，而是因为你的大脑习惯了用它们来填充空白时间。\n\n就像按一下开关——无聊 → 掏出手机/点烟。中间没有任何思考。',
      options:[
        {text:'确实是这样',next:'s1_replace'}
      ]
    },
    {
      id:'s1_cue_stress',
      coach:'心情不好的时候，对吧。\n\n这个最难。因为烟酒确实能暂时让你感觉好一点——这是化学作用。\n\n但问题在于：等化学作用过去之后，你的压力不但没解决，还多了"我又抽了"的愧疚感。\n\n所以不是"抽烟解压"，而是"抽烟制造了更多压力"。',
      options:[
        {text:'嗯⋯⋯',next:'s1_replace'}
      ]
    },
    {
      id:'s1_replace',
      coach:'那我们来做一个简单的"替换计划"。\n\n你刚才说你在【特定场景】最想抽烟/喝酒/刷手机。\n\n下次再遇到这个场景的时候，你愿意试着换一个动作吗？\n\n不是"不做了"，而是"换成另一个"。',
      options:[
        {text:'换什么？',next:'s1_alt_suggest'}
      ]
    },
    {
      id:'s1_alt_suggest',
      coach:'我推荐几个选项，你选一个你觉得最可行的：',
      options:[
        {text:'嚼口香糖替代抽烟',next:'s1_plan',effect:function(){XS.setAlt('gum')}},
        {text:'以茶代酒',next:'s1_plan',effect:function(){XS.setAlt('tea')}},
        {text:'出去走5分钟',next:'s1_plan',effect:function(){XS.setAlt('walk')}},
        {text:'深呼吸3次再决定',next:'s1_plan',effect:function(){XS.setAlt('breathe')}}
      ]
    },
    {
      id:'s1_plan',
      coach:'好。那我们约定一个"如果-那么"计划：\n\n"如果【触发场景】发生，那么我就【替代行为】。"\n\n你愿意把这个计划记在心里吗？不用保证每次都做到——只要试着想起来就行。',
      options:[
        {text:'好，我记住了',next:'s1_done',effect:function(){XS.completeSession(1); XS.scheduleNext()}},
        {text:'我试试',next:'s1_done',effect:function(){XS.completeSession(1); XS.scheduleNext()}}
      ]
    },
    {
      id:'s1_done',
      coach:'很好。你已经完成了两件事：\n\n1️⃣ 你找到了自己的触发场景\n2️⃣ 你制定了一个替换计划\n\n这两步已经在科学研究中被证明能显著提高行为改变的成功率。\n\n明天我再来找你。祝你顺利。',
      options:[]
    }
  ]

  // ─── Session 2: If-Then Planning & Barriers (Implementation Intentions) ───
  var S2 = [
    {
      id:'s2_greet',
      coach:'你好。昨天我们做了那个"如果-那么"计划。你试过了吗？',
      options:[
        {text:'试了，成功了',next:'s2_win'},
        {text:'试了，但没坚持住',next:'s2_barrier'},
        {text:'没想起来做',next:'s2_forgot'}
      ]
    },
    {
      id:'s2_win',
      coach:'太好了！很多人觉得第一步是最难的。你做到了。\n\n我想让你记住这个感觉——你靠自己的意志力做到了。不是你依赖的东西控制了你，而是你控制了自己。',
      options:[
        {text:'嗯，感觉还不错',next:'s2_next'}
      ]
    },
    {
      id:'s2_barrier',
      coach:'没坚持住很正常。大多数人在形成新习惯之前都会经历这个过程。\n\n你能告诉我是什么让你没坚持住吗？',
      options:[
        {text:'诱惑太大了',next:'s2_craving'},
        {text:'忘了要做什么替代',next:'s2_forgot'},
        {text:'情绪一上来就控制不住',next:'s2_emotion'}
      ]
    },
    {
      id:'s2_forgot',
      coach:'忘记做替代行为，这是最常见的障碍。因为旧习惯是自动化的，新习惯需要主动回忆。\n\n有一个心理学技巧叫"实施意向"——你需要在触发的时候有一个明确的提示。\n\n比如：把口香糖放在烟盒旁边。把茶杯放在酒瓶前面。在手机屏保上写"先呼吸"。',
      options:[
        {text:'这个办法不错',next:'s2_next'}
      ]
    },
    {
      id:'s2_craving',
      coach:'渴求感确实很强。神经科学研究显示，渴求感本质上是大脑的"预期奖励"机制——你的大脑以为你要得到奖励了，所以释放了大量驱使你行动的信号。\n\n但关键事实是：渴求感通常只持续10-20分钟。如果你能熬过这20分钟，它就自然消退了。\n\n就像海浪——会来，也会走。',
      options:[
        {text:'那我怎么熬过那20分钟？',next:'s2_distract'}
      ]
    },
    {
      id:'s2_emotion',
      coach:'情绪驱动是最难应对的。因为烟酒在化学层面确实能暂时缓解情绪——这是它们"骗"你的方式。\n\n但替代方法有：\n• 大声说出你的感受（"我现在很烦躁"）\n• 给家人打一个电话\n• 用冷水洗脸\n• 做10个深呼吸\n\n下次情绪上来的时候，先试一个。',
      options:[
        {text:'好，我记住了',next:'s2_next'}
      ]
    },
    {
      id:'s2_distract',
      coach:'好问题。这里有几个研究验证有效的策略：\n\n1. 做一件需要双手的事（拼图、盘手串、叠衣服）\n2. 给自己计时："我只忍耐3分钟"——3分钟后再说\n3. 想象一个红色停止标志 🛑\n4. 换个环境——走到另一个房间\n\n选一个你明天准备试的：',
      options:[
        {text:'需要双手的事',next:'s2_next',effect:function(){XS.setCoping('hands')}},
        {text:'忍耐3分钟',next:'s2_next',effect:function(){XS.setCoping('wait')}},
        {text:'想象停止标志',next:'s2_next',effect:function(){XS.setCoping('stop')}},
        {text:'换个环境',next:'s2_next',effect:function(){XS.setCoping('move')}}
      ]
    },
    {
      id:'s2_next',
      coach:'好。那我们来制定下一步的目标。\n\n你现在在哪个方面最想做出改变？',
      options:[
        {text:'想减少抽烟量',next:'s2_goal_smoke',effect:function(){XS.setFocus('smoke')}},
        {text:'想减少喝酒',next:'s2_goal_alcohol',effect:function(){XS.setFocus('alcohol')}},
        {text:'想减少刷手机',next:'s2_goal_video',effect:function(){XS.setFocus('video')}},
        {text:'都想试试',next:'s2_goal_all',effect:function(){XS.setFocus('all')}}
      ]
    },
    {
      id:'s2_goal_smoke',
      coach:'好。那我们定一个具体的、很小的目标：\n\n"明天比平时少抽3根烟。"\n\n就这个。不多不少。你觉得能做到吗？',
      options:[
        {text:'可以',next:'s2_done'},
        {text:'少1根吧',next:'s2_done'}
      ]
    },
    {
      id:'s2_goal_alcohol',
      coach:'好。那我们定一个具体的、很小的目标：\n\n"明天喝酒的时候，每杯之间喝一杯水。"\n\n就这个。不多不少。你觉得能做到吗？',
      options:[
        {text:'可以',next:'s2_done'},
        {text:'我试试',next:'s2_done'}
      ]
    },
    {
      id:'s2_goal_video',
      coach:'好。那我们定一个具体的、很小的目标：\n\n"明天睡前30分钟不碰手机。"\n\n就这个。不多不少。你觉得能做到吗？',
      options:[
        {text:'可以',next:'s2_done'},
        {text:'15分钟吧',next:'s2_done'}
      ]
    },
    {
      id:'s2_goal_all',
      coach:'好。那我们先从一个开始——选一个你最想改变的：',
      options:[
        {text:'抽烟',next:'s2_goal_smoke',effect:function(){XS.setFocus('smoke')}},
        {text:'喝酒',next:'s2_goal_alcohol',effect:function(){XS.setFocus('alcohol')}},
        {text:'刷手机',next:'s2_goal_video',effect:function(){XS.setFocus('video')}}
      ]
    },
    {
      id:'s2_done',
      coach:'好。记住我们今天做的几件事：\n\n✅ 你知道了自己的障碍在哪\n✅ 你选了一个应对策略\n✅ 你定了一个具体的小目标\n\n明天我再来找你。一步一步来。',
      options:[]
    }
  ]

  // ─── Daily Micro-Interventions (Days 3-21) ───────────
  var dailyInterventions = [
    {day:3, id:'d3',
      coach:'你好。今天只想问你一个问题：\n\n昨天你做到了吗？\n\n不管答案是"是"还是"不是"，都不重要。重要的是你还在想这件事，你已经比大多数人多走了一步。',
      options:[
        {text:'做到了',next:'d3_done',effect:function(){XS.addCheckin({success:true})}},
        {text:'没做到',next:'d3_fail',effect:function(){XS.addCheckin({success:false})}}
      ]
    },
    {day:3, id:'d3_done',
      coach:'好。你今天感觉怎么样？有没有什么新的发现？',
      options:[
        {text:'感觉还不错',next:'d3_end'},
        {text:'有点难',next:'d3_end'}
      ]
    },
    {day:3, id:'d3_fail',
      coach:'没关系。允许自己"不完美"是很重要的一步。\n\n很多人犯了一个错误：一旦没做到，就觉得"反正已经失败了，今天就放弃吧"。\n\n这叫"破罐子破摔效应"。它是改变最大的敌人。\n\n记住：少抽一根也是胜利。少喝一口也是进步。不是"全有或全无"。',
      options:[
        {text:'有道理',next:'d3_end'}
      ]
    },
    {day:3, id:'d3_end',
      coach:'明天继续。不用做到完美，做到"进步"就行。',
      options:[]
    },

    {day:4, id:'d4',
      coach:'今天我们来做一个简短的练习——"自我肯定"。\n\n回想一下，最近有没有一次你成功控制住自己的时刻？哪怕是小事。\n\n比如：你想抽烟但没有抽。你想发火但忍住了。你没吃那个甜点。\n\n你做到了什么？',
      options:[
        {text:'少抽了一根烟',next:'d4_reframe'},
        {text:'拒绝了劝酒',next:'d4_reframe'},
        {text:'没刷那么久手机',next:'d4_reframe'},
        {text:'想不起来了',next:'d4_reframe'}
      ]
    },
    {day:4, id:'d4_reframe',
      coach:'那一次你做到了。\n\n这意味着什么？意味着你有能力控制自己。不是"你也许会"，而是"你曾经做到过"。\n\n你已经有了这个能力，你只是需要多练习几次。',
      options:[
        {text:'嗯⋯⋯',next:'d4_end'}
      ]
    },
    {day:4, id:'d4_end',
      coach:'今天就到这里。记住你曾经做到过的那一次。\n\n你能做到一次，就能做到第二次。',
      options:[]
    },

    {day:5, id:'d5',
      coach:'今天我们来谈谈"替代"。\n\n我想让你想一样东西——一样你喜欢的东西，能给你带来愉悦感，又不是烟酒手机。\n\n是什么？',
      options:[
        {text:'喝茶',next:'d5_link'},
        {text:'散步',next:'d5_link'},
        {text:'听戏/听音乐',next:'d5_link'},
        {text:'跟人聊天',next:'d5_link'},
        {text:'想不出来',next:'d5_explore'}
      ]
    },
    {day:5, id:'d5_explore',
      coach:'很多人想不出来，因为烟酒已经占据了所有的愉悦通道。\n\n那你有没有什么事情，做的时候会让你忘记时间？\n\n比如：下棋？钓鱼？养花？看球？',
      options:[
        {text:'下棋',next:'d5_link',effect:function(){XS.setAlt('chess')}},
        {text:'钓鱼',next:'d5_link',effect:function(){XS.setAlt('fish')}},
        {text:'养花',next:'d5_link',effect:function(){XS.setAlt('garden')}},
        {text:'看球',next:'d5_link',effect:function(){XS.setAlt('sports')}}
      ]
    },
    {day:5, id:'d5_link',
      coach:'好。那今天的小任务是：\n\n当你下次想抽烟/喝酒/刷手机的时候，先去做那件事5分钟。\n\n不是"代替"，而是"先做5分钟"。之后再决定要不要回到老习惯。\n\n试试看。',
      options:[
        {text:'好，我试试',next:'d5_end'}
      ]
    },
    {day:5, id:'d5_end',
      coach:'记住：你喜欢的那些事情才是真正属于你的。烟酒不是。',
      options:[]
    },

    {day:6, id:'d6',
      coach:'今天我们来谈一个很实际的问题。\n\n如果有人劝你抽烟/喝酒，你怎么说？\n\n我给你几个选项：',
      options:[
        {text:'我开车来的',next:'d6_roleplay'},
        {text:'医生不让喝了',next:'d6_roleplay'},
        {text:'最近身体不舒服',next:'d6_roleplay'},
        {text:'准备要孩子（或者孩子要孩子了）',next:'d6_roleplay'}
      ]
    },
    {day:6, id:'d6_roleplay',
      coach:'好。你选了这个。\n\n现在想象一下这个场景：你端着茶杯，有人问你"怎么不喝酒？"\n\n你就说："开车来的，下次。"\n\n简单。不用解释。不用道歉。\n\n你能不能现在就练习说一遍？',
      options:[
        {text:'（在心里说了一遍）',next:'d6_end'},
        {text:'说出来有点别扭',next:'d6_practice'}
      ]
    },
    {day:6, id:'d6_practice',
      coach:'第一次说确实别扭。但你多说几次就习惯了。\n\n你要不要换一个你觉得更自然的说法？',
      options:[
        {text:'医生不让喝了',next:'d6_end'},
        {text:'最近在调理身体',next:'d6_end'}
      ]
    },
    {day:6, id:'d6_end',
      coach:'记住：说"不"不需要理由。但有一个理由会让你更自在。\n\n你已经准备好了。',
      options:[]
    },

    {day:7, id:'d7',
      coach:'你已经坚持一周了。\n\n不管你做没做到，你在这一周里一直在想这件事。这本身就是巨大的进步。\n\n我今天想让你做一个简单的决定：\n\n你愿不愿意给自己一个"7天健康身份"？\n\n就是对自己说一句："我是一个在乎自己的人。"\n\n不用告诉别人。就你自己知道。',
      options:[
        {text:'好，我对自己说',next:'d7_done',effect:function(){XS.unlockIdentity(1)}},
        {text:'我觉得还没到那个程度',next:'d7_notyet'}
      ]
    },
    {day:7, id:'d7_notyet',
      coach:'没关系。身份转变需要时间。\n\n那我换一个问题：你觉得一个"在乎自己的人"会怎么做？\n\n不用回答我。只是想一想。',
      options:[
        {text:'⋯⋯我在想',next:'d7_done'}
      ]
    },
    {day:7, id:'d7_done',
      coach:'你已经走完了第一周。\n\n很多人连第一周都做不到——不是因为你做不到，而是因为他们根本没开始。\n\n你已经开始了。这比大多数人强。',
      options:[]
    },

    // Days 8-14: Compressed examples (would extend in production)
    {day:8, id:'d8',
      coach:'今天我们来做一个"环境设计"练习。\n\n你有没有注意到，有些环境会让你更容易抽烟喝酒？\n\n比如：茶几上的烟灰缸、酒柜里的酒瓶、枕头边的充电器。\n\n这些"视觉提示"会无意识地触发你的习惯。\n\n今天的任务：把其中一个提示物移走。只移走一个就行。',
      options:[
        {text:'好，我移走烟灰缸',next:'d8_end'},
        {text:'好，我把酒藏起来',next:'d8_end'},
        {text:'好，我把充电器放远点',next:'d8_end'}
      ]
    },
    {day:8, id:'d8_end',
      coach:'环境设计是行为改变中最被低估的方法之一。因为你的大脑会对外界提示做出自动反应。移除提示 = 减少一半的诱惑。',
      options:[]
    },

    {day:9, id:'d9',
      coach:'今天我们来做一个对比。\n\n把你现在每天花在烟酒手机上的钱，换算一下：\n\n一周 = ？\n一个月 = ？\n一年 = ？\n\n你每天省下的钱，其实都是在给自己攒"健康本金"。\n\n不用告诉我数字。自己心里算算就行。',
      options:[
        {text:'算出来了，挺多的',next:'d9_done'},
        {text:'没仔细算过',next:'d9_done'}
      ]
    },
    {day:9, id:'d9_done',
      coach:'有时候看到一个具体的数字，比听一百句道理都管用。',
      options:[]
    },

    {day:10, id:'d10',
      coach:'今天我们来做一个正念练习。\n\n下次你想抽烟/喝酒/刷手机的时候，先停下来，感受一下：\n\n• 你身体哪里最紧张？\n• 你现在的情绪是什么？\n• 你的呼吸是深还是浅？\n\n不要评判，只是观察。\n\n这个过程本身就打断了习惯回路。',
      options:[
        {text:'好，我试试观察',next:'d10_end'}
      ]
    },
    {day:10, id:'d10_end',
      coach:'仅仅10秒的觉察，就能让你从"自动模式"切换到"选择模式"。',
      options:[]
    },

    {day:11, id:'d11',
      coach:'今天是我们认识的第11天。\n\n如果让你回顾这些天，你觉得自己最大的变化是什么？\n\n哪怕很小的变化也算。',
      options:[
        {text:'开始注意到自己的习惯了',next:'d11_end'},
        {text:'偶尔能控制住了',next:'d11_end'},
        {text:'没什么变化',next:'d11_nope'}
      ]
    },
    {day:11, id:'d11_nope',
      coach:'没有变化也是一种信息。不是说"你不行"，而是"目前的方法对你不太合适"。\n\n那我们换个角度——你觉得什么方式对你可能更有效？',
      options:[
        {text:'需要更强的理由',next:'d11_end'},
        {text:'需要有人监督',next:'d11_end'},
        {text:'需要更简单的方法',next:'d11_end'}
      ]
    },
    {day:11, id:'d11_end',
      coach:'你已经在反思了。反思本身就是改变的一部分。',
      options:[]
    },

    {day:12, id:'d12',
      coach:'今天我们来谈谈"复发预防"。\n\n万一哪天你没控制住——比如抽了一根、喝了一杯、刷了一小时——你会怎么做？',
      options:[
        {text:'告诉自己没关系，明天继续',next:'d12_good'},
        {text:'觉得自己失败了',next:'d12_reframe'},
        {text:'干脆放弃',next:'d12_reframe'}
      ]
    },
    {day:12, id:'d12_reframe',
      coach:'很多人都有这个反应。但这个反应是改变最大的敌人。\n\n心理学上这叫"违反禁戒效应"(Abstinence Violation Effect)——就是"既然我已经破戒了，那不如彻底放弃"的想法。\n\n但真相是：一次破戒 ≠ 失败。\n\n一次破戒只是整个过程中的一个小波折。就像开车遇到一个坑，不代表你要把车扔掉。',
      options:[
        {text:'有道理',next:'d12_good'}
      ]
    },
    {day:12, id:'d12_good',
      coach:'好。那我想让你现在对自己说一句话：\n\n"就算我今天没做好，明天我还可以重新开始。"\n\n说一遍。',
      options:[
        {text:'（在心里说了一遍）',next:'d12_end'}
      ]
    },
    {day:12, id:'d12_end',
      coach:'记住这句话。它会是你最强大的工具。',
      options:[]
    },

    {day:13, id:'d13',
      coach:'今天做一个"未来自我"练习。\n\n闭上眼睛，想象一下：\n\n如果一年后的你，已经完全戒掉了烟酒、不再沉迷手机——\n\n他看起来怎么样？\n• 气色更好\n• 走路更稳\n• 说话更有底气\n• 家人看他的眼神不一样了\n\n你能不能为那个"未来的你"，做一件今天的小事？',
      options:[
        {text:'我愿意',next:'d13_end'},
        {text:'想象不出来',next:'d13_try'}
      ]
    },
    {day:13, id:'d13_try',
      coach:'那换个简单的：\n\n你希望你的孩子/孙子怎么描述你？\n\n"我爸爸是个⋯⋯"',
      options:[
        {text:'健康的人',next:'d13_end'},
        {text:'坚强的人',next:'d13_end'},
        {text:'负责任的人',next:'d13_end'}
      ]
    },
    {day:13, id:'d13_end',
      coach:'那今天为那个形象做一件事。哪怕只是一件很小的事。',
      options:[]
    },

    {day:14, id:'d14',
      coach:'你已经走了14天。\n\n两周。\n\n在行为改变的研究中，14天是一个重要的里程碑——这时候旧的神经回路开始减弱，新的回路开始形成。\n\n你今天值得对自己说一句：'我在改变。'",
      options:[
        {text:'我在改变',next:'d14_done',effect:function(){XS.unlockIdentity(2)}}
      ]
    },
    {day:14, id:'d14_done',
      coach:'是的。你在改变。\n\n两周前你打开这个页面的时候，你跟现在已经是不同的你了。\n\n下一周，我们继续。',
      options:[]
    },

    // Days 15-21: Identity consolidation
    {day:15, id:'d15',
      coach:'今天的问题很简单：\n\n你现在觉得"抽烟/喝酒/刷手机"对你来说意味着什么？\n\n还是以前那个感觉吗，还是有点不一样了？',
      options:[
        {text:'有点不一样了',next:'d15_end'},
        {text:'还是一样的',next:'d15_end'}
      ]
    },
    {day:15, id:'d15_end',
      coach:'其实答案是什么不重要。重要的是你在问自己这个问题。\n\n当你开始问自己"这对我来说意味着什么"的时候，你已经不再是被习惯控制的那个你了。',
      options:[]
    },

    {day:16, id:'d16',
      coach:'今天做一个"感恩练习"。\n\n你的身体为你工作了这么多年——即使你抽了很多烟、喝了很多酒，它依然在努力保护你。\n\n你的肝脏在帮你解毒，你的肺在帮你呼吸，你的心脏在帮你跳动。\n\n你今天能不能为你的身体做一件好事？\n\n哪怕只是喝一杯水、走几步路、早睡半小时。',
      options:[
        {text:'好，我为身体做一件事',next:'d16_end'}
      ]
    },
    {day:16, id:'d16_end',
      coach:'你的身体是你最忠实的伙伴。它从来不抛弃你。你也不要抛弃它。',
      options:[]
    },

    {day:17, id:'d17',
      coach:'今天我们来做一个"社交支持"的练习。\n\n你有没有一个可以信任的人——家人、朋友——你可以告诉TA你在尝试改变？\n\n你不需要TA帮你做什么。只是有一个人知道，就能让你的成功率大幅提高。\n\n科学研究显示，有社会支持的行为改变成功率高出50%以上。',
      options:[
        {text:'我可以告诉我老婆/老公',next:'d17_end'},
        {text:'我可以告诉我孩子',next:'d17_end'},
        {text:'我不想告诉别人',next:'d17_alone'}
      ]
    },
    {day:17, id:'d17_alone',
      coach:'不想告诉别人也没关系。\n\n但你可以换一个方式——在手机上给自己设一个每日提醒：\n\n"你今天为自己做了什么？"\n\n把它当成一个默默支持你的朋友。',
      options:[
        {text:'好，我设一个提醒',next:'d17_end'}
      ]
    },
    {day:17, id:'d17_end',
      coach:'你不必一个人扛。\n\n愿意接受帮助，也是一种力量。',
      options:[]
    },

    {day:18, id:'d18',
      coach:'今天我们来"重新定义"。\n\n"戒烟"、"戒酒"、"戒手机"——这些词听起来像是一种剥夺。你在"失去"什么。\n\n但换一个角度：你不是在"失去"烟酒，你是在"获得"自由。\n\n自由 = 不再被那个冲动控制。\n\n你觉得"自由"和"戒断"，哪个词更吸引你？',
      options:[
        {text:'自由',next:'d18_end'},
        {text:'戒断',next:'d18_end'}
      ]
    },
    {day:18, id:'d18_end',
      coach:'语言会改变我们的感受。从今天起，试着用"我选择"代替"我不能"。\n\n"我选择不抽烟" ≠ "我不能抽烟"',
      options:[]
    },

    {day:19, id:'d19',
      coach:'今天来做一个"意义"的练习。\n\n你觉得你这段时间的坚持，除了健康之外，还有什么意义？\n\n对你的家人？对你对自己的看法？对你未来的生活？',
      options:[
        {text:'给家人一个榜样',next:'d19_end'},
        {text:'证明我能做到',next:'d19_end'},
        {text:'活得更久、更好',next:'d19_end'}
      ]
    },
    {day:19, id:'d19_end',
      coach:'当你找到"为什么"的时候，"怎么做"就变得容易了。\n\n你的"为什么"是什么，你已经想过了。',
      options:[]
    },

    {day:20, id:'d20',
      coach:'第20天了。\n\n如果20天前有人告诉你，你会走到今天这一步，你信吗？',
      options:[
        {text:'不信',next:'d20_end'},
        {text:'有点信',next:'d20_end'}
      ]
    },
    {day:20, id:'d20_end',
      coach:'你比自己想象的更强大。\n\n不是因为我做了什么，是因为你一直在往前走。\n\n明天是第21天。最后一个阶段。',
      options:[]
    },

    {day:21, id:'d21',
      coach:'21天。\n\n科学研究说，21天是形成新习惯的最小周期。不管你这21天里做到了多少——\n\n你都在你的大脑里建立了新的神经通路。\n\n你已经不是21天前的你了。\n\n我想让你现在对自己说一句话——\n\n"我是一个对自己负责的人。"\n\n不是因为你现在完美了，而是因为你选择了开始。',
      options:[
        {text:'我是一个对自己负责的人',next:'d21_done',effect:function(){XS.unlockIdentity(3); XS.completeProtocol()}}
      ]
    },
    {day:21, id:'d21_done',
      coach:'21天的旅程到这里结束了。\n\n但你的旅程没有结束。\n\n你已经有了：\n✅ 知道自己为什么想改变\n✅ 知道自己的触发场景\n✅ 有替换计划\n✅ 有应对策略\n✅ 有支持系统\n✅ 有一个新的自我认知\n\n这些都不是我给你的——是你自己一步步走出来的。\n\n如果你以后需要再聊一聊，我都在这里。\n\n保重。',
      options:[]
    }
  ]

  // ─── Scheduler ──────────────────────────
  function getSessionForDay(day){
    if(day===0) return {session:'onboarding', nodes:S0}
    if(day===1) return {session:'cues', nodes:S1}
    if(day===2) return {session:'planning', nodes:S2}
    return {session:'daily', nodes:getDailyForDay(day)}
  }

  function getDailyForDay(day){
    for(var i=0;i<dailyInterventions.length;i++){
      if(dailyInterventions[i].day === day) return [dailyInterventions[i]]
    }
    return [dailyInterventions[dailyInterventions.length-1]]
  }

  window.XProtocol = {
    S0:S0, S1:S1, S2:S2,
    dailyInterventions:dailyInterventions,
    getSessionForDay:getSessionForDay,
    totalDays:21
  }
})()
