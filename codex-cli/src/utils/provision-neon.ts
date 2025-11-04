import { log } from "./logger/log.js";

type NeonOperationRef = { id: string };

type NeonBranchResponse = {
  branch?: { id?: string };
  operations?: Array<NeonOperationRef>;
};

type NeonEndpointResponse = {
  endpoint?: { id?: string };
  operations?: Array<NeonOperationRef>;
};

type NeonDatabaseResponse = {
  operations?: Array<NeonOperationRef>;
};

type NeonConnectionResponse = Record<string, unknown> & {
  connection_uri?: string;
  uri?: string;
  connectionUri?: string;
};

/**
 * Provision a Neon branch + database and return a connection string.
 * - Creates a branch (from default parent unless parentId provided)
 * - Creates a read-write compute endpoint for that branch
 * - Waits for async operations to complete
 * - Creates the specified database on that branch
 * - Returns a connection URI for the new database
 *
 * Notes:
 * - org == projectId in Neon API terms.
 * - You likely want roleName = 'neondb_owner' unless you provision a custom role.
 */
export async function provisionNeon({
  org,
  name,
  roleName = "neondb_owner",
  parentId,
  timeoutMs = 90_000,
  pollIntervalMs = 1_500,
}: {
  org: string;
  name: string;
  roleName?: string;
  parentId?: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
}): Promise<{ databaseUrl: string }> {
  const apiKey = process.env["NEON_API_KEY"];
  if (!apiKey) {
    throw new Error("NEON_API_KEY not set in environment");
  }

  const API_BASE = "https://console.neon.tech/api/v2";
  const headers: HeadersInit = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const branchName = `branch_for_${name.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  log(`[neon] Provisioning resources for project ${org} (branch: ${branchName})...`);

  const startedAt = Date.now();
  const ensureTime = () => {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error("Timed out waiting for Neon operations");
    }
  };

  const pollOp = async (opId: string): Promise<void> => {
    const pollOnce = async (): Promise<void> => {
      ensureTime();
      const response = await fetch(`${API_BASE}/projects/${org}/operations/${opId}`, { headers });
      if (!response.ok) {
        throw new Error(`Operation ${opId} polling failed: ${response.status} ${await response.text()}`);
      }
      const body = (await response.json()) as { operation?: { status?: string } };
      const status = body.operation?.status;
      if (status === "succeeded") {
        return;
      }
      if (status === "failed" || status === "canceled") {
        throw new Error(`Operation ${opId} ${status}: ${JSON.stringify(body)}`);
      }
      await new Promise((resolve) => {
        setTimeout(resolve, pollIntervalMs);
      });
      await pollOnce();
    };

    await pollOnce();
  };

  const pollAllOps = async (ops?: Array<NeonOperationRef>): Promise<void> => {
    if (!ops || ops.length === 0) {
      return;
    }
    await Promise.all(ops.map((op) => pollOp(op.id)));
  };

  // --- 1) Create branch (optionally from a specific parent) ---
  let branchId: string | undefined;
  try {
    const createBranchUrl = `${API_BASE}/projects/${org}/branches`;
    const body: { branch: { name: string; parent_id?: string } } = { branch: { name: branchName } };
    if (parentId) {
      body.branch.parent_id = parentId;
    }

    const res = await fetch(createBranchUrl, { method: "POST", headers, body: JSON.stringify(body) });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Neon branch creation failed (${res.status}): ${errorText}`);
    }
    const data = (await res.json()) as NeonBranchResponse;
    branchId = data.branch?.id;
    if (!branchId) {
      throw new Error(`Branch creation response missing branch.id: ${JSON.stringify(data)}`);
    }
    log(`[neon] Branch created: ${branchId}`);

    await pollAllOps(data.operations);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`[neon] Error in branch creation: ${message}`);
    throw error;
  }

  if (!branchId) {
    throw new Error("Branch ID missing after branch creation");
  }

  // --- 2) Create read-write compute endpoint for the branch ---
  let endpointId: string | undefined;
  try {
    const createEpUrl = `${API_BASE}/projects/${org}/endpoints`;
    const epBody = {
      endpoint: {
        type: "read_write" as const,
        branch_id: branchId,
      },
    };
    const epRes = await fetch(createEpUrl, { method: "POST", headers, body: JSON.stringify(epBody) });
    if (!epRes.ok) {
      const errorText = await epRes.text();
      throw new Error(`Neon endpoint creation failed (${epRes.status}): ${errorText}`);
    }
    const epData = (await epRes.json()) as NeonEndpointResponse;
    endpointId = epData.endpoint?.id;
    if (!endpointId) {
      throw new Error(`Endpoint creation response missing endpoint.id: ${JSON.stringify(epData)}`);
    }
    log(`[neon] Endpoint created: ${endpointId}`);
    await pollAllOps(epData.operations);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`[neon] Error creating compute endpoint, rolling back branch: ${message}`);
    if (branchId) {
      try {
        await fetch(`${API_BASE}/projects/${org}/branches/${branchId}`, { method: "DELETE", headers });
      } catch {
        // ignore rollback errors
      }
    }
    throw error;
  }

  if (!endpointId) {
    throw new Error("Endpoint ID missing after endpoint creation");
  }

  // --- 3) Create the database on that branch ---
  try {
    const createDbUrl = `${API_BASE}/projects/${org}/branches/${branchId}/databases`;
    const dbRes = await fetch(createDbUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ database: { name } }),
    });
    if (!dbRes.ok) {
      const errorText = await dbRes.text();
      log(`[neon] Failed to create database '${name}'. Attempting rollback.`);
      try {
        await fetch(`${API_BASE}/projects/${org}/endpoints/${endpointId}`, { method: "DELETE", headers });
      } catch {
        // ignore rollback errors
      }
      try {
        await fetch(`${API_BASE}/projects/${org}/branches/${branchId}`, { method: "DELETE", headers });
      } catch {
        // ignore rollback errors
      }
      throw new Error(`Neon database creation failed (${dbRes.status}): ${errorText}`);
    }
    const dbData = (await dbRes.json()) as NeonDatabaseResponse;
    await pollAllOps(dbData.operations);
    log(`[neon] Database '${name}' created.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`[neon] Error in database creation: ${message}`);
    throw error;
  }

  // --- 4) Retrieve a connection URI for the new DB ---
  try {
    const params = new URLSearchParams({
      branch_id: branchId,
      database_name: name,
      role_name: roleName,
    });
    const uriRes = await fetch(`${API_BASE}/projects/${org}/connection_uri?${params.toString()}`, { headers });
    if (!uriRes.ok) {
      const errorText = await uriRes.text();
      throw new Error(`Retrieve connection URI failed (${uriRes.status}): ${errorText}`);
    }
    const uriData = (await uriRes.json()) as NeonConnectionResponse;
    const databaseUrl = uriData.connection_uri ?? uriData.uri ?? uriData.connectionUri;
    if (typeof databaseUrl !== "string" || databaseUrl.length === 0) {
      throw new Error(`Unexpected connection URI payload: ${JSON.stringify(uriData)}`);
    }

    log(`[neon] Provisioning complete. Database URL: ${databaseUrl.replace(/:(?:[^@:]+)@/, ":****@")}`);
    return { databaseUrl };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`[neon] Error retrieving connection URI: ${message}`);
    throw error;
  }
}
