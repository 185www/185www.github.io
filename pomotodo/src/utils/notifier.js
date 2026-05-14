/**
 * Browser notification utility with graceful permission handling
 * @module utils/notifier
 */

let _permission = 'default';

/**
 * Request notification permission if not already granted
 * @returns {Promise<string>} — 'granted' | 'denied' | 'default'
 */
export async function requestPermission() {
  if (!('Notification' in window)) {
    _permission = 'denied';
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    _permission = 'granted';
    return 'granted';
  }
  if (Notification.permission === 'denied') {
    _permission = 'denied';
    return 'denied';
  }
  try {
    const result = await Notification.requestPermission();
    _permission = result;
    return result;
  } catch (_) {
    _permission = 'denied';
    return 'denied';
  }
}

/**
 * Show a browser notification
 * @param {string} title
 * @param {string} [body='']
 * @param {string} [icon='']
 */
export function notify(title, body = '', icon = '') {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, {
      body,
      icon: icon || undefined,
      silent: false,
    });
    n.onclick = () => { window.focus(); n.close(); };
  } catch (_) {
    // Graceful degradation
  }
}

/**
 * Check if notifications are supported and permitted
 * @returns {boolean}
 */
export function isNotificationAvailable() {
  return 'Notification' in window && Notification.permission === 'granted';
}
