# Tool: start_debugging

Starts a debug session from a launch config.

Behavior:
- Returns immediately with status `running` by default after launch is accepted.
- Does not wait for a breakpoint/stop event unless `stay_connected` is enabled.

Required args:
- `configuration_name`

Optional args:
- `no_debug`
- `stay_connected` (default: `false`)
  - `false`: immediate return (recommended for agents and long-running services).
  - `true`: keep call open and wait for stop/termination/timeout.

Important:
- For watch configs or long-running servers, the session may never stop on its own.
- In those cases, do not wait indefinitely. Validate readiness with app health checks/ping instead.
