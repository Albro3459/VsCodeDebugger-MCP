# VSCode Debugger MCP

[![中文](https://img.shields.io/badge/Language-中文-blue)](README.cn.md)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/Albro3459.vscode-debugger-mcp?style=flat-square&amp;label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=Albro3459.vscode-debugger-mcp)

![demo_en](assets/demo_en.gif)

This is a VS Code extension designed to enable AI agents to interact with VS Code's debugging capabilities through a Model Context Protocol (MCP) server, achieving an automated and intelligent debugging experience. 

## 📌 Fork Information

This project is a fork of [NyxJae/VsCodeDebugger-MCP](https://github.com/NyxJae/VsCodeDebugger-MCP).

The maintained fork is available at [Albro3459/VsCodeDebugger-MCP](https://github.com/Albro3459/VsCodeDebugger-MCP).

Maintainer note: GitHub [@Albro3459](https://github.com/Albro3459) updated this project by forking the original repo, updating MCP support and versions, and applying additional minor fixes.

## ✨ Features

*   **🤖 AI-Driven Debugging**:
    *   Allows AI agents to perform standard VS Code debugging operations through the MCP tool interface.
    *   **Debug Configurations**: Reads the project's `launch.json` file to get available debug configurations.
    *   **Breakpoint Management**: Set, remove, and query breakpoints, supporting regular breakpoints, conditional breakpoints, hit count breakpoints, and log points.
    *   **Execution Control**: Start debugging sessions (`launch` or `attach` mode), continue execution (`Continue`), step through code (`Step Over`, `Step Into`, `Step Out`), and stop debugging sessions.
    *   **(Future)** Inspect variable values, traverse the call stack, evaluate expressions in specific contexts, etc.
*   **⚙️ MCP Server Management**:
    *   **Status Bar Integration**: Displays the real-time running status of the MCP server in the VS Code status bar (e.g., "Debug-MCP: Running" or "Debug-MCP: Stopped").
    *   **Convenient Control**: Click the status bar item to quickly start or stop the MCP server.
    *   **Port Configuration**: Automatically detects port occupancy. If the default port is occupied, allows the user to manually specify a new port number, which is saved to VS Code settings.
    *   **Auto Start**: Configurable option to automatically start the MCP server when VS Code launches, saved to VS Code settings.
    *   **Client Configuration**: Provides a one-click copy function to easily copy the configuration information (such as URL, port) required to connect to this MCP server to AI clients (e.g., ClaudeDesktop, RooCode, Cline, Cursor, etc.).
*   **📡 Communication Protocol**:
    *   The VS Code extension communicates with the local MCP server via subprocess and IPC.
    *   The MCP server supports **Streamable HTTP** (`/mcp`) and **SSE fallback** (`/sse` + `/messages`).

## 🚀 Requirements

*   **Visual Studio Code**: ^1.109.0 or higher.
*   **Node.js**: ^18.0.0 or higher (for running the MCP server).
*   **How to Install Node.js**: Please visit the [Node.js official website](https://nodejs.org/) to download and install the version suitable for your operating system.
*   **AI Client**: An AI agent client that supports the Model Context Protocol.

## 📖 Usage Guide

Taking RooCode as an example:
1. Search and install the extension in the VS Code Extensions Marketplace.
Confirm that the MCP server is running. ![MCPRunning_cn](assets/MCPRunning_cn.png)
Copy the configuration to the RooCode MCP configuration file. ![copy_config_en](assets/copy_config_en.gif)
Before each use, check if RooCode is connected to the MCP server. ![connect_en](assets/connect_en.gif)

### MCP Client `config.toml` (Codex Desktop / external agents)

The MCP server must already be running before you start your agent.

```toml
[mcp_servers.vscode-debugger-mcp]
url = "http://127.0.0.1:6009/mcp"
```

Important: do **not** use `localhost`; use `127.0.0.1`.

## 🔧 Extension Settings

This extension contributes the following VS Code settings:

*   `vscode-debugger-mcp.server.port` (number): The port number the MCP server listens on. Defaults to `6009`.
*   `vscode-debugger-mcp.server.autoStart` (boolean): Whether to automatically start the MCP server when VS Code launches. Defaults to `true`.

When you use the status bar menu to change the port or auto-start behavior, the extension updates workspace settings when a workspace is open, otherwise it updates your global user settings.

Example:

```json
{
  "vscode-debugger-mcp.server.port": 6009,
  "vscode-debugger-mcp.server.autoStart": true
}
```

## 🐞 Known Issues / Potential Issues

*   Only tested with the Codex app and the VSCode RooCode client.
*   It is recommended to use project configuration instead of global configuration. First, it is easy to manage. Different projects can use different ports. Second, when debugging VsCode plug-in projects, the debug host window will be opened, resulting in multiple AI clients (RooCode) opening, resulting in session ID conflicts.![note_1](assets/note_1_en.png)
*   Transport mode is selected by the first request and then locked until restart:
    *   RooCode first request selects `SSE`.
    *   External agents (for example Codex Desktop) first request selects `Streamable HTTP`.
    *   Switching mode requires restarting the MCP server.
    *   This is an architectural issue.

### Logs and Error Information

If you find errors, you can view the logs in the VS Code Output panel for easier feedback and issue reporting.
*   MCP Server Logs: ![mcp_log](assets/mcp_log.png)
*   Extension and Simulated Client Logs: ![extension_log](assets/extension_log.png)

## 🔮 Future Development Plan

*   **Variable and Scope Inspection**:
    *   Implement `get_scopes` tool: Get scopes (e.g., local variables, global variables) for a specified stack frame.
    *   Implement `get_variables` tool: Get a list of variables and their values for a specified scope or expandable variable.
*   **Expression Evaluation**:
    *   Implement `evaluate_expression` tool: Evaluate an expression in the context of a specified stack frame.
*   **Internationalization**
*   *   English version of README images and usage guide.
