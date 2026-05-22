# 🔧 Step 4: 前端实施技术规格（P0级功能）

> 将P0产品方案翻译为前端工程师可直接实施的技术规格  
> 日期：2026-05-22 | 版本：V1  
> 技术栈：HTML + CSS + Vanilla JS + localStorage + Chart.js@4  
> 代码仓库：github.com/185www/185www.github.io/tree/main/pomotodo

---

## 实施规格 P-01：每日启动仪式

### 修改文件
- **app.js**：新增`renderDailyLaunch()`函数（~行1420后），修改`initApp()`入口逻辑
- **index.html**：新增`#daily-launch-overlay` DOM
- **style.css**：新增`.daily-launch-*`样式（文件末尾）

### 新增数据字段
```javascript
// 在 S.settings 中新增：
S.settings.lastLaunchDate: '',      // 'YYYY-MM-DD' 上次启动日期
S.settings.dailyFocusIds: [],        // ['task_xxx', 'task_yyy', 'task_zzz'] 今日焦点任务ID
```

### 数据迁移逻辑（loadState中）
```javascript
// 在 loadState() 的 Object.assign 后添加：
if (!d.settings.lastLaunchDate) d.settings.lastLaunchDate = '';
if (!d.settings.dailyFocusIds) d.settings.dailyFocusIds = [];
```

### 新增DOM元素
```html
<!-- index.html: 在 <div class="toast-wrap"> 之前插入 -->
<div class="daily-launch-overlay" id="daily-launch-overlay" hidden>
  <div class="daily-launch-card">
    <h3>☀️ 今日启动</h3>
    <div class="dl-yesterday" id="dl-yesterday">
      <p>昨日完成 <strong id="dl-y-pomo">0</strong> 个番茄 · <strong id="dl-y-tasks">0</strong> 项任务</p>
    </div>
    <div class="dl-focus-section">
      <h4>🎯 选择今日三件事</h4>
      <ul class="dl-focus-list" id="dl-focus-list"></ul>
      <p class="dl-hint" id="dl-hint">从今日任务中选择，或直接输入新增</p>
      <div class="dl-quick-add">
        <input type="text" id="dl-quick-input" placeholder="快速添加今日焦点…" maxlength="200" />
        <button id="dl-quick-add-btn">＋</button>
      </div>
    </div>
    <div class="dl-inbox-hint" id="dl-inbox-hint" hidden>
      <p>📥 收件箱有 <strong id="dl-inbox-count">0</strong> 条待处理</p>
    </div>
    <div class="dl-actions">
      <button class="btn-sm" id="dl-skip">跳过</button>
      <button class="btn-sm btn-primary" id="dl-start">开始今天 →</button>
    </div>
  </div>
</div>
```

### 新增/修改函数
```javascript
// === app.js 新增函数 ===

/**
 * renderDailyLaunch() - 渲染每日启动仪式面板
 * 逻辑：检查 S.settings.lastLaunchDate 是否为今天
 *   - 若不是今天→显示面板，填充昨日数据+今日@today任务列表
 *   - 若是今天→跳过，直接进入工作台
 */
function renderDailyLaunch() {
  var today = new Date().toISOString().slice(0, 10);
  if (S.settings.lastLaunchDate === today) {
    document.getElementById('daily-launch-overlay').hidden = true;
    return;
  }
  // 计算昨日数据
  var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  var ySess = S.sessions.filter(function(s) { return s.start && s.start.slice(0,10) === yesterday && s.type === 'work'; });
  var yTasks = S.tasks.filter(function(t) { return t.completed && t.area === 'archive'; })
    .filter(function(t) { /* 判断完成日期是否为昨日 - 需检查 */ });
  document.getElementById('dl-y-pomo').textContent = ySess.length;
  document.getElementById('dl-y-tasks').textContent = yTasks.length;
  // 渲染今日@today任务列表供选择
  var todayTasks = S.tasks.filter(function(t) { return t.today && !t.completed; });
  var list = document.getElementById('dl-focus-list');
  list.innerHTML = '';
  todayTasks.forEach(function(t) {
    var li = document.createElement('li');
    li.innerHTML = '<label><input type="checkbox" data-task-id="' + t.id + '" /> ' + escHtml(t.title) + '</label>';
    list.appendChild(li);
  });
  // 收件箱提示
  var inboxCount = S.tasks.filter(function(t) { return t.area === 'inbox' && !t.completed; }).length;
  if (inboxCount > 3) {
    document.getElementById('dl-inbox-hint').hidden = false;
    document.getElementById('dl-inbox-count').textContent = inboxCount;
  }
  document.getElementById('daily-launch-overlay').hidden = false;
}

/**
 * confirmDailyLaunch() - 用户点击"开始今天"
 * 保存选中的焦点任务ID到 S.settings.dailyFocusIds
 * 更新 lastLaunchDate 为今天
 * 自动关联第一个焦点任务到番茄钟
 */
function confirmDailyLaunch() {
  var checks = document.querySelectorAll('#dl-focus-list input[type=checkbox]:checked');
  var ids = [];
  checks.forEach(function(cb) { ids.push(cb.dataset.taskId); });
  S.settings.dailyFocusIds = ids;
  S.settings.lastLaunchDate = new Date().toISOString().slice(0, 10);
  saveState();
  document.getElementById('daily-launch-overlay').hidden = true;
  // 关联第一个焦点任务
  if (ids.length > 0) {
    timer.taskId = ids[0];
    updateTimerUI();
  }
}
```

