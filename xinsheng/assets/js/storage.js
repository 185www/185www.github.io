;(function() {
  const STORAGE_KEY = 'xinsheng_data'

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        if (data && typeof data === 'object') return data
      }
    } catch (e) {}
    return getDefault()
  }

  function getDefault() {
    return {
      checkins: [],
      familyMessages: [],
      lastCalc: null,
      currentCard: 0
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      showToast('存储空间已满，请导出数据后清除浏览器缓存')
    }
  }

  function addCheckin(entry) {
    const data = load()
    data.checkins.push({
      ...entry,
      date: new Date().toISOString().split('T')[0]
    })
    save(data)
    return data
  }

  function getTodayCheckin() {
    const data = load()
    const today = new Date().toISOString().split('T')[0]
    return data.checkins.find(c => c.date === today)
  }

  function getStreak(behavior) {
    const data = load()
    const entries = data.checkins
      .filter(c => c[behavior])
      .sort((a, b) => b.date.localeCompare(a.date))

    if (entries.length === 0) return 0

    let streak = 0
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    let checkDate = new Date(todayStr)
    for (const entry of entries) {
      const entryDate = new Date(entry.date)
      const diff = Math.round((checkDate - entryDate) / 86400000)
      if (diff === 0) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (diff === 1) {
        break
      } else {
        break
      }
    }
    return streak
  }

  function getTotalSavings() {
    const data = load()
    const calc = data.lastCalc
    if (!calc) return { money: 0, time: 0 }

    const totalCheckins = data.checkins.length
    const smokeDays = data.checkins.filter(c => c.smoke).length
    const alcoholDays = data.checkins.filter(c => c.alcohol).length
    const videoDays = data.checkins.filter(c => c.video).length

    const moneyPerDay = (calc.smokeCount || 0) * 0.5 * 365 / 365 + (calc.alcoholCount || 0) * 10 * 365 / 365
    const timePerDay = calc.videoHours || 0

    const money = (moneyPerDay * smokeDays + moneyPerDay * alcoholDays * 0.5).toFixed(0)
    const time = (timePerDay * videoDays).toFixed(0)

    return { money, time }
  }

  function getIdentityLevel(streak) {
    if (streak >= 100) return 3
    if (streak >= 30) return 2
    if (streak >= 7) return 1
    return 0
  }

  function getIdentityText(streak) {
    const level = getIdentityLevel(streak)
    const texts = [
      '',
      '你已经连续7天选择健康——这说明你是一个在乎自己的人',
      '30天！你现在可以说"我不抽烟"而不只是"我在戒烟"',
      '100天！你是一个对家人负责的人，你掌控自己的健康'
    ]
    return texts[level] || ''
  }

  function addFamilyMessage(text, author) {
    const data = load()
    data.familyMessages.push({
      text,
      author: author || '家人',
      date: new Date().toISOString().split('T')[0]
    })
    save(data)
    return data
  }

  function getFamilyMessages() {
    return load().familyMessages
  }

  function saveCalcResult(result) {
    const data = load()
    data.lastCalc = result
    save(data)
  }

  function getCalcResult() {
    return load().lastCalc
  }

  function getCurrentCard() {
    return load().currentCard || 0
  }

  function setCurrentCard(index) {
    const data = load()
    data.currentCard = index
    save(data)
  }

  function exportData() {
    return JSON.stringify(load(), null, 2)
  }

  function showToast(msg) {
    const existing = document.querySelector('.toast')
    if (existing) existing.remove()
    const div = document.createElement('div')
    div.className = 'toast'
    div.textContent = msg
    document.body.appendChild(div)
    setTimeout(() => div.remove(), 2200)
  }

  window.XinSheng = {
    load,
    save,
    addCheckin,
    getTodayCheckin,
    getStreak,
    getTotalSavings,
    getIdentityLevel,
    getIdentityText,
    addFamilyMessage,
    getFamilyMessages,
    saveCalcResult,
    getCalcResult,
    getCurrentCard,
    setCurrentCard,
    exportData,
    showToast
  }
})()
