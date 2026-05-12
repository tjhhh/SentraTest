class SseService {
  constructor() {
    this.subscribers = new Map();
  }

  subscribe(key, res) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }

    this.subscribers.get(key).add(res);
  }

  unsubscribe(key, res) {
    const set = this.subscribers.get(key);
    if (!set) {
      return;
    }

    set.delete(res);
    if (set.size === 0) {
      this.subscribers.delete(key);
    }
  }

  publish(key, event, data) {
    const set = this.subscribers.get(key);
    if (!set) {
      return;
    }

    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of set) {
      res.write(payload);
    }
  }
}

const sseService = new SseService();

module.exports = { sseService };
