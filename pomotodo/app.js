/* Pomotodo V10 — app.js — MDA Gamification */
(function(){
'use strict';

/* ============= STATE ============= */
const STORAGE_KEY = 'pomotodo_v4';
const CIRCUMFERENCE = 2 * Math.PI * 88; // ~553.1

const defaultSettings = {
  work:25, shortBreak:5, longBreak:15, longBreakInterval:4,
  autoBreak:true, autoWork:false, restGuide:true, focusMode:true,
  celebration:true, interruptConfirm:true,
  sound:true, volume:0.7, notify:false, wakelock:false,
  theme:'light', dailyGoal:8, lockdown:false,
  sleepEnforce:true, bedtime:'23:00', winddownMinutes:30, waketime:'07:00'
};

const GAOKAO_DATE = new Date(2026, 5, 7, 9, 0, 0); // June 7, 2026 09:00
const ADHD_PROFILE = { inattention: 2.33, hyperactivity: 2.20, impulsivity: 1.25, totalScore: 37 };
const GAOKAO_EXAM_SCHEDULE = {
  '2026-06-07': [
    {time:'09:00-11:30', subject:'语文', advice:'最后3天重点看古诗文默写+作文素材，不要刷新题'},
    {time:'15:00-17:00', subject:'数学', advice:'最后3天只做选填+前2道大题，保持手感不钻难题'},
  ],
  '2026-06-08': [
    {time:'09:00-11:30', subject:'理综/文综', advice:'最后3天回归课本，看错题本，不要做新卷'},
    {time:'15:00-17:00', subject:'英语', advice:'最后3天每天做1篇完形+2篇阅读保持语感'},
  ],
};
const PRE_EXAM_DAYS = ['2026-06-04','2026-06-05','2026-06-06'];
const PRE_EXAM_BEDTIME = '22:30';
const PRE_EXAM_WINDDOWN = 60; // 60 minutes before bedtime = 21:30
const DEFAULT_DAILY_GOAL = 8;

// Helper: get gaokao days remaining
function gaokaoDaysRemaining(){
  const now = new Date();
  const examDay = new Date(2026, 5, 7);
  examDay.setHours(0,0,0,0);
  const today = new Date(now);
  today.setHours(0,0,0,0);
  return Math.max(0, Math.ceil((examDay - today) / 86400000));
}

// Helper: is today a pre-exam day (last 3 days)?
function isPreExamDay(){
  return PRE_EXAM_DAYS.includes(todayStr());
}

// Helper: get effective bedtime (special rules for last 3 days)
function getEffectiveBedtime(){
  if(isPreExamDay()) return PRE_EXAM_BEDTIME;
  return S.settings.bedtime || '23:00';
}

// Helper: get effective winddown minutes
function getEffectiveWinddown(){
  if(isPreExamDay()) return PRE_EXAM_WINDDOWN;
  return S.settings.winddownMinutes || 30;
}

let S = loadState();
let timerWorker = null;
let wakeLockSentinel = null;
let chartInstance = null;
let currentTimerId = null;

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const d = JSON.parse(raw);
      if(d && typeof d === 'object' && (d.version === 3 || d.version === 4 || d.version === 5 || d.version === 6 || d.version === 7)) return d;
    }
  }catch(e){}
  return freshState();
}

function freshState(){
  return {
    version:7,
    settings:{...defaultSettings},
    tasks:[],
    projects:[],
    sessions:[],
    pomodoroHistory:{},
    dailyFocusTasks:[],
    lastCompletedTaskId:null,
    lastCompletedCycle:0,
    showOnboarding:true,
    _lastVisitDate:null,
    _reviewedDates:{},
    _lastWeeklyReviewDate:null,
    score:0,
    distractionCount:0,
    milestones:[],
    _awayTimestamp:null,
    _yesterdayPomoCount:-1,
    _todayExceededYesterday:false,
    _prevLevel:1,
    sleepIdeas:[],
    _sleepDismissCount:0,
    _sleepDismissHistory:[],
    _sleepLog:[],
    _breathingChallengeActive:false,
    _sleepLockdownActive:false,
    _lastSleepDate:null,
    _lastSleepQuality:null,
    _sleepEnforceActive:false,
    _morningCheckDone:null,
    timer:{
      mode:'work',
      phase:'idle',
      remaining:defaultSettings.work*60,
      total:defaultSettings.work*60,
      intervalsCompleted:0,
      currentCycle:1,
      currentTaskId:null,
    }
  };
}

function saveState(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
  } catch(e) {}
}

/* ============= DOM REFS ============= */
const $ = id => document.getElementById(id);
const qs = (sel, ctx) => (ctx||document).querySelector(sel);
const qsa = (sel, ctx) => (ctx||document).querySelectorAll(sel);

/* ============= UTILITY ============= */
function fmtTime(s){
  const m = Math.floor(s/60), sec = s%60;
  return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
}

function todayStr(){
  const d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function dateStr(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function isoNow(){return new Date().toISOString();}

function toast(msg, dur=2500){
  const w = $('toast-wrap');
  const el = document.createElement('div');
  el.className='toast';
  el.textContent=msg;
  w.appendChild(el);
  setTimeout(()=>{el.remove();}, dur);
}

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}

function playSound(type, callback){
  if(!S.settings.sound) { if(callback) callback(); return; }
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    let freq = 880, dur = 0.8, waveType = 'sine';
    
    switch(type || 'complete'){
      case 'complete':
        freq = 880; dur = 0.8; waveType = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + dur);
        break;
      case 'break':
        freq = 660; dur = 0.6; waveType = 'triangle';
        o.frequency.setValueAtTime(freq, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + dur);
        break;
      case 'milestone':
        freq = 523; dur = 1.2; waveType = 'sine';
        o.frequency.setValueAtTime(523, ctx.currentTime);
        o.frequency.setValueAtTime(659, ctx.currentTime + 0.3);
        o.frequency.setValueAtTime(784, ctx.currentTime + 0.6);
        o.frequency.exponentialRampToValueAtTime(523, ctx.currentTime + dur);
        break;
      case 'warning':
        freq = 440; dur = 0.4; waveType = 'square';
        g.gain.setValueAtTime(S.settings.volume * 0.3, ctx.currentTime);
        break;
      default:
        freq = 880; dur = 0.8; waveType = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + dur);
    }
    
    o.type = waveType;
    if(type !== 'warning') g.gain.setValueAtTime(S.settings.volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + dur);
    setTimeout(()=>{
      ctx.close();
      if(callback) callback();
    }, dur * 1000 + 100);
  }catch(e){ if(callback) callback(); }
}

function requestNotify(title, body){
  if(!S.settings.notify) return;
  if(Notification.permission==='granted'){
    new Notification(title, {body, icon:'./icons/icon-192.png'});
  }
}

/* ============= MDA GAMIFICATION HELPERS ============= */
const LEVELS = [
  {min:0, max:49, level:1, title:'入门学徒',tier:'normal'},
  {min:50, max:149, level:2, title:'专注学生',tier:'normal'},
  {min:150, max:299, level:3, title:'效率达人',tier:'normal'},
  {min:300, max:499, level:4, title:'时间大师',tier:'normal'},
  {min:500, max:799, level:5, title:'学霸觉醒',tier:'normal'},
  {min:800, max:1199, level:6, title:'专注骑士',tier:'normal'},
  {min:1200, max:1799, level:7, title:'效率霸主',tier:'premium'},
  {min:1800, max:2499, level:8, title:'时间掌控者',tier:'premium'},
  {min:2500, max:3499, level:9, title:'超级学霸',tier:'premium'},
  {min:3500, max:Infinity, level:10, title:'传奇战神',tier:'premium'},
];
const MILESTONE_STREAKS = [7,14,30,66];
const MILESTONE_MSGS = {
  7:'🏆 7天连续！习惯正在形成！',
  14:'🥈 14天！你已经在超越大多数人了！',
  30:'🥇 30天！你是真正的专注战士！',
  66:'👑 66天！习惯已经巩固！你是传奇！',
};
const MILESTONE_CONFETTI = {
  7:{count:80,colors:['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6']},
  14:{count:120,colors:['#e74c3c','#f39c12','#e67e22','#2ecc71','#1abc9c','#9b59b6','#e91e63','#3498db']},
  30:{count:180,colors:['#e74c3c','#f39c12','#e67e22','#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#e91e63','#ff6b6b']},
  66:{count:250,colors:['#FFD700','#FFA500','#FF6347','#DC143C','#FF4500','#FFD700','#ADFF2F','#00CED1','#FF69B4','#9400D3']},
};

