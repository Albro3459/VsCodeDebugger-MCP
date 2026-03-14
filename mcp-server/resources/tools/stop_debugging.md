# Tool: stop_debugging

Stops a debug session.

Optional args:
- `session_id`

Output:
- `status`: `success` or `error`
- `message`: Human-readable stop summary
- `requested_session_ids`: Session IDs targeted by this stop request
- `stopped_session_ids`: Session IDs confirmed stopped before timeout
- `still_running_session_ids`: Session IDs still active after stop attempt
- `terminated_terminal_names`: Integrated terminals closed as part of stop cleanup

Behavior notes:
- If `session_id` is omitted, all currently active debug sessions are targeted.
- Child sessions are included when stopping a specific parent/root session.
- Result can be partial (some sessions stopped, some still running), and this is reported explicitly via the output fields.
