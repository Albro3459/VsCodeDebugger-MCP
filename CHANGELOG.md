# Change Log

## 1.2.2

* Updated `start_debugging` to return immediately by default after launch (non-blocking), so long-running/watch/server configs do not leave agent calls stuck.
* Added optional `stay_connected` mode for `start_debugging` when callers explicitly want to wait for stop/termination behavior.
* Added compound debug configuration support:
    * `get_debugger_configurations` now includes `launch.compounds`.
    * `start_debugging` can now start compound entries by name (for example, `Client & Server`).

## 1.2.1

* Updated README usage documentation for Claude, Codex, and RooCode MCP setup.
* Updated extension copy-config menu to support format selection:
    * Claude JSON
    * Codex TOML
    * VSCode JSON

## 1.2.0

* Updated MCP server dependencies/versions and aligned behavior with the current MCP spec.
    * Added `/mcp` endpoint support.
    * Added Streamable HTTP transport support.
    * Added MCP resources support.
* Fixed JSON-with-comments parsing for `.vscode/launch.config`.

## 1.0.5

* Fixed the bug where the connection was accidentally disconnected when debugging the VSCode plugin project

* Fixed the bug where the single-step debugging tool does not return debug information

## 1.0.1-1.0.4

* Simple update of documents, update icons, etc.
## 1.0.0
* Implemented `stop_debugging` tool.
* Implemented `step_execution` tool (Step Over, Step Into, Step Out).
* Implemented `continue_debugging` tool.
* Implemented `start_debugging` tool.
* Implemented `remove_breakpoint` tool.
* Implemented `get_breakpoints` tool.
* Implemented `set_breakpoint` tool.
* Implemented `get_debugger_configurations` tool.
* MCP server communication method is HTTP + SSE.
* Added port conflict handling and manual port specification feature.
* Added configuration option for automatic MCP server startup.
* Provided one-click copy function for client configuration.
* Simulated client receives raw SSE return information.

## 0.1.0
* Initial version.
* Implemented basic VS Code extension structure.
* Displayed MCP server status in the status bar (simulated).
* Implemented simple MCP server start/stop control (via status bar).
