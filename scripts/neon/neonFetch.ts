type Opts = RequestInit & {
  maxRetries?: number;
  baseDelayMs?: number;
  timeoutMs?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function neonFetch(url: string, opts: Opts = {}) {
  const { maxRetries = 6, baseDelayMs = 400, timeoutMs = 30_000, ...init } = opts;

  for (let attempt = 0; ; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
        if (attempt >= maxRetries) {
          return response;
        }
        const retryAfterHeader = response.headers.get("retry-after");
        const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : NaN;
        const backoff = Number.isFinite(retryAfter)
          ? Math.min(retryAfter * 1000, 10_000)
          : Math.min(baseDelayMs * 2 ** attempt, 10_000);
        const jitter = Math.floor(Math.random() * 250);
        await sleep(backoff + jitter);
        continue;
      }
      return response;
    } catch (error) {
      if (attempt >= maxRetries) {
        throw error;
      }
      const backoff = Math.min(baseDelayMs * 2 ** attempt, 10_000);
      const jitter = Math.floor(Math.random() * 250);
      await sleep(backoff + jitter);
    } finally {
      clearTimeout(timer);
    }
  }
}
