import type { NormalizedEvent } from "./normalize";

type Env = {
  DTG_LEDGER: D1Database;
};

type LedgerRow = NormalizedEvent & { cents: number };

type D1Database = {
  prepare: (query: string) => {
    bind: (...params: unknown[]) => {
      first: <T = unknown>() => Promise<T | null>;
      run: () => Promise<void>;
      all: <T = unknown>() => Promise<{ results: T[] }>;
    };
  };
};

export async function writeLedger(env: Env, row: LedgerRow) {
  await env.DTG_LEDGER.prepare(
    "INSERT INTO ledger (id, timestamp, actor, action, resource, cents, metadata) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)"
  )
    .bind(
      row.id,
      row.timestamp,
      row.actor,
      row.action,
      row.resource ?? null,
      row.cents,
      JSON.stringify(row.metadata ?? {})
    )
    .run();
}

export async function readLedger(env: Env) {
  const statement = env.DTG_LEDGER.prepare(
    "SELECT id, timestamp, actor, action, resource, cents, metadata FROM ledger ORDER BY timestamp DESC LIMIT 200"
  );
  const results = await statement.bind().all<LedgerRow>();
  return results.results ?? [];
}
