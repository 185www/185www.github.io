/**
 * Storage utility — localStorage primary, IndexedDB fallback
 * @module utils/storage
 */

const DB_NAME = 'pomotodo_db';
const DB_VERSION = 1;
const STORE_NAME = 'keyvalue';

/** @type {IDBDatabase|null} */
let _db = null;

/**
 * Open (or create) the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
  return new Promise((resolve, reject) => {
    if (_db) return resolve(_db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Get a value by key — tries localStorage first, then IndexedDB
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function get(key) {
  // Try localStorage first
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw);
  } catch (_) { /* fall through */ }

  // Try IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch (_) {
    return null;
  }
}

/**
 * Set a value by key — writes to both localStorage and IndexedDB
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
export async function set(key, value) {
  const serialized = JSON.stringify(value);
  // localStorage
  try { localStorage.setItem(key, serialized); } catch (_) {}
  // IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (_) {}
}

/**
 * Remove a key from both stores
 * @param {string} key
 * @returns {Promise<void>}
 */
export async function remove(key) {
  try { localStorage.removeItem(key); } catch (_) {}
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (_) {}
}

/**
 * Get all data as a plain object (for export)
 * @returns {Promise<Object>}
 */
export async function getAll() {
  const data = {};
  // from localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      try { data[k] = JSON.parse(localStorage.getItem(k)); } catch (_) {}
    }
  } catch (_) {}
  return data;
}

/**
 * Clear all pomotodo data
 * @returns {Promise<void>}
 */
export async function clearAll() {
  // Clear localStorage keys we own
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    keys.forEach(k => {
      if (k.startsWith('pomotodo_') || k === 'pomotodo_data') localStorage.removeItem(k);
    });
  } catch (_) {}
  // Clear IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (_) {}
}

/**
 * Import data from a plain object (for JSON import)
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function importData(data) {
  for (const [key, value] of Object.entries(data)) {
    await set(key, value);
  }
}
