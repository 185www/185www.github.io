;(function() {
  const $ = document.getElementById.bind(document)

  function init() {
    setupCalculator()
    setupCheckin()
    setupScienceCards()
    setupFamilyWall()
    setupNavigation()
    loadCheckinState()
  }

  // ─── Navigation ───────────────────────────────────────────
  function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const pageId = this.dataset.page
        showPage(pageId)
      })
    })

    $('btn-to-dashboard').addEventListener('click', function() {
      showPage('page-dashboard')
    })
    $('btn-to-science').addEventListener('click', function() {
      showPage('page-science')
    })
    $('btn-to-calculator').addEventListener('click', function() {
      showPage('page-calculator')
    })
    $('btn-science-back').addEventListener('click', function() {
      showPage('page-calculator')
    })
    $('btn-alt-back').addEventListener('click', function() {
      showPage('page-calculator')
    })
    $('btn-family-back').addEventListener('click', function() {
      showPage('page-calculator')
    })
    $('btn-calc-later').addEventListener('click', function() {
      showPage('page-dashboard')
    })
  }

  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
    $(pageId).classList.add('active')
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'))
    const navBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`)
    if (navBtn) navBtn.classList.add('active')
  }

  // ─── Calculator ──────────────────────────────────────────
  function setupCalculator() {
    $('calc-form').addEventListener('submit', function(e) {
      e.preventDefault()
      calculate()
    })
  }

  function calculate() {
    const gender = document.querySelector('input[name="gender"]:checked').value
    const age = parseInt($('calc-age').value) || 55
    const smoke = parseInt($('calc-smoke').value) || 0
    const alcohol = parseInt($('calc-alcohol').value) || 0
    const video = parseInt($('calc-shortvideo').value) || 0

    // Body age calculation
    let bodyAge = age
    if (smoke > 0) {
      bodyAge += smoke * 0.3
    }
    if (alcohol > 0) {
      bodyAge += alcohol * 0.2
    }
    if (video > 2) {
      bodyAge += (video - 2) * 0.15
    }
    if (age > 60) {
      bodyAge += 2
    }
    bodyAge = Math.round(bodyAge)

    // Cost calculation
    const smokeCost = smoke * 0.5 * 365 * Math.max(1, age - 20)
    const alcoholCost = alcohol * 10 * 365 * Math.max(1, age - 30)
    const totalCost = smokeCost + alcoholCost

    // Time calculation
    const yearlyVideoHours = video * 365
    const daysEquivalent = Math.round(yearlyVideoHours / 24)

    // Risk description
    const risks = []
    if (smoke > 0) {
      risks.push(`肺癌风险增加${smoke * 3}倍，心血管疾病风险增加${smoke * 2}倍`)
    }
    if (alcohol > 0) {
      risks.push('酒精是一级致癌物，与7种癌症相关')
    }
    if (video > 2) {
      risks.push('每天刷短视频超过2小时，注意力和自控力显著下降')
    }
    if (video > 4) {
      risks.push('重度短视频使用与焦虑、压力显著正相关')
    }
    if (risks.length === 0) {
      risks.push('继续保持！你的生活习惯良好')
    }

    // Cost mapping
    let costMapping = ''
    if (totalCost > 100000) {
      costMapping = '≈ 一辆家用汽车'
    } else if (totalCost > 50000) {
      costMapping = '≈ 一次欧洲旅行'
    } else if (totalCost > 10000) {
      costMapping = '≈ 一部高端手机'
    } else if (totalCost > 5000) {
      costMapping = '≈ 一台空调'
    } else {
      costMapping = ''
    }

    // Display results
    let ageDiff = bodyAge - age
    let ageText = `${bodyAge}岁`
    if (ageDiff > 0) {
      ageText += `（比实际大${ageDiff}岁）`
    } else if (ageDiff < 0) {
      ageText += `（比实际小${Math.abs(ageDiff)}岁）`
    } else {
      ageText += '（与实际相符）'
    }
    $('body-age-value').textContent = ageText

    let costText = `约¥${totalCost.toLocaleString()}`
    if (costMapping) {
      costText += `\n${costMapping}`
    }
    $('cost-value').textContent = costText

    let timeText = `${yearlyVideoHours.toLocaleString()}小时`
    if (daysEquivalent >= 1) {
      timeText += `\n≈ ${daysEquivalent}天不眠不休`
    }
    $('time-value').textContent = timeText

    $('risk-value').textContent = risks.join('；')

    // Save
    XinSheng.saveCalcResult({ age, smoke, alcohol, video, bodyAge, totalCost, yearlyVideoHours })
    XinSheng.showToast('计算结果已保存')

    // Show result
    $('calc-form').classList.add('hidden')
    $('calc-result').classList.remove('hidden')

    // AUDIT-C warning for alcohol
    if (alcohol >= 5) {
      showAlcoholWarning()
    }
  }

  function showAlcoholWarning() {
    const existing = document.querySelector('#alcohol-warning')
    if (existing) existing.remove()
    const warning = document.createElement('div')
    warning.id = 'alcohol-warning'
    warning.className = 'warning-box'
    warning.innerHTML = `
      <div class="warning-title">⚠️ 重要安全提醒</div>
      <div class="warning-text">
        你报告的饮酒量较高。如果你每天大量饮酒，突然完全戒断可能有危险。
        戒断症状包括：焦虑、颤抖、癫痫发作等，严重时可能危及生命。
        <strong>建议在医生指导下逐步减量。</strong>
      </div>
    `
    $('calc-result').insertBefore(warning, $('calc-result').querySelector('.btn-primary'))
  }

  // ─── Check-in ────────────────────────────────────────────
  function setupCheckin() {
    $('btn-save-checkin').addEventListener('click', function() {
      const todayEntry = XinSheng.getTodayCheckin()
      if (todayEntry) {
        XinSheng.showToast('今天已经记录过了')
        return
      }

      const smoke = document.querySelector('.checkin-item[data-behavior="smoke"] input').checked
      const alcohol = document.querySelector('.checkin-item[data-behavior="alcohol"] input').checked
      const video = document.querySelector('.checkin-item[data-behavior="video"] input').checked
      const alternative = document.querySelector('.checkin-item[data-behavior="alternative"] input').checked

      if (!smoke && !alcohol && !video && !alternative) {
        XinSheng.showToast('请至少选择一项')
        return
      }

      XinSheng.addCheckin({ smoke, alcohol, video, alternative })
      XinSheng.showToast('记录成功！继续加油 💪')
      loadCheckinState()
    })
  }

  function loadCheckinState() {
    const todayEntry = XinSheng.getTodayCheckin()
    if (todayEntry) {
      document.querySelector('.checkin-item[data-behavior="smoke"] input').checked = todayEntry.smoke
      document.querySelector('.checkin-item[data-behavior="alcohol"] input').checked = todayEntry.alcohol
      document.querySelector('.checkin-item[data-behavior="video"] input').checked = todayEntry.video
      document.querySelector('.checkin-item[data-behavior="alternative"] input').checked = todayEntry.alternative
    }

    // Update streaks
    $('streak-smoke').textContent = XinSheng.getStreak('smoke')
    $('streak-alcohol').textContent = XinSheng.getStreak('alcohol')
    $('streak-video').textContent = XinSheng.getStreak('video')

    // Update savings
    const savings = XinSheng.getTotalSavings()
    $('saving-money').textContent = `¥${savings.money}`
    $('saving-time').textContent = `${savings.time}小时`

    // Update identity
    const maxStreak = Math.max(
      XinSheng.getStreak('smoke'),
      XinSheng.getStreak('alcohol'),
      XinSheng.getStreak('video')
    )
    const identityText = XinSheng.getIdentityText(maxStreak)
    if (identityText) {
      $('identity-section').classList.remove('hidden')
      $('identity-text').textContent = identityText
    } else {
      $('identity-section').classList.add('hidden')
    }
  }

  // ─── Science Cards ───────────────────────────────────────
  function setupScienceCards() {
    const cards = document.querySelectorAll('.science-card')
    let current = XinSheng.getCurrentCard()

    function showCard(index) {
      cards.forEach(c => c.classList.remove('active'))
      cards[index].classList.add('active')
      $('science-counter').textContent = `${index + 1}/${cards.length}`
      XinSheng.setCurrentCard(index)
      current = index
    }

    showCard(current)

    $('btn-science-prev').addEventListener('click', function() {
      const next = current > 0 ? current - 1 : cards.length - 1
      showCard(next)
    })

    $('btn-science-next').addEventListener('click', function() {
      const next = current < cards.length - 1 ? current + 1 : 0
      showCard(next)
    })
  }

  // ─── Family Wall ─────────────────────────────────────────
  function setupFamilyWall() {
    renderFamilyMessages()

    $('btn-family-save').addEventListener('click', function() {
      const text = $('family-input').value.trim()
      const author = $('family-author').value.trim() || '家人'
      if (!text) {
        XinSheng.showToast('请输入寄语内容')
        return
      }
      XinSheng.addFamilyMessage(text, author)
      $('family-input').value = ''
      $('family-author').value = ''
      XinSheng.showToast('寄语已保存 ❤️')
      renderFamilyMessages()
    })
  }

  function renderFamilyMessages() {
    const messages = XinSheng.getFamilyMessages()
    const container = $('family-messages')
    if (messages.length === 0) {
      container.innerHTML = '<p class="placeholder-text">还没有留言。让家人给你写一段话吧。</p>'
      return
    }
    container.innerHTML = messages.map(m => `
      <div class="family-message">
        <div class="msg-text">${escapeHtml(m.text)}</div>
        <div class="msg-author">— ${escapeHtml(m.author)}，${m.date}</div>
      </div>
    `).join('')
  }

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // ─── Init ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init)
})()
