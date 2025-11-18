import assert from 'node:assert';
import test from 'node:test';
import worker, { getReaderBalance } from './worker.js';

class MemoryKV {
  constructor() {
    this.store = new Map();
  }

  async put(key, value) {
    this.store.set(key, value);
  }

  async get(key) {
    return this.store.get(key) ?? null;
  }

  async list({ prefix, cursor } = {}) {
    const keys = Array.from(this.store.keys()).filter((key) =>
      prefix ? key.startsWith(prefix) : true
    );

    // simple pagination simulation
    const pageSize = 2;
    const start = cursor ? Number(cursor) : 0;
    const slice = keys.slice(start, start + pageSize);
    const nextCursor = start + pageSize < keys.length ? String(start + pageSize) : undefined;

    return {
      keys: slice.map((name) => ({ name })),
      list_complete: !nextCursor,
      cursor: nextCursor
    };
  }
}

const buildEnv = () => ({ DTG_EVENTS: new MemoryKV() });

const makeRequest = (path) => new Request(`https://example.com${path}`);

const addEvent = async (env, event) => {
  await env.DTG_EVENTS.put(`event:${event.event_id}`, JSON.stringify(event));
};

test('getReaderBalance aggregates cents and last updated across events', async () => {
  const env = buildEnv();
  await addEvent(env, {
    event_id: '1',
    reader_id: 'reader-123',
    sentient_cents_earned: 0.5,
    ts_iso: '2024-01-01T00:00:00.000Z'
  });
  await addEvent(env, {
    event_id: '2',
    reader_id: 'reader-123',
    sentient_cents_earned: 1.25,
    ts_iso: '2024-02-01T12:00:00.000Z'
  });
  await addEvent(env, {
    event_id: '3',
    reader_id: 'other-reader',
    sentient_cents_earned: 9,
    ts_iso: '2024-03-01T12:00:00.000Z'
  });

  const balance = await getReaderBalance('reader-123', env);

  assert.strictEqual(balance.reader_id, 'reader-123');
  assert.strictEqual(balance.total_balance, 1.75);
  assert.strictEqual(balance.last_updated, '2024-02-01T12:00:00.000Z');
  assert.strictEqual(balance.source, 'events_kv');
});

test('GET /balance/:reader returns computed balance payload', async () => {
  const env = buildEnv();
  await addEvent(env, {
    event_id: '1',
    reader_id: 'reader-abc',
    sentient_cents_earned: 2,
    ts_iso: '2024-06-15T08:30:00.000Z'
  });

  const response = await worker.fetch(makeRequest('/balance/reader-abc'), env, {});
  assert.strictEqual(response.status, 200);
  const payload = await response.json();

  assert.deepStrictEqual(payload, {
    reader_id: 'reader-abc',
    total_balance: 2,
    last_updated: '2024-06-15T08:30:00.000Z',
    source: 'events_kv'
  });
});

