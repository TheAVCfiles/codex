import { neonFetch } from "./neonFetch";

const API_BASE = "https://console.neon.tech/api/v2";

export async function cleanupNeon({
  org,
  branchId,
  endpointId,
}: {
  org: string;
  branchId?: string;
  endpointId?: string;
}) {
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    throw new Error("NEON_API_KEY not set");
  }
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
  } satisfies HeadersInit;

  if (endpointId) {
    await neonFetch(`${API_BASE}/projects/${org}/endpoints/${endpointId}`, {
      method: "DELETE",
      headers,
    });
  }

  if (branchId) {
    await neonFetch(`${API_BASE}/projects/${org}/branches/${branchId}`, {
      method: "DELETE",
      headers,
    });
  }
}