function getLevelInfo(score){
  const s = Math.max(0, score||0);
  for(let i=LEVELS.length-1;i>=0;i--){
    if(s>=LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
}

function addScore(pts){
  const prevLevel = getLevelInfo(S.score||0);
  S.score = Math.max(0, (S.score||0) + pts);
  const newLevel = getLevelInfo(S.score);
  if(newLevel.level > prevLevel.level){
    addMilestone('⬆️ 升级为 Lv.'+newLevel.level+' '+newLevel.title+'！');
    toast('🎉 升级！Lv.'+newLevel.level+' '+newLevel.title, 4000);
    if(S.settings.celebration) showCelebration();
    S._prevLevel = newLevel.level;
  }
  saveState();
  renderScoreDisplay();
  updateMomentumFeed();
}

function addMilestone(msg){
  if(!S.milestones) S.milestones=[];
  S.milestones.push({msg, time:isoNow()});
  if(S.milestones.length>50) S.milestones=S.milestones.slice(-50);
  saveState();
}

function checkMilestones(streak){
  if(!S.milestones) S.milestones=[];
  MILESTONE_STREAKS.forEach(s=>{
    if(streak===s){
      const key = 'streak_'+s;
      if(!S.milestones.find(m=>m.msg===MILESTONE_MSGS[s])){
        S.score = (S.score||0) + 200;
        addMilestone(MILESTONE_MSGS[s]);
        toast(MILESTONE_MSGS[s], 5000);
        const conf = MILESTONE_CONFETTI[s]||{count:100,colors:['#e74c3c','#3498db','#2ecc71','#f1c40f']};
        playSound('milestone');
        showCelebrationCustom(conf.count, conf.colors);
      }
    }
  });
}

function showCelebrationCustom(count, colors){
  const overlay = $('celebration-overlay');
  if(!overlay) return;
  overlay.hidden = false;
  const container = qs('.confetti-container');
  if(!container) return;
  container.innerHTML = '';
  for(let i=0;i<count;i++){
    const c = document.createElement('div');
    c.className='confetti';
    c.style.left=Math.random()*100+'%';
    c.style.background=colors[Math.floor(Math.random()*colors.length)];
    c.style.width=(6+Math.random()*10)+'px';
    c.style.height=(6+Math.random()*10)+'px';
    c.style.animationDuration=(2+Math.random()*4)+'s';
    c.style.animationDelay=Math.random()*2+'s';
    container.appendChild(c);
  }
  setTimeout(()=>{ overlay.hidden=true; }, 5000);
}

function renderScoreDisplay(){
  const el = $('score-display');
  if(!el) return;
  const info = getLevelInfo(S.score||0);
  const tierClass = info.tier==='premium' ? ' level-badge level-premium' : ' level-badge';
  el.innerHTML = '<span class="score-num">'+Math.max(0,S.score||0)+'</span><span class="score-label">分</span>' +
    '<span class="'+tierClass+'">Lv.'+info.level+' '+info.title+'</span>';
}

function updateMomentumFeed(){
  const el = $('momentum-feed');
  if(!el) return;
  if(!S.milestones || S.milestones.length===0){
    el.innerHTML='<div class="feed-item feed-empty">开始你的第一个番茄吧！</div>';
    return;
  }
  const last3 = S.milestones.slice(-3).reverse();
  el.innerHTML = last3.map(m=>{
    const t = m.time ? new Date(m.time) : null;
    const timeStr = t ? (t.getHours()+':'+String(t.getMinutes()).padStart(2,'0')) : '';
    return '<div class="feed-item"><span class="feed-msg">'+escHtml(m.msg)+'</span><span class="feed-time">'+timeStr+'</span></div>';
  }).join('');
}

function showStreakCrisisWarning(){
  const el = $('streak-crisis-banner');
  if(!el) return;
  const today = todayStr();
  const todayData = S.pomodoroHistory[today];
  if(todayData && todayData.count>0) { el.hidden=true; return; }
  // Calculate streak including yesterday
  let streakFromYesterday = 0;
  const d = new Date();
  for(let i=1;i<366;i++){
    const p = new Date(d);
    p.setDate(p.getDate()-i);
    const ds = dateStr(p);
    const data = S.pomodoroHistory[ds];
    if(data && data.count>0){ streakFromYesterday++; } else { break; }
  }
  if(streakFromYesterday>0){
    el.hidden=false;
    $('streak-crisis-num').textContent = streakFromYesterday;
  }else{
    el.hidden=true;
  }
}

function checkYesterdayCompetition(count){
  const today = todayStr();
  // Reset flag for new day
  if(S._competitionDate !== today){
    S._competitionDate = today;
    S._todayExceededYesterday = false;
    const y = new Date(); y.setDate(y.getDate()-1);
    S._yesterdayPomoCount = (S.pomodoroHistory[dateStr(y)]||{}).count||0;
  }
  const yCount = S._yesterdayPomoCount;
  if(yCount>0 && count>yCount && !S._todayExceededYesterday){
    S._todayExceededYesterday = true;
    addMilestone('🔥 超越昨天！今天已完成 '+count+' 个番茄（昨天 '+yCount+' 个）');
    toast('🔥 超越昨天！', 3000);
    saveState();
    updateMomentumFeed();
  }
}

/* ============= V7: ANTI-PROCRASTINATION ENGINE ============= */
let microPomoTimer = null;
let microPomoRemaining = 0;
const MICRO_POMO_DURATION = 300; // 5 minutes

$('btn-micro-pomo').onclick = ()=>{
  if(microPomoRemaining > 0){
    // stop micro pomodoro
    stopMicroPomo();
    return;
  }
  microPomoRemaining = MICRO_POMO_DURATION;
  $('btn-micro-pomo').textContent = '⏹ 停止';
  $('btn-micro-pomo').classList.add('running');
  $('micro-pomo-hint').textContent = '5分钟倒计时中...降低门槛，先动起来！';
  if(timerWorker){
    timerWorker.postMessage({type:'start', remaining:microPomoRemaining, total:MICRO_POMO_DURATION});
  }
  const start = Date.now();
  microPomoTimer = setInterval(()=>{
    microPomoRemaining = Math.max(0, MICRO_POMO_DURATION - Math.floor((Date.now()-start)/1000));
    $('micro-pomo-hint').textContent = '剩余 '+Math.floor(microPomoRemaining/60)+':'+String(microPomoRemaining%60).padStart(2,'0');
    if(microPomoRemaining <= 0){
      clearInterval(microPomoTimer); microPomoTimer = null;
      stopMicroPomo();
      toast('⚡ 5分钟完成！你已经进入状态了，继续专注吧！', 4000);
      addMilestone('⚡ 完成微番茄！启动困难已克服！');
      addScore(5);
      // auto-prompt to continue with full pomodoro
      setTimeout(()=>{ showQuickStartContinue('微番茄'); }, 1500);
    }
  }, 500);
};

function stopMicroPomo(){
  if(microPomoTimer){ clearInterval(microPomoTimer); microPomoTimer = null; }
  microPomoRemaining = 0;
  $('btn-micro-pomo').textContent = '5分钟快速开始';
  $('btn-micro-pomo').classList.remove('running');
  $('micro-pomo-hint').textContent = '降低门槛，先动起来';
  if(timerWorker) timerWorker.postMessage({type:'stop'});
}

/* Smart Task Suggestion Engine */
$('btn-smart-suggest').onclick = generateSmartSuggestion;

function generateSmartSuggestion(){
  const el = $('smart-suggest-text');
  if(!el) return;
  const now = new Date();
  const today = todayStr();
  const hour = now.getHours();
  const todayData = S.pomodoroHistory[today] || {count:0};
  const goal = S.settings.dailyGoal || 6;
  
  // Rule 1: If daily goal not reached and it's getting late
  if(todayData.count < goal && hour >= 20){
    el.textContent = '⏰ 今天还差'+(goal-todayData.count)+'个番茄，时间不早了，赶紧开始！';
    return;
  }
  
  // Rule 2: If no tasks at all, prompt to add
  const activeTasks = S.tasks.filter(t=>!t.completed && (t.area==='next'||t.area==='inbox'));
  if(activeTasks.length === 0){
    el.textContent = '📋 没有待办任务！先添加一个你想完成的事情吧';
    return;
  }
  
  // Rule 3: Find highest priority undone task with due today
  const overdueTasks = activeTasks.filter(t=>t.due && new Date(t.due)<now && t.area!=='someday');
  if(overdueTasks.length > 0){
    const t = overdueTasks.sort((a,b)=>a.priority-b.priority)[0];
    el.textContent = '🔴 '+escHtml(t.title)+' 已逾期！现在就处理它';
    return;
  }
  
  // Rule 4: Find tasks due today
  const todayTasks = activeTasks.filter(t=>t.due && dateStr(new Date(t.due))===today);
  if(todayTasks.length > 0){
    const t = todayTasks.sort((a,b)=>a.priority-b.priority)[0];
    el.textContent = '📌 今天的重点：'+escHtml(t.title)+'（点击开始专注）';
    return;
  }
  
  // Rule 5: If inbox not empty, suggest clarifying
  const inboxTasks = activeTasks.filter(t=>t.area==='inbox');
  if(inboxTasks.length > 0){
    el.textContent = '📥 收件箱有'+inboxTasks.length+'个任务待厘清，先整理一下再开始';
    return;
  }
  
  // Rule 6: Morning suggestion - ADHD-enhanced
  if(hour < 10 && todayData.count === 0){
    const t = activeTasks.sort((a,b)=>a.priority-b.priority)[0];
    // ADHD-specific: address morning startup difficulty
    if(hour >= 8){
      el.textContent = '🧠 你的注意力模式显示上午启动最困难（注意力得分 ' + ADHD_PROFILE.inattention + '/3）。先从"' + escHtml(t.title) + '"开始，用5分钟微番茄降低门槛';
      return;
    }
    el.textContent = '🌅 早上好！建议从"' + escHtml(t.title) + '"开始新的一天';
    return;
  }
  
  // Rule 7: General suggestion
  const t = activeTasks.sort((a,b)=>a.priority-b.priority)[0];
  if(t){
    const pomosLeft = Math.max(0, goal - todayData.count);
    el.textContent = '🎯 下一步：'+escHtml(t.title)+'（今天还差'+pomosLeft+'个番茄）';
  }
}

/* ============= V10: MOTIVATIONAL ENGINE ============= */
const MOTIVATIONAL_QUOTES = [
  '准备好了吗？今天的每一分钟都算数！',
  '高考倒计时中，每专注一分钟就多一分胜算',
  '番茄+1 = 离梦想大学又近了一步',
  '不怕慢，只怕停。现在就开始！',
  '今天的努力，是明天考场上最好的武器',
  '打败拖延，从这个番茄开始',
  '你不是在浪费时间，你在为未来铺路',
  '每完成一个番茄，就超过了一个竞争者',
  '专注25分钟，这25分钟只属于你和你的未来',
  '高考不只是考试，是对你所有坚持的检验',
  '把手机放下，把分数提上去',
  '现在不拼，更待何时？倒计时不会等你',
  '注意力是你的超能力，用好它',
];

let quoteIndex = 0;
function rotateMotivationalQuote(){
  const el = $('mq-text');
  if(!el) return;
  quoteIndex = (quoteIndex + 1) % MOTIVATIONAL_QUOTES.length;
  el.style.opacity = '0';
  el.style.transform = 'translateY(8px)';
  setTimeout(()=>{
    el.textContent = MOTIVATIONAL_QUOTES[quoteIndex];
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 300);
}
// Rotate quote every 30 seconds
setInterval(rotateMotivationalQuote, 30000);

/* ============= V20: GAOKAO COUNTDOWN ============= */
function updateGaokaoCountdown(){
  const el = $('gk-countdown-value');
  if(!el) return;
  const now = new Date();
  const diff = GAOKAO_DATE - now;
  if(diff <= 0){
    el.textContent = '高考进行中！加油！';
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const totalHours = Math.floor(diff / 3600000);

  // Urgent format for last 7 days
  if(days <= 7){
    const label = qs('.gk-countdown-label');
    const icon = qs('.gk-countdown-icon');
    if(label) label.textContent = '距高考还有';
    if(icon) icon.textContent = '🔥';
    el.textContent = days + '天 ' + hours + '时 ' + mins + '分 ' + Math.floor((diff % 60000) / 1000) + '秒';
    // Make countdown bar more urgent
    const bar = $('gk-countdown');
    if(bar && days <= 3){
      bar.style.background = 'linear-gradient(90deg,#e74c3c,#c0392b)';
      bar.style.animation = 'pulse 2s ease-in-out infinite';
    }
  }else{
    el.textContent = days + '天 ' + hours + '时 ' + mins + '分';
  }

  // Update sprint plan display
  updateSprintPlan();
}
// Update countdown every second for a live ticking effect
setInterval(updateGaokaoCountdown, 1000);
// Also update immediately when tab becomes visible (fixes background-throttle issue)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateGaokaoCountdown();
});

/* ============= V21: GAOKAO SPRINT PLAN ============= */
function updateSprintPlan(){
  const container = $('gk-schedule');
  const el = $('gk-schedule-text');
  if(!container || !el) return;
  const daysLeft = gaokaoDaysRemaining();
  if(daysLeft > 7){
    container.hidden = true;
    return;
  }
  container.hidden = false;

  // Show today's recommended subject focus
  const subjectAdvice = getTodaySubjectAdvice(daysLeft);
  el.innerHTML = '<strong>今日重点：</strong>' + subjectAdvice;
}

function getTodaySubjectAdvice(daysLeft){
  if(daysLeft <= 0) return '高考日！放松心态，正常发挥！';
  if(daysLeft >= 5) return '全面复习，每天每个科目至少1个番茄。重点攻克薄弱环节。';
  if(daysLeft === 4) return '🟢 <strong>调整日</strong>：全面回顾，每个科目均衡分配。开始调整作息，按高考时间表安排复习时段。';
  if(daysLeft === 3) return '🟡 <strong>收尾日</strong>：只看不练——回顾错题本和笔记。不再做新题。晚上22:30强制入睡。';
  if(daysLeft === 2) return '🟠 <strong>冲刺日</strong>：看公式/古诗文/单词等记忆性内容。下午做1套选择填空保持手感。22:30强制入睡！';
  if(daysLeft === 1) return '🔴 <strong>考前日</strong>：只看错题本，不碰新内容。准备好准考证文具。最重要的是今晚22:30前入睡！';
  return '保持节奏，相信自己！';
}

/* ============= V20: SUBJECT QUICK-ADD ============= */
qsa('.subject-btn').forEach(btn=>{
  btn.onclick = ()=>{
    const subject = btn.dataset.subject;
    const tag = btn.dataset.tag;
    const task = createTask(subject + ' 复习', { area:'inbox', tags:[tag], priority:3, estimatedPomodoros:2 });
    toast('已添加: ' + subject + ' 复习');
    renderTasks();
    updateAreaCounts();
  };
});

/* ============= V20: SLEEP ENFORCEMENT SYSTEM ============= */
let sleepCheckInterval = null;
let winddownShown = false;
let winddownProgressTimer = null;
let sleepDismissTimer = null;
let breathingTimer = null;

function initSleepSystem(){
  if(sleepCheckInterval) clearInterval(sleepCheckInterval);
  sleepCheckInterval = setInterval(checkSleepTime, 30000); // check every 30 seconds
  checkSleepTime();
  // check morning
  checkMorningSleep();
  // ADHD: Check for 10am quick-start trigger
  checkADHDQuickStart();
}

/* ADHD 10am Quick-Start Trigger */
function checkADHDQuickStart(){
  const hour = new Date().getHours();
  const today = todayStr();
  const todayData = S.pomodoroHistory[today] || {count:0};
  if(hour >= 10 && hour < 11 && todayData.count === 0 && !S._adhdQuickStartShown){
    S._adhdQuickStartShown = today;
    saveState();
    setTimeout(()=>{
      const el = $('smart-suggest-text');
      if(el) el.textContent = '🧠 你的注意力模式显示上午启动最困难。用5分钟微番茄打破僵局？';
      toast('🧠 ADHD提示：上午启动最困难，试试5分钟微番茄！', 5000);
    }, 3000);
  }
}

function checkSleepTime(){
  if(!S.settings.sleepEnforce) return;
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  // FIX L4: Reset winddownShown on day boundary
  const today = todayStr();
  if(S._winddownDate !== today){
    S._winddownDate = today;
    winddownShown = false;
  }
  // Use effective bedtime (special for pre-exam days)
  const bedtime = getEffectiveBedtime();
  const winddown = getEffectiveWinddown();
  const [bedH, bedM] = bedtime.split(':').map(Number);
  let windMinutes = bedM - winddown;
  let windHour = bedH;
  if(windMinutes < 0){ windHour--; windMinutes += 60; }
  
  const bedtimeMinutes = bedH * 60 + bedM;
  const winddownMinutes2 = windHour * 60 + windMinutes;
  const currentMinutes = hour * 60 + minute;
  
  // Show wind-down warning
  if(currentMinutes >= winddownMinutes2 && currentMinutes < bedtimeMinutes && !winddownShown){
    winddownShown = true;
    showWinddown();
  }
  
  // Activate sleep mode at bedtime
  if(currentMinutes >= bedtimeMinutes){
    if(!S._sleepEnforceActive){
      S._sleepEnforceActive = true;
      activateSleepMode();
    }
    updateSleepTimer();
  }
  
  // Auto-dismiss sleep mode after wake time
  const [wakeH, wakeM] = S.settings.waketime.split(':').map(Number);
  const wakeMinutes = wakeH * 60 + wakeM;
  // If current time is past wake time and before bedtime, dismiss sleep mode
  if(currentMinutes >= wakeMinutes && currentMinutes < winddownMinutes2){
    if(S._sleepEnforceActive){
      dismissSleepMode();
    }
  }
}

function showWinddown(){
  updateWinddownProgress();
  $('winddown-banner').hidden = false;
   playSound('warning');
  // Start progressive wind-down timer (update every 30 seconds)
  if(winddownProgressTimer) clearInterval(winddownProgressTimer);
  winddownProgressTimer = setInterval(updateWinddownProgress, 30000);
}

function updateWinddownProgress(){
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const [bedH, bedM] = getEffectiveBedtime().split(':').map(Number);
  const bedtimeMinutes = bedH * 60 + bedM;
  const currentMinutes = hour * 60 + minute;
  let remaining = bedtimeMinutes - currentMinutes;
  if(remaining < 0) remaining += 1440; // next day wrap
  remaining = Math.max(0, remaining);
  
  const msgs = {
    30: '还有30分钟该睡了，收尾当前任务',
    25: '距离睡觉还有25分钟，开始收尾吧',
    20: '只剩20分钟了！停止开始新任务',
    15: '最后15分钟，关闭所有标签页，开始放松',
    10: '最后10分钟，做3次深呼吸',
    5: '5分钟！放下一切，准备入睡',
    3: '3分钟了！真的该停下来了',
    1: '1分钟！最后的机会去睡觉',
  };
  
  // Find the closest message threshold
  let msg = '还有'+remaining+'分钟该睡觉了，收尾当前任务吧';
  const thresholds = [30,25,20,15,10,5,3,1];
  for(const t of thresholds){
    if(remaining <= t && remaining > t - 3){ msg = msgs[t]; break; }
  }
  $('winddown-text').textContent = msg;
  
  // Auto-dismiss banner when it's bedtime (sleep mode will take over)
  if(currentMinutes >= bedtimeMinutes){
    $('winddown-banner').hidden = true;
    if(winddownProgressTimer){ clearInterval(winddownProgressTimer); winddownProgressTimer = null; }
  }
}

$('winddown-close').onclick = ()=>{ $('winddown-banner').hidden = true; };

function activateSleepMode(){
  $('sleep-overlay').hidden = false;
  // Stop any running timer
  if(S.timer.phase === 'running' && S.timer.mode === 'work'){
    pauseTimer();
  }
  // Render sleep ideas
  renderSleepIdeas();
  // ADHD-personalized sleep messages
  const now = new Date();
  const dismissCount = getTodayDismissCount();
  const sleepDebt = getSleepDebt();
  
  // Choose subtitle based on dismiss count and ADHD profile
  const subtitles = [
    '你的注意力容易被新鲜事物吸引（注意力得分 ' + ADHD_PROFILE.inattention + '/3），现在就是在保护它',
    '多动性特质让你"停不下来"（得分 ' + ADHD_PROFILE.hyperactivity + '/3），但睡眠能让明天更高效',
    '每多看1分钟手机，明天注意力下降约2分钟。已经' + dismissCount + '次推迟了，真的值得吗？',
    '研究显示：睡眠不足+注意力缺陷 = 双重困难。今晚的选择决定明天的效率',
    '高考倒计时中，今晚的睡眠就是明天的弹药。你值得休息。',
  ];
  $('sleep-subtitle').textContent = subtitles[dismissCount % subtitles.length];
  
  // Update sleep-reason with ADHD-specific content
  const reasonEl = $('sleep-reason');
  if(reasonEl){
    let reasonHtml = '<p>你今天已推迟入睡 <strong>' + dismissCount + '</strong> 次</p>';
    
    // Last night comparison
    const lastNight = getLastNightBedtime();
    if(lastNight){
      reasonHtml += '<p>昨晚你到 <strong>' + lastNight + '</strong> 才睡，今天效率可能已降低</p>';
    }
    
    // Sleep debt
    if(sleepDebt > 0){
      reasonHtml += '<p>你的睡眠负债: <strong>' + sleepDebt.toFixed(1) + '小时</strong>（7天累计）</p>';
    }
    
    // Loss framing
    const minsAwake = Math.floor((now.getHours() * 60 + now.getMinutes()) - (23 * 60)) || 0;
    if(minsAwake > 0){
      reasonHtml += '<p>已经超过就寝时间 <strong>' + minsAwake + '</strong> 分钟，明天注意力可能下降约 <strong>' + Math.round(minsAwake * 2) + '</strong> 分钟</p>';
    }
    
    reasonEl.innerHTML = reasonHtml;
  }
  
  // Update dismiss button text based on escalation level
  updateSleepDismissButton(dismissCount);
  
  // Reset breathing challenge state
  $('sleep-breathing-area') && ($('sleep-breathing-area').hidden = true);
  
  requestNotify('🌙 该睡觉了', '放下手机，好好休息。睡眠是高考最好的准备。');
}

function getTodayDismissCount(){
  const today = todayStr();
  if(!S._sleepDismissHistory) return 0;
  return S._sleepDismissHistory.filter(e => e.date === today).length;
}

function getWeeklyDismissCount(){
  const today = new Date();
  let count = 0;
  for(let i=0; i<7; i++){
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    if(S._sleepDismissHistory){
      count += S._sleepDismissHistory.filter(e => e.date === ds).length;
    }
  }
  return count;
}

function getLastNightBedtime(){
  // Try to infer from sleep log or dismiss history
  if(S._sleepLog && S._sleepLog.length > 0){
    const last = S._sleepLog[S._sleepLog.length - 1];
    if(last.bedtime) return last.bedtime;
  }
  return null;
}

function getSleepDebt(){
  // Calculate 7-day sleep debt (hours below 8h target)
  const now = new Date();
  let totalSleep = 0;
  let daysWithData = 0;
  const targetHours = 8;
  
  for(let i=0; i<7; i++){
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    if(S._sleepLog){
      const entry = S._sleepLog.find(e => e.date === ds);
      if(entry && entry.actualSleepHours > 0){
        totalSleep += entry.actualSleepHours;
        daysWithData++;
      }
    }
  }
  
  if(daysWithData === 0) return 0;
  const avgSleep = totalSleep / daysWithData;
  return Math.max(0, (targetHours - avgSleep) * daysWithData);
}

function getWeeklyAvgSleep(){
  const now = new Date();
  let totalSleep = 0;
  let daysWithData = 0;
  for(let i=0; i<7; i++){
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    if(S._sleepLog){
      const entry = S._sleepLog.find(e => e.date === ds);
      if(entry && entry.actualSleepHours > 0){
        totalSleep += entry.actualSleepHours;
        daysWithData++;
      }
    }
  }
  return daysWithData > 0 ? totalSleep / daysWithData : 0;
}

function logSleepToHistory(quality){
  if(!S._sleepLog) S._sleepLog = [];
  const now = new Date();
  const today = todayStr();
  
  // Estimate sleep hours from quality
  const sleepHoursMap = {good: 7.5, ok: 6, bad: 4, late: 2};
  const hours = sleepHoursMap[quality] || 6;
  
  // FIX: Infer actual bedtime from dismiss history timestamps
  let actualBedtime = S.settings.bedtime;
  if(S._sleepDismissHistory && S._sleepDismissHistory.length > 0){
    // Find the last dismiss timestamp from yesterday
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yStr = dateStr(yesterday);
    const yesterdayDismisses = S._sleepDismissHistory.filter(e => e.date === yStr);
    if(yesterdayDismisses.length > 0){
      const lastDismiss = yesterdayDismisses[yesterdayDismisses.length - 1];
      const dismissTime = new Date(lastDismiss.timestamp);
      actualBedtime = String(dismissTime.getHours()).padStart(2,'0') + ':' + String(dismissTime.getMinutes()).padStart(2,'0');
    }
  }
  
  // Remove existing entry for today
  S._sleepLog = S._sleepLog.filter(e => e.date !== today);
  S._sleepLog.push({
    date: today,
    bedtime: actualBedtime,
    quality: quality,
    actualSleepHours: hours,
    timestamp: now.toISOString()
  });
  
  // Keep only last 30 days
  if(S._sleepLog.length > 30) S._sleepLog = S._sleepLog.slice(-30);
  
  saveState();
}

function updateSleepDismissButton(dismissCount){
  const btn = $('sleep-dismiss');
  if(!btn) return;
  const weeklyCount = getWeeklyDismissCount();
  
  if(dismissCount === 0){
    btn.textContent = '我知道了，再给我5分钟';
    btn.style.opacity = '1';
    btn.disabled = false;
  }else if(dismissCount === 1){
    btn.textContent = '再给我3分钟...';
    btn.style.opacity = '0.8';
    btn.disabled = false;
  }else if(dismissCount === 2){
    btn.textContent = '本周已推迟' + weeklyCount + '次入睡';
    btn.style.opacity = '0.6';
    btn.disabled = false;
  }else{
    // 3rd+ dismiss: lock down - need breathing challenge
    btn.textContent = '必须完成60秒呼吸挑战才能继续';
    btn.style.opacity = '0.4';
    btn.disabled = true;
    btn.dataset.locked = 'true';
  }
}

function dismissSleepMode(){
  S._sleepEnforceActive = false;
  S._lastSleepDate = todayStr();
  $('sleep-overlay').hidden = true;
  saveState();
}

function updateSleepTimer(){
  const el = $('sleep-timer-value');
  if(!el || $('sleep-overlay').hidden) return;
  const [wakeH, wakeM] = S.settings.waketime.split(':').map(Number);
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const wakeMinutes = wakeH * 60 + wakeM;
  const currentMinutes = hour * 60 + minute;
  // FIX L5: If already past wake time, don't show countdown to "tomorrow"
  if(currentMinutes >= wakeMinutes){
    el.textContent = '已过起床时间';
    return;
  }
  const wake = new Date(now);
  wake.setHours(wakeH, wakeM, 0, 0);
  const diff = wake - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  el.textContent = h + '小时' + m + '分钟';
}

$('sleep-dismiss').onclick = ()=>{
  const btn = $('sleep-dismiss');
  const dismissCount = getTodayDismissCount();
  
  // 3rd+ dismiss: must complete breathing challenge first
  if(dismissCount >= 3 && btn && btn.dataset.locked === 'true'){
    toast('⚠️ 请先完成60秒呼吸挑战');
    return;
  }
  
  // Record dismiss in history
  if(!S._sleepDismissHistory) S._sleepDismissHistory = [];
  S._sleepDismissHistory.push({date: todayStr(), timestamp: Date.now()});
  S._sleepDismissCount = (S._sleepDismissCount || 0) + 1;
  saveState();
  
  const newCount = getTodayDismissCount();
  
  if(newCount === 1){
    // 1st dismiss: gentle, reappear in 3 minutes
    S._sleepEnforceActive = false;
    $('sleep-overlay').hidden = true;
    toast('😴 温馨提醒：你的注意力容易被新鲜事物吸引，别让好奇心害了你');
    if(sleepDismissTimer) clearTimeout(sleepDismissTimer);
    sleepDismissTimer = setTimeout(()=>{
      if(!S._sleepEnforceActive) checkSleepTime();
    }, 3 * 60 * 1000); // 3 minutes
  }else if(newCount === 2){
    // 2nd dismiss: consequence message, reappear in 2 minutes
    const weeklyCount = getWeeklyDismissCount();
    S._sleepEnforceActive = false;
    $('sleep-overlay').hidden = true;
    toast('⚠️ 你本周已有' + weeklyCount + '次推迟入睡，2分钟后再次提醒');
    if(sleepDismissTimer) clearTimeout(sleepDismissTimer);
    sleepDismissTimer = setTimeout(()=>{
      if(!S._sleepEnforceActive) checkSleepTime();
    }, 2 * 60 * 1000); // 2 minutes
  }else{
    // 3rd+ dismiss: progressive lockdown - start breathing challenge
    enterSleepLockdown();
    startBreathingChallenge();
  }
};

function enterSleepLockdown(){
  S._sleepLockdownActive = true;
  saveState();
  // Progressively darken screen - increase overlay opacity
  const overlay = $('sleep-overlay');
  if(overlay){
    overlay.style.background = 'rgba(5,5,20,0.98)';
  }
  // Show breathing challenge area
  const breathingArea = $('sleep-breathing-area');
  if(breathingArea) breathingArea.hidden = false;
  // Disable most UI except idea capture and sleep accept
  disableNonEssentialUI(true);
  // Update dismiss button to locked state
  updateSleepDismissButton(getTodayDismissCount());
}

function exitSleepLockdown(){
  S._sleepLockdownActive = false;
  saveState();
  const overlay = $('sleep-overlay');
  if(overlay){
    overlay.style.background = '';
  }
  const breathingArea = $('sleep-breathing-area');
  if(breathingArea) breathingArea.hidden = true;
  disableNonEssentialUI(false);
  if(breathingTimer){ clearInterval(breathingTimer); breathingTimer = null; }
}

function disableNonEssentialUI(disabled){
  // Grey out everything except sleep idea capture, breathing challenge, and accept button
  const card = qs('.sleep-card');
  if(!card) return;
  const protectedIds = ['sleep-idea-input','sleep-idea-btn','sleep-idea-list','sleep-accept','sleep-breathing-area','sleep-breathing-text'];
  qsa('.sleep-card > *', card).forEach(el=>{
    if(!protectedIds.includes(el.id) && !el.classList.contains('sleep-idea-capture')){
      el.style.opacity = disabled ? '0.2' : '';
      el.style.pointerEvents = disabled ? 'none' : '';
    }
  });
}

function startBreathingChallenge(){
  const breathingArea = $('sleep-breathing-area');
  const breathingText = $('sleep-breathing-text');
  if(!breathingArea || !breathingText) return;
  
  breathingArea.hidden = false;
  let remaining = 60; // 60 seconds total
  const phases = ['吸气...', '屏住...', '呼气...']; // 4s each = 12s per cycle, 5 cycles = 60s
  const phaseDuration = 4;
  
  breathingText.textContent = '准备...深呼吸开始！';
  breathingText.style.color = '#7c7cff';
  
  breathingTimer = setInterval(()=>{
    remaining -= 0.5;
    const phaseInCycle = (60 - remaining) % (phaseDuration * 3);
    const phaseIdx = Math.floor(phaseInCycle / phaseDuration) % 3;
    
    if(remaining <= 0){
      clearInterval(breathingTimer);
      breathingTimer = null;
      breathingText.textContent = '✅ 呼吸挑战完成！现在可以继续了';
      breathingText.style.color = '#2ecc71';
      // Unlock dismiss button
      const btn = $('sleep-dismiss');
      if(btn){
        btn.disabled = false;
        btn.dataset.locked = 'false';
        btn.textContent = '我已冷静下来，继续';
        btn.style.opacity = '0.6';
      }
      return;
    }
    
    const colorMap = ['#7c7cff', '#ffd700', '#2ecc71'];
    breathingText.textContent = phases[phaseIdx] + ' (' + Math.ceil(remaining) + '秒)';
    breathingText.style.color = colorMap[phaseIdx];
  }, 500);
}

$('sleep-accept').onclick = ()=>{
  exitSleepLockdown();
  dismissSleepMode();
  toast('晚安 💤 好好休息，明天加油！');
};

function renderSleepIdeas(){
  const list = $('sleep-idea-list');
  if(!list) return;
  list.innerHTML = '';
  (S.sleepIdeas || []).forEach((idea, i)=>{
    const div = document.createElement('div');
    div.className = 'sleep-idea-item';
    div.innerHTML = '<span>' + escHtml(idea) + '</span><button class="sleep-idea-del" data-idx="' + i + '">✕</button>';
    div.querySelector('.sleep-idea-del').onclick = ()=>{
      S.sleepIdeas.splice(i, 1);
      saveState();
      renderSleepIdeas();
    };
    list.appendChild(div);
  });
}

$('sleep-idea-btn').onclick = ()=>{
  const input = $('sleep-idea-input');
  const val = input.value.trim();
  if(!val) return;
  S.sleepIdeas = S.sleepIdeas || [];
  S.sleepIdeas.push(val);
  // Auto-create as inbox task for tomorrow
  createTask(val, { area:'inbox', tags:['夜间想法'], priority:4 });
  input.value = '';
  saveState();
  renderSleepIdeas();
  toast('💡 想法已记录，明天再处理');
};

$('sleep-idea-input').onkeydown = e=>{
  if(e.key === 'Enter'){ e.preventDefault(); $('sleep-idea-btn').click(); }
};

/* ============= V20: MORNING SLEEP CHECK ============= */
function checkMorningSleep(){
  const today = todayStr();
  if(S._morningCheckDone === today) return;
  // Only show between wake time and 10am
  const now = new Date();
  const hour = now.getHours();
  const [wakeH] = S.settings.waketime.split(':').map(Number);
  if(hour < wakeH || hour >= 22) return;
  // FIX: Show morning check for ALL users (not just those with _lastSleepDate)
  // First-time users should also see it to start building the habit
  // _lastSleepDate only matters for showing "last night" comparison text
  
  // Show sleep debt info in morning check
  const debtEl = $('morning-sleep-debt');
  if(debtEl){
    const sleepDebt = getSleepDebt();
    const weeklyAvg = getWeeklyAvgSleep();
    const weeklyDismiss = getWeeklyDismissCount();
    if(sleepDebt > 0 || weeklyDismiss > 0){
      let debtHtml = '';
      if(sleepDebt > 0) debtHtml += '睡眠负债: <strong>' + sleepDebt.toFixed(1) + '小时</strong> ';
      if(weeklyAvg > 0) debtHtml += '7天均睡: <strong>' + weeklyAvg.toFixed(1) + 'h</strong> ';
      if(weeklyDismiss > 0) debtHtml += '本周推迟入睡: <strong>' + weeklyDismiss + '次</strong>';
      debtEl.innerHTML = debtHtml;
      debtEl.hidden = false;
    }else{
      debtEl.hidden = true;
    }
  }
  
  // Update morning check subtitle for gaokao context
  const subEl = qs('.morning-check-sub');
  if(subEl){
    const daysLeft = gaokaoDaysRemaining();
    if(daysLeft <= 7){
      subEl.textContent = '距高考 ' + daysLeft + ' 天！昨晚睡得好吗？（睡眠质量直接影响考场发挥）';
    }
  }

  setTimeout(()=>{
    $('morning-check-overlay').hidden = false;
  }, 1000);
}

qsa('.morning-opt-btn').forEach(btn=>{
  btn.onclick = ()=>{
    const quality = btn.dataset.sleep;
    S._lastSleepQuality = quality;
    S._morningCheckDone = todayStr();
    
    // Log sleep to history for debt tracking
    logSleepToHistory(quality);
    
    const sleepDebt = getSleepDebt();
    const weeklyAvg = getWeeklyAvgSleep();
    const weeklyDismiss = getWeeklyDismissCount();
    
    const motivations = {
      good: '昨晚睡得好！利用高注意力时段(建议上午)攻克最难的科目。你的注意力得分 ' + ADHD_PROFILE.inattention + '/3，充足的睡眠是发挥它的前提。',
      ok: '注意：你的注意力得分较高(' + ADHD_PROFILE.inattention + '/3)，睡眠不足会严重影响。建议今天用5分钟微番茄启动，让大脑慢慢进入状态。' + (weeklyAvg > 0 ? '本周平均睡眠' + weeklyAvg.toFixed(1) + '小时。' : ''),
      bad: '睡眠不足+注意力缺陷=双重困难。今天只做最重要的3个微番茄(5分钟each)。不要贪多——质量比数量重要。' + (sleepDebt > 0 ? ' 当前睡眠负债: ' + sleepDebt.toFixed(1) + '小时。' : ''),
      late: '严重警告：连续熬夜会显著降低注意力分数(你已有' + weeklyDismiss + '次推迟入睡记录)。今天只做1个核心任务，然后补觉。' + (sleepDebt > 3 ? ' 睡眠负债超过3小时，已自动大幅降低今日目标。' : ''),
    };
    $('morning-motivation').textContent = motivations[quality] || motivations.ok;
    
    // Auto-adjust daily goal based on sleep quality + sleep debt
    // But NEVER reduce below gaokao minimum (2 for last 7 days)
    const minGoal = gaokaoDaysRemaining() <= 7 ? 2 : 4;
    if(quality === 'late'){
      S.settings.dailyGoal = Math.max(minGoal, Math.floor(DEFAULT_DAILY_GOAL * 0.4));
      S._goalReducedBySleep = true;
      addMilestone('😴 严重熬夜，今日目标已大幅降低为 ' + S.settings.dailyGoal + ' 个番茄');
    }else if(quality === 'bad'){
      S.settings.dailyGoal = Math.max(minGoal, Math.floor(DEFAULT_DAILY_GOAL * 0.5));
      S._goalReducedBySleep = true;
      addMilestone('😴 睡眠不足，今日目标已调整为 ' + S.settings.dailyGoal + ' 个番茄');
    }
    // NOTE: If quality is 'good' or 'ok', we do NOT touch dailyGoal here.
    // The daily goal will be auto-restored to DEFAULT_DAILY_GOAL by restoreDailyGoal() called in initApp.
    
    // Extra aggressive reduction if sleep debt > 3 hours
    if(sleepDebt > 3){
      S.settings.dailyGoal = Math.max(minGoal, Math.floor(S.settings.dailyGoal * 0.5));
      S._goalReducedBySleep = true;
      addMilestone('⚠️ 睡眠负债过高(' + sleepDebt.toFixed(1) + 'h)，目标再次降低至 ' + S.settings.dailyGoal + ' 个番茄');
    }
    
    saveState();
  };
});

$('morning-done').onclick = ()=>{
  $('morning-check-overlay').hidden = true;
  S._morningCheckDone = todayStr();
  saveState();
};

/* Daily Performance Grade System */
function calculateDailyGrade(){
  const today = todayStr();
  const data = S.pomodoroHistory[today] || {count:0,focusMins:0};
  const goal = S.settings.dailyGoal || 6;
  const count = data.count;
  
  let grade, letter, desc;
  if(count >= goal * 1.5){ grade='s'; letter='S'; desc='超凡表现！远超目标，你是专注之王！'; }
  else if(count >= goal){ grade='a'; letter='A'; desc='优秀！今日目标完美达成，继续保持！'; }
  else if(count >= goal * 0.75){ grade='b'; letter='B'; desc='良好！完成了四分之三以上，再加把劲！'; }
  else if(count >= goal * 0.5){ grade='c'; letter='C'; desc='还行，目标过半了。明天争取达标！'; }
  else if(count > 0){ grade='d'; letter='D'; desc='起步了，但远远不够。每个番茄都是进步。'; }
  else { grade='f'; letter='F'; desc='今天还没有番茄记录。现在开始还来得及！'; }
  
  return {grade, letter, desc, count, goal};
}

function renderDailyGrade(){
  const circle = $('dg-circle');
  const letterEl = $('dg-letter');
  const titleEl = $('dg-title');
  const descEl = $('dg-desc');
  if(!circle) return;
  
  const g = calculateDailyGrade();
  letterEl.textContent = g.letter;
  circle.className = 'dg-circle grade-'+g.grade;
  titleEl.textContent = '今日表现: '+g.count+'/'+g.goal+' 番茄';
  descEl.textContent = g.desc;
}

/* Personal Records */
function renderPersonalRecords(){
  // Best single day
  let bestDay = 0, bestDayDate = '';
  let totalMins = 0;
  Object.entries(S.pomodoroHistory||{}).forEach(([date,data])=>{
    if(data.count > bestDay){ bestDay = data.count; bestDayDate = date; }
    totalMins += data.focusMins || 0;
  });
  
  // Best week
  let bestWeek = 0;
  const now = new Date();
  for(let w=0; w<52; w++){
    let weekTotal = 0;
    for(let d=0; d<7; d++){
      const dt = new Date(now);
      dt.setDate(dt.getDate() - w*7 - d);
      const ds = dateStr(dt);
      weekTotal += (S.pomodoroHistory[ds]||{}).count||0;
    }
    if(weekTotal > bestWeek) bestWeek = weekTotal;
  }
  
  const el1 = $('rec-best-day'); if(el1) el1.textContent = bestDay;
  const el2 = $('rec-best-week'); if(el2) el2.textContent = bestWeek;
  const el3 = $('rec-total-hours'); if(el3) el3.textContent = Math.round(totalMins/60)+'h';
  
  // Today's rank (how does today compare to history)
  const todayCount = (S.pomodoroHistory[todayStr()]||{}).count||0;
  const allDays = Object.values(S.pomodoroHistory||{}).map(d=>d.count).sort((a,b)=>b-a);
  let rank = '-';
  if(todayCount > 0 && allDays.length > 0){
    const pos = allDays.indexOf(todayCount);
    rank = pos >= 0 ? 'Top '+(pos+1) : 'Top '+allDays.length;
  }
  const el4 = $('rec-today-rank'); if(el4) el4.textContent = rank;
}

/* Smart Insights Engine */
function generateInsights(){
  const list = $('insight-list');
  if(!list) return;
  const insights = [];
  const today = todayStr();
  const now = new Date();
  const hour = now.getHours();
  
  // Count total pomodoros
  let totalCount = 0;
  Object.values(S.pomodoroHistory||{}).forEach(d=>{ totalCount += d.count; });
  
  // 1. Streak insight
  const streak = calcStreak();
  if(streak > 0){
    var streakMsg = streak>=7 ? '习惯已经形成！' : streak>=3 ? '保持住，3天是小里程碑' : '继续积累';
    insights.push({icon:'🔥', type:'success', text:'连续专注 '+streak+' 天！'+streakMsg});
  }
  
  // 2. Crisis warning
  const todayData = S.pomodoroHistory[today] || {count:0};
  if(todayData.count === 0 && hour >= 14){
    insights.push({icon:'⚠️', type:'warning', text:'今天还没有开始！下午是最好的追赶时间'});
  }
  
  // 3. Productivity pattern
  const sessions = (S.sessions||[]).filter(s=>s.type==='work');
  if(sessions.length >= 10){
    const hourCounts = {};
    sessions.forEach(s=>{ if(s.start){ const h = new Date(s.start).getHours(); hourCounts[h] = (hourCounts[h]||0)+1; }});
    let bestHour = 0, bestCount = 0;
    Object.entries(hourCounts).forEach(([h,c])=>{ if(c>bestCount){ bestCount=c; bestHour=parseInt(h); }});
    if(bestCount > 0){
      insights.push({icon:'📊', type:'info', text:'你最活跃的时间段是 '+bestHour+':00-'+(bestHour+1)+':00，把重要任务安排在这个时段'});
    }
  }
  
  // 4. Task completion rate
  const totalTasks = S.tasks.length;
  const doneTasks = S.tasks.filter(t=>t.completed).length;
  if(totalTasks > 5){
    const rate = Math.round(doneTasks/totalTasks*100);
    insights.push({icon:'📋', type:'info', text:'任务完成率 '+rate+'%' + (rate>=70?'，执行力很强！':rate>=40?'，还有提升空间':'，尝试每天先厘清收件箱')});
  }
  
  // 5. Weekly comparison
  let thisWeek = 0, lastWeek = 0;
  for(let d=0;d<7;d++){
    const dt = new Date(now); dt.setDate(dt.getDate()-d); thisWeek += (S.pomodoroHistory[dateStr(dt)]||{}).count||0;
    const lt = new Date(now); lt.setDate(lt.getDate()-d-7); lastWeek += (S.pomodoroHistory[dateStr(lt)]||{}).count||0;
  }
  if(lastWeek > 0){
    const diff = thisWeek - lastWeek;
    if(diff > 0) insights.push({icon:'📈', type:'success', text:'本周比上周多 '+diff+' 个番茄，进步明显！'});
    else if(diff < 0) insights.push({icon:'📉', type:'warning', text:'本周比上周少 '+Math.abs(diff)+' 个番茄，要加油了'});
  }
  
  // 6. Inbox pressure
  const inboxCount = S.tasks.filter(t=>t.area==='inbox'&&!t.completed).length;
  if(inboxCount >= 5){
    insights.push({icon:'📥', type:'warning', text:'收件箱有 '+inboxCount+' 个任务积压，建议每天花2分钟清理'});
  }
  
  if(insights.length === 0){
    list.innerHTML = '<div class="insight-item insight-empty">积累更多数据后生成洞察...</div>';
    return;
  }
  list.innerHTML = insights.map(i=>
    '<div class="insight-item insight-'+i.type+'"><span class="insight-icon">'+i.icon+'</span><span class="insight-text">'+i.text+'</span></div>'
  ).join('');
}

/* Calendar Monthly Summary */
function renderCalendarMonthlySummary(){
  const y = calViewDate.getFullYear();
  const m = calViewDate.getMonth();
  let monthTotal = 0, activeDays = 0;
  const daysInMonth = new Date(y, m+1, 0).getDate();
  for(let d=1; d<=daysInMonth; d++){
    const ds = y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const data = S.pomodoroHistory[ds];
    if(data && data.count > 0){ monthTotal += data.count; activeDays++; }
  }
  const avg = activeDays > 0 ? (monthTotal/activeDays).toFixed(1) : '0';
  
  // Monthly grade
  const dailyGoal = S.settings.dailyGoal || 6;
  const expectedDays = daysInMonth; // rough
  const expectedTotal = Math.round(dailyGoal * expectedDays * 0.6); // 60% target
  let mGrade = 'F';
  if(monthTotal >= expectedTotal * 1.5) mGrade = 'S';
  else if(monthTotal >= expectedTotal) mGrade = 'A';
  else if(monthTotal >= expectedTotal * 0.75) mGrade = 'B';
  else if(monthTotal >= expectedTotal * 0.5) mGrade = 'C';
  else if(monthTotal > 0) mGrade = 'D';
  
  const el1 = $('cms-total'); if(el1) el1.textContent = monthTotal;
  const el2 = $('cms-days'); if(el2) el2.textContent = activeDays;
  const el3 = $('cms-avg'); if(el3) el3.textContent = avg;
  const el4 = $('cms-grade');
  if(el4){ el4.textContent = mGrade; el4.className = 'cal-ms-val grade-'+mGrade.toLowerCase(); }
}

/* Calendar Heatmap Enhancement */
function getCalDayIntensity(count, goal){
  if(count === 0) return 0;
  if(count >= goal) return 5;
  if(count >= goal * 0.75) return 4;
  if(count >= goal * 0.5) return 3;
  if(count >= goal * 0.25) return 2;
  return 1;
}

/* Inbox Pressure System */
function updateInboxPressure(){
  const bar = $('inbox-pressure-bar');
  if(!bar) return;
  const inboxCount = S.tasks.filter(t=>t.area==='inbox'&&!t.completed).length;
  if(inboxCount < 3){ bar.hidden = true; return; }
  bar.hidden = false;
  const pressure = Math.min(100, inboxCount * 10);
  $('ip-fill').style.width = pressure+'%';
  $('ip-text').textContent = '收件箱有 '+inboxCount+' 个任务积压' + (inboxCount>=5?' ⚠️急需处理！':inboxCount>=3?'，建议尽快清理':'');
}

$('ip-action-btn').onclick = ()=>{
  // switch to inbox tab and enable batch clarify
  qsa('.gtd-tab').forEach(b=>{ b.classList.toggle('active', b.dataset.area==='inbox'); });
  renderTasks();
  toast('请逐个厘清收件箱中的任务');
};

/* Focus Lockdown Mode - COMPLETE */
let focusLockdown = false;
let lockdownSyncInterval = null;

function initLockdownParticles(){
  const canvas = $('lockdown-particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  for(let i=0;i<30;i++){
    particles.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      vx:(Math.random()-0.5)*0.5,
      vy:(Math.random()-0.5)*0.5,
      r:Math.random()*3+1,
      a:Math.random()*0.5+0.1,
    });
  }
  function animate(){
    if(!focusLockdown) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>canvas.width) p.vx*=-1;
      if(p.y<0||p.y>canvas.height) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(231,76,60,'+p.a+')';
      ctx.fill();
    });
    // Draw connections
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x;
        const dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<150){
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle='rgba(231,76,60,'+(0.15*(1-dist/150))+')';
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

function enterLockdown(){
  focusLockdown = true;
  $('lockdown-overlay').hidden = false;
  updateLockdownDisplay();
  lockdownSyncInterval = setInterval(updateLockdownDisplay, 200);
  document.body.style.overflow = 'hidden';
  // Particle effect for lockdown
  initLockdownParticles();
}

function exitLockdown(){
  focusLockdown = false;
  $('lockdown-overlay').hidden = true;
  if(lockdownSyncInterval){ clearInterval(lockdownSyncInterval); lockdownSyncInterval = null; }
  document.body.style.overflow = '';
  const wrap = qs('.work-view');
  if(wrap) wrap.classList.remove('focus-lockdown');
  $('btn-focus-toggle').classList.remove('active');
}

function updateLockdownDisplay(){
  const digits = $('lockdown-digits');
  const taskEl = $('lockdown-task');
  const msgEl = $('lockdown-message');
  if(!digits) return;
  
  // sync timer digits
  digits.textContent = fmtTime(S.timer.remaining);
  
  // sync ring
  const pct = S.timer.total > 0 ? S.timer.remaining/S.timer.total : 0;
  const offset = 553.1 * (1-pct);
  const fill = qs('.ld-ring-fill');
  if(fill) fill.style.strokeDashoffset = offset;
  
  // show task name
  if(S.timer.currentTaskId){
    const t = findTask(S.timer.currentTaskId);
    if(t && taskEl) taskEl.textContent = t.title;
  }else if(taskEl){
    taskEl.textContent = '自由专注';
  }
  
  // motivational messages that rotate
  const msgs = ['远离手机，保持专注','你正在变得更好','每一秒都在积累','坚持住，你比大多数人强','专注是通往卓越的桥梁','现在的努力，未来的你会感谢'];
  if(msgEl) msgEl.textContent = msgs[Math.floor(Date.now()/10000) % msgs.length];
}

$('btn-focus-toggle').onclick = ()=>{
  if(focusLockdown){
    // confirm exit
    if(S.timer.phase === 'running' && S.settings.interruptConfirm && S.timer.mode==='work'){
      const elapsed = S.timer.total - S.timer.remaining;
      $('abandon-minutes').textContent = Math.round(elapsed/60);
      $('modal-abandon-confirm').hidden = false;
      // modify abandon confirm to also exit lockdown
      const origHandler = $('abandon-confirm').onclick;
      $('abandon-confirm').onclick = ()=>{
        $('abandon-confirm').onclick = origHandler;
        exitLockdown();
        abandonPomo();
      };
      $('abandon-continue').onclick = ()=>{
        $('abandon-continue').onclick = ()=>{ $('modal-abandon-confirm').hidden = true; };
        $('modal-abandon-confirm').hidden = true;
      };
      return;
    }
    exitLockdown();
    toast('🔓 已解锁');
    return;
  }
  
  if(S.settings.lockdown && S.timer.mode==='work'){
    if(S.timer.phase === 'running'){
      enterLockdown();
      toast('🔒 锁屏模式已开启');
    }else{
      // turn on lockdown mode for next timer
      focusModeFull = false;
      $('btn-focus-toggle').classList.add('active');
      toast('🔒 锁屏已就绪，开始专注时自动激活');
    }
  }else{
    focusModeFull = !focusModeFull;
    $('btn-focus-toggle').classList.toggle('active', focusModeFull);
    const wrap = qs('.work-view');
    if(wrap){
      wrap.classList.toggle('focus-mode-full', focusModeFull);
      wrap.classList.remove('focus-lockdown');
    }
    toast(focusModeFull ? '🔍 已进入专注模式' : '🔍 已退出专注模式');
  }
};

/* ============= TIMER ============= */
function initTimerWorker(){
  if(timerWorker){
    timerWorker.terminate();
    timerWorker = null;
  }
  try{
    timerWorker = new Worker('./timer-worker.js');
    timerWorker.onmessage = e => {
      if(e.data.type==='tick'){
        S.timer.remaining = e.data.remaining;
        S.timer.total = e.data.total;
        updateTimerDisplay();
      }else if(e.data.type==='done'){
        onTimerComplete();
      }
    };
  }catch(e){
    // fallback: use setInterval
    timerWorker = null;
  }
}

function startTimer(){
  if(S.timer.phase==='running') return;
  if(S.timer.remaining <= 0){
    S.timer.remaining = S.settings[S.timer.mode]*60;
    S.timer.total = S.settings[S.timer.mode]*60;
  }
  S.timer.phase = 'running';
  // Battle mode indicator
  const bi = $('battle-indicator');
  if(bi && S.timer.mode === 'work'){
    bi.hidden = false;
    $('battle-text').textContent = '专注中 #'+S.timer.currentCycle;
  }
  updateTimerModeClass();
  updateTimerDisplay();
  updateTimerBtn();
  if(timerWorker){
    timerWorker.postMessage({type:'start', remaining:S.timer.remaining, total:S.timer.total});
  }else{
    const fbStart=Date.now(), fbTotal=S.timer.remaining;
    if(currentTimerId) clearInterval(currentTimerId);
    currentTimerId = setInterval(()=>{
      S.timer.remaining=Math.max(0,fbTotal-Math.floor((Date.now()-fbStart)/1000));
      updateTimerDisplay();
      if(S.timer.remaining <= 0){
        if(currentTimerId) clearInterval(currentTimerId);
        currentTimerId = null;
        onTimerComplete();
      }
    },200);
  }
  requestWakeLock();
  saveState();
  // auto-enter lockdown if setting is on and work mode
  if(S.settings.lockdown && S.timer.mode==='work' && $('btn-focus-toggle').classList.contains('active')){
    enterLockdown();
  }
}

function pauseTimer(){
  if(S.timer.phase!=='running') return;
  S.timer.phase='paused';
  if(timerWorker){
    timerWorker.postMessage({type:'pause'});
  }else if(currentTimerId){
    clearInterval(currentTimerId);
    currentTimerId = null;
  }
  updateTimerBtn();
  releaseWakeLock();
  saveState();
}

function resumeTimer(){
  if(S.timer.phase!=='paused') return;
  startTimer();
}

function resetTimer(){
  stopTimer();
  S.timer.remaining = S.settings[S.timer.mode]*60;
  S.timer.total = S.settings[S.timer.mode]*60;
  S.timer.phase='idle';
  S.timer.currentTaskId=null;
  updateTimerDisplay();
  updateTimerBtn();
  updateTimerModeClass();
  saveState();
}

function stopTimer(){
  if(timerWorker){
    timerWorker.postMessage({type:'stop'});
  }else if(currentTimerId){
    clearInterval(currentTimerId);
    currentTimerId = null;
  }
  releaseWakeLock();
  const bi = $('battle-indicator');
  if(bi) bi.hidden = true;
}

function setTimerMode(mode){
  if(S.timer.phase==='running') return;
  S.timer.mode = mode;
  S.timer.remaining = S.settings[mode]*60;
  S.timer.total = S.settings[mode]*60;
  S.timer.phase='idle';
  updateTimerDisplay();
  updateTimerBtn();
  updateTimerModeClass();
  updateModeBtns();
  saveState();
}

function updateTimerDisplay(){
  const el = $('timer-digits');
  if(el) el.textContent = fmtTime(S.timer.remaining);
  const cycle = $('timer-cycle');
  if(cycle) cycle.textContent = '#' + S.timer.currentCycle;
  // ring
  const pct = S.timer.total > 0 ? S.timer.remaining/S.timer.total : 0;
  const offset = CIRCUMFERENCE * (1-pct);
  const fill = qs('.ring-fill');
  if(fill) fill.style.strokeDashoffset = offset;
}

function updateTimerModeClass(){
  const wrap = $('timer-ring-wrap');
  if(!wrap) return;
  wrap.classList.toggle('timer-mode-break', S.timer.mode !== 'work');
  wrap.classList.toggle('timer-active', S.timer.phase === 'running' && S.timer.mode === 'work');
}

function updateModeBtns(){
  qsa('.mode-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.mode===S.timer.mode);
  });
}

