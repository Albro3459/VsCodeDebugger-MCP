# VS Code Debugger MCP Quickstart

Default endpoint: `http://127.0.0.1:6009/mcp` (Streamable HTTP).

## Client config

```toml
[mcp_servers.mcp-vscode-debugger]
url = "http://127.0.0.1:6009/mcp"
```

Do not use `localhost`; use `127.0.0.1`.

## Required flow

0. Start VS Code and ensure the MCP server is already running before starting your agent.
1. Send `initialize`.
2. Send `notifications/initialized`.
3. Discover capabilities with `tools/list`, `resources/list`, `resources/templates/list`.
4. Run tools with `tools/call`.
5. Read docs with `resources/read`.

## Notes

- `start_debugging` returns immediately with `status: "running"` by default.
- Use `stay_connected: true` only when you explicitly need to wait for a debug stop/termination event.
- For watch configs or long-running servers, prefer checking service readiness (health/ping) instead of staying connected.
- For Streamable HTTP follow-up requests, include `mcp-session-id`.
- Set `Accept: application/json, text/event-stream`.
- Only one transport mode can be active at a time (`/mcp` or SSE).
- Transport mode is locked by the first request (`SSE` for RooCode, `Streamable HTTP` for external agents such as Codex Desktop) and requires server restart to switch. This is an architectural issue.
- If you see `Server not initialized`, complete `initialize` + `notifications/initialized` before other requests.
- If you get `-32001 Session not found`, clear cached `mcp-session-id`, then run `initialize` + `notifications/initialized` again.