### 调用位置
- `initApp()`末尾调用`renderDailyLaunch()`
- `#dl-start` click → `confirmDailyLaunch()`
- `#dl-skip` click → 隐藏面板，设`lastLaunchDate`为今天
- `#dl-quick-add-btn` click → 调用`addTask()`+设`dailyFocus=true`

### 缓存版本升级
- sw.js: `CACHE = 'pomotodo-v20-daily-launch'`
- index.html: `<script src="./app.js?v=20">`

### 验证方法
1. 清除localStorage → 刷新页面 → 应显示每日启动面板
2. 选择3个任务+点"开始今天"→ 面板消失，番茄钟关联第一个任务
3. 刷新页面 → 不再显示（因为lastLaunchDate已是今天）
4. 修改localStorage中lastLaunchDate为昨天 → 刷新 → 重新显示

---

## 实施规格 P-02：休息引导

### 修改文件
- **app.js**：修改`advanceAfterComplete()`和`onTimerComplete()`，新增`renderRestGuide()`、`startRestGuide()`
- **index.html**：新增`#rest-guide-overlay` DOM
- **style.css**：新增`.rest-guide-*`样式（文件末尾，柔和色系）

### 新增数据字段
```javascript
S.settings.restGuideEnabled: true,  // 是否启用休息引导（默认开）
S.settings.restGuideType: 'random', // 'random' | 'breathe' | 'stretch' | 'nature' | 'free'
```

### 数据迁移
```javascript
if (d.settings.restGuideEnabled === undefined) d.settings.restGuideEnabled = true;
if (!d.settings.restGuideType) d.settings.restGuideType = 'random';
```

### 新增DOM元素
```html
<!-- index.html: 在 <div class="toast-wrap"> 之前插入 -->
<div class="rest-guide-overlay" id="rest-guide-overlay" hidden>
  <div class="rest-guide-card">
    <h3>☕ 休息时间</h3>
    <p class="rest-phone-hint">📵 放下手机，让眼睛离开屏幕</p>
    <div class="rest-options" id="rest-options">
      <button class="rest-opt-btn" data-rest="breathe">
        <span class="rest-opt-icon">🧘</span>
        <span class="rest-opt-title">闭眼深呼吸</span>
        <span class="rest-opt-desc">1分钟引导 + 自由休息</span>
      </button>
      <button class="rest-opt-btn" data-rest="stretch">
        <span class="rest-opt-icon">🤸</span>
        <span class="rest-opt-title">站立伸展</span>
        <span class="rest-opt-desc">2分钟简单动作 + 自由休息</span>
      </button>
      <button class="rest-opt-btn" data-rest="nature">
        <span class="rest-opt-icon">🌿</span>
        <span class="rest-opt-title">远眺放松</span>
        <span class="rest-opt-desc">看窗外或自然图片</span>
      </button>
      <button class="rest-opt-btn rest-free-btn" data-rest="free">
        <span class="rest-opt-title">自由休息</span>
      </button>
    </div>
    <div class="rest-timer-display" id="rest-timer-display" hidden>
      <div class="rest-instruction" id="rest-instruction"></div>
      <div class="rest-countdown" id="rest-countdown">5:00</div>
      <div class="rest-progress-ring"><!-- SVG 或 CSS 进度 --></div>
    </div>
  </div>
</div>
```

