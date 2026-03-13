# Raw HTTP Workflow (SSE Fallback)

Use this only when native MCP client integration is unavailable.

Do not use `localhost`; use `127.0.0.1`.
Start the MCP server before starting your agent.

## 1) Open SSE

```bash
curl -sN http://127.0.0.1:6009/sse
```

Keep it open and capture `sessionId` from:

```text
event: endpoint
data: /messages?sessionId=...
```

## 2) Initialize

POST JSON-RPC to `http://127.0.0.1:6009/messages?sessionId=...`:
- request: `initialize`
- notification: `notifications/initialized`

## 3) Use Tools

- `tools/list` and `tools/call`
- `resources/list`, `resources/templates/list`, `resources/read`
- `start_debugging` returns immediately by default (`status: "running"`).
- Set `stay_connected: true` only when you intentionally want to wait for stop/termination events.
- For watch or long-running server configs, verify with health/ping checks instead of waiting for debug stop.

If SSE closes, open `/sse` again and use the new `sessionId`.

Transport mode is locked by the first request and requires server restart to switch (architectural limitation).