function updateTimerBtn(){
  const btn = $('btn-start');
  if(!btn) return;
  if(S.timer.phase==='running'){
    btn.textContent = '⏸ 暂停';
    btn.className = 'btn-timer primary running';
  }else if(S.timer.phase==='paused'){
    btn.textContent = '▶ 继续';
    btn.className = 'btn-timer primary';
  }else if(S.timer.phase==='finished'){
    btn.textContent = '▶ 下一个番茄';
    btn.className = 'btn-timer primary';
  }else{
    const label = S.timer.mode==='work' ? '▶ 就现在，开始！' : S.timer.mode==='shortBreak' ? '开始短休息' : '开始长休息';
    btn.textContent = '▶ '+label;
    btn.className = 'btn-timer primary';
  }
}

function updateActiveTaskDisplay(){
  const el = $('timer-active-task');
  if(!el) return;
  if(S.timer.currentTaskId){
    const t = findTask(S.timer.currentTaskId);
    if(t){
      el.innerHTML = '当前任务：<a class="task-link" data-id="'+t.id+'">' + escHtml(t.title) + '</a>';
      return;
    }
  }
  el.innerHTML = '';
}

function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* daily goal progress */
function updateDailyGoal(){
  const wrap = $('daily-goal-bar-wrap');
  if(!wrap) return;
  const today = todayStr();
  const data = S.pomodoroHistory[today] || {count:0};
  const goal = S.settings.dailyGoal || 6;
  const count = data.count || 0;
  const fill = $('daily-goal-fill');
  const text = $('daily-goal-text');
  const celebration = $('daily-goal-celebration');
  const pct = Math.min(100, (count/goal)*100);
  fill.style.width = pct+'%';
  text.textContent = count+' / '+goal;
  fill.classList.toggle('goal-reached', count >= goal);
  celebration.hidden = count < goal;

  // MDA: yesterday ghost on daily goal bar
  const y = new Date(); y.setDate(y.getDate()-1);
  const yStr = dateStr(y);
  const yCount = (S.pomodoroHistory[yStr]||{}).count||0;
  const yesterdayGhost = $('yesterday-ghost-line');
  if(yesterdayGhost && yCount > 0){
    const yPct = Math.min(100, (yCount/goal)*100);
    yesterdayGhost.style.left = yPct+'%';
    yesterdayGhost.hidden = false;
    const yesterdayHint = $('yesterday-hint');
    if(yesterdayHint) yesterdayHint.hidden = false;
  } else {
    if(yesterdayGhost) yesterdayGhost.hidden = true;
    const yesterdayHint = $('yesterday-hint');
    if(yesterdayHint) yesterdayHint.hidden = true;
  }

  // streak mini
  const sr = $('streak-mini');
  const srNum = $('streak-mini-num');
  if(sr && srNum){
    const cur = calcStreak();
    if(cur > 0){
      sr.hidden = false;
      srNum.textContent = cur;
    }else{
      sr.hidden = true;
    }
  }
}

