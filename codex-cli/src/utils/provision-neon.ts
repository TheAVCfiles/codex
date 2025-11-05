/* eslint-disable no-console, no-await-in-loop */

export type ProvisionNeonOptions = {
  org: string;
  name: string;
  roleName?: string;
  parentId?: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
};

type NeonOperation = {
  id: string;
};

type NeonOperationStatus = "succeeded" | "failed" | "canceled" | string;

type NeonOperationResponse = {
  operation?: {
    status?: NeonOperationStatus;
  };
};

type NeonOperationsResponse = {
  operations?: ReadonlyArray<NeonOperation>;
};

type NeonBranchResponse = NeonOperationsResponse & {
  branch?: {
    id?: string;
  };
};

type NeonEndpointResponse = NeonOperationsResponse & {
  endpoint?: {
    id?: string;
  };
};

type NeonConnectionUriResponse = {
  connection_uri?: string;
  uri?: string;
  connectionUri?: string;
};

type NeonCreateBranchRequest = {
  branch: {
    name: string;
    parent_id?: string;
  };
};

type NeonCreateEndpointRequest = {
  endpoint: {
    type: "read_write";
    branch_id: string;
  };
};

type NeonCreateDatabaseRequest = {
  database: {
    name: string;
  };
};

const API_BASE = "https://console.neon.tech/api/v2" as const;

export async function provisionNeon({
  org,
  name,
  roleName = "neondb_owner",
  parentId,
  timeoutMs = 90_000,
  pollIntervalMs = 1_500,
}: ProvisionNeonOptions): Promise<{ databaseUrl: string }> {
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    throw new Error("NEON_API_KEY not set in environment");
  }

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  } as const;

  const branchName = `branch_for_${name.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  console.log(
    `Provisioning Neon resources for project ${org} (branch: ${branchName})...`,
  );

  const startedAt = Date.now();
  const ensureTime = () => {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error("Timed out waiting for Neon operations");
    }
  };

  const pollOp = async (opId: string) => {
    for (;;) {
      ensureTime();
      const response = await fetch(
        `${API_BASE}/projects/${org}/operations/${opId}`,
        { headers },
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Operation ${opId} polling failed: ${response.status} ${errorText}`,
        );
      }

      const body = (await response.json()) as NeonOperationResponse;
      const status = body.operation?.status;
      if (status === "succeeded") {
        return;
      }

      if (status === "failed" || status === "canceled") {
        throw new Error(`Operation ${opId} ${status}: ${JSON.stringify(body)}`);
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve, pollIntervalMs);
      });
    }
  };

  const pollAllOps = async (ops?: ReadonlyArray<NeonOperation>) => {
    if (!ops || ops.length === 0) {
      return;
    }

    for (const op of ops) {
      if (!op.id) {
        continue;
      }

      await pollOp(op.id);
    }
  };

  let branchId: string | undefined;
  try {
    const createBranchUrl = `${API_BASE}/projects/${org}/branches`;
    const body: NeonCreateBranchRequest = { branch: { name: branchName } };
    if (parentId) {
      body.branch.parent_id = parentId;
    }

    const response = await fetch(createBranchUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Neon branch creation failed (${response.status}): ${errorText}`,
      );
    }

    const data = (await response.json()) as NeonBranchResponse;
    branchId = data.branch?.id;
    if (!branchId) {
      throw new Error(
        `Branch creation response missing branch.id: ${JSON.stringify(data)}`,
      );
    }

    console.log(`Branch created: ${branchId}`);
    await pollAllOps(data.operations);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in branch creation:", message);
    throw error;
  }

  let endpointId: string | undefined;
  try {
    const createEndpointUrl = `${API_BASE}/projects/${org}/endpoints`;
    const body: NeonCreateEndpointRequest = {
      endpoint: {
        type: "read_write",
        branch_id: branchId!,
      },
    };

    const response = await fetch(createEndpointUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Neon endpoint creation failed (${response.status}): ${errorText}`,
      );
    }

    const data = (await response.json()) as NeonEndpointResponse;
    endpointId = data.endpoint?.id;
    if (!endpointId) {
      throw new Error(
        `Endpoint creation response missing endpoint.id: ${JSON.stringify(data)}`,
      );
    }

    console.log(`Endpoint created: ${endpointId}`);
    await pollAllOps(data.operations);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      "Error creating compute endpoint, rolling back branch:",
      message,
    );
    if (branchId) {
      try {
        await fetch(`${API_BASE}/projects/${org}/branches/${branchId}`, {
          method: "DELETE",
          headers,
        });
      } catch {
        // Best effort rollback.
      }
    }
    throw error;
  }

  try {
    const createDatabaseUrl = `${API_BASE}/projects/${org}/branches/${branchId}/databases`;
    const body: NeonCreateDatabaseRequest = {
      database: {
        name,
      },
    };

    const response = await fetch(createDatabaseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Neon database creation failed (${response.status}): ${errorText}`,
      );
    }

    const data = (await response.json()) as NeonOperationsResponse;
    await pollAllOps(data.operations);
    console.log(`Database '${name}' created.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      "Error in database creation, rolling back endpoint and branch:",
      message,
    );
    if (endpointId) {
      try {
        await fetch(`${API_BASE}/projects/${org}/endpoints/${endpointId}`, {
          method: "DELETE",
          headers,
        });
      } catch {
        // Best effort cleanup.
      }
    }
    if (branchId) {
      try {
        await fetch(`${API_BASE}/projects/${org}/branches/${branchId}`, {
          method: "DELETE",
          headers,
        });
      } catch {
        // Best effort cleanup.
      }
    }

    throw error;
  }

  try {
    const params = new URLSearchParams({
      branch_id: String(branchId),
      database_name: name,
      role_name: roleName,
    });

    const response = await fetch(
      `${API_BASE}/projects/${org}/connection_uri?${params.toString()}`,
      {
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Retrieve connection URI failed (${response.status}): ${errorText}`,
      );
    }

    const data = (await response.json()) as NeonConnectionUriResponse;
    const databaseUrl = data.connection_uri ?? data.uri ?? data.connectionUri;
    if (!databaseUrl) {
      throw new Error(
        `Unexpected connection URI payload: ${JSON.stringify(data)}`,
      );
    }

    const maskedDatabaseUrl = databaseUrl.replace(/:(?:[^@:]+)@/, ":****@");
    console.log(`Provisioning complete. Database URL: ${maskedDatabaseUrl}`);
    return { databaseUrl };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error retrieving connection URI:", message);
    throw error;
  }
}
