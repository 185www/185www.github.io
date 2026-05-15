/**
 * timer-worker.js — Web Worker for accurate background timing
 * Runs in a separate thread, less affected by browser throttling.
 * Posts tick messages every second with elapsed time calculation.
 */

// State
let startTime = null;
let totalDuration = 0;
let running = false;
let intervalId = null;

function tick() {
  if (!running || !startTime) return;
  var elapsed = Date.now() - startTime;
  var remaining = Math.max(0, totalDuration - elapsed);
  postMessage({ type: 'tick', remaining: Math.ceil(remaining / 1000), elapsed: elapsed });
  if (remaining <= 0) {
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    postMessage({ type: 'complete' });
  }
}

self.onmessage = function(e) {
  var data = e.data;
  if (data.type === 'start') {
    if (running) return;
    startTime = data.startTime || Date.now();
    totalDuration = data.duration * 1000; // duration in seconds -> ms
    running = true;
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(tick, 200); // check more frequently for accuracy
    tick();
  } else if (data.type === 'pause') {
    running = false;
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    var elapsed = Date.now() - startTime;
    postMessage({ type: 'paused', elapsed: elapsed, remaining: Math.max(0, totalDuration - elapsed) });
  } else if (data.type === 'resume') {
    if (running) return;
    // Resume: adjust startTime so that remaining stays consistent
    var alreadyElapsed = data.alreadyElapsed || 0;
    startTime = Date.now() - alreadyElapsed;
    running = true;
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(tick, 200);
    tick();
  } else if (data.type === 'stop') {
    running = false;
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    startTime = null;
    totalDuration = 0;
  }
};