function calcStreak(){
  let current = 0;
  const d = new Date();
  const today = todayStr();
  if(!S.pomodoroHistory[today] || S.pomodoroHistory[today].count===0) return 0;
  for(let i=0; i<366; i++){
    const p = new Date(d);
    p.setDate(p.getDate()-i);
    const ds = dateStr(p);
    const data = S.pomodoroHistory[ds];
    if(data && data.count>0){
      current++;
    }else{
      break;
    }
  }
  return current;
}

/* timer complete */
function onTimerComplete(){
  S.timer.phase='finished';
  stopTimer();
  if(focusLockdown) exitLockdown();
  updateTimerBtn();

  if(S.timer.mode==='work'){
    recordPomodoro();
    playSound('complete', ()=>{
      if(S.settings.celebration) showCelebration();
      showCompletionModal();
      requestNotify('🍅 番茄完成！','专注完成，休息一下吧');
    });
  }else{
    playSound('break', ()=>{
      requestNotify('☕ 休息结束','该回来继续工作了');
    });
    if(S.settings.autoWork){
      setTimeout(()=>{ if(S.timer.phase==='finished') startTimer(); }, 1000);
    }
  }
  saveState();
}

function recordPomodoro(){
  const today = todayStr();
  if(!S.pomodoroHistory[today]) S.pomodoroHistory[today] = {count:0,focusMins:0};
  const prevCount = S.pomodoroHistory[today].count;
  S.pomodoroHistory[today].count++;
  S.pomodoroHistory[today].focusMins += S.timer.total/60;
  S.timer.intervalsCompleted++;
  S.timer.currentCycle++;

  // record session
  const sess = {
    id: uid(),
    type: S.timer.mode,
    duration: S.timer.total,
    start: new Date(Date.now() - S.timer.total*1000).toISOString(),
    taskId: S.timer.currentTaskId,
    completed: true
  };
  S.sessions.push(sess);

  let estimateReached = false;
  if(S.timer.currentTaskId){
    const t = findTask(S.timer.currentTaskId);
    if(t){
      t.completedPomodoros = (t.completedPomodoros||0)+1;
      S.lastCompletedTaskId = t.id;
      if(t.estimatedPomodoros && t.completedPomodoros >= t.estimatedPomodoros){
        estimateReached = true;
      }
    }
  }
  if(estimateReached){
    setTimeout(()=>{
      const t = findTask(S.timer.currentTaskId);
      if(t && !t.completed){
        toast('🎯 预估番茄已达成，建议标记任务完成！');
      }
    }, 2000);
  }

  // === MDA: Score +10 for completing a tomato ===
  addScore(10);

  const count = S.pomodoroHistory[today].count;
  const goal = S.settings.dailyGoal || 6;

  // MDA: First tomato of today
  if(prevCount === 0 && count === 1){
    addMilestone('🍅 完成了今天的第1个番茄！保持动力！');
  }

  // MDA: Daily goal reached bonus
  if(count === goal && prevCount < goal){
    addScore(50);
    addMilestone('🎉 今日目标达成！+50分奖励！太棒了！');
  }

  // MDA: Streak milestones
  const streak = calcStreak();
  checkMilestones(streak);

  // MDA: Yesterday self competition
  checkYesterdayCompetition(count);

  // MDA: Milestone feed for 3rd, 5th, 10th tomato
  if(count === 3) addMilestone('🍅 今天已完成3个番茄！继续保持！');
  if(count === 5) addMilestone('🍅 今天已完成5个番茄！效率很高！');
  if(count === 10) addMilestone('🔥 今天已完成10个番茄！超级专注！');

  // MDA: Hide streak crisis warning
  const crisisEl = $('streak-crisis-banner');
  if(crisisEl) crisisEl.hidden = true;

  // update daily goal and show bounce animation
  updateDailyGoal();
  updateMomentumFeed();
  const ring = qs('.ring-fill');
  if(ring) ring.classList.add('pomo-bounce');
}

function showCompletionModal(){
  const sub = $('modal-sub');
  const tasks = $('modal-tasks');
  const scoreInfo = $('modal-score-info');
  const levelProgress = $('modal-level-progress');

  sub.textContent = '已完成第 '+S.timer.intervalsCompleted+' 个番茄';

  // MDA: Show score and level info in completion modal
  if(scoreInfo){
    const info = getLevelInfo(S.score||0);
    scoreInfo.innerHTML = '<span class="modal-score-pts">+10分</span>' +
      '<span class="modal-score-total">总分：'+Math.max(0,S.score||0)+'分</span>' +
      '<span class="modal-level-badge">Lv.'+info.level+' '+info.title+'</span>';
    scoreInfo.hidden = false;
  }
  if(levelProgress){
    const info = getLevelInfo(S.score||0);
    const pct = info.max===Infinity ? 100 : Math.min(100, ((S.score||0)-info.min)/(info.max-info.min)*100);
    levelProgress.innerHTML = '<div class="modal-level-bar"><div class="modal-level-fill" style="width:'+pct+'%"></div></div>' +
      '<span class="modal-level-text">距离 Lv.'+(info.level+1)+' 还需 '+Math.max(0,Math.min(info.max-(S.score||0), info.max===Infinity?0:info.max-(S.score||0)))+' 分</span>';
    levelProgress.hidden = false;
  }

  // MDA: Check if goal was just reached
  const today = todayStr();
  const data = S.pomodoroHistory[today] || {count:0};
  const goal = S.settings.dailyGoal || 6;
  if(data.count === goal){
    const goalMsg = $('modal-goal-reached');
    if(goalMsg){
      goalMsg.textContent = '🎉 今日目标达成！+50分奖励！';
      goalMsg.hidden = false;
    }
  } else {
    const goalMsg = $('modal-goal-reached');
    if(goalMsg) goalMsg.hidden = true;
  }

  tasks.innerHTML = '';
  // show completed tasks today
  getTodayDone().forEach(t=>{
    const div = document.createElement('div');
    div.className='task-item';
    div.innerHTML='<span class="task-text">'+escHtml(t.title)+'</span>';
    tasks.appendChild(div);
  });
  $('modal-complete').hidden = false;
}

function getTodayDone(){
  const today = todayStr();
  return S.tasks.filter(t=>t.completed && t.completedAt && t.completedAt.startsWith(today));
}

$('modal-confirm').onclick = ()=>{
  $('modal-complete').hidden = true;
  handleTimerFinish();
};

$('modal-skip').onclick = ()=>{
  $('modal-complete').hidden = true;
  handleTimerFinish();
};

function handleTimerFinish(){
  if(S.timer.mode==='work'){
    // check for rest guide
    const isLong = S.timer.intervalsCompleted % S.settings.longBreakInterval === 0;
    if(isLong){
      setTimerMode('longBreak');
    }else{
      setTimerMode('shortBreak');
    }
    if(S.settings.autoBreak){
      startTimer();
    }
    if(S.settings.restGuide && !S.settings.autoBreak){
      showRestGuide();
    }
  }else{
    setTimerMode('work');
    if(S.settings.autoWork){
      startTimer();
    }
  }
  updateDoneToday();
  renderTasks();
  updateDailyGoal();
}

/* abandon confirm */
$('btn-skip').onclick = ()=>{
  if(S.timer.mode!=='work' && (S.timer.phase==='idle'||S.timer.phase==='running')){
    // skip break
    stopTimer();
    handleTimerFinish();
    return;
  }
  if(S.timer.phase !== 'running' && S.timer.phase !== 'paused') return;
  if(S.settings.interruptConfirm){
    const elapsed = S.timer.total - S.timer.remaining;
    $('abandon-minutes').textContent = Math.round(elapsed/60);
    // MDA: Smart abandon message
    const abandonScore = $('abandon-score-info');
    if(abandonScore) abandonScore.hidden = false;
    const abandonStreak = $('abandon-streak-warn');
    if(abandonStreak){
      const today = todayStr();
      const todayData = S.pomodoroHistory[today];
      const todayHasPomo = todayData && todayData.count > 0;
      if(!todayHasPomo){
        abandonStreak.hidden = false;
      } else {
        abandonStreak.hidden = true;
      }
    }
    $('modal-abandon-confirm').hidden = false;
    $('btn-start').classList.add('shake');
    setTimeout(()=>$('btn-start').classList.remove('shake'), 600);
  }else{
    abandonPomo();
  }
}

$('abandon-continue').onclick = ()=>{ $('modal-abandon-confirm').hidden = true; };

$('abandon-confirm').onclick = ()=>{
  $('modal-abandon-confirm').hidden = true;
  abandonPomo();
};

function abandonPomo(){
  resetTimer();
  toast('番茄已放弃');
}

/* ============= WAKE LOCK ============= */
async function requestWakeLock(){
  if(!S.settings.wakelock) return;
  try{
    if(navigator.wakeLock){
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      wakeLockSentinel.onrelease = ()=>{ wakeLockSentinel = null; };
    }
  }catch(e){}
}

function releaseWakeLock(){
  if(wakeLockSentinel){
    wakeLockSentinel.release().catch(()=>{});
    wakeLockSentinel = null;
  }
}

/* ============= TASK CRUD ============= */
function findTask(id){ return S.tasks.find(t=>t.id===id); }

function createTask(title, opts={}){
  const t = {
    id: uid(),
    title: title.trim(),
    area: opts.area || 'inbox',
    priority: opts.priority || 4,
    tags: opts.tags || [],
    due: opts.due || null,
    project: opts.project || '',
    parentId: opts.parentId || null,
    subtasks: [],
    pinned: false,
    estimatedPomodoros: opts.estimatedPomodoros || 0,
    completedPomodoros: 0,
    notes: opts.notes || '',
    completed: false,
    completedAt: null,
    createdAt: isoNow(),
  };
  S.tasks.push(t);
  saveState();
  return t;
}

function updateTask(id, changes){
  const t = findTask(id);
  if(!t) return;
  Object.assign(t, changes);
  saveState();
  return t;
}

function deleteTask(id){
  const t = findTask(id);
  if(!t) return;
  if(t.parentId){
    const parent = findTask(t.parentId);
    if(parent && parent.subtasks){
      parent.subtasks = parent.subtasks.filter(st => st.id !== id);
    }
  }
  if(t.subtasks && t.subtasks.length){
    t.subtasks.forEach(st=>{
      deleteTask(st.id);
    });
  }
  const i = S.tasks.indexOf(t);
  if(i!==-1) S.tasks.splice(i,1);
  if(S.timer.currentTaskId===id) S.timer.currentTaskId=null;
  saveState();
}

function toggleTaskComplete(id){
  const t = findTask(id);
  if(!t) return;
  if(t.area==='done' && t.completed){
    t.completed = false;
    t.completedAt = null;
    t.area = 'inbox';
    saveState();
    renderTasks();
    updateDoneToday();
    updateAllViews();
    return;
  }
  // check subtasks
  if(!t.completed && t.subtasks && t.subtasks.length){
    const allDone = t.subtasks.every(st=>{
      const stt = findTask(st.id);
      return !stt || stt.completed;
    });
    if(!allDone){
      toast('请先完成所有子任务');
      return;
    }
  }
  t.completed = !t.completed;
  t.completedAt = t.completed ? isoNow() : null;
  if(t.completed && t.area!=='done') t.area='done';
  // Animate the task item
  const taskEl = qs('.task-item[data-id="'+id+'"]');
  if(taskEl){
    taskEl.classList.add('task-completing');
    setTimeout(()=>taskEl.classList.remove('task-completing'), 500);
  }
  saveState();
  renderTasks();
  updateDoneToday();
  updateAllViews();
}

function addSubtask(parentId, title){
  const parent = findTask(parentId);
  if(!parent) return;
  const st = createTask(title.trim(), {parentId, area:'next'});
  parent.subtasks = parent.subtasks || [];
  parent.subtasks.push({id:st.id, title:st.title, completed:false});
  saveState();
  return st;
}

/* parse quick input */
function parseQuickInput(str){
  let title = str;
  const tags = [];
  let priority = 4;
  let due = null;

  // !priority
  title = title.replace(/!(\d)/, (m,p)=>{
    priority = parseInt(p);
    if(priority<1) priority=1;
    if(priority>4) priority=4;
    return '';
  }).trim();

  // @today or @YYYY-MM-DD
  title = title.replace(/@(\S+)/, (m,p)=>{
    if(p==='today'||p==='今日'||p==='今天'){
      due = new Date();
      due.setHours(23,59,0,0);
      return '';
    }
    // try parse date
    const match = p.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(match){
      due = new Date(parseInt(match[1]),parseInt(match[2])-1,parseInt(match[3]),23,59);
      return '';
    }
    return m;
  }).trim();

  // #tag
  title.replace(/#(\S+)/g, (m,tag)=>{
    tags.push(tag);
    return '';
  });
  title = title.replace(/#\S+/g,'').trim();

  return {title, tags, priority, due};
}

