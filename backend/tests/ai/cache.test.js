/**
 * Unit tests for response cache.
 */
const { ResponseCache } = require('../../src/ai/cache');

describe('ResponseCache', () => {
  let cache;

  beforeEach(() => {
    cache = new ResponseCache({ ttlMs: 1000 }); // 1 second TTL for testing
  });

  describe('makeKey', () => {
    it('should produce consistent hash for same inputs', () => {
      const k1 = cache.makeKey('bva', 'login form');
      const k2 = cache.makeKey('bva', 'login form');
      expect(k1).toBe(k2);
    });

    it('should produce different hashes for different inputs', () => {
      const k1 = cache.makeKey('bva', 'login form');
      const k2 = cache.makeKey('ecp', 'login form');
      expect(k1).not.toBe(k2);
    });

    it('should produce different hashes for different content', () => {
      const k1 = cache.makeKey('bva', 'login form');
      const k2 = cache.makeKey('bva', 'registration form');
      expect(k1).not.toBe(k2);
    });
  });

  describe('get / set', () => {
    it('should return null for cache miss', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('should return cached value on hit', () => {
      cache.set('key1', { data: 'test' });
      expect(cache.get('key1')).toEqual({ data: 'test' });
    });

    it('should return null for expired entries', async () => {
      cache.set('key1', { data: 'test' });
      await new Promise(r => setTimeout(r, 1100)); // wait for TTL
      expect(cache.get('key1')).toBeNull();
    });
  });

  describe('has', () => {
    it('should return false for missing key', () => {
      expect(cache.has('nope')).toBe(false);
    });

    it('should return true for existing key', () => {
      cache.set('k', 'v');
      expect(cache.has('k')).toBe(true);
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.clear();
      expect(cache.size).toBe(0);
    });
  });

  describe('prune', () => {
    it('should remove expired entries', async () => {
      cache.set('old', 'value');
      await new Promise(r => setTimeout(r, 1100));
      cache.set('new', 'value');
      cache.prune();
      expect(cache.size).toBe(1);
    });
  });
});
