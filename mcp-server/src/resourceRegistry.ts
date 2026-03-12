import * as fs from 'fs/promises';
import * as path from 'path';
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { server } from './mcpInstance';
import { logger } from './config';
import * as Constants from './constants';

const RESOURCE_ROOT = 'file://vscode-debugger-mcp';
const DOCS_ROOT = `${RESOURCE_ROOT}/docs`;
const TOOLS_ROOT = `${RESOURCE_ROOT}/tools`;
const TRANSPORTS_ROOT = `${RESOURCE_ROOT}/transports`;

const MARKDOWN_ROOT = path.resolve(process.cwd(), 'resources');

const TOOL_NAMES = [
    Constants.TOOL_GET_DEBUGGER_CONFIGURATIONS,
    Constants.TOOL_SET_BREAKPOINT,
    Constants.TOOL_GET_BREAKPOINTS,
    Constants.TOOL_REMOVE_BREAKPOINT,
    Constants.TOOL_START_DEBUGGING,
    'continue_debugging',
    Constants.TOOL_NAME_STEP_EXECUTION,
    Constants.TOOL_STOP_DEBUGGING,
] as const;

const TRANSPORT_MODES = ['streamable-http', 'sse'] as const;

async function readMarkdownFile(relativePath: string): Promise<string> {
    const absolutePath = path.join(MARKDOWN_ROOT, relativePath);

    try {
        return await fs.readFile(absolutePath, 'utf-8');
    } catch (error) {
        logger.error(`[Resource Registry] Failed to read markdown file: ${absolutePath}`, error);
        return `# Resource Error\n\nUnable to load \`${relativePath}\`.`;
    }
}

function normalizeVariable(value: string | string[] | undefined): string | undefined {
    if (!value) {
        return undefined;
    }

    const firstValue = Array.isArray(value) ? value[0] : value;
    return decodeURIComponent(firstValue).trim();
}

export function registerResources() {
    logger.info('[Resource Registry] Starting resource registration...');

    server.registerResource(
        'quickstart',
        `${DOCS_ROOT}/quickstart.md`,
        {
            title: 'Quickstart',
            description: 'Concise setup and usage for vscode-debugger-mcp.',
            mimeType: 'text/markdown',
        },
        async () => ({
            contents: [
                {
                    uri: `${DOCS_ROOT}/quickstart.md`,
                    mimeType: 'text/markdown',
                    text: await readMarkdownFile('quickstart.md'),
                },
            ],
        })
    );

    server.registerResource(
        'raw-http-workflow',
        `${DOCS_ROOT}/raw-http-workflow.md`,
        {
            title: 'Raw HTTP Workflow',
            description: 'SSE fallback workflow when native MCP integration is unavailable.',
            mimeType: 'text/markdown',
        },
        async () => ({
            contents: [
                {
                    uri: `${DOCS_ROOT}/raw-http-workflow.md`,
                    mimeType: 'text/markdown',
                    text: await readMarkdownFile('raw-http-workflow.md'),
                },
            ],
        })
    );

    server.registerResource(
        'tool-guides',
        new ResourceTemplate(`${TOOLS_ROOT}/{tool_name}.md`, {
            list: async () => ({
                resources: TOOL_NAMES.map((toolName) => ({
                    uri: `${TOOLS_ROOT}/${toolName}.md`,
                    name: `tool-${toolName}`,
                    title: `Tool: ${toolName}`,
                    description: `Guide for ${toolName}`,
                    mimeType: 'text/markdown',
                })),
            }),
            complete: {
                tool_name: (value) => TOOL_NAMES.filter((toolName) => toolName.startsWith(value)),
            },
        }),
        {
            title: 'Tool Guides',
            description: 'Per-tool usage guides for debugger operations.',
            mimeType: 'text/markdown',
        },
        async (uri, variables) => {
            const toolName = normalizeVariable(variables.tool_name);
            const validToolName = toolName && TOOL_NAMES.includes(toolName as typeof TOOL_NAMES[number])
                ? toolName
                : undefined;

            const text = validToolName
                ? await readMarkdownFile(`tools/${validToolName}.md`)
                : '# Tool Not Found\n\nNo guide exists for this tool name.';

            return {
                contents: [
                    {
                        uri: uri.toString(),
                        mimeType: 'text/markdown',
                        text,
                    },
                ],
            };
        }
    );

    server.registerResource(
        'transport-guides',
        new ResourceTemplate(`${TRANSPORTS_ROOT}/{mode}.md`, {
            list: async () => ({
                resources: TRANSPORT_MODES.map((mode) => ({
                    uri: `${TRANSPORTS_ROOT}/${mode}.md`,
                    name: `transport-${mode}`,
                    title: `Transport: ${mode}`,
                    description: `Guide for ${mode} transport`,
                    mimeType: 'text/markdown',
                })),
            }),
            complete: {
                mode: (value) => TRANSPORT_MODES.filter((mode) => mode.startsWith(value)),
            },
        }),
        {
            title: 'Transport Guides',
            description: 'Concise guidance for streamable HTTP and SSE modes.',
            mimeType: 'text/markdown',
        },
        async (uri, variables) => {
            const mode = normalizeVariable(variables.mode);
            const validMode = mode && TRANSPORT_MODES.includes(mode as typeof TRANSPORT_MODES[number])
                ? mode
                : undefined;

            const text = validMode
                ? await readMarkdownFile(`transports/${validMode}.md`)
                : '# Transport Not Found\n\nUse `streamable-http` or `sse`.';

            return {
                contents: [
                    {
                        uri: uri.toString(),
                        mimeType: 'text/markdown',
                        text,
                    },
                ],
            };
        }
    );

    logger.info('[Resource Registry] Resource registration completed.');
}