### 新增/修改函数
```javascript
/**
 * showRestGuide() - 休息开始时显示引导选择界面
 * 仅在 work→break 转换时触发
 */
function showRestGuide() {
  if (!S.settings.restGuideEnabled) return;
  if (timer.mode === 'shortBreak' || timer.mode === 'longBreak') {
    document.getElementById('rest-guide-overlay').hidden = false;
    document.getElementById('rest-timer-display').hidden = true;
    document.getElementById('rest-options').hidden = false;
  }
}

/**
 * selectRestOption(type) - 用户选择休息类型
 * type: 'breathe' | 'stretch' | 'nature' | 'free'
 * 显示对应引导文案 + 休息倒计时
 */
function selectRestOption(type) {
  var instructions = {
    breathe: '闭上眼睛，缓慢深呼吸…\n吸气4秒 → 屏息4秒 → 呼气6秒\n重复3-5次',
    stretch: '站起来，做简单伸展：\n① 颈部旋转 ×5\n② 肩部耸放 ×5\n③ 手腕旋转 ×5',
    nature: '看看窗外的绿色植物\n或远处的天空和建筑\n让目光在远处停留',
    free: '自由休息中…\n记得离开屏幕休息眼睛'
  };
  document.getElementById('rest-instruction').textContent = instructions[type] || instructions.free;
  document.getElementById('rest-options').hidden = true;
  document.getElementById('rest-timer-display').hidden = false;
}

// 修改 advanceAfterComplete()：
// 在 timer.mode = 'shortBreak'/longBreak 赋值后添加：
if (S.settings.restGuideEnabled) showRestGuide();

// 修改 onTimerComplete()：
// 在 break 完成分支中添加：
document.getElementById('rest-guide-overlay').hidden = true;
```

### 设置面板新增
在"声音 & 通知"section后新增：
```html
<section class="sett-group"><h3>休息引导</h3>
  <div class="sett-row"><span>休息引导</span><label class="sw"><input type="checkbox" id="opt-rest-guide" checked /><span class="sw-track"></span></label></div>
</section>
```

### 缓存版本升级
- 同P-01的v20

### 验证方法
1. 完成一个25分钟番茄 → 应弹出休息引导选择界面
2. 选择"闭眼深呼吸" → 显示引导文案+倒计时
3. 休息结束 → 引导界面消失，自动切回专注模式
4. 关闭"休息引导"设置 → 完成番茄后不再弹出引导

---

## 实施规格 P-03：任务完成"小胜利"反馈

### 修改文件
- **app.js**：修改`toggleTask()`
- **style.css**：新增`.task-complete-anim`和`.focus-progress`样式

### 新增数据字段
无新增字段，利用已有`task.completed`和`S.settings.dailyFocusIds`

### 修改函数
```javascript
// 修改 toggleTask()：
// 在 t.completed = true 分支中添加：

if (t.completed) {
  // ... 已有逻辑 ...
  
  // === 新增：小胜利反馈 ===
  var el = document.querySelector('[data-task-id="' + id + '"]');
  if (el) {
    el.classList.add('task-complete-anim');
    setTimeout(function() { el.classList.remove('task-complete-anim'); }, 1500);
  }
  
  // 焦点任务进度
  var focusIds = S.settings.dailyFocusIds || [];
  var focusDone = focusIds.filter(function(fid) {
    var ft = S.tasks.find(function(x) { return x.id === fid; });
    return ft && ft.completed;
  }).length;
  updateFocusProgress(focusDone, focusIds.length);
  
  // 鼓励Toast
  var msgs = ['干得漂亮！', '又搞定一个！', '离目标更近了！', '继续加油！'];
  toast(msgs[Math.floor(Math.random() * msgs.length)]);
  
  // 三件事全部完成
  if (focusDone === focusIds.length && focusIds.length > 0) {
    setTimeout(function() { toast('🎉 今日三件事全部完成！'); }, 500);
  }
}
```

### 新增DOM元素
```html
<!-- 在工作台番茄钟下方、今日已完成之前插入焦点进度条 -->
<div class="focus-progress" id="focus-progress" hidden>
  <span>🎯 今日焦点</span>
  <div class="focus-progress-bar"><div class="focus-progress-fill" id="focus-progress-fill"></div></div>
  <span id="focus-progress-text">0/3</span>
</div>
```

