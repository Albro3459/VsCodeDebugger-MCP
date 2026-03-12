# Raw HTTP Workflow (SSE Fallback)

Use this only when native MCP client integration is unavailable.

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

If SSE closes, open `/sse` again and use the new `sessionId`.
