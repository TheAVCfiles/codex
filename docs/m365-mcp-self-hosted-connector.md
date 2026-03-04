# Self-Hosted Microsoft 365 Connector via MCP

This guide explains how to build your own Microsoft 365 connector for Claude using MCP + Microsoft Graph, so you are not blocked on managed connector plans.

## The 3-layer model (what actually matters)

### Layer 1: Identity (Microsoft Entra ID)

Entra ID is the real permission gate. You register an app and define what it can request.

Typical delegated permissions:

- `User.Read`
- `Mail.Read`
- `Calendars.Read`
- `Files.Read`
- `Sites.Read.All`

Admin consent is typically granted once per tenant policy.

### Layer 2: Data plane (Microsoft Graph API)

Graph is the unified API surface for Microsoft 365 workloads.

Common endpoints:

- `GET /me/messages`
- `GET /me/events`
- `GET /me/drive/root/children`
- `GET /sites/{site-id}/drive/root/children`

### Layer 3: Tooling (MCP server)

The MCP server is a thin wrapper that exposes Graph operations as model-callable tools.

Example tool names:

- `read_email`
- `get_calendar_events`
- `list_onedrive_files`
- `list_sharepoint_files`
- `list_planner_tasks`

```text
Claude
  ↓
MCP server (local tool wrapper)
  ↓
Microsoft Graph API
  ↓
Microsoft 365 tenant data
```

## 1) Register your Entra application

1. Open **Microsoft Entra admin center** → **App registrations** → **New registration**.
2. Name it (for example `Claude-MCP-Graph-Connector`).
3. Choose supported account type per company policy.
4. Add redirect URI(s) for your local auth flow (for example `http://localhost`).
5. Save:
   - **Application (client) ID**
   - **Directory (tenant) ID**

## 2) Configure Graph permissions

1. Open **API permissions** → **Add a permission** → **Microsoft Graph**.
2. Add **Delegated permissions** needed for your use case.
3. Start small, then expand only when justified.
4. Have an admin grant consent once if your org requires admin approval.

## 3) Create credentials and local environment variables

1. Open **Certificates & secrets**.
2. Create a client secret (or use certificate auth for stronger posture).
3. Store locally (never hardcode):

```bash
export M365_TENANT_ID="<tenant-id>"
export M365_CLIENT_ID="<client-id>"
export M365_CLIENT_SECRET="<client-secret>"
```

## 4) Build the MCP wrapper around Graph

You can adopt an open-source Graph MCP server or implement your own in a few hundred lines with:

- `msal` for token flows,
- `requests` or Graph SDK for API calls,
- MCP tool handlers that map tool invocations to Graph endpoints.

### Minimal Python skeleton (application token example)

Use this pattern for app-only operations (note: app-only tokens generally call app-scoped endpoints, not `/me`).

```python
from msal import ConfidentialClientApplication
import requests

TENANT_ID = "..."
CLIENT_ID = "..."
CLIENT_SECRET = "..."

client = ConfidentialClientApplication(
    CLIENT_ID,
    authority=f"https://login.microsoftonline.com/{TENANT_ID}",
    client_credential=CLIENT_SECRET,
)

token = client.acquire_token_for_client(
    scopes=["https://graph.microsoft.com/.default"]
)

headers = {"Authorization": f"Bearer {token['access_token']}"}


def list_users():
    r = requests.get("https://graph.microsoft.com/v1.0/users", headers=headers, timeout=30)
    r.raise_for_status()
    return r.json()
```

### Delegated-access note

If you need user-context endpoints like `/me/messages` and `/me/events`, implement a delegated OAuth flow (authorization code/device code) and call Graph with the signed-in user's delegated token.

## 5) Wire tools into MCP

Expose Graph-backed functions through MCP tool definitions. Keep each tool narrow and explicit.

Recommended first-pass tool set:

- `outlook_list_messages`
- `calendar_list_events`
- `onedrive_list_files`
- `sharepoint_search`
- `planner_list_tasks`

## 6) Add server entry to Claude MCP config

Register your local server command in Claude MCP config and pass only required environment variables. Keep permission scopes minimal.

## 7) Security realities (do not skip)

- Delegated permissions act as the signed-in user.
- `Sites.Read.All` can expose broad SharePoint content.
- OAuth tokens and refresh tokens require strong local handling.
- Your local MCP server inherits every granted permission.

Operational checklist:

- Enforce least privilege and scope reviews.
- Separate app registrations for dev/staging/prod.
- Log MCP tool calls and Graph request IDs for auditing.
- Define retention windows for any cached payloads.
- Rotate secrets and revoke on suspected compromise.

## Why this approach works

Managed connectors are typically hosted convenience layers over Microsoft Graph. MCP lets you own that layer directly while keeping standards-based interoperability across MCP-capable models and tools.
