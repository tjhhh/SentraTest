/**
 * Rate Limiter — Sliding window counter for Gemini API rate limiting.
 * Tracks calls per minute and delays requests when approaching the limit.
 */

class RateLimiter {
  /**
   * @param {object} options
   * @param {number} [options.maxRequestsPerMinute] - Max requests per minute (default: 60)
   * @param {number} [options.backoffBaseMs] - Base backoff delay in ms (default: 1000)
   */
  constructor({ maxRequestsPerMinute = 60, backoffBaseMs = 1000 } = {}) {
    this.maxRPM = maxRequestsPerMinute;
    this.backoffBaseMs = backoffBaseMs;
    this._timestamps = []; // timestamps of recent calls
    this._consecutiveBackoffs = 0;
  }

  /**
   * Wait if necessary to respect the rate limit, then record the call.
   * Call this BEFORE making an API request.
   */
  async acquire() {
    this._pruneOldEntries();

    if (this._timestamps.length >= this.maxRPM) {
      // Calculate how long to wait until the oldest entry expires
      const oldest = this._timestamps[0];
      const waitMs = 60000 - (Date.now() - oldest) + 100; // +100ms buffer
      if (waitMs > 0) {
        console.warn(`[RateLimiter] Approaching limit (${this._timestamps.length}/${this.maxRPM} RPM), delaying ${waitMs}ms`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        this._pruneOldEntries();
      }
    }

    this._timestamps.push(Date.now());
    this._consecutiveBackoffs = 0;
  }

  /**
   * Handle a 429 rate limit response. Returns the backoff delay.
   * Call this when receiving a 429 from the API.
   *
   * @returns {number} Delay in ms to wait before retrying
   */
  onRateLimited() {
    this._consecutiveBackoffs++;
    const delay = this.backoffBaseMs * Math.pow(2, this._consecutiveBackoffs - 1);
    console.warn(`[RateLimiter] Rate limited! Backoff #${this._consecutiveBackoffs}: ${delay}ms`);
    return delay;
  }

  /**
   * Get current usage stats.
   * @returns {{ currentRPM: number, maxRPM: number, utilizationPct: number }}
   */
  getUsage() {
    this._pruneOldEntries();
    const currentRPM = this._timestamps.length;
    return {
      currentRPM,
      maxRPM: this.maxRPM,
      utilizationPct: Math.round((currentRPM / this.maxRPM) * 100),
    };
  }

  /** @private Remove timestamps older than 60 seconds */
  _pruneOldEntries() {
    const cutoff = Date.now() - 60000;
    while (this._timestamps.length > 0 && this._timestamps[0] < cutoff) {
      this._timestamps.shift();
    }
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

module.exports = { RateLimiter, rateLimiter };
