const Scheduler = {
  getDefaultInterval(exerciseType, attempts) {
    if (attempts === 0) return 0;
    if (attempts <= 1) return 1;
    if (attempts <= 3) return 3;
    if (attempts <= 5) return 7;
    if (attempts <= 8) return 14;
    return 30;
  },

  calculateNextReview(record) {
    const now = new Date();
    const attempts = (record.successCount || 0) + (record.failCount || 0);

    if (record.lastResult === 'fail') {
      record.nextReview = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      record.interval = 0;
      return record;
    }

    const intervalDays = this.getDefaultInterval(record.exerciseType, attempts);
    const next = new Date(now);
    next.setDate(next.getDate() + intervalDays);
    record.nextReview = next.toISOString();
    record.interval = intervalDays;
    return record;
  },

  getDueExercises(records) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Object.entries(records)
      .filter(([, r]) => {
        if (!r.nextReview) return true;
        return new Date(r.nextReview) <= today;
      })
      .sort(([, a], [, b]) => {
        const aDate = a.nextReview ? new Date(a.nextReview) : new Date(0);
        const bDate = b.nextReview ? new Date(b.nextReview) : new Date(0);
        return aDate - bDate;
      })
      .map(([id]) => id);
  },

  getStats(records) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const entries = Object.entries(records);
    return {
      total: entries.length,
      mastered: entries.filter(([, r]) => r.interval >= 14).length,
      due: entries.filter(([, r]) => {
        if (!r.nextReview) return true;
        return new Date(r.nextReview) <= today;
      }).length,
      totalPasses: entries.reduce((s, [, r]) => s + (r.successCount || 0), 0),
      totalFails: entries.reduce((s, [, r]) => s + (r.failCount || 0), 0)
    };
  }
};