function renderTasks(){
  const list = $('task-list');
  if(!list) return;
  const activeArea = qs('.gtd-tab.active');
  const area = activeArea ? activeArea.dataset.area : 'inbox';
  const filter = qs('.filter-btn.active');
  const fval = filter ? filter.dataset.filter : 'all';

  // projects tab shows projects list instead
  if(area==='projects'){
    renderProjectPanelList(list);
    updateAreaCounts();
    return;
  }

  let tasks = S.tasks.filter(t=>{
    if(t.parentId){
      const p = findTask(t.parentId);
      if(p) return false;
    }
    return t.area===area;
  });

  if(fval==='today'){
    const td = todayStr();
    tasks = tasks.filter(t=>{
      if(t.completed && t.completedAt && t.completedAt.startsWith(td)) return true;
      if(t.due){
        const d = new Date(t.due);
        return dateStr(d)===td;
      }
      return false;
    });
  }else if(fval==='overdue'){
    const now = new Date();
    tasks = tasks.filter(t=>!t.completed && t.due && new Date(t.due)<now);
  }else if(fval==='active'){
    tasks = tasks.filter(t=>!t.completed);
  }else if(fval==='completed'){
    tasks = tasks.filter(t=>t.completed);
  }

  // sort: incomplete first, priority asc, due asc
  tasks.sort((a,b)=>{
    if(a.completed!==b.completed) return a.completed ? 1 : -1;
    if(a.priority!==b.priority) return a.priority-b.priority;
    if(a.due && b.due) return new Date(a.due)-new Date(b.due);
    if(a.due) return -1;
    if(b.due) return 1;
    return 0;
  });

  list.innerHTML = '';
  tasks.forEach(t=>{
    const item = document.createElement('li');
    item.className = 'task-item' + (t.completed ? ' completed' : '');
    item.dataset.id = t.id;
    item.dataset.prio = t.priority || 4;

    const hasChildren = t.subtasks && t.subtasks.length > 0;

    // V7: Task aging for inbox items (>24h old)
    if(area==='inbox' && !t.completed && t.createdAt){
      const age = Date.now() - new Date(t.createdAt).getTime();
      if(age > 24*60*60*1000) item.classList.add('task-aged');
    }

    const prioEmoji = ['','🔴','🟠','🟡','⚪'][t.priority]||'⚪';

    let extraMeta = '';
    if(area==='waiting'){
      if(t.delegatedTo) extraMeta += '<span class="task-delegated">→ '+escHtml(t.delegatedTo)+'</span>';
      if(t.expectedDate) extraMeta += '<span class="task-expected">📅 '+fmtDue(t.expectedDate)+'</span>';
    }

    item.innerHTML = `
      <div class="task-check ${t.completed?'checked':''}" data-action="toggle">${t.completed?'✓':''}</div>
      <span class="task-prio">${prioEmoji}</span>
      ${area==='inbox' && !t.completed ? '<span class="task-clarify-btn" data-action="clarify">🧹</span>' : ''}
      <span class="task-text">${escHtml(t.title)}${hasChildren?' <span class="task-sub-indicator">📋</span>':''}</span>
      <div class="task-meta">
        ${t.completedPomodoros ? '<span class="task-pomo">🍅'+t.completedPomodoros+'</span>' : ''}
        ${t.tags && t.tags.length ? t.tags.map(tg=>'<span class="task-tag">#'+escHtml(tg)+'</span>').join('') : ''}
        ${t.project ? '<span class="task-project-dot" style="background:'+(getProjectColor(t.project)||'#888')+'"></span>' : ''}
        ${t.due ? '<span class="task-due'+(new Date(t.due)<new Date() && !t.completed?' overdue':'')+'">'+fmtDue(t.due)+'</span>' : ''}
        ${extraMeta}
      </div>
    `;
    item.onclick = (e)=>{
      const action = e.target.dataset.action;
      if(action==='toggle'){
        e.stopPropagation();
        toggleTaskComplete(t.id);
        return;
      }
      if(action==='clarify'){
        e.stopPropagation();
        openClarify(t.id);
        return;
      }
      if(!e.target.closest('.task-check') && !e.target.closest('.task-clarify-btn')){
        openDetail(t.id);
      }
    };
    list.appendChild(item);
  });

  // update counts
  updateAreaCounts();
}

function updateAreaCounts(){
  ['inbox','next','projects','waiting','someday','reference','done'].forEach(a=>{
    const cnt = S.tasks.filter(t=>{
      if(t.parentId){
        const p = findTask(t.parentId);
        if(p) return false;
      }
      return t.area===a && !t.completed;
    }).length;
    const el = $('cnt-'+a);
    if(el) el.textContent = cnt;
  });
}

function getProjectColor(name){
  const p = S.projects.find(x=>x.name===name);
  return p ? p.color : '#888';
}

/* ============= PROJECT PANEL ============= */
function renderProjectPanelList(list){
  list.innerHTML = '';
  S.projects.filter(p=>p.status==='active').forEach(p=>{
    const tasks = S.tasks.filter(t=>t.project===p.name && !t.completed);
    const doneTasks = S.tasks.filter(t=>t.project===p.name && t.completed);
    const totalPomos = tasks.reduce((s,t)=>s+(t.completedPomodoros||0),0)+doneTasks.reduce((s,t)=>s+(t.completedPomodoros||0),0);
    const nextAct = tasks.find(t=>t.area==='next');
    const div = document.createElement('div');
    div.className='task-item';
    div.innerHTML=`<div class="project-header"><span class="proj-color" style="background:${p.color}"></span><span class="proj-name">${escHtml(p.name)}</span><span class="proj-status">${tasks.length}个待办</span></div>`;
    if(p.outcome) div.innerHTML+=`<div class="project-outcome">🎯 ${escHtml(p.outcome)}</div>`;
    if(tasks.length+doneTasks.length>0){
      const pct = Math.min(100,(totalPomos/Math.max(1,(tasks.length+doneTasks.length)))*100);
      div.innerHTML+=`<div class="project-progress-bar"><div class="project-progress-fill" style="width:${pct}%"></div></div>`;
    }
    if(nextAct) div.innerHTML+=`<div class="project-next-action">▶ 下一步：${escHtml(nextAct.title)}</div>`;
    div.innerHTML+=`<div class="project-actions"><button class="btn-sm" data-action="add-next">＋下一步</button><button class="btn-sm btn-primary" data-action="focus">🍅 专注</button></div>`;
    div.onclick=e=>{
      const act=e.target.dataset.action;
      if(act==='add-next'){
        e.stopPropagation();
        const title=prompt('下一步行动：');
        if(!title) return;
        const t=createTask(title,{area:'next',project:p.name});
        toast('已添加下一步行动');
        renderProjectPanelList(list);
        updateAreaCounts();
      }else if(act==='focus'){
        e.stopPropagation();
        const target=nextAct||tasks[0];
        if(target){
          S.timer.currentTaskId=target.id;
          saveState();
          updateActiveTaskDisplay();
          navigateTo('work');
        }else{
          toast('项目暂无待办任务');
        }
      }else{
        openProjectDetail(p.id);
      }
    };
    list.appendChild(div);
  });
  if(list.children.length===0){
    list.innerHTML='<li class="task-item" style="justify-content:center;color:var(--text2);font-size:13px">暂无活跃项目</li>';
  }
}

function openProjectDetail(pid){
  const p=S.projects.find(x=>x.id===pid);
  if(!p) return;
  const tasks=S.tasks.filter(t=>t.project===p.name);
  // reuse detail panel with project view
  $('det-title').value = p.name;
  qsa('#det-prio-group .prio-btn').forEach(b=>b.classList.remove('active'));
  $('det-area').value = 'projects';
  $('det-project').value = p.name;
  $('det-parent-section').style.display='none';
  $('det-subtask-section').hidden = true;
  $('det-promote-project').style.display='none';
  $('det-estpomo').value = 0;
  $('det-notes').value = p.outcome||'';
  $('det-pomo-count').textContent = tasks.reduce((s,t)=>s+(t.completedPomodoros||0),0);
  $('det-created').textContent = '项目 ID: '+p.id.slice(0,8);
  // add delegated/waiting fields
  $('det-due').value = '';
  $('det-tags').innerHTML = '';
  $('det-delegated-row').hidden = true;
  $('det-expected-row').hidden = true;
  $('detail-panel').hidden=false;
  $('detail-panel').classList.add('show');
  $('detail-overlay').hidden=false;
  setTimeout(()=>$('detail-overlay').classList.add('show'),10);
  // change save to update project outcome
  $('det-save').onclick = ()=>{
    const newName=$('det-title').value.trim();
    if(!newName){toast('项目名称不能为空');return;}
    p.name=newName;
    p.outcome=$('det-notes').value;
    saveState();
    closeDetail();
    renderProjectPanelList($('task-list'));
    renderProjects();
    renderTasks();
  };
  $('det-delete').onclick = ()=>{
    if(!confirm('确定删除项目"'+p.name+'"？关联任务的项目字段将被清空。')) return;
    S.tasks.forEach(t=>{if(t.project===p.name) t.project='';});
    S.projects=S.projects.filter(x=>x.id!==pid);
    saveState();
    closeDetail();
    renderProjects();
    renderTasks();
  };
}

/* ============= CLARIFY ============= */
let clarifyTaskId = null;

function openClarify(id){
  clarifyTaskId = id;
  const t = findTask(id);
  if(!t) return;
  $('cl-title').textContent = escHtml(t.title);
  // populate project select
  const sel = $('cl-project-sel');
  sel.innerHTML = '<option value="">无项目</option>';
  S.projects.forEach(p=>{
    const opt = document.createElement('option');
    opt.value = p.name;
    opt.textContent = p.name;
    sel.appendChild(opt);
  });
  // reset extras
  $('cl-extras').hidden = true;
  $('cl-project-select').hidden = true;
  $('cl-waiting-fields').hidden = true;
  $('cl-delegated').value = '';
  $('cl-expected').value = '';
  $('cl-confirm').dataset.action = '';
  $('modal-clarify').hidden = false;
}

qsa('.cl-btn').forEach(b=>{
  b.onclick = ()=>{
    const action = b.dataset.action;
    $('cl-confirm').dataset.action = action;
    if(action==='project'){
      $('cl-project-select').hidden = false;
      $('cl-waiting-fields').hidden = true;
    }else if(action==='waiting'){
      $('cl-project-select').hidden = true;
      $('cl-waiting-fields').hidden = false;
    }else{
      $('cl-project-select').hidden = true;
      $('cl-waiting-fields').hidden = true;
    }
    $('cl-extras').hidden = (action!=='project' && action!=='waiting');
  };
});

$('cl-cancel').onclick = ()=>{ $('modal-clarify').hidden = true; clarifyTaskId = null; };

$('cl-confirm').onclick = ()=>{
  const action = $('cl-confirm').dataset.action;
  if(!action || clarifyTaskId===null) return;
  const t = findTask(clarifyTaskId);
  if(!t) return;
  switch(action){
    case 'delete':
      deleteTask(clarifyTaskId);
      toast('已删除');
      break;
    case 'doitnow':
      t.area = 'done';
      t.completed = true;
      t.completedAt = isoNow();
      toast('⚡ 已完成！');
      break;
    case 'next':
      t.area = 'next';
      toast('已转为下一步行动');
      break;
    case 'project':
      t.area = 'projects';
      t.project = $('cl-project-sel').value || t.project;
      toast('已归入项目');
      break;
    case 'waiting':
      t.area = 'waiting';
      t.delegatedTo = $('cl-delegated').value.trim() || null;
      t.expectedDate = $('cl-expected').value || null;
      toast('已设为等待他人');
      break;
    case 'someday':
      t.area = 'someday';
      toast('已移至将来也许');
      break;
    case 'reference':
      t.area = 'reference';
      toast('已转为参考信息');
      break;
  }
  $('modal-clarify').hidden = true;
  clarifyTaskId = null;
  saveState();
  renderTasks();
  updateDoneToday();
  updateAllViews();
};

/* ============= WEEKLY REVIEW ============= */
const weeklyReviewSteps = [
  { title:'📥 清空收件箱', desc:'将所有待处理的任务厘清到合适的区域', check:()=>S.tasks.filter(t=>t.area==='inbox'&&!t.completed).length===0 },
  { title:'📁 检查项目', desc:'查看所有活跃项目，确保都有下一步行动', check:()=>S.projects.filter(p=>p.status==='active').length===0 },
  { title:'▶ 审查行动清单', desc:'检查下一步行动是否仍然有效、优先级正确', check:()=>false },
  { title:'⏳ 检查等待清单', desc:'检查等待他人的事项，跟进过期项目', check:()=>S.tasks.filter(t=>t.area==='waiting'&&!t.completed).length===0 },
  { title:'💭 回顾将来也许', desc:'检查 someday 清单，看看是否有可以转为项目的', check:()=>S.tasks.filter(t=>t.area==='someday'&&!t.completed).length===0 },
  { title:'✅ 回顾已完成', desc:'看看本周完成了哪些任务，给自己鼓励', check:()=>false },
];
let wrCurrentStep = 0;

function showWeeklyReview(){
  wrCurrentStep = 0;
  renderWRStep();
  $('weekly-review-overlay').hidden = false;
}

function renderWRStep(){
  const step = weeklyReviewSteps[wrCurrentStep];
  const body = $('wr-body');
  const counts = {
    inbox: S.tasks.filter(t=>t.area==='inbox'&&!t.completed).length,
    projects: S.projects.filter(p=>p.status==='active').length,
    next: S.tasks.filter(t=>t.area==='next'&&!t.completed).length,
    waiting: S.tasks.filter(t=>t.area==='waiting'&&!t.completed).length,
    someday: S.tasks.filter(t=>t.area==='someday'&&!t.completed).length,
    done: S.tasks.filter(t=>t.area==='done'&&t.completedAt&&t.completedAt.startsWith(todayStr())).length,
  };
  let html = `<h4>${step.title}</h4><p style="font-size:13px;color:var(--text2);margin:4px 0 8px">${step.desc}</p>`;
  html += `<div class="wr-step-item"><span class="wr-count">📥</span> 收件箱待厘清：<strong>${counts.inbox}</strong></div>`;
  html += `<div class="wr-step-item"><span class="wr-count">📁</span> 活跃项目：<strong>${counts.projects}</strong></div>`;
  html += `<div class="wr-step-item"><span class="wr-count">▶</span> 下一步行动：<strong>${counts.next}</strong></div>`;
  html += `<div class="wr-step-item"><span class="wr-count">⏳</span> 等待他人：<strong>${counts.waiting}</strong></div>`;
  html += `<div class="wr-step-item"><span class="wr-count">💭</span> 将来也许：<strong>${counts.someday}</strong></div>`;
  html += `<div class="wr-step-item"><span class="wr-count">✅</span> 今日完成：<strong>${counts.done}</strong></div>`;
  body.innerHTML = html;
  $('wr-step').textContent = (wrCurrentStep+1)+'/'+weeklyReviewSteps.length;
  $('wr-prev').hidden = wrCurrentStep===0;
  $('wr-next').textContent = wrCurrentStep>=weeklyReviewSteps.length-1 ? '完成回顾' : '下一步';
}

$('wr-next').onclick = ()=>{
  if(wrCurrentStep >= weeklyReviewSteps.length-1){
    S._lastWeeklyReviewDate = todayStr();
    saveState();
    $('weekly-review-overlay').hidden = true;
    toast('✅ 本周回顾完成！');
    return;
  }
  wrCurrentStep++;
  renderWRStep();
};

$('wr-prev').onclick = ()=>{
  if(wrCurrentStep>0){ wrCurrentStep--; renderWRStep(); }
};

$('wr-skip').onclick = ()=>{
  S._lastWeeklyReviewDate = todayStr();
  saveState();
  $('weekly-review-overlay').hidden = true;
};

function fmtDue(d){
  if(!d) return '';
  const dt = new Date(d);
  const now = new Date();
  const diff = Math.ceil((dt-now)/(86400000));
  if(diff<0) return '逾期' + Math.abs(diff) + '天';
  if(diff===0) return '今天';
  if(diff===1) return '明天';
  if(diff<=7) return diff+'天后';
  return (dt.getMonth()+1)+'/'+dt.getDate();
}

/* ============= TASK FILTERS & TABS ============= */
qsa('.filter-btn').forEach(b=>{
  b.onclick = ()=>{
    qsa('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    renderTasks();
  };
});

qsa('.gtd-tab').forEach(b=>{
  b.onclick = ()=>{
    qsa('.gtd-tab').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    renderTasks();
  };
});

/* ============= TASK INPUT ============= */
$('task-input').onkeydown = e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    addFromInput();
  }
};

$('task-add-btn').onclick = addFromInput;

function addFromInput(){
  const input = $('task-input');
  const raw = input.value.trim();
  if(!raw) return;
  const parsed = parseQuickInput(raw);

  const qiPrio = qs('.prio-btn.active');
  const prio = qiPrio ? parseInt(qiPrio.dataset.prio) : parsed.priority;

  const qiProject = $('qi-project');
  const qiDue = $('qi-datetime');
  const qiTags = Array.from(qsa('#qi-tags .det-tag')).map(el=>el.dataset.tag);

  const mergedTags = [...new Set([...parsed.tags, ...qiTags])];

  const task = createTask(parsed.title, {
    area: 'inbox',
    priority: prio,
    tags: mergedTags,
    due: qiDue.value ? new Date(qiDue.value).toISOString() : parsed.due ? parsed.due.toISOString() : null,
    project: qiProject.value || '',
  });

  input.value = '';
  toast('已添加到收件箱');
  renderTasks();
  updateDoneToday();
  updateAllViews();
}

/* quick input bar */
$('task-input-more').onclick = ()=>{
  const bar = $('quick-input-bar');
  bar.hidden = !bar.hidden;
};

qsa('.prio-btn').forEach(b=>{
  b.onclick = ()=>{
    qsa('.prio-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
  };
});

$('qi-tag-input').onkeydown = e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    const val = e.target.value.trim();
    if(!val) return;
    const container = $('qi-tags');
    const tag = document.createElement('span');
    tag.className='det-tag';
    tag.dataset.tag = val;
    tag.innerHTML = '#'+escHtml(val)+' <span class="det-tag-del" data-action="del-tag">✕</span>';
    tag.onclick = e2=>{
      if(e2.target.dataset.action==='del-tag') tag.remove();
    };
    container.appendChild(tag);
    e.target.value='';
  }
};

$('qi-today-btn').onclick = ()=>{
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59).toISOString().slice(0,16);
  $('qi-datetime').value = local;
};

/* ============= DETAIL PANEL ============= */
let detailTaskId = null;

function openDetail(id){
  if(closeDetailTimer){
    clearTimeout(closeDetailTimer);
    closeDetailTimer = null;
  }
  detailTaskId = id;
  const t = findTask(id);
  if(!t) return;
  $('det-title').value = t.title;
  // prio
  qsa('#det-prio-group .prio-btn').forEach(b=>{
    b.classList.toggle('active', parseInt(b.dataset.prio)===t.priority);
  });
  // tags
  const tagsEl = $('det-tags');
  tagsEl.innerHTML = '';
  (t.tags||[]).forEach(tag=>{
    const span = document.createElement('span');
    span.className='det-tag';
    span.innerHTML = '#'+escHtml(tag)+' <span class="det-tag-del" data-action="del-tag-detail">✕</span>';
    span.querySelector('[data-action="del-tag-detail"]').onclick = ()=>{
      t.tags = t.tags.filter(x=>x!==tag);
      saveState();
      openDetail(id);
      renderTasks();
    };
    tagsEl.appendChild(span);
  });
  // due
  $('det-due').value = t.due ? new Date(t.due).toISOString().slice(0,16) : '';
  // delegated / expected
  const delRow = $('det-delegated-row');
  const expRow = $('det-expected-row');
  if(t.area==='waiting'){
    delRow.hidden = false;
    expRow.hidden = false;
    $('det-delegated').value = t.delegatedTo||'';
    $('det-expected').value = t.expectedDate||'';
  }else{
    delRow.hidden = true;
    expRow.hidden = true;
  }
  // area
  $('det-area').value = t.area;
  // project
  $('det-project').value = t.project||'';
  // parent
  const parentSec = $('det-parent-section');
  if(t.parentId){
    const p = findTask(t.parentId);
    if(p){
      parentSec.style.display='';
      $('det-parent-link').textContent = p.title;
      $('det-parent-link').onclick = ()=>{ openDetail(p.id); };
    }else{
      parentSec.style.display='none';
    }
  }else{
    parentSec.style.display='none';
  }
  // subtasks
  const subSec = $('det-subtask-section');
  subSec.hidden = false;
  $('det-subtask-count').textContent = (t.subtasks||[]).length;
  renderDetailSubtasks(t);
  // promote button
  const promoteBtn = $('det-promote-project');
  promoteBtn.style.display = t.parentId ? 'none' : '';
  // est pomo
  $('det-estpomo').value = t.estimatedPomodoros||0;
  // notes
  $('det-notes').value = t.notes||'';
  // pomo count
  $('det-pomo-count').textContent = t.completedPomodoros||0;
  // created
  $('det-created').textContent = new Date(t.createdAt).toLocaleString('zh-CN');
  // restore standard task handlers (in case openProjectDetail overrode them)
  $('det-save').onclick = detSaveTask;
  $('det-delete').onclick = detDeleteTask;
  // show
  $('detail-panel').hidden = false;
  $('detail-panel').classList.add('show');
  $('detail-overlay').hidden = false;
  setTimeout(()=>$('detail-overlay').classList.add('show'), 10);
}

