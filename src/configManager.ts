import * as vscode from 'vscode';
import { DEFAULT_MCP_PORT, LEGACY_MCP_PORT_KEY, isValidPort } from './utils/portUtils';
import {
    CONFIG_KEY_AUTO_START,
    CONFIG_KEY_MCP_PORT,
    CONFIG_SECTION_SERVER,
    DEFAULT_AUTO_START,
    LEGACY_AUTO_START_KEY
} from './constants';

function getServerConfiguration(scope?: vscode.ConfigurationScope): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(CONFIG_SECTION_SERVER, scope);
}

function hasExplicitValue<T>(inspection: {
    globalValue?: T;
    workspaceValue?: T;
    workspaceFolderValue?: T;
} | undefined): boolean {
    return inspection?.globalValue !== undefined
        || inspection?.workspaceValue !== undefined
        || inspection?.workspaceFolderValue !== undefined;
}

function getPreferredConfigurationTarget(): vscode.ConfigurationTarget {
    return vscode.workspace.workspaceFolders?.length ? vscode.ConfigurationTarget.Workspace : vscode.ConfigurationTarget.Global;
}

/**
 * 获取配置的 MCP 端口号，如果没有显式设置则回退到旧版 globalState 存储值。
 */
export function getStoredPort(context: vscode.ExtensionContext): number {
    const config = getServerConfiguration();
    const configuredPort = config.get<number>(CONFIG_KEY_MCP_PORT, DEFAULT_MCP_PORT);

    if (hasExplicitValue(config.inspect<number>(CONFIG_KEY_MCP_PORT))) {
        return configuredPort;
    }

    const legacyPort = context.globalState.get<number>(LEGACY_MCP_PORT_KEY);
    if (legacyPort !== undefined && isValidPort(legacyPort)) {
        return legacyPort;
    }

    return configuredPort;
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
 * 获取自动启动配置，如果没有显式设置则回退到旧版 globalState 存储值。
 */
export function getAutoStartConfig(context: vscode.ExtensionContext): boolean {
    const config = getServerConfiguration();
    const configuredValue = config.get<boolean>(CONFIG_KEY_AUTO_START, DEFAULT_AUTO_START);

    if (hasExplicitValue(config.inspect<boolean>(CONFIG_KEY_AUTO_START))) {
        return configuredValue;
    }

    const legacyValue = context.globalState.get<boolean>(LEGACY_AUTO_START_KEY);
    if (legacyValue === undefined) {
        return configuredValue;
    }

    return !!legacyValue;
}

/**
 * 存储自动启动配置到 VS Code 设置中。
 */
export async function storeAutoStartConfig(context: vscode.ExtensionContext, autoStart: boolean): Promise<void> {
    await getServerConfiguration().update(CONFIG_KEY_AUTO_START, autoStart, getPreferredConfigurationTarget());
    console.log(`Auto-start config updated to: ${autoStart}`);
}
