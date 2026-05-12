/**
 * Response Cache — In-memory hash-based cache with TTL.
 * Uses MD5 of (template_type + input) as cache key.
 */
const crypto = require('crypto');

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

class ResponseCache {
  /**
   * @param {object} options
   * @param {number} [options.ttlMs] - Time-to-live in milliseconds (default: 24 hours)
   */
  constructor({ ttlMs = DEFAULT_TTL_MS } = {}) {
    this.ttlMs = ttlMs;
    this._store = new Map();
  }

  /**
   * Generate a cache key from template type and input.
   * @param {string} templateType - e.g. 'bva', 'ecp', 'whitebox', 'bug'
   * @param {string} input - The input text/description
   * @returns {string} MD5 hash key
   */
  makeKey(templateType, input) {
    const raw = `${templateType}::${input}`;
    return crypto.createHash('md5').update(raw).digest('hex');
  }

  /**
   * Get a cached response, or null if miss/expired.
   * Evicts expired entries on access.
   *
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttlMs) {
      this._store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Store a value in the cache.
   *
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   */
  set(key, value) {
    this._store.set(key, { value, timestamp: Date.now() });
  }

  /**
   * Check if a key exists and is not expired.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /** Clear all cached entries. */
  clear() {
    this._store.clear();
  }

  /** Get the number of entries (including possibly expired). */
  get size() {
    return this._store.size;
  }

  /** Evict all expired entries. */
  prune() {
    const now = Date.now();
    for (const [key, entry] of this._store) {
      if (now - entry.timestamp > this.ttlMs) {
        this._store.delete(key);
      }
    }
  }
}

// Singleton instance
const cache = new ResponseCache();

module.exports = { ResponseCache, cache };
