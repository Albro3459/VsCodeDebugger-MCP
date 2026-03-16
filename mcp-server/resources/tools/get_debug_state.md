# Tool: get_debug_state

Returns live debug session state from VS Code.

Use this after `start_debugging` when you launched with `stay_connected: false` and need to discover whether a session is paused.

Optional args:
- `session_id`

Response includes:
- active `sessions`
- per-session `is_paused` and `paused_thread_id`
- per-thread `thread_id` and `is_stopped`
- `stop_event_data` for paused threads, including:
  - source location
  - call stack
  - `top_frame_scopes` such as `Local`, `Closure`, and other adapter-provided scopes
  - variables for each returned top-frame scope when available

Recommended flow:
1. Call `start_debugging`
2. Capture `session_ids`
3. Call `get_debug_state` with a specific `session_id` or with no args to inspect all active sessions
4. Use the returned `thread_id` with `continue_debugging` or `step_execution`
