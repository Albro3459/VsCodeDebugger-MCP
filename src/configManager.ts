import * as vscode from 'vscode';
import { DEFAULT_MCP_PORT, isValidPort } from './utils/portUtils';
import {
    CONFIG_KEY_AUTO_START,
    CONFIG_KEY_MCP_PORT,
    CONFIG_SECTION_SERVER,
    DEFAULT_AUTO_START
} from './constants';

function getServerConfiguration(scope?: vscode.ConfigurationScope): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(CONFIG_SECTION_SERVER, scope);
}

function getPreferredConfigurationTarget(): vscode.ConfigurationTarget {
    return vscode.workspace.workspaceFolders?.length ? vscode.ConfigurationTarget.Workspace : vscode.ConfigurationTarget.Global;
}

/**
 * 获取配置的 MCP 端口号。
 */
export function getStoredPort(_context: vscode.ExtensionContext): number {
    const config = getServerConfiguration();
    return config.get<number>(CONFIG_KEY_MCP_PORT, DEFAULT_MCP_PORT);
}

/**
 * 存储有效的 MCP 端口号到 VS Code 设置中。
 */
export async function storePort(context: vscode.ExtensionContext, port: number): Promise<void> {
    if (isValidPort(port)) {
        await getServerConfiguration().update(CONFIG_KEY_MCP_PORT, port, getPreferredConfigurationTarget());
    } else {
        console.error(`Attempted to store invalid port number: ${port}`);
    }
}

/**
 * 获取自动启动配置。
 */
export function getAutoStartConfig(_context: vscode.ExtensionContext): boolean {
    const config = getServerConfiguration();
    return config.get<boolean>(CONFIG_KEY_AUTO_START, DEFAULT_AUTO_START);
}

/**
 * 存储自动启动配置到 VS Code 设置中。
 */
export async function storeAutoStartConfig(context: vscode.ExtensionContext, autoStart: boolean): Promise<void> {
    await getServerConfiguration().update(CONFIG_KEY_AUTO_START, autoStart, getPreferredConfigurationTarget());
    console.log(`Auto-start config updated to: ${autoStart}`);
}
