# Transport: SSE

Use when your MCP client cannot use Streamable HTTP directly.

## Endpoints

- `GET http://127.0.0.1:6009/sse`
- `POST http://127.0.0.1:6009/messages?sessionId=...`

## Notes

- Keep the SSE stream open while sending POST requests.
- If SSE closes, open `/sse` again and use the new `sessionId`.
