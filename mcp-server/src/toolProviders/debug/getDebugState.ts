import { z } from 'zod';
import { sendRequestToPlugin, PluginResponse } from '../../pluginCommunicator';
import * as Constants from '../../constants';
import type { GetDebugStateResult } from '../../types';
import { logger } from '../../config';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import type { ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types.js';

type ToolRequestExtra = RequestHandlerExtra<ServerRequest, ServerNotification>;

const VariableInfoSchema = z.object({
    name: z.string(),
    value: z.string(),
    type: z.string().nullable(),
    variables_reference: z.number().int(),
    evaluate_name: z.string().optional(),
    memory_reference: z.string().optional(),
});

const ScopeInfoSchema = z.object({
    name: z.string(),
    expensive: z.boolean(),
    variables_reference: z.number().int(),
    variables: z.array(VariableInfoSchema).nullable().optional(),
});

const StackFrameInfoSchema = z.object({
    frame_id: z.number().int(),
    function_name: z.string(),
    file_path: z.string(),
    line_number: z.number().int(),
    column_number: z.number().int(),
});

const StopEventDataSchema = z.object({
    session_id: z.string().optional(),
    timestamp: z.string(),
    reason: z.string(),
    thread_id: z.number().int(),
    description: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
    all_threads_stopped: z.boolean().nullable().optional(),
    source: z.object({
        path: z.string(),
        name: z.string(),
    }).nullable().optional(),
    line: z.number().int().nullable().optional(),
    column: z.number().int().nullable().optional(),
    call_stack: z.array(StackFrameInfoSchema),
    top_frame_variables: z.object({
        scope_name: z.string(),
        variables: z.array(VariableInfoSchema),
    }).nullable().optional(),
    top_frame_scopes: z.array(ScopeInfoSchema).nullable().optional(),
    hit_breakpoint_ids: z.array(z.number().int()).nullable().optional(),
});

const DebugThreadStateSchema = z.object({
    thread_id: z.number().int(),
    name: z.string(),
    is_stopped: z.boolean(),
    stop_event_data: StopEventDataSchema.nullable().optional(),
});

const DebugSessionStateSchema = z.object({
    session_id: z.string(),
    name: z.string(),
    type: z.string(),
    request: z.string(),
    parent_session_id: z.string().nullable().optional(),
    is_active: z.boolean(),
    is_paused: z.boolean(),
    paused_thread_id: z.number().int().nullable().optional(),
    threads: z.array(DebugThreadStateSchema),
});

export const getDebugStateSchema = z.object({
    session_id: z.string().optional().describe("Optional session ID to inspect. If omitted, all active debug sessions are returned."),
});

const GetDebugStateOutputSchema = z.object({
    status: z.enum([Constants.IPC_STATUS_SUCCESS, Constants.IPC_STATUS_ERROR]),
    sessions: z.array(DebugSessionStateSchema).optional(),
    message: z.string().optional(),
});

export const getDebugStateTool = {
    name: Constants.TOOL_GET_DEBUG_STATE,
    description: "Returns live debug session state, including paused threads, stop location, call stack, and top-frame scopes/variables when available.",
    inputSchema: getDebugStateSchema,
    outputSchema: GetDebugStateOutputSchema,

    async execute(
        args: z.infer<typeof getDebugStateSchema>,
        extra?: ToolRequestExtra
    ): Promise<z.infer<typeof GetDebugStateOutputSchema>> {
        const toolName = this.name;
        logger.info(`[MCP Tool - ${toolName}] Executing with args:`, args);

        try {
            const response: PluginResponse<GetDebugStateResult> = await sendRequestToPlugin({
                command: Constants.IPC_COMMAND_GET_DEBUG_STATE,
                payload: { sessionId: args.session_id },
            });

            const transportSessionId = extra?.sessionId;
            if (!transportSessionId) {
                logger.warn(`[MCP Server - ${toolName}] No sessionId found in extra for requestId ${response.requestId}.`);
            }

            if (response.status === Constants.IPC_STATUS_SUCCESS && response.payload) {
                return GetDebugStateOutputSchema.parse(response.payload);
            }

            return {
                status: Constants.IPC_STATUS_ERROR,
                message: response.error?.message || 'Plugin failed to return debug state.',
            };
        } catch (error: any) {
            logger.error(`[MCP Tool - ${toolName}] Error executing get_debug_state:`, error);
            return {
                status: Constants.IPC_STATUS_ERROR,
                message: `Failed to read debug state: ${error.message || error}`,
            };
        }
    }
};
