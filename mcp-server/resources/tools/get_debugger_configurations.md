# Tool: get_debugger_configurations

Reads `.vscode/launch.json` and returns launch entries.

Includes:
- regular `configurations`
- `compounds` (marked with `kind: "compound"`, plus `type: "compound"` and `request: "launch"` for compatibility)

Args: none

Use this before `start_debugging`.
