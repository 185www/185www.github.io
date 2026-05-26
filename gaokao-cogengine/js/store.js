const Store = {
  KEYS: {
    RECORDS: 'v4_exercise_records',
    SETTINGS: 'v4_settings'
  },

  getRecords() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.RECORDS) || '{}');
    } catch (e) {
      return {};
    }
  },

  saveRecords(records) {
    localStorage.setItem(this.KEYS.RECORDS, JSON.stringify(records));
  },

  updateRecord(exerciseId, result) {
    const records = this.getRecords();
    if (!records[exerciseId]) {
      records[exerciseId] = {
        exerciseId,
        successCount: 0,
        failCount: 0,
        lastResult: null,
        nextReview: null,
        interval: 0,
        lastReviewDate: null,
        exerciseType: result.type || '',
        history: []
      };
    }
    const record = records[exerciseId];
    if (result.passed) {
      record.successCount = (record.successCount || 0) + 1;
    } else {
      record.failCount = (record.failCount || 0) + 1;
    }
    record.lastResult = result.passed ? 'pass' : 'fail';
    record.lastReviewDate = new Date().toISOString();
    record.history.push({
      date: record.lastReviewDate,
      passed: result.passed,
      failedStep: result.failedStep || null
    });
    if (record.history.length > 100) {
      record.history = record.history.slice(-100);
    }
    Scheduler.calculateNextReview(record);
    this.saveRecords(records);
    return record;
  },

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS) || '{}');
    } catch (e) {
      return {};
    }
  },

  saveSettings(settings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
  },

  clearAll() {
    localStorage.removeItem(this.KEYS.RECORDS);
    localStorage.removeItem(this.KEYS.SETTINGS);
  }
};
