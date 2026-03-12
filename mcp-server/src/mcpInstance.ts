import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logger } from './config'; // 导入 logger
import packageJson from '../package.json';

// 创建并导出 McpServer 实例
export const server = new McpServer({
  name: 'vscode-debugger-mcp',
  version: packageJson.version
});

logger.info(`[MCP Instance] McpServer instance created.`);
