/**
 * Unit tests for request queue.
 */
const { RequestQueue } = require('../../src/ai/requestQueue');

describe('RequestQueue', () => {
  let rq;

  beforeEach(() => {
    rq = new RequestQueue();
  });

  it('should process a single task', async () => {
    const { result } = await rq.enqueue(() => Promise.resolve('done'));
    expect(result).toBe('done');
  });

  it('should process tasks in FIFO order', async () => {
    const order = [];
    const p1 = rq.enqueue(async () => {
      await new Promise(r => setTimeout(r, 50));
      order.push(1);
      return 1;
    });
    const p2 = rq.enqueue(async () => {
      order.push(2);
      return 2;
    });
    const p3 = rq.enqueue(async () => {
      order.push(3);
      return 3;
    });

    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
    expect(order).toEqual([1, 2, 3]);
    expect(r1.result).toBe(1);
    expect(r2.result).toBe(2);
    expect(r3.result).toBe(3);
  });

  it('should process sequentially (not in parallel)', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    const task = async () => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise(r => setTimeout(r, 30));
      concurrent--;
      return 'ok';
    };

    await Promise.all([
      rq.enqueue(task),
      rq.enqueue(task),
      rq.enqueue(task),
    ]);

    expect(maxConcurrent).toBe(1);
  });

  it('should reject on task error', async () => {
    await expect(
      rq.enqueue(() => Promise.reject(new Error('fail')))
    ).rejects.toThrow('fail');
  });

  it('should continue processing after an error', async () => {
    const p1 = rq.enqueue(() => Promise.reject(new Error('fail'))).catch(() => 'caught');
    const p2 = rq.enqueue(() => Promise.resolve('ok'));

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe('caught');
    expect(r2.result).toBe('ok');
  });

  it('should report queue position', async () => {
    // Enqueue a slow task, then two fast ones
    const p1 = rq.enqueue(async () => {
      await new Promise(r => setTimeout(r, 50));
      return 'first';
    });
    // These queue up behind the first
    const p2 = rq.enqueue(() => Promise.resolve('second'));
    const p3 = rq.enqueue(() => Promise.resolve('third'));

    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
    // Position reflects order at enqueue time
    expect(r1.queuePosition).toBe(0);
    expect(r2.queuePosition).toBe(1);
    expect(r3.queuePosition).toBe(2);
  });

  it('should report correct length', () => {
    expect(rq.length).toBe(0);
  });
});
