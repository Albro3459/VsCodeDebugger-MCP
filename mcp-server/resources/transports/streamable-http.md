# Transport: Streamable HTTP

Endpoint: `http://127.0.0.1:6009/mcp`

Use for normal MCP clients.

## Notes

- Initialize once, then send `notifications/initialized`.
- Reuse `mcp-session-id` on subsequent requests.
- Send `Accept: application/json, text/event-stream`.
- New `initialize` without `mcp-session-id` starts a new session.
- If you see `Server not initialized`, finish `initialize` + `notifications/initialized` before other calls.
- If server returns `-32001 Session not found` (often after restart), drop the old session ID and re-initialize.
