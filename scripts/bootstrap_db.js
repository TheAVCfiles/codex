#!/usr/bin/env node
/**
 * Database Provisioning & Bootstrapping Script (production-hardened)
 *
 * Usage:
 *   node bootstrap_db.js --provider=neon --name=new-db --org=neon-project-id --schema=./schema.sql --migrations=./migrations
 *   node bootstrap_db.js --provider=supabase --name=new-project --schema=./schema.sql
 *
 * Optional flags:
 *   --json            Emit machine-readable JSON on success/failure
 *   --dry-run         Validate & fetch DB URL, do not connect/apply schema or migrations
 *   --retries=5       Retry count for provision call (default 5)
 *   --timeout=20000   Timeout (ms) per provision attempt (default 20000)
 *
 * Required env:
 *   VAULTGATE_URL     e.g., https://vaultgate.your.workers.dev
 *   ADMIN_SECRET      Bearer token for /provision auth
 */

import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import pg from "pg";

const { Client } = pg;

// ---------- CLI ----------
function parseArgs(argv) {
  return argv.reduce((acc, arg) => {
    const m = /^--([^=]+)(?:=(.+))?$/.exec(arg);
    if (!m) return acc;
    const [, k, v] = m;
    acc[k] = v === undefined ? true : v;
    return acc;
  }, {});
}
const args = parseArgs(process.argv.slice(2));
const {
  provider,
  name,
  org,
  schema: schemaPath,
  migrations: migrationsPath,
  json,
  ["dry-run"]: dryRun,
} = args;
const retries = Number.isFinite(Number(args.retries))
  ? Number(args.retries)
  : 5;
const timeoutMs = Number.isFinite(Number(args.timeout))
  ? Number(args.timeout)
  : 20_000;

const { VAULTGATE_URL, ADMIN_SECRET } = process.env;

