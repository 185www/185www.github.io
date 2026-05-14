/**
 * Audio utility — Web Audio API oscillator-based notification sounds
 * @module utils/audio
 */

let _audioCtx = null;

/**
 * Get or create AudioContext (lazy, user-gesture-safe)
 * @returns {AudioContext}
 */
function getCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume();
  }
  return _audioCtx;
}

/**
 * Play a short beep tone
 * @param {number} [frequency=880] - Hz
 * @param {number} [duration=0.15] - seconds
 * @param {string} [type='sine'] - OscillatorType
 * @param {number} [volume=0.5] - 0..1
 */
export function playTone(frequency = 880, duration = 0.15, type = 'sine', volume = 0.5) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (_) {
    // Silently fail — no audio available
  }
}

/**
 * Play "timer complete" chime (three ascending notes)
 * @param {number} [volume=0.5]
 */
export function playComplete(volume = 0.5) {
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', volume), i * 200);
  });
}

/**
 * Play "click" feedback
 * @param {number} [volume=0.3]
 */
export function playClick(volume = 0.3) {
  playTone(1200, 0.05, 'square', volume * 0.3);
}

/**
 * Play "task complete" sound
 * @param {number} [volume=0.5]
 */
export function playTaskComplete(volume = 0.5) {
  playTone(1046.5, 0.15, 'sine', volume); // C6
  setTimeout(() => playTone(1318.5, 0.2, 'sine', volume), 150); // E6
}
