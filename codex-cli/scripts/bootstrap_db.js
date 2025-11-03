/**
 * Database Provisioning & Bootstrapping Script (hardened)
 *
 * From repo root:
 *   node codex-cli/scripts/bootstrap_db.js --provider=neon --name=new-db --org=neon-project-id --schema=./schema.sql
 *   node codex-cli/scripts/bootstrap_db.js --provider=supabase --name=new-project --schema=./schema.sql
 *
 * Required env:
 *   VAULTGATE_URL  e.g. https://vaultgate.example.workers.dev
 *   ADMIN_SECRET   bearer used for /provision auth
 */

import fs from "fs/promises";
import path from "path";
import pg from "pg";
import { fileURLToPath } from "url";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- CLI ----
function parseArgs(argv) {
  // tiny, predictable parser: --key=value only
  return argv.reduce((acc, arg) => {
    const m = /^--([^=]+)=(.+)$/.exec(arg);
    if (m) {
      acc[m[1]] = m[2];
    }
    return acc;
  }, {});
}

const args = parseArgs(process.argv.slice(2));
const { provider, name, org, schema: schemaPath } = args;
const { VAULTGATE_URL, ADMIN_SECRET } = process.env;

// ---- Validation ----
function fail(msg) {
  console.error(msg);
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
  const allowed = new Set(["neon", "supabase"]);
  if (!provider || !name || !schemaPath) {
    fail(
      "Usage: --provider=<neon|supabase> --name=<name> --schema=<path> [--org=<neon_org_id>]",
    );
  }
  if (!allowed.has(provider)) {
    fail(`--provider must be one of: neon, supabase (got "${provider}")`);
  }
  if (provider === "neon" && !org) {
    console.warn(
      "Note: Neon usually requires an org/project id via --org=<id>.",
    );
  }
}

assertEnv();
assertArgs();

// ---- Utilities ----
function redactConn(str) {
  if (!str) {
    return str;
  }
  // postgres://user:pass@host -> mask pass
  return str.replace(/(:)([^@:/?#]+)@/, ":****@");
}
function ensureSslParam(connStr) {
  // Many hosted Postgres require TLS. If the URL lacks an explicit sslmode, add ?sslmode=require
  try {
    const u = new URL(connStr);
    // If any ssl-like signal exists, leave it alone.
    if (!u.searchParams.has("sslmode")) {
      u.searchParams.set("sslmode", "require");
    }
    return u.toString();
  } catch {
    return connStr; // fallback
  }
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---- Provision API (robust: timeout + retries) ----
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

  const maxAttempts = 5;
  const baseDelay = 500; // ms

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000); // 20s
    try {
      const res = await fetch(provisionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminSecret}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      let result;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        result = {
          error: `Unexpected content-type: ${contentType}`,
          raw: text,
        };
      }

      if (!res.ok) {
        const msg = result?.error || result?.message || `HTTP ${res.status}`;
        // Retry 429/5xx; fail fast on 4xx (except 429)
        if (res.status === 429 || (res.status >= 500 && res.status <= 599)) {
          throw new RetryableError(`Provisioning API retryable error: ${msg}`);
        }
        throw new Error(`Provisioning API failed: ${msg}`);
      }

      if (!result.databaseUrl) {
        throw new Error("API response did not include databaseUrl.");
      }

      return result.databaseUrl;
    } catch (err) {
      clearTimeout(timeout);
      const isLast = attempt === maxAttempts;
      const retryable =
        err instanceof RetryableError ||
        err.name === "AbortError" ||
        /ENOTFOUND|ECONNRESET|ETIMEDOUT/.test(err.message || "");

      if (!retryable || isLast) {
        console.error(
          `Provisioning failed${isLast ? "" : " (will not retry)"}:`,
          err.message,
        );
        throw err;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 250;
      console.warn(
        `Provision attempt ${attempt} failed: ${err.message}. Retrying in ${Math.round(delay)}ms…`,
      );
      await sleep(delay);
    }
  }
  throw new Error("Unreachable: retries exhausted");
}
class RetryableError extends Error {}

// ---- Schema apply (transactional) ----
async function applySchema(connectionString, sql) {
  const conn = ensureSslParam(connectionString);
  // node-postgres respects sslmode=require query param;
  // also pass ssl object defensively for older environments
  const client = new Client({
    connectionString: conn,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    // Guard against psql meta-commands that pg won't understand
    if (/^\s*\\/.test(sql.trim())) {
      throw new Error(
        "Schema contains psql meta-commands (e.g., \\i, \\copy). Remove them for programmatic execution.",
      );
    }

    // One transaction for idempotent baseline. Postgres allows transactional DDL.
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
  } catch (e) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Ignore rollback errors; connection is about to close.
    }
    throw e;
  } finally {
    await client.end();
  }
}

// ---- Main ----
(async function main() {
  try {
    console.log(`Provisioning '${name}' on ${provider} via VaultGate…`);
    const databaseUrl = await callProvisionAPI({
      vaultUrl: VAULTGATE_URL,
      adminSecret: ADMIN_SECRET,
      provider,
      name,
      org,
    });
    console.log(`Provisioned. Database URL: ${redactConn(databaseUrl)}`);

    const abs = path.isAbsolute(schemaPath)
      ? schemaPath
      : path.resolve(__dirname, schemaPath);
    const schemaSql = await fs.readFile(abs, "utf8");
    if (!schemaSql || !schemaSql.trim()) {
      fail(`Schema file at ${abs} is empty/unreadable.`);
    }
    console.log(`Schema loaded (${schemaSql.length} bytes). Applying…`);

    await applySchema(databaseUrl, schemaSql);
    console.log("Schema applied successfully.");
    console.log("Bootstrap complete.");
    console.log("Database URL:", redactConn(databaseUrl));
  } catch (e) {
    console.error("Bootstrapping failed:", e.message);
    process.exit(1);
  }
})();