function renderDetailSubtasks(t){
  const list = $('det-subtask-list');
  list.innerHTML = '';
  (t.subtasks||[]).forEach(st=>{
    const stt = findTask(st.id);
    if(!stt) return;
    const div = document.createElement('div');
    div.className='det-subtask';
    const checked = stt.completed;
    div.innerHTML = `<span class="st-check ${checked?'checked':''}">${checked?'✓':''}</span><span>${escHtml(stt.title)}</span>`;
    div.onclick = ()=>{
      toggleTaskComplete(stt.id);
      openDetail(t.id);
    };
    list.appendChild(div);
  });
}

$('det-subtask-add-btn').onclick = ()=>{
  const input = $('det-subtask-input');
  const title = input.value.trim();
  if(!title || !detailTaskId) return;
  addSubtask(detailTaskId, title);
  input.value='';
  openDetail(detailTaskId);
  renderTasks();
};

$('det-subtask-input').onkeydown = e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    $('det-subtask-add-btn').click();
  }
};

$('det-tag-input').onkeydown = e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    const val = e.target.value.trim();
    if(!val || !detailTaskId) return;
    const t = findTask(detailTaskId);
    if(!t) return;
    if(!t.tags) t.tags=[];
    if(!t.tags.includes(val)){
      t.tags.push(val);
      saveState();
    }
    e.target.value='';
    openDetail(detailTaskId);
    renderTasks();
  }
};

function detSaveTask(){
  if(!detailTaskId) return;
  const t = findTask(detailTaskId);
  if(!t) return;
  const title = $('det-title').value.trim();
  if(!title){ toast('标题不能为空'); return; }
  t.title = title;
  const activePrio = qs('#det-prio-group .prio-btn.active');
  if(activePrio) t.priority = parseInt(activePrio.dataset.prio);
  t.due = $('det-due').value ? new Date($('det-due').value).toISOString() : null;
  t.area = $('det-area').value;
  t.project = $('det-project').value;
  t.estimatedPomodoros = parseInt($('det-estpomo').value) || 0;
  t.notes = $('det-notes').value;
  if(t.area==='waiting'){
    t.delegatedTo = $('det-delegated').value.trim() || null;
    t.expectedDate = $('det-expected').value || null;
  }
  saveState();
  closeDetail();
  renderTasks();
  updateAllViews();
}

function detDeleteTask(){
  if(!detailTaskId) return;
  if(!confirm('确定删除该任务？')) return;
  deleteTask(detailTaskId);
  closeDetail();
  renderTasks();
  updateDoneToday();
}

$('det-save').onclick = detSaveTask;
$('det-delete').onclick = detDeleteTask;

$('det-start-timer').onclick = ()=>{
  if(!detailTaskId) return;
  // set timer mode to work and start
  setTimerMode('work');
  if(S.timer.phase==='running'){
    pauseTimer();
  }
  S.timer.currentTaskId = detailTaskId;
  S.timer.remaining = S.settings.work*60;
  S.timer.total = S.settings.work*60;
  startTimer();
  updateActiveTaskDisplay();
  closeDetail();
};

$('det-promote-project').onclick = ()=>{
  if(!detailTaskId) return;
  const t = findTask(detailTaskId);
  if(!t || t.area==='projects') return;
  // create a project with this task name
  const projName = t.title;
  if(S.projects.find(p=>p.name===projName)){
    toast('项目已存在');
    return;
  }
  const colors = ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3498db','#9b59b6','#1abc9c','#e91e63'];
  S.projects.push({id:uid(), name:projName, color:colors[S.projects.length%colors.length], outcome:'', status:'active', nextActionId:null});
  t.area='projects';
  t.project=projName;
  saveState();
  openDetail(t.id);
  renderProjects();
  renderTasks();
  toast('已转为项目');
};

let closeDetailTimer = null;

function closeDetail(){
  $('detail-panel').classList.remove('show');
  $('detail-overlay').classList.remove('show');
  if(closeDetailTimer) clearTimeout(closeDetailTimer);
  closeDetailTimer = setTimeout(()=>{
    $('detail-panel').hidden = true;
    $('detail-overlay').hidden = true;
    closeDetailTimer = null;
  }, 250);
  detailTaskId = null;
}

$('detail-close').onclick = closeDetail;
$('detail-overlay').onclick = closeDetail;

/* ============= TASK SELECTOR ============= */
function showTaskSelector(){
  const overlay = $('modal-task-select');
  const list = $('ts-task-list');
  list.innerHTML = '';
  const tasks = S.tasks.filter(t=>t.area==='next' && !t.completed)
    .sort((a,b)=>a.priority-b.priority);
  if(tasks.length===0){
    list.innerHTML = '<div class="ts-empty">📭 行动列表为空，先添加一个行动任务吧</div>';
  }else{
    tasks.forEach(t=>{
      const div = document.createElement('div');
      div.className = 'ts-task-item';
      const prioEmoji = ['','🔴','🟠','🟡','⚪'][t.priority]||'⚪';
      const pomoStr = t.completedPomodoros ? '🍅'+t.completedPomodoros : '';
      div.innerHTML = `<span class="ts-prio">${prioEmoji}</span><span class="ts-title">${escHtml(t.title)}</span><span class="ts-meta">${pomoStr}${t.tags&&t.tags.length?' #'+escHtml(t.tags[0]):''}</span>`;
      div.onclick = ()=>{
        qsa('.ts-task-item').forEach(x=>x.classList.remove('selected'));
        div.classList.add('selected');
        setTimeout(()=>{
          S.timer.currentTaskId = t.id;
          saveState();
          updateActiveTaskDisplay();
          overlay.hidden = true;
          startTimer();
          if(S.settings.focusMode) applyFocusMode(true);
        }, 200);
      };
      list.appendChild(div);
    });
  }
  overlay.hidden = false;
}

$('ts-select-none').onclick = ()=>{
  S.timer.currentTaskId = null;
  saveState();
  updateActiveTaskDisplay();
  $('modal-task-select').hidden = true;
  startTimer();
  if(S.settings.focusMode) applyFocusMode(true);
};

$('modal-task-select').onclick = e=>{
  if(e.target === $('modal-task-select')) $('modal-task-select').hidden = true;
};

/* ============= TIMER CLICK HANDLERS ============= */
$('btn-start').onclick = ()=>{
  if(S.timer.phase==='idle'){
    if(S.timer.mode==='work'){
      // Anti-procrastination: check if user is hesitating
      const today = todayStr();
      const todayData = S.pomodoroHistory[today] || {count:0};
      const hour = new Date().getHours();
      
      // If it's late and goal not reached, show urgency
      if(todayData.count === 0 && hour >= 16){
        toast('⏰ 今天还没开始！每拖延一分钟就少一分钟！', 4000);
      }
      
      // always show task selector when starting a new work session
      const hasTasks = S.tasks.some(t=>t.area==='next' && !t.completed);
      if(hasTasks){
        showTaskSelector();
        return;
      }
    }
    startTimer();
    if(S.settings.focusMode) applyFocusMode(true);
  }else if(S.timer.phase==='running'){
    pauseTimer();
    if(S.settings.focusMode) applyFocusMode(false);
  }else if(S.timer.phase==='paused'){
    resumeTimer();
    if(S.settings.focusMode) applyFocusMode(true);
  }else if(S.timer.phase==='finished'){
    handleTimerFinish();
    return;
  }
  updateActiveTaskDisplay();
};

/* timer digits click — open time picker */
$('timer-digits').onclick = ()=>{
  if(S.timer.phase==='running') return;
  $('modal-time-picker').hidden = false;
};

$('time-picker-cancel').onclick = ()=>{ $('modal-time-picker').hidden = true; };

$('modal-time-picker').onclick = e=>{
  if(e.target === $('modal-time-picker')) $('modal-time-picker').hidden = true;
};

qsa('.time-preset').forEach(b=>{
  b.onclick = ()=>{
    qsa('.time-preset').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const mins = parseInt(b.dataset.min);
    S.timer.remaining = mins*60;
    S.timer.total = mins*60;
    updateTimerDisplay();
    $('modal-time-picker').hidden = true;
    toast('已设为 '+mins+' 分钟');
  };
});

$('time-custom-confirm').onclick = ()=>{
  const mins = parseInt($('time-custom-input').value);
  if(!mins || mins<1 || mins>90) return;
  S.timer.remaining = mins*60;
  S.timer.total = mins*60;
  updateTimerDisplay();
  $('modal-time-picker').hidden = true;
  toast('已设为 '+mins+' 分钟');
};

$('btn-reset').onclick = ()=>{
  if(S.timer.phase==='running' || S.timer.phase==='paused'){
    if(S.settings.interruptConfirm && S.timer.mode==='work'){
      const elapsed = S.timer.total - S.timer.remaining;
      $('abandon-minutes').textContent = Math.round(elapsed/60);
      $('modal-abandon-confirm').hidden = false;
      return;
    }
  }
  resetTimer();
};

qsa('.mode-btn').forEach(b=>{
  b.onclick = ()=>{
    setTimerMode(b.dataset.mode);
  };
});

/* ============= FOCUS MODE ============= */
function applyFocusMode(on){
  const wrap = qs('.work-view');
  if(!wrap) return;
  if(on && S.settings.focusMode && S.timer.mode==='work'){
    wrap.classList.add('focus-mode');
  }else{
    wrap.classList.remove('focus-mode');
  }
}

/* ============= FOCUS MODE TOGGLE ============= */
let focusModeFull = false;
// Focus toggle handler is defined in V7 section above (line ~603) with lockdown support

/* ============= REST GUIDE ============= */
function showRestGuide(){
  $('rest-guide-overlay').hidden = false;
}

$('rest-options').onclick = e=>{
  const btn = e.target.closest('.rest-opt-btn');
  if(!btn) return;
  const type = btn.dataset.rest;
  const instr = {
    breathe: '🧘 闭眼深呼吸\n\n1. 慢慢吸气 4 秒\n2. 屏住呼吸 4 秒\n3. 缓缓呼气 6 秒\n4. 重复 5 次\n\n完成后可以自由休息',
    stretch: '🤸 站立伸展\n\n1. 双手向上伸直，拉伸全身 30秒\n2. 左右侧弯腰各 30秒\n3. 转动脖子，顺时针逆时针各 3圈\n\n完成后可以自由休息',
    nature: '🌿 远眺放松\n\n1. 走到窗边或阳台\n2. 眺望远方至少 20秒\n3. 注意绿色的植物或开阔的景色\n\n完成后可以自由休息',
    free: '自由休息，记得设定休息时长'
  };
  $('rest-instruction').textContent = instr[type] || instr.free;
  $('rest-timer-display').hidden = false;
};

$('rest-guide-overlay').onclick = e=>{
  if(e.target === $('rest-guide-overlay')){
    $('rest-guide-overlay').hidden = true;
  }
};

/* ============= CELEBRATION ============= */
function showCelebration(){
  if(!S.settings.celebration) return;
  const overlay = $('celebration-overlay');
  if(!overlay) return;
  overlay.hidden = false;
  const container = qs('.confetti-container');
  if(!container) return;
  container.innerHTML = '';
  const colors = ['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6','#e91e63','#ff6b6b'];
  const shapes = ['','star','circle','diamond'];
  for(let i=0;i<60;i++){
    const c = document.createElement('div');
    c.className='confetti ' + shapes[Math.floor(Math.random()*shapes.length)];
    c.style.left=Math.random()*100+'%';
    c.style.background=colors[Math.floor(Math.random()*colors.length)];
    c.style.width=(6+Math.random()*10)+'px';
    c.style.height=(6+Math.random()*10)+'px';
    c.style.animationDuration=(2+Math.random()*3)+'s';
    c.style.animationDelay=Math.random()*1.5+'s';
    container.appendChild(c);
  }
  // Screen flash effect
  const flash = document.createElement('div');
  flash.className = 'celebration-flash';
  overlay.appendChild(flash);
  setTimeout(()=>{ flash.remove(); }, 600);
  setTimeout(()=>{ overlay.hidden=true; }, 4000);
}

/* ============= DAILY LAUNCH ============= */
function showDailyLaunch(){
  const today = todayStr();
  // show yesterday's stats
  const y = new Date(); y.setDate(y.getDate()-1);
  const yStr = dateStr(y);
  const yData = S.pomodoroHistory[yStr];
  if(yData){
    $('dl-y-pomo').textContent = yData.count;
    $('dl-yesterday').hidden = false;
  }else{
    $('dl-yesterday').hidden = true;
  }

  // show focus list
  renderDlFocus();

  // inbox hint
  const inboxCount = S.tasks.filter(t=>t.area==='inbox' && !t.completed).length;
  if(inboxCount > 0){
    $('dl-inbox-count').textContent = inboxCount;
    $('dl-inbox-hint').hidden = false;
  }else{
    $('dl-inbox-hint').hidden = true;
  }

  $('daily-launch-overlay').hidden = false;
}

function renderDlFocus(){
  const list = $('dl-focus-list');
  list.innerHTML = '';
  S.dailyFocusTasks.forEach((item,i)=>{
    const div = document.createElement('div');
    div.className='dl-focus-item';
    div.innerHTML = `<span>${i+1}. ${escHtml(item.title)}</span><span class="dfi-del" data-idx="${i}">✕</span>`;
    div.querySelector('.dfi-del').onclick = ()=>{
      const taskIdx = S.tasks.findIndex(t=>t.id===item.id);
      if(taskIdx>=0 && !S.tasks[taskIdx].completed) deleteTask(item.id);
      S.dailyFocusTasks.splice(i,1);
      saveState();
      renderDlFocus();
      renderTasks();
    };
    list.appendChild(div);
  });
}

$('dl-quick-add-btn').onclick = ()=>{
  const input = $('dl-quick-input');
  const val = input.value.trim();
  if(!val) return;
  if(S.dailyFocusTasks.length >= 3){
    toast('最多选择 3 个焦点任务');
    return;
  }
  let task = S.tasks.find(t=>t.title===val && !t.completed);
  if(!task) task = createTask(val);
  S.dailyFocusTasks.push({id: task.id, title: val});
  input.value='';
  saveState();
  renderDlFocus();
  renderTasks();
  updateAreaCounts();
};

$('dl-quick-input').onkeydown = e=>{
  if(e.key==='Enter'){ e.preventDefault(); $('dl-quick-add-btn').click(); }
};

$('dl-skip').onclick = ()=>{
  $('daily-launch-overlay').hidden = true;
  renderTasks();
  updateAreaCounts();
};

$('dl-start').onclick = ()=>{
  // auto-focus first focus task
  if(S.dailyFocusTasks.length > 0){
    const existing = S.tasks.find(t=>t.id===S.dailyFocusTasks[0].id && !t.completed);
    if(existing){
      S.timer.currentTaskId = existing.id;
      saveState();
      updateActiveTaskDisplay();
    }
  }
  $('daily-launch-overlay').hidden = true;
  renderTasks();
  updateAreaCounts();
  toast('今天也要加油！🍅');
};

/* ============= DAILY REVIEW ============= */
function showDailyReview(){
  const today = todayStr();
  const data = S.pomodoroHistory[today] || {count:0,focusMins:0};
  $('dr-pomo').textContent = data.count;
  $('dr-mins').textContent = Math.round(data.focusMins);

  // compare with yesterday
  const y = new Date(); y.setDate(y.getDate()-1);
  const yStr = dateStr(y);
  const yData = S.pomodoroHistory[yStr];
  if(yData){
    const diff = data.count - yData.count;
    const diffText = (diff>=0?'+':'')+diff;
    $('dr-diff-pomo').textContent = diffText;
    if(diff > 0) $('dr-compare').innerHTML = '<p>🔥 比昨天多了 '+diff+' 个！</p>';
    else if(diff === 0) $('dr-compare').innerHTML = '<p>📊 和昨天持平</p>';
    else $('dr-compare').innerHTML = '<p>📊 比昨日 '+diffText+' 个番茄</p>';
    $('dr-compare').hidden = false;
  }else{
    $('dr-compare').hidden = true;
  }

  // MDA: Score & Level section in daily review
  const drScore = $('dr-score-section');
  if(drScore){
    const info = getLevelInfo(S.score||0);
    const scoreEarned = data.count * 10;
    const goalBonus = (data.count >= (S.settings.dailyGoal||6)) ? 50 : 0;
    const totalEarned = scoreEarned + goalBonus;
    drScore.innerHTML = '<div class="dr-stat-row"><span>今日得分</span><strong class="dr-score-val">+'+totalEarned+'分</strong></div>' +
      '<div class="dr-stat-row"><span>累计总分</span><strong>'+Math.max(0,S.score||0)+'分</strong></div>' +
      '<div class="dr-stat-row"><span>当前等级</span><strong>Lv.'+info.level+' '+info.title+'</strong></div>';
    if(yData){
      const yScoreEarned = yData.count * 10 + ((yData.count >= (S.settings.dailyGoal||6)) ? 50 : 0);
      const scoreDiff = totalEarned - yScoreEarned;
      const diffSign = scoreDiff >= 0 ? '+' : '';
      drScore.innerHTML += '<div class="dr-stat-row dr-compare-score"><span>与昨日对比</span><strong>'+(scoreDiff>=0?'🔥':'')+' '+diffSign+scoreDiff+'分</strong></div>';
    }
    drScore.hidden = false;
  }

  // goal completion rate
  const goal = S.settings.dailyGoal || 6;
  const rate = Math.min(100, Math.round((data.count/goal)*100));

  // MDA: encouraging message based on performance
  const unfinished = S.tasks.filter(t=>!t.completed && (t.area==='next'||t.area==='inbox'));
  let suggestion = '今日完成 '+data.count+'/'+goal+' 个番茄，目标完成率 '+rate+'%。';
  if(data.count >= goal){
    suggestion = '🎉 太棒了！今日超额完成目标！你获得了 '+(data.count*10+50)+' 分，继续保持！';
  } else if(data.count >= goal/2){
    suggestion = '💪 不错！完成了目标的一半以上，明天争取达标！';
  } else if(data.count > 0){
    suggestion = '🌱 今天做了 '+data.count+' 个番茄，每个番茄都是进步。明天加油！';
  } else {
    suggestion = '🌅 今天还没开始，没关系，明天是新的一天！';
  }
  if(unfinished.length > 0 && data.count < goal){
    suggestion += ' 明天可以优先处理 "' + unfinished[0].title + '" 等 ' + unfinished.length + ' 个待办。';
  } else if(unfinished.length === 0){
    suggestion += ' 所有任务都完成了，好好休息！';
  }
  $('dr-suggestion').textContent = suggestion;

  $('daily-review-overlay').hidden = false;
}

$('dr-skip').onclick = ()=>{ $('daily-review-overlay').hidden = true; };
$('dr-done').onclick = ()=>{ $('daily-review-overlay').hidden = true; };

