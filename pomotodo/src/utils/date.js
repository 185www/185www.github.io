/**
 * Date utility helpers
 * @module utils/date
 */

/**
 * Get today's date string as YYYY-MM-DD
 * @returns {string}
 */
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Get the start of the current week (Monday) as YYYY-MM-DD
 * @returns {string}
 */
export function weekStartStr() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

/**
 * Get the start of the current month as YYYY-MM-DD
 * @returns {string}
 */
export function monthStartStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Format seconds into MM:SS
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Format seconds into human-readable string (e.g., "1h 23m")
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return `${Math.round(seconds)}s`;
}

/**
 * Get the day key from a session start timestamp
 * @param {string} isoStr - ISO date string
 * @returns {string} YYYY-MM-DD
 */
export function dayKey(isoStr) {
  return isoStr.slice(0, 10);
}

/**
 * Get the last N days as YYYY-MM-DD strings
 * @param {number} n
 * @returns {string[]}
 */
export function lastNDays(n) {
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(d.toISOString().slice(0, 10));
  }
  return result;
}

/**
 * Get day of week short name
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {string}
 */
export function dayName(dateStr) {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[new Date(dateStr + 'T00:00:00').getDay()];
}
