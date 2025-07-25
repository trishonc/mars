import { streamText, UIMessage, convertToModelMessages, UIMessageStreamWriter, stepCountIs, hasToolCall, smoothStream} from 'ai';
import { researchState } from '../research-state';
import { completeTaskTool, savePlanTool, readPlanTool } from '../tools';
import { runSubAgentTool } from '../sub-agent/agent';
import { LEAD_AGENT_PROMPT } from './prompt';
import { MODEL_CONFIG, AGENT_CONFIG } from '../config';

export async function runResearchAgent(messages: UIMessage[], writer: UIMessageStreamWriter, abortSignal?: AbortSignal) {
  const tools = {
    run_subagent: runSubAgentTool(writer),
    complete_task: completeTaskTool,
    save_plan: savePlanTool,
    read_plan: readPlanTool,
  };
  
  const leadAgentResult = await streamText({
    model: MODEL_CONFIG.LEAD_AGENT.model,
    system: LEAD_AGENT_PROMPT,
    messages: convertToModelMessages(messages),
    tools,
    abortSignal,
    temperature: MODEL_CONFIG.TEMPERATURE,
    maxOutputTokens: MODEL_CONFIG.MAX_OUTPUT_TOKENS,
    providerOptions: MODEL_CONFIG.LEAD_AGENT.providerOptions,
    experimental_transform: [
      smoothStream({ chunking: /.{1}/g }),
    ],
    stopWhen: [
      stepCountIs(AGENT_CONFIG.LEAD_AGENT_MAX_STEPS),
      hasToolCall('complete_task'),
    ],
    prepareStep: async ({ stepNumber }) => {
      if (stepNumber === 0) {
        return {
          toolChoice: { type: 'tool', toolName: 'save_plan' },
        };
      }
      if (stepNumber === AGENT_CONFIG.LEAD_AGENT_MAX_STEPS - 1) {
        return {
          toolChoice: { type: 'tool', toolName: 'complete_task' },
        };
      }
    },
    onChunk({ chunk }) {
      if (chunk.type === 'tool-input-start' && chunk.toolName === 'complete_task') {
        writer.write({
          type: 'data-report',
          data: {
            phase: 'synthesizing',
            report: '',
            sources: [],
          },
          id: 'data-report',
        });
      }
        
    },
  });

  writer.merge(leadAgentResult.toUIMessageStream({
    sendReasoning: true,
    sendStart: false,
    sendFinish: false,
  }));

  const leadToolCalls = await leadAgentResult.toolCalls;
  const finalReportOutput = leadToolCalls.find((call) => call.toolName === 'complete_task')?.input;
  
  if (!finalReportOutput?.report) {
      return;
  }

  // Save final report to research state
  researchState.report = finalReportOutput.report;  
} 