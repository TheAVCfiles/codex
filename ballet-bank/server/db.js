const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbFile = process.env.DATABASE_FILE || './ballet-bank.sqlite';
const dbPath = path.resolve(process.cwd(), dbFile);
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

async function initDb() {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    wallet_address TEXT,
    scent_balance_cents INTEGER NOT NULL DEFAULT 0,
    tier TEXT NOT NULL DEFAULT 'soloist',
    conversion_limits_cents INTEGER NOT NULL DEFAULT 20000,
    last_activity TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS ledger_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    reference TEXT,
    metadata_json TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS stripe_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    processed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS conversion_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    wallet_address TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    tx_hash TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
}

async function upsertUserByEmail(email, walletAddress = null) {
  await run(
    `INSERT INTO users (email, wallet_address)
     VALUES (?, ?)
     ON CONFLICT(email) DO UPDATE SET
      wallet_address = COALESCE(excluded.wallet_address, users.wallet_address),
      updated_at = CURRENT_TIMESTAMP`,
    [email, walletAddress]
  );

  return get('SELECT * FROM users WHERE email = ?', [email]);
}

async function findUserByEmail(email) {
  return get('SELECT * FROM users WHERE email = ?', [email]);
}

async function findUserById(userId) {
  return get('SELECT * FROM users WHERE id = ?', [userId]);
}

async function creditUser({ userId, amountCents, type, reference, metadata = {} }) {
  await run('BEGIN TRANSACTION');
  try {
    await run(
      `UPDATE users
       SET scent_balance_cents = scent_balance_cents + ?,
           last_activity = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [amountCents, userId]
    );

    await run(
      `INSERT INTO ledger_entries (user_id, type, amount_cents, reference, metadata_json)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, type, amountCents, reference || null, JSON.stringify(metadata)]
    );

    await run('COMMIT');
  } catch (error) {
    await run('ROLLBACK');
    throw error;
  }

  return findUserById(userId);
}

async function debitUser({ userId, amountCents, type, reference, metadata = {} }) {
  await run('BEGIN TRANSACTION');
  try {
    const user = await get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) throw new Error('User not found.');
    if (user.scent_balance_cents < amountCents) {
      throw new Error('Insufficient SCENT balance.');
    }

    await run(
      `UPDATE users
       SET scent_balance_cents = scent_balance_cents - ?,
           last_activity = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [amountCents, userId]
    );

    await run(
      `INSERT INTO ledger_entries (user_id, type, amount_cents, reference, metadata_json)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, type, -Math.abs(amountCents), reference || null, JSON.stringify(metadata)]
    );

    await run('COMMIT');
  } catch (error) {
    await run('ROLLBACK');
    throw error;
  }

  return findUserById(userId);
}

async function hasStripeEvent(eventId) {
  const event = await get('SELECT id FROM stripe_events WHERE id = ?', [eventId]);
  return Boolean(event);
}

async function recordStripeEvent(eventId, eventType) {
  await run('INSERT INTO stripe_events (id, event_type) VALUES (?, ?)', [eventId, eventType]);
}

async function addConversionRequest({ userId, walletAddress, amountCents }) {
  const result = await run(
    `INSERT INTO conversion_requests (user_id, wallet_address, amount_cents, status)
     VALUES (?, ?, ?, 'pending')`,
    [userId, walletAddress, amountCents]
  );

  return get('SELECT * FROM conversion_requests WHERE id = ?', [result.lastID]);
}

async function markConversionSubmitted(requestId, txHash) {
  await run(
    `UPDATE conversion_requests
     SET tx_hash = ?, status = 'submitted', updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [txHash, requestId]
  );
}

async function sumDailyConversions(userId) {
  const row = await get(
    `SELECT COALESCE(SUM(amount_cents), 0) as total
     FROM conversion_requests
     WHERE user_id = ?
       AND status IN ('pending', 'submitted', 'confirmed')
       AND date(created_at) = date('now')`,
    [userId]
  );

  return row?.total || 0;
}

module.exports = {
  initDb,
  run,
  get,
  all,
  upsertUserByEmail,
  findUserByEmail,
  findUserById,
  creditUser,
  debitUser,
  hasStripeEvent,
  recordStripeEvent,
  addConversionRequest,
  markConversionSubmitted,
  sumDailyConversions,
};
