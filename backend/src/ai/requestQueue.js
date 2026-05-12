/**
 * Request Queue — FIFO queue for sequential AI request processing.
 * Ensures only one AI request is processed at a time.
 */

class RequestQueue {
  constructor() {
    this._queue = [];
    this._processing = false;
  }

  /** Current number of items waiting in the queue. */
  get length() {
    return this._queue.length;
  }

  /** Whether a request is currently being processed. */
  get isProcessing() {
    return this._processing;
  }

  /**
   * Enqueue a task for sequential execution.
   *
   * @param {Function} taskFn - Async function to execute
   * @returns {Promise<{result: any, queuePosition: number, queueLength: number}>}
   */
  enqueue(taskFn) {
    return new Promise((resolve, reject) => {
      const position = this._queue.length + (this._processing ? 1 : 0);
      const queueLength = position + 1;

      this._queue.push({
        taskFn,
        resolve: (result) => resolve({ result, queuePosition: position, queueLength }),
        reject,
      });

      this._processNext();
    });
  }

  /** @private Process the next item in the queue. */
  async _processNext() {
    if (this._processing || this._queue.length === 0) return;

    this._processing = true;
    const { taskFn, resolve, reject } = this._queue.shift();

    try {
      const result = await taskFn();
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      this._processing = false;
      this._processNext();
    }
  }
}

// Singleton instance
const queue = new RequestQueue();

module.exports = { RequestQueue, queue };