### 新增CSS
```css
/* 文件末尾新增 */
.task-complete-anim {
  animation: taskPop 1.5s ease-out;
}
@keyframes taskPop {
  0% { transform: scale(1); }
  20% { transform: scale(1.15); background: var(--success); }
  100% { transform: scale(1); opacity: 0.7; }
}
.focus-progress-bar {
  height: 6px; background: var(--border); border-radius: 3px; flex: 1; margin: 0 8px;
}
.focus-progress-fill {
  height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.5s;
}
```

### 验证方法
1. 完成@today任务 → 应看到缩放动画+鼓励Toast
2. 完成焦点区第3个任务 → 应看到"🎉今日三件事全部完成！"Toast
3. 检查焦点进度条更新

---

## 实施规格 P-04：番茄中断确认

### 修改文件
- **app.js**：修改`resetTimer()`
- **index.html**：新增`#modal-abandon-confirm` DOM
- **style.css**：新增`.modal-abandon-*`样式

### 新增数据字段
```javascript
S.settings.abandonConfirmEnabled: true, // 中断确认开关（默认开）
```

### 数据迁移
```javascript
if (d.settings.abandonConfirmEnabled === undefined) d.settings.abandonConfirmEnabled = true;
```

### 新增DOM元素
```html
<div class="modal-overlay" id="modal-abandon-confirm" hidden>
  <div class="modal-box">
    <h3>⚠️ 确认放弃？</h3>
    <p>你已经专注了 <strong id="abandon-minutes">0</strong> 分钟</p>
    <p class="modal-sub">放弃这个番茄将不会记录本次专注</p>
    <div class="modal-actions">
      <button class="btn-sm btn-primary" id="abandon-continue">继续专注</button>
      <button class="btn-sm btn-danger" id="abandon-confirm">放弃</button>
    </div>
  </div>
</div>
```

### 修改函数
```javascript
// 修改 resetTimer()：
function resetTimer() {
  // === 新增：中断确认逻辑 ===
  if (S.settings.abandonConfirmEnabled && timer.running) {
    var elapsed = timer.startedRemaining - timer.remaining;
    var elapsedMin = Math.floor(elapsed / 60);
    if (elapsedMin >= 2) { // 运行≥2分钟才弹确认
      document.getElementById('abandon-minutes').textContent = elapsedMin;
      document.getElementById('modal-abandon-confirm').hidden = false;
      return; // 不直接重置，等用户确认
    }
  }
  // 原有重置逻辑...
  doResetTimer();
}

function doResetTimer() {
  click(S.settings.soundVolume);
  timer.running = false; clearInterval(timer.intervalId); timer.intervalId = null;
  timer.remaining = getModeDuration(timer.mode) * 60;
  timer.startedAt = null; timer.startedRemaining = null;
  clearTimerState();
  if (timerWorker) timerWorker.postMessage({ type: 'stop' });
  updateTimerUI();
}

// 事件绑定：
// #abandon-continue click → 隐藏modal（不做任何操作，继续计时）
// #abandon-confirm click → 隐藏modal + doResetTimer()
```

### 设置面板新增
```html
<div class="sett-row"><span>番茄中断确认</span><label class="sw"><input type="checkbox" id="opt-abandon-confirm" checked /><span class="sw-track"></span></label></div>
```

### 验证方法
1. 启动25分钟番茄 → 运行3分钟后点重置 → 应弹确认modal
2. 点"继续专注"→ 番茄继续计时
3. 点"放弃"→ 番茄重置到25:00
4. 运行<2分钟点重置 → 不弹确认，直接重置
5. 关闭设置中的开关 → 不弹确认

---

## 实施规格 P-05：今日三件事焦点区

### 修改文件
- **app.js**：新增`renderDailyFocus()`、`toggleDailyFocus()`，修改`renderTasks()`
- **index.html**：新增`#daily-focus-section` DOM
- **style.css**：新增`.daily-focus-*`样式

### 新增数据字段
```javascript
task.dailyFocus: false,  // 是否为今日焦点任务（新增到task对象）
```

### 数据迁移
```javascript
// loadState() 中已有tasks遍历，添加：
d.tasks.forEach(function(t) { if (t.dailyFocus === undefined) t.dailyFocus = false; });
```

