import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { cleanupNeon } from "./cleanupNeon";
import { neonFetch } from "./neonFetch";

const API_BASE = "https://console.neon.tech/api/v2";

interface Operation {
  id: string;
}

interface ProvisionOptions {
  org: string;
  name: string;
  roleName?: string;
  parentId?: string;
  applySchema?: boolean;
  schemaSql?: string;
}

interface ProvisionResult {
  branchId: string;
  endpointId: string;
  uris: {
    pooled: string;
    direct: string;
    psqlDsn: string;
  };
}

async function jsonOrThrow<T>(res: Response, step: string): Promise<T> {
  if (!res.ok) {
    let detail: string;
    try {
      detail = await res.text();
    } catch (error) {
      detail = String(error);
    }
    throw new Error(`${step} failed with status ${res.status}: ${detail}`);
  }
  return (await res.json()) as T;
}

async function waitForOperations(org: string, operations: Operation[], headers: HeadersInit) {
  for (const operation of operations) {
    const operationId = operation.id;
    let completed = false;
    for (let attempts = 0; attempts <= 60; attempts++) {
      const res = await neonFetch(`${API_BASE}/projects/${org}/operations/${operationId}`, {
        headers,
      });
      const data = await jsonOrThrow<{ operation: { status: string; error?: { message?: string } } }>(
        res,
        `Polling operation ${operationId}`
      );
      const status = data.operation?.status;
      if (status === "succeeded") {
        completed = true;
        break;
      }
      if (status === "failed") {
        const errorMessage = data.operation?.error?.message || "unknown error";
        throw new Error(`Operation ${operationId} failed: ${errorMessage}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (!completed) {
      throw new Error(`Operation ${operationId} did not complete in time`);
    }
  }
}

export async function postProvisionSmoke(uri: string) {
  const client = new Client({ connectionString: uri });
  await client.connect();
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS _smoke (k text primary key, v text, ts timestamptz default now());
                 INSERT INTO _smoke (k, v) VALUES ('hello','world') ON CONFLICT (k) DO UPDATE SET ts = now();`);
    const result = await client.query<{ n: number }>(`SELECT count(*)::int AS n FROM _smoke`);
    return result.rows[0]?.n ?? 0;
  } finally {
    await client.end();
  }
}

export async function provisionNeon(options: ProvisionOptions): Promise<ProvisionResult> {
  const { org, name, roleName = "neondb_owner", parentId, applySchema = false, schemaSql } = options;
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    throw new Error("NEON_API_KEY not set");
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
  } satisfies HeadersInit;
  const jsonHeaders = {
    ...headers,
    "Content-Type": "application/json",
  } satisfies HeadersInit;

  let branchId: string | undefined;
  let endpointId: string | undefined;

  try {
    await neonFetch(`${API_BASE}/projects/${org}/branches`, { headers });

    const branchName = `${name}-${randomUUID()}`;
    const branchRes = await neonFetch(`${API_BASE}/projects/${org}/branches`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        branch: {
          name: branchName,
          parent_id: parentId,
        },
      }),
    });
    const branchJson = await jsonOrThrow<{ branch: { id: string }; operations?: Operation[] }>(
      branchRes,
      "Creating branch"
    );
    branchId = branchJson.branch.id;
    if (branchJson.operations?.length) {
      await waitForOperations(org, branchJson.operations, headers);
    }

    const endpointRes = await neonFetch(`${API_BASE}/projects/${org}/endpoints`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        endpoint: {
          branch_id: branchId,
          type: "read_write",
          name: `${branchName}-endpoint`,
        },
      }),
    });
    const endpointJson = await jsonOrThrow<{ endpoint: { id: string }; operations?: Operation[] }>(
      endpointRes,
      "Creating endpoint"
    );
    endpointId = endpointJson.endpoint.id;
    if (endpointJson.operations?.length) {
      await waitForOperations(org, endpointJson.operations, headers);
    }

    await neonFetch(`${API_BASE}/projects/${org}/branches/${branchId}/databases`, { headers });

    const databaseRes = await neonFetch(`${API_BASE}/projects/${org}/branches/${branchId}/databases`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        database: {
          name,
          owner_name: roleName,
        },
      }),
    });
    const databaseJson = await jsonOrThrow<{ operations?: Operation[] }>(databaseRes, "Creating database");
    if (databaseJson.operations?.length) {
      await waitForOperations(org, databaseJson.operations, headers);
    }

    const pooledUriRes = await neonFetch(
      `${API_BASE}/projects/${org}/connection_uri?branch_id=${encodeURIComponent(
        branchId
      )}&database=${encodeURIComponent(name)}&role=${encodeURIComponent(roleName)}&pooler=true`,
      { headers }
    );
    const pooledUriJson = await jsonOrThrow<{ connection_uri: string }>(pooledUriRes, "Fetching pooled URI");

    const directUriRes = await neonFetch(
      `${API_BASE}/projects/${org}/connection_uri?branch_id=${encodeURIComponent(
        branchId
      )}&database=${encodeURIComponent(name)}&role=${encodeURIComponent(roleName)}&pooler=false`,
      { headers }
    );
    const directUriJson = await jsonOrThrow<{ connection_uri: string }>(directUriRes, "Fetching direct URI");

    const uris = {
      pooled: pooledUriJson.connection_uri,
      direct: directUriJson.connection_uri,
      psqlDsn: directUriJson.connection_uri,
    } satisfies ProvisionResult["uris"];

    process.env.DATABASE_URL = uris.pooled;
    process.env.DIRECT_DATABASE_URL = uris.direct;

    if (applySchema) {
      if (!schemaSql) {
        throw new Error("applySchema requested but no schemaSql provided");
      }
      const client = new Client({ connectionString: uris.direct });
      await client.connect();
      try {
        await client.query(schemaSql);
      } finally {
        await client.end();
      }
      await postProvisionSmoke(uris.direct);
    }

    if (!branchId || !endpointId) {
      throw new Error("Failed to create Neon branch or endpoint");
    }

    return {
      branchId,
      endpointId,
      uris,
    } satisfies ProvisionResult;
  } catch (error) {
    await cleanupNeon({ org, branchId, endpointId }).catch(() => {
      // Ignore cleanup failures to surface original error.
    });
    throw error;
  }
}