/* ============= RESUMPTION BAR ============= */
function checkTaskResumption(){
  const bar = $('resumption-bar');
  if(!bar) return;
  if(!S.lastCompletedTaskId) return;
  const task = findTask(S.lastCompletedTaskId);
  if(!task || task.completed){
    bar.hidden = true;
    return;
  }
  $('resumption-task-name').textContent = task.title;
  $('resumption-resume').onclick = ()=>{
    S.timer.currentTaskId = task.id;
    saveState();
    updateActiveTaskDisplay();
    if(S.timer.mode!=='work') setTimerMode('work');
    S.timer.remaining = S.settings.work*60;
    S.timer.total = S.settings.work*60;
    startTimer();
    bar.hidden = true;
  };
  $('resumption-dismiss').onclick = ()=>{
    bar.hidden = true;
  };
  bar.hidden = false;
}

/* ============= QUICK START 5-MIN ============= */
function showQuickStartContinue(taskName){
  $('qs-task-name').textContent = taskName;
  $('modal-quickstart-continue').hidden = false;
}

$('qs-continue').onclick = ()=>{
  $('modal-quickstart-continue').hidden = true;
  S.timer.remaining = S.settings.work*60;
  S.timer.total = S.settings.work*60;
  startTimer();
};

$('qs-stop').onclick = ()=>{
  $('modal-quickstart-continue').hidden = true;
};

/* ============= CALENDAR ============= */
let calViewDate = new Date();
let calMode = 'month';

function renderCalendar(){
  renderCalendarMonthlySummary();
  $('cal-month').textContent = calViewDate.getFullYear()+'年'+(calViewDate.getMonth()+1)+'月';
  if(calMode==='month'){
    renderMonthGrid();
    $('cal-dayview').style.display='none';
    $('cal-day-tasks').hidden=true;
  }else{
    $('cal-dayview').style.display='';
    $('cal-grid-wrap').style.display='none';
    renderDayView();
  }
}

function renderMonthGrid(){
  const grid = $('cal-grid');
  const year = calViewDate.getFullYear();
  const month = calViewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  grid.innerHTML = '';
  const today = todayStr();

  // previous month days
  for(let i=firstDay-1;i>=0;i--){
    const d = daysInPrev-i;
    const dt = new Date(year, month-1, d);
    const ds = dateStr(dt);
    const count = (S.pomodoroHistory[ds]||{}).count||0;
    const cell = document.createElement('div');
    cell.className='cal-day other-month';
    cell.textContent = d;
    if(count>0) cell.innerHTML += '<span class="cal-dot completed"></span>';
    cell.onclick = ()=>selectDate(dt);
    cell.ondblclick = (e)=>{ e.stopPropagation(); switchToDayView(dt); };
    grid.appendChild(cell);
  }

  // current month
  for(let d=1;d<=daysInMonth;d++){
    const dt = new Date(year, month, d);
    const ds = dateStr(dt);
    const count = (S.pomodoroHistory[ds]||{}).count||0;
    const cell = document.createElement('div');
    cell.className='cal-day';
    if(ds===today) cell.classList.add('today');
    cell.textContent = d;
    // V7: heatmap intensity
    const goal = S.settings.dailyGoal || 6;
    const intensity = getCalDayIntensity(count, goal);
    if(intensity > 0){
      cell.classList.add('cal-intensity-'+intensity);
      // show count badge
      if(count > 1){
        const badge = document.createElement('span');
        badge.className='cal-pomo-count';
        badge.textContent = count;
        cell.appendChild(badge);
      } else {
        const dot = document.createElement('span');
        dot.className='cal-dot completed';
        cell.appendChild(dot);
      }
    }
    cell.onclick = ()=>selectDate(dt);
    cell.ondblclick = (e)=>{ e.stopPropagation(); switchToDayView(dt); };
    grid.appendChild(cell);
  }

  // next month days (fill rest of grid)
  const totalCells = firstDay+daysInMonth;
  const remaining = (7 - totalCells % 7) % 7;
  if(remaining>0){
    // need a separate row
    for(let d=1;d<=remaining;d++){
      const dt = new Date(year, month+1, d);
      const ds = dateStr(dt);
      const count = (S.pomodoroHistory[ds]||{}).count||0;
      const cell = document.createElement('div');
      cell.className='cal-day other-month';
      cell.textContent = d;
      if(count>0) cell.innerHTML += '<span class="cal-dot completed"></span>';
      cell.onclick = ()=>selectDate(dt);
      cell.ondblclick = (e)=>{ e.stopPropagation(); switchToDayView(dt); };
      grid.appendChild(cell);
    }
  }
}

function switchToDayView(dt){
  calViewDate = new Date(dt);
  calMode = 'day';
  $('cal-view-month').classList.remove('active');
  $('cal-view-day').classList.add('active');
  $('cal-grid-wrap').style.display='none';
  $('cal-dayview').style.display='';
  renderCalendar();
}

function selectDate(dt){
  const ds = dateStr(dt);
  // show tasks for that day
  const tasks = S.tasks.filter(t=>{
    if(t.completed && t.completedAt && t.completedAt.startsWith(ds)) return true;
    if(t.due && new Date(t.due).toDateString()===dt.toDateString()) return true;
    return false;
  });
  $('cal-day-title').textContent = dt.getFullYear()+'年'+(dt.getMonth()+1)+'月'+dt.getDate()+'日';
  const list = $('cal-task-list');
  list.innerHTML = '';
  tasks.forEach(t=>{
    const item = document.createElement('li');
    item.className='task-item' + (t.completed?' completed':'');
    item.innerHTML = `<span class="task-text">${escHtml(t.title)}</span>`;
    item.onclick = ()=>{ openDetail(t.id); };
    list.appendChild(item);
  });
  $('cal-day-tasks').hidden = false;
}

function renderDayView(){
  $('cal-day-date-label').textContent = calViewDate.toLocaleDateString('zh-CN', {year:'numeric',month:'long',day:'numeric',weekday:'long'});
  const timeline = $('cal-dayview-timeline');
  timeline.innerHTML = '';
  const ds = dateStr(calViewDate);
  const dayTasks = S.tasks.filter(t=>{
    if(t.completed && t.completedAt && t.completedAt.startsWith(ds)) return true;
    if(t.due && new Date(t.due).toDateString()===calViewDate.toDateString()) return true;
    return false;
  });
  // show time blocks
  for(let h=6;h<23;h++){
    const slot = document.createElement('div');
    slot.className='cal-time-slot';
    slot.innerHTML = `<span class="time-label">${String(h).padStart(2,'0')}:00</span>`;
    // find tasks for this hour
    const hourStr = String(h).padStart(2,'0');
    const ts = dayTasks.filter(t=>t.completedAt && t.completedAt.includes('T'+hourStr));
    ts.forEach(t=>{
      const span = document.createElement('span');
      span.className='event-indicator';
      span.textContent = t.title;
      slot.appendChild(span);
    });
    timeline.appendChild(slot);
  }
}

$('cal-prev').onclick = ()=>{
  if(calMode==='month'){
    calViewDate.setMonth(calViewDate.getMonth()-1);
  }else{
    calViewDate.setDate(calViewDate.getDate()-1);
  }
  renderCalendar();
};

$('cal-next').onclick = ()=>{
  if(calMode==='month'){
    calViewDate.setMonth(calViewDate.getMonth()+1);
  }else{
    calViewDate.setDate(calViewDate.getDate()+1);
  }
  renderCalendar();
};

$('cal-today-btn').onclick = ()=>{
  calViewDate = new Date();
  renderCalendar();
};

$('cal-view-month').onclick = ()=>{
  calMode='month';
  $('cal-view-month').classList.add('active');
  $('cal-view-day').classList.remove('active');
  $('cal-grid-wrap').style.display='';
  $('cal-dayview').style.display='none';
  renderCalendar();
};

$('cal-view-day').onclick = ()=>{
  calMode='day';
  $('cal-view-day').classList.add('active');
  $('cal-view-month').classList.remove('active');
  $('cal-grid-wrap').style.display='none';
  $('cal-dayview').style.display='';
  renderCalendar();
};

$('cal-day-prev').onclick = ()=>{ calViewDate.setDate(calViewDate.getDate()-1); renderDayView(); };
$('cal-day-next').onclick = ()=>{ calViewDate.setDate(calViewDate.getDate()+1); renderDayView(); };

/* ============= STATS ============= */
function renderStats(){
  const today = todayStr();
  const td = S.pomodoroHistory[today] || {count:0,focusMins:0};
  // V7: render grade and records first
  renderDailyGrade();
  renderPersonalRecords();
  // week
  let weekCount = 0;
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // Mon=1...Sun=7
  for(let i=0;i<7;i++){
    const d = new Date(now);
    d.setDate(d.getDate()-i);
    const ds = dateStr(d);
    const c = (S.pomodoroHistory[ds]||{}).count||0;
    weekCount += c;
  }
  // total
  let total = 0;
  Object.values(S.pomodoroHistory).forEach(d=>{ total+=d.count; });

  $('s-today-count').textContent = td.count;
  $('s-today-mins').textContent = Math.round(td.focusMins)+'m';
  $('s-week-count').textContent = weekCount;
  $('s-total-count').textContent = total;

  // habit streak
  renderStreak();
  // heatmap
  renderHeatmap();
  // tags
  renderTagBars();
  // daily focus
  renderDailyFocus();
  // chart
  renderWeeklyChart();
  // V7: insights
  generateInsights();
}

function renderStreak(){
  let current = 0;
  let longest = 0;
  let temp = 0;
  const d = new Date();
  const today = todayStr();

  // current streak: consecutive days ending today with data
  if(S.pomodoroHistory[today] && S.pomodoroHistory[today].count>0){
    current = 1;
    temp = 1;
  }

  // go backwards counting consecutive days
  for(let i=1;i<366;i++){
    const p = new Date(d);
    p.setDate(p.getDate()-i);
    const ds = dateStr(p);
    const data = S.pomodoroHistory[ds];
    if(data && data.count>0){
      temp++;
      // current only counts if today has data AND chain is unbroken
      if(current>0) current++;
    }else{
      if(temp>longest) longest=temp;
      if(current>0) current=0;
      temp=0;
    }
  }
  if(temp>longest) longest=temp;
  // if today has no data, current streak is 0
  if(!S.pomodoroHistory[today] || S.pomodoroHistory[today].count===0) current=0;

  $('h-current').textContent = current;
  $('h-longest').textContent = longest;

  // 66-day goal
  const goalFill = $('h-goal-fill');
  const goalText = $('h-goal-text');
  const pct = Math.min(100, (current/66)*100);
  goalFill.style.width = pct+'%';
  goalText.textContent = current+'/66';

  const badge = $('streak-badge');
  badge.hidden = current===0;
  $('streak-num').textContent = current;
}

function renderHeatmap(){
  const grid = $('habit-heatmap');
  grid.innerHTML = '';
  const now = new Date();
  // show last 12 weeks (84 days)
  const days = 84;
  for(let i=days-1;i>=0;i--){
    const d = new Date(now);
    d.setDate(d.getDate()-i);
    const ds = dateStr(d);
    const data = S.pomodoroHistory[ds];
    const count = data ? data.count : 0;
    const cell = document.createElement('div');
    cell.className='habit-cell';
    const level = count===0 ? 0 : count===1 ? 1 : count<=3 ? 2 : count<=6 ? 3 : 4;
    cell.dataset.level = level;
    cell.dataset.title = ds + ': ' + count + (count>0?' 个番茄':'');
    grid.appendChild(cell);
  }
}

function renderTagBars(){
  const container = $('tag-bars');
  container.innerHTML = '';
  const tagCount = {};
  S.tasks.forEach(t=>{
    if(t.completed){
      (t.tags||[]).forEach(tag=>{
        tagCount[tag] = (tagCount[tag]||0)+1;
      });
    }
  });
  const sorted = Object.entries(tagCount).sort((a,b)=>b[1]-a[1]);
  const max = sorted.length>0 ? sorted[0][1] : 1;
  sorted.forEach(([tag,count])=>{
    const row = document.createElement('div');
    row.className='tag-bar-row';
    row.innerHTML = `<span class="tag-name">#${escHtml(tag)}</span><div class="tag-bar"><div class="tag-bar-fill" style="width:${(count/max)*100}%"></div></div><span class="tag-count">${count}</span>`;
    container.appendChild(row);
  });
}

function renderDailyFocus(){
  const section = $('daily-focus-section');
  const list = $('df-list');
  list.innerHTML = '';
  if(S.dailyFocusTasks.length===0){
    section.hidden = true;
    return;
  }
  section.hidden = false;
  const today = todayStr();
  const completedToday = S.tasks.filter(t=>t.completed && t.completedAt && t.completedAt.startsWith(today)).length;
  $('df-count').textContent = Math.min(completedToday, S.dailyFocusTasks.length)+'/'+S.dailyFocusTasks.length;

  // check each focus task
  let doneCount = 0;
  S.dailyFocusTasks.forEach(item=>{
    const existing = S.tasks.find(t=>t.id===item.id && t.completed && t.completedAt && t.completedAt.startsWith(today));
    const div = document.createElement('div');
    div.className='df-item';
    const checked = !!existing;
    if(checked) doneCount++;
    div.innerHTML = `<span class="st-check ${checked?'checked':''}">${checked?'✓':''}</span><span>${escHtml(item.title)}</span>`;
    list.appendChild(div);
  });

  // progress
  const progress = $('focus-progress');
  progress.hidden = false;
  $('focus-progress-fill').style.width = (doneCount/S.dailyFocusTasks.length*100)+'%';
  $('focus-progress-text').textContent = doneCount+'/'+S.dailyFocusTasks.length;
}