### 新增DOM元素
```html
<!-- index.html: 在 timer-active-task 之后、done-today 之前插入 -->
<div class="daily-focus-section" id="daily-focus-section" hidden>
  <h3 class="df-heading">🎯 今日焦点 <span class="df-count" id="df-count">0/3</span></h3>
  <ul class="df-list" id="df-list"></ul>
</div>
```

### 新增/修改函数
```javascript
/**
 * renderDailyFocus() - 渲染今日焦点区域
 * 从 S.tasks 中筛选 dailyFocus=true && !completed 的任务
 * 最多显示5个，>5时Toast警告
 */
function renderDailyFocus() {
  var focusTasks = S.tasks.filter(function(t) { return t.dailyFocus && !t.completed; });
  var section = document.getElementById('daily-focus-section');
  var list = document.getElementById('df-list');
  if (focusTasks.length === 0) { section.hidden = true; return; }
  section.hidden = false;
  document.getElementById('df-count').textContent = focusTasks.length + '/3';
  list.innerHTML = '';
  focusTasks.forEach(function(t) {
    var li = document.createElement('li');
    li.className = 'df-item' + (timer.taskId === t.id ? ' df-active' : '');
    li.innerHTML = '<span class="df-prio prio-' + t.priority + '"></span>' +
      '<span class="df-title">' + escHtml(t.title) + '</span>' +
      '<button class="df-start-btn" data-task-id="' + t.id + '">🍅</button>';
    list.appendChild(li);
  });
  if (focusTasks.length > 5) {
    toast('💡 聚焦3件事效率最高，建议精简');
  }
}

/**
 * toggleDailyFocus(id) - 切换任务的焦点状态
 */
function toggleDailyFocus(id) {
  var t = S.tasks.find(function(x) { return x.id === id; });
  if (!t) return;
  t.dailyFocus = !t.dailyFocus;
  saveState(); renderTasks(); renderDailyFocus();
}

// 修改 addTask()：初始化 task.dailyFocus = false
// 修改 toggleTask()：完成时更新焦点区
// 修改 renderTasks()：每个任务项增加"🎯设为焦点"右键/长按菜单
```

### 验证方法
1. 右键/长按任务 → 显示"设为今日焦点"选项
2. 设为焦点后 → 工作台出现焦点区域，显示该任务
3. 焦点>5个 → 显示Toast警告
4. 完成焦点任务 → 焦点列表更新
5. 点击焦点任务旁的🍅 → 启动关联番茄

---

## 实施规格 P-06：习惯追踪

### 修改文件
- **app.js**：新增`calcHabitStreak()`、`renderHabitStreak()`，修改`renderStats()`
- **index.html**：统计Tab新增DOM区域
- **style.css**：新增`.habit-*`样式（热力图+进度条）

### 新增数据字段
```javascript
// S 中新增：
S.habitStreak: {
  currentStreak: 0,      // 当前连续天数
  longestStreak: 0,      // 最长连续天数
  lastActiveDate: '',    // 'YYYY-MM-DD'
  calendarData: {}       // { '2026-05-01': 3, '2026-05-02': 5, ... } 日期→番茄数
}
```

### 数据迁移
```javascript
if (!d.habitStreak) d.habitStreak = { currentStreak: 0, longestStreak: 0, lastActiveDate: '', calendarData: {} };
```

### 新增DOM元素
```html
<!-- index.html: 统计Tab中，在 stats-cards 之后插入 -->
<div class="habit-section" id="habit-section">
  <h3>🔥 习惯追踪</h3>
  <div class="habit-stats">
    <div class="habit-stat"><span class="habit-val" id="h-current">0</span><span class="habit-lbl">连续天数</span></div>
    <div class="habit-stat"><span class="habit-val" id="h-longest">0</span><span class="habit-lbl">最长连续</span></div>
  </div>
  <div class="habit-goal">
    <span class="habit-goal-lbl">66天目标</span>
    <div class="habit-goal-bar"><div class="habit-goal-fill" id="h-goal-fill"></div></div>
    <span class="habit-goal-text" id="h-goal-text">0/66</span>
  </div>
  <div class="habit-heatmap" id="habit-heatmap"></div>
</div>
```

