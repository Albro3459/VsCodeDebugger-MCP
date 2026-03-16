# Tool: step_execution

Steps execution for a paused thread.

Required args:
- `thread_id`
- `step_type`: `over` | `into` | `out`

Optional args:
- `session_id`

Tip:
- If you need to discover the current paused `thread_id`, call `get_debug_state` first.
