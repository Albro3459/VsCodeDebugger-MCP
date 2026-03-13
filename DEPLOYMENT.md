# Deploying `mcp-vscode-debugger` to VS Code Marketplace

## Current Extension Identity

- `publisher`: `Albro3459`
- `name` (extension ID): `mcp-vscode-debugger`
- Marketplace item ID: `Albro3459.mcp-vscode-debugger`

## Prerequisites

- Microsoft account
- Azure DevOps organization (free account is sufficient)
- VS Code Marketplace publisher created in [Publisher Management](https://marketplace.visualstudio.com/manage)
- Personal Access Token (PAT) from Azure DevOps
  - Use `Custom defined` scopes
  - Enable `Marketplace -> Publish + Manage`
- Node.js 18+
- `@vscode/vsce` installed
  ```sh
  npm install -D @vscode/vsce
  ```

## One-Time Local Setup

From repo root:

```bash
npm install
npx vsce login Albro3459
```

When prompted, paste the PAT.

## Publish and Update Version

Bump versions and republish:

```bash
npm run version:update
npm run publish # triggers 'vscode:prepublish' which compiles both directories
```

## Post-Publish Verification

- Open your listing at:
  - `https://marketplace.visualstudio.com/items?itemName=Albro3459.mcp-vscode-debugger`
- Confirm:
  - latest version is visible
  - README renders correctly
  - install works in a clean VS Code profile