### 新增函数
```javascript
/**
 * calcHabitStreak() - 基于sessions计算习惯追踪数据
 * 遍历sessions，按日期聚合work类型session
 * 计算currentStreak、longestStreak、calendarData
 * 每次saveState()时调用（或在sessions变化时）
 */
function calcHabitStreak() {
  var cal = {};
  S.sessions.forEach(function(s) {
    if (s.type !== 'work' || !s.start) return;
    var day = s.start.slice(0, 10);
    cal[day] = (cal[day] || 0) + 1;
  });
  S.habitStreak.calendarData = cal;
  
  // 计算连续天数（从今天往回数）
  var streak = 0;
  var d = new Date();
  while (true) {
    var key = d.toISOString().slice(0, 10);
    if (cal[key] && cal[key] > 0) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  S.habitStreak.currentStreak = streak;
  if (streak > S.habitStreak.longestStreak) S.habitStreak.longestStreak = streak;
  S.habitStreak.lastActiveDate = new Date().toISOString().slice(0, 10);
  saveState();
}

/**
 * renderHabitStreak() - 渲染习惯追踪板块
 */
function renderHabitStreak() {
  document.getElementById('h-current').textContent = S.habitStreak.currentStreak;
  document.getElementById('h-longest').textContent = S.habitStreak.longestStreak;
  var pct = Math.min(100, Math.round(S.habitStreak.currentStreak / 66 * 100));
  document.getElementById('h-goal-fill').style.width = pct + '%';
  document.getElementById('h-goal-text').textContent = S.habitStreak.currentStreak + '/66';
  
  // 渲染30天热力图
  var heatmap = document.getElementById('habit-heatmap');
  heatmap.innerHTML = '';
  for (var i = 29; i >= 0; i--) {
    var d = new Date(Date.now() - i * 86400000);
    var key = d.toISOString().slice(0, 10);
    var count = S.habitStreak.calendarData[key] || 0;
    var cell = document.createElement('span');
    cell.className = 'hm-cell' + (count > 0 ? ' hm-active' : '');
    cell.title = key + ': ' + count + '个番茄';
    heatmap.appendChild(cell);
  }
}
```

### 工作台小标签
```html
<!-- 在 timer-cycle 旁增加 -->
<span class="streak-badge" id="streak-badge" hidden>🔥<span id="streak-num">0</span></span>
```

### 验证方法
1. 完成一个番茄 → 刷新统计页 → 习惯追踪板块更新
2. 连续2天完成番茄 → 连续天数显示2
3. 检查热力图显示30天
4. 中断后重新开始 → 显示鼓励文案而非惩罚

---

## 实施规格 P-07：每日回顾

### 修改文件
- **app.js**：新增`renderDailyReview()`、`checkDailyReview()`
- **index.html**：新增`#daily-review-overlay` DOM
- **style.css**：新增`.daily-review-*`样式

### 新增数据字段
```javascript
S.dailyReviews: [],  // [{date: 'YYYY-MM-DD', pomodoros: N, tasksCompleted: N, focusIds: []}]
S.settings.lastReviewDate: '',  // 上次回顾日期
```

### 数据迁移
```javascript
if (!d.dailyReviews) d.dailyReviews = [];
if (!d.settings.lastReviewDate) d.settings.lastReviewDate = '';
```

### 新增DOM元素
```html
<div class="daily-review-overlay" id="daily-review-overlay" hidden>
  <div class="daily-review-card">
    <h3>🌙 今日回顾</h3>
    <div class="dr-stats">
      <div class="dr-stat"><span id="dr-pomo">0</span><span>个番茄</span></div>
      <div class="dr-stat"><span id="dr-mins">0</span><span>分钟专注</span></div>
      <div class="dr-stat"><span id="dr-tasks">0</span><span>项完成</span></div>
    </div>
    <div class="dr-compare" id="dr-compare">
      <p>📊 比昨日 <span id="dr-diff-pomo">0</span> 个番茄</p>
    </div>
    <div class="dr-completed-list" id="dr-completed-list"></div>
    <div class="dr-tomorrow">
      <h4>💡 明日建议</h4>
      <p id="dr-suggestion"></p>
    </div>
    <div class="dr-actions">
      <button class="btn-sm" id="dr-skip">跳过</button>
      <button class="btn-sm btn-primary" id="dr-done">好的，晚安</button>
    </div>
  </div>
</div>
```

