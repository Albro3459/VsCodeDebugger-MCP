// src/vscode/debugStateProvider.ts
import * as vscode from 'vscode';
import * as path from 'path'; // 新增导入
import { DebugSessionState, ScopeInfo, StopEventData, VariableInfo, StackFrameInfo } from '../types'; // 取消注释 StackFrameInfo

export class DebugStateProvider {

    constructor() {
        console.log("DebugStateProvider initialized.");
     }

    public async buildScopeInfo(session: vscode.DebugSession, frameId: number): Promise<ScopeInfo[]> {
        try {
            const scopesResponse = await session.customRequest('scopes', { frameId });
            const scopes = Array.isArray(scopesResponse?.scopes) ? scopesResponse.scopes : [];

            const scopeInfos = await Promise.all(scopes.map(async (scope: any): Promise<ScopeInfo> => {
                let variables: VariableInfo[] | null = null;

                if (scope.variablesReference > 0) {
                    try {
                        const variablesResponse = await session.customRequest('variables', { variablesReference: scope.variablesReference });
                        variables = Array.isArray(variablesResponse?.variables)
                            ? variablesResponse.variables.map((v: any): VariableInfo => ({
                                name: v.name,
                                value: v.value,
                                type: v.type || null,
                                variables_reference: v.variablesReference || 0,
                                evaluate_name: v.evaluateName,
                                memory_reference: v.memoryReference,
                            }))
                            : [];
                    } catch (error) {
                        console.error(`[DebugStateProvider] Error fetching variables for scope ${scope.name}:`, error);
                    }
                }

                return {
                    name: scope.name,
                    expensive: !!scope.expensive,
                    variables_reference: scope.variablesReference || 0,
                    variables,
                };
            }));

            return scopeInfos;
        } catch (error) {
            console.error("[DebugStateProvider] Error fetching scopes:", error);
            return [];
        }
    }

    // --- 辅助函数：构建 StopEventData --- (从 debuggerApiWrapper.ts 迁移过来)
    public async buildStopEventData(session: vscode.DebugSession, stopBody: any): Promise<StopEventData> {
        const timestamp = new Date().toISOString();
        const threadId = stopBody.threadId;
        const sessionId = session.id; // 获取 sessionId

        // 1. 获取调用栈
        let callStack: StackFrameInfo[] = []; // 恢复类型 StackFrameInfo[]
        try {
            const stackTraceResponse = await session.customRequest('stackTrace', { threadId: threadId, levels: 20 });
            if (stackTraceResponse && stackTraceResponse.stackFrames) {
                callStack = stackTraceResponse.stackFrames.map((frame: any): StackFrameInfo => ({ // 恢复类型注解
                    frame_id: frame.id,
                    function_name: frame.name || '<unknown>',
                    file_path: frame.source?.path || frame.source?.name || 'unknown',
                    line_number: frame.line,
                    column_number: frame.column,
                }));
            }
        } catch (e) { console.error("[DebugStateProvider] Error fetching stack trace:", e); } // 修改日志来源

        // 2. 获取顶层帧变量
        let topFrameVariables: StopEventData['top_frame_variables'] = null;
        let topFrameScopes: ScopeInfo[] | null = null;
        if (callStack.length > 0) {
            const topFrameId = callStack[0].frame_id;
            try {
                topFrameScopes = await this.buildScopeInfo(session, topFrameId);
                const scopesResponse = { scopes: topFrameScopes.map(scope => ({ name: scope.name, expensive: scope.expensive, variablesReference: scope.variables_reference })) };
                // 优先查找 'Locals'，其次是第一个非 expensive 的作用域
                const localsScope = scopesResponse?.scopes?.find((s: any) => s.name.toLowerCase() === 'locals')
                                 || scopesResponse?.scopes?.find((s: any) => !s.expensive);

                if (localsScope && localsScope.variablesReference > 0) {
                    const matchingScope = topFrameScopes.find(scope => scope.variables_reference === localsScope.variablesReference);
                    if (matchingScope?.variables) {
                        topFrameVariables = {
                            scope_name: localsScope.name,
                            variables: matchingScope.variables
                        };
                    }
                }
            } catch (e) { console.error("[DebugStateProvider] Error fetching top frame variables:", e); } // 修改日志来源
        }

        // 3. 构建 StopEventData 对象
        const sourceInfo = callStack[0] ? {
            path: callStack[0].file_path,
            name: path.basename(callStack[0].file_path) || callStack[0].file_path // 使用 path.basename 获取文件名
        } : null;

        return {
            session_id: sessionId, // <--- 添加 sessionId
            timestamp,
            reason: stopBody.reason || 'unknown',
            thread_id: threadId,
            description: stopBody.description || null,
            text: stopBody.text || null,
            all_threads_stopped: stopBody.allThreadsStopped ?? null,
            source: sourceInfo,
            line: callStack[0]?.line_number ?? null,
            column: callStack[0]?.column_number ?? null,
            call_stack: callStack,
            top_frame_variables: topFrameVariables,
            top_frame_scopes: topFrameScopes,
            hit_breakpoint_ids: stopBody.hitBreakpointIds || null,
        };
    }
}