function renderWeeklyChart(){
  const canvas = $('chart-weekly');
  if(!canvas) return;
  if(chartInstance){
    chartInstance.destroy();
    chartInstance = null;
  }
  if(typeof Chart === 'undefined') return;
  const now = new Date();
  const labels = [];
  const data = [];
  for(let i=6;i>=0;i--){
    const d = new Date(now);
    d.setDate(d.getDate()-i);
    labels.push((d.getMonth()+1)+'/'+d.getDate());
    const ds = dateStr(d);
    data.push((S.pomodoroHistory[ds]||{}).count||0);
  }
  chartInstance = new Chart(canvas, {
    type:'bar',
    data:{
      labels,
      datasets:[{
        label:'番茄数',
        data,
        backgroundColor:'rgba(231,76,60,0.6)',
        borderColor:'#e74c3c',
        borderWidth:1,
        borderRadius:4,
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{
        y:{beginAtZero:true,ticks:{stepSize:1},grid:{color:'rgba(0,0,0,0.06)'}},
        x:{grid:{display:false}}
      }
    }
  });
}

/* ============= EXPORT / IMPORT ============= */
$('btn-export').onclick = ()=>{
  const blob = new Blob([JSON.stringify(S,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url;
  a.download='pomotodo-backup-'+todayStr()+'.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('数据已导出');
};

$('btn-import').onchange = e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev)=>{
    try{
      const data = JSON.parse(ev.target.result);
      if(!data || !data.version) throw new Error('Invalid format');
      S = data;
      saveState();
      toast('数据已导入');
      initApp();
    }catch(err){
      toast('导入失败：文件格式不正确');
    }
  };
  reader.readAsText(file);
  e.target.value='';
};

/* ============= SETTINGS ============= */
function loadSettings(){
  const s = S.settings;
  $('opt-work').value = s.work;
  $('opt-short').value = s.shortBreak;
  $('opt-long').value = s.longBreak;
  $('opt-interval').value = s.longBreakInterval;
  $('opt-daily-goal').value = s.dailyGoal || 6;
  $('opt-auto-break').checked = s.autoBreak;
  $('opt-auto-work').checked = s.autoWork;
  $('opt-rest-guide').checked = s.restGuide;
  $('opt-focus-mode').checked = s.focusMode;
  $('opt-celebration').checked = s.celebration;
  $('opt-interrupt-confirm').checked = s.interruptConfirm;
  $('opt-sound').checked = s.sound;
  $('opt-volume').value = s.volume;
  $('range-val').textContent = Math.round(s.volume*100)+'%';
  $('opt-notify').checked = s.notify;
  $('opt-wakelock').checked = s.wakelock;
  // V20: sleep settings
  const sleepEl = $('opt-sleep-enforce');
  if(sleepEl) sleepEl.checked = S.settings.sleepEnforce;
  const bedEl = $('opt-bedtime');
  if(bedEl) bedEl.value = S.settings.bedtime || '23:00';
  const windEl = $('opt-winddown');
  if(windEl) windEl.value = S.settings.winddownMinutes || 30;
  const wakeEl = $('opt-waketime');
  if(wakeEl) wakeEl.value = S.settings.waketime || '07:00';
  // theme
  applyTheme(s.theme);
  qsa('.t-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.theme===s.theme);
  });
}

$('opt-volume').oninput = function(){
  S.settings.volume = parseFloat(this.value);
  $('range-val').textContent = Math.round(this.value*100)+'%';
  saveState();
};

$('opt-notify').onchange = function(){
  S.settings.notify = this.checked;
  if(this.checked && Notification.permission==='default'){
    Notification.requestPermission();
  }
  saveState();
};

function bindSettingToggle(id, key){
  const el = $(id);
  if(!el) return;
  el.onchange = function(){
    S.settings[key] = this.checked;
    saveState();
    applySettings();
  };
}

bindSettingToggle('opt-auto-break','autoBreak');
bindSettingToggle('opt-auto-work','autoWork');
bindSettingToggle('opt-rest-guide','restGuide');
bindSettingToggle('opt-focus-mode','focusMode');
bindSettingToggle('opt-celebration','celebration');
bindSettingToggle('opt-interrupt-confirm','interruptConfirm');
bindSettingToggle('opt-sound','sound');
bindSettingToggle('opt-wakelock','wakelock');
bindSettingToggle('opt-sleep-enforce','sleepEnforce');

// Bedtime setting
$('opt-bedtime').onchange = function(){
  S.settings.bedtime = this.value || '23:00';
  saveState();
};
$('opt-winddown').onchange = function(){
  S.settings.winddownMinutes = parseInt(this.value) || 30;
  saveState();
};
$('opt-waketime').onchange = function(){
  S.settings.waketime = this.value || '07:00';
  saveState();
};

$('opt-daily-goal').onchange = function(){
  S.settings.dailyGoal = parseInt(this.value) || 6;
  saveState();
  updateDailyGoal();
};

const settingsKeyMap = {work:'work', short:'shortBreak', long:'longBreak', interval:'longBreakInterval'};
['opt-work','opt-short','opt-long','opt-interval'].forEach(id=>{
  $(id).onchange = function(){
    const key = settingsKeyMap[id.replace('opt-','')];
    const val = parseInt(this.value);
    if(val<1) return;
    S.settings[key] = val;
    saveState();
    if(S.timer.phase==='idle'){
      S.timer.remaining = S.settings[S.timer.mode]*60;
      S.timer.total = S.settings[S.timer.mode]*60;
      updateTimerDisplay();
    }
  };
});

qsa('.t-btn').forEach(b=>{
  b.onclick = ()=>{
    S.settings.theme = b.dataset.theme;
    applyTheme(S.settings.theme);
    qsa('.t-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    saveState();
  };
});

function applyTheme(theme){
  document.body.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content = theme==='dark' ? '#1a1a2e' : '#e74c3c';
}

$('btn-test-sound').onclick = ()=>{ playSound('complete'); };

/* ============= PROJECTS ============= */
function renderProjects(){
  const list = $('project-list');
  list.innerHTML = '';
  S.projects.forEach((p,i)=>{
    const div = document.createElement('div');
    div.className='project-item';
    const statusIcon = p.status==='complete'?'✅':p.status==='someday'?'💭':'📁';
    div.innerHTML = `<span class="proj-color" style="background:${p.color}"></span><span class="proj-name">${escHtml(p.name)} ${p.outcome?'<span style="font-size:11px;color:var(--text2)">— '+escHtml(p.outcome)+'</span>':''}</span><span style="font-size:11px;color:var(--text2)">${statusIcon}</span><span class="proj-del" data-idx="${i}">✕</span>`;
    div.querySelector('.proj-del').onclick = ()=>{
      if(!confirm('删除项目 "'+p.name+'"？关联的任务将保留但项目字段会清空。')) return;
      S.tasks.forEach(t=>{ if(t.project===p.name) t.project=''; });
      S.projects.splice(i,1);
      saveState();
      renderProjects();
      renderTasks();
    };
    div.onclick = (e)=>{
      if(e.target.closest('.proj-del')) return;
      const newOutcome = prompt('项目成果（期望结果）：', p.outcome||'');
      if(newOutcome!==null) p.outcome = newOutcome;
      const newStatus = prompt('状态：active / complete / someday', p.status);
      if(newStatus && ['active','complete','someday'].includes(newStatus)) p.status = newStatus;
      saveState();
      renderProjects();
      renderTasks();
    };
    list.appendChild(div);
  });

  // fill project selects
  const selects = [$('qi-project'), $('det-project')];
  selects.forEach(sel=>{
    if(!sel) return;
    const current = sel.value;
    sel.innerHTML = '<option value="">无项目</option>';
    S.projects.forEach(p=>{
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = p.name;
      sel.appendChild(opt);
    });
    sel.value = current;
  });
}

$('btn-add-project').onclick = ()=>{
  const name = $('project-new-name').value.trim();
  if(!name){ toast('请输入项目名称'); return; }
  if(S.projects.find(p=>p.name===name)){ toast('项目已存在'); return; }
  const outcome = prompt('期望成果（可选，按回车跳过）：') || '';
  const color = $('project-new-color').value;
  S.projects.push({id:uid(), name, color, outcome, status:'active', nextActionId:null});
  saveState();
  renderProjects();
  $('project-new-name').value='';
  toast('项目已添加');
};

/* ============= SETTINGS RESET ============= */
$('btn-reset-sett').onclick = ()=>{
  if(!confirm('恢复所有设置为默认值？')) return;
  Object.assign(S.settings, defaultSettings);
  saveState();
  loadSettings();
  toast('设置已重置');
};

$('btn-clear-all').onclick = ()=>{
  if(!confirm('确定清除全部数据？此操作不可恢复。')) return;
  if(!confirm('再次确认：所有任务、统计、设置都将被清除。')) return;
  localStorage.removeItem(STORAGE_KEY);
  S = freshState();
  saveState();
  initApp();
  toast('数据已清除');
};

/* ============= ONBOARDING ============= */
const onboardingSteps = [
  { title:'🍅 欢迎使用 Pomotodo', desc:'番茄工作法与 GTD 的结合，帮你更高效地完成任务。' },
  { title:'⏱️ 番茄钟计时', desc:'设置 25 分钟专注时间，完成后休息 5 分钟。每个番茄都是一次深度工作。' },
  { title:'📋 GTD 任务管理', desc:'收件箱 → 下一步 → 项目 → 将来/也许 → 归档。用 #标签 !优先级 @截止日期 快速输入。' },
  { title:'📊 统计与习惯', desc:'追踪每日番茄数、连续天数、66 天习惯目标。图表和热力图让你直观看到进步。' },
  { title:'🔥 打造习惯', desc:'连续完成 66 天的番茄钟，培养深度工作的习惯。开始你的第一天吧！' },
];
let onboardingStep = 0;

function showOnboarding(){
  if(!S.showOnboarding) return;
  $('onboarding').hidden = false;
  renderOnboardingStep();
}

function renderOnboardingStep(){
  const step = onboardingSteps[onboardingStep];
  $('onboarding-body').innerHTML = `<h2>${step.title}</h2><p>${step.desc}</p>`;
  // dots
  const dotsEl = $('onboarding-dots');
  dotsEl.innerHTML = '';
  onboardingSteps.forEach((_,i)=>{
    const dot = document.createElement('span');
    dot.className='onboarding-dot'+(i===onboardingStep?' active':'');
    dotsEl.appendChild(dot);
  });
  const nextBtn = $('onboarding-next');
  if(onboardingStep >= onboardingSteps.length-1){
    nextBtn.textContent = '🚀 开始使用';
  }else{
    nextBtn.textContent = '下一步 →';
  }
}

$('onboarding-next').onclick = ()=>{
  onboardingStep++;
  if(onboardingStep >= onboardingSteps.length){
    finishOnboarding();
  }else{
    renderOnboardingStep();
  }
};

$('onboarding-skip').onclick = finishOnboarding;

function finishOnboarding(){
  S.showOnboarding = false;
  saveState();
  $('onboarding').hidden = true;
  showDailyLaunch();
}

/* ============= NAVIGATION ============= */
function navigateTo(view){
  qsa('.view').forEach(v=>v.classList.remove('active'));
  qsa('.nav-btn').forEach(b=>b.classList.remove('active'));
  const target = $('view-'+view);
  if(target) target.classList.add('active');
  const navBtn = qs(`.nav-btn[data-view="${view}"]`);
  if(navBtn) navBtn.classList.add('active');

  if(view==='stats') renderStats();
  if(view==='calendar') renderCalendar();
  if(view==='work'){
    applyFocusMode(S.timer.phase==='running');
    updateDailyGoal();
  }
}

qsa('.nav-btn').forEach(b=>{
  b.onclick = ()=>{
    navigateTo(b.dataset.view);
    closeDetail();
  };
});

/* ============= UPDATE ALL VIEWS ============= */
function updateAllViews(){
  renderTasks();
  updateDoneToday();
  updateActiveTaskDisplay();
  updateAreaCounts();
  updateInboxPressure();
}

function updateDoneToday(){
  const list = $('done-list');
  if(!list) return;
  const todayItems = getTodayDone();
  $('done-count').textContent = todayItems.length;
  list.innerHTML = todayItems.slice(0,50).map(t=>
    '<li class="done-item"><span>'+escHtml(t.title)+'</span><span class="done-tag">#'+(t.tags&&t.tags[0]?t.tags[0]:'完成')+'</span></li>'
  ).join('');
}

/* ============= SETTINGS APPLY ============= */
function applySettings(){
  // nothing immediate needed
}

/* ============= KEYBOARD SHORTCUTS ============= */
document.addEventListener('keydown', e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
  const anyModalOpen = !$('sleep-overlay').hidden || !$('morning-check-overlay').hidden || !$('modal-complete').hidden || !$('modal-abandon-confirm').hidden || !$('rest-guide-overlay').hidden || !$('daily-launch-overlay').hidden || !$('daily-review-overlay').hidden || !$('modal-quickstart-continue').hidden || !$('onboarding').hidden || !$('modal-clarify').hidden || !$('weekly-review-overlay').hidden;
  if(anyModalOpen && e.key!=='Escape') return;
  switch(e.key){
    case ' ':
      e.preventDefault();
      if(S.timer.phase==='running') pauseTimer();
      else if(S.timer.phase==='paused') resumeTimer();
      else if(S.timer.phase==='finished'){ handleTimerFinish(); }
      else startTimer();
      break;
    case 'r': case 'R':
      if(S.timer.phase!=='finished') resetTimer();
      break;
    case '1': setTimerMode('work'); break;
    case '2': setTimerMode('shortBreak'); break;
    case '3': setTimerMode('longBreak'); break;
    case 't': case 'T':
      {
        const modes=['work','shortBreak','longBreak'];
        const idx=modes.indexOf(S.timer.mode);
        setTimerMode(modes[(idx+1)%modes.length]);
      }
      break;
    case 's': case 'S':
      if(S.timer.phase==='running'||S.timer.phase==='paused'){
        if(S.settings.interruptConfirm && S.timer.mode==='work'){
          const elapsed=S.timer.total-S.timer.remaining;
          $('abandon-minutes').textContent=Math.round(elapsed/60);
          $('modal-abandon-confirm').hidden=false;
        }else if(S.timer.mode!=='work'){
          stopTimer();
          handleTimerFinish();
        }else{
          resetTimer();
        }
      }
      break;
    case 'n': case 'N':
      if(e.ctrlKey || e.metaKey){
        addFromInput();
      }else{
        $('task-input').focus();
      }
      break;
    case 'Escape':
      $('sleep-overlay').hidden = true;
      S._sleepEnforceActive = false;
      $('morning-check-overlay').hidden = true;
      $('winddown-banner').hidden = true;
      if(focusLockdown){ exitLockdown(); }
      closeDetail();
      $('modal-complete').hidden = true;
      $('modal-abandon-confirm').hidden = true;
      $('modal-task-select').hidden = true;
      $('rest-guide-overlay').hidden = true;
      $('daily-launch-overlay').hidden = true;
      $('daily-review-overlay').hidden = true;
      $('modal-quickstart-continue').hidden = true;
      $('onboarding').hidden = true;
      $('modal-clarify').hidden = true;
      $('weekly-review-overlay').hidden = true;
      clarifyTaskId = null;
      // exit focus mode on ESC
      if(focusModeFull){
        focusModeFull = false;
        const btf = $('btn-focus-toggle');
        if(btf) btf.classList.remove('active');
        const wv = qs('.work-view');
        if(wv) wv.classList.remove('focus-mode-full');
        toast('🔍 已退出专注模式');
      }
      break;
  }
});

/* ============= DATA MIGRATION ============= */
function migrateData(){
  if(S.version===3){
    S.tasks.forEach(t=>{
      if(t.area==='archive') t.area='done';
      if(t.projectId===undefined) t.projectId=null;
      if(t.delegatedTo===undefined) t.delegatedTo=null;
      if(t.expectedDate===undefined) t.expectedDate=null;
      if(t.context===undefined) t.context='';
    });
    S.projects.forEach(p=>{
      if(!p.id) p.id=uid();
      if(p.outcome===undefined) p.outcome='';
      if(p.status===undefined) p.status='active';
      if(p.nextActionId===undefined) p.nextActionId=null;
    });
    S.version=4;
    saveState();
  }
  // MDA: v4 → v5 migration
  if(S.version===4){
    S.score = S.score||0;
    S.distractionCount = S.distractionCount||0;
    S.milestones = S.milestones||[];
    S._awayTimestamp = S._awayTimestamp||null;
    S._yesterdayPomoCount = S._yesterdayPomoCount !== undefined ? S._yesterdayPomoCount : -1;
    S._todayExceededYesterday = S._todayExceededYesterday||false;
    S._prevLevel = S._prevLevel||1;
    S.version=5;
    saveState();
  }
  // v5 → v6 migration
  if(S.version===5){
    // No data structure changes, just version bump
    S.version=6;
    saveState();
  }
  // v6 → v7 migration (gaokao edition)
  if(S.version===6){
    S.settings.sleepEnforce = S.settings.sleepEnforce !== undefined ? S.settings.sleepEnforce : true;
    S.settings.bedtime = S.settings.bedtime || '23:00';
    S.settings.winddownMinutes = S.settings.winddownMinutes || 30;
    S.settings.waketime = S.settings.waketime || '07:00';
    S.settings.dailyGoal = S.settings.dailyGoal || 8;
    S.sleepIdeas = S.sleepIdeas || [];
    S._sleepDismissCount = S._sleepDismissCount || 0;
    S._lastSleepDate = S._lastSleepDate || null;
    S._lastSleepQuality = S._lastSleepQuality || null;
    S._sleepEnforceActive = S._sleepEnforceActive || false;
    S._morningCheckDone = S._morningCheckDone || null;
    S.version = 7;
    saveState();
  }
}

/* ============= V21: DAILY GOAL AUTO-RESTORE ============= */
function restoreDailyGoal(){
  const today = todayStr();
  if(S._goalRestoreDate !== today){
    // Only restore if the goal was reduced by the sleep system (flag _goalReducedBySleep)
    // Do NOT override user's manual goal setting
    if(S._goalReducedBySleep && S.settings.dailyGoal < DEFAULT_DAILY_GOAL){
      S.settings.dailyGoal = DEFAULT_DAILY_GOAL;
      S._goalReducedBySleep = false;
      saveState();
      addMilestone('☀️ 新的一天开始！今日目标已恢复为 ' + DEFAULT_DAILY_GOAL + ' 个番茄');
    }
    S._goalRestoreDate = today;
    saveState();
  }
}

/* ============= INIT ============= */
function initApp(){
  winddownShown = false;
  migrateData();
  // V21: Restore daily goal on new day
  restoreDailyGoal();
  // ensure S has proper timer object
  if(!S.timer) S.timer = freshState().timer;
  if(!S.pomodoroHistory) S.pomodoroHistory = {};
  if(!S.projects) S.projects = [];
  if(!S.dailyFocusTasks) S.dailyFocusTasks = [];
  if(!S.sessions) S.sessions = [];
  if(!S.settings) S.settings = {...defaultSettings};

  // set default fields for tasks and projects
  S.tasks.forEach(t=>{
    if(t.projectId===undefined) t.projectId=null;
    if(t.delegatedTo===undefined) t.delegatedTo=null;
    if(t.expectedDate===undefined) t.expectedDate=null;
    if(t.context===undefined) t.context='';
  });
  S.projects.forEach(p=>{
    if(!p.id) p.id=uid();
    if(p.outcome===undefined) p.outcome='';
    if(p.status===undefined) p.status='active';
    if(p.nextActionId===undefined) p.nextActionId=null;
  });

  // merge settings with defaults
  Object.keys(defaultSettings).forEach(k=>{
    if(S.settings[k]===undefined) S.settings[k]=defaultSettings[k];
  });

  // ensure metadata fields
  if(S._reviewedDates===undefined) S._reviewedDates={};
  if(S._lastVisitDate===undefined) S._lastVisitDate=null;
  if(S._lastWeeklyReviewDate===undefined) S._lastWeeklyReviewDate=null;

  // MDA: ensure gamification fields
  if(S.score===undefined) S.score=0;
  if(S.distractionCount===undefined) S.distractionCount=0;
  if(S.milestones===undefined) S.milestones=[];
  if(S._awayTimestamp===undefined) S._awayTimestamp=null;
  if(S._yesterdayPomoCount===undefined) S._yesterdayPomoCount=-1;
  if(S._todayExceededYesterday===undefined) S._todayExceededYesterday=false;
  if(S._prevLevel===undefined) S._prevLevel=1;
  if(S.sleepIdeas===undefined) S.sleepIdeas=[];
  if(S._sleepDismissCount===undefined) S._sleepDismissCount=0;
  if(S._lastSleepDate===undefined) S._lastSleepDate=null;
  if(S._lastSleepQuality===undefined) S._lastSleepQuality=null;
  if(S._sleepEnforceActive===undefined) S._sleepEnforceActive=false;
  if(S._morningCheckDone===undefined) S._morningCheckDone=null;
  if(S._sleepDismissHistory===undefined) S._sleepDismissHistory=[];
  if(S._sleepLog===undefined) S._sleepLog=[];
  if(S._breathingChallengeActive===undefined) S._breathingChallengeActive=false;
  if(S._sleepLockdownActive===undefined) S._sleepLockdownActive=false;
  if(S._adhdQuickStartShown===undefined) S._adhdQuickStartShown=null;
  if(S._goalRestoreDate===undefined) S._goalRestoreDate=null;
  if(S._goalReducedBySleep===undefined) S._goalReducedBySleep=false;
  if(S._competitionDate===undefined) S._competitionDate=null;
  if(S._winddownDate===undefined) S._winddownDate=null;

  // if timer was running on page unload, reset to idle (can't track wall-clock time)
  if(S.timer.phase==='running') S.timer.phase='idle';

  // ensure timer state
  if(!S.timer.mode) S.timer.mode='work';
  if(!S.timer.phase) S.timer.phase='idle';
  if(!S.timer.remaining) S.timer.remaining=S.settings.work*60;
  if(!S.timer.total) S.timer.total=S.settings.work*60;
  if(!S.timer.currentCycle) S.timer.currentCycle=1;

  // init timer worker
  initTimerWorker();

  // UI
  loadSettings();
  renderProjects();
  updateAllViews();
  updateTimerDisplay();
  updateTimerBtn();
  updateTimerModeClass();
  updateModeBtns();
  updateActiveTaskDisplay();
  updateDailyGoal();
  // Hide micro-pomo if user already has pomos today
  const todayForMicro = S.pomodoroHistory[todayStr()];
  if(todayForMicro && todayForMicro.count > 0){
    $('micro-pomo-bar').style.display = 'none';
  }
  // V7: inbox pressure
  updateInboxPressure();

  // MDA: render score display
  renderScoreDisplay();
  updateMomentumFeed();
  showStreakCrisisWarning();

  // daily review (end of day check) - show if switching days
  checkDailyReview();

  // task resumption
  checkTaskResumption();

  // weekly review
  if(S._lastWeeklyReviewDate){
    const [wy,wm,wd] = S._lastWeeklyReviewDate.split('-').map(Number);
    const wl = new Date(wy,wm-1,wd);
    const diffDays = Math.floor((Date.now()-wl.getTime())/86400000);
    if(diffDays>=7) setTimeout(showWeeklyReview, 1200);
  }

  // onboarding or daily launch
  if(S.showOnboarding){
    showOnboarding();
  }else{
    // check if first visit today
    const today = todayStr();
    if(!S._lastVisitDate || S._lastVisitDate !== today){
      showDailyLaunch();
    }
  }
  S._lastVisitDate = todayStr();
  saveState();

  // V7: bind lockdown setting
  const lockdownEl = $('opt-lockdown');
  if(lockdownEl){
    lockdownEl.checked = !!S.settings.lockdown;
    lockdownEl.onchange = function(){ S.settings.lockdown = this.checked; saveState(); };
  }
  // V20: Init sleep system
  initSleepSystem();
  updateGaokaoCountdown();
  // Auto-trigger smart suggestion on load
  setTimeout(generateSmartSuggestion, 1500);

  // navigation default
  navigateTo('work');
}

function checkDailyReview(){
  const today = todayStr();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  const yStr = dateStr(yesterday);
  const yData = S.pomodoroHistory[yStr];
  if(yData && yData.count > 0 && !S._reviewedDates) S._reviewedDates={};
  if(!S._reviewedDates) S._reviewedDates={};
  if(yData && yData.count > 0 && !S._reviewedDates[yStr]){
    S._reviewedDates[yStr] = true;
    saveState();
    setTimeout(showDailyReview, 500);
  }
}

/* ============= START ============= */
document.addEventListener('DOMContentLoaded', initApp);

// register service worker (v=8 cache bust forces old SW to update)
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js?v=8').then(reg=>{
      // Force activate immediately if a new SW is waiting
      if(reg.waiting){ reg.waiting.postMessage({type:'SKIP_WAITING'}); }
    });
    // Listen for new SW taking control, then reload to get fresh content
    navigator.serviceWorker.addEventListener('controllerchange', ()=>{
      window.location.reload();
    });
    // If no controller yet, we're running without SW — try to claim one
    if(!navigator.serviceWorker.controller){
      navigator.serviceWorker.register('./sw.js?v=8').catch(()=>{});
    }
  });
}

// handle visibility change — persist timer state + anti-distraction + welcome back
let hiddenSince = null;
let titleFlashInterval = null;
const originalTitle = document.title;

function startTitleFlash(){
  if(titleFlashInterval) return;
  let flash = false;
  titleFlashInterval = setInterval(()=>{
    flash = !flash;
    document.title = flash ? '⚠️ 快回来！你还在专注中' : '🍅 Pomotodo';
  }, 800);
}

function stopTitleFlash(){
  if(titleFlashInterval){
    clearInterval(titleFlashInterval);
    titleFlashInterval = null;
  }
  document.title = originalTitle;
}

document.addEventListener('visibilitychange', ()=>{
  if(document.hidden){
    saveState();
    if(S.timer.phase === 'running'){
      hiddenSince = Date.now();
      S._awayTimestamp = hiddenSince;
      saveState();
    }
  }else{
    if(hiddenSince && S.timer.phase === 'running'){
      const elapsed = Math.floor((Date.now() - hiddenSince) / 1000);
      if(elapsed >= 120){
        // MDA: Distraction Tax — deduct 2 points
        addScore(-2);
        S.distractionCount = (S.distractionCount||0) + 1;
        saveState();
        toast('⚠️ 专注中断 -2分（当前 '+Math.max(0,S.score||0)+'分）', 4000);
        const notice = document.createElement('div');
        notice.className = 'distraction-notice';
        notice.textContent = '👋 欢迎回来，继续专注！切走超过2分钟了哦';
        document.body.appendChild(notice);
        setTimeout(()=>{ if(notice.parentNode) notice.remove(); }, 4000);
        toast('⚠️ 你离开了 '+Math.floor(elapsed/60)+' 分钟');
      }else{
        const wb = $('welcome-back');
        wb.hidden = false;
        setTimeout(()=>{ wb.hidden = true; }, 2500);
      }
    }
    hiddenSince = null;
    S._awayTimestamp = null;
    stopTitleFlash();
    updateTimerDisplay();
    updateTimerBtn();
  }
  // title flash when hidden and timer running
  if(document.hidden && S.timer.phase === 'running'){
    startTitleFlash();
  }else{
    stopTitleFlash();
  }
});
// also save on unload
window.addEventListener('pagehide', ()=>{ saveState(); });

})();
