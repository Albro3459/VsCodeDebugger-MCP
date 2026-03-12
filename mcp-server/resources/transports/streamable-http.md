# Transport: Streamable HTTP

Endpoint: `http://127.0.0.1:6009/mcp`

Use for normal MCP clients.

## Notes

- Initialize once, then send `notifications/initialized`.
- Reuse `mcp-session-id` on subsequent requests.
- Send `Accept: application/json, text/event-stream`.
- New `initialize` without `mcp-session-id` starts a new session.
