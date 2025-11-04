import { beforeAll, afterAll, afterEach, expect, test } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { provisionNeon } from "./provisionNeon";

const API = "https://console.neon.tech/api/v2";

const server = setupServer(
  http.get(`${API}/projects/:org/branches`, () => HttpResponse.json({ branches: [] })),
  http.post(`${API}/projects/:org/branches`, () =>
    HttpResponse.json({ branch: { id: "br-1" }, operations: [{ id: "op-1" }] })
  ),
  http.get(`${API}/projects/:org/operations/:op`, () =>
    HttpResponse.json({ operation: { status: "succeeded" } })
  ),
  http.get(`${API}/projects/:org/endpoints`, () => HttpResponse.json({ endpoints: [] })),
  http.post(`${API}/projects/:org/endpoints`, () =>
    HttpResponse.json({ endpoint: { id: "ep-1" }, operations: [{ id: "op-2" }] })
  ),
  http.get(`${API}/projects/:org/branches/:bid/databases`, () => HttpResponse.json({ databases: [] })),
  http.post(`${API}/projects/:org/branches/:bid/databases`, () =>
    HttpResponse.json({ operations: [{ id: "op-3" }] })
  ),
  http.get(`${API}/projects/:org/connection_uri`, ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json({
      connection_uri: `postgresql://user:pass@host/db?pooler=${url.searchParams.get("pooler")}`,
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("provisions and returns URIs", async () => {
  process.env.NEON_API_KEY = "test";
  const result = await provisionNeon({ org: "proj-1", name: "appdb", applySchema: false });
  expect(result.branchId).toBe("br-1");
  expect(result.endpointId).toBe("ep-1");
  expect(result.uris.pooled).toContain("pooler=true");
  expect(result.uris.direct).toContain("pooler=false");
});