// ---------- Helpers ----------
function outLog(...xs) {
  if (json) return;
  // eslint-disable-next-line no-console
  console.log(...xs);
}
function outErr(...xs) {
  if (json) return;
  // eslint-disable-next-line no-console
  console.error(...xs);
}
function emitJson(obj) {
  if (!json) return;
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(obj));
}
function redactConn(str) {
  return (str || "").replace(/:[^@:]+@/, ":****@");
}
function ensureSslParam(connStr) {
  try {
    const u = new URL(connStr);
    if (!u.searchParams.has("sslmode"))
      u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch {
    return connStr;
  }
}

function ensureNoPsqlMeta(sql, origin) {
  if (/^\s*\\/.test(sql.trim())) {
    throw new Error(
      `${origin} contains psql meta-commands (e.g., \\i, \\copy). Remove them for programmatic execution.`,
    );
  }
}

// ---------- Validation ----------
function fail(msg, data = {}) {
  emitJson({ ok: false, error: msg, ...data });
  if (!json) outErr(msg);
  process.exit(1);
}
function assertEnv() {
  if (!VAULTGATE_URL || !ADMIN_SECRET) {
    fail("VAULTGATE_URL and ADMIN_SECRET environment variables are required.");
  }
  try {
    new URL(VAULTGATE_URL);
  } catch {
    fail("VAULTGATE_URL must be a valid URL.");
  }
}
function assertArgs() {
  if (!provider || !name || !schemaPath) {
    fail(
      "Usage: --provider=<neon|supabase> --name=<name> --schema=<path> [--org=<neon_org>] [--migrations=<dir>] [--json] [--dry-run]",
    );
  }
  if (!["neon", "supabase"].includes(provider)) {
    fail(`--provider must be "neon" or "supabase" (got "${provider}")`);
  }
}

// ---------- Networking with retry ----------
class RetryableError extends Error {}
async function fetchWithRetry(
  url,
  options,
  { attempts = 5, timeoutMs = 20000 } = {},
) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      const ct = res.headers.get("content-type") || "";
      const body = ct.includes("application/json")
        ? await res.json()
        : { raw: await res.text() };
      if (!res.ok) {
        const msg = body?.error || body?.message || `HTTP ${res.status}`;
        if (res.status === 429 || (res.status >= 500 && res.status <= 599))
          throw new RetryableError(msg);
        throw new Error(`Provisioning API failed (${res.status}): ${msg}`);
      }
      return body;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      const retryable =
        err instanceof RetryableError ||
        err.name === "AbortError" ||
        /ENOTFOUND|ECONNRESET|ETIMEDOUT/.test(err.message || "");
      if (i === attempts || !retryable) break;
      const delay = 500 * Math.pow(2, i - 1) + Math.random() * 250;
      outErr(
        `Provision attempt ${i} failed: ${err.message}. Retrying in ${Math.round(delay)}ms…`,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error(
    `Provisioning API failed after retries: ${lastErr?.message || lastErr}`,
  );
}

// ---------- Provision ----------
async function callProvisionAPI({
  vaultUrl,
  adminSecret,
  provider,
  name,
  org,
}) {
  const provisionUrl = new URL("/provision", vaultUrl).toString();
  const body = {
    provider,
    name,
    ...(provider === "neon" && org ? { org } : {}),
  };

  const result = await fetchWithRetry(
    provisionUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminSecret}`,
      },
      body: JSON.stringify(body),
    },
    { attempts: retries, timeoutMs },
  );

  if (!result?.databaseUrl)
    throw new Error("API response successful but missing databaseUrl.");

  return result.databaseUrl;
}

// ---------- Schema Apply ----------
async function withClient(connectionString, fn) {
  const client = new Client({
    connectionString: ensureSslParam(connectionString),
    ssl: { rejectUnauthorized: false }, // belt-and-suspenders for older environments
  });

  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

async function applySchema(client, sql) {
  ensureNoPsqlMeta(sql, "Schema");

  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query("COMMIT");
  } catch (e) {
    try {
      await client.query("ROLLBACK");
    } catch {}
    throw e;
  }
}

async function loadMigrations(dir) {
  if (!dir) return [];

  const absDir = path.resolve(dir);
  const entries = await fs
    .readdir(absDir, { withFileTypes: true })
    .catch(() => null);
  if (!entries) {
    fail(`Migrations directory at ${absDir} is unreadable.`);
  }

  const files = entries
    .filter(
      (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".sql"),
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const seen = new Set();
  const migrations = [];
  for (const file of files) {
    if (seen.has(file)) {
      fail(`Duplicate migration detected: ${file}`);
    }
    seen.add(file);
    const fullPath = path.join(absDir, file);
    const sql = await fs.readFile(fullPath, "utf-8").catch(() => null);
    if (!sql || !sql.trim()) {
      fail(`Migration ${fullPath} is empty or unreadable.`);
    }
    ensureNoPsqlMeta(sql, `Migration ${file}`);
    const checksum = createHash("sha256").update(sql).digest("hex");
    migrations.push({ version: file, sql, checksum, bytes: sql.length });
  }

  return migrations;
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function applyMigrations(client, migrations) {
  if (!migrations.length) return [];

  await ensureMigrationsTable(client);
  const existing = await client.query(
    "SELECT version, checksum FROM schema_migrations",
  );
  const appliedMap = new Map(
    existing.rows.map((row) => [row.version, row.checksum]),
  );

  const applied = [];
  for (const migration of migrations) {
    const priorChecksum = appliedMap.get(migration.version);
    if (priorChecksum) {
      if (priorChecksum !== migration.checksum) {
        throw new Error(`Checksum mismatch for ${migration.version}`);
      }
      outLog(`Skipping already applied migration ${migration.version}.`);
      continue;
    }

    outLog(
      `Applying migration ${migration.version} (${migration.bytes} bytes)…`,
    );
    await client.query("BEGIN");
    try {
      await client.query(migration.sql);
      await client.query(
        "INSERT INTO schema_migrations(version, checksum) VALUES ($1, $2)",
        [migration.version, migration.checksum],
      );
      await client.query("COMMIT");
    } catch (err) {
      try {
        await client.query("ROLLBACK");
      } catch {}
      throw new Error(`Migration ${migration.version} failed: ${err.message}`);
    }

    applied.push(migration.version);
  }

  return applied;
}

// ---------- Main ----------
(async function main() {
  try {
    assertEnv();
    assertArgs();

    outLog(`Calling VaultGate to provision '${name}' on ${provider}…`);
    const databaseUrl = await callProvisionAPI({
      vaultUrl: VAULTGATE_URL,
      adminSecret: ADMIN_SECRET,
      provider,
      name,
      org,
    });
    outLog(`Provisioning successful. DB URL: ${redactConn(databaseUrl)}`);

    const abs = path.resolve(schemaPath);
    const schemaSql = await fs.readFile(abs, "utf-8").catch(() => null);
    if (!schemaSql || !schemaSql.trim())
      fail(`Schema file at ${abs} is empty or unreadable.`);

    const migrations = await loadMigrations(migrationsPath);

    outLog(`Schema file loaded (${schemaSql.length} bytes).`);
    if (migrations.length) {
      outLog(
        `Loaded ${migrations.length} migration${migrations.length === 1 ? "" : "s"} from ${path.resolve(migrationsPath)}.`,
      );
    }

    if (dryRun) {
      emitJson({
        ok: true,
        dryRun: true,
        databaseUrl: redactConn(databaseUrl),
        schemaBytes: schemaSql.length,
        pendingMigrations: migrations.map((m) => m.version),
      });
      if (!json) {
        outLog("Dry run: skipping DB connection and schema/migrations apply.");
        if (migrations.length) {
          outLog(
            "Pending migrations:",
            migrations.map((m) => m.version).join(", "),
          );
        }
      }
      process.exit(0);
    }

    outLog("Connecting to new database to apply schema and migrations…");
    const applied = await withClient(databaseUrl, async (client) => {
      await applySchema(client, schemaSql);
      outLog("Schema applied successfully.");
      return applyMigrations(client, migrations);
    });
    outLog("Bootstrap complete.");
    outLog("Database URL:", redactConn(databaseUrl));
    if (applied.length) {
      outLog("Applied migrations:", applied.join(", "));
    }

    emitJson({ ok: true, databaseUrl: redactConn(databaseUrl), applied });
  } catch (e) {
    emitJson({ ok: false, error: e.message });
    if (!json) outErr("Bootstrapping failed:", e.message);
    process.exit(1);
  }
})();
