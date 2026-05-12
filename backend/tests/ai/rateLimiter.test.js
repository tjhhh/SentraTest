/**
 * Unit tests for rate limiter.
 */
const { RateLimiter } = require('../../src/ai/rateLimiter');

describe('RateLimiter', () => {
  let limiter;

  beforeEach(() => {
    limiter = new RateLimiter({ maxRequestsPerMinute: 5, backoffBaseMs: 100 });
  });

  describe('acquire', () => {
    it('should allow requests under the limit', async () => {
      await limiter.acquire();
      await limiter.acquire();
      const usage = limiter.getUsage();
      expect(usage.currentRPM).toBe(2);
    });

    it('should track all requests', async () => {
      for (let i = 0; i < 4; i++) {
        await limiter.acquire();
      }
      expect(limiter.getUsage().currentRPM).toBe(4);
    });

    it('should reset consecutive backoffs on successful acquire', async () => {
      limiter.onRateLimited();
      await limiter.acquire();
      // Internal state — verify via onRateLimited returning base delay
      const delay = limiter.onRateLimited();
      expect(delay).toBe(100); // backoffBaseMs * 2^0
    });
  });

  describe('onRateLimited', () => {
    it('should return increasing delays', () => {
      const d1 = limiter.onRateLimited();
      const d2 = limiter.onRateLimited();
      const d3 = limiter.onRateLimited();
      expect(d1).toBe(100);
      expect(d2).toBe(200);
      expect(d3).toBe(400);
    });
  });

  describe('getUsage', () => {
    it('should return zero when no requests made', () => {
      const usage = limiter.getUsage();
      expect(usage.currentRPM).toBe(0);
      expect(usage.maxRPM).toBe(5);
      expect(usage.utilizationPct).toBe(0);
    });

    it('should calculate utilization percentage', async () => {
      for (let i = 0; i < 3; i++) await limiter.acquire();
      const usage = limiter.getUsage();
      expect(usage.utilizationPct).toBe(60);
    });
  });
});