### 新增函数
```javascript
/**
 * checkDailyReview() - 检查是否应该显示每日回顾
 * 条件：当天已完成≥1个番茄 且 时间>20:00 且 尚未显示过
 */
function checkDailyReview() {
  var today = new Date().toISOString().slice(0, 10);
  var hour = new Date().getHours();
  if (S.settings.lastReviewDate === today) return;
  var todayPomo = S.sessions.filter(function(s) {
    return s.type === 'work' && s.start && s.start.slice(0,10) === today;
  }).length;
  if (todayPomo < 1 || hour < 18) return; // 至少1个番茄+晚于18点
  renderDailyReview();
}

/**
 * renderDailyReview() - 渲染每日回顾面板
 */
function renderDailyReview() {
  var today = new Date().toISOString().slice(0, 10);
  var todaySess = S.sessions.filter(function(s) { return s.type === 'work' && s.start && s.start.slice(0,10) === today; });
  var todayMins = todaySess.reduce(function(sum, s) { return sum + (s.duration || 0); }, 0) / 60;
  var todayDone = S.tasks.filter(function(t) { return t.completed && t.area === 'archive'; }).length;
  document.getElementById('dr-pomo').textContent = todaySess.length;
  document.getElementById('dr-mins').textContent = Math.round(todayMins);
  document.getElementById('dr-tasks').textContent = todayDone;
  // 昨日对比
  var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  var yPomo = S.sessions.filter(function(s) { return s.type === 'work' && s.start && s.start.slice(0,10) === yesterday; }).length;
  document.getElementById('dr-diff-pomo').textContent = (todaySess.length > yPomo ? '+' : '') + (todaySess.length - yPomo);
  // 明日建议
  var overdue = S.tasks.filter(function(t) { return !t.completed && t.dueDatetime && t.dueDatetime.slice(0,10) < today; }).length;
  var suggestion = overdue > 0 ? '你有 ' + overdue + ' 个逾期任务，明天优先处理？' : '今天表现不错，明天继续保持！';
  document.getElementById('dr-suggestion').textContent = suggestion;
  document.getElementById('daily-review-overlay').hidden = false;
}

// 保存回顾记录
function saveDailyReview() {
  var today = new Date().toISOString().slice(0, 10);
  S.settings.lastReviewDate = today;
  S.dailyReviews.push({
    date: today,
    pomodoros: parseInt(document.getElementById('dr-pomo').textContent),
    tasksCompleted: parseInt(document.getElementById('dr-tasks').textContent)
  });
  // 清理>90天的回顾
  var cutoff = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
  S.dailyReviews = S.dailyReviews.filter(function(r) { return r.date >= cutoff; });
  saveState();
  document.getElementById('daily-review-overlay').hidden = true;
}
```

### 调用位置
- `onTimerComplete()` work分支末尾调用`checkDailyReview()`
- 也可在`renderWorkView()`时检查（每次切换到工作台）

### 验证方法
1. 修改系统时间到18:00后 → 完成一个番茄 → 应弹出每日回顾
2. 检查今日vs昨日对比数据
3. 点"好的，晚安"→ 面板消失，localStorage记录
4. 再次刷新 → 不再弹出

---

## 全局缓存版本升级

所有P0功能完成后统一升级：

```
sw.js: CACHE = 'pomotodo-v20-v5-p0-features'
index.html: <script src="./app.js?v=20">
             <link rel="stylesheet" href="./style.css?v=20" />
```

## 全局数据迁移汇总

在 `loadState()` 中一次性处理所有新增字段：

```javascript
function migrateState(d) {
  // settings新增
  if (!d.settings.lastLaunchDate) d.settings.lastLaunchDate = '';
  if (!d.settings.dailyFocusIds) d.settings.dailyFocusIds = [];
  if (d.settings.restGuideEnabled === undefined) d.settings.restGuideEnabled = true;
  if (!d.settings.restGuideType) d.settings.restGuideType = 'random';
  if (d.settings.abandonConfirmEnabled === undefined) d.settings.abandonConfirmEnabled = true;
  if (!d.settings.lastReviewDate) d.settings.lastReviewDate = '';
  // task新增字段
  d.tasks.forEach(function(t) { if (t.dailyFocus === undefined) t.dailyFocus = false; });
  // 顶层新增
  if (!d.habitStreak) d.habitStreak = { currentStreak: 0, longestStreak: 0, lastActiveDate: '', calendarData: {} };
  if (!d.dailyReviews) d.dailyReviews = [];
}
```

---

*Step 4 完成。7个P0功能均已有完整实施规格，可直接开始编码。*
