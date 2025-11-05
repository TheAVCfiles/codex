import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { provisionNeon } from "../src/utils/provision-neon";

describe("provisionNeon", () => {
  const originalFetch = globalThis.fetch;
  const originalNeonApiKey = process.env.NEON_API_KEY;
  const noop = () => {};

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(noop);
    vi.spyOn(console, "error").mockImplementation(noop);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
    if (originalNeonApiKey === undefined) {
      delete process.env.NEON_API_KEY;
    } else {
      process.env.NEON_API_KEY = originalNeonApiKey;
    }
  });

  it("throws when NEON_API_KEY is not set", async () => {
    delete process.env.NEON_API_KEY;

    await expect(
      provisionNeon({
        org: "project-id",
        name: "my_database",
      }),
    ).rejects.toThrowError("NEON_API_KEY not set in environment");
  });

  it("creates a branch, endpoint, database, and returns the connection URI", async () => {
    process.env.NEON_API_KEY = "test-key";

    const responses = [
      new Response(
        JSON.stringify({
          branch: { id: "branch-123" },
          operations: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
      new Response(
        JSON.stringify({
          endpoint: { id: "endpoint-456" },
          operations: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
      new Response(
        JSON.stringify({ operations: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
      new Response(
        JSON.stringify({ connection_uri: "postgres://user:pass@localhost/db" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ];

    const fetchMock = vi.fn(async (..._args: Parameters<typeof fetch>) => {
      const next = responses.shift();
      if (!next) {
        throw new Error("Unexpected fetch call");
      }
      return next;
    });

    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;

    const result = await provisionNeon({
      org: "project-id",
      name: "Test DB!",
    });

    expect(result.databaseUrl).toBe("postgres://user:pass@localhost/db");

    expect(fetchMock).toHaveBeenCalledTimes(4);

    const branchCall = fetchMock.mock.calls[0];
    expect(branchCall?.[0]).toBe("https://console.neon.tech/api/v2/projects/project-id/branches");
    const branchBody = JSON.parse((branchCall?.[1]?.body as string) ?? "{}");
    expect(branchBody).toEqual({ branch: { name: "branch_for_Test_DB_" } });

    const connectionCall = fetchMock.mock.calls[3];
    const connectionUrl = connectionCall?.[0] as string;
    expect(connectionUrl).toContain("branch_id=branch-123");
    expect(connectionUrl).toContain("database_name=Test+DB%21");
    expect(connectionUrl).toContain("role_name=neondb_owner");

    const expectedHeaders = {
      Authorization: "Bearer test-key",
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    for (const call of fetchMock.mock.calls.slice(0, 3)) {
      expect(call?.[1]?.headers).toEqual(expectedHeaders);
    }
  });
});
