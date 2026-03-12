# VS Code Debugger MCP Quickstart

Default endpoint: `http://127.0.0.1:6009/mcp` (Streamable HTTP).

## Client config

```toml
[mcp_servers.vscode-debugger-mcp]
url = "http://127.0.0.1:6009/mcp"
```

## Required flow

1. Send `initialize`.
2. Send `notifications/initialized`.
3. Discover capabilities with `tools/list`, `resources/list`, `resources/templates/list`.
4. Run tools with `tools/call`.
5. Read docs with `resources/read`.

## Notes

- For Streamable HTTP follow-up requests, include `mcp-session-id`.
- Set `Accept: application/json, text/event-stream`.
- Only one transport mode can be active at a time (`/mcp` or SSE).
