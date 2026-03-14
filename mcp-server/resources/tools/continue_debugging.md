# Tool: continue_debugging

Resume a paused thread and wait for the next stop/finish event.

Required args:
- `thread_id`

Optional args:
- `session_id`

Behavior notes:
- If `thread_id` is invalid/stale for the target session, the tool returns `error` immediately.
- It does not wait for timeout when the requested thread is not present.
